// CRM Type Definitions

export type CompanyStatus = "prospect" | "active" | "client" | "churned" | "archived"
export type DigitalPresenceScore = "poor" | "fair" | "good" | "excellent"
export type ContactStatus = "active" | "inactive" | "bounced" | "unsubscribed"
export type AuthorityLevel = "champion" | "influencer" | "decision_maker" | "economic_buyer" | "end_user"
export type LeadStatus = "new" | "contacted" | "qualified" | "unqualified" | "converted" | "lost"
export type ActivityType = "call" | "email" | "meeting" | "note" | "task" | "sms" | "linkedin_message"
export type ActivityDirection = "inbound" | "outbound"
export type CallOutcome = "connected" | "voicemail" | "no_answer" | "busy" | "wrong_number"
export type MeetingType = "in_person" | "video" | "phone"
export type EmailStatus = "sent" | "delivered" | "opened" | "clicked" | "bounced" | "replied"
export type ProjectStatus = "planning" | "in_progress" | "on_hold" | "completed" | "cancelled"
export type ProjectPriority = "low" | "medium" | "high" | "urgent"
export type DealStage = "qualification" | "discovery" | "proposal" | "negotiation" | "closed_won" | "closed_lost"
export type QualificationFramework = "bant" | "champ" | "gpctba" | "meddic"
export type SDRRecommendation = "high_priority" | "medium_priority" | "low_priority" | "not_a_fit"

export interface Company {
  id: string
  tenant_id: string
  name: string
  domain?: string
  industry?: string
  employee_count?: string
  annual_revenue?: string
  address?: string
  city?: string
  state?: string
  country?: string
  timezone?: string
  phone?: string
  email?: string
  linkedin_url?: string
  website_quality?: DigitalPresenceScore
  seo_score?: DigitalPresenceScore
  social_media_presence?: DigitalPresenceScore
  gmb_rating?: number
  status: CompanyStatus
  source?: string
  owner_id?: string
  tags: string[]
  custom_fields: Record<string, unknown>
  created_at: string
  updated_at: string
  // Relations (when joined)
  contacts?: Contact[]
  projects?: Project[]
  deals?: Deal[]
  activities?: Activity[]
  notes?: Note[]
  sdr_analysis?: SDRAnalysis
}

export interface Contact {
  id: string
  tenant_id: string
  company_id?: string
  first_name: string
  last_name?: string
  email?: string
  phone?: string
  mobile?: string
  job_title?: string
  department?: string
  linkedin_url?: string
  is_decision_maker: boolean
  authority_level?: AuthorityLevel
  status: ContactStatus
  owner_id?: string
  tags: string[]
  custom_fields: Record<string, unknown>
  avatar_url?: string
  created_at: string
  updated_at: string
  // Relations
  company?: Company
}

export interface Lead {
  id: string
  tenant_id: string
  converted_contact_id?: string
  converted_company_id?: string
  first_name?: string
  last_name?: string
  email?: string
  phone?: string
  company_name?: string
  job_title?: string
  website?: string
  source?: string
  source_detail?: string
  icp_fit_score?: number
  budget?: string
  authority?: string
  need?: string
  timeline?: string
  challenges?: string
  status: LeadStatus
  owner_id?: string
  tags: string[]
  custom_fields: Record<string, unknown>
  created_at: string
  updated_at: string
  // Relations
  sdr_analysis?: SDRAnalysis
}

export interface Activity {
  id: string
  tenant_id: string
  entity_type: "company" | "contact" | "lead" | "project" | "deal"
  entity_id: string
  company_id?: string
  contact_id?: string
  type: ActivityType
  direction?: ActivityDirection
  subject?: string
  description?: string
  duration_seconds?: number
  call_outcome?: CallOutcome
  meeting_type?: MeetingType
  meeting_location?: string
  scheduled_at?: string
  email_status?: EmailStatus
  owner_id?: string
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
  // Relations
  owner?: { id: string; full_name: string; avatar_url?: string }
  contact?: Contact
}

export interface Project {
  id: string
  tenant_id: string
  company_id?: string
  name: string
  description?: string
  status: ProjectStatus
  priority: ProjectPriority
  start_date?: string
  due_date?: string
  completed_at?: string
  budget_amount?: number
  budget_currency: string
  owner_id?: string
  tags: string[]
  custom_fields: Record<string, unknown>
  created_at: string
  updated_at: string
  // Relations
  company?: Company
}

export interface Deal {
  id: string
  tenant_id: string
  company_id?: string
  contact_id?: string
  project_id?: string
  name: string
  description?: string
  stage: DealStage
  probability: number
  amount: number
  currency: string
  expected_close_date?: string
  closed_at?: string
  loss_reason?: string
  owner_id?: string
  qualifying_activity_id?: string
  tags: string[]
  custom_fields: Record<string, unknown>
  created_at: string
  updated_at: string
  // Relations
  company?: Company
  contact?: Contact
  qualifying_activity?: Activity
}

export interface Note {
  id: string
  tenant_id: string
  entity_type: "company" | "contact" | "lead" | "project" | "deal"
  entity_id: string
  company_id?: string
  content: string
  is_pinned: boolean
  author_id: string
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
  // Relations
  author?: { id: string; full_name: string; avatar_url?: string }
}

export interface PainPoint {
  title: string
  description: string
  severity: "low" | "medium" | "high" | "critical"
  category: string
}

export interface SalesOpportunity {
  title: string
  description: string
  package_fit: "basic" | "standard" | "premium"
  priority: "low" | "medium" | "high"
}

export interface TalkingPoint {
  point: string
  context: string
  expected_impact: string
}

export interface AutomationOpportunity {
  title: string
  description: string
  roi_estimate: string
  implementation_effort: "low" | "medium" | "high"
}

export interface SDRAnalysis {
  id: string
  tenant_id: string
  company_id?: string
  lead_id?: string
  icp_match_score?: number
  icp_match_reasoning?: string
  website_analysis?: Record<string, unknown>
  seo_analysis?: Record<string, unknown>
  social_media_analysis?: Record<string, unknown>
  gmb_analysis?: Record<string, unknown>
  pain_points: PainPoint[]
  sales_opportunities: SalesOpportunity[]
  talking_points: TalkingPoint[]
  automation_opportunities: AutomationOpportunity[]
  qualification_framework?: QualificationFramework
  qualification_scores?: Record<string, unknown>
  recommendation?: SDRRecommendation
  recommendation_summary?: string
  agent_version?: string
  analysis_duration_ms?: number
  raw_data_sources?: Record<string, unknown>
  created_at: string
  updated_at: string
}
