"use client";

import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { useCart } from "@/providers/cart-provider";
import { cn, formatCurrency } from "@/lib/utils";

type CartSummaryProps = {
  className?: string;
  compact?: boolean;
};

export function CartSummary({ className, compact = false }: CartSummaryProps) {
  const { itemCount, subtotal } = useCart();
  const delivery = itemCount > 0 ? 25 : 0;
  const total = subtotal + delivery;

  return (
    <div className={cn("rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-1)] p-6 space-y-6", className)}>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--electric)]">
          Cart Summary
        </p>
        <h3 className="mt-2 text-xl font-bold text-[var(--text-primary)]">
          {itemCount} item{itemCount === 1 ? "" : "s"} selected
        </h3>
      </div>
      <div className="space-y-3 text-sm text-[var(--text-secondary)]">
        <div className="flex items-center justify-between">
          <span>Subtotal</span>
          <span className="font-semibold text-[var(--text-primary)]">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Estimated delivery</span>
          <span className="font-semibold text-[var(--text-primary)]">{formatCurrency(delivery)}</span>
        </div>
        <div className="flex items-center justify-between border-t border-[var(--surface-border-subtle)] pt-3 text-base">
          <span className="font-bold text-[var(--text-primary)]">Estimated total</span>
          <span className="font-bold text-[var(--text-primary)]">{formatCurrency(total)}</span>
        </div>
      </div>
      <div className="rounded-xl border border-[var(--surface-border-subtle)] bg-[var(--electric-subtle)] p-4 text-xs leading-6 text-[var(--text-secondary)]">
        Robokorda Africa supports school, parent, and partner orders. Delivery is estimated here and can be refined later for bulk or pickup requests.
      </div>
      {!compact && (
        <div className="space-y-3">
          <Link
            href="/checkout"
            className="btn-primary inline-flex w-full items-center justify-center gap-2"
          >
            Proceed to checkout
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            href="/shop"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--surface-border)] px-5 py-3 text-sm font-semibold text-[var(--electric-bright)] transition hover:border-[var(--electric)] hover:text-[var(--text-primary)]"
          >
            <ShoppingBag className="h-4 w-4" aria-hidden="true" />
            Continue shopping
          </Link>
        </div>
      )}
    </div>
  );
}
