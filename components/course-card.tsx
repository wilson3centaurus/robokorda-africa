import type { Course } from "@/data/site";
import { PlaceholderMedia } from "@/components/placeholder-media";
import { ArrowRight } from "lucide-react";

export function CourseCard({ course, onEnquire }: { course: Course; onEnquire?: (title: string) => void }) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-[var(--surface-border)] bg-[var(--card)] overflow-hidden transition-colors hover:border-[var(--electric)]">
      <PlaceholderMedia
        mode="card"
        label={`${course.title} Course Placeholder`}
        seed={course.seed}
        imageUrl={course.imageSrc}
      />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="text-base font-bold text-[var(--text-primary)] leading-tight">{course.title}</h3>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--electric-bright)]">{course.level}</p>
        </div>
        <dl className="grid grid-cols-2 gap-1.5 text-xs">
          <div className="rounded-lg border border-[var(--surface-border-subtle)] bg-[var(--surface-1)] px-2.5 py-2">
            <dt className="text-[9px] font-bold uppercase tracking-[0.15em] text-[var(--text-muted)]">Age</dt>
            <dd className="mt-0.5 font-semibold text-[var(--text-primary)] text-xs">{course.age}</dd>
          </div>
          <div className="rounded-lg border border-[var(--surface-border-subtle)] bg-[var(--surface-1)] px-2.5 py-2">
            <dt className="text-[9px] font-bold uppercase tracking-[0.15em] text-[var(--text-muted)]">Duration</dt>
            <dd className="mt-0.5 font-semibold text-[var(--text-primary)] text-xs">{course.duration}</dd>
          </div>
          <div className="col-span-2 rounded-lg border border-[var(--surface-border-subtle)] bg-[var(--surface-1)] px-2.5 py-2">
            <dt className="text-[9px] font-bold uppercase tracking-[0.15em] text-[var(--text-muted)]">Delivery</dt>
            <dd className="mt-0.5 font-semibold text-[var(--text-primary)] text-xs">{course.deliveryMode}</dd>
          </div>
        </dl>
        <ul className="space-y-1.5 text-[13px]">
          {course.overview.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="mt-[6px] h-1.5 w-1.5 flex-none rounded-full bg-[var(--electric-bright)]" />
               <span className="leading-snug text-[var(--text-muted)]">{item}</span>
            </li>
          ))}
        </ul>
        <div className="mt-auto pt-2">
          <button
            type="button"
            onClick={() => onEnquire?.(course.title)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--electric)] px-4 py-2.5 text-xs font-bold text-white shadow-[0_0_18px_var(--electric-glow)] transition hover:bg-[#2724b0] hover:shadow-[0_0_26px_var(--electric-glow)]"
          >
            Enquire about this course
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
