import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard, Settings, Image, Trophy, ShoppingBag,
  MessageSquare, BookOpen, Cpu, ArrowRight, Users, TrendingUp, Package, FileText
} from "lucide-react";
import {
  isValidAdminSession, getRircRegistrations, getComponentInquiries,
  getCourseInquiries, getPrimebookInquiries, getContactMessages,
} from "@/lib/db";
import { LogoutButton } from "@/components/admin/logout-button";

export const dynamic = "force-dynamic";

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value ?? "";
  if (!isValidAdminSession(token)) redirect("/admin/login");
}

export default async function AdminDashboard() {
  await checkAuth();

  const rirc = getRircRegistrations();
  const components = getComponentInquiries();
  const courses = getCourseInquiries();
  const primebook = getPrimebookInquiries();
  const contact = getContactMessages();

  const stats = [
    { label: "RIRC Registrations", value: rirc.length, icon: Trophy, color: "text-[#fcd34d]", bg: "bg-[rgba(245,158,11,0.12)]", href: "/admin/inquiries?tab=rirc" },
    { label: "Shop Inquiries", value: components.length, icon: ShoppingBag, color: "text-[var(--electric-bright)]", bg: "bg-[rgba(52,47,197,0.12)]", href: "/admin/inquiries?tab=components" },
    { label: "Course Inquiries", value: courses.length, icon: BookOpen, color: "text-[#00e5a0]", bg: "bg-[rgba(0,229,160,0.1)]", href: "/admin/inquiries?tab=courses" },
    { label: "Prime Book Inquiries", value: primebook.length, icon: Cpu, color: "text-[#c084fc]", bg: "bg-[rgba(192,132,252,0.1)]", href: "/admin/inquiries?tab=primebook" },
    { label: "Contact Messages", value: contact.length, icon: MessageSquare, color: "text-[#f87171]", bg: "bg-[rgba(248,113,113,0.1)]", href: "/admin/inquiries?tab=contact" },
    { label: "Pending RIRC", value: rirc.filter((r) => r.status === "pending").length, icon: Users, color: "text-[#fb923c]", bg: "bg-[rgba(251,146,60,0.1)]", href: "/admin/inquiries?tab=rirc" },
  ];

  const navLinks = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Inquiries & Registrations", href: "/admin/inquiries", icon: MessageSquare },
    { label: "Site Settings", href: "/admin/settings", icon: Settings },
    { label: "Gallery", href: "/admin/gallery", icon: Image },
    { label: "Catalogue", href: "/admin/catalogue", icon: Package },
    { label: "Pages", href: "/admin/pages", icon: FileText },
    { label: "View Site", href: "/", icon: TrendingUp, external: true },
  ];

  return (
    <div className="min-h-screen bg-[var(--space-800)]">
      {/* Circuit bg */}
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
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--text-secondary)] transition hover:bg-[var(--electric-subtle)] hover:text-[var(--text-primary)]"
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="border-t border-[var(--surface-border)] p-3">
            <LogoutButton />
          </div>
        </aside>

        {/* Main content */}
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

          <div className="mb-8">
            <div className="flex items-center gap-3">
              <LayoutDashboard className="h-6 w-6 text-[var(--electric-bright)]" />
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Dashboard</h1>
            </div>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Robokorda Africa · Local file database · All data stored in <code className="rounded bg-[var(--electric-subtle)] px-1.5 py-0.5 text-[11px] text-[var(--electric-bright)]">data/</code>
            </p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 mb-8">
            {stats.map((stat) => (
              <Link
                key={stat.label}
                href={stat.href}
                className="rounded-xl border border-[var(--surface-border)] bg-[var(--surface-1)] p-4 transition hover:border-[var(--electric)]"
              >
                <div className={`mb-2 flex h-9 w-9 items-center justify-center rounded-xl ${stat.bg}`}>
                  <stat.icon className={`h-4.5 w-4.5 ${stat.color}`} />
                </div>
                <p className="text-2xl font-bold text-[var(--text-primary)]">{stat.value}</p>
                <p className="mt-1 text-[11px] text-[var(--text-muted)] leading-tight">{stat.label}</p>
              </Link>
            ))}
          </div>

          {/* Recent registrations */}
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
        </main>
      </div>
    </div>
  );
}
