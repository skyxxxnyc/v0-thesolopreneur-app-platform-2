import Link from "next/link"
import Image from "next/image"
import { Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function VerifyPage() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-8">
      <div className="w-full max-w-md text-center space-y-8">
        <div className="flex items-center justify-center gap-3">
          <Image src="/SOLO-logo.png" alt="thesolopreneur.app" width={40} height={40} className="w-10 h-10" />
          <span className="text-xl font-semibold text-white tracking-tight">thesolopreneur.app</span>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-8 space-y-6">
          <div className="w-16 h-16 bg-[#00ff88]/10 border border-[#00ff88]/20 flex items-center justify-center mx-auto">
            <Mail className="w-8 h-8 text-[#00ff88]" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-white">Check your email</h1>
            <p className="text-zinc-400">
              We've sent you a verification link. Click the link in your email to activate your account.
            </p>
          </div>

          <div className="pt-4 border-t border-zinc-800 space-y-4">
            <p className="text-zinc-500 text-sm">Didn't receive the email? Check your spam folder or try again.</p>
            <Button
              asChild
              variant="outline"
              className="w-full h-12 border-zinc-700 text-zinc-300 hover:bg-zinc-800 bg-transparent"
            >
              <Link href="/auth/signup">Try again</Link>
            </Button>
          </div>
        </div>

        <p className="text-zinc-600 text-sm">
          <Link href="/auth/login" className="hover:text-zinc-400">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  )
}
