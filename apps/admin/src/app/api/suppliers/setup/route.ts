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

    // 1. Check suppliers table
    const suppliersRes = await fetch(`${supabaseUrl}/rest/v1/suppliers?select=id,supplier_code&limit=5`, {
      headers: serviceHeaders,
    });

    // 2. Check contacts table
    const contactsRes = await fetch(`${supabaseUrl}/rest/v1/supplier_contacts?select=id&limit=5`, {
      headers: serviceHeaders,
    });

    // 3. Check addresses table
    const addressesRes = await fetch(`${supabaseUrl}/rest/v1/supplier_addresses?select=id&limit=5`, {
      headers: serviceHeaders,
    });

    // 4. Fetch active staff users for procurement owner dropdown
    const staffRes = await fetch(
      `${supabaseUrl}/rest/v1/users?status=eq.ACTIVE&select=id,full_name,email,staff_role`,
      {
        headers: serviceHeaders,
      }
    );

    const tablesExist = suppliersRes.ok && contactsRes.ok && addressesRes.ok;
    const suppliers = suppliersRes.ok ? await suppliersRes.json() : [];
    const staffUsers = staffRes.ok ? await staffRes.json() : [];

    return NextResponse.json({
      status: "SUCCESS",
      tablesExist,
      suppliersCount: suppliers.length,
      suppliers,
      staffUsers,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed suppliers setup check." },
      { status: 500 }
    );
  }
}
