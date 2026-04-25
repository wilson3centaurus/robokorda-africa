"use client";

import { LogOut } from "lucide-react";

export function LogoutButton() {
  async function handleLogout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    window.location.href = "/admin/login";
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--text-secondary)] transition hover:text-red-400"
    >
      <LogOut className="h-4 w-4" />
      Sign Out
    </button>
  );
}
