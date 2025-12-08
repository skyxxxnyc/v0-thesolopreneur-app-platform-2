"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import type { User } from "@/lib/supabase/client"
import type { Profile, Membership } from "@/lib/types/database"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [memberships, setMemberships] = useState<Membership[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const { createClient } = await import("@/lib/supabase/client")
        const supabase = createClient()

        console.log('Dashboard: Checking auth session...')

        const {
          data: { user },
          error,
        } = await supabase.auth.getUser()

        console.log('Dashboard: User check result:', { user: user?.id, error: error?.message })

        // TEMPORARY: Skip auth check for now
        // if (error || !user) {
        //   console.log('Dashboard: No user found, redirecting to login')
        //   router.push("/auth/login")
        //   return
        // }

        let currentUser = user
        if (user) {
          setUser(user)
          currentUser = user
        } else {
          // Create a mock user for development
          const mockUser = { id: 'dev-user', email: 'dev@example.com' } as any
          setUser(mockUser)
          currentUser = mockUser
        }

        // Get user profile
        // @ts-expect-error - Supabase query returns unknown type
        const { data: profileData, error: profileError } = await supabase.from("profiles").select("*").eq("id", currentUser.id).single()

        if (profileError) {
          console.log('Dashboard: Profile query error (non-fatal):', profileError.message)
        }
        setProfile(profileData as Profile | null)

        // Get user's tenant memberships
        // @ts-expect-error - Supabase query returns unknown type
        const { data: membershipData, error: membershipError } = await supabase
          .from("tenant_members")
          .select(`*, tenant:tenants(*)`)
          .eq("user_id", currentUser.id)

        if (membershipError) {
          console.log('Dashboard: Membership query error (non-fatal):', membershipError.message)
        }
        setMemberships((membershipData as Membership[]) || [])
      } catch (err) {
        console.error('Dashboard: Fatal error during load:', err)
        // Only redirect on critical errors, not on missing data
        // router.push("/auth/login")
      } finally {
        setIsLoading(false)
      }
    }

    loadUserData()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-[#00ff88] border-t-transparent animate-spin" />
          <p className="text-zinc-500 text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex">
      <DashboardSidebar user={user} profile={profile} memberships={memberships} />
      <div className="flex-1 flex flex-col min-h-screen">
        <DashboardHeader user={user} profile={profile} />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
