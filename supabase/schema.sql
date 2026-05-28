-- Supabase Schema for HazarAl Advanced Features

-- 1. Profiles Table (For Admins)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  role text default 'admin' check (role in ('admin', 'user')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Leads Table (For Quick Quotes and Contact Forms)
create table public.leads (
  id uuid default gen_random_uuid() primary key,
  brand text,
  model_year text,
  damage_type text,
  city text,
  phone text not null,
  source text default 'quick_quote', -- 'quick_quote', 'contact'
  status text default 'new' check (status in ('new', 'contacted', 'closed')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Cars Table (Marketplace for damaged cars)
create table public.cars (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  brand text not null,
  model text not null,
  model_year integer not null,
  damage_type text not null,
  price numeric not null,
  description text,
  images text[] default '{}',
  status text default 'available' check (status in ('available', 'sold', 'hidden')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Blogs Table
create table public.blogs (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text not null unique,
  excerpt text,
  content text not null,
  image_url text,
  locale text default 'tr' check (locale in ('tr', 'en')),
  status text default 'draft' check (status in ('draft', 'published')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security (RLS)

alter table public.profiles enable row level security;
alter table public.leads enable row level security;
alter table public.cars enable row level security;
alter table public.blogs enable row level security;

-- Profiles: Users can read their own profile. Service role/admins can read all.
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);

-- Leads: Anyone can insert (public forms). Only authenticated users (admins) can view/update.
create policy "Anyone can insert leads" on public.leads for insert with check (true);
create policy "Admins can view leads" on public.leads for select using (auth.role() = 'authenticated');
create policy "Admins can update leads" on public.leads for update using (auth.role() = 'authenticated');

-- Cars: Anyone can view available cars. Only admins can insert/update/delete.
create policy "Anyone can view available cars" on public.cars for select using (status = 'available' or auth.role() = 'authenticated');
create policy "Admins can insert cars" on public.cars for insert with check (auth.role() = 'authenticated');
create policy "Admins can update cars" on public.cars for update using (auth.role() = 'authenticated');
create policy "Admins can delete cars" on public.cars for delete using (auth.role() = 'authenticated');

-- Blogs: Anyone can view published blogs. Only admins can insert/update/delete.
create policy "Anyone can view published blogs" on public.blogs for select using (status = 'published' or auth.role() = 'authenticated');
create policy "Admins can insert blogs" on public.blogs for insert with check (auth.role() = 'authenticated');
create policy "Admins can update blogs" on public.blogs for update using (auth.role() = 'authenticated');
create policy "Admins can delete blogs" on public.blogs for delete using (auth.role() = 'authenticated');

-- Triggers for updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_cars_updated_at
  before update on public.cars
  for each row execute procedure public.handle_updated_at();

create trigger set_blogs_updated_at
  before update on public.blogs
  for each row execute procedure public.handle_updated_at();

-- Trigger to automatically create a profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'admin');
  return new;
end;
$$ language plpgsql;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
