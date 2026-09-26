"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { LanguageToggle, useLanguage } from "@/components/client-controls";

type Mode = "login" | "signup" | "reset";
type Provider = "google" | "apple";

// Which social buttons to show. Set at build time, e.g. NEXT_PUBLIC_AUTH_PROVIDERS="google,apple".
// Apple needs a paid Apple Developer account, so it stays off until configured in Supabase.
const PROVIDERS = (process.env.NEXT_PUBLIC_AUTH_PROVIDERS ?? "google")
  .split(",").map((p) => p.trim()).filter((p): p is Provider => p === "google" || p === "apple");

const copy = {
  nl: {
    eyebrow: "Klantportaal", back: "← Terug naar de website",
    title: { login: "Welkom terug.", signup: "Maak uw account.", reset: "Wachtwoord vergeten." },
    intro: { login: "Bekijk uw aanvragen en de actuele status.", signup: "Volg uw aanvragen en afspraken vanuit één overzicht.", reset: "Vul uw e-mailadres in. U ontvangt een link om een nieuw wachtwoord te kiezen." },
    google: "Doorgaan met Google", apple: "Doorgaan met Apple", or: "of met e-mail",
    tabs: { login: "Inloggen", signup: "Account maken" },
    name: "Naam", phone: "Telefoon", email: "E-mailadres", password: "Wachtwoord",
    submit: { login: "Inloggen", signup: "Account maken", reset: "Stuur resetlink" },
    forgot: "Wachtwoord vergeten?", backToLogin: "Terug naar inloggen",
    confirm: "Controleer uw e-mail om uw account te bevestigen.",
    resetSent: "Als dit adres bij ons bekend is, ontvangt u zo een e-mail met een resetlink.",
    legal: "Door in te loggen gaat u akkoord met de verwerking van uw gegevens voor uw aanvragen.",
  },
  en: {
    eyebrow: "Customer portal", back: "← Back to the website",
    title: { login: "Welcome back.", signup: "Create your account.", reset: "Forgot password." },
    intro: { login: "See your requests and their current status.", signup: "Follow your requests and appointments in one place.", reset: "Enter your email address. You'll receive a link to choose a new password." },
    google: "Continue with Google", apple: "Continue with Apple", or: "or with email",
    tabs: { login: "Sign in", signup: "Create account" },
    name: "Name", phone: "Phone", email: "Email address", password: "Password",
    submit: { login: "Sign in", signup: "Create account", reset: "Send reset link" },
    forgot: "Forgot your password?", backToLogin: "Back to sign in",
    confirm: "Check your email to confirm your account.",
    resetSent: "If this address is known to us, you'll receive an email with a reset link shortly.",
    legal: "By signing in you agree to your details being used to handle your requests.",
  },
};

