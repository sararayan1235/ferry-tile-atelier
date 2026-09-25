create table public.appointment_events (
  id uuid primary key default gen_random_uuid(),
  appointment_id uuid not null references public.appointments(id) on delete cascade,
  actor_id uuid not null references auth.users(id) on delete cascade,
  status public.appointment_status not null,
  note text,
  created_at timestamptz not null default now()
);

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
    where a.id = appointment_id and a.user_id = auth.uid()
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

create or replace function public.transition_appointment(
  p_appointment_id uuid,
  p_next public.appointment_status,
  p_note text default null
)
returns public.appointment_status
language plpgsql
security invoker
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
  set status = p_next, updated_at = now()
  where id = p_appointment_id;

  insert into public.appointment_events (appointment_id, actor_id, status, note)
  values (p_appointment_id, auth.uid(), p_next, nullif(left(coalesce(p_note, ''), 500), ''));

  return p_next;
end;
$$;

revoke all on function public.transition_appointment(uuid, public.appointment_status, text) from public, anon;
grant execute on function public.transition_appointment(uuid, public.appointment_status, text) to authenticated;
