import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: "https://robokorda-africa.com",
      changeFrequency: "weekly",
      priority: 1,
      lastModified,
    },
    {
      url: "https://robokorda-africa.com/shop",
      changeFrequency: "weekly",
      priority: 0.9,
      lastModified,
    },
    {
      url: "https://robokorda-africa.com/short-courses",
      changeFrequency: "weekly",
      priority: 0.9,
      lastModified,
    },
    {
      url: "https://robokorda-africa.com/rirc",
      changeFrequency: "monthly",
      priority: 0.8,
      lastModified,
    },
    {
      url: "https://robokorda-africa.com/prime-book",
      changeFrequency: "monthly",
      priority: 0.7,
      lastModified,
    },
  ];
}
