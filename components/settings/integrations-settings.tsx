"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Check, ExternalLink, Loader2, Settings, X, AlertCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface Integration {
  id: string
  integration_type: string
  status: "active" | "inactive" | "error"
  config?: any
  last_synced_at?: string
  error_message?: string
  created_at: string
  updated_at: string
}

const availableIntegrations = [
  {
    id: "gmail",
    name: "Gmail",
    description: "Send and receive emails directly from the platform",
    icon: "📧",
    category: "Communication",
    requiresKey: true,
    keyLabel: "Pica Gmail Connection Key",
    keyPlaceholder: "Enter your Pica Gmail connection key",
  },
  {
    id: "google_calendar",
    name: "Google Calendar",
    description: "Sync meetings and events with your calendar",
    icon: "📅",
    category: "Communication",
    requiresKey: true,
    keyLabel: "Pica Google Calendar Connection Key",
    keyPlaceholder: "Enter your Pica Google Calendar connection key",
  },
  {
    id: "anthropic",
    name: "Claude (Anthropic)",
    description: "AI-powered assistance for research and content",
    icon: "🤖",
    category: "AI",
    requiresKey: true,
    keyLabel: "Pica Anthropic Connection Key",
    keyPlaceholder: "Enter your Pica Anthropic connection key",
  },
  {
    id: "perplexity",
    name: "Perplexity",
    description: "AI-powered web research and insights",
    icon: "🔍",
    category: "AI",
    requiresKey: true,
    keyLabel: "Pica Perplexity Connection Key",
    keyPlaceholder: "Enter your Pica Perplexity connection key",
  },
  {
    id: "google_maps",
    name: "Google Maps",
    description: "Lead discovery and location services",
    icon: "🗺️",
    category: "Services",
    requiresKey: true,
    keyLabel: "Google Maps API Key",
    keyPlaceholder: "Enter your Google Maps API key",
    envVar: "GOOGLE_MAPS_API_KEY",
  },
  {
    id: "slack",
    name: "Slack",
    description: "Get notifications and updates in Slack",
    icon: "💬",
    category: "Communication",
    requiresKey: false,
  },
  {
    id: "hubspot",
    name: "HubSpot",
    description: "Sync contacts and deals with HubSpot CRM",
    icon: "🎯",
    category: "CRM",
    requiresKey: false,
  },
  {
    id: "stripe",
    name: "Stripe",
    description: "Process payments and manage subscriptions",
    icon: "💳",
    category: "Payments",
    requiresKey: false,
  },
]

