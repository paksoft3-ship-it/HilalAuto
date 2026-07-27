-- Contact form fields for hazaral_leads (source = 'contact').
alter table public.hazaral_leads add column if not exists name text;
alter table public.hazaral_leads add column if not exists message text;
