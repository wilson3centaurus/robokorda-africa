"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Trophy, ShoppingBag, BookOpen, Cpu, MessageSquare, ArrowLeft, RefreshCw, Check, X, Clock } from "lucide-react";
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
    <Suspense fallback={<div className="min-h-screen bg-[#020810] flex items-center justify-center text-[#4d7499] text-sm">Loading…</div>}>
      <InquiriesContent />
    </Suspense>
  );
}

function InquiriesContent() {
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<Tab>((searchParams.get("tab") as Tab) ?? "rirc");
  const [data, setData] = useState<Record<string, unknown[]>>({});
  const [loading, setLoading] = useState(true);

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

  const rirc = (data.rirc ?? []) as RircRegistration[];
  const components = (data.components ?? []) as ComponentInquiry[];
  const courses = (data.courses ?? []) as CourseInquiry[];
  const primebook = (data.primebook ?? []) as PrimebookInquiry[];
  const contact = (data.contact ?? []) as ContactMessage[];

  return (
    <div className="min-h-screen bg-[#020810] p-4 sm:p-6 lg:p-8">
      <div className="pointer-events-none fixed inset-0 opacity-[0.02]" style={{ backgroundImage: `linear-gradient(rgba(0,102,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,102,255,1) 1px, transparent 1px)`, backgroundSize: "60px 60px" }} />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="flex items-center gap-1.5 text-sm text-[#4d7499] hover:text-white transition">
              <ArrowLeft className="h-4 w-4" /> Dashboard
            </Link>
            <span className="text-[#2a4d80]">/</span>
            <h1 className="text-lg font-bold text-white">Inquiries & Registrations</h1>
          </div>
          <button onClick={load} className="flex items-center gap-2 rounded-lg border border-[rgba(0,102,255,0.2)] bg-[rgba(0,102,255,0.06)] px-3 py-2 text-xs text-[#8db5d8] hover:text-white transition" style={{ minHeight: "unset" }}>
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
                className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition ${tab === t.id ? "border-[rgba(0,102,255,0.5)] bg-[rgba(0,102,255,0.15)] text-white" : "border-[rgba(0,102,255,0.14)] bg-[rgba(0,102,255,0.05)] text-[#8db5d8] hover:text-white"}`}
                style={{ minHeight: "unset" }}
              >
                <t.icon className="h-3.5 w-3.5" />
                {t.label}
                {count > 0 && <span className="rounded-full bg-[rgba(0,102,255,0.2)] px-1.5 py-0.5 text-[10px]">{count}</span>}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="overflow-hidden rounded-xl border border-[rgba(0,102,255,0.15)] bg-[rgba(4,13,30,0.8)]">
          {loading ? (
            <div className="flex items-center justify-center py-20 text-[#4d7499]">
              <RefreshCw className="h-5 w-5 animate-spin mr-2" /> Loading…
            </div>
          ) : (
            <>
              {/* RIRC */}
              {tab === "rirc" && (
                <div className="overflow-x-auto">
                  {rirc.length === 0 ? <EmptyState label="No RIRC registrations yet" /> : (
                    <table className="admin-table">
                      <thead>
                        <tr><th>Team</th><th>School</th><th>Contact</th><th>Email</th><th>Phone</th><th>Country</th><th>Track</th><th>Size</th><th>Status</th><th>Date</th><th>Actions</th></tr>
                      </thead>
                      <tbody>
                        {rirc.map((r) => (
                          <tr key={r.id}>
                            <td className="font-medium text-white">{r.team_name}</td>
                            <td>{r.school_name}</td>
                            <td>{r.contact_name}</td>
                            <td className="text-[#7eb8ff]">{r.email}</td>
                            <td>{r.phone}</td>
                            <td>{r.country}</td>
                            <td>{r.track}</td>
                            <td>{r.team_size}</td>
                            <td><StatusBadge status={r.status} /></td>
                            <td className="text-[11px]">{new Date(r.created_at).toLocaleDateString()}</td>
                            <td>
                              <div className="flex gap-1">
                                <button onClick={() => updateStatus(r.id, "rirc", "approved")} className="flex h-7 w-7 items-center justify-center rounded-lg bg-[rgba(0,229,160,0.1)] text-[#00e5a0] hover:bg-[rgba(0,229,160,0.2)] transition" style={{ minHeight: "unset", minWidth: "unset" }} title="Approve"><Check className="h-3.5 w-3.5" /></button>
                                <button onClick={() => updateStatus(r.id, "rirc", "rejected")} className="flex h-7 w-7 items-center justify-center rounded-lg bg-[rgba(248,113,113,0.1)] text-red-400 hover:bg-[rgba(248,113,113,0.2)] transition" style={{ minHeight: "unset", minWidth: "unset" }} title="Reject"><X className="h-3.5 w-3.5" /></button>
                                <button onClick={() => updateStatus(r.id, "rirc", "pending")} className="flex h-7 w-7 items-center justify-center rounded-lg bg-[rgba(245,158,11,0.1)] text-[#fcd34d] hover:bg-[rgba(245,158,11,0.2)] transition" style={{ minHeight: "unset", minWidth: "unset" }} title="Pending"><Clock className="h-3.5 w-3.5" /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              {/* Components */}
              {tab === "components" && (
                <div className="overflow-x-auto">
                  {components.length === 0 ? <EmptyState label="No shop inquiries yet" /> : (
                    <table className="admin-table">
                      <thead><tr><th>Name</th><th>Phone</th><th>Email</th><th>Items</th><th>Total USD</th><th>Notes</th><th>Status</th><th>Date</th></tr></thead>
                      <tbody>
                        {components.map((c) => {
                          let items: { component_name: string; qty: number }[] = [];
                          try { items = JSON.parse(c.items); } catch { /* ignore */ }
                          return (
                            <tr key={c.id}>
                              <td className="font-medium text-white">{c.name}</td>
                              <td>{c.phone}</td>
                              <td className="text-[#7eb8ff]">{c.email}</td>
                              <td className="max-w-[200px]">
                                <div className="space-y-0.5">
                                  {items.map((item, i) => (
                                    <div key={i} className="text-[11px]">{item.component_name} ×{item.qty}</div>
                                  ))}
                                </div>
                              </td>
                              <td className="font-bold text-[#00e5a0]">${c.total_usd.toFixed(2)}</td>
                              <td className="max-w-[150px] text-[11px]">{c.notes}</td>
                              <td><StatusBadge status={c.status} /></td>
                              <td className="text-[11px]">{new Date(c.created_at).toLocaleDateString()}</td>
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
                            <td className="text-[#7eb8ff]">{c.email}</td>
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
                      <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Qty</th><th>School</th><th>Message</th><th>Status</th><th>Date</th></tr></thead>
                      <tbody>
                        {primebook.map((p) => (
                          <tr key={p.id}>
                            <td className="font-medium text-white">{p.name}</td>
                            <td className="text-[#7eb8ff]">{p.email}</td>
                            <td>{p.phone}</td>
                            <td className="font-bold text-[#c084fc]">{p.quantity}</td>
                            <td>{p.school}</td>
                            <td className="max-w-[160px] text-[11px]">{p.message}</td>
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
                            <td className="text-[#7eb8ff]">{m.email}</td>
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
  return <div className="py-14 text-center text-sm text-[#4d7499]">{label}</div>;
}
