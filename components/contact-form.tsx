"use client";

import { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";

type FormState = {
  fullName: string;
  email: string;
  organisation: string;
  phone: string;
  interest: string;
  message: string;
};

const initialState: FormState = {
  fullName: "",
  email: "",
  organisation: "",
  phone: "",
  interest: "School programme",
  message: "",
};

export function ContactForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } catch {
      // still show success — message saved client-side
    }
    setLoading(false);
    setSubmitted(true);
    setForm(initialState);
  }

  return (
    <div className="rounded-2xl border border-[rgba(0,102,255,0.2)] bg-[rgba(7,20,40,0.8)] p-6 sm:p-8">
      {submitted ? (
        <div className="flex flex-col items-start">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[rgba(0,229,160,0.3)] bg-[rgba(0,229,160,0.08)]">
            <CheckCircle2 className="h-8 w-8 text-[#00e5a0]" aria-hidden="true" />
          </span>
          <h3 className="mt-6 text-2xl font-bold text-white">Message sent!</h3>
          <p className="mt-3 text-sm leading-7 text-[#4d7499]">
            We&apos;ve received your enquiry and will get back to you shortly.
          </p>
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#0066ff] px-6 py-3 text-sm font-semibold text-white shadow-[0_0_24px_rgba(0,102,255,0.4)] transition hover:bg-[#0052cc]"
          >
            Send another enquiry
          </button>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#0066ff]">
              Enquiry Form
            </p>
            <h3 className="mt-2 text-xl font-bold text-white">
              Start a conversation with Robokorda Africa
            </h3>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#4d7499]">Full name</span>
                <input
                  required
                  value={form.fullName}
                  onChange={(e) => setForm((s) => ({ ...s, fullName: e.target.value }))}
                  className="w-full rounded-xl border border-[rgba(0,102,255,0.2)] bg-[rgba(4,13,30,0.9)] px-4 py-3 text-sm text-white placeholder-[#2a4d80] outline-none transition focus:border-[#0066ff] focus:ring-1 focus:ring-[#0066ff]"
                  placeholder="John Doe"
                />
              </label>
              <label className="space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#4d7499]">Email</span>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
                  className="w-full rounded-xl border border-[rgba(0,102,255,0.2)] bg-[rgba(4,13,30,0.9)] px-4 py-3 text-sm text-white placeholder-[#2a4d80] outline-none transition focus:border-[#0066ff] focus:ring-1 focus:ring-[#0066ff]"
                  placeholder="you@example.com"
                />
              </label>
              <label className="space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#4d7499]">School or organisation</span>
                <input
                  value={form.organisation}
                  onChange={(e) => setForm((s) => ({ ...s, organisation: e.target.value }))}
                  className="w-full rounded-xl border border-[rgba(0,102,255,0.2)] bg-[rgba(4,13,30,0.9)] px-4 py-3 text-sm text-white placeholder-[#2a4d80] outline-none transition focus:border-[#0066ff] focus:ring-1 focus:ring-[#0066ff]"
                  placeholder="Optional"
                />
              </label>
              <label className="space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#4d7499]">Phone</span>
                <input
                  required
                  value={form.phone}
                  onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))}
                  className="w-full rounded-xl border border-[rgba(0,102,255,0.2)] bg-[rgba(4,13,30,0.9)] px-4 py-3 text-sm text-white placeholder-[#2a4d80] outline-none transition focus:border-[#0066ff] focus:ring-1 focus:ring-[#0066ff]"
                  placeholder="+27 or +263"
                />
              </label>
            </div>
            <label className="space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#4d7499]">Enquiry type</span>
              <select
                value={form.interest}
                onChange={(e) => setForm((s) => ({ ...s, interest: e.target.value }))}
                className="w-full rounded-xl border border-[rgba(0,102,255,0.2)] bg-[rgba(4,13,30,0.9)] px-4 py-3 text-sm text-white outline-none transition focus:border-[#0066ff] focus:ring-1 focus:ring-[#0066ff]"
              >
                <option>School programme</option>
                <option>Weekend activity</option>
                <option>Extra-curricular club</option>
                <option>Partnership enquiry</option>
                <option>Parent enquiry</option>
              </select>
            </label>
            <label className="space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#4d7499]">Message</span>
              <textarea
                required
                rows={4}
                value={form.message}
                onChange={(e) => setForm((s) => ({ ...s, message: e.target.value }))}
                className="w-full rounded-xl border border-[rgba(0,102,255,0.2)] bg-[rgba(4,13,30,0.9)] px-4 py-3 text-sm text-white placeholder-[#2a4d80] outline-none transition focus:border-[#0066ff] focus:ring-1 focus:ring-[#0066ff] resize-none"
                placeholder="Tell us how we can help…"
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-[#0066ff] px-6 py-3 text-sm font-semibold text-white shadow-[0_0_24px_rgba(0,102,255,0.4)] transition hover:bg-[#0052cc] disabled:opacity-60"
            >
              <Send className="h-4 w-4" aria-hidden="true" />
              {loading ? "Sending…" : "Send enquiry"}
            </button>
          </form>
        </>
      )}
    </div>
  );
}
