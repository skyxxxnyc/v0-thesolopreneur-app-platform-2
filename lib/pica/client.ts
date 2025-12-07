// Pica API client for Gmail, Google Calendar, Perplexity, and Claude integrations

const PICA_BASE_URL = "https://api.picaos.com/v1/passthrough"

// Action IDs from Pica
const ACTION_IDS = {
  GMAIL_SEND: "conn_mod_def::F_JeJ_A_TKg::cc2kvVQQTiiIiLEDauy6zQ",
  GMAIL_GET_THREAD: "conn_mod_def::F_JeUTFPgGg::yjaVnrwiQdKvYtzN9q8ZTQ",
  CALENDAR_LIST_EVENTS: "conn_mod_def::F_Jdx1JeQJk::PNyVTLTJSmazFSqY24HbFQ",
  CALENDAR_CREATE_EVENT: "conn_mod_def::F_JeDmpsPL4::1PhPKt9MRPmDDgUVS8Yd3Q",
  PERPLEXITY_CHAT: "conn_mod_def::GCY0iK-iGks::TKAh9sv2Ts2HJdLJc5a60A",
  ANTHROPIC_MESSAGES: "conn_mod_def::GUJnRWBq2rc::JiLGnXhdR9GVWf_sGEXDKg",
}

// Base64url encode for Gmail MIME messages
function base64urlEncode(str: string): string {
  const base64 = Buffer.from(str).toString("base64")
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

// Gmail Integration
export async function sendEmail({
  to,
  subject,
  body,
  cc,
  bcc,
}: {
  to: string
  subject: string
  body: string
  cc?: string
  bcc?: string
}) {
  const mimeLines = [
    `To: ${to}`,
    cc ? `Cc: ${cc}` : null,
    bcc ? `Bcc: ${bcc}` : null,
    `Subject: ${subject}`,
    "Content-Type: text/plain; charset=UTF-8",
    "",
    body,
  ]
    .filter(Boolean)
    .join("\n")

  const raw = base64urlEncode(mimeLines)

  const response = await fetch(`${PICA_BASE_URL}/users/me/messages/send`, {
    method: "POST",
    headers: {
      "x-pica-secret": process.env.PICA_SECRET_KEY!,
      "x-pica-connection-key": process.env.PICA_GMAIL_CONNECTION_KEY!,
      "x-pica-action-id": ACTION_IDS.GMAIL_SEND,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ raw }),
  })

  if (!response.ok) {
    throw new Error(`Gmail send failed: ${response.statusText}`)
  }

  return response.json()
}

export async function getGmailThread(threadId: string) {
  const response = await fetch(
    `${PICA_BASE_URL}/users/me/threads/${threadId}?format=METADATA&metadataHeaders=Subject&metadataHeaders=From&metadataHeaders=To&metadataHeaders=Date`,
    {
      method: "GET",
      headers: {
        "x-pica-secret": process.env.PICA_SECRET_KEY!,
        "x-pica-connection-key": process.env.PICA_GMAIL_CONNECTION_KEY!,
        "x-pica-action-id": ACTION_IDS.GMAIL_GET_THREAD,
        "Content-Type": "application/json",
      },
    },
  )

  if (!response.ok) {
    throw new Error(`Gmail thread fetch failed: ${response.statusText}`)
  }

  return response.json()
}

