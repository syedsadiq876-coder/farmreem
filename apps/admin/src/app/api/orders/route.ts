import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDatabaseConfig } from "@farmreem/database";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

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

    // Profile check
    const profileRes = await fetch(`${supabaseUrl}/rest/v1/users?id=eq.${authUser.id}&select=id,status`, {
      headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseServiceKey}` },
    });
    const profiles = await profileRes.json().catch(() => []);
    if (!profiles[0] || profiles[0].status !== "ACTIVE") {
      return NextResponse.json({ error: "Staff user is deactivated or suspended." }, { status: 403 });
    }

    let url = `${supabaseUrl}/rest/v1/orders?select=*,customer:customers(id,legal_name,customer_code),creator:users!created_by(id,full_name,email)&order=created_at.desc`;
    if (status && status !== "ALL") {
      url += `&status=eq.${status}`;
    }

    const res = await fetch(url, {
      headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseServiceKey}` },
    });

    if (!res.ok) return NextResponse.json({ error: "Failed to fetch orders." }, { status: res.status });

    let orders = await res.json();

    if (search && Array.isArray(orders)) {
      const term = search.toLowerCase();
      orders = orders.filter(
        (o: any) =>
          o.order_number?.toLowerCase().includes(term) ||
          o.source_quotation_number_snapshot?.toLowerCase().includes(term) ||
          o.customer_legal_name_snapshot?.toLowerCase().includes(term)
      );
    }

    return NextResponse.json({ orders });
  } catch (error: any) {
    return NextResponse.json({ error: "Internal server error fetching orders." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { quotation_id, requested_delivery_date, special_instructions } = body;

    if (!quotation_id || !requested_delivery_date) {
      return NextResponse.json(
        { error: "quotation_id and requested_delivery_date are required." },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const sessionToken =
      cookieStore.get("__Host-farmreem-admin-session")?.value ||
      cookieStore.get("farmreem_admin_dev_session")?.value;

    const authHeader = request.headers.get("authorization") || "";
    const bearerToken = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null;
    const token = sessionToken || bearerToken;

    if (!token) return NextResponse.json({ error: "Unauthenticated staff request." }, { status: 401 });

    const { supabaseUrl, supabaseAnonKey, supabaseServiceKey } = getDatabaseConfig();

    // Authenticate user
    const authRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${token}` },
    });
    const authUser = await authRes.json().catch(() => null);
    if (!authRes.ok || !authUser?.id) return NextResponse.json({ error: "Invalid staff session." }, { status: 401 });

    // Invoke RPC function convert_quotation_to_sales_order with staff bearer token
    const rpcRes = await fetch(`${supabaseUrl}/rest/v1/rpc/convert_quotation_to_sales_order`, {
      method: "POST",
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        p_quotation_id: quotation_id,
        p_requested_delivery_date: new Date(requested_delivery_date).toISOString(),
        p_special_instructions: special_instructions || null,
      }),
    });

    const rpcData = await rpcRes.json().catch(() => null);

    if (!rpcRes.ok) {
      const errMsg = rpcData?.message || rpcData?.error || "Failed to convert quotation to sales order.";
      return NextResponse.json({ error: errMsg }, { status: rpcRes.status >= 400 && rpcRes.status < 500 ? rpcRes.status : 422 });
    }

    const orderId = typeof rpcData === "string" ? rpcData : rpcData?.id || rpcData;

    // Fetch newly created order
    const fetchRes = await fetch(`${supabaseUrl}/rest/v1/orders?id=eq.${orderId}&select=*,items:order_items(*)`, {
      headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseServiceKey}` },
    });
    const orders = await fetchRes.json().catch(() => []);
    const order = orders[0];

    return NextResponse.json({ order }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to convert quotation to order." }, { status: 500 });
  }
}
