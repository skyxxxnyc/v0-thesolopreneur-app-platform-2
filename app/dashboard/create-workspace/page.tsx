"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

const colors = ["#00ff88", "#00d4ff", "#ff6b6b", "#ffd93d", "#a855f7", "#f97316"]

export default function CreateWorkspacePage() {
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [color, setColor] = useState(colors[0])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleNameChange = (value: string) => {
    setName(value)
    setSlug(
      value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, ""),
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setError("You must be logged in")
      setIsLoading(false)
      return
    }

    try {
      // Create tenant
      const { data: tenant, error: tenantError } = await supabase
        .from("tenants")
        .insert({
          name,
          slug,
          primary_color: color,
        })
        .select()
        .single()

      if (tenantError) throw tenantError

      const { error: memberError } = await supabase.from("tenant_members").insert({
        tenant_id: tenant.id,
        user_id: user.id,
        role: "super_admin",
      })

      if (memberError) throw memberError

      router.push("/dashboard")
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create workspace")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto space-y-8">
      <div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-300 text-sm mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to dashboard
        </Link>
        <h1 className="text-2xl font-bold text-white">Create Workspace</h1>
        <p className="text-zinc-500 mt-1">Set up a new workspace for your business or agency.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-zinc-300">
            Workspace name
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="My Agency"
            required
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug" className="text-zinc-300">
            Workspace URL
          </Label>
          <div className="flex items-center gap-0">
            <span className="h-12 px-3 bg-zinc-800 border border-r-0 border-zinc-700 text-zinc-500 text-sm flex items-center">
              app.thesolopreneur.app/
            </span>
            <Input
              id="slug"
              type="text"
              placeholder="my-agency"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 h-12 flex-1"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-zinc-300">Brand color</Label>
          <div className="flex gap-2">
            {colors.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`w-10 h-10 transition-all ${
                  color === c ? "ring-2 ring-white ring-offset-2 ring-offset-zinc-950" : ""
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3">{error}</div>}

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 bg-[#00ff88] text-black font-semibold hover:bg-[#00ff88]/90"
        >
          {isLoading ? "Creating..." : "Create workspace"}
        </Button>
      </form>
    </div>
  )
}
