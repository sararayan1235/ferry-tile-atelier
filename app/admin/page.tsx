import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { DashboardSignOut } from "@/components/client-controls";
import { DashboardShell } from "@/components/site-shell";
import { MetricCard, StatusPill, formatDate } from "@/components/dashboard";
import { updateAppointmentStatus } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/supabase/server";
import { hasSupabaseConfig } from "@/lib/supabase/config";
import { APPOINTMENT_STATUSES, appointmentStatusLabel, nextAppointmentStatuses, type AppointmentStatus } from "@/lib/appointments";
import type { Appointment, AppointmentEvent } from "@/lib/types";

export const metadata = { title: "Beheer" };
export const dynamic = "force-dynamic";

const ACTION_LABEL: Record<AppointmentStatus, string> = { pending: "", confirmed: "Bevestigen", declined: "Afwijzen", completed: "Afronden" };

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  if (!hasSupabaseConfig()) redirect("/setup?next=/admin");
  const { supabase, isAdmin } = await requireAdmin();
  if (!isAdmin) redirect("/dashboard");
  const requested = (await searchParams).status;
  const filter = APPOINTMENT_STATUSES.includes(requested as AppointmentStatus) ? (requested as AppointmentStatus) : null;

  const [{ data }, { data: eventRows }] = await Promise.all([
    supabase.from("appointments").select("*").order("created_at", { ascending: false }),
    supabase.from("appointment_events").select("*").order("created_at", { ascending: true }),
  ]);
  const all = (data || []) as Appointment[];
  const events = (eventRows || []) as AppointmentEvent[];
  const count = (status: AppointmentStatus) => all.filter((item) => item.status === status).length;
  const shown = filter ? all.filter((item) => item.status === filter) : all;
  const upcoming = all.filter((item) => item.status === "confirmed" && item.preferred_date >= new Date().toISOString().slice(0, 10)).length;

  return <DashboardShell admin current="admin">
    <header className="dashboard-header">
      <div><p className="eyebrow">Beheer</p><h1>Aanvragen beheren.</h1><p>Bevestig, plan en rond af. Uw bericht is zichtbaar voor de klant in het portaal.</p></div>
      <DashboardSignOut />
    </header>
    <section className="metrics-grid" aria-label="Overzicht">
      <MetricCard label="Nieuw" value={String(count("pending"))} detail="Wacht op uw reactie" />
      <MetricCard label="Gepland" value={String(upcoming)} detail="Bevestigd, nog uit te voeren" />
      <MetricCard label="Totaal" value={String(all.length)} detail="Alle aanvragen" />
    </section>
    <section>
      <div className="content-heading"><h2>Aanvragen</h2></div>
      <nav className="filter-tabs" aria-label="Filter op status">
        <Link href="/admin" aria-current={!filter ? "page" : undefined}>Alle <b>{all.length}</b></Link>
        {APPOINTMENT_STATUSES.map((status) => <Link key={status} href={`/admin?status=${status}`} aria-current={filter === status ? "page" : undefined}>{appointmentStatusLabel(status)} <b>{count(status)}</b></Link>)}
      </nav>
      {shown.length
        ? <div className="admin-list">{shown.map((item) => <AdminRow key={item.id} item={item} history={events.filter((e) => e.appointment_id === item.id)} />)}</div>
        : <div className="empty-state"><h3>Geen aanvragen</h3><p>Nieuwe aanvragen van klanten verschijnen hier automatisch.</p></div>}
    </section>
  </DashboardShell>;
}

function AdminRow({ item, history }: { item: Appointment; history: AppointmentEvent[] }) {
  const actions = nextAppointmentStatuses(item.status);
  const time = new Intl.DateTimeFormat("nl-NL", { dateStyle: "short", timeStyle: "short", timeZone: "Europe/Amsterdam" });
  return <article className="admin-row">
    <div className="admin-row-main">
      <div className="admin-row-top"><span className="reference">{item.reference}</span><StatusPill status={item.status} /></div>
      <h3>{item.service} · {formatDate(item.preferred_date)}</h3>
      <p>{item.name} · <a href={`tel:${item.phone.replace(/[^\d+]/g, "")}`}>{item.phone}</a> · <a href={`mailto:${item.email}`}>{item.email}</a></p>
      <p>{item.location}</p>
      <p className="admin-details">{item.details}</p>
      {item.admin_note && <div className="appointment-note"><b>Laatste bericht aan klant</b>{item.admin_note}</div>}
      {history.length > 0 && <ul className="admin-history" aria-label="Geschiedenis">{history.map((e) => <li key={e.id}>{time.format(new Date(e.created_at))} · {appointmentStatusLabel(e.status)}{e.note ? ` · “${e.note}”` : ""}</li>)}</ul>}
    </div>
    {actions.length > 0
      ? <form action={updateAppointmentStatus} className="admin-actions">
          <input type="hidden" name="id" value={item.id} />
          <label><span>Bericht aan klant (optioneel)</span><input name="note" maxLength={500} placeholder="Bijv. bevestigd voor di 10:00" /></label>
          {actions.map((status) => <button className={`button ${status === "declined" ? "button-danger" : "button-primary"}`} name="status" value={status} key={status} type="submit">{ACTION_LABEL[status]}<ArrowRight aria-hidden="true" /></button>)}
        </form>
      : <div className="admin-actions"><p className="reference">Afgesloten</p></div>}
  </article>;
}
