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

    // Profile & Role resolution
    const profileRes = await fetch(`${supabaseUrl}/rest/v1/users?id=eq.${authUser.id}&select=id,status,staff_role,email`, {
      headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseServiceKey}` },
    });
    const profiles = await profileRes.json().catch(() => []);
    const userProfile = profiles[0];

    if (!userProfile || userProfile.status !== "ACTIVE") {
      return NextResponse.json({ error: "Staff user is deactivated or suspended." }, { status: 403 });
    }

    const email = (authUser.email || userProfile.email || "").toLowerCase();
    const assignedRole = userProfile.staff_role || (email === "ceo@farmreem.com" ? "SUPER_ADMIN" : "STAFF");

    // Check pricing.APPROVE permission
    if (assignedRole !== "SUPER_ADMIN") {
      let hasApprovePerm = false;
      try {
        const permRes = await fetch(`${supabaseUrl}/rest/v1/rpc/has_permission`, {
          method: "POST",
          headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseServiceKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({ p_user_id: authUser.id, p_module: "pricing", p_action: "APPROVE" }),
        });
        if (permRes.ok) hasApprovePerm = await permRes.json();
      } catch (e) {}

      if (!hasApprovePerm) {
        return NextResponse.json({ error: "Forbidden: Missing required permission 'pricing.APPROVE'." }, { status: 403 });
      }
    }

    // Fetch existing list
    const listRes = await fetch(`${supabaseUrl}/rest/v1/price_lists?id=eq.${id}&select=*`, {
      headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseServiceKey}` },
    });
    const existingList = (await listRes.json())[0];

    if (!existingList) return NextResponse.json({ error: "Price list not found." }, { status: 404 });

    if (existingList.status !== "PENDING_APPROVAL") {
      return NextResponse.json({ error: `Cannot approve price list in status ${existingList.status}. Only PENDING_APPROVAL lists can be approved.` }, { status: 400 });
    }

    // Maker-Checker Check
    const isSelfApproval = existingList.created_by === authUser.id;
    const overrideReason = body.override_reason ? String(body.override_reason).trim() : null;

    if (isSelfApproval) {
      if (assignedRole !== "SUPER_ADMIN") {
        return NextResponse.json({
          error: "Maker-Checker Violation: You cannot approve a price list you created. Approval must be performed by a different authorized staff member.",
        }, { status: 403 });
      }

      if (!overrideReason) {
        return NextResponse.json({
          error: "SUPER_ADMIN self-approval override requires an explicit business justification (override_reason).",
        }, { status: 400 });
      }

      // Log SUPER_ADMIN Self-Approval Override Audit Event
      try {
        await fetch(`${supabaseUrl}/rest/v1/rpc/log_audit_event`, {
          method: "POST",
          headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseServiceKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            p_action: "pricing.SELF_APPROVAL_OVERRIDE",
            p_entity_type: "price_list",
            p_entity_id: id,
            p_before_json: existingList,
            p_after_json: { ...existingList, override_reason: overrideReason },
            p_reason: `SUPER_ADMIN self-approval override: ${overrideReason}`,
            p_source_app: "admin.farmreem.com",
          }),
        });
      } catch (e) {}
    }

    // Update status to ACTIVE
    const nowIso = new Date().toISOString();
    const updateRes = await fetch(`${supabaseUrl}/rest/v1/price_lists?id=eq.${id}`, {
      method: "PATCH",
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseServiceKey}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        status: "ACTIVE",
        approved_by: authUser.id,
        approved_at: nowIso,
        updated_by: authUser.id,
        updated_at: nowIso,
      }),
    });

    const updatedList = (await updateRes.json())[0];

    // Log Approval Audit Event
    try {
      await fetch(`${supabaseUrl}/rest/v1/rpc/log_audit_event`, {
        method: "POST",
        headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseServiceKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          p_action: "pricing.APPROVE",
          p_entity_type: "price_list",
          p_entity_id: id,
          p_before_json: existingList,
          p_after_json: updatedList,
          p_reason: body.reason || `Price list approved (PENDING_APPROVAL -> ACTIVE)${isSelfApproval ? ' via SUPER_ADMIN override' : ''}`,
          p_source_app: "admin.farmreem.com",
        }),
      });
    } catch (e) {}

    return NextResponse.json({ price_list: updatedList });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to approve price list." }, { status: 500 });
  }
}
