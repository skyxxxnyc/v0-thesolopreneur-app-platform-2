import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { CompaniesView } from "@/components/crm/companies-view"

export default async function CompaniesPage() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  // Get user's tenant memberships
  const { data: memberships } = await supabase.from("tenant_members").select("tenant_id").eq("user_id", user.id)

  const tenantIds = memberships?.map((m) => m.tenant_id) || []

  // Fetch companies for user's tenants
  const { data: companies } = await supabase
    .from("companies")
    .select(`
      *,
      owner:profiles!companies_owner_id_fkey(id, full_name, avatar_url)
    `)
    .in("tenant_id", tenantIds.length > 0 ? tenantIds : ["none"])
    .order("created_at", { ascending: false })

  return <CompaniesView companies={companies || []} tenantId={tenantIds[0] || null} />
}
