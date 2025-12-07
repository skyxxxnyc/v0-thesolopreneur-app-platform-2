"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, ExternalLink, Loader2 } from "lucide-react"

const integrations = [
  {
    id: "gmail",
    name: "Gmail",
    description: "Send and receive emails directly from the platform",
    icon: "/gmail-logo.png",
    connected: true,
    category: "Communication",
  },
  {
    id: "google-calendar",
    name: "Google Calendar",
    description: "Sync meetings and events with your calendar",
    icon: "/google-calendar-logo.png",
    connected: true,
    category: "Communication",
  },
  {
    id: "anthropic",
    name: "Claude (Anthropic)",
    description: "AI-powered assistance for research and content",
    icon: "/anthropic-claude-logo.png",
    connected: true,
    category: "AI",
  },
  {
    id: "perplexity",
    name: "Perplexity",
    description: "AI-powered web research and insights",
    icon: "/perplexity-ai-logo.png",
    connected: true,
    category: "AI",
  },
  {
    id: "slack",
    name: "Slack",
    description: "Get notifications and updates in Slack",
    icon: "/slack-logo.png",
    connected: false,
    category: "Communication",
  },
  {
    id: "hubspot",
    name: "HubSpot",
    description: "Sync contacts and deals with HubSpot CRM",
    icon: "/hubspot-logo.png",
    connected: false,
    category: "CRM",
  },
  {
    id: "stripe",
    name: "Stripe",
    description: "Process payments and manage subscriptions",
    icon: "/stripe-logo.png",
    connected: false,
    category: "Payments",
  },
  {
    id: "zapier",
    name: "Zapier",
    description: "Connect to 5000+ apps with automated workflows",
    icon: "/zapier-logo.png",
    connected: false,
    category: "Automation",
  },
]

export function IntegrationsSettings() {
  const [connecting, setConnecting] = useState<string | null>(null)

  const categories = [...new Set(integrations.map((i) => i.category))]

  const handleConnect = async (id: string) => {
    setConnecting(id)
    // Simulate connection
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setConnecting(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white">Integrations</h2>
        <p className="text-sm text-zinc-400 mt-1">Connect your favorite tools and services</p>
      </div>

      {categories.map((category) => (
        <div key={category} className="space-y-3">
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">{category}</h3>

          <div className="grid gap-3">
            {integrations
              .filter((i) => i.category === category)
              .map((integration) => (
                <div
                  key={integration.id}
                  className="bg-zinc-900 border border-zinc-800 p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={integration.icon || "/placeholder.svg"}
                      alt={integration.name}
                      className="w-10 h-10 rounded"
                    />
                    <div>
                      <p className="text-sm font-medium text-white">{integration.name}</p>
                      <p className="text-xs text-zinc-500">{integration.description}</p>
                    </div>
                  </div>

                  {integration.connected ? (
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1.5 text-xs text-[#00ff88]">
                        <Check className="w-3.5 h-3.5" />
                        Connected
                      </span>
                      <Button size="sm" variant="ghost" className="text-zinc-400 hover:text-white">
                        Configure
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => handleConnect(integration.id)}
                      disabled={connecting === integration.id}
                      className="bg-zinc-800 text-white hover:bg-zinc-700"
                    >
                      {connecting === integration.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          Connect
                          <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                        </>
                      )}
                    </Button>
                  )}
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  )
}
