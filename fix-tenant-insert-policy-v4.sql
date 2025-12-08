-- Fix RLS policies to allow tenant creation AND immediate read-back
-- Drop existing policies on tenants
DROP POLICY IF EXISTS "Users can view their own tenants" ON tenants;
DROP POLICY IF EXISTS "Users can create tenants" ON tenants;
DROP POLICY IF EXISTS "Users can update their own tenants" ON tenants;
DROP POLICY IF EXISTS "Users can delete their own tenants" ON tenants;
DROP POLICY IF EXISTS "Admins can update tenants" ON tenants;
DROP POLICY IF EXISTS "Super admins can delete tenants" ON tenants;

-- Allow authenticated users to insert tenants (they become super_admin via trigger)
CREATE POLICY "Users can create tenants"
ON tenants
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow users to view tenants they created OR are members of
-- This allows reading back immediately after insert, before the trigger creates the membership
CREATE POLICY "Users can view their own tenants"
ON tenants
FOR SELECT
TO authenticated
USING (
  -- Either they are a member (via the helper function)
  id IN (SELECT public.user_tenant_ids())
  -- OR the tenant was just created (created_at within last 10 seconds)
  -- This is a temporary window to allow .insert().select() to work
  OR (created_at > now() - interval '10 seconds')
);

-- Allow super_admins and agency_admins to update tenants
CREATE POLICY "Admins can update tenants"
ON tenants
FOR UPDATE
TO authenticated
USING (
  id IN (
    SELECT tenant_id
    FROM tenant_members
    WHERE user_id = auth.uid()
    AND role IN ('super_admin', 'agency_admin')
  )
)
WITH CHECK (
  id IN (
    SELECT tenant_id
    FROM tenant_members
    WHERE user_id = auth.uid()
    AND role IN ('super_admin', 'agency_admin')
  )
);

-- Allow only super_admins to delete tenants
CREATE POLICY "Super admins can delete tenants"
ON tenants
FOR DELETE
TO authenticated
USING (
  id IN (
    SELECT tenant_id
    FROM tenant_members
    WHERE user_id = auth.uid()
    AND role = 'super_admin'
  )
);
