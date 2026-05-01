-- ============================================================
-- Robokorda Africa — robokorda schema migration v2
-- Run this in your Supabase SQL editor (Table Editor → SQL).
--
-- IMPORTANT — before running this, you must expose the schema
-- to PostgREST.  In your self-hosted docker-compose.yml, find
-- the `rest` service and add robokorda to PGRST_DB_SCHEMAS:
--
--   environment:
--     PGRST_DB_SCHEMAS: "public,graphql_public,robokorda"
--
-- Then restart the rest container:
--   docker compose restart rest
--
-- After that, run this SQL and then run the seed script.
-- ============================================================

CREATE SCHEMA IF NOT EXISTS robokorda;

-- ─── Grant all roles access to the schema ────────────────────────────────────
-- PostgREST uses the anon/authenticated/service_role postgres roles.
-- Even though service_role bypasses RLS, it still needs USAGE on a custom schema.

GRANT USAGE ON SCHEMA robokorda TO anon, authenticated, service_role;

GRANT ALL ON ALL TABLES    IN SCHEMA robokorda TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA robokorda TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES  IN SCHEMA robokorda TO anon, authenticated, service_role;

-- Auto-grant for any future tables created in the schema
ALTER DEFAULT PRIVILEGES IN SCHEMA robokorda
  GRANT ALL ON TABLES    TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA robokorda
  GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

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
CREATE TABLE IF NOT EXISTS robokorda.admins (
  id            SERIAL PRIMARY KEY,
  username      TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Re-grant after table creation ───────────────────────────────────────────
GRANT ALL ON ALL TABLES    IN SCHEMA robokorda TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA robokorda TO anon, authenticated, service_role;

-- ─── Row-Level Security ───────────────────────────────────────────────────────
-- All server-side DB access uses the service role key which BYPASSES RLS.
-- Enable RLS so the anon key never has direct table access without a policy.

ALTER TABLE robokorda.settings            ENABLE ROW LEVEL SECURITY;
ALTER TABLE robokorda.gallery             ENABLE ROW LEVEL SECURITY;
ALTER TABLE robokorda.rirc_registrations  ENABLE ROW LEVEL SECURITY;
ALTER TABLE robokorda.component_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE robokorda.course_inquiries    ENABLE ROW LEVEL SECURITY;
ALTER TABLE robokorda.primebook_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE robokorda.contact_messages    ENABLE ROW LEVEL SECURITY;
ALTER TABLE robokorda.components          ENABLE ROW LEVEL SECURITY;
ALTER TABLE robokorda.courses             ENABLE ROW LEVEL SECURITY;
ALTER TABLE robokorda.page_content        ENABLE ROW LEVEL SECURITY;
ALTER TABLE robokorda.admins              ENABLE ROW LEVEL SECURITY;

-- NOTE: Storage bucket creation is done separately via the script:
--   node --env-file=.env.local scripts/setup-supabase.mjs
