"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function LoginForm({ next = "/dashboard" }: { next?: string }) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage("");
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");
    const supabase = createSupabaseBrowserClient();
    const result = mode === "login"
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password, options: { data: { full_name: String(form.get("full_name") || ""), phone: String(form.get("phone") || "") }, emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` } });
    if (result.error) { setMessage(result.error.message); setBusy(false); return; }
    if (mode === "signup" && !result.data.session) { setMessage("Controleer uw e-mail om uw account te bevestigen."); setBusy(false); return; }
    router.push(next); router.refresh();
  }

  return <div className="login-card"><p className="eyebrow">Klantenportaal</p><h1>{mode === "login" ? "Welkom terug." : "Maak uw account."}</h1><p>{mode === "login" ? "Bekijk uw aanvragen en hun actuele status." : "Volg uw aanvragen en communiceer veilig via één dashboard."}</p><div className="segmented"><button className={mode === "login" ? "active" : ""} onClick={() => setMode("login")} type="button">Inloggen</button><button className={mode === "signup" ? "active" : ""} onClick={() => setMode("signup")} type="button">Account maken</button></div><form onSubmit={submit} className="auth-form">{mode === "signup" && <><label><span>Naam</span><input name="full_name" autoComplete="name" required /></label><label><span>Telefoon</span><input name="phone" type="tel" autoComplete="tel" required /></label></>}<label><span>E-mailadres</span><input name="email" type="email" autoComplete="email" required /></label><label><span>Wachtwoord</span><input name="password" type="password" minLength={8} autoComplete={mode === "login" ? "current-password" : "new-password"} required /></label>{message && <p className="form-error" role="alert">{message}</p>}<button className="button button-primary button-wide" disabled={busy} type="submit">{busy ? <LoaderCircle className="spin" /> : <>{mode === "login" ? "Inloggen" : "Account maken"}<ArrowRight /></>}</button></form></div>;
}
