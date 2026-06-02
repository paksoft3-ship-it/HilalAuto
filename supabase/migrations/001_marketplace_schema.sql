-- ============================================================
-- Otograde Marketplace Schema — Phase 1
-- Run order: enums → tables → indexes → RLS → triggers → seed
-- ============================================================

-- ─── ENUM TYPES ─────────────────────────────────────────────

create type public.dealer_subscription_status as enum (
  'pending', 'active', 'suspended', 'expired'
);

create type public.dealer_subscription_plan as enum (
  'basic', 'professional', 'premium'
);

create type public.listing_status as enum (
  'draft', 'pending_review', 'active', 'sold', 'rejected', 'expired'
);

create type public.fuel_type as enum (
  'benzin', 'dizel', 'lpg', 'elektrik', 'hibrit'
);

create type public.transmission_type as enum (
  'manuel', 'otomatik'
);

create type public.damage_grade as enum (
  'A', 'B', 'C', 'D', 'E'
);

create type public.contact_type as enum (
  'whatsapp', 'phone', 'message'
);

create type public.device_type as enum (
  'mobile', 'tablet', 'desktop'
);

create type public.notification_type as enum (
  'listing_approved',
  'listing_rejected',
  'new_message',
  'subscription_expiring',
  'subscription_expired',
  'listing_featured',
  'new_dealer_application',
  'new_listing_review'
);


-- ─── TABLE: dealers ──────────────────────────────────────────

create table public.hazaral_dealers (
  id                    uuid default gen_random_uuid() primary key,
  user_id               uuid references auth.users on delete cascade not null unique,
  company_name          text not null,
  contact_name          text not null,
  phone                 text not null,
  whatsapp              text,
  email                 text not null,
  city                  text not null,
  district              text,
  logo_url              text,
  description           text,
  slug                  text unique,           -- e.g. "abc-oto-galeri-istanbul"

  subscription_status   public.dealer_subscription_status not null default 'pending',
  subscription_plan     public.dealer_subscription_plan,
  subscription_start    timestamp with time zone,
  subscription_end      timestamp with time zone,

  is_approved           boolean not null default false,
  is_verified           boolean not null default false,  -- "Onaylı Bayi" badge

  total_listings        integer not null default 0,
  total_views           integer not null default 0,
  total_contacts        integer not null default 0,

  notes                 text,    -- internal admin notes

  created_at            timestamp with time zone default timezone('utc', now()) not null,
  updated_at            timestamp with time zone default timezone('utc', now()) not null
);


-- ─── TABLE: subscription_plans ───────────────────────────────

create table public.hazaral_subscription_plans (
  id                     uuid default gen_random_uuid() primary key,
  name                   text not null,                  -- Basic | Professional | Premium
  slug                   text not null unique,
  price_monthly          integer not null,               -- TL, 0 = free
  max_listings           integer not null default 5,     -- -1 = unlimited
  listing_duration_days  integer not null default 30,
  can_feature_listings   boolean not null default false,
  featured_slots         integer not null default 0,
  can_see_analytics      boolean not null default false,
  has_verified_badge     boolean not null default false,
  has_priority_support   boolean not null default false,
  is_active              boolean not null default true,
  sort_order             integer not null default 0,
  created_at             timestamp with time zone default timezone('utc', now()) not null
);


-- ─── TABLE: listings ─────────────────────────────────────────

create table public.hazaral_listings (
  id                   uuid default gen_random_uuid() primary key,
  dealer_id            uuid references public.hazaral_dealers(id) on delete cascade not null,
  slug                 text unique not null,

  status               public.listing_status not null default 'draft',

  title                text not null,
  brand                text not null,
  model                text not null,
  year                 integer not null,
  fuel_type            public.fuel_type,
  transmission         public.transmission_type,
  km                   integer,
  color                text,
  city                 text not null,
  district             text,

  damage_type          text[] not null default '{}',
  damage_grade         public.damage_grade,
  damage_description   text,

  has_tramer           boolean not null default false,
  tramer_amount        integer,                          -- TL

  asking_price         integer not null,
  is_price_negotiable  boolean not null default false,

  is_featured          boolean not null default false,
  featured_until       timestamp with time zone,

  images               text[] not null default '{}',
  primary_image        text,

  view_count           integer not null default 0,
  whatsapp_click_count integer not null default 0,
  phone_click_count    integer not null default 0,
  favorite_count       integer not null default 0,

  locale               text not null default 'tr',
  plate_hidden         boolean not null default true,

  rejection_reason     text,   -- admin sets when rejecting

  created_at           timestamp with time zone default timezone('utc', now()) not null,
  updated_at           timestamp with time zone default timezone('utc', now()) not null,
  sold_at              timestamp with time zone,
  expires_at           timestamp with time zone
);


