import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Prevent Next.js from caching any Supabase fetch response.
// Without this, server components re-use stale cached data even after
// the admin panel saves new values to Supabase.
const noStoreFetch: typeof fetch = (url, options = {}) =>
  fetch(url, { ...options, cache: "no-store" });

// Server-side client — uses service role key, bypasses RLS.
// Use this in all API routes and server components.
export function getServerClient() {
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false },
    db: { schema: "robokorda" },
    global: { fetch: noStoreFetch },
  });
}

// Browser/public client — anon key, respects RLS.
// Kept for potential future client-side use.
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
  db: { schema: "robokorda" },
  global: { fetch: noStoreFetch },
});

// Storage helpers — bucket is always "robokorda"
export const BUCKET = "robokorda";

export function getPublicUrl(storagePath: string): string {
  const { data } = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false },
  }).storage.from(BUCKET).getPublicUrl(storagePath);
  return data.publicUrl;
}
