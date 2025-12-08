"use client"

import { useState, useEffect } from "react"
import {
  X,
  DollarSign,
  Building2,
  User,
  Calendar,
  Activity,
  CheckCircle,
  Phone,
  Mail,
  MessageSquare,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createBrowserClient } from "@/lib/supabase/client"
import type { Deal, Activity as ActivityType, Note } from "@/lib/types/crm"

interface DealDetailModalProps {
  deal: Deal
  onClose: () => void
}

const stageColors: Record<string, string> = {
  qualification: "bg-zinc-700 text-zinc-300",
  discovery: "bg-cyan-500/20 text-cyan-400",
  proposal: "bg-yellow-500/20 text-yellow-400",
  negotiation: "bg-orange-500/20 text-orange-400",
  closed_won: "bg-[#00ff88]/20 text-[#00ff88]",
  closed_lost: "bg-red-500/20 text-red-400",
}

export function DealDetailModal({ deal, onClose }: DealDetailModalProps) {
  const [activities, setActivities] = useState<ActivityType[]>([])
  const [notes, setNotes] = useState<Note[]>([])
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    async function loadData() {
      const supabase = createBrowserClient()

      const [activitiesRes, notesRes] = await Promise.all([
        // @ts-expect-error - Supabase select returns unknown in strict mode
        supabase
          .from("activities")
          .select("*, owner:profiles(id, full_name)")
          .eq("deal_id", deal.id)
          .order("created_at", { ascending: false })
          .limit(20),
        // @ts-expect-error - Supabase select returns unknown in strict mode
        supabase
          .from("notes")
          .select("*, author:profiles(id, full_name)")
          .eq("entity_type", "deal")
          .eq("entity_id", deal.id)
          .order("created_at", { ascending: false }),
      ])

      setActivities((activitiesRes.data || []) as ActivityType[])
      setNotes((notesRes.data || []) as Note[])
    }
    loadData()
  }, [deal.id])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [onClose])

  const expectedValue = deal.amount * (deal.probability / 100)

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <div className="relative w-full max-w-2xl h-full bg-zinc-950 border-l border-zinc-800 overflow-hidden flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex-shrink-0 border-b border-zinc-800 p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-zinc-900 border-2 border-[#00ff88]/50 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-[#00ff88]" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-white">{deal.name}</h2>
                  <Badge className={stageColors[deal.stage]}>{deal.stage.replace("_", " ")}</Badge>
                </div>
                <p className="text-2xl font-bold text-[#00ff88] mt-1">
                  {deal.currency} {deal.amount.toLocaleString()}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-zinc-500 hover:text-white">
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-zinc-900 border border-zinc-800 p-3">
              <div className="flex items-center gap-2 text-zinc-500">
                <Activity className="w-4 h-4" />
                <span className="text-xs uppercase">Probability</span>
              </div>
              <p className="text-lg font-bold text-white mt-1">{deal.probability}%</p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 p-3">
              <div className="flex items-center gap-2 text-zinc-500">
                <DollarSign className="w-4 h-4" />
                <span className="text-xs uppercase">Expected</span>
              </div>
              <p className="text-lg font-bold text-cyan-400 mt-1">
                {deal.currency} {expectedValue.toLocaleString()}
              </p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 p-3">
              <div className="flex items-center gap-2 text-zinc-500">
                <Calendar className="w-4 h-4" />
                <span className="text-xs uppercase">Close Date</span>
              </div>
              <p className="text-sm font-medium text-white mt-1">
                {deal.expected_close_date ? new Date(deal.expected_close_date).toLocaleDateString() : "Not set"}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="flex-shrink-0 w-full justify-start border-b border-zinc-800 bg-transparent px-6 h-12">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:text-[#00ff88] data-[state=active]:border-b-2 data-[state=active]:border-[#00ff88] rounded-none"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="activity"
              className="data-[state=active]:text-[#00ff88] data-[state=active]:border-b-2 data-[state=active]:border-[#00ff88] rounded-none"
            >
              Activity
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-auto">
            <TabsContent value="overview" className="p-6 space-y-6 mt-0">
              {/* Company & Contact */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Linked Records</h3>
                <div className="space-y-2">
                  {(deal as any).company && (
                    <div className="flex items-center gap-3 p-3 bg-zinc-900 border border-zinc-800">
                      <Building2 className="w-5 h-5 text-[#00ff88]" />
                      <div>
                        <p className="font-medium text-white">{(deal as any).company.name}</p>
                        <p className="text-xs text-zinc-500">Company</p>
                      </div>
                    </div>
                  )}
                  {(deal as any).contact && (
                    <div className="flex items-center gap-3 p-3 bg-zinc-900 border border-zinc-800">
                      <User className="w-5 h-5 text-cyan-400" />
                      <div>
                        <p className="font-medium text-white">
                          {(deal as any).contact.first_name} {(deal as any).contact.last_name}
                        </p>
                        <p className="text-xs text-zinc-500">Contact</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Qualifying Activity */}
              {(deal as any).qualifying_activity && (
                <div className="space-y-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Qualifying Activity</h3>
                  <div className="bg-[#00ff88]/10 border border-[#00ff88]/30 p-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-[#00ff88]" />
                      <span className="text-sm font-medium text-[#00ff88] capitalize">
                        {(deal as any).qualifying_activity.type}
                      </span>
                    </div>
                    {(deal as any).qualifying_activity.subject && (
                      <p className="text-sm text-zinc-400 mt-1">{(deal as any).qualifying_activity.subject}</p>
                    )}
                    <p className="text-xs text-zinc-600 mt-2">
                      {new Date((deal as any).qualifying_activity.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}

              {/* Description */}
              {deal.description && (
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Description</h3>
                  <p className="text-sm text-zinc-300">{deal.description}</p>
                </div>
              )}

              {/* Notes */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Notes</h3>
                {notes.length === 0 ? (
                  <p className="text-sm text-zinc-600">No notes yet</p>
                ) : (
                  <div className="space-y-3">
                    {notes.map((note) => (
                      <div key={note.id} className="bg-zinc-900 border border-zinc-800 p-3">
                        <p className="text-sm text-zinc-300">{note.content}</p>
                        <p className="text-xs text-zinc-600 mt-2">
                          {(note as any).author?.full_name} • {new Date(note.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="activity" className="p-6 mt-0">
              {activities.length === 0 ? (
                <div className="text-center py-8 text-zinc-500">
                  <Activity className="w-8 h-8 mx-auto mb-2 text-zinc-600" />
                  <p>No activities logged yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div key={activity.id} className="flex gap-4 bg-zinc-900 border border-zinc-800 p-3">
                      <div
                        className={`w-8 h-8 flex items-center justify-center shrink-0 ${
                          activity.type === "call"
                            ? "bg-[#00ff88]/20 text-[#00ff88]"
                            : activity.type === "email"
                              ? "bg-cyan-500/20 text-cyan-400"
                              : activity.type === "meeting"
                                ? "bg-yellow-500/20 text-yellow-400"
                                : "bg-zinc-800 text-zinc-400"
                        }`}
                      >
                        {activity.type === "call" && <Phone className="w-4 h-4" />}
                        {activity.type === "email" && <Mail className="w-4 h-4" />}
                        {activity.type === "meeting" && <MessageSquare className="w-4 h-4" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-white capitalize">{activity.type}</span>
                          {activity.subject && <span className="text-sm text-zinc-500">- {activity.subject}</span>}
                        </div>
                        <p className="text-xs text-zinc-600 mt-1">
                          {(activity as any).owner?.full_name} • {new Date(activity.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
