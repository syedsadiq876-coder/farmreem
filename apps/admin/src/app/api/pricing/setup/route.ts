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

    const listsRes = await fetch(`${supabaseUrl}/rest/v1/price_lists?select=id,price_list_code&limit=5`, {
      headers: serviceHeaders,
    });

    const itemsRes = await fetch(`${supabaseUrl}/rest/v1/price_list_items?select=id&limit=5`, {
      headers: serviceHeaders,
    });

    const marginRes = await fetch(`${supabaseUrl}/rest/v1/margin_rules?select=id,rule_code&limit=5`, {
      headers: serviceHeaders,
    });

    const tablesExist = listsRes.ok && itemsRes.ok && marginRes.ok;
    const priceLists = listsRes.ok ? await listsRes.json() : [];
    const items = itemsRes.ok ? await itemsRes.json() : [];
    const marginRules = marginRes.ok ? await marginRes.json() : [];

    return NextResponse.json({
      status: "SUCCESS",
      tablesExist,
      priceListsCount: priceLists.length,
      itemsCount: items.length,
      marginRulesCount: marginRules.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed pricing setup check." },
      { status: 500 }
    );
  }
}
