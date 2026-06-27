"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingCart, X } from "lucide-react";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

type NavLeaf = { label: string; href: string; sectionId?: string; badge?: string };

type MobileMenuProps = {
  open: boolean;
  items: NavLeaf[];
  itemCount: number;
  onClose: () => void;
  pathname: string;
  activeSection: string;
  onSectionClick: (sectionId: string) => void;
};

function resolveHref(pathname: string, href: string) {
  return href.startsWith("#") ? (pathname === "/" ? href : `/${href}`) : href;
}

export function MobileMenu({ open, items, itemCount, onClose, pathname, activeSection, onSectionClick }: MobileMenuProps) {
  function isActive(item: NavLeaf) {
    if (pathname === "/" && item.sectionId) return item.sectionId === activeSection;
    return pathname === resolveHref(pathname, item.href);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="border-t border-[var(--surface-border)] bg-[var(--background)] frosted lg:hidden"
        >
          <div className="h-px w-full bg-gradient-to-r from-transparent via-[var(--electric)] to-transparent opacity-40" />

          <div className="section-shell pb-6 pt-4">
            {/* Header row */}
            <div className="mb-5 flex items-center justify-between">
              <Logo compact />
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--surface-border)] bg-[var(--surface-2)] text-[var(--text-secondary)] transition hover:border-[var(--electric)] hover:text-[var(--electric-bright)]"
                  aria-label="Close navigation menu"
                >
                  <X className="h-4.5 w-4.5" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Nav grid */}
            <div className="grid grid-cols-2 gap-2">
              {items.map((item) => {
                const active = isActive(item);
                const href   = resolveHref(pathname, item.href);
                return (
                  <Link
                    key={item.label}
                    href={href}
                    onClick={() => { if (item.sectionId) onSectionClick(item.sectionId); onClose(); }}
                    className={cn(
                      "flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-semibold transition",
                      active
                        ? "border-[var(--electric)] bg-[var(--electric-subtle)] text-[var(--electric-bright)]"
                        : "border-[var(--surface-border-subtle)] bg-[var(--surface-1)] text-[var(--text-secondary)] hover:border-[var(--surface-border)] hover:bg-[var(--surface-2)] hover:text-[var(--text-primary)]",
                      item.badge && !active && "border-[rgba(0,229,160,0.25)] text-[var(--neon)] hover:border-[rgba(0,229,160,0.5)]",
                    )}
                  >
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="shrink-0 rounded-full bg-[var(--neon)] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#0e0c2c]">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Cart link */}
            <Link
              href="/cart"
              onClick={onClose}
              className="mt-3 flex w-full items-center justify-between rounded-xl border border-[var(--surface-border-subtle)] bg-[var(--surface-1)] px-4 py-3 text-sm font-semibold text-[var(--text-secondary)] transition hover:border-[var(--surface-border)] hover:text-[var(--text-primary)]"
            >
              <span>Cart</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--electric-subtle)] px-3 py-1 text-[var(--electric-bright)]">
                <ShoppingCart className="h-3.5 w-3.5" aria-hidden="true" />
                {itemCount}
              </span>
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
