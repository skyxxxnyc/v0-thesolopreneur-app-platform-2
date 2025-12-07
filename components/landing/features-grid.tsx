"use client"

import type React from "react"
import { LayoutTemplate, Users, Mail, BarChart3, Workflow, Globe, Palette, Shield, ArrowUpRight } from "lucide-react"

const features = [
  {
    icon: LayoutTemplate,
    title: "Funnel Builder",
    description: "Drag-and-drop landing pages, opt-ins, and sales funnels. No code required.",
    color: "#BFFF00",
  },
  {
    icon: Users,
    title: "CRM & Pipelines",
    description: "Visual kanban boards, deal tracking, and contact management that scales.",
    color: "#00FFFF",
  },
  {
    icon: Mail,
    title: "Email & SMS",
    description: "Automated sequences, broadcasts, and smart segmentation built-in.",
    color: "#FF6B6B",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description: "Real-time dashboards, conversion tracking, and revenue forecasting.",
    color: "#FFD93D",
  },
  {
    icon: Workflow,
    title: "Automations",
    description: "Visual workflow builder with triggers, conditions, and actions.",
    color: "#FF8C42",
  },
  {
    icon: Globe,
    title: "White Label",
    description: "Your brand, your domain, your clients. Full multi-tenant support.",
    color: "#00FFFF",
  },
  {
    icon: Palette,
    title: "Templates",
    description: "200+ pre-built funnels, emails, and workflows ready to customize.",
    color: "#BFFF00",
  },
  {
    icon: Shield,
    title: "Role-Based Access",
    description: "Agency admins, client admins, and team members with granular permissions.",
    color: "#FF6B6B",
  },
]

export function FeaturesGrid() {
  return (
    <section id="features" className="py-32 px-6 bg-black border-y-4 border-[#BFFF00]">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16 grid md:grid-cols-2 gap-12">
          <div>
            <div className="inline-block px-3 py-1 bg-[#00FFFF] text-black font-mono text-xs font-bold tracking-wider uppercase mb-4">
              Core Platform
            </div>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9]">
              Everything
              <br />
              <span className="text-[#BFFF00]">you need.</span>
            </h2>
          </div>
          <div className="flex flex-col justify-end">
            <p className="text-lg text-neutral-300 leading-relaxed mb-6">
              Stop paying for 10 different tools. One platform, unlimited possibilities.
            </p>
            <a
              href="#"
              className="text-sm text-[#BFFF00] font-bold flex items-center gap-2 group hover:gap-3 transition-all uppercase tracking-wide"
            >
              View all features
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  )
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  color,
}: {
  icon: React.ElementType
  title: string
  description: string
  color: string
}) {
  return (
    <div
      className="group bg-neutral-950 border-2 border-neutral-800 p-6 hover:border-current hover:-translate-y-1 transition-all duration-200 cursor-pointer relative overflow-hidden"
      style={{ borderColor: "transparent" }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = color)}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "transparent")}
    >
      <div
        className="absolute top-0 left-0 w-full h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ backgroundColor: color }}
      />

      <div className="relative">
        <div
          className="w-14 h-14 border-2 flex items-center justify-center mb-6 bg-black transition-all duration-300 group-hover:scale-110"
          style={{ borderColor: color }}
        >
          <Icon className="w-7 h-7" style={{ color }} />
        </div>
        <h3 className="font-bold text-lg mb-3 text-white">{title}</h3>
        <p className="text-sm text-neutral-400 leading-relaxed">{description}</p>
      </div>
    </div>
  )
}
