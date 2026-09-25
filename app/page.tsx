import { PublicHome } from "@/components/public-home";
import { hasSupabaseConfig } from "@/lib/supabase/config";

export default function Home() {
  return <PublicHome accountsEnabled={hasSupabaseConfig()} />;
}
