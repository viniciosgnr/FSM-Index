"use client";

import { ptciColorClass } from "@/lib/mock-data";
import type { FpsoUnit } from "@/lib/mock-data";

type Props = {
  units: FpsoUnit[];
};

function Gauge({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  // clamp value
  const pct = Math.max(0, Math.min(100, value));
  const offset = circumference - (pct / 100) * circumference;

  let color = "var(--fsm-red)";
  if (pct >= 95) color = "var(--fsm-green)";
  else if (pct >= 80) color = "var(--fsm-amber)";

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-card border border-border rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="relative flex items-center justify-center">
        {/* Background circle */}
        <svg width="100" height="100" className="transform -rotate-90">
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="rgba(0,0,0,0.05)"
            strokeWidth="8"
          />
          {/* Value circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-xl font-bold tabular-nums" style={{ color }}>
            {Math.round(value)}%
          </span>
        </div>
      </div>
      <span className="mt-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

export function FpsoGauges({ units }: Props) {
  // Sort units alphabetically for the gauges
  const sortedUnits = [...units].sort((a, b) => a.code.localeCompare(b.code));

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-9 gap-4">
      {sortedUnits.map((u) => {
        // get latest month's data
        const latest = u.months[u.months.length - 1];
        const val = latest?.pctNoPrazo ?? 0;
        return <Gauge key={u.code} label={u.code} value={val} />;
      })}
    </div>
  );
}
