"use client"

import { useState } from "react"
import {
  Plus,
  Search,
  Filter,
  Play,
  Pause,
  MoreHorizontal,
  Mail,
  Zap,
  TrendingUp,
  Users,
  Eye,
  Reply,
  Calendar,
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
import { cn } from "@/lib/utils"
import { CreateCampaignModal } from "./create-campaign-modal"
import type { Campaign, CampaignStatus, CampaignType } from "@/lib/types/campaign"

// Mock data
const mockCampaigns: Campaign[] = [
  {
    id: "1",
    tenant_id: "t1",
    name: "Q4 Outbound - Agency Owners",
    description: "Cold outreach to agency owners with 5-20 employees",
    type: "outbound",
    status: "active",
    target_segment: {},
    exclude_segment: {},
    start_date: "2024-01-15",
    end_date: null,
    send_window_start: "09:00",
    send_window_end: "17:00",
    send_days: [1, 2, 3, 4, 5],
    timezone: "America/New_York",
    daily_limit: 50,
    respect_unsubscribes: true,
    stop_on_reply: true,
    stop_on_meeting: true,
    enrolled_count: 342,
    completed_count: 189,
    replied_count: 47,
    meeting_count: 12,
    bounce_count: 8,
    created_by: null,
    created_at: "2024-01-10",
    updated_at: "2024-01-15",
  },
  {
    id: "2",
    tenant_id: "t1",
    name: "Website Lead Nurture",
    description: "Automated nurture for inbound website leads",
    type: "nurture",
    status: "active",
    target_segment: {},
    exclude_segment: {},
    start_date: "2024-01-01",
    end_date: null,
    send_window_start: "08:00",
    send_window_end: "20:00",
    send_days: [1, 2, 3, 4, 5, 6],
    timezone: "America/New_York",
    daily_limit: 100,
    respect_unsubscribes: true,
    stop_on_reply: true,
    stop_on_meeting: true,
    enrolled_count: 1247,
    completed_count: 892,
    replied_count: 156,
    meeting_count: 34,
    bounce_count: 23,
    created_by: null,
    created_at: "2024-01-01",
    updated_at: "2024-01-12",
  },
  {
    id: "3",
    tenant_id: "t1",
    name: "Re-engagement - Cold Leads",
    description: "Re-engage leads that went cold 30+ days ago",
    type: "email",
    status: "paused",
    target_segment: {},
    exclude_segment: {},
    start_date: "2024-01-20",
    end_date: null,
    send_window_start: "10:00",
    send_window_end: "16:00",
    send_days: [2, 4],
    timezone: "America/New_York",
    daily_limit: 25,
    respect_unsubscribes: true,
    stop_on_reply: true,
    stop_on_meeting: true,
    enrolled_count: 156,
    completed_count: 0,
    replied_count: 0,
    meeting_count: 0,
    bounce_count: 0,
    created_by: null,
    created_at: "2024-01-18",
    updated_at: "2024-01-18",
  },
]

const typeConfig: Record<CampaignType, { label: string; color: string; icon: typeof Mail }> = {
  email: { label: "Email", color: "#00d4ff", icon: Mail },
  multi_channel: { label: "Multi-Channel", color: "#ff6b6b", icon: Zap },
  nurture: { label: "Nurture", color: "#00ff88", icon: TrendingUp },
  outbound: { label: "Outbound", color: "#ffa500", icon: Users },
}

const statusConfig: Record<CampaignStatus, { label: string; color: string }> = {
  draft: { label: "Draft", color: "#6b7280" },
  active: { label: "Active", color: "#00ff88" },
  paused: { label: "Paused", color: "#ffa500" },
  completed: { label: "Completed", color: "#00d4ff" },
  archived: { label: "Archived", color: "#4b5563" },
}

export function CampaignsView() {
  const [campaigns] = useState<Campaign[]>(mockCampaigns)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<CampaignStatus | "all">("all")
  const [showCreateModal, setShowCreateModal] = useState(false)

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || campaign.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    active: campaigns.filter((c) => c.status === "active").length,
    totalEnrolled: campaigns.reduce((sum, c) => sum + c.enrolled_count, 0),
    totalReplies: campaigns.reduce((sum, c) => sum + c.replied_count, 0),
    totalMeetings: campaigns.reduce((sum, c) => sum + c.meeting_count, 0),
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Campaigns</h1>
          <p className="text-sm text-zinc-500 mt-1">Automated outreach sequences and nurture flows</p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="bg-[#00ff88] text-black hover:bg-[#00ff88]/90 font-medium"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Campaign
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Play className="w-4 h-4 text-[#00ff88]" />
            <span className="text-xs text-zinc-500 uppercase tracking-wider">Active</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.active}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-[#00d4ff]" />
            <span className="text-xs text-zinc-500 uppercase tracking-wider">Enrolled</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.totalEnrolled.toLocaleString()}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Reply className="w-4 h-4 text-[#ff6b6b]" />
            <span className="text-xs text-zinc-500 uppercase tracking-wider">Replies</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.totalReplies}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-[#ffa500]" />
            <span className="text-xs text-zinc-500 uppercase tracking-wider">Meetings</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.totalMeetings}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <Input
            placeholder="Search campaigns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800">
              <Filter className="w-4 h-4 mr-2" />
              {statusFilter === "all" ? "All Status" : statusConfig[statusFilter].label}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-zinc-900 border-zinc-800">
            <DropdownMenuItem onClick={() => setStatusFilter("all")} className="text-zinc-300 focus:bg-zinc-800">
              All Status
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-zinc-800" />
            {Object.entries(statusConfig).map(([key, config]) => (
              <DropdownMenuItem
                key={key}
                onClick={() => setStatusFilter(key as CampaignStatus)}
                className="text-zinc-300 focus:bg-zinc-800"
              >
                <span className="w-2 h-2 mr-2" style={{ backgroundColor: config.color }} />
                {config.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Campaign List */}
      <div className="space-y-3">
        {filteredCampaigns.map((campaign) => {
          const typeInfo = typeConfig[campaign.type]
          const statusInfo = statusConfig[campaign.status]
          const TypeIcon = typeInfo.icon
          const replyRate =
            campaign.enrolled_count > 0 ? ((campaign.replied_count / campaign.enrolled_count) * 100).toFixed(1) : "0"

          return (
            <div
              key={campaign.id}
              className="bg-zinc-900 border border-zinc-800 p-5 hover:border-zinc-700 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${typeInfo.color}20` }}
                  >
                    <TypeIcon className="w-5 h-5" style={{ color: typeInfo.color }} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-medium text-white">{campaign.name}</h3>
                      <span
                        className="px-2 py-0.5 text-xs font-medium"
                        style={{
                          backgroundColor: `${statusInfo.color}20`,
                          color: statusInfo.color,
                        }}
                      >
                        {statusInfo.label}
                      </span>
                      <span
                        className="px-2 py-0.5 text-xs"
                        style={{
                          backgroundColor: `${typeInfo.color}15`,
                          color: typeInfo.color,
                        }}
                      >
                        {typeInfo.label}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-500">{campaign.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className={cn(
                      "h-8 w-8 p-0",
                      campaign.status === "active"
                        ? "text-[#00ff88] hover:bg-[#00ff88]/10"
                        : "text-zinc-500 hover:bg-zinc-800",
                    )}
                  >
                    {campaign.status === "active" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-zinc-500 hover:bg-zinc-800">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800">
                      <DropdownMenuItem className="text-zinc-300 focus:bg-zinc-800">Edit Campaign</DropdownMenuItem>
                      <DropdownMenuItem className="text-zinc-300 focus:bg-zinc-800">View Analytics</DropdownMenuItem>
                      <DropdownMenuItem className="text-zinc-300 focus:bg-zinc-800">Duplicate</DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-zinc-800" />
                      <DropdownMenuItem className="text-red-400 focus:bg-zinc-800">Archive</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Stats Row */}
              <div className="flex items-center gap-6 mt-4 pt-4 border-t border-zinc-800">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-zinc-600" />
                  <span className="text-sm text-zinc-400">{campaign.enrolled_count} enrolled</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-zinc-600" />
                  <span className="text-sm text-zinc-400">{campaign.completed_count} completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <Reply className="w-4 h-4 text-zinc-600" />
                  <span className="text-sm text-zinc-400">
                    {campaign.replied_count} replies ({replyRate}%)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-zinc-600" />
                  <span className="text-sm text-zinc-400">{campaign.meeting_count} meetings</span>
                </div>
              </div>
            </div>
          )
        })}

        {filteredCampaigns.length === 0 && (
          <div className="bg-zinc-900 border border-zinc-800 p-12 text-center">
            <p className="text-zinc-500">No campaigns found</p>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="mt-4 bg-[#00ff88] text-black hover:bg-[#00ff88]/90"
            >
              Create your first campaign
            </Button>
          </div>
        )}
      </div>

      <CreateCampaignModal open={showCreateModal} onOpenChange={setShowCreateModal} />
    </div>
  )
}
