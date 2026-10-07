import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDatabaseConfig } from "@farmreem/database";

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionToken =
      cookieStore.get("__Host-farmreem-admin-session")?.value ||
      cookieStore.get("farmreem_admin_dev_session")?.value;

    const authHeader = request.headers.get("authorization") || "";
    const bearerToken = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null;
    const token = sessionToken || bearerToken;

    if (!token) return NextResponse.json({ error: "Unauthenticated staff request." }, { status: 401 });

    const { supabaseUrl, supabaseAnonKey, supabaseServiceKey } = getDatabaseConfig();

    const authRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${token}` },
    });
    const authUser = await authRes.json().catch(() => null);
    if (!authRes.ok || !authUser?.id) return NextResponse.json({ error: "Invalid staff session." }, { status: 401 });

    const profileRes = await fetch(`${supabaseUrl}/rest/v1/users?id=eq.${authUser.id}&select=id,status`, {
      headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseServiceKey}` },
    });
    const profiles = await profileRes.json().catch(() => []);
    if (!profiles[0] || profiles[0].status !== "ACTIVE") {
      return NextResponse.json({ error: "Staff user is deactivated or suspended." }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const scope = searchParams.get("scope");
    const isActive = searchParams.get("is_active");

    let query = `${supabaseUrl}/rest/v1/margin_rules?select=*,product:products(id,sku,name),customer:customers(id,legal_name,customer_code)&order=created_at.desc`;

    if (scope) query += `&scope=eq.${scope}`;
    if (isActive !== null && isActive !== undefined) query += `&is_active=eq.${isActive}`;

    const res = await fetch(query, {
      headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseServiceKey}` },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch margin rules." }, { status: res.status });
    }

    const marginRules = await res.json();
    return NextResponse.json({ margin_rules: marginRules });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch margin rules." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionToken =
      cookieStore.get("__Host-farmreem-admin-session")?.value ||
      cookieStore.get("farmreem_admin_dev_session")?.value;

    const authHeader = request.headers.get("authorization") || "";
    const bearerToken = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null;
    const token = sessionToken || bearerToken;

    if (!token) return NextResponse.json({ error: "Unauthenticated staff request." }, { status: 401 });

    const { supabaseUrl, supabaseAnonKey, supabaseServiceKey } = getDatabaseConfig();

    const authRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${token}` },
    });
    const authUser = await authRes.json().catch(() => null);
    if (!authRes.ok || !authUser?.id) return NextResponse.json({ error: "Invalid staff session." }, { status: 401 });

    const profileRes = await fetch(`${supabaseUrl}/rest/v1/users?id=eq.${authUser.id}&select=id,status`, {
      headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseServiceKey}` },
    });
    const profiles = await profileRes.json().catch(() => []);
    if (!profiles[0] || profiles[0].status !== "ACTIVE") {
      return NextResponse.json({ error: "Staff user is deactivated or suspended." }, { status: 403 });
    }

    const body = await request.json().catch(() => ({}));
    const { name, scope, margin_type, margin_value, product_id, product_category, customer_id, effective_from, effective_to, notes } = body;

    const nameStr = String(name || "").trim();
    if (!nameStr) return NextResponse.json({ error: "Margin rule name is required." }, { status: 400 });

    if (!["CUSTOMER_SPECIFIC", "PRODUCT_SPECIFIC", "CATEGORY", "GLOBAL"].includes(scope)) {
      return NextResponse.json({ error: "Invalid margin scope." }, { status: 400 });
    }

    if (!["PERCENTAGE_MARKUP", "FIXED_MARKUP_INR", "PERCENTAGE_MARGIN", "MINIMUM_FLOOR_PRICE"].includes(margin_type)) {
      return NextResponse.json({ error: "Invalid margin type." }, { status: 400 });
    }

    const val = Number(margin_value);
    if (isNaN(val)) return NextResponse.json({ error: "margin_value must be a valid number." }, { status: 400 });

    // Validate Scope Field Consistency
    if (scope === "CUSTOMER_SPECIFIC" && (!customer_id || !product_id || product_category)) {
      return NextResponse.json({ error: "CUSTOMER_SPECIFIC scope requires both customer_id and product_id, and product_category must be null." }, { status: 400 });
    }

    if (scope === "PRODUCT_SPECIFIC" && (!product_id || customer_id || product_category)) {
      return NextResponse.json({ error: "PRODUCT_SPECIFIC scope requires product_id, and customer_id & product_category must be null." }, { status: 400 });
    }

    if (scope === "CATEGORY" && (!product_category || customer_id || product_id)) {
      return NextResponse.json({ error: "CATEGORY scope requires product_category, and customer_id & product_id must be null." }, { status: 400 });
    }

    if (scope === "GLOBAL" && (customer_id || product_id || product_category)) {
      return NextResponse.json({ error: "GLOBAL scope requires customer_id, product_id, and product_category to all be null." }, { status: 400 });
    }

    const insertPayload = {
      name: nameStr,
      scope,
      margin_type,
      margin_value: val,
      product_id: scope === "CUSTOMER_SPECIFIC" || scope === "PRODUCT_SPECIFIC" ? product_id : null,
      customer_id: scope === "CUSTOMER_SPECIFIC" ? customer_id : null,
      product_category: scope === "CATEGORY" ? product_category : null,
      is_active: true,
      effective_from: effective_from || new Date().toISOString(),
      effective_to: effective_to || null,
      notes: notes ? String(notes).trim() : null,
      created_by: authUser.id,
      updated_by: authUser.id,
    };

    const res = await fetch(`${supabaseUrl}/rest/v1/margin_rules`, {
      method: "POST",
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseServiceKey}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(insertPayload),
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json({ error: "Failed to create margin rule.", details: errText }, { status: res.status });
    }

    const createdRule = (await res.json())[0];

    // Audit Event
    try {
      await fetch(`${supabaseUrl}/rest/v1/rpc/log_audit_event`, {
        method: "POST",
        headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseServiceKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          p_action: "pricing.CREATE",
          p_entity_type: "margin_rule",
          p_entity_id: createdRule.id,
          p_before_json: null,
          p_after_json: createdRule,
          p_reason: `Created ${scope} margin rule: ${nameStr}`,
          p_source_app: "admin.farmreem.com",
        }),
      });
    } catch (e) {}

    return NextResponse.json({ margin_rule: createdRule }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to create margin rule." }, { status: 500 });
  }
}
