/**
 * Supabase-backed database layer.
 * All operations use the robokorda schema via the service-role client.
 */

import { getServerClient } from "@/lib/supabase";
import { createSessionToken, verifySessionToken } from "@/lib/admin/auth";
import type { RoboticsComponent } from "@/data/components";
import type { Course } from "@/data/site";

// ─── ID generator ────────────────────────────────────────────────────────────

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// ─── Defaults ────────────────────────────────────────────────────────────────

const DEFAULT_SETTINGS: Record<string, string> = {
  site_name: "Robokorda Africa",
  site_tagline: "Making Robotics & Coding Fun",
  contact_email: "info@robokorda.com",
  contact_phone_zw: "+263 774 189 500",
  address_zw: "16 Mahogany Avenue, Rhodene, Masvingo, Zimbabwe",
  social_facebook: "https://www.facebook.com/robokordaafrica",
  social_instagram: "https://www.instagram.com/robokordaafrica",
  social_linkedin: "https://www.linkedin.com/company/robokorda-africa",
  social_tiktok: "",
  stat_students: "9,976+",
  stat_schools: "79+",
  stat_countries: "11",
  stat_competitions: "31",
  video_url_home: "",
  video_url_rirc: "",
  video_url_primebook: "",
  primebook_price_usd: "299",
  primebook_price_zwg: "850000",
  primebook_specs: 'Intel Celeron N4020 · 4GB RAM · 128GB SSD · 11.6" HD · Windows 11',
  rirc_brochure_url: "",
  rirc_flyer_url: "",
  rirc_logo_url: "",
  rirc_video_challenge_info: "",
  rirc_video_challenge_how_to: "",
  admin_password: "robokorda2026",
};

// ─── Settings ────────────────────────────────────────────────────────────────

export async function getAllSettings(): Promise<Record<string, string>> {
  const sb = getServerClient();
  const { data, error } = await sb.from("settings").select("key, value");
  if (error) return { ...DEFAULT_SETTINGS };
  const stored: Record<string, string> = {};
  for (const row of data ?? []) stored[row.key] = row.value;
  return { ...DEFAULT_SETTINGS, ...stored };
}

export async function getSetting(key: string, fallback = ""): Promise<string> {
  const map = await getAllSettings();
  return map[key] ?? fallback;
}

export async function setSetting(key: string, value: string): Promise<void> {
  const sb = getServerClient();
  await sb.from("settings").upsert({ key, value });
}

export async function setSettings(updates: Record<string, string>): Promise<void> {
  const sb = getServerClient();
  const rows = Object.entries(updates).map(([key, value]) => ({ key, value }));
  await sb.from("settings").upsert(rows);
}

// ─── Gallery ─────────────────────────────────────────────────────────────────

export type GalleryRow = {
  id: string;
  section: string;
  title: string;
  caption: string;
  image_url: string;
  size: "square" | "wide" | "tall";
  sort_order: number;
  is_published: boolean;
  created_at: string;
};

export async function getGallery(section?: string): Promise<GalleryRow[]> {
  const sb = getServerClient();
  let q = sb.from("gallery").select("*").eq("is_published", true).order("sort_order");
  if (section) q = q.eq("section", section);
  const { data } = await q;
  return (data ?? []) as GalleryRow[];
}

export async function getAllGallery(): Promise<GalleryRow[]> {
  const sb = getServerClient();
  const { data } = await sb.from("gallery").select("*").order("sort_order");
  return (data ?? []) as GalleryRow[];
}

