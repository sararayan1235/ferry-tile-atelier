import { cookies } from "next/headers";

export type Language = "nl" | "en";
export const LANGUAGE_COOKIE = "sr-language";

/** Language chosen with the NL/EN toggle (mirrored into a cookie so server-rendered pages follow it). */
export async function requestLanguage(): Promise<Language> {
  return (await cookies()).get(LANGUAGE_COOKIE)?.value === "en" ? "en" : "nl";
}
