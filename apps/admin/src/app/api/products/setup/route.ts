import { NextResponse } from "next/server";
import { getDatabaseConfig } from "@farmreem/database";

const CANONICAL_PRODUCTS = [
  {
    sku: "FR-LB-S",
    name: "Live Broiler — Small",
    category: "LIVE_BROILER",
    min_weight_kg: 0.800,
    max_weight_kg: 1.000,
    unit_of_measure: "KG",
    status: "ACTIVE",
    notes: "Small live broiler bird (800 g–1.0 kg)",
  },
  {
    sku: "FR-LB-M",
    name: "Live Broiler — Medium",
    category: "LIVE_BROILER",
    min_weight_kg: 1.000,
    max_weight_kg: 1.400,
    unit_of_measure: "KG",
    status: "ACTIVE",
    notes: "Medium live broiler bird (1.0–1.4 kg)",
  },
  {
    sku: "FR-LB-L",
    name: "Live Broiler — Large",
    category: "LIVE_BROILER",
    min_weight_kg: 1.400,
    max_weight_kg: 1.800,
    unit_of_measure: "KG",
    status: "ACTIVE",
    notes: "Large live broiler bird (1.4–1.8 kg)",
  },
  {
    sku: "FR-WD",
    name: "Whole Dressed",
    category: "WHOLE_DRESSED",
    min_weight_kg: null,
    max_weight_kg: null,
    unit_of_measure: "KG",
    status: "ACTIVE",
    notes: "Fresh whole dressed chicken without entrails",
  },
  {
    sku: "FR-CUT",
    name: "Cuts",
    category: "CUTS",
    min_weight_kg: null,
    max_weight_kg: null,
    unit_of_measure: "KG",
    status: "ACTIVE",
    notes: "Standard commercial chicken cuts (thigh, drumstick, wing, breast)",
  },
  {
    sku: "FR-BNL",
    name: "Boneless",
    category: "BONELESS",
    min_weight_kg: null,
    max_weight_kg: null,
    unit_of_measure: "KG",
    status: "ACTIVE",
    notes: "Fresh boneless chicken meat",
  },
];

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
      Prefer: "return=representation",
    };

    // 1. Check if public.products table exists & fetch rows
    const checkRes = await fetch(`${supabaseUrl}/rest/v1/products?select=*&order=sku.asc`, {
      headers: serviceHeaders,
    });

    let existingProducts: any[] = [];
    let tableExists = checkRes.ok;

    if (tableExists) {
      existingProducts = await checkRes.json();
    }

    // 2. Seed missing canonical products if table exists
    const seedResults: Record<string, string> = {};
    if (tableExists) {
      for (const item of CANONICAL_PRODUCTS) {
        const found = existingProducts.find((p) => p.sku === item.sku);
        if (!found) {
          const insertRes = await fetch(`${supabaseUrl}/rest/v1/products`, {
            method: "POST",
            headers: serviceHeaders,
            body: JSON.stringify(item),
          });
          seedResults[item.sku] = insertRes.ok ? "SEEDED" : `FAILED (${insertRes.status})`;
        } else {
          seedResults[item.sku] = "EXISTS";
        }
      }
    }

    // 3. Re-query final rows
    const finalRes = await fetch(`${supabaseUrl}/rest/v1/products?select=*&order=sku.asc`, {
      headers: serviceHeaders,
    });
    const finalProducts = finalRes.ok ? await finalRes.json() : [];

    return NextResponse.json({
      status: "SUCCESS",
      tableExists,
      seededCount: finalProducts.length,
      seedResults,
      products: finalProducts,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed products setup check." },
      { status: 500 }
    );
  }
}
