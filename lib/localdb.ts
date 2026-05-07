/**
 * File-based data layer — no Supabase required.
 * All data is stored in JSON files under the /data directory.
 * This runs on the server (Node.js), so fs is available.
 */

import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function readAll<T>(file: string): T[] {
  try {
    const fp = path.join(DATA_DIR, file);
    if (!fs.existsSync(fp)) return [];
    const raw = fs.readFileSync(fp, "utf-8").trim();
    if (!raw || raw === "") return [];
    return JSON.parse(raw) as T[];
  } catch {
    return [];
  }
}

function writeAll<T>(file: string, data: T[]): void {
  const fp = path.join(DATA_DIR, file);
  fs.writeFileSync(fp, JSON.stringify(data, null, 2), "utf-8");
}

function append<T>(file: string, record: T): T {
  const all = readAll<T>(file);
  all.push(record);
  writeAll(file, all);
  return record;
}

function updateById<T extends { id: string }>(
  file: string,
  id: string,
  fields: Partial<T>,
): void {
  const all = readAll<T>(file);
  const idx = all.findIndex((r) => r.id === id);
  if (idx !== -1) all[idx] = { ...all[idx], ...fields };
  writeAll(file, all);
}

// ─── RIRC Registrations ────────────────────────────────────────────────────

export type RircRegistration = {
  id: string;
  school_name: string;
  team_name: string;
  contact_name: string;
  email: string;
  phone: string;
  whatsapp?: string;
  country: string;
  city: string;
  track: string;
  category: string;
  team_size: string;
  team_members: string;
  notes: string;
  status: string;
  confirmation_sent?: boolean;
  paid?: boolean;
  invoice_sent?: boolean;
  delivered?: boolean;
  created_at: string;
};

export function getRircRegistrations(): RircRegistration[] {
  return readAll<RircRegistration>("rirc_registrations.json");
}

export function addRircRegistration(
  data: Omit<RircRegistration, "id" | "status" | "created_at">,
): RircRegistration {
  return append<RircRegistration>("rirc_registrations.json", {
    ...data,
    id: uid(),
    status: "pending",
    confirmation_sent: false,
    paid: false,
    invoice_sent: false,
    delivered: false,
    created_at: new Date().toISOString(),
  });
}

export function updateRircStatus(id: string, status: string): void {
  updateById<RircRegistration>("rirc_registrations.json", id, { status } as Partial<RircRegistration>);
}

export function updateRircFlags(id: string, flags: Partial<RircRegistration>): void {
  updateById<RircRegistration>("rirc_registrations.json", id, flags);
}

// ─── Contact Messages ──────────────────────────────────────────────────────

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
  return readAll<ContactMessage>("contact_messages.json");
}

export function addContactMessage(
  data: Omit<ContactMessage, "id" | "status" | "created_at">,
): ContactMessage {
  return append<ContactMessage>("contact_messages.json", {
    ...data,
    id: uid(),
    status: "new",
    created_at: new Date().toISOString(),
  });
}

// ─── Course Inquiries ──────────────────────────────────────────────────────

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
  created_at: string;
};

export function getCourseInquiries(): CourseInquiry[] {
  return readAll<CourseInquiry>("course_inquiries.json");
}

export function addCourseInquiry(
  data: Omit<CourseInquiry, "id" | "status" | "created_at">,
): CourseInquiry {
  return append<CourseInquiry>("course_inquiries.json", {
    ...data,
    id: uid(),
    status: "new",
    confirmation_sent: false,
    paid: false,
    created_at: new Date().toISOString(),
  });
}

// ─── PrimeBook Inquiries ───────────────────────────────────────────────────

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
  return readAll<PrimebookInquiry>("primebook_inquiries.json");
}

export function addPrimebookInquiry(
  data: Omit<PrimebookInquiry, "id" | "status" | "created_at">,
): PrimebookInquiry {
  return append<PrimebookInquiry>("primebook_inquiries.json", {
    ...data,
    id: uid(),
    status: "new",
    confirmation_sent: false,
    paid: false,
    invoice_sent: false,
    delivered: false,
    created_at: new Date().toISOString(),
  });
}

// ─── Component / Shop Inquiries ────────────────────────────────────────────

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

export function getComponentInquiries(): ComponentInquiry[] {
  return readAll<ComponentInquiry>("component_inquiries.json");
}

export function addComponentInquiry(
  data: Omit<ComponentInquiry, "id" | "status" | "created_at">,
): ComponentInquiry {
  return append<ComponentInquiry>("component_inquiries.json", {
    ...data,
    id: uid(),
    status: "new",
    confirmation_sent: false,
    paid: false,
    invoice_sent: false,
    delivered: false,
    created_at: new Date().toISOString(),
  });
}

// ─── Shop Orders (checkout) ────────────────────────────────────────────────

export type ShopOrder = {
  id: string;
  order_ref: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  delivery_method: string;
  payment_method: string;
  items: string; // JSON string of cart items
  total_usd: number;
  status: string;
  created_at: string;
};

export function getShopOrders(): ShopOrder[] {
  return readAll<ShopOrder>("shop_orders.json");
}

export function addShopOrder(
  data: Omit<ShopOrder, "id" | "status" | "created_at">,
): ShopOrder {
  return append<ShopOrder>("shop_orders.json", {
    ...data,
    id: uid(),
    status: "new",
    created_at: new Date().toISOString(),
  });
}

// ─── Generic status update ─────────────────────────────────────────────────

export function updateInquiryFlags(
  file: string,
  id: string,
  fields: Record<string, unknown>,
): void {
  const all = readAll<{ id: string } & Record<string, unknown>>(file);
  const idx = all.findIndex((r) => r.id === id);
  if (idx !== -1) all[idx] = { ...all[idx], ...fields };
  writeAll(file, all);
}
