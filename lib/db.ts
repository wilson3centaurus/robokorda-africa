/**
 * Lightweight file-based database using JSON files.
 * No native modules required — works on all platforms.
 * Data is stored in ./data/*.json
 */

import path from "path";
import fs from "fs";

const DATA_DIR = path.join(process.cwd(), "data");

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function filePath(table: string) {
  return path.join(DATA_DIR, `${table}.json`);
}

function readTable<T>(table: string, defaults: T[] = []): T[] {
  ensureDir();
  const fp = filePath(table);
  if (!fs.existsSync(fp)) return defaults;
  try {
    return JSON.parse(fs.readFileSync(fp, "utf8")) as T[];
  } catch {
    return defaults;
  }
}

function writeTable<T>(table: string, data: T[]): void {
  ensureDir();
  fs.writeFileSync(filePath(table), JSON.stringify(data, null, 2), "utf8");
}

function readMap(table: string): Record<string, string> {
  ensureDir();
  const fp = filePath(table);
  if (!fs.existsSync(fp)) return {};
  try {
    return JSON.parse(fs.readFileSync(fp, "utf8")) as Record<string, string>;
  } catch {
    return {};
  }
}

function writeMap(table: string, data: Record<string, string>): void {
  ensureDir();
  fs.writeFileSync(filePath(table), JSON.stringify(data, null, 2), "utf8");
}

// ─── ID generator ────────────────────────────────────────────────────────────

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// ─── Defaults ────────────────────────────────────────────────────────────────

const DEFAULT_SETTINGS: Record<string, string> = {
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
  primebook_price_usd: "299",
  primebook_price_zwg: "850000",
  primebook_specs: 'Intel Celeron N4020 · 4GB RAM · 128GB SSD · 11.6" HD · Windows 11',
  admin_password: "robokorda2026",
};

// ─── Settings ────────────────────────────────────────────────────────────────

export function getAllSettings(): Record<string, string> {
  const stored = readMap("settings");
  // Merge defaults with stored (stored takes priority)
  return { ...DEFAULT_SETTINGS, ...stored };
}

export function getSetting(key: string, fallback = ""): string {
  const map = getAllSettings();
  return map[key] ?? fallback;
}

export function setSetting(key: string, value: string): void {
  const map = getAllSettings();
  map[key] = value;
  writeMap("settings", map);
}

