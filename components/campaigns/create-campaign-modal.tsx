"use client"

import { useState } from "react"
import { X, Mail, Zap, TrendingUp, Users, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import type { CampaignType } from "@/lib/types/campaign"

interface CreateCampaignModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const campaignTypes: { type: CampaignType; label: string; description: string; icon: typeof Mail; color: string }[] = [
  {
    type: "outbound",
    label: "Outbound",
    description: "Cold outreach to new prospects with multi-touch sequences",
    icon: Users,
    color: "#ffa500",
  },
  {
    type: "nurture",
    label: "Nurture",
    description: "Warm up inbound leads with educational content",
    icon: TrendingUp,
    color: "#00ff88",
  },
  {
    type: "email",
    label: "Email Only",
    description: "Simple email-only campaign with automated follow-ups",
    icon: Mail,
    color: "#00d4ff",
  },
  {
    type: "multi_channel",
    label: "Multi-Channel",
    description: "Combine email, calls, LinkedIn, and tasks",
    icon: Zap,
    color: "#ff6b6b",
  },
]

export function CreateCampaignModal({ open, onOpenChange }: CreateCampaignModalProps) {
  const [step, setStep] = useState<1 | 2>(1)
  const [selectedType, setSelectedType] = useState<CampaignType | null>(null)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  if (!open) return null

  const handleCreate = () => {
    // TODO: Create campaign in database
    console.log({ type: selectedType, name, description })
    onOpenChange(false)
    setStep(1)
    setSelectedType(null)
    setName("")
    setDescription("")
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/80" onClick={() => onOpenChange(false)} />
      <div className="relative bg-zinc-900 border border-zinc-800 w-full max-w-2xl max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <h2 className="text-lg font-semibold text-white">
            {step === 1 ? "Choose Campaign Type" : "Campaign Details"}
          </h2>
          <button onClick={() => onOpenChange(false)} className="text-zinc-500 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 1 ? (
            <div className="grid grid-cols-2 gap-4">
              {campaignTypes.map((campaign) => {
                const Icon = campaign.icon
                const isSelected = selectedType === campaign.type

                return (
                  <button
                    key={campaign.type}
                    onClick={() => setSelectedType(campaign.type)}
                    className={cn(
                      "p-4 border text-left transition-all",
                      isSelected
                        ? "border-l-2 bg-zinc-800/50"
                        : "border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/30",
                    )}
                    style={{
                      borderLeftColor: isSelected ? campaign.color : undefined,
                    }}
                  >
                    <div
                      className="w-10 h-10 flex items-center justify-center mb-3"
                      style={{ backgroundColor: `${campaign.color}20` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: campaign.color }} />
                    </div>
                    <h3 className="font-medium text-white mb-1">{campaign.label}</h3>
                    <p className="text-sm text-zinc-500">{campaign.description}</p>
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label className="text-zinc-400 text-sm">Campaign Name</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Q4 Outbound - Agency Owners"
                  className="mt-1.5 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-600"
                />
              </div>
              <div>
                <Label className="text-zinc-400 text-sm">Description (optional)</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of the campaign goal and target audience..."
                  className="mt-1.5 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-600 min-h-[100px]"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-zinc-800">
          {step === 2 && (
            <Button
              variant="ghost"
              onClick={() => setStep(1)}
              className="text-zinc-400 hover:text-white hover:bg-zinc-800"
            >
              Back
            </Button>
          )}
          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="text-zinc-400 hover:text-white hover:bg-zinc-800"
            >
              Cancel
            </Button>
            {step === 1 ? (
              <Button
                onClick={() => setStep(2)}
                disabled={!selectedType}
                className="bg-[#00ff88] text-black hover:bg-[#00ff88]/90 disabled:opacity-50"
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleCreate}
                disabled={!name.trim()}
                className="bg-[#00ff88] text-black hover:bg-[#00ff88]/90 disabled:opacity-50"
              >
                Create Campaign
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
