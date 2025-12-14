import { createServerClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Use actual user or mock user for development
    const currentUser = user || { id: "dev-user", email: "dev@example.com" } as any

    const body = await req.json()
    const { status, config } = body

    // Update integration
    const { data: integration, error } = await supabase
      .from("integrations")
      .update({
        ...(status && { status }),
        ...(config && { config }),
      })
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      console.error("Error updating integration:", error)
      return NextResponse.json({ error: "Failed to update integration" }, { status: 500 })
    }

    return NextResponse.json({ success: true, integration })
  } catch (error: any) {
    console.error("Integration update error:", error)
    return NextResponse.json({ error: error.message || "Failed to update integration" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Use actual user or mock user for development
    const currentUser = user || { id: "dev-user", email: "dev@example.com" } as any

    // Delete integration
    const { error } = await supabase.from("integrations").delete().eq("id", params.id)

    if (error) {
      console.error("Error deleting integration:", error)
      return NextResponse.json({ error: "Failed to delete integration" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Integration deletion error:", error)
    return NextResponse.json({ error: error.message || "Failed to delete integration" }, { status: 500 })
  }
}
