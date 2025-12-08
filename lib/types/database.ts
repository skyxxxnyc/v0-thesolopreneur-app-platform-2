// Database type definitions for Supabase

export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface Tenant {
  id: string
  name: string
  slug: string
  logo_url: string | null
  primary_color: string | null
  created_at: string
  updated_at: string
}

export interface TenantMember {
  id: string
  tenant_id: string
  user_id: string
  role: string
  created_at: string
  updated_at: string
  tenant?: Tenant
}

export type Membership = TenantMember & {
  tenant: Tenant
}
