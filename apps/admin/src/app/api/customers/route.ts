import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDatabaseConfig } from "@farmreem/database";

const ALLOWED_TYPES = ["HOTEL", "RESTAURANT", "CATERER", "INSTITUTION", "RETAILER", "DISTRIBUTOR", "OTHER"];
const ALLOWED_STATUSES = ["LEAD", "PENDING_VERIFICATION", "ACTIVE", "ON_HOLD", "INACTIVE"];
const ALLOWED_COMMERCIAL_STATUSES = ["UNAPPROVED", "APPROVED", "SUSPENDED", "CREDIT_HOLD"];

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

export async function GET(request: Request) {
  try {
    const auth = await getAuthenticatedUser(request, "customers.VIEW");
    if ("error" in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { supabaseUrl, supabaseAnonKey, token, supabaseServiceKey } = auth;
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search")?.trim() || "";
    const customer_type = searchParams.get("customer_type")?.trim() || searchParams.get("type")?.trim() || "";
    const status = searchParams.get("status")?.trim() || "";
    const commercial_status = searchParams.get("commercial_status")?.trim() || "";

    const headers: Record<string, string> = {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${token}`,
    };

    let queryParams = "select=*,assigned_account_owner:users!assigned_account_owner_id(id,full_name,email)&order=created_at.desc";

    if (customer_type && ALLOWED_TYPES.includes(customer_type)) {
      queryParams += `&customer_type=eq.${customer_type}`;
    }

    if (status && ALLOWED_STATUSES.includes(status)) {
      queryParams += `&status=eq.${status}`;
    }

    if (commercial_status && ALLOWED_COMMERCIAL_STATUSES.includes(commercial_status)) {
      queryParams += `&commercial_status=eq.${commercial_status}`;
    }

    if (search) {
      const sanitized = encodeURIComponent(`*${search}*`);
      queryParams += `&or=(customer_code.ilike.${sanitized},legal_name.ilike.${sanitized},trade_name.ilike.${sanitized},gstin.ilike.${sanitized},pan.ilike.${sanitized})`;
    }

    const res = await fetch(`${supabaseUrl}/rest/v1/customers?${queryParams}`, {
      headers,
    });

    if (!res.ok) {
      const serviceHeaders: Record<string, string> = {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseServiceKey}`,
      };
      const serviceRes = await fetch(`${supabaseUrl}/rest/v1/customers?${queryParams}`, {
        headers: serviceHeaders,
      });
      if (!serviceRes.ok) {
        const errText = await serviceRes.text();
        return NextResponse.json(
          { error: "Failed to fetch customers directory.", details: errText },
          { status: serviceRes.status }
        );
      }
      const customers = await serviceRes.json();
      return NextResponse.json({ customers });
    }

    const customers = await res.json();
    return NextResponse.json({ customers });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal server error fetching customers." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const auth = await getAuthenticatedUser(request, "customers.CREATE");
    if ("error" in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { supabaseUrl, supabaseAnonKey, supabaseServiceKey, authUser, token } = auth;
    const body = await request.json().catch(() => ({}));

    const legal_name = (body.legal_name || "").trim();
    const trade_name = body.trade_name ? body.trade_name.trim() : null;
    const customer_type = (body.customer_type || "").trim();
    const gstin = body.gstin ? body.gstin.trim().toUpperCase() : null;
    const pan = body.pan ? body.pan.trim().toUpperCase() : null;
    const status = body.status && ALLOWED_STATUSES.includes(body.status) ? body.status : "LEAD";
    const commercial_status = body.commercial_status && ALLOWED_COMMERCIAL_STATUSES.includes(body.commercial_status) ? body.commercial_status : "UNAPPROVED";
    const assigned_account_owner_id = body.assigned_account_owner_id || null;
    const notes = body.notes ? body.notes.trim() : null;

    if (!legal_name) {
      return NextResponse.json({ error: "Customer legal business name is required." }, { status: 400 });
    }
    if (!customer_type || !ALLOWED_TYPES.includes(customer_type)) {
      return NextResponse.json(
        { error: `Invalid customer type. Must be one of: ${ALLOWED_TYPES.join(", ")}` },
        { status: 400 }
      );
    }

    if (gstin && gstin.length !== 15) {
      return NextResponse.json({ error: "GSTIN must be exactly 15 characters." }, { status: 400 });
    }
    if (pan && pan.length !== 10) {
      return NextResponse.json({ error: "PAN must be exactly 10 characters." }, { status: 400 });
    }

    // Verify assigned_account_owner_id is an ACTIVE staff user
    if (assigned_account_owner_id) {
      const ownerRes = await fetch(`${supabaseUrl}/rest/v1/users?id=eq.${assigned_account_owner_id}&select=id,status`, {
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseServiceKey}`,
        },
      });
      const ownerRows = await ownerRes.json().catch(() => []);
      if (!ownerRows[0] || ownerRows[0].status !== "ACTIVE") {
        return NextResponse.json({ error: "Assigned account owner must be an active staff member." }, { status: 400 });
      }
    }

    // Server-derived created_by & updated_by
    const customerPayload: Record<string, any> = {
      legal_name,
      trade_name,
      customer_type,
      gstin,
      pan,
      status,
      commercial_status,
      assigned_account_owner_id,
      notes,
      created_by: authUser.id,
      updated_by: authUser.id,
    };

    const insertHeaders: Record<string, string> = {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseServiceKey}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    };

    const insertRes = await fetch(`${supabaseUrl}/rest/v1/customers`, {
      method: "POST",
      headers: insertHeaders,
      body: JSON.stringify(customerPayload),
    });

    if (!insertRes.ok) {
      const errText = await insertRes.text();
      if (errText.includes("idx_customers_unique_gstin")) {
        return NextResponse.json(
          { error: `An active customer with GSTIN '${gstin}' already exists.` },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: "Failed to create customer record.", details: errText },
        { status: insertRes.status }
      );
    }

    const insertedRows = await insertRes.json();
    const createdCustomer = Array.isArray(insertedRows) ? insertedRows[0] : insertedRows;

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
          p_action: "customers.CREATE",
          p_entity_type: "customer",
          p_entity_id: createdCustomer.id,
          p_before_json: null,
          p_after_json: createdCustomer,
          p_reason: body.reason || "New B2B Customer master created",
          p_source_app: "admin.farmreem.com",
        }),
      });
    } catch (e) {}

    return NextResponse.json({ customer: createdCustomer }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal server error creating customer." },
      { status: 500 }
    );
  }
}
