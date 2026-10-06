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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const auth = await getAuthenticatedUser(request, "suppliers.VIEW");
    if ("error" in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { supabaseUrl, supabaseAnonKey, supabaseServiceKey } = auth;

    const supplierRes = await fetch(
      `${supabaseUrl}/rest/v1/suppliers?id=eq.${id}&select=*,assigned_procurement_owner:users!assigned_procurement_owner_id(id,full_name,email)`,
      {
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseServiceKey}`,
        },
      }
    );

    if (!supplierRes.ok) {
      return NextResponse.json({ error: "Failed to fetch supplier record." }, { status: supplierRes.status });
    }

    const suppliers = await supplierRes.json();
    const supplier = suppliers[0];

    if (!supplier) {
      return NextResponse.json({ error: "Supplier record not found." }, { status: 404 });
    }

    const contactsRes = await fetch(`${supabaseUrl}/rest/v1/supplier_contacts?supplier_id=eq.${id}&order=is_primary.desc,created_at.desc`, {
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseServiceKey}`,
      },
    });
    const contacts = contactsRes.ok ? await contactsRes.json() : [];

    const addressesRes = await fetch(`${supabaseUrl}/rest/v1/supplier_addresses?supplier_id=eq.${id}&order=is_primary_pickup.desc,created_at.desc`, {
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseServiceKey}`,
      },
    });
    const addresses = addressesRes.ok ? await addressesRes.json() : [];

    return NextResponse.json({ supplier, contacts, addresses });
  } catch (error: any) {
    return NextResponse.json({ error: "Internal server error fetching supplier detail." }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const auth = await getAuthenticatedUser(request, "suppliers.EDIT");
    if ("error" in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { supabaseUrl, supabaseAnonKey, supabaseServiceKey, authUser } = auth;
    const body = await request.json().catch(() => ({}));

    // 1. Fetch existing supplier before update
    const existingRes = await fetch(`${supabaseUrl}/rest/v1/suppliers?id=eq.${id}&select=*`, {
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseServiceKey}`,
      },
    });

    if (!existingRes.ok) {
      return NextResponse.json({ error: "Failed to fetch existing supplier." }, { status: existingRes.status });
    }

    const existingRows = await existingRes.json();
    const existingSupplier = existingRows[0];
    if (!existingSupplier) {
      return NextResponse.json({ error: "Supplier record not found." }, { status: 404 });
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

    if (body.trade_name !== undefined) updatePayload.trade_name = body.trade_name ? String(body.trade_name).trim() : null;
    if (body.supplier_type !== undefined) {
      if (!ALLOWED_TYPES.includes(body.supplier_type)) return NextResponse.json({ error: "Invalid supplier type." }, { status: 400 });
      updatePayload.supplier_type = body.supplier_type;
    }
    if (body.sourcing_channel !== undefined) {
      if (!ALLOWED_CHANNELS.includes(body.sourcing_channel)) return NextResponse.json({ error: "Invalid sourcing channel." }, { status: 400 });
      updatePayload.sourcing_channel = body.sourcing_channel;
    }

    if (body.gstin !== undefined) {
      const gstin = body.gstin ? String(body.gstin).trim().toUpperCase() : null;
      if (gstin && gstin.length !== 15) return NextResponse.json({ error: "GSTIN must be 15 characters." }, { status: 400 });
      updatePayload.gstin = gstin;
    }

    if (body.pan !== undefined) {
      const pan = body.pan ? String(body.pan).trim().toUpperCase() : null;
      if (pan && pan.length !== 10) return NextResponse.json({ error: "PAN must be 10 characters." }, { status: 400 });
      updatePayload.pan = pan;
    }

    const isStatusChange = body.status !== undefined && body.status !== existingSupplier.status;
    if (body.status !== undefined) {
      if (!ALLOWED_STATUSES.includes(body.status)) return NextResponse.json({ error: "Invalid status." }, { status: 400 });
      updatePayload.status = body.status;
    }

    const isVerificationChange = body.verification_status !== undefined && body.verification_status !== existingSupplier.verification_status;
    if (body.verification_status !== undefined) {
      if (!ALLOWED_VERIFICATION_STATUSES.includes(body.verification_status)) return NextResponse.json({ error: "Invalid verification status." }, { status: 400 });
      updatePayload.verification_status = body.verification_status;
    }

    const isOwnerChange = body.assigned_procurement_owner_id !== undefined && body.assigned_procurement_owner_id !== existingSupplier.assigned_procurement_owner_id;
    if (body.assigned_procurement_owner_id !== undefined) {
      if (body.assigned_procurement_owner_id) {
        const ownerRes = await fetch(`${supabaseUrl}/rest/v1/users?id=eq.${body.assigned_procurement_owner_id}&select=id,status`, {
          headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseServiceKey}` },
        });
        const ownerRows = await ownerRes.json().catch(() => []);
        if (!ownerRows[0] || ownerRows[0].status !== "ACTIVE") {
          return NextResponse.json({ error: "Assigned procurement owner must be an active staff member." }, { status: 400 });
        }
      }
      updatePayload.assigned_procurement_owner_id = body.assigned_procurement_owner_id || null;
    }

    if (body.notes !== undefined) updatePayload.notes = body.notes ? String(body.notes).trim() : null;

    const updateRes = await fetch(`${supabaseUrl}/rest/v1/suppliers?id=eq.${id}`, {
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
      return NextResponse.json({ error: "Failed to update supplier.", details: errText }, { status: updateRes.status });
    }

    const updatedRows = await updateRes.json();
    const updatedSupplier = Array.isArray(updatedRows) ? updatedRows[0] : updatedRows;

    // Log Audit Events
    try {
      if (isStatusChange) {
        await fetch(`${supabaseUrl}/rest/v1/rpc/log_audit_event`, {
          method: "POST",
          headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseServiceKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            p_action: "suppliers.STATUS_CHANGE",
            p_entity_type: "supplier",
            p_entity_id: id,
            p_before_json: existingSupplier,
            p_after_json: updatedSupplier,
            p_reason: body.reason || `Supplier status changed to ${updatedSupplier.status}`,
            p_source_app: "admin.farmreem.com",
          }),
        });
      }

      if (isVerificationChange) {
        await fetch(`${supabaseUrl}/rest/v1/rpc/log_audit_event`, {
          method: "POST",
          headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseServiceKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            p_action: "suppliers.VERIFICATION_CHANGE",
            p_entity_type: "supplier",
            p_entity_id: id,
            p_before_json: existingSupplier,
            p_after_json: updatedSupplier,
            p_reason: body.reason || `Verification status changed to ${updatedSupplier.verification_status}`,
            p_source_app: "admin.farmreem.com",
          }),
        });
      }

      if (isOwnerChange) {
        await fetch(`${supabaseUrl}/rest/v1/rpc/log_audit_event`, {
          method: "POST",
          headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseServiceKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            p_action: "suppliers.OWNER_CHANGE",
            p_entity_type: "supplier",
            p_entity_id: id,
            p_before_json: existingSupplier,
            p_after_json: updatedSupplier,
            p_reason: body.reason || "Procurement owner assigned",
            p_source_app: "admin.farmreem.com",
          }),
        });
      }

      if (!isStatusChange && !isVerificationChange && !isOwnerChange) {
        await fetch(`${supabaseUrl}/rest/v1/rpc/log_audit_event`, {
          method: "POST",
          headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseServiceKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            p_action: "suppliers.EDIT",
            p_entity_type: "supplier",
            p_entity_id: id,
            p_before_json: existingSupplier,
            p_after_json: updatedSupplier,
            p_reason: body.reason || "Supplier master details updated",
            p_source_app: "admin.farmreem.com",
          }),
        });
      }
    } catch (e) {}

    return NextResponse.json({ supplier: updatedSupplier });
  } catch (error: any) {
    return NextResponse.json({ error: "Internal server error updating supplier." }, { status: 500 });
  }
}
