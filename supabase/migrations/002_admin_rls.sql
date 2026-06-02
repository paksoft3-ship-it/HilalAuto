-- ============================================================
-- Migration 002 — hazaral_profiles + is_admin() + admin RLS bypass
-- ============================================================

-- ─── 1. Create hazaral_profiles (was in schema.sql but never applied) ────────
create table if not exists public.hazaral_profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  role text not null default 'user' check (role in ('admin', 'user')),
  created_at timestamp with time zone default timezone('utc', now()) not null
);

alter table public.hazaral_profiles enable row level security;

create policy "Users can view own profile"
  on public.hazaral_profiles for select
  using (auth.uid() = id);

-- ─── 2. Seed the existing admin user ─────────────────────────────────────────
insert into public.hazaral_profiles (id, email, role)
values ('2111200c-0e65-41aa-8af8-5c874251a5ca', 'paksoft3@gmail.com', 'admin')
on conflict (id) do update set role = 'admin';

-- ─── 3. Fix trigger: new users default to 'user' (dealers should not be admin) ─
create or replace function public.hazaral_handle_new_user()
returns trigger as $$
begin
  insert into public.hazaral_profiles (id, email, role)
  values (new.id, new.email, 'user')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists hazaral_on_auth_user_created on auth.users;

create trigger hazaral_on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.hazaral_handle_new_user();

-- ─── 4. is_admin() helper ─────────────────────────────────────────────────────
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.hazaral_profiles
    where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer stable;

-- ─── 5. Admin bypass policies for hazaral_dealers ────────────────────────────
create policy "Admin can read all dealers"
  on public.hazaral_dealers for select
  using (public.is_admin());

create policy "Admin can update dealers"
  on public.hazaral_dealers for update
  using (public.is_admin());

create policy "Admin can delete dealers"
  on public.hazaral_dealers for delete
  using (public.is_admin());

-- ─── 6. Admin bypass policies for hazaral_listings ───────────────────────────
create policy "Admin can read all listings"
  on public.hazaral_listings for select
  using (public.is_admin());

create policy "Admin can update listings"
  on public.hazaral_listings for update
  using (public.is_admin());

create policy "Admin can delete listings"
  on public.hazaral_listings for delete
  using (public.is_admin());

create policy "Admin can insert listings"
  on public.hazaral_listings for insert
  with check (public.is_admin());

-- ─── 7. Admin bypass for analytics tables ────────────────────────────────────
create policy "Admin can read all listing_views"
  on public.hazaral_listing_views for select
  using (public.is_admin());

create policy "Admin can read all listing_contacts"
  on public.hazaral_listing_contacts for select
  using (public.is_admin());

create policy "Admin can read all dealer_messages"
  on public.hazaral_dealer_messages for select
  using (public.is_admin());

create policy "Admin can update dealer_messages"
  on public.hazaral_dealer_messages for update
  using (public.is_admin());

-- ─── 8. Admin bypass for notifications ───────────────────────────────────────
create policy "Admin can manage all notifications"
  on public.hazaral_notifications for all
  using (public.is_admin())
  with check (public.is_admin());

-- ─── 9. Admin bypass for subscription_plans ──────────────────────────────────
create policy "Admin can manage subscription_plans"
  on public.hazaral_subscription_plans for all
  using (public.is_admin())
  with check (public.is_admin());

-- ─── 10. Admin bypass for favorites ──────────────────────────────────────────
create policy "Admin can read all favorites"
  on public.hazaral_favorites for select
  using (public.is_admin());
