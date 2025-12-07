import { type NextRequest, NextResponse } from "next/server"
import { sendEmail } from "@/lib/pica/client"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { to, subject, body, cc, bcc, companyId, contactId } = await request.json()

    if (!to || !subject || !body) {
      return NextResponse.json({ error: "Missing required fields: to, subject, body" }, { status: 400 })
    }

    const result = await sendEmail({ to, subject, body, cc, bcc })

    // Log as activity if company or contact provided
    if (companyId || contactId) {
      await supabase.from("activities").insert({
        tenant_id: user.user_metadata?.current_tenant_id,
        company_id: companyId,
        contact_id: contactId,
        type: "email",
        subject,
        description: body.substring(0, 500),
        status: "completed",
        created_by: user.id,
        metadata: { gmail_message_id: result.id, gmail_thread_id: result.threadId },
      })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Gmail send error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to send email" },
      { status: 500 },
    )
  }
}
