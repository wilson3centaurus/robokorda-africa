import Link from "next/link";
import {
  LayoutDashboard, Trophy, ShoppingBag,
  MessageSquare, BookOpen, Cpu, ArrowRight, Users,
} from "lucide-react";
import {
  getRircRegistrations, getComponentInquiries,
  getCourseInquiries, getPrimebookInquiries, getContactMessages,
} from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [rirc, components, courses, primebook, contact] = await Promise.all([
    getRircRegistrations(),
    getComponentInquiries(),
    getCourseInquiries(),
    getPrimebookInquiries(),
    getContactMessages(),
  ]);

  const stats = [
    { label: "RIRC Registrations", value: rirc.length, icon: Trophy, color: "text-[#fcd34d]", bg: "bg-[rgba(245,158,11,0.12)]", href: "/admin/inquiries?tab=rirc" },
    { label: "Shop Inquiries", value: components.length, icon: ShoppingBag, color: "text-[var(--electric-bright)]", bg: "bg-[rgba(52,47,197,0.12)]", href: "/admin/inquiries?tab=components" },
    { label: "Course Inquiries", value: courses.length, icon: BookOpen, color: "text-[#00e5a0]", bg: "bg-[rgba(0,229,160,0.1)]", href: "/admin/inquiries?tab=courses" },
    { label: "Prime Book Inquiries", value: primebook.length, icon: Cpu, color: "text-[#c084fc]", bg: "bg-[rgba(192,132,252,0.1)]", href: "/admin/inquiries?tab=primebook" },
    { label: "Contact Messages", value: contact.length, icon: MessageSquare, color: "text-[#f87171]", bg: "bg-[rgba(248,113,113,0.1)]", href: "/admin/inquiries?tab=contact" },
    { label: "Pending RIRC", value: rirc.filter((r) => r.status === "pending").length, icon: Users, color: "text-[#fb923c]", bg: "bg-[rgba(251,146,60,0.1)]", href: "/admin/inquiries?tab=rirc" },
  ];

  return (
    <>
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <LayoutDashboard className="h-6 w-6 text-[var(--electric-bright)]" />
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Dashboard</h1>
        </div>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Robokorda Africa · Admin Overview
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-xl border border-[var(--surface-border)] bg-[var(--surface-1)] p-4 transition hover:border-[var(--electric)]"
          >
            <div className={`mb-2 flex h-9 w-9 items-center justify-center rounded-xl ${stat.bg}`}>
              <stat.icon className={`h-[1.125rem] w-[1.125rem] ${stat.color}`} />
            </div>
            <p className="text-2xl font-bold text-[var(--text-primary)]">{stat.value}</p>
            <p className="mt-1 text-[11px] text-[var(--text-muted)] leading-tight">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Recent RIRC registrations */}
      <div className="mb-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-[var(--text-primary)]">Recent RIRC Registrations</h2>
          <Link href="/admin/inquiries?tab=rirc" className="flex items-center gap-1 text-xs text-[var(--electric-bright)] hover:text-[var(--text-primary)] transition">
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="overflow-x-auto rounded-xl border border-[var(--surface-border)] bg-[var(--surface-1)]">
          {rirc.length === 0 ? (
            <div className="py-10 text-center text-sm text-[var(--text-muted)]">No registrations yet</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Team</th>
                  <th>School</th>
                  <th>Country</th>
                  <th>Track</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {rirc.slice(0, 8).map((r) => (
                  <tr key={r.id}>
                    <td className="font-medium text-[var(--text-primary)]">{r.team_name}</td>
                    <td>{r.school_name}</td>
                    <td>{r.country}</td>
                    <td>{r.track}</td>
                    <td>
                      <span className={`status-badge ${r.status === "pending" ? "status-pending" : r.status === "approved" ? "status-done" : "status-rejected"}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="text-[11px]">{new Date(r.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Recent shop inquiries */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-[var(--text-primary)]">Recent Shop Inquiries</h2>
          <Link href="/admin/inquiries?tab=components" className="flex items-center gap-1 text-xs text-[var(--electric-bright)] hover:text-[var(--text-primary)] transition">
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="overflow-x-auto rounded-xl border border-[var(--surface-border)] bg-[var(--surface-1)]">
          {components.length === 0 ? (
            <div className="py-10 text-center text-sm text-[var(--text-muted)]">No inquiries yet</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Total USD</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {components.slice(0, 5).map((c) => (
                  <tr key={c.id}>
                    <td className="font-medium text-[var(--text-primary)]">{c.name}</td>
                    <td>{c.phone}</td>
                    <td className="text-[#00e5a0] font-semibold">${c.total_usd.toFixed(2)}</td>
                    <td><span className={`status-badge status-${c.status}`}>{c.status}</span></td>
                    <td className="text-[11px]">{new Date(c.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}

