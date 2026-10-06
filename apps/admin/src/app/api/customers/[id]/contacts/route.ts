import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDatabaseConfig } from "@farmreem/database";

const ALLOWED_CHANNELS = ["PHONE", "WHATSAPP", "EMAIL", "NONE"];

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

    const res = await fetch(
      `${supabaseUrl}/rest/v1/customer_contacts?customer_id=eq.${id}&order=is_primary.desc,created_at.desc`,
      {
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseServiceKey}`,
        },
      }
    );

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch customer contacts." }, { status: res.status });
    }

    const contacts = await res.json();
    return NextResponse.json({ contacts });
  } catch (error: any) {
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const auth = await getAuthenticatedUser(request, "customers.CREATE");
    if ("error" in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { supabaseUrl, supabaseAnonKey, supabaseServiceKey, authUser } = auth;
    const body = await request.json().catch(() => ({}));

    const full_name = (body.full_name || "").trim();
    const designation = body.designation ? body.designation.trim() : null;
    const email = body.email ? body.email.trim().toLowerCase() : null;
    const phone = body.phone ? body.phone.trim() : null;
    const is_primary = Boolean(body.is_primary);
    const preferred_channel = body.preferred_channel && ALLOWED_CHANNELS.includes(body.preferred_channel) ? body.preferred_channel : "PHONE";
    const notes = body.notes ? body.notes.trim() : null;

    if (!full_name) {
      return NextResponse.json({ error: "Contact full name is required." }, { status: 400 });
    }
    if (!email && !phone) {
      return NextResponse.json({ error: "At least one of email or phone is required for contact." }, { status: 400 });
    }

    const contactPayload = {
      customer_id: id,
      full_name,
      designation,
      email,
      phone,
      is_primary,
      preferred_channel,
      status: "ACTIVE",
      notes,
      created_by: authUser.id,
      updated_by: authUser.id,
    };

    const insertRes = await fetch(`${supabaseUrl}/rest/v1/customer_contacts`, {
      method: "POST",
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseServiceKey}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(contactPayload),
    });

    if (!insertRes.ok) {
      const errText = await insertRes.text();
      return NextResponse.json({ error: "Failed to create contact.", details: errText }, { status: insertRes.status });
    }

    const insertedRows = await insertRes.json();
    const createdContact = Array.isArray(insertedRows) ? insertedRows[0] : insertedRows;

    // If marked primary, invoke transactional primary contact RPC
    if (is_primary) {
      await fetch(`${supabaseUrl}/rest/v1/rpc/set_primary_customer_contact`, {
        method: "POST",
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseServiceKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          p_customer_id: id,
          p_contact_id: createdContact.id,
        }),
      });
    }

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
          p_action: "customer_contacts.CREATE",
          p_entity_type: "customer_contact",
          p_entity_id: createdContact.id,
          p_before_json: null,
          p_after_json: createdContact,
          p_reason: body.reason || "New customer contact added",
          p_source_app: "admin.farmreem.com",
        }),
      });
    } catch (e) {}

    return NextResponse.json({ contact: createdContact }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: "Internal server error creating contact." }, { status: 500 });
  }
}
