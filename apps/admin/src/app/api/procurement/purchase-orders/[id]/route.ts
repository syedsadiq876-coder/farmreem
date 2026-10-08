import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDatabaseConfig } from "@farmreem/database";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const sessionToken =
      cookieStore.get("__Host-farmreem-admin-session")?.value ||
      cookieStore.get("farmreem_admin_dev_session")?.value;

    const authHeader = request.headers.get("authorization") || "";
    const bearerToken = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null;
    const token = sessionToken || bearerToken;

    if (!token) return NextResponse.json({ error: "Unauthenticated staff request." }, { status: 401 });

    const { id: po_id } = await params;
    const { supabaseUrl, supabaseAnonKey } = getDatabaseConfig();

    const poRes = await fetch(`${supabaseUrl}/rest/v1/purchase_orders?id=eq.${po_id}&select=*`, {
      headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${token}` },
    });
    const poList = await poRes.json().catch(() => []);
    const order = poList[0];

    if (!poRes.ok || !order) {
      return NextResponse.json({ error: "Purchase Order not found" }, { status: 404 });
    }

    const itemsRes = await fetch(`${supabaseUrl}/rest/v1/purchase_order_items?purchase_order_id=eq.${po_id}&select=*,orders:order_id(order_number)&order=created_at.asc`, {
      headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${token}` },
    });
    const items = await itemsRes.json().catch(() => []);

    const historyRes = await fetch(`${supabaseUrl}/rest/v1/po_status_history?purchase_order_id=eq.${po_id}&select=*,users:performed_by(full_name,email)&order=created_at.desc`, {
      headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${token}` },
    });
    const history = await historyRes.json().catch(() => []);

    return NextResponse.json({
      data: {
        ...order,
        items: items || [],
        history: history || [],
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
