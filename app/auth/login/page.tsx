"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { createClient } = await import("@/lib/supabase/client")
      const supabase = createClient()

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      router.push("/dashboard")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-zinc-900 border-r border-zinc-800 flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <Image src="/SOLO-logo.png" alt="thesolopreneur.app" width={40} height={40} className="w-10 h-10" />
          <span className="text-xl font-semibold text-white tracking-tight">thesolopreneur.app</span>
        </div>

        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-white leading-tight">
            Your business,
            <br />
            <span className="text-[#00ff88]">automated.</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-md">
            CRM, funnels, and AI agents working 24/7 so you can focus on what matters.
          </p>
        </div>

        <p className="text-zinc-600 text-sm">Built for solopreneurs, freelancers, and micro agencies.</p>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <Image src="/SOLO-logo.png" alt="thesolopreneur.app" width={40} height={40} className="w-10 h-10" />
            <span className="text-xl font-semibold text-white tracking-tight">thesolopreneur.app</span>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Welcome back</h2>
            <p className="text-zinc-500">Sign in to your account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
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
                className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 h-12 focus:border-[#00ff88] focus:ring-[#00ff88]"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-zinc-300">
                  Password
                </Label>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-zinc-500 hover:text-[#00ff88] transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-zinc-900 border-zinc-800 text-white h-12 focus:border-[#00ff88] focus:ring-[#00ff88]"
              />
            </div>

            {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3">{error}</div>}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-[#00ff88] text-black font-semibold hover:bg-[#00ff88]/90 disabled:opacity-50"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <p className="text-center text-zinc-500">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="text-[#00ff88] hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
