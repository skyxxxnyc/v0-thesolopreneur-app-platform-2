"use client"

import { useState } from "react"
import { X, Calendar, Clock, MapPin, Video, Users, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface ScheduleMeetingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: {
    companyId?: string
    companyName?: string
    contactId?: string
    contactEmail?: string
  } | null
}

export function ScheduleMeetingModal({ open, onOpenChange, initialData }: ScheduleMeetingModalProps) {
  const [summary, setSummary] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [location, setLocation] = useState("")
  const [meetingType, setMeetingType] = useState<"video" | "in-person" | "phone">("video")
  const [attendees, setAttendees] = useState<string[]>(initialData?.contactEmail ? [initialData.contactEmail] : [])
  const [attendeeInput, setAttendeeInput] = useState("")
  const [isScheduling, setIsScheduling] = useState(false)

  const handleAddAttendee = () => {
    if (attendeeInput && !attendees.includes(attendeeInput)) {
      setAttendees([...attendees, attendeeInput])
      setAttendeeInput("")
    }
  }

  const handleRemoveAttendee = (email: string) => {
    setAttendees(attendees.filter((a) => a !== email))
  }

  const handleSchedule = async () => {
    setIsScheduling(true)

    try {
      const startDateTime = new Date(`${date}T${startTime}`).toISOString()
      const endDateTime = new Date(`${date}T${endTime}`).toISOString()

      const response = await fetch("/api/integrations/calendar/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          summary,
          description,
          startDateTime,
          endDateTime,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          attendees,
          companyId: initialData?.companyId,
          contactId: initialData?.contactId,
        }),
      })

      if (!response.ok) throw new Error("Failed to schedule meeting")

      onOpenChange(false)
      // Reset form
      setSummary("")
      setDescription("")
      setDate("")
      setStartTime("")
      setEndTime("")
      setLocation("")
      setAttendees([])
    } catch (error) {
      console.error("Error scheduling meeting:", error)
    } finally {
      setIsScheduling(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/80" onClick={() => onOpenChange(false)} />
      <div className="relative bg-zinc-900 border border-zinc-800 w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#00d4ff]" />
            <h2 className="text-lg font-semibold text-white">Schedule Meeting</h2>
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
        <div className="flex-1 overflow-auto p-4 space-y-4">
          {/* CRM Link */}
          {initialData?.companyName && (
            <div className="flex items-center gap-2 px-3 py-2 bg-zinc-800/50 border border-zinc-700 text-xs">
              <Building2 className="w-3.5 h-3.5 text-[#00ff88]" />
              <span className="text-zinc-300">Linked to: {initialData.companyName}</span>
            </div>
          )}

          {/* Title */}
          <div className="space-y-2">
            <Label className="text-zinc-300">Meeting Title</Label>
            <Input
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="e.g., Discovery Call - Acme Corp"
              className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-600"
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label className="text-zinc-300">Date</Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">Start</Label>
              <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">End</Label>
              <Input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
          </div>

          {/* Meeting Type */}
          <div className="space-y-2">
            <Label className="text-zinc-300">Meeting Type</Label>
            <div className="flex gap-2">
              {[
                { value: "video", label: "Video Call", icon: Video },
                { value: "in-person", label: "In Person", icon: MapPin },
                { value: "phone", label: "Phone", icon: Clock },
              ].map((type) => (
                <button
                  key={type.value}
                  onClick={() => setMeetingType(type.value as typeof meetingType)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 border transition-colors ${
                    meetingType === type.value
                      ? "bg-[#00d4ff]/10 border-[#00d4ff] text-[#00d4ff]"
                      : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600"
                  }`}
                >
                  <type.icon className="w-4 h-4" />
                  <span className="text-sm">{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Location (for in-person) */}
          {meetingType === "in-person" && (
            <div className="space-y-2">
              <Label className="text-zinc-300">Location</Label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter address or location"
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-600"
              />
            </div>
          )}

          {/* Attendees */}
          <div className="space-y-2">
            <Label className="text-zinc-300">Attendees</Label>
            <div className="flex gap-2">
              <Input
                type="email"
                value={attendeeInput}
                onChange={(e) => setAttendeeInput(e.target.value)}
                placeholder="email@example.com"
                className="flex-1 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-600"
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddAttendee())}
              />
              <Button
                variant="outline"
                onClick={handleAddAttendee}
                className="border-zinc-700 text-zinc-300 bg-transparent"
              >
                Add
              </Button>
            </div>
            {attendees.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {attendees.map((email) => (
                  <span
                    key={email}
                    className="inline-flex items-center gap-1.5 px-2 py-1 bg-zinc-800 border border-zinc-700 text-xs text-zinc-300"
                  >
                    <Users className="w-3 h-3" />
                    {email}
                    <button onClick={() => handleRemoveAttendee(email)} className="text-zinc-500 hover:text-white ml-1">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label className="text-zinc-300">Description (optional)</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Meeting agenda or notes..."
              rows={3}
              className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-600 resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 p-4 border-t border-zinc-800">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="border-zinc-700 text-zinc-300">
            Cancel
          </Button>
          <Button
            onClick={handleSchedule}
            disabled={!summary || !date || !startTime || !endTime || isScheduling}
            className="bg-[#00d4ff] text-black hover:bg-[#00d4ff]/90 font-semibold"
          >
            {isScheduling ? "Scheduling..." : "Schedule Meeting"}
          </Button>
        </div>
      </div>
    </div>
  )
}
