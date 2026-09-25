import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";

export const metadata = { title: "Installatie" };

export default function SetupPage() {
  return <main className="setup-page"><BrandMark /><div className="setup-card"><p className="eyebrow">Eén laatste stap</p><h1>Database & accounts activeren.</h1><p>De website en dashboards zijn gebouwd. Voor live accounts zijn de Supabase-projectgegevens nodig. De secrets worden uitsluitend als Vercel Environment Variables opgeslagen.</p><ol><li>Maak een Supabase-project.</li><li>Voer <code>supabase/schema.sql</code> en daarna <code>supabase/events.sql</code> uit.</li><li>Zet de publicatievelden en site-URL in Vercel.</li><li>Maak een account aan en voer <code>supabase/promote-admin.sql</code> uit voor het beheeraccount.</li></ol><Link className="button button-primary" href="/">Terug naar de website</Link></div></main>;
}
