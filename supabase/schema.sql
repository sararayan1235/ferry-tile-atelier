-- S.R. Tile Atelier — Supabase Postgres schema
create extension if not exists pgcrypto;

create type public.app_role as enum ('customer', 'admin');
create type public.appointment_status as enum ('pending', 'confirmed', 'declined', 'completed');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  phone text not null default '',
  language text not null default 'nl' check (language in ('nl', 'en')),
  role public.app_role not null default 'customer',
  created_at timestamptz not null default now()
);

create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  request_id uuid not null,
  reference text not null unique,
  name text not null,
  phone text not null,
  email text not null,
  location text not null,
  service text not null,
  preferred_date date not null,
  details text not null,
  status public.appointment_status not null default 'pending',
  admin_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index appointments_user_request_idx on public.appointments(user_id, request_id);
create index appointments_user_created_idx on public.appointments(user_id, created_at desc);
create index appointments_status_date_idx on public.appointments(status, preferred_date);

alter table public.profiles enable row level security;
alter table public.appointments enable row level security;

revoke all on public.profiles from anon, authenticated;
revoke all on public.appointments from anon, authenticated;
revoke update (role) on public.profiles from authenticated;
grant select on public.profiles to authenticated;
grant update (full_name, phone, language) on public.profiles to authenticated;
grant select, insert on public.appointments to authenticated;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists(select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

create policy "Users read their own profile"
on public.profiles for select
to authenticated
using ((select auth.uid()) = id);

create policy "Users update their own profile"
on public.profiles for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create policy "Customers read their own appointments"
on public.appointments for select
to authenticated
using ((select auth.uid()) = user_id or public.is_admin());

create policy "Customers create their own appointments"
on public.appointments for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Admins update appointments"
on public.appointments for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name',''), coalesce(new.raw_user_meta_data->>'phone',''))
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- Promote the first administrator manually in Supabase SQL Editor:
-- update public.profiles set role = 'admin' where id = '<AUTH-USER-UUID>';
