"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SignupPage() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters")
      setIsLoading(false)
      return
    }

    try {
      const { createClient } = await import("@/lib/supabase/client")
      const supabase = createClient()

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
          data: {
            full_name: fullName,
          },
        },
      })
      if (error) throw error
      router.push("/auth/verify")
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
            Start building
            <br />
            <span className="text-[#ff6b6b]">your empire.</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-md">
            Join thousands of solopreneurs automating their growth with AI-powered tools.
          </p>
        </div>

        <div className="flex items-center gap-8 text-zinc-500 text-sm">
          <span>No credit card required</span>
          <span>Cancel anytime</span>
        </div>
      </div>

      {/* Right side - Signup form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <Image src="/SOLO-logo.png" alt="thesolopreneur.app" width={40} height={40} className="w-10 h-10" />
            <span className="text-xl font-semibold text-white tracking-tight">thesolopreneur.app</span>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Create your account</h2>
            <p className="text-zinc-500">Get started in under 2 minutes</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-zinc-300">
                Full name
              </Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Jane Smith"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 h-12 focus:border-[#ff6b6b] focus:ring-[#ff6b6b]"
              />
            </div>

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
                className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 h-12 focus:border-[#ff6b6b] focus:ring-[#ff6b6b]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-zinc-300">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-zinc-900 border-zinc-800 text-white h-12 focus:border-[#ff6b6b] focus:ring-[#ff6b6b]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-zinc-300">
                Confirm password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-zinc-900 border-zinc-800 text-white h-12 focus:border-[#ff6b6b] focus:ring-[#ff6b6b]"
              />
            </div>

            {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3">{error}</div>}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-[#ff6b6b] text-white font-semibold hover:bg-[#ff6b6b]/90 disabled:opacity-50"
            >
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <p className="text-center text-zinc-500">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-[#ff6b6b] hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
