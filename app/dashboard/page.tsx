import Link from "next/link";
import { redirect } from "next/navigation";
import { DashboardSignOut } from "@/components/client-controls";
import { AdminLanguageSwitch } from "@/components/admin-language-switch";
import { DashboardShell } from "@/components/site-shell";
import { AppointmentCard, MetricCard } from "@/components/dashboard";
import { requireUser } from "@/lib/supabase/server";
import { hasSupabaseConfig } from "@/lib/supabase/config";
import { requestLanguage } from "@/lib/language";
import type { Appointment } from "@/lib/types";

export const metadata = { title: "Mijn afspraken" };
export const dynamic = "force-dynamic";

const copy = {
  nl: {
    eyebrow: "Klantportaal", welcome: "Welkom", intro: "Hier vindt u uw aanvragen en de actuele voortgang.", signOut: "Uitloggen",
    total: "Totaal aanvragen", totalDetail: "Sinds uw eerste aanvraag", pending: "In behandeling", pendingDetail: "Wacht op reactie",
    confirmed: "Bevestigd", confirmedDetail: "Gepland werk", heading: "Mijn afspraken", newRequest: "Nieuwe aanvraag",
    emptyTitle: "Nog geen aanvragen", emptyText: "Wanneer u een aanvraag plaatst, verschijnt deze hier met de actuele status.", emptyCta: "Offerte aanvragen", overview: "Overzicht",
  },
  en: {
    eyebrow: "Customer portal", welcome: "Welcome", intro: "Here you'll find your requests and their current progress.", signOut: "Sign out",
    total: "Total requests", totalDetail: "Since your first request", pending: "Pending", pendingDetail: "Awaiting a reply",
    confirmed: "Confirmed", confirmedDetail: "Scheduled work", heading: "My appointments", newRequest: "New request",
    emptyTitle: "No requests yet", emptyText: "When you send a request, it appears here with its current status.", emptyCta: "Get a quote", overview: "Overview",
  },
};

export default async function DashboardPage() {
  if (!hasSupabaseConfig()) redirect("/setup?next=/dashboard");
  const { supabase, user } = await requireUser();
  if (!user) redirect("/login?next=/dashboard");
  const language = await requestLanguage();
  const t = copy[language];
  const [{ data: profile }, { data }, { data: isAdmin }] = await Promise.all([
    supabase.from("profiles").select("full_name").eq("id", user.id).single(),
    // RLS returns only this user's rows (admins see everything on /admin, so filter explicitly here).
    supabase.from("appointments").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
    supabase.rpc("is_admin"),
  ]);
  const rows = ((data || []) as Appointment[]).map((item) => ({
    id: item.id,
    reference: item.reference,
    service: item.service,
    location: item.location,
    details: item.details,
    status: item.status,
    note: item.admin_note,
    preferredDate: item.preferred_date,
    createdAt: item.created_at,
  }));
  const pending = rows.filter((item) => item.status === "pending").length;
  const confirmed = rows.filter((item) => item.status === "confirmed").length;
  const name = profile?.full_name?.split(" ")[0] || user.email?.split("@")[0];

  return <DashboardShell admin={isAdmin === true} current="dashboard" language={language}>
    <header className="dashboard-header">
      <div><p className="eyebrow">{t.eyebrow}</p><h1>{t.welcome}, {name}.</h1><p>{t.intro}</p></div>
      <div className="button-row"><AdminLanguageSwitch language={language} /><DashboardSignOut label={t.signOut} /></div>
    </header>
    <section className="metrics-grid" aria-label={t.overview}>
      <MetricCard label={t.total} value={String(rows.length)} detail={t.totalDetail} />
      <MetricCard label={t.pending} value={String(pending)} detail={t.pendingDetail} />
      <MetricCard label={t.confirmed} value={String(confirmed)} detail={t.confirmedDetail} />
    </section>
    <section>
      <div className="content-heading"><h2>{t.heading}</h2><Link className="button button-primary button-small" href="/#booking">{t.newRequest}</Link></div>
      {rows.length
        ? <div className="appointment-grid">{rows.map((item) => <AppointmentCard key={item.id} appointment={item} language={language} />)}</div>
        : <div className="empty-state"><h3>{t.emptyTitle}</h3><p>{t.emptyText}</p><Link className="button button-primary" href="/#booking">{t.emptyCta}</Link></div>}
    </section>
  </DashboardShell>;
}
