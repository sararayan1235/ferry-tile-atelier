import Link from "next/link";
import { redirect } from "next/navigation";
import { DashboardSignOut } from "@/components/client-controls";
import { DashboardShell } from "@/components/site-shell";
import { AppointmentCard, MetricCard } from "@/components/dashboard";
import { requireUser } from "@/lib/supabase/server";
import { hasSupabaseConfig } from "@/lib/supabase/config";
import type { Appointment } from "@/lib/types";

export const metadata = { title: "Mijn afspraken" };
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  if (!hasSupabaseConfig()) redirect("/setup?next=/dashboard");
  const { supabase, user } = await requireUser();
  if (!user) redirect("/login?next=/dashboard");
  const [{ data: profile }, { data }] = await Promise.all([
    supabase.from("profiles").select("full_name,role").eq("id", user.id).single(),
    // RLS returns only this user's rows (admins see everything on /admin, so filter explicitly here).
    supabase.from("appointments").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
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

  return <DashboardShell admin={profile?.role === "admin"} current="dashboard">
    <header className="dashboard-header">
      <div><p className="eyebrow">Klantportaal</p><h1>Welkom, {name}.</h1><p>Hier vindt u uw aanvragen en de actuele voortgang.</p></div>
      <DashboardSignOut />
    </header>
    <section className="metrics-grid" aria-label="Overzicht">
      <MetricCard label="Totaal aanvragen" value={String(rows.length)} detail="Sinds uw eerste aanvraag" />
      <MetricCard label="In behandeling" value={String(pending)} detail="Wacht op reactie" />
      <MetricCard label="Bevestigd" value={String(confirmed)} detail="Gepland werk" />
    </section>
    <section>
      <div className="content-heading"><h2>Mijn afspraken</h2><Link className="button button-primary button-small" href="/#booking">Nieuwe aanvraag</Link></div>
      {rows.length
        ? <div className="appointment-grid">{rows.map((item) => <AppointmentCard key={item.id} appointment={item} />)}</div>
        : <div className="empty-state"><h3>Nog geen aanvragen</h3><p>Wanneer u een aanvraag plaatst, verschijnt deze hier met de actuele status.</p><Link className="button button-primary" href="/#booking">Offerte aanvragen</Link></div>}
    </section>
  </DashboardShell>;
}
