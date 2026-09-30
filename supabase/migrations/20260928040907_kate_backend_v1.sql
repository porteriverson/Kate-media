create table public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create table public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  business_name text not null,
  email text not null,
  phone text,
  billing_address jsonb not null default '{}'::jsonb,
  notes text,
  stripe_customer_id text unique,
  stripe_sync_status text not null default 'pending'
    check (stripe_sync_status in ('pending', 'synced', 'failed')),
  stripe_sync_error text,
  created_by uuid not null references auth.users (id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint clients_billing_address_object check (jsonb_typeof(billing_address) = 'object')
);

create table public.invoices (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete restrict,
  stripe_invoice_id text unique,
  idempotency_key text unique,
  line_items jsonb not null default '[]'::jsonb,
  currency text,
  amount_due bigint,
  amount_paid bigint,
  hosted_invoice_url text,
  invoice_pdf_url text,
  status text not null default 'creating'
    check (status in ('creating', 'draft', 'open', 'payment_failed', 'paid', 'void', 'uncollectible', 'failed')),
  due_at timestamptz,
  sent_at timestamptz,
  paid_at timestamptz,
  failed_at timestamptz,
  error_message text,
  created_by uuid not null references auth.users (id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint invoices_line_items_array check (jsonb_typeof(line_items) = 'array')
);

create table public.contracts (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete restrict,
  invoice_id uuid references public.invoices (id) on delete set null,
  documenso_envelope_id text unique,
  template_envelope_id text,
  signer_name text not null,
  signer_email text not null,
  signing_url text,
  status text not null default 'creating'
    check (status in ('creating', 'draft', 'pending', 'opened', 'signed', 'completed', 'rejected', 'cancelled', 'expired', 'failed')),
  sent_at timestamptz,
  completed_at timestamptz,
  failed_at timestamptz,
  error_message text,
  created_by uuid not null references auth.users (id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.provider_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null check (provider in ('stripe', 'documenso')),
  external_event_id text not null,
  event_type text not null,
  resource_id text,
  payload jsonb not null,
  processing_status text not null default 'received'
    check (processing_status in ('received', 'processed', 'ignored', 'failed')),
  processing_error text,
  received_at timestamptz not null default now(),
  processed_at timestamptz,
  unique (provider, external_event_id)
);

create index clients_created_at_idx on public.clients (created_at desc);
create index clients_created_by_idx on public.clients (created_by);
create index invoices_client_id_idx on public.invoices (client_id);
create index invoices_created_at_idx on public.invoices (created_at desc);
create index invoices_status_idx on public.invoices (status);
create index invoices_created_by_idx on public.invoices (created_by);
create index contracts_client_id_idx on public.contracts (client_id);
create index contracts_invoice_id_idx on public.contracts (invoice_id);
create index contracts_created_at_idx on public.contracts (created_at desc);
create index contracts_created_by_idx on public.contracts (created_by);
create index provider_events_provider_received_at_idx
  on public.provider_events (provider, received_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger clients_set_updated_at
before update on public.clients
for each row execute function public.set_updated_at();

create trigger invoices_set_updated_at
before update on public.invoices
for each row execute function public.set_updated_at();

create trigger contracts_set_updated_at
before update on public.contracts
for each row execute function public.set_updated_at();

alter table public.admin_users enable row level security;
alter table public.clients enable row level security;
alter table public.invoices enable row level security;
alter table public.contracts enable row level security;
alter table public.provider_events enable row level security;

alter table public.admin_users force row level security;
alter table public.clients force row level security;
alter table public.invoices force row level security;
alter table public.contracts force row level security;
alter table public.provider_events force row level security;

create policy admin_users_select_own on public.admin_users
  for select to authenticated
  using (user_id = (select auth.uid()));

create policy clients_admin_select on public.clients
  for select to authenticated
  using (exists (
    select 1 from public.admin_users
    where admin_users.user_id = (select auth.uid())
  ));

create policy clients_admin_insert on public.clients
  for insert to authenticated
  with check (
    created_by = (select auth.uid())
    and exists (
      select 1 from public.admin_users
      where admin_users.user_id = (select auth.uid())
    )
  );

create policy clients_admin_update on public.clients
  for update to authenticated
  using (exists (
    select 1 from public.admin_users
    where admin_users.user_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.admin_users
    where admin_users.user_id = (select auth.uid())
  ));

create policy invoices_admin_select on public.invoices
  for select to authenticated
  using (exists (
    select 1 from public.admin_users
    where admin_users.user_id = (select auth.uid())
  ));

create policy invoices_admin_insert on public.invoices
  for insert to authenticated
  with check (
    created_by = (select auth.uid())
    and exists (
      select 1 from public.admin_users
      where admin_users.user_id = (select auth.uid())
    )
  );

create policy invoices_admin_update on public.invoices
  for update to authenticated
  using (exists (
    select 1 from public.admin_users
    where admin_users.user_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.admin_users
    where admin_users.user_id = (select auth.uid())
  ));

create policy contracts_admin_select on public.contracts
  for select to authenticated
  using (exists (
    select 1 from public.admin_users
    where admin_users.user_id = (select auth.uid())
  ));

create policy contracts_admin_insert on public.contracts
  for insert to authenticated
  with check (
    created_by = (select auth.uid())
    and exists (
      select 1 from public.admin_users
      where admin_users.user_id = (select auth.uid())
    )
  );

create policy contracts_admin_update on public.contracts
  for update to authenticated
  using (exists (
    select 1 from public.admin_users
    where admin_users.user_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.admin_users
    where admin_users.user_id = (select auth.uid())
  ));

create policy provider_events_admin_select on public.provider_events
  for select to authenticated
  using (exists (
    select 1 from public.admin_users
    where admin_users.user_id = (select auth.uid())
  ));

revoke all on public.admin_users from anon, authenticated;
revoke all on public.clients from anon, authenticated;
revoke all on public.invoices from anon, authenticated;
revoke all on public.contracts from anon, authenticated;
revoke all on public.provider_events from anon, authenticated;

grant select on public.admin_users to authenticated;
grant select, insert, update on public.clients to authenticated;
grant select, insert, update on public.invoices to authenticated;
grant select, insert, update on public.contracts to authenticated;
grant select on public.provider_events to authenticated;

revoke execute on function public.set_updated_at() from public, anon, authenticated;
