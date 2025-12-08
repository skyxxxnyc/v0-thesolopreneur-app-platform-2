import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createServerClient()

    // Test if sdr_analyses table exists
    const { data, error } = await supabase.from("sdr_analyses").select("id").limit(1)

    if (error) {
      return NextResponse.json({
        exists: false,
        error: error.message,
        message: "Agent tables not created yet. Please run create-agent-tables-v2.sql in Supabase SQL Editor",
      })
    }

    return NextResponse.json({
      exists: true,
      message: "Agent tables are ready!",
    })
  } catch (error: any) {
    return NextResponse.json({
      exists: false,
      error: error.message,
    })
  }
}