export async function upsertGallery(row: Partial<GalleryRow> & { id?: string }): Promise<GalleryRow> {
  const sb = getServerClient();
  const id = row.id || uid();

  let existing: GalleryRow | null = null;
  if (row.id) {
    const { data } = await sb.from("gallery").select("*").eq("id", row.id).single();
    existing = data as GalleryRow | null;
  }

  const updated: GalleryRow = {
    id,
    section: row.section ?? existing?.section ?? "home",
    title: row.title ?? existing?.title ?? "",
    caption: row.caption ?? existing?.caption ?? "",
    image_url: row.image_url ?? existing?.image_url ?? "",
    size: row.size ?? existing?.size ?? "square",
    sort_order: row.sort_order ?? existing?.sort_order ?? 0,
    is_published: row.is_published ?? existing?.is_published ?? true,
    created_at: existing?.created_at ?? new Date().toISOString(),
  };

  await sb.from("gallery").upsert(updated);
  return updated;
}

export async function deleteGallery(id: string): Promise<void> {
  const sb = getServerClient();
  await sb.from("gallery").delete().eq("id", id);
}

// ─── RIRC Registrations ───────────────────────────────────────────────────────

export type RircRegistration = {
  id: string;
  school_name: string;
  team_name: string;
  contact_name: string;
  email: string;
  phone: string;
  whatsapp: string;
  country: string;
  city: string;
  track: string;
  category: string;
  team_size: string;
  team_members: string;
  notes: string;
  video_challenge_entered: boolean;
  video_challenge_links: string;
  status: string;
  confirmation_sent: boolean;
  paid: boolean;
  invoice_sent: boolean;
  created_at: string;
};

export async function getRircRegistrations(): Promise<RircRegistration[]> {
  const sb = getServerClient();
  const { data } = await sb
    .from("rirc_registrations")
    .select("*")
    .order("created_at", { ascending: false });
  return (data ?? []) as RircRegistration[];
}

export async function addRircRegistration(
  data: Omit<RircRegistration, "id" | "status" | "created_at" | "confirmation_sent" | "paid" | "invoice_sent" | "video_challenge_entered" | "video_challenge_links"> & {
    video_challenge_entered?: boolean;
    video_challenge_links?: string;
  },
): Promise<RircRegistration> {
  const sb = getServerClient();
  const row: RircRegistration = {
    ...data,
    video_challenge_entered: data.video_challenge_entered ?? false,
    video_challenge_links: data.video_challenge_links ?? "",
    id: uid(),
    status: "pending",
    confirmation_sent: false,
    paid: false,
    invoice_sent: false,
    created_at: new Date().toISOString(),
  };
  await sb.from("rirc_registrations").insert(row);
  return row;
}

export async function updateRircStatus(id: string, status: string): Promise<void> {
  const sb = getServerClient();
  await sb.from("rirc_registrations").update({ status }).eq("id", id);
}

export async function updateRircFlags(
  id: string,
  flags: Partial<Pick<RircRegistration, "confirmation_sent" | "paid" | "invoice_sent" | "status">>,
): Promise<void> {
  const sb = getServerClient();
  await sb.from("rirc_registrations").update(flags).eq("id", id);
}

// ─── Component Inquiries ──────────────────────────────────────────────────────

export type ComponentInquiry = {
  id: string;
  name: string;
  email: string;
  phone: string;
  notes: string;
  items: string;
  total_usd: number;
  status: string;
  confirmation_sent?: boolean;
  paid?: boolean;
  invoice_sent?: boolean;
  delivered?: boolean;
  created_at: string;
};

export async function getComponentInquiries(): Promise<ComponentInquiry[]> {
  const sb = getServerClient();
  const { data } = await sb
    .from("component_inquiries")
    .select("*")
    .order("created_at", { ascending: false });
  return (data ?? []) as ComponentInquiry[];
}

export async function addComponentInquiry(
  data: Omit<ComponentInquiry, "id" | "status" | "created_at" | "confirmation_sent" | "paid" | "invoice_sent" | "delivered">,
): Promise<ComponentInquiry> {
  const sb = getServerClient();
  const row: ComponentInquiry = {
    ...data,
    id: uid(),
    status: "new",
    confirmation_sent: false,
    paid: false,
    invoice_sent: false,
    delivered: false,
    created_at: new Date().toISOString(),
  };
  await sb.from("component_inquiries").insert(row);
  return row;
}

