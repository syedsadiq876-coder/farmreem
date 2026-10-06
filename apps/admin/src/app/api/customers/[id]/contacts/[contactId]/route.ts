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

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; contactId: string }> }
) {
  try {
    const { id, contactId } = await params;
    const auth = await getAuthenticatedUser(request, "customers.EDIT");
    if ("error" in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { supabaseUrl, supabaseAnonKey, supabaseServiceKey, authUser } = auth;
    const body = await request.json().catch(() => ({}));

    // Verify contact belongs to parent customer
    const existingRes = await fetch(
      `${supabaseUrl}/rest/v1/customer_contacts?id=eq.${contactId}&customer_id=eq.${id}&select=*`,
      {
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseServiceKey}`,
        },
      }
    );

    if (!existingRes.ok) {
      return NextResponse.json({ error: "Failed to verify contact." }, { status: existingRes.status });
    }

    const existingRows = await existingRes.json();
    const existingContact = existingRows[0];
    if (!existingContact) {
      return NextResponse.json({ error: "Contact not found for this customer." }, { status: 404 });
    }

    const updatePayload: Record<string, any> = {
      updated_by: authUser.id,
      updated_at: new Date().toISOString(),
    };

    if (body.full_name !== undefined) {
      const name = String(body.full_name).trim();
      if (!name) return NextResponse.json({ error: "Full name cannot be empty." }, { status: 400 });
      updatePayload.full_name = name;
    }

    if (body.designation !== undefined) updatePayload.designation = body.designation ? String(body.designation).trim() : null;
    if (body.email !== undefined) updatePayload.email = body.email ? String(body.email).trim().toLowerCase() : null;
    if (body.phone !== undefined) updatePayload.phone = body.phone ? String(body.phone).trim() : null;
    if (body.preferred_channel !== undefined && ALLOWED_CHANNELS.includes(body.preferred_channel)) updatePayload.preferred_channel = body.preferred_channel;
    if (body.notes !== undefined) updatePayload.notes = body.notes ? String(body.notes).trim() : null;

    const isStatusChange = body.status !== undefined && body.status !== existingContact.status;
    if (body.status !== undefined) {
      if (body.status !== "ACTIVE" && body.status !== "INACTIVE") {
        return NextResponse.json({ error: "Invalid status." }, { status: 400 });
      }
      updatePayload.status = body.status;
    }

    const isPrimaryChange = body.is_primary !== undefined && Boolean(body.is_primary) !== existingContact.is_primary;
    if (body.is_primary !== undefined) {
      updatePayload.is_primary = Boolean(body.is_primary);
    }

    const updateRes = await fetch(`${supabaseUrl}/rest/v1/customer_contacts?id=eq.${contactId}`, {
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
      return NextResponse.json({ error: "Failed to update contact.", details: errText }, { status: updateRes.status });
    }

    const updatedRows = await updateRes.json();
    const updatedContact = Array.isArray(updatedRows) ? updatedRows[0] : updatedRows;

    // Transactional primary unsetting via RPC
    if (isPrimaryChange && updatedContact.is_primary) {
      await fetch(`${supabaseUrl}/rest/v1/rpc/set_primary_customer_contact`, {
        method: "POST",
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseServiceKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          p_customer_id: id,
          p_contact_id: contactId,
        }),
      });
    }

    // Log Audit Event
    try {
      const actionType = isPrimaryChange
        ? "customer_contacts.PRIMARY_CHANGE"
        : isStatusChange
        ? "customer_contacts.STATUS_CHANGE"
        : "customer_contacts.EDIT";

      await fetch(`${supabaseUrl}/rest/v1/rpc/log_audit_event`, {
        method: "POST",
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseServiceKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          p_action: actionType,
          p_entity_type: "customer_contact",
          p_entity_id: contactId,
          p_before_json: existingContact,
          p_after_json: updatedContact,
          p_reason: body.reason || "Customer contact updated",
          p_source_app: "admin.farmreem.com",
        }),
      });
    } catch (e) {}

    return NextResponse.json({ contact: updatedContact });
  } catch (error: any) {
    return NextResponse.json({ error: "Internal server error updating contact." }, { status: 500 });
  }
}
