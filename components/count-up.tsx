"use client";

import { useEffect, useMemo, useRef, useState } from "react";

function parseStatValue(value: string) {
  const suffix = value.endsWith("+") ? "+" : "";
  const target = Number(value.replace(/[,+]/g, ""));
  return { suffix, target: Number.isFinite(target) ? target : 0 };
}

/**
 * Counts a stat up from zero the first time it scrolls into view.
 * Non-numeric values (e.g. "Coming soon") are rendered as-is.
 */
export function CountUp({ value }: { value: string }) {
  const elementRef = useRef<HTMLSpanElement>(null);
  const hasStartedRef = useRef(false);
  const animationRef = useRef<number | null>(null);
  const { suffix, target } = useMemo(() => parseStatValue(value), [value]);
  const [current, setCurrent] = useState(0);

  const numeric = /\d/.test(value);

  useEffect(() => {
    if (!numeric) return;
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
  }, [target, numeric]);

  if (!numeric) return <span>{value}</span>;

  return (
    <span ref={elementRef}>
      {current.toLocaleString()}
      {suffix}
    </span>
  );
}
