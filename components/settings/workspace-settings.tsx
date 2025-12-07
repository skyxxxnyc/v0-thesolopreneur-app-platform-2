"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { Loader2, Check, Trash2, UserPlus, Shield, MoreVertical } from "lucide-react"
import { usePermissions } from "@/lib/hooks/use-permissions"
import { type UserRole, ROLE_LABELS, ROLE_DESCRIPTIONS } from "@/lib/roles/permissions"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface WorkspaceSettingsProps {
  workspace: any
  memberships: any[]
}

export function WorkspaceSettings({ workspace, memberships: initialMemberships }: WorkspaceSettingsProps) {
  const [name, setName] = useState(workspace?.name || "")
  const [slug, setSlug] = useState(workspace?.slug || "")
  const [primaryColor, setPrimaryColor] = useState(workspace?.primary_color || "#00ff88")
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [memberships, setMemberships] = useState(initialMemberships)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState<UserRole>("member")
  const [inviting, setInviting] = useState(false)
  const [showInviteForm, setShowInviteForm] = useState(false)

  const { role: currentUserRole, can, canManage, assignableRoles, isSuperAdmin } = usePermissions()

  const handleSave = async () => {
    if (!workspace || !can("workspace:update")) return
    setLoading(true)
    const supabase = createClient()

    const { error } = await supabase
      .from("tenants")
      .update({
        name,
        slug,
        primary_color: primaryColor,
        updated_at: new Date().toISOString(),
      })
      .eq("id", workspace.id)

    setLoading(false)

    if (!error) {
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  const handleInvite = async () => {
    if (!workspace || !can("team:invite") || !inviteEmail) return
    setInviting(true)
    const supabase = createClient()

    const { error } = await supabase.from("invitations").insert({
      tenant_id: workspace.id,
      email: inviteEmail,
      role: inviteRole,
    })

    setInviting(false)
    if (!error) {
      setInviteEmail("")
      setShowInviteForm(false)
    }
  }

  const handleChangeRole = async (memberId: string, newRole: UserRole) => {
    if (!can("team:change_roles")) return
    const supabase = createClient()

    const { error } = await supabase.from("tenant_members").update({ role: newRole }).eq("id", memberId)

    if (!error) {
      setMemberships(memberships.map((m) => (m.id === memberId ? { ...m, role: newRole } : m)))
    }
  }

  const handleRemoveMember = async (memberId: string) => {
    if (!can("team:remove")) return
    const supabase = createClient()

    const { error } = await supabase.from("tenant_members").delete().eq("id", memberId)

    if (!error) {
      setMemberships(memberships.filter((m) => m.id !== memberId))
    }
  }

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case "super_admin":
        return "bg-[#00ff88] text-black"
      case "agency_admin":
        return "bg-blue-500 text-white"
      case "client_admin":
        return "bg-amber-500 text-black"
      case "member":
        return "bg-zinc-600 text-white"
      case "viewer":
        return "bg-zinc-800 text-zinc-400"
      default:
        return "bg-zinc-700 text-white"
    }
  }

  if (!workspace) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-white">Workspace</h2>
          <p className="text-sm text-zinc-400 mt-1">You don't have a workspace yet</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-8 text-center">
          <p className="text-zinc-400 mb-4">Create a workspace to get started</p>
          <Button className="bg-[#00ff88] text-black hover:bg-[#00ff88]/90">Create Workspace</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white">Workspace</h2>
        <p className="text-sm text-zinc-400 mt-1">Manage your workspace settings and team members</p>
      </div>

      {/* Current Role Badge */}
      {currentUserRole && (
        <div className="bg-zinc-900 border border-zinc-800 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-[#00ff88]" />
            <div>
              <p className="text-sm text-zinc-400">Your role</p>
              <p className="text-white font-medium">{ROLE_LABELS[currentUserRole]}</p>
            </div>
          </div>
          <span className={`px-3 py-1 text-xs font-bold uppercase ${getRoleBadgeColor(currentUserRole)}`}>
            {ROLE_LABELS[currentUserRole]}
          </span>
        </div>
      )}

      {/* General Settings */}
      <div className="bg-zinc-900 border border-zinc-800 p-6 space-y-6">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider">General</h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="workspaceName" className="text-zinc-300">
              Workspace Name
            </Label>
            <Input
              id="workspaceName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white"
              disabled={!can("workspace:update")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug" className="text-zinc-300">
              URL Slug
            </Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
              className="bg-zinc-800 border-zinc-700 text-white"
              disabled={!can("workspace:update")}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="primaryColor" className="text-zinc-300">
            Brand Color
          </Label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              id="primaryColor"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="w-10 h-10 rounded cursor-pointer border-0"
              disabled={!can("workspace:update")}
            />
            <Input
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white w-32"
              disabled={!can("workspace:update")}
            />
          </div>
        </div>

        {can("workspace:update") && (
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
        )}
      </div>

      {/* Team Members */}
      <div className="bg-zinc-900 border border-zinc-800 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Team Members</h3>
          {can("team:invite") && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowInviteForm(!showInviteForm)}
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 bg-transparent"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Invite
            </Button>
          )}
        </div>

        {/* Invite Form */}
        {showInviteForm && can("team:invite") && (
          <div className="bg-zinc-800/50 border border-zinc-700 p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-zinc-300">Email</Label>
                <Input
                  type="email"
                  placeholder="teammate@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="bg-zinc-900 border-zinc-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Role</Label>
                <Select value={inviteRole} onValueChange={(v) => setInviteRole(v as UserRole)}>
                  <SelectTrigger className="bg-zinc-900 border-zinc-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-700">
                    {assignableRoles.map((role) => (
                      <SelectItem key={role} value={role} className="text-white">
                        {ROLE_LABELS[role]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowInviteForm(false)}
                className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 bg-transparent"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleInvite}
                disabled={inviting || !inviteEmail}
                className="bg-[#00ff88] text-black hover:bg-[#00ff88]/90"
              >
                {inviting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Invite"}
              </Button>
            </div>
          </div>
        )}

        {/* Role Legend */}
        <div className="bg-zinc-800/30 border border-zinc-800 p-4">
          <p className="text-xs text-zinc-500 uppercase tracking-wider mb-3">Role Permissions</p>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(ROLE_LABELS) as UserRole[]).map((role) => (
              <div key={role} className="flex items-start gap-2">
                <span className={`px-2 py-0.5 text-xs font-bold uppercase ${getRoleBadgeColor(role)} shrink-0`}>
                  {ROLE_LABELS[role]}
                </span>
                <p className="text-xs text-zinc-500">{ROLE_DESCRIPTIONS[role]}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Member List */}
        <div className="space-y-2">
          {memberships.map((m) => {
            const memberRole = m.role as UserRole
            const canManageThisMember = canManage(memberRole) && can("team:change_roles")

            return (
              <div key={m.id} className="flex items-center justify-between py-3 border-b border-zinc-800 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-zinc-800 flex items-center justify-center text-sm font-bold text-white border border-zinc-700">
                    {m.profiles?.full_name?.[0]?.toUpperCase() || m.profiles?.email?.[0]?.toUpperCase() || "?"}
                  </div>
                  <div>
                    <p className="text-sm text-white font-medium">{m.profiles?.full_name || "Team Member"}</p>
                    <p className="text-xs text-zinc-500">{m.profiles?.email || "No email"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 text-xs font-bold uppercase ${getRoleBadgeColor(memberRole)}`}>
                    {ROLE_LABELS[memberRole] || memberRole}
                  </span>

                  {canManageThisMember && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-zinc-400 hover:text-white">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800">
                        <div className="px-2 py-1.5 text-xs text-zinc-500">Change Role</div>
                        {assignableRoles.map((role) => (
                          <DropdownMenuItem
                            key={role}
                            onClick={() => handleChangeRole(m.id, role)}
                            className="text-white hover:bg-zinc-800 cursor-pointer"
                          >
                            {ROLE_LABELS[role]}
                          </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator className="bg-zinc-800" />
                        <DropdownMenuItem
                          onClick={() => handleRemoveMember(m.id)}
                          className="text-red-400 hover:bg-red-950/50 cursor-pointer"
                        >
                          Remove from workspace
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            )
          })}

          {memberships.length === 0 && <p className="text-sm text-zinc-500 py-4 text-center">No team members yet</p>}
        </div>
      </div>

      {/* Danger Zone - Only for super_admin or agency_admin */}
      {can("workspace:delete") && (
        <div className="bg-red-950/20 border border-red-900/50 p-6 space-y-4">
          <h3 className="text-sm font-semibold text-red-400 uppercase tracking-wider">Danger Zone</h3>
          <p className="text-sm text-zinc-400">
            Deleting a workspace is permanent and cannot be undone. All data will be lost.
          </p>
          <Button variant="outline" className="border-red-900 text-red-400 hover:bg-red-950/50 bg-transparent">
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Workspace
          </Button>
        </div>
      )}
    </div>
  )
}
