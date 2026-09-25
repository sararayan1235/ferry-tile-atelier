"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type Language = "nl" | "en";

export function LanguageToggle({ language, onChange }: { language?: Language; onChange?: (language: Language) => void }) {
  const [internalLanguage, setInternalLanguage] = useState<Language>(() => {
    if (typeof window === "undefined") return "nl";
    return window.localStorage.getItem("sr-language") === "en" ? "en" : "nl";
  });
  const activeLanguage = language ?? internalLanguage;

  useEffect(() => {
    document.documentElement.lang = activeLanguage;
    window.localStorage.setItem("sr-language", activeLanguage);
  }, [activeLanguage]);

  function choose(next: Language) {
    if (!language) setInternalLanguage(next);
    onChange?.(next);
  }

  return (
    <div className="language-toggle" aria-label="Language / Taal">
      <button className={activeLanguage === "nl" ? "active" : ""} onClick={() => choose("nl")} type="button">NL</button>
      <button className={activeLanguage === "en" ? "active" : ""} onClick={() => choose("en")} type="button">EN</button>
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
