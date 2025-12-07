"use client"

import useSWR from "swr"
import useSWRMutation from "swr/mutation"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

// Calendar hooks
export function useCalendarEvents(timeMin?: string, timeMax?: string) {
  const params = new URLSearchParams()
  if (timeMin) params.append("timeMin", timeMin)
  if (timeMax) params.append("timeMax", timeMax)

  return useSWR(`/api/integrations/calendar/events?${params.toString()}`, fetcher)
}

export function useCreateCalendarEvent() {
  return useSWRMutation(
    "/api/integrations/calendar/events",
    async (
      url: string,
      {
        arg,
      }: {
        arg: {
          summary: string
          description?: string
          startDateTime: string
          endDateTime: string
          timeZone?: string
          attendees?: string[]
          companyId?: string
          contactId?: string
        }
      },
    ) => {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(arg),
      })
      if (!res.ok) throw new Error("Failed to create event")
      return res.json()
    },
  )
}

// Gmail hooks
export function useSendEmail() {
  return useSWRMutation(
    "/api/integrations/gmail/send",
    async (
      url: string,
      {
        arg,
      }: {
        arg: {
          to: string
          subject: string
          body: string
          cc?: string
          bcc?: string
          companyId?: string
          contactId?: string
        }
      },
    ) => {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(arg),
      })
      if (!res.ok) throw new Error("Failed to send email")
      return res.json()
    },
  )
}

// Perplexity hooks
export function usePerplexityResearch() {
  return useSWRMutation(
    "/api/integrations/perplexity/research",
    async (
      url: string,
      {
        arg,
      }: {
        arg: {
          systemPrompt: string
          userPrompt: string
          maxTokens?: number
          temperature?: number
        }
      },
    ) => {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(arg),
      })
      if (!res.ok) throw new Error("Failed to research")
      return res.json()
    },
  )
}
