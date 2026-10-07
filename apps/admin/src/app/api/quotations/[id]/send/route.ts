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

    if (qtn.status !== "APPROVED") {
      return NextResponse.json({ error: `Cannot issue/send quotation in status ${qtn.status}. Only APPROVED quotations can be issued & sent to client.` }, { status: 400 });
    }

    // 1. FAIL-CLOSED SELLER TAX PROFILE CHECK
    const sellerRes = await fetch(
      `${supabaseUrl}/rest/v1/seller_tax_profiles?is_primary_seller=eq.true&is_active=eq.true&verification_status=eq.VERIFIED&select=*`,
      { headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseServiceKey}` } }
    );
    const sellerProfiles = await sellerRes.json().catch(() => []);
    const primarySeller = sellerProfiles[0];

    if (!primarySeller || !primarySeller.legal_entity_name || !primarySeller.gstin || !primarySeller.gst_state_code) {
      return NextResponse.json({
        error: "SELLER_TAX_PROFILE_NOT_CONFIGURED",
        message: "Formal quotation issuance failed closed: No verified active primary seller tax profile exists in FarmReem settings. Formal commercial documents cannot be issued without verified statutory identity.",
      }, { status: 422 });
    }

    // 2. Validity Check
    const validUntilDate = qtn.valid_until ? new Date(qtn.valid_until) : null;
    const now = new Date();

    if (!validUntilDate || validUntilDate <= now) {
      return NextResponse.json({
        error: "Quotation validity date (valid_until) must be set in the future before formal issuance.",
      }, { status: 400 });
    }

    // 3. Tax Classification Check using 2-digit GST state codes
    const sellerStateCode = String(primarySeller.gst_state_code).trim();
    const deliveryStateCode = String(qtn.place_of_supply_state_code_snapshot).trim();
    const isInterstate = sellerStateCode !== deliveryStateCode;
    const taxType = isInterstate ? "INTER_STATE" : "INTRA_STATE";

    const sellerRegAddress = {
      address_line1: primarySeller.registered_address_line1,
      address_line2: primarySeller.registered_address_line2,
      city: primarySeller.city,
      state_name: primarySeller.state_name,
      gst_state_code: primarySeller.gst_state_code,
      postal_code: primarySeller.postal_code,
      country: primarySeller.country || "India",
    };

    const nowIso = now.toISOString();

    const updateRes = await fetch(`${supabaseUrl}/rest/v1/quotations?id=eq.${id}`, {
      method: "PATCH",
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseServiceKey}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        status: "SENT",
        seller_tax_profile_id: primarySeller.id,
        seller_legal_name_snapshot: primarySeller.legal_entity_name,
        seller_gstin_snapshot: primarySeller.gstin,
        seller_registered_address_snapshot: sellerRegAddress,
        seller_state_name_snapshot: primarySeller.state_name,
        seller_state_code_snapshot: primarySeller.gst_state_code,
        is_interstate_supply: isInterstate,
        tax_type: taxType,
        issued_at: nowIso,
        sent_at: nowIso,
        updated_by: authUser.id,
        updated_at: nowIso,
      }),
    });

    const updatedQtn = (await updateRes.json())[0];

    // Audit Event
    try {
      await fetch(`${supabaseUrl}/rest/v1/rpc/log_audit_event`, {
        method: "POST",
        headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseServiceKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          p_action: "quotations.SEND",
          p_entity_type: "quotation",
          p_entity_id: id,
          p_before_json: qtn,
          p_after_json: updatedQtn,
          p_reason: body.reason || `Quotation formally issued and sent to client (${primarySeller.legal_entity_name} GSTIN: ${primarySeller.gstin})`,
          p_source_app: "admin.farmreem.com",
        }),
      });
    } catch (e) {}

    return NextResponse.json({ quotation: updatedQtn });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to send/issue quotation." }, { status: 500 });
  }
}
