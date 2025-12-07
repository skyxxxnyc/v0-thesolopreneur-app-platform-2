export interface AgentJob {
  id: string
  agentType: "sdr" | "enrichment" | "outreach" | "followup"
  status: "pending" | "processing" | "completed" | "failed"
  input: Record<string, unknown>
  output?: Record<string, unknown>
  error?: string
  createdAt: string
  completedAt?: string
}

export interface ICPDefinition {
  id: string
  name: string
  industry: string[]
  companySize: {
    min: number
    max: number
  }
  criteria: string[]
  disqualifiers: string[]
  active: boolean
}

export interface AgentConfig {
  id: string
  agentType: "sdr" | "enrichment" | "outreach" | "followup"
  enabled: boolean
  settings: Record<string, unknown>
}
