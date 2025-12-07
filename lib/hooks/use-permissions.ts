"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import {
  type UserRole,
  type Permission,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  canManageRole,
  getAssignableRoles,
  ROLE_HIERARCHY,
} from "@/lib/roles/permissions"

interface UsePermissionsReturn {
  role: UserRole | null
  loading: boolean
  can: (permission: Permission) => boolean
  canAny: (permissions: Permission[]) => boolean
  canAll: (permissions: Permission[]) => boolean
  canManage: (targetRole: UserRole) => boolean
  assignableRoles: UserRole[]
  isSuperAdmin: boolean
  isAdmin: boolean
}

export function usePermissions(): UsePermissionsReturn {
  const [role, setRole] = useState<UserRole | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRole() {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setRole(null)
        setLoading(false)
        return
      }

      const { data: membership } = await supabase.from("tenant_members").select("role").eq("user_id", user.id).single()

      setRole((membership?.role as UserRole) || null)
      setLoading(false)
    }

    fetchRole()
  }, [])

  return {
    role,
    loading,
    can: (permission: Permission) => (role ? hasPermission(role, permission) : false),
    canAny: (permissions: Permission[]) => (role ? hasAnyPermission(role, permissions) : false),
    canAll: (permissions: Permission[]) => (role ? hasAllPermissions(role, permissions) : false),
    canManage: (targetRole: UserRole) => (role ? canManageRole(role, targetRole) : false),
    assignableRoles: role ? getAssignableRoles(role) : [],
    isSuperAdmin: role === "super_admin",
    isAdmin: role ? ROLE_HIERARCHY[role] >= ROLE_HIERARCHY["agency_admin"] : false,
  }
}
