import { createServerClient } from "@/lib/supabase/server"
import { analyzeLeadWithSDR } from "@/lib/agents/sdr-agent"
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
    const { leadId, leadData } = body

    // If leadId provided, fetch from database
    let input = leadData
    if (leadId) {
      const { data: lead, error } = await supabase.from("leads").select("*, companies(*)").eq("id", leadId).single()

      if (error || !lead) {
        return NextResponse.json({ error: "Lead not found" }, { status: 404 })
      }

      input = {
        leadName: `${lead.first_name} ${lead.last_name}`,
        companyName: lead.company_name || lead.companies?.name || "Unknown",
        industry: lead.companies?.industry,
        website: lead.companies?.website,
        email: lead.email,
        phone: lead.phone,
        linkedinUrl: lead.linkedin_url,
        source: lead.source,
        notes: lead.notes,
      }
    }

    // Run SDR analysis
    const analysis = await analyzeLeadWithSDR(input)

    // Store analysis in database
    if (leadId) {
      const { data: membership } = await supabase
        .from("tenant_members")
        .select("tenant_id")
        .eq("user_id", user.id)
        .single()

      if (membership) {
        await supabase.from("sdr_analyses").insert({
          tenant_id: membership.tenant_id,
          lead_id: leadId,
          icp_score: analysis.icpScore,
          digital_presence_score: Math.round(
            (analysis.digitalPresence.websiteScore +
              analysis.digitalPresence.seoScore +
              analysis.digitalPresence.socialScore +
              analysis.digitalPresence.googleBusinessScore) /
              4,
          ),
          pain_points: analysis.painPoints,
          sales_opportunities: analysis.salesOpportunities,
          talking_points: analysis.talkingPoints,
          automation_opportunities: analysis.automationOpportunities,
          qualification_data: analysis.qualification,
          raw_analysis: analysis,
        })

        // Update lead with ICP score
        await supabase
          .from("leads")
          .update({
            icp_score: analysis.icpScore,
            updated_at: new Date().toISOString(),
          })
          .eq("id", leadId)
      }
    }

    return NextResponse.json({ success: true, analysis })
  } catch (error) {
    console.error("SDR analysis error:", error)
    return NextResponse.json({ error: "Failed to analyze lead" }, { status: 500 })
  }
}
