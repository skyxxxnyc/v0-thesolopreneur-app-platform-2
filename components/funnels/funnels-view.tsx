"use client"

import { useState } from "react"
import {
  Plus,
  Search,
  LayoutTemplate,
  Globe,
  BarChart3,
  MoreVertical,
  ExternalLink,
  Copy,
  Trash2,
  Archive,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CreateFunnelModal } from "./create-funnel-modal"
import type { Funnel } from "@/lib/types/funnel"

// Mock data
const mockFunnels: Funnel[] = [
  {
    id: "1",
    tenant_id: "t1",
    name: "SaaS Launch Funnel",
    slug: "saas-launch",
    description: "High-converting funnel for product launches",
    status: "published",
    template_id: "lead-gen-1",
    settings: { primary_color: "#00ff88" },
    custom_domain: null,
    created_by: "u1",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-20T14:30:00Z",
    published_at: "2024-01-18T09:00:00Z",
  },
  {
    id: "2",
    tenant_id: "t1",
    name: "Webinar Registration",
    slug: "webinar-jan",
    description: "Webinar signup with countdown timer",
    status: "draft",
    template_id: "webinar-1",
    settings: { primary_color: "#00d4ff" },
    custom_domain: null,
    created_by: "u1",
    created_at: "2024-01-22T08:00:00Z",
    updated_at: "2024-01-22T08:00:00Z",
    published_at: null,
  },
  {
    id: "3",
    tenant_id: "t1",
    name: "Free Consultation Offer",
    slug: "free-consult",
    description: "Book a call funnel with calendar integration",
    status: "published",
    template_id: "sales-1",
    settings: { primary_color: "#ff6b6b" },
    custom_domain: "offer.clientsite.com",
    created_by: "u1",
    created_at: "2024-01-10T12:00:00Z",
    updated_at: "2024-01-25T16:00:00Z",
    published_at: "2024-01-12T10:00:00Z",
  },
]

// Mock analytics
const mockAnalytics: Record<string, { views: number; conversions: number }> = {
  "1": { views: 2847, conversions: 312 },
  "2": { views: 0, conversions: 0 },
  "3": { views: 1523, conversions: 89 },
}

export function FunnelsView() {
  const [funnels] = useState<Funnel[]>(mockFunnels)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [showCreateModal, setShowCreateModal] = useState(false)

  const filteredFunnels = funnels.filter((funnel) => {
    const matchesSearch = funnel.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || funnel.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-[#00ff88]/20 text-[#00ff88] border-[#00ff88]/30"
      case "draft":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "archived":
        return "bg-zinc-500/20 text-zinc-400 border-zinc-500/30"
      default:
        return "bg-zinc-500/20 text-zinc-400 border-zinc-500/30"
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Funnels</h1>
          <p className="text-zinc-500 text-sm mt-1">Build landing pages and conversion funnels</p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="bg-[#00ff88] text-black hover:bg-[#00ff88]/90 font-semibold"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Funnel
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Funnels", value: funnels.length, color: "text-white" },
          {
            label: "Published",
            value: funnels.filter((f) => f.status === "published").length,
            color: "text-[#00ff88]",
          },
          {
            label: "Total Views",
            value: Object.values(mockAnalytics)
              .reduce((a, b) => a + b.views, 0)
              .toLocaleString(),
            color: "text-[#00d4ff]",
          },
          {
            label: "Conversions",
            value: Object.values(mockAnalytics)
              .reduce((a, b) => a + b.conversions, 0)
              .toLocaleString(),
            color: "text-[#ff6b6b]",
          },
        ].map((stat) => (
          <div key={stat.label} className="bg-zinc-900 border border-zinc-800 p-4">
            <p className="text-zinc-500 text-xs uppercase tracking-wider">{stat.label}</p>
            <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <Input
            placeholder="Search funnels..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600"
          />
        </div>
        <div className="flex gap-1">
          {["all", "published", "draft", "archived"].map((status) => (
            <Button
              key={status}
              variant="ghost"
              size="sm"
              onClick={() => setStatusFilter(status)}
              className={statusFilter === status ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-white"}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Funnel Grid */}
      <div className="grid grid-cols-3 gap-4">
        {filteredFunnels.map((funnel) => {
          const analytics = mockAnalytics[funnel.id] || { views: 0, conversions: 0 }
          const conversionRate =
            analytics.views > 0 ? ((analytics.conversions / analytics.views) * 100).toFixed(1) : "0"

          return (
            <div
              key={funnel.id}
              className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors group"
            >
              {/* Thumbnail */}
              <div
                className="h-40 relative overflow-hidden"
                style={{ backgroundColor: (funnel.settings as { primary_color?: string }).primary_color || "#00ff88" }}
              >
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <LayoutTemplate className="w-12 h-12 text-white/50" />
                </div>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost" className="h-8 w-8 bg-black/50 hover:bg-black/70">
                        <MoreVertical className="w-4 h-4 text-white" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-zinc-900 border-zinc-800">
                      <DropdownMenuItem className="text-zinc-300 focus:bg-zinc-800 focus:text-white">
                        <ExternalLink className="w-4 h-4 mr-2" /> Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-zinc-300 focus:bg-zinc-800 focus:text-white">
                        <Copy className="w-4 h-4 mr-2" /> Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-zinc-800" />
                      <DropdownMenuItem className="text-zinc-300 focus:bg-zinc-800 focus:text-white">
                        <Archive className="w-4 h-4 mr-2" /> Archive
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-400 focus:bg-zinc-800 focus:text-red-400">
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div
                  className={`absolute top-2 left-2 px-2 py-0.5 text-[10px] font-semibold uppercase border ${getStatusColor(funnel.status)}`}
                >
                  {funnel.status}
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-white truncate">{funnel.name}</h3>
                  <p className="text-xs text-zinc-500 truncate mt-0.5">{funnel.description}</p>
                </div>

                {/* Stats Row */}
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1.5 text-zinc-400">
                    <Globe className="w-3.5 h-3.5" />
                    <span>{analytics.views.toLocaleString()} views</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-zinc-400">
                    <BarChart3 className="w-3.5 h-3.5" />
                    <span>{conversionRate}% CVR</span>
                  </div>
                </div>

                {/* URL */}
                {funnel.status === "published" && (
                  <div className="flex items-center gap-2 text-xs text-zinc-600 bg-zinc-800/50 px-2 py-1.5">
                    <Globe className="w-3 h-3" />
                    <span className="truncate">
                      {funnel.custom_domain || `app.thesolopreneur.app/f/${funnel.slug}`}
                    </span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white h-8 text-xs bg-transparent"
                    asChild
                  >
                    <a href={`/dashboard/funnels/${funnel.id}`}>Edit</a>
                  </Button>
                  {funnel.status === "published" && (
                    <Button
                      size="sm"
                      className="bg-[#00ff88] text-black hover:bg-[#00ff88]/90 h-8 text-xs font-semibold"
                    >
                      View Live
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )
        })}

        {/* Empty state for new funnel */}
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-zinc-900/50 border border-dashed border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 transition-colors flex flex-col items-center justify-center gap-3 min-h-[280px]"
        >
          <div className="w-12 h-12 bg-zinc-800 flex items-center justify-center">
            <Plus className="w-6 h-6 text-zinc-500" />
          </div>
          <span className="text-sm text-zinc-500">Create new funnel</span>
        </button>
      </div>

      <CreateFunnelModal open={showCreateModal} onOpenChange={setShowCreateModal} />
    </div>
  )
}
