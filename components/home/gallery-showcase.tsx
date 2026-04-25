"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { GalleryItem } from "@/data/site";

export function GalleryShowcase({ items }: { items: GalleryItem[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

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
      {/* Clean masonry photo grid — no text on cards, captions only in lightbox */}
      <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        {items.map((item, index) => (
          <button
            key={item.title}
            type="button"
            onClick={() => setActiveIndex(index)}
            className="group relative block w-full cursor-zoom-in"
            aria-label={`View photo: ${item.title}`}
          >
            <div className="relative overflow-hidden rounded-[18px]">
              <Image
                src={item.imageSrc}
                alt={item.title}
                width={800}
                height={item.size === "wide" ? 450 : item.size === "tall" ? 1000 : 800}
                unoptimized
                className="w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-brand-ink/0 transition-colors duration-300 group-hover:bg-brand-ink/32" />
              <span className="absolute inset-x-0 bottom-0 translate-y-1 p-4 text-left text-sm font-semibold text-white drop-shadow-lg opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                {item.title}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Fullscreen lightbox — dark, centered, caption only */}
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
              {/* Close */}
              <button
                type="button"
                onClick={() => setActiveIndex(null)}
                className="absolute -top-11 right-0 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/70 transition hover:bg-white/20 hover:text-white"
                aria-label="Close lightbox"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>

              {/* Image */}
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

              {/* Brief caption below */}
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

              {/* Desktop prev/next arrows */}
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

              {/* Mobile prev/next + counter */}
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
