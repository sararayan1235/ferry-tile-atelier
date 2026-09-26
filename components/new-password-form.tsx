"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function NewPasswordForm() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") || "");
    if (password !== String(form.get("confirm") || "")) { setError("De wachtwoorden zijn niet gelijk. / Passwords don't match."); return; }
    setBusy(true); setError("");
    const { error: updateError } = await createSupabaseBrowserClient().auth.updateUser({ password });
    if (updateError) { setError(updateError.message); setBusy(false); return; }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="login-card">
      <p className="eyebrow">Klantportaal · Customer portal</p>
      <h1>Nieuw wachtwoord.</h1>
      <p>Kies een nieuw wachtwoord van minimaal 8 tekens. / Choose a new password of at least 8 characters.</p>
      <form className="auth-form" onSubmit={submit} style={{ marginTop: 24 }}>
        <label><span>Nieuw wachtwoord / New password</span><input name="password" type="password" minLength={8} autoComplete="new-password" required /></label>
        <label><span>Herhaal / Repeat</span><input name="confirm" type="password" minLength={8} autoComplete="new-password" required /></label>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="button button-primary button-wide" type="submit" disabled={busy}>{busy ? <LoaderCircle className="spin" aria-hidden="true" /> : <>Opslaan / Save<ArrowRight aria-hidden="true" /></>}</button>
      </form>
    </div>
  );
}
