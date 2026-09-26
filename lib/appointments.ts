export const APPOINTMENT_STATUSES = ["pending", "confirmed", "declined", "completed"] as const;
export type AppointmentStatus = (typeof APPOINTMENT_STATUSES)[number];
export type ActorRole = "customer" | "admin";

export type AppointmentInput = {
  name: string;
  phone: string;
  email: string;
  location: string;
  service: string;
  preferredDate: string;
  details: string;
};

export type OwnedAppointment = {
  id: string;
  userId: string;
  status: AppointmentStatus;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[+\d][\d\s().-]{6,}$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const clean = (value: unknown, max: number) => String(value ?? "").trim().slice(0, max);

export function validateAppointmentInput(raw: Partial<AppointmentInput>) {
  const input = {
    name: clean(raw.name, 100),
    phone: clean(raw.phone, 30),
    email: clean(raw.email, 160).toLowerCase(),
    location: clean(raw.location, 100),
    service: clean(raw.service, 100),
    preferredDate: clean(raw.preferredDate, 10),
    details: clean(raw.details, 2000),
  };
  const errors: Partial<Record<keyof AppointmentInput, string>> = {};

  if (input.name.length < 2) errors.name = "Vul uw naam in.";
  if (!PHONE_PATTERN.test(input.phone)) errors.phone = "Vul een geldig telefoonnummer in.";
  if (!EMAIL_PATTERN.test(input.email)) errors.email = "Vul een geldig e-mailadres in.";
  if (input.location.length < 2) errors.location = "Vul uw postcode of plaats in.";
  if (!input.service) errors.service = "Kies een dienst.";
  if (!DATE_PATTERN.test(input.preferredDate)) errors.preferredDate = "Kies een datum.";
  // One day of slack so visitors west of UTC can still pick their own "today".
  else if (input.preferredDate < new Date(Date.now() - 86_400_000).toISOString().slice(0, 10)) errors.preferredDate = "Kies een datum in de toekomst.";
  if (input.details.length < 15) errors.details = "Omschrijf de klus in minimaal 15 tekens.";

  if (Object.keys(errors).length) return { ok: false as const, errors, input };
  return { ok: true as const, errors: {} as Record<keyof AppointmentInput, never>, input };
}

export function filterAppointmentsForUser<T extends OwnedAppointment>(rows: T[], userId: string) {
  return rows.filter((row) => row.userId === userId);
}

const transitions: Record<AppointmentStatus, AppointmentStatus[]> = {
  pending: ["confirmed", "declined"],
  confirmed: ["completed"],
  declined: [],
  completed: [],
};

export function nextAppointmentStatuses(status: AppointmentStatus) {
  return [...transitions[status]];
}

export function canTransitionAppointment(
  current: AppointmentStatus,
  next: AppointmentStatus,
  role: ActorRole,
) {
  return role === "admin" && transitions[current].includes(next);
}

const STATUS_LABELS = {
  nl: { pending: "In behandeling", confirmed: "Bevestigd", declined: "Afgewezen", completed: "Afgerond" },
  en: { pending: "Pending", confirmed: "Confirmed", declined: "Declined", completed: "Completed" },
} as const;

export function appointmentStatusLabel(status: AppointmentStatus, language: "nl" | "en" = "nl") {
  return STATUS_LABELS[language][status];
}
