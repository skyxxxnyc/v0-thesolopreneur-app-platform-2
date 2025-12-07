"use client"

import { useState } from "react"
import { Plus, Search, Filter, MoreHorizontal, Target, Zap, ArrowRight, Bot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { LeadDetailModal } from "./lead-detail-modal"
import { AddLeadModal } from "./add-lead-modal"
import type { Lead } from "@/lib/types/crm"

interface LeadsViewProps {
  leads: Lead[]
  tenantId: string | null
}

const statusColors: Record<string, string> = {
  new: "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30",
  contacted: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
  qualified: "bg-[#00ff88]/20 text-[#00ff88] border border-[#00ff88]/30",
  unqualified: "bg-zinc-700 text-zinc-400",
  converted: "bg-[#00ff88] text-black",
  lost: "bg-red-500/20 text-red-400 border border-red-500/30",
}

const recommendationColors: Record<string, string> = {
  high_priority: "text-[#00ff88]",
  medium_priority: "text-yellow-400",
  low_priority: "text-zinc-400",
  not_a_fit: "text-red-400",
}

export function LeadsView({ leads, tenantId }: LeadsViewProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string | null>(null)

  const filteredLeads = leads.filter((lead) => {
    const fullName = `${lead.first_name || ""} ${lead.last_name || ""}`.toLowerCase()
    const matchesSearch =
      fullName.includes(searchQuery.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company_name?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = !statusFilter || lead.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const stats = {
    total: leads.length,
    new: leads.filter((l) => l.status === "new").length,
    qualified: leads.filter((l) => l.status === "qualified").length,
    avgIcpScore:
      leads.filter((l) => l.icp_fit_score).reduce((sum, l) => sum + (l.icp_fit_score || 0), 0) /
        leads.filter((l) => l.icp_fit_score).length || 0,
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Leads</h1>
          <p className="text-sm text-zinc-500 mt-1">Incoming prospects to qualify and convert</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white">
            <Bot className="w-4 h-4 mr-2" />
            Run SDR Agent
          </Button>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#00ff88] text-black hover:bg-[#00ff88]/90 font-semibold"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Lead
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 p-4">
          <div className="flex items-center justify-between">
            <Target className="w-5 h-5 text-white" />
            <span className="text-2xl font-bold text-white">{stats.total}</span>
          </div>
          <p className="text-xs text-zinc-500 mt-2 uppercase tracking-wide">Total Leads</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-4">
          <div className="flex items-center justify-between">
            <Zap className="w-5 h-5 text-cyan-400" />
            <span className="text-2xl font-bold text-cyan-400">{stats.new}</span>
          </div>
          <p className="text-xs text-zinc-500 mt-2 uppercase tracking-wide">New</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-4">
          <div className="flex items-center justify-between">
            <ArrowRight className="w-5 h-5 text-[#00ff88]" />
            <span className="text-2xl font-bold text-[#00ff88]">{stats.qualified}</span>
          </div>
          <p className="text-xs text-zinc-500 mt-2 uppercase tracking-wide">Qualified</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-4">
          <div className="flex items-center justify-between">
            <Bot className="w-5 h-5 text-yellow-400" />
            <span className="text-2xl font-bold text-yellow-400">{Math.round(stats.avgIcpScore)}%</span>
          </div>
          <p className="text-xs text-zinc-500 mt-2 uppercase tracking-wide">Avg ICP Score</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <Input
            placeholder="Search leads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white">
              <Filter className="w-4 h-4 mr-2" />
              {statusFilter ? statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1) : "All Status"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-zinc-900 border-zinc-800">
            <DropdownMenuItem onClick={() => setStatusFilter(null)} className="text-zinc-300 focus:bg-zinc-800">
              All Status
            </DropdownMenuItem>
            {["new", "contacted", "qualified", "unqualified", "converted", "lost"].map((status) => (
              <DropdownMenuItem
                key={status}
                onClick={() => setStatusFilter(status)}
                className="text-zinc-300 focus:bg-zinc-800 capitalize"
              >
                {status}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <div className="bg-zinc-900 border border-zinc-800 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">Lead</th>
              <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">Company</th>
              <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">Source</th>
              <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">Status</th>
              <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">ICP Score</th>
              <th className="w-12"></th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-zinc-500">
                  {leads.length === 0 ? (
                    <div className="space-y-2">
                      <Target className="w-8 h-8 mx-auto text-zinc-600" />
                      <p>No leads yet</p>
                      <Button
                        size="sm"
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-[#00ff88] text-black hover:bg-[#00ff88]/90"
                      >
                        Add your first lead
                      </Button>
                    </div>
                  ) : (
                    "No leads match your search"
                  )}
                </td>
              </tr>
            ) : (
              filteredLeads.map((lead) => {
                const sdrAnalysis = (lead as any).sdr_analysis?.[0]
                return (
                  <tr
                    key={lead.id}
                    className="border-b border-zinc-800/50 hover:bg-zinc-800/30 cursor-pointer transition-colors"
                    onClick={() => setSelectedLead(lead)}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                          <span className="text-sm font-bold text-yellow-400">
                            {(lead.first_name || "?").charAt(0)}
                            {(lead.last_name || "").charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-white">
                            {lead.first_name || "Unknown"} {lead.last_name || ""}
                          </p>
                          {lead.email && <p className="text-xs text-zinc-500">{lead.email}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-zinc-400">{lead.company_name || "—"}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-zinc-500">{lead.source || "—"}</span>
                    </td>
                    <td className="p-4">
                      <Badge className={statusColors[lead.status]}>{lead.status}</Badge>
                    </td>
                    <td className="p-4">
                      {sdrAnalysis?.icp_match_score ? (
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-sm font-mono font-bold ${recommendationColors[sdrAnalysis.recommendation] || "text-zinc-400"}`}
                          >
                            {sdrAnalysis.icp_match_score}%
                          </span>
                          <Bot className="w-3 h-3 text-zinc-600" />
                        </div>
                      ) : (
                        <span className="text-xs text-zinc-600">Not analyzed</span>
                      )}
                    </td>
                    <td className="p-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-zinc-500 hover:text-white">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800">
                          <DropdownMenuItem className="text-zinc-300 focus:bg-zinc-800">
                            <Bot className="w-4 h-4 mr-2" />
                            Run SDR Analysis
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-[#00ff88] focus:bg-zinc-800">
                            <ArrowRight className="w-4 h-4 mr-2" />
                            Convert to Contact
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-zinc-300 focus:bg-zinc-800">Edit</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-400 focus:bg-zinc-800">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {selectedLead && <LeadDetailModal lead={selectedLead} onClose={() => setSelectedLead(null)} />}

      {isAddModalOpen && tenantId && <AddLeadModal tenantId={tenantId} onClose={() => setIsAddModalOpen(false)} />}
    </div>
  )
}
