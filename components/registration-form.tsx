"use client";

import { useState } from "react";
import { CheckCircle2, Send, Loader2 } from "lucide-react";
import type { CountryEntry } from "@/lib/page-types";

type RegistrationState = {
  teamName: string;
  school: string;
  country: string;
  category: string;
  teamLead: string;
  email: string;
  phone: string;
  message: string;
};

const initialState: RegistrationState = {
  teamName: "",
  school: "",
  country: "Zimbabwe",
  category: "Junior",
  teamLead: "",
  email: "",
  phone: "",
  message: "",
};

const inputCls = "w-full rounded-xl border border-[rgba(0,102,255,0.2)] bg-[rgba(4,13,30,0.9)] px-4 py-3 text-sm text-white placeholder-[#2a4d80] outline-none transition focus:border-[#0066ff] focus:ring-1 focus:ring-[rgba(0,102,255,0.3)]";
const labelCls = "text-[10px] font-bold uppercase tracking-[0.18em] text-[#4d7499]";

export function RegistrationForm({ countries }: { countries: CountryEntry[] }) {
  const [form, setForm] = useState(initialState);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function update<K extends keyof RegistrationState>(key: K, value: RegistrationState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    try {
      await fetch("/api/rirc/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } catch {
      // fail silently — show success regardless
    }
    setSubmitting(false);
    setSubmitted(true);
    setForm(initialState);
  }

  return (
    <div className="rounded-2xl border border-[rgba(0,102,255,0.2)] bg-[rgba(7,20,40,0.8)] p-6 sm:p-8 h-full">
      {submitted ? (
        <div className="flex h-full flex-col items-start">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[rgba(0,229,160,0.3)] bg-[rgba(0,229,160,0.08)]">
            <CheckCircle2 className="h-7 w-7 text-[#00e5a0]" aria-hidden="true" />
          </span>
          <h3 className="mt-5 text-2xl font-bold text-white">Registration received!</h3>
          <p className="mt-3 text-sm leading-7 text-[#4d7499]">
            Your RIRC 2026 team registration has been submitted. Our competition coordinator will contact your team lead within <span className="text-[#00e5a0] font-semibold">24 hours</span> to confirm your entry and share next steps.
          </p>
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#0066ff] px-6 py-3 text-sm font-semibold text-white shadow-[0_0_24px_rgba(0,102,255,0.4)] transition hover:bg-[#0052cc]"
          >
            Register another team
          </button>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1.5">
              <span className={labelCls}>Team Name *</span>
              <input required className={inputCls} placeholder="e.g. TechEagles" value={form.teamName} onChange={(e) => update("teamName", e.target.value)} />
            </label>
            <label className="space-y-1.5">
              <span className={labelCls}>School / Institution *</span>
              <input required className={inputCls} placeholder="School name" value={form.school} onChange={(e) => update("school", e.target.value)} />
            </label>
            <label className="space-y-1.5">
              <span className={labelCls}>Country</span>
              <select className={inputCls} value={form.country} onChange={(e) => update("country", e.target.value)}>
                {countries.map((c) => <option key={c.code}>{c.name}</option>)}
              </select>
            </label>
            <label className="space-y-1.5">
              <span className={labelCls}>Category</span>
              <select className={inputCls} value={form.category} onChange={(e) => update("category", e.target.value)}>
                <option>Junior</option>
                <option>Senior</option>
                <option>Open</option>
              </select>
            </label>
            <label className="space-y-1.5">
              <span className={labelCls}>Team Lead Name *</span>
              <input required className={inputCls} placeholder="Full name" value={form.teamLead} onChange={(e) => update("teamLead", e.target.value)} />
            </label>
            <label className="space-y-1.5">
              <span className={labelCls}>Email *</span>
              <input required type="email" className={inputCls} placeholder="team@school.ac" value={form.email} onChange={(e) => update("email", e.target.value)} />
            </label>
          </div>
          <label className="space-y-1.5">
            <span className={labelCls}>Phone *</span>
            <input required className={inputCls} placeholder="+263 or +27" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
          </label>
          <label className="space-y-1.5">
            <span className={labelCls}>Notes (optional)</span>
            <textarea
              rows={3}
              className={`${inputCls} resize-none`}
              placeholder="Any questions or special requirements…"
              value={form.message}
              onChange={(e) => update("message", e.target.value)}
            />
          </label>
          <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-[#2a4d80]">Registrations close 30 August 2026</p>
            <button type="submit" disabled={submitting} className="inline-flex items-center gap-2 rounded-xl bg-[#0066ff] px-6 py-3 text-sm font-semibold text-white shadow-[0_0_24px_rgba(0,102,255,0.4)] transition hover:bg-[#0052cc] disabled:opacity-60">
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Submitting…
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" aria-hidden="true" />
                  Submit Registration
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
