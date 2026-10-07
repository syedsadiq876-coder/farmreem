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

    const qtnRes = await fetch(
      `${supabaseUrl}/rest/v1/quotations?id=eq.${id}&select=*,customer:customers(id,legal_name,customer_code),contact:customer_contacts(id,full_name,email,phone),creator:users!created_by(id,full_name,email),approver:users!approved_by(id,full_name,email)`,
      { headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseServiceKey}` } }
    );

    if (!qtnRes.ok) return NextResponse.json({ error: "Failed to fetch quotation." }, { status: qtnRes.status });

    const qtns = await qtnRes.json();
    const quotation = qtns[0];
    if (!quotation) return NextResponse.json({ error: "Quotation not found." }, { status: 404 });

    // Fetch line items
    const itemsRes = await fetch(
      `${supabaseUrl}/rest/v1/quotation_items?quotation_id=eq.${id}&select=*&order=created_at.asc`,
      { headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseServiceKey}` } }
    );
    const items = itemsRes.ok ? await itemsRes.json() : [];

    // Fetch revision history family
    const rootId = quotation.root_quotation_id || quotation.id;
    const revsRes = await fetch(
      `${supabaseUrl}/rest/v1/quotations?root_quotation_id=eq.${rootId}&select=id,quotation_number,revision_number,status,created_at,issued_at&order=revision_number.asc`,
      { headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseServiceKey}` } }
    );
    const revisions = revsRes.ok ? await revsRes.json() : [];

    return NextResponse.json({ quotation, items, revisions });
  } catch (error: any) {
    return NextResponse.json({ error: "Internal server error fetching quotation detail." }, { status: 500 });
  }
}