-- ─── TABLE: listing_views ────────────────────────────────────

create table public.hazaral_listing_views (
  id                  uuid default gen_random_uuid() primary key,
  listing_id          uuid references public.hazaral_listings(id) on delete cascade not null,
  dealer_id           uuid references public.hazaral_dealers(id) on delete cascade not null,

  viewer_ip           text,                     -- SHA-256 hashed before insert
  viewer_city         text,
  device_type         public.device_type,

  referrer            text,
  utm_source          text,
  utm_medium          text,
  utm_campaign        text,
  session_id          text,

  time_on_page        integer default 0,        -- seconds
  scrolled_percent    integer default 0,        -- 0-100
  clicked_whatsapp    boolean not null default false,
  clicked_phone       boolean not null default false,
  clicked_favorite    boolean not null default false,
  viewed_images_count integer not null default 0,

  created_at          timestamp with time zone default timezone('utc', now()) not null
);


-- ─── TABLE: listing_contacts ─────────────────────────────────

create table public.hazaral_listing_contacts (
  id              uuid default gen_random_uuid() primary key,
  listing_id      uuid references public.hazaral_listings(id) on delete cascade not null,
  dealer_id       uuid references public.hazaral_dealers(id) on delete cascade not null,

  contact_type    public.contact_type not null,
  contact_name    text,
  contact_phone   text,
  contact_message text,

  viewer_ip       text,                         -- SHA-256 hashed
  device_type     public.device_type,
  referrer        text,
  utm_source      text,
  utm_medium      text,
  session_id      text,

  created_at      timestamp with time zone default timezone('utc', now()) not null
);


-- ─── TABLE: dealer_messages ──────────────────────────────────

create table public.hazaral_dealer_messages (
  id            uuid default gen_random_uuid() primary key,
  listing_id    uuid references public.hazaral_listings(id) on delete cascade not null,
  dealer_id     uuid references public.hazaral_dealers(id) on delete cascade not null,

  sender_name   text not null,
  sender_phone  text not null,
  sender_email  text,
  message       text not null,

  is_read       boolean not null default false,
  replied_at    timestamp with time zone,

  created_at    timestamp with time zone default timezone('utc', now()) not null
);


-- ─── TABLE: favorites ────────────────────────────────────────

create table public.hazaral_favorites (
  id          uuid default gen_random_uuid() primary key,
  listing_id  uuid references public.hazaral_listings(id) on delete cascade not null,
  session_id  text not null,
  created_at  timestamp with time zone default timezone('utc', now()) not null,

  unique(listing_id, session_id)
);


-- ─── TABLE: notifications ────────────────────────────────────

create table public.hazaral_notifications (
  id          uuid default gen_random_uuid() primary key,
  dealer_id   uuid references public.hazaral_dealers(id) on delete cascade not null,
  type        public.notification_type not null,
  title       text not null,
  message     text not null,
  is_read     boolean not null default false,
  data        jsonb,                            -- extra context (listing_id, etc.)
  created_at  timestamp with time zone default timezone('utc', now()) not null
);


-- ─── INDEXES ─────────────────────────────────────────────────

-- dealers
create index idx_hazaral_dealers_user_id         on public.hazaral_dealers(user_id);
create index idx_hazaral_dealers_status          on public.hazaral_dealers(subscription_status);
create index idx_hazaral_dealers_city            on public.hazaral_dealers(city);
create index idx_hazaral_dealers_is_approved     on public.hazaral_dealers(is_approved);
create index idx_hazaral_dealers_slug            on public.hazaral_dealers(slug);

