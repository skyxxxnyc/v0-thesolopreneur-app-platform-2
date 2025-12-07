import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function CTASection() {
  return (
    <section className="py-32 px-6 bg-[#BFFF00] relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(black 1px, transparent 1px), linear-gradient(90deg, black 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="max-w-4xl mx-auto text-center relative">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-6 leading-tight tracking-tight text-balance">
          Stop paying for tools
          <br />
          that don't work.
        </h2>

        <p className="text-lg text-black/60 mb-10 max-w-xl mx-auto text-pretty">
          Join 10,000+ solopreneurs who switched to a CRM that actually helps them close deals.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/auth/signup">
            <Button
              size="lg"
              className="text-base bg-black text-[#BFFF00] hover:bg-neutral-900 px-8 py-6 h-auto font-medium group"
            >
              Start Your Free Trial
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Button
            size="lg"
            variant="outline"
            className="text-base bg-transparent text-black border-2 border-black hover:bg-black/10 px-8 py-6 h-auto font-medium"
          >
            Book a Demo
          </Button>
        </div>
      </div>
    </section>
  )
}
