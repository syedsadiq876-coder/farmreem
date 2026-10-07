import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDatabaseConfig } from "@farmreem/database";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    // Profile status check
    const profileRes = await fetch(`${supabaseUrl}/rest/v1/users?id=eq.${authUser.id}&select=id,status,staff_role`, {
      headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseServiceKey}` },
    });
    const profiles = await profileRes.json().catch(() => []);
    if (!profiles[0] || profiles[0].status !== "ACTIVE") {
      return NextResponse.json({ error: "Staff user is deactivated or suspended." }, { status: 403 });
    }

    // Existing list check
    const listRes = await fetch(`${supabaseUrl}/rest/v1/price_lists?id=eq.${id}&select=*`, {
      headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseServiceKey}` },
    });
    const lists = await listRes.json().catch(() => []);
    const existingList = lists[0];

    if (!existingList) return NextResponse.json({ error: "Price list not found." }, { status: 404 });

    if (existingList.status !== "DRAFT" && existingList.status !== "REJECTED") {
      return NextResponse.json({ error: `Cannot submit price list in status ${existingList.status}.` }, { status: 400 });
    }

    // Check item count
    const itemsRes = await fetch(`${supabaseUrl}/rest/v1/price_list_items?price_list_id=eq.${id}&select=id`, {
      headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseServiceKey}` },
    });
    const items = await itemsRes.json().catch(() => []);
    if (items.length === 0) {
      return NextResponse.json({ error: "Cannot submit an empty price list. At least one line item is required." }, { status: 400 });
    }

    // Update status to PENDING_APPROVAL
    const updateRes = await fetch(`${supabaseUrl}/rest/v1/price_lists?id=eq.${id}`, {
      method: "PATCH",
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseServiceKey}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        status: "PENDING_APPROVAL",
        updated_by: authUser.id,
        updated_at: new Date().toISOString(),
      }),
    });

    const updatedList = (await updateRes.json())[0];

    // Audit Event
    try {
      await fetch(`${supabaseUrl}/rest/v1/rpc/log_audit_event`, {
        method: "POST",
        headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseServiceKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          p_action: "pricing.STATUS_CHANGE",
          p_entity_type: "price_list",
          p_entity_id: id,
          p_before_json: existingList,
          p_after_json: updatedList,
          p_reason: "Price list submitted for approval (DRAFT -> PENDING_APPROVAL)",
          p_source_app: "admin.farmreem.com",
        }),
      });
    } catch (e) {}

    return NextResponse.json({ price_list: updatedList });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to submit price list." }, { status: 500 });
  }
}
