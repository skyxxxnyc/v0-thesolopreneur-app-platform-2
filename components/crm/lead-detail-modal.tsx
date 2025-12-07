"use client"

import { useState, useEffect } from "react"
import {
  X,
  Target,
  Mail,
  Phone,
  Building2,
  Globe,
  ArrowRight,
  Bot,
  AlertTriangle,
  Lightbulb,
  MessageSquare,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createBrowserClient } from "@/lib/supabase/client"
import type { Lead, SDRAnalysis } from "@/lib/types/crm"

interface LeadDetailModalProps {
  lead: Lead
  onClose: () => void
}

const statusColors: Record<string, string> = {
  new: "bg-cyan-500/20 text-cyan-400",
  contacted: "bg-yellow-500/20 text-yellow-400",
  qualified: "bg-[#00ff88]/20 text-[#00ff88]",
  unqualified: "bg-zinc-700 text-zinc-400",
  converted: "bg-[#00ff88] text-black",
  lost: "bg-red-500/20 text-red-400",
}

export function LeadDetailModal({ lead, onClose }: LeadDetailModalProps) {
  const [sdrAnalysis, setSdrAnalysis] = useState<SDRAnalysis | null>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [runningAnalysis, setRunningAnalysis] = useState(false)

  useEffect(() => {
    async function loadData() {
      const supabase = createBrowserClient()
      const { data } = await supabase
        .from("sdr_analyses")
        .select("*")
        .eq("lead_id", lead.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

      setSdrAnalysis(data)
    }
    loadData()
  }, [lead.id])

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
              <div className="w-14 h-14 bg-zinc-900 border-2 border-yellow-500/50 flex items-center justify-center">
                <Target className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-white">
                    {lead.first_name || "Unknown"} {lead.last_name || "Lead"}
                  </h2>
                  <Badge className={statusColors[lead.status]}>{lead.status}</Badge>
                </div>
                {lead.company_name && <p className="text-sm text-zinc-500 mt-1">{lead.company_name}</p>}
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-zinc-500 hover:text-white">
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 mt-4">
            <Button size="sm" className="bg-[#00ff88] text-black hover:bg-[#00ff88]/90 h-8">
              <ArrowRight className="w-3 h-3 mr-2" />
              Convert to Contact
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-zinc-700 text-zinc-400 hover:text-white h-8 bg-transparent"
              disabled={runningAnalysis}
            >
              <Bot className="w-3 h-3 mr-2" />
              {runningAnalysis ? "Analyzing..." : "Run SDR Analysis"}
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
              value="qualification"
              className="data-[state=active]:text-[#00ff88] data-[state=active]:border-b-2 data-[state=active]:border-[#00ff88] rounded-none"
            >
              Qualification
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
            <TabsContent value="overview" className="p-6 space-y-6 mt-0">
              {/* Lead Info */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Lead Info</h3>
                <div className="space-y-3">
                  {lead.email && (
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="w-4 h-4 text-zinc-600" />
                      <span className="text-zinc-400">{lead.email}</span>
                    </div>
                  )}
                  {lead.phone && (
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="w-4 h-4 text-zinc-600" />
                      <span className="text-zinc-400">{lead.phone}</span>
                    </div>
                  )}
                  {lead.company_name && (
                    <div className="flex items-center gap-3 text-sm">
                      <Building2 className="w-4 h-4 text-zinc-600" />
                      <span className="text-zinc-400">{lead.company_name}</span>
                    </div>
                  )}
                  {lead.website && (
                    <div className="flex items-center gap-3 text-sm">
                      <Globe className="w-4 h-4 text-zinc-600" />
                      <a
                        href={lead.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:underline"
                      >
                        {lead.website}
                      </a>
                    </div>
                  )}
                  {lead.job_title && (
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-zinc-600 text-xs uppercase">Title</span>
                      <span className="text-zinc-400">{lead.job_title}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Source */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Source</h3>
                <div className="flex items-center gap-3">
                  <Badge className="bg-zinc-800 text-zinc-400">{lead.source || "Unknown"}</Badge>
                  {lead.source_detail && <span className="text-sm text-zinc-500">{lead.source_detail}</span>}
                </div>
              </div>

              {/* ICP Score */}
              {lead.icp_fit_score && (
                <div className="bg-zinc-900 border border-zinc-800 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-400">ICP Fit Score</span>
                    <span
                      className={`text-2xl font-bold ${
                        lead.icp_fit_score >= 80
                          ? "text-[#00ff88]"
                          : lead.icp_fit_score >= 60
                            ? "text-cyan-400"
                            : lead.icp_fit_score >= 40
                              ? "text-yellow-400"
                              : "text-red-400"
                      }`}
                    >
                      {lead.icp_fit_score}%
                    </span>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="qualification" className="p-6 space-y-6 mt-0">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">BANT Qualification</h3>

              <div className="space-y-4">
                <div className="bg-zinc-900 border border-zinc-800 p-4">
                  <p className="text-xs text-zinc-500 uppercase mb-1">Budget</p>
                  <p className="text-sm text-zinc-300">{lead.budget || "Not specified"}</p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 p-4">
                  <p className="text-xs text-zinc-500 uppercase mb-1">Authority</p>
                  <p className="text-sm text-zinc-300">{lead.authority || "Not specified"}</p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 p-4">
                  <p className="text-xs text-zinc-500 uppercase mb-1">Need</p>
                  <p className="text-sm text-zinc-300">{lead.need || "Not specified"}</p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 p-4">
                  <p className="text-xs text-zinc-500 uppercase mb-1">Timeline</p>
                  <p className="text-sm text-zinc-300">{lead.timeline || "Not specified"}</p>
                </div>
                {lead.challenges && (
                  <div className="bg-zinc-900 border border-zinc-800 p-4">
                    <p className="text-xs text-zinc-500 uppercase mb-1">Challenges</p>
                    <p className="text-sm text-zinc-300">{lead.challenges}</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="sdr" className="p-6 mt-0">
              {!sdrAnalysis ? (
                <div className="text-center py-12">
                  <Bot className="w-12 h-12 mx-auto mb-4 text-zinc-600" />
                  <h3 className="text-lg font-semibold text-white mb-2">No SDR Analysis Yet</h3>
                  <p className="text-sm text-zinc-500 mb-4 max-w-sm mx-auto">
                    Run the SDR Agent to analyze this lead against your ICP and generate insights.
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
