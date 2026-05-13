<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# FSM Index — Master Specification & Agent Guidelines

> **Project**: FSM Index (Functional Safety Management Index)
> **Client**: SBM Offshore
> **Team**: Change Management & Maintenance
> **Status**: 🟡 In Specification

---

## 1. Project Overview

The **FSM Index** is an internal web application built for SBM Offshore's Change Management and Maintenance team. Its goal is to **collect SIF (Safety Instrumented Function) work order data from the IFS maintenance system**, process it, and **generate a visual FSM Index dashboard** with KPIs that support decision-making for functional safety compliance monitoring.

### 1.1 Problem Statement

SBM Offshore's SIF proof tests are tracked manually via IFS, but there is no consolidated, real-time view of compliance performance across the fleet. The FSM Index automates this consolidation, enabling the team to monitor test execution compliance (PTCI) and mitigation quality (MCI) monthly, with full audit traceability.

### 1.2 Core Objectives

- Integrate with **IFS** to collect SIF Work Order data
- Calculate the **PTCI** and **MCI** indices using business rules defined below
- Present results in a **monthly, interactive dashboard** per region/vessel
- Track trends over time with historical snapshots
- Support the Change Management team's operational and audit needs
- Lay groundwork for future **AI/ML integration** (LangGraph, LangChain)

### 1.3 Target Users

| Role | Description |
|------|-------------|
| Change Management Analyst | Primary user; monitors PTCI/MCI trends and overdue SIF tests |
| Maintenance Engineer | Reviews work order execution data and completion rates |
| Operations Manager | Consumes high-level KPI dashboards per region/vessel |
| Technical Support Team | Monitors FAA (Functional Failure Actions) |
| System Administrator | Manages users, permissions, and data ingestion config |

---

## 2. FSM Index — Business Logic

> ⚠️ **Critical**: This section defines the core domain. All agents must read and fully understand this before writing any calculation, query, or display logic.

### 2.1 Core KPIs

The FSM Index is composed of **two complementary KPIs**:

#### 2.1.1 PTCI — Proof Test Compliance Index

Measures what percentage of planned SIF proof tests were actually executed.

```
PTCI (%) = [1 - (WO not executed proof tests / Total WO proof tests)] × 100
```

Where:
- **Total WO proof tests** = Work Orders with `ORIGINAL_LATEST_FINISH` within the reference month (*"Planejadas (OLF no mês)"*)
- **WO not executed proof tests** = `Overdue + FAA`

> ⚠️ **Mitigation WOs are excluded from Overdue** — they do not penalize the PTCI.
> ⚠️ **Anticipated executions** (Exec. antecipadas) are **informational only** — they do NOT count toward the current month's PTCI.

#### 2.1.2 MCI — Mitigation Compliance Index

Measures how well unexecuted tests are being formally managed via mitigations.

```
MCI (%) = [1 - (Number of mitigations / WO not executed proof tests)] × 100
```

Where:
- **Number of mitigations** = WOs formally postponed via Change Request (CR) or Risk Analysis (ORA)
- **WO not executed proof tests** = `Overdue + FAA` (same denominator as PTCI)

---

### 2.2 Work Order Classification

Each SIF Work Order is classified into **one of the following categories** per reference month. The classification is **mutually exclusive** (except Exec. antecipadas which is informational).

| Category | Portuguese Label | Definition | IFS Parameters |
|----------|-----------------|------------|----------------|
| **Planned** | Planejadas (OLF no mês) | WOs with `ORIGINAL_LATEST_FINISH` within the reference month | `ORIGINAL_LATEST_FINISH` ∈ [start_of_month, end_of_month] |
| **Executed on time** | Executadas no prazo | Planned WOs completed within the reference month | STATUS ∈ {`WORK DONE`, `FINISH`, `REPORTED`} AND completion date ≤ end_of_month |
| **Executed late** | Fora do prazo | WOs executed but after the reference month deadline | STATUS ∈ {`WORK DONE`, `FINISH`, `REPORTED`} AND completion date > end_of_month |
| **Overdue** | Overdue | Planned WOs not executed and not formally mitigated | `ORIGINAL_LATEST_FINISH` ∈ month AND STATUS ∉ done states AND `IS_POSTPONED` = FALSE |
| **Anticipated** | Exec. antecipadas (+info) | WOs with OLF in a **future** month, but executed early in the current month | STATUS ∈ done states AND `ORIGINAL_LATEST_FINISH` > end_of_month |
| **Mitigation** | Mitigações | WOs formally postponed via CR or ORA | `LATEST_FINISH` ≠ `ORIGINAL_LATEST_FINISH` OR `IS_POSTPONED` = TRUE |
| **FAA** | FAA | WOs where a test was performed but a functional failure was detected | FAA record linked to the WO (auto-opened via checklist on failure) |

