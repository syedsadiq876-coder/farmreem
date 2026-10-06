import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDatabaseConfig } from "@farmreem/database";

const ALLOWED_TYPES = ["POULTRY_FARM", "WHOLESALE_MANDI", "PARTNER_FARM", "PROCESSOR", "DISTRIBUTOR", "OTHER"];
const ALLOWED_CHANNELS = ["DIRECT_FARM", "MANDI_TRADER", "CONTRACT_FARMING", "INTEGRATOR", "OTHER"];
const ALLOWED_STATUSES = ["PROSPECT", "PENDING_VERIFICATION", "ACTIVE", "ON_HOLD", "INACTIVE"];
const ALLOWED_VERIFICATION_STATUSES = ["UNVERIFIED", "VERIFIED", "SUSPENDED"];

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
  requiredPermission?: "suppliers.VIEW" | "suppliers.CREATE" | "suppliers.EDIT"
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
      const permRes = await fetch(`${supabaseUrl}/rest/v1/rpc/has_permission`, {
        method: "POST",
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseServiceKey || supabaseAnonKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          p_user_id: authUser.id,
          p_module: "suppliers_farms",
          p_action: requiredPermission.split(".")[1] || "",
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
    const auth = await getAuthenticatedUser(request, "suppliers.VIEW");
    if ("error" in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { supabaseUrl, supabaseAnonKey, token, supabaseServiceKey } = auth;
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search")?.trim() || "";
    const supplier_type = searchParams.get("supplier_type")?.trim() || searchParams.get("type")?.trim() || "";
    const sourcing_channel = searchParams.get("sourcing_channel")?.trim() || "";
    const status = searchParams.get("status")?.trim() || "";
    const verification_status = searchParams.get("verification_status")?.trim() || "";

    const headers: Record<string, string> = {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${token}`,
    };

    let queryParams = "select=*,assigned_procurement_owner:users!assigned_procurement_owner_id(id,full_name,email)&order=created_at.desc";

    if (supplier_type && ALLOWED_TYPES.includes(supplier_type)) {
      queryParams += `&supplier_type=eq.${supplier_type}`;
    }

    if (sourcing_channel && ALLOWED_CHANNELS.includes(sourcing_channel)) {
      queryParams += `&sourcing_channel=eq.${sourcing_channel}`;
    }

    if (status && ALLOWED_STATUSES.includes(status)) {
      queryParams += `&status=eq.${status}`;
    }

    if (verification_status && ALLOWED_VERIFICATION_STATUSES.includes(verification_status)) {
      queryParams += `&verification_status=eq.${verification_status}`;
    }

    if (search) {
      const sanitized = encodeURIComponent(`*${search}*`);
      queryParams += `&or=(supplier_code.ilike.${sanitized},legal_name.ilike.${sanitized},trade_name.ilike.${sanitized},gstin.ilike.${sanitized},pan.ilike.${sanitized})`;
    }

    const res = await fetch(`${supabaseUrl}/rest/v1/suppliers?${queryParams}`, {
      headers,
    });

    if (!res.ok) {
      const serviceHeaders: Record<string, string> = {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseServiceKey}`,
      };
      const serviceRes = await fetch(`${supabaseUrl}/rest/v1/suppliers?${queryParams}`, {
        headers: serviceHeaders,
      });
      if (!serviceRes.ok) {
        const errText = await serviceRes.text();
        return NextResponse.json(
          { error: "Failed to fetch suppliers directory.", details: errText },
          { status: serviceRes.status }
        );
      }
      const suppliers = await serviceRes.json();
      return NextResponse.json({ suppliers });
    }

    const suppliers = await res.json();
    return NextResponse.json({ suppliers });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal server error fetching suppliers." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const auth = await getAuthenticatedUser(request, "suppliers.CREATE");
    if ("error" in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { supabaseUrl, supabaseAnonKey, supabaseServiceKey, authUser } = auth;
    const body = await request.json().catch(() => ({}));

    const legal_name = (body.legal_name || "").trim();
    const trade_name = body.trade_name ? body.trade_name.trim() : null;
    const supplier_type = (body.supplier_type || "").trim();
    const sourcing_channel = (body.sourcing_channel || "DIRECT_FARM").trim();
    const gstin = body.gstin ? body.gstin.trim().toUpperCase() : null;
    const pan = body.pan ? body.pan.trim().toUpperCase() : null;
    const status = body.status && ALLOWED_STATUSES.includes(body.status) ? body.status : "PROSPECT";
    const verification_status = body.verification_status && ALLOWED_VERIFICATION_STATUSES.includes(body.verification_status) ? body.verification_status : "UNVERIFIED";
    const assigned_procurement_owner_id = body.assigned_procurement_owner_id || null;
    const notes = body.notes ? body.notes.trim() : null;

    if (!legal_name) {
      return NextResponse.json({ error: "Supplier legal name is required." }, { status: 400 });
    }
    if (!supplier_type || !ALLOWED_TYPES.includes(supplier_type)) {
      return NextResponse.json(
        { error: `Invalid supplier type. Must be one of: ${ALLOWED_TYPES.join(", ")}` },
        { status: 400 }
      );
    }
    if (!ALLOWED_CHANNELS.includes(sourcing_channel)) {
      return NextResponse.json(
        { error: `Invalid sourcing channel. Must be one of: ${ALLOWED_CHANNELS.join(", ")}` },
        { status: 400 }
      );
    }

    if (gstin && gstin.length !== 15) {
      return NextResponse.json({ error: "GSTIN must be exactly 15 characters." }, { status: 400 });
    }
    if (pan && pan.length !== 10) {
      return NextResponse.json({ error: "PAN must be exactly 10 characters." }, { status: 400 });
    }

    // Verify assigned_procurement_owner_id is an ACTIVE staff user
    if (assigned_procurement_owner_id) {
      const ownerRes = await fetch(`${supabaseUrl}/rest/v1/users?id=eq.${assigned_procurement_owner_id}&select=id,status`, {
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseServiceKey}`,
        },
      });
      const ownerRows = await ownerRes.json().catch(() => []);
      if (!ownerRows[0] || ownerRows[0].status !== "ACTIVE") {
        return NextResponse.json({ error: "Assigned procurement owner must be an active staff member." }, { status: 400 });
      }
    }

    // Server-derived created_by & updated_by
    const supplierPayload: Record<string, any> = {
      legal_name,
      trade_name,
      supplier_type,
      sourcing_channel,
      gstin,
      pan,
      status,
      verification_status,
      assigned_procurement_owner_id,
      notes,
      created_by: authUser.id,
      updated_by: authUser.id,
    };

    const insertRes = await fetch(`${supabaseUrl}/rest/v1/suppliers`, {
      method: "POST",
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseServiceKey}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(supplierPayload),
    });

    if (!insertRes.ok) {
      const errText = await insertRes.text();
      if (errText.includes("idx_suppliers_unique_gstin")) {
        return NextResponse.json(
          { error: `An active supplier with GSTIN '${gstin}' already exists.` },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: "Failed to create supplier master record.", details: errText },
        { status: insertRes.status }
      );
    }

    const insertedRows = await insertRes.json();
    const createdSupplier = Array.isArray(insertedRows) ? insertedRows[0] : insertedRows;

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
          p_action: "suppliers.CREATE",
          p_entity_type: "supplier",
          p_entity_id: createdSupplier.id,
          p_before_json: null,
          p_after_json: createdSupplier,
          p_reason: body.reason || "New Supplier & Farm master record created",
          p_source_app: "admin.farmreem.com",
        }),
      });
    } catch (e) {}

    return NextResponse.json({ supplier: createdSupplier }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal server error creating supplier." },
      { status: 500 }
    );
  }
}
