"use client"

// User type definition for components that need it
export interface User {
  id: string
  email?: string
  user_metadata?: Record<string, unknown>
  app_metadata?: Record<string, unknown>
}

export interface Session {
  access_token: string
  refresh_token: string
  user: User
}

// Supabase client type for type safety
export interface SupabaseClient {
  auth: {
    getUser: () => Promise<{ data: { user: User | null }; error: Error | null }>
    getSession: () => Promise<{ data: { session: Session | null }; error: Error | null }>
    signInWithPassword: (credentials: { email: string; password: string }) => Promise<{
      data: { user: User | null; session: Session | null }
      error: Error | null
    }>
    signUp: (credentials: {
      email: string
      password: string
      options?: { emailRedirectTo?: string; data?: Record<string, unknown> }
    }) => Promise<{ data: { user: User | null; session: Session | null }; error: Error | null }>
    signOut: () => Promise<{ error: Error | null }>
    resetPasswordForEmail: (
      email: string,
      options?: { redirectTo?: string },
    ) => Promise<{ data: object; error: Error | null }>
    onAuthStateChange: (callback: (event: string, session: Session | null) => void) => {
      data: { subscription: { unsubscribe: () => void } }
    }
  }
  from: (table: string) => unknown
}

let clientInstance: unknown = null
let actualClient: any = null

// Main createClient function - dynamically loads @supabase/supabase-js
export function createClient() {
  if (typeof window === "undefined") {
    throw new Error("createClient must be called on the client side")
  }

  if (!clientInstance) {
    // Lazy load supabase-js and create actual client
    const loadClient = async () => {
      if (actualClient) return actualClient

      const { createClient: createSupabaseClient } = await import("@supabase/supabase-js")

      // Get env vars - these must be accessed inside the async function for proper bundling
      const url = 'https://iayuzhyebxfnrydutkom.supabase.co'
      const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlheXV6aHllYnhmbnJ5ZHV0a29tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNzg5NTYsImV4cCI6MjA3Njc1NDk1Nn0.FwVvEuC1KYRlDz3Pf8T2ycXNFsZ2pa2maIwsY5d93hg'

      if (!url || !key) {
        throw new Error('Missing Supabase credentials')
      }

      actualClient = createSupabaseClient(url, key, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      })

      return actualClient
    }

    // Create a proxy that awaits the client on each call
    const pending = loadClient()
    clientInstance = new Proxy({} as SupabaseClient, {
      get(_target, prop) {
        if (prop === "auth") {
          return {
            getUser: async () => {
              const c = await pending
              return c.auth.getUser()
            },
            getSession: async () => {
              const c = await pending
              return c.auth.getSession()
            },
            signInWithPassword: async (creds: { email: string; password: string }) => {
              const c = await pending
              return c.auth.signInWithPassword(creds)
            },
            signUp: async (creds: { email: string; password: string; options?: object }) => {
              const c = await pending
              return c.auth.signUp(creds)
            },
            signOut: async () => {
              const c = await pending
              return c.auth.signOut()
            },
            resetPasswordForEmail: async (email: string, opts?: { redirectTo?: string }) => {
              const c = await pending
              return c.auth.resetPasswordForEmail(email, opts)
            },
            onAuthStateChange: (cb: (event: string, session: Session | null) => void) => {
              pending.then((c) => c.auth.onAuthStateChange(cb))
              return { data: { subscription: { unsubscribe: () => {} } } }
            },
          }
        }
        if (prop === "from") {
          return (table: string) => {
            const getClient = async () => await pending
            return {
              select: (columns?: string) => {
                const selectFn = async () => {
                  const c = await getClient()
                  return c.from(table).select(columns)
                }
                const promise = selectFn() as Promise<unknown> & {
                  eq: (
                    col: string,
                    val: unknown,
                  ) => Promise<unknown> & { single: () => Promise<unknown>; maybeSingle: () => Promise<unknown> }
                  single: () => Promise<unknown>
                }
                // Dynamic method assignment
                promise.eq = (col: string, val: unknown) => {
                  const eqFn = async () => {
                    const c = await getClient()
                    return c.from(table).select(columns).eq(col, val)
                  }
                  const eqPromise = eqFn() as Promise<unknown> & {
                    single: () => Promise<unknown>
                    maybeSingle: () => Promise<unknown>
                  }
                  // Dynamic method assignment
                  eqPromise.single = async () => {
                    const c = await getClient()
                    return c.from(table).select(columns).eq(col, val).single()
                  }
                  // Dynamic method assignment
                  eqPromise.maybeSingle = async () => {
                    const c = await getClient()
                    return c.from(table).select(columns).eq(col, val).maybeSingle()
                  }
                  return eqPromise
                }
                // Dynamic method assignment
                promise.single = async () => {
                  const c = await getClient()
                  return c.from(table).select(columns).single()
                }
                return promise
              },
              insert: (data: unknown) => {
                const insertFn = async () => {
                  const c = await getClient()
                  return c.from(table).insert(data)
                }
                const promise = insertFn() as Promise<unknown> & {
                  select: (columns?: string) => Promise<unknown> & { single: () => Promise<unknown>; maybeSingle: () => Promise<unknown> }
                }
                // Add select method for chaining
                promise.select = (columns?: string) => {
                  const selectFn = async () => {
                    const c = await getClient()
                    return c.from(table).insert(data).select(columns)
                  }
                  const selectPromise = selectFn() as Promise<unknown> & {
                    single: () => Promise<unknown>
                    maybeSingle: () => Promise<unknown>
                  }
                  // Add single method
                  selectPromise.single = async () => {
                    const c = await getClient()
                    return c.from(table).insert(data).select(columns).single()
                  }
                  // Add maybeSingle method
                  selectPromise.maybeSingle = async () => {
                    const c = await getClient()
                    return c.from(table).insert(data).select(columns).maybeSingle()
                  }
                  return selectPromise
                }
                return promise
              },
              update: (data: unknown) => ({
                eq: async (col: string, val: unknown) => {
                  const c = await getClient()
                  return c.from(table).update(data).eq(col, val)
                },
              }),
              delete: () => ({
                eq: async (col: string, val: unknown) => {
                  const c = await getClient()
                  return c.from(table).delete().eq(col, val)
                },
              }),
            }
          }
        }
        return undefined
      },
    })
  }

  return clientInstance as SupabaseClient
}

// Aliases for compatibility
export const createBrowserClient = createClient
export type { User as SupabaseUser }
