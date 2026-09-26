import Link from "next/link";
import { CalendarPlus, LayoutList, Phone, ShieldCheck } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { BUSINESS } from "@/lib/business";

export function DashboardShell({ children, admin = false, current }: { children: React.ReactNode; admin?: boolean; current?: "dashboard" | "admin" }) {
  return <div className="dashboard-frame">
    <aside className="dashboard-sidebar">
      <Link href="/" aria-label="S.R. Fine Tile Atelier, naar de website"><BrandMark /></Link>
      <nav aria-label="Portaal">
        <Link href="/dashboard" aria-current={current === "dashboard" ? "page" : undefined}><LayoutList aria-hidden="true" />Mijn afspraken</Link>
        {admin && <Link href="/admin" aria-current={current === "admin" ? "page" : undefined}><ShieldCheck aria-hidden="true" />Beheer</Link>}
        <Link href="/#booking"><CalendarPlus aria-hidden="true" />Nieuwe aanvraag</Link>
        <a href={BUSINESS.phoneHref}><Phone aria-hidden="true" />{BUSINESS.phoneDisplay}</a>
      </nav>
      <small>{BUSINESS.addressLine1} · {BUSINESS.addressLine2}</small>
    </aside>
    <main className="dashboard-main" id="main">{children}</main>
  </div>;
}
