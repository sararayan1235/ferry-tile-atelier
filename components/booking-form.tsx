"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, CheckCircle2, LoaderCircle } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { AppointmentInput } from "@/lib/appointments";

const copy = {
  nl: {
    eyebrow: "Afspraak aanvragen",
    title: "Laat uw ruimte spreken.",
    intro: "Vul uw gegevens in. U krijgt direct een referentie en volgt de aanvraag vanuit uw dashboard.",
    name: "Naam", phone: "Telefoon", email: "E-mailadres", location: "Postcode of plaats",
    service: "Gewenst werk", date: "Voorkeursdatum", details: "Omschrijving", detailsHint: "Wat moet er gebeuren? Voeg eventueel een foto of afmeting toe.",
    submit: "Aanvraag versturen", submitting: "Aanvraag versturen…", account: "Inloggen om aan te vragen",
    success: "Aanvraag ontvangen", successText: "Bewaar deze referentie. Je vindt de aanvraag terug in je dashboard.",
    another: "Nog een aanvraag", error: "Controleer de gegevens en probeer opnieuw.", config: "Accounts worden binnenkort geactiveerd.", privacy: "Uw gegevens worden alleen gebruikt om deze aanvraag en de service te behandelen.", dashboard: "Open dashboard", freeAccount: "Een gratis account zorgt ervoor dat je je aanvraag en status altijd kunt volgen.",
  },
  en: {
    eyebrow: "Request an appointment",
    title: "Let your space speak.",
    intro: "Send your details. You will receive a reference immediately and track the request in your dashboard.",
    name: "Name", phone: "Phone", email: "Email address", location: "Postcode or city",
    service: "Service needed", date: "Preferred date", details: "Project details", detailsHint: "What needs to be done? Add a photo or measurements if useful.",
    submit: "Send request", submitting: "Sending request…", account: "Sign in to request",
    success: "Request received", successText: "Keep this reference. You can follow the request in your dashboard.",
    another: "Another request", error: "Check the details and try again.", config: "Accounts will be activated shortly.", privacy: "Your details are only used to handle this request and provide the service.", dashboard: "Open dashboard", freeAccount: "A free account lets you follow your request and status at all times.",
  },
};

const servicesNl = ["Tegelwerk", "Reparatie & onderhoud", "Natuursteen op maat", "Voegen & afwerking", "Anders"];
const servicesEn = ["Tiling", "Repair & maintenance", "Bespoke natural stone", "Grouting & finishing", "Other"];

export function BookingForm({ enabled = true, language = "nl" }: { enabled?: boolean; language?: "nl" | "en" }) {
  const [state, setState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [reference, setReference] = useState("");
  const [message, setMessage] = useState("");
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const t = copy[language];

  const ensureSignedIn = useCallback(async () => {
    if (!enabled) return false;
    const supabase = createSupabaseBrowserClient();
    const { data } = await supabase.auth.getUser();
    return Boolean(data.user);
  }, [enabled]);

  function requireSignedIn() {
    return ensureSignedIn().then((signedIn) => {
      setSignedIn(signedIn);
      return signedIn;
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!enabled) return setMessage(t.config);
    const form = event.currentTarget;
    if (!(await requireSignedIn())) {
      const data = Object.fromEntries(new FormData(form));
      sessionStorage.setItem("sr-booking-draft", JSON.stringify(data));
      router.push("/login?next=/#booking");
      return;
    }
    setState("submitting");
    setMessage("");
    const payload = Object.fromEntries(new FormData(form)) as unknown as AppointmentInput & { requestId: string };
    payload.requestId = crypto.randomUUID();
    const response = await fetch("/api/appointments", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) {
      setState("error");
      setMessage(data.error || t.error);
      return;
    }
    setReference(data.reference);
    setState("success");
    form.reset();
  }

  useEffect(() => {
    if (!enabled) return;
    const timer = window.setTimeout(() => {
      void ensureSignedIn().then((yes) => {
        if (!yes) return;
        const draft = sessionStorage.getItem("sr-booking-draft");
        const form = formRef.current;
        if (!draft || !form) return;
        const values = JSON.parse(draft) as Record<string, string>;
        Object.entries(values).forEach(([name, value]) => {
          const field = form.elements.namedItem(name);
          if (field instanceof HTMLInputElement || field instanceof HTMLSelectElement || field instanceof HTMLTextAreaElement) field.value = value;
        });
        sessionStorage.removeItem("sr-booking-draft");
      });
    }, 0);
    return () => window.clearTimeout(timer);
  }, [enabled, ensureSignedIn]);

  if (state === "success") return (
    <div className="booking-success" role="status">
      <CheckCircle2 aria-hidden="true" />
      <p className="eyebrow">{t.success}</p>
      <h3>{reference}</h3>
      <p>{t.successText}</p>
      <div className="button-row">
        <Link className="button button-primary" href="/dashboard">{t.dashboard} <ArrowRight aria-hidden="true" /></Link>
        <button className="button button-ghost" type="button" onClick={() => setState("idle")}>{t.another}</button>
      </div>
    </div>
  );

  return (
    <form ref={formRef} className="booking-form" onSubmit={handleSubmit} noValidate>
      <div className="form-grid">
        <label><span>{t.name} *</span><input name="name" autoComplete="name" required minLength={2} maxLength={100} /></label>
        <label><span>{t.phone} *</span><input name="phone" type="tel" autoComplete="tel" required maxLength={30} /></label>
        <label><span>{t.email} *</span><input name="email" type="email" autoComplete="email" required maxLength={160} /></label>
        <label><span>{t.location} *</span><input name="location" autoComplete="postal-code" required maxLength={100} /></label>
        <label><span>{t.service} *</span><select name="service" required defaultValue=""><option value="" disabled>{language === "nl" ? "Kies een dienst" : "Choose a service"}</option>{(language === "nl" ? servicesNl : servicesEn).map((service) => <option key={service}>{service}</option>)}</select></label>
        <label><span>{t.date} *</span><input name="preferredDate" type="date" required min={new Date().toISOString().slice(0, 10)} /></label>
        <label className="field-wide"><span>{t.details} *</span><textarea name="details" rows={5} minLength={15} maxLength={2000} required placeholder={t.detailsHint} /></label>
        <label className="honeypot" aria-hidden="true">Website<input name="companyWebsite" tabIndex={-1} autoComplete="off" /></label>
      </div>
      {signedIn === false && <p className="form-hint">{t.freeAccount}</p>}
      {message && <p className="form-error" role="alert">{message}</p>}
      <button className="button button-primary button-wide" type="submit" disabled={state === "submitting" || !enabled}>
        {state === "submitting" ? <><LoaderCircle className="spin" aria-hidden="true" />{t.submitting}</> : <>{signedIn === false ? t.account : t.submit}<ArrowRight aria-hidden="true" /></>}
      </button>
      <p className="privacy-note">{t.privacy}</p>
    </form>
  );
}
