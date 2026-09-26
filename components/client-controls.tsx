"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export type Language = "nl" | "en";
const STORAGE_KEY = "sr-language";

/** Site language, remembered per browser. Starts as Dutch on the server to keep hydration stable. */
export function useLanguage(): [Language, (next: Language) => void] {
  const [language, setLanguage] = useState<Language>("nl");

  useEffect(() => {
    let saved: string | null = null;
    try { saved = window.localStorage.getItem(STORAGE_KEY); } catch {}
    if (saved === "en") {
      const timer = window.setTimeout(() => setLanguage("en"), 0);
      return () => window.clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    try { window.localStorage.setItem(STORAGE_KEY, language); } catch {}
    // Mirror to a cookie so server-rendered portal pages can follow the choice.
    document.cookie = `${STORAGE_KEY}=${language}; path=/; max-age=31536000; samesite=lax`;
  }, [language]);

  return [language, setLanguage];
}

export function LanguageToggle({ language, onChange }: { language: Language; onChange: (language: Language) => void }) {
  return (
    <div className="language-toggle" role="group" aria-label="Taal / Language">
      <button className={language === "nl" ? "active" : ""} aria-pressed={language === "nl"} onClick={() => onChange("nl")} type="button">NL</button>
      <button className={language === "en" ? "active" : ""} aria-pressed={language === "en"} onClick={() => onChange("en")} type="button">EN</button>
    </div>
  );
}

export function DashboardSignOut({ label = "Uitloggen" }: { label?: string }) {
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function signOut() {
    setBusy(true);
    await createSupabaseBrowserClient().auth.signOut();
    router.push("/");
    router.refresh();
  }
  return <button className="button button-ghost button-small" onClick={signOut} disabled={busy} type="button"><LogOut aria-hidden="true" />{busy ? "…" : label}</button>;
}