**STATUS values that confirm test completion**: `WORK DONE`, `FINISH`, `REPORTED`

---

### 2.3 FAA (Functional Failure Action) Rules

- All SIF Work Orders should be classified as **P1 - AA** (Priority 1 - Automatic Action)
- When a proof test is performed and **fails**, the technician fills a checklist
- Upon reporting the failure in the checklist, an **FAA is automatically opened** in IFS
- The original WO that was closed with a failure report **does NOT count as Overdue** — it becomes an FAA
- FAA WOs must be monitored separately and reported to the Technical Support team
- FAA does NOT penalize the Overdue count, but IS included in "WO not executed proof tests" for PTCI/MCI calculation
- **FAA and Mitigation are mutually exclusive**: a WO that triggered a FAA (test attempted but failed) cannot simultaneously be a Mitigation (test formally postponed without attempt). They represent opposite outcomes.

---

### 2.4 Mitigation Rules

A SIF test is considered "mitigated" when it is formally postponed due to:
- **CR (Change Request)**: Systemic change that prevents execution
- **ORA (Risk Analysis)**: Technical impossibility to perform the test

**Detection in IFS**:
- In **Work Tasks** transaction: `LATEST_FINISH` ≠ `ORIGINAL_LATEST_FINISH`
- In **Active Work Orders** transaction: `IS_POSTPONED` = `TRUE`

> Mitigations must be formally documented. Informal delays are classified as Overdue.

---

### 2.5 IFS Data Parameters

| IFS Parameter | Transaction | Type | Description |
|---------------|-------------|------|-------------|
| `ORIGINAL_LATEST_FINISH` | Work Tasks / Active Work Orders | Date | Original planned completion date. **Key field for planning base.** |
| `ACTUAL_FINISH` | Work Tasks / Active Work Orders | Date | Actual date when the WO was completed. Used to determine on-time vs late execution. |
| `LATEST_FINISH` | Work Tasks | Date | Current planned completion date. If ≠ `ORIGINAL_LATEST_FINISH`, WO was postponed. |
| `IS_POSTPONED` | Active Work Orders | Boolean | TRUE when the WO was formally postponed. |
| `STATUS` | Work Tasks / Active Work Orders | Enum | Execution status. Done states: `WORK DONE`, `FINISH`, `REPORTED` |
| `ACTUAL_OBJECT_SITE` | Work Tasks / Active Work Orders | String | The FPSO/vessel unit the WO belongs to. Used for Panel 2 (per-unit view). |
| WO Type / Priority | Active Work Orders | String | SIF WOs should be P1 - AA |

> **Execution criteria**: `ACTUAL_FINISH` must be populated AND STATUS ∈ {`WORK DONE`, `FINISH`, `REPORTED`}.
> **On-time criterion**: `ACTUAL_FINISH` ≤ `ORIGINAL_LATEST_FINISH` (within the planned month).

---

### 2.6 Reference Period Logic

- The **base month** is determined by `ORIGINAL_LATEST_FINISH` (OLF), not by `LATEST_FINISH`
- A WO "belongs" to the month in which it was **originally planned**, regardless of when it is executed
- Anticipated executions (executed before OLF month) are credited to the **OLF month**, not the execution month
- Critical months: PTCI < 80% requires investigation and justification

---

### 2.7 Dashboard Panel 1 — Monthly PTCI (Fleet View)

The primary dashboard view is a **monthly time series** table for the whole fleet, showing all categories:

