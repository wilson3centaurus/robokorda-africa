"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { GalleryCard } from "@/components/gallery-card";
import type { GalleryItem } from "@/data/site";

/**
 * GalleryGrid — grid of clickable photo cards + dark lightbox.
 * Used on RIRC, Prime Book, and any other page that needs a gallery section.
 * The homepage uses GalleryShowcase (masonry layout) instead.
 */

const INITIAL_LIMIT = 12;

export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  const visible = showAll ? items : items.slice(0, INITIAL_LIMIT);
  const hasMore = items.length > INITIAL_LIMIT;

  useEffect(() => {
    if (activeIndex === null) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = original; };
  }, [activeIndex]);

  useEffect(() => {
    if (activeIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveIndex(null);
      if (e.key === "ArrowRight") setActiveIndex(i => ((i ?? 0) + 1) % items.length);
      if (e.key === "ArrowLeft") setActiveIndex(i => ((i ?? 0) - 1 + items.length) % items.length);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [activeIndex, items.length]);

  function step(direction: number) {
    setActiveIndex(i => ((i ?? 0) + direction + items.length) % items.length);
  }

  return (
    <>
      <div className="mt-8 columns-2 md:columns-3 xl:columns-4 gap-4 space-y-4">
        {visible.map((item, index) => (
          <div
            key={item.title + index}
            className="break-inside-avoid mb-4"
          >
            <GalleryCard item={item} onClick={() => setActiveIndex(index)} />
          </div>
        ))}
      </div>

      {/* Show More / Show Less */}
      {hasMore && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setShowAll((s) => !s)}
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--surface-border)] bg-[var(--electric-subtle)] px-6 py-3 text-sm font-semibold text-[var(--electric-bright)] transition hover:border-[var(--electric)] hover:bg-[var(--surface-border)]"
          >
            {showAll ? "Show Less" : `Show More (${items.length - INITIAL_LIMIT} more)`}
          </button>
        </div>
      )}

      <AnimatePresence>
        {activeIndex !== null && (
          <motion.div
            className="fixed inset-0 z-[90] flex items-center justify-center bg-black/93 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveIndex(null)}
          >
            <motion.div
              className="relative w-full max-w-4xl"
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setActiveIndex(null)}
                className="absolute -top-11 right-0 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/70 transition hover:bg-white/20 hover:text-white"
                aria-label="Close lightbox"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>

              <div className="overflow-hidden rounded-2xl shadow-2xl">
                <Image
                  src={items[activeIndex].imageSrc}
                  alt={items[activeIndex].title}
                  width={1400}
                  height={900}
                  unoptimized
                  className="w-full object-contain"
                  style={{ maxHeight: "78vh", background: "#0b1c2e" }}
                />
              </div>

              <div className="mt-3 text-center">
                {items[activeIndex].subtitle ? (
                  <p className="text-sm text-white/55">
                    <span className="font-semibold text-white/80">{items[activeIndex].title}</span>
                    {" — "}
                    {items[activeIndex].subtitle}
                  </p>
                ) : (
                  <p className="text-sm font-semibold text-white/80">{items[activeIndex].title}</p>
                )}
              </div>

              <button
                type="button"
                onClick={() => step(-1)}
                className="absolute left-0 top-1/2 -translate-x-14 -translate-y-1/2 hidden h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/22 sm:flex"
                aria-label="Previous photo"
              >
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                className="absolute right-0 top-1/2 translate-x-14 -translate-y-1/2 hidden h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/22 sm:flex"
                aria-label="Next photo"
              >
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>

              <div className="mt-4 flex items-center justify-center gap-4 sm:hidden">
                <button
                  type="button"
                  onClick={() => step(-1)}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/22"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                <span className="text-sm text-white/40">{activeIndex + 1} / {items.length}</span>
                <button
                  type="button"
                  onClick={() => step(1)}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/22"
                  aria-label="Next photo"
                >
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
