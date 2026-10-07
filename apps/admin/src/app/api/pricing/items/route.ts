import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDatabaseConfig } from "@farmreem/database";

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

    const profileRes = await fetch(`${supabaseUrl}/rest/v1/users?id=eq.${authUser.id}&select=id,status,staff_role`, {
      headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseServiceKey}` },
    });
    const profiles = await profileRes.json().catch(() => []);
    if (!profiles[0] || profiles[0].status !== "ACTIVE") {
      return NextResponse.json({ error: "Staff user is deactivated or suspended." }, { status: 403 });
    }

    const body = await request.json().catch(() => ({}));
    const { price_list_id, product_id, unit_price, min_quantity, effective_from, effective_to, notes } = body;

    if (!price_list_id || !product_id || unit_price === undefined || unit_price === null) {
      return NextResponse.json({ error: "price_list_id, product_id, and unit_price are required." }, { status: 400 });
    }

    const numPrice = Number(unit_price);
    if (isNaN(numPrice) || numPrice < 0) {
      return NextResponse.json({ error: "unit_price must be a non-negative number." }, { status: 400 });
    }

    const numMinQty = min_quantity !== undefined ? Number(min_quantity) : 1.0;
    if (isNaN(numMinQty) || numMinQty <= 0) {
      return NextResponse.json({ error: "min_quantity must be greater than 0." }, { status: 400 });
    }

    // Check parent price list
    const listRes = await fetch(`${supabaseUrl}/rest/v1/price_lists?id=eq.${price_list_id}&select=*`, {
      headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseServiceKey}` },
    });
    const parentList = (await listRes.json())[0];
    if (!parentList) return NextResponse.json({ error: "Parent price list not found." }, { status: 404 });

    if (parentList.status !== "DRAFT" && parentList.status !== "REJECTED") {
      return NextResponse.json({ error: `Cannot modify items in price list with status ${parentList.status}.` }, { status: 400 });
    }

    // Fetch product to snapshot UOM
    const productRes = await fetch(`${supabaseUrl}/rest/v1/products?id=eq.${product_id}&select=id,sku,name,unit_of_measure,status`, {
      headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseServiceKey}` },
    });
    const products = await productRes.json().catch(() => []);
    const product = products[0];

    if (!product || product.status !== "ACTIVE") {
      return NextResponse.json({ error: "Product not found or not active." }, { status: 400 });
    }

    const uomSnapshot = product.unit_of_measure;

    const insertPayload = {
      price_list_id,
      product_id,
      unit_price: numPrice,
      currency: "INR",
      uom: uomSnapshot,
      min_quantity: numMinQty,
      version: 1,
      is_superseded: false,
      effective_from: effective_from || parentList.effective_from || new Date().toISOString(),
      effective_to: effective_to || null,
      notes: notes ? String(notes).trim() : null,
      created_by: authUser.id,
      updated_by: authUser.id,
    };

    const itemRes = await fetch(`${supabaseUrl}/rest/v1/price_list_items`, {
      method: "POST",
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseServiceKey}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(insertPayload),
    });

    if (!itemRes.ok) {
      const errText = await itemRes.text();
      return NextResponse.json({ error: "Failed to create price list item.", details: errText }, { status: itemRes.status });
    }

    const createdItem = (await itemRes.json())[0];

    return NextResponse.json({ item: createdItem }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to create price list item." }, { status: 500 });
  }
}
