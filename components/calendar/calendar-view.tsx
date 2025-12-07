"use client"

import { useState } from "react"
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  MapPin,
  Users,
  Video,
  Building2,
  ExternalLink,
  MoreVertical,
  Trash2,
  Edit,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ScheduleMeetingModal } from "./schedule-meeting-modal"

interface CalendarEvent {
  id: string
  summary: string
  description?: string
  start: { dateTime: string; timeZone: string }
  end: { dateTime: string; timeZone: string }
  attendees?: { email: string; responseStatus: string }[]
  htmlLink?: string
  location?: string
  conferenceLink?: string
  companyId?: string
  companyName?: string
  contactId?: string
  contactName?: string
}

// Mock events
const mockEvents: CalendarEvent[] = [
  {
    id: "1",
    summary: "Discovery Call - TechStartup.io",
    description: "Initial discovery call to understand their needs",
    start: { dateTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), timeZone: "UTC" },
    end: { dateTime: new Date(Date.now() + 2.5 * 60 * 60 * 1000).toISOString(), timeZone: "UTC" },
    attendees: [{ email: "sarah@techstartup.io", responseStatus: "accepted" }],
    conferenceLink: "https://meet.google.com/abc-defg-hij",
    companyId: "c1",
    companyName: "TechStartup.io",
    contactName: "Sarah Chen",
  },
  {
    id: "2",
    summary: "Proposal Review - Acme Agency",
    description: "Review and discuss the project proposal",
    start: { dateTime: new Date(Date.now() + 26 * 60 * 60 * 1000).toISOString(), timeZone: "UTC" },
    end: { dateTime: new Date(Date.now() + 27 * 60 * 60 * 1000).toISOString(), timeZone: "UTC" },
    attendees: [
      { email: "mike@acmeagency.com", responseStatus: "accepted" },
      { email: "jane@acmeagency.com", responseStatus: "tentative" },
    ],
    location: "123 Main St, Suite 400",
    companyId: "c2",
    companyName: "Acme Agency",
    contactName: "Mike Johnson",
  },
  {
    id: "3",
    summary: "Demo - GrowthCo",
    description: "Product demo for marketing automation features",
    start: { dateTime: new Date(Date.now() + 50 * 60 * 60 * 1000).toISOString(), timeZone: "UTC" },
    end: { dateTime: new Date(Date.now() + 51 * 60 * 60 * 1000).toISOString(), timeZone: "UTC" },
    attendees: [{ email: "lisa@growthco.com", responseStatus: "needsAction" }],
    conferenceLink: "https://zoom.us/j/123456789",
    companyId: "c3",
    companyName: "GrowthCo",
    contactName: "Lisa Park",
  },
]

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

