export interface Funnel {
  id: string
  tenant_id: string
  name: string
  slug: string
  description: string | null
  status: "draft" | "published" | "archived"
  template_id: string | null
  settings: FunnelSettings
  custom_domain: string | null
  created_by: string | null
  created_at: string
  updated_at: string
  published_at: string | null
  pages?: FunnelPage[]
}

export interface FunnelSettings {
  favicon?: string
  font_family?: string
  primary_color?: string
  background_color?: string
  tracking_id?: string
  custom_css?: string
  custom_head?: string
  redirect_url?: string
}

export interface FunnelPage {
  id: string
  funnel_id: string
  name: string
  slug: string
  page_order: number
  content: PageContent
  seo_title: string | null
  seo_description: string | null
  og_image: string | null
  created_at: string
  updated_at: string
}

export interface PageContent {
  blocks: PageBlock[]
}

export interface PageBlock {
  id: string
  type: BlockType
  props: Record<string, unknown>
  children?: PageBlock[]
}

export type BlockType =
  | "hero"
  | "text"
  | "heading"
  | "image"
  | "video"
  | "button"
  | "form"
  | "testimonial"
  | "features"
  | "pricing"
  | "faq"
  | "countdown"
  | "divider"
  | "spacer"
  | "columns"
  | "container"

export interface FunnelSubmission {
  id: string
  funnel_id: string
  page_id: string | null
  tenant_id: string
  data: Record<string, unknown>
  source_url: string | null
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  ip_address: string | null
  user_agent: string | null
  lead_id: string | null
  created_at: string
}

export interface FunnelAnalytics {
  id: string
  funnel_id: string
  page_id: string | null
  event_type: "view" | "click" | "submit" | "conversion"
  visitor_id: string | null
  session_id: string | null
  referrer: string | null
  metadata: Record<string, unknown>
  created_at: string
}

// Template definitions
export interface FunnelTemplate {
  id: string
  name: string
  description: string
  category: "lead-gen" | "webinar" | "sales" | "opt-in" | "coming-soon"
  thumbnail: string
  pages: Omit<FunnelPage, "id" | "funnel_id" | "created_at" | "updated_at">[]
}
