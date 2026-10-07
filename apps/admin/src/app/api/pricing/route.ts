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
  requiredPermission?: "pricing.VIEW" | "pricing.CREATE" | "pricing.EDIT" | "pricing.APPROVE"
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
          p_module: "pricing",
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
    const auth = await getAuthenticatedUser(request, "pricing.VIEW");
    if ("error" in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { supabaseUrl, supabaseAnonKey, supabaseServiceKey } = auth;
    const { searchParams } = new URL(request.url);

    const listType = searchParams.get("list_type");
    const status = searchParams.get("status");
    const customerId = searchParams.get("customer_id");
    const supplierId = searchParams.get("supplier_id");

    let query = `${supabaseUrl}/rest/v1/price_lists?select=*,customer:customers(id,legal_name,customer_code),supplier:suppliers(id,legal_name,supplier_code),creator:users!created_by(id,full_name,email),approver:users!approved_by(id,full_name,email)&order=created_at.desc`;

    if (listType) query += `&list_type=eq.${listType}`;
    if (status) query += `&status=eq.${status}`;
    if (customerId) query += `&customer_id=eq.${customerId}`;
    if (supplierId) query += `&supplier_id=eq.${supplierId}`;

    const res = await fetch(query, {
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseServiceKey}`,
      },
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json({ error: "Failed to fetch price lists.", details: errText }, { status: res.status });
    }

    const priceLists = await res.json();
    return NextResponse.json({ price_lists: priceLists });
  } catch (error: any) {
    return NextResponse.json({ error: "Internal server error fetching price lists." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const auth = await getAuthenticatedUser(request, "pricing.CREATE");
    if ("error" in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { supabaseUrl, supabaseAnonKey, supabaseServiceKey, authUser } = auth;
    const body = await request.json().catch(() => ({}));

    const name = String(body.name || "").trim();
    const listType = body.list_type;
    const customerId = body.customer_id || null;
    const supplierId = body.supplier_id || null;
    const notes = body.notes ? String(body.notes).trim() : null;

    if (!name) {
      return NextResponse.json({ error: "Price list name is required." }, { status: 400 });
    }

    if (!["BASE_SELLING", "CUSTOMER_CONTRACT", "SUPPLIER_REFERENCE_COST"].includes(listType)) {
      return NextResponse.json({ error: "Invalid price list type." }, { status: 400 });
    }

    if (listType === "CUSTOMER_CONTRACT" && !customerId) {
      return NextResponse.json({ error: "Customer ID is required for B2B Customer Contract price lists." }, { status: 400 });
    }

    if (listType === "SUPPLIER_REFERENCE_COST" && !supplierId) {
      return NextResponse.json({ error: "Supplier ID is required for Supplier Reference Cost price lists." }, { status: 400 });
    }

    if (listType === "BASE_SELLING" && (customerId || supplierId)) {
      return NextResponse.json({ error: "Base Selling price lists cannot be linked to a specific customer or supplier." }, { status: 400 });
    }

    const insertPayload = {
      name,
      list_type: listType,
      customer_id: listType === "CUSTOMER_CONTRACT" ? customerId : null,
      supplier_id: listType === "SUPPLIER_REFERENCE_COST" ? supplierId : null,
      status: "DRAFT",
      currency: "INR",
      notes,
      created_by: authUser.id,
      updated_by: authUser.id,
    };

    const insertRes = await fetch(`${supabaseUrl}/rest/v1/price_lists`, {
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
      return NextResponse.json({ error: "Failed to create price list header.", details: errText }, { status: insertRes.status });
    }

    const insertedRows = await insertRes.json();
    const newPriceList = Array.isArray(insertedRows) ? insertedRows[0] : insertedRows;

    // Log Audit Event
    try {
      await fetch(`${supabaseUrl}/rest/v1/rpc/log_audit_event`, {
        method: "POST",
        headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseServiceKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          p_action: "pricing.CREATE",
          p_entity_type: "price_list",
          p_entity_id: newPriceList.id,
          p_before_json: null,
          p_after_json: newPriceList,
          p_reason: `Drafted ${listType} price list: ${name}`,
          p_source_app: "admin.farmreem.com",
        }),
      });
    } catch (e) {}

    return NextResponse.json({ price_list: newPriceList }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: "Internal server error creating price list." }, { status: 500 });
  }
}
