import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DealsView } from "@/components/crm/deals-view"

export default async function DealsPage() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: memberships } = await supabase.from("tenant_members").select("tenant_id").eq("user_id", user.id)

  const tenantIds = memberships?.map((m) => m.tenant_id) || []

  const { data: deals } = await supabase
    .from("deals")
    .select(`
      *,
      company:companies(id, name, domain),
      contact:contacts(id, first_name, last_name),
      owner:profiles!deals_owner_id_fkey(id, full_name, avatar_url),
      qualifying_activity:activities(id, type, subject, created_at)
    `)
    .in("tenant_id", tenantIds.length > 0 ? tenantIds : ["none"])
    .order("created_at", { ascending: false })

  const { data: companies } = await supabase
    .from("companies")
    .select("id, name")
    .in("tenant_id", tenantIds.length > 0 ? tenantIds : ["none"])

  const { data: contacts } = await supabase
    .from("contacts")
    .select("id, first_name, last_name, company_id")
    .in("tenant_id", tenantIds.length > 0 ? tenantIds : ["none"])

  return (
    <DealsView
      deals={deals || []}
      companies={companies || []}
      contacts={contacts || []}
      tenantId={tenantIds[0] || null}
    />
  )
}
