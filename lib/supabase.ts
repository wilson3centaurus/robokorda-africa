import { createClient } from "@supabase/supabase-js";

// Uses the same Supabase project as RoboCore admin.
// Only the anon key is needed here — RLS ensures the website
// can only read public data and INSERT into inquiry tables.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
});
