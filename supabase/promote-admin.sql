-- Make ONE account the administrator.
-- 1. The owner signs up on the website first (email + password, or Google).
-- 2. Put that email address below, then run this in Supabase → SQL Editor.
-- Admin rights come only from public.admin_users; nobody can grant them to themselves.
insert into public.admin_users (user_id)
select id from auth.users where lower(email) = lower('owner@example.com')
on conflict do nothing;

-- Remove an admin:
-- delete from public.admin_users where user_id = (select id from auth.users where lower(email) = lower('old-admin@example.com'));