| Row | Portuguese Label | PTCI Impact | Description |
|-----|-----------------|-------------|-------------|
| Planejadas (OLF no mês) | Planejadas | Base denominator | WOs with OLF within the reference month |
| Executadas no prazo | Executadas no prazo | ✅ Positive | STATUS done AND `ACTUAL_FINISH` ≤ end of month |
| Fora do prazo | Fora do prazo | ℹ️ Informational only | STATUS done AND `ACTUAL_FINISH` > end of month — **does NOT impact PTCI** |
| Overdue | Overdue | ❌ Penalizes PTCI | Planned, not done, not mitigated |
| Exec. antecipadas (+info) | Exec. antecipadas (+info) | ℹ️ Informational only | Executed in current month but OLF is in a future month — **does NOT count toward current month's PTCI** |
| Mitigações | Mitigações | ⚠️ Affects MCI only | Formally postponed via CR or ORA |
| FAA | FAA | ❌ Penalizes PTCI | Test performed but failure detected |
| **PTCI %** | PTCI % | — | `[1 - (Overdue + FAA) / Planejadas] × 100` |
| **MCI %** | MCI % | — | `[1 - (Mitigações / (Overdue + FAA))] × 100` |

**Color coding rules**:
- 🟢 Green: PTCI ≥ 95%
- 🟡 Yellow/Amber: 80% ≤ PTCI < 95%
- 🔴 Red: PTCI < 80% ← critical month, requires investigation and justification

---

### 2.8 Dashboard Panel 2 — PTCI per FPSO Unit

A second view showing **PTCI broken down per FPSO unit** (`ACTUAL_OBJECT_SITE`), with the same monthly time series layout.

**FPSO units in scope for Phase 1**:

| Code | Unit |
|------|------|
| CDA | FPSO CDA |
| CDI | FPSO CDI |
| CDS | FPSO CDS |
| CDM | FPSO CDM |
| CDP | FPSO CDP |
| ADG | FPSO ADG |
| SEP | FPSO SEP |
| ATD | FPSO ATD |
| ESS | FPSO ESS |

**Panel 2 rows per unit**:

| Row | Description |
|-----|-------------|
| % no prazo | PTCI percentage for the unit in the month |
| Qtd (realizadas/planejadas) | Count format: `realized / planned` with `(-anticipated)` delta in parentheses |

> **Criteria** (confirmed by team): period = `ORIGINAL_LATEST_FINISH`; unit = `ACTUAL_OBJECT_SITE`; realized = `ACTUAL_FINISH` populated AND STATUS ∈ {`FINISHED`, `WORK DONE`, `REPORTED`}; on-time = `ACTUAL_FINISH` ≤ `ORIGINAL_LATEST_FINISH`.

---

### 2.9 Data Ingestion Method

- **Phase 1 (current)**: Mock data — the application will use seed data that mirrors IFS structure. No real IFS connection needed for development.
- **Target**: Direct integration with IFS (REST API or database connection) — exact method TBD with IFS Admin.
- **IFS transactions involved**: `Work Tasks`, `Active Work Orders`
- **Minimum required fields from IFS**: `ORIGINAL_LATEST_FINISH`, `ACTUAL_FINISH`, `STATUS`, `LATEST_FINISH`, `IS_POSTPONED`, `ACTUAL_OBJECT_SITE`
- **Frequency**: Monthly extraction (or on-demand)
- **Future**: Scheduled automated ingestion (Phase 2)

---

## 3. Architecture

### 3.1 Overview

The FSM Index follows **Clean Architecture** with **SOLID principles**, organized into clearly separated layers. No layer may depend on an outer layer.

```
┌─────────────────────────────────────────────┐
│              Presentation Layer             │
│     Next.js 16 (App Router) + Shadcn UI     │
├─────────────────────────────────────────────┤
│              Application Layer              │
│   Use Cases · DTOs · Application Services   │
├─────────────────────────────────────────────┤
│               Domain Layer                  │
│   Entities · Value Objects · Domain Rules   │
├─────────────────────────────────────────────┤
│           Infrastructure Layer              │
│  Supabase · IFS Adapter · Python Backend    │
└─────────────────────────────────────────────┘
```

