import { cookies } from "next/headers"

// Server-side Supabase client that dynamically loads @supabase/supabase-js
export async function createClient() {
  const { createClient: createSupabaseClient } = await import("@supabase/supabase-js")
  const cookieStore = await cookies()

  // Try to get existing session from cookies
  const allCookies = cookieStore.getAll()
  const authCookie = allCookies.find((c) => c.name.includes("auth-token") || c.name.includes("sb-"))

  let accessToken: string | undefined
  if (authCookie?.value) {
    try {
      const parsed = JSON.parse(authCookie.value)
      accessToken = parsed.access_token
    } catch {
      // Not JSON, might be the token directly
      accessToken = authCookie.value
    }
  }

  // Hardcode the values for now since env vars aren't loading properly
  const url = 'https://iayuzhyebxfnrydutkom.supabase.co'
  const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlheXV6aHllYnhmbnJ5ZHV0a29tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNzg5NTYsImV4cCI6MjA3Njc1NDk1Nn0.FwVvEuC1KYRlDz3Pf8T2ycXNFsZ2pa2maIwsY5d93hg'

  const supabase = createSupabaseClient(
    url,
    key,
    {
      global: {
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
      },
    },
  )

  return supabase
}

// Alias for compatibility with existing imports
export const createServerClient = createClient
