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
    <div className={cn("rounded-2xl border border-[rgba(0,102,255,0.2)] bg-[rgba(7,20,40,0.8)] p-6 space-y-6", className)}>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#0066ff]">
          Cart Summary
        </p>
        <h3 className="mt-2 text-xl font-bold text-white">
          {itemCount} item{itemCount === 1 ? "" : "s"} selected
        </h3>
      </div>
      <div className="space-y-3 text-sm text-[#4d7499]">
        <div className="flex items-center justify-between">
          <span>Subtotal</span>
          <span className="font-semibold text-white">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Estimated delivery</span>
          <span className="font-semibold text-white">{formatCurrency(delivery)}</span>
        </div>
        <div className="flex items-center justify-between border-t border-[rgba(0,102,255,0.15)] pt-3 text-base">
          <span className="font-bold text-white">Estimated total</span>
          <span className="font-bold text-white">{formatCurrency(total)}</span>
        </div>
      </div>
      <div className="rounded-xl border border-[rgba(0,102,255,0.12)] bg-[rgba(0,102,255,0.04)] p-4 text-xs leading-6 text-[#4d7499]">
        Robokorda Africa supports school, parent, and partner orders. Delivery is estimated here and can be refined later for bulk or pickup requests.
      </div>
      {!compact && (
        <div className="space-y-3">
          <Link
            href="/checkout"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0066ff] px-5 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(0,102,255,0.35)] transition hover:bg-[#0052cc]"
          >
            Proceed to checkout
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            href="/shop"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[rgba(0,102,255,0.25)] px-5 py-3 text-sm font-semibold text-[#7eb8ff] transition hover:border-[rgba(0,102,255,0.5)] hover:text-white"
          >
            <ShoppingBag className="h-4 w-4" aria-hidden="true" />
            Continue shopping
          </Link>
        </div>
      )}
    </div>
  );
}
