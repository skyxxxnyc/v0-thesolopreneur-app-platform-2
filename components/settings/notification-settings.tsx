"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Loader2, Check } from "lucide-react"

export function NotificationSettings() {
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [settings, setSettings] = useState({
    emailNewLead: true,
    emailDealClosed: true,
    emailWeeklyDigest: true,
    emailTaskReminders: false,
    pushNewLead: true,
    pushDealClosed: true,
    pushMentions: true,
    pushTaskReminders: true,
  })

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSave = async () => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 800))
    setLoading(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white">Notifications</h2>
        <p className="text-sm text-zinc-400 mt-1">Choose how you want to be notified</p>
      </div>

      {/* Email Notifications */}
      <div className="bg-zinc-900 border border-zinc-800 p-6 space-y-4">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Email Notifications</h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-zinc-300">New Lead</Label>
              <p className="text-xs text-zinc-500">Get notified when a new lead is created</p>
            </div>
            <Switch checked={settings.emailNewLead} onCheckedChange={() => handleToggle("emailNewLead")} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-zinc-300">Deal Closed</Label>
              <p className="text-xs text-zinc-500">Get notified when a deal is won or lost</p>
            </div>
            <Switch checked={settings.emailDealClosed} onCheckedChange={() => handleToggle("emailDealClosed")} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-zinc-300">Weekly Digest</Label>
              <p className="text-xs text-zinc-500">Receive a weekly summary of your activity</p>
            </div>
            <Switch checked={settings.emailWeeklyDigest} onCheckedChange={() => handleToggle("emailWeeklyDigest")} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-zinc-300">Task Reminders</Label>
              <p className="text-xs text-zinc-500">Get reminded about upcoming tasks</p>
            </div>
            <Switch checked={settings.emailTaskReminders} onCheckedChange={() => handleToggle("emailTaskReminders")} />
          </div>
        </div>
      </div>

      {/* Push Notifications */}
      <div className="bg-zinc-900 border border-zinc-800 p-6 space-y-4">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Push Notifications</h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-zinc-300">New Lead</Label>
              <p className="text-xs text-zinc-500">Browser notification for new leads</p>
            </div>
            <Switch checked={settings.pushNewLead} onCheckedChange={() => handleToggle("pushNewLead")} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-zinc-300">Deal Closed</Label>
              <p className="text-xs text-zinc-500">Browser notification for closed deals</p>
            </div>
            <Switch checked={settings.pushDealClosed} onCheckedChange={() => handleToggle("pushDealClosed")} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-zinc-300">Mentions</Label>
              <p className="text-xs text-zinc-500">Get notified when someone mentions you</p>
            </div>
            <Switch checked={settings.pushMentions} onCheckedChange={() => handleToggle("pushMentions")} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-zinc-300">Task Reminders</Label>
              <p className="text-xs text-zinc-500">Browser reminders for upcoming tasks</p>
            </div>
            <Switch checked={settings.pushTaskReminders} onCheckedChange={() => handleToggle("pushTaskReminders")} />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
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
            "Save Preferences"
          )}
        </Button>
      </div>
    </div>
  )
}
