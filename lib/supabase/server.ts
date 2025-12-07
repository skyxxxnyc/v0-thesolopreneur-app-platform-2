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

  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
