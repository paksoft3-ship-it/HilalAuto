-- Storage bucket for listing photos.
-- Uploads go through /api/dealer/upload with the service role key,
-- so no INSERT policy is needed; the bucket only has to exist and be public
-- for getPublicUrl() links to resolve.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'listings',
  'listings',
  true,
  10485760, -- 10 MB, matches the API-side validation
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = true,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Public read access for the listings bucket (harmless for public buckets,
-- required if the bucket is ever flipped to non-public by mistake).
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects'
      and policyname = 'Public read for listings bucket'
  ) then
    create policy "Public read for listings bucket"
      on storage.objects for select
      using (bucket_id = 'listings');
  end if;
end $$;
