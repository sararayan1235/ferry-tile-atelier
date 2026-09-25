import Link from "next/link";
import { redirect } from "next/navigation";
import { DashboardSignOut } from "@/components/client-controls";
import { DashboardShell } from "@/components/site-shell";
import { AppointmentCard, MetricCard } from "@/components/dashboard";
import { requireUser } from "@/lib/supabase/server";
import { hasSupabaseConfig } from "@/lib/supabase/config";

export const metadata = { title: "Mijn afspraken" };
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  if (!hasSupabaseConfig()) redirect("/setup?next=/dashboard");
  const { supabase, user } = await requireUser();
  if (!user) redirect("/login?next=/dashboard");
  const [{ data: profile }, { data }] = await Promise.all([
    supabase.from("profiles").select("full_name,role").eq("id", user.id).single(),
    supabase.from("appointments").select("*").order("created_at", { ascending: false }),
  ]);
  const rows = (data || []).map((item) => ({
    ...item,
    preferredDate: item.preferred_date,
    createdAt: item.created_at,
  }));
  const pending = rows.filter((item) => item.status === "pending").length;
  const confirmed = rows.filter((item) => item.status === "confirmed").length;
  return <DashboardShell admin={profile?.role === "admin"}><header className="dashboard-header"><div><p className="eyebrow">Klantenportaal</p><h1>Goedemorgen, {profile?.full_name || user.email?.split("@")[0]}.</h1><p>Hier vindt u uw aanvragen en de actuele voortgang.</p></div><DashboardSignOut /></header><section className="metrics-grid"><MetricCard label="Totaal aanvragen" value={String(rows.length)} detail="Geschiedenis" /><MetricCard label="In behandeling" value={String(pending)} detail="Wacht op reactie" /><MetricCard label="Bevestigd" value={String(confirmed)} detail="Gepland werk" /></section><section><div className="content-heading"><h2>Mijn afspraken</h2><Link className="button button-primary button-small" href="/#booking">Nieuwe aanvraag</Link></div>{rows.length ? <div className="appointment-grid">{rows.map((item) => <AppointmentCard key={item.id} appointment={item} />)}</div> : <div className="empty-state"><h3>Nog geen aanvragen</h3><p>Wanneer u een aanvraag plaatst, verschijnt deze hier met de actuele status.</p><Link className="button button-primary" href="/#booking">Plan uw project</Link></div>}</section></DashboardShell>;
}
