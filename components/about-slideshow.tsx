"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { GalleryItem } from "@/data/site";

export function AboutSlideshow({ items }: { items: GalleryItem[] }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(
    () => setCurrent((c) => (c + 1) % items.length),
    [items.length],
  );
  const prev = useCallback(
    () => setCurrent((c) => (c - 1 + items.length) % items.length),
    [items.length],
  );

  useEffect(() => {
    if (paused || items.length <= 1) return;
    const t = setInterval(next, 4000);
    return () => clearInterval(t);
  }, [next, paused, items.length]);

  if (!items.length) return null;

  return (
    <div
      className="relative h-full w-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides */}
      {items.map((item, i) => (
        <div
          key={item.seed}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <Image
            src={item.imageSrc}
            alt={item.title}
            fill
            priority={i === 0}
            className="object-cover object-center"
            sizes="(max-width: 1024px) 100vw, 45vw"
          />
        </div>
      ))}

      {/* Bottom gradient + caption */}
      <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/60 via-black/20 to-transparent px-5 pb-4 pt-16">
        <p className="text-sm font-semibold text-white drop-shadow">{items[current].title}</p>
        {items[current].subtitle && (
          <p className="mt-0.5 line-clamp-1 text-xs text-white/70">{items[current].subtitle}</p>
        )}
      </div>

      {/* Prev / Next arrows */}
      {items.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 z-20 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/60"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 z-20 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/60"
            aria-label="Next slide"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </>
      )}

      {/* Dot indicators */}
      {items.length > 1 && (
        <div className="absolute bottom-3 right-5 z-20 flex items-center gap-1.5">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current ? "w-5 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/40"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
