"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createBrowserClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface AddDealModalProps {
  tenantId: string
  companies: { id: string; name: string }[]
  contacts: { id: string; first_name: string; last_name: string | null; company_id: string | null }[]
  onClose: () => void
}

interface QualifyingActivity {
  id: string
  type: string
  subject: string | null
  created_at: string
}

export function AddDealModal({ tenantId, companies, contacts, onClose }: AddDealModalProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [qualifyingActivities, setQualifyingActivities] = useState<QualifyingActivity[]>([])
  const [canCreate, setCanCreate] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    company_id: "",
    contact_id: "",
    amount: "",
    currency: "USD",
    stage: "qualification",
    probability: "10",
    expected_close_date: "",
    qualifying_activity_id: "",
  })

  // Check for qualifying activities when company changes
  useEffect(() => {
    async function checkQualification() {
      if (!formData.company_id) {
        setQualifyingActivities([])
        setCanCreate(false)
        return
      }

      const supabase = createBrowserClient()
      const { data } = await supabase
        .from("activities")
        .select("id, type, subject, created_at")
        .eq("company_id", formData.company_id)
        .in("type", ["call", "email", "meeting"])
        .order("created_at", { ascending: false })
        .limit(10)

      setQualifyingActivities(data || [])
      setCanCreate((data?.length || 0) > 0)

      // Auto-select most recent activity
      if (data && data.length > 0) {
        setFormData((prev) => ({ ...prev, qualifying_activity_id: data[0].id }))
      }
    }
    checkQualification()
  }, [formData.company_id])

  // Filter contacts by selected company
  const filteredContacts = formData.company_id ? contacts.filter((c) => c.company_id === formData.company_id) : contacts

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canCreate) return

    setLoading(true)

    const supabase = createBrowserClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const { error } = await supabase.from("deals").insert({
      tenant_id: tenantId,
      name: formData.name,
      description: formData.description || null,
      company_id: formData.company_id || null,
      contact_id: formData.contact_id || null,
      amount: Number.parseFloat(formData.amount),
      currency: formData.currency,
      stage: formData.stage,
      probability: Number.parseInt(formData.probability),
      expected_close_date: formData.expected_close_date || null,
      qualifying_activity_id: formData.qualifying_activity_id || null,
      created_by: user?.id,
      owner_id: user?.id,
    })

    setLoading(false)

    if (!error) {
      router.refresh()
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 p-6 max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">New Deal</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-zinc-500 hover:text-white">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-zinc-400">
              Deal Name *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="bg-zinc-900 border-zinc-800 text-white"
              placeholder="Website Redesign Project"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company" className="text-zinc-400">
              Company *
            </Label>
            <Select
              value={formData.company_id}
              onValueChange={(v) => setFormData({ ...formData, company_id: v, contact_id: "" })}
            >
              <SelectTrigger className="bg-zinc-900 border-zinc-800 text-white">
                <SelectValue placeholder="Select company" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800">
                {companies.map((company) => (
                  <SelectItem key={company.id} value={company.id} className="text-zinc-300 focus:bg-zinc-800">
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Qualification Gate */}
          {formData.company_id && !canCreate && (
            <div className="bg-red-500/10 border border-red-500/30 p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-400">No qualifying activity found</p>
                <p className="text-xs text-zinc-500 mt-1">
                  You must log at least one call, email, or meeting with this company before creating a deal.
                </p>
              </div>
            </div>
          )}

          {formData.company_id && canCreate && (
            <div className="space-y-2">
              <Label className="text-zinc-400">Qualifying Activity *</Label>
              <Select
                value={formData.qualifying_activity_id}
                onValueChange={(v) => setFormData({ ...formData, qualifying_activity_id: v })}
              >
                <SelectTrigger className="bg-zinc-900 border-zinc-800 text-white">
                  <SelectValue placeholder="Select activity" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800">
                  {qualifyingActivities.map((activity) => (
                    <SelectItem key={activity.id} value={activity.id} className="text-zinc-300 focus:bg-zinc-800">
                      {activity.type} - {activity.subject || "No subject"} (
                      {new Date(activity.created_at).toLocaleDateString()})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {filteredContacts.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="contact" className="text-zinc-400">
                Primary Contact
              </Label>
              <Select value={formData.contact_id} onValueChange={(v) => setFormData({ ...formData, contact_id: v })}>
                <SelectTrigger className="bg-zinc-900 border-zinc-800 text-white">
                  <SelectValue placeholder="Select contact" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800">
                  {filteredContacts.map((contact) => (
                    <SelectItem key={contact.id} value={contact.id} className="text-zinc-300 focus:bg-zinc-800">
                      {contact.first_name} {contact.last_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="amount" className="text-zinc-400">
                Amount *
              </Label>
              <Input
                id="amount"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
                className="bg-zinc-900 border-zinc-800 text-white"
                placeholder="10000"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-400">Currency</Label>
              <Select value={formData.currency} onValueChange={(v) => setFormData({ ...formData, currency: v })}>
                <SelectTrigger className="bg-zinc-900 border-zinc-800 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800">
                  <SelectItem value="USD" className="text-zinc-300">
                    USD
                  </SelectItem>
                  <SelectItem value="EUR" className="text-zinc-300">
                    EUR
                  </SelectItem>
                  <SelectItem value="GBP" className="text-zinc-300">
                    GBP
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-zinc-400">Stage</Label>
              <Select value={formData.stage} onValueChange={(v) => setFormData({ ...formData, stage: v })}>
                <SelectTrigger className="bg-zinc-900 border-zinc-800 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800">
                  <SelectItem value="qualification" className="text-zinc-300">
                    Qualification
                  </SelectItem>
                  <SelectItem value="discovery" className="text-zinc-300">
                    Discovery
                  </SelectItem>
                  <SelectItem value="proposal" className="text-zinc-300">
                    Proposal
                  </SelectItem>
                  <SelectItem value="negotiation" className="text-zinc-300">
                    Negotiation
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="probability" className="text-zinc-400">
                Probability %
              </Label>
              <Input
                id="probability"
                type="number"
                min="0"
                max="100"
                value={formData.probability}
                onChange={(e) => setFormData({ ...formData, probability: e.target.value })}
                className="bg-zinc-900 border-zinc-800 text-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="close_date" className="text-zinc-400">
              Expected Close Date
            </Label>
            <Input
              id="close_date"
              type="date"
              value={formData.expected_close_date}
              onChange={(e) => setFormData({ ...formData, expected_close_date: e.target.value })}
              className="bg-zinc-900 border-zinc-800 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-zinc-400">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-zinc-900 border-zinc-800 text-white min-h-20"
              placeholder="Deal details..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={onClose} className="text-zinc-400">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !canCreate}
              className="bg-[#00ff88] text-black hover:bg-[#00ff88]/90 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Deal"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
