import { generateObject } from "ai"
import { z } from "zod"

// Enrichment output schema
const enrichmentSchema = z.object({
  company: z.object({
    name: z.string(),
    legalName: z.string().optional(),
    description: z.string(),
    industry: z.string(),
    subIndustry: z.string().optional(),
    foundedYear: z.number().optional(),
    employeeCount: z.string(),
    employeeRange: z.enum(["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"]),
    revenue: z.string().optional(),
    revenueRange: z.enum(["<1M", "1M-10M", "10M-50M", "50M-100M", "100M-500M", "500M+"]).optional(),
    headquarters: z
      .object({
        city: z.string(),
        state: z.string(),
        country: z.string(),
      })
      .optional(),
    type: z.enum(["private", "public", "nonprofit", "government"]).optional(),
  }),

  digitalPresence: z.object({
    website: z
      .object({
        url: z.string(),
        hasHttps: z.boolean(),
        mobileResponsive: z.boolean().optional(),
        estimatedTraffic: z.string().optional(),
        techStack: z.array(z.string()),
        cmsUsed: z.string().optional(),
      })
      .optional(),
    socialProfiles: z.object({
      linkedin: z.string().optional(),
      twitter: z.string().optional(),
      facebook: z.string().optional(),
      instagram: z.string().optional(),
      youtube: z.string().optional(),
    }),
    googleBusinessProfile: z
      .object({
        exists: z.boolean(),
        rating: z.number().optional(),
        reviewCount: z.number().optional(),
        claimed: z.boolean().optional(),
      })
      .optional(),
  }),

  contacts: z.array(
    z.object({
      name: z.string(),
      title: z.string(),
      email: z.string().optional(),
      linkedin: z.string().optional(),
      isDecisionMaker: z.boolean(),
      department: z.string().optional(),
    }),
  ),

  signals: z.object({
    recentNews: z.array(
      z.object({
        headline: z.string(),
        date: z.string(),
        sentiment: z.enum(["positive", "neutral", "negative"]),
      }),
    ),
    fundingEvents: z.array(
      z.object({
        type: z.string(),
        amount: z.string().optional(),
        date: z.string(),
      }),
    ),
    growthIndicators: z.array(z.string()),
    riskIndicators: z.array(z.string()),
  }),

  firmographics: z.object({
    sicCode: z.string().optional(),
    naicsCode: z.string().optional(),
    keywords: z.array(z.string()),
    competitors: z.array(z.string()),
    targetMarket: z.string().optional(),
  }),

  confidence: z.object({
    overall: z.number().min(0).max(100),
    companyData: z.number().min(0).max(100),
    contactData: z.number().min(0).max(100),
    digitalPresence: z.number().min(0).max(100),
  }),
})

export type EnrichmentData = z.infer<typeof enrichmentSchema>

const ENRICHMENT_SYSTEM_PROMPT = `You are a data enrichment AI agent. Your job is to gather and synthesize information about companies and their key contacts.

When enriching data, you should:
1. Compile all known information about the company
2. Identify key decision makers and their contact information
3. Assess the company's digital presence
4. Look for growth signals and recent news
5. Categorize the company by industry, size, and market position

For each data point, assess your confidence level. If information is not available or uncertain, indicate that clearly rather than making things up.

Provide structured, actionable data that sales teams can use for outreach.`

interface EnrichInput {
  companyName: string
  website?: string
  industry?: string
  contactName?: string
  contactEmail?: string
  additionalContext?: string
}

export async function enrichCompanyData(input: EnrichInput): Promise<EnrichmentData> {
  const userPrompt = `Enrich the following company/lead data:

**Known Information:**
- Company Name: ${input.companyName}
${input.website ? `- Website: ${input.website}` : ""}
${input.industry ? `- Industry: ${input.industry}` : ""}
${input.contactName ? `- Contact Name: ${input.contactName}` : ""}
${input.contactEmail ? `- Contact Email: ${input.contactEmail}` : ""}
${input.additionalContext ? `- Additional Context: ${input.additionalContext}` : ""}

Based on this information, provide comprehensive enrichment data including:
1. Full company profile (size, revenue, location, type)
2. Digital presence analysis (website, social profiles, Google Business)
3. Key contacts and decision makers
4. Recent signals (news, funding, growth indicators)
5. Firmographic data (industry codes, competitors, market)
6. Confidence scores for each data category

If you cannot find certain information, provide your best assessment with appropriate confidence scores.`

  const { object } = await generateObject({
    model: "anthropic/claude-sonnet-4-20250514",
    schema: enrichmentSchema,
    system: ENRICHMENT_SYSTEM_PROMPT,
    prompt: userPrompt,
  })

  return object
}

// Use Perplexity for real-time web research (via Pica)
export async function enrichWithWebResearch(
  companyName: string,
  website?: string,
): Promise<{
  research: string
  sources: string[]
}> {
  // This would call the Pica Perplexity integration
  const response = await fetch("/api/integrations/perplexity/research", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `Research ${companyName}${website ? ` (${website})` : ""}: company size, industry, recent news, key executives, digital presence, competitors`,
    }),
  })

  if (!response.ok) {
    throw new Error("Failed to research company")
  }

  return response.json()
}
