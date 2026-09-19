"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

/** `onDark` styles the control for sitting on top of the dark 3D hero. */
export function ThemeToggle({ onDark = false }: { onDark?: boolean }) {
  const { setTheme, theme, systemTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-9 w-9 rounded-xl border border-[var(--surface-border)] bg-transparent" />
    );
  }

  const isDark = theme === "dark" || (theme === "system" && systemTheme === "dark");

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={
        onDark
          ? "flex h-9 w-9 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white/80 transition hover:bg-white/20 hover:text-white"
          : "flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--surface-border)] bg-[var(--surface-2)] text-[var(--text-secondary)] transition hover:border-[var(--electric)] hover:bg-[var(--electric-subtle)] hover:text-[var(--electric-bright)]"
      }
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <Sun className="h-4 w-4 transition-all" />
      ) : (
        <Moon className="h-4 w-4 transition-all" />
      )}
    </button>
  );
}
