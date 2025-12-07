import { type NextRequest, NextResponse } from "next/server"
import { listCalendarEvents, createCalendarEvent } from "@/lib/pica/client"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const timeMin = searchParams.get("timeMin") || undefined
    const timeMax = searchParams.get("timeMax") || undefined

    const events = await listCalendarEvents({ timeMin, timeMax })
    return NextResponse.json(events)
  } catch (error) {
    console.error("Calendar list error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to list events" },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { summary, description, startDateTime, endDateTime, timeZone, attendees, companyId, contactId } =
      await request.json()

    if (!summary || !startDateTime || !endDateTime) {
      return NextResponse.json(
        { error: "Missing required fields: summary, startDateTime, endDateTime" },
        { status: 400 },
      )
    }

    const event = await createCalendarEvent({
      summary,
      description,
      startDateTime,
      endDateTime,
      timeZone,
      attendees,
    })

    // Log as activity if company or contact provided
    if (companyId || contactId) {
      await supabase.from("activities").insert({
        tenant_id: user.user_metadata?.current_tenant_id,
        company_id: companyId,
        contact_id: contactId,
        type: "meeting",
        subject: summary,
        description,
        scheduled_at: startDateTime,
        status: "scheduled",
        created_by: user.id,
        metadata: { calendar_event_id: event.id, calendar_link: event.htmlLink },
      })
    }

    return NextResponse.json(event)
  } catch (error) {
    console.error("Calendar create error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create event" },
      { status: 500 },
    )
  }
}
