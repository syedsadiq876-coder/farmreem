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
  requiredPermission?: "settings.VIEW" | "settings.EDIT"
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
          p_module: "settings",
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
    const auth = await getAuthenticatedUser(request, "settings.VIEW");
    if ("error" in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { supabaseUrl, supabaseAnonKey, supabaseServiceKey } = auth;

    const res = await fetch(`${supabaseUrl}/rest/v1/seller_tax_profiles?select=*,organization:organizations(id,legal_name)&order=created_at.desc`, {
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseServiceKey}`,
      },
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json({ error: "Failed to fetch seller tax profiles.", details: errText }, { status: res.status });
    }

    const profiles = await res.json();
    return NextResponse.json({ seller_tax_profiles: profiles });
  } catch (error: any) {
    return NextResponse.json({ error: "Internal server error fetching seller tax profiles." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const auth = await getAuthenticatedUser(request, "settings.EDIT");
    if ("error" in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { supabaseUrl, supabaseAnonKey, supabaseServiceKey, authUser } = auth;
    const body = await request.json().catch(() => ({}));

    const {
      organization_id,
      legal_entity_name,
      trade_name,
      gstin,
      pan,
      registered_address_line1,
      registered_address_line2,
      city,
      state_name,
      gst_state_code,
      postal_code,
      country,
      is_primary_seller,
    } = body;

    if (!organization_id) return NextResponse.json({ error: "organization_id is required." }, { status: 400 });
    if (!legal_entity_name || !String(legal_entity_name).trim()) return NextResponse.json({ error: "legal_entity_name is required." }, { status: 400 });

    const trimmedGstin = String(gstin || "").trim().toUpperCase();
    if (!trimmedGstin || trimmedGstin.length !== 15) {
      return NextResponse.json({ error: "Valid 15-character GSTIN is required." }, { status: 400 });
    }

    const stateCode = String(gst_state_code || "").trim();
    if (!stateCode || stateCode.length !== 2) {
      return NextResponse.json({ error: "Valid 2-digit GST state code is required." }, { status: 400 });
    }

    if (trimmedGstin.substring(0, 2) !== stateCode) {
      return NextResponse.json({
        error: `GSTIN prefix ('${trimmedGstin.substring(0, 2)}') must match GST state code ('${stateCode}').`,
      }, { status: 400 });
    }

    if (!registered_address_line1 || !city || !state_name || !postal_code) {
      return NextResponse.json({ error: "Complete registered address fields (line1, city, state_name, postal_code) are required." }, { status: 400 });
    }

    // Verify organization exists
    const orgRes = await fetch(`${supabaseUrl}/rest/v1/organizations?id=eq.${organization_id}&select=id`, {
      headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseServiceKey}` },
    });
    const orgs = await orgRes.json().catch(() => []);
    if (!orgs[0]) {
      return NextResponse.json({ error: "Linked organization record not found." }, { status: 404 });
    }

    // If setting as primary seller, unset previous primary for this organization
    if (is_primary_seller) {
      await fetch(`${supabaseUrl}/rest/v1/seller_tax_profiles?organization_id=eq.${organization_id}&is_primary_seller=eq.true`, {
        method: "PATCH",
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseServiceKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_primary_seller: false }),
      });
    }

    const insertPayload = {
      organization_id,
      legal_entity_name: String(legal_entity_name).trim(),
      trade_name: trade_name ? String(trade_name).trim() : null,
      gstin: trimmedGstin,
      pan: pan ? String(pan).trim().toUpperCase() : null,
      registered_address_line1: String(registered_address_line1).trim(),
      registered_address_line2: registered_address_line2 ? String(registered_address_line2).trim() : null,
      city: String(city).trim(),
      state_name: String(state_name).trim(),
      gst_state_code: stateCode,
      postal_code: String(postal_code).trim(),
      country: country ? String(country).trim() : "India",
      is_primary_seller: Boolean(is_primary_seller),
      is_active: true,
      verification_status: "DRAFT",
      created_by: authUser.id,
      updated_by: authUser.id,
    };

    const insertRes = await fetch(`${supabaseUrl}/rest/v1/seller_tax_profiles`, {
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
      return NextResponse.json({ error: "Failed to create seller tax profile.", details: errText }, { status: insertRes.status });
    }

    const createdProfile = (await insertRes.json())[0];

    // Audit Event
    try {
      await fetch(`${supabaseUrl}/rest/v1/rpc/log_audit_event`, {
        method: "POST",
        headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseServiceKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          p_action: "seller_tax.CREATE",
          p_entity_type: "seller_tax_profile",
          p_entity_id: createdProfile.id,
          p_before_json: null,
          p_after_json: createdProfile,
          p_reason: `Created seller tax profile: ${createdProfile.legal_entity_name} (${createdProfile.gstin})`,
          p_source_app: "admin.farmreem.com",
        }),
      });
    } catch (e) {}

    return NextResponse.json({ seller_tax_profile: createdProfile }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: "Internal server error creating seller tax profile." }, { status: 500 });
  }
}