// ─── Course Inquiries ─────────────────────────────────────────────────────────

export type CourseInquiry = {
  id: string;
  name: string;
  email: string;
  phone: string;
  course_title: string;
  school: string;
  message: string;
  status: string;
  confirmation_sent?: boolean;
  paid?: boolean;
  invoice_sent?: boolean;
  delivered?: boolean;
  created_at: string;
};

export async function getCourseInquiries(): Promise<CourseInquiry[]> {
  const sb = getServerClient();
  const { data } = await sb
    .from("course_inquiries")
    .select("*")
    .order("created_at", { ascending: false });
  return (data ?? []) as CourseInquiry[];
}

export async function addCourseInquiry(
  data: Omit<CourseInquiry, "id" | "status" | "created_at" | "confirmation_sent" | "paid" | "invoice_sent" | "delivered">,
): Promise<CourseInquiry> {
  const sb = getServerClient();
  const row: CourseInquiry = {
    ...data,
    id: uid(),
    status: "new",
    confirmation_sent: false,
    paid: false,
    invoice_sent: false,
    delivered: false,
    created_at: new Date().toISOString(),
  };
  await sb.from("course_inquiries").insert(row);
  return row;
}

// ─── Primebook Inquiries ──────────────────────────────────────────────────────

export type PrimebookInquiry = {
  id: string;
  name: string;
  email: string;
  phone: string;
  quantity: number;
  school: string;
  message: string;
  status: string;
  confirmation_sent?: boolean;
  paid?: boolean;
  invoice_sent?: boolean;
  delivered?: boolean;
  created_at: string;
};

export async function getPrimebookInquiries(): Promise<PrimebookInquiry[]> {
  const sb = getServerClient();
  const { data } = await sb
    .from("primebook_inquiries")
    .select("*")
    .order("created_at", { ascending: false });
  return (data ?? []) as PrimebookInquiry[];
}

export async function addPrimebookInquiry(
  data: Omit<PrimebookInquiry, "id" | "status" | "created_at" | "confirmation_sent" | "paid" | "invoice_sent" | "delivered">,
): Promise<PrimebookInquiry> {
  const sb = getServerClient();
  const row: PrimebookInquiry = {
    ...data,
    id: uid(),
    status: "new",
    confirmation_sent: false,
    paid: false,
    invoice_sent: false,
    delivered: false,
    created_at: new Date().toISOString(),
  };
  await sb.from("primebook_inquiries").insert(row);
  return row;
}

// ─── Contact Messages ─────────────────────────────────────────────────────────

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
};

export async function getContactMessages(): Promise<ContactMessage[]> {
  const sb = getServerClient();
  const { data } = await sb
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });
  return (data ?? []) as ContactMessage[];
}

export async function addContactMessage(
  data: Omit<ContactMessage, "id" | "status" | "created_at">,
): Promise<ContactMessage> {
  const sb = getServerClient();
  const row: ContactMessage = {
    ...data,
    id: uid(),
    status: "new",
    created_at: new Date().toISOString(),
  };
  await sb.from("contact_messages").insert(row);
  return row;
}

// ─── Generic inquiry flag update ─────────────────────────────────────────────

const TABLE_MAP: Record<string, string> = {
  component_inquiries: "component_inquiries",
  course_inquiries: "course_inquiries",
  primebook_inquiries: "primebook_inquiries",
  contact_messages: "contact_messages",
};

export async function updateInquiryFlags(table: string, id: string, flags: Record<string, unknown>): Promise<void> {
  const sb = getServerClient();
  const safeTable = TABLE_MAP[table];
  if (!safeTable) return;
  await sb.from(safeTable).update(flags).eq("id", id);
}

// ─── Admin sessions (stateless HMAC — no DB writes needed) ───────────────────

export function createAdminSession(): string {
  return createSessionToken();
}