// Google Calendar Integration
export async function listCalendarEvents({
  timeMin,
  timeMax,
}: {
  timeMin?: string
  timeMax?: string
} = {}) {
  const params = new URLSearchParams({
    singleEvents: "true",
    orderBy: "startTime",
  })
  if (timeMin) params.append("timeMin", timeMin)
  if (timeMax) params.append("timeMax", timeMax)

  const response = await fetch(`${PICA_BASE_URL}/calendars/primary/events?${params.toString()}`, {
    method: "GET",
    headers: {
      "x-pica-secret": process.env.PICA_SECRET_KEY!,
      "x-pica-connection-key": process.env.PICA_GOOGLE_CALENDAR_CONNECTION_KEY!,
      "x-pica-action-id": ACTION_IDS.CALENDAR_LIST_EVENTS,
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    throw new Error(`Calendar list failed: ${response.statusText}`)
  }

  return response.json()
}

export async function createCalendarEvent({
  summary,
  description,
  startDateTime,
  endDateTime,
  timeZone = "UTC",
  attendees,
}: {
  summary: string
  description?: string
  startDateTime: string
  endDateTime: string
  timeZone?: string
  attendees?: string[]
}) {
  const response = await fetch(`${PICA_BASE_URL}/calendars/primary/events`, {
    method: "POST",
    headers: {
      "x-pica-secret": process.env.PICA_SECRET_KEY!,
      "x-pica-connection-key": process.env.PICA_GOOGLE_CALENDAR_CONNECTION_KEY!,
      "x-pica-action-id": ACTION_IDS.CALENDAR_CREATE_EVENT,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      summary,
      description,
      start: { dateTime: startDateTime, timeZone },
      end: { dateTime: endDateTime, timeZone },
      attendees: attendees?.map((email) => ({ email })),
    }),
  })

  if (!response.ok) {
    throw new Error(`Calendar create failed: ${response.statusText}`)
  }

  return response.json()
}

// Perplexity Integration (for SDR research/enrichment)
export async function researchWithPerplexity({
  systemPrompt,
  userPrompt,
  maxTokens = 800,
  temperature = 0.2,
}: {
  systemPrompt: string
  userPrompt: string
  maxTokens?: number
  temperature?: number
}) {
  const response = await fetch(`${PICA_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "x-pica-secret": process.env.PICA_SECRET_KEY!,
      "x-pica-connection-key": process.env.PICA_PERPLEXITY_CONNECTION_KEY!,
      "x-pica-action-id": ACTION_IDS.PERPLEXITY_CHAT,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "sonar",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: maxTokens,
      temperature,
    }),
  })

  if (!response.ok) {
    throw new Error(`Perplexity research failed: ${response.statusText}`)
  }

  return response.json()
}

// Claude/Anthropic Integration
export async function chatWithClaude({
  systemPrompt,
  userPrompt,
  model = "claude-sonnet-4-20250514",
  maxTokens = 1024,
  temperature = 0.7,
}: {
  systemPrompt?: string
  userPrompt: string
  model?: string
  maxTokens?: number
  temperature?: number
}) {
  const messages: { role: string; content: string }[] = []

  if (systemPrompt) {
    messages.push({ role: "user", content: systemPrompt })
    messages.push({ role: "assistant", content: "Understood. I will follow these instructions." })
  }
  messages.push({ role: "user", content: userPrompt })

  const response = await fetch(`${PICA_BASE_URL}/v1/messages`, {
    method: "POST",
    headers: {
      "x-pica-secret": process.env.PICA_SECRET_KEY!,
      "x-pica-connection-key": process.env.PICA_ANTHROPIC_CONNECTION_KEY!,
      "x-pica-action-id": ACTION_IDS.ANTHROPIC_MESSAGES,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      messages,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Claude API failed: ${response.statusText} - ${error}`)
  }

  return response.json()
}

export async function streamClaude({
  systemPrompt,
  userPrompt,
  model = "claude-sonnet-4-20250514",
  maxTokens = 1024,
  temperature = 0.7,
}: {
  systemPrompt?: string
  userPrompt: string
  model?: string
  maxTokens?: number
  temperature?: number
}) {
  const messages: { role: string; content: string }[] = []

  if (systemPrompt) {
    messages.push({ role: "user", content: systemPrompt })
    messages.push({ role: "assistant", content: "Understood. I will follow these instructions." })
  }
  messages.push({ role: "user", content: userPrompt })

  const response = await fetch(`${PICA_BASE_URL}/v1/messages`, {
    method: "POST",
    headers: {
      "x-pica-secret": process.env.PICA_SECRET_KEY!,
      "x-pica-connection-key": process.env.PICA_ANTHROPIC_CONNECTION_KEY!,
      "x-pica-action-id": ACTION_IDS.ANTHROPIC_MESSAGES,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      messages,
      stream: true,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Claude streaming failed: ${response.statusText} - ${error}`)
  }

  return response
}

// Types
export interface GmailMessage {
  id: string
  threadId: string
  labelIds: string[]
  snippet: string
  historyId: string
  internalDate: string
  payload: {
    headers: { name: string; value: string }[]
  }
}

export interface CalendarEvent {
  id: string
  summary: string
  description?: string
  start: { dateTime: string; timeZone: string }
  end: { dateTime: string; timeZone: string }
  attendees?: { email: string; responseStatus: string }[]
  htmlLink: string
}

export interface PerplexityResponse {
  id: string
  model: string
  choices: {
    index: number
    finish_reason: string
    message: { role: string; content: string }
  }[]
  citations: string[]
  usage: { prompt_tokens: number; completion_tokens: number; total_tokens: number }
}

export interface ClaudeResponse {
  id: string
  type: "message"
  role: "assistant"
  model: string
  content: {
    type: "text"
    text: string
  }[]
  stop_reason: string
  stop_sequence: string | null
  usage: {
    input_tokens: number
    output_tokens: number
  }
}