function callbackUrl(next: string) {
  return `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
}

export function LoginForm({ next = "/dashboard", initialError = "" }: { next?: string; initialError?: string }) {
  const [language, setLanguage] = useLanguage();
  const [mode, setMode] = useState<Mode>("login");
  const [busy, setBusy] = useState<false | Mode | Provider>(false);
  const [error, setError] = useState(initialError);
  const [notice, setNotice] = useState("");
  const router = useRouter();
  const t = copy[language];

  function switchMode(nextMode: Mode) { setMode(nextMode); setError(""); setNotice(""); }

  async function oauth(provider: Provider) {
    setBusy(provider); setError("");
    const { error: oauthError } = await createSupabaseBrowserClient().auth.signInWithOAuth({
      provider,
      options: { redirectTo: callbackUrl(next) },
    });
    // On success the browser is already navigating to the provider.
    if (oauthError) { setError(oauthError.message); setBusy(false); }
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(mode); setError(""); setNotice("");
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "").trim();
    const supabase = createSupabaseBrowserClient();

    if (mode === "reset") {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: callbackUrl("/auth/reset") });
      if (resetError) setError(resetError.message); else setNotice(t.resetSent);
      setBusy(false);
      return;
    }

    const password = String(form.get("password") || "");
    const result = mode === "login"
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: String(form.get("full_name") || ""), phone: String(form.get("phone") || "") },
            emailRedirectTo: callbackUrl(next),
          },
        });
    if (result.error) { setError(result.error.message); setBusy(false); return; }
    if (mode === "signup" && !result.data.session) { setNotice(t.confirm); setBusy(false); return; }
    router.push(next);
    router.refresh();
  }

  return (
    <div className="login-card">
      <div className="auth-back"><Link href="/">{t.back}</Link><LanguageToggle language={language} onChange={setLanguage} /></div>
      <p className="eyebrow">{t.eyebrow}</p>
      <h1>{t.title[mode]}</h1>
      <p>{t.intro[mode]}</p>

      {mode !== "reset" && PROVIDERS.length > 0 && <>
        <div className="oauth">
          {PROVIDERS.includes("google") && <button className="button" type="button" onClick={() => oauth("google")} disabled={Boolean(busy)}>{busy === "google" ? <LoaderCircle className="spin" aria-hidden="true" /> : <GoogleIcon />}{t.google}</button>}
          {PROVIDERS.includes("apple") && <button className="button" type="button" onClick={() => oauth("apple")} disabled={Boolean(busy)}>{busy === "apple" ? <LoaderCircle className="spin" aria-hidden="true" /> : <AppleIcon />}{t.apple}</button>}
        </div>
        <p className="divider">{t.or}</p>
      </>}

      {mode !== "reset" && <div className="segmented" role="tablist">
        <button className={mode === "login" ? "active" : ""} role="tab" aria-selected={mode === "login"} onClick={() => switchMode("login")} type="button">{t.tabs.login}</button>
        <button className={mode === "signup" ? "active" : ""} role="tab" aria-selected={mode === "signup"} onClick={() => switchMode("signup")} type="button">{t.tabs.signup}</button>
      </div>}

      <form onSubmit={submit} className="auth-form">
        {mode === "signup" && <>
          <label><span>{t.name}</span><input name="full_name" autoComplete="name" required /></label>
          <label><span>{t.phone}</span><input name="phone" type="tel" autoComplete="tel" required /></label>
        </>}
        <label><span>{t.email}</span><input name="email" type="email" autoComplete="email" required /></label>
        {mode !== "reset" && <label><span>{t.password}</span><input name="password" type="password" minLength={8} autoComplete={mode === "login" ? "current-password" : "new-password"} required /></label>}
        {error && <p className="form-error" role="alert">{error}</p>}
        {notice && <p className="form-ok" role="status">{notice}</p>}
        <button className="button button-primary button-wide" disabled={Boolean(busy)} type="submit">
          {busy === mode ? <LoaderCircle className="spin" aria-hidden="true" /> : <>{t.submit[mode]}<ArrowRight aria-hidden="true" /></>}
        </button>
        {mode === "login" && <button className="link-button" type="button" onClick={() => switchMode("reset")}>{t.forgot}</button>}
        {mode === "reset" && <button className="link-button" type="button" onClick={() => switchMode("login")}>{t.backToLogin}</button>}
      </form>
      <p className="auth-legal">{t.legal}</p>
    </div>
  );
}

function GoogleIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.26-.96 2.33-2.04 3.05l3.3 2.56c1.92-1.77 3.04-4.38 3.04-7.48 0-.72-.06-1.41-.18-2.07H12z"/><path fill="#34A853" d="M5.84 14.29l-.74.57-2.63 2.05C4.1 20.2 7.8 22.5 12 22.5c2.84 0 5.22-.94 6.96-2.55l-3.3-2.56c-.91.61-2.08.98-3.66.98-2.8 0-5.18-1.89-6.03-4.43z"/><path fill="#4A90D9" d="M2.47 7.09A10.4 10.4 0 0 0 1.5 12c0 1.77.42 3.43 1.17 4.91l3.37-2.62a6.3 6.3 0 0 1 0-4.58z"/><path fill="#FBBC05" d="M12 5.98c1.55 0 2.93.53 4.02 1.57l2.92-2.92C17.21 3.02 14.84 1.5 12 1.5 7.8 1.5 4.1 3.8 2.47 7.09l3.37 2.62C6.68 7.17 9.07 5.98 12 5.98z"/></svg>;
}

function AppleIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M16.37 12.64c-.02-2.2 1.8-3.26 1.88-3.31-1.03-1.5-2.62-1.7-3.19-1.73-1.36-.14-2.65.8-3.34.8-.69 0-1.75-.78-2.88-.76-1.48.02-2.85.86-3.61 2.19-1.54 2.67-.39 6.62 1.1 8.79.73 1.06 1.6 2.25 2.74 2.2 1.1-.04 1.52-.71 2.85-.71 1.33 0 1.7.71 2.87.69 1.18-.02 1.93-1.08 2.66-2.14.84-1.23 1.18-2.42 1.2-2.48-.03-.01-2.3-.88-2.32-3.49zM14.18 6.18c.6-.74 1.01-1.76.9-2.78-.87.04-1.93.58-2.55 1.31-.56.65-1.05 1.69-.92 2.69.97.08 1.97-.49 2.57-1.22z"/></svg>;
}
