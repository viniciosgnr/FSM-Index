import { FpsoGauges } from "@/components/features/dashboard/fpso-gauges";
import { FpsoRanking } from "@/components/features/dashboard/fpso-ranking";
import { CriticalMonths } from "@/components/features/dashboard/critical-months";
import { getFpsoSnapshots, getFleetSnapshots } from "@/lib/api";
import { RefreshCw, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Analytics | FSM Index",
};

export default async function AnalyticsPage() {
  const fpsoData = await getFpsoSnapshots();
  const fleetData = await getFleetSnapshots();
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
            FSM Index — Analytics &amp; Insights
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Region 1 &nbsp;·&nbsp; Jan/2025 – Apr/2026 &nbsp;·&nbsp; Fleet Health &amp; Critical Drill-downs
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

      <div className="p-6 space-y-10">
        {/* ── Action Items (Critical Months Drill-down) ────────── */}
        <section className="space-y-3">
          <div className="flex items-baseline gap-3">
            <h2 className="text-xl font-bold text-foreground">
              Action Required — Critical Months
            </h2>
            <span className="text-sm text-muted-foreground">
              Drill-down into months below the 80% PTCI target
            </span>
          </div>
          <CriticalMonths fleetData={fleetData} fpsoData={fpsoData} />
        </section>

        {/* ── FPSO Performance Overview ────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
          {/* Gauges */}
          <section className="xl:col-span-12 space-y-3">
            <div className="flex items-baseline gap-3">
              <h2 className="text-xl font-bold text-foreground">
                Current Health — Latest Month (Apr/26)
              </h2>
            </div>
            <FpsoGauges units={fpsoData} />
          </section>

          {/* Ranking */}
          <section className="xl:col-span-12 space-y-3">
            <div className="flex items-baseline gap-3">
              <h2 className="text-xl font-bold text-foreground">
                Fleet Ranking — Average PTCI
              </h2>
              <span className="text-sm text-muted-foreground">
                Sorted from worst to best performance across all months
              </span>
            </div>
            <FpsoRanking units={fpsoData} />
          </section>
        </div>
      </div>
    </div>
  );
}
