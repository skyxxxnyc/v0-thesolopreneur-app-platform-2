"use client"

import type { ReactNode } from "react"
import { usePermissions } from "@/lib/hooks/use-permissions"
import type { Permission } from "@/lib/roles/permissions"

interface RequirePermissionProps {
  permission: Permission | Permission[]
  mode?: "any" | "all"
  fallback?: ReactNode
  children: ReactNode
}

export function RequirePermission({ permission, mode = "any", fallback = null, children }: RequirePermissionProps) {
  const { can, canAny, canAll, loading } = usePermissions()

  if (loading) return null

  const permissions = Array.isArray(permission) ? permission : [permission]
  const hasAccess =
    mode === "all" ? canAll(permissions) : permissions.length === 1 ? can(permissions[0]) : canAny(permissions)

  if (!hasAccess) return <>{fallback}</>

  return <>{children}</>
}
