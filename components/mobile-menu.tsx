"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingCart, X } from "lucide-react";
import type { NavItem } from "@/data/site";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";

type MobileMenuProps = {
  open: boolean;
  items: Array<NavItem & { resolvedHref: string }>;
  itemCount: number;
  onClose: () => void;
};

export function MobileMenu({ open, items, itemCount, onClose }: MobileMenuProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="border-t border-[var(--surface-border)] bg-[var(--background)] frosted lg:hidden"
        >
          {/* Top accent */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-[var(--electric)] to-transparent opacity-40" />

          <div className="section-shell py-5">
            <div className="mb-5 flex items-center justify-between">
              <Logo compact light />
              <div className="flex items-center gap-3">
                <ThemeToggle />
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--surface-border)] bg-[var(--surface-2)] text-[var(--text-secondary)] hover:border-[var(--electric)] hover:text-[var(--electric-bright)] transition"
                  aria-label="Close navigation menu"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              {items.map((item) => (
                <Link
                  key={item.label}
                  href={item.resolvedHref}
                  onClick={onClose}
                  className="rounded-xl border border-[var(--surface-border-subtle)] bg-[var(--surface-1)] px-5 py-3.5 text-sm font-semibold text-[var(--text-secondary)] transition hover:border-[var(--surface-border)] hover:bg-[var(--surface-2)] hover:text-[var(--text-primary)]"
                >
                  {item.label}
                </Link>
              ))}

              <Link
                href="/cart"
                onClick={onClose}
                className="inline-flex items-center justify-between rounded-xl border border-[var(--surface-border-subtle)] bg-[var(--surface-1)] px-5 py-3.5 text-sm font-semibold text-[var(--text-secondary)] transition hover:border-[var(--surface-border)] hover:text-[var(--text-primary)]"
              >
                <span>Cart</span>
                <span className="inline-flex items-center gap-2 rounded-full bg-[var(--electric-subtle)] px-3 py-1 text-[var(--electric-bright)]">
                  <ShoppingCart className="h-3.5 w-3.5" aria-hidden="true" />
                  {itemCount}
                </span>
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
