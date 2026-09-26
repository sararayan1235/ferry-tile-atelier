import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { safeNextPath } from "@/lib/redirects";

// Landing point for Google/Apple sign-in, email confirmation and password-reset links.
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = safeNextPath(url.searchParams.get("next"));
  const failed = new URL(`/login?error=1&next=${encodeURIComponent(next)}`, url.origin);

  if (url.searchParams.get("error") || !code) return NextResponse.redirect(failed);
  const { error } = await (await createSupabaseServerClient()).auth.exchangeCodeForSession(code);
  if (error) return NextResponse.redirect(failed);
  return NextResponse.redirect(new URL(next, url.origin));
}
