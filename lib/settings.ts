/**
 * Fetches all website_settings from Supabase.
 * Falls back to hardcoded values if the DB is unreachable or env vars are missing.
 * Used in Server Components — calls happen at request time (ISR-cacheable).
 */

import { supabase } from "@/lib/supabase";

export type SiteSettings = {
  site_name: string;
  site_tagline: string;
  contact_email: string;
  contact_phone_sa: string;
  contact_phone_zw: string;
  address_sa: string;
  address_zw: string;
  social_facebook: string;
  social_instagram: string;
  social_linkedin: string;
  stat_students: string;
  stat_schools: string;
  stat_countries: string;
  stat_competitions: string;
  video_url_home: string;
  video_url_rirc: string;
  video_url_primebook: string;
};

// Static fallbacks — these are used if Supabase is unreachable
const DEFAULTS: SiteSettings = {
  site_name: "Robokorda Africa",
  site_tagline: "Making Robotics & Coding Fun",
  contact_email: "info@robokorda.com",
  contact_phone_sa: "+27 83 242 7998",
  contact_phone_zw: "+263 774 189 500",
  address_sa: "206 Rosies Place Street, Glen Austin AH, Midrand, Johannesburg",
  address_zw: "16 Mahogany Avenue, Rhodene, Masvingo, Zimbabwe",
  social_facebook: "https://www.facebook.com/robokordaafrica",
  social_instagram: "https://www.instagram.com/robokordaafrica",
  social_linkedin: "https://www.linkedin.com/company/robokorda-africa",
  stat_students: "9,976+",
  stat_schools: "79+",
  stat_countries: "11",
  stat_competitions: "31",
  video_url_home: "",
  video_url_rirc: "",
  video_url_primebook: "",
};

let _cache: SiteSettings | null = null;
let _cacheAt = 0;
const CACHE_TTL = 60_000; // 60 seconds in-process cache

export async function getSiteSettings(): Promise<SiteSettings> {
  // Skip if env vars aren't configured
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return DEFAULTS;
  }

  // Return in-process cache if fresh
  if (_cache && Date.now() - _cacheAt < CACHE_TTL) return _cache;

  try {
    const { data, error } = await supabase
      .from("website_settings")
      .select("key, value");

    if (error || !data) return _cache ?? DEFAULTS;

    const map: Record<string, string> = {};
    data.forEach((row: { key: string; value: string }) => {
      map[row.key] = row.value;
    });

    _cache = {
      site_name:        map.site_name        || DEFAULTS.site_name,
      site_tagline:     map.site_tagline     || DEFAULTS.site_tagline,
      contact_email:    map.contact_email    || DEFAULTS.contact_email,
      contact_phone_sa: map.contact_phone_sa || DEFAULTS.contact_phone_sa,
      contact_phone_zw: map.contact_phone_zw || DEFAULTS.contact_phone_zw,
      address_sa:       map.address_sa       || DEFAULTS.address_sa,
      address_zw:       map.address_zw       || DEFAULTS.address_zw,
      social_facebook:  map.social_facebook  || DEFAULTS.social_facebook,
      social_instagram: map.social_instagram || DEFAULTS.social_instagram,
      social_linkedin:  map.social_linkedin  || DEFAULTS.social_linkedin,
      stat_students:    map.stat_students    || DEFAULTS.stat_students,
      stat_schools:     map.stat_schools     || DEFAULTS.stat_schools,
      stat_countries:   map.stat_countries   || DEFAULTS.stat_countries,
      stat_competitions:map.stat_competitions|| DEFAULTS.stat_competitions,
      video_url_home:   map.video_url_home   || "",
      video_url_rirc:   map.video_url_rirc   || "",
      video_url_primebook: map.video_url_primebook || "",
    };
    _cacheAt = Date.now();
    return _cache;
  } catch {
    return _cache ?? DEFAULTS;
  }
}

/**
 * Fetches published gallery photos from Supabase.
 * Returns empty array if DB is unreachable.
 */
export type GalleryPhoto = {
  id: string;
  title: string;
  caption: string | null;
  image_url: string;
  section: string;
  size: "square" | "wide" | "tall";
};

export async function getGalleryPhotos(section?: string): Promise<GalleryPhoto[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return [];
  }
  try {
    let query = supabase
      .from("website_gallery")
      .select("id, title, caption, image_url, section, size, sort_order")
      .eq("is_published", true)
      .order("sort_order", { ascending: true });

    if (section) query = query.eq("section", section);

    const { data, error } = await query;
    if (error || !data) return [];
    return data as GalleryPhoto[];
  } catch {
    return [];
  }
}
