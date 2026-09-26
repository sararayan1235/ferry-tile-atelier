import type { AppointmentStatus } from "@/lib/appointments";
import { appointmentStatusLabel } from "@/lib/appointments";
import { CalendarDays, MapPin } from "lucide-react";

export type DashboardAppointment = {
  id: string;
  reference: string;
  service: string;
  preferredDate: string;
  location: string;
  details: string;
  status: AppointmentStatus;
  createdAt: string;
  note?: string | null;
};

export function formatDate(isoDate: string) {
  return new Intl.DateTimeFormat("nl-NL", { dateStyle: "long", timeZone: "UTC" }).format(new Date(`${isoDate.slice(0, 10)}T00:00:00Z`));
}

export function StatusPill({ status }: { status: AppointmentStatus }) {
  return <span className={`status-pill status-${status}`}>{appointmentStatusLabel(status)}</span>;
}

export function MetricCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <article className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </article>
  );
}

export function AppointmentCard({ appointment }: { appointment: DashboardAppointment }) {
  return (
    <article className="appointment-card">
      <div className="appointment-card-top">
        <span className="reference">{appointment.reference}</span>
        <StatusPill status={appointment.status} />
      </div>
      <h3>{appointment.service}</h3>
      <div className="appointment-meta">
        <span><CalendarDays aria-hidden="true" />{formatDate(appointment.preferredDate)}</span>
        <span><MapPin aria-hidden="true" />{appointment.location}</span>
      </div>
      <p>{appointment.details}</p>
      {appointment.note && <div className="appointment-note"><b>Bericht van S.R.</b>{appointment.note}</div>}
    </article>
  );
}
