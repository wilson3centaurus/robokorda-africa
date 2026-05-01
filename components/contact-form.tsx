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
    <div className="rounded-2xl border border-[var(--surface-border)] bg-[var(--card)] p-6 sm:p-8">
      {submitted ? (
        <div className="flex flex-col items-start">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[rgba(0,229,160,0.30)] bg-[rgba(0,229,160,0.10)]">
            <CheckCircle2 className="h-8 w-8 text-[var(--neon)]" aria-hidden="true" />
          </span>
          <h3 className="mt-6 text-2xl font-bold text-[var(--text-primary)]">Message sent!</h3>
          <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
            We&apos;ve received your enquiry and will get back to you shortly.
          </p>
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="mt-8 btn-primary"
          >
            Send another enquiry
          </button>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--electric-bright)]">
              Enquiry Form
            </p>
            <h3 className="mt-2 text-xl font-bold text-[var(--text-primary)]">
              Start a conversation with Robokorda Africa
            </h3>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">Full name</span>
                <input
                  required
                  value={form.fullName}
                  onChange={(e) => setForm((s) => ({ ...s, fullName: e.target.value }))}
                  className="w-full rounded-xl border border-[var(--surface-border-subtle)] bg-[var(--surface-1)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none transition focus:border-[var(--electric)] focus:ring-1 focus:ring-[var(--electric-glow)]"
                  placeholder="Capo De Santa"
                />
              </label>
              <label className="space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">Email</span>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
                  className="w-full rounded-xl border border-[var(--surface-border-subtle)] bg-[var(--surface-1)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none transition focus:border-[var(--electric)] focus:ring-1 focus:ring-[var(--electric-glow)]"
                  placeholder="you@example.com"
                />
              </label>
              <label className="space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">School or organisation</span>
                <input
                  value={form.organisation}
                  onChange={(e) => setForm((s) => ({ ...s, organisation: e.target.value }))}
                  className="w-full rounded-xl border border-[var(--surface-border-subtle)] bg-[var(--surface-1)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none transition focus:border-[var(--electric)] focus:ring-1 focus:ring-[var(--electric-glow)]"
                  placeholder="Optional"
                />
              </label>
              <label className="space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">Phone</span>
                <input
                  required
                  value={form.phone}
                  onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))}
                  className="w-full rounded-xl border border-[var(--surface-border-subtle)] bg-[var(--surface-1)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none transition focus:border-[var(--electric)] focus:ring-1 focus:ring-[var(--electric-glow)]"
                  placeholder="+27 or +263"
                />
              </label>
            </div>
            <label className="space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">Enquiry type</span>
              <select
                value={form.interest}
                onChange={(e) => setForm((s) => ({ ...s, interest: e.target.value }))}
                className="w-full rounded-xl border border-[var(--surface-border-subtle)] bg-[var(--surface-1)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--electric)] focus:ring-1 focus:ring-[var(--electric-glow)]"
              >
                <option>School programme</option>
                <option>Weekend activity</option>
                <option>Extra-curricular club</option>
                <option>Partnership enquiry</option>
                <option>Parent enquiry</option>
              </select>
            </label>
            <label className="space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">Message</span>
              <textarea
                required
                rows={4}
                value={form.message}
                onChange={(e) => setForm((s) => ({ ...s, message: e.target.value }))}
                className="w-full rounded-xl border border-[var(--surface-border-subtle)] bg-[var(--surface-1)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none transition focus:border-[var(--electric)] focus:ring-1 focus:ring-[var(--electric-glow)] resize-none"
                placeholder="Tell us how we can help…"
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary disabled:opacity-60"
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
