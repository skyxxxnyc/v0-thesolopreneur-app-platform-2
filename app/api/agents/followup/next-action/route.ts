import { createServerClient } from "@/lib/supabase/server"
import { determineNextAction } from "@/lib/agents/followup-agent"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { leadId, contactId } = body

    // Get tenant
    const { data: membership } = await supabase
      .from("tenant_members")
      .select("tenant_id")
      .eq("user_id", user.id)
      .single()

    if (!membership) {
      return NextResponse.json({ error: "No workspace found" }, { status: 400 })
    }

    // Fetch lead/contact with activities
    const targetId = leadId || contactId
    const targetTable = leadId ? "leads" : "contacts"

    const { data: target } = await supabase.from(targetTable).select("*").eq("id", targetId).single()

    if (!target) {
      return NextResponse.json({ error: "Target not found" }, { status: 404 })
    }

    // Fetch activities
    const { data: activities } = await supabase
      .from("activities")
      .select("*")
      .or(leadId ? `lead_id.eq.${leadId}` : `contact_id.eq.${contactId}`)
      .order("created_at", { ascending: false })
      .limit(10)

    const lastActivity = activities?.[0]
    const daysSinceLastTouch = lastActivity
      ? Math.floor((Date.now() - new Date(lastActivity.created_at).getTime()) / (1000 * 60 * 60 * 24))
      : 999

    // Count engagement
    const emailsOpened = activities?.filter((a) => a.type === "email" && a.metadata?.opened).length || 0
    const emailsClicked = activities?.filter((a) => a.type === "email" && a.metadata?.clicked).length || 0
    const callsAnswered = activities?.filter((a) => a.type === "call" && a.outcome === "connected").length || 0
    const repliesReceived = activities?.filter((a) => a.metadata?.replied).length || 0

    const nextAction = await determineNextAction({
      leadName: `${target.first_name} ${target.last_name}`,
      companyName: target.company_name || "Unknown",
      currentCadenceStep: activities?.length || 0,
      totalSteps: 7, // Default cadence length
      lastActivity: lastActivity
        ? {
            type: lastActivity.type,
            date: lastActivity.created_at,
            outcome: lastActivity.outcome,
          }
        : undefined,
      engagementHistory: {
        emailsOpened,
        emailsClicked,
        callsAnswered,
        repliesReceived,
      },
      daysSinceLastTouch,
    })

    return NextResponse.json({ success: true, nextAction })
  } catch (error) {
    console.error("Next action error:", error)
    return NextResponse.json({ error: "Failed to determine next action" }, { status: 500 })
  }
}
