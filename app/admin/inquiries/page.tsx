"use client";

import { Suspense, useEffect, useState, useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Trophy, ShoppingBag, BookOpen, Cpu, MessageSquare, ArrowLeft, RefreshCw, Check, X, Clock, Search } from "lucide-react";
import type { RircRegistration, ComponentInquiry, CourseInquiry, PrimebookInquiry, ContactMessage } from "@/lib/db";

type Tab = "rirc" | "components" | "courses" | "primebook" | "contact";

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "rirc", label: "RIRC 2026", icon: Trophy },
  { id: "components", label: "Shop Inquiries", icon: ShoppingBag },
  { id: "courses", label: "Courses", icon: BookOpen },
  { id: "primebook", label: "Prime Book", icon: Cpu },
  { id: "contact", label: "Contact", icon: MessageSquare },
];

function StatusBadge({ status }: { status: string }) {
  const cls = status === "pending" ? "status-pending" : status === "new" ? "status-new" : status === "approved" || status === "done" ? "status-done" : "status-rejected";
  return <span className={`status-badge ${cls}`}>{status}</span>;
}

export default function InquiriesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--space-800)] flex items-center justify-center text-[var(--text-muted)] text-sm">Loading…</div>}>
      <InquiriesContent />
    </Suspense>
  );
}

