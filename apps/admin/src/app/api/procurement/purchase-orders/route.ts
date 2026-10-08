import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDatabaseConfig } from "@farmreem/database";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const supplierId = searchParams.get("supplier_id");
    const status = searchParams.get("status");

    const cookieStore = await cookies();
    const sessionToken =
      cookieStore.get("__Host-farmreem-admin-session")?.value ||
      cookieStore.get("farmreem_admin_dev_session")?.value;

    const authHeader = request.headers.get("authorization") || "";
    const bearerToken = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null;
    const token = sessionToken || bearerToken;

    if (!token) return NextResponse.json({ error: "Unauthenticated staff request." }, { status: 401 });

    const { supabaseUrl, supabaseAnonKey } = getDatabaseConfig();

    let url = `${supabaseUrl}/rest/v1/purchase_orders?select=*&order=created_at.desc`;
    if (supplierId) url += `&supplier_id=eq.${supplierId}`;
    if (status) url += `&status=eq.${status}`;

    const res = await fetch(url, {
      headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${token}` },
    });

    if (!res.ok) return NextResponse.json({ error: "Failed to fetch purchase orders." }, { status: res.status });

    const data = await res.json();
    return NextResponse.json({ data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
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

    const body = await request.json();
    const {
      allocation_ids,
      buyer_tax_profile_id,
      expected_pickup_date,
      notes,
    } = body;

    if (!allocation_ids || !Array.isArray(allocation_ids) || allocation_ids.length === 0 || !buyer_tax_profile_id || !expected_pickup_date) {
      return NextResponse.json({ error: "Missing required purchase order fields (allocation_ids, buyer_tax_profile_id, expected_pickup_date)" }, { status: 400 });
    }

    const { supabaseUrl, supabaseAnonKey } = getDatabaseConfig();

    const res = await fetch(`${supabaseUrl}/rest/v1/rpc/create_purchase_order_from_allocations`, {
      method: "POST",
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        p_allocation_ids: allocation_ids,
        p_buyer_tax_profile_id: buyer_tax_profile_id,
        p_expected_pickup_date: expected_pickup_date,
        p_notes: notes || null,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: data.message || data.error || "Failed to create purchase order" }, { status: res.status });
    }

    return NextResponse.json({ message: "Purchase order created successfully", result: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
