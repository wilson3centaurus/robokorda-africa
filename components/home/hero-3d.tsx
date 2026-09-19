"use client";

import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, MousePointer2, Smartphone } from "lucide-react";
import type { HeroStat } from "@/data/site";
import { useDeviceProfile } from "@/components/three/use-device-profile";
import { CountUp } from "@/components/count-up";

const HeroScene = dynamic(() => import("@/components/three/hero-scene"), {
  ssr: false,
});

type Hero3DProps = {
  badge?: string;
  title: string;
  titleAccent?: string;
  description: string;
  primaryAction: { href: string; label: string };
  secondaryAction: { href: string; label: string };
  videoUrl?: string;
  posterSrc?: string;
  stats?: HeroStat[];
};

export function Hero3D({
  badge,
  title,
  titleAccent,
  description,
  primaryAction,
  secondaryAction,
  videoUrl,
  posterSrc = "/images/about/about-preview.png",
  stats,
}: Hero3DProps) {
  const profile = useDeviceProfile();
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(true);

  const use3D = profile.tier !== "off" && !profile.reducedMotion;

  // Only render the canvas while the hero is anywhere near the viewport.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "200px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const hint = useMemo(
    () =>
      profile.touch
        ? { Icon: Smartphone, text: "Tilt your phone to look around" }
        : { Icon: MousePointer2, text: "Move your cursor to look around" },
    [profile.touch],
  );

  return (
    <section
      ref={sectionRef}
      id="home"
      className="section-anchor relative -mt-[4.625rem] flex min-h-[100svh] flex-col overflow-hidden bg-[#05050f]"
    >
      {/*
        Layer 1 — the 3D scene.
        On phones it is a stage across the top of the hero rather than a
        full-bleed backdrop: at 390px wide the robot and the headline compete
        for the same pixels, and the headline has to win. From `lg` up there is
        room for the copy on the left and the scene behind everything.
      */}
      <div
        className="absolute inset-x-0 top-0 h-[41svh] lg:bottom-0 lg:h-auto"
        aria-hidden="true"
      >
        {use3D ? (
          <HeroScene profile={profile} videoSrc={videoUrl} active={inView} />
        ) : (
          <HeroFallback videoUrl={videoUrl} posterSrc={posterSrc} still={profile.reducedMotion} />
        )}

        {/* Fade the stage into the copy area below it (phones only) */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(180deg,transparent,#05050f)] lg:hidden" />
      </div>

      {/* Layer 2 — readability scrims */}
      <div
        className="pointer-events-none absolute inset-0 hidden lg:block"
        style={{
          background:
            "linear-gradient(100deg, rgba(5,5,15,0.94) 0%, rgba(5,5,15,0.7) 40%, rgba(5,5,15,0.12) 70%), linear-gradient(180deg, rgba(5,5,15,0.9) 0%, rgba(5,5,15,0.25) 16%, transparent 34%, rgba(5,5,15,0.86) 100%)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[linear-gradient(180deg,rgba(5,5,15,0.85),transparent)] lg:hidden"
        aria-hidden="true"
      />

      {/* Layer 3 — content */}
      <div className="relative z-10 flex flex-1 flex-col justify-end pt-[37svh] lg:justify-center lg:pb-10 lg:pt-36">
        <div className="section-shell w-full">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-2xl"
          >
            {badge && (
              <div className="badge-pill mb-4 w-fit border-white/20 bg-white/10 text-white sm:mb-5">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#00e5a0]" />
                {badge}
              </div>
            )}

            <h1 className="text-[1.95rem] font-bold leading-[1.06] tracking-tight text-white sm:text-5xl lg:text-[4.4rem] lg:leading-[0.97]">
              {title}
              {titleAccent && (
                <>
                  {" "}
                  <span className="bg-[linear-gradient(100deg,#7472ee,#00e5a0)] bg-clip-text text-transparent">
                    {titleAccent}
                  </span>
                </>
              )}
            </h1>

            <p className="mt-3 max-w-xl text-[0.88rem] leading-6 text-white/70 sm:mt-5 sm:text-lg sm:leading-8">
              {description}
            </p>

            <div className="mt-5 flex flex-col gap-2.5 sm:mt-8 sm:flex-row sm:gap-4">
              <Link href={primaryAction.href} className="btn-primary">
                {primaryAction.label}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href={secondaryAction.href}
                className="btn-ghost !border-white/25 !bg-white/10 !text-white hover:!bg-white/20"
              >
                {secondaryAction.label}
              </Link>
            </div>

            {use3D && (
              <p className="mt-6 hidden items-center gap-2 text-xs text-white/45 sm:flex">
                <hint.Icon className="h-3.5 w-3.5" aria-hidden="true" />
                {hint.text}
              </p>
            )}
          </motion.div>
        </div>
      </div>

      {/* Layer 4 — stats rail */}
      {stats?.length ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.22 }}
          className="relative z-10 pb-6 pt-6 sm:pb-12 sm:pt-10"
        >
          <div className="section-shell">
            <div className="grid grid-cols-2 gap-2 sm:gap-4 xl:grid-cols-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="frosted rounded-xl border border-white/12 bg-white/[0.07] p-3 sm:p-5"
                >
                  <p className="text-lg font-bold text-white sm:text-3xl">
                    <CountUp value={stat.value} />
                  </p>
                  <p className="mt-0.5 text-[0.68rem] font-medium leading-tight text-white/60 sm:mt-1 sm:text-sm">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      ) : null}

      {/* Blend the always-dark hero into whatever the page theme is below it */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16 bg-[linear-gradient(180deg,transparent,var(--background))]"
        aria-hidden="true"
      />
    </section>
  );
}

/** Shown when WebGL is unavailable or the visitor asked for reduced motion. */
function HeroFallback({
  videoUrl,
  posterSrc,
  still,
}: {
  videoUrl?: string;
  posterSrc: string;
  still: boolean;
}) {
  return (
    <div className="absolute inset-0">
      {videoUrl && !still ? (
        <video
          src={videoUrl}
          poster={posterSrc}
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
      ) : (
        <Image
          src={posterSrc}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      )}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(116,114,238,1) 1px, transparent 1px), linear-gradient(90deg, rgba(116,114,238,1) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
    </div>
  );
}
