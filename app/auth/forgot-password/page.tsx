"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { createClient } = await import("@/lib/supabase/client")
      const supabase = createClient()

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo:
          process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/auth/reset-password`,
      })
      if (error) throw error
      setSuccess(true)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-8">
      <div className="w-full max-w-md space-y-8">
        <div className="flex items-center justify-center gap-3">
          <Image src="/SOLO-logo.png" alt="thesolopreneur.app" width={40} height={40} className="w-10 h-10" />
          <span className="text-xl font-semibold text-white tracking-tight">thesolopreneur.app</span>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-8 space-y-6">
          {success ? (
            <div className="space-y-4 text-center">
              <h2 className="text-2xl font-bold text-white">Check your email</h2>
              <p className="text-zinc-400">
                We&apos;ve sent a password reset link to <strong>{email}</strong>
              </p>
              <Button
                asChild
                variant="outline"
                className="w-full h-12 border-zinc-700 text-zinc-300 hover:bg-zinc-800 bg-transparent"
              >
                <Link href="/auth/login">Back to login</Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white">Reset password</h2>
                <p className="text-zinc-500">Enter your email and we&apos;ll send you a reset link</p>
              </div>

              <form onSubmit={handleReset} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-zinc-300">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-600 h-12 focus:border-[#00ff88] focus:ring-[#00ff88]"
                  />
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3">{error}</div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-[#00ff88] text-black font-semibold hover:bg-[#00ff88]/90 disabled:opacity-50"
                >
                  {isLoading ? "Sending..." : "Send reset link"}
                </Button>
              </form>
            </>
          )}
        </div>

        <Link
          href="/auth/login"
          className="flex items-center justify-center gap-2 text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to login
        </Link>
      </div>
    </div>
  )
}
