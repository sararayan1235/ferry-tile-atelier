import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { ScrollRevealObserver } from "@/components/ScrollRevealObserver";
import { LanguageToggle } from "@/components/client-controls";

export function PublicHeader() {
  return <header className="site-header">
    <div className="container header-inner">
      <Link href="/" aria-label="S.R. Klus- en Onderhoudswerk, home"><BrandMark /></Link>
      <nav className="desktop-nav" aria-label="Hoofdnavigatie">
        <Link href="/#diensten">Diensten</Link><Link href="/#proces">Werkwijze</Link><Link href="/#werk">Werk</Link><Link href="/#contact">Contact</Link>
      </nav>
      <div className="header-actions"><LanguageToggle /><Link className="button button-small" href="/login">Inloggen</Link></div>
    </div>
  </header>;
}

export function DashboardShell({ children, admin = false }: { children: React.ReactNode; admin?: boolean }) {
  return <div className="dashboard-frame">
    <aside className="dashboard-sidebar">
      <Link href="/"><BrandMark compact /></Link>
      <nav>
        <Link href="/dashboard">Mijn afspraken</Link>
        {admin && <Link href="/admin">Beheer</Link>}
        <Link href="/#booking">Nieuwe aanvraag</Link>
        <a href="tel:+31687153336">06 871 53 33</a>
      </nav>
      <small>Zoetermeer · Heel Nederland</small>
    </aside>
    <main className="dashboard-main">{children}</main>
    <ScrollRevealObserver />
  </div>;
}
