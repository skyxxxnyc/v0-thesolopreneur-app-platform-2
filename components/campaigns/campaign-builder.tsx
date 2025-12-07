"use client"

import { useState } from "react"
import {
  Plus,
  Mail,
  Phone,
  Linkedin,
  MessageSquare,
  Clock,
  GitBranch,
  CheckSquare,
  GripVertical,
  Trash2,
  Sparkles,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import type { StepType, CampaignStep } from "@/lib/types/campaign"

const stepTypes: { type: StepType; label: string; icon: typeof Mail; color: string }[] = [
  { type: "email", label: "Email", icon: Mail, color: "#00d4ff" },
  { type: "call", label: "Call", icon: Phone, color: "#00ff88" },
  { type: "linkedin", label: "LinkedIn", icon: Linkedin, color: "#0077b5" },
  { type: "sms", label: "SMS", icon: MessageSquare, color: "#ff6b6b" },
  { type: "task", label: "Task", icon: CheckSquare, color: "#ffa500" },
  { type: "wait", label: "Wait", icon: Clock, color: "#6b7280" },
  { type: "condition", label: "Condition", icon: GitBranch, color: "#a855f7" },
]

interface CampaignBuilderProps {
  steps: Partial<CampaignStep>[]
  onChange: (steps: Partial<CampaignStep>[]) => void
}

export function CampaignBuilder({ steps, onChange }: CampaignBuilderProps) {
  const [selectedStepIndex, setSelectedStepIndex] = useState<number | null>(null)
  const [showAddMenu, setShowAddMenu] = useState(false)

  const addStep = (type: StepType) => {
    const newStep: Partial<CampaignStep> = {
      step_type: type,
      step_order: steps.length + 1,
      name: `${stepTypes.find((s) => s.type === type)?.label} ${steps.length + 1}`,
      delay_days: steps.length === 0 ? 0 : 1,
      delay_hours: 0,
      subject: type === "email" ? "" : null,
      body: "",
      ai_personalize: false,
    }
    onChange([...steps, newStep])
    setSelectedStepIndex(steps.length)
    setShowAddMenu(false)
  }

  const updateStep = (index: number, updates: Partial<CampaignStep>) => {
    const newSteps = [...steps]
    newSteps[index] = { ...newSteps[index], ...updates }
    onChange(newSteps)
  }

  const removeStep = (index: number) => {
    const newSteps = steps.filter((_, i) => i !== index)
    onChange(newSteps)
    setSelectedStepIndex(null)
  }

  const selectedStep = selectedStepIndex !== null ? steps[selectedStepIndex] : null

  return (
    <div className="flex h-[500px] border border-zinc-800">
      {/* Steps List */}
      <div className="w-80 border-r border-zinc-800 flex flex-col">
        <div className="p-3 border-b border-zinc-800">
          <h3 className="text-sm font-medium text-white">Sequence Steps</h3>
        </div>
        <div className="flex-1 overflow-auto p-3 space-y-2">
          {steps.map((step, index) => {
            const typeInfo = stepTypes.find((s) => s.type === step.step_type)!
            const Icon = typeInfo.icon

            return (
              <div key={index} className="relative">
                {/* Connector line */}
                {index > 0 && <div className="absolute left-5 -top-2 w-0.5 h-2 bg-zinc-700" />}

                <button
                  onClick={() => setSelectedStepIndex(index)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 text-left transition-colors",
                    selectedStepIndex === index
                      ? "bg-zinc-800 border border-zinc-700"
                      : "bg-zinc-900 border border-zinc-800 hover:border-zinc-700",
                  )}
                >
                  <GripVertical className="w-4 h-4 text-zinc-600 cursor-grab" />
                  <div
                    className="w-8 h-8 flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${typeInfo.color}20` }}
                  >
                    <Icon className="w-4 h-4" style={{ color: typeInfo.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{step.name}</p>
                    <p className="text-xs text-zinc-500">{index === 0 ? "Immediately" : `Day ${step.delay_days}`}</p>
                  </div>
                </button>

                {/* Connector to next */}
                {index < steps.length - 1 && <div className="absolute left-5 -bottom-2 w-0.5 h-2 bg-zinc-700" />}
              </div>
            )
          })}

          {/* Add Step Button */}
          <div className="relative">
            <Button
              variant="outline"
              onClick={() => setShowAddMenu(!showAddMenu)}
              className="w-full border-dashed border-zinc-700 text-zinc-500 hover:text-white hover:border-zinc-600 bg-transparent"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Step
              <ChevronDown className="w-4 h-4 ml-auto" />
            </Button>

            {showAddMenu && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-zinc-900 border border-zinc-800 z-10">
                {stepTypes.map((stepType) => {
                  const Icon = stepType.icon
                  return (
                    <button
                      key={stepType.type}
                      onClick={() => addStep(stepType.type)}
                      className="w-full flex items-center gap-3 p-3 text-left hover:bg-zinc-800 transition-colors"
                    >
                      <Icon className="w-4 h-4" style={{ color: stepType.color }} />
                      <span className="text-sm text-zinc-300">{stepType.label}</span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Step Editor */}
      <div className="flex-1 overflow-auto">
        {selectedStep ? (
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-white">{selectedStep.name}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeStep(selectedStepIndex!)}
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-zinc-400 text-sm">Step Name</Label>
                <Input
                  value={selectedStep.name || ""}
                  onChange={(e) => updateStep(selectedStepIndex!, { name: e.target.value })}
                  className="mt-1.5 bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-zinc-400 text-sm">Delay (Days)</Label>
                  <Input
                    type="number"
                    min="0"
                    value={selectedStep.delay_days || 0}
                    onChange={(e) =>
                      updateStep(selectedStepIndex!, { delay_days: Number.parseInt(e.target.value) || 0 })
                    }
                    className="mt-1.5 bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
                <div>
                  <Label className="text-zinc-400 text-sm">Hours</Label>
                  <Input
                    type="number"
                    min="0"
                    max="23"
                    value={selectedStep.delay_hours || 0}
                    onChange={(e) =>
                      updateStep(selectedStepIndex!, { delay_hours: Number.parseInt(e.target.value) || 0 })
                    }
                    className="mt-1.5 bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
              </div>
            </div>

            {selectedStep.step_type === "email" && (
              <>
                <div>
                  <Label className="text-zinc-400 text-sm">Subject Line</Label>
                  <Input
                    value={selectedStep.subject || ""}
                    onChange={(e) => updateStep(selectedStepIndex!, { subject: e.target.value })}
                    placeholder="e.g., Quick question about {{company}}"
                    className="mt-1.5 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-600"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <Label className="text-zinc-400 text-sm">Email Body</Label>
                    <button
                      onClick={() => updateStep(selectedStepIndex!, { ai_personalize: !selectedStep.ai_personalize })}
                      className={cn(
                        "flex items-center gap-1.5 px-2 py-1 text-xs transition-colors",
                        selectedStep.ai_personalize
                          ? "bg-[#00ff88]/20 text-[#00ff88]"
                          : "bg-zinc-800 text-zinc-500 hover:text-zinc-300",
                      )}
                    >
                      <Sparkles className="w-3 h-3" />
                      AI Personalize
                    </button>
                  </div>
                  <Textarea
                    value={selectedStep.body || ""}
                    onChange={(e) => updateStep(selectedStepIndex!, { body: e.target.value })}
                    placeholder="Write your email here. Use {{first_name}}, {{company}}, {{pain_point}} for personalization..."
                    className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-600 min-h-[200px] font-mono text-sm"
                  />
                  <p className="text-xs text-zinc-600 mt-1.5">
                    Available variables: {"{{first_name}}"}, {"{{last_name}}"}, {"{{company}}"}, {"{{title}}"},{" "}
                    {"{{pain_point}}"}, {"{{talking_point}}"}
                  </p>
                </div>
              </>
            )}

            {selectedStep.step_type === "call" && (
              <div>
                <Label className="text-zinc-400 text-sm">Call Script / Notes</Label>
                <Textarea
                  value={selectedStep.body || ""}
                  onChange={(e) => updateStep(selectedStepIndex!, { body: e.target.value })}
                  placeholder="Key talking points for this call..."
                  className="mt-1.5 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-600 min-h-[150px]"
                />
              </div>
            )}

            {selectedStep.step_type === "linkedin" && (
              <div>
                <Label className="text-zinc-400 text-sm">LinkedIn Message</Label>
                <Textarea
                  value={selectedStep.body || ""}
                  onChange={(e) => updateStep(selectedStepIndex!, { body: e.target.value })}
                  placeholder="Connection request or InMail message..."
                  className="mt-1.5 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-600 min-h-[150px]"
                />
                <p className="text-xs text-zinc-600 mt-1.5">
                  LinkedIn connection requests are limited to 300 characters
                </p>
              </div>
            )}

            {selectedStep.step_type === "task" && (
              <div>
                <Label className="text-zinc-400 text-sm">Task Description</Label>
                <Textarea
                  value={selectedStep.body || ""}
                  onChange={(e) => updateStep(selectedStepIndex!, { body: e.target.value })}
                  placeholder="What should be done in this step..."
                  className="mt-1.5 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-600 min-h-[100px]"
                />
              </div>
            )}

            {selectedStep.step_type === "wait" && (
              <div className="bg-zinc-800/50 border border-zinc-700 p-4">
                <p className="text-sm text-zinc-400">
                  This step will wait for the specified delay before continuing to the next step.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-zinc-600">
            <p>Select a step to edit or add a new step</p>
          </div>
        )}
      </div>
    </div>
  )
}
