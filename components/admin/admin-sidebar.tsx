"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Settings,
  Image as ImageIcon,
  Trophy,
  MessageSquare,
  TrendingUp,
  Package,
  FileText,
  BookOpen,
  Cpu,
  GraduationCap,
  HardDrive,
} from "lucide-react";
import { LogoutButton } from "@/components/admin/logout-button";

export const adminNavLinks = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Inquiries & Registrations", href: "/admin/inquiries", icon: MessageSquare },
  { label: "RIRC Registrations", href: "/admin/inquiries?tab=rirc", icon: Trophy },
  { label: "Gallery", href: "/admin/gallery", icon: ImageIcon },
  { label: "Media Library", href: "/admin/media", icon: HardDrive },
  { label: "Catalogue", href: "/admin/catalogue", icon: Package },
  { label: "Pages", href: "/admin/pages", icon: FileText },
  { label: "Courses", href: "/admin/courses", icon: BookOpen },
  { label: "Short Courses", href: "/admin/short-courses", icon: GraduationCap },
  { label: "Site Settings", href: "/admin/settings", icon: Settings },
  { label: "View Site", href: "/", icon: TrendingUp, external: true },
];

export function AdminSidebar({ activeHref }: { activeHref?: string }) {
  const pathname = usePathname();

  function isActive(href: string) {
    if (activeHref) return href === activeHref;
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href.split("?")[0]) && href !== "/admin";
  }

  return (
    <aside className="hidden w-64 shrink-0 border-r border-[var(--surface-border)] bg-[var(--surface-1)] lg:flex lg:flex-col">
      {/* Brand */}
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

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto space-y-0.5 p-3">
        {adminNavLinks.map((link) => {
          const active = isActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-[var(--electric-subtle)] text-[var(--electric-bright)]"
                  : "text-[var(--text-secondary)] hover:bg-[var(--electric-subtle)] hover:text-[var(--text-primary)]"
              }`}
            >
              <link.icon className="h-4 w-4 shrink-0" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-[var(--surface-border)] p-3">
        <LogoutButton />
      </div>
    </aside>
  );
}

export function AdminMobileNav() {
  return (
    <div className="mb-6 flex flex-wrap gap-2 lg:hidden">
      {adminNavLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          target={link.external ? "_blank" : undefined}
          rel={link.external ? "noopener noreferrer" : undefined}
          className="flex items-center gap-2 rounded-xl border border-[var(--surface-border)] bg-[var(--surface-2)] px-3 py-2 text-xs font-medium text-[var(--text-secondary)] hover:border-[var(--electric)] hover:text-[var(--text-primary)] transition-colors"
        >
          <link.icon className="h-3.5 w-3.5 shrink-0" />
          {link.label}
        </Link>
      ))}
    </div>
  );
}
