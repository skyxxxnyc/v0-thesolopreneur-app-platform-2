import { createServerClient } from "@/lib/supabase/server"
import { generateFollowupCadence } from "@/lib/agents/followup-agent"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { leadType, industry, companySize, customInstructions } = body

    const cadence = await generateFollowupCadence({
      leadType: leadType || "cold",
      industry,
      companySize,
      customInstructions,
    })

    return NextResponse.json({ success: true, cadence })
  } catch (error) {
    console.error("Cadence generation error:", error)
    return NextResponse.json({ error: "Failed to generate cadence" }, { status: 500 })
  }
}
