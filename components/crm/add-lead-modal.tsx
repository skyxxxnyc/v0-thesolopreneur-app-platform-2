"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { X, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createBrowserClient } from "@/lib/supabase/client"

interface AddLeadModalProps {
  tenantId: string
  onClose: () => void
}

export function AddLeadModal({ tenantId, onClose }: AddLeadModalProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    company_name: "",
    job_title: "",
    website: "",
    source: "",
    source_detail: "",
    need: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createBrowserClient()

    const { error: insertError } = await supabase.from("leads").insert({
      tenant_id: tenantId,
      ...formData,
      status: "new",
    })

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
      return
    }

    router.refresh()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 p-6 max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-500/20 flex items-center justify-center">
              <Target className="w-5 h-5 text-yellow-400" />
            </div>
            <h2 className="text-lg font-bold text-white">Add Lead</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-zinc-500 hover:text-white">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3">{error}</div>}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="first_name" className="text-zinc-400">
                First Name
              </Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                className="bg-zinc-900 border-zinc-800 text-white mt-1"
              />
            </div>

            <div>
              <Label htmlFor="last_name" className="text-zinc-400">
                Last Name
              </Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                className="bg-zinc-900 border-zinc-800 text-white mt-1"
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-zinc-400">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-zinc-900 border-zinc-800 text-white mt-1"
              />
            </div>

            <div>
              <Label htmlFor="phone" className="text-zinc-400">
                Phone
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="bg-zinc-900 border-zinc-800 text-white mt-1"
              />
            </div>

            <div>
              <Label htmlFor="company_name" className="text-zinc-400">
                Company Name
              </Label>
              <Input
                id="company_name"
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                className="bg-zinc-900 border-zinc-800 text-white mt-1"
              />
            </div>

            <div>
              <Label htmlFor="job_title" className="text-zinc-400">
                Job Title
              </Label>
              <Input
                id="job_title"
                value={formData.job_title}
                onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                className="bg-zinc-900 border-zinc-800 text-white mt-1"
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="website" className="text-zinc-400">
                Website
              </Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="bg-zinc-900 border-zinc-800 text-white mt-1"
                placeholder="https://..."
              />
            </div>

            <div>
              <Label htmlFor="source" className="text-zinc-400">
                Source
              </Label>
              <Select value={formData.source} onValueChange={(v) => setFormData({ ...formData, source: v })}>
                <SelectTrigger className="bg-zinc-900 border-zinc-800 text-white mt-1">
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800">
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="referral">Referral</SelectItem>
                  <SelectItem value="cold_outreach">Cold Outreach</SelectItem>
                  <SelectItem value="sdr_agent">SDR Agent</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="source_detail" className="text-zinc-400">
                Source Detail
              </Label>
              <Input
                id="source_detail"
                value={formData.source_detail}
                onChange={(e) => setFormData({ ...formData, source_detail: e.target.value })}
                className="bg-zinc-900 border-zinc-800 text-white mt-1"
                placeholder="Campaign name, referrer, etc."
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="need" className="text-zinc-400">
                Initial Need / Notes
              </Label>
              <Textarea
                id="need"
                value={formData.need}
                onChange={(e) => setFormData({ ...formData, need: e.target.value })}
                className="bg-zinc-900 border-zinc-800 text-white mt-1 min-h-[80px]"
                placeholder="What are they looking for?"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
            <Button type="button" variant="ghost" onClick={onClose} className="text-zinc-400">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-[#00ff88] text-black hover:bg-[#00ff88]/90 font-semibold"
            >
              {loading ? "Adding..." : "Add Lead"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
