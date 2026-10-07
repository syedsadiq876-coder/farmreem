import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDatabaseConfig } from "@farmreem/database";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const orderRes = await fetch(
      `${supabaseUrl}/rest/v1/orders?id=eq.${id}&select=*,customer:customers(id,legal_name,customer_code),contact:customer_contacts(id,full_name,email,phone),creator:users!created_by(id,full_name,email),confirmer:users!confirmed_by(id,full_name,email),canceller:users!cancelled_by(id,full_name,email)`,
      { headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseServiceKey}` } }
    );

    if (!orderRes.ok) return NextResponse.json({ error: "Failed to fetch order detail." }, { status: orderRes.status });

    const orders = await orderRes.json();
    const order = orders[0];
    if (!order) return NextResponse.json({ error: "Sales order not found." }, { status: 404 });

    // Fetch line items
    const itemsRes = await fetch(
      `${supabaseUrl}/rest/v1/order_items?order_id=eq.${id}&select=*&order=line_number.asc`,
      { headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseServiceKey}` } }
    );
    const items = itemsRes.ok ? await itemsRes.json() : [];

    // Fetch order status history
    const historyRes = await fetch(
      `${supabaseUrl}/rest/v1/order_status_history?order_id=eq.${id}&select=*,changer:users!changed_by(id,full_name,email)&order=created_at.asc`,
      { headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseServiceKey}` } }
    );
    const history = historyRes.ok ? await historyRes.json() : [];

    return NextResponse.json({ order, items, history });
  } catch (error: any) {
    return NextResponse.json({ error: "Internal server error fetching order detail." }, { status: 500 });
  }
}
