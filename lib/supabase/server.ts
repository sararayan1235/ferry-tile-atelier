import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // Server Components cannot write cookies; middleware refreshes sessions.
          }
        },
      },
    },
  );
}

export async function requireUser() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  return { supabase, user };
}

export async function requireAdmin() {
  const { supabase, user } = await requireUser();
  if (!user) return { supabase, user: null, profile: null, isAdmin: false };
  // public.is_admin() checks the admin_users allowlist in the database; profiles.role is display-only.
  const { data: isAdmin } = await supabase.rpc("is_admin");
  return { supabase, user, isAdmin: isAdmin === true };
}
