"use client";

import { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { Card } from "@/components/card";

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

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    setForm(initialState);
  }

  return (
    <Card>
      {submitted ? (
        <div className="flex flex-col justify-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-cloud text-brand-blue">
            <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
          </span>
          <h3 className="mt-6 text-3xl font-semibold text-brand-ink">
            Enquiry captured
          </h3>
          <p className="mt-4 text-base leading-8 text-brand-muted">
            Your message has been saved on the front end. The form is ready to be
            connected to a live enquiry workflow when needed.
          </p>
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="btn-primary mt-8"
          >
            Send another enquiry
          </button>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-blue">
              Enquiry Form
            </p>
            <h3 className="mt-3 text-2xl font-semibold text-brand-ink">
              Start a conversation with Robokorda Africa
            </h3>
          </div>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="space-y-2">
                <span className="field-label">Full name</span>
                <input
                  required
                  value={form.fullName}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, fullName: event.target.value }))
                  }
                  className="field-input"
                />
              </label>
              <label className="space-y-2">
                <span className="field-label">Email</span>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, email: event.target.value }))
                  }
                  className="field-input"
                />
              </label>
              <label className="space-y-2">
                <span className="field-label">School or organisation</span>
                <input
                  value={form.organisation}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      organisation: event.target.value,
                    }))
                  }
                  className="field-input"
                />
              </label>
              <label className="space-y-2">
                <span className="field-label">Phone</span>
                <input
                  required
                  value={form.phone}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, phone: event.target.value }))
                  }
                  className="field-input"
                />
              </label>
            </div>
            <label className="space-y-2">
              <span className="field-label">Enquiry type</span>
              <select
                value={form.interest}
                onChange={(event) =>
                  setForm((current) => ({ ...current, interest: event.target.value }))
                }
                className="field-select"
              >
                <option>School programme</option>
                <option>Weekend activity</option>
                <option>Extra-curricular club</option>
                <option>Partnership enquiry</option>
                <option>Parent enquiry</option>
              </select>
            </label>
            <label className="space-y-2">
              <span className="field-label">Message</span>
              <textarea
                required
                value={form.message}
                onChange={(event) =>
                  setForm((current) => ({ ...current, message: event.target.value }))
                }
                className="field-textarea"
              />
            </label>
            <button type="submit" className="btn-primary">
              <Send className="h-4 w-4" aria-hidden="true" />
              Send enquiry
            </button>
          </form>
        </>
      )}
    </Card>
  );
}
