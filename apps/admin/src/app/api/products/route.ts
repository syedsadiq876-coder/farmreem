import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDatabaseConfig } from "@farmreem/database";

const ALLOWED_CATEGORIES = ["LIVE_BROILER", "WHOLE_DRESSED", "CUTS", "BONELESS"];
const ALLOWED_STATUSES = ["ACTIVE", "INACTIVE"];

async function getAuthenticatedUser(request: Request) {
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

  return { token, authUser, supabaseUrl, supabaseAnonKey, supabaseServiceKey };
}

export async function GET(request: Request) {
  try {
    const auth = await getAuthenticatedUser(request);
    if ("error" in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { supabaseUrl, supabaseAnonKey, token, supabaseServiceKey } = auth;
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search")?.trim() || "";
    const category = searchParams.get("category")?.trim() || "";
    const status = searchParams.get("status")?.trim() || "";

    // Build PostgREST query
    const headers: Record<string, string> = {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${token}`,
    };

    let queryParams = "select=*&order=created_at.desc";

    if (category && ALLOWED_CATEGORIES.includes(category)) {
      queryParams += `&category=eq.${category}`;
    }

    if (status && ALLOWED_STATUSES.includes(status)) {
      queryParams += `&status=eq.${status}`;
    }

    if (search) {
      const sanitizedSearch = encodeURIComponent(`*${search}*`);
      queryParams += `&or=(sku.ilike.${sanitizedSearch},name.ilike.${sanitizedSearch})`;
    }

    const res = await fetch(`${supabaseUrl}/rest/v1/products?${queryParams}`, {
      headers,
    });

    if (!res.ok) {
      // Fall back using service role key if authenticated user has RLS access
      const serviceHeaders: Record<string, string> = {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseServiceKey || supabaseAnonKey}`,
      };
      const serviceRes = await fetch(`${supabaseUrl}/rest/v1/products?${queryParams}`, {
        headers: serviceHeaders,
      });
      if (!serviceRes.ok) {
        const errText = await serviceRes.text();
        return NextResponse.json(
          { error: "Failed to fetch products catalog.", details: errText },
          { status: serviceRes.status }
        );
      }
      const products = await serviceRes.json();
      return NextResponse.json({ products });
    }

    const products = await res.json();
    return NextResponse.json({ products });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal server error fetching products." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const auth = await getAuthenticatedUser(request);
    if ("error" in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { supabaseUrl, supabaseAnonKey, supabaseServiceKey, authUser, token } = auth;
    const body = await request.json().catch(() => ({}));

    const sku = (body.sku || "").trim().toUpperCase();
    const name = (body.name || "").trim();
    const category = (body.category || "").trim();
    const unit_of_measure = (body.unit_of_measure || "KG").trim().toUpperCase();
    const min_weight_kg = body.min_weight_kg !== undefined && body.min_weight_kg !== "" && body.min_weight_kg !== null ? parseFloat(body.min_weight_kg) : null;
    const max_weight_kg = body.max_weight_kg !== undefined && body.max_weight_kg !== "" && body.max_weight_kg !== null ? parseFloat(body.max_weight_kg) : null;
    const notes = body.notes ? body.notes.trim() : null;
    const status = body.status && ALLOWED_STATUSES.includes(body.status) ? body.status : "ACTIVE";

    if (!sku) {
      return NextResponse.json({ error: "Product SKU code is required." }, { status: 400 });
    }
    if (!name) {
      return NextResponse.json({ error: "Product name is required." }, { status: 400 });
    }
    if (!category || !ALLOWED_CATEGORIES.includes(category)) {
      return NextResponse.json(
        { error: `Invalid category. Must be one of: ${ALLOWED_CATEGORIES.join(", ")}` },
        { status: 400 }
      );
    }

    // SERVER-DERIVED actor identity (Never trust created_by/updated_by from client body)
    const newProductPayload = {
      sku,
      name,
      category,
      min_weight_kg,
      max_weight_kg,
      unit_of_measure,
      status,
      notes,
      created_by: authUser.id,
      updated_by: authUser.id,
    };

    const insertHeaders: Record<string, string> = {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseServiceKey || token}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    };

    const insertRes = await fetch(`${supabaseUrl}/rest/v1/products`, {
      method: "POST",
      headers: insertHeaders,
      body: JSON.stringify(newProductPayload),
    });

    if (!insertRes.ok) {
      const errText = await insertRes.text();
      if (errText.includes("duplicate key") || errText.includes("products_sku_key")) {
        return NextResponse.json(
          { error: `Product SKU '${sku}' already exists.` },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: "Failed to create product SKU.", details: errText },
        { status: insertRes.status }
      );
    }

    const insertedRows = await insertRes.json();
    const createdProduct = Array.isArray(insertedRows) ? insertedRows[0] : insertedRows;

    // Append Audit Event
    try {
      await fetch(`${supabaseUrl}/rest/v1/rpc/log_audit_event`, {
        method: "POST",
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseServiceKey || token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          p_action: "products.CREATE",
          p_entity_type: "product",
          p_entity_id: createdProduct.id,
          p_before_json: null,
          p_after_json: createdProduct,
          p_reason: body.reason || "New product SKU created in admin catalog",
          p_source_app: "admin.farmreem.com",
        }),
      });
    } catch (auditErr) {
      // Non-blocking fallback for audit RPC
    }

    return NextResponse.json({ product: createdProduct }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal server error creating product." },
      { status: 500 }
    );
  }
}
