import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { EmailsView } from "@/components/emails/emails-view"

export default async function EmailsPage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  return <EmailsView />
}
