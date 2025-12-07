"use client"

import { Phone, Mail, MessageSquare, CheckSquare, ArrowUpRight, ArrowDownLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Activity } from "@/lib/types/crm"

interface ActivityTimelineProps {
  activities: Activity[]
  showEntity?: boolean
}

const typeIcons: Record<string, typeof Phone> = {
  call: Phone,
  email: Mail,
  meeting: MessageSquare,
  task: CheckSquare,
  note: MessageSquare,
}

const typeColors: Record<string, string> = {
  call: "bg-[#00ff88]/20 text-[#00ff88]",
  email: "bg-cyan-500/20 text-cyan-400",
  meeting: "bg-yellow-500/20 text-yellow-400",
  task: "bg-zinc-700 text-zinc-400",
  note: "bg-zinc-800 text-zinc-400",
}

export function ActivityTimeline({ activities, showEntity = false }: ActivityTimelineProps) {
  if (activities.length === 0) {
    return (
      <div className="text-center py-8">
        <Phone className="w-8 h-8 mx-auto mb-2 text-zinc-600" />
        <p className="text-sm text-zinc-500">No activities yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {activities.map((activity, idx) => {
        const Icon = typeIcons[activity.type] || MessageSquare
        const isLast = idx === activities.length - 1

        return (
          <div key={activity.id} className="flex gap-4">
            {/* Timeline indicator */}
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 flex items-center justify-center ${typeColors[activity.type]}`}>
                <Icon className="w-4 h-4" />
              </div>
              {!isLast && <div className="w-px flex-1 bg-zinc-800 mt-2" />}
            </div>

            {/* Content */}
            <div className="flex-1 pb-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium text-white capitalize">{activity.type}</span>
                {activity.direction && (
                  <div className="flex items-center gap-1">
                    {activity.direction === "outbound" ? (
                      <ArrowUpRight className="w-3 h-3 text-cyan-400" />
                    ) : (
                      <ArrowDownLeft className="w-3 h-3 text-[#00ff88]" />
                    )}
                    <span className="text-xs text-zinc-500">{activity.direction}</span>
                  </div>
                )}
                {activity.call_outcome && (
                  <Badge
                    className={`text-xs ${
                      activity.call_outcome === "connected"
                        ? "bg-[#00ff88]/20 text-[#00ff88]"
                        : "bg-zinc-800 text-zinc-400"
                    }`}
                  >
                    {activity.call_outcome}
                  </Badge>
                )}
              </div>

              {activity.subject && <p className="text-sm text-zinc-300 mt-1">{activity.subject}</p>}

              {activity.description && (
                <p className="text-sm text-zinc-500 mt-1 line-clamp-2">{activity.description}</p>
              )}

              <div className="flex items-center gap-3 mt-2 text-xs text-zinc-600">
                {activity.owner && <span>{activity.owner.full_name}</span>}
                <span>{new Date(activity.created_at).toLocaleString()}</span>
                {activity.duration_seconds && <span>{Math.round(activity.duration_seconds / 60)} min</span>}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
