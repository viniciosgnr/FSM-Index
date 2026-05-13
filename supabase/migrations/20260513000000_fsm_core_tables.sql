-- ============================================================
-- FSM Index — Core Schema
-- Migration: 20260513000000_fsm_core_tables.sql
-- Project: FSM Index (Supabase: zwrfxfbtdwzaerxdcgnr)
-- ============================================================

-- ── 1. Regions (FPSO units) ───────────────────────────────
CREATE TABLE IF NOT EXISTS fsm_regions (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code       TEXT NOT NULL UNIQUE,   -- e.g. 'CDA', 'CDI'
  name       TEXT NOT NULL,          -- e.g. 'FPSO CDA'
  active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE fsm_regions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "fsm_regions: authenticated read"
  ON fsm_regions FOR SELECT
  TO authenticated USING (TRUE);

-- ── 2. Ingestion Logs (audit trail) ──────────────────────
CREATE TABLE IF NOT EXISTS fsm_ingestion_logs (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source       TEXT NOT NULL DEFAULT 'manual', -- manual | csv | api
  status       TEXT NOT NULL DEFAULT 'pending', -- pending | success | error
  record_count INTEGER,
  error_msg    TEXT,
  started_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  finished_at  TIMESTAMPTZ
);

ALTER TABLE fsm_ingestion_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "fsm_ingestion_logs: authenticated read"
  ON fsm_ingestion_logs FOR SELECT
  TO authenticated USING (TRUE);

-- ── 3. Work Orders (raw IFS data) ────────────────────────
CREATE TABLE IF NOT EXISTS fsm_work_orders (
  id                     TEXT PRIMARY KEY,          -- IFS WO ID
  region_id              UUID NOT NULL REFERENCES fsm_regions(id),
  original_latest_finish DATE NOT NULL,             -- OLF: planning base
  latest_finish          DATE NOT NULL,             -- current scheduled
  actual_finish          DATE,                      -- NULL if not completed
  status                 TEXT NOT NULL,             -- WORK DONE | FINISH | REPORTED | ...
  is_postponed           BOOLEAN NOT NULL DEFAULT FALSE,
  has_faa                BOOLEAN NOT NULL DEFAULT FALSE,
  reference_month        DATE NOT NULL,             -- YYYY-MM-01 derived from OLF
  ingestion_id           UUID REFERENCES fsm_ingestion_logs(id),
  created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_fsm_wo_region_month
  ON fsm_work_orders (region_id, reference_month);

CREATE INDEX IF NOT EXISTS idx_fsm_wo_reference_month
  ON fsm_work_orders (reference_month);

ALTER TABLE fsm_work_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "fsm_work_orders: authenticated read"
  ON fsm_work_orders FOR SELECT
  TO authenticated USING (TRUE);

-- ── 4. Monthly Snapshots (pre-calculated PTCI/MCI) ───────
-- One row per (region, reference_month) for the fleet view.
-- NULL region_id = fleet-wide aggregate row.
CREATE TABLE IF NOT EXISTS fsm_snapshots (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  region_id           UUID REFERENCES fsm_regions(id), -- NULL = fleet aggregate
  reference_month     DATE NOT NULL,                   -- YYYY-MM-01
  planejadas          INTEGER NOT NULL DEFAULT 0,
  executadas_no_prazo INTEGER NOT NULL DEFAULT 0,
  fora_do_prazo       INTEGER NOT NULL DEFAULT 0,
  overdue             INTEGER NOT NULL DEFAULT 0,
  exec_antecipadas    INTEGER NOT NULL DEFAULT 0,
  mitigacoes          INTEGER NOT NULL DEFAULT 0,
  faa                 INTEGER NOT NULL DEFAULT 0,
  ptci                NUMERIC(5,2) NOT NULL DEFAULT 0, -- 0.00–100.00
  mci                 NUMERIC(5,2) NOT NULL DEFAULT 0,
  faai                NUMERIC(5,2) NOT NULL DEFAULT 0,
  calculated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ingestion_id        UUID REFERENCES fsm_ingestion_logs(id),
  -- enforce uniqueness: one snapshot per region (or fleet) per month
  UNIQUE (region_id, reference_month)
);

-- Partial unique index for fleet rows (region_id IS NULL)
CREATE UNIQUE INDEX IF NOT EXISTS idx_fsm_snapshots_fleet_month
  ON fsm_snapshots (reference_month)
  WHERE region_id IS NULL;

CREATE INDEX IF NOT EXISTS idx_fsm_snapshots_region_month
  ON fsm_snapshots (region_id, reference_month);

ALTER TABLE fsm_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "fsm_snapshots: authenticated read"
  ON fsm_snapshots FOR SELECT
  TO authenticated USING (TRUE);

-- ── 5. Per-FPSO monthly detail (Panel 2 data) ────────────
-- Stores the per-unit percentage and counts for Panel 2.
-- This is derived from fsm_snapshots but kept denormalized for
-- fast frontend reads without joins.
CREATE TABLE IF NOT EXISTS fsm_fpso_monthly (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  region_id       UUID NOT NULL REFERENCES fsm_regions(id),
  reference_month DATE NOT NULL,           -- YYYY-MM-01
  pct_no_prazo    NUMERIC(5,2),            -- NULL = no WOs planned that month
  realizadas      INTEGER NOT NULL DEFAULT 0,
  planejadas      INTEGER NOT NULL DEFAULT 0,
  antecipadas     INTEGER NOT NULL DEFAULT 0,
  calculated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (region_id, reference_month)
);

CREATE INDEX IF NOT EXISTS idx_fsm_fpso_monthly_region
  ON fsm_fpso_monthly (region_id, reference_month);

ALTER TABLE fsm_fpso_monthly ENABLE ROW LEVEL SECURITY;

CREATE POLICY "fsm_fpso_monthly: authenticated read"
  ON fsm_fpso_monthly FOR SELECT
  TO authenticated USING (TRUE);
