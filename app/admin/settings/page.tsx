"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, Check } from "lucide-react";

const GROUPS = [
  {
    label: "Site Identity",
    fields: [
      { key: "site_name", label: "Site Name", type: "text" },
      { key: "site_tagline", label: "Tagline", type: "text" },
    ],
  },
  {
    label: "Contact Information",
    fields: [
      { key: "contact_email", label: "Email", type: "email" },
      { key: "contact_phone_sa", label: "Phone (South Africa)", type: "text" },
      { key: "contact_phone_zw", label: "Phone (Zimbabwe)", type: "text" },
      { key: "address_sa", label: "Address (South Africa)", type: "text" },
      { key: "address_zw", label: "Address (Zimbabwe)", type: "text" },
    ],
  },
  {
    label: "Social Media",
    fields: [
      { key: "social_facebook", label: "Facebook URL", type: "url" },
      { key: "social_instagram", label: "Instagram URL", type: "url" },
      { key: "social_linkedin", label: "LinkedIn URL", type: "url" },
    ],
  },
  {
    label: "Hero Stats",
    fields: [
      { key: "stat_students", label: "Students Trained", type: "text" },
      { key: "stat_schools", label: "Schools Reached", type: "text" },
      { key: "stat_countries", label: "Countries", type: "text" },
      { key: "stat_competitions", label: "Competitions Won", type: "text" },
    ],
  },
  {
    label: "Media / Videos",
    fields: [
      { key: "video_url_home", label: "Home Hero Video URL", type: "url" },
      { key: "video_url_rirc", label: "RIRC Hero Video URL", type: "url" },
      { key: "video_url_primebook", label: "Prime Book Video URL", type: "url" },
    ],
  },
  {
    label: "Prime Book Pricing",
    fields: [
      { key: "primebook_price_usd", label: "Price (USD)", type: "text" },
      { key: "primebook_price_zwg", label: "Price (ZiG)", type: "text" },
      { key: "primebook_specs", label: "Specs Summary", type: "text" },
    ],
  },
  {
    label: "Security",
    fields: [
      { key: "admin_password", label: "Admin Password", type: "text" },
    ],
  },
];

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((d) => { setSettings(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#020810]">
        <Loader2 className="h-6 w-6 animate-spin text-[#7eb8ff]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020810] p-4 sm:p-6 lg:p-8">
      <div className="pointer-events-none fixed inset-0 opacity-[0.02]" style={{ backgroundImage: `linear-gradient(rgba(0,102,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,102,255,1) 1px, transparent 1px)`, backgroundSize: "60px 60px" }} />

      <div className="relative mx-auto max-w-3xl">
        <div className="mb-6 flex items-center gap-3">
          <Link href="/admin" className="flex items-center gap-1.5 text-sm text-[#4d7499] hover:text-white transition">
            <ArrowLeft className="h-4 w-4" /> Dashboard
          </Link>
          <span className="text-[#2a4d80]">/</span>
          <h1 className="text-lg font-bold text-white">Site Settings</h1>
        </div>

        <form onSubmit={save} className="space-y-5">
          {GROUPS.map((group) => (
            <div key={group.label} className="rounded-xl border border-[rgba(0,102,255,0.15)] bg-[rgba(4,13,30,0.8)] p-5">
              <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[#4d7499]">
                {group.label}
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {group.fields.map((field) => (
                  <div key={field.key} className={`space-y-1.5 ${group.fields.length === 1 ? "sm:col-span-2" : ""}`}>
                    <label className="field-label">{field.label}</label>
                    <input
                      type={field.type}
                      className="field-input"
                      value={settings[field.key] ?? ""}
                      onChange={(e) => setSettings((prev) => ({ ...prev, [field.key]: e.target.value }))}
                      placeholder={field.label}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="sticky bottom-4 flex justify-end pb-4">
            <button type="submit" disabled={saving} className="btn-primary shadow-[0_0_24px_rgba(0,102,255,0.35)]">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <Check className="h-4 w-4 text-[#00e5a0]" /> : <Save className="h-4 w-4" />}
              {saving ? "Saving…" : saved ? "Saved!" : "Save All Settings"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