### 3.2 Stack

| Layer | Technology | Reason |
|-------|-----------|--------|
| **Frontend** | Next.js 16 (App Router) + TypeScript | SSR, type safety, modern React |
| **UI Components** | Shadcn/UI (Nova preset) + Radix UI | Accessible, composable components |
| **Styling** | Tailwind CSS v4 | Utility-first, fast iteration |
| **Database** | Supabase (PostgreSQL) | Managed Postgres + Auth + Realtime |
| **Auth** | Supabase Auth | SSO-ready, row-level security |
| **Backend / Calculations** | Python 3.11 + FastAPI — **deployed as Docker container** | Index computation, future AI integration |
| **Containerization** | Docker + Docker Compose | Isolated Python runtime, consistent deployment |
| **AI / Future** | LangGraph + LangChain | Agentic workflows and AI copilot |
| **ORM / Queries** | Supabase JS client (`@supabase/ssr`) | Server + client components |

### 3.3 Monorepo Structure

```
/FSM Index
├── src/                          # Next.js frontend (App Router)
│   ├── app/                      # Pages and layouts
│   │   ├── (auth)/               # Auth routes (login, register)
│   │   ├── (dashboard)/          # Protected dashboard routes
│   │   └── api/                  # Next.js API routes (thin BFF layer)
│   ├── components/               # Shared UI components
│   │   ├── ui/                   # shadcn/ui primitives
│   │   └── features/             # Feature-specific components
│   ├── lib/
│   │   ├── supabase/             # Supabase client/server/middleware
│   │   └── utils.ts              # Shared utilities
│   ├── domain/                   # Domain layer (framework-agnostic)
│   │   ├── entities/             # Core business entities
│   │   └── value-objects/        # Immutable value types
│   └── application/              # Application use cases
│       ├── use-cases/
│       └── dtos/
│
├── backend/                      # Python FastAPI backend (runs as Docker container)
│   ├── app/
│   │   ├── api/                  # FastAPI routers
│   │   ├── domain/               # Python domain entities
│   │   ├── application/          # Python use cases
│   │   ├── infrastructure/       # DB, IFS adapter, external services
│   │   └── main.py               # FastAPI entrypoint
│   ├── Dockerfile                # Container image for Python backend
│   ├── requirements.txt
│   └── pyproject.toml
│
├── docker-compose.yml            # Orchestrates backend + any local services
├── .agents/                      # Agent skills (Supabase, Postgres)
├── .env.local                    # Environment variables (never commit)
├── AGENTS.md                     # ← You are here (master spec)
└── supabase/
    └── migrations/               # SQL migration files
```

### 3.5 Deployment Architecture

```
┌─────────────────────────┐     ┌──────────────────────────┐
│   Next.js (Vercel/CDN)  │────▶│  Python FastAPI Container │
│   App Router + BFF API  │     │  Docker · port 8000       │
└─────────────────────────┘     └────────────┬─────────────┘
             │                               │
             ▼                               ▼
┌─────────────────────────────────────────────────────────┐
│                  Supabase (PostgreSQL)                   │
│          Auth · Database · Realtime · Storage            │
└─────────────────────────────────────────────────────────┘
```

**Python Backend container specifics**:
- Base image: `python:3.11-slim`
- Entrypoint: `uvicorn app.main:app --host 0.0.0.0 --port 8000`
- Communicates with Supabase via `SUPABASE_SERVICE_ROLE_KEY` (never exposed to browser)
- Next.js calls it via `PYTHON_BACKEND_URL` env var (server-side only)
- Local dev: `docker compose up backend`

### 3.4 Clean Architecture Rules for Agents

> ⚠️ **Mandatory**: All agents must follow these rules when writing code.

1. **Domain layer has zero dependencies** — no framework imports, no Supabase, no HTTP
2. **Use Cases orchestrate, never contain** infrastructure logic
3. **Repositories are interfaces** defined in the domain, implemented in infrastructure
4. **DTOs** are used at layer boundaries — never pass raw DB rows to the UI
5. **SOLID principles**:
   - **S** — Each class/function has one reason to change
   - **O** — Open for extension, closed for modification (use interfaces)
   - **L** — Subtypes must be substitutable for their base types
   - **I** — No client should depend on interfaces it doesn't use
   - **D** — Depend on abstractions, not concretions

