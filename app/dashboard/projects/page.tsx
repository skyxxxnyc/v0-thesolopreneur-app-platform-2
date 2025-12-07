import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ProjectsView } from "@/components/crm/projects-view"

export default async function ProjectsPage() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: memberships } = await supabase.from("tenant_members").select("tenant_id").eq("user_id", user.id)

  const tenantIds = memberships?.map((m) => m.tenant_id) || []

  const { data: projects } = await supabase
    .from("projects")
    .select(`
      *,
      company:companies(id, name, domain),
      owner:profiles!projects_owner_id_fkey(id, full_name, avatar_url)
    `)
    .in("tenant_id", tenantIds.length > 0 ? tenantIds : ["none"])
    .order("created_at", { ascending: false })

  const { data: companies } = await supabase
    .from("companies")
    .select("id, name")
    .in("tenant_id", tenantIds.length > 0 ? tenantIds : ["none"])

  return <ProjectsView projects={projects || []} companies={companies || []} tenantId={tenantIds[0] || null} />
}
