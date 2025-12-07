"use client"

import { useState } from "react"
import { Plus, Search, DollarSign, TrendingUp, Trophy, XCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DealDetailModal } from "./deal-detail-modal"
import { AddDealModal } from "./add-deal-modal"
import type { Deal } from "@/lib/types/crm"

interface DealsViewProps {
  deals: Deal[]
  companies: { id: string; name: string }[]
  contacts: { id: string; first_name: string; last_name: string | null; company_id: string | null }[]
  tenantId: string | null
}

const stageColors: Record<string, string> = {
  qualification: "bg-zinc-700 text-zinc-300",
  discovery: "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30",
  proposal: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
  negotiation: "bg-orange-500/20 text-orange-400 border border-orange-500/30",
  closed_won: "bg-[#00ff88]/20 text-[#00ff88] border border-[#00ff88]/30",
  closed_lost: "bg-red-500/20 text-red-400 border border-red-500/30",
}

const stageOrder = ["qualification", "discovery", "proposal", "negotiation", "closed_won", "closed_lost"]

export function DealsView({ deals, companies, contacts, tenantId }: DealsViewProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const filteredDeals = deals.filter((deal) => {
    return (
      deal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (deal as any).company?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  const dealsByStage = stageOrder.reduce(
    (acc, stage) => {
      acc[stage] = filteredDeals.filter((d) => d.stage === stage)
      return acc
    },
    {} as Record<string, Deal[]>,
  )

  const openDeals = deals.filter((d) => !["closed_won", "closed_lost"].includes(d.stage))
  const wonDeals = deals.filter((d) => d.stage === "closed_won")
  const lostDeals = deals.filter((d) => d.stage === "closed_lost")

  const stats = {
    pipeline: openDeals.reduce((sum, d) => sum + d.amount, 0),
    won: wonDeals.reduce((sum, d) => sum + d.amount, 0),
    lost: lostDeals.reduce((sum, d) => sum + d.amount, 0),
    avgDealSize: deals.length > 0 ? deals.reduce((sum, d) => sum + d.amount, 0) / deals.length : 0,
  }

  // Check if user can create deals (has qualifying activities)
  const canCreateDeal = companies.length > 0

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Deals</h1>
          <p className="text-sm text-zinc-500 mt-1">Pipeline and revenue tracking</p>
        </div>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          disabled={!canCreateDeal}
          className="bg-[#00ff88] text-black hover:bg-[#00ff88]/90 font-semibold disabled:opacity-50"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Deal
        </Button>
      </div>

      {/* Qualification Notice */}
      {!canCreateDeal && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-yellow-400">Deals require prior contact</p>
            <p className="text-xs text-zinc-500 mt-1">
              You must have at least one completed activity (call, email, or meeting) with a company before creating a
              deal.
            </p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 p-4">
          <div className="flex items-center justify-between">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            <span className="text-xl font-bold text-cyan-400">${stats.pipeline.toLocaleString()}</span>
          </div>
          <p className="text-xs text-zinc-500 mt-2 uppercase tracking-wide">Pipeline Value</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-4">
          <div className="flex items-center justify-between">
            <Trophy className="w-5 h-5 text-[#00ff88]" />
            <span className="text-xl font-bold text-[#00ff88]">${stats.won.toLocaleString()}</span>
          </div>
          <p className="text-xs text-zinc-500 mt-2 uppercase tracking-wide">Won</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-4">
          <div className="flex items-center justify-between">
            <XCircle className="w-5 h-5 text-red-400" />
            <span className="text-xl font-bold text-red-400">${stats.lost.toLocaleString()}</span>
          </div>
          <p className="text-xs text-zinc-500 mt-2 uppercase tracking-wide">Lost</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-4">
          <div className="flex items-center justify-between">
            <DollarSign className="w-5 h-5 text-yellow-400" />
            <span className="text-xl font-bold text-yellow-400">${Math.round(stats.avgDealSize).toLocaleString()}</span>
          </div>
          <p className="text-xs text-zinc-500 mt-2 uppercase tracking-wide">Avg Deal Size</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <Input
          placeholder="Search deals..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600"
        />
      </div>

      {/* Pipeline Kanban */}
      <div className="grid grid-cols-6 gap-3">
        {stageOrder.map((stage) => {
          const stageDeals = dealsByStage[stage] || []
          const stageValue = stageDeals.reduce((sum, d) => sum + d.amount, 0)

          return (
            <div key={stage} className="space-y-3">
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white capitalize">{stage.replace("_", " ")}</span>
                  <span className="text-xs text-zinc-600">{stageDeals.length}</span>
                </div>
                <span className="text-xs text-zinc-500 font-mono">${stageValue.toLocaleString()}</span>
              </div>

              <div className="space-y-2 min-h-[300px]">
                {stageDeals.length === 0 ? (
                  <div className="bg-zinc-900/50 border border-dashed border-zinc-800 p-3 text-center">
                    <p className="text-xs text-zinc-600">No deals</p>
                  </div>
                ) : (
                  stageDeals.map((deal) => (
                    <div
                      key={deal.id}
                      onClick={() => setSelectedDeal(deal)}
                      className="bg-zinc-900 border border-zinc-800 p-3 hover:border-zinc-700 cursor-pointer transition-colors"
                    >
                      <p className="font-medium text-white text-sm mb-1 line-clamp-1">{deal.name}</p>
                      <p className="text-lg font-bold text-[#00ff88] mb-2">
                        {deal.currency} {deal.amount.toLocaleString()}
                      </p>
                      {(deal as any).company && (
                        <p className="text-xs text-zinc-500 mb-2">{(deal as any).company.name}</p>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-zinc-600">{deal.probability}%</span>
                        {deal.expected_close_date && (
                          <span className="text-xs text-zinc-600">
                            {new Date(deal.expected_close_date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>

      {selectedDeal && <DealDetailModal deal={selectedDeal} onClose={() => setSelectedDeal(null)} />}
      {isAddModalOpen && tenantId && (
        <AddDealModal
          tenantId={tenantId}
          companies={companies}
          contacts={contacts}
          onClose={() => setIsAddModalOpen(false)}
        />
      )}
    </div>
  )
}
