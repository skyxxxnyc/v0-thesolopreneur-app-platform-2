"use client"

import { useState, useEffect } from "react"
import { X, Send, Paperclip, Sparkles, ChevronDown, Building2, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface ComposeEmailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: {
    to?: string
    subject?: string
    companyId?: string
    contactId?: string
  } | null
}

export function ComposeEmailModal({ open, onOpenChange, initialData }: ComposeEmailModalProps) {
  const [to, setTo] = useState("")
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [showAiSuggestions, setShowAiSuggestions] = useState(false)

  useEffect(() => {
    if (initialData) {
      setTo(initialData.to || "")
      setSubject(initialData.subject || "")
    } else {
      setTo("")
      setSubject("")
      setBody("")
    }
  }, [initialData, open])

  const handleSend = async () => {
    setIsSending(true)

    try {
      const response = await fetch("/api/integrations/gmail/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to,
          subject,
          body,
          companyId: initialData?.companyId,
          contactId: initialData?.contactId,
        }),
      })

      if (!response.ok) throw new Error("Failed to send email")

      onOpenChange(false)
      setTo("")
      setSubject("")
      setBody("")
    } catch (error) {
      console.error("Error sending email:", error)
    } finally {
      setIsSending(false)
    }
  }

  const generateWithAi = async (type: "cold-outreach" | "follow-up" | "meeting-request") => {
    setShowAiSuggestions(false)
    // TODO: Call outreach agent
    const templates = {
      "cold-outreach":
        "Hi there,\n\nI came across your company and was impressed by what you're building. I'd love to explore how we might be able to help you [specific value prop].\n\nWould you be open to a quick 15-minute call this week?\n\nBest,",
      "follow-up":
        "Hi,\n\nI wanted to follow up on my previous email. I understand you're busy, but I believe there's a real opportunity for us to work together.\n\nLet me know if you have any questions or would like to schedule a call.\n\nBest,",
      "meeting-request":
        "Hi,\n\nI'd like to schedule a meeting to discuss [topic]. I'm available:\n\n- Tuesday 2-4pm\n- Wednesday 10am-12pm\n- Thursday 3-5pm\n\nPlease let me know what works best for you.\n\nBest,",
    }
    setBody(templates[type])
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end p-4">
      <div className="absolute inset-0 bg-black/50" onClick={() => onOpenChange(false)} />
      <div className="relative bg-zinc-900 border border-zinc-800 w-full max-w-2xl flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <h2 className="font-semibold text-white">New Message</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="text-zinc-500 hover:text-white h-8 w-8"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-auto">
          <div className="p-4 space-y-4">
            {/* To Field */}
            <div className="flex items-center gap-3 border-b border-zinc-800 pb-3">
              <Label className="text-zinc-500 text-sm w-12">To:</Label>
              <Input
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="recipient@example.com"
                className="flex-1 bg-transparent border-none text-white placeholder:text-zinc-600 h-8 px-0 focus-visible:ring-0"
              />
            </div>

            {/* Subject Field */}
            <div className="flex items-center gap-3 border-b border-zinc-800 pb-3">
              <Label className="text-zinc-500 text-sm w-12">Subject:</Label>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Email subject"
                className="flex-1 bg-transparent border-none text-white placeholder:text-zinc-600 h-8 px-0 focus-visible:ring-0"
              />
            </div>

            {/* CRM Link Indicator */}
            {(initialData?.companyId || initialData?.contactId) && (
              <div className="flex items-center gap-2 px-3 py-2 bg-zinc-800/50 border border-zinc-700 text-xs">
                {initialData.companyId && (
                  <span className="flex items-center gap-1 text-[#00ff88]">
                    <Building2 className="w-3 h-3" /> Linked to Company
                  </span>
                )}
                {initialData.contactId && (
                  <span className="flex items-center gap-1 text-[#00d4ff]">
                    <User className="w-3 h-3" /> Linked to Contact
                  </span>
                )}
              </div>
            )}

            {/* Body */}
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your message..."
              className="min-h-[200px] bg-transparent border-none text-white placeholder:text-zinc-600 resize-none focus-visible:ring-0"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-zinc-800">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white">
              <Paperclip className="w-4 h-4" />
            </Button>
            <DropdownMenu open={showAiSuggestions} onOpenChange={setShowAiSuggestions}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-[#00ff88] h-8">
                  <Sparkles className="w-4 h-4 mr-1.5" /> AI Assist
                  <ChevronDown className="w-3 h-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-zinc-900 border-zinc-800">
                <DropdownMenuItem
                  onClick={() => generateWithAi("cold-outreach")}
                  className="text-zinc-300 focus:bg-zinc-800 focus:text-white"
                >
                  Cold Outreach Template
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => generateWithAi("follow-up")}
                  className="text-zinc-300 focus:bg-zinc-800 focus:text-white"
                >
                  Follow-up Template
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => generateWithAi("meeting-request")}
                  className="text-zinc-300 focus:bg-zinc-800 focus:text-white"
                >
                  Meeting Request Template
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Button
            onClick={handleSend}
            disabled={!to || !subject || isSending}
            className="bg-[#00ff88] text-black hover:bg-[#00ff88]/90 font-semibold"
          >
            <Send className="w-4 h-4 mr-2" />
            {isSending ? "Sending..." : "Send"}
          </Button>
        </div>
      </div>
    </div>
  )
}
