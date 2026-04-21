"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Menu, ShoppingCart } from "lucide-react";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/logo";
import { MobileMenu } from "@/components/mobile-menu";
import { navItems } from "@/data/site";
import { useCart } from "@/providers/cart-provider";
import { cn } from "@/lib/utils";

function resolveHref(pathname: string, href: string) {
  if (!href.startsWith("#")) {
    return href;
  }

  return pathname === "/" ? href : `/${href}`;
}

export function Navbar() {
  const pathname = usePathname();
  const { itemCount, hydrated } = useCart();
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [scrolled, setScrolled] = useState(false);

  const items = useMemo(
    () =>
      navItems.map((item) => ({
        ...item,
        resolvedHref: resolveHref(pathname, item.href),
      })),
    [pathname],
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (pathname !== "/") {
      return;
    }

    const sections = items
      .filter((item) => item.sectionId)
      .map((item) => document.getElementById(item.sectionId!))
      .filter(Boolean) as HTMLElement[];

    if (!sections.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0];

        if (visibleEntry) {
          setActiveSection(visibleEntry.target.id);
        }
      },
      {
        threshold: [0.2, 0.45, 0.65],
        rootMargin: "-18% 0px -55% 0px",
      },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [items, pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-300",
        scrolled || open || pathname !== "/"
          ? "border-white/12 bg-brand-navy/86 shadow-[0_18px_38px_rgba(6,16,30,0.24)] frosted"
          : "border-transparent bg-transparent",
      )}
    >
      <div className="section-shell">
        <div
          className={cn(
            "flex items-center justify-between gap-6 transition-[height,padding] duration-300",
            scrolled ? "h-18" : "h-20",
          )}
        >
          <Logo light prominent={false} className="shrink-0" />
          <nav className="hidden items-center gap-1 text-white lg:flex">
            {items.map((item) => {
              const isActive =
                (pathname === "/" && item.sectionId === activeSection) ||
                pathname === item.href;

              return (
                <Link
                  key={item.label}
                  href={item.resolvedHref}
                  className={cn(
                    "nav-link rounded-full px-3 py-2 text-[13px] font-semibold !text-white transition hover:!text-white",
                    isActive ? "nav-link-active !text-white" : "",
                  )}
                  style={{ color: "#ffffff" }}
                >
                  <span style={{ color: "#ffffff" }}>{item.label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/cart"
              className="relative hidden h-11 w-11 items-center justify-center rounded-full border border-white/18 bg-white/10 text-white transition hover:bg-white/14 sm:inline-flex"
              aria-label="View cart"
            >
              <ShoppingCart className="h-5 w-5 text-white" aria-hidden="true" />
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-blue px-1 text-[11px] font-semibold text-white">
                {hydrated ? itemCount : 0}
              </span>
            </Link>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/18 bg-white/10 text-white lg:hidden"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
      <MobileMenu
        open={open}
        items={items}
        itemCount={hydrated ? itemCount : 0}
        onClose={() => setOpen(false)}
      />
    </header>
  );
}
