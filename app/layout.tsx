import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { CartProvider } from "@/providers/cart-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { getSiteSettings } from "@/lib/settings";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://robokorda.africa"),
  title: {
    default: "Robokorda Africa | Robotics, Coding and STEAM Education",
    template: "%s | Robokorda Africa",
  },
  description:
    "Robokorda Africa equips learners, schools, and families with structured robotics, coding, app development, and STEAM pathways that turn digital users into confident digital creators.",
  keywords: [
    "Robokorda Africa", "robotics education", "coding for schools",
    "STEAM learning", "app development for children", "South Africa robotics", "Zimbabwe coding classes",
  ],
  openGraph: {
    title: "Robokorda Africa",
    description: "Premium robotics, coding, and STEAM learning for schools, parents, and education partners across Africa.",
    siteName: "Robokorda Africa",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Robokorda Africa",
    description: "Premium robotics, coding, and STEAM learning for schools, parents, and education partners across Africa.",
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
    <html lang="en" className={inter.variable} suppressHydrationWarning>
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
