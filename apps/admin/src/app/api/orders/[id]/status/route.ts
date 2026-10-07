import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDatabaseConfig } from "@farmreem/database";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const { target_status, reason } = body;

    if (!target_status) {
      return NextResponse.json({ error: "target_status is required." }, { status: 400 });
    }

    const cookieStore = await cookies();
    const sessionToken =
      cookieStore.get("__Host-farmreem-admin-session")?.value ||
      cookieStore.get("farmreem_admin_dev_session")?.value;

    const authHeader = request.headers.get("authorization") || "";
    const bearerToken = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null;
    const token = sessionToken || bearerToken;

    if (!token) return NextResponse.json({ error: "Unauthenticated staff request." }, { status: 401 });

    const { supabaseUrl, supabaseAnonKey, supabaseServiceKey } = getDatabaseConfig();

    const authRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${token}` },
    });
    const authUser = await authRes.json().catch(() => null);
    if (!authRes.ok || !authUser?.id) return NextResponse.json({ error: "Invalid staff session." }, { status: 401 });

    // Check staff permissions
    const permRes = await fetch(`${supabaseUrl}/rest/v1/rpc/has_permission`, {
      method: "POST",
      headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseServiceKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ p_user_id: authUser.id, p_module: "orders", p_action: "EDIT" }),
    });
    const hasPerm = permRes.ok ? await permRes.json() : false;
    if (!hasPerm) return NextResponse.json({ error: "Forbidden: Missing permission orders.EDIT." }, { status: 403 });

    // Fetch existing order
    const orderRes = await fetch(`${supabaseUrl}/rest/v1/orders?id=eq.${id}&select=*`, {
      headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseServiceKey}` },
    });
    const order = (await orderRes.json())[0];
    if (!order) return NextResponse.json({ error: "Sales order not found." }, { status: 404 });

    // V1 Controlled State Machine Check
    if (order.status === "CONFIRMED" && target_status !== "PROCUREMENT_PENDING") {
      return NextResponse.json({ error: `Invalid transition: Order in state CONFIRMED can only transition to PROCUREMENT_PENDING or CANCELLED.` }, { status: 400 });
    }

    const nowIso = new Date().toISOString();
    const reasonText = reason ? String(reason).trim() : `Status transitioned to ${target_status}`;

    // 1. Update Order Status
    const updateRes = await fetch(`${supabaseUrl}/rest/v1/orders?id=eq.${id}`, {
      method: "PATCH",
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseServiceKey}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        status: target_status,
        updated_by: authUser.id,
        updated_at: nowIso,
      }),
    });

    if (!updateRes.ok) return NextResponse.json({ error: "Failed to update order status." }, { status: updateRes.status });

    const updatedOrder = (await updateRes.json())[0];

    // 2. Write Order Status History
    await fetch(`${supabaseUrl}/rest/v1/order_status_history`, {
      method: "POST",
      headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseServiceKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        order_id: id,
        from_status: order.status,
        to_status: target_status,
        changed_by: authUser.id,
        change_reason: reasonText,
      }),
    });

    // 3. Write Canonical Platform Audit Event
    try {
      await fetch(`${supabaseUrl}/rest/v1/rpc/log_audit_event`, {
        method: "POST",
        headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseServiceKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          p_action: "orders.STATUS_CHANGE",
          p_entity_type: "order",
          p_entity_id: id,
          p_before_json: order,
          p_after_json: updatedOrder,
          p_reason: `Sales Order ${order.order_number} status changed from ${order.status} to ${target_status}`,
          p_source_app: "admin.farmreem.com",
        }),
      });
    } catch (e) {}

    return NextResponse.json({ order: updatedOrder });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to update sales order status." }, { status: 500 });
  }
}
