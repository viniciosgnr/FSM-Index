import { Panel1Fleet } from "@/components/features/dashboard/panel1-fleet";
import { Panel2Fpso } from "@/components/features/dashboard/panel2-fpso";
import { PtciHeatmap } from "@/components/features/dashboard/ptci-heatmap";
import { FpsoGauges } from "@/components/features/dashboard/fpso-gauges";
import { FpsoRanking } from "@/components/features/dashboard/fpso-ranking";
import { CriticalMonths } from "@/components/features/dashboard/critical-months";
import { fleetData, fpsoData, MONTHS } from "@/lib/mock-data";
import { Info, TrendingDown, TrendingUp, Minus, RefreshCw, ShieldCheck, Activity, Target } from "lucide-react";

// ── KPI card ──────────────────────────────────────────────────────────────────
function KpiCard({
  label,
  value,
  sub,
  trend,
  valueColor,
  icon,
}: {
  label: string;
  value: string;
  sub: string;
  trend: "up" | "down" | "flat";
  valueColor: string;
  icon: React.ReactNode;
}) {
  const TrendIcon =
    trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor =
    trend === "up"
      ? "var(--fsm-green)"
      : trend === "down"
      ? "var(--fsm-red)"
      : "var(--muted-foreground)";

  return (
    <div className="rounded-lg border border-border bg-card shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
          {label}
        </p>
        <span
          className="w-8 h-8 rounded-md flex items-center justify-center shrink-0"
          style={{ backgroundColor: "rgba(242,101,34,0.1)", color: "#F26522" }}
        >
          {icon}
        </span>
      </div>
      <div className="flex items-end justify-between gap-2">
        <span
          className="text-3xl font-bold tabular-nums"
          style={{ color: valueColor }}
        >
          {value}
        </span>
        <div
          className="flex items-center gap-1 text-xs font-medium pb-1"
          style={{ color: trendColor }}
        >
          <TrendIcon className="w-3.5 h-3.5" />
          <span>{sub}</span>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const recent = fleetData.slice(-3);
  const avgPtci = recent.reduce((s, r) => s + r.ptci, 0) / recent.length;
  const avgMci  = recent.reduce((s, r) => s + r.mci,  0) / recent.length;
  const totalOverdue = fleetData.reduce((s, r) => s + r.overdue, 0);
  const totalFaa     = fleetData.reduce((s, r) => s + r.faa,     0);

  const ptciColor =
    avgPtci >= 95 ? "var(--fsm-green)" : avgPtci >= 80 ? "var(--fsm-amber)" : "var(--fsm-red)";
  const mciColor =
    avgMci >= 95  ? "var(--fsm-green)" : avgMci >= 80  ? "var(--fsm-amber)" : "var(--fsm-red)";

  return (
    <div className="flex flex-col min-h-screen">
      {/* ── Top bar ─────────────────────────────────────────── */}
      <header
        className="px-6 py-3 flex items-center justify-between border-b border-border bg-card shadow-sm sticky top-0 z-20"
      >
        <div>
          <h1
            className="text-xl font-bold tracking-tight"
            style={{ color: "#F26522" }}
          >
            FSM Index — Proof Test Compliance Index
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Region 1 &nbsp;·&nbsp; Jan/2025 – Apr/2026 &nbsp;·&nbsp; PTCI based on OLF
            &nbsp;·&nbsp; Early executions are informational only
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted rounded-md px-3 py-1.5">
            <RefreshCw className="w-3 h-3" />
            <span>Extraction: 05/04/2026</span>
          </div>
          <div
            className="flex items-center gap-1.5 text-xs rounded-md px-3 py-1.5 font-medium"
            style={{
              backgroundColor: "rgba(242,101,34,0.1)",
              color: "#F26522",
            }}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Simulated Data</span>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-8">
        {/* ── KPI cards ──────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            label="Avg PTCI (last 3 months)"
            value={`${Math.round(avgPtci)}%`}
            sub={avgPtci >= 80 ? "Within target" : "Below target"}
            trend={avgPtci >= 95 ? "up" : avgPtci >= 80 ? "flat" : "down"}
            valueColor={ptciColor}
            icon={<ShieldCheck className="w-4 h-4" />}
          />
          <KpiCard
            label="Avg MCI (last 3 months)"
            value={`${Math.round(avgMci)}%`}
            sub="Formal mitigations"
            trend={avgMci >= 80 ? "up" : "down"}
            valueColor={mciColor}
            icon={<ShieldCheck className="w-4 h-4" />}
          />
          <KpiCard
            label="Accumulated Overdue"
            value={String(totalOverdue)}
            sub="Jan/25 – Apr/26"
            trend="down"
            valueColor="var(--fsm-red)"
            icon={<TrendingDown className="w-4 h-4" />}
          />
          <KpiCard
            label="FAA Records"
            value={String(totalFaa)}
            sub="Monitor with tech support"
            trend="flat"
            valueColor="var(--fsm-amber)"
            icon={<Info className="w-4 h-4" />}
          />
        </div>

        {/* ── Action Items (Critical Months Drill-down) ────────── */}
        <section className="space-y-3">
          <div className="flex items-baseline gap-3">
            <h2 className="text-base font-bold text-foreground">
              Action Required — Critical Months
            </h2>
            <span className="text-xs text-muted-foreground">
              Drill-down into months below the 80% PTCI target
            </span>
          </div>
          <CriticalMonths />
        </section>

        {/* ── FPSO Performance Overview ────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Gauges */}
          <section className="xl:col-span-12 space-y-3">
            <div className="flex items-baseline gap-3">
              <h2 className="text-base font-bold text-foreground">
                Current Health — Latest Month (Apr/26)
              </h2>
            </div>
            <FpsoGauges units={fpsoData} />
          </section>

          {/* Ranking */}
          <section className="xl:col-span-12 space-y-3">
            <div className="flex items-baseline gap-3">
              <h2 className="text-base font-bold text-foreground">
                Fleet Ranking — Average PTCI
              </h2>
              <span className="text-xs text-muted-foreground">
                Sorted from worst to best performance across all months
              </span>
            </div>
            <FpsoRanking units={fpsoData} />
          </section>
        </div>

        <hr className="border-border my-2" />

        {/* ── Color legend ───────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground bg-card border border-border rounded-lg px-4 py-3">
          <span className="font-semibold text-foreground">Color code:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: "var(--fsm-green-bg)", border: "1px solid var(--fsm-green)" }} />
            <span>PTCI ≥ 95%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: "var(--fsm-amber-bg)", border: "1px solid var(--fsm-amber)" }} />
            <span>80% ≤ PTCI &lt; 95%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: "var(--fsm-red-bg)", border: "1px solid var(--fsm-red)" }} />
            <span>PTCI &lt; 80% — Critical</span>
          </div>
          <div className="flex items-center gap-1.5 ml-auto">
            <Info className="w-3.5 h-3.5" />
            <span className="italic">
              Early executions (blue) do not count toward current month's PTCI
            </span>
          </div>
        </div>

        {/* ── Panel 1 ────────────────────────────────────────── */}
        <section className="space-y-3">
          <div className="flex items-baseline gap-3">
            <h2 className="text-base font-bold text-foreground">
              Panel 1 — Monthly PTCI (Fleet)
            </h2>
            <span className="text-xs text-muted-foreground">
              Consolidated fleet view · OLF as planning base
            </span>
          </div>
          <Panel1Fleet months={MONTHS} data={fleetData} />
          <p className="text-[0.65rem] text-muted-foreground leading-relaxed">
            <span style={{ color: "var(--fsm-red)", fontWeight: 600 }}>
              Critical months (PTCI &lt; 80%):
            </span>{" "}
            Jun/25 → 64.5% (+6 early executions not counted) &nbsp;|&nbsp;
            Jul/25 → 77.6% (+8 early executions not counted) &nbsp;|&nbsp;
            Dec/25 → 50.4% (+23 early executions not counted)
          </p>
        </section>

        {/* ── Heat Map ────────────────────────────────────────── */}
        <section className="space-y-3">
          <div className="flex items-baseline gap-3">
            <h2 className="text-base font-bold text-foreground">
              Heat Map — PTCI by FPSO &amp; Month
            </h2>
            <span className="text-xs text-muted-foreground">
              Quickly identify critical FPSOs and months · hover a cell to focus
            </span>
          </div>
          <PtciHeatmap />
        </section>


        <section className="space-y-3 pb-8">
          <div className="flex items-baseline gap-3">
            <h2 className="text-base font-bold text-foreground">
              Panel 2 — PTCI by FPSO Unit
            </h2>
            <span className="text-xs text-muted-foreground">
              Period = ORIGINAL_LATEST_FINISH · Unit = ACTUAL_OBJECT_SITE ·
              On time = ACTUAL_FINISH ≤ ORIGINAL_LATEST_FINISH
            </span>
          </div>
          <Panel2Fpso months={MONTHS} units={fpsoData} />
          <p className="text-[0.65rem] text-muted-foreground">
            Early executions (negative delta in blue) — tests executed before the OLF month.
            They do not count toward the current month's PTCI and will be credited to the
            OLF month. Example: ATD executed 17 SIFs in Mar/26 with OLF in Dec/26.
          </p>
        </section>
      </div>
    </div>
  );
}
