import { redirect } from "next/navigation";
import { NewPasswordForm } from "@/components/new-password-form";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { hasSupabaseConfig } from "@/lib/supabase/config";

export const metadata = { title: "Nieuw wachtwoord" };
export const dynamic = "force-dynamic";

export default async function ResetPasswordPage() {
  if (!hasSupabaseConfig()) redirect("/setup");
  // The reset link lands on /auth/callback first, which signs the user in and sends them here.
  const { data: { user } } = await (await createSupabaseServerClient()).auth.getUser();
  if (!user) redirect("/login?error=1");
  return <main className="setup-page"><NewPasswordForm /></main>;
}
