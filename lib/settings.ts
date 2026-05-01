import { getAllSettings, getGallery } from "@/lib/db";

export type SiteSettings = {
  site_name: string;
  site_tagline: string;
  logo_url: string;
  logo_url_dark: string;
  favicon_url: string;
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
  primebook_price_usd: string;
  primebook_price_zwg: string;
  primebook_specs: string;
  rirc_brochure_url: string;
};

const DEFAULTS: SiteSettings = {
  site_name: "Robokorda Africa",
  site_tagline: "Making Robotics & Coding Fun",
  logo_url: "/brand/logo.png",
  logo_url_dark: "",
  favicon_url: "",
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
  primebook_price_usd: "299",
  primebook_price_zwg: "850000",
  primebook_specs: "PrimeOS (Android-based) · ARM Octa-Core · 4GB RAM · 128GB · 14\" HD",
  rirc_brochure_url: "",
};

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const map = await getAllSettings();
    return {
      site_name:           map.site_name           || DEFAULTS.site_name,
      site_tagline:        map.site_tagline        || DEFAULTS.site_tagline,
      logo_url:            map.logo_url            || DEFAULTS.logo_url,
      logo_url_dark:       map.logo_url_dark       || "",
      favicon_url:         map.favicon_url         || "",
      contact_email:       map.contact_email       || DEFAULTS.contact_email,
      contact_phone_sa:    map.contact_phone_sa    || DEFAULTS.contact_phone_sa,
      contact_phone_zw:    map.contact_phone_zw    || DEFAULTS.contact_phone_zw,
      address_sa:          map.address_sa          || DEFAULTS.address_sa,
      address_zw:          map.address_zw          || DEFAULTS.address_zw,
      social_facebook:     map.social_facebook     || DEFAULTS.social_facebook,
      social_instagram:    map.social_instagram    || DEFAULTS.social_instagram,
      social_linkedin:     map.social_linkedin     || DEFAULTS.social_linkedin,
      stat_students:       map.stat_students       || DEFAULTS.stat_students,
      stat_schools:        map.stat_schools        || DEFAULTS.stat_schools,
      stat_countries:      map.stat_countries      || DEFAULTS.stat_countries,
      stat_competitions:   map.stat_competitions   || DEFAULTS.stat_competitions,
      video_url_home:      map.video_url_home      || "",
      video_url_rirc:      map.video_url_rirc      || "",
      video_url_primebook: map.video_url_primebook || "",
      primebook_price_usd: map.primebook_price_usd || DEFAULTS.primebook_price_usd,
      primebook_price_zwg: map.primebook_price_zwg || DEFAULTS.primebook_price_zwg,
      primebook_specs:     map.primebook_specs     || DEFAULTS.primebook_specs,
      rirc_brochure_url:   map.rirc_brochure_url   || "",
    };
  } catch {
    return DEFAULTS;
  }
}

export type GalleryPhoto = {
  id: string;
  title: string;
  caption: string | null;
  image_url: string;
  section: string;
  size: "square" | "wide" | "tall";
};

export async function getGalleryPhotos(section?: string): Promise<GalleryPhoto[]> {
  try {
    return (await getGallery(section)) as GalleryPhoto[];
  } catch {
    return [];
  }
}
