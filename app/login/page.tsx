import Image from "next/image";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/login-form";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { hasSupabaseConfig } from "@/lib/supabase/config";
import { safeNextPath } from "@/lib/redirects";

export const metadata = { title: "Inloggen" };
export const dynamic = "force-dynamic";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; error?: string }> }) {
  if (!hasSupabaseConfig()) redirect("/setup?next=/dashboard");
  const { data: { user } } = await (await createSupabaseServerClient()).auth.getUser();
  const params = await searchParams;
  const next = safeNextPath(params.next);
  if (user) redirect(next);
  const initialError = params.error ? "Inloggen is niet gelukt. Probeer het opnieuw. / Sign-in failed, please try again." : "";
  return (
    <main className="auth-page">
      <section className="auth-visual">
        <Image src="/assets/craft-detail.webp" alt="" fill priority sizes="55vw" />
        <blockquote>“Wij werken zoals een kleermaker: eerst meten, dan passen, dan pas afwerken.”</blockquote>
      </section>
      <section className="auth-panel">
        <LoginForm next={next} initialError={initialError} />
      </section>
    </main>
  );
}
