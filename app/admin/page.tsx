import { redirect } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { DashboardSignOut } from "@/components/client-controls";
import { DashboardShell } from "@/components/site-shell";
import { MetricCard, StatusPill } from "@/components/dashboard";
import { updateAppointmentStatus } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/supabase/server";
import { hasSupabaseConfig } from "@/lib/supabase/config";
import { nextAppointmentStatuses } from "@/lib/appointments";
import type { Appointment } from "@/lib/types";

export const metadata = { title: "Beheer" };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!hasSupabaseConfig()) redirect("/setup?next=/admin");
  const { supabase, isAdmin } = await requireAdmin();
  if (!isAdmin) redirect("/dashboard");
  const { data } = await supabase.from("appointments").select("*").order("created_at", { ascending: false });
  const appointments = (data || []) as Appointment[];
  const pending = appointments.filter((item) => item.status === "pending").length;
  const confirmed = appointments.filter((item) => item.status === "confirmed").length;
  return <DashboardShell admin><header className="dashboard-header"><div><p className="eyebrow">Administratie</p><h1>Aanvragen beheren.</h1><p>Bevestig, plan werk af of sluit een aanvraag af.</p></div><DashboardSignOut /></header><section className="metrics-grid"><MetricCard label="Nieuw" value={String(pending)} detail="Wacht op actie" /><MetricCard label="Bevestigd" value={String(confirmed)} detail="In planning" /><MetricCard label="Totaal" value={String(appointments.length)} detail="Alle aanvragen" /></section><section className="admin-list"><div className="content-heading"><h2>Alle aanvragen</h2></div>{appointments.length ? appointments.map((item) => <AdminRow key={item.id} item={item} />) : <div className="empty-state"><h3>Geen aanvragen</h3><p>Nieuwe aanvragen verschijnen automatisch in deze lijst.</p></div>}</section></DashboardShell>;
}

function AdminRow({ item }: { item: Appointment }) {
  const date = new Intl.DateTimeFormat("nl-NL", { dateStyle: "long" }).format(new Date(item.preferred_date));
  return <article className="admin-row"><div className="admin-row-main"><div><span className="reference">{item.reference}</span><StatusPill status={item.status} /></div><h3>{item.service}</h3><p>{item.name} · <a href={`tel:${item.phone.replace(/\s/g, "")}`}>{item.phone}</a> · <a href={`mailto:${item.email}`}>{item.email}</a></p><small>{date} · {item.location}</small><p className="admin-details">{item.details}</p></div><form action={updateAppointmentStatus} className="admin-actions"><input type="hidden" name="id" value={item.id} /><label><span>Interne notitie</span><input name="note" maxLength={500} placeholder="Optioneel" /></label>{nextAppointmentStatuses(item.status).map((status) => <button className={`button ${status === "declined" ? "button-danger" : "button-primary"}`} name="status" value={status} key={status} type="submit">{status === "confirmed" ? "Bevestigen" : status === "completed" ? "Afronden" : "Afwijzen"}<ArrowRight /></button>)}</form></article>;
}
