import type { Course } from "@/data/site";
import { Card } from "@/components/card";
import { PlaceholderMedia } from "@/components/placeholder-media";

export function CourseCard({ course, onEnquire }: { course: Course; onEnquire?: (title: string) => void }) {
  return (
    <Card className="flex h-full flex-col gap-6">
      <PlaceholderMedia
        mode="card"
        label={`${course.title} Course Placeholder`}
        seed={course.seed}
        imageUrl={course.imageSrc}
      />
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold text-brand-ink">{course.title}</h3>
          <p className="mt-2 text-sm leading-7 text-brand-muted">
            {course.level}
          </p>
        </div>
        <dl className="grid grid-cols-2 gap-3 text-sm text-brand-muted">
          <div className="rounded-2xl border border-brand-line bg-brand-soft px-4 py-3">
            <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-blue">
              Age
            </dt>
            <dd className="mt-2 font-medium text-brand-ink">{course.age}</dd>
          </div>
          <div className="rounded-2xl border border-brand-line bg-brand-soft px-4 py-3">
            <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-blue">
              Duration
            </dt>
            <dd className="mt-2 font-medium text-brand-ink">{course.duration}</dd>
          </div>
          <div className="col-span-2 rounded-2xl border border-brand-line bg-brand-soft px-4 py-3">
            <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-blue">
              Delivery mode
            </dt>
            <dd className="mt-2 font-medium text-brand-ink">
              {course.deliveryMode}
            </dd>
          </div>
        </dl>
        <ul className="space-y-3 text-sm leading-7 text-brand-muted">
          {course.overview.map((item) => (
            <li key={item} className="flex gap-3">
              <span className="mt-2 h-2.5 w-2.5 flex-none rounded-full bg-brand-blue" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-auto">
        <button
          onClick={() => onEnquire?.(course.title)}
          className="btn-primary w-full"
        >
          Enquire about this course
        </button>
      </div>
    </Card>
  );
}
