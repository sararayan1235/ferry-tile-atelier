import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const requested = url.searchParams.get("next") || "/dashboard";
  const next = requested.startsWith("/") && !requested.startsWith("//") ? requested : "/dashboard";
  if (code) await (await createSupabaseServerClient()).auth.exchangeCodeForSession(code);
  return NextResponse.redirect(new URL(next, url.origin));
}
