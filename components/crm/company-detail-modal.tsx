"use client"

import { useState, useEffect } from "react"
import {
  X,
  Building2,
  Phone,
  Mail,
  MapPin,
  Linkedin,
  Users,
  FolderKanban,
  DollarSign,
  MessageSquare,
  Activity,
  Bot,
  ChevronRight,
  Plus,
  ExternalLink,
  Star,
  AlertTriangle,
  Lightbulb,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createBrowserClient } from "@/lib/supabase/client"
import type { Company, Contact, Project, Deal, Activity as ActivityType, Note, SDRAnalysis } from "@/lib/types/crm"

interface CompanyDetailModalProps {
  company: Company
  onClose: () => void
}

const statusColors: Record<string, string> = {
  prospect: "bg-zinc-700 text-zinc-300",
  active: "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30",
  client: "bg-[#00ff88]/20 text-[#00ff88] border border-[#00ff88]/30",
  churned: "bg-red-500/20 text-red-400 border border-red-500/30",
  archived: "bg-zinc-800 text-zinc-500",
}

const scoreColors: Record<string, string> = {
  poor: "bg-red-500/20 text-red-400",
  fair: "bg-yellow-500/20 text-yellow-400",
  good: "bg-cyan-500/20 text-cyan-400",
  excellent: "bg-[#00ff88]/20 text-[#00ff88]",
}

