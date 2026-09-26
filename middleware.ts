import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { hasSupabaseConfig } from "@/lib/supabase/config";

// Kept as `middleware.ts` (edge runtime) on purpose: Next 16's `proxy.ts` always runs on the
// Node.js runtime, which the Cloudflare Workers adapter (@opennextjs/cloudflare) does not support yet.
export async function middleware(request: NextRequest) {
  if (!hasSupabaseConfig()) {
    return NextResponse.redirect(new URL(`/setup?next=${encodeURIComponent(request.nextUrl.pathname)}`, request.url));
  }

  let response = NextResponse.next({ request });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    },
  );
  const { data: { user } } = await supabase.auth.getUser();
  const isAdmin = request.nextUrl.pathname.startsWith("/admin");
  if (!user) {
    const login = new URL("/login", request.url);
    login.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(login);
  }
  if (isAdmin) {
    const { data: isAdminUser } = await supabase.rpc("is_admin");
    if (isAdminUser !== true) return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
