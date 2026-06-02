-- ============================================================
-- Migration 005 — Legacy Content Tables
-- Restores old admin/public surfaces that still use:
-- hazaral_leads, hazaral_cars, hazaral_blogs
-- ============================================================

-- ─── Shared updated_at trigger helper ───────────────────────

create or replace function public.hazaral_set_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$ language plpgsql;


-- ─── Lead generation forms ──────────────────────────────────

create table if not exists public.hazaral_leads (
  id uuid default gen_random_uuid() primary key,
  brand text,
  model_year text,
  damage_type text,
  city text,
  phone text not null,
  source text default 'quick_quote',
  status text default 'new',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.hazaral_leads
  add column if not exists brand text,
  add column if not exists model_year text,
  add column if not exists damage_type text,
  add column if not exists city text,
  add column if not exists phone text,
  add column if not exists source text default 'quick_quote',
  add column if not exists status text default 'new',
  add column if not exists created_at timestamp with time zone default timezone('utc'::text, now()) not null;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'hazaral_leads_status_check'
      and conrelid = 'public.hazaral_leads'::regclass
  ) then
    alter table public.hazaral_leads
      add constraint hazaral_leads_status_check
      check (status in ('new', 'contacted', 'closed'));
  end if;
end $$;

create index if not exists idx_hazaral_leads_created_at
  on public.hazaral_leads(created_at desc);

create index if not exists idx_hazaral_leads_status
  on public.hazaral_leads(status, created_at desc);

alter table public.hazaral_leads enable row level security;

drop policy if exists "Anyone can insert leads" on public.hazaral_leads;
drop policy if exists "Admins can view leads" on public.hazaral_leads;
drop policy if exists "Admins can update leads" on public.hazaral_leads;
drop policy if exists "Admins can delete leads" on public.hazaral_leads;
drop policy if exists "Public can insert legacy leads" on public.hazaral_leads;
drop policy if exists "Admin can read legacy leads" on public.hazaral_leads;
drop policy if exists "Admin can update legacy leads" on public.hazaral_leads;
drop policy if exists "Admin can delete legacy leads" on public.hazaral_leads;

create policy "Public can insert legacy leads"
  on public.hazaral_leads for insert
  with check (true);

create policy "Admin can read legacy leads"
  on public.hazaral_leads for select
  using (public.is_admin());

create policy "Admin can update legacy leads"
  on public.hazaral_leads for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admin can delete legacy leads"
  on public.hazaral_leads for delete
  using (public.is_admin());


-- ─── Legacy marketplace cars ────────────────────────────────

create table if not exists public.hazaral_cars (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  brand text not null,
  model text not null,
  model_year integer not null,
  damage_type text not null,
  price numeric not null,
  description text,
  images text[] default '{}',
  status text default 'available',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.hazaral_cars
  add column if not exists title text,
  add column if not exists brand text,
  add column if not exists model text,
  add column if not exists model_year integer,
  add column if not exists damage_type text,
  add column if not exists price numeric,
  add column if not exists description text,
  add column if not exists images text[] default '{}',
  add column if not exists status text default 'available',
  add column if not exists created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  add column if not exists updated_at timestamp with time zone default timezone('utc'::text, now()) not null;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'hazaral_cars_status_check'
      and conrelid = 'public.hazaral_cars'::regclass
  ) then
    alter table public.hazaral_cars
      add constraint hazaral_cars_status_check
      check (status in ('available', 'sold', 'hidden'));
  end if;
end $$;

create index if not exists idx_hazaral_cars_status_created_at
  on public.hazaral_cars(status, created_at desc);

create index if not exists idx_hazaral_cars_brand_model
  on public.hazaral_cars(brand, model);

alter table public.hazaral_cars enable row level security;

drop trigger if exists hazaral_set_cars_updated_at on public.hazaral_cars;
create trigger hazaral_set_cars_updated_at
  before update on public.hazaral_cars
  for each row execute procedure public.hazaral_set_updated_at();

