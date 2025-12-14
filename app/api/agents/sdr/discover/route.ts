import { createServerClient } from "@/lib/supabase/server"
import { discoverLeadsFromGoogleMaps, type LeadDiscoveryInput } from "@/lib/agents/lead-discovery"
import { analyzeLeadWithSDR } from "@/lib/agents/sdr-agent"
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

    const body = await req.json()
    const { industry, location, radius, keywords, maxResults, autoAnalyze = false } = body as LeadDiscoveryInput & {
      autoAnalyze?: boolean
    }

    if (!industry || !location) {
      return NextResponse.json({ error: "Industry and location are required" }, { status: 400 })
    }

    // Get tenant
    let { data: membership } = await supabase
      .from("tenant_members")
      .select("tenant_id")
      .eq("user_id", currentUser.id)
      .single()

    // TEMPORARY: If dev-user has no tenant, use the first available tenant or create one
    if (!membership && currentUser.id === "dev-user") {
      const { data: firstTenant } = await supabase.from("tenants").select("id").limit(1).single()

      if (firstTenant) {
        membership = { tenant_id: firstTenant.id }
      } else {
        // Create a default tenant for dev-user using service role to bypass RLS
        const timestamp = Date.now().toString(36)
        const random = Math.random().toString(36).substring(2, 5)

        // Import service role client
        const { createClient } = await import("@supabase/supabase-js")
        const supabaseService = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!,
          {
            auth: {
              autoRefreshToken: false,
              persistSession: false,
            },
          }
        )

        const { data: newTenant, error: tenantError } = await supabaseService
          .from("tenants")
          .insert({
            name: "Dev Workspace",
            slug: `dev-workspace-${timestamp}${random}`,
            brand_color: "#ff6b6b",
          })
          .select("id")
          .single()

        if (tenantError || !newTenant) {
          console.error("Failed to create dev tenant:", tenantError)
          return NextResponse.json({ error: "Failed to create workspace" }, { status: 500 })
        }

        // Add dev-user as member
        await supabaseService.from("tenant_members").insert({
          tenant_id: newTenant.id,
          user_id: currentUser.id,
          role: "owner",
        })

        membership = { tenant_id: newTenant.id }
      }
    }

    if (!membership) {
      return NextResponse.json({ error: "No workspace found" }, { status: 400 })
    }

    // Discover leads from Google Maps
    const discoveredLeads = await discoverLeadsFromGoogleMaps({
      industry,
      location,
      radius,
      keywords,
      maxResults,
    })

    // Insert discovered leads into database
    const leadsToInsert = discoveredLeads.map((lead) => ({
      tenant_id: membership.tenant_id,
      first_name: "", // We'll use company name as the main identifier
      last_name: "",
      company_name: lead.name,
      email: null,
      phone: lead.phone || null,
      status: "new" as const,
      source: "google_maps_discovery",
      notes: `Discovered via Google Maps\nAddress: ${lead.address}\nRating: ${lead.rating || "N/A"} (${lead.userRatingsTotal || 0} reviews)\nPlace ID: ${lead.placeId}`,
      linkedin_url: null,
    }))

    const { data: insertedLeads, error: insertError } = await supabase
      .from("leads")
      .insert(leadsToInsert)
      .select("id, company_name, phone, notes")

    if (insertError) {
      console.error("Error inserting leads:", insertError)
      return NextResponse.json({ error: "Failed to save leads" }, { status: 500 })
    }

    // Optionally analyze the leads immediately
    let analysisResults = null
    if (autoAnalyze && insertedLeads) {
      const analyses = []
      for (const lead of insertedLeads.slice(0, 10)) {
        // Limit to 10 auto-analyses
        const discoveredLead = discoveredLeads.find((dl) => dl.name === lead.company_name)

        const analysis = await analyzeLeadWithSDR({
          leadName: lead.company_name,
          companyName: lead.company_name,
          industry,
          website: discoveredLead?.website,
          phone: lead.phone || undefined,
          source: "google_maps_discovery",
          notes: lead.notes || undefined,
        })

        // Save analysis
        await supabase.from("sdr_analyses").insert({
          tenant_id: membership.tenant_id,
          lead_id: lead.id,
          icp_score: analysis.icpScore,
          digital_presence_score: Math.round(
            (analysis.digitalPresence.websiteScore +
              analysis.digitalPresence.seoScore +
              analysis.digitalPresence.socialScore +
              analysis.digitalPresence.googleBusinessScore) /
              4
          ),
          pain_points: analysis.painPoints.map((p) => p.point),
          sales_opportunities: analysis.salesOpportunities.map((o) => o.opportunity),
          talking_points: analysis.talkingPoints,
          automation_opportunities: analysis.automationOpportunities.map((o) => o.opportunity),
          qualification_data: analysis.qualification,
          raw_analysis: analysis,
        })

        // Update lead with ICP score
        await supabase.from("leads").update({ icp_score: analysis.icpScore }).eq("id", lead.id)

        analyses.push({
          leadId: lead.id,
          companyName: lead.company_name,
          icpScore: analysis.icpScore,
        })
      }
      analysisResults = analyses
    }

    return NextResponse.json({
      success: true,
      discovered: discoveredLeads.length,
      saved: insertedLeads?.length || 0,
      analyzed: analysisResults?.length || 0,
      leads: insertedLeads,
      analyses: analysisResults,
    })
  } catch (error: any) {
    console.error("Lead discovery error:", error)
    return NextResponse.json({ error: error.message || "Failed to discover leads" }, { status: 500 })
  }
}
