export type CampaignType = "email" | "multi_channel" | "nurture" | "outbound"
export type CampaignStatus = "draft" | "active" | "paused" | "completed" | "archived"
export type StepType = "email" | "call" | "linkedin" | "sms" | "task" | "wait" | "condition"
export type EnrollmentStatus = "active" | "paused" | "completed" | "bounced" | "unsubscribed" | "replied"

export interface Campaign {
  id: string
  tenant_id: string
  name: string
  description: string | null
  type: CampaignType
  status: CampaignStatus
  target_segment: Record<string, unknown>
  exclude_segment: Record<string, unknown>
  start_date: string | null
  end_date: string | null
  send_window_start: string
  send_window_end: string
  send_days: number[]
  timezone: string
  daily_limit: number
  respect_unsubscribes: boolean
  stop_on_reply: boolean
  stop_on_meeting: boolean
  enrolled_count: number
  completed_count: number
  replied_count: number
  meeting_count: number
  bounce_count: number
  created_by: string | null
  created_at: string
  updated_at: string
  steps?: CampaignStep[]
}

export interface CampaignStep {
  id: string
  campaign_id: string
  step_order: number
  step_type: StepType
  name: string | null
  delay_days: number
  delay_hours: number
  subject: string | null
  body: string | null
  template_id: string | null
  condition_type: string | null
  condition_value: Record<string, unknown> | null
  true_step_id: string | null
  false_step_id: string | null
  ai_personalize: boolean
  ai_variation_count: number
  sent_count: number
  open_count: number
  click_count: number
  reply_count: number
  created_at: string
  updated_at: string
}

export interface CampaignEnrollment {
  id: string
  campaign_id: string
  contact_id: string | null
  lead_id: string | null
  company_id: string | null
  status: EnrollmentStatus
  current_step_id: string | null
  next_action_at: string | null
  enrolled_at: string
  completed_at: string | null
  last_activity_at: string | null
  emails_sent: number
  emails_opened: number
  links_clicked: number
  replies_received: number
  metadata: Record<string, unknown>
}

export interface EmailTemplate {
  id: string
  tenant_id: string
  name: string
  subject: string
  body: string
  category: string | null
  variables: string[]
  use_count: number
  avg_open_rate: number | null
  avg_reply_rate: number | null
  created_by: string | null
  created_at: string
  updated_at: string
}
