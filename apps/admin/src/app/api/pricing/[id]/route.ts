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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const auth = await getAuthenticatedUser(request, "pricing.VIEW");
    if ("error" in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { supabaseUrl, supabaseAnonKey, supabaseServiceKey } = auth;

    const listRes = await fetch(
      `${supabaseUrl}/rest/v1/price_lists?id=eq.${id}&select=*,customer:customers(id,legal_name,customer_code),supplier:suppliers(id,legal_name,supplier_code),creator:users!created_by(id,full_name,email),approver:users!approved_by(id,full_name,email)`,
      {
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseServiceKey}`,
        },
      }
    );

    if (!listRes.ok) {
      return NextResponse.json({ error: "Failed to fetch price list." }, { status: listRes.status });
    }

    const lists = await listRes.json();
    const priceList = lists[0];

    if (!priceList) {
      return NextResponse.json({ error: "Price list not found." }, { status: 404 });
    }

    const itemsRes = await fetch(
      `${supabaseUrl}/rest/v1/price_list_items?price_list_id=eq.${id}&select=*,product:products(id,sku,name,category,unit_of_measure)&order=effective_from.asc,min_quantity.asc`,
      {
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseServiceKey}`,
        },
      }
    );

    const items = itemsRes.ok ? await itemsRes.json() : [];

    return NextResponse.json({ price_list: priceList, items });
  } catch (error: any) {
    return NextResponse.json({ error: "Internal server error fetching price list detail." }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const auth = await getAuthenticatedUser(request, "pricing.EDIT");
    if ("error" in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { supabaseUrl, supabaseAnonKey, supabaseServiceKey, authUser } = auth;
    const body = await request.json().catch(() => ({}));

    // Fetch existing
    const existingRes = await fetch(`${supabaseUrl}/rest/v1/price_lists?id=eq.${id}&select=*`, {
      headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseServiceKey}` },
    });
    const existingRows = await existingRes.json().catch(() => []);
    const existingList = existingRows[0];

    if (!existingList) {
      return NextResponse.json({ error: "Price list not found." }, { status: 404 });
    }

    if (existingList.status !== "DRAFT" && existingList.status !== "REJECTED") {
      return NextResponse.json({ error: `Cannot edit price list in status ${existingList.status}. Only DRAFT or REJECTED lists can be edited.` }, { status: 400 });
    }

    const updatePayload: Record<string, any> = {
      updated_by: authUser.id,
      updated_at: new Date().toISOString(),
    };

    if (body.name !== undefined) {
      const name = String(body.name).trim();
      if (!name) return NextResponse.json({ error: "Price list name cannot be empty." }, { status: 400 });
      updatePayload.name = name;
    }

    if (body.notes !== undefined) updatePayload.notes = body.notes ? String(body.notes).trim() : null;

    const updateRes = await fetch(`${supabaseUrl}/rest/v1/price_lists?id=eq.${id}`, {
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
      return NextResponse.json({ error: "Failed to update price list.", details: errText }, { status: updateRes.status });
    }

    const updatedRows = await updateRes.json();
    const updatedList = Array.isArray(updatedRows) ? updatedRows[0] : updatedRows;

    // Audit Event
    try {
      await fetch(`${supabaseUrl}/rest/v1/rpc/log_audit_event`, {
        method: "POST",
        headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseServiceKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          p_action: "pricing.EDIT",
          p_entity_type: "price_list",
          p_entity_id: id,
          p_before_json: existingList,
          p_after_json: updatedList,
          p_reason: "Updated draft price list header details",
          p_source_app: "admin.farmreem.com",
        }),
      });
    } catch (e) {}

    return NextResponse.json({ price_list: updatedList });
  } catch (error: any) {
    return NextResponse.json({ error: "Internal server error updating price list." }, { status: 500 });
  }
}
