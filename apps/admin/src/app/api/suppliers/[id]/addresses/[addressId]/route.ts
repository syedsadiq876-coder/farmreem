import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDatabaseConfig } from "@farmreem/database";

const ALLOWED_ADDRESS_TYPES = [
  "FARM_LOCATION",
  "MANDI_WAREHOUSE",
  "BILLING",
  "PICKUP_SOURCE",
  "OTHER",
];
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
      hasPerm = false;
    }

    if (!hasPerm) {
      return { error: `Forbidden: requires ${requiredPermission} or SUPER_ADMIN permission.`, status: 403 };
    }
  }

  return {
    token,
    authUser,
    userProfile,
    assignedRole,
    supabaseUrl,
    supabaseAnonKey,
    supabaseServiceKey: supabaseServiceKey || "",
  };
}

// PATCH /api/suppliers/[id]/addresses/[addressId]
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; addressId: string }> }
) {
  const auth = await getAuthenticatedUser(request, "suppliers.EDIT");
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { id: supplierId, addressId } = await params;
  const serviceKey = auth.supabaseServiceKey || auth.supabaseAnonKey;

  try {
    // Verify address exists and belongs to supplierId
    const addrCheck = await fetch(
      `${auth.supabaseUrl}/rest/v1/supplier_addresses?id=eq.${addressId}&supplier_id=eq.${supplierId}`,
      {
        headers: {
          apikey: auth.supabaseAnonKey,
          Authorization: `Bearer ${serviceKey}`,
        },
      }
    );

    if (!addrCheck.ok) {
      return NextResponse.json({ error: "Failed to query address." }, { status: 500 });
    }

    const existingRows = await addrCheck.json();
    if (existingRows.length === 0) {
      return NextResponse.json(
        { error: "Address not found or does not belong to this supplier." },
        { status: 404 }
      );
    }

    const currentAddr = existingRows[0];
    const body = await request.json();
    const updates: Record<string, any> = {};
    const auditActions: string[] = [];

    // Fields
    if (body.address_type !== undefined) {
      if (!ALLOWED_ADDRESS_TYPES.includes(body.address_type)) {
        return NextResponse.json(
          { error: `Invalid address_type. Must be one of: ${ALLOWED_ADDRESS_TYPES.join(", ")}` },
          { status: 400 }
        );
      }
      updates.address_type = body.address_type;
    }

    if (body.address_line1 !== undefined) {
      if (!body.address_line1 || !body.address_line1.trim()) {
        return NextResponse.json({ error: "Address line 1 cannot be empty." }, { status: 400 });
      }
      updates.address_line1 = body.address_line1.trim();
    }

    if (body.address_line2 !== undefined) {
      updates.address_line2 = body.address_line2 ? body.address_line2.trim() : null;
    }

    if (body.landmark !== undefined) {
      updates.landmark = body.landmark ? body.landmark.trim() : null;
    }

    if (body.city !== undefined) {
      if (!body.city || !body.city.trim()) {
        return NextResponse.json({ error: "City cannot be empty." }, { status: 400 });
      }
      updates.city = body.city.trim();
    }

    if (body.state !== undefined) {
      if (!body.state || !body.state.trim()) {
        return NextResponse.json({ error: "State cannot be empty." }, { status: 400 });
      }
      updates.state = body.state.trim();
    }

    if (body.postal_code !== undefined) {
      updates.postal_code = body.postal_code ? body.postal_code.trim() : null;
    }

    if (body.country !== undefined) {
      updates.country = body.country ? body.country.trim() : "India";
    }

    if (body.notes !== undefined) {
      updates.notes = body.notes ? body.notes.trim() : null;
    }

    if (body.status !== undefined) {
      if (!ALLOWED_STATUSES.includes(body.status)) {
        return NextResponse.json({ error: "Invalid status." }, { status: 400 });
      }
      updates.status = body.status;
      if (body.status !== currentAddr.status) {
        auditActions.push("supplier_addresses.STATUS_CHANGE");
      }
    }

    // Consistency check: BILLING-only address cannot be primary pickup
    const effectiveType = updates.address_type || currentAddr.address_type;
    const settingPickupPrimary = body.is_primary_pickup === true;

    if (effectiveType === "BILLING" && settingPickupPrimary) {
      return NextResponse.json(
        { error: "A BILLING-only address cannot be set as primary pickup." },
        { status: 400 }
      );
    }

    // Perform atomic primary swaps if requested
    if (body.is_primary_pickup === true && !currentAddr.is_primary_pickup) {
      const primRes = await fetch(`${auth.supabaseUrl}/rest/v1/rpc/set_primary_supplier_address`, {
        method: "POST",
        headers: {
          apikey: auth.supabaseAnonKey,
          Authorization: `Bearer ${serviceKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          p_address_id: addressId,
          p_type: "PICKUP",
        }),
      });

      if (!primRes.ok) {
        const errTxt = await primRes.text();
        return NextResponse.json(
          { error: `Failed to set primary pickup address: ${errTxt}` },
          { status: primRes.status }
        );
      }
      auditActions.push("supplier_addresses.PRIMARY_PICKUP_CHANGE");
    }

    if (body.is_primary_billing === true && !currentAddr.is_primary_billing) {
      const primRes = await fetch(`${auth.supabaseUrl}/rest/v1/rpc/set_primary_supplier_address`, {
        method: "POST",
        headers: {
          apikey: auth.supabaseAnonKey,
          Authorization: `Bearer ${serviceKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          p_address_id: addressId,
          p_type: "BILLING",
        }),
      });

      if (!primRes.ok) {
        const errTxt = await primRes.text();
        return NextResponse.json(
          { error: `Failed to set primary billing address: ${errTxt}` },
          { status: primRes.status }
        );
      }
      auditActions.push("supplier_addresses.PRIMARY_BILLING_CHANGE");
    }

    // Apply remaining field updates
    if (Object.keys(updates).length > 0) {
      updates.updated_by = auth.authUser.id;
      updates.updated_at = new Date().toISOString();

      const patchRes = await fetch(
        `${auth.supabaseUrl}/rest/v1/supplier_addresses?id=eq.${addressId}`,
        {
          method: "PATCH",
          headers: {
            apikey: auth.supabaseAnonKey,
            Authorization: `Bearer ${serviceKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updates),
        }
      );

      if (!patchRes.ok) {
        const errText = await patchRes.text();
        return NextResponse.json(
          { error: `Failed to update address: ${errText}` },
          { status: patchRes.status }
        );
      }

      if (auditActions.length === 0) {
        auditActions.push("supplier_addresses.EDIT");
      }
    }

    // Fetch refreshed address row
    const getRes = await fetch(
      `${auth.supabaseUrl}/rest/v1/supplier_addresses?id=eq.${addressId}`,
      {
        headers: {
          apikey: auth.supabaseAnonKey,
          Authorization: `Bearer ${serviceKey}`,
        },
      }
    );

    const refreshed = getRes.ok ? (await getRes.json())[0] : currentAddr;

    // Log audit events
    for (const action of auditActions) {
      try {
        await fetch(`${auth.supabaseUrl}/rest/v1/rpc/log_audit_event`, {
          method: "POST",
          headers: {
            apikey: auth.supabaseAnonKey,
            Authorization: `Bearer ${serviceKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            p_actor_id: auth.authUser.id,
            p_action: action,
            p_entity_type: "supplier_address",
            p_entity_id: addressId,
            p_payload: {
              supplier_id: supplierId,
              changes: updates,
              is_primary_pickup: refreshed.is_primary_pickup,
              is_primary_billing: refreshed.is_primary_billing,
            },
          }),
        });
      } catch (e) {
        // Audit log non-blocking
      }
    }

    return NextResponse.json({ address: refreshed });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal server error." },
      { status: 500 }
    );
  }
}
