"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, ShoppingCart } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Logo } from "@/components/logo";
import { MobileMenu } from "@/components/mobile-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { useCart } from "@/providers/cart-provider";
import { cn } from "@/lib/utils";

// ─── Nav type definitions ──────────────────────────────────────────────────────
type NavLeaf = { label: string; href: string; sectionId?: string; badge?: string; description?: string };
type NavGroup = { label: string; children: NavLeaf[] };
type NavEntry = NavLeaf | NavGroup;

function isGroup(e: NavEntry): e is NavGroup { return "children" in e; }
function resolveHref(pathname: string, href: string) {
  return href.startsWith("#") ? (pathname === "/" ? href : `/${href}`) : href;
}

// ─── Desktop nav (grouped, concise) ───────────────────────────────────────────
const NAV: NavEntry[] = [
  { label: "Home",       href: "#home",    sectionId: "home" },
  { label: "About",     href: "#about",   sectionId: "about" },
  {
    label: "Courses",
    children: [
      { label: "Our Courses",    href: "#courses",       sectionId: "courses",  description: "Robotics, coding & STEAM programmes" },
      { label: "Short Courses",  href: "/short-courses",                        description: "Certified upskilling — physical, online or hybrid" },
    ],
  },
  { label: "RIRC",       href: "/rirc",       badge: "2026 Open" },
  { label: "Prime Book", href: "/prime-book" },
  { label: "Shop",       href: "/shop" },
  { label: "Contact",   href: "#contact",  sectionId: "contact" },
];

// ─── Mobile nav (flat, all sections) ──────────────────────────────────────────
export const MOBILE_NAV: NavLeaf[] = [
  { label: "Home",          href: "#home",         sectionId: "home" },
  { label: "About Us",      href: "#about",        sectionId: "about" },
  { label: "Our Courses",   href: "#courses",      sectionId: "courses" },
  { label: "Short Courses", href: "/short-courses" },
  { label: "Skills",        href: "#skills",       sectionId: "skills" },
  { label: "Why Us",        href: "#why-us",       sectionId: "why-us" },
  { label: "Partners",      href: "#partners",     sectionId: "partners" },
  { label: "Gallery",       href: "#gallery",      sectionId: "gallery" },
  { label: "RIRC",          href: "/rirc",         badge: "2026 Open" },
  { label: "Prime Book",    href: "/prime-book" },
  { label: "Shop",          href: "/shop" },
  { label: "Contact",       href: "#contact",      sectionId: "contact" },
];

// ─── All section IDs tracked for the IntersectionObserver ─────────────────────
const SECTION_IDS = MOBILE_NAV.filter(i => i.sectionId).map(i => i.sectionId!);

type NavbarProps = { logoUrl?: string; logoUrlDark?: string };

