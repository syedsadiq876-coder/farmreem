import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDatabaseConfig } from "@farmreem/database";

export async function POST(
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
    const body = await request.json().catch(() => ({}));
    const { override_reason } = body;

    const { supabaseUrl, supabaseAnonKey } = getDatabaseConfig();

    const res = await fetch(`${supabaseUrl}/rest/v1/rpc/approve_purchase_order`, {
      method: "POST",
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        p_po_id: po_id,
        p_override_reason: override_reason || null,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: data.message || data.error || "Failed to approve purchase order" }, { status: res.status });
    }

    return NextResponse.json({ message: "Purchase Order approved successfully" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
