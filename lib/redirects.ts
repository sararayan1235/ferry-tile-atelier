/** Only allow same-site relative redirect targets ("/dashboard", "/#booking"), never "//evil.com". */
export function safeNextPath(requested: string | null | undefined, fallback = "/dashboard") {
  if (!requested || !requested.startsWith("/") || requested.startsWith("//") || requested.startsWith("/\\")) return fallback;
  return requested;
}