### 3.5 Domain Entities (Planned)

```
WorkOrder
  - id: string
  - originalLatestFinish: Date         ← planning base
  - latestFinish: Date                 ← current scheduled date
  - status: WorkOrderStatus            ← WORK DONE | FINISH | REPORTED | ...
  - isPostponed: boolean
  - hasFAA: boolean
  - region: string
  - vessel: string
  - referenceMonth: YearMonth          ← derived from originalLatestFinish

WorkOrderStatus (enum)
  - WORK_DONE
  - FINISH
  - REPORTED
  - IN_PROGRESS
  - NOT_STARTED

WorkOrderClassification (value object)
  - EXECUTED_ON_TIME
  - EXECUTED_LATE
  - OVERDUE
  - MITIGATION
  - FAA
  - ANTICIPATED

MonthlySnapshot
  - region: string
  - referenceMonth: YearMonth
  - planned: number
  - executedOnTime: number
  - executedLate: number
  - overdue: number
  - anticipated: number
  - mitigations: number
  - faa: number
  - ptci: number                       ← computed
  - mci: number                        ← computed
```

---

## 4. Database Schema

### 4.1 Core Tables (Planned)

| Table | Description | Status |
|-------|-------------|--------|
| `profiles` | User profiles extending Supabase auth.users | 🔲 Pending |
| `regions` | SBM Offshore regions / assets | 🔲 Pending |
| `work_orders` | Imported IFS SIF work order data | 🔲 Pending |
| `fsm_snapshots` | Calculated PTCI/MCI snapshots per region per month | 🔲 Pending |
| `ingestion_logs` | Audit log for IFS data ingestion runs | 🔲 Pending |
| `faas` | Functional Failure Actions linked to work orders | 🔲 Pending |

### 4.2 Key work_orders columns (Draft)

```sql
CREATE TABLE work_orders (
  id                      TEXT PRIMARY KEY,       -- IFS WO ID
  region                  TEXT NOT NULL,
  original_latest_finish  DATE NOT NULL,          -- OLF: planning base
  latest_finish           DATE NOT NULL,          -- Current scheduled date
  status                  TEXT NOT NULL,          -- IFS status code
  is_postponed            BOOLEAN DEFAULT FALSE,
  has_faa                 BOOLEAN DEFAULT FALSE,
  reference_month         DATE NOT NULL,          -- YYYY-MM-01 derived from OLF
  ingestion_id            UUID REFERENCES ingestion_logs(id),
  created_at              TIMESTAMPTZ DEFAULT NOW()
);
```

### 4.3 RLS Policies

- All tables require **Row Level Security (RLS)** enabled by default
- Users may only access data belonging to their assigned region scope
- Admins have unrestricted read access

### 4.4 Migration Strategy

- All DDL changes via `supabase/migrations/` — never via Supabase dashboard directly
- Use the Supabase MCP tool (`mcp_supabase_apply_migration`) for all schema changes
- Migration naming: `YYYYMMDDHHMMSS_description_snake_case.sql`

---

## 5. API Design

### 5.1 Frontend → Supabase (Direct)

For simple CRUD and reads, the Next.js frontend communicates **directly with Supabase**:
- Reading FSM snapshots and dashboard data
- Auth operations (login, session management)
- Real-time subscriptions for live updates

### 5.2 Frontend → Python Backend (via Next.js API routes)

For **compute-intensive operations**, the Next.js API layer acts as a BFF:

```
Browser → Next.js /api/[route] → Python FastAPI → Supabase / IFS
```

### 5.3 Python Backend Endpoints (Planned)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/fsm/calculate` | POST | Classify WOs and compute PTCI/MCI for a month/region |
| `/api/v1/ingest/upload` | POST | Ingest IFS data via CSV/Excel file upload |
| `/api/v1/fsm/snapshots` | GET | Return historical PTCI/MCI time series |
| `/api/v1/fsm/work-orders` | GET | Return classified WOs for a given month/region |

