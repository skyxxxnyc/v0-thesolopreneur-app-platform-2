import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { CampaignsView } from "@/components/campaigns/campaigns-view"

export default async function CampaignsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // TEMPORARY: Skip auth check for now
  // if (!user) {
  //   redirect("/auth/login")
  // }

  return <CampaignsView />
}