-- listings (most query-critical)
create index idx_hazaral_listings_dealer_id      on public.hazaral_listings(dealer_id);
create index idx_hazaral_listings_status         on public.hazaral_listings(status);
create index idx_hazaral_listings_slug           on public.hazaral_listings(slug);
create index idx_hazaral_listings_brand          on public.hazaral_listings(brand);
create index idx_hazaral_listings_city           on public.hazaral_listings(city);
create index idx_hazaral_listings_year           on public.hazaral_listings(year);
create index idx_hazaral_listings_asking_price   on public.hazaral_listings(asking_price);
create index idx_hazaral_listings_damage_grade   on public.hazaral_listings(damage_grade);
create index idx_hazaral_listings_is_featured    on public.hazaral_listings(is_featured);
create index idx_hazaral_listings_created_at     on public.hazaral_listings(created_at desc);
create index idx_hazaral_listings_expires_at     on public.hazaral_listings(expires_at);
create index idx_hazaral_listings_damage_type    on public.hazaral_listings using gin(damage_type);

-- listing_views
create index idx_hazaral_listing_views_listing   on public.hazaral_listing_views(listing_id);
create index idx_hazaral_listing_views_dealer    on public.hazaral_listing_views(dealer_id);
create index idx_hazaral_listing_views_created   on public.hazaral_listing_views(created_at desc);
create index idx_hazaral_listing_views_session   on public.hazaral_listing_views(session_id);

-- listing_contacts
create index idx_hazaral_listing_contacts_list   on public.hazaral_listing_contacts(listing_id);
create index idx_hazaral_listing_contacts_dealer on public.hazaral_listing_contacts(dealer_id);
create index idx_hazaral_listing_contacts_type   on public.hazaral_listing_contacts(contact_type);
create index idx_hazaral_listing_contacts_created on public.hazaral_listing_contacts(created_at desc);

-- dealer_messages
create index idx_hazaral_dealer_messages_dealer  on public.hazaral_dealer_messages(dealer_id);
create index idx_hazaral_dealer_messages_listing on public.hazaral_dealer_messages(listing_id);
create index idx_hazaral_dealer_messages_unread  on public.hazaral_dealer_messages(dealer_id, is_read);

-- favorites
create index idx_hazaral_favorites_listing       on public.hazaral_favorites(listing_id);
create index idx_hazaral_favorites_session       on public.hazaral_favorites(session_id);

-- notifications
create index idx_hazaral_notifications_dealer    on public.hazaral_notifications(dealer_id);
create index idx_hazaral_notifications_unread    on public.hazaral_notifications(dealer_id, is_read);


-- ─── ROW LEVEL SECURITY ──────────────────────────────────────

alter table public.hazaral_dealers           enable row level security;
alter table public.hazaral_listings          enable row level security;
alter table public.hazaral_listing_views     enable row level security;
alter table public.hazaral_listing_contacts  enable row level security;
alter table public.hazaral_dealer_messages   enable row level security;
alter table public.hazaral_favorites         enable row level security;
alter table public.hazaral_subscription_plans enable row level security;
alter table public.hazaral_notifications     enable row level security;

-- helpers: is the current user the dealer who owns this row?
-- (service role bypasses all RLS automatically)

-- ── subscription_plans: public read, admin write ──
create policy "Anyone can view active plans"
  on public.hazaral_subscription_plans for select
  using (is_active = true);

-- ── dealers: own row read/write; public can read approved dealers ──
create policy "Dealers can read own row"
  on public.hazaral_dealers for select
  using (auth.uid() = user_id);

create policy "Dealers can update own row"
  on public.hazaral_dealers for update
  using (auth.uid() = user_id);

create policy "Public can view approved dealers"
  on public.hazaral_dealers for select
  using (is_approved = true);

create policy "Authenticated users can insert dealer"
  on public.hazaral_dealers for insert
  with check (auth.uid() = user_id);

