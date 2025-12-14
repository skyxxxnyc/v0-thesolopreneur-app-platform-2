import { createServerClient } from "@/lib/supabase/server"
import { batchAnalyzeLeads } from "@/lib/agents/sdr-agent"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // TEMPORARY: Skip auth check for now
    // if (!user) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // }

    // Use actual user or mock user for development
    const currentUser = user || { id: "dev-user", email: "dev@example.com" } as any

    const { leadIds, icpId } = await req.json()

    // Get tenant
    let { data: membership } = await supabase
      .from("tenant_members")
      .select("tenant_id")
      .eq("user_id", currentUser.id)
      .single()

    // TEMPORARY: If dev-user has no tenant, use the first available tenant
    if (!membership && currentUser.id === "dev-user") {
      const { data: firstTenant } = await supabase.from("tenants").select("id").limit(1).single()

      if (firstTenant) {
        membership = { tenant_id: firstTenant.id }
      }
    }

    if (!membership) {
      return NextResponse.json({ error: "No workspace found" }, { status: 400 })
    }

    // Fetch leads
    let query = supabase.from("leads").select("*, companies(*)").eq("tenant_id", membership.tenant_id)

    if (leadIds?.length > 0) {
      query = query.in("id", leadIds)
    } else {
      // Analyze unanalyzed leads
      query = query.is("icp_score", null).limit(50)
    }

    const { data: leads, error } = await query

    if (error || !leads?.length) {
      return NextResponse.json({ error: "No leads found" }, { status: 404 })
    }

    // Prepare inputs
    const inputs = leads.map((lead) => ({
      leadName: `${lead.first_name} ${lead.last_name}`,
      companyName: lead.company_name || lead.companies?.name || "Unknown",
      industry: lead.companies?.industry,
      website: lead.companies?.website,
      email: lead.email,
      phone: lead.phone,
      linkedinUrl: lead.linkedin_url,
      source: lead.source,
      notes: lead.notes,
    }))

    // Run batch analysis
    const results = await batchAnalyzeLeads(inputs)

    // Store results
    const insertPromises = leads.map(async (lead, index) => {
      const key = `${inputs[index].companyName}-${inputs[index].leadName}`
      const analysis = results.get(key)

      if (analysis) {
        await supabase.from("sdr_analyses").insert({
          tenant_id: membership.tenant_id,
          lead_id: lead.id,
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

        await supabase.from("leads").update({ icp_score: analysis.icpScore }).eq("id", lead.id)
      }
    })

    await Promise.all(insertPromises)

    return NextResponse.json({
      success: true,
      analyzed: results.size,
      results: Object.fromEntries(results),
    })
  } catch (error) {
    console.error("Batch SDR analysis error:", error)
    return NextResponse.json({ error: "Failed to analyze leads" }, { status: 500 })
  }
}
