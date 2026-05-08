import { cookies } from "next/headers";
import { isValidAdminSession } from "@/lib/db";
import { AdminSidebar, AdminMobileNav } from "@/components/admin/admin-sidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value ?? "";
  const isAuthenticated = isValidAdminSession(token);

  // Login page: no sidebar chrome
  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[var(--space-800)]">
      {/* Circuit bg */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(rgba(52,47,197,1) 1px, transparent 1px), linear-gradient(90deg, rgba(52,47,197,1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
      <div className="relative flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 min-w-0 overflow-auto p-4 sm:p-6 lg:p-8">
          <AdminMobileNav />
          {children}
        </main>
      </div>
    </div>
  );
}

