export type Profile = {
  id: string;
  full_name: string;
  phone: string;
  language: "nl" | "en";
  role: "customer" | "admin";
};

export type AppointmentStatus = "pending" | "confirmed" | "declined" | "completed";

export type Appointment = {
  id: string;
  user_id: string;
  request_id: string;
  reference: string;
  name: string;
  phone: string;
  email: string;
  location: string;
  service: string;
  preferred_date: string;
  details: string;
  status: AppointmentStatus;
  admin_note: string | null;
  created_at: string;
  updated_at: string;
};

export type AppointmentEvent = {
  id: string;
  appointment_id: string;
  status: AppointmentStatus;
  note: string | null;
  created_at: string;
};
