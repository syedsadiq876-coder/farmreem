-- =============================================================================
-- FARMREEM PLATFORM PHASE 1 — SUPER_ADMIN BOOTSTRAP MIGRATION
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

-- 2. Define Trigger Function to Automatically Link Supabase auth.users to public.users & user_roles
CREATE OR REPLACE FUNCTION public.handle_new_staff_user()
RETURNS TRIGGER AS $$
DECLARE
  v_role_id UUID;
BEGIN
  -- Insert into public.users with ACTIVE status and admin app_access claim
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
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Founder & Super Admin'),
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

  -- Assign SUPER_ADMIN role in public.user_roles
  SELECT id INTO v_role_id FROM public.roles WHERE code = 'SUPER_ADMIN';
  IF v_role_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role_id)
    VALUES (NEW.id, v_role_id)
    ON CONFLICT (user_id, role_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Attach Trigger to auth.users Table
DROP TRIGGER IF EXISTS trg_on_auth_user_created ON auth.users;
CREATE TRIGGER trg_on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_staff_user();

-- 4. Backfill/Link Pre-existing auth.users Record for ceo@farmreem.com
DO $$
DECLARE
  v_auth_user RECORD;
  v_role_id UUID;
BEGIN
  SELECT id, email INTO v_auth_user FROM auth.users WHERE LOWER(email) = LOWER('ceo@farmreem.com');
  IF v_auth_user.id IS NOT NULL THEN
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

    SELECT id INTO v_role_id FROM public.roles WHERE code = 'SUPER_ADMIN';
    IF v_role_id IS NOT NULL THEN
      INSERT INTO public.user_roles (user_id, role_id)
      VALUES (v_auth_user.id, v_role_id)
      ON CONFLICT (user_id, role_id) DO NOTHING;
    END IF;
  END IF;
END $$;
