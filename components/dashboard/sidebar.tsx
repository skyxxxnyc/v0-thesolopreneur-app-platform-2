"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Mail,
  Megaphone,
  Bot,
  FileText,
  Settings,
  ChevronDown,
  Plus,
  Building2,
  UserCircle,
  Target,
  FolderKanban,
  DollarSign,
  Calendar,
  LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { User } from "@/lib/supabase/client"
import type { Profile, Membership } from "@/lib/types/database"

interface SidebarProps {
  user: User
  profile: Profile | null
  memberships: Membership[]
}

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { type: "divider", label: "CRM" },
  { href: "/dashboard/companies", label: "Companies", icon: Building2 },
  { href: "/dashboard/contacts", label: "Contacts", icon: UserCircle },
  { href: "/dashboard/leads", label: "Leads", icon: Target },
  { href: "/dashboard/projects", label: "Projects", icon: FolderKanban },
  { href: "/dashboard/deals", label: "Deals", icon: DollarSign },
  { type: "divider", label: "Marketing" },
  { href: "/dashboard/campaigns", label: "Campaigns", icon: Megaphone },
  { href: "/dashboard/emails", label: "Emails", icon: Mail },
  { href: "/dashboard/calendar", label: "Calendar", icon: Calendar },
  { href: "/dashboard/funnels", label: "Funnels", icon: FileText },
  { type: "divider", label: "AI" },
  { href: "/dashboard/agents", label: "AI Agents", icon: Bot },
  { type: "divider", label: "System" },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
]

export function DashboardSidebar({ user, profile, memberships }: SidebarProps) {
  const pathname = usePathname()
  const [currentTenant, setCurrentTenant] = useState<Membership | null>(memberships[0] || null)

  return (
    <aside className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col">
      {/* Logo - Use actual logo */}
      <div className="p-4 border-b border-zinc-800">
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <Image
            src="/SOLO-logo.png"
            alt="thesolopreneur.app"
            width={28}
            height={28}
            className="transition-transform group-hover:scale-105"
          />
          <span className="font-semibold text-white text-sm tracking-tight">
            thesolopreneur<span className="text-[#00ff88]">.app</span>
          </span>
        </Link>
      </div>

      {/* Workspace Switcher - Enhanced styling */}
      <div className="p-3 border-b border-zinc-800">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-between h-auto py-2 px-3 bg-zinc-800/50 hover:bg-zinc-800 text-left"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className="w-8 h-8 flex items-center justify-center text-black font-bold text-sm"
                  style={{
                    backgroundColor: currentTenant?.tenant.primary_color || "#00ff88",
                  }}
                >
                  {currentTenant?.tenant.name.charAt(0).toUpperCase() || "?"}
                </div>
                <div className="truncate">
                  <p className="text-sm font-medium text-white truncate">
                    {currentTenant?.tenant.name || "No workspace"}
                  </p>
                  <p className="text-xs text-zinc-500 capitalize">
                    {currentTenant?.role.replace("_", " ") || "Create one"}
                  </p>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-zinc-500 shrink-0" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-zinc-900 border-zinc-800">
            {memberships.map((membership) => (
              <DropdownMenuItem
                key={membership.id}
                onClick={() => setCurrentTenant(membership)}
                className="focus:bg-zinc-800"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 flex items-center justify-center text-black font-bold text-xs"
                    style={{
                      backgroundColor: membership.tenant.primary_color || "#00ff88",
                    }}
                  >
                    {membership.tenant.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-zinc-200">{membership.tenant.name}</span>
                </div>
              </DropdownMenuItem>
            ))}
            {memberships.length > 0 && <DropdownMenuSeparator className="bg-zinc-800" />}
            <DropdownMenuItem asChild className="focus:bg-zinc-800">
              <Link href="/dashboard/create-workspace" className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#00ff88]" />
                <span className="text-zinc-200">Create workspace</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Navigation - Improved active states and hover effects */}
      <nav className="flex-1 p-3 space-y-1 overflow-auto">
        {navItems.map((item, index) => {
          if (item.type === "divider") {
            return (
              <div key={index} className="pt-4 pb-2 first:pt-0">
                <span className="px-3 text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
                  {item.label}
                </span>
              </div>
            )
          }

          const isActive = pathname === item.href
          const Icon = item.icon!
          return (
            <Link
              key={item.href}
              href={item.href!}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm transition-all duration-200",
                isActive
                  ? "bg-[#00ff88]/10 text-[#00ff88] border-l-2 border-[#00ff88] -ml-[2px] pl-[14px]"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800/50",
              )}
            >
              <Icon className={cn("w-4 h-4", isActive && "text-[#00ff88]")} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User section - Added user info at bottom */}
      <div className="p-3 border-t border-zinc-800">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start h-auto py-2 px-3 hover:bg-zinc-800 text-left">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 bg-zinc-700 flex items-center justify-center text-white font-medium text-sm">
                  {(profile?.full_name || user.email)?.[0]?.toUpperCase() || "U"}
                </div>
                <div className="truncate">
                  <p className="text-sm font-medium text-white truncate">
                    {profile?.full_name || user.email?.split("@")[0]}
                  </p>
                  <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                </div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-zinc-900 border-zinc-800" align="start">
            <DropdownMenuItem className="focus:bg-zinc-800">
              <Settings className="w-4 h-4 mr-2" />
              Account Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-zinc-800" />
            <DropdownMenuItem className="focus:bg-zinc-800 text-red-400">
              <LogOut className="w-4 h-4 mr-2" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  )
}
