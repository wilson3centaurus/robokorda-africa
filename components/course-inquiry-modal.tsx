"use client";

import { useState } from "react";
import { CheckCircle2, X, Loader2 } from "lucide-react";

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-lg rounded-[28px] bg-white shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-brand-soft text-brand-muted hover:bg-brand-line transition"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {submitted ? (
          <div className="flex flex-col items-start p-8">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
              <CheckCircle2 className="h-8 w-8" />
            </span>
            <h2 className="mt-6 text-2xl font-semibold text-brand-ink">Enquiry received!</h2>
            <p className="mt-3 text-sm leading-7 text-brand-muted">
              We&apos;ve received your interest in <strong>{courseTitle}</strong>. Our team will
              contact you within <strong>24 hours</strong> to discuss enrolment and next steps.
            </p>
            <div className="mt-6 rounded-2xl border border-brand-line bg-brand-soft p-4 w-full space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-blue">Course</p>
              <p className="text-sm font-semibold text-brand-ink">{courseTitle}</p>
              {form.student_name && (
                <p className="text-sm text-brand-muted">Student: {form.student_name}</p>
              )}
            </div>
            <button onClick={onClose} className="btn-primary mt-6 w-full">
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="bg-brand-blue px-8 py-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60 mb-1">
                Course Enquiry
              </p>
              <h2 className="text-xl font-semibold text-white">{courseTitle}</h2>
              <p className="mt-1 text-sm text-white/80">
                Tell us about your student — we&apos;ll get back to you within 24 hours.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <p className="text-xs text-brand-muted leading-6">
                Fill in the details below. Our education team will call you to discuss enrolment,
                scheduling, and fees.
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-1.5">
                  <span className="field-label">Your Name (Parent / Guardian) *</span>
                  <input
                    required
                    className="field-input"
                    value={form.parent_name}
                    onChange={(e) => set("parent_name", e.target.value)}
                    placeholder="Full name"
                  />
                </label>
                <label className="space-y-1.5">
                  <span className="field-label">Phone Number *</span>
                  <input
                    required
                    className="field-input"
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    placeholder="+263 7X XXX XXXX"
                  />
                </label>
              </div>

              <label className="space-y-1.5">
                <span className="field-label">Email (optional)</span>
                <input
                  type="email"
                  className="field-input"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder="your@email.com"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-1.5">
                  <span className="field-label">Student&apos;s Name</span>
                  <input
                    className="field-input"
                    value={form.student_name}
                    onChange={(e) => set("student_name", e.target.value)}
                    placeholder="Student full name"
                  />
                </label>
                <label className="space-y-1.5">
                  <span className="field-label">School / Institution</span>
                  <input
                    className="field-input"
                    value={form.school}
                    onChange={(e) => set("school", e.target.value)}
                    placeholder="School name"
                  />
                </label>
              </div>

              <label className="space-y-1.5">
                <span className="field-label">Additional notes</span>
                <textarea
                  className="field-input min-h-[80px] resize-none"
                  value={form.notes}
                  onChange={(e) => set("notes", e.target.value)}
                  placeholder="Any questions about the course or student&apos;s current level..."
                />
              </label>

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending…
                  </>
                ) : (
                  "Send Enquiry"
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
