import { NextResponse } from "next/server";
import { validateAppointmentInput } from "@/lib/appointments";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { hasSupabaseConfig } from "@/lib/supabase/config";

const attempts = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 8;

function rateLimited(key: string) {
  const now = Date.now();
  const current = attempts.get(key);
  if (!current || current.resetAt < now) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  current.count += 1;
  return current.count > MAX_ATTEMPTS;
}

export async function POST(request: Request) {
  if (!hasSupabaseConfig()) return NextResponse.json({ error: "Accounts worden binnenkort geactiveerd." }, { status: 503 });
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (rateLimited(ip)) return NextResponse.json({ error: "Te veel aanvragen. Probeer het later opnieuw." }, { status: 429 });

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") return NextResponse.json({ error: "Ongeldige aanvraag." }, { status: 400 });
  if ("companyWebsite" in body && String(body.companyWebsite || "").trim()) {
    return NextResponse.json({ reference: "SR-ONTVANGEN" }, { status: 202 });
  }
  if (typeof body.requestId !== "string" || !/^[0-9a-f-]{36}$/i.test(body.requestId)) {
    return NextResponse.json({ error: "Ongeldige aanvraag-ID." }, { status: 400 });
  }
  const result = validateAppointmentInput(body);
  if (!result.ok) return NextResponse.json({ error: "Controleer de gemarkeerde velden.", fields: result.errors }, { status: 422 });
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Log in om een aanvraag te versturen." }, { status: 401 });
  const admin = createSupabaseAdminClient();

  const month = new Date().toISOString().slice(2, 7).replace("-", "");
  const reference = `SR-${month}-${body.requestId.slice(0, 6).toUpperCase()}`;
  const { error } = await admin.from("appointments").insert({
    user_id: user.id,
    request_id: body.requestId,
    reference,
    name: result.input.name,
    phone: result.input.phone,
    email: result.input.email,
    location: result.input.location,
    service: result.input.service,
    preferred_date: result.input.preferredDate,
    details: result.input.details,
  });
  if (error?.code === "23505") {
    const { data: existing } = await admin.from("appointments").select("reference").eq("user_id", user.id).eq("request_id", body.requestId).single();
    return NextResponse.json({ reference: existing?.reference || reference, duplicate: true });
  }
  if (error) return NextResponse.json({ error: "De aanvraag kon niet worden opgeslagen." }, { status: 500 });
  return NextResponse.json({ reference, status: "pending" }, { status: 201 });
}
