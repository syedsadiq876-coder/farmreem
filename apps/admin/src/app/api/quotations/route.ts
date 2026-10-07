import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDatabaseConfig } from "@farmreem/database";

interface AuthContext {
  token: string;
  authUser: any;
  userProfile: any;
  assignedRole: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  supabaseServiceKey: string;
}

async function getAuthenticatedUser(
  request: Request,
  requiredPermission?: "quotations.VIEW" | "quotations.CREATE" | "quotations.EDIT" | "quotations.APPROVE"
): Promise<{ error: string; status: number } | AuthContext> {
  const cookieStore = await cookies();
  const sessionToken =
    cookieStore.get("__Host-farmreem-admin-session")?.value ||
    cookieStore.get("farmreem_admin_dev_session")?.value;

  const authHeader = request.headers.get("authorization") || "";
  const bearerToken = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null;

  const token = sessionToken || bearerToken;

  if (!token) {
    return { error: "Unauthenticated staff request.", status: 401 };
  }

  const { supabaseUrl, supabaseAnonKey, supabaseServiceKey } = getDatabaseConfig();

  if (!supabaseUrl || supabaseUrl.includes("placeholder") || !supabaseAnonKey || supabaseAnonKey.includes("placeholder")) {
    return { error: "Authentication service unavailable.", status: 503 };
  }

  const authRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${token}`,
    },
  });

  const authUser = await authRes.json().catch(() => null);

  if (!authRes.ok || !authUser || !authUser.id) {
    return { error: "Invalid or expired staff session.", status: 401 };
  }

  let userProfile: any = null;
  try {
    const profileRes = await fetch(
      `${supabaseUrl}/rest/v1/users?id=eq.${authUser.id}&select=id,email,full_name,staff_role,status`,
      {
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseServiceKey || supabaseAnonKey}`,
        },
      }
    );
    if (profileRes.ok) {
      const profiles = await profileRes.json();
      userProfile = profiles[0] || null;
    }
  } catch (e) {}

  const status = userProfile?.status || "ACTIVE";

  if (status !== "ACTIVE") {
    return { error: "Staff user account is deactivated or suspended.", status: 403 };
  }

  const assignedRole = userProfile?.staff_role || (authUser.email === "ceo@farmreem.com" ? "SUPER_ADMIN" : "STAFF");

  if (requiredPermission && assignedRole !== "SUPER_ADMIN") {
    let hasPerm = false;
    try {
      const permRes = await fetch(`${supabaseUrl}/rest/v1/rpc/has_permission`, {
        method: "POST",
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseServiceKey || supabaseAnonKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          p_user_id: authUser.id,
          p_module: "quotations",
          p_action: requiredPermission.split(".")[1] || "",
        }),
      });
      if (permRes.ok) {
        hasPerm = await permRes.json();
      }
    } catch (e) {}

    if (!hasPerm) {
      return { error: `Forbidden: Missing required permission '${requiredPermission}'.`, status: 403 };
    }
  }

  return {
    token,
    authUser,
    userProfile,
    assignedRole,
    supabaseUrl,
    supabaseAnonKey,
    supabaseServiceKey: supabaseServiceKey || supabaseAnonKey,
  };
}

