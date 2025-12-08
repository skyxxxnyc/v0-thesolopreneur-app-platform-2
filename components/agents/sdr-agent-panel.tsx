"use client"

import { useState, useEffect } from "react"
import { FileText, Target, AlertCircle, Lightbulb, Wrench, Upload, Trash2, Play, RefreshCw, Search, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"

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

interface AnalysisResult {
  id: string
  leadName: string
  leadId: string
  icpScore: number
  status: string
  painPoints: string[]
  salesOpportunities: string[]
  talkingPoints: string[]
  automationOpportunities: string[]
  analyzedAt: string
}

export function SDRAgentPanel() {
  const [activeTab, setActiveTab] = useState<"icps" | "training" | "results">("results")
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([])
  const [selectedResult, setSelectedResult] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState(false)
  const [unanalyzedCount, setUnanalyzedCount] = useState(0)
  const [discovering, setDiscovering] = useState(false)
  const [discoveryForm, setDiscoveryForm] = useState({
    industry: "",
    location: "",
    radius: "50000",
    maxResults: "20",
  })

  useEffect(() => {
    fetchAnalyses()
    fetchUnanalyzedCount()
  }, [])

  async function fetchAnalyses() {
    try {
      setLoading(true)
      const supabase = await createClient()

      const { data: analyses, error } = await supabase
        .from("sdr_analyses")
        .select(`
          id,
          lead_id,
          icp_score,
          pain_points,
          sales_opportunities,
          talking_points,
          automation_opportunities,
          created_at,
          leads (
            first_name,
            last_name,
            company_name
          )
        `)
        .order("created_at", { ascending: false })
        .limit(50)

      if (error) {
        console.error("Error fetching analyses:", error)
        return
      }

      const formatted: AnalysisResult[] = (analyses || []).map((a: any) => ({
        id: a.id,
        leadId: a.lead_id,
        leadName: a.leads?.company_name || `${a.leads?.first_name || ""} ${a.leads?.last_name || ""}`.trim() || "Unknown",
        icpScore: a.icp_score || 0,
        status: a.icp_score >= 70 ? "qualified" : "unqualified",
        painPoints: a.pain_points || [],
        salesOpportunities: a.sales_opportunities || [],
        talkingPoints: a.talking_points || [],
        automationOpportunities: a.automation_opportunities || [],
        analyzedAt: new Date(a.created_at).toLocaleString(),
      }))

      setAnalysisResults(formatted)
      if (formatted.length > 0 && !selectedResult) {
        setSelectedResult(formatted[0])
      }
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  async function fetchUnanalyzedCount() {
    try {
      const supabase = await createClient()
      const { count } = await supabase
        .from("leads")
        .select("*", { count: "exact", head: true })
        .is("icp_score", null)

      setUnanalyzedCount(count || 0)
    } catch (error) {
      console.error("Error fetching unanalyzed count:", error)
    }
  }

  async function runBatchAnalysis() {
    try {
      setAnalyzing(true)
      const response = await fetch("/api/agents/sdr/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      })

      const result = await response.json()

      if (result.success) {
        await fetchAnalyses()
        await fetchUnanalyzedCount()
      } else {
        console.error("Batch analysis failed:", result.error)
      }
    } catch (error) {
      console.error("Error running batch analysis:", error)
    } finally {
      setAnalyzing(false)
    }
  }

  async function discoverLeads() {
    if (!discoveryForm.industry || !discoveryForm.location) {
      alert("Please enter industry and location")
      return
    }

    try {
      setDiscovering(true)
      const response = await fetch("/api/agents/sdr/discover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          industry: discoveryForm.industry,
          location: discoveryForm.location,
          radius: parseInt(discoveryForm.radius),
          maxResults: parseInt(discoveryForm.maxResults),
          autoAnalyze: true,
        }),
      })

      const result = await response.json()

      if (result.success) {
        alert(`Discovered ${result.discovered} leads, saved ${result.saved}, analyzed ${result.analyzed}`)
        await fetchAnalyses()
        await fetchUnanalyzedCount()
        setActiveTab("results")
      } else {
        alert(`Discovery failed: ${result.error}`)
      }
    } catch (error: any) {
      console.error("Error discovering leads:", error)
      alert(`Error: ${error.message}`)
    } finally {
      setDiscovering(false)
    }
  }

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
              <div className="flex items-center gap-2">
                {unanalyzedCount > 0 && (
                  <span className="text-xs text-zinc-600">{unanalyzedCount} unanalyzed</span>
                )}
                <Button
                  size="sm"
                  onClick={runBatchAnalysis}
                  disabled={analyzing || unanalyzedCount === 0}
                  className="bg-[#00ff88] text-black hover:bg-[#00ff88]/90 h-6 px-2 text-xs"
                >
                  {analyzing ? (
                    <>
                      <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3 mr-1" />
                      Analyze Leads
                    </>
                  )}
                </Button>
              </div>
            </div>
            {loading ? (
              <div className="text-center py-8 text-zinc-500">Loading analyses...</div>
            ) : analysisResults.length === 0 ? (
              <div className="text-center py-8 text-zinc-500">
                No analyses yet. Click "Analyze Leads" to start.
              </div>
            ) : (
              analysisResults.map((result) => (
                <button
                  key={result.id}
                  onClick={() => setSelectedResult(result)}
                  className={cn(
                    "w-full text-left p-3 border transition-colors",
                    selectedResult?.id === result.id
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
              ))
            )}
          </div>

          {/* Analysis Detail */}
          <div className="col-span-2 space-y-4">
            {!selectedResult ? (
              <div className="flex items-center justify-center h-full text-zinc-500">
                Select an analysis to view details
              </div>
            ) : (
              <>
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
                    <Button
                      size="sm"
                      className="bg-[#00ff88] text-black hover:bg-[#00ff88]/90"
                      onClick={() => window.location.href = `/dashboard/leads?id=${selectedResult.leadId}`}
                    >
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
              </>
            )}
          </div>
        </div>
      )}

      {/* ICPs Tab */}
      {activeTab === "icps" && (
        <div className="space-y-6">
          {/* Lead Discovery Section */}
          <div className="bg-zinc-800/50 border border-zinc-800 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Search className="w-5 h-5 text-[#00ff88]" />
              <h3 className="text-lg font-semibold text-white">Discover Leads from Google Maps</h3>
            </div>
            <p className="text-sm text-zinc-500 mb-4">
              Automatically find and analyze potential leads based on your ICP criteria using Google Maps data
            </p>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs text-zinc-400 mb-1 block">Industry / Business Type *</label>
                <Input
                  placeholder="e.g., plumbing, dental clinic, restaurant"
                  value={discoveryForm.industry}
                  onChange={(e) => setDiscoveryForm({ ...discoveryForm, industry: e.target.value })}
                  className="bg-zinc-900 border-zinc-700 text-white"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-400 mb-1 block">Location *</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <Input
                    placeholder="e.g., San Francisco, CA"
                    value={discoveryForm.location}
                    onChange={(e) => setDiscoveryForm({ ...discoveryForm, location: e.target.value })}
                    className="bg-zinc-900 border-zinc-700 text-white pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-zinc-400 mb-1 block">Search Radius (meters)</label>
                <Input
                  type="number"
                  placeholder="50000"
                  value={discoveryForm.radius}
                  onChange={(e) => setDiscoveryForm({ ...discoveryForm, radius: e.target.value })}
                  className="bg-zinc-900 border-zinc-700 text-white"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-400 mb-1 block">Max Results</label>
                <Input
                  type="number"
                  placeholder="20"
                  value={discoveryForm.maxResults}
                  onChange={(e) => setDiscoveryForm({ ...discoveryForm, maxResults: e.target.value })}
                  className="bg-zinc-900 border-zinc-700 text-white"
                />
              </div>
            </div>

            <Button
              onClick={discoverLeads}
              disabled={discovering || !discoveryForm.industry || !discoveryForm.location}
              className="bg-[#00ff88] text-black hover:bg-[#00ff88]/90 w-full"
            >
              {discovering ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Discovering & Analyzing Leads...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Discover Leads
                </>
              )}
            </Button>
          </div>

          {/* ICP Definitions Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-zinc-500">Saved ICP definitions (coming soon)</p>
              <Button size="sm" className="bg-[#00ff88] text-black hover:bg-[#00ff88]/90" disabled>
                Add ICP
              </Button>
            </div>

            <div className="grid gap-4">
              {mockICPs.map((icp) => (
                <div key={icp.id} className="bg-zinc-800/50 border border-zinc-800 p-4 opacity-60">
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
                          icp.active ? "bg-emerald-500/20 text-emerald-400" : "bg-zinc-700 text-zinc-400"
                        )}
                      >
                        {icp.active ? "Active" : "Paused"}
                      </button>
                      <Button size="sm" variant="ghost" className="text-zinc-500 hover:text-red-400" disabled>
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