export function isValidAdminSession(token: string): boolean {
  return verifySessionToken(token);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function deleteAdminSession(_token: string): void {
  // Stateless HMAC sessions — logout is handled by clearing the cookie.
}

// ─── Components ───────────────────────────────────────────────────────────────

export async function getComponents(): Promise<RoboticsComponent[]> {
  const sb = getServerClient();
  const { data } = await sb.from("components").select("*");
  if (!data || data.length === 0) return [];
  return data.map((row) => ({
    id: row.id,
    name: row.name,
    category: row.category,
    priceUSD: Number(row.price_usd),
    priceZWG: Number(row.price_zwg),
    imageSrc: row.image_src,
    shortDescription: row.short_description,
    status: row.status,
    badge: row.badge,
    ...row.extra,
  })) as RoboticsComponent[];
}

export async function updateComponent(id: string, updates: Partial<RoboticsComponent>): Promise<RoboticsComponent | null> {
  const sb = getServerClient();
  const { priceUSD, priceZWG, imageSrc, shortDescription, ...rest } = updates as Record<string, unknown>;
  const dbUpdates: Record<string, unknown> = { extra: rest };
  if (priceUSD !== undefined) dbUpdates.price_usd = priceUSD;
  if (priceZWG !== undefined) dbUpdates.price_zwg = priceZWG;
  if (imageSrc !== undefined) dbUpdates.image_src = imageSrc;
  if (shortDescription !== undefined) dbUpdates.short_description = shortDescription;
  if (updates.name !== undefined) dbUpdates.name = updates.name;
  if (updates.category !== undefined) dbUpdates.category = updates.category;
  if (updates.status !== undefined) dbUpdates.status = updates.status;
  if (updates.badge !== undefined) dbUpdates.badge = updates.badge;

  const { data } = await sb.from("components").update(dbUpdates).eq("id", id).select().single();
  if (!data) return null;
  return {
    id: data.id,
    name: data.name,
    category: data.category,
    priceUSD: Number(data.price_usd),
    priceZWG: Number(data.price_zwg),
    imageSrc: data.image_src,
    shortDescription: data.short_description,
    status: data.status,
    badge: data.badge,
    ...data.extra,
  } as RoboticsComponent;
}

// ─── Courses ──────────────────────────────────────────────────────────────────

export async function getCourses(): Promise<Course[]> {
  const sb = getServerClient();
  const { data } = await sb.from("courses").select("*");
  if (!data || data.length === 0) return [];
  return data.map((row) => ({
    seed: row.seed,
    title: row.title,
    level: row.level,
    age: row.age,
    duration: row.duration,
    deliveryMode: row.delivery_mode,
    overview: Array.isArray(row.overview) ? row.overview : [],
    imageSrc: row.image_src,
    ...row.extra,
  })) as Course[];
}

export async function updateCourse(seed: string, updates: Partial<Course>): Promise<Course | null> {
  const sb = getServerClient();
  const { deliveryMode, imageSrc, ...rest } = updates as Record<string, unknown>;
  const dbUpdates: Record<string, unknown> = { extra: rest };
  if (deliveryMode !== undefined) dbUpdates.delivery_mode = deliveryMode;
  if (imageSrc !== undefined) dbUpdates.image_src = imageSrc;
  if (updates.title !== undefined) dbUpdates.title = updates.title;
  if (updates.level !== undefined) dbUpdates.level = updates.level;
  if (updates.age !== undefined) dbUpdates.age = updates.age;
  if (updates.duration !== undefined) dbUpdates.duration = updates.duration;
  if (updates.overview !== undefined) dbUpdates.overview = updates.overview;

  const { data } = await sb.from("courses").update(dbUpdates).eq("seed", seed).select().single();
  if (!data) return null;
  return {
    seed: data.seed,
    title: data.title,
    level: data.level,
    age: data.age,
    duration: data.duration,
    deliveryMode: data.delivery_mode,
    overview: Array.isArray(data.overview) ? data.overview : [],
    imageSrc: data.image_src,
    ...data.extra,
  } as Course;
}
