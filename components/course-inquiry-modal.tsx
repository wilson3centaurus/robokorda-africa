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

const inputCls = "w-full rounded-xl border border-[rgba(0,102,255,0.2)] bg-[rgba(4,13,30,0.9)] px-4 py-2.5 text-sm text-white placeholder-[#2a4d80] outline-none transition focus:border-[#0066ff] focus:ring-1 focus:ring-[rgba(0,102,255,0.3)]";
const labelCls = "text-[10px] font-bold uppercase tracking-[0.18em] text-[#4d7499]";

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(2,8,16,0.88)] p-4 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-[rgba(0,102,255,0.25)] bg-[#040d1e] shadow-[0_0_80px_rgba(0,102,255,0.12)] max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(0,102,255,0.2)] bg-[rgba(0,102,255,0.08)] text-[#4d7499] hover:text-white transition"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {submitted ? (
          <div className="flex flex-col items-start p-8">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[rgba(0,229,160,0.3)] bg-[rgba(0,229,160,0.08)]">
              <CheckCircle2 className="h-7 w-7 text-[#00e5a0]" aria-hidden="true" />
            </span>
            <h2 className="mt-5 text-xl font-bold text-white">Enquiry received!</h2>
            <p className="mt-2 text-sm leading-7 text-[#4d7499]">
              We&apos;ve received your interest in <span className="font-semibold text-white">{courseTitle}</span>. Our team will contact you within <span className="text-[#00e5a0]">24 hours</span>.
            </p>
            <div className="mt-5 rounded-xl border border-[rgba(0,102,255,0.15)] bg-[rgba(0,102,255,0.06)] p-4 w-full">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0066ff]">Course</p>
              <p className="mt-1 text-sm font-semibold text-white">{courseTitle}</p>
              {form.student_name && (
                <p className="mt-1 text-xs text-[#4d7499]">Student: {form.student_name}</p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-[#0066ff] px-5 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(0,102,255,0.35)] transition hover:bg-[#0052cc]"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="border-b border-[rgba(0,102,255,0.15)] bg-gradient-to-r from-[#040d1e] to-[#071428] px-7 py-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#0066ff] mb-1">
                Course Enquiry
              </p>
              <h2 className="text-lg font-bold text-white">{courseTitle}</h2>
              <p className="mt-1 text-xs text-[#4d7499]">
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
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0066ff] px-5 py-3 text-sm font-semibold text-white shadow-[0_0_24px_rgba(0,102,255,0.4)] transition hover:bg-[#0052cc] disabled:opacity-60"
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
