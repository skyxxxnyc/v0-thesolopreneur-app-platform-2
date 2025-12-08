import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { CalendarView } from "@/components/calendar/calendar-view"

export default async function CalendarPage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // TEMPORARY: Skip auth check for now
  // if (!user) redirect("/auth/login")

  return <CalendarView />
}
