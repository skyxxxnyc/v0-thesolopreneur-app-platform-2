import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { SettingsContent } from "@/components/settings/settings-content"

export const metadata = {
  title: "Settings | thesolopreneur.app",
  description: "Manage your account and workspace settings",
}

export default async function SettingsPage() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // TEMPORARY: Skip auth check for now
  // if (!user) {
  //   redirect("/login")
  // }

  // Use actual user or mock user for development
  const currentUser = user || { id: 'dev-user', email: 'dev@example.com' } as any

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", currentUser.id).single()

  const { data: memberships } = await supabase
    .from("tenant_members")
    .select(`
      id,
      role,
      tenant:tenants (
        id,
        name,
        slug,
        logo_url,
        primary_color,
        created_at
      )
    `)
    .eq("user_id", currentUser.id)

  return (
    <div className="flex-1 overflow-auto bg-zinc-950">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-zinc-400 mt-1">Manage your account and workspace preferences</p>
        </div>

        <SettingsContent user={currentUser} profile={profile} memberships={memberships || []} />
      </div>
    </div>
  )
}
