import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { DashboardSignOut } from "@/components/client-controls";
import { AdminLanguageSwitch } from "@/components/admin-language-switch";
import { DashboardShell } from "@/components/site-shell";
import { MetricCard, StatusPill, formatDate } from "@/components/dashboard";
import { updateAppointmentStatus } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/supabase/server";
import { hasSupabaseConfig } from "@/lib/supabase/config";
import { requestLanguage, type Language } from "@/lib/language";
import { APPOINTMENT_STATUSES, appointmentStatusLabel, nextAppointmentStatuses, type AppointmentStatus } from "@/lib/appointments";
import type { Appointment, AppointmentEvent } from "@/lib/types";

export const metadata = { title: "Beheer", robots: { index: false } };
export const dynamic = "force-dynamic";

const copy = {
  nl: {
    eyebrow: "Beheer", title: "Aanvragen beheren.", intro: "Bevestig, plan en rond af. Uw bericht is zichtbaar voor de klant in het portaal.", signOut: "Uitloggen",
    overview: "Overzicht", newLabel: "Nieuw", newDetail: "Wacht op uw reactie", planned: "Gepland", plannedDetail: "Bevestigd, nog uit te voeren", total: "Totaal", totalDetail: "Alle aanvragen",
    heading: "Aanvragen", all: "Alle", filter: "Filter op status", emptyTitle: "Geen aanvragen", emptyText: "Nieuwe aanvragen van klanten verschijnen hier automatisch.",
    lastMessage: "Laatste bericht aan klant", history: "Geschiedenis", message: "Bericht aan klant (optioneel)", placeholder: "Bijv. bevestigd voor di 10:00", closed: "Afgesloten",
    actions: { pending: "", confirmed: "Bevestigen", declined: "Afwijzen", completed: "Afronden" },
  },
  en: {
    eyebrow: "Admin", title: "Manage requests.", intro: "Confirm, schedule and complete. Your message is visible to the customer in their portal.", signOut: "Sign out",
    overview: "Overview", newLabel: "New", newDetail: "Waiting for your reply", planned: "Scheduled", plannedDetail: "Confirmed, still to do", total: "Total", totalDetail: "All requests",
    heading: "Requests", all: "All", filter: "Filter by status", emptyTitle: "No requests", emptyText: "New customer requests appear here automatically.",
    lastMessage: "Last message to customer", history: "History", message: "Message to customer (optional)", placeholder: "E.g. confirmed for Tue 10:00", closed: "Closed",
    actions: { pending: "", confirmed: "Confirm", declined: "Decline", completed: "Complete" },
  },
} satisfies Record<Language, unknown>;

type Copy = (typeof copy)["nl"];

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  if (!hasSupabaseConfig()) redirect("/setup?next=/admin");
  const { supabase, isAdmin } = await requireAdmin();
  if (!isAdmin) redirect("/dashboard");
  const language = await requestLanguage();
  const t = copy[language];
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

  return <DashboardShell admin current="admin" language={language}>
    <header className="dashboard-header">
      <div><p className="eyebrow">{t.eyebrow}</p><h1>{t.title}</h1><p>{t.intro}</p></div>
      <div className="button-row"><AdminLanguageSwitch language={language} /><DashboardSignOut label={t.signOut} /></div>
    </header>
    <section className="metrics-grid" aria-label={t.overview}>
      <MetricCard label={t.newLabel} value={String(count("pending"))} detail={t.newDetail} />
      <MetricCard label={t.planned} value={String(upcoming)} detail={t.plannedDetail} />
      <MetricCard label={t.total} value={String(all.length)} detail={t.totalDetail} />
    </section>
    <section>
      <div className="content-heading"><h2>{t.heading}</h2></div>
      <nav className="filter-tabs" aria-label={t.filter}>
        <Link href="/admin" aria-current={!filter ? "page" : undefined}>{t.all} <b>{all.length}</b></Link>
        {APPOINTMENT_STATUSES.map((status) => <Link key={status} href={`/admin?status=${status}`} aria-current={filter === status ? "page" : undefined}>{appointmentStatusLabel(status, language)} <b>{count(status)}</b></Link>)}
      </nav>
      {shown.length
        ? <div className="admin-list">{shown.map((item) => <AdminRow key={item.id} item={item} history={events.filter((e) => e.appointment_id === item.id)} language={language} t={t} />)}</div>
        : <div className="empty-state"><h3>{t.emptyTitle}</h3><p>{t.emptyText}</p></div>}
    </section>
  </DashboardShell>;
}

function AdminRow({ item, history, language, t }: { item: Appointment; history: AppointmentEvent[]; language: Language; t: Copy }) {
  const actions = nextAppointmentStatuses(item.status);
  const time = new Intl.DateTimeFormat(language === "en" ? "en-GB" : "nl-NL", { dateStyle: "short", timeStyle: "short", timeZone: "Europe/Amsterdam" });
  return <article className="admin-row">
    <div className="admin-row-main">
      <div className="admin-row-top"><span className="reference">{item.reference}</span><StatusPill status={item.status} language={language} /></div>
      <h3>{item.service} · {formatDate(item.preferred_date, language)}</h3>
      <p>{item.name} · <a href={`tel:${item.phone.replace(/[^\d+]/g, "")}`}>{item.phone}</a> · <a href={`mailto:${item.email}`}>{item.email}</a></p>
      <p>{item.location}</p>
      <p className="admin-details">{item.details}</p>
      {item.admin_note && <div className="appointment-note"><b>{t.lastMessage}</b>{item.admin_note}</div>}
      {history.length > 0 && <ul className="admin-history" aria-label={t.history}>{history.map((e) => <li key={e.id}>{time.format(new Date(e.created_at))} · {appointmentStatusLabel(e.status, language)}{e.note ? ` · “${e.note}”` : ""}</li>)}</ul>}
    </div>
    {actions.length > 0
      ? <form action={updateAppointmentStatus} className="admin-actions">
          <input type="hidden" name="id" value={item.id} />
          <label><span>{t.message}</span><input name="note" maxLength={500} placeholder={t.placeholder} /></label>
          {actions.map((status) => <button className={`button ${status === "declined" ? "button-danger" : "button-primary"}`} name="status" value={status} key={status} type="submit">{t.actions[status]}<ArrowRight aria-hidden="true" /></button>)}
        </form>
      : <div className="admin-actions"><p className="reference">{t.closed}</p></div>}
  </article>;
}