### 5.4 PTCI/MCI Calculation — Python Algorithm

```python
def classify_work_order(wo: WorkOrder, reference_month: YearMonth) -> WorkOrderClassification:
    is_planned = wo.original_latest_finish.month == reference_month
    is_done = wo.status in {Status.WORK_DONE, Status.FINISH, Status.REPORTED}
    is_postponed = wo.is_postponed or (wo.latest_finish != wo.original_latest_finish)

    if wo.has_faa:
        return Classification.FAA
    if is_done and wo.execution_date <= reference_month.end:
        return Classification.EXECUTED_ON_TIME
    if is_done and wo.execution_date > reference_month.end:
        return Classification.EXECUTED_LATE
    if is_planned and is_postponed:
        return Classification.MITIGATION
    if is_planned and not is_done:
        return Classification.OVERDUE
    if not is_planned and is_done:
        return Classification.ANTICIPATED
    return Classification.UNKNOWN

def compute_ptci(snapshot: MonthlySnapshot) -> float:
    not_executed = snapshot.overdue + snapshot.faa
    if snapshot.planned == 0:
        return 100.0
    return (1 - not_executed / snapshot.planned) * 100

def compute_mci(snapshot: MonthlySnapshot) -> float:
    not_executed = snapshot.overdue + snapshot.faa
    if not_executed == 0:
        return 100.0
    return (1 - snapshot.mitigations / not_executed) * 100
```

---

## 6. Authentication & Authorization

- **Provider**: Supabase Auth
- **Method**: Email/password (enabled) — SSO via company IdP to be evaluated
- **Session management**: SSR-safe via `@supabase/ssr` with cookie-based sessions
- **Middleware**: `src/lib/supabase/middleware.ts` handles session refresh on every request

| Role | Permissions |
|------|-------------|
| `admin` | Full access, user management, data ingestion |
| `analyst` | Read all data, trigger calculations, upload IFS files |
| `viewer` | Read-only dashboard access |

---

## 7. Feature Roadmap

### Phase 1 — Foundation (Current)
- [x] Next.js + Supabase environment setup
- [x] Shadcn/UI (Nova preset) configured
- [x] Agent Skills installed
- [ ] Authentication (login/logout/session)
- [ ] Database schema: regions, profiles, work_orders, fsm_snapshots
- [ ] Manual data upload (CSV/Excel from IFS)
- [ ] PTCI/MCI calculation (Python backend)
- [ ] Basic monthly dashboard visualization (Panel 1)

### Phase 2 — Automation & Depth
- [ ] Multi-region comparison view
- [ ] Historical trend charts (PTCI/MCI over time)
- [ ] FAA tracking and reporting panel
- [ ] Alert system (PTCI < 80% triggers notification)
- [ ] Automated IFS data ingestion (scheduled)

### Phase 3 — Intelligence
- [ ] LangGraph agent for anomaly detection
- [ ] AI-powered maintenance recommendations
- [ ] Natural language query interface (RAG over WO data)

---

## 8. Development Guidelines for Agents

### 8.1 Before Writing Any Code

1. Read this file (`AGENTS.md`) fully — especially **Section 2 (Business Logic)**
2. Read `node_modules/next/dist/docs/` for Next.js 16 specifics
3. Check `.agents/skills/supabase/SKILL.md` before any Supabase operation
4. Check `.agents/skills/supabase-postgres-best-practices/SKILL.md` before any SQL

### 8.2 TypeScript Conventions

- Use `type` over `interface` for plain data shapes; `interface` for extensible contracts
- All Supabase queries must be typed using generated types from `mcp_supabase_generate_typescript_types`
- No `any` types — use `unknown` and narrow properly
- Prefer `async/await` over promise chains

### 8.3 Python Conventions

- Python 3.11+
- FastAPI for all HTTP endpoints
- Pydantic v2 for data validation and DTOs
- Repository pattern for all data access
- Type hints on all functions (enforced by mypy)
- `pyproject.toml` with `[tool.ruff]` for linting

### 8.4 Component Conventions (Frontend)

