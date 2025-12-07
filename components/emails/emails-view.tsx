"use client"

import { useState } from "react"
import {
  Mail,
  Send,
  Inbox,
  Archive,
  Trash2,
  Star,
  Search,
  RefreshCw,
  Plus,
  MoreVertical,
  Paperclip,
  Building2,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ComposeEmailModal } from "./compose-email-modal"

interface Email {
  id: string
  from: string
  to: string
  subject: string
  preview: string
  body: string
  timestamp: string
  read: boolean
  starred: boolean
  hasAttachment: boolean
  labels: string[]
  threadId: string
  companyId?: string
  companyName?: string
  contactId?: string
  contactName?: string
}

// Mock emails
const mockEmails: Email[] = [
  {
    id: "1",
    from: "sarah@techstartup.io",
    to: "me@thesolopreneur.app",
    subject: "Re: Partnership Opportunity",
    preview: "Thanks for reaching out! I'd love to schedule a call to discuss...",
    body: "Thanks for reaching out! I'd love to schedule a call to discuss the partnership opportunity. How does next Tuesday at 2pm work for you?",
    timestamp: "2024-01-25T14:30:00Z",
    read: false,
    starred: true,
    hasAttachment: false,
    labels: ["important"],
    threadId: "t1",
    companyId: "c1",
    companyName: "TechStartup.io",
    contactId: "ct1",
    contactName: "Sarah Chen",
  },
  {
    id: "2",
    from: "mike@acmeagency.com",
    to: "me@thesolopreneur.app",
    subject: "Project Proposal Review",
    preview: "I've reviewed the proposal and have a few questions...",
    body: "I've reviewed the proposal and have a few questions about the timeline and deliverables. Can we hop on a quick call?",
    timestamp: "2024-01-25T10:15:00Z",
    read: true,
    starred: false,
    hasAttachment: true,
    labels: [],
    threadId: "t2",
    companyId: "c2",
    companyName: "Acme Agency",
    contactId: "ct2",
    contactName: "Mike Johnson",
  },
  {
    id: "3",
    from: "me@thesolopreneur.app",
    to: "lisa@growthco.com",
    subject: "Follow-up: Marketing Automation Demo",
    preview: "Hi Lisa, Following up on our conversation about...",
    body: "Hi Lisa, Following up on our conversation about marketing automation. I wanted to share some additional resources that might be helpful.",
    timestamp: "2024-01-24T16:45:00Z",
    read: true,
    starred: false,
    hasAttachment: false,
    labels: ["sent"],
    threadId: "t3",
    companyId: "c3",
    companyName: "GrowthCo",
    contactId: "ct3",
    contactName: "Lisa Park",
  },
]

