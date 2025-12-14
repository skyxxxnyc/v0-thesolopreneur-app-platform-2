import { createServerClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Use actual user or mock user for development
    const currentUser = user || { id: "dev-user", email: "dev@example.com" } as any

    // Get user's tenant
    let { data: membership } = await supabase
      .from("tenant_members")
      .select("tenant_id")
      .eq("user_id", currentUser.id)
      .single()

    // TEMPORARY: If dev-user has no tenant, use the first available tenant
    if (!membership && currentUser.id === "dev-user") {
      const { data: firstTenant } = await supabase.from("tenants").select("id").limit(1).single()
      if (firstTenant) {
        membership = { tenant_id: firstTenant.id }
      }
    }

    if (!membership) {
      return NextResponse.json({ error: "No workspace found" }, { status: 400 })
    }

    // Get all integrations for the tenant
    const { data: integrations, error } = await supabase
      .from("integrations")
      .select("*")
      .eq("tenant_id", membership.tenant_id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching integrations:", error)
      return NextResponse.json({ error: "Failed to fetch integrations" }, { status: 500 })
    }

    // Remove sensitive data before sending to client
    const sanitized = integrations?.map((i) => ({
      id: i.id,
      integration_type: i.integration_type,
      status: i.status,
      config: i.config,
      last_synced_at: i.last_synced_at,
      error_message: i.error_message,
      created_at: i.created_at,
      updated_at: i.updated_at,
    }))

    return NextResponse.json({ integrations: sanitized || [] })
  } catch (error: any) {
    console.error("Integrations fetch error:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch integrations" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Use actual user or mock user for development
    const currentUser = user || { id: "dev-user", email: "dev@example.com" } as any

    // Get user's tenant
    let { data: membership } = await supabase
      .from("tenant_members")
      .select("tenant_id")
      .eq("user_id", currentUser.id)
      .single()

    // TEMPORARY: If dev-user has no tenant, use the first available tenant
    if (!membership && currentUser.id === "dev-user") {
      const { data: firstTenant } = await supabase.from("tenants").select("id").limit(1).single()
      if (firstTenant) {
        membership = { tenant_id: firstTenant.id }
      }
    }

    if (!membership) {
      return NextResponse.json({ error: "No workspace found" }, { status: 400 })
    }

    const body = await req.json()
    const { integration_type, connection_key, config } = body

    if (!integration_type) {
      return NextResponse.json({ error: "Integration type is required" }, { status: 400 })
    }

    // Insert or update integration
    const { data: integration, error } = await supabase
      .from("integrations")
      .upsert(
        {
          tenant_id: membership.tenant_id,
          user_id: currentUser.id,
          integration_type,
          connection_key: connection_key || null,
          config: config || {},
          status: "active",
        },
        {
          onConflict: "tenant_id,integration_type",
        },
      )
      .select()
      .single()

    if (error) {
      console.error("Error creating integration:", error)
      return NextResponse.json({ error: "Failed to create integration" }, { status: 500 })
    }

    return NextResponse.json({ success: true, integration })
  } catch (error: any) {
    console.error("Integration creation error:", error)
    return NextResponse.json({ error: error.message || "Failed to create integration" }, { status: 500 })
  }
}
