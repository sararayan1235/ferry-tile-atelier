-- S.R. Fine Tile Atelier — complete Supabase setup.
-- Paste this whole file into Supabase → SQL Editor → New query → Run, once, on a new project.

create extension if not exists pgcrypto;

create type public.app_role as enum ('customer', 'admin');
create type public.appointment_status as enum ('pending', 'confirmed', 'declined', 'completed');

-- ---------------------------------------------------------------- profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  phone text not null default '',
  language text not null default 'nl' check (language in ('nl', 'en')),
  role public.app_role not null default 'customer',
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------- appointments
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
grant select on public.profiles to authenticated;
grant update (full_name, phone, language) on public.profiles to authenticated;
grant select on public.appointments to authenticated;
-- Inserts go through the server route (service role) so references and validation stay server-side.

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists(select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

create policy "Users read their own profile, admins read all"
on public.profiles for select
to authenticated
using ((select auth.uid()) = id or public.is_admin());

create policy "Users update their own profile"
on public.profiles for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create policy "Customers read their own appointments, admins read all"
on public.appointments for select
to authenticated
using ((select auth.uid()) = user_id or public.is_admin());

-- New sign-ups (email, Google or Apple) get a customer profile automatically.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    coalesce(new.raw_user_meta_data->>'phone', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- ---------------------------------------------------------------- status history
create table public.appointment_events (
  id uuid primary key default gen_random_uuid(),
  appointment_id uuid not null references public.appointments(id) on delete cascade,
  actor_id uuid not null references auth.users(id) on delete cascade,
  status public.appointment_status not null,
  note text,
  created_at timestamptz not null default now()
);

create index appointment_events_appointment_idx on public.appointment_events(appointment_id, created_at);

alter table public.appointment_events enable row level security;
revoke all on public.appointment_events from anon, authenticated;
grant select on public.appointment_events to authenticated;

create policy "Customers and admins read appointment events"
on public.appointment_events for select
to authenticated
using (
  public.is_admin()
  or exists (
    select 1 from public.appointments a
    where a.id = appointment_id and a.user_id = (select auth.uid())
  )
);

create or replace function public.log_appointment_created()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.appointment_events (appointment_id, actor_id, status)
  values (new.id, new.user_id, 'pending');
  return new;
end;
$$;

revoke all on function public.log_appointment_created() from public, anon, authenticated;
create trigger on_appointment_created
after insert on public.appointments
for each row execute procedure public.log_appointment_created();

-- Admin status changes. SECURITY DEFINER because signed-in users have no direct UPDATE/INSERT
-- rights on these tables; the is_admin() check below is the gate.
create or replace function public.transition_appointment(
  p_appointment_id uuid,
  p_next public.appointment_status,
  p_note text default null
)
returns public.appointment_status
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_status public.appointment_status;
begin
  if not public.is_admin() then
    raise exception 'not authorized';
  end if;

  select status into current_status
  from public.appointments
  where id = p_appointment_id
  for update;

  if not found then
    raise exception 'appointment not found';
  end if;

  if not (
    (current_status = 'pending' and p_next in ('confirmed', 'declined')) or
    (current_status = 'confirmed' and p_next = 'completed')
  ) then
    raise exception 'invalid appointment transition';
  end if;

  update public.appointments
  set status = p_next,
      admin_note = coalesce(nullif(left(coalesce(p_note, ''), 500), ''), admin_note),
      updated_at = now()
  where id = p_appointment_id;

  insert into public.appointment_events (appointment_id, actor_id, status, note)
  values (p_appointment_id, auth.uid(), p_next, nullif(left(coalesce(p_note, ''), 500), ''));

  return p_next;
end;
$$;

revoke all on function public.transition_appointment(uuid, public.appointment_status, text) from public, anon;
grant execute on function public.transition_appointment(uuid, public.appointment_status, text) to authenticated;

-- ---------------------------------------------------------------- admin allowlist (also shipped as migrations/002)
-- Admin access is granted ONLY through public.admin_users (a list of account IDs).
-- Nobody can add themselves: the table is invisible to website visitors and customers;
-- only the project owner (SQL Editor / service role) can change it.

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  added_at timestamptz not null default now()
);
alter table public.admin_users enable row level security;
revoke all on public.admin_users from anon, authenticated;

-- The single source of truth for "is the signed-in user an admin?" (used by RLS and the app).
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists(select 1 from public.admin_users where user_id = auth.uid());
$$;
revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

-- profiles.role is only a display mirror of admin_users.
create or replace function public.sync_admin_role()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    update public.profiles set role = 'admin' where id = new.user_id;
    return new;
  end if;
  update public.profiles set role = 'customer' where id = old.user_id;
  return old;
end;
$$;
revoke all on function public.sync_admin_role() from public, anon, authenticated;
drop trigger if exists on_admin_users_change on public.admin_users;
create trigger on_admin_users_change
after insert or delete on public.admin_users
for each row execute procedure public.sync_admin_role();

-- Refuse any attempt to mark a profile admin without an admin_users entry.
create or replace function public.guard_profile_role()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.role = 'admin' and not exists(select 1 from public.admin_users where user_id = new.id) then
    raise exception 'admin role is granted only via admin_users';
  end if;
  return new;
end;
$$;
revoke all on function public.guard_profile_role() from public, anon, authenticated;
drop trigger if exists guard_profile_role on public.profiles;
create trigger guard_profile_role
before insert or update of role on public.profiles
for each row execute procedure public.guard_profile_role();


-- ---------------------------------------------------------------- hardening (also shipped as migrations/003)
-- Hardening from Supabase's security advisor.
-- Trigger / event-trigger functions must not be callable through the public REST API.
revoke all on function public.handle_new_user() from public, anon, authenticated;
do $$
begin
  -- Supabase-managed "ensure_rls" event trigger function (only present on newer projects).
  if exists (select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace where n.nspname = 'public' and p.proname = 'rls_auto_enable') then
    execute 'revoke all on function public.rls_auto_enable() from public, anon, authenticated';
  end if;
end $$;

-- Covering index for the actor foreign key on the status history.
create index if not exists appointment_events_actor_idx on public.appointment_events(actor_id);
