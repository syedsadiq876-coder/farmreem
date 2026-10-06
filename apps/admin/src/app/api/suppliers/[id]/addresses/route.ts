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

// GET /api/suppliers/[id]/addresses
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getAuthenticatedUser(request, "suppliers.VIEW");
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { id: supplierId } = await params;
  const serviceKey = auth.supabaseServiceKey || auth.supabaseAnonKey;

  try {
    const addressRes = await fetch(
      `${auth.supabaseUrl}/rest/v1/supplier_addresses?supplier_id=eq.${supplierId}&order=is_primary_pickup.desc,is_primary_billing.desc,created_at.asc`,
      {
        headers: {
          apikey: auth.supabaseAnonKey,
          Authorization: `Bearer ${serviceKey}`,
        },
      }
    );

    if (!addressRes.ok) {
      return NextResponse.json(
        { error: "Failed to fetch supplier addresses." },
        { status: addressRes.status }
      );
    }

    const addresses = await addressRes.json();
    return NextResponse.json({ addresses });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal server error." },
      { status: 500 }
    );
  }
}

// POST /api/suppliers/[id]/addresses
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getAuthenticatedUser(request, "suppliers.EDIT");
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { id: supplierId } = await params;
  const serviceKey = auth.supabaseServiceKey || auth.supabaseAnonKey;

  try {
    // 1. Verify supplier exists
    const suppCheck = await fetch(
      `${auth.supabaseUrl}/rest/v1/suppliers?id=eq.${supplierId}&select=id,supplier_code`,
      {
        headers: {
          apikey: auth.supabaseAnonKey,
          Authorization: `Bearer ${serviceKey}`,
        },
      }
    );

    if (!suppCheck.ok || (await suppCheck.json()).length === 0) {
      return NextResponse.json({ error: "Supplier not found." }, { status: 404 });
    }

    const body = await request.json();
    const {
      address_type = "PICKUP_SOURCE",
      address_line1,
      address_line2 = null,
      landmark = null,
      city,
      state,
      postal_code = null,
      country = "India",
      is_primary_pickup = false,
      is_primary_billing = false,
      notes = null,
    } = body;

    // Validation
    if (!address_line1 || typeof address_line1 !== "string" || !address_line1.trim()) {
      return NextResponse.json({ error: "Address line 1 is required." }, { status: 400 });
    }
    if (!city || typeof city !== "string" || !city.trim()) {
      return NextResponse.json({ error: "City is required." }, { status: 400 });
    }
    if (!state || typeof state !== "string" || !state.trim()) {
      return NextResponse.json({ error: "State is required." }, { status: 400 });
    }

    if (!ALLOWED_ADDRESS_TYPES.includes(address_type)) {
      return NextResponse.json(
        { error: `Invalid address_type. Must be one of: ${ALLOWED_ADDRESS_TYPES.join(", ")}` },
        { status: 400 }
      );
    }

    // Check consistency rules
    if (address_type === "BILLING" && is_primary_pickup) {
      return NextResponse.json(
        { error: "A BILLING-only address cannot be set as primary pickup." },
        { status: 400 }
      );
    }

    const insertPayload = {
      supplier_id: supplierId,
      address_type,
      address_line1: address_line1.trim(),
      address_line2: address_line2?.trim() || null,
      landmark: landmark?.trim() || null,
      city: city.trim(),
      state: state.trim(),
      postal_code: postal_code?.trim() || null,
      country: country.trim() || "India",
      is_primary_pickup: Boolean(is_primary_pickup),
      is_primary_billing: Boolean(is_primary_billing),
      status: "ACTIVE",
      notes: notes?.trim() || null,
      created_by: auth.authUser.id,
      updated_by: auth.authUser.id,
    };

    const insertRes = await fetch(`${auth.supabaseUrl}/rest/v1/supplier_addresses`, {
      method: "POST",
      headers: {
        apikey: auth.supabaseAnonKey,
        Authorization: `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(insertPayload),
    });

    if (!insertRes.ok) {
      const errText = await insertRes.text();
      return NextResponse.json(
        { error: `Failed to create address: ${errText}` },
        { status: insertRes.status }
      );
    }

    const [createdAddress] = await insertRes.json();

    // If primary flags set, trigger primary allocation RPCs
    if (is_primary_pickup) {
      await fetch(`${auth.supabaseUrl}/rest/v1/rpc/set_primary_supplier_address`, {
        method: "POST",
        headers: {
          apikey: auth.supabaseAnonKey,
          Authorization: `Bearer ${serviceKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          p_address_id: createdAddress.id,
          p_type: "PICKUP",
        }),
      });
    }

    if (is_primary_billing) {
      await fetch(`${auth.supabaseUrl}/rest/v1/rpc/set_primary_supplier_address`, {
        method: "POST",
        headers: {
          apikey: auth.supabaseAnonKey,
          Authorization: `Bearer ${serviceKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          p_address_id: createdAddress.id,
          p_type: "BILLING",
        }),
      });
    }

    // Fetch refreshed address
    const refRes = await fetch(
      `${auth.supabaseUrl}/rest/v1/supplier_addresses?id=eq.${createdAddress.id}`,
      {
        headers: {
          apikey: auth.supabaseAnonKey,
          Authorization: `Bearer ${serviceKey}`,
        },
      }
    );
    const refreshed = refRes.ok ? (await refRes.json())[0] || createdAddress : createdAddress;

    // Log audit event
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
          p_action: "supplier_addresses.CREATE",
          p_entity_type: "supplier_address",
          p_entity_id: refreshed.id,
          p_payload: {
            supplier_id: supplierId,
            address_type: refreshed.address_type,
            city: refreshed.city,
            state: refreshed.state,
            is_primary_pickup: refreshed.is_primary_pickup,
            is_primary_billing: refreshed.is_primary_billing,
          },
        }),
      });
    } catch (e) {
      // Audit log non-blocking
    }

    return NextResponse.json({ address: refreshed }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal server error." },
      { status: 500 }
    );
  }
}
