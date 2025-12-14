-- Create integrations table
create table if not exists public.integrations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.tenants(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  integration_type text not null, -- 'gmail', 'google_calendar', 'anthropic', 'perplexity', etc.
  connection_key text, -- Pica connection key (if applicable)
  credentials jsonb, -- Encrypted credentials
  config jsonb default '{}'::jsonb, -- Integration-specific configuration
  status text default 'active' check (status in ('active', 'inactive', 'error')),
  last_synced_at timestamptz,
  error_message text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(tenant_id, integration_type)
);

-- Create index for faster lookups
create index if not exists integrations_tenant_id_idx on public.integrations(tenant_id);
create index if not exists integrations_user_id_idx on public.integrations(user_id);
create index if not exists integrations_type_idx on public.integrations(integration_type);

-- Enable RLS
alter table public.integrations enable row level security;

-- RLS Policies
create policy "Users can view integrations in their tenant"
  on public.integrations for select
  using (
    tenant_id in (
      select tenant_id from public.tenant_members
      where user_id = auth.uid()
    )
  );

create policy "Users can insert integrations in their tenant"
  on public.integrations for insert
  with check (
    tenant_id in (
      select tenant_id from public.tenant_members
      where user_id = auth.uid()
    )
  );

create policy "Users can update integrations in their tenant"
  on public.integrations for update
  using (
    tenant_id in (
      select tenant_id from public.tenant_members
      where user_id = auth.uid()
    )
  );

create policy "Users can delete integrations in their tenant"
  on public.integrations for delete
  using (
    tenant_id in (
      select tenant_id from public.tenant_members
      where user_id = auth.uid()
    )
  );

-- Create function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create trigger for updated_at
create trigger update_integrations_updated_at
  before update on public.integrations
  for each row
  execute function update_updated_at_column();
