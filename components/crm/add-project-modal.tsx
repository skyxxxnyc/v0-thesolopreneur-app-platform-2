"use client"

import type React from "react"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createBrowserClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import type { Project } from "@/lib/types/crm"

interface AddProjectModalProps {
  tenantId: string
  companies: { id: string; name: string }[]
  onClose: () => void
}

export function AddProjectModal({ tenantId, companies, onClose }: AddProjectModalProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    company_id: "",
    status: "planning",
    priority: "medium",
    start_date: "",
    due_date: "",
    budget_amount: "",
    budget_currency: "USD",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const supabase = createBrowserClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // @ts-expect-error - Supabase insert returns unknown in strict mode
    const { error } = await supabase.from("projects").insert({
      tenant_id: tenantId,
      name: formData.name,
      description: formData.description || null,
      company_id: formData.company_id || null,
      status: formData.status,
      priority: formData.priority,
      start_date: formData.start_date || null,
      due_date: formData.due_date || null,
      budget_amount: formData.budget_amount ? Number.parseFloat(formData.budget_amount) : null,
      budget_currency: formData.budget_currency,
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
      <div className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">New Project</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-zinc-500 hover:text-white">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-zinc-400">
              Project Name *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="bg-zinc-900 border-zinc-800 text-white"
              placeholder="Website Redesign"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company" className="text-zinc-400">
              Company
            </Label>
            <Select value={formData.company_id} onValueChange={(v) => setFormData({ ...formData, company_id: v })}>
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

          <div className="space-y-2">
            <Label htmlFor="description" className="text-zinc-400">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-zinc-900 border-zinc-800 text-white min-h-20"
              placeholder="Project details..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-zinc-400">Status</Label>
              <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                <SelectTrigger className="bg-zinc-900 border-zinc-800 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800">
                  <SelectItem value="planning" className="text-zinc-300">
                    Planning
                  </SelectItem>
                  <SelectItem value="in_progress" className="text-zinc-300">
                    In Progress
                  </SelectItem>
                  <SelectItem value="on_hold" className="text-zinc-300">
                    On Hold
                  </SelectItem>
                  <SelectItem value="completed" className="text-zinc-300">
                    Completed
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-zinc-400">Priority</Label>
              <Select value={formData.priority} onValueChange={(v) => setFormData({ ...formData, priority: v })}>
                <SelectTrigger className="bg-zinc-900 border-zinc-800 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800">
                  <SelectItem value="low" className="text-zinc-300">
                    Low
                  </SelectItem>
                  <SelectItem value="medium" className="text-zinc-300">
                    Medium
                  </SelectItem>
                  <SelectItem value="high" className="text-zinc-300">
                    High
                  </SelectItem>
                  <SelectItem value="urgent" className="text-zinc-300">
                    Urgent
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date" className="text-zinc-400">
                Start Date
              </Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="bg-zinc-900 border-zinc-800 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="due_date" className="text-zinc-400">
                Due Date
              </Label>
              <Input
                id="due_date"
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                className="bg-zinc-900 border-zinc-800 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="budget" className="text-zinc-400">
                Budget
              </Label>
              <Input
                id="budget"
                type="number"
                value={formData.budget_amount}
                onChange={(e) => setFormData({ ...formData, budget_amount: e.target.value })}
                className="bg-zinc-900 border-zinc-800 text-white"
                placeholder="10000"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-400">Currency</Label>
              <Select
                value={formData.budget_currency}
                onValueChange={(v) => setFormData({ ...formData, budget_currency: v })}
              >
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

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={onClose} className="text-zinc-400">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-[#00ff88] text-black hover:bg-[#00ff88]/90">
              {loading ? "Creating..." : "Create Project"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
