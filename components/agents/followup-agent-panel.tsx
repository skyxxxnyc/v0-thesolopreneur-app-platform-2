"use client"

import type React from "react"

import { useState } from "react"
import { Clock, Mail, Phone, Plus, Trash2, GripVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface Cadence {
  id: string
  name: string
  steps: CadenceStep[]
  active: boolean
  leadsEnrolled: number
}

interface CadenceStep {
  id: string
  type: "email" | "call" | "linkedin" | "wait"
  delay: number
  delayUnit: "hours" | "days"
  template?: string
}

const mockCadences: Cadence[] = [
  {
    id: "1",
    name: "Cold Outreach Sequence",
    active: true,
    leadsEnrolled: 24,
    steps: [
      { id: "1", type: "email", delay: 0, delayUnit: "days", template: "Initial Outreach" },
      { id: "2", type: "wait", delay: 3, delayUnit: "days" },
      { id: "3", type: "email", delay: 0, delayUnit: "days", template: "Follow-up #1" },
      { id: "4", type: "wait", delay: 4, delayUnit: "days" },
      { id: "5", type: "linkedin", delay: 0, delayUnit: "days", template: "LinkedIn Connect" },
      { id: "6", type: "wait", delay: 7, delayUnit: "days" },
      { id: "7", type: "email", delay: 0, delayUnit: "days", template: "Break-up Email" },
    ],
  },
  {
    id: "2",
    name: "Warm Lead Nurture",
    active: true,
    leadsEnrolled: 12,
    steps: [
      { id: "1", type: "email", delay: 0, delayUnit: "days", template: "Thanks for interest" },
      { id: "2", type: "wait", delay: 2, delayUnit: "days" },
      { id: "3", type: "call", delay: 0, delayUnit: "days" },
      { id: "4", type: "wait", delay: 5, delayUnit: "days" },
      { id: "5", type: "email", delay: 0, delayUnit: "days", template: "Case study" },
    ],
  },
]

const pendingFollowUps = [
  { id: "1", leadName: "John Smith", company: "Acme Plumbing", action: "Send follow-up email", dueIn: "2 hours" },
  { id: "2", leadName: "Sarah Johnson", company: "City Dental", action: "Make call", dueIn: "Tomorrow" },
  { id: "3", leadName: "Mike Wilson", company: "Premier RE", action: "LinkedIn message", dueIn: "In 3 days" },
]

export function FollowUpAgentPanel() {
  const [activeTab, setActiveTab] = useState<"queue" | "cadences" | "settings">("queue")
  const [selectedCadence, setSelectedCadence] = useState<Cadence | null>(null)

  const getStepIcon = (type: CadenceStep["type"]) => {
    switch (type) {
      case "email":
        return Mail
      case "call":
        return Phone
      case "linkedin":
        return Linkedin
      case "wait":
        return Clock
    }
  }

  const getStepColor = (type: CadenceStep["type"]) => {
    switch (type) {
      case "email":
        return "#ff6b6b"
      case "call":
        return "#00ff88"
      case "linkedin":
        return "#0077b5"
      case "wait":
        return "#888"
    }
  }

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-1 border-b border-zinc-800 -mx-4 px-4">
        {[
          { id: "queue", label: "Follow-up Queue" },
          { id: "cadences", label: "Cadences" },
          { id: "settings", label: "Settings" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={cn(
              "px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-[1px]",
              activeTab === tab.id
                ? "text-[#ffa500] border-[#ffa500]"
                : "text-zinc-500 border-transparent hover:text-zinc-300",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Queue Tab */}
      {activeTab === "queue" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-500">{pendingFollowUps.length} pending follow-ups</span>
            <Button size="sm" className="bg-[#ffa500] text-black hover:bg-[#ffa500]/90">
              Process All
            </Button>
          </div>

          {pendingFollowUps.map((item) => (
            <div key={item.id} className="bg-zinc-800/50 border border-zinc-800 p-4 flex items-center justify-between">
              <div>
                <h4 className="font-medium text-white text-sm">{item.leadName}</h4>
                <p className="text-xs text-zinc-500">{item.company}</p>
                <p className="text-xs text-[#ffa500] mt-1">{item.action}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-white">{item.dueIn}</p>
                <div className="flex gap-2 mt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-zinc-700 text-zinc-400 h-7 text-xs bg-transparent"
                  >
                    Skip
                  </Button>
                  <Button size="sm" className="bg-[#ffa500] text-black h-7 text-xs">
                    Execute
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cadences Tab */}
      {activeTab === "cadences" && !selectedCadence && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-500">{mockCadences.length} active cadences</span>
            <Button size="sm" className="bg-[#ffa500] text-black hover:bg-[#ffa500]/90">
              <Plus className="w-4 h-4 mr-1" /> New Cadence
            </Button>
          </div>

          {mockCadences.map((cadence) => (
            <button
              key={cadence.id}
              onClick={() => setSelectedCadence(cadence)}
              className="w-full text-left bg-zinc-800/50 border border-zinc-800 p-4 hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-white">{cadence.name}</h4>
                <span
                  className={cn(
                    "px-2 py-1 text-xs font-medium",
                    cadence.active ? "bg-emerald-500/20 text-emerald-400" : "bg-zinc-700 text-zinc-400",
                  )}
                >
                  {cadence.active ? "Active" : "Paused"}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-zinc-500">
                <span>{cadence.steps.length} steps</span>
                <span>{cadence.leadsEnrolled} leads enrolled</span>
              </div>
              <div className="flex gap-1 mt-3">
                {cadence.steps.slice(0, 7).map((step) => {
                  const Icon = getStepIcon(step.type)
                  return (
                    <div
                      key={step.id}
                      className="w-6 h-6 flex items-center justify-center"
                      style={{ backgroundColor: `${getStepColor(step.type)}20` }}
                    >
                      <Icon className="w-3 h-3" style={{ color: getStepColor(step.type) }} />
                    </div>
                  )
                })}
                {cadence.steps.length > 7 && (
                  <div className="w-6 h-6 bg-zinc-800 flex items-center justify-center text-xs text-zinc-500">
                    +{cadence.steps.length - 7}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Cadence Editor */}
      {activeTab === "cadences" && selectedCadence && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <button onClick={() => setSelectedCadence(null)} className="text-sm text-zinc-500 hover:text-white">
              ← Back to Cadences
            </button>
            <Button size="sm" className="bg-[#ffa500] text-black hover:bg-[#ffa500]/90">
              Save Changes
            </Button>
          </div>

          <Input value={selectedCadence.name} className="bg-zinc-900 border-zinc-800 text-white text-lg font-medium" />

          <div className="space-y-2">
            {selectedCadence.steps.map((step, index) => {
              const Icon = getStepIcon(step.type)
              const color = getStepColor(step.type)

              return (
                <div key={step.id} className="flex items-center gap-3">
                  <GripVertical className="w-4 h-4 text-zinc-600 cursor-grab" />
                  <span className="text-xs text-zinc-600 w-6">{index + 1}</span>
                  <div className="flex-1 bg-zinc-800/50 border border-zinc-800 p-3 flex items-center gap-3">
                    <div
                      className="w-8 h-8 flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${color}20` }}
                    >
                      <Icon className="w-4 h-4" style={{ color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white capitalize">
                        {step.type === "wait" ? `Wait ${step.delay} ${step.delayUnit}` : step.type}
                      </p>
                      {step.template && <p className="text-xs text-zinc-500">{step.template}</p>}
                    </div>
                    <Button size="sm" variant="ghost" className="text-zinc-500 hover:text-red-400 shrink-0">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>

          <Button variant="outline" className="w-full border-zinc-700 border-dashed text-zinc-500 bg-transparent">
            <Plus className="w-4 h-4 mr-2" /> Add Step
          </Button>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === "settings" && (
        <div className="space-y-4">
          <div className="bg-zinc-800/50 border border-zinc-800 p-4">
            <h4 className="font-medium text-white mb-3">Execution Rules</h4>
            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">Pause on reply</span>
                <button className="w-8 h-5 bg-emerald-500 rounded-full relative">
                  <span className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full" />
                </button>
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">Pause on meeting booked</span>
                <button className="w-8 h-5 bg-emerald-500 rounded-full relative">
                  <span className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full" />
                </button>
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">Skip weekends</span>
                <button className="w-8 h-5 bg-emerald-500 rounded-full relative">
                  <span className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full" />
                </button>
              </label>
            </div>
          </div>

          <div className="bg-zinc-800/50 border border-zinc-800 p-4">
            <h4 className="font-medium text-white mb-3">Sending Hours</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-zinc-500 mb-1 block">Start Time</label>
                <Input type="time" defaultValue="09:00" className="bg-zinc-900 border-zinc-800 text-white" />
              </div>
              <div>
                <label className="text-xs text-zinc-500 mb-1 block">End Time</label>
                <Input type="time" defaultValue="17:00" className="bg-zinc-900 border-zinc-800 text-white" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// LinkedIn icon component
function Linkedin(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}
