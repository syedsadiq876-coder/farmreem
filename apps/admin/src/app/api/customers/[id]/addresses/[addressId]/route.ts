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

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; addressId: string }> }
) {
  try {
    const { id, addressId } = await params;
    const auth = await getAuthenticatedUser(request, "customers.EDIT");
    if ("error" in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { supabaseUrl, supabaseAnonKey, supabaseServiceKey, authUser } = auth;
    const body = await request.json().catch(() => ({}));

    // Verify address belongs to parent customer
    const existingRes = await fetch(
      `${supabaseUrl}/rest/v1/customer_addresses?id=eq.${addressId}&customer_id=eq.${id}&select=*`,
      {
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseServiceKey}`,
        },
      }
    );

    if (!existingRes.ok) {
      return NextResponse.json({ error: "Failed to verify address." }, { status: existingRes.status });
    }

    const existingRows = await existingRes.json();
    const existingAddress = existingRows[0];
    if (!existingAddress) {
      return NextResponse.json({ error: "Address not found for this customer." }, { status: 404 });
    }

    const updatePayload: Record<string, any> = {
      updated_by: authUser.id,
      updated_at: new Date().toISOString(),
    };

    if (body.address_type !== undefined && ALLOWED_TYPES.includes(body.address_type)) {
      updatePayload.address_type = body.address_type;
    }
    if (body.label !== undefined) updatePayload.label = body.label ? String(body.label).trim() : null;
    if (body.address_line1 !== undefined) updatePayload.address_line1 = String(body.address_line1).trim();
    if (body.address_line2 !== undefined) updatePayload.address_line2 = body.address_line2 ? String(body.address_line2).trim() : null;
    if (body.city !== undefined) updatePayload.city = String(body.city).trim();
    if (body.state !== undefined) updatePayload.state = String(body.state).trim();
    if (body.postal_code !== undefined) updatePayload.postal_code = String(body.postal_code).trim();
    if (body.country !== undefined) updatePayload.country = String(body.country).trim();
    if (body.notes !== undefined) updatePayload.notes = body.notes ? String(body.notes).trim() : null;

    const isStatusChange = body.status !== undefined && body.status !== existingAddress.status;
    if (body.status !== undefined) {
      if (body.status !== "ACTIVE" && body.status !== "INACTIVE") {
        return NextResponse.json({ error: "Invalid status." }, { status: 400 });
      }
      updatePayload.status = body.status;
    }

    const isBillingPrimaryChange = body.is_primary_billing !== undefined && Boolean(body.is_primary_billing) !== existingAddress.is_primary_billing;
    if (body.is_primary_billing !== undefined) updatePayload.is_primary_billing = Boolean(body.is_primary_billing);

    const isDeliveryPrimaryChange = body.is_primary_delivery !== undefined && Boolean(body.is_primary_delivery) !== existingAddress.is_primary_delivery;
    if (body.is_primary_delivery !== undefined) updatePayload.is_primary_delivery = Boolean(body.is_primary_delivery);

    // Consistency Check
    const effectiveType = updatePayload.address_type || existingAddress.address_type;
    const effectiveBillingPrimary = updatePayload.is_primary_billing !== undefined ? updatePayload.is_primary_billing : existingAddress.is_primary_billing;
    const effectiveDeliveryPrimary = updatePayload.is_primary_delivery !== undefined ? updatePayload.is_primary_delivery : existingAddress.is_primary_delivery;

    if (effectiveType === "BILLING" && effectiveDeliveryPrimary) {
      return NextResponse.json({ error: "A BILLING-only address cannot be marked as primary delivery address." }, { status: 400 });
    }
    if (effectiveType === "DELIVERY" && effectiveBillingPrimary) {
      return NextResponse.json({ error: "A DELIVERY-only address cannot be marked as primary billing address." }, { status: 400 });
    }

    const updateRes = await fetch(`${supabaseUrl}/rest/v1/customer_addresses?id=eq.${addressId}`, {
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
      return NextResponse.json({ error: "Failed to update address.", details: errText }, { status: updateRes.status });
    }

    const updatedRows = await updateRes.json();
    const updatedAddress = Array.isArray(updatedRows) ? updatedRows[0] : updatedRows;

    // Transactional Primary Unsetting
    if ((isBillingPrimaryChange && updatedAddress.is_primary_billing) || (isDeliveryPrimaryChange && updatedAddress.is_primary_delivery)) {
      await fetch(`${supabaseUrl}/rest/v1/rpc/set_primary_customer_address`, {
        method: "POST",
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseServiceKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          p_customer_id: id,
          p_address_id: addressId,
          p_is_billing: updatedAddress.is_primary_billing,
          p_is_delivery: updatedAddress.is_primary_delivery,
        }),
      });
    }

    // Log Audit Event
    try {
      const actionType = (isBillingPrimaryChange || isDeliveryPrimaryChange)
        ? "customer_addresses.PRIMARY_CHANGE"
        : isStatusChange
        ? "customer_addresses.STATUS_CHANGE"
        : "customer_addresses.EDIT";

      await fetch(`${supabaseUrl}/rest/v1/rpc/log_audit_event`, {
        method: "POST",
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseServiceKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          p_action: actionType,
          p_entity_type: "customer_address",
          p_entity_id: addressId,
          p_before_json: existingAddress,
          p_after_json: updatedAddress,
          p_reason: body.reason || "Customer address updated",
          p_source_app: "admin.farmreem.com",
        }),
      });
    } catch (e) {}

    return NextResponse.json({ address: updatedAddress });
  } catch (error: any) {
    return NextResponse.json({ error: "Internal server error updating address." }, { status: 500 });
  }
}
