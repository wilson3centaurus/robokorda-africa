"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Image as ImageIcon, Plus, Trash2, Pencil, X, Check,
  LayoutDashboard, Settings, MessageSquare, TrendingUp, Cpu, Upload,
} from "lucide-react";
import type { GalleryRow } from "@/lib/db";

const navLinks = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Inquiries", href: "/admin/inquiries", icon: MessageSquare },
  { label: "Settings", href: "/admin/settings", icon: Settings },
  { label: "Gallery", href: "/admin/gallery", icon: ImageIcon },
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
    <div className="min-h-screen bg-[#020810]">
      <div className="pointer-events-none fixed inset-0 opacity-[0.02]" style={{ backgroundImage: `linear-gradient(rgba(0,102,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,102,255,1) 1px, transparent 1px)`, backgroundSize: "60px 60px" }} />

      <div className="relative flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-60 shrink-0 border-r border-[rgba(0,102,255,0.15)] bg-[rgba(4,13,30,0.95)] lg:flex lg:flex-col">
          <div className="border-b border-[rgba(0,102,255,0.15)] p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[rgba(0,102,255,0.4)] bg-[rgba(0,102,255,0.1)]">
                <Cpu className="h-5 w-5 text-[#7eb8ff]" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Robokorda CMS</p>
                <p className="text-[10px] text-[#4d7499]">Admin Panel</p>
              </div>
            </div>
          </div>
          <nav className="flex-1 space-y-1 p-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition hover:bg-[rgba(0,102,255,0.1)] hover:text-white ${link.href === "/admin/gallery" ? "bg-[rgba(0,102,255,0.15)] text-white" : "text-[#8db5d8]"}`}
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
              <Link key={link.href} href={link.href} className="flex items-center gap-2 rounded-xl border border-[rgba(0,102,255,0.2)] bg-[rgba(0,102,255,0.06)] px-3 py-2 text-xs font-medium text-[#8db5d8]">
                <link.icon className="h-3.5 w-3.5" />
                {link.label}
              </Link>
            ))}
          </div>

          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <ImageIcon className="h-6 w-6 text-[#7eb8ff]" />
                <h1 className="text-2xl font-bold text-white">Gallery</h1>
              </div>
              <p className="mt-1 text-sm text-[#4d7499]">{items.length} photo{items.length !== 1 ? "s" : ""} in database</p>
            </div>
            <div className="flex items-center gap-2">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[rgba(0,229,160,0.3)] px-4 py-2.5 text-sm font-semibold text-[#00e5a0] transition hover:border-[rgba(0,229,160,0.6)] hover:bg-[rgba(0,229,160,0.06)]">
                <Upload className="h-4 w-4" />
                {uploading ? "Uploading…" : "Upload Files"}
                <input type="file" multiple accept="image/*,video/*" className="sr-only" onChange={handleFileUpload} disabled={uploading} />
              </label>
              <button
                type="button"
                onClick={startNew}
                className="inline-flex items-center gap-2 rounded-xl bg-[#0066ff] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(0,102,255,0.35)] transition hover:bg-[#0052cc]"
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
                className={`rounded-full px-3 py-1 text-xs font-semibold transition ${filterSection === s ? "bg-[#0066ff] text-white" : "border border-[rgba(0,102,255,0.2)] text-[#4d7499] hover:text-white"}`}
              >
                {s === "all" ? "All sections" : s}
              </button>
            ))}
          </div>

          {/* Add/Edit form */}
          {showForm && (
            <div className="mb-6 rounded-2xl border border-[rgba(0,102,255,0.3)] bg-[rgba(4,13,30,0.95)] p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-base font-bold text-white">{editId ? "Edit Photo" : "Add New Photo"}</h2>
                <button type="button" onClick={() => { setShowForm(false); setEditId(null); }} className="text-[#4d7499] hover:text-white transition">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-1.5">
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#4d7499]">Image URL</span>
                  <input
                    value={form.image_url}
                    onChange={(e) => setForm((s) => ({ ...s, image_url: e.target.value }))}
                    placeholder="https://… or /images/…"
                    className="w-full rounded-xl border border-[rgba(0,102,255,0.2)] bg-[rgba(4,13,30,0.9)] px-4 py-2.5 text-sm text-white placeholder-[#2a4d80] outline-none transition focus:border-[#0066ff]"
                  />
                </label>
                <label className="space-y-1.5">
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#4d7499]">Title</span>
                  <input
                    value={form.title}
                    onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
                    placeholder="Photo title"
                    className="w-full rounded-xl border border-[rgba(0,102,255,0.2)] bg-[rgba(4,13,30,0.9)] px-4 py-2.5 text-sm text-white placeholder-[#2a4d80] outline-none transition focus:border-[#0066ff]"
                  />
                </label>
                <label className="space-y-1.5">
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#4d7499]">Caption</span>
                  <input
                    value={form.caption}
                    onChange={(e) => setForm((s) => ({ ...s, caption: e.target.value }))}
                    placeholder="Optional caption"
                    className="w-full rounded-xl border border-[rgba(0,102,255,0.2)] bg-[rgba(4,13,30,0.9)] px-4 py-2.5 text-sm text-white placeholder-[#2a4d80] outline-none transition focus:border-[#0066ff]"
                  />
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <label className="space-y-1.5">
                    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#4d7499]">Section</span>
                    <select
                      value={form.section}
                      onChange={(e) => setForm((s) => ({ ...s, section: e.target.value }))}
                      className="w-full rounded-xl border border-[rgba(0,102,255,0.2)] bg-[rgba(4,13,30,0.9)] px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#0066ff]"
                    >
                      {SECTIONS.map((sec) => <option key={sec}>{sec}</option>)}
                    </select>
                  </label>
                  <label className="space-y-1.5">
                    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#4d7499]">Size</span>
                    <select
                      value={form.size}
                      onChange={(e) => setForm((s) => ({ ...s, size: e.target.value as "square" | "wide" | "tall" }))}
                      className="w-full rounded-xl border border-[rgba(0,102,255,0.2)] bg-[rgba(4,13,30,0.9)] px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#0066ff]"
                    >
                      {SIZES.map((sz) => <option key={sz}>{sz}</option>)}
                    </select>
                  </label>
                  <label className="space-y-1.5">
                    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#4d7499]">Order</span>
                    <input
                      type="number"
                      value={form.sort_order}
                      onChange={(e) => setForm((s) => ({ ...s, sort_order: Number(e.target.value) }))}
                      className="w-full rounded-xl border border-[rgba(0,102,255,0.2)] bg-[rgba(4,13,30,0.9)] px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#0066ff]"
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
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0066ff] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(0,102,255,0.3)] transition hover:bg-[#0052cc] disabled:opacity-50"
                >
                  <Check className="h-4 w-4" />
                  {saving ? "Saving…" : editId ? "Update Photo" : "Add Photo"}
                </button>
                <label className="flex cursor-pointer items-center gap-2 text-sm text-[#4d7499]">
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
            <div className="py-20 text-center text-sm text-[#4d7499]">Loading…</div>
          ) : displayed.length === 0 ? (
            <div className="rounded-2xl border border-[rgba(0,102,255,0.12)] bg-[rgba(4,13,30,0.6)] py-16 text-center">
              <ImageIcon className="mx-auto mb-3 h-10 w-10 text-[#2a4d80]" />
              <p className="text-sm text-[#4d7499]">No photos yet — click &ldquo;Add Photo&rdquo; to get started.</p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {displayed.map((item) => (
                <div
                  key={item.id}
                  className={`group relative overflow-hidden rounded-xl border transition ${item.is_published ? "border-[rgba(0,102,255,0.2)]" : "border-[rgba(255,100,100,0.2)] opacity-60"}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="h-40 w-full object-cover"
                    onError={(e) => { e.currentTarget.style.background = "#071428"; e.currentTarget.style.height = "80px"; }}
                  />
                  <div className="bg-[rgba(4,13,30,0.95)] p-3">
                    <p className="truncate text-sm font-semibold text-white">{item.title}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="rounded-full border border-[rgba(0,102,255,0.2)] px-2 py-0.5 text-[10px] text-[#4d7499]">{item.section}</span>
                      <span className="rounded-full border border-[rgba(0,102,255,0.2)] px-2 py-0.5 text-[10px] text-[#4d7499]">{item.size}</span>
                      {!item.is_published && <span className="rounded-full bg-[rgba(255,100,100,0.15)] px-2 py-0.5 text-[10px] text-red-400">hidden</span>}
                    </div>
                  </div>
                  {/* Actions overlay */}
                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-[rgba(4,13,30,0.85)] opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={() => startEdit(item)}
                      className="flex h-9 w-9 items-center justify-center rounded-xl bg-[rgba(0,102,255,0.3)] text-white hover:bg-[rgba(0,102,255,0.6)] transition"
                      aria-label="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => togglePublish(item)}
                      className="flex h-9 w-9 items-center justify-center rounded-xl bg-[rgba(0,229,160,0.15)] text-[#00e5a0] hover:bg-[rgba(0,229,160,0.3)] transition"
                      aria-label={item.is_published ? "Unpublish" : "Publish"}
                    >
                      {item.is_published ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(item.id)}
                      className="flex h-9 w-9 items-center justify-center rounded-xl bg-[rgba(248,113,113,0.15)] text-red-400 hover:bg-[rgba(248,113,113,0.3)] transition"
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
