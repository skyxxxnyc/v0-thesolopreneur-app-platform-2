"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Users,
  Mail,
  TrendingUp,
  Bot,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  ChevronRight,
  Calendar,
  Target,
  Building2,
} from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  const [displayName, setDisplayName] = useState("there")
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadData = async () => {
      try {
        const { createClient } = await import("@/lib/supabase/client")
        const supabase = createClient()

        const {
          data: { user },
          error,
        } = await supabase.auth.getUser()

        if (error || !user) {
          router.push("/auth/login")
          return
        }

        // @ts-expect-error - Supabase query returns unknown type
        const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", user.id).single()

        setDisplayName((profile as { full_name: string | null } | null)?.full_name || user.email?.split("@")[0] || "there")
      } catch {
        router.push("/auth/login")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [router])

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center h-full">
        <div className="w-8 h-8 border-2 border-[#00ff88] border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-8">
      {/* Welcome */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Welcome back, {displayName}</h1>
          <p className="text-zinc-500 mt-1">Here&apos;s what&apos;s happening with your business today.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800">
            <Calendar className="w-4 h-4 mr-2" />
            Last 7 days
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Contacts" value="0" change="+0%" trend="up" icon={Users} color="#00ff88" />
        <StatCard label="Emails Sent" value="0" change="+0%" trend="up" icon={Mail} color="#00d4ff" />
        <StatCard label="Conversion Rate" value="0%" change="+0%" trend="up" icon={TrendingUp} color="#ff6b6b" />
        <StatCard label="AI Actions" value="0" change="+0%" trend="up" icon={Bot} color="#ffd93d" />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800">
          <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
            <h2 className="text-base font-semibold text-white">Recent Activity</h2>
            <Link
              href="/dashboard/companies"
              className="text-xs text-zinc-500 hover:text-white flex items-center gap-1 transition-colors"
            >
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="flex flex-col items-center justify-center h-64 text-center px-6">
            <div className="w-12 h-12 bg-zinc-800 flex items-center justify-center mb-4">
              <Building2 className="w-6 h-6 text-zinc-600" />
            </div>
            <p className="text-zinc-500 mb-1">No activity yet</p>
            <p className="text-xs text-zinc-600 mb-4">Start by adding your first company or contact</p>
            <Link href="/dashboard/companies">
              <Button size="sm" className="bg-[#00ff88] text-black hover:bg-[#00ff88]/90">
                <Plus className="w-3 h-3 mr-1" />
                Add Company
              </Button>
            </Link>
          </div>
        </div>

        {/* AI Agents Status */}
        <div className="bg-zinc-900 border border-zinc-800">
          <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
            <h2 className="text-base font-semibold text-white">AI Agents</h2>
            <Link
              href="/dashboard/agents"
              className="text-xs text-zinc-500 hover:text-white flex items-center gap-1 transition-colors"
            >
              Configure <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="p-4 space-y-3">
            <AgentStatus name="SDR Agent" status="idle" color="#00ff88" />
            <AgentStatus name="Enrichment Agent" status="idle" color="#00d4ff" />
            <AgentStatus name="Outreach Agent" status="idle" color="#ff6b6b" />
            <AgentStatus name="Follow-up Agent" status="idle" color="#ffa500" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-zinc-900 border border-zinc-800">
        <div className="p-4 border-b border-zinc-800">
          <h2 className="text-base font-semibold text-white">Quick Actions</h2>
        </div>
        <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          <QuickAction label="Add Company" href="/dashboard/companies" icon={Building2} color="#00ff88" />
          <QuickAction label="New Lead" href="/dashboard/leads" icon={Target} color="#00d4ff" />
          <QuickAction label="Create Campaign" href="/dashboard/campaigns" icon={Mail} color="#ff6b6b" />
          <QuickAction label="Configure Agents" href="/dashboard/agents" icon={Bot} color="#ffa500" />
        </div>
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  change,
  trend,
  icon: Icon,
  color,
}: {
  label: string
  value: string
  change: string
  trend: "up" | "down"
  icon: React.ElementType
  color: string
}) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 p-5 hover:border-zinc-700 transition-colors group">
      <div className="flex items-start justify-between">
        <div
          className="w-10 h-10 flex items-center justify-center transition-transform group-hover:scale-105"
          style={{ backgroundColor: `${color}15` }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <div className={`flex items-center gap-1 text-xs ${trend === "up" ? "text-[#00ff88]" : "text-red-400"}`}>
          {trend === "up" ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {change}
        </div>
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-sm text-zinc-500">{label}</p>
      </div>
    </div>
  )
}

function AgentStatus({
  name,
  status,
  color,
}: {
  name: string
  status: "active" | "idle" | "error"
  color: string
}) {
  const statusColors = {
    active: "bg-[#00ff88]",
    idle: "bg-zinc-600",
    error: "bg-red-500",
  }

  return (
    <Link
      href="/dashboard/agents"
      className="flex items-center justify-between py-3 px-3 -mx-3 hover:bg-zinc-800/50 transition-colors cursor-pointer group"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
          <Bot className="w-4 h-4" style={{ color }} />
        </div>
        <span className="text-sm text-zinc-300 group-hover:text-white transition-colors">{name}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 ${statusColors[status]} ${status === "active" ? "animate-pulse" : ""}`} />
        <span className="text-xs text-zinc-500 capitalize">{status}</span>
        <ChevronRight className="w-3 h-3 text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </Link>
  )
}

function QuickAction({
  label,
  href,
  icon: Icon,
  color,
}: {
  label: string
  href: string
  icon: React.ElementType
  color: string
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 h-14 px-4 bg-zinc-800 border border-zinc-700 text-sm text-zinc-300 hover:bg-zinc-700 hover:text-white hover:border-zinc-600 transition-all group"
    >
      <Icon className="w-4 h-4 transition-transform group-hover:scale-110" style={{ color }} />
      <span>{label}</span>
      <ChevronRight className="w-3 h-3 ml-auto text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity" />
    </Link>
  )
}
