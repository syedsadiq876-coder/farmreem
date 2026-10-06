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

    // 1. Check customers table
    const customersRes = await fetch(`${supabaseUrl}/rest/v1/customers?select=id,customer_code&limit=5`, {
      headers: serviceHeaders,
    });

    // 2. Check contacts table
    const contactsRes = await fetch(`${supabaseUrl}/rest/v1/customer_contacts?select=id&limit=5`, {
      headers: serviceHeaders,
    });

    // 3. Check addresses table
    const addressesRes = await fetch(`${supabaseUrl}/rest/v1/customer_addresses?select=id&limit=5`, {
      headers: serviceHeaders,
    });

    const tablesExist = customersRes.ok && contactsRes.ok && addressesRes.ok;
    const customers = customersRes.ok ? await customersRes.json() : [];

    return NextResponse.json({
      status: "SUCCESS",
      tablesExist,
      customersCount: customers.length,
      customers,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed customers setup check." },
      { status: 500 }
    );
  }
}
