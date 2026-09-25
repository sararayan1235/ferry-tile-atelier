"use server";

import { revalidatePath } from "next/cache";
import { APPOINTMENT_STATUSES, type AppointmentStatus } from "@/lib/appointments";
import { requireAdmin } from "@/lib/supabase/server";

export async function updateAppointmentStatus(formData: FormData) {
  const { supabase, user, isAdmin } = await requireAdmin();
  if (!isAdmin || !user) throw new Error("Niet toegestaan");
  const id = String(formData.get("id") || "");
  const next = String(formData.get("status") || "") as AppointmentStatus;
  if (!/^[0-9a-f-]{36}$/i.test(id) || !APPOINTMENT_STATUSES.includes(next)) throw new Error("Ongeldige aanvraag");
  const note = String(formData.get("note") || "").slice(0, 500);
  const { error } = await supabase.rpc("transition_appointment", {
    p_appointment_id: id,
    p_next: next,
    p_note: note || null,
  });
  if (error) throw new Error("Statuswijziging mislukt");
  revalidatePath("/admin");
  revalidatePath("/dashboard");
}
