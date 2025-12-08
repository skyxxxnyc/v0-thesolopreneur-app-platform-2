"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { Loader2, Check } from "lucide-react"
import type { Profile } from "@/lib/types/database"

interface ProfileSettingsProps {
  user: any
  profile: any
}

export function ProfileSettings({ user, profile }: ProfileSettingsProps) {
  const [fullName, setFullName] = useState(profile?.full_name || "")
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "")
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    const supabase = createClient()

    // @ts-expect-error - Supabase update returns unknown in strict mode
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)

    setLoading(false)

    if (!error) {
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white">Profile</h2>
        <p className="text-sm text-zinc-400 mt-1">Manage your personal information</p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 p-6 space-y-6">
        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-zinc-800 flex items-center justify-center text-2xl font-bold text-white">
            {fullName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "?"}
          </div>
          <div>
            <p className="text-sm font-medium text-white">Profile Photo</p>
            <p className="text-xs text-zinc-500 mt-0.5">JPG, PNG or GIF. Max 2MB</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2 border-zinc-700 text-zinc-300 hover:bg-zinc-800 bg-transparent"
            >
              Upload
            </Button>
          </div>
        </div>

        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-zinc-300">
            Full Name
          </Label>
          <Input
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="bg-zinc-800 border-zinc-700 text-white"
            placeholder="Enter your full name"
          />
        </div>

        {/* Email (read-only) */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-zinc-300">
            Email
          </Label>
          <Input id="email" value={user.email} disabled className="bg-zinc-800/50 border-zinc-700 text-zinc-500" />
          <p className="text-xs text-zinc-500">Contact support to change your email</p>
        </div>

        <div className="flex justify-end pt-4 border-t border-zinc-800">
          <Button
            onClick={handleSave}
            disabled={loading}
            className="bg-[#00ff88] text-black hover:bg-[#00ff88]/90 font-medium"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : saved ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Saved
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
