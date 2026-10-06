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

    // Fetch customer record, owner, contacts, and addresses
    const customerRes = await fetch(
      `${supabaseUrl}/rest/v1/customers?id=eq.${id}&select=*,assigned_account_owner:users!assigned_account_owner_id(id,full_name,email)`,
      {
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseServiceKey}`,
        },
      }
    );

    if (!customerRes.ok) {
      return NextResponse.json({ error: "Failed to fetch customer record." }, { status: customerRes.status });
    }

    const customers = await customerRes.json();
    const customer = customers[0];

    if (!customer) {
      return NextResponse.json({ error: "Customer not found." }, { status: 404 });
    }

    const contactsRes = await fetch(`${supabaseUrl}/rest/v1/customer_contacts?customer_id=eq.${id}&order=is_primary.desc,created_at.desc`, {
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseServiceKey}`,
      },
    });
    const contacts = contactsRes.ok ? await contactsRes.json() : [];

    const addressesRes = await fetch(`${supabaseUrl}/rest/v1/customer_addresses?customer_id=eq.${id}&order=is_primary_delivery.desc,created_at.desc`, {
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseServiceKey}`,
      },
    });
    const addresses = addressesRes.ok ? await addressesRes.json() : [];

    return NextResponse.json({ customer, contacts, addresses });
  } catch (error: any) {
    return NextResponse.json({ error: "Internal server error fetching customer detail." }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const auth = await getAuthenticatedUser(request, "customers.EDIT");
    if ("error" in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { supabaseUrl, supabaseAnonKey, supabaseServiceKey, authUser } = auth;
    const body = await request.json().catch(() => ({}));

    // 1. Fetch existing customer before update
    const existingRes = await fetch(`${supabaseUrl}/rest/v1/customers?id=eq.${id}&select=*`, {
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseServiceKey}`,
      },
    });

    if (!existingRes.ok) {
      return NextResponse.json({ error: "Failed to fetch existing customer." }, { status: existingRes.status });
    }

    const existingRows = await existingRes.json();
    const existingCustomer = existingRows[0];
    if (!existingCustomer) {
      return NextResponse.json({ error: "Customer record not found." }, { status: 404 });
    }

    // 2. Build update payload (SERVER-DERIVED updated_by)
    const updatePayload: Record<string, any> = {
      updated_by: authUser.id,
      updated_at: new Date().toISOString(),
    };

    if (body.legal_name !== undefined) {
      const name = String(body.legal_name).trim();
      if (!name) return NextResponse.json({ error: "Legal name cannot be empty." }, { status: 400 });
      updatePayload.legal_name = name;
    }

    if (body.trade_name !== undefined) {
      updatePayload.trade_name = body.trade_name ? String(body.trade_name).trim() : null;
    }

    if (body.customer_type !== undefined) {
      if (!ALLOWED_TYPES.includes(body.customer_type)) {
        return NextResponse.json({ error: "Invalid customer type." }, { status: 400 });
      }
      updatePayload.customer_type = body.customer_type;
    }

    if (body.gstin !== undefined) {
      const gstin = body.gstin ? String(body.gstin).trim().toUpperCase() : null;
      if (gstin && gstin.length !== 15) {
        return NextResponse.json({ error: "GSTIN must be 15 characters." }, { status: 400 });
      }
      updatePayload.gstin = gstin;
    }

    if (body.pan !== undefined) {
      const pan = body.pan ? String(body.pan).trim().toUpperCase() : null;
      if (pan && pan.length !== 10) {
        return NextResponse.json({ error: "PAN must be 10 characters." }, { status: 400 });
      }
      updatePayload.pan = pan;
    }

    const isStatusChange = body.status !== undefined && body.status !== existingCustomer.status;
    if (body.status !== undefined) {
      if (!ALLOWED_STATUSES.includes(body.status)) {
        return NextResponse.json({ error: "Invalid status." }, { status: 400 });
      }
      updatePayload.status = body.status;
    }

    const isCommercialStatusChange = body.commercial_status !== undefined && body.commercial_status !== existingCustomer.commercial_status;
    if (body.commercial_status !== undefined) {
      if (!ALLOWED_COMMERCIAL_STATUSES.includes(body.commercial_status)) {
        return NextResponse.json({ error: "Invalid commercial status." }, { status: 400 });
      }
      updatePayload.commercial_status = body.commercial_status;
    }

    const isOwnerChange = body.assigned_account_owner_id !== undefined && body.assigned_account_owner_id !== existingCustomer.assigned_account_owner_id;
    if (body.assigned_account_owner_id !== undefined) {
      if (body.assigned_account_owner_id) {
        const ownerRes = await fetch(`${supabaseUrl}/rest/v1/users?id=eq.${body.assigned_account_owner_id}&select=id,status`, {
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
      updatePayload.assigned_account_owner_id = body.assigned_account_owner_id || null;
    }

    if (body.notes !== undefined) {
      updatePayload.notes = body.notes ? String(body.notes).trim() : null;
    }

    const updateRes = await fetch(`${supabaseUrl}/rest/v1/customers?id=eq.${id}`, {
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
      return NextResponse.json({ error: "Failed to update customer.", details: errText }, { status: updateRes.status });
    }

    const updatedRows = await updateRes.json();
    const updatedCustomer = Array.isArray(updatedRows) ? updatedRows[0] : updatedRows;

    // Log Audit Events
    try {
      if (isStatusChange) {
        await fetch(`${supabaseUrl}/rest/v1/rpc/log_audit_event`, {
          method: "POST",
          headers: {
            apikey: supabaseAnonKey,
            Authorization: `Bearer ${supabaseServiceKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            p_action: "customers.STATUS_CHANGE",
            p_entity_type: "customer",
            p_entity_id: id,
            p_before_json: existingCustomer,
            p_after_json: updatedCustomer,
            p_reason: body.reason || `Account status changed to ${updatedCustomer.status}`,
            p_source_app: "admin.farmreem.com",
          }),
        });
      }

      if (isCommercialStatusChange) {
        await fetch(`${supabaseUrl}/rest/v1/rpc/log_audit_event`, {
          method: "POST",
          headers: {
            apikey: supabaseAnonKey,
            Authorization: `Bearer ${supabaseServiceKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            p_action: "customers.COMMERCIAL_STATUS_CHANGE",
            p_entity_type: "customer",
            p_entity_id: id,
            p_before_json: existingCustomer,
            p_after_json: updatedCustomer,
            p_reason: body.reason || `Commercial status changed to ${updatedCustomer.commercial_status}`,
            p_source_app: "admin.farmreem.com",
          }),
        });
      }

      if (isOwnerChange) {
        await fetch(`${supabaseUrl}/rest/v1/rpc/log_audit_event`, {
          method: "POST",
          headers: {
            apikey: supabaseAnonKey,
            Authorization: `Bearer ${supabaseServiceKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            p_action: "customers.ACCOUNT_OWNER_CHANGE",
            p_entity_type: "customer",
            p_entity_id: id,
            p_before_json: existingCustomer,
            p_after_json: updatedCustomer,
            p_reason: body.reason || "Account owner assigned",
            p_source_app: "admin.farmreem.com",
          }),
        });
      }

      if (!isStatusChange && !isCommercialStatusChange && !isOwnerChange) {
        await fetch(`${supabaseUrl}/rest/v1/rpc/log_audit_event`, {
          method: "POST",
          headers: {
            apikey: supabaseAnonKey,
            Authorization: `Bearer ${supabaseServiceKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            p_action: "customers.EDIT",
            p_entity_type: "customer",
            p_entity_id: id,
            p_before_json: existingCustomer,
            p_after_json: updatedCustomer,
            p_reason: body.reason || "Customer master details updated",
            p_source_app: "admin.farmreem.com",
          }),
        });
      }
    } catch (e) {}

    return NextResponse.json({ customer: updatedCustomer });
  } catch (error: any) {
    return NextResponse.json({ error: "Internal server error updating customer." }, { status: 500 });
  }
}
