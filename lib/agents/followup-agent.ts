import { generateObject } from "ai"
import { z } from "zod"

const cadenceStepSchema = z.object({
  stepNumber: z.number(),
  type: z.enum(["email", "call", "linkedin", "sms", "task"]),
  delayDays: z.number(),
  subject: z.string().optional(),
  content: z.string(),
  notes: z.string().optional(),
})

const followupCadenceSchema = z.object({
  name: z.string(),
  description: z.string(),
  totalDuration: z.number().describe("Total days the cadence runs"),
  steps: z.array(cadenceStepSchema),
  exitConditions: z.array(z.string()),
  bestPractices: z.array(z.string()),
})

export type FollowupCadence = z.infer<typeof followupCadenceSchema>
export type CadenceStep = z.infer<typeof cadenceStepSchema>

const FOLLOWUP_SYSTEM_PROMPT = `You are an expert in sales cadence design and follow-up strategy. Your job is to create effective multi-touch sequences that:

1. Maintain momentum without being annoying
2. Vary channels (email, call, LinkedIn, SMS)
3. Provide value in each touchpoint
4. Build on previous interactions
5. Know when to stop (break-up strategy)

Best practices:
- 7-12 touches over 2-4 weeks for cold outreach
- 3-5 touches over 1-2 weeks for warm leads
- Mix automated and manual touchpoints
- Include "pattern interrupt" messages
- Always have a graceful exit (break-up email)
- Space touches appropriately (not daily)

Channel guidelines:
- Email: Primary channel, 3-5 in sequence
- Call: 2-3 attempts, different times of day
- LinkedIn: 1-2 touches, connection + message
- SMS: Optional, only for warm leads with permission`

interface CadenceInput {
  leadType: "cold" | "warm" | "hot" | "re-engagement"
  industry?: string
  companySize?: string
  previousEngagement?: string[]
  customInstructions?: string
}

export async function generateFollowupCadence(input: CadenceInput): Promise<FollowupCadence> {
  const userPrompt = `Create an optimized follow-up cadence for this scenario:

**Lead Type:** ${input.leadType}
${input.industry ? `**Industry:** ${input.industry}` : ""}
${input.companySize ? `**Company Size:** ${input.companySize}` : ""}
${input.previousEngagement?.length ? `**Previous Engagement:** ${input.previousEngagement.join(", ")}` : ""}
${input.customInstructions ? `**Custom Instructions:** ${input.customInstructions}` : ""}

Design a complete cadence including:
1. Optimal number of touchpoints
2. Channel mix (email, call, LinkedIn, etc.)
3. Timing between touches
4. Content themes for each step
5. Exit conditions (when to stop)
6. Best practices for execution`

  const { object } = await generateObject({
    model: "anthropic/claude-sonnet-4-20250514",
    schema: followupCadenceSchema,
    system: FOLLOWUP_SYSTEM_PROMPT,
    prompt: userPrompt,
  })

  return object
}

// Determine next best action for a lead
const nextActionSchema = z.object({
  action: z.enum(["email", "call", "linkedin", "sms", "wait", "escalate", "close"]),
  reason: z.string(),
  suggestedContent: z.string().optional(),
  urgency: z.enum(["low", "medium", "high", "immediate"]),
  optimalTiming: z.string(),
})

export type NextAction = z.infer<typeof nextActionSchema>

interface NextActionInput {
  leadName: string
  companyName: string
  currentCadenceStep: number
  totalSteps: number
  lastActivity?: {
    type: string
    date: string
    outcome?: string
  }
  engagementHistory?: {
    emailsOpened: number
    emailsClicked: number
    callsAnswered: number
    repliesReceived: number
  }
  daysSinceLastTouch: number
}

export async function determineNextAction(input: NextActionInput): Promise<NextAction> {
  const { object } = await generateObject({
    model: "anthropic/claude-sonnet-4-20250514",
    schema: nextActionSchema,
    system:
      "You are a sales engagement AI that determines the optimal next action for leads based on their engagement history and cadence progress.",
    prompt: `Determine the next best action for this lead:

**Lead:** ${input.leadName} at ${input.companyName}
**Cadence Progress:** Step ${input.currentCadenceStep} of ${input.totalSteps}
**Days Since Last Touch:** ${input.daysSinceLastTouch}
${input.lastActivity ? `**Last Activity:** ${input.lastActivity.type} on ${input.lastActivity.date} - ${input.lastActivity.outcome || "No outcome recorded"}` : ""}
${
  input.engagementHistory
    ? `**Engagement:**
- Emails opened: ${input.engagementHistory.emailsOpened}
- Links clicked: ${input.engagementHistory.emailsClicked}
- Calls answered: ${input.engagementHistory.callsAnswered}
- Replies: ${input.engagementHistory.repliesReceived}`
    : ""
}

What should be the next action and why?`,
  })

  return object
}