export function CompanyDetailModal({ company, onClose }: CompanyDetailModalProps) {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [deals, setDeals] = useState<Deal[]>([])
  const [activities, setActivities] = useState<ActivityType[]>([])
  const [notes, setNotes] = useState<Note[]>([])
  const [sdrAnalysis, setSdrAnalysis] = useState<SDRAnalysis | null>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadCompanyData() {
      const supabase = createBrowserClient()

      const [contactsRes, projectsRes, dealsRes, activitiesRes, notesRes, sdrRes] = await Promise.all([
        // @ts-expect-error - Supabase select returns unknown in strict mode
        supabase.from("contacts").select("*").eq("company_id", company.id).order("created_at", { ascending: false }),
        // @ts-expect-error - Supabase select returns unknown in strict mode
        supabase.from("projects").select("*").eq("company_id", company.id).order("created_at", { ascending: false }),
        // @ts-expect-error - Supabase select returns unknown in strict mode
        supabase.from("deals").select("*").eq("company_id", company.id).order("created_at", { ascending: false }),
        // @ts-expect-error - Supabase select returns unknown in strict mode
        supabase
          .from("activities")
          .select("*, owner:profiles(id, full_name)")
          .eq("company_id", company.id)
          .order("created_at", { ascending: false })
          .limit(20),
        // @ts-expect-error - Supabase select returns unknown in strict mode
        supabase
          .from("notes")
          .select("*, author:profiles(id, full_name)")
          .eq("company_id", company.id)
          .order("created_at", { ascending: false }),
        // @ts-expect-error - Supabase select returns unknown in strict mode
        supabase
          .from("sdr_analyses")
          .select("*")
          .eq("company_id", company.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single(),
      ])

      setContacts((contactsRes.data || []) as Contact[])
      setProjects((projectsRes.data || []) as Project[])
      setDeals((dealsRes.data || []) as Deal[])
      setActivities((activitiesRes.data || []) as ActivityType[])
      setNotes((notesRes.data || []) as Note[])
      setSdrAnalysis(sdrRes.data as SDRAnalysis | null)
      setLoading(false)
    }

    loadCompanyData()
  }, [company.id])

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [onClose])

  const totalDealValue = deals.reduce((sum, deal) => sum + (deal.amount || 0), 0)
  const hasQualifyingActivity = activities.some(
    (a) => ["call", "email", "meeting"].includes(a.type) && a.direction === "outbound",
  )

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      {/* Modal - slides from right, full height */}
      <div className="relative w-full max-w-3xl h-full bg-zinc-950 border-l border-zinc-800 overflow-hidden flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex-shrink-0 border-b border-zinc-800 p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-zinc-900 border-2 border-zinc-700 flex items-center justify-center">
                <span className="text-xl font-bold text-[#00ff88]">{company.name.charAt(0).toUpperCase()}</span>
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-white">{company.name}</h2>
                  <Badge className={statusColors[company.status]}>{company.status}</Badge>
                </div>
                {company.domain && (
                  <a
                    href={`https://${company.domain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-zinc-500 hover:text-[#00ff88] flex items-center gap-1 mt-1"
                  >
                    {company.domain}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-zinc-500 hover:text-white">
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="bg-zinc-900 border border-zinc-800 p-3">
              <div className="flex items-center gap-2 text-zinc-500">
                <Users className="w-4 h-4" />
                <span className="text-xs uppercase">Contacts</span>
              </div>
              <p className="text-lg font-bold text-white mt-1">{contacts.length}</p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 p-3">
              <div className="flex items-center gap-2 text-zinc-500">
                <FolderKanban className="w-4 h-4" />
                <span className="text-xs uppercase">Projects</span>
              </div>
              <p className="text-lg font-bold text-white mt-1">{projects.length}</p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 p-3">
              <div className="flex items-center gap-2 text-zinc-500">
                <DollarSign className="w-4 h-4" />
                <span className="text-xs uppercase">Deal Value</span>
              </div>
              <p className="text-lg font-bold text-[#00ff88] mt-1">${totalDealValue.toLocaleString()}</p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 p-3">
              <div className="flex items-center gap-2 text-zinc-500">
                <Activity className="w-4 h-4" />
                <span className="text-xs uppercase">Activities</span>
              </div>
              <p className="text-lg font-bold text-white mt-1">{activities.length}</p>
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
              value="contacts"
              className="data-[state=active]:text-[#00ff88] data-[state=active]:border-b-2 data-[state=active]:border-[#00ff88] rounded-none"
            >
              Contacts ({contacts.length})
            </TabsTrigger>
            <TabsTrigger
              value="projects"
              className="data-[state=active]:text-[#00ff88] data-[state=active]:border-b-2 data-[state=active]:border-[#00ff88] rounded-none"
            >
              Projects ({projects.length})
            </TabsTrigger>
            <TabsTrigger
              value="deals"
              className="data-[state=active]:text-[#00ff88] data-[state=active]:border-b-2 data-[state=active]:border-[#00ff88] rounded-none"
            >
              Deals ({deals.length})
            </TabsTrigger>
            <TabsTrigger
              value="activity"
              className="data-[state=active]:text-[#00ff88] data-[state=active]:border-b-2 data-[state=active]:border-[#00ff88] rounded-none"
            >
              Activity
            </TabsTrigger>
            <TabsTrigger
              value="sdr"
              className="data-[state=active]:text-[#00ff88] data-[state=active]:border-b-2 data-[state=active]:border-[#00ff88] rounded-none"
            >
              <Bot className="w-4 h-4 mr-1" />
              SDR Analysis
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-auto">
            {/* Overview Tab */}
            <TabsContent value="overview" className="p-6 space-y-6 mt-0">
              {/* Company Info */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Company Info</h3>
                  <div className="space-y-3">
                    {company.industry && (
                      <div className="flex items-center gap-3 text-sm">
                        <Building2 className="w-4 h-4 text-zinc-600" />
                        <span className="text-zinc-400">{company.industry}</span>
                      </div>
                    )}
                    {company.employee_count && (
                      <div className="flex items-center gap-3 text-sm">
                        <Users className="w-4 h-4 text-zinc-600" />
                        <span className="text-zinc-400">{company.employee_count} employees</span>
                      </div>
                    )}
                    {company.phone && (
                      <div className="flex items-center gap-3 text-sm">
                        <Phone className="w-4 h-4 text-zinc-600" />
                        <span className="text-zinc-400">{company.phone}</span>
                      </div>
                    )}
                    {company.email && (
                      <div className="flex items-center gap-3 text-sm">
                        <Mail className="w-4 h-4 text-zinc-600" />
                        <span className="text-zinc-400">{company.email}</span>
                      </div>
                    )}
                    {(company.city || company.state || company.country) && (
                      <div className="flex items-center gap-3 text-sm">
                        <MapPin className="w-4 h-4 text-zinc-600" />
                        <span className="text-zinc-400">
                          {[company.city, company.state, company.country].filter(Boolean).join(", ")}
                        </span>
                      </div>
                    )}
                    {company.linkedin_url && (
                      <div className="flex items-center gap-3 text-sm">
                        <Linkedin className="w-4 h-4 text-zinc-600" />
                        <a
                          href={company.linkedin_url}
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

                {/* Digital Presence */}
                <div className="space-y-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Digital Presence</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-zinc-400">Website Quality</span>
                      {company.website_quality ? (
                        <Badge className={scoreColors[company.website_quality]}>{company.website_quality}</Badge>
                      ) : (
                        <span className="text-xs text-zinc-600">Not scored</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-zinc-400">SEO Score</span>
                      {company.seo_score ? (
                        <Badge className={scoreColors[company.seo_score]}>{company.seo_score}</Badge>
                      ) : (
                        <span className="text-xs text-zinc-600">Not scored</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-zinc-400">Social Media</span>
                      {company.social_media_presence ? (
                        <Badge className={scoreColors[company.social_media_presence]}>
                          {company.social_media_presence}
                        </Badge>
                      ) : (
                        <span className="text-xs text-zinc-600">Not scored</span>
                      )}
                    </div>
                    {company.gmb_rating && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-zinc-400">GMB Rating</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-sm text-white font-medium">{company.gmb_rating}</span>
                        </div>
                      </div>
                    )}
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

            {/* Contacts Tab */}
            <TabsContent value="contacts" className="p-6 mt-0">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white">Contacts at {company.name}</h3>
                <Button size="sm" className="bg-[#00ff88] text-black hover:bg-[#00ff88]/90 h-8">
                  <Plus className="w-3 h-3 mr-1" />
                  Add Contact
                </Button>
              </div>
              {contacts.length === 0 ? (
                <div className="text-center py-8 text-zinc-500">
                  <Users className="w-8 h-8 mx-auto mb-2 text-zinc-600" />
                  <p>No contacts linked to this company</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {contacts.map((contact) => (
                    <div
                      key={contact.id}
                      className="flex items-center justify-between p-3 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-zinc-800 flex items-center justify-center">
                          <span className="text-sm font-bold text-cyan-400">
                            {contact.first_name.charAt(0)}
                            {contact.last_name?.charAt(0) || ""}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-white">
                            {contact.first_name} {contact.last_name}
                          </p>
                          <p className="text-xs text-zinc-500">{contact.job_title || contact.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {contact.is_decision_maker && (
                          <Badge className="bg-yellow-500/20 text-yellow-400 text-xs">Decision Maker</Badge>
                        )}
                        <ChevronRight className="w-4 h-4 text-zinc-600" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Projects Tab */}
            <TabsContent value="projects" className="p-6 mt-0">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white">Projects</h3>
                <Button size="sm" className="bg-[#00ff88] text-black hover:bg-[#00ff88]/90 h-8">
                  <Plus className="w-3 h-3 mr-1" />
                  Add Project
                </Button>
              </div>
              {projects.length === 0 ? (
                <div className="text-center py-8 text-zinc-500">
                  <FolderKanban className="w-8 h-8 mx-auto mb-2 text-zinc-600" />
                  <p>No projects yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      className="p-3 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-white">{project.name}</p>
                        <Badge
                          className={
                            project.status === "completed"
                              ? "bg-[#00ff88]/20 text-[#00ff88]"
                              : project.status === "in_progress"
                                ? "bg-cyan-500/20 text-cyan-400"
                                : "bg-zinc-700 text-zinc-300"
                          }
                        >
                          {project.status.replace("_", " ")}
                        </Badge>
                      </div>
                      {project.description && (
                        <p className="text-sm text-zinc-500 mt-1 line-clamp-1">{project.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Deals Tab */}
            <TabsContent value="deals" className="p-6 mt-0">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white">Deals</h3>
                <Button
                  size="sm"
                  className="bg-[#00ff88] text-black hover:bg-[#00ff88]/90 h-8"
                  disabled={!hasQualifyingActivity}
                  title={!hasQualifyingActivity ? "Log a call, email, or meeting first" : undefined}
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Create Deal
                </Button>
              </div>

              {!hasQualifyingActivity && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 p-3 mb-4 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-yellow-400 font-medium">Contact required before creating a deal</p>
                    <p className="text-xs text-zinc-500 mt-1">Log a call, email, or meeting with this company first.</p>
                  </div>
                </div>
              )}

              {deals.length === 0 ? (
                <div className="text-center py-8 text-zinc-500">
                  <DollarSign className="w-8 h-8 mx-auto mb-2 text-zinc-600" />
                  <p>No deals yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {deals.map((deal) => (
                    <div
                      key={deal.id}
                      className="p-3 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-white">{deal.name}</p>
                        <span className="text-lg font-bold text-[#00ff88]">${deal.amount.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className="bg-zinc-800 text-zinc-400 capitalize">{deal.stage.replace("_", " ")}</Badge>
                        <span className="text-xs text-zinc-600">{deal.probability}% probability</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="p-6 mt-0">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white">Activity Timeline</h3>
                <Button size="sm" className="bg-cyan-500 text-black hover:bg-cyan-500/90 h-8">
                  <Plus className="w-3 h-3 mr-1" />
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
                          {activity.type === "meeting" && <Users className="w-4 h-4" />}
                          {activity.type === "note" && <MessageSquare className="w-4 h-4" />}
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
                        <p className="text-xs text-zinc-600 mt-1">
                          {(activity as any).owner?.full_name} • {new Date(activity.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* SDR Analysis Tab */}
            <TabsContent value="sdr" className="p-6 mt-0">
              {!sdrAnalysis ? (
                <div className="text-center py-12">
                  <Bot className="w-12 h-12 mx-auto mb-4 text-zinc-600" />
                  <h3 className="text-lg font-semibold text-white mb-2">No SDR Analysis Yet</h3>
                  <p className="text-sm text-zinc-500 mb-4 max-w-sm mx-auto">
                    Run the SDR Agent to analyze this company against your ICP and generate insights.
                  </p>
                  <Button className="bg-[#00ff88] text-black hover:bg-[#00ff88]/90">
                    <Bot className="w-4 h-4 mr-2" />
                    Run SDR Analysis
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* ICP Score */}
                  <div className="bg-zinc-900 border border-zinc-800 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-white">ICP Match Score</h3>
                      <span
                        className={`text-2xl font-bold ${
                          (sdrAnalysis.icp_match_score || 0) >= 80
                            ? "text-[#00ff88]"
                            : (sdrAnalysis.icp_match_score || 0) >= 60
                              ? "text-cyan-400"
                              : (sdrAnalysis.icp_match_score || 0) >= 40
                                ? "text-yellow-400"
                                : "text-red-400"
                        }`}
                      >
                        {sdrAnalysis.icp_match_score || 0}%
                      </span>
                    </div>
                    {sdrAnalysis.icp_match_reasoning && (
                      <p className="text-sm text-zinc-400">{sdrAnalysis.icp_match_reasoning}</p>
                    )}
                  </div>

                  {/* Pain Points */}
                  {sdrAnalysis.pain_points && sdrAnalysis.pain_points.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                        <h3 className="text-sm font-semibold text-white">Pain Points</h3>
                      </div>
                      <div className="space-y-2">
                        {sdrAnalysis.pain_points.map((point, idx) => (
                          <div key={idx} className="bg-zinc-900 border border-zinc-800 p-3">
                            <p className="text-sm font-medium text-white">{point.title}</p>
                            <p className="text-xs text-zinc-500 mt-1">{point.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Sales Opportunities */}
                  {sdrAnalysis.sales_opportunities && sdrAnalysis.sales_opportunities.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-yellow-400" />
                        <h3 className="text-sm font-semibold text-white">Sales Opportunities</h3>
                      </div>
                      <div className="space-y-2">
                        {sdrAnalysis.sales_opportunities.map((opp, idx) => (
                          <div key={idx} className="bg-zinc-900 border border-zinc-800 p-3">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-white">{opp.title}</p>
                              <Badge className="bg-cyan-500/20 text-cyan-400 text-xs">{opp.package_fit}</Badge>
                            </div>
                            <p className="text-xs text-zinc-500 mt-1">{opp.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Talking Points */}
                  {sdrAnalysis.talking_points && sdrAnalysis.talking_points.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-cyan-400" />
                        <h3 className="text-sm font-semibold text-white">Talking Points</h3>
                      </div>
                      <div className="space-y-2">
                        {sdrAnalysis.talking_points.map((point, idx) => (
                          <div key={idx} className="bg-zinc-900 border border-zinc-800 p-3">
                            <p className="text-sm text-zinc-300 italic">"{point.point}"</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Automation Opportunities */}
                  {sdrAnalysis.automation_opportunities && sdrAnalysis.automation_opportunities.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-[#00ff88]" />
                        <h3 className="text-sm font-semibold text-white">Automation Opportunities</h3>
                      </div>
                      <div className="space-y-2">
                        {sdrAnalysis.automation_opportunities.map((auto, idx) => (
                          <div key={idx} className="bg-zinc-900 border border-zinc-800 p-3">
                            <p className="text-sm font-medium text-white">{auto.title}</p>
                            <p className="text-xs text-zinc-500 mt-1">{auto.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
