import type { Metadata, Viewport } from "next";
import { SiteAnalytics } from "@/components/analytics";
import "./globals.css";
import "./stone.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://ferry-tile-atelier.vercel.app"),
  title: { default: "S.R. Klus- en Onderhoudswerk", template: "%s · S.R. Tile Atelier" },
  description: "Premium mobile tile repairs, installation and finishing in Zoetermeer and across the Netherlands.",
  openGraph: {
    title: "S.R. Klus- en Onderhoudswerk",
    description: "Vakwerk met aandacht. Op locatie in heel Nederland.",
    type: "website",
    locale: "nl_NL",
    images: [{ url: "/assets/hero-bathroom.jpg", width: 1200, height: 800 }],
  },
};

export const viewport: Viewport = {
  themeColor: "#f3f0e9",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="nl" data-scroll-behavior="smooth">
      <body suppressHydrationWarning>{children}<SiteAnalytics /></body>
    </html>
  );
}
