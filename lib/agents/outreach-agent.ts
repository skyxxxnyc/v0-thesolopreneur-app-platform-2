import { generateObject } from "ai"
import { z } from "zod"
import type { SDRAnalysis } from "./sdr-agent"

const outreachMessageSchema = z.object({
  subject: z.string().describe("Email subject line - compelling and personalized"),
  body: z.string().describe("Email body - personalized, concise, with clear CTA"),
  linkedinMessage: z.string().describe("Short LinkedIn connection/message"),
  callScript: z.object({
    opener: z.string(),
    valueProposition: z.string(),
    questions: z.array(z.string()),
    objectionHandlers: z.array(
      z.object({
        objection: z.string(),
        response: z.string(),
      }),
    ),
    closeForMeeting: z.string(),
  }),
  smsMessage: z.string().optional().describe("Brief SMS follow-up message"),
  personalizationTokens: z.array(
    z.object({
      token: z.string(),
      value: z.string(),
      source: z.string(),
    }),
  ),
})

export type OutreachMessage = z.infer<typeof outreachMessageSchema>

const OUTREACH_SYSTEM_PROMPT = `You are an expert sales copywriter specializing in B2B outreach for a web design and digital marketing agency. Your messages should be:

1. **Personalized** - Reference specific pain points, company details, or recent events
2. **Concise** - Respect the prospect's time, get to the point
3. **Value-focused** - Lead with what's in it for them, not features
4. **Conversational** - Sound human, not robotic or salesy
5. **Action-oriented** - Include a clear, low-friction CTA

Key principles:
- First line should be personalized and NOT about you
- Mention a specific pain point or opportunity
- Keep emails under 150 words
- LinkedIn messages under 300 characters
- Include social proof when relevant
- End with a question to encourage response

Avoid:
- Generic templates that could apply to anyone
- Excessive superlatives or hype
- Long-winded explanations
- Multiple CTAs
- Attachments mentions in initial outreach`

interface OutreachInput {
  leadName: string
  companyName: string
  title?: string
  industry?: string
  sdrAnalysis?: SDRAnalysis
  enrichmentData?: Record<string, unknown>
  messageType: "cold" | "warm" | "followup" | "breakup"
  previousInteractions?: string[]
  template?: string
}

export async function generateOutreachMessage(input: OutreachInput): Promise<OutreachMessage> {
  const painPointsText =
    input.sdrAnalysis?.painPoints?.map((p) => `- ${p.point} (${p.severity} severity)`).join("\n") ||
    "No pain points identified"

  const talkingPointsText =
    input.sdrAnalysis?.talkingPoints?.map((p) => `- "${p}"`).join("\n") || "No talking points available"

  const opportunitiesText =
    input.sdrAnalysis?.salesOpportunities?.map((o) => `- ${o.opportunity} (${o.service})`).join("\n") ||
    "No specific opportunities identified"

  const userPrompt = `Generate personalized outreach messages for this prospect:

**Prospect Information:**
- Name: ${input.leadName}
- Company: ${input.companyName}
${input.title ? `- Title: ${input.title}` : ""}
${input.industry ? `- Industry: ${input.industry}` : ""}

**Message Type:** ${input.messageType}
${input.previousInteractions?.length ? `**Previous Interactions:** ${input.previousInteractions.join(", ")}` : ""}

**SDR Analysis Insights:**

Pain Points:
${painPointsText}

Talking Points:
${talkingPointsText}

Sales Opportunities:
${opportunitiesText}

${input.sdrAnalysis?.qualification ? `Qualification: ${input.sdrAnalysis.qualification.overallScore}` : ""}

${input.template ? `**Use this template as a base (but personalize):**\n${input.template}` : ""}

Generate:
1. Email with compelling subject and personalized body
2. LinkedIn connection request/message
3. Call script with opener, value prop, questions, objection handlers, and close
4. Optional SMS message
5. List of personalization tokens used`

  const { object } = await generateObject({
    model: "anthropic/claude-sonnet-4-20250514",
    schema: outreachMessageSchema,
    system: OUTREACH_SYSTEM_PROMPT,
    prompt: userPrompt,
  })

  return object
}

// Generate variations for A/B testing
export async function generateOutreachVariations(input: OutreachInput, count = 3): Promise<OutreachMessage[]> {
  const variations: OutreachMessage[] = []

  for (let i = 0; i < count; i++) {
    const variation = await generateOutreachMessage({
      ...input,
      template: i > 0 ? `Generate a different angle/approach than: ${variations[i - 1].subject}` : undefined,
    })
    variations.push(variation)
  }

  return variations
}
