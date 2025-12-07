"use client"

import type React from "react"

import { useState } from "react"
import { X, Phone, Mail, MessageSquare, CheckSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createBrowserClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface LogActivityModalProps {
  tenantId: string
  companyId?: string
  contactId?: string
  leadId?: string
  projectId?: string
  dealId?: string
  onClose: () => void
  onSuccess?: () => void
}

const activityTypes = [
  { value: "call", label: "Call", icon: Phone, color: "text-[#00ff88]" },
  { value: "email", label: "Email", icon: Mail, color: "text-cyan-400" },
  { value: "meeting", label: "Meeting", icon: MessageSquare, color: "text-yellow-400" },
  { value: "task", label: "Task", icon: CheckSquare, color: "text-zinc-400" },
]

const callOutcomes = [
  { value: "connected", label: "Connected" },
  { value: "voicemail", label: "Voicemail" },
  { value: "no_answer", label: "No Answer" },
  { value: "busy", label: "Busy" },
  { value: "wrong_number", label: "Wrong Number" },
]

export function LogActivityModal({
  tenantId,
  companyId,
  contactId,
  leadId,
  projectId,
  dealId,
  onClose,
  onSuccess,
}: LogActivityModalProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    type: "call",
    direction: "outbound",
    subject: "",
    description: "",
    duration_minutes: "",
    call_outcome: "",
    meeting_type: "video",
    meeting_location: "",
    scheduled_at: "",
    completed: true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const supabase = createBrowserClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const entityType = dealId ? "deal" : projectId ? "project" : leadId ? "lead" : contactId ? "contact" : "company"
    const entityId = dealId || projectId || leadId || contactId || companyId

    const { error } = await supabase.from("activities").insert({
      tenant_id: tenantId,
      entity_type: entityType,
      entity_id: entityId,
      company_id: companyId || null,
      contact_id: contactId || null,
      type: formData.type,
      direction: formData.direction,
      subject: formData.subject || null,
      description: formData.description || null,
      duration_seconds: formData.duration_minutes ? Number.parseInt(formData.duration_minutes) * 60 : null,
      call_outcome: formData.type === "call" ? formData.call_outcome : null,
      meeting_type: formData.type === "meeting" ? formData.meeting_type : null,
      meeting_location: formData.type === "meeting" ? formData.meeting_location : null,
      scheduled_at: formData.scheduled_at || null,
      created_by: user?.id,
      owner_id: user?.id,
    })

    setLoading(false)

    if (!error) {
      router.refresh()
      onSuccess?.()
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Log Activity</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-zinc-500 hover:text-white">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Activity Type Selector */}
          <div className="space-y-2">
            <Label className="text-zinc-400">Activity Type</Label>
            <div className="grid grid-cols-4 gap-2">
              {activityTypes.map((type) => {
                const Icon = type.icon
                const isSelected = formData.type === type.value
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, type: type.value })}
                    className={`p-3 border flex flex-col items-center gap-2 transition-colors ${
                      isSelected ? "bg-zinc-800 border-zinc-600" : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isSelected ? type.color : "text-zinc-500"}`} />
                    <span className={`text-xs ${isSelected ? "text-white" : "text-zinc-500"}`}>{type.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Direction */}
          <div className="space-y-2">
            <Label className="text-zinc-400">Direction</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={formData.direction === "outbound" ? "default" : "outline"}
                onClick={() => setFormData({ ...formData, direction: "outbound" })}
                className={
                  formData.direction === "outbound"
                    ? "bg-zinc-700"
                    : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white"
                }
              >
                Outbound
              </Button>
              <Button
                type="button"
                variant={formData.direction === "inbound" ? "default" : "outline"}
                onClick={() => setFormData({ ...formData, direction: "inbound" })}
                className={
                  formData.direction === "inbound"
                    ? "bg-zinc-700"
                    : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white"
                }
              >
                Inbound
              </Button>
            </div>
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="subject" className="text-zinc-400">
              Subject
            </Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="bg-zinc-900 border-zinc-800 text-white"
              placeholder="Brief summary..."
            />
          </div>

          {/* Call-specific fields */}
          {formData.type === "call" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-zinc-400">Outcome</Label>
                  <Select
                    value={formData.call_outcome}
                    onValueChange={(v) => setFormData({ ...formData, call_outcome: v })}
                  >
                    <SelectTrigger className="bg-zinc-900 border-zinc-800 text-white">
                      <SelectValue placeholder="Select outcome" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800">
                      {callOutcomes.map((outcome) => (
                        <SelectItem
                          key={outcome.value}
                          value={outcome.value}
                          className="text-zinc-300 focus:bg-zinc-800"
                        >
                          {outcome.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration" className="text-zinc-400">
                    Duration (min)
                  </Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration_minutes}
                    onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
                    className="bg-zinc-900 border-zinc-800 text-white"
                    placeholder="15"
                  />
                </div>
              </div>
            </>
          )}

          {/* Meeting-specific fields */}
          {formData.type === "meeting" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-zinc-400">Meeting Type</Label>
                  <Select
                    value={formData.meeting_type}
                    onValueChange={(v) => setFormData({ ...formData, meeting_type: v })}
                  >
                    <SelectTrigger className="bg-zinc-900 border-zinc-800 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800">
                      <SelectItem value="video" className="text-zinc-300">
                        Video
                      </SelectItem>
                      <SelectItem value="phone" className="text-zinc-300">
                        Phone
                      </SelectItem>
                      <SelectItem value="in_person" className="text-zinc-300">
                        In Person
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration" className="text-zinc-400">
                    Duration (min)
                  </Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration_minutes}
                    onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
                    className="bg-zinc-900 border-zinc-800 text-white"
                    placeholder="30"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location" className="text-zinc-400">
                  Location / Link
                </Label>
                <Input
                  id="location"
                  value={formData.meeting_location}
                  onChange={(e) => setFormData({ ...formData, meeting_location: e.target.value })}
                  className="bg-zinc-900 border-zinc-800 text-white"
                  placeholder="Zoom link or address..."
                />
              </div>
            </>
          )}

          {/* Scheduled Time */}
          <div className="space-y-2">
            <Label htmlFor="scheduled" className="text-zinc-400">
              Date & Time
            </Label>
            <Input
              id="scheduled"
              type="datetime-local"
              value={formData.scheduled_at}
              onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value })}
              className="bg-zinc-900 border-zinc-800 text-white"
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-zinc-400">
              Notes
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-zinc-900 border-zinc-800 text-white min-h-24"
              placeholder="Activity notes and details..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={onClose} className="text-zinc-400">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-[#00ff88] text-black hover:bg-[#00ff88]/90">
              {loading ? "Saving..." : "Log Activity"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
