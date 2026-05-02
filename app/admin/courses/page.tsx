"use client";

import { BookOpen, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CoursesAdminPage() {
  return (
    <>
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <BookOpen className="h-6 w-6 text-[var(--electric-bright)]" />
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Robotics Courses</h1>
        </div>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Manage the main Robokorda robotics and coding programme courses.
        </p>
      </div>

      <div className="rounded-xl border border-[var(--surface-border)] bg-[var(--surface-1)] p-6">
        <p className="text-[var(--text-secondary)] text-sm mb-4">
          Course content is managed through the Pages editor. Click below to edit course listings, descriptions, and images.
        </p>
        <Link
          href="/admin/pages/home"
          className="inline-flex items-center gap-2 rounded-xl bg-[var(--electric)] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition"
        >
          Edit Homepage Courses Section
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-4 rounded-xl border border-[var(--surface-border)] bg-[var(--surface-1)] p-6">
        <h2 className="text-sm font-bold text-[var(--text-primary)] mb-3">Quick Links</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {[
            { label: "Homepage — Courses Section", href: "/admin/pages/home" },
            { label: "RIRC Page Content", href: "/admin/pages/rirc" },
            { label: "Gallery — Courses Photos", href: "/admin/gallery" },
            { label: "Short Courses (Certified)", href: "/admin/short-courses" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center justify-between rounded-xl border border-[var(--surface-border)] bg-[var(--surface-2)] px-4 py-3 text-sm font-medium text-[var(--text-secondary)] hover:border-[var(--electric)] hover:text-[var(--text-primary)] transition"
            >
              {link.label}
              <ArrowRight className="h-3.5 w-3.5 shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
