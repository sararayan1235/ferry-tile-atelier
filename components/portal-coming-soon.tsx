"use client";

import Link from "next/link";
import { Phone } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { LanguageToggle, useLanguage } from "@/components/client-controls";
import { BUSINESS } from "@/lib/business";

const copy = {
  nl: {
    eyebrow: "Klantportaal",
    title: "Het klantportaal opent binnenkort.",
    text: "Online accounts en het volgen van uw aanvragen worden op dit moment ingericht. Wilt u nu al een afspraak maken of een offerte aanvragen? Bel ons gerust.",
    call: `Bel ${BUSINESS.phoneDisplay}`,
    back: "Terug naar de website",
  },
  en: {
    eyebrow: "Customer portal",
    title: "The customer portal opens soon.",
    text: "Online accounts and request tracking are being set up right now. Want to book an appointment or get a quote today? Just give us a call.",
    call: `Call ${BUSINESS.phoneDisplay}`,
    back: "Back to the website",
  },
};

// Shown to visitors while the database isn't connected yet. Setup steps for the developer live in DEPLOY.md.
export function PortalComingSoon() {
  const [language, setLanguage] = useLanguage();
  const t = copy[language];
  return (
    <main className="setup-page">
      <Link href="/" aria-label="S.R. Fine Tile Atelier, home"><BrandMark /></Link>
      <div className="setup-card">
        <div className="content-heading"><p className="eyebrow" style={{ margin: 0 }}>{t.eyebrow}</p><LanguageToggle language={language} onChange={setLanguage} /></div>
        <h1>{t.title}</h1>
        <p>{t.text}</p>
        <div className="button-row" style={{ marginTop: 32 }}>
          <a className="button button-primary" href={BUSINESS.phoneHref}><Phone aria-hidden="true" />{t.call}</a>
          <Link className="button button-secondary" href="/">{t.back}</Link>
        </div>
      </div>
    </main>
  );
}
