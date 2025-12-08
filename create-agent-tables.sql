-- AI Agent Database Tables
-- Run this in Supabase SQL Editor

-- 1. SDR Analyses Table (stores lead analysis results)
CREATE TABLE IF NOT EXISTS sdr_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,

  -- Scores
  icp_score INTEGER CHECK (icp_score >= 0 AND icp_score <= 100),
  digital_presence_score INTEGER CHECK (digital_presence_score >= 0 AND digital_presence_score <= 100),

  -- Analysis Results (JSON arrays)
  pain_points JSONB DEFAULT '[]'::jsonb,
  sales_opportunities JSONB DEFAULT '[]'::jsonb,
  talking_points JSONB DEFAULT '[]'::jsonb,
  automation_opportunities JSONB DEFAULT '[]'::jsonb,
  qualification_data JSONB DEFAULT '{}'::jsonb,

  -- Full AI response
  raw_analysis JSONB DEFAULT '{}'::jsonb,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Ensure one analysis per lead
  UNIQUE(lead_id)
);

-- Index for tenant queries
CREATE INDEX IF NOT EXISTS idx_sdr_analyses_tenant ON sdr_analyses(tenant_id);
CREATE INDEX IF NOT EXISTS idx_sdr_analyses_lead ON sdr_analyses(lead_id);
CREATE INDEX IF NOT EXISTS idx_sdr_analyses_score ON sdr_analyses(icp_score DESC);

-- RLS Policies for sdr_analyses
ALTER TABLE sdr_analyses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view analyses for their tenants" ON sdr_analyses;
CREATE POLICY "Users can view analyses for their tenants"
ON sdr_analyses
FOR SELECT
TO authenticated
USING (tenant_id IN (SELECT public.user_tenant_ids()));

DROP POLICY IF EXISTS "Users can insert analyses for their tenants" ON sdr_analyses;
CREATE POLICY "Users can insert analyses for their tenants"
ON sdr_analyses
FOR INSERT
TO authenticated
WITH CHECK (tenant_id IN (SELECT public.user_tenant_ids()));

DROP POLICY IF EXISTS "Users can update analyses for their tenants" ON sdr_analyses;
CREATE POLICY "Users can update analyses for their tenants"
ON sdr_analyses
FOR UPDATE
TO authenticated
USING (tenant_id IN (SELECT public.user_tenant_ids()))
WITH CHECK (tenant_id IN (SELECT public.user_tenant_ids()));

-- 2. Agent Runs Table (tracks agent execution jobs)
CREATE TABLE IF NOT EXISTS agent_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,

  -- Agent info
  agent_type TEXT NOT NULL CHECK (agent_type IN ('sdr', 'enrichment', 'outreach', 'followup')),

  -- Execution details
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed', 'cancelled')),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,

  -- Task tracking
  total_tasks INTEGER DEFAULT 0,
  completed_tasks INTEGER DEFAULT 0,
  failed_tasks INTEGER DEFAULT 0,

  -- Configuration
  config JSONB DEFAULT '{}'::jsonb,

  -- Results
  result JSONB DEFAULT '{}'::jsonb,
  error TEXT,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_agent_runs_tenant ON agent_runs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_agent_runs_type ON agent_runs(agent_type);
CREATE INDEX IF NOT EXISTS idx_agent_runs_status ON agent_runs(status);
CREATE INDEX IF NOT EXISTS idx_agent_runs_created ON agent_runs(created_at DESC);

-- RLS for agent_runs
ALTER TABLE agent_runs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view runs for their tenants" ON agent_runs;
CREATE POLICY "Users can view runs for their tenants"
ON agent_runs
FOR SELECT
TO authenticated
USING (tenant_id IN (SELECT public.user_tenant_ids()));

DROP POLICY IF EXISTS "Users can insert runs for their tenants" ON agent_runs;
CREATE POLICY "Users can insert runs for their tenants"
ON agent_runs
FOR INSERT
TO authenticated
WITH CHECK (tenant_id IN (SELECT public.user_tenant_ids()));

DROP POLICY IF EXISTS "Users can update runs for their tenants" ON agent_runs;
CREATE POLICY "Users can update runs for their tenants"
ON agent_runs
FOR UPDATE
TO authenticated
USING (tenant_id IN (SELECT public.user_tenant_ids()));

-- 3. Agent Tasks Table (individual tasks within a run)
CREATE TABLE IF NOT EXISTS agent_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID NOT NULL REFERENCES agent_runs(id) ON DELETE CASCADE,

  -- Task details
  task_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed', 'skipped')),

  -- Target
  entity_type TEXT CHECK (entity_type IN ('lead', 'contact', 'company', 'deal')),
  entity_id UUID,

  -- Execution
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,

  -- Results
  input JSONB DEFAULT '{}'::jsonb,
  output JSONB DEFAULT '{}'::jsonb,
  error TEXT,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_agent_tasks_run ON agent_tasks(run_id);
CREATE INDEX IF NOT EXISTS idx_agent_tasks_status ON agent_tasks(status);
CREATE INDEX IF NOT EXISTS idx_agent_tasks_entity ON agent_tasks(entity_type, entity_id);

-- RLS for agent_tasks (inherited from run)
ALTER TABLE agent_tasks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view tasks for their runs" ON agent_tasks;
CREATE POLICY "Users can view tasks for their runs"
ON agent_tasks
FOR SELECT
TO authenticated
USING (
  run_id IN (
    SELECT id FROM agent_runs
    WHERE tenant_id IN (SELECT public.user_tenant_ids())
  )
);

DROP POLICY IF EXISTS "Users can insert tasks for their runs" ON agent_tasks;
CREATE POLICY "Users can insert tasks for their runs"
ON agent_tasks
FOR INSERT
TO authenticated
WITH CHECK (
  run_id IN (
    SELECT id FROM agent_runs
    WHERE tenant_id IN (SELECT public.user_tenant_ids())
  )
);

DROP POLICY IF EXISTS "Users can update tasks for their runs" ON agent_tasks;
CREATE POLICY "Users can update tasks for their runs"
ON agent_tasks
FOR UPDATE
TO authenticated
USING (
  run_id IN (
    SELECT id FROM agent_runs
    WHERE tenant_id IN (SELECT public.user_tenant_ids())
  )
);

-- 4. Update existing tables with agent-related fields
-- Add enrichment fields to companies if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'companies' AND column_name = 'enrichment_data') THEN
    ALTER TABLE companies ADD COLUMN enrichment_data JSONB DEFAULT '{}'::jsonb;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'companies' AND column_name = 'enriched_at') THEN
    ALTER TABLE companies ADD COLUMN enriched_at TIMESTAMPTZ;
  END IF;
END $$;

-- Success message
SELECT 'Agent tables created successfully!' as message;
