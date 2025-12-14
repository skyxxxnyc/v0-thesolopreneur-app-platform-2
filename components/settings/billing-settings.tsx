"use client"

import { Button } from "@/components/ui/button"
import { Check, CreditCard, ExternalLink } from "lucide-react"

interface BillingSettingsProps {
  workspace: any
}

const plans = [
  {
    id: "solo",
    name: "Solo",
    price: "$47",
    period: "mo",
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
    stripeLink: "https://buy.stripe.com/test_your_solo_link", // Replace with actual Stripe link
    popular: false,
  },
  {
    id: "founder",
    name: "Founder",
    price: "$97",
    period: "mo",
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
    stripeLink: "https://buy.stripe.com/test_your_founder_link", // Replace with actual Stripe link
    popular: true,
  },
  {
    id: "agency",
    name: "Agency",
    price: "$297",
    period: "mo",
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
    stripeLink: "https://buy.stripe.com/test_your_agency_link", // Replace with actual Stripe link
    popular: false,
  },
]

export function BillingSettings({ workspace }: BillingSettingsProps) {
  const currentPlan = workspace?.plan || "solo"

  const handleUpgrade = (stripeLink: string) => {
    window.open(stripeLink, "_blank")
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white">Billing & Subscription</h2>
        <p className="text-sm text-zinc-400 mt-1">Manage your subscription and payment methods</p>
      </div>

      {/* Current Plan */}
      <div className="bg-zinc-900 border border-zinc-800 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-zinc-400">Current Plan</p>
            <p className="text-2xl font-bold text-white capitalize">{currentPlan}</p>
            <p className="text-xs text-zinc-500 mt-1">
              {plans.find((p) => p.id === currentPlan)?.description || ""}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-zinc-400">Next billing date</p>
            <p className="text-sm text-white">January 15, 2025</p>
          </div>
        </div>
      </div>

      {/* Pricing Info */}
      <div className="bg-zinc-900 border border-zinc-800 p-4">
        <p className="text-xs text-zinc-400">
          Cancel anytime. Manage your subscription below.
        </p>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-3 gap-4">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`bg-zinc-900 border-2 p-6 relative transition-all hover:scale-105 ${
              plan.popular ? "border-current scale-105" : "border-zinc-800"
            }`}
            style={plan.popular ? { borderColor: plan.color } : {}}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span
                  className="text-black text-xs font-bold px-3 py-1 uppercase"
                  style={{ backgroundColor: plan.color }}
                >
                  Most Popular
                </span>
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-xl font-bold text-white" style={{ color: plan.color }}>
                {plan.name}
              </h3>
              <p className="text-xs text-zinc-400 uppercase tracking-wide font-medium mt-1">{plan.description}</p>
              <div className="mt-4">
                <span className="text-4xl font-bold text-white">{plan.price}</span>
                <span className="text-zinc-500 text-sm">/{plan.period}</span>
              </div>
            </div>

            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-zinc-300">
                  <div
                    className="w-4 h-4 border-2 flex items-center justify-center shrink-0"
                    style={{ borderColor: plan.color, backgroundColor: plan.color }}
                  >
                    <Check className="w-3 h-3 text-black stroke-[3]" />
                  </div>
                  {feature}
                </li>
              ))}
            </ul>

            <Button
              onClick={() => currentPlan !== plan.id && handleUpgrade(plan.stripeLink)}
              className={`w-full font-bold ${
                currentPlan === plan.id
                  ? "bg-zinc-800 text-zinc-400 cursor-not-allowed"
                  : "text-black hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
              }`}
              disabled={currentPlan === plan.id}
              style={
                currentPlan !== plan.id
                  ? {
                      backgroundColor: plan.color,
                      boxShadow: "4px 4px 0px 0px rgba(0,0,0,1)",
                    }
                  : {}
              }
            >
              {currentPlan === plan.id ? (
                "Current Plan"
              ) : (
                <>
                  Upgrade to {plan.name}
                  <ExternalLink className="ml-2 w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        ))}
      </div>

      {/* Payment Method */}
      <div className="bg-zinc-900 border border-zinc-800 p-6 space-y-4">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Payment Method</h3>

        <div className="flex items-center justify-between py-3 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <CreditCard className="w-5 h-5 text-zinc-400" />
            <div>
              <p className="text-sm text-white">Visa ending in 4242</p>
              <p className="text-xs text-zinc-500">Expires 12/25</p>
            </div>
          </div>
          <Button size="sm" variant="ghost" className="text-zinc-400 hover:text-white">
            Update
          </Button>
        </div>

        <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 bg-transparent">
          <CreditCard className="w-4 h-4 mr-2" />
          Add New Card
        </Button>
      </div>

      {/* Billing History */}
      <div className="bg-zinc-900 border border-zinc-800 p-6 space-y-4">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Billing History</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between py-3 border-b border-zinc-800 last:border-0">
            <div>
              <p className="text-sm text-white">December 15, 2024</p>
              <p className="text-xs text-zinc-500">{currentPlan} Plan</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-white">
                {plans.find((p) => p.id === currentPlan)?.price}/{plans.find((p) => p.id === currentPlan)?.period}
              </p>
              <Button size="sm" variant="ghost" className="text-zinc-400 hover:text-white h-auto p-0 text-xs">
                Download Invoice
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Manage Subscription */}
      <div className="bg-zinc-900 border border-zinc-800 p-6 space-y-4">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Manage Subscription</h3>
        <div className="flex gap-3">
          <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 bg-transparent">
            Update Billing Info
          </Button>
          <Button variant="outline" className="border-red-900 text-red-400 hover:bg-red-950/50 bg-transparent">
            Cancel Subscription
          </Button>
        </div>
        <p className="text-xs text-zinc-500">
          Need help? Contact our support team at{" "}
          <a href="mailto:billing@thesolopreneur.app" className="text-[#00ff88] hover:underline">
            billing@thesolopreneur.app
          </a>
        </p>
      </div>
    </div>
  )
}