export async function GET(request: Request) {
  try {
    const auth = await getAuthenticatedUser(request, "quotations.VIEW");
    if ("error" in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { supabaseUrl, supabaseAnonKey, supabaseServiceKey } = auth;
    const { searchParams } = new URL(request.url);

    const customerId = searchParams.get("customer_id");
    const status = searchParams.get("status");

    let query = `${supabaseUrl}/rest/v1/quotations?select=*,customer:customers(id,legal_name,customer_code),contact:customer_contacts(id,full_name,email,phone),creator:users!created_by(id,full_name,email),approver:users!approved_by(id,full_name,email)&order=created_at.desc`;

    if (customerId) query += `&customer_id=eq.${customerId}`;
    if (status) query += `&status=eq.${status}`;

    const res = await fetch(query, {
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseServiceKey}`,
      },
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json({ error: "Failed to fetch quotations.", details: errText }, { status: res.status });
    }

    const quotations = await res.json();
    return NextResponse.json({ quotations });
  } catch (error: any) {
    return NextResponse.json({ error: "Internal server error fetching quotations." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const auth = await getAuthenticatedUser(request, "quotations.CREATE");
    if ("error" in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { supabaseUrl, supabaseAnonKey, supabaseServiceKey, authUser } = auth;
    const body = await request.json().catch(() => ({}));

    const { customer_id, contact_id, billing_address_id, delivery_address_id, place_of_supply_state_name, place_of_supply_state_code, payment_terms, delivery_terms, notes, valid_until } = body;

    if (!customer_id) {
      return NextResponse.json({ error: "customer_id is required." }, { status: 400 });
    }

    if (!place_of_supply_state_code || String(place_of_supply_state_code).trim().length !== 2) {
      return NextResponse.json({ error: "Valid 2-digit place_of_supply_state_code is required." }, { status: 400 });
    }

    // Fetch customer details for snapshot
    const custRes = await fetch(`${supabaseUrl}/rest/v1/customers?id=eq.${customer_id}&select=*`, {
      headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseServiceKey}` },
    });
    const custs = await custRes.json().catch(() => []);
    const customer = custs[0];

    if (!customer || customer.status !== "ACTIVE") {
      return NextResponse.json({ error: "Customer not found or not active." }, { status: 400 });
    }

    // Fetch contact snapshot if provided
    let contactName = null, contactPhone = null, contactEmail = null;
    if (contact_id) {
      const contactRes = await fetch(`${supabaseUrl}/rest/v1/customer_contacts?id=eq.${contact_id}&select=*`, {
        headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseServiceKey}` },
      });
      const contacts = await contactRes.json().catch(() => []);
      if (contacts[0]) {
        contactName = contacts[0].full_name;
        contactPhone = contacts[0].phone;
        contactEmail = contacts[0].email;
      }
    }

    // Fetch billing address snapshot if provided
    let billingSnapshot = null;
    if (billing_address_id) {
      const bRes = await fetch(`${supabaseUrl}/rest/v1/customer_addresses?id=eq.${billing_address_id}&select=*`, {
        headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseServiceKey}` },
      });
      const bRows = await bRes.json().catch(() => []);
      if (bRows[0]) billingSnapshot = bRows[0];
    }

    // Fetch delivery address snapshot if provided
    let deliverySnapshot = null;
    if (delivery_address_id) {
      const dRes = await fetch(`${supabaseUrl}/rest/v1/customer_addresses?id=eq.${delivery_address_id}&select=*`, {
        headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseServiceKey}` },
      });
      const dRows = await dRes.json().catch(() => []);
      if (dRows[0]) deliverySnapshot = dRows[0];
    }

    const posCode = String(place_of_supply_state_code).trim();
    const posName = String(place_of_supply_state_name || "Delivery State").trim();

    const insertPayload = {
      revision_number: 1,
      customer_id: customer.id,
      customer_legal_name_snapshot: customer.legal_name,
      customer_code_snapshot: customer.customer_code,
      customer_gstin_snapshot: customer.gstin || null,
      contact_id: contact_id || null,
      contact_name_snapshot: contactName,
      contact_phone_snapshot: contactPhone,
      contact_email_snapshot: contactEmail,
      billing_address_id: billing_address_id || null,
      billing_address_snapshot: billingSnapshot,
      delivery_address_id: delivery_address_id || null,
      delivery_address_snapshot: deliverySnapshot,
      place_of_supply_state_name_snapshot: posName,
      place_of_supply_state_code_snapshot: posCode,
      status: "DRAFT",
      tax_type: "INTRA_STATE",
      is_interstate_supply: false,
      valid_until: valid_until || null,
      currency: "INR",
      subtotal: 0.0000,
      tax_total: 0.0000,
      cgst_total: 0.0000,
      sgst_total: 0.0000,
      igst_total: 0.0000,
      grand_total: 0.0000,
      payment_terms: payment_terms ? String(payment_terms).trim() : null,
      delivery_terms: delivery_terms ? String(delivery_terms).trim() : null,
      notes: notes ? String(notes).trim() : null,
      created_by: authUser.id,
      updated_by: authUser.id,
    };

    const insertRes = await fetch(`${supabaseUrl}/rest/v1/quotations`, {
      method: "POST",
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseServiceKey}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(insertPayload),
    });

    if (!insertRes.ok) {
      const errText = await insertRes.text();
      return NextResponse.json({ error: "Failed to create draft quotation.", details: errText }, { status: insertRes.status });
    }

    const createdQuotation = (await insertRes.json())[0];

    // Audit Event
    try {
      await fetch(`${supabaseUrl}/rest/v1/rpc/log_audit_event`, {
        method: "POST",
        headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseServiceKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          p_action: "quotations.CREATE",
          p_entity_type: "quotation",
          p_entity_id: createdQuotation.id,
          p_before_json: null,
          p_after_json: createdQuotation,
          p_reason: `Drafted quotation Rev 1: ${createdQuotation.quotation_number}`,
          p_source_app: "admin.farmreem.com",
        }),
      });
    } catch (e) {}

    return NextResponse.json({ quotation: createdQuotation }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: "Internal server error creating quotation." }, { status: 500 });
  }
}
