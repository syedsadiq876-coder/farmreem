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

    const res = await fetch(`${supabaseUrl}/rest/v1/seller_tax_profiles?select=id,profile_code&limit=5`, {
      headers: serviceHeaders,
    });

    const tablesExist = res.ok;
    const profiles = res.ok ? await res.json() : [];

    return NextResponse.json({
      status: "SUCCESS",
      tablesExist,
      sellerTaxProfilesCount: profiles.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed seller tax profiles setup check." },
      { status: 500 }
    );
  }
}
