"use client"

import { useState } from "react"
import {
  Bot,
  Zap,
  MessageSquare,
  RefreshCw,
  Play,
  Pause,
  Settings,
  ChevronRight,
  Activity,
  TrendingUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { SDRAgentPanel } from "./sdr-agent-panel"
import { EnrichmentAgentPanel } from "./enrichment-agent-panel"
import { OutreachAgentPanel } from "./outreach-agent-panel"
import { FollowUpAgentPanel } from "./followup-agent-panel"

type AgentType = "sdr" | "enrichment" | "outreach" | "followup"

interface Agent {
  id: AgentType
  name: string
  description: string
  icon: typeof Bot
  color: string
  status: "active" | "paused" | "idle"
  tasksCompleted: number
  tasksQueued: number
}

const agents: Agent[] = [
  {
    id: "sdr",
    name: "SDR Agent",
    description: "Analyzes leads against ICP, scores prospects, identifies pain points and opportunities",
    icon: Bot,
    color: "#00ff88",
    status: "active",
    tasksCompleted: 147,
    tasksQueued: 12,
  },
  {
    id: "enrichment",
    name: "Enrichment Agent",
    description: "Augments lead data with company info, social profiles, tech stack, and firmographics",
    icon: Zap,
    color: "#00d4ff",
    status: "active",
    tasksCompleted: 89,
    tasksQueued: 5,
  },
  {
    id: "outreach",
    name: "Outreach Agent",
    description: "Generates personalized messaging based on pain points and talking points",
    icon: MessageSquare,
    color: "#ff6b6b",
    status: "paused",
    tasksCompleted: 234,
    tasksQueued: 0,
  },
  {
    id: "followup",
    name: "Follow-up Agent",
    description: "Manages intelligent cadences and automated follow-up sequences",
    icon: RefreshCw,
    color: "#ffa500",
    status: "idle",
    tasksCompleted: 56,
    tasksQueued: 8,
  },
]

export function AgentsHub() {
  const [selectedAgent, setSelectedAgent] = useState<AgentType>("sdr")
  const [agentStates, setAgentStates] = useState<Record<AgentType, "active" | "paused" | "idle">>({
    sdr: "active",
    enrichment: "active",
    outreach: "paused",
    followup: "idle",
  })

  const toggleAgent = (agentId: AgentType) => {
    setAgentStates((prev) => ({
      ...prev,
      [agentId]: prev[agentId] === "active" ? "paused" : "active",
    }))
  }

  const totalCompleted = agents.reduce((sum, a) => sum + a.tasksCompleted, 0)
  const totalQueued = agents.reduce((sum, a) => sum + a.tasksQueued, 0)
  const activeAgents = Object.values(agentStates).filter((s) => s === "active").length

  return (
    <div className="p-6 space-y-6">
      {/* Header - Enhanced with stats */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">AI Agents</h1>
          <p className="text-sm text-zinc-500 mt-1">Autonomous agents that work for you 24/7</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-4 mr-4">
            <div className="text-right">
              <p className="text-xs text-zinc-500">Active</p>
              <p className="text-lg font-semibold text-[#00ff88]">{activeAgents}/4</p>
            </div>
            <div className="w-px h-8 bg-zinc-800" />
            <div className="text-right">
              <p className="text-xs text-zinc-500">Completed</p>
              <p className="text-lg font-semibold text-white">{totalCompleted}</p>
            </div>
            <div className="w-px h-8 bg-zinc-800" />
            <div className="text-right">
              <p className="text-xs text-zinc-500">Queued</p>
              <p className="text-lg font-semibold text-zinc-400">{totalQueued}</p>
            </div>
          </div>
          <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 bg-transparent">
            <Settings className="w-4 h-4 mr-2" />
            Global Settings
          </Button>
        </div>
      </div>

      {/* Agent Cards Grid - Enhanced with better hover and status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {agents.map((agent) => {
          const Icon = agent.icon
          const status = agentStates[agent.id]
          const isSelected = selectedAgent === agent.id

          return (
            <div
              key={agent.id}
              onClick={() => setSelectedAgent(agent.id)}
              className={cn(
                "bg-zinc-900 border p-4 cursor-pointer transition-all duration-200 group",
                isSelected ? "border-l-2 bg-zinc-800/50" : "border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/30",
              )}
              style={{
                borderLeftColor: isSelected ? agent.color : undefined,
                borderLeftWidth: isSelected ? 2 : 1,
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className="w-10 h-10 flex items-center justify-center transition-transform group-hover:scale-105"
                  style={{ backgroundColor: `${agent.color}20` }}
                >
                  <Icon className="w-5 h-5" style={{ color: agent.color }} />
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleAgent(agent.id)
                  }}
                  className={cn(
                    "p-1.5 transition-all duration-200",
                    status === "active"
                      ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                      : "bg-zinc-800 text-zinc-500 hover:bg-zinc-700 hover:text-zinc-300",
                  )}
                >
                  {status === "active" ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>
              </div>

              <h3 className="font-medium text-white mb-1 group-hover:text-white transition-colors">{agent.name}</h3>
              <p className="text-xs text-zinc-500 mb-3 line-clamp-2 group-hover:text-zinc-400 transition-colors">
                {agent.description}
              </p>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span
                    className={cn(
                      "w-1.5 h-1.5",
                      status === "active" && "bg-emerald-400 animate-pulse",
                      status === "paused" && "bg-yellow-400",
                      status === "idle" && "bg-zinc-600",
                    )}
                  />
                  <span className="text-zinc-500 capitalize">{status}</span>
                </div>
                <div className="text-zinc-600 flex items-center gap-1">
                  <Activity className="w-3 h-3" />
                  {agent.tasksCompleted} done
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Agent Panel - Enhanced header */}
      <div className="bg-zinc-900 border border-zinc-800">
        <div className="border-b border-zinc-800 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {(() => {
              const agent = agents.find((a) => a.id === selectedAgent)!
              const Icon = agent.icon
              return (
                <>
                  <div
                    className="w-6 h-6 flex items-center justify-center"
                    style={{ backgroundColor: `${agent.color}20` }}
                  >
                    <Icon className="w-3.5 h-3.5" style={{ color: agent.color }} />
                  </div>
                  <span className="font-medium text-white">{agent.name}</span>
                  <ChevronRight className="w-4 h-4 text-zinc-600" />
                  <span className="text-zinc-500 text-sm">Configuration & Activity</span>
                </>
              )
            })()}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-600 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Last 7 days
            </span>
          </div>
        </div>

        <div className="p-4">
          {selectedAgent === "sdr" && <SDRAgentPanel />}
          {selectedAgent === "enrichment" && <EnrichmentAgentPanel />}
          {selectedAgent === "outreach" && <OutreachAgentPanel />}
          {selectedAgent === "followup" && <FollowUpAgentPanel />}
        </div>
      </div>
    </div>
  )
}
