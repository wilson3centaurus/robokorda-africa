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
    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasStartedRef.current) {
          return;
        }

        hasStartedRef.current = true;
        const start = performance.now();
        const duration = 1400;

        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);

          setCurrent(Math.round(target * eased));

          if (progress < 1) {
            animationRef.current = window.requestAnimationFrame(tick);
          }
        };

        animationRef.current = window.requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (animationRef.current) {
        window.cancelAnimationFrame(animationRef.current);
      }
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
  minHeightClassName = "min-h-[92vh]",
  children,
}: HeroBannerProps) {
  const whiteActions = actionTone === "white";
  const whiteActionStyle = whiteActions
    ? { background: "#ffffff", borderColor: "#ffffff", color: "#0b4f9f" }
    : undefined;

  return (
    <section
      id={id}
      className={`section-anchor relative -mt-20 overflow-hidden bg-[linear-gradient(180deg,#0b2340,#0d63c9)] lg:-mt-24 ${minHeightClassName}`}
    >
      <PlaceholderMedia
        mode="wide"
        label={mediaLabel}
        seed={mediaSeed}
        videoUrl={mediaVideoUrl}
        className="absolute inset-0 h-full w-full rounded-none border-0"
      />
      {!mediaVideoUrl || showMediaOverlay ? <div className="hero-overlay absolute inset-0" /> : null}
      <div className="relative z-10 flex min-h-[inherit] items-start">
        <div className="section-shell w-full pb-20 pt-28 sm:pb-24 sm:pt-32 lg:pt-30">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="max-w-3xl text-white"
            >
              {badge ? <div className="badge-pill">{badge}</div> : null}
              <h1 className="mt-6 text-balance text-5xl font-semibold leading-[0.96] sm:text-6xl lg:text-[5.2rem]">
                {title}
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-white/82 sm:text-lg">
                {description}
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  href={primaryAction.href}
                  className={cn(
                    "btn-primary",
                    whiteActions
                      ? "!border-white !text-brand-blue-strong ![background:#ffffff] hover:![background:#f3f7fc]"
                      : "",
                  )}
                  style={whiteActionStyle}
                >
                  {primaryAction.label}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  href={secondaryAction.href}
                  className={cn(
                    "btn-ghost",
                    whiteActions
                      ? "!border-white !text-brand-blue-strong ![background:#ffffff] hover:![background:#f3f7fc]"
                      : "",
                  )}
                  style={whiteActionStyle}
                >
                  {secondaryAction.label}
                </Link>
              </div>
            </motion.div>
            {children ? <div className="lg:justify-self-end">{children}</div> : null}
          </div>
          {stats?.length ? (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.12 }}
              className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4"
            >
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-[26px] border border-white/14 bg-white/10 p-5 text-white frosted"
                >
                  <p className="text-3xl font-semibold">
                    <CountUpStatValue value={stat.value} />
                  </p>
                  <p className="mt-2 text-sm font-medium text-white/74">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
