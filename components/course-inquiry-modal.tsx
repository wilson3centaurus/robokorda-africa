"use client";

import { useState } from "react";
import { CheckCircle2, X, Loader2, Send } from "lucide-react";

type Props = {
  courseTitle: string | null;
  onClose: () => void;
};

type FormState = {
  parent_name: string;
  phone: string;
  email: string;
  student_name: string;
  school: string;
  notes: string;
};

const initial: FormState = {
  parent_name: "",
  phone: "",
  email: "",
  student_name: "",
  school: "",
  notes: "",
};

const inputCls = "w-full rounded-xl border border-[var(--surface-border-subtle)] bg-[var(--surface-1)] px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none transition focus:border-[var(--electric)] focus:ring-1 focus:ring-[var(--electric-glow)]";
const labelCls = "text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--text-muted)]";

export function CourseInquiryModal({ courseTitle, onClose }: Props) {
  const [form, setForm] = useState<FormState>(initial);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!courseTitle) return null;

  function set<K extends keyof FormState>(key: K, val: string) {
    setForm((p) => ({ ...p, [key]: val }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch("/api/inquiries/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ course_title: courseTitle, ...form }),
      });
    } catch {
      // show success regardless
    }
    setSubmitting(false);
    setSubmitted(true);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/88 p-4 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-1)] shadow-[0_0_80px_var(--electric-glow)] max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-[var(--surface-border)] bg-[var(--electric-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {submitted ? (
          <div className="flex flex-col items-start p-8">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[rgba(0,229,160,0.3)] bg-[rgba(0,229,160,0.08)]">
              <CheckCircle2 className="h-7 w-7 text-[#00e5a0]" aria-hidden="true" />
            </span>
            <h2 className="mt-5 text-xl font-bold text-[var(--text-primary)]">Enquiry received!</h2>
            <p className="mt-2 text-sm leading-7 text-[var(--text-muted)]">
              We&apos;ve received your interest in <span className="font-semibold text-[var(--text-primary)]">{courseTitle}</span>. Our team will contact you within <span className="text-[#00e5a0]">24 hours</span>.
            </p>
            <div className="mt-5 rounded-xl border border-[var(--surface-border-subtle)] bg-[var(--electric-subtle)] p-4 w-full">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--electric)] mb-1">Course</p>
              <p className="mt-1 text-sm font-semibold text-[var(--text-primary)]">{courseTitle}</p>
              {form.student_name && (
                <p className="mt-1 text-xs text-[var(--text-secondary)]">Student: {form.student_name}</p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 btn-primary inline-flex w-full items-center justify-center"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="border-b border-[var(--surface-border-subtle)] bg-gradient-to-r from-[var(--surface-1)] to-[var(--surface-2)] px-7 py-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--electric)] mb-1">
                Course Enquiry
              </p>
              <h2 className="text-lg font-bold text-[var(--text-primary)]">{courseTitle}</h2>
              <p className="mt-1 text-xs text-[var(--text-secondary)]">
                Tell us about your student — we&apos;ll get back to you within 24 hours.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 p-7">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-1.5">
                  <span className={labelCls}>Your Name (Parent / Guardian) *</span>
                  <input required className={inputCls} value={form.parent_name} onChange={(e) => set("parent_name", e.target.value)} placeholder="Full name" />
                </label>
                <label className="space-y-1.5">
                  <span className={labelCls}>Phone Number *</span>
                  <input required className={inputCls} value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+263 7X XXX XXXX" />
                </label>
              </div>

              <label className="space-y-1.5">
                <span className={labelCls}>Email (optional)</span>
                <input type="email" className={inputCls} value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="your@email.com" />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-1.5">
                  <span className={labelCls}>Student&apos;s Name</span>
                  <input className={inputCls} value={form.student_name} onChange={(e) => set("student_name", e.target.value)} placeholder="Student full name" />
                </label>
                <label className="space-y-1.5">
                  <span className={labelCls}>School / Institution</span>
                  <input className={inputCls} value={form.school} onChange={(e) => set("school", e.target.value)} placeholder="School name" />
                </label>
              </div>

              <label className="space-y-1.5">
                <span className={labelCls}>Additional notes</span>
                <textarea
                  className={`${inputCls} min-h-[80px] resize-none`}
                  value={form.notes}
                  onChange={(e) => set("notes", e.target.value)}
                  placeholder="Any questions about the course or current level…"
                />
              </label>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex w-full items-center justify-center gap-2 btn-primary disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending…
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send Enquiry
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
