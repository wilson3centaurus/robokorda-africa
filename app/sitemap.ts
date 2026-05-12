import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://robokorda-africa.com",
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://robokorda-africa.com/shop",
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: "https://robokorda-africa.com/short-courses",
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: "https://robokorda-africa.com/rirc",
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://robokorda-africa.com/prime-book",
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: "https://robokorda-africa.com/cart",
      changeFrequency: "daily",
      priority: 0.5,
    },
    {
      url: "https://robokorda-africa.com/checkout",
      changeFrequency: "daily",
      priority: 0.5,
    },
  ];
}
