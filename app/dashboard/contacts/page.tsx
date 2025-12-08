import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ContactsView } from "@/components/crm/contacts-view"

export default async function ContactsPage() {
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

  const { data: contacts } = await supabase
    .from("contacts")
    .select(`
      *,
      company:companies(id, name, domain),
      owner:profiles!contacts_owner_id_fkey(id, full_name, avatar_url)
    `)
    .in("tenant_id", tenantIds.length > 0 ? tenantIds : ["none"])
    .order("created_at", { ascending: false })

  const { data: companies } = await supabase
    .from("companies")
    .select("id, name")
    .in("tenant_id", tenantIds.length > 0 ? tenantIds : ["none"])

  return <ContactsView contacts={contacts || []} companies={companies || []} tenantId={tenantIds[0] || null} />
}
