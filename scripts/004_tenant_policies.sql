-- Add tenant policies (depends on tenant_members)

-- Users can view tenants they belong to
CREATE POLICY "tenants_select" ON public.tenants
  FOR SELECT USING (
    id IN (
      SELECT tenant_id FROM public.tenant_members WHERE user_id = auth.uid()
    )
  );

-- Only authenticated users can create tenants
CREATE POLICY "tenants_insert" ON public.tenants
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Only agency_admin can update their tenant
CREATE POLICY "tenants_update" ON public.tenants
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.tenant_members
      WHERE tenant_id = tenants.id
      AND user_id = auth.uid()
      AND role IN ('agency_admin', 'super_admin')
    )
  );
