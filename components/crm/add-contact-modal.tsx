"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { X, UserCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createBrowserClient } from "@/lib/supabase/client"
import type { Contact } from "@/lib/types/crm"

interface AddContactModalProps {
  tenantId: string
  companies: { id: string; name: string }[]
  onClose: () => void
}

export function AddContactModal({ tenantId, companies, onClose }: AddContactModalProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    job_title: "",
    department: "",
    company_id: "",
    authority_level: "",
    is_decision_maker: false,
    linkedin_url: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createBrowserClient()

    // @ts-expect-error - Supabase insert returns unknown in strict mode
    const { error: insertError } = await supabase.from("contacts").insert({
      tenant_id: tenantId,
      ...formData,
      company_id: formData.company_id || null,
      authority_level: formData.authority_level || null,
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
            <div className="w-10 h-10 bg-cyan-500/20 flex items-center justify-center">
              <UserCircle className="w-5 h-5 text-cyan-400" />
            </div>
            <h2 className="text-lg font-bold text-white">Add Contact</h2>
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
                First Name *
              </Label>
              <Input
                id="first_name"
                required
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

            <div>
              <Label htmlFor="department" className="text-zinc-400">
                Department
              </Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="bg-zinc-900 border-zinc-800 text-white mt-1"
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="company" className="text-zinc-400">
                Company
              </Label>
              <Select value={formData.company_id} onValueChange={(v) => setFormData({ ...formData, company_id: v })}>
                <SelectTrigger className="bg-zinc-900 border-zinc-800 text-white mt-1">
                  <SelectValue placeholder="Select company" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800">
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="authority" className="text-zinc-400">
                Authority Level
              </Label>
              <Select
                value={formData.authority_level}
                onValueChange={(v) => setFormData({ ...formData, authority_level: v })}
              >
                <SelectTrigger className="bg-zinc-900 border-zinc-800 text-white mt-1">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800">
                  <SelectItem value="champion">Champion</SelectItem>
                  <SelectItem value="decision_maker">Decision Maker</SelectItem>
                  <SelectItem value="economic_buyer">Economic Buyer</SelectItem>
                  <SelectItem value="influencer">Influencer</SelectItem>
                  <SelectItem value="end_user">End User</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-3 pt-6">
              <Checkbox
                id="is_decision_maker"
                checked={formData.is_decision_maker}
                onCheckedChange={(checked) => setFormData({ ...formData, is_decision_maker: !!checked })}
              />
              <Label htmlFor="is_decision_maker" className="text-zinc-400 cursor-pointer">
                Decision Maker
              </Label>
            </div>

            <div className="col-span-2">
              <Label htmlFor="linkedin" className="text-zinc-400">
                LinkedIn URL
              </Label>
              <Input
                id="linkedin"
                value={formData.linkedin_url}
                onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                className="bg-zinc-900 border-zinc-800 text-white mt-1"
                placeholder="https://linkedin.com/in/..."
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
              {loading ? "Adding..." : "Add Contact"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
