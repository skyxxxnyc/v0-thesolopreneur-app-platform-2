import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black border-b-2 border-[#BFFF00]">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/SOLO-logo.png"
            alt="thesolopreneur.app"
            width={32}
            height={32}
            className="transition-transform group-hover:scale-110"
          />
          <span className="text-base font-black tracking-tighter">
            thesolopreneur<span className="text-[#BFFF00]">.app</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link
            href="#features"
            className="text-xs text-neutral-300 hover:text-[#BFFF00] transition-colors font-bold uppercase tracking-wider"
          >
            Features
          </Link>
          <Link
            href="#ai-agents"
            className="text-xs text-neutral-300 hover:text-[#00FFFF] transition-colors font-bold uppercase tracking-wider"
          >
            AI Agents
          </Link>
          <Link
            href="#pricing"
            className="text-xs text-neutral-300 hover:text-[#FF6B6B] transition-colors font-bold uppercase tracking-wider"
          >
            Pricing
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/auth/login">
            <Button variant="ghost" className="text-sm text-white hover:text-[#BFFF00] hover:bg-neutral-900 font-bold">
              Login
            </Button>
          </Link>
          <Link href="/auth/signup">
            <Button className="text-sm bg-[#BFFF00] text-black hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none font-black px-5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-2 border-black transition-all">
              Start Free
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}
