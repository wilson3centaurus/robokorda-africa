import type { Course } from "@/data/site";
import { PlaceholderMedia } from "@/components/placeholder-media";
import { ArrowRight } from "lucide-react";

export function CourseCard({ course, onEnquire }: { course: Course; onEnquire?: (title: string) => void }) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-[rgba(0,102,255,0.18)] bg-[rgba(7,20,40,0.8)] overflow-hidden transition-colors hover:border-[rgba(0,102,255,0.35)]">
      <PlaceholderMedia
        mode="card"
        label={`${course.title} Course Placeholder`}
        seed={course.seed}
        imageUrl={course.imageSrc}
      />
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <h3 className="text-lg font-bold text-white">{course.title}</h3>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#0066ff]">{course.level}</p>
        </div>
        <dl className="grid grid-cols-2 gap-2 text-sm">
          <div className="rounded-xl border border-[rgba(0,102,255,0.15)] bg-[rgba(0,102,255,0.06)] px-3 py-2.5">
            <dt className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#4d7499]">Age</dt>
            <dd className="mt-1 font-semibold text-white text-sm">{course.age}</dd>
          </div>
          <div className="rounded-xl border border-[rgba(0,102,255,0.15)] bg-[rgba(0,102,255,0.06)] px-3 py-2.5">
            <dt className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#4d7499]">Duration</dt>
            <dd className="mt-1 font-semibold text-white text-sm">{course.duration}</dd>
          </div>
          <div className="col-span-2 rounded-xl border border-[rgba(0,102,255,0.15)] bg-[rgba(0,102,255,0.06)] px-3 py-2.5">
            <dt className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#4d7499]">Delivery</dt>
            <dd className="mt-1 font-semibold text-white text-sm">{course.deliveryMode}</dd>
          </div>
        </dl>
        <ul className="space-y-2 text-sm">
          {course.overview.map((item) => (
            <li key={item} className="flex gap-2.5">
              <span className="mt-[7px] h-1.5 w-1.5 flex-none rounded-full bg-[#0066ff]" />
              <span className="leading-6 text-[#4d7499]">{item}</span>
            </li>
          ))}
        </ul>
        <div className="mt-auto pt-2">
          <button
            type="button"
            onClick={() => onEnquire?.(course.title)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0066ff] px-5 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(0,102,255,0.3)] transition hover:bg-[#0052cc] hover:shadow-[0_0_28px_rgba(0,102,255,0.5)]"
          >
            Enquire about this course
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