- Use Shadcn UI components from `src/components/ui/` — never style raw HTML
- Feature components go in `src/components/features/[feature-name]/`
- Server Components by default — add `"use client"` only when necessary
- Data fetching in Server Components using `src/lib/supabase/server.ts`

### 8.5 Environment Variables

| Variable | Where used |
|----------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Frontend + Backend |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Frontend (browser-safe) |
| `SUPABASE_SERVICE_ROLE_KEY` | Python backend only (never expose to browser) |
| `IFS_API_URL` | Python backend (future) |
| `IFS_API_KEY` | Python backend (future) |
| `PYTHON_BACKEND_URL` | Next.js (server-side only) |

---

## 9. Open Questions & Decisions Pending

| # | Question | Owner | Status |
|---|----------|----------|--------|
| 1 | Minimum IFS fields confirmed: `ORIGINAL_LATEST_FINISH`, `ACTUAL_FINISH`, `STATUS`, `LATEST_FINISH`, `IS_POSTPONED`, `ACTUAL_OBJECT_SITE`. Full field list from IFS Admin needed for production integration. | IFS Admin | 🟡 Partial |
| 2 | Phase 1 will use **mock data**. Direct IFS integration (API or DB) is the target for Phase 2. | IT / IFS Admin | ✅ Resolved |
| 3 | FPSOs in scope confirmed: **CDA, CDI, CDS, CDM, CDP, ADG, SEP, ATD, ESS** | Operations | ✅ Resolved |
| 4 | Is SSO with company IdP required for Phase 1? | IT Security | 🔲 Open |
| 5 | PTCI thresholds confirmed: ≥ 95% green, 80–94% amber, < 80% red (critical). | Business Team | ✅ Resolved |
| 6 | Python backend confirmed as **Docker container** (separate from Next.js). Local dev via `docker compose`. | DevOps | ✅ Resolved |
| 7 | "Fora do prazo" (executed late) is **informational only** — does NOT impact PTCI. | Business Team | ✅ Resolved |
| 8 | MCI when `WO not executed = 0`: assumed **100%** (no unexecuted WOs to mitigate). | Business Team | ✅ Resolved |
| 9 | FAA and Mitigation are **mutually exclusive** — a WO cannot be both simultaneously. | Business Team | ✅ Resolved |
| 10 | `ACTUAL_OBJECT_SITE` codes confirmed: **CDA, CDI, CDS, CDM, CDP, ADG, SEP, ATD, ESS** — exact match with FPSO codes. | IFS Admin | ✅ Resolved |

---

## 10. Glossary

| Term | Definition |
|------|-----------|
| **FSM Index** | Functional Safety Management Index — composite KPI system for SIF test monitoring |
| **PTCI** | Proof Test Compliance Index — percentage of planned SIF tests actually executed |
| **MCI** | Mitigation Compliance Index — percentage of unexecuted tests formally mitigated |
| **IFS** | Industrial and Financial Systems — the ERP/maintenance system used by SBM Offshore |
| **SIF** | Safety Instrumented Function — a safety-critical control loop requiring periodic proof testing |
| **Work Order (WO)** | A maintenance task tracked in IFS, specifically a SIF proof test order |
| **OLF** | Original Latest Finish — the original planned completion date of a WO in IFS |
| **FAA** | Functional Failure Action — automatically opened in IFS when a proof test fails |
| **CR** | Change Request — formal document allowing postponement of a SIF test |
| **ORA** | Risk Analysis (Operational Risk Assessment) — formal document allowing postponement |
| **Overdue** | A SIF test not executed by its OLF date and not formally mitigated |
| **Mitigation** | A formally postponed SIF test, evidenced by `IS_POSTPONED=TRUE` or `LATEST_FINISH ≠ OLF` |
| **Anticipated (Exec. antecipadas)** | A SIF test executed before its OLF month — informational, credited to the OLF month |
| **Region** | An offshore operational region grouping assets/vessels managed by SBM |
| **RLS** | Row Level Security — Supabase/Postgres policy controlling data access per user |
| **BFF** | Backend-for-Frontend — a Next.js API layer that proxies to the Python backend |
