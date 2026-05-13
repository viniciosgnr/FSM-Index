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
    <div className="bg-card border border-border rounded-lg shadow-sm p-5 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        {stats.map((stat, i) => {
          let color = "var(--fsm-red)";
          let bgClass = "bg-red-100";
          if (stat.avgPtci >= 95) {
            color = "var(--fsm-green)";
            bgClass = "bg-emerald-100";
          } else if (stat.avgPtci >= 80) {
            color = "var(--fsm-amber)";
            bgClass = "bg-amber-100";
          }

          return (
            <div key={stat.code} className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-foreground">
                  {i + 1}. {stat.code}
                </span>
                <span style={{ color }}>{Math.round(stat.avgPtci)}%</span>
              </div>
              <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: `${Math.max(0, Math.min(100, stat.avgPtci))}%`,
                    backgroundColor: color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
