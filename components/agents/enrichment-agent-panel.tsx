"use client"

import { useState } from "react"
import { Globe, Linkedin, Building2, Code, Users, TrendingUp, Check, Clock, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface EnrichmentJob {
  id: string
  leadName: string
  company: string
  status: "completed" | "processing" | "failed"
  enrichedAt: string
  dataPoints: {
    website: boolean
    linkedin: boolean
    techStack: boolean
    companyInfo: boolean
    socialProfiles: boolean
  }
}

const mockJobs: EnrichmentJob[] = [
  {
    id: "1",
    leadName: "John Smith",
    company: "Acme Plumbing Co",
    status: "completed",
    enrichedAt: "1 hour ago",
    dataPoints: { website: true, linkedin: true, techStack: true, companyInfo: true, socialProfiles: true },
  },
  {
    id: "2",
    leadName: "Sarah Johnson",
    company: "City Dental Group",
    status: "completed",
    enrichedAt: "3 hours ago",
    dataPoints: { website: true, linkedin: true, techStack: false, companyInfo: true, socialProfiles: true },
  },
  {
    id: "3",
    leadName: "Mike Wilson",
    company: "Premier Real Estate",
    status: "processing",
    enrichedAt: "Processing...",
    dataPoints: { website: true, linkedin: false, techStack: false, companyInfo: true, socialProfiles: false },
  },
]

const enrichmentSources = [
  { id: "website", name: "Website Analysis", icon: Globe, description: "Scrape and analyze company website" },
  { id: "linkedin", name: "LinkedIn Profile", icon: Linkedin, description: "Professional info and connections" },
  { id: "company", name: "Company Data", icon: Building2, description: "Revenue, employees, industry" },
  { id: "techstack", name: "Tech Stack", icon: Code, description: "Technologies and tools used" },
  { id: "social", name: "Social Profiles", icon: Users, description: "Twitter, Facebook, Instagram" },
  { id: "news", name: "News & Signals", icon: TrendingUp, description: "Recent news and growth signals" },
]

export function EnrichmentAgentPanel() {
  const [activeTab, setActiveTab] = useState<"jobs" | "sources" | "settings">("jobs")

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-1 border-b border-zinc-800 -mx-4 px-4">
        {[
          { id: "jobs", label: "Enrichment Jobs" },
          { id: "sources", label: "Data Sources" },
          { id: "settings", label: "Settings" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={cn(
              "px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-[1px]",
              activeTab === tab.id
                ? "text-[#00d4ff] border-[#00d4ff]"
                : "text-zinc-500 border-transparent hover:text-zinc-300",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Jobs Tab */}
      {activeTab === "jobs" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-500">{mockJobs.length} enrichment jobs</span>
            <Button size="sm" className="bg-[#00d4ff] text-black hover:bg-[#00d4ff]/90">
              Enrich All Leads
            </Button>
          </div>

          {mockJobs.map((job) => (
            <div key={job.id} className="bg-zinc-800/50 border border-zinc-800 p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-medium text-white">{job.leadName}</h4>
                  <p className="text-xs text-zinc-500">{job.company}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "flex items-center gap-1.5 px-2 py-1 text-xs font-medium",
                      job.status === "completed" && "bg-emerald-500/20 text-emerald-400",
                      job.status === "processing" && "bg-yellow-500/20 text-yellow-400",
                      job.status === "failed" && "bg-red-500/20 text-red-400",
                    )}
                  >
                    {job.status === "completed" && <Check className="w-3 h-3" />}
                    {job.status === "processing" && <Clock className="w-3 h-3 animate-spin" />}
                    {job.status === "failed" && <AlertCircle className="w-3 h-3" />}
                    {job.status}
                  </span>
                  <span className="text-xs text-zinc-600">{job.enrichedAt}</span>
                </div>
              </div>

              <div className="flex gap-2">
                {Object.entries(job.dataPoints).map(([key, value]) => (
                  <span
                    key={key}
                    className={cn(
                      "px-2 py-1 text-xs capitalize",
                      value
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                        : "bg-zinc-900 text-zinc-600 border border-zinc-800",
                    )}
                  >
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sources Tab */}
      {activeTab === "sources" && (
        <div className="grid grid-cols-2 gap-4">
          {enrichmentSources.map((source) => {
            const Icon = source.icon
            return (
              <div key={source.id} className="bg-zinc-800/50 border border-zinc-800 p-4 flex items-start gap-3">
                <div className="w-10 h-10 bg-[#00d4ff]/10 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-[#00d4ff]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-white text-sm">{source.name}</h4>
                    <button className="w-8 h-5 bg-emerald-500 rounded-full relative">
                      <span className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full" />
                    </button>
                  </div>
                  <p className="text-xs text-zinc-500">{source.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === "settings" && (
        <div className="space-y-4">
          <div className="bg-zinc-800/50 border border-zinc-800 p-4">
            <h4 className="font-medium text-white mb-3">Auto-Enrichment Rules</h4>
            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">Enrich new leads automatically</span>
                <button className="w-8 h-5 bg-emerald-500 rounded-full relative">
                  <span className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full" />
                </button>
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">Re-enrich stale data (30+ days)</span>
                <button className="w-8 h-5 bg-zinc-700 rounded-full relative">
                  <span className="absolute left-0.5 top-0.5 w-4 h-4 bg-zinc-500 rounded-full" />
                </button>
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">Skip leads with complete data</span>
                <button className="w-8 h-5 bg-emerald-500 rounded-full relative">
                  <span className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full" />
                </button>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
