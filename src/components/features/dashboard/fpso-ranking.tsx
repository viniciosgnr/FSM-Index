"use client";

import { ptciColorClass } from "@/lib/mock-data";
import type { FpsoUnit } from "@/lib/mock-data";

type Props = {
  units: FpsoUnit[];
};

export function FpsoRanking({ units }: Props) {
  // Calculate average PTCI for each unit across all months
  const stats = units.map((u) => {
    const validMonths = u.months.filter((m) => m.pctNoPrazo !== null);
    const sum = validMonths.reduce((acc, m) => acc + (m.pctNoPrazo || 0), 0);
    const avg = validMonths.length ? sum / validMonths.length : 0;
    return {
      code: u.code,
      avgPtci: avg,
    };
  });

  // Sort worst to best
  stats.sort((a, b) => a.avgPtci - b.avgPtci);

  return (
    <div className="bg-card border border-border rounded-lg shadow-sm p-6 pt-8">
      <div className="flex items-end justify-between h-64 gap-2 w-full">
        {stats.map((stat, i) => {
          let color = "var(--fsm-red)";
          if (stat.avgPtci >= 95) {
            color = "var(--fsm-green)";
          } else if (stat.avgPtci >= 80) {
            color = "var(--fsm-amber)";
          }

          // Force minimum height so even 0% is slightly visible, but scale the rest to 100% of the container height
          // Since max PTCI is 100, we can map 0-100 to 0-100% height.
          const heightPct = Math.max(0, Math.min(100, stat.avgPtci));

          return (
            <div
              key={stat.code}
              className="flex flex-col items-center justify-end w-full h-full group relative"
            >
              {/* Value label - always visible above the bar */}
              <span
                className="text-sm font-bold mb-2 tabular-nums transition-transform duration-300 group-hover:-translate-y-1"
                style={{ color }}
              >
                {Math.round(stat.avgPtci)}%
              </span>
              
              {/* Vertical Bar */}
              <div
                className="w-full max-w-[60px] rounded-t-md transition-all duration-1000 ease-out flex items-end justify-center pb-2"
                style={{
                  height: `${heightPct}%`,
                  backgroundColor: color,
                  opacity: 0.85,
                }}
              >
                {/* Ranking number inside the bottom of the bar */}
                {heightPct > 15 && (
                  <span className="text-white/80 font-bold text-xs">#{i + 1}</span>
                )}
              </div>
              
              {/* FPSO Code Label */}
              <span className="text-xs font-semibold mt-3 text-muted-foreground uppercase tracking-wider group-hover:text-foreground transition-colors">
                {stat.code}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-6 flex items-center justify-center gap-6 border-t border-border pt-4 text-xs text-muted-foreground">
        <span className="font-semibold text-foreground">Performance Legend:</span>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "var(--fsm-green)" }} />
          <span>Optimal (≥ 95%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "var(--fsm-amber)" }} />
          <span>Warning (80–94%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "var(--fsm-red)" }} />
          <span>Critical (&lt; 80%)</span>
        </div>
      </div>
    </div>
  );
}
