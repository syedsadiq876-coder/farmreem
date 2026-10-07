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

    const currentRes = await fetch(`${supabaseUrl}/rest/v1/quotations?id=eq.${id}&select=*`, {
      headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseServiceKey}` },
    });
    const currentQtn = (await currentRes.json())[0];
    if (!currentQtn) return NextResponse.json({ error: "Quotation not found." }, { status: 404 });

    if (currentQtn.status !== "APPROVED" && currentQtn.status !== "SENT") {
      return NextResponse.json({ error: `Cannot revise quotation in status ${currentQtn.status}. Only APPROVED or SENT quotations can be revised.` }, { status: 400 });
    }

    const rootId = currentQtn.root_quotation_id || currentQtn.id;

    // Fetch highest revision number for this family
    const maxRevRes = await fetch(`${supabaseUrl}/rest/v1/quotations?root_quotation_id=eq.${rootId}&select=revision_number&order=revision_number.desc&limit=1`, {
      headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseServiceKey}` },
    });
    const maxRevs = await maxRevRes.json().catch(() => []);
    const nextRevNumber = (maxRevs[0]?.revision_number || currentQtn.revision_number) + 1;

    // Update current quote to SUPERSEDED
    await fetch(`${supabaseUrl}/rest/v1/quotations?id=eq.${id}`, {
      method: "PATCH",
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseServiceKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: "SUPERSEDED",
        updated_by: authUser.id,
        updated_at: new Date().toISOString(),
      }),
    });

    // Create Revision N+1 payload
    const revPayload = {
      quotation_number: currentQtn.quotation_number,
      revision_number: nextRevNumber,
      root_quotation_id: rootId,
      parent_quotation_id: currentQtn.id,
      customer_id: currentQtn.customer_id,
      customer_legal_name_snapshot: currentQtn.customer_legal_name_snapshot,
      customer_code_snapshot: currentQtn.customer_code_snapshot,
      customer_gstin_snapshot: currentQtn.customer_gstin_snapshot,
      contact_id: currentQtn.contact_id,
      contact_name_snapshot: currentQtn.contact_name_snapshot,
      contact_phone_snapshot: currentQtn.contact_phone_snapshot,
      contact_email_snapshot: currentQtn.contact_email_snapshot,
      billing_address_id: currentQtn.billing_address_id,
      billing_address_snapshot: currentQtn.billing_address_snapshot,
      delivery_address_id: currentQtn.delivery_address_id,
      delivery_address_snapshot: currentQtn.delivery_address_snapshot,
      place_of_supply_state_name_snapshot: currentQtn.place_of_supply_state_name_snapshot,
      place_of_supply_state_code_snapshot: currentQtn.place_of_supply_state_code_snapshot,
      status: "DRAFT",
      tax_type: currentQtn.tax_type,
      is_interstate_supply: currentQtn.is_interstate_supply,
      currency: "INR",
      subtotal: currentQtn.subtotal,
      tax_total: currentQtn.tax_total,
      cgst_total: currentQtn.cgst_total,
      sgst_total: currentQtn.sgst_total,
      igst_total: currentQtn.igst_total,
      grand_total: currentQtn.grand_total,
      payment_terms: currentQtn.payment_terms,
      delivery_terms: currentQtn.delivery_terms,
      notes: currentQtn.notes,
      created_by: authUser.id,
      updated_by: authUser.id,
    };

    const newRevRes = await fetch(`${supabaseUrl}/rest/v1/quotations`, {
      method: "POST",
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseServiceKey}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(revPayload),
    });

    const newRev = (await newRevRes.json())[0];

    // Copy line items to new revision
    const oldItemsRes = await fetch(`${supabaseUrl}/rest/v1/quotation_items?quotation_id=eq.${id}&select=*`, {
      headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseServiceKey}` },
    });
    const oldItems = await oldItemsRes.json().catch(() => []);

    for (const item of oldItems) {
      delete item.id;
      delete item.created_at;
      delete item.updated_at;
      item.quotation_id = newRev.id;
      await fetch(`${supabaseUrl}/rest/v1/quotation_items`, {
        method: "POST",
        headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseServiceKey}`, "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
    }

    // Audit Event
    try {
      await fetch(`${supabaseUrl}/rest/v1/rpc/log_audit_event`, {
        method: "POST",
        headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseServiceKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          p_action: "quotations.REVISE",
          p_entity_type: "quotation",
          p_entity_id: newRev.id,
          p_before_json: currentQtn,
          p_after_json: newRev,
          p_reason: `Created Revision ${nextRevNumber} from ${currentQtn.quotation_number} (Prior Rev ${currentQtn.revision_number} SUPERSEDED)`,
          p_source_app: "admin.farmreem.com",
        }),
      });
    } catch (e) {}

    return NextResponse.json({ quotation: newRev }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to revise quotation." }, { status: 500 });
  }
}
