import { Button } from "@/components/ui/button"
import { ArrowRight, Play, Sparkles } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="pt-40 pb-32 px-6 relative overflow-hidden">
      <div className="absolute top-20 right-10 w-64 h-64 border-4 border-[#BFFF00] opacity-10 rotate-12 pointer-events-none" />
      <div className="absolute bottom-32 left-20 w-32 h-32 bg-[#FF6B6B] opacity-5 pointer-events-none" />

      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto relative">
        <div className="inline-flex items-center gap-3 px-4 py-2 bg-[#BFFF00] text-black font-mono tracking-wider mb-8 shadow-[4px_4px_0px_0px_rgba(0,255,255,0.3)]">
          <Sparkles className="w-3.5 h-3.5" />
          <span className="text-xs font-bold uppercase">Now with AI Agents</span>
        </div>

        <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-bold leading-[0.9] mb-8 max-w-4xl tracking-tighter">
          The CRM
          <br />
          <span className="relative inline-block">
            <span className="relative z-10 text-[#BFFF00]">solopreneurs</span>
            <span className="absolute bottom-2 left-0 w-full h-4 bg-[#BFFF00] opacity-20 -rotate-1" />
          </span>
          <br />
          <span className="text-white">deserve.</span>
        </h1>

        <p className="text-xl md:text-2xl text-neutral-300 max-w-2xl mb-12 leading-relaxed font-medium">
          GoHighLevel power without the bloat. Funnels, CRM, templates, and
          <span className="text-[#FF6B6B] font-bold"> AI agents </span>
          that actually work.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-20">
          <Link href="/auth/signup">
            <Button
              size="lg"
              className="text-base bg-[#BFFF00] text-black hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none px-8 py-6 h-auto font-bold group shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] border-2 border-black transition-all"
            >
              Start Building Free
              <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Button
            size="lg"
            variant="outline"
            className="text-base bg-transparent text-white border-2 border-white hover:bg-white hover:text-black px-8 py-6 h-auto group font-bold transition-all"
          >
            <Play className="mr-2 w-4 h-4 fill-current" />
            Watch Demo
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t-4 border-[#BFFF00]">
          <StatBlock number="10K+" label="Solopreneurs" color="#BFFF00" />
          <StatBlock number="2M+" label="Leads Captured" color="#00FFFF" />
          <StatBlock number="500K+" label="Emails Sent" color="#FF6B6B" />
          <StatBlock number="99.9%" label="Uptime" color="#FFD93D" />
        </div>
      </div>
    </section>
  )
}

function StatBlock({ number, label, color }: { number: string; label: string; color: string }) {
  return (
    <div className="group">
      <div className="text-4xl md:text-5xl font-black tracking-tighter text-white mb-2 relative inline-block">
        {number}
        <div className="absolute -bottom-1 left-0 w-full h-1.5" style={{ backgroundColor: color }} />
      </div>
      <div className="text-xs text-neutral-400 uppercase tracking-widest font-bold">{label}</div>
    </div>
  )
}
