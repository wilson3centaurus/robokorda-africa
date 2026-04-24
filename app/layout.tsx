import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { CartProvider } from "@/providers/cart-provider";

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
  themeColor: "#020810",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <CartProvider>
          <a
            href="#content"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-[#0066ff] focus:px-4 focus:py-2 focus:text-white"
          >
            Skip to content
          </a>
          <div className="flex min-h-screen flex-col bg-[#020810] text-[#e8f4fd]">
            <Navbar />
            {/* pt matches navbar height — hero uses negative margin to cover it */}
            <main id="content" className="flex-1 pt-[4.625rem] lg:pt-[4.625rem]">
              {children}
            </main>
            <Footer />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
