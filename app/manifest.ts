import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Robokorda Africa",
    short_name: "Robokorda Africa",
    description:
      "Premium robotics, coding, AI, and STEAM education for schools, families, and partners across Africa.",
    start_url: "/",
    display: "standalone",
    background_color: "#0e0c2c",
    theme_color: "#0e0c2c",
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
