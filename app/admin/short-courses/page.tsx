"use client";

import { GraduationCap, CheckCircle, MapPin, Monitor, Wifi, ArrowRight } from "lucide-react";
import Link from "next/link";
import { shortCourses, shortCourseCategories } from "@/data/short-courses";

const deliveryCount = {
  Physical: shortCourses.filter((c) => c.delivery.includes("Physical")).length,
  Online: shortCourses.filter((c) => c.delivery.includes("Online")).length,
  Hybrid: shortCourses.filter((c) => c.delivery.includes("Hybrid")).length,
};

const categoryCount: Record<string, number> = {};
shortCourses.forEach((c) => {
  categoryCount[c.category] = (categoryCount[c.category] || 0) + 1;
});

export default function ShortCoursesAdminPage() {
  return (
    <>
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <GraduationCap className="h-6 w-6 text-[var(--electric-bright)]" />
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Short Courses</h1>
        </div>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Overview of all short courses offered by Robokorda Africa.
          <Link href="/short-courses" target="_blank" className="ml-2 text-[var(--electric-bright)] hover:underline">View public page →</Link>
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-6">
        <div className="rounded-xl border border-[var(--surface-border)] bg-[var(--surface-1)] p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Total Courses</p>
          <p className="text-3xl font-bold text-[var(--text-primary)] mt-1">{shortCourses.length}</p>
        </div>
        <div className="rounded-xl border border-[var(--surface-border)] bg-[var(--surface-1)] p-4">
          <div className="flex items-center gap-1.5 mb-1">
            <MapPin className="h-3.5 w-3.5 text-[var(--electric-bright)]" />
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Physical</p>
          </div>
          <p className="text-3xl font-bold text-[var(--text-primary)]">{deliveryCount.Physical}</p>
        </div>
        <div className="rounded-xl border border-[var(--surface-border)] bg-[var(--surface-1)] p-4">
          <div className="flex items-center gap-1.5 mb-1">
            <Wifi className="h-3.5 w-3.5 text-[var(--electric-bright)]" />
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Online</p>
          </div>
          <p className="text-3xl font-bold text-[var(--text-primary)]">{deliveryCount.Online}</p>
        </div>
        <div className="rounded-xl border border-[var(--surface-border)] bg-[var(--surface-1)] p-4">
          <div className="flex items-center gap-1.5 mb-1">
            <Monitor className="h-3.5 w-3.5 text-[var(--electric-bright)]" />
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Hybrid</p>
          </div>
          <p className="text-3xl font-bold text-[var(--text-primary)]">{deliveryCount.Hybrid}</p>
        </div>
      </div>

      {/* Category breakdown */}
      <div className="mb-6 rounded-xl border border-[var(--surface-border)] bg-[var(--surface-1)] p-5">
        <h2 className="text-sm font-bold text-[var(--text-primary)] mb-4">By Category</h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {shortCourseCategories.slice(1).map((cat) => (
            <div key={cat} className="flex items-center justify-between rounded-xl border border-[var(--surface-border)] bg-[var(--surface-2)] px-3 py-2.5">
              <span className="text-xs font-medium text-[var(--text-secondary)] truncate mr-2">{cat}</span>
              <span className="shrink-0 rounded-full bg-[var(--electric-subtle)] px-2 py-0.5 text-[11px] font-bold text-[var(--electric-bright)]">{categoryCount[cat] || 0}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Course list */}
      <div className="rounded-xl border border-[var(--surface-border)] bg-[var(--surface-1)] overflow-hidden">
        <div className="p-4 border-b border-[var(--surface-border)] flex items-center justify-between">
          <h2 className="text-sm font-bold text-[var(--text-primary)]">All Courses ({shortCourses.length})</h2>
          <Link
            href="/short-courses"
            target="_blank"
            className="flex items-center gap-1.5 text-xs text-[var(--electric-bright)] hover:text-[var(--text-primary)] transition"
          >
            View on site <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="divide-y divide-[var(--surface-border)]">
          {shortCourses.map((course) => {
            const Icon = course.icon;
            return (
              <div key={course.id} className="flex items-start gap-4 p-4 hover:bg-[var(--surface-2)] transition">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[rgba(52,47,197,0.25)] bg-[rgba(52,47,197,0.1)]">
                  <Icon className="h-4 w-4 text-[var(--electric-bright)]" />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-[var(--text-primary)]">{course.title}</span>
                    {course.badge && (
                      <span className="rounded-full bg-[var(--electric)] px-2 py-0.5 text-[9px] font-bold uppercase text-white">{course.badge}</span>
                    )}
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)] mt-0.5">{course.category} · {course.duration} · {course.audience}</p>
                </div>
                <div className="shrink-0 flex items-center gap-1.5">
                  {course.delivery.map((d) => (
                    <span key={d} className="rounded-full border border-[var(--surface-border)] px-2 py-0.5 text-[10px] font-medium text-[var(--text-muted)]">{d}</span>
                  ))}
                </div>
                {course.certified && (
                  <span title="Certified"><CheckCircle className="shrink-0 h-4 w-4 text-[var(--neon)]" /></span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-[rgba(0,229,160,0.2)] bg-[rgba(0,229,160,0.05)] p-4 text-sm text-[var(--text-secondary)]">
        <strong className="text-[#00e5a0]">Note:</strong> To edit course content, update the{" "}
        <code className="rounded bg-[var(--surface-2)] px-1.5 py-0.5 text-[11px] text-[var(--electric-bright)]">data/short-courses.ts</code>{" "}
        file and redeploy. Dynamic CMS editing for short courses is coming soon.
      </div>
    </>
  );
}
