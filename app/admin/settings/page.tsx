"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Save, Loader2, Check, Upload, Image as ImageIcon,
} from "lucide-react";

type UploadState = "idle" | "uploading" | "done" | "error";

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
      { key: "social_tiktok", label: "TikTok URL", type: "url" },
      { key: "social_youtube", label: "YouTube URL", type: "url" },
      { key: "social_whatsapp", label: "WhatsApp Number (with country code)", type: "text" },
      { key: "social_x", label: "X / Twitter URL", type: "url" },
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
    label: "RIRC Documents",
    fields: [
      { key: "rirc_brochure_url", label: "RIRC Brochure (PDF link or /uploads/...)", type: "file_upload" },
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
      { key: "admin_password", label: "Admin Password", type: "password" },
    ],
  },
];

function LogoUploader({
  fieldKey,
  label,
  accept,
  value,
  onChange,
}: {
  fieldKey: string;
  label: string;
  accept: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<UploadState>("idle");

  async function handleFile(file: File) {
    setStatus("uploading");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const r = await fetch("/api/upload", { method: "POST", body: fd });
      const d = await r.json();
      if (d.url) {
        onChange(d.url);
        setStatus("done");
        setTimeout(() => setStatus("idle"), 2000);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  const previewSrc = value || null;

  return (
    <div className="space-y-3">
      <label className="field-label">{label}</label>

      {/* Preview */}
      <div className="flex items-center gap-4">
        <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-3)]">
          {previewSrc ? (
            <Image
              src={previewSrc}
              alt={label}
              fill
              className="object-contain p-1"
              unoptimized
            />
          ) : (
            <ImageIcon className="h-8 w-8 text-[var(--text-muted)]" />
          )}
        </div>

        <div className="flex-1 space-y-2">
          <input
            type="text"
            className="field-input"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="/brand/logo.png or /uploads/..."
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={status === "uploading"}
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--surface-border)] bg-[var(--surface-2)] px-4 py-2 text-sm font-semibold text-[var(--text-secondary)] transition hover:border-[var(--electric)] hover:text-[var(--electric-bright)] disabled:opacity-60"
          >
            {status === "uploading" ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Uploading…</>
            ) : status === "done" ? (
              <><Check className="h-4 w-4 text-[var(--neon)]" /> Uploaded!</>
            ) : (
              <><Upload className="h-4 w-4" /> Upload Image</>
            )}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="sr-only"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
              e.target.value = "";
            }}
          />
        </div>
      </div>

      {status === "error" && (
        <p className="text-xs text-red-400">Upload failed — check file type and try again.</p>
      )}
    </div>
  );
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((d) => {
        if (d && typeof d === "object" && !d.error) setSettings(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);
    try {
      const r = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const d = await r.json();
      if (!r.ok || d.error) {
        setSaveError(d.error || `Server error ${r.status}`);
      } else {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    } catch (e: unknown) {
      setSaveError(e instanceof Error ? e.message : "Network error");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-[var(--electric-bright)]" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-lg font-bold text-[var(--text-primary)]">Site Settings</h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">Manage site identity, contact info, social links, videos, and security.</p>
      </div>

        <form onSubmit={save} className="space-y-5">
          {/* ── Branding ── */}
          <div className="rounded-xl border border-[var(--surface-border)] bg-[var(--surface-1)] p-5">
            <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[var(--text-muted)]">
              Branding &amp; Logos
            </h2>
            <div className="space-y-5">
              <LogoUploader
                fieldKey="logo_url"
                label="Main Logo (dark backgrounds)"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                value={settings["logo_url"] ?? "/brand/logo.png"}
                onChange={(url) => setSettings((p) => ({ ...p, logo_url: url }))}
              />
              <LogoUploader
                fieldKey="logo_url_dark"
                label="Alternate Logo (light backgrounds / light mode)"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                value={settings["logo_url_dark"] ?? ""}
                onChange={(url) => setSettings((p) => ({ ...p, logo_url_dark: url }))}
              />
              <LogoUploader
                fieldKey="favicon_url"
                label="Favicon (optional)"
                accept="image/png,image/ico,image/svg+xml"
                value={settings["favicon_url"] ?? ""}
                onChange={(url) => setSettings((p) => ({ ...p, favicon_url: url }))}
              />
            </div>
          </div>

          {/* ── All other setting groups ── */}
          {GROUPS.map((group) => (
            <div
              key={group.label}
              className="rounded-xl border border-[var(--surface-border)] bg-[var(--surface-1)] p-5"
            >
              <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[var(--text-muted)]">
                {group.label}
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {group.fields.map((field) => (
                  <div
                    key={field.key}
                    className={`space-y-1.5 ${group.fields.length === 1 ? "sm:col-span-2" : ""}`}
                  >
                    <label className="field-label">{field.label}</label>

                    {field.type === "file_upload" ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          className="field-input flex-1"
                          value={settings[field.key] ?? ""}
                          onChange={(e) =>
                            setSettings((prev) => ({ ...prev, [field.key]: e.target.value }))
                          }
                          placeholder="Paste URL or upload a PDF…"
                        />
                        <label className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-[var(--surface-border)] bg-[var(--surface-2)] px-4 py-2 text-sm font-semibold text-[var(--text-secondary)] transition hover:border-[var(--electric)] hover:text-[var(--electric-bright)]">
                          <Upload className="h-4 w-4" />
                          <input
                            type="file"
                            accept=".pdf,application/pdf"
                            className="sr-only"
                            onChange={async (e) => {
                              const f = e.target.files?.[0];
                              if (!f) return;
                              const fd = new FormData();
                              fd.append("file", f);
                              try {
                                const r = await fetch("/api/upload", { method: "POST", body: fd });
                                const d = await r.json();
                                if (d.url)
                                  setSettings((prev) => ({ ...prev, [field.key]: d.url }));
                              } catch {
                                alert("Upload failed");
                              }
                            }}
                          />
                        </label>
                      </div>
                    ) : field.type === "url" && field.key.includes("video_url") ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          className="field-input flex-1"
                          value={settings[field.key] ?? ""}
                          onChange={(e) =>
                            setSettings((prev) => ({ ...prev, [field.key]: e.target.value }))
                          }
                          placeholder="Paste URL or upload a file…"
                        />
                        <label className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-[var(--surface-border)] bg-[var(--surface-2)] px-4 py-2 text-sm font-semibold text-[var(--text-secondary)] transition hover:border-[var(--electric)] hover:text-[var(--electric-bright)]">
                          <Upload className="h-4 w-4" />
                          <input
                            type="file"
                            accept="video/*,image/*"
                            className="sr-only"
                            onChange={async (e) => {
                              const f = e.target.files?.[0];
                              if (!f) return;
                              const fd = new FormData();
                              fd.append("file", f);
                              try {
                                const r = await fetch("/api/upload", { method: "POST", body: fd });
                                const d = await r.json();
                                if (d.url)
                                  setSettings((prev) => ({ ...prev, [field.key]: d.url }));
                              } catch {
                                alert("Upload failed");
                              }
                            }}
                          />
                        </label>
                      </div>
                    ) : (
                      <input
                        type={field.type}
                        className="field-input"
                        value={settings[field.key] ?? ""}
                        onChange={(e) =>
                          setSettings((prev) => ({ ...prev, [field.key]: e.target.value }))
                        }
                        placeholder={field.label}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="sticky bottom-4 flex flex-col items-end gap-2 pb-4">
            {saveError && (
              <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400">
                ❌ {saveError}
              </p>
            )}
            <button
              type="submit"
              disabled={saving}
              className="btn-primary shadow-[0_0_24px_var(--electric-glow)]"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : saved ? (
                <Check className="h-4 w-4 text-[var(--neon)]" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {saving ? "Saving…" : saved ? "Saved!" : "Save All Settings"}
            </button>
          </div>
        </form>
    </div>
  );
}
