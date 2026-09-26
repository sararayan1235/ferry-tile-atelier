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