export function EmailsView() {
  const [emails] = useState<Email[]>(mockEmails)
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentTab, setCurrentTab] = useState("inbox")
  const [showCompose, setShowCompose] = useState(false)
  const [composeData, setComposeData] = useState<{
    to?: string
    subject?: string
    companyId?: string
    contactId?: string
  } | null>(null)

  const filteredEmails = emails.filter((email) => {
    const matchesSearch =
      email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.from.toLowerCase().includes(searchQuery.toLowerCase())

    if (currentTab === "inbox") return matchesSearch && !email.labels.includes("sent")
    if (currentTab === "sent") return matchesSearch && email.labels.includes("sent")
    if (currentTab === "starred") return matchesSearch && email.starred
    return matchesSearch
  })

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const isToday = date.toDateString() === now.toDateString()
    if (isToday) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
    return date.toLocaleDateString([], { month: "short", day: "numeric" })
  }

  const handleReply = (email: Email) => {
    setComposeData({
      to: email.from,
      subject: `Re: ${email.subject}`,
      companyId: email.companyId,
      contactId: email.contactId,
    })
    setShowCompose(true)
  }

  return (
    <div className="h-[calc(100vh-3.5rem)] flex">
      {/* Email List */}
      <div className="w-96 border-r border-zinc-800 flex flex-col bg-zinc-900">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg font-bold text-white flex items-center gap-2">
              <Mail className="w-5 h-5 text-[#00ff88]" />
              Email
            </h1>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white">
                <RefreshCw className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                onClick={() => {
                  setComposeData(null)
                  setShowCompose(true)
                }}
                className="h-8 w-8 bg-[#00ff88] text-black hover:bg-[#00ff88]/90"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <Input
              placeholder="Search emails..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-600 h-9"
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="flex-1 flex flex-col">
          <TabsList className="w-full bg-transparent border-b border-zinc-800 rounded-none h-auto p-0">
            <TabsTrigger
              value="inbox"
              className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-[#00ff88] data-[state=active]:bg-transparent data-[state=active]:text-[#00ff88] py-2 text-xs"
            >
              <Inbox className="w-3.5 h-3.5 mr-1.5" /> Inbox
            </TabsTrigger>
            <TabsTrigger
              value="sent"
              className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-[#00ff88] data-[state=active]:bg-transparent data-[state=active]:text-[#00ff88] py-2 text-xs"
            >
              <Send className="w-3.5 h-3.5 mr-1.5" /> Sent
            </TabsTrigger>
            <TabsTrigger
              value="starred"
              className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-[#00ff88] data-[state=active]:bg-transparent data-[state=active]:text-[#00ff88] py-2 text-xs"
            >
              <Star className="w-3.5 h-3.5 mr-1.5" /> Starred
            </TabsTrigger>
          </TabsList>

          <TabsContent value={currentTab} className="flex-1 overflow-auto mt-0">
            <div className="divide-y divide-zinc-800">
              {filteredEmails.map((email) => (
                <button
                  key={email.id}
                  onClick={() => setSelectedEmail(email)}
                  className={`w-full p-4 text-left transition-colors ${
                    selectedEmail?.id === email.id
                      ? "bg-[#00ff88]/10 border-l-2 border-[#00ff88]"
                      : "hover:bg-zinc-800/50"
                  } ${!email.read ? "bg-zinc-800/30" : ""}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {email.starred && <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />}
                        <span
                          className={`text-sm truncate ${!email.read ? "font-semibold text-white" : "text-zinc-300"}`}
                        >
                          {currentTab === "sent" ? email.to : email.from.split("@")[0]}
                        </span>
                        <span className="text-xs text-zinc-600 ml-auto shrink-0">{formatTime(email.timestamp)}</span>
                      </div>
                      <p className={`text-sm truncate ${!email.read ? "text-white" : "text-zinc-400"}`}>
                        {email.subject}
                      </p>
                      <p className="text-xs text-zinc-600 truncate mt-0.5">{email.preview}</p>
                      {/* CRM Link */}
                      {email.companyName && (
                        <div className="flex items-center gap-1.5 mt-2">
                          <Building2 className="w-3 h-3 text-zinc-600" />
                          <span className="text-xs text-zinc-500">{email.companyName}</span>
                        </div>
                      )}
                    </div>
                    {email.hasAttachment && <Paperclip className="w-3.5 h-3.5 text-zinc-600 shrink-0" />}
                  </div>
                </button>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Email Detail */}
      <div className="flex-1 flex flex-col bg-zinc-950">
        {selectedEmail ? (
          <>
            {/* Email Header */}
            <div className="p-6 border-b border-zinc-800">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-xl font-bold text-white">{selectedEmail.subject}</h2>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-yellow-500">
                    <Star className={`w-4 h-4 ${selectedEmail.starred ? "fill-yellow-500 text-yellow-500" : ""}`} />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white">
                    <Archive className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-red-400">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#00d4ff]/20 flex items-center justify-center text-[#00d4ff] font-semibold">
                  {selectedEmail.from.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">{selectedEmail.from}</span>
                    {selectedEmail.contactName && (
                      <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5">
                        <User className="w-3 h-3 inline mr-1" />
                        {selectedEmail.contactName}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <span>to {selectedEmail.to}</span>
                    <span>•</span>
                    <span>{new Date(selectedEmail.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* CRM Context */}
              {selectedEmail.companyName && (
                <div className="mt-4 p-3 bg-zinc-800/50 border border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Building2 className="w-4 h-4 text-[#00ff88]" />
                    <div>
                      <p className="text-sm font-medium text-white">{selectedEmail.companyName}</p>
                      <p className="text-xs text-zinc-500">Linked to CRM record</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-zinc-700 text-zinc-300 h-8 text-xs bg-transparent"
                  >
                    View in CRM
                  </Button>
                </div>
              )}
            </div>

            {/* Email Body */}
            <div className="flex-1 overflow-auto p-6">
              <div className="prose prose-invert max-w-none">
                <p className="text-zinc-300 whitespace-pre-wrap">{selectedEmail.body}</p>
              </div>
            </div>

            {/* Reply Bar */}
            <div className="p-4 border-t border-zinc-800 bg-zinc-900">
              <div className="flex gap-2">
                <Button
                  onClick={() => handleReply(selectedEmail)}
                  className="bg-[#00ff88] text-black hover:bg-[#00ff88]/90 font-semibold"
                >
                  <Send className="w-4 h-4 mr-2" /> Reply
                </Button>
                <Button variant="outline" className="border-zinc-700 text-zinc-300 bg-transparent">
                  Forward
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Mail className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
              <p className="text-zinc-500">Select an email to read</p>
            </div>
          </div>
        )}
      </div>

      <ComposeEmailModal open={showCompose} onOpenChange={setShowCompose} initialData={composeData} />
    </div>
  )
}