export function setSettings(updates: Record<string, string>): void {
  const map = getAllSettings();
  Object.assign(map, updates);
  writeMap("settings", map);
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

export function getGallery(section?: string): GalleryRow[] {
  const rows = readTable<GalleryRow>("gallery");
  const published = rows.filter((r) => r.is_published !== false);
  if (section) return published.filter((r) => r.section === section).sort((a, b) => a.sort_order - b.sort_order);
  return published.sort((a, b) => a.sort_order - b.sort_order);
}

export function getAllGallery(): GalleryRow[] {
  return readTable<GalleryRow>("gallery").sort((a, b) => a.sort_order - b.sort_order);
}

export function upsertGallery(row: Partial<GalleryRow> & { id?: string }): GalleryRow {
  const rows = readTable<GalleryRow>("gallery");
  const id = row.id || uid();
  const existing = rows.find((r) => r.id === id);
  const updated: GalleryRow = {
    id,
    section: row.section ?? existing?.section ?? "home",
    title: row.title ?? existing?.title ?? "",
    caption: row.caption ?? existing?.caption ?? "",
    image_url: row.image_url ?? existing?.image_url ?? "",
    size: row.size ?? existing?.size ?? "square",
    sort_order: row.sort_order ?? existing?.sort_order ?? rows.length,
    is_published: row.is_published ?? existing?.is_published ?? true,
    created_at: existing?.created_at ?? new Date().toISOString(),
  };
  const newRows = existing ? rows.map((r) => (r.id === id ? updated : r)) : [...rows, updated];
  writeTable("gallery", newRows);
  return updated;
}

export function deleteGallery(id: string): void {
  writeTable("gallery", readTable<GalleryRow>("gallery").filter((r) => r.id !== id));
}

// ─── RIRC Registrations ───────────────────────────────────────────────────────

export type RircRegistration = {
  id: string;
  school_name: string;
  team_name: string;
  contact_name: string;    // team leader
  email: string;
  phone: string;           // kept for backward compat
  whatsapp: string;
  country: string;
  city: string;
  track: string;           // kept for backward compat
  category: string;
  team_size: string;
  team_members: string;    // JSON array of names
  notes: string;
  status: string;
  confirmation_sent: boolean;
  paid: boolean;
  invoice_sent: boolean;
  created_at: string;
};

export function getRircRegistrations(): RircRegistration[] {
  return readTable<RircRegistration>("rirc_registrations").sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
}

export function addRircRegistration(data: Omit<RircRegistration, "id" | "status" | "created_at" | "confirmation_sent" | "paid" | "invoice_sent">): RircRegistration {
  const rows = readTable<RircRegistration>("rirc_registrations");
  const row: RircRegistration = {
    ...data,
    id: uid(),
    status: "pending",
    confirmation_sent: false,
    paid: false,
    invoice_sent: false,
    created_at: new Date().toISOString(),
  };
  writeTable("rirc_registrations", [...rows, row]);
  return row;
}

export function updateRircStatus(id: string, status: string): void {
  const rows = readTable<RircRegistration>("rirc_registrations");
  writeTable("rirc_registrations", rows.map((r) => (r.id === id ? { ...r, status } : r)));
}

export function updateRircFlags(id: string, flags: Partial<Pick<RircRegistration, "confirmation_sent" | "paid" | "invoice_sent" | "status">>): void {
  const rows = readTable<RircRegistration>("rirc_registrations");
  writeTable("rirc_registrations", rows.map((r) => (r.id === id ? { ...r, ...flags } : r)));
}

// ─── Component Inquiries ──────────────────────────────────────────────────────

export type ComponentInquiry = {
  id: string;
  name: string;
  email: string;
  phone: string;
  notes: string;
  items: string; // JSON
  total_usd: number;
  status: string;
  confirmation_sent?: boolean;
  paid?: boolean;
  invoice_sent?: boolean;
  delivered?: boolean;
  created_at: string;
};

export function getComponentInquiries(): ComponentInquiry[] {
  return readTable<ComponentInquiry>("component_inquiries").sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
}

export function addComponentInquiry(data: Omit<ComponentInquiry, "id" | "status" | "created_at" | "confirmation_sent" | "paid" | "invoice_sent" | "delivered">): ComponentInquiry {
  const rows = readTable<ComponentInquiry>("component_inquiries");
  const row: ComponentInquiry = { 
    ...data, 
    id: uid(), 
    status: "new", 
    confirmation_sent: false,
    paid: false,
    invoice_sent: false,
    delivered: false,
    created_at: new Date().toISOString() 
  };
  writeTable("component_inquiries", [...rows, row]);
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

export function getCourseInquiries(): CourseInquiry[] {
  return readTable<CourseInquiry>("course_inquiries").sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
}

export function addCourseInquiry(data: Omit<CourseInquiry, "id" | "status" | "created_at" | "confirmation_sent" | "paid" | "invoice_sent" | "delivered">): CourseInquiry {
  const rows = readTable<CourseInquiry>("course_inquiries");
  const row: CourseInquiry = { 
    ...data, 
    id: uid(), 
    status: "new", 
    confirmation_sent: false,
    paid: false,
    invoice_sent: false,
    delivered: false,
    created_at: new Date().toISOString() 
  };
  writeTable("course_inquiries", [...rows, row]);
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

export function getPrimebookInquiries(): PrimebookInquiry[] {
  return readTable<PrimebookInquiry>("primebook_inquiries").sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
}

export function addPrimebookInquiry(data: Omit<PrimebookInquiry, "id" | "status" | "created_at" | "confirmation_sent" | "paid" | "invoice_sent" | "delivered">): PrimebookInquiry {
  const rows = readTable<PrimebookInquiry>("primebook_inquiries");
  const row: PrimebookInquiry = { 
    ...data, 
    id: uid(), 
    status: "new", 
    confirmation_sent: false,
    paid: false,
    invoice_sent: false,
    delivered: false,
    created_at: new Date().toISOString() 
  };
  writeTable("primebook_inquiries", [...rows, row]);
  return row;
}

export function updateInquiryFlags(table: string, id: string, flags: any): void {
  const rows = readTable<any>(table);
  writeTable(table, rows.map((r: any) => (r.id === id ? { ...r, ...flags } : r)));
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

export function getContactMessages(): ContactMessage[] {
  return readTable<ContactMessage>("contact_messages").sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
}

export function addContactMessage(data: Omit<ContactMessage, "id" | "status" | "created_at">): ContactMessage {
  const rows = readTable<ContactMessage>("contact_messages");
  const row: ContactMessage = { ...data, id: uid(), status: "new", created_at: new Date().toISOString() };
  writeTable("contact_messages", [...rows, row]);
  return row;
}

// ─── Admin sessions (stateless HMAC — no filesystem writes needed) ────────────

import { createSessionToken, verifySessionToken } from "@/lib/admin/auth";

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

import type { RoboticsComponent } from "@/data/components";
import type { Course } from "@/data/site";

export function getComponents(): RoboticsComponent[] {
  return readTable<RoboticsComponent>("components");
}

export function updateComponent(id: string, updates: Partial<RoboticsComponent>): RoboticsComponent | null {
  const rows = readTable<RoboticsComponent>("components");
  const rowIndex = rows.findIndex(r => r.id === id);
  if (rowIndex === -1) return null;
  rows[rowIndex] = { ...rows[rowIndex], ...updates };
  writeTable("components", rows);
  return rows[rowIndex];
}

// ─── Courses ──────────────────────────────────────────────────────────────────

export function getCourses(): Course[] {
  return readTable<Course>("courses");
}

export function updateCourse(seed: string, updates: Partial<Course>): Course | null {
  const rows = readTable<Course>("courses");
  const rowIndex = rows.findIndex(r => r.seed === seed);
  if (rowIndex === -1) return null;
  rows[rowIndex] = { ...rows[rowIndex], ...updates };
  writeTable("courses", rows);
  return rows[rowIndex];
}
