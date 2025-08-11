-- Create private storage bucket for prescriptions
insert into storage.buckets (id, name, public)
values ('prescriptions', 'prescriptions', false)
on conflict do nothing;

-- Allow authenticated users to view ONLY their own files (path prefix = user id)
create policy if not exists "View own prescription files"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'prescriptions'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to upload files ONLY to their own folder
create policy if not exists "Upload own prescription files"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'prescriptions'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to update ONLY their own files
create policy if not exists "Update own prescription files"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'prescriptions'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'prescriptions'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to delete ONLY their own files
create policy if not exists "Delete own prescription files"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'prescriptions'
  and (storage.foldername(name))[1] = auth.uid()::text
);
