import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { FunnelsView } from "@/components/funnels/funnels-view"

export default async function FunnelsPage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  return <FunnelsView />
}