export function CalendarView() {
  const [events] = useState<CalendarEvent[]>(mockEvents)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [view, setView] = useState<"month" | "week" | "day">("month")

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()

    const days: (Date | null)[] = []

    // Add empty slots for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }

    return days
  }

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.start.dateTime)
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      )
    })
  }

  const formatTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(newDate.getMonth() - 1)
      } else {
        newDate.setMonth(newDate.getMonth() + 1)
      }
      return newDate
    })
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const isSelected = (date: Date) => {
    if (!selectedDate) return false
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    )
  }

  const days = getDaysInMonth(currentDate)
  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : []

  // Get upcoming events for sidebar
  const upcomingEvents = events
    .filter((e) => new Date(e.start.dateTime) >= new Date())
    .sort((a, b) => new Date(a.start.dateTime).getTime() - new Date(b.start.dateTime).getTime())
    .slice(0, 5)

  return (
    <div className="h-[calc(100vh-3.5rem)] flex">
      {/* Main Calendar */}
      <div className="flex-1 flex flex-col p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Calendar className="w-6 h-6 text-[#00d4ff]" />
              Calendar
            </h1>
            <div className="flex items-center gap-1 bg-zinc-800 p-1">
              {(["month", "week", "day"] as const).map((v) => (
                <Button
                  key={v}
                  variant="ghost"
                  size="sm"
                  onClick={() => setView(v)}
                  className={view === v ? "bg-zinc-700 text-white" : "text-zinc-400"}
                >
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </Button>
              ))}
            </div>
          </div>
          <Button
            onClick={() => setShowScheduleModal(true)}
            className="bg-[#00d4ff] text-black hover:bg-[#00d4ff]/90 font-semibold"
          >
            <Plus className="w-4 h-4 mr-2" />
            Schedule Meeting
          </Button>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigateMonth("prev")}
              className="text-zinc-400 hover:text-white h-8 w-8"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <h2 className="text-lg font-semibold text-white min-w-[180px] text-center">
              {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigateMonth("next")}
              className="text-zinc-400 hover:text-white h-8 w-8"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setCurrentDate(new Date())
              setSelectedDate(new Date())
            }}
            className="border-zinc-700 text-zinc-300"
          >
            Today
          </Button>
        </div>

        {/* Calendar Grid */}
        <div className="flex-1 bg-zinc-900 border border-zinc-800">
          {/* Day Headers */}
          <div className="grid grid-cols-7 border-b border-zinc-800">
            {DAYS.map((day) => (
              <div key={day} className="p-2 text-center text-xs font-semibold text-zinc-500 uppercase">
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 flex-1">
            {days.map((date, index) => {
              if (!date) {
                return <div key={`empty-${index}`} className="border-r border-b border-zinc-800 bg-zinc-950/50" />
              }

              const dayEvents = getEventsForDate(date)
              const isCurrentDay = isToday(date)
              const isSelectedDay = isSelected(date)

              return (
                <button
                  key={date.toISOString()}
                  onClick={() => setSelectedDate(date)}
                  className={`min-h-[100px] p-2 border-r border-b border-zinc-800 text-left transition-colors hover:bg-zinc-800/50 ${
                    isSelectedDay ? "bg-[#00d4ff]/10 border-[#00d4ff]/30" : ""
                  }`}
                >
                  <span
                    className={`inline-flex items-center justify-center w-7 h-7 text-sm ${
                      isCurrentDay
                        ? "bg-[#00d4ff] text-black font-bold"
                        : isSelectedDay
                          ? "text-[#00d4ff] font-semibold"
                          : "text-zinc-400"
                    }`}
                  >
                    {date.getDate()}
                  </span>
                  <div className="mt-1 space-y-1">
                    {dayEvents.slice(0, 2).map((event) => (
                      <div
                        key={event.id}
                        className="text-xs px-1.5 py-0.5 bg-[#00d4ff]/20 text-[#00d4ff] truncate border-l-2 border-[#00d4ff]"
                      >
                        {formatTime(event.start.dateTime)} {event.summary}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-zinc-500 px-1.5">+{dayEvents.length - 2} more</div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Right Sidebar - Events */}
      <aside className="w-96 border-l border-zinc-800 bg-zinc-900 flex flex-col">
        {/* Selected Date Events */}
        <div className="p-4 border-b border-zinc-800">
          <h3 className="font-semibold text-white mb-4">
            {selectedDate?.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
          </h3>
          {selectedDateEvents.length > 0 ? (
            <div className="space-y-3">
              {selectedDateEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-500">No events scheduled</p>
          )}
        </div>

        {/* Upcoming Events */}
        <div className="flex-1 overflow-auto p-4">
          <h3 className="font-semibold text-white mb-4">Upcoming</h3>
          <div className="space-y-3">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} compact />
            ))}
          </div>
        </div>
      </aside>

      <ScheduleMeetingModal open={showScheduleModal} onOpenChange={setShowScheduleModal} />
    </div>
  )
}

function EventCard({ event, compact = false }: { event: CalendarEvent; compact?: boolean }) {
  const formatTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const formatDate = (dateTime: string) => {
    return new Date(dateTime).toLocaleDateString([], { month: "short", day: "numeric" })
  }

  return (
    <div className="bg-zinc-800/50 border border-zinc-800 p-3 hover:border-zinc-700 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-white text-sm truncate">{event.summary}</h4>
          <div className="flex items-center gap-2 mt-1 text-xs text-zinc-500">
            <Clock className="w-3 h-3" />
            {compact && <span>{formatDate(event.start.dateTime)}</span>}
            <span>
              {formatTime(event.start.dateTime)} - {formatTime(event.end.dateTime)}
            </span>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-500 hover:text-white">
              <MoreVertical className="w-3.5 h-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-zinc-900 border-zinc-800">
            <DropdownMenuItem className="text-zinc-300 focus:bg-zinc-800 focus:text-white">
              <Edit className="w-3.5 h-3.5 mr-2" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-400 focus:bg-zinc-800 focus:text-red-400">
              <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {!compact && (
        <>
          {event.description && <p className="text-xs text-zinc-500 mt-2 line-clamp-2">{event.description}</p>}

          <div className="mt-3 space-y-1.5">
            {event.location && (
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <MapPin className="w-3 h-3" />
                <span className="truncate">{event.location}</span>
              </div>
            )}
            {event.conferenceLink && (
              <a
                href={event.conferenceLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-[#00d4ff] hover:underline"
              >
                <Video className="w-3 h-3" />
                <span>Join video call</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            {event.attendees && event.attendees.length > 0 && (
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <Users className="w-3 h-3" />
                <span>
                  {event.attendees.length} attendee{event.attendees.length > 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>
        </>
      )}

      {/* CRM Link */}
      {event.companyName && (
        <div className="flex items-center gap-2 mt-3 pt-2 border-t border-zinc-700">
          <Building2 className="w-3 h-3 text-[#00ff88]" />
          <span className="text-xs text-zinc-400">{event.companyName}</span>
          {event.contactName && (
            <>
              <span className="text-zinc-600">•</span>
              <span className="text-xs text-zinc-400">{event.contactName}</span>
            </>
          )}
        </div>
      )}
    </div>
  )
}
