"use client"

import { CheckCircle, XCircle, Phone, Mail, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"

interface QualificationStatusProps {
  companyId: string
  hasQualifyingActivity: boolean
  qualifyingActivity?: {
    type: string
    subject: string | null
    created_at: string
  } | null
  onLogActivity?: () => void
}

export function QualificationStatus({
  companyId,
  hasQualifyingActivity,
  qualifyingActivity,
  onLogActivity,
}: QualificationStatusProps) {
  if (hasQualifyingActivity && qualifyingActivity) {
    return (
      <div className="bg-[#00ff88]/10 border border-[#00ff88]/30 p-4">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle className="w-5 h-5 text-[#00ff88]" />
          <span className="text-sm font-medium text-[#00ff88]">Qualified for Deal Creation</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-zinc-400">
          {qualifyingActivity.type === "call" && <Phone className="w-4 h-4" />}
          {qualifyingActivity.type === "email" && <Mail className="w-4 h-4" />}
          {qualifyingActivity.type === "meeting" && <MessageSquare className="w-4 h-4" />}
          <span>
            {qualifyingActivity.type} - {qualifyingActivity.subject || "No subject"}
          </span>
          <span className="text-zinc-600">({new Date(qualifyingActivity.created_at).toLocaleDateString()})</span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 p-4">
      <div className="flex items-center gap-2 mb-2">
        <XCircle className="w-5 h-5 text-zinc-500" />
        <span className="text-sm font-medium text-zinc-400">Not Yet Qualified</span>
      </div>
      <p className="text-xs text-zinc-500 mb-3">
        Log a call, email, or meeting to qualify this company for deal creation.
      </p>
      {onLogActivity && (
        <Button size="sm" onClick={onLogActivity} className="bg-cyan-500 text-black hover:bg-cyan-500/90 h-8">
          Log Activity to Qualify
        </Button>
      )}
    </div>
  )
}
