// Role hierarchy: super_admin > agency_admin > client_admin > member > viewer
export type UserRole = "super_admin" | "agency_admin" | "client_admin" | "member" | "viewer"

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  super_admin: 100,
  agency_admin: 80,
  client_admin: 60,
  member: 40,
  viewer: 20,
}

export const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: "Super Admin",
  agency_admin: "Agency Admin",
  client_admin: "Client Admin",
  member: "Member",
  viewer: "Viewer",
}

export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  super_admin: "Full platform access. Can manage all workspaces, billing, and system settings.",
  agency_admin: "Full workspace access. Can manage team, integrations, and all CRM data.",
  client_admin: "Can manage assigned projects and view reports.",
  member: "Can create and edit CRM records, run AI agents.",
  viewer: "Read-only access to CRM data and reports.",
}

// Permission definitions
export type Permission =
  // Workspace
  | "workspace:read"
  | "workspace:update"
  | "workspace:delete"
  | "workspace:manage_billing"
  // Team
  | "team:read"
  | "team:invite"
  | "team:remove"
  | "team:change_roles"
  // CRM - Companies
  | "companies:read"
  | "companies:create"
  | "companies:update"
  | "companies:delete"
  // CRM - Contacts
  | "contacts:read"
  | "contacts:create"
  | "contacts:update"
  | "contacts:delete"
  // CRM - Leads
  | "leads:read"
  | "leads:create"
  | "leads:update"
  | "leads:delete"
  // CRM - Deals
  | "deals:read"
  | "deals:create"
  | "deals:update"
  | "deals:delete"
  // CRM - Projects
  | "projects:read"
  | "projects:create"
  | "projects:update"
  | "projects:delete"
  // Campaigns
  | "campaigns:read"
  | "campaigns:create"
  | "campaigns:update"
  | "campaigns:delete"
  // Funnels
  | "funnels:read"
  | "funnels:create"
  | "funnels:update"
  | "funnels:delete"
  // AI Agents
  | "agents:use"
  | "agents:configure"
  // Integrations
  | "integrations:read"
  | "integrations:manage"
  // Settings
  | "settings:read"
  | "settings:update"

// Role-permission mapping
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  super_admin: [
    // All permissions
    "workspace:read",
    "workspace:update",
    "workspace:delete",
    "workspace:manage_billing",
    "team:read",
    "team:invite",
    "team:remove",
    "team:change_roles",
    "companies:read",
    "companies:create",
    "companies:update",
    "companies:delete",
    "contacts:read",
    "contacts:create",
    "contacts:update",
    "contacts:delete",
    "leads:read",
    "leads:create",
    "leads:update",
    "leads:delete",
    "deals:read",
    "deals:create",
    "deals:update",
    "deals:delete",
    "projects:read",
    "projects:create",
    "projects:update",
    "projects:delete",
    "campaigns:read",
    "campaigns:create",
    "campaigns:update",
    "campaigns:delete",
    "funnels:read",
    "funnels:create",
    "funnels:update",
    "funnels:delete",
    "agents:use",
    "agents:configure",
    "integrations:read",
    "integrations:manage",
    "settings:read",
    "settings:update",
  ],
  agency_admin: [
    "workspace:read",
    "workspace:update",
    "team:read",
    "team:invite",
    "team:remove",
    "team:change_roles",
    "companies:read",
    "companies:create",
    "companies:update",
    "companies:delete",
    "contacts:read",
    "contacts:create",
    "contacts:update",
    "contacts:delete",
    "leads:read",
    "leads:create",
    "leads:update",
    "leads:delete",
    "deals:read",
    "deals:create",
    "deals:update",
    "deals:delete",
    "projects:read",
    "projects:create",
    "projects:update",
    "projects:delete",
    "campaigns:read",
    "campaigns:create",
    "campaigns:update",
    "campaigns:delete",
    "funnels:read",
    "funnels:create",
    "funnels:update",
    "funnels:delete",
    "agents:use",
    "agents:configure",
    "integrations:read",
    "integrations:manage",
    "settings:read",
    "settings:update",
  ],
  client_admin: [
    "workspace:read",
    "team:read",
    "companies:read",
    "companies:create",
    "companies:update",
    "contacts:read",
    "contacts:create",
    "contacts:update",
    "leads:read",
    "leads:create",
    "leads:update",
    "deals:read",
    "deals:create",
    "deals:update",
    "projects:read",
    "projects:create",
    "projects:update",
    "campaigns:read",
    "funnels:read",
    "agents:use",
    "integrations:read",
    "settings:read",
  ],
  member: [
    "workspace:read",
    "team:read",
    "companies:read",
    "companies:create",
    "companies:update",
    "contacts:read",
    "contacts:create",
    "contacts:update",
    "leads:read",
    "leads:create",
    "leads:update",
    "deals:read",
    "deals:create",
    "deals:update",
    "projects:read",
    "campaigns:read",
    "funnels:read",
    "agents:use",
    "settings:read",
  ],
  viewer: [
    "workspace:read",
    "team:read",
    "companies:read",
    "contacts:read",
    "leads:read",
    "deals:read",
    "projects:read",
    "campaigns:read",
    "funnels:read",
    "settings:read",
  ],
}

// Helper functions
export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false
}

export function hasAnyPermission(role: UserRole, permissions: Permission[]): boolean {
  return permissions.some((p) => hasPermission(role, p))
}

export function hasAllPermissions(role: UserRole, permissions: Permission[]): boolean {
  return permissions.every((p) => hasPermission(role, p))
}

export function canManageRole(currentRole: UserRole, targetRole: UserRole): boolean {
  // Can only manage roles lower in hierarchy
  return ROLE_HIERARCHY[currentRole] > ROLE_HIERARCHY[targetRole]
}

export function getAssignableRoles(currentRole: UserRole): UserRole[] {
  const currentLevel = ROLE_HIERARCHY[currentRole]
  return (Object.keys(ROLE_HIERARCHY) as UserRole[]).filter((role) => ROLE_HIERARCHY[role] < currentLevel)
}
