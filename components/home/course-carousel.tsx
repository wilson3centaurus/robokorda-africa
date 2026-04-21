"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Course } from "@/data/site";
import { CourseCard } from "@/components/course-card";

export function CourseCarousel({ courses }: { courses: Course[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  function syncActiveFromScroll() {
    const container = trackRef.current;
    if (!container) {
      return;
    }

    const cards = Array.from(container.children) as HTMLElement[];
    const containerCenter = container.scrollLeft + container.clientWidth / 2;

    const nearestIndex = cards.reduce(
      (closest, card, index) => {
        const cardCenter = card.offsetLeft + card.clientWidth / 2;
        const distance = Math.abs(containerCenter - cardCenter);

        if (distance < closest.distance) {
          return { index, distance };
        }

        return closest;
      },
      { index: 0, distance: Number.POSITIVE_INFINITY },
    ).index;

    setActiveIndex(nearestIndex);
  }

  function scrollToCard(index: number) {
    const container = trackRef.current;
    if (!container) {
      return;
    }

    const card = container.children[index] as HTMLElement | undefined;
    if (!card) {
      return;
    }

    container.scrollTo({
      left: card.offsetLeft - container.offsetLeft,
      behavior: "smooth",
    });
    setActiveIndex(index);
  }

  function step(direction: number) {
    const nextIndex =
      (activeIndex + direction + courses.length) % courses.length;
    scrollToCard(nextIndex);
  }

  return (
    <div className="mt-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {courses.map((course, index) => (
            <button
              key={course.title}
              type="button"
              onClick={() => scrollToCard(index)}
              className={
                index === activeIndex
                  ? "rounded-full bg-brand-blue px-4 py-2 text-sm font-semibold text-white"
                  : "rounded-full border border-brand-line bg-white px-4 py-2 text-sm font-semibold text-brand-muted transition hover:border-brand-blue hover:text-brand-blue-deep"
              }
            >
              {course.title}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => step(-1)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-brand-line bg-white text-brand-blue transition hover:border-brand-blue"
            aria-label="Previous course"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-brand-line bg-white text-brand-blue transition hover:border-brand-blue"
            aria-label="Next course"
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        onScroll={syncActiveFromScroll}
        className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto pb-3"
      >
        {courses.map((course) => (
          <div
            key={course.title}
            className="w-[85vw] min-w-[85vw] snap-start sm:w-[24rem] sm:min-w-[24rem]"
          >
            <CourseCard course={course} />
          </div>
        ))}
      </div>
    </div>
  );
}
