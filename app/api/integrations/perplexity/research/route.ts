import { type NextRequest, NextResponse } from "next/server"
import { researchWithPerplexity } from "@/lib/pica/client"
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

    const { systemPrompt, userPrompt, maxTokens, temperature } = await request.json()

    if (!systemPrompt || !userPrompt) {
      return NextResponse.json({ error: "Missing required fields: systemPrompt, userPrompt" }, { status: 400 })
    }

    const result = await researchWithPerplexity({
      systemPrompt,
      userPrompt,
      maxTokens,
      temperature,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Perplexity research error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to research" }, { status: 500 })
  }
}