-- ── listings: dealers own their listings; public reads active only ──
create policy "Dealers can manage own listings"
  on public.hazaral_listings for all
  using (
    dealer_id in (
      select id from public.hazaral_dealers where user_id = auth.uid()
    )
  );

create policy "Public can view active listings"
  on public.hazaral_listings for select
  using (status = 'active');

-- ── listing_views: anyone can insert; dealers read own ──
create policy "Anyone can insert listing views"
  on public.hazaral_listing_views for insert
  with check (true);

create policy "Dealers can read own listing views"
  on public.hazaral_listing_views for select
  using (
    dealer_id in (
      select id from public.hazaral_dealers where user_id = auth.uid()
    )
  );

-- ── listing_contacts: anyone can insert; dealers read own ──
create policy "Anyone can insert listing contacts"
  on public.hazaral_listing_contacts for insert
  with check (true);

create policy "Dealers can read own listing contacts"
  on public.hazaral_listing_contacts for select
  using (
    dealer_id in (
      select id from public.hazaral_dealers where user_id = auth.uid()
    )
  );

-- ── dealer_messages: anyone can insert; dealers read/update own ──
create policy "Anyone can send dealer messages"
  on public.hazaral_dealer_messages for insert
  with check (true);

create policy "Dealers can read own messages"
  on public.hazaral_dealer_messages for select
  using (
    dealer_id in (
      select id from public.hazaral_dealers where user_id = auth.uid()
    )
  );

create policy "Dealers can update own messages"
  on public.hazaral_dealer_messages for update
  using (
    dealer_id in (
      select id from public.hazaral_dealers where user_id = auth.uid()
    )
  );

-- ── favorites: anyone can insert/delete by session; public read ──
create policy "Anyone can manage favorites"
  on public.hazaral_favorites for all
  with check (true);

create policy "Public can read favorites"
  on public.hazaral_favorites for select
  using (true);

-- ── notifications: dealers read own ──
create policy "Dealers can read own notifications"
  on public.hazaral_notifications for select
  using (
    dealer_id in (
      select id from public.hazaral_dealers where user_id = auth.uid()
    )
  );

create policy "Dealers can update own notifications"
  on public.hazaral_notifications for update
  using (
    dealer_id in (
      select id from public.hazaral_dealers where user_id = auth.uid()
    )
  );


-- ─── TRIGGERS: updated_at ─────────────────────────────────────

create or replace function public.hazaral_set_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$ language plpgsql;

create trigger hazaral_dealers_updated_at
  before update on public.hazaral_dealers
  for each row execute procedure public.hazaral_set_updated_at();

create trigger hazaral_listings_updated_at
  before update on public.hazaral_listings
  for each row execute procedure public.hazaral_set_updated_at();


-- ─── TRIGGER: sync dealer total_listings count ───────────────

create or replace function public.hazaral_sync_dealer_listing_count()
returns trigger as $$
begin
  if TG_OP = 'INSERT' then
    update public.hazaral_dealers
    set total_listings = total_listings + 1
    where id = NEW.dealer_id;
    return NEW;
  elsif TG_OP = 'DELETE' then
    update public.hazaral_dealers
    set total_listings = greatest(total_listings - 1, 0)
    where id = OLD.dealer_id;
    return OLD;
  end if;
  return null;
end;
$$ language plpgsql;

create trigger hazaral_listing_count_sync
  after insert or delete on public.hazaral_listings
  for each row execute procedure public.hazaral_sync_dealer_listing_count();


-- ─── SEED: subscription_plans ────────────────────────────────

insert into public.hazaral_subscription_plans
  (name, slug, price_monthly, max_listings, listing_duration_days,
   can_feature_listings, featured_slots, can_see_analytics,
   has_verified_badge, has_priority_support, sort_order)
values
  ('Basic',        'basic',        4999,  5,  30, false, 0, false, false, false, 1),
  ('Professional', 'professional', 9999, 15,  60, true,  2, true,  false, false, 2),
  ('Premium',      'premium',     19999, -1,  90, true,  5, true,  true,  true,  3);
