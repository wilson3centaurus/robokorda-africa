"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Package, LayoutDashboard, Settings, MessageSquare, TrendingUp, Cpu, Pencil, X, Check, ImageIcon, FileText
} from "lucide-react";

const navLinks = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Inquiries", href: "/admin/inquiries", icon: MessageSquare },
  { label: "Settings", href: "/admin/settings", icon: Settings },
  { label: "Gallery", href: "/admin/gallery", icon: ImageIcon },
  { label: "Catalogue", href: "/admin/catalogue", icon: Package },
  { label: "Pages", href: "/admin/pages", icon: FileText },
  { label: "View Site", href: "/", icon: TrendingUp, external: true },
];

export default function CatalogueAdminPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"components" | "courses">("components");
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editItem, setEditItem] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch(`/api/admin/${tab}`);
    if (res.status === 401) { router.push("/admin/login"); return; }
    setItems(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); setEditItem(null); }, [tab]); // eslint-disable-line

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch(`/api/admin/${tab}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editItem),
    });
    setSaving(false);
    setEditItem(null);
    load();
  }

  return (
    <div className="min-h-screen bg-[var(--space-900)]">
      <div className="pointer-events-none fixed inset-0 opacity-[0.03]" style={{ backgroundImage: `linear-gradient(rgba(52,47,197,1) 1px, transparent 1px), linear-gradient(90deg, rgba(52,47,197,1) 1px, transparent 1px)`, backgroundSize: "60px 60px" }} />

      <div className="relative flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-60 shrink-0 border-r border-[var(--surface-border-subtle)] bg-[var(--surface-1)] lg:flex lg:flex-col">
          <div className="border-b border-[var(--surface-border-subtle)] p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--surface-border)] bg-[var(--electric-subtle)]">
                <Cpu className="h-5 w-5 text-[var(--electric-bright)]" />
              </div>
              <div>
                <p className="text-sm font-bold text-[var(--text-primary)]">Robokorda CMS</p>
                <p className="text-[10px] text-[var(--text-secondary)]">Admin Panel</p>
              </div>
            </div>
          </div>
          <nav className="flex-1 space-y-1 p-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition hover:bg-[var(--electric-subtle)] hover:text-[var(--text-primary)] ${link.href === "/admin/catalogue" ? "bg-[var(--surface-border)] text-[var(--text-primary)]" : "text-[var(--text-secondary)]"}`}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <div className="mb-6 flex flex-wrap gap-2 lg:hidden">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="flex items-center gap-2 rounded-xl border border-[var(--surface-border-subtle)] bg-[var(--electric-subtle)] px-3 py-2 text-xs font-medium text-[var(--text-secondary)]">
                <link.icon className="h-3.5 w-3.5" />
                {link.label}
              </Link>
            ))}
          </div>

          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <Package className="h-6 w-6 text-[var(--electric-bright)]" />
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">Catalogue</h1>
              </div>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">Manage prices, images, and configuration.</p>
            </div>
          </div>

          <div className="mb-5 flex flex-wrap gap-2">
            <button
              onClick={() => setTab("components")}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${tab === "components" ? "bg-[var(--electric)] text-white" : "border border-[var(--surface-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}
            >
              Shop Components
            </button>
            <button
              onClick={() => setTab("courses")}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${tab === "courses" ? "bg-[var(--electric)] text-white" : "border border-[var(--surface-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}
            >
              Courses
            </button>
          </div>

          {editItem && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(2,8,16,0.85)] p-4 backdrop-blur-sm">
              <form onSubmit={save} className="w-full max-w-lg rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-1)] p-6 shadow-2xl">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-[var(--text-primary)]">Edit {editItem.name || editItem.title}</h2>
                  <button type="button" onClick={() => setEditItem(null)} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition"><X className="h-5 w-5" /></button>
                </div>

                <div className="space-y-4">
                  {tab === "components" && (
                    <>
                      <label className="block space-y-1">
                        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-secondary)]">Price USD</span>
                        <input type="number" step="0.01" value={editItem.priceUSD} onChange={(e) => setEditItem({ ...editItem, priceUSD: Number(e.target.value) })} className="w-full rounded-xl border border-[var(--surface-border)] bg-[var(--surface-2)] px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none" />
                      </label>
                      <label className="block space-y-1">
                        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-secondary)]">Price ZWG</span>
                        <input type="number" value={editItem.priceZWG || ""} onChange={(e) => setEditItem({ ...editItem, priceZWG: Number(e.target.value) })} className="w-full rounded-xl border border-[var(--surface-border)] bg-[var(--surface-2)] px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none" />
                      </label>
                      <label className="block space-y-1">
                        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-secondary)]">Status</span>
                        <select value={editItem.status} onChange={(e) => setEditItem({ ...editItem, status: e.target.value })} className="w-full rounded-xl border border-[var(--surface-border)] bg-[var(--surface-2)] px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none">
                          <option value="in_stock">In Stock</option>
                          <option value="out_of_stock">Out of Stock</option>
                          <option value="coming_soon">Coming Soon</option>
                          <option value="limited">Limited</option>
                          <option value="unlisted">Unlisted (hidden from shop)</option>
                        </select>
                      </label>
                    </>
                  )}

                  <div className="block space-y-1">
                    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-secondary)]">Image URL</span>
                    <div className="flex gap-2">
                      <input value={editItem.imageSrc} onChange={(e) => setEditItem({ ...editItem, imageSrc: e.target.value })} className="w-full flex-1 rounded-xl border border-[var(--surface-border)] bg-[var(--surface-2)] px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none" />
                      <label className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-[var(--electric-subtle)] px-4 py-2 text-sm font-semibold text-[var(--electric-bright)] hover:bg-[var(--surface-border)] transition border border-[var(--surface-border)]">
                        Upload
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="sr-only"
                          onChange={async (e) => {
                            const f = e.target.files?.[0];
                            if (!f) return;
                            const fd = new FormData();
                            fd.append("file", f);
                            try {
                              const r = await fetch("/api/upload", { method: "POST", body: fd });
                              const d = await r.json();
                              if (d.url) setEditItem({ ...editItem, imageSrc: d.url });
                            } catch (err) {
                              alert("Upload failed");
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end gap-3">
                  <button type="button" onClick={() => setEditItem(null)} className="rounded-xl px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--surface-border-subtle)] transition">Cancel</button>
                  <button type="submit" disabled={saving} className="btn-primary inline-flex items-center gap-2 disabled:opacity-50">
                    <Check className="h-4 w-4" /> Save
                  </button>
                </div>
              </form>
            </div>
          )}

          {loading ? (
             <div className="py-20 text-center text-sm text-[var(--text-secondary)]">Loading…</div>
          ) : (
            <div className="rounded-2xl border border-[var(--surface-border-subtle)] bg-[var(--surface-1)/40]">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-[var(--text-secondary)]">
                  <thead className="border-b border-[var(--surface-border-subtle)] bg-[var(--electric-subtle)] text-xs uppercase text-[var(--text-secondary)]">
                    <tr>
                      <th className="p-4 font-semibold">Item</th>
                      {tab === "components" && <th className="p-4 font-semibold">Price</th>}
                      {tab === "components" && <th className="p-4 font-semibold">Status</th>}
                      <th className="p-4 font-semibold w-12 text-center">Edit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--surface-border-subtle)]">
                    {items.map((item) => (
                      <tr key={item.id || item.seed} className="transition hover:bg-[var(--electric-subtle)]">
                        <td className="p-4 font-medium text-[var(--text-primary)] flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={item.imageSrc} alt="" className="h-10 w-10 shrink-0 rounded bg-[var(--electric-subtle)] object-cover" />
                          <span className="truncate max-w-[200px] sm:max-w-xs">{item.name || item.title}</span>
                        </td>
                        {tab === "components" && (
                          <td className="p-4">${item.priceUSD?.toFixed(2)}</td>
                        )}
                        {tab === "components" && (
                          <td className="p-4">
                            <span className="rounded-full border border-[var(--surface-border)] bg-[var(--electric-subtle)] px-2 py-0.5 text-[10px] uppercase text-[var(--electric-bright)]">{item.status}</span>
                          </td>
                        )}
                        <td className="p-4 text-center">
                          <button onClick={() => setEditItem(item)} className="rounded-lg p-2 text-[var(--text-secondary)] hover:bg-[var(--electric-subtle)] hover:text-[var(--text-primary)] transition">
                            <Pencil className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
