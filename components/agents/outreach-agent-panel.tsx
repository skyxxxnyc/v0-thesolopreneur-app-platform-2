"use client"

import type React from "react"

import { useState } from "react"
import { Mail, MessageSquare, Copy, Sparkles, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface GeneratedMessage {
  id: string
  leadName: string
  company: string
  type: "email" | "linkedin"
  subject?: string
  body: string
  generatedAt: string
  status: "draft" | "sent" | "opened" | "replied"
}

const mockMessages: GeneratedMessage[] = [
  {
    id: "1",
    leadName: "John Smith",
    company: "Acme Plumbing Co",
    type: "email",
    subject: "Quick question about your online booking",
    body: `Hi John,

I noticed Acme Plumbing doesn't have online booking on your website yet. With 70% of customers now expecting to book services online, this could be costing you leads.

We recently helped a similar plumbing company in your area reduce phone call volume by 40% while increasing bookings by 25%.

Would you be open to a quick 15-minute call to see if we could do the same for you?`,
    generatedAt: "2 hours ago",
    status: "draft",
  },
  {
    id: "2",
    leadName: "Sarah Johnson",
    company: "City Dental Group",
    type: "linkedin",
    body: `Hi Sarah,

Saw City Dental Group is growing - congrats! I work with dental practices on reducing no-shows through automated reminders.

Most practices we work with see 40% fewer missed appointments within the first month.

Worth a quick chat?`,
    generatedAt: "5 hours ago",
    status: "sent",
  },
]

export function OutreachAgentPanel() {
  const [activeTab, setActiveTab] = useState<"messages" | "templates" | "generate">("messages")
  const [selectedLead, setSelectedLead] = useState("")
  const [generatedMessage, setGeneratedMessage] = useState("")

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-1 border-b border-zinc-800 -mx-4 px-4">
        {[
          { id: "messages", label: "Generated Messages" },
          { id: "templates", label: "Templates" },
          { id: "generate", label: "Generate New" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={cn(
              "px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-[1px]",
              activeTab === tab.id
                ? "text-[#ff6b6b] border-[#ff6b6b]"
                : "text-zinc-500 border-transparent hover:text-zinc-300",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Messages Tab */}
      {activeTab === "messages" && (
        <div className="space-y-3">
          {mockMessages.map((msg) => (
            <div key={msg.id} className="bg-zinc-800/50 border border-zinc-800 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-8 h-8 flex items-center justify-center",
                      msg.type === "email" ? "bg-[#ff6b6b]/10" : "bg-blue-500/10",
                    )}
                  >
                    {msg.type === "email" ? (
                      <Mail className="w-4 h-4 text-[#ff6b6b]" />
                    ) : (
                      <Linkedin className="w-4 h-4 text-blue-400" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-white text-sm">{msg.leadName}</h4>
                    <p className="text-xs text-zinc-500">{msg.company}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "px-2 py-1 text-xs font-medium capitalize",
                      msg.status === "draft" && "bg-zinc-700 text-zinc-400",
                      msg.status === "sent" && "bg-blue-500/20 text-blue-400",
                      msg.status === "opened" && "bg-yellow-500/20 text-yellow-400",
                      msg.status === "replied" && "bg-emerald-500/20 text-emerald-400",
                    )}
                  >
                    {msg.status}
                  </span>
                  <span className="text-xs text-zinc-600">{msg.generatedAt}</span>
                </div>
              </div>

              {msg.subject && <p className="text-sm font-medium text-zinc-300 mb-2">Subject: {msg.subject}</p>}
              <p className="text-sm text-zinc-400 whitespace-pre-line line-clamp-4">{msg.body}</p>

              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-zinc-800">
                <Button size="sm" variant="ghost" className="text-zinc-500 hover:text-white">
                  <Copy className="w-4 h-4 mr-1" /> Copy
                </Button>
                <Button size="sm" variant="ghost" className="text-zinc-500 hover:text-white">
                  <RefreshCw className="w-4 h-4 mr-1" /> Regenerate
                </Button>
                <Button size="sm" className="ml-auto bg-[#ff6b6b] text-white hover:bg-[#ff6b6b]/90">
                  Send
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === "templates" && (
        <div className="space-y-3">
          <p className="text-sm text-zinc-500">Message templates the agent uses as a base for personalization</p>

          {["Cold Outreach - Email", "Follow-up - LinkedIn", "Meeting Request", "Value Proposition"].map((template) => (
            <div key={template} className="bg-zinc-800/50 border border-zinc-800 p-4 flex items-center justify-between">
              <div>
                <h4 className="font-medium text-white text-sm">{template}</h4>
                <p className="text-xs text-zinc-500">Last edited 5 days ago</p>
              </div>
              <Button size="sm" variant="outline" className="border-zinc-700 text-zinc-400 bg-transparent">
                Edit
              </Button>
            </div>
          ))}

          <Button variant="outline" className="w-full border-zinc-700 border-dashed text-zinc-500 bg-transparent">
            + Add Template
          </Button>
        </div>
      )}

      {/* Generate Tab */}
      {activeTab === "generate" && (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-zinc-400 mb-2 block">Select Lead</label>
            <select
              value={selectedLead}
              onChange={(e) => setSelectedLead(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 text-white p-2 text-sm"
            >
              <option value="">Choose a lead...</option>
              <option value="1">John Smith - Acme Plumbing Co</option>
              <option value="2">Sarah Johnson - City Dental Group</option>
              <option value="3">Mike Wilson - Premier Real Estate</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-zinc-400 mb-2 block">Message Type</label>
            <div className="flex gap-2">
              <button className="flex-1 p-3 bg-[#ff6b6b]/10 border border-[#ff6b6b]/50 text-[#ff6b6b] text-sm font-medium flex items-center justify-center gap-2">
                <Mail className="w-4 h-4" /> Email
              </button>
              <button className="flex-1 p-3 bg-zinc-900 border border-zinc-800 text-zinc-500 text-sm font-medium flex items-center justify-center gap-2">
                <MessageSquare className="w-4 h-4" /> LinkedIn
              </button>
            </div>
          </div>

          <Button className="w-full bg-[#ff6b6b] text-white hover:bg-[#ff6b6b]/90" disabled={!selectedLead}>
            <Sparkles className="w-4 h-4 mr-2" /> Generate Personalized Message
          </Button>

          {generatedMessage && (
            <div className="bg-zinc-800/50 border border-zinc-800 p-4">
              <Textarea
                value={generatedMessage}
                onChange={(e) => setGeneratedMessage(e.target.value)}
                className="min-h-[200px] bg-transparent border-0 p-0 text-zinc-300 resize-none focus-visible:ring-0"
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Missing import
function Linkedin(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}
