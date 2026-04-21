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

export function MobileMenu({
  open,
  items,
  itemCount,
  onClose,
}: MobileMenuProps) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="border-t border-white/12 bg-brand-navy/96 frosted lg:hidden"
        >
          <div className="section-shell py-5">
            <div className="mb-5 flex items-center justify-between">
              <Logo compact light />
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/18 bg-white/10 text-white"
                aria-label="Close navigation menu"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {items.map((item) => (
                <Link
                  key={item.label}
                  href={item.resolvedHref}
                  onClick={onClose}
                  className="rounded-[22px] border border-white/12 bg-white/8 px-5 py-4 text-sm font-semibold text-white transition hover:bg-white/12"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/cart"
                onClick={onClose}
                className="inline-flex items-center justify-between rounded-[22px] border border-white/12 bg-white/8 px-5 py-4 text-sm font-semibold text-white transition hover:bg-white/12"
              >
                <span>Cart</span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1">
                  <ShoppingCart className="h-4 w-4" aria-hidden="true" />
                  {itemCount}
                </span>
              </Link>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

