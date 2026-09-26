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

-- Reset: no admins until the owner's account is added explicitly.
update public.profiles set role = 'customer' where role = 'admin' and id not in (select user_id from public.admin_users);
