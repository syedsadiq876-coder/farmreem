import { NextResponse } from "next/server";
import { getDatabaseConfig } from "@farmreem/database";

const QUOTATIONS_DDL = `
-- Create quotation family sequence
CREATE SEQUENCE IF NOT EXISTS public.quotation_number_seq
  START WITH 1
  INCREMENT BY 1
  NO MINVALUE
  NO MAXVALUE
  CACHE 1;

CREATE OR REPLACE FUNCTION public.generate_quotation_number()
RETURNS VARCHAR
LANGUAGE plpgsql
AS $$
DECLARE
  seq_val BIGINT;
  formatted_code VARCHAR;
BEGIN
  seq_val := nextval('public.quotation_number_seq');
  formatted_code := 'FR-QTN-' || LPAD(seq_val::TEXT, 6, '0');
  RETURN formatted_code;
END;
$$;

-- Create public.quotations table
CREATE TABLE IF NOT EXISTS public.quotations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quotation_number VARCHAR(32) NOT NULL,
  revision_number INTEGER NOT NULL DEFAULT 1,
  root_quotation_id UUID REFERENCES public.quotations(id) ON DELETE RESTRICT,
  parent_quotation_id UUID REFERENCES public.quotations(id) ON DELETE RESTRICT,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE RESTRICT,
  status VARCHAR(32) NOT NULL DEFAULT 'DRAFT'
    CHECK (status IN (
      'DRAFT',
      'PENDING_APPROVAL',
      'APPROVED',
      'INTERNAL_REJECTED',
      'SENT',
      'ACCEPTED',
      'DECLINED',
      'EXPIRED',
      'SUPERSEDED',
      'CANCELLED'
    )),
  currency VARCHAR(3) NOT NULL DEFAULT 'INR',
  subtotal NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
  tax_total NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
  grand_total NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
  place_of_supply_state_code VARCHAR(2) NOT NULL,
  place_of_supply_state_name VARCHAR(64),
  seller_tax_profile_id UUID REFERENCES public.seller_tax_profiles(id) ON DELETE RESTRICT,
  seller_legal_name_snapshot VARCHAR(255),
  seller_trade_name_snapshot VARCHAR(255),
  seller_gstin_snapshot VARCHAR(15),
  seller_registered_address_snapshot TEXT,
  seller_state_name_snapshot VARCHAR(64),
  seller_state_code_snapshot VARCHAR(2),
  valid_until TIMESTAMPTZ NOT NULL,
  notes TEXT,
  terms_and_conditions TEXT,
  converted_order_id UUID UNIQUE,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  approved_at TIMESTAMPTZ,
  issued_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  accepted_at TIMESTAMPTZ,

  CONSTRAINT uq_quotation_family_revision UNIQUE (quotation_number, revision_number)
);

CREATE INDEX IF NOT EXISTS idx_quotations_root_id ON public.quotations(root_quotation_id);
CREATE INDEX IF NOT EXISTS idx_quotations_customer_id ON public.quotations(customer_id);
CREATE INDEX IF NOT EXISTS idx_quotations_status ON public.quotations(status);

-- Create public.quotation_items table
CREATE TABLE IF NOT EXISTS public.quotation_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quotation_id UUID NOT NULL REFERENCES public.quotations(id) ON DELETE CASCADE,
  line_number INTEGER NOT NULL,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  product_name_snapshot VARCHAR(255) NOT NULL,
  sku_snapshot VARCHAR(64) NOT NULL,
  uom_snapshot VARCHAR(32) NOT NULL,
  quantity NUMERIC(15, 4) NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(15, 2) NOT NULL CHECK (unit_price >= 0),
  price_list_id UUID REFERENCES public.price_lists(id) ON DELETE RESTRICT,
  price_list_code_snapshot VARCHAR(32),
  taxable_amount NUMERIC(15, 4) NOT NULL CHECK (taxable_amount >= 0),
  tax_classification VARCHAR(16) NOT NULL CHECK (tax_classification IN ('INTRA_STATE', 'INTER_STATE')),
  cgst_rate_percent NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
  cgst_amount NUMERIC(15, 4) NOT NULL DEFAULT 0.0000,
  sgst_rate_percent NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
  sgst_amount NUMERIC(15, 4) NOT NULL DEFAULT 0.0000,
  igst_rate_percent NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
  igst_amount NUMERIC(15, 4) NOT NULL DEFAULT 0.0000,
  tax_total_amount NUMERIC(15, 4) NOT NULL DEFAULT 0.0000,
  line_total_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),

  CONSTRAINT uq_quotation_line_number UNIQUE (quotation_id, line_number)
);

CREATE INDEX IF NOT EXISTS idx_quotation_items_quotation_id ON public.quotation_items(quotation_id);

ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotation_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Staff full access to quotations" ON public.quotations;
CREATE POLICY "Staff full access to quotations" ON public.quotations
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Staff full access to quotation items" ON public.quotation_items;
CREATE POLICY "Staff full access to quotation items" ON public.quotation_items
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
`;

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

    let qRes = await fetch(`${supabaseUrl}/rest/v1/quotations?select=id,quotation_number,revision_number,status&limit=5`, {
      headers: serviceHeaders,
    });

    let itemsRes = await fetch(`${supabaseUrl}/rest/v1/quotation_items?select=id,line_number,product_id&limit=5`, {
      headers: serviceHeaders,
    });

    let migrationExecuted = false;
    let ddlResponse = null;

    if (!qRes.ok || !itemsRes.ok) {
      // Attempt executing DDL via pg endpoint
      const ddlRes = await fetch(`${supabaseUrl}/pg/v1/query`, {
        method: "POST",
        headers: serviceHeaders,
        body: JSON.stringify({ query: QUOTATIONS_DDL }),
      });

      ddlResponse = ddlRes.status;
      if (ddlRes.ok) {
        migrationExecuted = true;

        // Re-check tables
        qRes = await fetch(`${supabaseUrl}/rest/v1/quotations?select=id,quotation_number,revision_number,status&limit=5`, {
          headers: serviceHeaders,
        });
        itemsRes = await fetch(`${supabaseUrl}/rest/v1/quotation_items?select=id,line_number,product_id&limit=5`, {
          headers: serviceHeaders,
        });
      }
    }

    const quotations = qRes.ok ? await qRes.json() : [];
    const items = itemsRes.ok ? await itemsRes.json() : [];

    return NextResponse.json({
      status: "SUCCESS",
      tablesExist: qRes.ok && itemsRes.ok,
      migrationExecuted,
      ddlResponse,
      quotationsCount: Array.isArray(quotations) ? quotations.length : 0,
      itemsCount: Array.isArray(items) ? items.length : 0,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed quotations setup check." },
      { status: 500 }
    );
  }
}
