import { NextResponse } from "next/server";
import { getDatabaseConfig } from "@farmreem/database";
import { Client } from "pg";

export async function GET() {
  try {
    const { supabaseUrl, supabaseAnonKey, supabaseServiceKey } = getDatabaseConfig();

    const dbUrl =
      process.env.DATABASE_URL ||
      process.env.POSTGRES_URL ||
      process.env.SUPABASE_DB_URL ||
      process.env.POSTGRES_URL_NON_POOLING;

    if (!dbUrl) {
      return NextResponse.json({
        status: "NO_DB_URL",
        message: "No DATABASE_URL or POSTGRES_URL found in process.env",
        availableKeys: Object.keys(process.env).filter(
          (k) => k.includes("POSTGRES") || k.includes("DATABASE") || k.includes("SUPABASE")
        ),
      });
    }

    const client = new Client({
      connectionString: dbUrl,
      ssl: { rejectUnauthorized: false },
    });

    await client.connect();

    const migrationSql = `
CREATE SEQUENCE IF NOT EXISTS public.supplier_code_seq START WITH 1 INCREMENT BY 1 NO MAXVALUE NO CYCLE;

CREATE OR REPLACE FUNCTION public.generate_supplier_code()
RETURNS VARCHAR
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    next_val BIGINT;
    formatted_code VARCHAR(20);
BEGIN
    SELECT nextval('public.supplier_code_seq') INTO next_val;
    formatted_code := 'FR-SUPP-' || LPAD(next_val::TEXT, 6, '0');
    RETURN formatted_code;
END;
$$;

DO $$ BEGIN
    CREATE TYPE public.supplier_type_enum AS ENUM (
        'POULTRY_FARM',
        'WHOLESALE_MANDI',
        'PARTNER_FARM',
        'PROCESSOR',
        'DISTRIBUTOR',
        'OTHER'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE public.sourcing_channel_enum AS ENUM (
        'DIRECT_FARM',
        'MANDI_TRADER',
        'CONTRACT_FARMING',
        'INTEGRATOR',
        'OTHER'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE public.supplier_status_enum AS ENUM (
        'PROSPECT',
        'PENDING_VERIFICATION',
        'ACTIVE',
        'ON_HOLD',
        'INACTIVE'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE public.supplier_verification_status_enum AS ENUM (
        'UNVERIFIED',
        'VERIFIED',
        'SUSPENDED'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE public.supplier_address_type_enum AS ENUM (
        'FARM_LOCATION',
        'MANDI_WAREHOUSE',
        'BILLING',
        'PICKUP_SOURCE',
        'OTHER'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supplier_code VARCHAR(20) NOT NULL UNIQUE DEFAULT public.generate_supplier_code(),
    legal_name VARCHAR(255) NOT NULL,
    trade_name VARCHAR(255) NULL,
    supplier_type public.supplier_type_enum NOT NULL DEFAULT 'POULTRY_FARM',
    sourcing_channel public.sourcing_channel_enum NOT NULL DEFAULT 'DIRECT_FARM',
    gstin VARCHAR(15) NULL,
    pan VARCHAR(10) NULL,
    status public.supplier_status_enum NOT NULL DEFAULT 'PROSPECT',
    verification_status public.supplier_verification_status_enum NOT NULL DEFAULT 'UNVERIFIED',
    assigned_procurement_owner_id UUID NULL REFERENCES public.users(id) ON DELETE SET NULL,
    notes TEXT NULL,
    created_by UUID NULL REFERENCES public.users(id) ON DELETE SET NULL,
    updated_by UUID NULL REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_supplier_gstin_format CHECK (gstin IS NULL OR gstin ~ '^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$'),
    CONSTRAINT chk_supplier_pan_format CHECK (pan IS NULL OR pan ~ '^[A-Z]{5}[0-9]{4}[A-Z]{1}$')
);

CREATE OR REPLACE FUNCTION public.prevent_supplier_code_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF OLD.supplier_code IS DISTINCT FROM NEW.supplier_code THEN
        RAISE EXCEPTION 'supplier_code is immutable and cannot be modified once generated.';
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_supplier_code_update ON public.suppliers;
CREATE TRIGGER trg_prevent_supplier_code_update
BEFORE UPDATE ON public.suppliers
FOR EACH ROW
EXECUTE FUNCTION public.prevent_supplier_code_update();

CREATE TABLE IF NOT EXISTS public.supplier_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supplier_id UUID NOT NULL REFERENCES public.suppliers(id) ON DELETE RESTRICT,
    contact_name VARCHAR(255) NOT NULL,
    designation VARCHAR(150) NULL,
    email VARCHAR(255) NULL,
    phone VARCHAR(50) NULL,
    is_primary BOOLEAN NOT NULL DEFAULT false,
    preferred_channel VARCHAR(20) NOT NULL DEFAULT 'PHONE' CHECK (preferred_channel IN ('PHONE', 'WHATSAPP', 'EMAIL', 'NONE')),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
    notes TEXT NULL,
    created_by UUID NULL REFERENCES public.users(id) ON DELETE SET NULL,
    updated_by UUID NULL REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_supplier_contact_email_or_phone CHECK (email IS NOT NULL OR phone IS NOT NULL)
);

CREATE TABLE IF NOT EXISTS public.supplier_addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supplier_id UUID NOT NULL REFERENCES public.suppliers(id) ON DELETE RESTRICT,
    address_type public.supplier_address_type_enum NOT NULL DEFAULT 'PICKUP_SOURCE',
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255) NULL,
    landmark VARCHAR(255) NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NULL,
    country VARCHAR(100) NOT NULL DEFAULT 'India',
    is_primary_pickup BOOLEAN NOT NULL DEFAULT false,
    is_primary_billing BOOLEAN NOT NULL DEFAULT false,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
    notes TEXT NULL,
    created_by UUID NULL REFERENCES public.users(id) ON DELETE SET NULL,
    updated_by UUID NULL REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_billing_address_not_pickup CHECK (NOT (address_type = 'BILLING' AND is_primary_pickup = true))
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_supplier_contacts_single_primary 
ON public.supplier_contacts (supplier_id) 
WHERE (is_primary = true AND status = 'ACTIVE');

CREATE UNIQUE INDEX IF NOT EXISTS idx_supplier_addresses_single_primary_pickup 
ON public.supplier_addresses (supplier_id) 
WHERE (is_primary_pickup = true AND status = 'ACTIVE');

CREATE UNIQUE INDEX IF NOT EXISTS idx_supplier_addresses_single_primary_billing 
ON public.supplier_addresses (supplier_id) 
WHERE (is_primary_billing = true AND status = 'ACTIVE');

CREATE UNIQUE INDEX IF NOT EXISTS idx_suppliers_unique_active_gstin 
ON public.suppliers (gstin) 
WHERE (gstin IS NOT NULL AND status != 'INACTIVE');

CREATE OR REPLACE FUNCTION public.set_primary_supplier_contact(
    p_contact_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_supplier_id UUID;
BEGIN
    SELECT supplier_id INTO v_supplier_id
    FROM public.supplier_contacts
    WHERE id = p_contact_id;

    IF v_supplier_id IS NULL THEN
        RAISE EXCEPTION 'Contact ID % does not exist.', p_contact_id;
    END IF;

    UPDATE public.supplier_contacts
    SET is_primary = false,
        updated_at = NOW()
    WHERE supplier_id = v_supplier_id
      AND is_primary = true;

    UPDATE public.supplier_contacts
    SET is_primary = true,
        status = 'ACTIVE',
        updated_at = NOW()
    WHERE id = p_contact_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.set_primary_supplier_address(
    p_address_id UUID,
    p_type VARCHAR
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_supplier_id UUID;
    v_address_type public.supplier_address_type_enum;
BEGIN
    SELECT supplier_id, address_type INTO v_supplier_id, v_address_type
    FROM public.supplier_addresses
    WHERE id = p_address_id;

    IF v_supplier_id IS NULL THEN
        RAISE EXCEPTION 'Address ID % does not exist.', p_address_id;
    END IF;

    IF p_type = 'PICKUP' THEN
        IF v_address_type = 'BILLING' THEN
            RAISE EXCEPTION 'BILLING address type cannot be set as primary pickup source.';
        END IF;

        UPDATE public.supplier_addresses
        SET is_primary_pickup = false,
            updated_at = NOW()
        WHERE supplier_id = v_supplier_id
          AND is_primary_pickup = true;

        UPDATE public.supplier_addresses
        SET is_primary_pickup = true,
            status = 'ACTIVE',
            updated_at = NOW()
        WHERE id = p_address_id;

    ELSIF p_type = 'BILLING' THEN
        UPDATE public.supplier_addresses
        SET is_primary_billing = false,
            updated_at = NOW()
        WHERE supplier_id = v_supplier_id
          AND is_primary_billing = true;

        UPDATE public.supplier_addresses
        SET is_primary_billing = true,
            status = 'ACTIVE',
            updated_at = NOW()
        WHERE id = p_address_id;
    ELSE
        RAISE EXCEPTION 'Invalid primary address type: %. Expected PICKUP or BILLING.', p_type;
    END IF;
END;
$$;

ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_addresses ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    DROP POLICY IF EXISTS "Staff authenticated users full access to suppliers" ON public.suppliers;
    CREATE POLICY "Staff authenticated users full access to suppliers" 
    ON public.suppliers FOR ALL TO authenticated 
    USING (true) WITH CHECK (true);
EXCEPTION WHEN OTHERS THEN NULL; END $$;

DO $$ BEGIN
    DROP POLICY IF EXISTS "Staff authenticated users full access to supplier_contacts" ON public.supplier_contacts;
    CREATE POLICY "Staff authenticated users full access to supplier_contacts" 
    ON public.supplier_contacts FOR ALL TO authenticated 
    USING (true) WITH CHECK (true);
EXCEPTION WHEN OTHERS THEN NULL; END $$;

DO $$ BEGIN
    DROP POLICY IF EXISTS "Staff authenticated users full access to supplier_addresses" ON public.supplier_addresses;
    CREATE POLICY "Staff authenticated users full access to supplier_addresses" 
    ON public.supplier_addresses FOR ALL TO authenticated 
    USING (true) WITH CHECK (true);
EXCEPTION WHEN OTHERS THEN NULL; END $$;
`;

    await client.query(migrationSql);
    await client.end();

    return NextResponse.json({
      status: "SUCCESS_PG_MIGRATION",
      message: "Suppliers module tables, sequence, triggers, functions, partial indexes, and RLS policies created via PG client.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed PG migration execution." },
      { status: 500 }
    );
  }
}
