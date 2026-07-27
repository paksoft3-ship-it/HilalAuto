-- General listing description ("Ek Açıklama" in the dealer wizard).
-- The wizard already collects this field; until now it was silently discarded.
alter table public.hazaral_listings add column if not exists description text;