export function Navbar({ logoUrl = "/brand/logo.png", logoUrlDark }: NavbarProps) {
  const pathname      = usePathname();
  const { itemCount, hydrated } = useCart();
  const { resolvedTheme } = useTheme();
  const [open, setOpen]                 = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState("home");
  const [scrolled, setScrolled]         = useState(false);
  const [mounted, setMounted]           = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  const activeLogo = (resolvedTheme === "light" && logoUrlDark) ? logoUrlDark : logoUrl;

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Active section tracking via IntersectionObserver
  useEffect(() => {
    if (pathname !== "/") return;
    const sections = SECTION_IDS
      .map(id => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];
    if (!sections.length) return;

    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) visible.add(e.target.id);
          else visible.delete(e.target.id);
        });
        const topmost = SECTION_IDS.find(id => visible.has(id));
        if (topmost) setActiveSection(topmost);
      },
      { threshold: 0.15, rootMargin: "-64px 0px -35% 0px" },
    );
    sections.forEach(s => observer.observe(s));
    return () => observer.disconnect();
  }, [pathname]);

  const isLightMode        = mounted && resolvedTheme === "light";
  const navIsTransparent   = !scrolled && !open && pathname === "/";
  const logoLight          = mounted && !scrolled && !open && pathname === "/" && resolvedTheme === "dark";

  function isLeafActive(item: NavLeaf) {
    if (pathname === "/" && item.sectionId) return item.sectionId === activeSection;
    return pathname === resolveHref(pathname, item.href);
  }

  function isGroupActive(group: NavGroup) {
    return group.children.some(isLeafActive);
  }

  // Text color class for a standard nav item (not badge items)
  const regularTextCls = navIsTransparent && !isLightMode
    ? "text-white/80 hover:text-white"
    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]";

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        navIsTransparent && !isLightMode
          ? "border-b border-transparent bg-transparent"
          : "border-b border-[var(--surface-border)] bg-[var(--background)]/90 shadow-[0_8px_32px_rgba(8,7,30,0.12)] frosted",
      )}
    >
      {/* Top accent line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[var(--electric)] to-transparent opacity-50" />

      <div className="section-shell">
        <div className={cn(
          "flex items-center justify-between gap-4 transition-[height] duration-300",
          scrolled ? "h-[3.75rem]" : "h-[4.5rem]",
        )}>

          <Logo light={logoLight} prominent={false} src={activeLogo} className="shrink-0" />

          {/* ── Desktop nav ── */}
          <nav ref={dropdownRef} className="hidden items-center gap-0.5 lg:flex" aria-label="Main navigation">
            {NAV.map(entry => {
              if (isGroup(entry)) {
                const isOpen  = openDropdown === entry.label;
                const active  = isGroupActive(entry);
                return (
                  <div key={entry.label} className="relative">
                    <button
                      type="button"
                      onClick={() => setOpenDropdown(isOpen ? null : entry.label)}
                      aria-expanded={isOpen}
                      className={cn(
                        "nav-link flex items-center gap-1 rounded-full px-3.5 py-2 text-[13px] font-semibold transition-colors",
                        regularTextCls,
                        active && "nav-link-active !text-[var(--electric-bright)] bg-[var(--electric-subtle)]",
                      )}
                    >
                      {entry.label}
                      <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-200", isOpen && "rotate-180")} />
                    </button>

                    {isOpen && (
                      <div className="absolute left-0 top-[calc(100%+6px)] z-50 min-w-[240px] rounded-2xl border border-[var(--surface-border)] bg-[var(--background)]/95 p-1.5 shadow-[0_16px_40px_rgba(8,7,30,0.22)] frosted">
                        {entry.children.map(child => {
                          const href    = resolveHref(pathname, child.href);
                          const cActive = isLeafActive(child);
                          return (
                            <Link
                              key={child.label}
                              href={href}
                              onClick={() => { setOpenDropdown(null); if (child.sectionId) setActiveSection(child.sectionId); }}
                              className={cn(
                                "flex flex-col rounded-xl px-4 py-3 transition-colors",
                                cActive
                                  ? "bg-[var(--electric-subtle)] text-[var(--electric-bright)]"
                                  : "text-[var(--text-secondary)] hover:bg-[var(--surface-2)] hover:text-[var(--text-primary)]",
                              )}
                            >
                              <span className="text-sm font-semibold">{child.label}</span>
                              {child.description && (
                                <span className="mt-0.5 text-xs leading-5 text-[var(--text-muted)]">{child.description}</span>
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              // Leaf item
              const href   = resolveHref(pathname, entry.href);
              const active = isLeafActive(entry);
              return (
                <Link
                  key={entry.label}
                  href={href}
                  onClick={() => { if (entry.sectionId) setActiveSection(entry.sectionId); }}
                  className={cn(
                    "nav-link relative flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-semibold transition-colors",
                    entry.badge
                      ? "text-[var(--neon)] hover:text-[var(--neon)]"
                      : regularTextCls,
                    !entry.badge && active && "nav-link-active !text-[var(--electric-bright)] bg-[var(--electric-subtle)]",
                    entry.badge && active && "bg-[var(--neon-subtle)]",
                  )}
                >
                  {entry.label}
                  {entry.badge && (
                    <span className="rounded-full bg-[var(--neon)] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#0e0c2c]">
                      {entry.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* ── Actions ── */}
          <div className="flex items-center gap-2">
            <Link
              href="/cart"
              className="relative hidden h-9 w-9 items-center justify-center rounded-full border border-[var(--surface-border)] bg-[var(--surface-2)] text-[var(--text-secondary)] transition hover:border-[var(--electric)] hover:text-[var(--electric-bright)] sm:inline-flex"
              aria-label="View cart"
            >
              <ShoppingCart className="h-4 w-4" aria-hidden="true" />
              {hydrated && itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--electric)] px-1 text-[9px] font-bold text-white shadow-[0_0_8px_var(--electric-glow)]">
                  {itemCount}
                </span>
              )}
            </Link>

            <div className="hidden lg:block">
              <ThemeToggle />
            </div>

            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--surface-border)] bg-[var(--surface-2)] text-[var(--text-secondary)] transition hover:border-[var(--electric)] hover:text-[var(--electric-bright)] lg:hidden"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <MobileMenu
        open={open}
        items={MOBILE_NAV}
        itemCount={hydrated ? itemCount : 0}
        onClose={() => setOpen(false)}
        pathname={pathname}
        activeSection={activeSection}
        onSectionClick={setActiveSection}
      />
    </header>
  );
}