function InquiriesContent() {
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<Tab>((searchParams.get("tab") as Tab) ?? "rirc");
  const [data, setData] = useState<Record<string, unknown[]>>({});
  const [loading, setLoading] = useState(true);
  const [rircCountryFilter, setRircCountryFilter] = useState("");
  const [rircCategoryFilter, setRircCategoryFilter] = useState("");
  const [rircSchoolSearch, setRircSchoolSearch] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/inquiries?type=all");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function updateStatus(id: string, type: string, status: string) {
    await fetch("/api/admin/inquiries", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, type, status }),
    });
    load();
  }

  async function updateFlag(id: string, type: string, flagName: string, currentValue: boolean) {
    await fetch("/api/admin/inquiries", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, type, flags: { [flagName]: !currentValue } }),
    });
    load();
  }

  function ToggleBtn({ active, onClick, label, colorCls }: { active: boolean, onClick: () => void, label: string, colorCls?: string }) {
    const isGreen = colorCls === "green";
    return (
      <button
        onClick={onClick}
        className={`flex h-6 items-center justify-center rounded px-2 text-[10px] font-bold uppercase tracking-wider transition ${
          active 
            ? (isGreen ? "bg-[rgba(0,229,160,0.15)] text-[#00e5a0] border border-[rgba(0,229,160,0.3)]" : "bg-[var(--electric-subtle)] text-[var(--electric-bright)] border border-[var(--surface-border)]")
            : "bg-[rgba(255,255,255,0.03)] text-[var(--text-muted)] border border-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.06)]"
        }`}
        title={`Toggle ${label}`}
      >
        {label}
      </button>
    );
  }

  const rirc = (data.rirc ?? []) as RircRegistration[];
  const components = (data.components ?? []) as ComponentInquiry[];
  const courses = (data.courses ?? []) as CourseInquiry[];
  const primebook = (data.primebook ?? []) as PrimebookInquiry[];
  const contact = (data.contact ?? []) as ContactMessage[];

  const rircCountries = useMemo(() => Array.from(new Set(rirc.map(r => r.country).filter(Boolean))).sort(), [rirc]);
  const rircCategories = useMemo(() => Array.from(new Set(rirc.map(r => r.category || r.track).filter(Boolean))).sort(), [rirc]);
  const rircFiltered = useMemo(() => rirc.filter(r => {
    if (rircCountryFilter && r.country !== rircCountryFilter) return false;
    if (rircCategoryFilter && (r.category || r.track) !== rircCategoryFilter) return false;
    if (rircSchoolSearch && !r.school_name.toLowerCase().includes(rircSchoolSearch.toLowerCase())) return false;
    return true;
  }), [rirc, rircCountryFilter, rircCategoryFilter, rircSchoolSearch]);

  const rircByCountry = useMemo(() => {
    const map: Record<string, number> = {};
    rirc.forEach(r => { map[r.country] = (map[r.country] || 0) + 1; });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [rirc]);

  const rircByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    rirc.forEach(r => { const k = r.category || r.track || "Unknown"; map[k] = (map[k] || 0) + 1; });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [rirc]);

  return (
    <div className="min-h-screen bg-[var(--space-800)] p-4 sm:p-6 lg:p-8">
      <div className="pointer-events-none fixed inset-0 opacity-[0.025]" style={{ backgroundImage: `linear-gradient(rgba(52,47,197,1) 1px, transparent 1px), linear-gradient(90deg, rgba(52,47,197,1) 1px, transparent 1px)`, backgroundSize: "60px 60px" }} />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition">
              <ArrowLeft className="h-4 w-4" /> Dashboard
            </Link>
            <span className="text-[var(--space-400)]">/</span>
            <h1 className="text-lg font-bold text-[var(--text-primary)]">Inquiries &amp; Registrations</h1>
          </div>
          <button onClick={load} className="flex items-center gap-2 rounded-lg border border-[var(--surface-border)] bg-[var(--surface-2)] px-3 py-2 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition" style={{ minHeight: "unset" }}>
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          {TABS.map((t) => {
            const count = (data[t.id] ?? []).length;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition ${tab === t.id ? "border-[var(--electric)] bg-[var(--electric-subtle)] text-[var(--text-primary)]" : "border-[var(--surface-border)] bg-[var(--surface-2)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}
                style={{ minHeight: "unset" }}
              >
                <t.icon className="h-3.5 w-3.5" />
                {t.label}
                {count > 0 && <span className="rounded-full bg-[var(--electric-subtle)] px-1.5 py-0.5 text-[10px]">{count}</span>}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="overflow-hidden rounded-xl border border-[var(--surface-border)] bg-[var(--surface-1)]">
          {loading ? (
            <div className="flex items-center justify-center py-20 text-[var(--text-muted)]">
              <RefreshCw className="h-5 w-5 animate-spin mr-2" /> Loading…
            </div>
          ) : (
            <>
              {/* RIRC */}
              {tab === "rirc" && (
                <div>
                  {/* Stats row */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 border-b border-[var(--surface-border)]">
                    <div className="rounded-xl border border-[var(--surface-border)] bg-[var(--surface-2)] p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Total</p>
                      <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{rirc.length}</p>
                    </div>
                    <div className="rounded-xl border border-[var(--surface-border)] bg-[var(--surface-2)] p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Paid</p>
                      <p className="text-2xl font-bold text-[#00e5a0] mt-1">{rirc.filter(r => r.paid).length}</p>
                    </div>
                    <div className="rounded-xl border border-[var(--surface-border)] bg-[var(--surface-2)] p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Pending</p>
                      <p className="text-2xl font-bold text-[#fcd34d] mt-1">{rirc.filter(r => r.status === "pending").length}</p>
                    </div>
                    <div className="rounded-xl border border-[var(--surface-border)] bg-[var(--surface-2)] p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Countries</p>
                      <p className="text-2xl font-bold text-[var(--electric-bright)] mt-1">{rircCountries.length}</p>
                    </div>
                  </div>

                  {/* By country + by category breakdown */}
                  {rirc.length > 0 && (
                    <div className="grid sm:grid-cols-2 gap-4 p-4 border-b border-[var(--surface-border)]">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">By Country</p>
                        <div className="flex flex-wrap gap-2">
                          {rircByCountry.map(([country, count]) => (
                            <button key={country} onClick={() => setRircCountryFilter(c => c === country ? "" : country)} className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition ${rircCountryFilter === country ? "bg-[var(--electric)] text-white" : "border border-[var(--surface-border)] bg-[var(--surface-2)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}>
                              {country} <span className="opacity-70">({count})</span>
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">By Category</p>
                        <div className="flex flex-wrap gap-2">
                          {rircByCategory.map(([cat, count]) => (
                            <button key={cat} onClick={() => setRircCategoryFilter(c => c === cat ? "" : cat)} className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition ${rircCategoryFilter === cat ? "bg-[var(--electric)] text-white" : "border border-[var(--surface-border)] bg-[var(--surface-2)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}>
                              {cat} <span className="opacity-70">({count})</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Filters bar */}
                  <div className="flex flex-wrap gap-3 p-4 border-b border-[var(--surface-border)]">
                    <div className="relative flex-1 min-w-[160px]">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--text-muted)]" />
                      <input value={rircSchoolSearch} onChange={e => setRircSchoolSearch(e.target.value)} placeholder="Search school…" className="w-full rounded-xl border border-[var(--surface-border)] bg-[var(--surface-2)] pl-9 pr-4 py-2 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none focus:border-[var(--electric)]" />
                    </div>
                    <select value={rircCountryFilter} onChange={e => setRircCountryFilter(e.target.value)} className="rounded-xl border border-[var(--surface-border)] bg-[var(--surface-2)] px-3 py-2 text-xs text-[var(--text-secondary)] outline-none focus:border-[var(--electric)]">
                      <option value="">All Countries</option>
                      {rircCountries.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <select value={rircCategoryFilter} onChange={e => setRircCategoryFilter(e.target.value)} className="rounded-xl border border-[var(--surface-border)] bg-[var(--surface-2)] px-3 py-2 text-xs text-[var(--text-secondary)] outline-none focus:border-[var(--electric)]">
                      <option value="">All Categories</option>
                      {rircCategories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    {(rircCountryFilter || rircCategoryFilter || rircSchoolSearch) && (
                      <button onClick={() => { setRircCountryFilter(""); setRircCategoryFilter(""); setRircSchoolSearch(""); }} className="flex items-center gap-1.5 rounded-xl border border-[var(--surface-border)] bg-[var(--surface-2)] px-3 py-2 text-xs text-red-400 hover:bg-[rgba(248,113,113,0.08)] transition">
                        <X className="h-3 w-3" /> Clear filters
                      </button>
                    )}
                  </div>

                  {/* Table */}
                  <div className="overflow-x-auto">
                    {rircFiltered.length === 0 ? <EmptyState label={rirc.length === 0 ? "No RIRC registrations yet" : "No registrations match your filters"} /> : (
                      <table className="admin-table">
                        <thead>
                          <tr><th>Team</th><th>School</th><th>Contact</th><th>Email</th><th>WhatsApp</th><th>Country</th><th>City</th><th>Category</th><th>Members</th><th>Status</th><th>Tracking</th><th>Date</th><th>Actions</th></tr>
                        </thead>
                        <tbody>
                          {rircFiltered.map((r) => {
                            let members: string[] = [];
                            try { members = JSON.parse(r.team_members || "[]"); } catch { /* ignore */ }
                            return (
                              <tr key={r.id}>
                                <td className="font-medium text-white">{r.team_name}</td>
                                <td>{r.school_name}</td>
                                <td>{r.contact_name}</td>
                                <td className="text-[var(--electric-bright)]">{r.email}</td>
                                <td>{r.whatsapp || r.phone}</td>
                                <td>{r.country}</td>
                                <td>{r.city}</td>
                                <td>{r.category || r.track}</td>
                                <td className="max-w-[140px]">
                                  <div className="space-y-0.5">
                                    {members.slice(0, 3).map((m, i) => <div key={i} className="text-[11px]">{m}</div>)}
                                    {members.length > 3 && <div className="text-[11px] text-[var(--text-muted)]">+{members.length - 3} more</div>}
                                  </div>
                                </td>
                                <td><StatusBadge status={r.status} /></td>
                                <td>
                                  <div className="flex gap-1.5 flex-wrap">
                                    <ToggleBtn active={!!r.confirmation_sent} onClick={() => updateFlag(r.id, "rirc", "confirmation_sent", !!r.confirmation_sent)} label="Conf" />
                                    <ToggleBtn active={!!r.invoice_sent} onClick={() => updateFlag(r.id, "rirc", "invoice_sent", !!r.invoice_sent)} label="Inv" />
                                    <ToggleBtn active={!!r.paid} onClick={() => updateFlag(r.id, "rirc", "paid", !!r.paid)} label="Paid" colorCls="green" />
                                  </div>
                                </td>
                                <td className="text-[11px]">{new Date(r.created_at).toLocaleDateString()}</td>
                                <td>
                                  <div className="flex gap-1">
                                    <button onClick={() => updateStatus(r.id, "rirc", "approved")} className="flex h-7 w-7 items-center justify-center rounded-lg bg-[rgba(0,229,160,0.1)] text-[#00e5a0] hover:bg-[rgba(0,229,160,0.2)] transition" style={{ minHeight: "unset", minWidth: "unset" }} title="Approve"><Check className="h-3.5 w-3.5" /></button>
                                    <button onClick={() => updateStatus(r.id, "rirc", "rejected")} className="flex h-7 w-7 items-center justify-center rounded-lg bg-[rgba(248,113,113,0.1)] text-red-400 hover:bg-[rgba(248,113,113,0.2)] transition" style={{ minHeight: "unset", minWidth: "unset" }} title="Reject"><X className="h-3.5 w-3.5" /></button>
                                    <button onClick={() => updateStatus(r.id, "rirc", "pending")} className="flex h-7 w-7 items-center justify-center rounded-lg bg-[rgba(245,158,11,0.1)] text-[#fcd34d] hover:bg-[rgba(245,158,11,0.2)] transition" style={{ minHeight: "unset", minWidth: "unset" }} title="Pending"><Clock className="h-3.5 w-3.5" /></button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              )}

              {/* Components */}
              {tab === "components" && (
                <div className="overflow-x-auto">
                  {components.length === 0 ? <EmptyState label="No shop inquiries yet" /> : (
                    <table className="admin-table">
                      <thead><tr><th>Name</th><th>Phone</th><th>Email</th><th>Items</th><th>Total USD</th><th>Tracking</th><th>Status</th><th>Actions</th></tr></thead>
                      <tbody>
                        {components.map((c) => {
                          let items: { component_name: string; qty: number }[] = [];
                          try { items = JSON.parse(c.items); } catch { /* ignore */ }
                          return (
                            <tr key={c.id}>
                              <td className="font-medium text-white">{c.name}</td>
                              <td>{c.phone}</td>
                              <td className="text-[var(--electric-bright)]">{c.email}</td>
                              <td className="max-w-[200px]">
                                <div className="space-y-0.5">
                                  {items.map((item, i) => (
                                    <div key={i} className="text-[11px]">{item.component_name} ×{item.qty}</div>
                                  ))}
                                </div>
                              </td>
                              <td className="font-bold text-[#00e5a0]">${c.total_usd.toFixed(2)}</td>
                              <td className="min-w-[170px]">
                                <div className="flex gap-1.5 flex-wrap">
                                  <ToggleBtn active={!!c.confirmation_sent} onClick={() => updateFlag(c.id, "components", "confirmation_sent", !!c.confirmation_sent)} label="Conf" />
                                  <ToggleBtn active={!!c.invoice_sent} onClick={() => updateFlag(c.id, "components", "invoice_sent", !!c.invoice_sent)} label="Inv" />
                                  <ToggleBtn active={!!c.paid} onClick={() => updateFlag(c.id, "components", "paid", !!c.paid)} label="Paid" colorCls="green" />
                                  <ToggleBtn active={!!c.delivered} onClick={() => updateFlag(c.id, "components", "delivered", !!c.delivered)} label="Deliv" colorCls="green" />
                                </div>
                              </td>
                              <td><StatusBadge status={c.status} /></td>
                              <td>
                                <div className="flex gap-1">
                                  <button onClick={() => updateStatus(c.id, "components", "done")} className="flex h-7 w-7 items-center justify-center rounded-lg bg-[rgba(0,229,160,0.1)] text-[#00e5a0] hover:bg-[rgba(0,229,160,0.2)] transition" title="Done"><Check className="h-3.5 w-3.5" /></button>
                                  <button onClick={() => updateStatus(c.id, "components", "rejected")} className="flex h-7 w-7 items-center justify-center rounded-lg bg-[rgba(248,113,113,0.1)] text-red-400 hover:bg-[rgba(248,113,113,0.2)] transition" title="Archive"><X className="h-3.5 w-3.5" /></button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              {/* Courses */}
              {tab === "courses" && (
                <div className="overflow-x-auto">
                  {courses.length === 0 ? <EmptyState label="No course inquiries yet" /> : (
                    <table className="admin-table">
                      <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Course</th><th>School</th><th>Message</th><th>Status</th><th>Date</th></tr></thead>
                      <tbody>
                        {courses.map((c) => (
                          <tr key={c.id}>
                            <td className="font-medium text-white">{c.name}</td>
                            <td className="text-[var(--electric-bright)]">{c.email}</td>
                            <td>{c.phone}</td>
                            <td className="font-medium">{c.course_title}</td>
                            <td>{c.school}</td>
                            <td className="max-w-[160px] text-[11px]">{c.message}</td>
                            <td><StatusBadge status={c.status} /></td>
                            <td className="text-[11px]">{new Date(c.created_at).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              {/* Primebook */}
              {tab === "primebook" && (
                <div className="overflow-x-auto">
                  {primebook.length === 0 ? <EmptyState label="No Prime Book inquiries yet" /> : (
                    <table className="admin-table">
                      <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Model</th><th>Qty</th><th>School</th><th>Message</th><th>Tracking</th><th>Status</th><th>Date</th></tr></thead>
                      <tbody>
                        {primebook.map((p) => (
                          <tr key={p.id}>
                            <td className="font-medium text-white">{p.name}</td>
                            <td className="text-[var(--electric-bright)]">{p.email}</td>
                            <td>{p.phone}</td>
                            <td>{(p as unknown as Record<string, unknown>).model as string ?? "—"}</td>
                            <td className="font-bold text-[#c084fc]">{p.quantity}</td>
                            <td>{p.school}</td>
                            <td className="max-w-[160px] text-[11px]">{p.message}</td>
                            <td className="min-w-[170px]">
                              <div className="flex gap-1.5 flex-wrap">
                                <ToggleBtn active={!!p.confirmation_sent} onClick={() => updateFlag(p.id, "primebook", "confirmation_sent", !!p.confirmation_sent)} label="Conf" />
                                <ToggleBtn active={!!p.invoice_sent} onClick={() => updateFlag(p.id, "primebook", "invoice_sent", !!p.invoice_sent)} label="Inv" />
                                <ToggleBtn active={!!p.paid} onClick={() => updateFlag(p.id, "primebook", "paid", !!p.paid)} label="Paid" colorCls="green" />
                                <ToggleBtn active={!!p.delivered} onClick={() => updateFlag(p.id, "primebook", "delivered", !!p.delivered)} label="Deliv" colorCls="green" />
                              </div>
                            </td>
                            <td><StatusBadge status={p.status} /></td>
                            <td className="text-[11px]">{new Date(p.created_at).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              {/* Contact */}
              {tab === "contact" && (
                <div className="overflow-x-auto">
                  {contact.length === 0 ? <EmptyState label="No contact messages yet" /> : (
                    <table className="admin-table">
                      <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Subject</th><th>Message</th><th>Status</th><th>Date</th></tr></thead>
                      <tbody>
                        {contact.map((m) => (
                          <tr key={m.id}>
                            <td className="font-medium text-white">{m.name}</td>
                            <td className="text-[var(--electric-bright)]">{m.email}</td>
                            <td>{m.phone}</td>
                            <td>{m.subject}</td>
                            <td className="max-w-[200px] text-[11px]">{m.message}</td>
                            <td><StatusBadge status={m.status} /></td>
                            <td className="text-[11px]">{new Date(m.created_at).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return <div className="py-14 text-center text-sm text-[var(--text-muted)]">{label}</div>;
}
