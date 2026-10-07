import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDatabaseConfig } from "@farmreem/database";

export async function PATCH(
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

    const profileRes = await fetch(`${supabaseUrl}/rest/v1/users?id=eq.${authUser.id}&select=id,status,staff_role`, {
      headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseServiceKey}` },
    });
    const profiles = await profileRes.json().catch(() => []);
    if (!profiles[0] || profiles[0].status !== "ACTIVE") {
      return NextResponse.json({ error: "Staff user is deactivated or suspended." }, { status: 403 });
    }

    // Fetch existing profile
    const existingRes = await fetch(`${supabaseUrl}/rest/v1/seller_tax_profiles?id=eq.${id}&select=*`, {
      headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseServiceKey}` },
    });
    const existingProfiles = await existingRes.json().catch(() => []);
    const existing = existingProfiles[0];
    if (!existing) return NextResponse.json({ error: "Seller tax profile not found." }, { status: 404 });

    const body = await request.json().catch(() => ({}));
    const updatePayload: Record<string, any> = {
      updated_by: authUser.id,
      updated_at: new Date().toISOString(),
    };

    let actionCode = "seller_tax.EDIT";

    if (body.verification_status !== undefined) {
      if (!["DRAFT", "VERIFIED", "SUSPENDED", "INACTIVE"].includes(body.verification_status)) {
        return NextResponse.json({ error: "Invalid verification status." }, { status: 400 });
      }
      updatePayload.verification_status = body.verification_status;
      if (body.verification_status === "VERIFIED") {
        updatePayload.verified_by = authUser.id;
        updatePayload.verified_at = new Date().toISOString();
        actionCode = "seller_tax.VERIFY";
      } else if (body.verification_status === "SUSPENDED") {
        actionCode = "seller_tax.SUSPEND";
      }
    }

    if (body.is_active !== undefined) {
      updatePayload.is_active = Boolean(body.is_active);
      actionCode = body.is_active ? "seller_tax.ACTIVATE" : "seller_tax.DEACTIVATE";
    }

    if (body.is_primary_seller !== undefined && body.is_primary_seller !== existing.is_primary_seller) {
      updatePayload.is_primary_seller = Boolean(body.is_primary_seller);
      actionCode = "seller_tax.PRIMARY_CHANGE";

      if (body.is_primary_seller) {
        // Unset previous primary for this organization
        await fetch(`${supabaseUrl}/rest/v1/seller_tax_profiles?organization_id=eq.${existing.organization_id}&is_primary_seller=eq.true`, {
          method: "PATCH",
          headers: {
            apikey: supabaseAnonKey,
            Authorization: `Bearer ${supabaseServiceKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ is_primary_seller: false }),
        });
      }
    }

    if (body.legal_entity_name !== undefined) updatePayload.legal_entity_name = String(body.legal_entity_name).trim();
    if (body.trade_name !== undefined) updatePayload.trade_name = body.trade_name ? String(body.trade_name).trim() : null;
    if (body.registered_address_line1 !== undefined) updatePayload.registered_address_line1 = String(body.registered_address_line1).trim();
    if (body.registered_address_line2 !== undefined) updatePayload.registered_address_line2 = body.registered_address_line2 ? String(body.registered_address_line2).trim() : null;
    if (body.city !== undefined) updatePayload.city = String(body.city).trim();
    if (body.state_name !== undefined) updatePayload.state_name = String(body.state_name).trim();
    if (body.postal_code !== undefined) updatePayload.postal_code = String(body.postal_code).trim();

    const updateRes = await fetch(`${supabaseUrl}/rest/v1/seller_tax_profiles?id=eq.${id}`, {
      method: "PATCH",
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseServiceKey}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(updatePayload),
    });

    if (!updateRes.ok) {
      const errText = await updateRes.text();
      return NextResponse.json({ error: "Failed to update seller tax profile.", details: errText }, { status: updateRes.status });
    }

    const updatedProfile = (await updateRes.json())[0];

    // Audit Event
    try {
      await fetch(`${supabaseUrl}/rest/v1/rpc/log_audit_event`, {
        method: "POST",
        headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseServiceKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          p_action: actionCode,
          p_entity_type: "seller_tax_profile",
          p_entity_id: id,
          p_before_json: existing,
          p_after_json: updatedProfile,
          p_reason: body.reason || `Updated seller tax profile (${actionCode})`,
          p_source_app: "admin.farmreem.com",
        }),
      });
    } catch (e) {}

    return NextResponse.json({ seller_tax_profile: updatedProfile });
  } catch (error: any) {
    return NextResponse.json({ error: "Internal server error updating seller tax profile." }, { status: 500 });
  }
}
