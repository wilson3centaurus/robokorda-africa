/**
 * RoboCore Supabase client — server-side only.
 *
 * Connects to the RoboCore Supabase DB (robocore schema) using the service-role
 * key so that form submissions from the robokorda-africa website are forwarded
 * to the RoboCore admin dashboard under Website → Requests.
 *
 * Tables written to:
 *   website_rirc_registrations
 *   website_primebook_inquiries
 *   website_component_inquiries
 *   website_course_inquiries
 *
 * NEVER import this file from client components — it uses a secret key.
 */

import { createClient } from "@supabase/supabase-js";

const url = process.env.ROBOCORE_SUPABASE_URL ?? "";
const key = process.env.ROBOCORE_SUPABASE_SERVICE_KEY ?? "";

const noStoreFetch: typeof fetch = (input, options = {}) =>
  fetch(input, { ...options, cache: "no-store" });

/**
 * Returns a Supabase client that writes to the RoboCore robocore schema.
 * Falls back gracefully when env vars are missing (returns an inert client).
 */
export function getRoboCoreClient() {
  return createClient(
    url || "https://placeholder.supabase.co",
    key || "placeholder-service-key",
    {
      db: { schema: "robocore" },
      auth: { persistSession: false },
      global: { fetch: noStoreFetch },
    },
  );
}

/** True only when proper credentials are configured. */
export function isRoboCoreConfigured(): boolean {
  return Boolean(url && key && !key.startsWith("placeholder"));
}
