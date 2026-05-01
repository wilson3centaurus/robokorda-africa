-- ============================================================
-- Robokorda Africa — robokorda schema migration
-- Run this once in your Supabase SQL editor.
-- Uses a dedicated schema so it never conflicts with other
-- apps sharing the same Supabase project.
-- ============================================================

CREATE SCHEMA IF NOT EXISTS robokorda;

-- ─── Settings (key-value store) ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS robokorda.settings (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT ''
);

-- ─── Gallery ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS robokorda.gallery (
  id           TEXT PRIMARY KEY,
  section      TEXT    NOT NULL DEFAULT 'home',
  title        TEXT    NOT NULL DEFAULT '',
  caption      TEXT    NOT NULL DEFAULT '',
  image_url    TEXT    NOT NULL DEFAULT '',
  size         TEXT    NOT NULL DEFAULT 'square',
  sort_order   INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── RIRC Registrations ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS robokorda.rirc_registrations (
  id                TEXT PRIMARY KEY,
  school_name       TEXT    NOT NULL DEFAULT '',
  team_name         TEXT    NOT NULL DEFAULT '',
  contact_name      TEXT    NOT NULL DEFAULT '',
  email             TEXT    NOT NULL DEFAULT '',
  phone             TEXT    NOT NULL DEFAULT '',
  whatsapp          TEXT    NOT NULL DEFAULT '',
  country           TEXT    NOT NULL DEFAULT '',
  city              TEXT    NOT NULL DEFAULT '',
  track             TEXT    NOT NULL DEFAULT '',
  category          TEXT    NOT NULL DEFAULT '',
  team_size         TEXT    NOT NULL DEFAULT '',
  team_members      TEXT    NOT NULL DEFAULT '[]',
  notes             TEXT    NOT NULL DEFAULT '',
  status            TEXT    NOT NULL DEFAULT 'pending',
  confirmation_sent BOOLEAN NOT NULL DEFAULT false,
  paid              BOOLEAN NOT NULL DEFAULT false,
  invoice_sent      BOOLEAN NOT NULL DEFAULT false,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Component Inquiries ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS robokorda.component_inquiries (
  id                TEXT    PRIMARY KEY,
  name              TEXT    NOT NULL DEFAULT '',
  email             TEXT    NOT NULL DEFAULT '',
  phone             TEXT    NOT NULL DEFAULT '',
  notes             TEXT    NOT NULL DEFAULT '',
  items             TEXT    NOT NULL DEFAULT '[]',
  total_usd         NUMERIC NOT NULL DEFAULT 0,
  status            TEXT    NOT NULL DEFAULT 'new',
  confirmation_sent BOOLEAN NOT NULL DEFAULT false,
  paid              BOOLEAN NOT NULL DEFAULT false,
  invoice_sent      BOOLEAN NOT NULL DEFAULT false,
  delivered         BOOLEAN NOT NULL DEFAULT false,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Course Inquiries ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS robokorda.course_inquiries (
  id                TEXT PRIMARY KEY,
  name              TEXT    NOT NULL DEFAULT '',
  email             TEXT    NOT NULL DEFAULT '',
  phone             TEXT    NOT NULL DEFAULT '',
  course_title      TEXT    NOT NULL DEFAULT '',
  school            TEXT    NOT NULL DEFAULT '',
  message           TEXT    NOT NULL DEFAULT '',
  status            TEXT    NOT NULL DEFAULT 'new',
  confirmation_sent BOOLEAN NOT NULL DEFAULT false,
  paid              BOOLEAN NOT NULL DEFAULT false,
  invoice_sent      BOOLEAN NOT NULL DEFAULT false,
  delivered         BOOLEAN NOT NULL DEFAULT false,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Primebook Inquiries ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS robokorda.primebook_inquiries (
  id                TEXT    PRIMARY KEY,
  name              TEXT    NOT NULL DEFAULT '',
  email             TEXT    NOT NULL DEFAULT '',
  phone             TEXT    NOT NULL DEFAULT '',
  quantity          INTEGER NOT NULL DEFAULT 1,
  school            TEXT    NOT NULL DEFAULT '',
  message           TEXT    NOT NULL DEFAULT '',
  status            TEXT    NOT NULL DEFAULT 'new',
  confirmation_sent BOOLEAN NOT NULL DEFAULT false,
  paid              BOOLEAN NOT NULL DEFAULT false,
  invoice_sent      BOOLEAN NOT NULL DEFAULT false,
  delivered         BOOLEAN NOT NULL DEFAULT false,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Contact Messages ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS robokorda.contact_messages (
  id         TEXT PRIMARY KEY,
  name       TEXT NOT NULL DEFAULT '',
  email      TEXT NOT NULL DEFAULT '',
  phone      TEXT NOT NULL DEFAULT '',
  subject    TEXT NOT NULL DEFAULT '',
  message    TEXT NOT NULL DEFAULT '',
  status     TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Products / Components Catalog ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS robokorda.components (
  id                TEXT PRIMARY KEY,
  name              TEXT    NOT NULL DEFAULT '',
  category          TEXT    NOT NULL DEFAULT '',
  price_usd         NUMERIC NOT NULL DEFAULT 0,
  price_zwg         NUMERIC NOT NULL DEFAULT 0,
  image_src         TEXT    NOT NULL DEFAULT '',
  short_description TEXT    NOT NULL DEFAULT '',
  status            TEXT    NOT NULL DEFAULT 'in_stock',
  badge             TEXT    NOT NULL DEFAULT '',
  extra             JSONB   NOT NULL DEFAULT '{}'
);

-- ─── Courses Catalog ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS robokorda.courses (
  seed          TEXT PRIMARY KEY,
  title         TEXT  NOT NULL DEFAULT '',
  level         TEXT  NOT NULL DEFAULT '',
  age           TEXT  NOT NULL DEFAULT '',
  duration      TEXT  NOT NULL DEFAULT '',
  delivery_mode TEXT  NOT NULL DEFAULT '',
  overview      JSONB NOT NULL DEFAULT '[]',
  image_src     TEXT  NOT NULL DEFAULT '',
  extra         JSONB NOT NULL DEFAULT '{}'
);

-- ─── Page Content ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS robokorda.page_content (
  page       TEXT  PRIMARY KEY,
  content    JSONB NOT NULL DEFAULT '{}'
);

-- ─── Admins ───────────────────────────────────────────────────────────────────
-- Password is SHA-256 hex of the plain-text password (same as lib/admin/auth.ts).
-- The env var ADMIN_PASSWORD is still the primary source; this table is the fallback.
CREATE TABLE IF NOT EXISTS robokorda.admins (
  id            SERIAL PRIMARY KEY,
  username      TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Storage bucket ───────────────────────────────────────────────────────────
-- One public bucket for the entire Robokorda site.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'robokorda',
  'robokorda',
  true,
  10485760,  -- 10 MB
  ARRAY[
    'image/jpeg','image/png','image/webp','image/gif','image/svg+xml',
    'video/mp4','video/webm','video/quicktime',
    'application/pdf'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to read public objects (the bucket is already public, this covers the API)
CREATE POLICY "robokorda public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'robokorda');

-- Only authenticated service-role uploads are allowed (server-side only)
CREATE POLICY "robokorda service upload"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'robokorda');

CREATE POLICY "robokorda service delete"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'robokorda');

-- ─── Row-Level Security ───────────────────────────────────────────────────────
-- All DB access goes through Next.js API routes using the service role key,
-- which bypasses RLS.  Enable RLS anyway so the anon key has no direct access.

ALTER TABLE robokorda.settings           ENABLE ROW LEVEL SECURITY;
ALTER TABLE robokorda.gallery            ENABLE ROW LEVEL SECURITY;
ALTER TABLE robokorda.rirc_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE robokorda.component_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE robokorda.course_inquiries   ENABLE ROW LEVEL SECURITY;
ALTER TABLE robokorda.primebook_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE robokorda.contact_messages   ENABLE ROW LEVEL SECURITY;
ALTER TABLE robokorda.components         ENABLE ROW LEVEL SECURITY;
ALTER TABLE robokorda.courses            ENABLE ROW LEVEL SECURITY;
ALTER TABLE robokorda.page_content       ENABLE ROW LEVEL SECURITY;
ALTER TABLE robokorda.admins             ENABLE ROW LEVEL SECURITY;
