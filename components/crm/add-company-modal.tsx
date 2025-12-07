"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { X, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createBrowserClient } from "@/lib/supabase/client"

interface AddCompanyModalProps {
  tenantId: string
  onClose: () => void
}

export function AddCompanyModal({ tenantId, onClose }: AddCompanyModalProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    domain: "",
    industry: "",
    employee_count: "",
    phone: "",
    email: "",
    city: "",
    state: "",
    country: "",
    status: "prospect",
    source: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createBrowserClient()

    const { error: insertError } = await supabase.from("companies").insert({
      tenant_id: tenantId,
      ...formData,
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

      <div className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#00ff88]/20 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-[#00ff88]" />
            </div>
            <h2 className="text-lg font-bold text-white">Add Company</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-zinc-500 hover:text-white">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3">{error}</div>}

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="name" className="text-zinc-400">
                Company Name *
              </Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-zinc-900 border-zinc-800 text-white mt-1"
                placeholder="Acme Inc."
              />
            </div>

            <div>
              <Label htmlFor="domain" className="text-zinc-400">
                Domain
              </Label>
              <Input
                id="domain"
                value={formData.domain}
                onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                className="bg-zinc-900 border-zinc-800 text-white mt-1"
                placeholder="acme.com"
              />
            </div>

            <div>
              <Label htmlFor="industry" className="text-zinc-400">
                Industry
              </Label>
              <Input
                id="industry"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                className="bg-zinc-900 border-zinc-800 text-white mt-1"
                placeholder="Technology"
              />
            </div>

            <div>
              <Label htmlFor="employee_count" className="text-zinc-400">
                Employees
              </Label>
              <Select
                value={formData.employee_count}
                onValueChange={(v) => setFormData({ ...formData, employee_count: v })}
              >
                <SelectTrigger className="bg-zinc-900 border-zinc-800 text-white mt-1">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800">
                  <SelectItem value="1-10">1-10</SelectItem>
                  <SelectItem value="11-50">11-50</SelectItem>
                  <SelectItem value="51-200">51-200</SelectItem>
                  <SelectItem value="201-500">201-500</SelectItem>
                  <SelectItem value="500+">500+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status" className="text-zinc-400">
                Status
              </Label>
              <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                <SelectTrigger className="bg-zinc-900 border-zinc-800 text-white mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800">
                  <SelectItem value="prospect">Prospect</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="client">Client</SelectItem>
                </SelectContent>
              </Select>
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
                placeholder="+1 (555) 000-0000"
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
                placeholder="contact@acme.com"
              />
            </div>

            <div>
              <Label htmlFor="city" className="text-zinc-400">
                City
              </Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="bg-zinc-900 border-zinc-800 text-white mt-1"
                placeholder="New York"
              />
            </div>

            <div>
              <Label htmlFor="country" className="text-zinc-400">
                Country
              </Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="bg-zinc-900 border-zinc-800 text-white mt-1"
                placeholder="USA"
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="source" className="text-zinc-400">
                Source
              </Label>
              <Input
                id="source"
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                className="bg-zinc-900 border-zinc-800 text-white mt-1"
                placeholder="LinkedIn, Referral, Website, etc."
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
              {loading ? "Adding..." : "Add Company"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
