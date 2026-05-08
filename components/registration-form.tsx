"use client";

import { useState } from "react";
import {
  CheckCircle2, Send, Loader2, Plus, Minus,
  Globe, MapPin, Tag, School, Users, User, Mail, Phone, Info, Calendar,
  Video, Link2, X, ExternalLink,
} from "lucide-react";
import type { CountryEntry } from "@/lib/page-types";

const CATEGORIES = [
  "Beginners (5-8 YRS)",
  "Junior (9-12 YRS)",
  "Intermediate (13-16 YRS)",
  "Advanced (17 YRS and Above)",
  "Makeathon (open to all)",
  "Gaming (Intermediate, Advanced and Makeathon Participants)",
];

type Member = { name: string; dob: string };

type RegistrationState = {
  country: string;
  city: string;
  category: string;
  school: string;
  teamName: string;
  teamLead: string;
  members: Member[];
  email: string;
  whatsapp: string;
  teaserEntered: boolean;
  teaserLinks: string[];
};

const initialState: RegistrationState = {
  country: "",
  city: "",
  category: "",
  school: "",
  teamName: "",
  teamLead: "",
  members: [{ name: "", dob: "" }],
  email: "",
  whatsapp: "",
  teaserEntered: false,
  teaserLinks: [""],
};

const inputCls =
  "w-full rounded-xl border border-[var(--surface-border-subtle)] bg-[var(--surface-1)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none transition focus:border-[var(--electric)] focus:ring-1 focus:ring-[var(--electric-glow)]";
const labelCls = "text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--text-secondary)]";

function FieldIcon({ icon: Icon }: { icon: React.ElementType }) {
  return (
    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
      <Icon className="h-4 w-4" />
    </span>
  );
}

