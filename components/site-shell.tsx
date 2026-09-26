import Link from "next/link";
import { CalendarPlus, LayoutList, Phone, ShieldCheck } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { BUSINESS } from "@/lib/business";
import type { Language } from "@/lib/language";

const NAV = {
  nl: { portal: "Portaal", appointments: "Mijn afspraken", admin: "Beheer", request: "Nieuwe aanvraag", home: "naar de website" },
  en: { portal: "Portal", appointments: "My appointments", admin: "Admin", request: "New request", home: "back to the website" },
};

export function DashboardShell({ children, admin = false, current, language = "nl" }: { children: React.ReactNode; admin?: boolean; current?: "dashboard" | "admin"; language?: Language }) {
  const t = NAV[language];
  return <div className="dashboard-frame">
    <aside className="dashboard-sidebar">
      <Link href="/" aria-label={`S.R. Fine Tile Atelier, ${t.home}`}><BrandMark /></Link>
      <nav aria-label={t.portal}>
        <Link href="/dashboard" aria-current={current === "dashboard" ? "page" : undefined}><LayoutList aria-hidden="true" />{t.appointments}</Link>
        {admin && <Link href="/admin" aria-current={current === "admin" ? "page" : undefined}><ShieldCheck aria-hidden="true" />{t.admin}</Link>}
        <Link href="/#booking"><CalendarPlus aria-hidden="true" />{t.request}</Link>
        <a href={BUSINESS.phoneHref}><Phone aria-hidden="true" />{BUSINESS.phoneDisplay}</a>
      </nav>
      <small>{BUSINESS.addressLine1} · {BUSINESS.addressLine2}</small>
    </aside>
    <main className="dashboard-main" id="main">{children}</main>
  </div>;
}
