/**
 * Seed script — migrates all existing JSON data to Supabase robokorda schema.
 *
 * Usage:
 *   node scripts/seed-supabase.mjs
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in env.
 * Load from .env.local automatically using --env-file flag:
 *   node --env-file=.env.local scripts/seed-supabase.mjs
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// ─── Supabase client ─────────────────────────────────────────────────────────

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error("❌  Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  console.error("    Run with: node --env-file=.env.local scripts/seed-supabase.mjs");
  process.exit(1);
}

const sb = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false },
  db: { schema: "robokorda" },
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

function readJson(relPath) {
  const fp = path.join(ROOT, relPath);
  if (!existsSync(fp)) return null;
  try {
    return JSON.parse(readFileSync(fp, "utf-8"));
  } catch {
    return null;
  }
}

async function upsert(table, rows, label) {
  if (!rows || rows.length === 0) {
    console.log(`  ⚠  ${label}: no rows to seed`);
    return;
  }
  const { error } = await sb.from(table).upsert(rows, { onConflict: "id" });
  if (error) {
    console.error(`  ❌  ${label}: ${error.message}`);
  } else {
    console.log(`  ✓  ${label}: ${rows.length} rows seeded`);
  }
}

async function upsertByKey(table, rows, conflict, label) {
  if (!rows || rows.length === 0) {
    console.log(`  ⚠  ${label}: no rows to seed`);
    return;
  }
  const { error } = await sb.from(table).upsert(rows, { onConflict: conflict });
  if (error) {
    console.error(`  ❌  ${label}: ${error.message}`);
  } else {
    console.log(`  ✓  ${label}: ${rows.length} rows seeded`);
  }
}

// ─── Settings ─────────────────────────────────────────────────────────────────

async function seedSettings() {
  console.log("\n📋  Seeding settings...");
  const raw = readJson("data/settings.json");
  if (!raw) {
    console.log("  ⚠  data/settings.json not found — skipping");
    return;
  }
  const rows = Object.entries(raw).map(([key, value]) => ({ key, value: String(value) }));
  const { error } = await sb.from("settings").upsert(rows, { onConflict: "key" });
  if (error) console.error(`  ❌  settings: ${error.message}`);
  else console.log(`  ✓  settings: ${rows.length} keys seeded`);
}

// ─── Gallery ──────────────────────────────────────────────────────────────────

async function seedGallery() {
  console.log("\n🖼   Seeding gallery...");
  const rows = readJson("data/gallery.json");
  await upsert("gallery", rows, "gallery");
}

// ─── RIRC Registrations ───────────────────────────────────────────────────────

async function seedRircRegistrations() {
  console.log("\n🏆  Seeding RIRC registrations...");
  const rows = readJson("data/rirc_registrations.json");
  await upsert("rirc_registrations", rows, "rirc_registrations");
}

// ─── Component Inquiries ──────────────────────────────────────────────────────

async function seedComponentInquiries() {
  console.log("\n🛒  Seeding component inquiries...");
  const rows = readJson("data/component_inquiries.json");
  await upsert("component_inquiries", rows, "component_inquiries");
}

// ─── Course Inquiries ─────────────────────────────────────────────────────────

async function seedCourseInquiries() {
  console.log("\n📚  Seeding course inquiries...");
  const rows = readJson("data/course_inquiries.json");
  await upsert("course_inquiries", rows, "course_inquiries");
}

// ─── Primebook Inquiries ──────────────────────────────────────────────────────

async function seedPrimebookInquiries() {
  console.log("\n💻  Seeding primebook inquiries...");
  const rows = readJson("data/primebook_inquiries.json");
  await upsert("primebook_inquiries", rows, "primebook_inquiries");
}

// ─── Contact Messages ─────────────────────────────────────────────────────────

async function seedContactMessages() {
  console.log("\n✉️   Seeding contact messages...");
  const rows = readJson("data/contact_messages.json");
  await upsert("contact_messages", rows, "contact_messages");
}

// ─── Components (product catalog) ────────────────────────────────────────────

async function seedComponents() {
  console.log("\n🔧  Seeding components catalog...");
  const raw = readJson("data/components.json");
  if (!raw) {
    console.log("  ⚠  data/components.json not found — skipping");
    return;
  }
  const rows = raw.map(({ id, name, category, priceUSD, priceZWG, imageSrc, shortDescription, status, badge, ...rest }) => ({
    id,
    name: name || "",
    category: category || "",
    price_usd: priceUSD || 0,
    price_zwg: priceZWG || 0,
    image_src: imageSrc || "",
    short_description: shortDescription || "",
    status: status || "in_stock",
    badge: badge || "",
    extra: rest,
  }));
  await upsert("components", rows, "components");
}

// ─── Courses ──────────────────────────────────────────────────────────────────

async function seedCourses() {
  console.log("\n🎓  Seeding courses...");
  const raw = readJson("data/courses.json");
  if (!raw) {
    console.log("  ⚠  data/courses.json not found — skipping");
    return;
  }
  const rows = raw.map(({ seed, title, level, age, duration, deliveryMode, overview, imageSrc, ...rest }) => ({
    seed,
    title: title || "",
    level: level || "",
    age: age || "",
    duration: duration || "",
    delivery_mode: deliveryMode || "",
    overview: overview || [],
    image_src: imageSrc || "",
    extra: rest,
  }));
  await upsertByKey("courses", rows, "seed", "courses");
}

// ─── Page Content ─────────────────────────────────────────────────────────────

async function seedPageContent() {
  console.log("\n📄  Seeding page content...");
  const pages = ["home", "rirc", "prime-book", "shop", "settings"];
  for (const page of pages) {
    const content = readJson(`content/${page}.json`);
    if (!content) {
      console.log(`  ⚠  content/${page}.json not found — skipping`);
      continue;
    }
    const { error } = await sb
      .from("page_content")
      .upsert({ page, content }, { onConflict: "page" });
    if (error) console.error(`  ❌  page_content[${page}]: ${error.message}`);
    else console.log(`  ✓  page_content[${page}]`);
  }
}

// ─── Admin user ───────────────────────────────────────────────────────────────

async function seedAdmin() {
  console.log("\n🔐  Seeding admin user...");
  const adminPassword = process.env.ADMIN_PASSWORD || "robokorda2026";
  const passwordHash = crypto.createHash("sha256").update(adminPassword).digest("hex");
  const { error } = await sb
    .from("admins")
    .upsert({ username: "admin", password_hash: passwordHash }, { onConflict: "username" });
  if (error) console.error(`  ❌  admins: ${error.message}`);
  else console.log(`  ✓  admins: admin user seeded`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🚀  Robokorda Supabase Seed Script");
  console.log("   Target:", supabaseUrl);
  console.log("   Schema: robokorda\n");

  await seedSettings();
  await seedGallery();
  await seedRircRegistrations();
  await seedComponentInquiries();
  await seedCourseInquiries();
  await seedPrimebookInquiries();
  await seedContactMessages();
  await seedComponents();
  await seedCourses();
  await seedPageContent();
  await seedAdmin();

  console.log("\n✅  Seed complete!\n");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
