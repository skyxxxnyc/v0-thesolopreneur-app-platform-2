"use client"

import type React from "react"

import { useState } from "react"
import { X, LayoutTemplate, Rocket, Calendar, ShoppingCart, Mail, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { FunnelTemplate } from "@/lib/types/funnel"

interface CreateFunnelModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const templates: FunnelTemplate[] = [
  {
    id: "blank",
    name: "Blank Canvas",
    description: "Start from scratch",
    category: "lead-gen",
    thumbnail: "",
    pages: [
      {
        name: "Landing Page",
        slug: "",
        page_order: 0,
        content: { blocks: [] },
        seo_title: null,
        seo_description: null,
        og_image: null,
      },
    ],
  },
  {
    id: "lead-gen",
    name: "Lead Generation",
    description: "Capture leads with a high-converting opt-in page",
    category: "lead-gen",
    thumbnail: "",
    pages: [
      {
        name: "Opt-in Page",
        slug: "",
        page_order: 0,
        content: { blocks: [] },
        seo_title: null,
        seo_description: null,
        og_image: null,
      },
    ],
  },
  {
    id: "webinar",
    name: "Webinar Registration",
    description: "Drive signups for your webinar or event",
    category: "webinar",
    thumbnail: "",
    pages: [
      {
        name: "Registration",
        slug: "",
        page_order: 0,
        content: { blocks: [] },
        seo_title: null,
        seo_description: null,
        og_image: null,
      },
    ],
  },
  {
    id: "sales",
    name: "Sales Page",
    description: "Long-form sales page with testimonials",
    category: "sales",
    thumbnail: "",
    pages: [
      {
        name: "Sales Page",
        slug: "",
        page_order: 0,
        content: { blocks: [] },
        seo_title: null,
        seo_description: null,
        og_image: null,
      },
    ],
  },
  {
    id: "opt-in",
    name: "Free Resource",
    description: "Give away a lead magnet in exchange for email",
    category: "opt-in",
    thumbnail: "",
    pages: [
      {
        name: "Download Page",
        slug: "",
        page_order: 0,
        content: { blocks: [] },
        seo_title: null,
        seo_description: null,
        og_image: null,
      },
    ],
  },
  {
    id: "coming-soon",
    name: "Coming Soon",
    description: "Build hype before your launch",
    category: "coming-soon",
    thumbnail: "",
    pages: [
      {
        name: "Coming Soon",
        slug: "",
        page_order: 0,
        content: { blocks: [] },
        seo_title: null,
        seo_description: null,
        og_image: null,
      },
    ],
  },
]

const categoryIcons: Record<string, React.ReactNode> = {
  "lead-gen": <Mail className="w-5 h-5" />,
  webinar: <Calendar className="w-5 h-5" />,
  sales: <ShoppingCart className="w-5 h-5" />,
  "opt-in": <Rocket className="w-5 h-5" />,
  "coming-soon": <Clock className="w-5 h-5" />,
}

export function CreateFunnelModal({ open, onOpenChange }: CreateFunnelModalProps) {
  const [step, setStep] = useState<"template" | "details">("template")
  const [selectedTemplate, setSelectedTemplate] = useState<FunnelTemplate | null>(null)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  if (!open) return null

  const handleSelectTemplate = (template: FunnelTemplate) => {
    setSelectedTemplate(template)
    setStep("details")
  }

  const handleCreate = () => {
    // TODO: Create funnel via API
    console.log("Creating funnel:", { template: selectedTemplate?.id, name, description })
    onOpenChange(false)
    setStep("template")
    setSelectedTemplate(null)
    setName("")
    setDescription("")
  }

  const handleBack = () => {
    setStep("template")
    setSelectedTemplate(null)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/80" onClick={() => onOpenChange(false)} />
      <div className="relative bg-zinc-900 border border-zinc-800 w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <LayoutTemplate className="w-5 h-5 text-[#00ff88]" />
            <h2 className="text-lg font-semibold text-white">
              {step === "template" ? "Choose a Template" : "Funnel Details"}
            </h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="text-zinc-500 hover:text-white"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {step === "template" ? (
            <div className="grid grid-cols-3 gap-4">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleSelectTemplate(template)}
                  className="bg-zinc-800/50 border border-zinc-800 hover:border-[#00ff88]/50 hover:bg-zinc-800 transition-all p-4 text-left group"
                >
                  <div className="h-24 bg-zinc-900 mb-4 flex items-center justify-center border border-zinc-700 group-hover:border-[#00ff88]/30 transition-colors">
                    <div className="text-zinc-600 group-hover:text-[#00ff88]/70 transition-colors">
                      {template.id === "blank" ? (
                        <LayoutTemplate className="w-8 h-8" />
                      ) : (
                        categoryIcons[template.category]
                      )}
                    </div>
                  </div>
                  <h3 className="font-medium text-white text-sm">{template.name}</h3>
                  <p className="text-xs text-zinc-500 mt-1">{template.description}</p>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-6 max-w-md">
              <div className="space-y-2">
                <Label className="text-zinc-300">Funnel Name</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Product Launch Funnel"
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-600"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Description (optional)</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What is this funnel for?"
                  rows={3}
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-600 resize-none"
                />
              </div>
              <div className="bg-zinc-800/50 border border-zinc-700 p-3">
                <p className="text-xs text-zinc-500">Template</p>
                <p className="text-sm text-white font-medium mt-0.5">{selectedTemplate?.name}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-zinc-800">
          <div>
            {step === "details" && (
              <Button variant="ghost" onClick={handleBack} className="text-zinc-400 hover:text-white">
                Back
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="border-zinc-700 text-zinc-300">
              Cancel
            </Button>
            {step === "details" && (
              <Button
                onClick={handleCreate}
                disabled={!name.trim()}
                className="bg-[#00ff88] text-black hover:bg-[#00ff88]/90 font-semibold"
              >
                Create Funnel
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
