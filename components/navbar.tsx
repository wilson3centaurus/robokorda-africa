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
  if (!href.startsWith("#")) return href;
  return pathname === "/" ? href : `/${href}`;
}

export function Navbar() {
  const pathname = usePathname();
  const { itemCount, hydrated } = useCart();
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [scrolled, setScrolled] = useState(false);

  const items = useMemo(
    () => navItems.map((item) => ({ ...item, resolvedHref: resolveHref(pathname, item.href) })),
    [pathname],
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (pathname !== "/") return;
    const sections = items
      .filter((item) => item.sectionId)
      .map((item) => document.getElementById(item.sectionId!))
      .filter(Boolean) as HTMLElement[];
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { threshold: [0.2, 0.45, 0.65], rootMargin: "-18% 0px -55% 0px" },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [items, pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled || open || pathname !== "/"
          ? "border-b border-[rgba(0,102,255,0.18)] bg-[rgba(4,13,30,0.92)] shadow-[0_8px_32px_rgba(0,0,0,0.4)] frosted"
          : "border-b border-transparent bg-transparent",
      )}
    >
      {/* Top accent line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#0066ff] to-transparent opacity-60" />

      <div className="section-shell">
        <div
          className={cn(
            "flex items-center justify-between gap-4 transition-[height] duration-300",
            scrolled ? "h-16" : "h-[4.5rem]",
          )}
        >
          <Logo light prominent={false} className="shrink-0" />

          {/* Desktop nav */}
          <nav className="hidden items-center gap-0.5 lg:flex">
            {items.map((item) => {
              const isActive =
                (pathname === "/" && item.sectionId === activeSection) ||
                pathname === item.href;

              return (
                <Link
                  key={item.label}
                  href={item.resolvedHref}
                  className={cn(
                    "nav-link rounded-full px-3.5 py-2 text-[13px] font-semibold text-[#8db5d8] transition-colors hover:text-white",
                    isActive ? "nav-link-active text-white" : "",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2.5">
            {/* Cart */}
            <Link
              href="/cart"
              className="relative hidden h-10 w-10 items-center justify-center rounded-full border border-[rgba(0,102,255,0.3)] bg-[rgba(0,102,255,0.08)] text-[#7eb8ff] transition hover:bg-[rgba(0,102,255,0.16)] hover:border-[rgba(0,102,255,0.5)] sm:inline-flex"
              aria-label="View cart"
            >
              <ShoppingCart className="h-4.5 w-4.5" aria-hidden="true" />
              {hydrated && itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#0066ff] px-1 text-[10px] font-bold text-white shadow-[0_0_8px_rgba(0,102,255,0.5)]">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(0,102,255,0.3)] bg-[rgba(0,102,255,0.08)] text-[#7eb8ff] lg:hidden"
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
