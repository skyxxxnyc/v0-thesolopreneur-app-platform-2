"use client"

import type React from "react"

import { useState } from "react"
import {
  ArrowLeft,
  Save,
  Eye,
  Settings,
  Layers,
  Plus,
  Trash2,
  GripVertical,
  Type,
  ImageIcon,
  Video,
  Square,
  FormInput,
  Quote,
  Grid3X3,
  DollarSign,
  HelpCircle,
  Timer,
  Minus,
  MoveVertical,
  LayoutTemplate,
  Globe,
  Smartphone,
  Monitor,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { PageBlock, BlockType } from "@/lib/types/funnel"

interface FunnelEditorProps {
  funnelId: string
}

// Block definitions
const blockTypes: { type: BlockType; label: string; icon: React.ReactNode; category: string }[] = [
  { type: "hero", label: "Hero Section", icon: <LayoutTemplate className="w-4 h-4" />, category: "sections" },
  { type: "heading", label: "Heading", icon: <Type className="w-4 h-4" />, category: "basic" },
  { type: "text", label: "Text", icon: <Type className="w-4 h-4" />, category: "basic" },
  { type: "image", label: "Image", icon: <ImageIcon className="w-4 h-4" />, category: "media" },
  { type: "video", label: "Video", icon: <Video className="w-4 h-4" />, category: "media" },
  { type: "button", label: "Button", icon: <Square className="w-4 h-4" />, category: "basic" },
  { type: "form", label: "Form", icon: <FormInput className="w-4 h-4" />, category: "conversion" },
  { type: "testimonial", label: "Testimonial", icon: <Quote className="w-4 h-4" />, category: "sections" },
  { type: "features", label: "Features", icon: <Grid3X3 className="w-4 h-4" />, category: "sections" },
  { type: "pricing", label: "Pricing", icon: <DollarSign className="w-4 h-4" />, category: "sections" },
  { type: "faq", label: "FAQ", icon: <HelpCircle className="w-4 h-4" />, category: "sections" },
  { type: "countdown", label: "Countdown", icon: <Timer className="w-4 h-4" />, category: "conversion" },
  { type: "divider", label: "Divider", icon: <Minus className="w-4 h-4" />, category: "layout" },
  { type: "spacer", label: "Spacer", icon: <MoveVertical className="w-4 h-4" />, category: "layout" },
  { type: "columns", label: "Columns", icon: <Grid3X3 className="w-4 h-4" />, category: "layout" },
]

// Mock initial blocks for the editor
const initialBlocks: PageBlock[] = [
  {
    id: "hero-1",
    type: "hero",
    props: {
      headline: "Transform Your Business with AI-Powered Automation",
      subheadline: "Join 10,000+ solopreneurs who've 10x'd their productivity",
      ctaText: "Get Started Free",
      ctaUrl: "#signup",
      backgroundType: "solid",
      backgroundColor: "#0a0a0a",
    },
  },
  {
    id: "features-1",
    type: "features",
    props: {
      headline: "Everything You Need",
      features: [
        { title: "AI Agents", description: "Automate outreach, follow-ups, and lead qualification" },
        { title: "CRM", description: "Manage contacts, deals, and pipelines in one place" },
        { title: "Funnels", description: "Build high-converting landing pages in minutes" },
      ],
    },
  },
  {
    id: "form-1",
    type: "form",
    props: {
      headline: "Start Your Free Trial",
      fields: [
        { type: "email", label: "Email", placeholder: "you@company.com", required: true },
        { type: "text", label: "Company", placeholder: "Your company name", required: false },
      ],
      buttonText: "Get Access",
      buttonColor: "#00ff88",
    },
  },
]

export function FunnelEditor({ funnelId }: FunnelEditorProps) {
  const [blocks, setBlocks] = useState<PageBlock[]>(initialBlocks)
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null)
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop")
  const [rightPanel, setRightPanel] = useState<"blocks" | "settings">("blocks")

  const selectedBlock = blocks.find((b) => b.id === selectedBlockId)

  const addBlock = (type: BlockType) => {
    const newBlock: PageBlock = {
      id: `${type}-${Date.now()}`,
      type,
      props: getDefaultProps(type),
    }
    setBlocks([...blocks, newBlock])
    setSelectedBlockId(newBlock.id)
  }

  const updateBlock = (id: string, props: Record<string, unknown>) => {
    setBlocks(blocks.map((b) => (b.id === id ? { ...b, props: { ...b.props, ...props } } : b)))
  }

  const deleteBlock = (id: string) => {
    setBlocks(blocks.filter((b) => b.id !== id))
    if (selectedBlockId === id) setSelectedBlockId(null)
  }

  const moveBlock = (id: string, direction: "up" | "down") => {
    const index = blocks.findIndex((b) => b.id === id)
    if ((direction === "up" && index === 0) || (direction === "down" && index === blocks.length - 1)) return

    const newBlocks = [...blocks]
    const newIndex = direction === "up" ? index - 1 : index + 1
    ;[newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[index]]
    setBlocks(newBlocks)
  }

  return (
    <div className="h-screen flex flex-col bg-zinc-950">
      {/* Top Bar */}
      <header className="h-14 border-b border-zinc-800 flex items-center justify-between px-4 bg-zinc-900">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/funnels" className="text-zinc-500 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <Input
              defaultValue="SaaS Launch Funnel"
              className="bg-transparent border-none text-white font-semibold h-8 px-0 focus-visible:ring-0"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Preview Mode Toggle */}
          <div className="flex items-center border border-zinc-800 bg-zinc-900">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPreviewMode("desktop")}
              className={previewMode === "desktop" ? "bg-zinc-800 text-white" : "text-zinc-500"}
            >
              <Monitor className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPreviewMode("mobile")}
              className={previewMode === "mobile" ? "bg-zinc-800 text-white" : "text-zinc-500"}
            >
              <Smartphone className="w-4 h-4" />
            </Button>
          </div>
          <Button variant="outline" size="sm" className="border-zinc-700 text-zinc-300 bg-transparent">
            <Eye className="w-4 h-4 mr-2" /> Preview
          </Button>
          <Button size="sm" className="bg-[#00ff88] text-black hover:bg-[#00ff88]/90 font-semibold">
            <Save className="w-4 h-4 mr-2" /> Save
          </Button>
          <Button size="sm" className="bg-[#00d4ff] text-black hover:bg-[#00d4ff]/90 font-semibold">
            <Globe className="w-4 h-4 mr-2" /> Publish
          </Button>
        </div>
      </header>

      {/* Main Editor Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Layers */}
        <aside className="w-64 border-r border-zinc-800 bg-zinc-900 flex flex-col">
          <div className="p-3 border-b border-zinc-800">
            <div className="flex items-center gap-2 text-zinc-400">
              <Layers className="w-4 h-4" />
              <span className="text-sm font-medium">Layers</span>
            </div>
          </div>
          <div className="flex-1 overflow-auto p-2 space-y-1">
            {blocks.map((block, index) => (
              <div
                key={block.id}
                onClick={() => setSelectedBlockId(block.id)}
                className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer transition-colors ${
                  selectedBlockId === block.id
                    ? "bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/30"
                    : "text-zinc-400 hover:bg-zinc-800 hover:text-white border border-transparent"
                }`}
              >
                <GripVertical className="w-3 h-3 text-zinc-600 cursor-grab" />
                <span className="capitalize">{block.type}</span>
                <span className="text-zinc-600 text-xs ml-auto">#{index + 1}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* Canvas */}
        <main className="flex-1 overflow-auto bg-zinc-950 p-8">
          <div
            className={`mx-auto bg-zinc-900 border border-zinc-800 min-h-full transition-all ${
              previewMode === "mobile" ? "max-w-sm" : "max-w-4xl"
            }`}
          >
            {blocks.map((block) => (
              <BlockRenderer
                key={block.id}
                block={block}
                isSelected={selectedBlockId === block.id}
                onClick={() => setSelectedBlockId(block.id)}
                onDelete={() => deleteBlock(block.id)}
                onMoveUp={() => moveBlock(block.id, "up")}
                onMoveDown={() => moveBlock(block.id, "down")}
              />
            ))}

            {/* Add Block Button */}
            <button
              onClick={() => setRightPanel("blocks")}
              className="w-full py-8 border-2 border-dashed border-zinc-800 hover:border-zinc-700 text-zinc-600 hover:text-zinc-400 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Block</span>
            </button>
          </div>
        </main>

        {/* Right Panel */}
        <aside className="w-80 border-l border-zinc-800 bg-zinc-900 flex flex-col">
          <Tabs
            value={rightPanel}
            onValueChange={(v) => setRightPanel(v as "blocks" | "settings")}
            className="flex flex-col h-full"
          >
            <TabsList className="w-full bg-transparent border-b border-zinc-800 rounded-none h-auto p-0">
              <TabsTrigger
                value="blocks"
                className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-[#00ff88] data-[state=active]:bg-transparent data-[state=active]:text-[#00ff88] py-3"
              >
                <Plus className="w-4 h-4 mr-2" /> Blocks
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-[#00ff88] data-[state=active]:bg-transparent data-[state=active]:text-[#00ff88] py-3"
              >
                <Settings className="w-4 h-4 mr-2" /> Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="blocks" className="flex-1 overflow-auto p-4 space-y-4 mt-0">
              {["sections", "basic", "media", "conversion", "layout"].map((category) => (
                <div key={category}>
                  <h4 className="text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-2">{category}</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {blockTypes
                      .filter((b) => b.category === category)
                      .map((blockType) => (
                        <button
                          key={blockType.type}
                          onClick={() => addBlock(blockType.type)}
                          className="flex flex-col items-center gap-2 p-3 bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 transition-colors text-zinc-400 hover:text-white"
                        >
                          {blockType.icon}
                          <span className="text-xs">{blockType.label}</span>
                        </button>
                      ))}
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="settings" className="flex-1 overflow-auto p-4 mt-0">
              {selectedBlock ? (
                <BlockSettings block={selectedBlock} onUpdate={(props) => updateBlock(selectedBlock.id, props)} />
              ) : (
                <div className="text-center text-zinc-500 py-8">
                  <Settings className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Select a block to edit its settings</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </aside>
      </div>
    </div>
  )
}

// Block Renderer Component
function BlockRenderer({
  block,
  isSelected,
  onClick,
  onDelete,
  onMoveUp,
  onMoveDown,
}: {
  block: PageBlock
  isSelected: boolean
  onClick: () => void
  onDelete: () => void
  onMoveUp: () => void
  onMoveDown: () => void
}) {
  return (
    <div
      onClick={onClick}
      className={`relative group cursor-pointer transition-all ${
        isSelected ? "ring-2 ring-[#00ff88] ring-offset-2 ring-offset-zinc-950" : ""
      }`}
    >
      {/* Block Controls */}
      <div
        className={`absolute -left-12 top-1/2 -translate-y-1/2 flex flex-col gap-1 transition-opacity ${
          isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
      >
        <Button variant="ghost" size="icon" onClick={onMoveUp} className="h-8 w-8 text-zinc-500 hover:text-white">
          <ArrowLeft className="w-4 h-4 rotate-90" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onMoveDown} className="h-8 w-8 text-zinc-500 hover:text-white">
          <ArrowLeft className="w-4 h-4 -rotate-90" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onDelete} className="h-8 w-8 text-zinc-500 hover:text-red-400">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Block Content Preview */}
      {renderBlockPreview(block)}
    </div>
  )
}

