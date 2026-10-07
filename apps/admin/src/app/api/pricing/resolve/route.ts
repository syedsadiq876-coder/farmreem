import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDatabaseConfig } from "@farmreem/database";

export async function POST(request: Request) {
  try {
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

    const profileRes = await fetch(`${supabaseUrl}/rest/v1/users?id=eq.${authUser.id}&select=id,status`, {
      headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseServiceKey}` },
    });
    const profiles = await profileRes.json().catch(() => []);
    if (!profiles[0] || profiles[0].status !== "ACTIVE") {
      return NextResponse.json({ error: "Staff user is deactivated or suspended." }, { status: 403 });
    }

    const body = await request.json().catch(() => ({}));
    const { customer_id, product_id, quantity, target_date } = body;

    if (!product_id) {
      return NextResponse.json({ error: "product_id is required." }, { status: 400 });
    }

    const qty = quantity !== undefined ? Number(quantity) : 1.0;
    const dateTs = target_date || new Date().toISOString();

    // 1. Check Customer Contract Rate (Highest Precedence)
    if (customer_id) {
      const contractListsRes = await fetch(
        `${supabaseUrl}/rest/v1/price_lists?list_type=eq.CUSTOMER_CONTRACT&customer_id=eq.${customer_id}&status=eq.ACTIVE&select=id,price_list_code,list_type`,
        { headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseServiceKey}` } }
      );
      const contractLists = await contractListsRes.json().catch(() => []);

      if (contractLists.length > 0) {
        const listIds = contractLists.map((l: any) => l.id).join(",");
        const itemRes = await fetch(
          `${supabaseUrl}/rest/v1/price_list_items?price_list_id=in.(${listIds})&product_id=eq.${product_id}&is_superseded=eq.false&min_quantity=lte.${qty}&effective_from=lte.${dateTs}&or=(effective_to.is.null,effective_to.gt.${dateTs})&order=min_quantity.desc,created_at.desc&limit=1`,
          { headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseServiceKey}` } }
        );
        const items = await itemRes.json().catch(() => []);
        if (items && items[0]) {
          const item = items[0];
          const matchedList = contractLists.find((l: any) => l.id === item.price_list_id);
          return NextResponse.json({
            status: "SUCCESS",
            pricing_snapshot: {
              unit_price: Number(item.unit_price),
              currency: item.currency || "INR",
              uom: item.uom,
              price_list_id: item.price_list_id,
              price_list_code: matchedList?.price_list_code || "FR-PRC-CONTRACT",
              price_list_item_id: item.id,
              price_list_type: "CUSTOMER_CONTRACT",
              pricing_version: item.version || 1,
              min_quantity_tier: Number(item.min_quantity),
              resolved_at: new Date().toISOString(),
            },
          });
        }
      }
    }

    // 2. Check Approved Base Selling Price List (Second Precedence)
    const baseListsRes = await fetch(
      `${supabaseUrl}/rest/v1/price_lists?list_type=eq.BASE_SELLING&status=eq.ACTIVE&select=id,price_list_code,list_type`,
      { headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseServiceKey}` } }
    );
    const baseLists = await baseListsRes.json().catch(() => []);

    if (baseLists.length > 0) {
      const baseListIds = baseLists.map((l: any) => l.id).join(",");
      const baseItemRes = await fetch(
        `${supabaseUrl}/rest/v1/price_list_items?price_list_id=in.(${baseListIds})&product_id=eq.${product_id}&is_superseded=eq.false&min_quantity=lte.${qty}&effective_from=lte.${dateTs}&or=(effective_to.is.null,effective_to.gt.${dateTs})&order=min_quantity.desc,created_at.desc&limit=1`,
        { headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseServiceKey}` } }
      );
      const baseItems = await baseItemRes.json().catch(() => []);
      if (baseItems && baseItems[0]) {
        const item = baseItems[0];
        const matchedList = baseLists.find((l: any) => l.id === item.price_list_id);
        return NextResponse.json({
          status: "SUCCESS",
          pricing_snapshot: {
            unit_price: Number(item.unit_price),
            currency: item.currency || "INR",
            uom: item.uom,
            price_list_id: item.price_list_id,
            price_list_code: matchedList?.price_list_code || "FR-PRC-BASE",
            price_list_item_id: item.id,
            price_list_type: "BASE_SELLING",
            pricing_version: item.version || 1,
            min_quantity_tier: Number(item.min_quantity),
            resolved_at: new Date().toISOString(),
          },
        });
      }
    }

    // 3. Fallback: No commercial selling rate exists.
    // Cost + Margin NEVER silently becomes an orderable price.
    return NextResponse.json({
      status: "PRICE_NOT_AVAILABLE",
      pricing_snapshot: null,
      internal_recommendation: {
        reason: "RECOMMENDED_PRICE_REQUIRES_APPROVAL",
        message: "No active customer contract or base selling rate exists for this product. Authorized commercial price list approval is required before order placement.",
      },
    }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to resolve price." }, { status: 500 });
  }
}
