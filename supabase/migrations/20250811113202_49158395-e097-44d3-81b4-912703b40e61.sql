-- Create private storage bucket for prescriptions (idempotent)
insert into storage.buckets (id, name, public)
values ('prescriptions', 'prescriptions', false)
on conflict do nothing;

-- Recreate policies safely
drop policy if exists "View own prescription files" on storage.objects;
create policy "View own prescription files"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'prescriptions'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Upload own prescription files" on storage.objects;
create policy "Upload own prescription files"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'prescriptions'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Update own prescription files" on storage.objects;
create policy "Update own prescription files"
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

drop policy if exists "Delete own prescription files" on storage.objects;
create policy "Delete own prescription files"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'prescriptions'
  and (storage.foldername(name))[1] = auth.uid()::text
);
