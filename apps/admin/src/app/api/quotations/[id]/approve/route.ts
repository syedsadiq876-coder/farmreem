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

    if (assignedRole !== "SUPER_ADMIN") {
      let hasPerm = false;
      try {
        const permRes = await fetch(`${supabaseUrl}/rest/v1/rpc/has_permission`, {
          method: "POST",
          headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseServiceKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({ p_user_id: authUser.id, p_module: "quotations", p_action: "APPROVE" }),
        });
        if (permRes.ok) hasPerm = await permRes.json();
      } catch (e) {}

      if (!hasPerm) {
        return NextResponse.json({ error: "Forbidden: Missing required permission 'quotations.APPROVE'." }, { status: 403 });
      }
    }

    const qtnRes = await fetch(`${supabaseUrl}/rest/v1/quotations?id=eq.${id}&select=*`, {
      headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseServiceKey}` },
    });
    const qtn = (await qtnRes.json())[0];
    if (!qtn) return NextResponse.json({ error: "Quotation not found." }, { status: 404 });

    if (qtn.status !== "PENDING_APPROVAL") {
      return NextResponse.json({ error: `Cannot approve quotation in status ${qtn.status}. Only PENDING_APPROVAL quotations can be approved.` }, { status: 400 });
    }

    const isSelfApproval = qtn.created_by === authUser.id;
    const overrideReason = body.override_reason ? String(body.override_reason).trim() : null;

    if (isSelfApproval) {
      if (assignedRole !== "SUPER_ADMIN") {
        return NextResponse.json({
          error: "Maker-Checker Violation: You cannot approve a quotation you created. Approval must be performed by a different authorized manager.",
        }, { status: 403 });
      }

      if (!overrideReason) {
        return NextResponse.json({
          error: "SUPER_ADMIN self-approval override requires an explicit business justification (override_reason).",
        }, { status: 400 });
      }

      try {
        await fetch(`${supabaseUrl}/rest/v1/rpc/log_audit_event`, {
          method: "POST",
          headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseServiceKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            p_action: "quotations.SELF_APPROVAL_OVERRIDE",
            p_entity_type: "quotation",
            p_entity_id: id,
            p_before_json: qtn,
            p_after_json: { ...qtn, override_reason: overrideReason },
            p_reason: `SUPER_ADMIN quotation self-approval override: ${overrideReason}`,
            p_source_app: "admin.farmreem.com",
          }),
        });
      } catch (e) {}
    }

    const nowIso = new Date().toISOString();
    const updateRes = await fetch(`${supabaseUrl}/rest/v1/quotations?id=eq.${id}`, {
      method: "PATCH",
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseServiceKey}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        status: "APPROVED",
        approved_by: authUser.id,
        approved_at: nowIso,
        updated_by: authUser.id,
        updated_at: nowIso,
      }),
    });

    const updatedQtn = (await updateRes.json())[0];

    try {
      await fetch(`${supabaseUrl}/rest/v1/rpc/log_audit_event`, {
        method: "POST",
        headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseServiceKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          p_action: "quotations.APPROVE",
          p_entity_type: "quotation",
          p_entity_id: id,
          p_before_json: qtn,
          p_after_json: updatedQtn,
          p_reason: body.reason || `Quotation approved internally (PENDING_APPROVAL -> APPROVED)${isSelfApproval ? ' via SUPER_ADMIN override' : ''}`,
          p_source_app: "admin.farmreem.com",
        }),
      });
    } catch (e) {}

    return NextResponse.json({ quotation: updatedQtn });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to approve quotation." }, { status: 500 });
  }
}
