import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "S.R. Klus- en Onderhoudswerk",
    short_name: "S.R. Atelier",
    description: "Tegelwerk met vakwerk en aandacht.",
    start_url: "/",
    display: "standalone",
    background_color: "#090a0a",
    theme_color: "#090a0a",
    icons: [{ src: "/assets/hero-bathroom.jpg", sizes: "512x512", type: "image/jpeg" }],
  };
}
