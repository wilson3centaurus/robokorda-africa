/**
 * Robokorda Supabase Setup Script
 *
 * Run AFTER running the SQL migration in Supabase SQL editor
 * AND after updating PGRST_DB_SCHEMAS in docker-compose.yml.
 *
 * Usage:
 *   node --env-file=.env.local scripts/setup-supabase.mjs
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error("❌  Missing env vars. Run with: node --env-file=.env.local scripts/setup-supabase.mjs");
  process.exit(1);
}

// Use PUBLIC schema client for storage operations
const sbStorage = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false },
});

// Use robokorda schema client for DB operations
const sbDb = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false },
  db: { schema: "robokorda" },
});

console.log("🔧  Robokorda Supabase Setup");
console.log("   URL:", supabaseUrl, "\n");

// ─── 1. Test schema access ────────────────────────────────────────────────────

async function testSchemaAccess() {
  console.log("1️⃣   Testing robokorda schema access...");
  const { data, error } = await sbDb.from("settings").select("key").limit(1);
  if (error) {
    console.error("  ❌  Cannot access robokorda.settings:", error.message);
    if (error.message.includes("permission denied")) {
      console.error("\n  👉  The schema exists but roles lack permission. Run this SQL in the Supabase SQL editor:");
      console.error("        GRANT USAGE ON SCHEMA robokorda TO anon, authenticated, service_role;");
      console.error("        GRANT ALL ON ALL TABLES IN SCHEMA robokorda TO anon, authenticated, service_role;");
      console.error("        GRANT ALL ON ALL SEQUENCES IN SCHEMA robokorda TO anon, authenticated, service_role;");
    } else {
      console.error("\n  👉  Add robokorda to PGRST_DB_SCHEMAS in .env on the server, then restart:");
      console.error('        PGRST_DB_SCHEMAS=public,graphql_public,robokorda');
      console.error("        docker compose restart rest\n");
    }
    return false;
  }
  console.log("  ✅  robokorda schema is accessible via PostgREST");
  return true;
}

// ─── 2. Create/verify storage bucket ─────────────────────────────────────────

async function setupStorageBucket() {
  console.log("\n2️⃣   Setting up storage bucket...");

  // Check if bucket exists
  const { data: buckets, error: listErr } = await sbStorage.storage.listBuckets();
  if (listErr) {
    console.error("  ❌  Cannot list buckets:", listErr.message);
    console.error("      Make sure storage is enabled and the service key is correct.");
    return false;
  }

  const existing = buckets?.find((b) => b.id === "robokorda");
  if (existing) {
    console.log("  ✅  Bucket 'robokorda' already exists");
    return true;
  }

  // Create it
  const { error: createErr } = await sbStorage.storage.createBucket("robokorda", {
    public: true,
    fileSizeLimit: 10 * 1024 * 1024, // 10 MB
    allowedMimeTypes: [
      "image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml",
      "video/mp4", "video/webm", "video/quicktime",
      "application/pdf",
    ],
  });

  if (createErr) {
    console.error("  ❌  Failed to create bucket:", createErr.message);
    return false;
  }

  console.log("  ✅  Bucket 'robokorda' created (public, 10 MB limit)");
  return true;
}

// ─── 3. Test write access ─────────────────────────────────────────────────────

async function testWriteAccess() {
  console.log("\n3️⃣   Testing write access (upsert test row)...");
  const { error } = await sbDb
    .from("settings")
    .upsert({ key: "__setup_test__", value: new Date().toISOString() });
  if (error) {
    console.error("  ❌  Write failed:", error.message);
    return false;
  }
  // Clean up
  await sbDb.from("settings").delete().eq("key", "__setup_test__");
  console.log("  ✅  Write + delete test passed");
  return true;
}

// ─── 4. Test storage upload ───────────────────────────────────────────────────

async function testStorageUpload() {
  console.log("\n4️⃣   Testing storage upload...");
  // Minimal 1×1 transparent PNG — valid image/png, keeps within allowed MIME types
  const PNG_1X1 = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    "base64",
  );
  const testPath = "uploads/general/__setup_test.png";

  const { error: upErr } = await sbStorage.storage
    .from("robokorda")
    .upload(testPath, PNG_1X1, {
      contentType: "image/png",
      upsert: true,
    });

  if (upErr) {
    console.error("  ❌  Storage upload failed:", upErr.message);
    return false;
  }

  const { data: urlData } = sbStorage.storage.from("robokorda").getPublicUrl(testPath);
  console.log("  ✅  Storage upload works. Public URL:", urlData.publicUrl);

  // Clean up
  await sbStorage.storage.from("robokorda").remove([testPath]);
  return true;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  let allOk = true;

  const schemaOk = await testSchemaAccess();
  if (!schemaOk) allOk = false;

  const bucketOk = await setupStorageBucket();
  if (!bucketOk) allOk = false;

  if (schemaOk) {
    const writeOk = await testWriteAccess();
    if (!writeOk) allOk = false;
  }

  if (bucketOk) {
    const storageOk = await testStorageUpload();
    if (!storageOk) allOk = false;
  }

  console.log("\n" + (allOk
    ? "✅  All checks passed! Your Supabase is ready.\n   Next: node --env-file=.env.local scripts/seed-supabase.mjs"
    : "⚠️   Some checks failed. Fix the issues above and re-run this script."));
}

main().catch((e) => { console.error("Fatal:", e); process.exit(1); });
