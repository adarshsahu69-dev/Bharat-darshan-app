/**
 * SQL to run once in the Supabase SQL editor.
 *
 * Run this in: https://app.supabase.com -> your project -> SQL Editor -> New query
 * Paste and Run. Then create the Storage bucket via the UI (Storage -> New bucket)
 * named "monument-images" and make it public, or run the CREATE BUCKET statement
 * below.
 */

-- ------------------------------------------------------------------- Table
create table if not exists public.monuments (
  id text primary key,
  name text not null,
  state text not null,
  city text,
  category text not null check (category in ('Fort','Temple','Palace','Museum','Nature')),
  categories text[] default '{}',
  description text,
  lat double precision,
  lng double precision,
  image_url text,
  ticket_inr integer default 0,
  timings text,
  rating numeric(2,1) default 0,
  review_count text,
  is_unesco boolean default false
);

-- ------------------------------------------------- Row Level Security
alter table public.monuments enable row level security;

-- Anyone can read; nobody can write via the client.
drop policy if exists "public read monuments" on public.monuments;
create policy "public read monuments"
  on public.monuments
  for select
  to anon
  using (true);

-- ----------------------------------------------------------------- Storage
-- Create a public bucket named "monument-images" via the Supabase UI:
--   Storage -> New bucket -> name: monument-images -> Public bucket: ON
-- Or run:
insert into storage.buckets (id, name, public)
values ('monument-images', 'monument-images', true)
on conflict do nothing;

-- Image paths inside the bucket look like:
--   <monument-id>/<filename>
-- e.g. amber-fort/amber-fort.jpg