"use client";

import { useState } from "react";
import { CheckCircle2, Headset } from "lucide-react";
import { Card } from "@/components/card";

type SupportState = {
  fullName: string;
  phone: string;
  email: string;
  deviceModel: string;
  issueType: string;
  description: string;
};

const initialState: SupportState = {
  fullName: "",
  phone: "",
  email: "",
  deviceModel: "Prime Book Student 14",
  issueType: "Hardware",
  description: "",
};

export function SupportForm() {
  const [form, setForm] = useState(initialState);
  const [submitted, setSubmitted] = useState(false);

  function update<K extends keyof SupportState>(key: K, value: SupportState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    setForm(initialState);
  }

  return (
    <Card className="h-full">
      {submitted ? (
        <div className="flex h-full flex-col justify-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-cloud text-brand-blue">
            <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
          </span>
          <h3 className="mt-6 text-3xl font-semibold text-brand-ink">
            Support request received
          </h3>
          <p className="mt-4 text-base leading-8 text-brand-muted">
            Your details have been saved on the front end. The layout is ready for
            a real support workflow without further UI changes.
          </p>
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="btn-primary mt-8"
          >
            Submit another issue
          </button>
        </div>
      ) : (
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="field-label">Full Name</span>
              <input
                required
                className="field-input"
                value={form.fullName}
                onChange={(event) => update("fullName", event.target.value)}
              />
            </label>
            <label className="space-y-2">
              <span className="field-label">Phone Number</span>
              <input
                required
                className="field-input"
                value={form.phone}
                onChange={(event) => update("phone", event.target.value)}
              />
            </label>
            <label className="space-y-2">
              <span className="field-label">Email</span>
              <input
                type="email"
                className="field-input"
                value={form.email}
                onChange={(event) => update("email", event.target.value)}
              />
            </label>
            <label className="space-y-2">
              <span className="field-label">Device Model</span>
              <select
                className="field-select"
                value={form.deviceModel}
                onChange={(event) => update("deviceModel", event.target.value)}
              >
                <option>Prime Book Student 14</option>
                <option>Prime Book Standard 14</option>
                <option>Prime Book Pro 14</option>
              </select>
            </label>
          </div>
          <label className="space-y-2">
            <span className="field-label">Issue Type</span>
            <select
              className="field-select"
              value={form.issueType}
              onChange={(event) => update("issueType", event.target.value)}
            >
              <option>Hardware</option>
              <option>Software</option>
              <option>Battery</option>
              <option>Screen</option>
              <option>Keyboard</option>
              <option>Other</option>
            </select>
          </label>
          <label className="space-y-2">
            <span className="field-label">Description</span>
            <textarea
              required
              className="field-textarea"
              value={form.description}
              onChange={(event) => update("description", event.target.value)}
            />
          </label>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-brand-muted">
              Our team will reach out within 24 hours.
            </p>
            <button type="submit" className="btn-primary">
              <Headset className="h-4 w-4" aria-hidden="true" />
              Submit Support Request
            </button>
          </div>
        </form>
      )}
    </Card>
  );
}

