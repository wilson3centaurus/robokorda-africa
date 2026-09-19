"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

type TiltCardProps = {
  children: React.ReactNode;
  className?: string;
  /** Maximum rotation in degrees on each axis. */
  max?: number;
  /** Lift towards the viewer, in px, while hovered. */
  lift?: number;
  glare?: boolean;
};

/**
 * Pointer-reactive 3D tilt with a moving specular glare.
 *
 * Pure CSS transforms — no WebGL context, so it is safe to use on dozens of
 * cards at once. Touch devices get no tilt at all (there is no hover state to
 * enter or leave, and a tilt stuck mid-animation looks broken), and
 * `prefers-reduced-motion` is honoured through the CSS in globals.css.
 */
export function TiltCard({
  children,
  className,
  max = 8,
  lift = 14,
  glare = true,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    setStyle({
      transform: `perspective(900px) rotateX(${(0.5 - py) * max * 2}deg) rotateY(${(px - 0.5) * max * 2}deg) translateZ(${lift}px)`,
      transition: "transform 80ms linear",
    });
    setGlarePos({ x: px * 100, y: py * 100, opacity: 0.16 });
  };

  const handleLeave = () => {
    setStyle({
      transform: "perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0px)",
      transition: "transform 420ms cubic-bezier(0.22,1,0.36,1)",
    });
    setGlarePos((g) => ({ ...g, opacity: 0 }));
  };

  return (
    <div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className={cn("tilt-card relative h-full", className)}
      style={{ ...style, transformStyle: "preserve-3d" }}
    >
      {children}
      {glare && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300"
          style={{
            opacity: glarePos.opacity,
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.9), transparent 55%)`,
            mixBlendMode: "soft-light",
          }}
        />
      )}
    </div>
  );
}
