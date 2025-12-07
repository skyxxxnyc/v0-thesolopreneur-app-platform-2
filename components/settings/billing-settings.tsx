"use client"

import { Button } from "@/components/ui/button"
import { Check, CreditCard } from "lucide-react"

interface BillingSettingsProps {
  workspace: any
}

const plans = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    features: ["Up to 100 contacts", "Basic CRM features", "Email integration", "1 workspace"],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$29",
    period: "per month",
    features: [
      "Unlimited contacts",
      "Advanced CRM features",
      "AI-powered SDR agents",
      "5 workspaces",
      "Priority support",
    ],
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "$99",
    period: "per month",
    features: [
      "Everything in Pro",
      "Unlimited workspaces",
      "Custom integrations",
      "Dedicated support",
      "SLA guarantee",
    ],
  },
]

export function BillingSettings({ workspace }: BillingSettingsProps) {
  const currentPlan = workspace?.plan || "free"

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white">Billing</h2>
        <p className="text-sm text-zinc-400 mt-1">Manage your subscription and payment methods</p>
      </div>

      {/* Current Plan */}
      <div className="bg-zinc-900 border border-zinc-800 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-zinc-400">Current Plan</p>
            <p className="text-2xl font-bold text-white capitalize">{currentPlan}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-zinc-400">Next billing date</p>
            <p className="text-sm text-white">{currentPlan === "free" ? "N/A" : "January 15, 2025"}</p>
          </div>
        </div>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-3 gap-4">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`bg-zinc-900 border p-6 relative ${plan.popular ? "border-[#00ff88]" : "border-zinc-800"}`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-[#00ff88] text-black text-xs font-bold px-3 py-1">POPULAR</span>
              </div>
            )}

            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
              <div className="mt-2">
                <span className="text-3xl font-bold text-white">{plan.price}</span>
                <span className="text-zinc-500 text-sm">/{plan.period}</span>
              </div>
            </div>

            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-zinc-300">
                  <Check className="w-4 h-4 text-[#00ff88]" />
                  {feature}
                </li>
              ))}
            </ul>

            <Button
              className={`w-full ${
                currentPlan === plan.id
                  ? "bg-zinc-800 text-zinc-400 cursor-not-allowed"
                  : plan.popular
                    ? "bg-[#00ff88] text-black hover:bg-[#00ff88]/90"
                    : "bg-zinc-800 text-white hover:bg-zinc-700"
              }`}
              disabled={currentPlan === plan.id}
            >
              {currentPlan === plan.id ? "Current Plan" : "Upgrade"}
            </Button>
          </div>
        ))}
      </div>

      {/* Payment Method */}
      <div className="bg-zinc-900 border border-zinc-800 p-6 space-y-4">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Payment Method</h3>

        {currentPlan === "free" ? (
          <p className="text-sm text-zinc-400">Add a payment method to upgrade your plan</p>
        ) : (
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
        )}

        <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 bg-transparent">
          <CreditCard className="w-4 h-4 mr-2" />
          {currentPlan === "free" ? "Add Payment Method" : "Add New Card"}
        </Button>
      </div>
    </div>
  )
}
