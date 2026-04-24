"use client";

import { useEffect, useState } from "react";
import { Check, ShoppingCart, Star } from "lucide-react";
import type { Product } from "@/data/site";
import { motion } from "framer-motion";
import { PlaceholderMedia } from "@/components/placeholder-media";
import { useCart } from "@/providers/cart-provider";
import { formatCurrency } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const timeout = window.setTimeout(() => setAdded(false), 1600);
    return () => window.clearTimeout(timeout);
  }, [added]);

  return (
    <div className="flex h-full flex-col gap-5 rounded-2xl border border-[rgba(0,102,255,0.18)] bg-[rgba(7,20,40,0.8)] p-5 transition-colors hover:border-[rgba(0,102,255,0.3)]">
      <PlaceholderMedia
        mode="product"
        label={`${product.name} Product Placeholder`}
        seed={product.seed}
        imageUrl={product.imageSrc}
      />
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#0066ff]">
            {product.category}
          </p>
          {product.badge && (
            <span className="rounded-full border border-[rgba(0,229,160,0.3)] bg-[rgba(0,229,160,0.08)] px-3 py-1 text-[10px] font-bold text-[#00e5a0]">
              {product.badge}
            </span>
          )}
        </div>
        <h3 className="text-lg font-bold text-white">{product.name}</h3>
        <p className="text-sm leading-6 text-[#4d7499]">{product.shortDescription}</p>
        <div className="flex flex-wrap gap-1.5">
          {product.features.map((feature) => (
            <span
              key={feature}
              className="rounded-full border border-[rgba(0,102,255,0.2)] bg-[rgba(0,102,255,0.06)] px-2.5 py-1 text-[10px] font-medium text-[#7eb8ff]"
            >
              {feature}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-auto space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-0.5 text-amber-400">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={`${product.id}-star-${index}`}
                  className="h-3.5 w-3.5"
                  fill={index < Math.round(product.rating) ? "currentColor" : "none"}
                />
              ))}
              <span className="ml-2 text-xs text-[#4d7499]">
                {product.rating.toFixed(1)} ({product.reviews})
              </span>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <span className="text-2xl font-bold text-white">
                {formatCurrency(product.price)}
              </span>
              {product.compareAt && (
                <span className="text-sm text-[#2a4d80] line-through">
                  {formatCurrency(product.compareAt)}
                </span>
              )}
            </div>
          </div>
        </div>
        <motion.button
          type="button"
          whileTap={{ scale: 0.98 }}
          animate={added ? { scale: [1, 1.03, 1] } : undefined}
          onClick={() => { addItem(product, 1); setAdded(true); }}
          className={
            added
              ? "inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[rgba(0,229,160,0.4)] bg-[rgba(0,229,160,0.08)] px-5 py-3 text-sm font-semibold text-[#00e5a0] transition"
              : "inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0066ff] px-5 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(0,102,255,0.35)] transition hover:bg-[#0052cc]"
          }
        >
          {added ? (
            <>
              <Check className="h-4 w-4" aria-hidden="true" />
              Added to cart
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4" aria-hidden="true" />
              Add to Cart
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
}