function VideoTeaserModal({ onClose }: { onClose: () => void }) {
  const socials = [
    { label: "Facebook",         href: "https://www.facebook.com/share/1Hdyjxem5r/",                          handle: "Robokorda Africa" },
    { label: "Instagram ZW",     href: "https://www.instagram.com/robokordazw?igsh=b2ZlbnUwbWwydXU=",        handle: "@robokordazw" },
    { label: "Instagram Africa", href: "https://www.instagram.com/robokorda_africa?igsh=Z2I4aDUwYTFpaTlo",  handle: "@robokorda_africa" },
    { label: "TikTok",           href: "https://vm.tiktok.com/ZS9LCLFqSpVhw-j1eJn/",                        handle: "@robokordaafrica" },
    { label: "LinkedIn",         href: "https://www.linkedin.com/company/robokorda-africa",                  handle: "robokorda-africa" },
  ];
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl border border-[var(--surface-border)] bg-[var(--card)] shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 pb-3 sticky top-0 bg-[var(--card)]/95 backdrop-blur-sm border-b border-[var(--surface-border-subtle)]">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--electric-bright)]">RIRC Video Challenge</p>
          <button onClick={onClose} className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-5 space-y-5">
          {/* Logo + Title */}
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/rirc/logo.png" alt="RIRC Logo" width={100} height={100} className="rounded-xl object-contain shrink-0 bg-[var(--surface-1)] p-1" style={{ width: 100, height: 100 }} />
            <div>
              <h2 className="text-base font-bold text-[var(--text-primary)]">RIRC 2026 Video Challenge</h2>
              <p className="text-xs leading-5 text-[var(--text-muted)] mt-1">Enter the teaser competition while you prepare for the main event!</p>
            </div>
          </div>
          {/* Flyer */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/rirc/teaser-flyer.jpg" alt="RIRC Video Challenge Flyer" className="w-full rounded-xl object-cover" />
         
          {/* Social links */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-2">Where to reach us</h3>
            <div className="flex flex-wrap gap-2">
              {socials.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--surface-border-subtle)] bg-[var(--surface-2)] px-3 py-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--electric-bright)] hover:border-[var(--electric)] transition-colors"
                >
                  <ExternalLink className="h-3 w-3" />
                  <span className="font-medium">{s.label}</span>
                  <span className="opacity-60">{s.handle}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function RegistrationForm({ countries }: { countries: CountryEntry[] }) {
  const [form, setForm] = useState<RegistrationState>(initialState);
  const [showTeaserModal, setShowTeaserModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof RegistrationState>(key: K, value: RegistrationState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function addMember() {
    if (form.members.length >= 5) return;
    setForm((f) => ({ ...f, members: [...f.members, { name: "", dob: "" }] }));
  }

  function removeMember(idx: number) {
    if (form.members.length <= 1) return;
    setForm((f) => ({ ...f, members: f.members.filter((_, i) => i !== idx) }));
  }

  function updateMember(idx: number, field: keyof Member, value: string) {
    setForm((f) => ({
      ...f,
      members: f.members.map((m, i) => (i === idx ? { ...m, [field]: value } : m)),
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/rirc/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          team_members: form.members.filter((m) => m.name),
          teaser_entered: form.teaserEntered,
          teaser_links: form.teaserLinks.filter(Boolean),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data?.error || "Registration failed. Please try again.");
        setSubmitting(false);
        return;
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
      setSubmitting(false);
      return;
    }
    setSubmitting(false);
    setSubmitted(true);
    setForm(initialState);
  }

  return (
    <div className="rounded-2xl border border-[var(--surface-border)] bg-[var(--card)] p-6 sm:p-8 h-full">
      {showTeaserModal && <VideoTeaserModal onClose={() => setShowTeaserModal(false)} />}
      {submitted ? (
        <div className="flex h-full flex-col items-start">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[rgba(0,229,160,0.3)] bg-[rgba(0,229,160,0.08)]">
            <CheckCircle2 className="h-8 w-8 text-[#00e5a0]" aria-hidden="true" />
          </span>
          <h3 className="mt-5 text-2xl font-bold text-[var(--text-primary)]">Registration received!</h3>
          <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
            Your RIRC 2026 team registration has been submitted successfully.
          </p>
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-[var(--surface-border-subtle)] bg-[var(--electric-subtle)] px-4 py-3">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-[var(--electric-bright)]" />
            <p className="text-sm leading-6 text-[var(--text-secondary)]">
              Please expect a <span className="font-semibold text-[var(--text-primary)]">confirmation email</span> from our competition coordinator as soon as possible. Check your spam folder if you don&apos;t see it within a few hours.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="mt-8 btn-primary inline-flex items-center gap-2"
          >
            Register another team
          </button>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit}>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--electric)] mb-2">RIRC 2026 Registration</p>

          {/* Country & City */}
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1.5">
              <span className={labelCls}>Country *</span>
              <div className="relative">
                <FieldIcon icon={Globe} />
                <select
                  required
                  className={`${inputCls} pl-10`}
                  value={form.country}
                  onChange={(e) => update("country", e.target.value)}
                >
                  <option value="">Select country…</option>
                  {countries.map((c) => (
                    <option key={c.code} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
            </label>
            <label className="space-y-1.5">
              <span className={labelCls}>City *</span>
              <div className="relative">
                <FieldIcon icon={MapPin} />
                <input
                  required
                  className={`${inputCls} pl-10`}
                  placeholder="e.g. Harare"
                  value={form.city}
                  onChange={(e) => update("city", e.target.value)}
                />
              </div>
            </label>
          </div>

          {/* Category */}
          <label className="space-y-1.5">
            <span className={labelCls}>Category *</span>
            <div className="relative">
              <FieldIcon icon={Tag} />
              <select
                required
                className={`${inputCls} pl-10`}
                value={form.category}
                onChange={(e) => update("category", e.target.value)}
              >
                <option value="">Choose category…</option>
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
          </label>

          {/* School / Institution & Team Name */}
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1.5">
              <span className={labelCls}>School / Institution *</span>
              <div className="relative">
                <FieldIcon icon={School} />
                <input
                  required
                  className={`${inputCls} pl-10`}
                  placeholder="School or institution name"
                  value={form.school}
                  onChange={(e) => update("school", e.target.value)}
                />
              </div>
            </label>
            <label className="space-y-1.5">
              <span className={labelCls}>Team Name *</span>
              <div className="relative">
                <FieldIcon icon={Users} />
                <input
                  required
                  className={`${inputCls} pl-10`}
                  placeholder="e.g. TechEagles"
                  value={form.teamName}
                  onChange={(e) => update("teamName", e.target.value)}
                />
              </div>
            </label>
          </div>

          {/* Team Leader */}
          <label className="space-y-1.5">
            <span className={labelCls}>Team Leader Name *</span>
            <div className="relative">
              <FieldIcon icon={User} />
              <input
                required
                className={`${inputCls} pl-10`}
                placeholder="Full name of team leader"
                value={form.teamLead}
                onChange={(e) => update("teamLead", e.target.value)}
              />
            </div>
          </label>

          {/* Team Members */}
          <div className="space-y-1.5">
            <span className={`${labelCls} flex items-center gap-2`}>
              Team Member Names
              <span className="normal-case text-[var(--text-muted)]">(min 1 — max 5)</span>
            </span>
            <div className="space-y-2">
              {form.members.map((m, idx) => (
                <div key={idx} className="rounded-xl border border-[var(--surface-border-subtle)] bg-[var(--surface-1)] p-3 space-y-2">
                  <div className="flex gap-2 items-center">
                    <div className="relative flex-1">
                      <FieldIcon icon={User} />
                      <input
                        className={`${inputCls} pl-10`}
                        placeholder={`Member ${idx + 1} full name`}
                        value={m.name}
                        onChange={(e) => updateMember(idx, 'name', e.target.value)}
                      />
                    </div>
                    {form.members.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMember(idx)}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[rgba(248,113,113,0.3)] bg-[rgba(248,113,113,0.06)] text-red-400 hover:bg-[rgba(248,113,113,0.15)] transition"
                        aria-label="Remove member"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <FieldIcon icon={Calendar} />
                    <input
                      type="date"
                      className={`${inputCls} pl-10`}
                      placeholder="Date of birth"
                      value={m.dob}
                      onChange={(e) => updateMember(idx, 'dob', e.target.value)}
                    />
                  </div>
                  <p className="text-[10px] text-[var(--text-muted)] pl-1">Date of birth (optional)</p>
                </div>
              ))}
            </div>
            {form.members.length < 5 && (
              <button
                type="button"
                onClick={addMember}
                className="mt-2 inline-flex items-center gap-2 rounded-xl border border-[var(--surface-border)] bg-[var(--electric-subtle)] px-4 py-2 text-xs font-semibold text-[var(--electric-bright)] hover:bg-[var(--surface-border)] transition"
              >
                <Plus className="h-3.5 w-3.5" />
                Add another member ({form.members.length}/5)
              </button>
            )}
          </div>

          {/* Email & WhatsApp */}
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1.5">
              <span className={labelCls}>Email Address *</span>
              <div className="relative">
                <FieldIcon icon={Mail} />
                <input
                  required
                  type="email"
                  className={`${inputCls} pl-10`}
                  placeholder="team@school.ac"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                />
              </div>
            </label>
            <label className="space-y-1.5">
              <span className={labelCls}>WhatsApp Number *</span>
              <div className="relative">
                <FieldIcon icon={Phone} />
                <input
                  required
                  className={`${inputCls} pl-10`}
                  placeholder="+263 7X XXX XXXX"
                  value={form.whatsapp}
                  onChange={(e) => update("whatsapp", e.target.value)}
                />
              </div>
            </label>
          </div>

          {/* Video Challenge Teaser Competition */}
          <div className="rounded-xl border border-[rgba(0,229,160,0.2)] bg-[rgba(0,229,160,0.03)] p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Video className="h-4 w-4 text-[var(--electric-bright)]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--electric-bright)]">Video Challenge</span>
              </div>
              <button
                type="button"
                onClick={() => setShowTeaserModal(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[rgba(0,229,160,0.35)] px-2.5 py-1 text-xs font-semibold text-[var(--neon)] hover:bg-[var(--neon-subtle)] transition-colors"
              >
                <ExternalLink className="h-3 w-3" />
                Learn More
              </button>
            </div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.teaserEntered}
                onChange={e => update("teaserEntered", e.target.checked)}
                className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-[var(--electric)]"
              />
              <span className="text-sm leading-6 text-[var(--text-secondary)]">
                I have already entered the <span className="font-semibold text-[var(--text-primary)]">RIRC Video Challenge</span> competition on social media.
              </span>
            </label>
            {form.teaserEntered && (
              <div className="space-y-2 pt-1">
                <span className={labelCls}>Your Social Media Post Link(s)</span>
                {form.teaserLinks.map((link, idx) => (
                  <div key={idx} className="flex gap-2">
                    <div className="relative flex-1">
                      <FieldIcon icon={Link2} />
                      <input
                        className={`${inputCls} pl-10`}
                        placeholder="https://www.instagram.com/p/…"
                        value={link}
                        onChange={e => {
                          const updated = [...form.teaserLinks];
                          updated[idx] = e.target.value;
                          update("teaserLinks", updated);
                        }}
                      />
                    </div>
                    {form.teaserLinks.length > 1 && (
                      <button
                        type="button"
                        onClick={() => update("teaserLinks", form.teaserLinks.filter((_, i) => i !== idx))}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[rgba(248,113,113,0.3)] bg-[rgba(248,113,113,0.06)] text-red-400 hover:bg-[rgba(248,113,113,0.15)] transition"
                        aria-label="Remove link"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
                {form.teaserLinks.length < 5 && (
                  <button
                    type="button"
                    onClick={() => update("teaserLinks", [...form.teaserLinks, ""])}
                    className="inline-flex items-center gap-2 rounded-xl border border-[var(--surface-border)] bg-[var(--electric-subtle)] px-4 py-2 text-xs font-semibold text-[var(--electric-bright)] hover:bg-[var(--surface-border)] transition"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add another link
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Error message */}
          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-[rgba(248,113,113,0.3)] bg-[rgba(248,113,113,0.08)] px-4 py-3">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
              <p className="text-sm leading-6 text-red-400">{error}</p>
            </div>
          )}

          {/* Notice */}
          <div className="flex items-start gap-2 rounded-xl border border-[rgba(0,229,160,0.15)] bg-[rgba(0,229,160,0.04)] px-4 py-3">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#00e5a0]" />
            <p className="text-xs leading-6 text-[var(--text-secondary)]">
              After submission you will <span className="font-semibold text-[var(--neon)]">receive a confirmation email</span> from our team as soon as possible. Please also check your spam folder.
            </p>
          </div>

          <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-[var(--text-muted)]">Registrations close 30 August 2026</p>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary inline-flex items-center gap-2 disabled:opacity-60"
            >
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
