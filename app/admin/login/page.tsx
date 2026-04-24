"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, Loader2, Cpu } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        setError("Invalid password. Try again.");
      }
    } catch {
      setError("Connection error. Please retry.");
    }
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#020810] px-4">
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(rgba(0,102,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,102,255,1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative w-full max-w-sm">
        <div className="pointer-events-none absolute -inset-px rounded-2xl" style={{ boxShadow: "0 0 60px rgba(0,102,255,0.15)" }} />

        <div className="rounded-2xl border border-[rgba(0,102,255,0.25)] bg-[rgba(4,13,30,0.96)] p-8">
          <div className="mb-8 flex flex-col items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[rgba(0,102,255,0.4)] bg-[rgba(0,102,255,0.12)]" style={{ boxShadow: "0 0 20px rgba(0,102,255,0.2)" }}>
              <Cpu className="h-7 w-7 text-[#7eb8ff]" />
            </div>
            <div className="text-center">
              <h1 className="text-xl font-bold text-white">Robokorda CMS</h1>
              <p className="mt-1 text-xs text-[#4d7499]">Admin Dashboard · Local DB</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="field-label">Admin Password</label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#4d7499]" />
                <input
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  autoFocus
                  className="field-input pl-10 pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4d7499] hover:text-[#8db5d8] transition"
                  style={{ minHeight: "unset", minWidth: "unset" }}
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-400">
                {error}
              </p>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-center text-[10px] text-[#2a4d80]">
            Default password: <span className="font-mono text-[#4d7499]">robokorda2026</span>
          </p>
        </div>
      </div>
    </div>
  );
}
