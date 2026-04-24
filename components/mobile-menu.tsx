"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingCart, X } from "lucide-react";
import type { NavItem } from "@/data/site";
import { Logo } from "@/components/logo";

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
          className="border-t border-[rgba(0,102,255,0.18)] bg-[rgba(4,13,30,0.98)] frosted lg:hidden"
        >
          {/* Top accent */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-[#0066ff] to-transparent opacity-40" />

          <div className="section-shell py-5">
            <div className="mb-5 flex items-center justify-between">
              <Logo compact light />
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(0,102,255,0.3)] bg-[rgba(0,102,255,0.08)] text-[#7eb8ff]"
                aria-label="Close navigation menu"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="flex flex-col gap-1.5">
              {items.map((item) => (
                <Link
                  key={item.label}
                  href={item.resolvedHref}
                  onClick={onClose}
                  className="rounded-xl border border-[rgba(0,102,255,0.14)] bg-[rgba(0,102,255,0.06)] px-5 py-3.5 text-sm font-semibold text-[#8db5d8] transition hover:border-[rgba(0,102,255,0.3)] hover:bg-[rgba(0,102,255,0.12)] hover:text-white"
                >
                  {item.label}
                </Link>
              ))}

              <Link
                href="/cart"
                onClick={onClose}
                className="inline-flex items-center justify-between rounded-xl border border-[rgba(0,102,255,0.14)] bg-[rgba(0,102,255,0.06)] px-5 py-3.5 text-sm font-semibold text-[#8db5d8] transition hover:border-[rgba(0,102,255,0.3)] hover:text-white"
              >
                <span>Cart</span>
                <span className="inline-flex items-center gap-2 rounded-full bg-[rgba(0,102,255,0.15)] px-3 py-1 text-[#7eb8ff]">
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
