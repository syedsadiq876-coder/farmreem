import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDatabaseConfig } from "@farmreem/database";

const ALLOWED_CATEGORIES = ["LIVE_BROILER", "WHOLE_DRESSED", "CUTS", "BONELESS"];
const ALLOWED_STATUSES = ["ACTIVE", "INACTIVE"];

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
  requiredPermission?: "products.VIEW" | "products.CREATE" | "products.EDIT"
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

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Product ID parameter is required." }, { status: 400 });
    }

    const auth = await getAuthenticatedUser(request, "products.EDIT");
    if ("error" in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { supabaseUrl, supabaseAnonKey, supabaseServiceKey, authUser, token } = auth;
    const body = await request.json().catch(() => ({}));

    // 1. Fetch existing product before update
    const headers: Record<string, string> = {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseServiceKey || token}`,
    };

    const existingRes = await fetch(`${supabaseUrl}/rest/v1/products?id=eq.${id}&select=*`, {
      headers,
    });

    if (!existingRes.ok) {
      return NextResponse.json({ error: "Failed to fetch existing product record." }, { status: existingRes.status });
    }

    const existingRows = await existingRes.json();
    const existingProduct = existingRows[0];

    if (!existingProduct) {
      return NextResponse.json({ error: "Product record not found." }, { status: 404 });
    }

    // 2. Build update payload (SERVER-DERIVED updated_by)
    const updatePayload: Record<string, any> = {
      updated_by: authUser.id,
      updated_at: new Date().toISOString(),
    };

    if (body.name !== undefined) {
      const name = String(body.name).trim();
      if (!name) return NextResponse.json({ error: "Product name cannot be empty." }, { status: 400 });
      updatePayload.name = name;
    }

    if (body.category !== undefined) {
      if (!ALLOWED_CATEGORIES.includes(body.category)) {
        return NextResponse.json(
          { error: `Invalid category. Must be one of: ${ALLOWED_CATEGORIES.join(", ")}` },
          { status: 400 }
        );
      }
      updatePayload.category = body.category;
    }

    if (body.unit_of_measure !== undefined) {
      const uom = String(body.unit_of_measure).trim().toUpperCase();
      if (!uom) return NextResponse.json({ error: "Unit of measure cannot be empty." }, { status: 400 });
      updatePayload.unit_of_measure = uom;
    }

    if (body.min_weight_kg !== undefined) {
      updatePayload.min_weight_kg = body.min_weight_kg !== "" && body.min_weight_kg !== null ? parseFloat(body.min_weight_kg) : null;
    }

    if (body.max_weight_kg !== undefined) {
      updatePayload.max_weight_kg = body.max_weight_kg !== "" && body.max_weight_kg !== null ? parseFloat(body.max_weight_kg) : null;
    }

    if (body.notes !== undefined) {
      updatePayload.notes = body.notes ? String(body.notes).trim() : null;
    }

    const isStatusChange = body.status !== undefined && body.status !== existingProduct.status;
    if (body.status !== undefined) {
      if (!ALLOWED_STATUSES.includes(body.status)) {
        return NextResponse.json(
          { error: `Invalid status. Must be one of: ${ALLOWED_STATUSES.join(", ")}` },
          { status: 400 }
        );
      }
      updatePayload.status = body.status;
    }

    const updateHeaders: Record<string, string> = {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseServiceKey || token}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    };

    const updateRes = await fetch(`${supabaseUrl}/rest/v1/products?id=eq.${id}`, {
      method: "PATCH",
      headers: updateHeaders,
      body: JSON.stringify(updatePayload),
    });

    if (!updateRes.ok) {
      const errText = await updateRes.text();
      return NextResponse.json(
        { error: "Failed to update product.", details: errText },
        { status: updateRes.status }
      );
    }

    const updatedRows = await updateRes.json();
    const updatedProduct = Array.isArray(updatedRows) ? updatedRows[0] : updatedRows;

    // 3. Record Audit Event
    const actionType = isStatusChange ? "products.STATUS_CHANGE" : "products.EDIT";
    const auditReason = body.reason?.trim() || (isStatusChange ? `Status changed from ${existingProduct.status} to ${updatedProduct.status}` : "Product metadata updated");

    try {
      await fetch(`${supabaseUrl}/rest/v1/rpc/log_audit_event`, {
        method: "POST",
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseServiceKey || token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          p_action: actionType,
          p_entity_type: "product",
          p_entity_id: id,
          p_before_json: existingProduct,
          p_after_json: updatedProduct,
          p_reason: auditReason,
          p_source_app: "admin.farmreem.com",
        }),
      });
    } catch (auditErr) {
      // Non-blocking fallback
    }

    return NextResponse.json({ product: updatedProduct });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal server error updating product." },
      { status: 500 }
    );
  }
}
