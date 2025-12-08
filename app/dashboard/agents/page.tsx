import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AgentsHub } from "@/components/agents/agents-hub"

export default async function AgentsPage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // TEMPORARY: Skip auth check for now
  // if (!user) redirect("/auth/login")

  return <AgentsHub />
}
