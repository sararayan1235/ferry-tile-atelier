import { Analytics } from "@vercel/analytics/next";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="nl"><body>{children}<Analytics beforeSend={(event) => {
    const path = new URL(event.url, "https://local.invalid").pathname;
    return path.startsWith("/admin") || path.startsWith("/dashboard") ? null : event;
  }} /></body></html>;
}
