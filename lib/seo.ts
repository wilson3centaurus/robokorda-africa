import type { Metadata } from "next";

export const SITE_NAME = "Robokorda Africa";
export const SITE_URL = "https://robokorda-africa.com";
export const DEFAULT_OG_IMAGE = "/brand/logo.png";
export const DEFAULT_DESCRIPTION =
  "Robokorda Africa helps schools, families, and partners deliver premium robotics, coding, AI, and STEAM education across Africa.";

const DEFAULT_KEYWORDS = [
  "Robokorda Africa",
  "robotics education Africa",
  "coding classes for kids",
  "STEAM education",
  "school robotics programmes",
  "AI training Africa",
  "Zimbabwe robotics",
  "South Africa coding programmes",
];

type SeoOptions = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  image?: string;
  type?: "website" | "article";
  noIndex?: boolean;
};

export function absoluteUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function buildMetadata({
  title,
  description,
  path,
  keywords,
  image = DEFAULT_OG_IMAGE,
  type = "website",
  noIndex = false,
}: SeoOptions): Metadata {
  const fullTitle = title === SITE_NAME ? SITE_NAME : `${title} | ${SITE_NAME}`;
  const imageUrl = absoluteUrl(image);

  return {
    title,
    description,
    keywords: [...DEFAULT_KEYWORDS, ...(keywords ?? [])],
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: absoluteUrl(path),
      siteName: SITE_NAME,
      type,
      images: [{ url: imageUrl }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [imageUrl],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          googleBot: {
            index: false,
            follow: false,
            noimageindex: true,
          },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
  };
}
