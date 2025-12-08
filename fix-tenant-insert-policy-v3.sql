-- Fix RLS policies to allow tenant creation
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

-- Allow users to view tenants they are members of using the helper function
CREATE POLICY "Users can view their own tenants"
ON tenants
FOR SELECT
TO authenticated
USING (id IN (SELECT public.user_tenant_ids()));

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
