"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import type { GalleryItem } from "@/data/site";
import { cn } from "@/lib/utils";

const AUTOPLAY_MS = 4200;
/** Slides further than this from the centre are unmounted, not just hidden. */
const VISIBLE_RANGE = 2;

type Showcase3DProps = {
  items: GalleryItem[];
  className?: string;
};

/**
 * A 3D coverflow carousel.
 *
 * Replaces the old fade slideshow, whose one-dot-per-photo indicator row
 * overflowed its corner and sat on top of the caption once the gallery grew
 * past a handful of images. Progress is now a single rail plus a counter, so it
 * reads the same with 3 photos or 30.
 */
export function Showcase3D({ items, className }: Showcase3DProps) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [dragX, setDragX] = useState(0);
  // Mirrored into state because the render path needs it (transitions are off
  // mid-drag so the slides track the finger), and refs cannot be read there.
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const count = items.length;

  const go = useCallback(
    (delta: number) => setCurrent((c) => (c + delta + count) % count),
    [count],
  );

  useEffect(() => {
    if (paused || count <= 1) return;
    const timer = setInterval(() => go(1), AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [go, paused, count]);

  // Signed distance from the active slide, wrapped so the carousel loops both ways.
  const offsetOf = useCallback(
    (index: number) => {
      const raw = index - current;
      const half = count / 2;
      if (raw > half) return raw - count;
      if (raw < -half) return raw + count;
      return raw;
    },
    [current, count],
  );

  // ── Drag / swipe ──
  const onPointerDown = (e: React.PointerEvent) => {
    dragStart.current = e.clientX;
    setDragging(true);
    setPaused(true);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (dragStart.current === null) return;
    setDragX(e.clientX - dragStart.current);
  };

  const endDrag = useCallback(() => {
    if (dragStart.current === null) return;
    const width = containerRef.current?.clientWidth ?? 320;
    const threshold = Math.min(70, width * 0.18);
    if (dragX > threshold) go(-1);
    else if (dragX < -threshold) go(1);
    dragStart.current = null;
    setDragging(false);
    setDragX(0);
    setPaused(false);
  }, [dragX, go]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
    if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
  };

  const active = items[current];
  const progress = useMemo(() => ((current + 1) / count) * 100, [current, count]);

  if (!count) return null;

  return (
    <div className={cn("relative h-full w-full select-none", className)}>
      {/* Stage */}
      <div
        ref={containerRef}
        role="region"
        aria-roledescription="carousel"
        aria-label="Robokorda Africa in action"
        tabIndex={0}
        className="relative h-full w-full cursor-grab overflow-hidden rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-[var(--electric-bright)] active:cursor-grabbing"
        style={{ perspective: "1200px", perspectiveOrigin: "50% 45%", touchAction: "pan-y" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={endDrag}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onKeyDown={onKeyDown}
      >
        {items.map((item, i) => {
          const offset = offsetOf(i);
          if (Math.abs(offset) > VISIBLE_RANGE) return null;

          // Drag nudges the whole stack by a fraction of a slot for direct feedback.
          const nudge = dragX / 260;
          const slot = offset + nudge;
          const distance = Math.abs(slot);

          const transform = [
            `translateX(${slot * 46}%)`,
            `translateZ(${-distance * 190}px)`,
            `rotateY(${slot * -32}deg)`,
            `scale(${1 - distance * 0.06})`,
          ].join(" ");

          return (
            <div
              key={item.seed ?? `${item.title}-${i}`}
              className="absolute inset-0 origin-center"
              aria-hidden={offset !== 0}
              style={{
                transform,
                transformStyle: "preserve-3d",
                opacity: distance > 1.75 ? 0 : 1 - distance * 0.22,
                zIndex: 100 - Math.round(distance * 10),
                transition: dragging
                  ? "none"
                  : "transform 620ms cubic-bezier(0.22,1,0.36,1), opacity 620ms ease",
                pointerEvents: offset === 0 ? "auto" : "none",
              }}
            >
              <div className="relative h-full w-full overflow-hidden rounded-2xl border border-white/10 shadow-[0_30px_80px_rgba(2,2,14,0.65)]">
                <Image
                  src={item.imageSrc}
                  alt={item.title}
                  fill
                  priority={i === 0}
                  draggable={false}
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 45vw"
                />
                {/* Side slides get dimmed so the centre one reads as "in focus". */}
                <div
                  className="absolute inset-0 bg-[#05050f] transition-opacity duration-500"
                  style={{ opacity: Math.min(distance * 0.34, 0.66) }}
                />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(3,3,14,0.85)_100%)]" />
              </div>
            </div>
          );
        })}

        {/* Reflection glow under the stack */}
        <div
          className="pointer-events-none absolute inset-x-6 bottom-0 h-16 rounded-full bg-[var(--electric)] opacity-25 blur-2xl"
          aria-hidden="true"
        />
      </div>

      {/* ── Caption ── */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[200] px-4 pb-4 sm:px-5 sm:pb-5">
        <p className="text-sm font-semibold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
          {active.title}
        </p>
        {active.subtitle && (
          <p className="mt-0.5 line-clamp-1 text-xs text-white/70">{active.subtitle}</p>
        )}

        {/* Progress rail — replaces the old one-dot-per-slide row */}
        <div className="mt-3 flex items-center gap-3">
          <div className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,#7472ee,#00e5a0)] transition-[width] duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="font-mono text-[10px] tabular-nums text-white/70">
            {String(current + 1).padStart(2, "0")}/{String(count).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* ── Controls ── */}
      {count > 1 && (
        <div className="absolute inset-x-0 top-1/2 z-[200] flex -translate-y-1/2 items-center justify-between px-2 sm:px-3">
          <ControlButton label="Previous slide" onClick={() => go(-1)}>
            <ChevronLeft className="h-5 w-5" />
          </ControlButton>
          <ControlButton label="Next slide" onClick={() => go(1)}>
            <ChevronRight className="h-5 w-5" />
          </ControlButton>
        </div>
      )}

      {count > 1 && (
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-label={paused ? "Resume slideshow" : "Pause slideshow"}
          className="absolute right-3 top-3 z-[200] flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/45 text-white backdrop-blur-sm transition hover:bg-black/70"
          style={{ minHeight: "unset", minWidth: "unset" }}
        >
          {paused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
        </button>
      )}
    </div>
  );
}

function ControlButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/45 text-white backdrop-blur-sm transition hover:bg-black/70 active:scale-95"
      style={{ minHeight: "unset", minWidth: "unset" }}
    >
      {children}
    </button>
  );
}
