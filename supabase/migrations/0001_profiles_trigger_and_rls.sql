-- SkillSwap — profile bootstrap + RLS baseline
-- Run in the Supabase SQL editor (or `supabase db push`).

-- 1. Make sure the columns the app writes exist.
alter table public.profiles
  add column if not exists username    text,
  add column if not exists email       text,
  add column if not exists description text,
  add column if not exists location    text,
  add column if not exists avatar_url  text,
  add column if not exists credits     integer not null default 0;

-- 2. Create the profile row atomically when an auth user is created.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, username)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'username', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 3. Backfill profiles for users that registered before the trigger existed.
insert into public.profiles (id, email, username)
select
  u.id,
  u.email,
  coalesce(u.raw_user_meta_data ->> 'username', split_part(u.email, '@', 1))
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null;

-- 4. RLS: profiles are publicly readable, writable only by their owner.
alter table public.profiles enable row level security;

drop policy if exists "profiles are viewable by everyone" on public.profiles;
create policy "profiles are viewable by everyone"
  on public.profiles for select
  using (true);

drop policy if exists "users insert their own profile" on public.profiles;
create policy "users insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "users update their own profile" on public.profiles;
create policy "users update their own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- 5. RLS: skills are public to read, owner-only to write.
alter table public.skills enable row level security;

drop policy if exists "skills are viewable by everyone" on public.skills;
create policy "skills are viewable by everyone"
  on public.skills for select
  using (true);

drop policy if exists "users insert their own skills" on public.skills;
create policy "users insert their own skills"
  on public.skills for insert
  with check (auth.uid() = user_id);

drop policy if exists "users update their own skills" on public.skills;
create policy "users update their own skills"
  on public.skills for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "users delete their own skills" on public.skills;
create policy "users delete their own skills"
  on public.skills for delete
  using (auth.uid() = user_id);

-- 6. RLS: reviews are public to read, authored only by the signed-in user.
alter table public.reviews enable row level security;

drop policy if exists "reviews are viewable by everyone" on public.reviews;
create policy "reviews are viewable by everyone"
  on public.reviews for select
  using (true);

drop policy if exists "users insert their own reviews" on public.reviews;
create policy "users insert their own reviews"
  on public.reviews for insert
  with check (auth.uid() = author_id);

drop policy if exists "users update their own reviews" on public.reviews;
create policy "users update their own reviews"
  on public.reviews for update
  using (auth.uid() = author_id)
  with check (auth.uid() = author_id);

drop policy if exists "users delete their own reviews" on public.reviews;
create policy "users delete their own reviews"
  on public.reviews for delete
  using (auth.uid() = author_id);

-- 7. Storage: avatars live under `<user id>/...`, skill images under `<user id>/...`.
--    Buckets must exist and be public for reads.
drop policy if exists "avatar images are public" on storage.objects;
create policy "avatar images are public"
  on storage.objects for select
  using (bucket_id = 'avatar-images');

drop policy if exists "users manage their own avatar" on storage.objects;
create policy "users manage their own avatar"
  on storage.objects for all
  using (
    bucket_id = 'avatar-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  )
  with check (
    bucket_id = 'avatar-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "skill images are public" on storage.objects;
create policy "skill images are public"
  on storage.objects for select
  using (bucket_id = 'skill-images');

drop policy if exists "users manage their own skill images" on storage.objects;
create policy "users manage their own skill images"
  on storage.objects for all
  using (
    bucket_id = 'skill-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  )
  with check (
    bucket_id = 'skill-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
