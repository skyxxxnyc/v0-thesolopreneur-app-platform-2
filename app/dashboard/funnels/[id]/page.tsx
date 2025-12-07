import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { FunnelEditor } from "@/components/funnels/funnel-editor"

export default async function FunnelEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  return <FunnelEditor funnelId={id} />
}
