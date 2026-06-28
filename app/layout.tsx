import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { CartProvider } from "@/providers/cart-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { getSiteSettings } from "@/lib/settings";
import { DEFAULT_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  manifest: "/manifest.webmanifest",
  applicationName: SITE_NAME,
  title: {
    default: "Robokorda Africa | Robotics, Coding and STEAM Education",
    template: "%s | Robokorda Africa",
  },
  description: DEFAULT_DESCRIPTION,
  keywords: [
    "Robokorda Africa", "robotics education", "coding for schools",
    "STEAM learning", "app development for children", "South Africa robotics", "Zimbabwe coding classes",
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
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
  openGraph: {
    title: "Robokorda Africa | Robotics, Coding and STEAM Education",
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
    images: [{ url: "/brand/logo.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Robokorda Africa | Robotics, Coding and STEAM Education",
    description: DEFAULT_DESCRIPTION,
    images: ["/brand/logo.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icons/favicon-48x48.png", type: "image/png", sizes: "48x48" },
      { url: "/icons/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/icons/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: ["/favicon.ico"],
    apple: [{ url: "/apple-icon.png", type: "image/png", sizes: "512x512" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0e0c2c",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const settings = await getSiteSettings();
  const logoUrl = settings.logo_url || "/brand/logo.png";
  const logoUrlDark = settings.logo_url_dark || "";

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <CartProvider>
            <a
              href="#content"
              className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full bg-[var(--electric)] focus:px-4 focus:py-2 text-white"
            >
              Skip to content
            </a>
            <div className="flex min-h-screen flex-col bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
              <Navbar logoUrl={logoUrl} logoUrlDark={logoUrlDark} />
              {/* pt matches navbar height — hero uses negative margin to cover it */}
              <main id="content" className="flex-1 pt-[4.625rem] lg:pt-[4.625rem]">
                {children}
              </main>
              <Footer />
            </div>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
