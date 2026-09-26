import type { Metadata, Viewport } from "next";
import { Archivo, Inter } from "next/font/google";
import { ScrollRevealObserver } from "@/components/ScrollRevealObserver";
import { publicSiteUrl } from "@/lib/supabase/config";
import "./globals.css";

const archivo = Archivo({ subsets: ["latin", "latin-ext"], axes: ["wdth"], variable: "--font-archivo", display: "swap" });
const inter = Inter({ subsets: ["latin", "latin-ext"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(publicSiteUrl()),
  title: { default: "S.R. Klus- & onderhoudswerk · Fine Tile Atelier", template: "%s · S.R. Fine Tile Atelier" },
  description: "Tegelwerk, natuursteen en onderhoud met de precisie van een kleermaker. Tegelatelier in Zoetermeer. Offerte aanvragen: 06 871 53 33.",
  openGraph: {
    title: "S.R. Klus- & onderhoudswerk · Fine Tile Atelier",
    description: "Vakwerk in steen. Tegelwerk, natuursteen en onderhoud in Zoetermeer en omgeving.",
    type: "website",
    locale: "nl_NL",
    images: [{ url: "/assets/hero-bathroom.jpg", width: 1200, height: 800 }],
  },
};

export const viewport: Viewport = {
  themeColor: "#f6f4ef",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="nl" className={`${archivo.variable} ${inter.variable}`} data-scroll-behavior="smooth">
      <body suppressHydrationWarning>
        {children}
        <ScrollRevealObserver />
      </body>
    </html>
  );
}
