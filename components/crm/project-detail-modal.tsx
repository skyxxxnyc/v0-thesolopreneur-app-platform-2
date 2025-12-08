"use client"

import { useState, useEffect } from "react"
import { X, FolderKanban, Calendar, Clock, DollarSign, Activity, MessageSquare, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createBrowserClient } from "@/lib/supabase/client"
import type { Project, Activity as ActivityType, Note, Deal } from "@/lib/types/crm"

interface ProjectDetailModalProps {
  project: Project
  onClose: () => void
}

const statusColors: Record<string, string> = {
  planning: "bg-zinc-700 text-zinc-300",
  in_progress: "bg-cyan-500/20 text-cyan-400",
  on_hold: "bg-yellow-500/20 text-yellow-400",
  completed: "bg-[#00ff88]/20 text-[#00ff88]",
  cancelled: "bg-red-500/20 text-red-400",
}

const priorityColors: Record<string, string> = {
  low: "bg-zinc-800 text-zinc-400",
  medium: "bg-yellow-500/20 text-yellow-400",
  high: "bg-orange-500/20 text-orange-400",
  urgent: "bg-red-500/20 text-red-400",
}

export function ProjectDetailModal({ project, onClose }: ProjectDetailModalProps) {
  const [activities, setActivities] = useState<ActivityType[]>([])
  const [notes, setNotes] = useState<Note[]>([])
  const [deals, setDeals] = useState<Deal[]>([])
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    async function loadData() {
      const supabase = createBrowserClient()

      const [activitiesRes, notesRes, dealsRes] = await Promise.all([
        // @ts-expect-error - Supabase select returns unknown in strict mode
        supabase
          .from("activities")
          .select("*, owner:profiles(id, full_name)")
          .eq("project_id", project.id)
          .order("created_at", { ascending: false })
          .limit(20),
        // @ts-expect-error - Supabase select returns unknown in strict mode
        supabase
          .from("notes")
          .select("*, author:profiles(id, full_name)")
          .eq("entity_type", "project")
          .eq("entity_id", project.id)
          .order("created_at", { ascending: false }),
        // @ts-expect-error - Supabase select returns unknown in strict mode
        supabase.from("deals").select("*").eq("project_id", project.id).order("created_at", { ascending: false }),
      ])

      setActivities((activitiesRes.data || []) as ActivityType[])
      setNotes((notesRes.data || []) as Note[])
      setDeals((dealsRes.data || []) as Deal[])
    }
    loadData()
  }, [project.id])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <div className="relative w-full max-w-2xl h-full bg-zinc-950 border-l border-zinc-800 overflow-hidden flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex-shrink-0 border-b border-zinc-800 p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-zinc-900 border-2 border-zinc-700 flex items-center justify-center">
                <FolderKanban className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-white">{project.name}</h2>
                  <Badge className={statusColors[project.status]}>{project.status.replace("_", " ")}</Badge>
                </div>
                {(project as any).company && (
                  <p className="text-sm text-zinc-500 mt-1">{(project as any).company.name}</p>
                )}
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
                <Calendar className="w-4 h-4" />
                <span className="text-xs uppercase">Due Date</span>
              </div>
              <p className="text-sm font-medium text-white mt-1">
                {project.due_date ? new Date(project.due_date).toLocaleDateString() : "Not set"}
              </p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 p-3">
              <div className="flex items-center gap-2 text-zinc-500">
                <DollarSign className="w-4 h-4" />
                <span className="text-xs uppercase">Budget</span>
              </div>
              <p className="text-sm font-medium text-[#00ff88] mt-1">
                {project.budget_amount
                  ? `${project.budget_currency} ${project.budget_amount.toLocaleString()}`
                  : "Not set"}
              </p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 p-3">
              <div className="flex items-center gap-2 text-zinc-500">
                <Clock className="w-4 h-4" />
                <span className="text-xs uppercase">Priority</span>
              </div>
              <Badge className={`mt-1 ${priorityColors[project.priority]}`}>{project.priority}</Badge>
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
            <TabsTrigger
              value="deals"
              className="data-[state=active]:text-[#00ff88] data-[state=active]:border-b-2 data-[state=active]:border-[#00ff88] rounded-none"
            >
              Deals ({deals.length})
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-auto">
            <TabsContent value="overview" className="p-6 space-y-6 mt-0">
              {/* Description */}
              {project.description && (
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Description</h3>
                  <p className="text-sm text-zinc-300">{project.description}</p>
                </div>
              )}

              {/* Timeline */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Timeline</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-zinc-900 border border-zinc-800 p-3">
                    <p className="text-xs text-zinc-500 uppercase mb-1">Start Date</p>
                    <p className="text-sm text-zinc-300">
                      {project.start_date ? new Date(project.start_date).toLocaleDateString() : "Not set"}
                    </p>
                  </div>
                  <div className="bg-zinc-900 border border-zinc-800 p-3">
                    <p className="text-xs text-zinc-500 uppercase mb-1">Due Date</p>
                    <p className="text-sm text-zinc-300">
                      {project.due_date ? new Date(project.due_date).toLocaleDateString() : "Not set"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Notes</h3>
                  <Button size="sm" variant="ghost" className="text-zinc-500 hover:text-[#00ff88] h-7 text-xs">
                    <Plus className="w-3 h-3 mr-1" />
                    Add Note
                  </Button>
                </div>
                {notes.length === 0 ? (
                  <p className="text-sm text-zinc-600">No notes yet</p>
                ) : (
                  <div className="space-y-3">
                    {notes.slice(0, 3).map((note) => (
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
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white">Activity Log</h3>
                <Button size="sm" className="bg-cyan-500 text-black hover:bg-cyan-500/90 h-8">
                  <Plus className="w-3 h-3 mr-2" />
                  Log Activity
                </Button>
              </div>
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
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
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

            <TabsContent value="deals" className="p-6 mt-0">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white">Associated Deals</h3>
              </div>
              {deals.length === 0 ? (
                <div className="text-center py-8 text-zinc-500">
                  <DollarSign className="w-8 h-8 mx-auto mb-2 text-zinc-600" />
                  <p>No deals linked to this project</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {deals.map((deal) => (
                    <div key={deal.id} className="p-3 bg-zinc-900 border border-zinc-800">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-white">{deal.name}</p>
                        <span className="text-lg font-bold text-[#00ff88]">
                          {deal.currency} {deal.amount.toLocaleString()}
                        </span>
                      </div>
                      <Badge className="mt-2 bg-zinc-800 text-zinc-400 capitalize">
                        {deal.stage.replace("_", " ")}
                      </Badge>
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
