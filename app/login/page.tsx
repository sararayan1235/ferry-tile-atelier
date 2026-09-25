import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BrandMark } from "@/components/brand-mark";
import { LoginForm } from "@/components/login-form";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { hasSupabaseConfig } from "@/lib/supabase/config";

export const metadata = { title: "Inloggen" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  if (!hasSupabaseConfig()) redirect("/setup?next=/dashboard");
  const { data: { user } } = await (await createSupabaseServerClient()).auth.getUser();
  if (user) redirect("/dashboard");
  const requested = (await searchParams).next;
  const next = requested?.startsWith("/") && !requested.startsWith("//") ? requested : "/dashboard";
  return <main className="auth-page"><section className="auth-visual"><Image src="/assets/craft-detail.png" alt="Zorgvuldig tegelwerk" fill priority sizes="55vw" /><div><BrandMark /><blockquote>“Vakwerk met aandacht. Van eerste contact tot laatste tegel.”</blockquote></div></section><section className="auth-panel"><Link href="/" className="auth-back">← Terug naar de website</Link><LoginForm next={next} /><p className="auth-legal">Door in te loggen gaat u akkoord met de voorwaarden en privacyverklaring.</p></section></main>;
}
