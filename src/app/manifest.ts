import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Otograde — Hasarlı Araç Alım Satım",
    short_name: "Otograde",
    description:
      "Türkiye'nin hasarlı araç pazaryeri. Kazalı, pert, hasarlı araç alın veya satın.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#111111",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
