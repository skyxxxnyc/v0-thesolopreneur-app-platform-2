"use client"

import type React from "react"
import { Bot, Search, MessageSquare, RefreshCw, ArrowRight, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const agents = [
  {
    icon: Bot,
    name: "SDR Agent",
    tagline: "Never miss a lead",
    description:
      "Automated prospecting that finds and qualifies leads while you sleep. Researches companies, identifies decision makers, and scores opportunities.",
    color: "#BFFF00",
    stats: ["500+ leads/day", "24/7 operation", "Auto-qualification"],
  },
  {
    icon: Search,
    name: "Enrichment Agent",
    tagline: "Data on autopilot",
    description:
      "Automatically enriches contact data with company info, social profiles, tech stack, funding data, and 50+ data points.",
    color: "#00FFFF",
    stats: ["50+ data points", "Real-time sync", "95% accuracy"],
  },
  {
    icon: MessageSquare,
    name: "Outreach Agent",
    tagline: "Personalized at scale",
    description:
      "Generates hyper-personalized emails and messages using prospect data. A/B tests subject lines and optimizes for replies.",
    color: "#FF6B6B",
    stats: ["3x reply rates", "AI copywriting", "Auto-personalization"],
  },
  {
    icon: RefreshCw,
    name: "Follow-up Agent",
    tagline: "Perfect timing, every time",
    description:
      "Intelligent follow-up sequences that adapt based on prospect behavior. Knows when to push and when to wait.",
    color: "#FFD93D",
    stats: ["Smart timing", "Behavior tracking", "Auto-sequences"],
  },
]

export function AIAgentsSection() {
  return (
    <section id="ai-agents" className="py-32 px-6 bg-[#0a0a0a] relative overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#BFFF00]" />
      <div className="absolute right-0 top-0 bottom-0 w-1 bg-[#00FFFF]" />

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#BFFF00] text-black font-mono tracking-widest uppercase mb-6 shadow-[4px_4px_0px_0px_rgba(255,107,107,0.5)]">
            <Zap className="w-4 h-4 fill-current" />
            <span className="text-xs font-black">AI Agents</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-[0.9]">
            Your team,
            <br />
            <span className="text-[#00FFFF]">automated.</span>
          </h2>
          <p className="text-xl text-neutral-300 max-w-2xl mx-auto leading-relaxed">
            Four AI agents working 24/7 to find leads, enrich data, craft outreach, and follow up.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {agents.map((agent, index) => (
            <AgentCard key={index} {...agent} />
          ))}
        </div>

        <div className="text-center">
          <Link href="/auth/signup">
            <Button className="bg-[#BFFF00] text-black hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none font-black text-lg px-10 py-7 h-auto group shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-2 border-black transition-all">
              Activate All Agents
              <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

function AgentCard({
  icon: Icon,
  name,
  tagline,
  description,
  color,
  stats,
}: {
  icon: React.ElementType
  name: string
  tagline: string
  description: string
  color: string
  stats: string[]
}) {
  return (
    <div
      className="border-2 border-neutral-800 bg-black p-8 hover:border-current hover:-translate-y-2 transition-all duration-200 group relative overflow-hidden shadow-[4px_4px_0px_0px_rgba(38,38,38,1)]"
      style={{ borderColor: "transparent" }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = color)}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#262626")}
    >
      <div className="absolute top-0 right-0 w-16 h-16 opacity-10" style={{ backgroundColor: color }} />

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="text-xs text-neutral-500 mb-2 uppercase tracking-wider font-bold">{tagline}</div>
          <h3 className="text-2xl font-black tracking-tight" style={{ color }}>
            {name}
          </h3>
        </div>
        <div
          className="w-16 h-16 border-2 flex items-center justify-center transition-all duration-300 group-hover:scale-110"
          style={{ borderColor: color, backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <Icon className="w-7 h-7" style={{ color }} />
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-neutral-300 leading-relaxed mb-6">{description}</p>

      <div className="flex flex-wrap gap-2">
        {stats.map((stat, index) => (
          <span
            key={index}
            className="px-3 py-1.5 border-2 text-xs font-bold transition-all hover:translate-x-[1px] hover:translate-y-[1px]"
            style={{
              borderColor: color,
              color: color,
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          >
            {stat}
          </span>
        ))}
      </div>
    </div>
  )
}
