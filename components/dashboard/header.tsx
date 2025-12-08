"use client"

import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, Search, LogOut, UserIcon, Settings, Plus, Command } from "lucide-react"
import { Input } from "@/components/ui/input"
import type { User } from "@/lib/supabase/client"
import type { Profile } from "@/lib/types/database"

interface HeaderProps {
  user: User
  profile: Profile | null
}

export function DashboardHeader({ user, profile }: HeaderProps) {
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  const displayName = profile?.full_name || user.email?.split("@")[0] || "User"
  const initials = displayName.slice(0, 2).toUpperCase()

  return (
    <header className="h-14 border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-40">
      {/* Search - Enhanced with better styling */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <div className="relative w-full group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-zinc-400 transition-colors" />
          <Input
            placeholder="Search contacts, campaigns..."
            className="pl-9 pr-16 bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 h-9 focus:border-zinc-600 focus:bg-zinc-800 transition-all"
          />
          <kbd className="absolute right-2 top-1/2 -translate-y-1/2 hidden sm:inline-flex h-5 items-center gap-0.5 px-1.5 bg-zinc-700/50 border border-zinc-600 text-zinc-400 text-[10px]">
            <Command className="w-2.5 h-2.5" />K
          </kbd>
        </div>
      </div>

      {/* Right side - Added quick add button */}
      <div className="flex items-center gap-1">
        {/* Quick Add */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-zinc-800 h-9 w-9">
              <Plus className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-zinc-900 border-zinc-800">
            <DropdownMenuItem className="focus:bg-zinc-800 text-zinc-200">New Company</DropdownMenuItem>
            <DropdownMenuItem className="focus:bg-zinc-800 text-zinc-200">New Contact</DropdownMenuItem>
            <DropdownMenuItem className="focus:bg-zinc-800 text-zinc-200">New Lead</DropdownMenuItem>
            <DropdownMenuSeparator className="bg-zinc-800" />
            <DropdownMenuItem className="focus:bg-zinc-800 text-zinc-200">New Campaign</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications - Added badge indicator */}
        <Button
          variant="ghost"
          size="icon"
          className="text-zinc-400 hover:text-white hover:bg-zinc-800 h-9 w-9 relative"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#ff6b6b] rounded-full" />
        </Button>

        {/* Divider */}
        <div className="w-px h-6 bg-zinc-800 mx-2" />

        {/* User menu - Refined styling */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-9 gap-2 px-2 hover:bg-zinc-800">
              <div className="w-7 h-7 bg-[#00ff88] flex items-center justify-center text-black font-semibold text-xs">
                {initials}
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-zinc-900 border-zinc-800">
            <div className="px-3 py-2">
              <p className="text-sm font-medium text-white">{displayName}</p>
              <p className="text-xs text-zinc-500">{user.email}</p>
            </div>
            <DropdownMenuSeparator className="bg-zinc-800" />
            <DropdownMenuItem className="focus:bg-zinc-800">
              <UserIcon className="w-4 h-4 mr-2 text-zinc-400" />
              <span className="text-zinc-200">Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="focus:bg-zinc-800">
              <Settings className="w-4 h-4 mr-2 text-zinc-400" />
              <span className="text-zinc-200">Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-zinc-800" />
            <DropdownMenuItem onClick={handleSignOut} className="focus:bg-zinc-800 text-red-400 focus:text-red-400">
              <LogOut className="w-4 h-4 mr-2" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
