import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    host: "https://robokorda-africa.com",
    sitemap: "https://robokorda-africa.com/sitemap.xml",
  };
}
