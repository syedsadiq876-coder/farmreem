import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDatabaseConfig } from "@farmreem/database";

const ALLOWED_TYPES = ["BILLING", "DELIVERY", "BOTH"];

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
  requiredPermission?: "customers.VIEW" | "customers.CREATE" | "customers.EDIT"
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
  } catch (e) {
    // Ignore error
  }

  const email = (authUser.email || userProfile?.email || "").toLowerCase();
  const status = userProfile?.status || "ACTIVE";

  if (status !== "ACTIVE") {
    return { error: "Staff user account is deactivated or suspended.", status: 403 };
  }

  const assignedRole = userProfile?.staff_role || (email === "ceo@farmreem.com" ? "SUPER_ADMIN" : "STAFF");

  if (requiredPermission && assignedRole !== "SUPER_ADMIN") {
    let hasPerm = false;
    try {
      const [module, action] = requiredPermission.split(".");
      const permRes = await fetch(`${supabaseUrl}/rest/v1/rpc/has_permission`, {
        method: "POST",
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseServiceKey || supabaseAnonKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          p_user_id: authUser.id,
          p_module: module,
          p_action: action,
        }),
      });
      if (permRes.ok) {
        hasPerm = await permRes.json();
      }
    } catch (e) {
      // Fallback
    }

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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const auth = await getAuthenticatedUser(request, "customers.VIEW");
    if ("error" in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { supabaseUrl, supabaseAnonKey, supabaseServiceKey } = auth;

    const res = await fetch(
      `${supabaseUrl}/rest/v1/customer_addresses?customer_id=eq.${id}&order=is_primary_delivery.desc,created_at.desc`,
      {
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseServiceKey}`,
        },
      }
    );

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch addresses." }, { status: res.status });
    }

    const addresses = await res.json();
    return NextResponse.json({ addresses });
  } catch (error: any) {
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const auth = await getAuthenticatedUser(request, "customers.CREATE");
    if ("error" in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { supabaseUrl, supabaseAnonKey, supabaseServiceKey, authUser } = auth;
    const body = await request.json().catch(() => ({}));

    const address_type = body.address_type && ALLOWED_TYPES.includes(body.address_type) ? body.address_type : "DELIVERY";
    const label = body.label ? body.label.trim() : null;
    const address_line1 = (body.address_line1 || "").trim();
    const address_line2 = body.address_line2 ? body.address_line2.trim() : null;
    const city = (body.city || "").trim();
    const state = (body.state || "").trim();
    const postal_code = (body.postal_code || "").trim();
    const country = (body.country || "India").trim();
    const is_primary_billing = Boolean(body.is_primary_billing);
    const is_primary_delivery = Boolean(body.is_primary_delivery);
    const notes = body.notes ? body.notes.trim() : null;

    if (!address_line1) return NextResponse.json({ error: "Address Line 1 is required." }, { status: 400 });
    if (!city) return NextResponse.json({ error: "City is required." }, { status: 400 });
    if (!state) return NextResponse.json({ error: "State is required." }, { status: 400 });
    if (!postal_code) return NextResponse.json({ error: "Postal code is required." }, { status: 400 });

    // Address Type Consistency Validation
    if (address_type === "BILLING" && is_primary_delivery) {
      return NextResponse.json({ error: "A BILLING-only address cannot be marked as primary delivery address." }, { status: 400 });
    }
    if (address_type === "DELIVERY" && is_primary_billing) {
      return NextResponse.json({ error: "A DELIVERY-only address cannot be marked as primary billing address." }, { status: 400 });
    }

    const addressPayload = {
      customer_id: id,
      address_type,
      label,
      address_line1,
      address_line2,
      city,
      state,
      postal_code,
      country,
      is_primary_billing,
      is_primary_delivery,
      status: "ACTIVE",
      notes,
      created_by: authUser.id,
      updated_by: authUser.id,
    };

    const insertRes = await fetch(`${supabaseUrl}/rest/v1/customer_addresses`, {
      method: "POST",
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseServiceKey}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(addressPayload),
    });

    if (!insertRes.ok) {
      const errText = await insertRes.text();
      return NextResponse.json({ error: "Failed to create address.", details: errText }, { status: insertRes.status });
    }

    const insertedRows = await insertRes.json();
    const createdAddress = Array.isArray(insertedRows) ? insertedRows[0] : insertedRows;

    // Transactional Primary Unsetting
    if (is_primary_billing || is_primary_delivery) {
      await fetch(`${supabaseUrl}/rest/v1/rpc/set_primary_customer_address`, {
        method: "POST",
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseServiceKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          p_customer_id: id,
          p_address_id: createdAddress.id,
          p_is_billing: is_primary_billing,
          p_is_delivery: is_primary_delivery,
        }),
      });
    }

    // Append Audit Event
    try {
      await fetch(`${supabaseUrl}/rest/v1/rpc/log_audit_event`, {
        method: "POST",
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseServiceKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          p_action: "customer_addresses.CREATE",
          p_entity_type: "customer_address",
          p_entity_id: createdAddress.id,
          p_before_json: null,
          p_after_json: createdAddress,
          p_reason: body.reason || "New customer address added",
          p_source_app: "admin.farmreem.com",
        }),
      });
    } catch (e) {}

    return NextResponse.json({ address: createdAddress }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: "Internal server error creating address." }, { status: 500 });
  }
}