drop policy if exists "Anyone can view available cars" on public.hazaral_cars;
drop policy if exists "Admins can insert cars" on public.hazaral_cars;
drop policy if exists "Admins can update cars" on public.hazaral_cars;
drop policy if exists "Admins can delete cars" on public.hazaral_cars;
drop policy if exists "Public can read available legacy cars" on public.hazaral_cars;
drop policy if exists "Admin can insert legacy cars" on public.hazaral_cars;
drop policy if exists "Admin can update legacy cars" on public.hazaral_cars;
drop policy if exists "Admin can delete legacy cars" on public.hazaral_cars;

create policy "Public can read available legacy cars"
  on public.hazaral_cars for select
  using (status = 'available' or public.is_admin());

create policy "Admin can insert legacy cars"
  on public.hazaral_cars for insert
  with check (public.is_admin());

create policy "Admin can update legacy cars"
  on public.hazaral_cars for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admin can delete legacy cars"
  on public.hazaral_cars for delete
  using (public.is_admin());


-- ─── Blog content ───────────────────────────────────────────

create table if not exists public.hazaral_blogs (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text not null,
  excerpt text,
  content text not null,
  image_url text,
  locale text default 'tr',
  status text default 'draft',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.hazaral_blogs
  add column if not exists title text,
  add column if not exists slug text,
  add column if not exists excerpt text,
  add column if not exists content text,
  add column if not exists image_url text,
  add column if not exists locale text default 'tr',
  add column if not exists status text default 'draft',
  add column if not exists created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  add column if not exists updated_at timestamp with time zone default timezone('utc'::text, now()) not null;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'hazaral_blogs_locale_check'
      and conrelid = 'public.hazaral_blogs'::regclass
  ) then
    alter table public.hazaral_blogs
      add constraint hazaral_blogs_locale_check
      check (locale in ('tr', 'en'));
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'hazaral_blogs_status_check'
      and conrelid = 'public.hazaral_blogs'::regclass
  ) then
    alter table public.hazaral_blogs
      add constraint hazaral_blogs_status_check
      check (status in ('draft', 'published'));
  end if;
end $$;

create unique index if not exists idx_hazaral_blogs_slug
  on public.hazaral_blogs(slug);

create index if not exists idx_hazaral_blogs_locale_status_created_at
  on public.hazaral_blogs(locale, status, created_at desc);

alter table public.hazaral_blogs enable row level security;

drop trigger if exists hazaral_set_blogs_updated_at on public.hazaral_blogs;
create trigger hazaral_set_blogs_updated_at
  before update on public.hazaral_blogs
  for each row execute procedure public.hazaral_set_updated_at();

drop policy if exists "Anyone can view published blogs" on public.hazaral_blogs;
drop policy if exists "Admins can insert blogs" on public.hazaral_blogs;
drop policy if exists "Admins can update blogs" on public.hazaral_blogs;
drop policy if exists "Admins can delete blogs" on public.hazaral_blogs;
drop policy if exists "Public can read published legacy blogs" on public.hazaral_blogs;
drop policy if exists "Admin can insert legacy blogs" on public.hazaral_blogs;
drop policy if exists "Admin can update legacy blogs" on public.hazaral_blogs;
drop policy if exists "Admin can delete legacy blogs" on public.hazaral_blogs;

create policy "Public can read published legacy blogs"
  on public.hazaral_blogs for select
  using (status = 'published' or public.is_admin());

create policy "Admin can insert legacy blogs"
  on public.hazaral_blogs for insert
  with check (public.is_admin());

create policy "Admin can update legacy blogs"
  on public.hazaral_blogs for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admin can delete legacy blogs"
  on public.hazaral_blogs for delete
  using (public.is_admin());


-- Force PostgREST to refresh the schema cache after creating these tables.
notify pgrst, 'reload schema';
