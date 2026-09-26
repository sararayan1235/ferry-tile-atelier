import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "S.R. Klus- & onderhoudswerk · Fine Tile Atelier",
    short_name: "S.R. Atelier",
    description: "Tegelwerk, natuursteen en onderhoud in Zoetermeer.",
    start_url: "/",
    display: "standalone",
    background_color: "#f6f4ef",
    theme_color: "#f6f4ef",
    icons: [{ src: "/icon.png", sizes: "512x512", type: "image/png" }],
  };
}
