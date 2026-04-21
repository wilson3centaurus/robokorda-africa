"use client";

import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import type { ValueCard } from "@/data/site";
import { cn } from "@/lib/utils";

type SupportCard = {
  title: string;
  subtitle: string;
  imageSrc: string;
};

type ShowcaseScene = {
  eyebrow: string;
  imageSrc: string;
  imageAlt: string;
  statistic: string;
  statisticLabel: string;
  narrative: string;
  caption: string;
  tags: string[];
  bullets: string[];
  supportCards: SupportCard[];
};

const showcaseScenes: ShowcaseScene[] = [
  {
    eyebrow: "Cross-curricular immersion",
    imageSrc: "/images/hero/learning-environment.svg",
    imageAlt: "Learners exploring robotics and coding foundations",
    statistic: "STEAM x Code",
    statisticLabel: "Connected classroom learning",
    narrative:
      "Robokorda lessons connect coding, science, engineering, design, and mathematics so learners can understand how ideas become working systems.",
    caption:
      "The programme turns digital curiosity into guided experimentation, problem-solving, and confident making.",
    tags: ["Coding logic", "Creative design", "Engineering thinking"],
    bullets: [
      "Build lessons around real tasks instead of disconnected theory.",
      "Help learners see how maths, design, and technology work together.",
      "Create visible progress through guided experimentation and reflection.",
    ],
    supportCards: [
      {
        title: "Scratch foundations",
        subtitle: "First coding wins with visual logic.",
        imageSrc: "/images/courses/scratch.svg",
      },
      {
        title: "Electronics circuits",
        subtitle: "Hands-on systems thinking and control.",
        imageSrc: "/images/courses/electronics-circuits.svg",
      },
    ],
  },
  {
    eyebrow: "Structured weekly rhythm",
    imageSrc: "/images/hero/school-delivery.svg",
    imageAlt: "Structured weekly robotics and coding delivery",
    statistic: "45 min",
    statisticLabel: "Guided class rhythm",
    narrative:
      "The weekly delivery model keeps learning steady, school-friendly, and easier to coordinate for both educators and families.",
    caption:
      "Clear routines, manageable sessions, and practical build moments make the programme easier to sustain over time.",
    tags: ["Weekly flow", "School-ready", "Visible progression"],
    bullets: [
      "Keep sessions focused enough for regular school timetables.",
      "Maintain continuity through guided teaching and repeatable class structure.",
      "Show learner growth through practical milestones and project outcomes.",
    ],
    supportCards: [
      {
        title: "Code Lab",
        subtitle: "From block logic to richer problem-solving.",
        imageSrc: "/images/courses/code-lab.svg",
      },
      {
        title: "App development",
        subtitle: "Interactive projects that deepen digital creation.",
        imageSrc: "/images/courses/app-development.svg",
      },
    ],
  },
  {
    eyebrow: "Future-ready pathways",
    imageSrc: "/images/about/about-studio.svg",
    imageAlt: "Future-facing robotics and coding learning pathway",
    statistic: "Project-first",
    statisticLabel: "Practical future readiness",
    narrative:
      "Learners move beyond basic digital use into robotics, AI, design, and problem-solving pathways that support longer-term technology confidence.",
    caption:
      "The result is a clearer bridge from guided foundations into advanced exploration, teamwork, and applied creativity.",
    tags: ["AI awareness", "Maker mindset", "Career relevance"],
    bullets: [
      "Use practical projects to make advanced technology feel approachable.",
      "Grow learner confidence around robotics, AI, and future digital tools.",
      "Support stronger presentation, teamwork, and creative problem-solving habits.",
    ],
    supportCards: [
      {
        title: "Artificial intelligence",
        subtitle: "Prompt literacy, data thinking, and ethics.",
        imageSrc: "/images/courses/artificial-intelligence.svg",
      },
      {
        title: "Mechanical design",
        subtitle: "Design-led making with real-world build thinking.",
        imageSrc: "/images/courses/mechanical-design.svg",
      },
    ],
  },
];

type InteractiveIntroShowcaseProps = {
  highlights: ValueCard[];
};

