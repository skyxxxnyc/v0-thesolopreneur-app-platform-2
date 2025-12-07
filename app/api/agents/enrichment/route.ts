import { createServerClient } from "@/lib/supabase/server"
import { enrichCompanyData } from "@/lib/agents/enrichment-agent"
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
    const { companyId, leadId, companyData } = body

    // Get tenant
    const { data: membership } = await supabase
      .from("tenant_members")
      .select("tenant_id")
      .eq("user_id", user.id)
      .single()

    if (!membership) {
      return NextResponse.json({ error: "No workspace found" }, { status: 400 })
    }

    // Build input from company or lead data
    let input = companyData

    if (companyId) {
      const { data: company } = await supabase.from("companies").select("*").eq("id", companyId).single()

      if (company) {
        input = {
          companyName: company.name,
          website: company.website,
          industry: company.industry,
        }
      }
    } else if (leadId) {
      const { data: lead } = await supabase.from("leads").select("*").eq("id", leadId).single()

      if (lead) {
        input = {
          companyName: lead.company_name,
          website: lead.website,
          contactName: `${lead.first_name} ${lead.last_name}`,
          contactEmail: lead.email,
        }
      }
    }

    if (!input?.companyName) {
      return NextResponse.json({ error: "Company name required" }, { status: 400 })
    }

    // Run enrichment
    const enrichment = await enrichCompanyData(input)

    // Update company record if exists
    if (companyId) {
      await supabase
        .from("companies")
        .update({
          industry: enrichment.company.industry,
          employee_count: enrichment.company.employeeCount,
          annual_revenue: enrichment.company.revenue,
          description: enrichment.company.description,
          linkedin_url: enrichment.digitalPresence.socialProfiles.linkedin,
          twitter_url: enrichment.digitalPresence.socialProfiles.twitter,
          enrichment_data: enrichment,
          enriched_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", companyId)

      // Create contacts from enrichment
      if (enrichment.contacts.length > 0) {
        const contacts = enrichment.contacts.map((contact) => ({
          tenant_id: membership.tenant_id,
          company_id: companyId,
          first_name: contact.name.split(" ")[0],
          last_name: contact.name.split(" ").slice(1).join(" "),
          email: contact.email,
          title: contact.title,
          linkedin_url: contact.linkedin,
          is_decision_maker: contact.isDecisionMaker,
          source: "enrichment",
        }))

        // Upsert contacts (avoid duplicates)
        for (const contact of contacts) {
          if (contact.email) {
            await supabase.from("contacts").upsert(contact, {
              onConflict: "email,tenant_id",
              ignoreDuplicates: true,
            })
          }
        }
      }
    }

    return NextResponse.json({ success: true, enrichment })
  } catch (error) {
    console.error("Enrichment error:", error)
    return NextResponse.json({ error: "Failed to enrich data" }, { status: 500 })
  }
}
