import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://robokorda.africa",
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://robokorda.africa/shop",
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: "https://robokorda.africa/cart",
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: "https://robokorda.africa/checkout",
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];
}
