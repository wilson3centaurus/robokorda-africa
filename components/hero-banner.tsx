"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { HeroStat } from "@/data/site";
import { PlaceholderMedia } from "@/components/placeholder-media";
import { cn } from "@/lib/utils";

type HeroBannerProps = {
  id?: string;
  badge?: string;
  title: string;
  description: string;
  primaryAction: { href: string; label: string };
  secondaryAction: { href: string; label: string };
  mediaLabel: string;
  mediaSeed: string;
  mediaVideoUrl?: string;
  showMediaOverlay?: boolean;
  actionTone?: "default" | "white";
  stats?: HeroStat[];
  minHeightClassName?: string;
  children?: React.ReactNode;
};

function parseStatValue(value: string) {
  const suffix = value.endsWith("+") ? "+" : "";
  const target = Number(value.replace(/[,+]/g, ""));
  return { suffix, target };
}

function CountUpStatValue({ value }: { value: string }) {
  const elementRef = useRef<HTMLSpanElement>(null);
  const hasStartedRef = useRef(false);
  const animationRef = useRef<number | null>(null);
  const { suffix, target } = useMemo(() => parseStatValue(value), [value]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasStartedRef.current) return;
        hasStartedRef.current = true;
        const start = performance.now();
        const duration = 1600;

        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCurrent(Math.round(target * eased));
          if (progress < 1) animationRef.current = window.requestAnimationFrame(tick);
        };

        animationRef.current = window.requestAnimationFrame(tick);
      },
      { threshold: 0.3 },
    );

    observer.observe(element);
    return () => {
      observer.disconnect();
      if (animationRef.current) window.cancelAnimationFrame(animationRef.current);
    };
  }, [target]);

  return (
    <span ref={elementRef}>
      {current.toLocaleString()}
      {suffix}
    </span>
  );
}

export function HeroBanner({
  id,
  badge,
  title,
  description,
  primaryAction,
  secondaryAction,
  mediaLabel,
  mediaSeed,
  mediaVideoUrl,
  showMediaOverlay = false,
  actionTone = "default",
  stats,
  minHeightClassName = "min-h-[100svh]",
  children,
}: HeroBannerProps) {
  const whiteActions = actionTone === "white";

  return (
    <section
      id={id}
      className={cn(
        "section-anchor relative -mt-20 overflow-hidden lg:-mt-24",
        "bg-[#020810]",
        minHeightClassName,
      )}
    >
      {/* Full-bleed background — no aspect-ratio constraint */}
      <PlaceholderMedia
        mode="wide"
        label={mediaLabel}
        seed={mediaSeed}
        videoUrl={mediaVideoUrl}
        fill
        className="absolute inset-0 h-full w-full"
      />

      {/* Overlay */}
      {(!mediaVideoUrl || showMediaOverlay) && (
        <div className="hero-overlay absolute inset-0" />
      )}
      {mediaVideoUrl && (
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(2,8,16,0.65)] via-transparent to-[rgba(2,8,16,0.85)]" />
      )}

      {/* Circuit grid decoration */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(0,102,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,102,255,1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex min-h-[inherit] items-center">
        <div className="section-shell w-full pb-20 pt-28 sm:pb-24 sm:pt-36 lg:pt-40">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">

            {/* Left — headline */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-white"
            >
              {badge && (
                <div className="badge-pill mb-5 w-fit">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#00e5a0]" />
                  {badge}
                </div>
              )}

              <h1 className="text-[2.2rem] font-bold leading-[1.08] tracking-tight text-balance sm:text-5xl lg:text-[4.8rem] lg:leading-[0.95]">
                {title}
              </h1>

              <p className="mt-5 max-w-xl text-[0.95rem] leading-7 text-[rgba(200,225,255,0.78)] sm:text-lg sm:leading-8">
                {description}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
                <Link
                  href={primaryAction.href}
                  className={cn(
                    "btn-primary",
                    whiteActions
                      ? "!border-white !bg-white !text-[#0052cc] hover:!bg-[#e8f0fd]"
                      : "",
                  )}
                >
                  {primaryAction.label}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  href={secondaryAction.href}
                  className={cn(
                    "btn-ghost",
                    whiteActions
                      ? "!border-white/60 !bg-white/10 !text-white hover:!bg-white/18"
                      : "",
                  )}
                >
                  {secondaryAction.label}
                </Link>
              </div>
            </motion.div>

            {/* Right — optional card slot */}
            {children && (
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                className="lg:justify-self-end"
              >
                {children}
              </motion.div>
            )}
          </div>

          {/* Stats row */}
          {stats?.length ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.22 }}
              className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4"
            >
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-[rgba(0,102,255,0.25)] bg-[rgba(4,13,30,0.65)] p-4 frosted sm:p-5"
                >
                  <p className="text-2xl font-bold text-white sm:text-3xl">
                    <CountUpStatValue value={stat.value} />
                  </p>
                  <p className="mt-1.5 text-xs font-medium text-[#4d7499] sm:text-sm">
                    {stat.label}
                  </p>
                </div>
              ))}
            </motion.div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
