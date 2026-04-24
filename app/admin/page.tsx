import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard, Settings, Image, Trophy, ShoppingBag,
  MessageSquare, BookOpen, Cpu, LogOut, ArrowRight, Users, TrendingUp,
} from "lucide-react";
import {
  isValidAdminSession, getRircRegistrations, getComponentInquiries,
  getCourseInquiries, getPrimebookInquiries, getContactMessages,
} from "@/lib/db";

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
    { label: "Shop Inquiries", value: components.length, icon: ShoppingBag, color: "text-[#7eb8ff]", bg: "bg-[rgba(0,102,255,0.12)]", href: "/admin/inquiries?tab=components" },
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
    { label: "View Site", href: "/", icon: TrendingUp, external: true },
  ];

  return (
    <div className="min-h-screen bg-[#020810]">
      {/* Circuit bg */}
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
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#8db5d8] transition hover:bg-[rgba(0,102,255,0.1)] hover:text-white"
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="border-t border-[rgba(0,102,255,0.15)] p-3">
            <form action="/api/admin/auth" method="POST">
              <Link
                href="/api/admin/auth"
                onClick={async (e) => {
                  e.preventDefault();
                  await fetch("/api/admin/auth", { method: "DELETE" });
                  window.location.href = "/admin/login";
                }}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#4d7499] transition hover:text-red-400"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Link>
            </form>
          </div>
        </aside>

        {/* Main content */}
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

          <div className="mb-8">
            <div className="flex items-center gap-3">
              <LayoutDashboard className="h-6 w-6 text-[#7eb8ff]" />
              <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            </div>
            <p className="mt-1 text-sm text-[#4d7499]">
              Robokorda Africa · Local file database · All data stored in <code className="rounded bg-[rgba(0,102,255,0.12)] px-1.5 py-0.5 text-[11px] text-[#7eb8ff]">data/</code>
            </p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 mb-8">
            {stats.map((stat) => (
              <Link
                key={stat.label}
                href={stat.href}
                className="rounded-xl border border-[rgba(0,102,255,0.15)] bg-[rgba(4,13,30,0.8)] p-4 transition hover:border-[rgba(0,102,255,0.35)]"
              >
                <div className={`mb-2 flex h-9 w-9 items-center justify-center rounded-xl ${stat.bg}`}>
                  <stat.icon className={`h-4.5 w-4.5 ${stat.color}`} />
                </div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="mt-1 text-[11px] text-[#4d7499] leading-tight">{stat.label}</p>
              </Link>
            ))}
          </div>

          {/* Recent registrations */}
          <div className="mb-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold text-white">Recent RIRC Registrations</h2>
              <Link href="/admin/inquiries?tab=rirc" className="flex items-center gap-1 text-xs text-[#7eb8ff] hover:text-white transition">
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="overflow-x-auto rounded-xl border border-[rgba(0,102,255,0.15)] bg-[rgba(4,13,30,0.8)]">
              {rirc.length === 0 ? (
                <div className="py-10 text-center text-sm text-[#4d7499]">No registrations yet</div>
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
                        <td className="font-medium text-white">{r.team_name}</td>
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
              <h2 className="text-base font-semibold text-white">Recent Shop Inquiries</h2>
              <Link href="/admin/inquiries?tab=components" className="flex items-center gap-1 text-xs text-[#7eb8ff] hover:text-white transition">
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="overflow-x-auto rounded-xl border border-[rgba(0,102,255,0.15)] bg-[rgba(4,13,30,0.8)]">
              {components.length === 0 ? (
                <div className="py-10 text-center text-sm text-[#4d7499]">No inquiries yet</div>
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
                        <td className="font-medium text-white">{c.name}</td>
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
