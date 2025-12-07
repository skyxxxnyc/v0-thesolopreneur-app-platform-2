"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Check, Shield, Key, Smartphone } from "lucide-react"

interface SecuritySettingsProps {
  user: any
}

export function SecuritySettings({ user }: SecuritySettingsProps) {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) return
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setLoading(false)
    setSaved(true)
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white">Security</h2>
        <p className="text-sm text-zinc-400 mt-1">Manage your account security settings</p>
      </div>

      {/* Change Password */}
      <div className="bg-zinc-900 border border-zinc-800 p-6 space-y-4">
        <div className="flex items-center gap-3">
          <Key className="w-5 h-5 text-zinc-400" />
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Change Password</h3>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword" className="text-zinc-300">
              Current Password
            </Label>
            <Input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-zinc-300">
              New Password
            </Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-zinc-300">
              Confirm New Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white"
            />
            {newPassword && confirmPassword && newPassword !== confirmPassword && (
              <p className="text-xs text-red-400">Passwords do not match</p>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-zinc-800">
          <Button
            onClick={handleChangePassword}
            disabled={loading || !currentPassword || !newPassword || newPassword !== confirmPassword}
            className="bg-[#00ff88] text-black hover:bg-[#00ff88]/90 font-medium"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : saved ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Updated
              </>
            ) : (
              "Update Password"
            )}
          </Button>
        </div>
      </div>

      {/* Two-Factor Auth */}
      <div className="bg-zinc-900 border border-zinc-800 p-6 space-y-4">
        <div className="flex items-center gap-3">
          <Smartphone className="w-5 h-5 text-zinc-400" />
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Two-Factor Authentication</h3>
        </div>

        <p className="text-sm text-zinc-400">
          Add an extra layer of security to your account by requiring a verification code in addition to your password.
        </p>

        <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 bg-transparent">
          Enable 2FA
        </Button>
      </div>

      {/* Active Sessions */}
      <div className="bg-zinc-900 border border-zinc-800 p-6 space-y-4">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-zinc-400" />
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Active Sessions</h3>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between py-3 border-b border-zinc-800">
            <div>
              <p className="text-sm text-white">Current Session</p>
              <p className="text-xs text-zinc-500">Last active: Just now</p>
            </div>
            <span className="text-xs text-[#00ff88] bg-[#00ff88]/10 px-2 py-1">Current</span>
          </div>
        </div>

        <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 bg-transparent">
          Sign Out All Other Sessions
        </Button>
      </div>
    </div>
  )
}
