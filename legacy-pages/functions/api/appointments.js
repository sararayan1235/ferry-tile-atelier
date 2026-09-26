const json = (data, status = 200, headers = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", ...headers },
  });

const clean = (value, max) => String(value ?? "").trim().slice(0, max);
const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const isPhone = (value) => /^[+\d][\d\s().-]{6,}$/.test(value);
const isDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value);
const isOrigin = (value) => {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.hostname === "localhost" || url.hostname === "127.0.0.1";
  } catch { return false; }
};
const isAllowedOrigin = (value, requestUrl) => {
  if (!value) return true;
  if (value === new URL(requestUrl).origin) return true;
  return value.endsWith(".trycloudflare.com") && isOrigin(value);
};

async function notify(env, booking) {
  if (!env.BOOKING_WEBHOOK_URL) return { delivered: false };
  const response = await fetch(env.BOOKING_WEBHOOK_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      type: "tile_appointment_request",
      reference: booking.reference,
      receivedAt: booking.createdAt,
      customer: { name: booking.name, phone: booking.phone, email: booking.email, location: booking.postcode },
      appointment: { date: booking.preferredDate, service: booking.service },
      details: booking.details,
    }),
  });
  if (!response.ok) throw new Error(`Notification webhook returned ${response.status}`);
  return { delivered: true };
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const origin = request.headers.get("Origin");
  if (origin && !isAllowedOrigin(origin, request.url)) return json({ error: "Origin not allowed." }, 403);

  let raw;
  try { raw = await request.json(); }
  catch { return json({ error: "Invalid JSON." }, 400); }
  if (!raw || typeof raw !== "object") return json({ error: "Invalid request." }, 400);

  const booking = {
    name: clean(raw.name, 100),
    phone: clean(raw.phone, 30),
    email: clean(raw.email, 160).toLowerCase(),
    postcode: clean(raw.postcode, 80),
    service: clean(raw.service, 100),
    preferredDate: clean(raw.preferredDate, 10),
    details: clean(raw.details, 2000),
  };

  const errors = [];
  if (booking.name.length < 2) errors.push("name");
  if (!isPhone(booking.phone)) errors.push("phone");
  if (!isEmail(booking.email)) errors.push("email");
  if (booking.postcode.length < 2) errors.push("postcode");
  if (!booking.service) errors.push("service");
  if (!isDate(booking.preferredDate)) errors.push("preferredDate");
  if (booking.details.length < 15) errors.push("details");
  if (errors.length) return json({ error: "Please check the highlighted information.", fields: errors }, 422);

  const today = new Date();
  const todayUtc = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  const requested = Date.parse(`${booking.preferredDate}T00:00:00Z`);
  if (!Number.isFinite(requested) || requested < todayUtc) return json({ error: "Please choose today or a future date.", fields: ["preferredDate"] }, 422);

  const now = new Date();
  const bookingId = crypto.randomUUID();
  const reference = `SR-${now.getUTCFullYear().toString().slice(-2)}${String(now.getUTCMonth()+1).padStart(2,"0")}-${bookingId.slice(0,6).toUpperCase()}`;
  const record = { ...booking, reference, createdAt: now.toISOString(), status: "pending" };

  if (env.APPOINTMENTS) {
    const statement = `INSERT INTO appointments
      (id, reference, name, phone, email, postcode, service, preferred_date, details, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    await env.APPOINTMENTS.prepare(statement).bind(
      bookingId, record.reference, record.name, record.phone, record.email,
      record.postcode, record.service, record.preferredDate, record.details,
      record.status, record.createdAt
    ).run();
  }

  try {
    const delivery = await notify(env, record);
    if (!delivery.delivered) console.error("BOOKING_STORED_WITHOUT_NOTIFICATION", record.reference);
  } catch (error) {
    console.error("BOOKING_NOTIFICATION_FAILED", record.reference, error instanceof Error ? error.message : String(error));
  }

  return json({ ok: true, reference, status: "pending_confirmation" }, 201);
}

export async function onRequestOptions(context) {
  const origin = context.request.headers.get("Origin");
  return new Response(null, { status: 204, headers: {
    "Access-Control-Allow-Origin": isAllowedOrigin(origin, context.request.url) ? origin : "https://pages.dev",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  }});
}
