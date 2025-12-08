import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { LeadsView } from "@/components/crm/leads-view"

export default async function LeadsPage() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // TEMPORARY: Skip auth check for now
  // if (!user) redirect("/auth/login")

  // Use actual user or mock user for development
  const currentUser = user || { id: 'dev-user', email: 'dev@example.com' } as any

  const { data: memberships } = await supabase.from("tenant_members").select("tenant_id").eq("user_id", currentUser.id)

  const tenantIds = memberships?.map((m) => m.tenant_id) || []

  const { data: leads } = await supabase
    .from("leads")
    .select(`
      *,
      owner:profiles!leads_owner_id_fkey(id, full_name, avatar_url),
      sdr_analysis:sdr_analyses(id, icp_match_score, recommendation)
    `)
    .in("tenant_id", tenantIds.length > 0 ? tenantIds : ["none"])
    .order("created_at", { ascending: false })

  return <LeadsView leads={leads || []} tenantId={tenantIds[0] || null} />
}
