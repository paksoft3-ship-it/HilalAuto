-- ============================================================
-- Migration 004 — Payments, Buyer Favorites, Admin Audit Logs
-- ============================================================

-- ─── Subscription payment requests/history ──────────────────

create table if not exists public.hazaral_subscription_payments (
  id uuid primary key default gen_random_uuid(),
  dealer_id uuid references public.hazaral_dealers(id) on delete cascade not null,
  plan_slug text not null check (plan_slug in ('basic', 'professional', 'premium')),
  provider text not null default 'manual',
  provider_reference text,
  provider_payment_id text,
  status text not null default 'pending'
    check (status in ('pending', 'checkout_created', 'paid', 'failed', 'cancelled', 'refunded')),
  amount integer not null,
  currency text not null default 'TRY',
  period_days integer not null default 30,
  checkout_url text,
  billing_name text,
  billing_email text,
  billing_phone text,
  paid_at timestamptz,
  expires_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_hazaral_subscription_payments_dealer
  on public.hazaral_subscription_payments(dealer_id, created_at desc);

create index if not exists idx_hazaral_subscription_payments_status
  on public.hazaral_subscription_payments(status, created_at desc);

create index if not exists idx_hazaral_subscription_payments_provider_ref
  on public.hazaral_subscription_payments(provider, provider_reference);

alter table public.hazaral_subscription_payments enable row level security;

create policy "Dealers can read own subscription payments"
  on public.hazaral_subscription_payments for select
  using (
    dealer_id in (
      select id from public.hazaral_dealers where user_id = auth.uid()
    )
  );

create policy "Admin can manage subscription payments"
  on public.hazaral_subscription_payments for all
  using (public.is_admin())
  with check (public.is_admin());

drop trigger if exists hazaral_subscription_payments_updated_at on public.hazaral_subscription_payments;
create trigger hazaral_subscription_payments_updated_at
  before update on public.hazaral_subscription_payments
  for each row execute procedure public.hazaral_set_updated_at();


-- ─── Buyer favorites reliability ─────────────────────────────

alter table public.hazaral_favorites
  add column if not exists updated_at timestamptz not null default timezone('utc', now());

create index if not exists idx_hazaral_favorites_listing_created
  on public.hazaral_favorites(listing_id, created_at desc);

drop trigger if exists hazaral_favorites_updated_at on public.hazaral_favorites;
create trigger hazaral_favorites_updated_at
  before update on public.hazaral_favorites
  for each row execute procedure public.hazaral_set_updated_at();

create or replace function public.hazaral_sync_listing_favorite_count()
returns trigger as $$
begin
  if TG_OP = 'INSERT' then
    update public.hazaral_listings
    set favorite_count = favorite_count + 1
    where id = NEW.listing_id;
    return NEW;
  elsif TG_OP = 'DELETE' then
    update public.hazaral_listings
    set favorite_count = greatest(favorite_count - 1, 0)
    where id = OLD.listing_id;
    return OLD;
  end if;
  return null;
end;
$$ language plpgsql;

drop trigger if exists hazaral_listing_favorite_count_sync on public.hazaral_favorites;
create trigger hazaral_listing_favorite_count_sync
  after insert or delete on public.hazaral_favorites
  for each row execute procedure public.hazaral_sync_listing_favorite_count();


-- ─── Admin audit logs ────────────────────────────────────────

create table if not exists public.hazaral_admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid references auth.users(id) on delete set null,
  admin_email text,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  dealer_id uuid references public.hazaral_dealers(id) on delete set null,
  listing_id uuid references public.hazaral_listings(id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_hazaral_admin_audit_logs_created
  on public.hazaral_admin_audit_logs(created_at desc);

create index if not exists idx_hazaral_admin_audit_logs_entity
  on public.hazaral_admin_audit_logs(entity_type, entity_id);

create index if not exists idx_hazaral_admin_audit_logs_admin
  on public.hazaral_admin_audit_logs(admin_user_id, created_at desc);

alter table public.hazaral_admin_audit_logs enable row level security;

create policy "Admin can read all audit logs"
  on public.hazaral_admin_audit_logs for select
  using (public.is_admin());

create policy "Admin can insert audit logs"
  on public.hazaral_admin_audit_logs for insert
  with check (public.is_admin());
