"use client";

import { useRouter } from "next/navigation";
import { LanguageToggle, type Language } from "@/components/client-controls";

/** NL/EN switch for server-rendered portal pages (customer + admin): saves the choice, then re-renders. */
export function AdminLanguageSwitch({ language }: { language: Language }) {
  const router = useRouter();
  function change(next: Language) {
    if (next === language) return;
    document.cookie = `sr-language=${next}; path=/; max-age=31536000; samesite=lax`;
    try { window.localStorage.setItem("sr-language", next); } catch {}
    router.refresh();
  }
  return <LanguageToggle language={language} onChange={change} />;
}
