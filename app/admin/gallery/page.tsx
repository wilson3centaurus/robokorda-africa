"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Image as ImageIcon, Plus, Trash2, Pencil, X, Check,
  LayoutDashboard, Settings, MessageSquare, TrendingUp, Cpu, Upload, Package
} from "lucide-react";
import type { GalleryRow } from "@/lib/db";

const navLinks = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Inquiries", href: "/admin/inquiries", icon: MessageSquare },
  { label: "Settings", href: "/admin/settings", icon: Settings },
  { label: "Gallery", href: "/admin/gallery", icon: ImageIcon },
  { label: "Catalogue", href: "/admin/catalogue", icon: Package },
  { label: "View Site", href: "/", icon: TrendingUp, external: true },
];

const SECTIONS = ["home", "rirc", "about", "courses"] as const;
const SIZES = ["square", "wide", "tall"] as const;

const empty: Omit<GalleryRow, "id" | "created_at"> = {
  section: "home",
  title: "",
  caption: "",
  image_url: "",
  size: "square",
  sort_order: 0,
  is_published: true,
};

export default function GalleryAdminPage() {
  const router = useRouter();
  const [items, setItems] = useState<GalleryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<GalleryRow, "id" | "created_at">>(empty);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [filterSection, setFilterSection] = useState<string>("all");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/gallery");
    if (res.status === 401) { router.push("/admin/login"); return; }
    setItems(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []); // eslint-disable-line

  async function save() {
    setSaving(true);
    await fetch("/api/admin/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editId ? { ...form, id: editId } : form),
    });
    setSaving(false);
    setShowForm(false);
    setEditId(null);
    setForm(empty);
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this photo?")) return;
    await fetch("/api/admin/gallery", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    load();
  }

  async function togglePublish(item: GalleryRow) {
    await fetch("/api/admin/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...item, is_published: !item.is_published }),
    });
    load();
  }

  function startEdit(item: GalleryRow) {
    setEditId(item.id);
    setForm({
      section: item.section,
      title: item.title,
      caption: item.caption,
      image_url: item.image_url,
      size: item.size,
      sort_order: item.sort_order,
      is_published: item.is_published,
    });
    setShowForm(true);
  }

  function startNew() {
    setEditId(null);
    setForm({ ...empty, sort_order: items.length });
    setShowForm(true);
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    const fd = new FormData();
    files.forEach((f) => fd.append("files", f));
    fd.append("category", "gallery");
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.files?.length) {
        // Auto-add each uploaded file as a new gallery row
        for (const f of data.files) {
          await fetch("/api/admin/gallery", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              image_url: f.url,
              title: f.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "),
              caption: "",
              section: filterSection === "all" ? "home" : filterSection,
              size: "square",
              sort_order: items.length,
              is_published: true,
            }),
          });
        }
        load();
      }
    } catch {
      alert("Upload failed — check console");
    }
    setUploading(false);
    e.target.value = "";
  }

  const displayed = filterSection === "all" ? items : items.filter((i) => i.section === filterSection);

  return (
    <div className="min-h-screen bg-[var(--space-800)]">
      <div className="pointer-events-none fixed inset-0 opacity-[0.025]" style={{ backgroundImage: `linear-gradient(rgba(52,47,197,1) 1px, transparent 1px), linear-gradient(90deg, rgba(52,47,197,1) 1px, transparent 1px)`, backgroundSize: "60px 60px" }} />

      <div className="relative flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-60 shrink-0 border-r border-[var(--surface-border)] bg-[var(--surface-1)] lg:flex lg:flex-col">
          <div className="border-b border-[var(--surface-border)] p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--surface-border)] bg-[var(--electric-subtle)]">
                <Cpu className="h-5 w-5 text-[var(--electric-bright)]" />
              </div>
              <div>
                <p className="text-sm font-bold text-[var(--text-primary)]">Robokorda CMS</p>
                <p className="text-[10px] text-[var(--text-muted)]">Admin Panel</p>
              </div>
            </div>
          </div>
          <nav className="flex-1 space-y-1 p-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition hover:bg-[var(--electric-subtle)] hover:text-[var(--text-primary)] ${link.href === "/admin/gallery" ? "bg-[var(--electric-subtle)] text-[var(--text-primary)]" : "text-[var(--text-secondary)]"}`}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          {/* Mobile nav */}
          <div className="mb-6 flex flex-wrap gap-2 lg:hidden">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="flex items-center gap-2 rounded-xl border border-[var(--surface-border)] bg-[var(--surface-2)] px-3 py-2 text-xs font-medium text-[var(--text-secondary)]">
                <link.icon className="h-3.5 w-3.5" />
                {link.label}
              </Link>
            ))}
          </div>

          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <ImageIcon className="h-6 w-6 text-[var(--electric-bright)]" />
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">Gallery</h1>
              </div>
              <p className="mt-1 text-sm text-[var(--text-muted)]">{items.length} photo{items.length !== 1 ? "s" : ""} in database</p>
            </div>
            <div className="flex items-center gap-2">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[rgba(0,229,160,0.3)] px-4 py-2.5 text-sm font-semibold text-[var(--neon)] transition hover:border-[rgba(0,229,160,0.6)] hover:bg-[rgba(0,229,160,0.06)]">
                <Upload className="h-4 w-4" />
                {uploading ? "Uploading…" : "Upload Files"}
                <input type="file" multiple accept="image/*,video/*" className="sr-only" onChange={handleFileUpload} disabled={uploading} />
              </label>
              <button
                type="button"
                onClick={startNew}
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--electric)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_var(--electric-glow)] transition hover:opacity-90"
              >
                <Plus className="h-4 w-4" />
                Add by URL
              </button>
            </div>
          </div>

          {/* Section filter */}
          <div className="mb-5 flex flex-wrap gap-2">
            {["all", ...SECTIONS].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setFilterSection(s)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition ${filterSection === s ? "bg-[var(--electric)] text-white" : "border border-[var(--surface-border)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"}`}
              >
                {s === "all" ? "All sections" : s}
              </button>
            ))}
          </div>

          {/* Add/Edit form */}
          {showForm && (
            <div className="mb-6 rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-1)] p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-base font-bold text-[var(--text-primary)]">{editId ? "Edit Photo" : "Add New Photo"}</h2>
                <button type="button" onClick={() => { setShowForm(false); setEditId(null); }} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">Image URL</span>
                  <div className="flex gap-2">
                    <input
                      value={form.image_url}
                      onChange={(e) => setForm((s) => ({ ...s, image_url: e.target.value }))}
                      placeholder="https://… or /images/…"
                      className="field-input flex-1"
                    />
                    <label className="inline-flex shrink-0 cursor-pointer items-center justify-center rounded-xl border border-[var(--surface-border)] bg-[var(--surface-2)] px-4 py-2.5 text-sm font-semibold text-[var(--text-secondary)] hover:border-[var(--electric)] hover:text-[var(--electric-bright)] transition">
                      Upload
                      <input
                        type="file"
                        accept="image/*,video/*"
                        className="sr-only"
                        onChange={async (e) => {
                          const f = e.target.files?.[0];
                          if (!f) return;
                          const fd = new FormData();
                          fd.append("file", f);
                          try {
                            const r = await fetch("/api/upload", { method: "POST", body: fd });
                            const d = await r.json();
                            if (d.url) setForm((s) => ({ ...s, image_url: d.url }));
                          } catch {
                            alert("Upload failed");
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
                <label className="space-y-1.5">
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">Title</span>
                  <input
                    value={form.title}
                    onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
                    placeholder="Photo title"
                    className="field-input"
                  />
                </label>
                <label className="space-y-1.5">
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">Caption</span>
                  <input
                    value={form.caption}
                    onChange={(e) => setForm((s) => ({ ...s, caption: e.target.value }))}
                    placeholder="Optional caption"
                    className="field-input"
                  />
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <label className="space-y-1.5">
                    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">Section</span>
                    <select
                      value={form.section}
                      onChange={(e) => setForm((s) => ({ ...s, section: e.target.value }))}
                      className="field-select"
                    >
                      {SECTIONS.map((sec) => <option key={sec}>{sec}</option>)}
                    </select>
                  </label>
                  <label className="space-y-1.5">
                    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">Size</span>
                    <select
                      value={form.size}
                      onChange={(e) => setForm((s) => ({ ...s, size: e.target.value as "square" | "wide" | "tall" }))}
                      className="field-select"
                    >
                      {SIZES.map((sz) => <option key={sz}>{sz}</option>)}
                    </select>
                  </label>
                  <label className="space-y-1.5">
                    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">Order</span>
                    <input
                      type="number"
                      value={form.sort_order}
                      onChange={(e) => setForm((s) => ({ ...s, sort_order: Number(e.target.value) }))}
                      className="field-input"
                    />
                  </label>
                </div>
              </div>

              {/* Preview */}
              {form.image_url && (
                <div className="mt-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={form.image_url} alt="Preview" className="h-32 rounded-xl object-cover" onError={(e) => (e.currentTarget.style.display = "none")} />
                </div>
              )}

              <div className="mt-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={save}
                  disabled={saving || !form.image_url || !form.title}
                  className="btn-primary disabled:opacity-50"
                >
                  <Check className="h-4 w-4" />
                  {saving ? "Saving…" : editId ? "Update Photo" : "Add Photo"}
                </button>
                <label className="flex cursor-pointer items-center gap-2 text-sm text-[var(--text-muted)]">
                  <input
                    type="checkbox"
                    checked={form.is_published}
                    onChange={(e) => setForm((s) => ({ ...s, is_published: e.target.checked }))}
                    className="rounded"
                  />
                  Published
                </label>
              </div>
            </div>
          )}

          {/* Gallery grid */}
          {loading ? (
            <div className="py-20 text-center text-sm text-[var(--text-muted)]">Loading…</div>
          ) : displayed.length === 0 ? (
            <div className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-1)] py-16 text-center">
              <ImageIcon className="mx-auto mb-3 h-10 w-10 text-[var(--text-muted)]" />
              <p className="text-sm text-[var(--text-muted)]">No photos yet — click &ldquo;Add Photo&rdquo; to get started.</p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {displayed.map((item) => (
                <div
                  key={item.id}
                  className={`group relative overflow-hidden rounded-xl border transition ${item.is_published ? "border-[var(--surface-border)]" : "border-red-500/20 opacity-60"}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="h-40 w-full object-cover"
                    onError={(e) => { e.currentTarget.style.background = "var(--surface-2)"; e.currentTarget.style.height = "80px"; }}
                  />
                  <div className="bg-[var(--surface-1)] p-3">
                    <p className="truncate text-sm font-semibold text-[var(--text-primary)]">{item.title}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="rounded-full border border-[var(--surface-border)] px-2 py-0.5 text-[10px] text-[var(--text-muted)]">{item.section}</span>
                      <span className="rounded-full border border-[var(--surface-border)] px-2 py-0.5 text-[10px] text-[var(--text-muted)]">{item.size}</span>
                      {!item.is_published && <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] text-red-400">hidden</span>}
                    </div>
                  </div>
                  {/* Actions overlay */}
                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-[var(--space-800)]/80 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={() => startEdit(item)}
                      className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--electric-subtle)] text-[var(--electric-bright)] hover:bg-[var(--electric)] hover:text-white transition"
                      aria-label="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => togglePublish(item)}
                      className="flex h-9 w-9 items-center justify-center rounded-xl bg-[rgba(0,229,160,0.15)] text-[var(--neon)] hover:bg-[rgba(0,229,160,0.3)] transition"
                      aria-label={item.is_published ? "Unpublish" : "Publish"}
                    >
                      {item.is_published ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(item.id)}
                      className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/15 text-red-400 hover:bg-red-500/30 transition"
                      aria-label="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