export function IntegrationsSettings() {
  const [loading, setLoading] = useState(true)
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [connecting, setConnecting] = useState<string | null>(null)
  const [configuring, setConfiguring] = useState<string | null>(null)
  const [connectionKey, setConnectionKey] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchIntegrations()
  }, [])

  async function fetchIntegrations() {
    try {
      setLoading(true)
      const response = await fetch("/api/integrations")
      const data = await response.json()

      if (data.error) {
        console.error("Error fetching integrations:", data.error)
        setError(data.error)
      } else {
        setIntegrations(data.integrations || [])
      }
    } catch (error) {
      console.error("Error fetching integrations:", error)
      setError("Failed to load integrations")
    } finally {
      setLoading(false)
    }
  }

  const isConnected = (type: string) => {
    return integrations.some((i) => i.integration_type === type && i.status === "active")
  }

  const getIntegration = (type: string) => {
    return integrations.find((i) => i.integration_type === type)
  }

  const categories = [...new Set(availableIntegrations.map((i) => i.category))]

  const handleConnect = async (integrationType: string) => {
    const integration = availableIntegrations.find((i) => i.id === integrationType)

    if (integration?.requiresKey) {
      setConfiguring(integrationType)
      setConnectionKey("")
      return
    }

    setConnecting(integrationType)
    try {
      const response = await fetch("/api/integrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          integration_type: integrationType,
        }),
      })

      const data = await response.json()

      if (data.success) {
        await fetchIntegrations()
      } else {
        alert(`Failed to connect: ${data.error}`)
      }
    } catch (error: any) {
      console.error("Error connecting integration:", error)
      alert(`Error: ${error.message}`)
    } finally {
      setConnecting(null)
    }
  }

  const handleSaveConnection = async (integrationType: string) => {
    if (!connectionKey.trim()) {
      alert("Please enter a connection key")
      return
    }

    setConnecting(integrationType)
    try {
      const response = await fetch("/api/integrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          integration_type: integrationType,
          connection_key: connectionKey,
        }),
      })

      const data = await response.json()

      if (data.success) {
        await fetchIntegrations()
        setConfiguring(null)
        setConnectionKey("")
      } else {
        alert(`Failed to connect: ${data.error}`)
      }
    } catch (error: any) {
      console.error("Error connecting integration:", error)
      alert(`Error: ${error.message}`)
    } finally {
      setConnecting(null)
    }
  }

  const handleDisconnect = async (integrationId: string) => {
    if (!confirm("Are you sure you want to disconnect this integration?")) {
      return
    }

    try {
      const response = await fetch(`/api/integrations/${integrationId}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        await fetchIntegrations()
      } else {
        alert(`Failed to disconnect: ${data.error}`)
      }
    } catch (error: any) {
      console.error("Error disconnecting integration:", error)
      alert(`Error: ${error.message}`)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white">Integrations</h2>
        <p className="text-sm text-zinc-400 mt-1">Connect your favorite tools and services</p>
      </div>

      {error && (
        <div className="bg-red-950/20 border border-red-900/50 p-4 flex items-center gap-3 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {categories.map((category) => (
        <div key={category} className="space-y-3">
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">{category}</h3>

          <div className="grid gap-3">
            {availableIntegrations
              .filter((i) => i.category === category)
              .map((availableIntegration) => {
                const connected = isConnected(availableIntegration.id)
                const integration = getIntegration(availableIntegration.id)
                const isConfiguring = configuring === availableIntegration.id
                const isConnecting = connecting === availableIntegration.id

                return (
                  <div
                    key={availableIntegration.id}
                    className="bg-zinc-900 border border-zinc-800 p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded bg-zinc-800 flex items-center justify-center text-2xl">
                          {availableIntegration.icon}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{availableIntegration.name}</p>
                          <p className="text-xs text-zinc-500">{availableIntegration.description}</p>
                          {integration?.error_message && (
                            <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              {integration.error_message}
                            </p>
                          )}
                        </div>
                      </div>

                      {connected ? (
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1.5 text-xs text-[#00ff88]">
                            <Check className="w-3.5 h-3.5" />
                            Connected
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-zinc-400 hover:text-white"
                            onClick={() => setConfiguring(availableIntegration.id)}
                          >
                            <Settings className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-400 hover:text-red-300"
                            onClick={() => integration && handleDisconnect(integration.id)}
                          >
                            <X className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleConnect(availableIntegration.id)}
                          disabled={isConnecting}
                          className="bg-zinc-800 text-white hover:bg-zinc-700"
                        >
                          {isConnecting ? (
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

                    {isConfiguring && (
                      <div className="border-t border-zinc-800 pt-3 space-y-3">
                        {availableIntegration.requiresKey && (
                          <div className="space-y-2">
                            <Label className="text-xs text-zinc-400">
                              {availableIntegration.keyLabel}
                            </Label>
                            <Input
                              type="password"
                              placeholder={availableIntegration.keyPlaceholder}
                              value={connectionKey}
                              onChange={(e) => setConnectionKey(e.target.value)}
                              className="bg-zinc-950 border-zinc-700 text-white"
                            />
                            <p className="text-xs text-zinc-500">
                              {availableIntegration.envVar ? (
                                <>Environment variable: {availableIntegration.envVar}</>
                              ) : (
                                <>Get your connection key from the Pica Platform dashboard</>
                              )}
                            </p>
                          </div>
                        )}

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleSaveConnection(availableIntegration.id)}
                            disabled={isConnecting}
                            className="bg-[#00ff88] text-black hover:bg-[#00ff88]/90"
                          >
                            {isConnecting ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              "Save"
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setConfiguring(null)}
                            disabled={isConnecting}
                            className="text-zinc-400 hover:text-white"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
          </div>
        </div>
      ))}

      <div className="border-t border-zinc-800 pt-6 mt-8">
        <h3 className="text-sm font-medium text-white mb-2">About Pica Platform</h3>
        <p className="text-xs text-zinc-400 leading-relaxed">
          Most integrations use the Pica Platform for secure API connections. To get your connection keys:
        </p>
        <ol className="text-xs text-zinc-400 mt-2 ml-4 space-y-1 list-decimal">
          <li>Visit the Pica Platform dashboard</li>
          <li>Create connections for the services you want to use</li>
          <li>Copy the connection keys and paste them above</li>
        </ol>
      </div>
    </div>
  )
}
