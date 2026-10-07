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

    const profileRes = await fetch(`${supabaseUrl}/rest/v1/users?id=eq.${authUser.id}&select=id,status`, {
      headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseServiceKey}` },
    });
    const profiles = await profileRes.json().catch(() => []);
    if (!profiles[0] || profiles[0].status !== "ACTIVE") {
      return NextResponse.json({ error: "Staff user is deactivated or suspended." }, { status: 403 });
    }

    const qtnRes = await fetch(`${supabaseUrl}/rest/v1/quotations?id=eq.${id}&select=*`, {
      headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseServiceKey}` },
    });
    const qtn = (await qtnRes.json())[0];
    if (!qtn) return NextResponse.json({ error: "Quotation not found." }, { status: 404 });

    if (qtn.status !== "DRAFT" && qtn.status !== "INTERNAL_REJECTED") {
      return NextResponse.json({ error: `Cannot submit quotation in status ${qtn.status}.` }, { status: 400 });
    }

    // Verify items exist
    const itemsRes = await fetch(`${supabaseUrl}/rest/v1/quotation_items?quotation_id=eq.${id}&select=id`, {
      headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseServiceKey}` },
    });
    const items = await itemsRes.json().catch(() => []);
    if (items.length === 0) {
      return NextResponse.json({ error: "Cannot submit an empty quotation. At least one line item is required." }, { status: 400 });
    }

    const updateRes = await fetch(`${supabaseUrl}/rest/v1/quotations?id=eq.${id}`, {
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

    const updatedQtn = (await updateRes.json())[0];

    // Audit Event
    try {
      await fetch(`${supabaseUrl}/rest/v1/rpc/log_audit_event`, {
        method: "POST",
        headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseServiceKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          p_action: "quotations.SUBMIT",
          p_entity_type: "quotation",
          p_entity_id: id,
          p_before_json: qtn,
          p_after_json: updatedQtn,
          p_reason: "Quotation submitted for internal manager approval",
          p_source_app: "admin.farmreem.com",
        }),
      });
    } catch (e) {}

    return NextResponse.json({ quotation: updatedQtn });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to submit quotation." }, { status: 500 });
  }
}
