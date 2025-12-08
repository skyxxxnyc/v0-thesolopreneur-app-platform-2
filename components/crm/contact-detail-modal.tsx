"use client"

import { useState, useEffect } from "react"
import { X, Mail, Phone, Linkedin, Building2, Crown, MessageSquare, Activity, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createBrowserClient } from "@/lib/supabase/client"
import type { Contact, Activity as ActivityType, Note, Deal } from "@/lib/types/crm"

interface ContactDetailModalProps {
  contact: Contact
  onClose: () => void
}

const authorityColors: Record<string, string> = {
  champion: "bg-[#00ff88]/20 text-[#00ff88]",
  decision_maker: "bg-yellow-500/20 text-yellow-400",
  economic_buyer: "bg-cyan-500/20 text-cyan-400",
  influencer: "bg-zinc-700 text-zinc-300",
  end_user: "bg-zinc-800 text-zinc-500",
}

export function ContactDetailModal({ contact, onClose }: ContactDetailModalProps) {
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
          .eq("contact_id", contact.id)
          .order("created_at", { ascending: false })
          .limit(20),
        // @ts-expect-error - Supabase select returns unknown in strict mode
        supabase
          .from("notes")
          .select("*, author:profiles(id, full_name)")
          .eq("entity_type", "contact")
          .eq("entity_id", contact.id)
          .order("created_at", { ascending: false }),
        // @ts-expect-error - Supabase select returns unknown in strict mode
        supabase.from("deals").select("*").eq("contact_id", contact.id).order("created_at", { ascending: false }),
      ])

      setActivities((activitiesRes.data || []) as ActivityType[])
      setNotes((notesRes.data || []) as Note[])
      setDeals((dealsRes.data || []) as Deal[])
    }

    loadData()
  }, [contact.id])

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
                <span className="text-xl font-bold text-cyan-400">
                  {contact.first_name.charAt(0)}
                  {contact.last_name?.charAt(0) || ""}
                </span>
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-white">
                    {contact.first_name} {contact.last_name}
                  </h2>
                  {contact.is_decision_maker && <Crown className="w-5 h-5 text-yellow-400" />}
                </div>
                {contact.job_title && <p className="text-sm text-zinc-500 mt-1">{contact.job_title}</p>}
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-zinc-500 hover:text-white">
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 mt-4">
            {contact.email && (
              <Button
                size="sm"
                variant="outline"
                className="border-zinc-700 text-zinc-400 hover:text-white h-8 bg-transparent"
              >
                <Mail className="w-3 h-3 mr-2" />
                Email
              </Button>
            )}
            {contact.phone && (
              <Button
                size="sm"
                variant="outline"
                className="border-zinc-700 text-zinc-400 hover:text-white h-8 bg-transparent"
              >
                <Phone className="w-3 h-3 mr-2" />
                Call
              </Button>
            )}
            <Button size="sm" className="bg-cyan-500 text-black hover:bg-cyan-500/90 h-8">
              <Plus className="w-3 h-3 mr-2" />
              Log Activity
            </Button>
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
              {/* Contact Info */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Contact Info</h3>
                <div className="space-y-3">
                  {contact.email && (
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="w-4 h-4 text-zinc-600" />
                      <a href={`mailto:${contact.email}`} className="text-cyan-400 hover:underline">
                        {contact.email}
                      </a>
                    </div>
                  )}
                  {contact.phone && (
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="w-4 h-4 text-zinc-600" />
                      <span className="text-zinc-400">{contact.phone}</span>
                    </div>
                  )}
                  {contact.mobile && (
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="w-4 h-4 text-zinc-600" />
                      <span className="text-zinc-400">{contact.mobile} (mobile)</span>
                    </div>
                  )}
                  {contact.linkedin_url && (
                    <div className="flex items-center gap-3 text-sm">
                      <Linkedin className="w-4 h-4 text-zinc-600" />
                      <a
                        href={contact.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:underline"
                      >
                        LinkedIn Profile
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Role & Authority */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Role & Authority</h3>
                <div className="flex items-center gap-3">
                  {contact.authority_level && (
                    <Badge className={authorityColors[contact.authority_level]}>
                      {contact.authority_level.replace("_", " ")}
                    </Badge>
                  )}
                  {contact.department && <span className="text-sm text-zinc-500">{contact.department}</span>}
                </div>
              </div>

              {/* Company */}
              {(contact as any).company && (
                <div className="space-y-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Company</h3>
                  <div className="flex items-center gap-3 p-3 bg-zinc-900 border border-zinc-800">
                    <Building2 className="w-5 h-5 text-[#00ff88]" />
                    <div>
                      <p className="font-medium text-white">{(contact as any).company.name}</p>
                      {(contact as any).company.domain && (
                        <p className="text-xs text-zinc-500">{(contact as any).company.domain}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

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
              {activities.length === 0 ? (
                <div className="text-center py-8 text-zinc-500">
                  <Activity className="w-8 h-8 mx-auto mb-2 text-zinc-600" />
                  <p>No activities logged yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activities.map((activity, idx) => (
                    <div key={activity.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-8 h-8 flex items-center justify-center ${
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
                        {idx < activities.length - 1 && <div className="w-px flex-1 bg-zinc-800 mt-2" />}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-white capitalize">{activity.type}</span>
                          {activity.direction && (
                            <Badge className="bg-zinc-800 text-zinc-400 text-xs">{activity.direction}</Badge>
                          )}
                        </div>
                        {activity.subject && <p className="text-sm text-zinc-400 mt-1">{activity.subject}</p>}
                        <p className="text-xs text-zinc-600 mt-1">{new Date(activity.created_at).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="deals" className="p-6 mt-0">
              {deals.length === 0 ? (
                <div className="text-center py-8 text-zinc-500">
                  <p>No deals associated with this contact</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {deals.map((deal) => (
                    <div key={deal.id} className="p-3 bg-zinc-900 border border-zinc-800">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-white">{deal.name}</p>
                        <span className="text-lg font-bold text-[#00ff88]">${deal.amount.toLocaleString()}</span>
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