// Block Preview Renderer
function renderBlockPreview(block: PageBlock) {
  const props = block.props as Record<string, unknown>

  switch (block.type) {
    case "hero":
      return (
        <div
          className="py-20 px-8 text-center"
          style={{ backgroundColor: (props.backgroundColor as string) || "#0a0a0a" }}
        >
          <h1 className="text-4xl font-bold text-white mb-4">{(props.headline as string) || "Your Headline Here"}</h1>
          <p className="text-xl text-zinc-400 mb-8 max-w-2xl mx-auto">
            {(props.subheadline as string) || "Your subheadline goes here"}
          </p>
          <button className="px-8 py-3 bg-[#00ff88] text-black font-semibold">
            {(props.ctaText as string) || "Call to Action"}
          </button>
        </div>
      )
    case "features":
      return (
        <div className="py-16 px-8">
          <h2 className="text-2xl font-bold text-white text-center mb-12">
            {(props.headline as string) || "Features"}
          </h2>
          <div className="grid grid-cols-3 gap-8">
            {((props.features as Array<{ title: string; description: string }>) || []).map((feature, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 bg-[#00ff88]/10 mx-auto mb-4 flex items-center justify-center">
                  <Grid3X3 className="w-6 h-6 text-[#00ff88]" />
                </div>
                <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-zinc-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      )
    case "form":
      return (
        <div className="py-16 px-8 bg-zinc-800/50">
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-white text-center mb-8">
              {(props.headline as string) || "Sign Up"}
            </h2>
            <div className="space-y-4">
              {((props.fields as Array<{ label: string; placeholder: string }>) || []).map((field, i) => (
                <div key={i}>
                  <label className="text-sm text-zinc-400 block mb-1">{field.label}</label>
                  <input
                    type="text"
                    placeholder={field.placeholder}
                    className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 text-white"
                    readOnly
                  />
                </div>
              ))}
              <button
                className="w-full py-3 font-semibold text-black"
                style={{ backgroundColor: (props.buttonColor as string) || "#00ff88" }}
              >
                {(props.buttonText as string) || "Submit"}
              </button>
            </div>
          </div>
        </div>
      )
    case "heading":
      return (
        <div className="py-8 px-8">
          <h2 className="text-3xl font-bold text-white">{(props.text as string) || "Heading"}</h2>
        </div>
      )
    case "text":
      return (
        <div className="py-4 px-8">
          <p className="text-zinc-400">{(props.text as string) || "Your text content goes here..."}</p>
        </div>
      )
    case "button":
      return (
        <div className="py-4 px-8">
          <button
            className="px-6 py-2 font-semibold text-black"
            style={{ backgroundColor: (props.color as string) || "#00ff88" }}
          >
            {(props.text as string) || "Button"}
          </button>
        </div>
      )
    case "divider":
      return <hr className="border-zinc-800 my-8 mx-8" />
    case "spacer":
      return <div style={{ height: (props.height as number) || 40 }} />
    default:
      return (
        <div className="py-8 px-8 text-center text-zinc-600 border border-dashed border-zinc-800">
          <span className="capitalize">{block.type}</span> block
        </div>
      )
  }
}

// Block Settings Component
function BlockSettings({ block, onUpdate }: { block: PageBlock; onUpdate: (props: Record<string, unknown>) => void }) {
  const props = block.props as Record<string, unknown>

  switch (block.type) {
    case "hero":
      return (
        <div className="space-y-4">
          <h3 className="font-semibold text-white">Hero Settings</h3>
          <div className="space-y-2">
            <Label className="text-zinc-400 text-xs">Headline</Label>
            <Input
              value={(props.headline as string) || ""}
              onChange={(e) => onUpdate({ headline: e.target.value })}
              className="bg-zinc-800 border-zinc-700 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-400 text-xs">Subheadline</Label>
            <Textarea
              value={(props.subheadline as string) || ""}
              onChange={(e) => onUpdate({ subheadline: e.target.value })}
              className="bg-zinc-800 border-zinc-700 text-white resize-none"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-400 text-xs">CTA Button Text</Label>
            <Input
              value={(props.ctaText as string) || ""}
              onChange={(e) => onUpdate({ ctaText: e.target.value })}
              className="bg-zinc-800 border-zinc-700 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-400 text-xs">CTA Button URL</Label>
            <Input
              value={(props.ctaUrl as string) || ""}
              onChange={(e) => onUpdate({ ctaUrl: e.target.value })}
              className="bg-zinc-800 border-zinc-700 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-400 text-xs">Background Color</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={(props.backgroundColor as string) || "#0a0a0a"}
                onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
                className="w-12 h-10 p-1 bg-zinc-800 border-zinc-700"
              />
              <Input
                value={(props.backgroundColor as string) || "#0a0a0a"}
                onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
                className="flex-1 bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
          </div>
        </div>
      )
    case "form":
      return (
        <div className="space-y-4">
          <h3 className="font-semibold text-white">Form Settings</h3>
          <div className="space-y-2">
            <Label className="text-zinc-400 text-xs">Form Headline</Label>
            <Input
              value={(props.headline as string) || ""}
              onChange={(e) => onUpdate({ headline: e.target.value })}
              className="bg-zinc-800 border-zinc-700 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-400 text-xs">Button Text</Label>
            <Input
              value={(props.buttonText as string) || ""}
              onChange={(e) => onUpdate({ buttonText: e.target.value })}
              className="bg-zinc-800 border-zinc-700 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-400 text-xs">Button Color</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={(props.buttonColor as string) || "#00ff88"}
                onChange={(e) => onUpdate({ buttonColor: e.target.value })}
                className="w-12 h-10 p-1 bg-zinc-800 border-zinc-700"
              />
              <Input
                value={(props.buttonColor as string) || "#00ff88"}
                onChange={(e) => onUpdate({ buttonColor: e.target.value })}
                className="flex-1 bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
          </div>
        </div>
      )
    default:
      return (
        <div className="space-y-4">
          <h3 className="font-semibold text-white capitalize">{block.type} Settings</h3>
          <p className="text-sm text-zinc-500">Configure this block&apos;s properties.</p>
        </div>
      )
  }
}

// Default props for new blocks
function getDefaultProps(type: BlockType): Record<string, unknown> {
  switch (type) {
    case "hero":
      return {
        headline: "Your Headline Here",
        subheadline: "Your compelling subheadline that drives action",
        ctaText: "Get Started",
        ctaUrl: "#",
        backgroundColor: "#0a0a0a",
      }
    case "heading":
      return { text: "Section Heading", level: "h2" }
    case "text":
      return { text: "Your text content goes here. Edit this to add your own copy." }
    case "button":
      return { text: "Click Here", url: "#", color: "#00ff88" }
    case "form":
      return {
        headline: "Sign Up Now",
        fields: [{ type: "email", label: "Email", placeholder: "you@example.com", required: true }],
        buttonText: "Submit",
        buttonColor: "#00ff88",
      }
    case "features":
      return {
        headline: "Why Choose Us",
        features: [
          { title: "Feature 1", description: "Description of feature one" },
          { title: "Feature 2", description: "Description of feature two" },
          { title: "Feature 3", description: "Description of feature three" },
        ],
      }
    case "testimonial":
      return {
        quote: "This product changed my life!",
        author: "Happy Customer",
        company: "Acme Inc",
      }
    case "spacer":
      return { height: 40 }
    default:
      return {}
  }
}
