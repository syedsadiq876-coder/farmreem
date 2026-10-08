import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDatabaseConfig } from "@farmreem/database";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const requirementId = searchParams.get("requirement_id");
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

    let url = `${supabaseUrl}/rest/v1/supplier_allocations?select=*,suppliers:supplier_id(id,supplier_code,legal_name),supplier_addresses:sourcing_address_id(id,address_line1,city,state),procurement_requirements:procurement_requirement_id(requirement_number,product_sku_snapshot,product_name_snapshot)&order=created_at.desc`;
    if (requirementId) url += `&procurement_requirement_id=eq.${requirementId}`;
    if (supplierId) url += `&supplier_id=eq.${supplierId}`;
    if (status) url += `&status=eq.${status}`;

    const res = await fetch(url, {
      headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${token}` },
    });

    if (!res.ok) return NextResponse.json({ error: "Failed to fetch allocations." }, { status: res.status });

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
      requirement_id,
      supplier_id,
      sourcing_address_id,
      allocated_quantity,
      negotiated_unit_cost,
      expected_pickup_date,
    } = body;

    if (!requirement_id || !supplier_id || !sourcing_address_id || !allocated_quantity || negotiated_unit_cost === undefined || !expected_pickup_date) {
      return NextResponse.json({ error: "Missing required allocation fields" }, { status: 400 });
    }

    const { supabaseUrl, supabaseAnonKey } = getDatabaseConfig();

    const res = await fetch(`${supabaseUrl}/rest/v1/rpc/create_supplier_allocation`, {
      method: "POST",
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        p_requirement_id: requirement_id,
        p_supplier_id: supplier_id,
        p_sourcing_address_id: sourcing_address_id,
        p_allocated_quantity: allocated_quantity,
        p_negotiated_unit_cost: negotiated_unit_cost,
        p_expected_pickup_date: expected_pickup_date,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: data.message || data.error || "Failed to create supplier allocation" }, { status: res.status });
    }

    return NextResponse.json({ message: "Supplier allocation created successfully", allocation_id: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
