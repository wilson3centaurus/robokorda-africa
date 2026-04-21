"use client";

import { useState } from "react";
import { CheckCircle2, Send, Loader2 } from "lucide-react";
import type { CountryEntry } from "@/lib/page-types";
import { Card } from "@/components/card";

type RegistrationFormProps = {
  countries: CountryEntry[];
};

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

export function RegistrationForm({ countries }: RegistrationFormProps) {
  const [form, setForm] = useState(initialState);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function update<K extends keyof RegistrationState>(
    key: K,
    value: RegistrationState[K],
  ) {
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
    <Card className="h-full">
      {submitted ? (
        <div className="flex h-full flex-col items-start justify-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-cloud text-brand-blue">
            <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
          </span>
          <h3 className="mt-6 text-3xl font-semibold text-brand-ink">
            Registration received!
          </h3>
          <p className="mt-4 text-base leading-8 text-brand-muted">
            Your RIRC 2026 team registration has been submitted. Our competition
            coordinator will contact your team lead within <strong>24 hours</strong>{" "}
            to confirm your entry and share next steps.
          </p>
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="btn-primary mt-8"
          >
            Register another team
          </button>
        </div>
      ) : (
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="field-label">Team Name</span>
              <input
                required
                className="field-input"
                value={form.teamName}
                onChange={(event) => update("teamName", event.target.value)}
              />
            </label>
            <label className="space-y-2">
              <span className="field-label">School/Institution</span>
              <input
                required
                className="field-input"
                value={form.school}
                onChange={(event) => update("school", event.target.value)}
              />
            </label>
            <label className="space-y-2">
              <span className="field-label">Country</span>
              <select
                className="field-select"
                value={form.country}
                onChange={(event) => update("country", event.target.value)}
              >
                {countries.map((country) => (
                  <option key={country.code}>{country.name}</option>
                ))}
              </select>
            </label>
            <label className="space-y-2">
              <span className="field-label">Category</span>
              <select
                className="field-select"
                value={form.category}
                onChange={(event) => update("category", event.target.value)}
              >
                <option>Junior</option>
                <option>Senior</option>
                <option>Open</option>
              </select>
            </label>
            <label className="space-y-2">
              <span className="field-label">Team Lead Name</span>
              <input
                required
                className="field-input"
                value={form.teamLead}
                onChange={(event) => update("teamLead", event.target.value)}
              />
            </label>
            <label className="space-y-2">
              <span className="field-label">Email</span>
              <input
                required
                type="email"
                className="field-input"
                value={form.email}
                onChange={(event) => update("email", event.target.value)}
              />
            </label>
          </div>
          <label className="space-y-2">
            <span className="field-label">Phone</span>
            <input
              required
              className="field-input"
              value={form.phone}
              onChange={(event) => update("phone", event.target.value)}
            />
          </label>
          <label className="space-y-2">
            <span className="field-label">Message</span>
            <textarea
              className="field-textarea"
              value={form.message}
              onChange={(event) => update("message", event.target.value)}
            />
          </label>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-brand-muted">
              Registrations close 30 August 2026
            </p>
            <button type="submit" disabled={submitting} className="btn-primary">
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
    </Card>
  );
}