export function InteractiveIntroShowcase({
  highlights,
}: InteractiveIntroShowcaseProps) {
  const itemCount = Math.min(highlights.length, showcaseScenes.length);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (itemCount === 0) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % itemCount);
    }, 6200);

    return () => window.clearInterval(interval);
  }, [itemCount]);

  if (itemCount === 0) {
    return null;
  }

  const interactiveHighlights = highlights.slice(0, itemCount);
  const safeIndex = activeIndex % itemCount;

  return (
    <section className="relative z-20 mt-6 pb-16 sm:mt-8 lg:mt-10 lg:pb-20">
      <div className="section-shell">
        <div className="surface-shadow relative mx-auto max-w-[72rem] overflow-hidden rounded-[30px] border border-white/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(238,244,251,0.96))]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(15,97,196,0.16),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(15,97,196,0.12),transparent_30%)]" />
          <div className="absolute right-[-4rem] top-[-5rem] h-48 w-48 rounded-full bg-brand-blue/12 blur-3xl" />
          <div className="absolute bottom-[-3rem] left-[-2rem] h-40 w-40 rounded-full bg-[#92d7ff]/24 blur-3xl" />

          <div className="relative z-10 grid gap-5 p-4 sm:p-5 md:grid-cols-[1.08fr_0.92fr] md:items-start lg:gap-6 lg:p-6">
            <div className="flex min-w-0 flex-col">
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-brand-line bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-brand-blue">
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                  Intro Summary
                </div>
                <h2 className="mt-4 text-balance text-3xl font-semibold leading-tight text-brand-ink sm:text-[2.75rem] lg:text-[3.35rem]">
                  A practical path from digital use to digital creation.
                </h2>
                <p className="mt-4 text-base leading-8 text-brand-muted sm:text-lg">
                  Instead of a flat transition below the hero, this section now
                  previews how Robokorda learners start, build, and grow through a
                  more guided, visual experience.
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/#courses" className="btn-primary">
                  Explore courses
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link href="/#contact" className="btn-secondary bg-white/85">
                  Speak with us
                </Link>
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                <div className="rounded-[22px] border border-white/70 bg-white/72 p-3.5 backdrop-blur-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-blue">
                    Focused modes
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-brand-ink">03</p>
                </div>
                <div className="rounded-[22px] border border-white/70 bg-white/72 p-3.5 backdrop-blur-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-blue">
                    Weekly rhythm
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-brand-ink">45 min</p>
                </div>
                <div className="rounded-[22px] border border-white/70 bg-white/72 p-3.5 backdrop-blur-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-blue">
                    Course paths
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-brand-ink">06</p>
                </div>
              </div>
            </div>

            <div className="min-w-0 md:pt-2">
              <div className="space-y-3" role="tablist" aria-label="Programme preview">
                {interactiveHighlights.map((highlight, index) => {
                  const Icon = highlight.icon;
                  const isActive = index === safeIndex;

                  return (
                    <button
                      key={highlight.title}
                      id={`intro-tab-${index}`}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      tabIndex={isActive ? 0 : -1}
                      onClick={() => setActiveIndex(index)}
                      onMouseEnter={() => setActiveIndex(index)}
                      className={cn(
                        "w-full rounded-[24px] border p-4 text-left transition duration-200",
                        isActive
                          ? "border-brand-blue bg-white shadow-[0_24px_44px_rgba(20,54,96,0.12)]"
                          : "border-white/60 bg-white/62 hover:border-brand-line hover:bg-white/82",
                      )}
                    >
                      <div className="flex items-start gap-4">
                        <span
                          className={cn(
                            "flex h-12 w-12 flex-none items-center justify-center rounded-2xl transition",
                            isActive
                              ? "bg-brand-blue text-white"
                              : "bg-brand-cloud text-brand-blue",
                          )}
                        >
                          <Icon className="h-6 w-6" aria-hidden="true" />
                        </span>
                        <div className="min-w-0">
                          <div className="flex items-center justify-between gap-4">
                            <h3 className="text-lg font-semibold text-brand-ink">
                              {highlight.title}
                            </h3>
                            <span
                              className={cn(
                                "h-2.5 w-2.5 flex-none rounded-full transition",
                                isActive ? "bg-brand-blue" : "bg-brand-line",
                              )}
                              aria-hidden="true"
                            />
                          </div>
                          <p className="mt-2 text-sm leading-7 text-brand-muted">
                            {highlight.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
