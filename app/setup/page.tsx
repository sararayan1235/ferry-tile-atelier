import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";

export const metadata = { title: "Installatie" };

export default function SetupPage() {
  return <main className="setup-page"><BrandMark /><div className="setup-card"><p className="eyebrow">Eén laatste stap</p><h1>Database & accounts activeren.</h1><p>De website, het klantportaal en het beheer zijn gebouwd. Voor live accounts moet de Supabase-database gekoppeld worden.</p><ol><li>Maak een gratis Supabase-project.</li><li>Voer <code>supabase/setup.sql</code> uit in de SQL Editor.</li><li>Zet de Supabase-sleutels in <code>.env.local</code> (lokaal) en als Cloudflare-secrets (live).</li><li>Maak een account aan en voer <code>supabase/promote-admin.sql</code> uit met uw e-mailadres.</li></ol><p>Volledige stappen: <code>DEPLOY.md</code>.</p><Link className="button button-primary" href="/">Terug naar de website</Link></div></main>;
}
