"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function LanguageToggle() {
  const [language, setLanguage] = useState<"nl" | "en">(() => {
    if (typeof window === "undefined") return "nl";
    const saved = localStorage.getItem("sr-language");
    return saved === "en" ? "en" : "nl";
  });
  useEffect(() => {
    document.documentElement.lang = language;
    localStorage.setItem("sr-language", language);
  }, [language]);
  return (
    <div className="language-toggle" aria-label="Language / Taal">
      <button className={language === "nl" ? "active" : ""} onClick={() => setLanguage("nl")} type="button">NL</button>
      <button className={language === "en" ? "active" : ""} onClick={() => setLanguage("en")} type="button">EN</button>
    </div>
  );
}

export function DashboardSignOut() {
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function signOut() {
    setBusy(true);
    await createSupabaseBrowserClient().auth.signOut();
    router.push("/");
    router.refresh();
  }
  return <button className="button button-ghost" onClick={signOut} disabled={busy} type="button">{busy ? "…" : "Uitloggen"}</button>;
}
