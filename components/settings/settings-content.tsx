"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { User, Building2, Plug, CreditCard, Bell, Shield } from "lucide-react"
import { ProfileSettings } from "./profile-settings"
import { WorkspaceSettings } from "./workspace-settings"
import { IntegrationsSettings } from "./integrations-settings"
import { BillingSettings } from "./billing-settings"
import { NotificationSettings } from "./notification-settings"
import { SecuritySettings } from "./security-settings"

interface SettingsContentProps {
  user: any
  profile: any
  memberships: any[]
}

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "workspace", label: "Workspace", icon: Building2 },
  { id: "integrations", label: "Integrations", icon: Plug },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "billing", label: "Billing", icon: CreditCard },
]

export function SettingsContent({ user, profile, memberships }: SettingsContentProps) {
  const [activeTab, setActiveTab] = useState("profile")

  const currentWorkspace = memberships[0]?.tenant || null

  return (
    <div className="flex gap-8">
      {/* Sidebar Tabs */}
      <nav className="w-48 shrink-0">
        <ul className="space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <li key={tab.id}>
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-[#00ff88]/10 text-[#00ff88] border-l-2 border-[#00ff88]"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800/50",
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {activeTab === "profile" && <ProfileSettings user={user} profile={profile} />}
        {activeTab === "workspace" && <WorkspaceSettings workspace={currentWorkspace} memberships={memberships} />}
        {activeTab === "integrations" && <IntegrationsSettings />}
        {activeTab === "notifications" && <NotificationSettings />}
        {activeTab === "security" && <SecuritySettings user={user} />}
        {activeTab === "billing" && <BillingSettings workspace={currentWorkspace} />}
      </div>
    </div>
  )
}
