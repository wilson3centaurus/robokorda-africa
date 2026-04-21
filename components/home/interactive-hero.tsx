"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Play } from "lucide-react";
import { cn } from "@/lib/utils";

type HeroSlide = {
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  secondaryLabel: string;
  secondaryHref: string;
  mediaType: "video" | "image";
  src: string;
  poster?: string;
};

const heroSlides: HeroSlide[] = [
  {
    eyebrow: "Premium robotics and coding education",
    title: "Making Robotics and Coding Fun",
    description:
      "",
    ctaLabel: "Explore our courses",
    ctaHref: "/#courses",
    secondaryLabel: "Contact us",
    secondaryHref: "/#contact",
    mediaType: "video",
    src: "/media/hero.mp4",
    poster: "/images/hero/learning-environment.svg",
  },
  {
    eyebrow: "School-ready programme delivery",
    title: "Flexible learning models designed to fit curriculum, extra-curricular, and weekend formats.",
    description:
      "Our delivery structure is built for adoption, continuity, and measurable learner growth across different school and family schedules.",
    ctaLabel: "View delivery options",
    ctaHref: "/#courses",
    secondaryLabel: "Why choose us",
    secondaryHref: "/#why-us",
    mediaType: "image",
    src: "/images/hero/school-delivery.svg",
  },
  {
    eyebrow: "Confident, creative, practical learning",
    title: "Creating an environment where young learners can think, build, test, and present with confidence.",
    description:
      "Robokorda Africa combines technical foundations, guided experimentation, and strong soft-skill development in one coherent learning journey.",
    ctaLabel: "See the gallery",
    ctaHref: "/#gallery",
    secondaryLabel: "About Robokorda",
    secondaryHref: "/#about",
    mediaType: "image",
    src: "/images/about/about-studio.svg",
  },
];

export function InteractiveHero() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActive((current) => (current + 1) % heroSlides.length);
    }, 7600);

    return () => window.clearInterval(interval);
  }, []);

  const slide = heroSlides[active];

  function step(direction: number) {
    setActive((current) => (current + direction + heroSlides.length) % heroSlides.length);
  }

  return (
    <section
      id="home"
      className="section-anchor relative -mt-20 min-h-[100svh] overflow-hidden lg:-mt-24"
    >
      <div className="absolute inset-0">
        {heroSlides.map((item, index) => {
          const isActive = index === active;

          return (
            <div
              key={`${item.mediaType}-${item.src}`}
              className={cn(
                "absolute inset-0 transition-opacity duration-700 ease-out",
                isActive ? "opacity-100" : "pointer-events-none opacity-0",
              )}
            >
              {item.mediaType === "video" ? (
                <video
                  className="h-full w-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  poster={item.poster}
                >
                  <source src={item.src} type="video/mp4" />
                </video>
              ) : (
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  priority={index === 0}
                  unoptimized={item.src.endsWith(".svg")}
                  sizes="100vw"
                  className="object-cover"
                />
              )}
            </div>
          );
        })}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(12,33,58,0.82)_0%,rgba(12,33,58,0.58)_45%,rgba(12,33,58,0.64)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,24,42,0.46)_0%,rgba(8,24,42,0.18)_24%,rgba(8,24,42,0.42)_100%)]" />
      </div>

      <div className="relative z-10 flex min-h-[100svh] items-center">
        <div className="section-shell w-full pb-16 pt-32 lg:pt-36">
          <div className="mx-auto max-w-5xl text-center text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-white/72 sm:text-sm">
              {slide.eyebrow}
            </p>
            <h1 className="mx-auto mt-6 max-w-5xl text-balance text-[2.4rem] font-semibold leading-[1] sm:text-[3.8rem] lg:text-[5.5rem]">
              {slide.title}
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-white/78 sm:text-lg">
              {slide.description}
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href={slide.ctaHref}
                className="rounded-full bg-white px-8 py-4 text-sm font-semibold uppercase tracking-[0.28em] text-[#173860] shadow-[0_20px_40px_rgba(8,24,42,0.18)] transition hover:bg-brand-cloud"
                style={{ color: "#173860" }}
              >
                <span style={{ color: "#173860" }}>{slide.ctaLabel}</span>
              </Link>
              <Link
                href={slide.secondaryHref}
                className="inline-flex items-center gap-3 rounded-full border border-white/28 bg-white/10 px-8 py-4 text-sm font-semibold uppercase tracking-[0.28em] text-white transition hover:bg-white/16"
              >
                <Play className="h-4 w-4" aria-hidden="true" />
                {slide.secondaryLabel}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => step(-1)}
        className="absolute left-3 top-1/2 z-20 hidden h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-white/28 bg-white/10 text-white transition hover:bg-white/18 lg:inline-flex"
        aria-label="Previous hero slide"
      >
        <ArrowLeft className="h-5 w-5" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={() => step(1)}
        className="absolute right-3 top-1/2 z-20 hidden h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-white/28 bg-white/10 text-white transition hover:bg-white/18 lg:inline-flex"
        aria-label="Next hero slide"
      >
        <ArrowRight className="h-5 w-5" aria-hidden="true" />
      </button>
    </section>
  );
}
