-- Migration 003 - Phase 7 notifications
-- Normalizes hazaral_notifications to the Phase 7 table shape.

create table if not exists public.hazaral_notifications (
  id uuid primary key default gen_random_uuid(),
  dealer_id uuid references public.hazaral_dealers(id) on delete cascade,
  type text not null,
  title text not null,
  body text not null,
  listing_id uuid references public.hazaral_listings(id) on delete set null,
  is_read boolean default false,
  created_at timestamptz default now()
);

alter table public.hazaral_notifications
  add column if not exists body text;

alter table public.hazaral_notifications
  add column if not exists listing_id uuid references public.hazaral_listings(id) on delete set null;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'hazaral_notifications'
      and column_name = 'message'
  ) then
    execute 'update public.hazaral_notifications set body = message where body is null';
  end if;
end $$;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'hazaral_notifications'
      and column_name = 'data'
  ) then
    execute $sql$
      update public.hazaral_notifications
      set listing_id = (data->>'listing_id')::uuid
      where listing_id is null
        and data ? 'listing_id'
        and (data->>'listing_id') ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
    $sql$;
  end if;
end $$;

update public.hazaral_notifications
set body = coalesce(body, title, 'Bildirim')
where body is null;

alter table public.hazaral_notifications
  drop column if exists message,
  drop column if exists data;

alter table public.hazaral_notifications
  alter column type type text using type::text,
  alter column body set not null,
  alter column is_read set default false,
  alter column created_at set default now();

create index if not exists idx_hazaral_notifications_dealer_is_read
  on public.hazaral_notifications(dealer_id, is_read);

alter table public.hazaral_notifications enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'hazaral_notifications'
      and policyname = 'Dealers can read own notifications'
  ) then
    execute $policy$
      create policy "Dealers can read own notifications"
        on public.hazaral_notifications for select
        using (
          dealer_id in (
            select id from public.hazaral_dealers where user_id = auth.uid()
          )
        )
    $policy$;
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'hazaral_notifications'
      and policyname = 'Dealers can update own notifications'
  ) then
    execute $policy$
      create policy "Dealers can update own notifications"
        on public.hazaral_notifications for update
        using (
          dealer_id in (
            select id from public.hazaral_dealers where user_id = auth.uid()
          )
        )
    $policy$;
  end if;
end $$;
