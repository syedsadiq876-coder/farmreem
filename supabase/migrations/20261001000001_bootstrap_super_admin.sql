-- =============================================================================
-- FARMREEM PLATFORM PHASE 1 — SUPER_ADMIN BOOTSTRAP & UNPRIVILEGED USER TRIGGER
-- Migration Version: 20261001000001_bootstrap_super_admin.sql
-- Designated Founder Email: ceo@farmreem.com
-- =============================================================================

-- 1. Ensure SUPER_ADMIN Role Exists in Public Canonical Roles Table
INSERT INTO public.roles (code, name, description, is_internal)
VALUES (
  'SUPER_ADMIN',
  'Super Administrator',
  'Full operational and administrative authority across all FarmReem modules.',
  true
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- 2. Generic Trigger Function for New Auth Users (ZERO PRIVILEGES BY DEFAULT)
-- Any new auth user (e.g. sales@farmreem.com, accounts@farmreem.com) receives:
--   - status = 'SUSPENDED' (Unprovisioned state; blocked from login until admin activation)
--   - staff_role = NULL (No assigned role)
--   - user_roles = 0 records (No permissions in user_roles)
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (
    id,
    email,
    full_name,
    user_type,
    staff_role,
    status,
    metadata
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Unprovisioned Staff User'),
    'STAFF',
    NULL,           -- NO ROLE ASSIGNED
    'SUSPENDED',    -- UNPROVISIONED / PENDING STATE
    '{}'::jsonb     -- NO APP ACCESS CLAIMS BY DEFAULT
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Attach Unprivileged Trigger to auth.users Table
DROP TRIGGER IF EXISTS trg_on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS trg_on_auth_staff_created ON auth.users;

CREATE TRIGGER trg_on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();

-- 4. One-Time Idempotent Founder Bootstrap (EXPLICITLY FOR ceo@farmreem.com ONLY)
-- This block provisions ONLY ceo@farmreem.com as SUPER_ADMIN.
-- Running this block multiple times is 100% idempotent (zero duplicate role assignments).
DO $$
DECLARE
  v_auth_user RECORD;
  v_role_id UUID;
BEGIN
  -- Search for the specific founder identity in auth.users
  SELECT id, email INTO v_auth_user 
  FROM auth.users 
  WHERE LOWER(email) = LOWER('ceo@farmreem.com');

  IF v_auth_user.id IS NOT NULL THEN
    -- 4a. Update/Link public.users profile for ceo@farmreem.com ONLY
    INSERT INTO public.users (
      id,
      email,
      full_name,
      user_type,
      staff_role,
      status,
      metadata
    ) VALUES (
      v_auth_user.id,
      v_auth_user.email,
      'Founder & Super Admin',
      'STAFF',
      'SUPER_ADMIN',
      'ACTIVE',
      jsonb_build_object('app_access', jsonb_build_array('admin'))
    )
    ON CONFLICT (id) DO UPDATE SET
      status = 'ACTIVE',
      staff_role = 'SUPER_ADMIN',
      metadata = jsonb_build_object('app_access', jsonb_build_array('admin')),
      updated_at = NOW();

    -- 4b. Assign SUPER_ADMIN role in public.user_roles for ceo@farmreem.com ONLY
    SELECT id INTO v_role_id FROM public.roles WHERE code = 'SUPER_ADMIN';
    IF v_role_id IS NOT NULL THEN
      INSERT INTO public.user_roles (user_id, role_id)
      VALUES (v_auth_user.id, v_role_id)
      ON CONFLICT (user_id, role_id) DO NOTHING; -- Idempotent constraint
    END IF;
  END IF;
END $$;
