"use client"

import { useState } from "react"
import { FileText, Target, AlertCircle, Lightbulb, Wrench, Upload, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ICP {
  id: string
  name: string
  industry: string
  companySize: string
  criteria: string[]
  active: boolean
}

const mockICPs: ICP[] = [
  {
    id: "1",
    name: "SMB Service Businesses",
    industry: "Professional Services",
    companySize: "1-50 employees",
    criteria: ["No online booking", "Outdated website", "Low Google rating"],
    active: true,
  },
  {
    id: "2",
    name: "Local Healthcare",
    industry: "Healthcare",
    companySize: "5-100 employees",
    criteria: ["Manual scheduling", "No patient portal", "Poor reviews"],
    active: true,
  },
]

const mockAnalysisResults = [
  {
    id: "1",
    leadName: "Acme Plumbing Co",
    icpScore: 87,
    status: "qualified",
    painPoints: ["Outdated website (2019)", "No online booking", "3.2 star Google rating"],
    salesOpportunities: ["Website redesign", "AI chatbot for inquiries", "Reputation management"],
    talkingPoints: [
      "Your competitors are ranking higher for 'plumber near me'",
      "70% of customers expect online booking options",
    ],
    automationOpportunities: ["24/7 inquiry chatbot", "Automated review requests", "SMS appointment reminders"],
    analyzedAt: "2 hours ago",
  },
  {
    id: "2",
    leadName: "City Dental Group",
    icpScore: 92,
    status: "qualified",
    painPoints: ["Manual appointment scheduling", "No automated reminders", "High no-show rate"],
    salesOpportunities: ["Scheduling automation", "Patient communication system", "Intake form digitization"],
    talkingPoints: [
      "Dental practices using automated reminders see 40% fewer no-shows",
      "Your intake process could be fully automated",
    ],
    automationOpportunities: ["AI scheduling assistant", "Automated SMS reminders", "Digital intake forms"],
    analyzedAt: "5 hours ago",
  },
]

export function SDRAgentPanel() {
  const [activeTab, setActiveTab] = useState<"icps" | "training" | "results">("results")
  const [selectedResult, setSelectedResult] = useState(mockAnalysisResults[0])

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-1 border-b border-zinc-800 -mx-4 px-4">
        {[
          { id: "results", label: "Analysis Results", icon: Target },
          { id: "icps", label: "ICP Definitions", icon: FileText },
          { id: "training", label: "Training Documents", icon: Upload },
        ].map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-[1px]",
                activeTab === tab.id
                  ? "text-[#00ff88] border-[#00ff88]"
                  : "text-zinc-500 border-transparent hover:text-zinc-300",
              )}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Results Tab */}
      {activeTab === "results" && (
        <div className="grid grid-cols-3 gap-4">
          {/* Results List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-zinc-400">Recent Analyses</span>
              <span className="text-xs text-zinc-600">{mockAnalysisResults.length} leads</span>
            </div>
            {mockAnalysisResults.map((result) => (
              <button
                key={result.id}
                onClick={() => setSelectedResult(result)}
                className={cn(
                  "w-full text-left p-3 border transition-colors",
                  selectedResult.id === result.id
                    ? "bg-zinc-800 border-[#00ff88]/50"
                    : "bg-zinc-900 border-zinc-800 hover:border-zinc-700",
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-white text-sm">{result.leadName}</span>
                  <span
                    className={cn(
                      "text-xs font-semibold",
                      result.icpScore >= 80
                        ? "text-emerald-400"
                        : result.icpScore >= 60
                          ? "text-yellow-400"
                          : "text-red-400",
                    )}
                  >
                    {result.icpScore}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-500">{result.painPoints.length} pain points found</span>
                  <span className="text-xs text-zinc-600">{result.analyzedAt}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Analysis Detail */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-white text-lg">{selectedResult.leadName}</h3>
                <p className="text-xs text-zinc-500">Analyzed {selectedResult.analyzedAt}</p>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "px-3 py-1 text-sm font-semibold",
                    selectedResult.icpScore >= 80
                      ? "bg-emerald-500/20 text-emerald-400"
                      : selectedResult.icpScore >= 60
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-red-500/20 text-red-400",
                  )}
                >
                  ICP Score: {selectedResult.icpScore}%
                </div>
                <Button size="sm" className="bg-[#00ff88] text-black hover:bg-[#00ff88]/90">
                  View Lead
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Pain Points */}
              <div className="bg-zinc-800/50 border border-zinc-800 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  <span className="font-medium text-white text-sm">Pain Points</span>
                </div>
                <ul className="space-y-2">
                  {selectedResult.painPoints.map((point, i) => (
                    <li key={i} className="text-sm text-zinc-400 flex items-start gap-2">
                      <span className="text-red-400 mt-1">•</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Sales Opportunities */}
              <div className="bg-zinc-800/50 border border-zinc-800 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="w-4 h-4 text-emerald-400" />
                  <span className="font-medium text-white text-sm">Sales Opportunities</span>
                </div>
                <ul className="space-y-2">
                  {selectedResult.salesOpportunities.map((opp, i) => (
                    <li key={i} className="text-sm text-zinc-400 flex items-start gap-2">
                      <span className="text-emerald-400 mt-1">•</span>
                      {opp}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Talking Points */}
              <div className="bg-zinc-800/50 border border-zinc-800 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-4 h-4 text-yellow-400" />
                  <span className="font-medium text-white text-sm">Talking Points</span>
                </div>
                <ul className="space-y-2">
                  {selectedResult.talkingPoints.map((point, i) => (
                    <li key={i} className="text-sm text-zinc-400 flex items-start gap-2">
                      <span className="text-yellow-400 mt-1">"</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Automation Opportunities */}
              <div className="bg-zinc-800/50 border border-zinc-800 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Wrench className="w-4 h-4 text-cyan-400" />
                  <span className="font-medium text-white text-sm">Automation Opportunities</span>
                </div>
                <ul className="space-y-2">
                  {selectedResult.automationOpportunities.map((opp, i) => (
                    <li key={i} className="text-sm text-zinc-400 flex items-start gap-2">
                      <span className="text-cyan-400 mt-1">•</span>
                      {opp}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ICPs Tab */}
      {activeTab === "icps" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-zinc-500">Define your ideal customer profiles for lead analysis</p>
            <Button size="sm" className="bg-[#00ff88] text-black hover:bg-[#00ff88]/90">
              Add ICP
            </Button>
          </div>

          <div className="grid gap-4">
            {mockICPs.map((icp) => (
              <div key={icp.id} className="bg-zinc-800/50 border border-zinc-800 p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-white">{icp.name}</h4>
                    <p className="text-xs text-zinc-500">
                      {icp.industry} · {icp.companySize}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className={cn(
                        "px-2 py-1 text-xs font-medium",
                        icp.active ? "bg-emerald-500/20 text-emerald-400" : "bg-zinc-700 text-zinc-400",
                      )}
                    >
                      {icp.active ? "Active" : "Paused"}
                    </button>
                    <Button size="sm" variant="ghost" className="text-zinc-500 hover:text-red-400">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {icp.criteria.map((c, i) => (
                    <span key={i} className="px-2 py-1 bg-zinc-900 text-zinc-400 text-xs border border-zinc-700">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Training Tab */}
      {activeTab === "training" && (
        <div className="space-y-4">
          <p className="text-sm text-zinc-500">
            Upload training documents to customize how the SDR agent analyzes leads
          </p>

          <div className="border-2 border-dashed border-zinc-700 p-8 text-center hover:border-zinc-600 transition-colors cursor-pointer">
            <Upload className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
            <p className="text-sm text-zinc-400 mb-1">Drop files here or click to upload</p>
            <p className="text-xs text-zinc-600">PDF, DOCX, TXT up to 10MB</p>
          </div>

          <div className="bg-zinc-800/50 border border-zinc-800 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-[#00ff88]" />
                <div>
                  <p className="font-medium text-white text-sm">SDR-AGENT-LEAD-TRAINING.pdf</p>
                  <p className="text-xs text-zinc-500">Uploaded 2 days ago · 12 pages</p>
                </div>
              </div>
              <Button size="sm" variant="ghost" className="text-zinc-500 hover:text-red-400">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-zinc-500 pl-8">
              Contains: ICP definitions, qualification frameworks (BANT, CHAMP, MEDDIC), digital presence scoring, pain
              point identification, automation opportunities by industry
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
