import { generateObject } from "ai"
import { z } from "zod"

// SDR Analysis output schema based on training document
const sdrAnalysisSchema = z.object({
  icpScore: z.number().min(0).max(100).describe("ICP fit score from 0-100"),
  icpFitReason: z.string().describe("Brief explanation of ICP fit"),

  digitalPresence: z.object({
    websiteScore: z.number().min(0).max(100),
    websiteAssessment: z.enum(["poor", "fair", "good", "excellent"]),
    seoScore: z.number().min(0).max(100),
    socialScore: z.number().min(0).max(100),
    googleBusinessScore: z.number().min(0).max(100),
  }),

  painPoints: z.array(
    z.object({
      point: z.string(),
      severity: z.enum(["low", "medium", "high", "critical"]),
      category: z.enum(["website", "seo", "social", "operations", "customer_service", "lead_generation"]),
    }),
  ),

  salesOpportunities: z.array(
    z.object({
      opportunity: z.string(),
      service: z.string(),
      estimatedValue: z.enum(["low", "medium", "high"]),
      priority: z.number().min(1).max(5),
    }),
  ),

  talkingPoints: z.array(z.string()),

  automationOpportunities: z.array(
    z.object({
      opportunity: z.string(),
      expectedImpact: z.string(),
      complexity: z.enum(["low", "medium", "high"]),
    }),
  ),

  qualification: z.object({
    bant: z.object({
      budget: z.enum(["unknown", "limited", "moderate", "strong"]),
      authority: z.enum(["unknown", "influencer", "decision_maker", "economic_buyer"]),
      need: z.enum(["none", "latent", "active", "urgent"]),
      timeline: z.enum(["unknown", "future", "this_quarter", "immediate"]),
    }),
    overallScore: z.enum(["unqualified", "marketing_qualified", "sales_qualified", "highly_qualified"]),
  }),

  recommendedNextSteps: z.array(z.string()),
})

export type SDRAnalysis = z.infer<typeof sdrAnalysisSchema>

// The system prompt incorporating the training document
const SDR_SYSTEM_PROMPT = `You are an expert SDR (Sales Development Representative) AI agent for a web design and digital marketing agency. Your job is to analyze leads and prospects against our Ideal Customer Profile (ICP) and identify sales opportunities.

## Our Services
1. **Basic/Starter Package** - For new businesses, solopreneurs. Foundational website, basic SEO, mobile optimization.
2. **Standard/Growth Package** - For established SMBs. Custom-designed SEO-optimized website, content strategy, social media.
3. **Premium/Enterprise Package** - For larger businesses. Enterprise-grade website, advanced analytics, AI automation.

## Digital Presence Scoring Criteria

### Website Quality
- Poor: No website, outdated design (pre-2020), broken functionality, no mobile optimization
- Fair: Basic website, limited content, slow load times, poor SEO
- Good: Modern design, mobile-responsive, basic SEO, functional
- Excellent: Professional design, fast loading, comprehensive SEO, strong UX

### SEO Assessment
- Poor: Not indexed, no meta tags, no local SEO, broken links
- Fair: Basic on-page SEO, limited keywords, inconsistent structure
- Good: Proper meta tags, keyword optimization, local SEO setup
- Excellent: Comprehensive SEO strategy, high rankings, rich snippets

### Social Media Red Flags
- Inconsistent/infrequent posting
- Low engagement rate
- No interaction with audience
- Purely promotional content

### Google Business Profile
- Critical Elements: Complete profile, accurate hours, photos, regular posts, review responses
- Red Flags: Incomplete info, no photos, no reviews, unresponsive to reviews

## AI Automation Opportunities by Industry
- Restaurants/Cafes: Chatbots for orders, SMS reminders, review management
- Healthcare: Appointment scheduling, patient intake, follow-up reminders
- Real Estate: Lead qualification bots, virtual tour scheduling, CRM automation
- Salons/Spas: Booking automation, loyalty programs, personalized recommendations
- Gyms: Membership management, class booking, progress tracking
- Retail: Inventory alerts, support bots, recommendation engines

## Key Pain Point Categories
1. Lack of online presence
2. Poor lead generation
3. Manual processes
4. Low customer engagement
5. Inefficient operations
6. Poor customer service
7. No data insights

## High-Value Opportunity Indicators
- Business experiencing rapid growth
- Recent funding or expansion
- Outdated website (3+ years old)
- Poor Google rankings
- No social media presence
- Manual processes causing bottlenecks
- Customer service complaints

Analyze the provided lead information and generate a comprehensive assessment.`

interface AnalyzeLeadInput {
  leadName: string
  companyName: string
  industry?: string
  website?: string
  email?: string
  phone?: string
  linkedinUrl?: string
  source?: string
  notes?: string
  additionalContext?: string
}

export async function analyzeLeadWithSDR(input: AnalyzeLeadInput): Promise<SDRAnalysis> {
  const userPrompt = `Analyze this lead for sales qualification:

**Lead Information:**
- Name: ${input.leadName}
- Company: ${input.companyName}
${input.industry ? `- Industry: ${input.industry}` : ""}
${input.website ? `- Website: ${input.website}` : "- Website: Not provided (this is a red flag)"}
${input.email ? `- Email: ${input.email}` : ""}
${input.phone ? `- Phone: ${input.phone}` : ""}
${input.linkedinUrl ? `- LinkedIn: ${input.linkedinUrl}` : ""}
${input.source ? `- Lead Source: ${input.source}` : ""}
${input.notes ? `- Notes: ${input.notes}` : ""}
${input.additionalContext ? `- Additional Context: ${input.additionalContext}` : ""}

Based on our ICP criteria and the information available, provide a comprehensive analysis including:
1. ICP fit score and reasoning
2. Digital presence assessment
3. Identified pain points with severity
4. Sales opportunities with recommended services
5. Personalized talking points
6. AI automation opportunities
7. BANT qualification
8. Recommended next steps`

  const { object } = await generateObject({
    model: "anthropic/claude-sonnet-4-20250514",
    schema: sdrAnalysisSchema,
    system: SDR_SYSTEM_PROMPT,
    prompt: userPrompt,
  })

  return object
}

// Batch analysis for multiple leads
export async function batchAnalyzeLeads(leads: AnalyzeLeadInput[]): Promise<Map<string, SDRAnalysis>> {
  const results = new Map<string, SDRAnalysis>()

  // Process in parallel with concurrency limit
  const batchSize = 5
  for (let i = 0; i < leads.length; i += batchSize) {
    const batch = leads.slice(i, i + batchSize)
    const batchResults = await Promise.all(
      batch.map(async (lead) => {
        const analysis = await analyzeLeadWithSDR(lead)
        return { id: `${lead.companyName}-${lead.leadName}`, analysis }
      }),
    )
    batchResults.forEach(({ id, analysis }) => results.set(id, analysis))
  }

  return results
}
