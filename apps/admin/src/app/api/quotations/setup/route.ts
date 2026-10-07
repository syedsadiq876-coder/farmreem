import { NextResponse } from "next/server";
import { getDatabaseConfig } from "@farmreem/database";

export async function GET() {
  try {
    const { supabaseUrl, supabaseAnonKey, supabaseServiceKey } = getDatabaseConfig();

    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
      return NextResponse.json({ error: "Missing Supabase configuration." }, { status: 500 });
    }

    const serviceHeaders: Record<string, string> = {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseServiceKey}`,
      "Content-Type": "application/json",
    };

    const qRes = await fetch(`${supabaseUrl}/rest/v1/quotations?select=id,quotation_number,revision_number,status&limit=5`, {
      headers: serviceHeaders,
    });

    const itemsRes = await fetch(`${supabaseUrl}/rest/v1/quotation_items?select=id,line_number,product_id&limit=5`, {
      headers: serviceHeaders,
    });

    const qData = qRes.ok ? await qRes.json() : await qRes.text();
    const itemsData = itemsRes.ok ? await itemsRes.json() : await itemsRes.text();
    const tablesExist = qRes.ok && itemsRes.ok;

    return NextResponse.json({
      status: "SUCCESS",
      tablesExist,
      qStatus: qRes.status,
      qData,
      itemsStatus: itemsRes.status,
      itemsData,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed quotations setup check." },
      { status: 500 }
    );
  }
}
