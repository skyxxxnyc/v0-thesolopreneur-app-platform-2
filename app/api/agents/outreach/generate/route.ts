import { createServerClient } from "@/lib/supabase/server"
import { generateOutreachMessage } from "@/lib/agents/outreach-agent"
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
    const { leadId, contactId, messageType = "cold", template } = body

    // Get tenant
    const { data: membership } = await supabase
      .from("tenant_members")
      .select("tenant_id")
      .eq("user_id", user.id)
      .single()

    if (!membership) {
      return NextResponse.json({ error: "No workspace found" }, { status: 400 })
    }

    // Fetch lead/contact data with SDR analysis
    let input: Parameters<typeof generateOutreachMessage>[0]

    if (leadId) {
      const { data: lead } = await supabase.from("leads").select("*, sdr_analyses(*)").eq("id", leadId).single()

      if (!lead) {
        return NextResponse.json({ error: "Lead not found" }, { status: 404 })
      }

      input = {
        leadName: `${lead.first_name} ${lead.last_name}`,
        companyName: lead.company_name || "Unknown Company",
        title: lead.title,
        industry: lead.industry,
        sdrAnalysis: lead.sdr_analyses?.[0]?.raw_analysis,
        messageType,
        template,
      }
    } else if (contactId) {
      const { data: contact } = await supabase
        .from("contacts")
        .select("*, companies(*, sdr_analyses(*))")
        .eq("id", contactId)
        .single()

      if (!contact) {
        return NextResponse.json({ error: "Contact not found" }, { status: 404 })
      }

      input = {
        leadName: `${contact.first_name} ${contact.last_name}`,
        companyName: contact.companies?.name || "Unknown Company",
        title: contact.title,
        industry: contact.companies?.industry,
        sdrAnalysis: contact.companies?.sdr_analyses?.[0]?.raw_analysis,
        messageType,
        template,
      }
    } else {
      return NextResponse.json({ error: "Lead or contact ID required" }, { status: 400 })
    }

    // Generate outreach message
    const message = await generateOutreachMessage(input)

    return NextResponse.json({ success: true, message })
  } catch (error) {
    console.error("Outreach generation error:", error)
    return NextResponse.json({ error: "Failed to generate outreach" }, { status: 500 })
  }
}
