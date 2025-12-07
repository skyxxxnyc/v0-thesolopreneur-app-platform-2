import { Button } from "@/components/ui/button"
import { Check, ArrowRight, Star } from "lucide-react"
import Link from "next/link"

const plans = [
  {
    name: "Solo",
    price: "$47",
    period: "/mo",
    description: "For freelancers and solo founders",
    color: "#BFFF00",
    features: [
      "Unlimited contacts",
      "5 funnels",
      "Email & SMS",
      "Basic automations",
      "1 AI agent",
      "Community support",
    ],
    cta: "Start Free Trial",
    popular: false,
  },
  {
    name: "Founder",
    price: "$97",
    period: "/mo",
    description: "For growing businesses",
    color: "#00FFFF",
    features: [
      "Everything in Solo",
      "Unlimited funnels",
      "All 4 AI agents",
      "Advanced automations",
      "API access",
      "Priority support",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Agency",
    price: "$297",
    period: "/mo",
    description: "For micro agencies",
    color: "#FF6B6B",
    features: [
      "Everything in Founder",
      "White label",
      "Unlimited sub-accounts",
      "Custom domain",
      "Team seats",
      "Dedicated success manager",
    ],
    cta: "Start Free Trial",
    popular: false,
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="py-32 px-6 bg-black border-y-4 border-[#00FFFF]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <div className="inline-block px-4 py-2 bg-[#FFD93D] text-black font-mono tracking-widest uppercase mb-6">
            <span className="text-xs font-black">Simple Pricing</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">No BS pricing.</h2>
          <p className="text-xl text-neutral-300 max-w-2xl mx-auto">
            One platform, three tiers. All plans include a 14-day free trial.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <PricingCard key={index} {...plan} />
          ))}
        </div>
      </div>
    </section>
  )
}

function PricingCard({
  name,
  price,
  period,
  description,
  color,
  features,
  cta,
  popular,
}: {
  name: string
  price: string
  period: string
  description: string
  color: string
  features: string[]
  cta: string
  popular: boolean
}) {
  return (
    <div
      className={`relative border-2 bg-[#0a0a0a] p-8 transition-all duration-300 hover:-translate-y-2 ${
        popular
          ? "border-current shadow-[6px_6px_0px_0px_rgba(0,255,255,0.5)] scale-105"
          : "border-neutral-800 hover:border-neutral-700"
      }`}
      style={popular ? { borderColor: color } : {}}
    >
      {popular && (
        <div
          className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-2 text-xs font-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-black flex items-center gap-1.5"
          style={{ backgroundColor: color }}
        >
          <Star className="w-3 h-3 fill-current" />
          MOST POPULAR
        </div>
      )}

      {/* Plan name */}
      <h3 className="text-2xl font-black mb-2 tracking-tight" style={{ color }}>
        {name}
      </h3>
      <p className="text-xs text-neutral-400 mb-8 uppercase tracking-wide font-bold">{description}</p>

      <div className="mb-8">
        <span className="text-6xl font-black tracking-tighter">{price}</span>
        <span className="text-neutral-400 text-base font-bold">{period}</span>
      </div>

      {/* Features */}
      <ul className="space-y-4 mb-10">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-3">
            <div
              className="w-5 h-5 border-2 flex items-center justify-center shrink-0"
              style={{ borderColor: color, backgroundColor: color }}
            >
              <Check className="w-3 h-3 text-black stroke-[3]" />
            </div>
            <span className="text-sm text-neutral-200 font-medium">{feature}</span>
          </li>
        ))}
      </ul>

      <Link href="/auth/signup" className="block">
        <Button
          className="w-full text-sm border-2 border-black text-black hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none font-black group transition-all"
          style={{
            backgroundColor: color,
            boxShadow: `4px 4px 0px 0px rgba(0,0,0,1)`,
          }}
        >
          {cta}
          <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </Link>
    </div>
  )
}
