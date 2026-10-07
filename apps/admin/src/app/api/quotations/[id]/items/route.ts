import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDatabaseConfig } from "@farmreem/database";

export async function POST(
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

    // Profile check
    const profileRes = await fetch(`${supabaseUrl}/rest/v1/users?id=eq.${authUser.id}&select=id,status`, {
      headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseServiceKey}` },
    });
    const profiles = await profileRes.json().catch(() => []);
    if (!profiles[0] || profiles[0].status !== "ACTIVE") {
      return NextResponse.json({ error: "Staff user is deactivated or suspended." }, { status: 403 });
    }

    const body = await request.json().catch(() => ({}));
    const { product_id, quantity, tax_rate_percent, notes } = body;

    if (!product_id || quantity === undefined || quantity === null) {
      return NextResponse.json({ error: "product_id and quantity are required." }, { status: 400 });
    }

    const numQty = Number(quantity);
    if (isNaN(numQty) || numQty <= 0) {
      return NextResponse.json({ error: "quantity must be greater than 0." }, { status: 400 });
    }

    const taxRate = tax_rate_percent !== undefined ? Number(tax_rate_percent) : 5.0; // Default 5% GST
    if (isNaN(taxRate) || taxRate < 0) {
      return NextResponse.json({ error: "tax_rate_percent must be non-negative." }, { status: 400 });
    }

    // Fetch parent quotation
    const qtnRes = await fetch(`${supabaseUrl}/rest/v1/quotations?id=eq.${id}&select=*`, {
      headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseServiceKey}` },
    });
    const qtn = (await qtnRes.json())[0];
    if (!qtn) return NextResponse.json({ error: "Parent quotation not found." }, { status: 404 });

    if (qtn.status !== "DRAFT" && qtn.status !== "INTERNAL_REJECTED") {
      return NextResponse.json({ error: `Cannot add items to quotation in status ${qtn.status}. Only DRAFT or INTERNAL_REJECTED quotations can be modified.` }, { status: 400 });
    }

    // Fetch Product for SKU & Name Snapshot
    const prodRes = await fetch(`${supabaseUrl}/rest/v1/products?id=eq.${product_id}&select=*`, {
      headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseServiceKey}` },
    });
    const product = (await prodRes.json())[0];
    if (!product || product.status !== "ACTIVE") {
      return NextResponse.json({ error: "Product not found or not active." }, { status: 400 });
    }

    // 1. Resolve Pricing from Pricing Engine V1
    const resolveRes = await fetch(`${supabaseUrl}/rest/v1/price_lists?list_type=eq.CUSTOMER_CONTRACT&customer_id=eq.${qtn.customer_id}&status=eq.ACTIVE&select=id,price_list_code`, {
      headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseServiceKey}` },
    });
    const contractLists = await resolveRes.json().catch(() => []);

    let matchedItem: any = null;
    let matchedListCode = "FR-PRC-BASE";
    let priceSourceType: "CUSTOMER_CONTRACT" | "BASE_SELLING" = "BASE_SELLING";

    if (contractLists.length > 0) {
      const cIds = contractLists.map((l: any) => l.id).join(",");
      const itemRes = await fetch(`${supabaseUrl}/rest/v1/price_list_items?price_list_id=in.(${cIds})&product_id=eq.${product_id}&is_superseded=eq.false&min_quantity=lte.${numQty}&effective_from=lte.${new Date().toISOString()}&or=(effective_to.is.null,effective_to.gt.${new Date().toISOString()})&order=min_quantity.desc&limit=1`, {
        headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseServiceKey}` },
      });
      const cItems = await itemRes.json().catch(() => []);
      if (cItems[0]) {
        matchedItem = cItems[0];
        priceSourceType = "CUSTOMER_CONTRACT";
        const l = contractLists.find((x: any) => x.id === matchedItem.price_list_id);
        if (l) matchedListCode = l.price_list_code;
      }
    }

    if (!matchedItem) {
      const baseListsRes = await fetch(`${supabaseUrl}/rest/v1/price_lists?list_type=eq.BASE_SELLING&status=eq.ACTIVE&select=id,price_list_code`, {
        headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseServiceKey}` },
      });
      const baseLists = await baseListsRes.json().catch(() => []);
      if (baseLists.length > 0) {
        const bIds = baseLists.map((l: any) => l.id).join(",");
        const itemRes = await fetch(`${supabaseUrl}/rest/v1/price_list_items?price_list_id=in.(${bIds})&product_id=eq.${product_id}&is_superseded=eq.false&min_quantity=lte.${numQty}&effective_from=lte.${new Date().toISOString()}&or=(effective_to.is.null,effective_to.gt.${new Date().toISOString()})&order=min_quantity.desc&limit=1`, {
          headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseServiceKey}` },
        });
        const bItems = await itemRes.json().catch(() => []);
        if (bItems[0]) {
          matchedItem = bItems[0];
          priceSourceType = "BASE_SELLING";
          const l = baseLists.find((x: any) => x.id === matchedItem.price_list_id);
          if (l) matchedListCode = l.price_list_code;
        }
      }
    }

    // 2. Reject if PRICE_NOT_AVAILABLE
    if (!matchedItem) {
      return NextResponse.json({
        error: "PRICE_NOT_AVAILABLE",
        message: "Pricing Engine V1 failed to resolve an orderable commercial price for this customer and product. Line creation rejected.",
      }, { status: 422 });
    }

    const unitPrice = Number(matchedItem.unit_price);

    // 3. Deterministic Tax Rounding
    const isInterstate = Boolean(qtn.is_interstate_supply);
    const taxableAmount = Math.round(numQty * unitPrice * 10000) / 10000;
    
    let cgstAmount = 0.0000;
    let sgstAmount = 0.0000;
    let igstAmount = 0.0000;

    if (isInterstate) {
      igstAmount = Math.round(taxableAmount * (taxRate / 100) * 10000) / 10000;
    } else {
      cgstAmount = Math.round(taxableAmount * (taxRate / 2 / 100) * 10000) / 10000;
      sgstAmount = Math.round(taxableAmount * (taxRate / 2 / 100) * 10000) / 10000;
    }

    const lineTaxTotal = Math.round((cgstAmount + sgstAmount + igstAmount) * 10000) / 10000;
    const lineGrandTotal = Math.round((taxableAmount + lineTaxTotal) * 10000) / 10000;

    const itemPayload = {
      quotation_id: id,
      product_id: product.id,
      product_sku_snapshot: product.sku,
      product_name_snapshot: product.name,
      product_category_snapshot: product.category,
      quantity: numQty,
      uom: matchedItem.uom || product.unit_of_measure,
      unit_price: unitPrice,
      currency: "INR",
      price_source_type: priceSourceType,
      price_list_id: matchedItem.price_list_id,
      price_list_code_snapshot: matchedListCode,
      price_list_item_id: matchedItem.id,
      pricing_version_snapshot: matchedItem.version || 1,
      pricing_resolved_at: new Date().toISOString(),
      tax_rate_percent: taxRate,
      taxable_amount: taxableAmount,
      cgst_amount: cgstAmount,
      sgst_amount: sgstAmount,
      igst_amount: igstAmount,
      line_tax_total: lineTaxTotal,
      line_grand_total: lineGrandTotal,
      notes: notes ? String(notes).trim() : null,
    };

    const insertRes = await fetch(`${supabaseUrl}/rest/v1/quotation_items`, {
      method: "POST",
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseServiceKey}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(itemPayload),
    });

    if (!insertRes.ok) {
      const errText = await insertRes.text();
      return NextResponse.json({ error: "Failed to create quotation line item.", details: errText }, { status: insertRes.status });
    }

    const createdItem = (await insertRes.json())[0];

    // 4. Recalculate Parent Quotation Financial Totals
    const allItemsRes = await fetch(`${supabaseUrl}/rest/v1/quotation_items?quotation_id=eq.${id}&select=taxable_amount,cgst_amount,sgst_amount,igst_amount,line_tax_total`, {
      headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseServiceKey}` },
    });
    const allItems = await allItemsRes.json().catch(() => []);

    let sumTaxable = 0, sumCgst = 0, sumSgst = 0, sumIgst = 0, sumTax = 0;
    allItems.forEach((it: any) => {
      sumTaxable += Number(it.taxable_amount || 0);
      sumCgst += Number(it.cgst_amount || 0);
      sumSgst += Number(it.sgst_amount || 0);
      sumIgst += Number(it.igst_amount || 0);
      sumTax += Number(it.line_tax_total || 0);
    });

    const docSubtotal = Math.round(sumTaxable * 100) / 100;
    const docCgst = Math.round(sumCgst * 100) / 100;
    const docSgst = Math.round(sumSgst * 100) / 100;
    const docIgst = Math.round(sumIgst * 100) / 100;
    const docTaxTotal = Math.round(sumTax * 100) / 100;
    const docGrandTotal = Math.round((docSubtotal + docTaxTotal) * 100) / 100;

    await fetch(`${supabaseUrl}/rest/v1/quotations?id=eq.${id}`, {
      method: "PATCH",
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseServiceKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subtotal: docSubtotal,
        cgst_total: docCgst,
        sgst_total: docSgst,
        igst_total: docIgst,
        tax_total: docTaxTotal,
        grand_total: docGrandTotal,
        updated_at: new Date().toISOString(),
      }),
    });

    return NextResponse.json({ item: createdItem, updated_totals: { subtotal: docSubtotal, tax_total: docTaxTotal, grand_total: docGrandTotal } }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to create quotation line item." }, { status: 500 });
  }
}
