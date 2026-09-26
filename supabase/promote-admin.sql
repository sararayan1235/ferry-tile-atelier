-- Make the owner an administrator.
-- 1. Sign up on the website first (email, Google or Apple).
-- 2. Replace the email address below with the one used to sign up, then run this in Supabase → SQL Editor.
update public.profiles
set role = 'admin'
where id = (select id from auth.users where lower(email) = lower('owner@example.com'));
