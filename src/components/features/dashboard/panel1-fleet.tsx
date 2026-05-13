"use client";

import { useState } from "react";
import { ptciColorClass } from "@/lib/mock-data";
import type { MonthlyRow } from "@/lib/mock-data";
import { LayoutGrid, Table2 } from "lucide-react";

type Props = {
  months: string[];
  data: MonthlyRow[];
};

// ── Row definitions ───────────────────────────────────────────
const ROWS: {
  key: keyof MonthlyRow;
  label: string;
  badge?: string;
  dim?: boolean;
  rgb: [number, number, number]; // base color for heat intensity
  sentiment: "positive" | "negative" | "neutral" | "warning" | "info";
}[] = [
  {
    key: "planejadas",
    label: "Planned (OLF in month)",
    rgb: [27, 42, 71],
    sentiment: "neutral",
  },
  {
    key: "executadasNoPrazo",
    label: "Executed on time",
    rgb: [30, 138, 76],
    sentiment: "positive",
  },
  {
    key: "foraDoPrazo",
    label: "Executed late",
    dim: true,
    rgb: [201, 124, 0],
    sentiment: "warning",
  },
  {
    key: "overdue",
    label: "Overdue",
    rgb: [192, 37, 26],
    sentiment: "negative",
  },
  {
    key: "execAntecipadas",
    label: "Early executions",
    badge: "+info",
    dim: true,
    rgb: [27, 107, 176],
    sentiment: "info",
  },
  {
    key: "mitigacoes",
    label: "Mitigations",
    rgb: [242, 101, 34],
    sentiment: "warning",
  },
  {
    key: "faa",
    label: "FAA",
    rgb: [180, 83, 9],
    sentiment: "negative",
  },
];

function Pct(v: number) {
  return `${Math.round(v)}%`;
}

// ── Intensity heat cell background ────────────────────────────
function heatBg(
  value: number,
  max: number,
  rgb: [number, number, number]
): string {
  if (value === 0 || max === 0) return "transparent";
  // scale alpha 0.08 → 0.80 based on relative intensity
  const intensity = value / max;
  const alpha = 0.08 + intensity * 0.72;
  return `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alpha.toFixed(2)})`;
}

// text turns white when background is dark enough
function heatText(
  value: number,
  max: number,
  rgb: [number, number, number]
): string {
  if (value === 0 || max === 0) return "var(--muted-foreground)";
  const intensity = value / max;
  if (intensity >= 0.55) return "#ffffff";
  const alpha = 0.08 + intensity * 0.72;
  // darken the base color for readable text on light bg
  const factor = 0.65;
  return `rgba(${Math.round(rgb[0] * factor)},${Math.round(rgb[1] * factor)},${Math.round(rgb[2] * factor)},${Math.min(alpha + 0.5, 1)})`;
}

export function Panel1Fleet({ months, data }: Props) {
  const [heatMode, setHeatMode] = useState(false);

  // ── Totals ──────────────────────────────────────────────────
  const totals = data.reduce(
    (acc, row) => ({
      planejadas: acc.planejadas + row.planejadas,
      executadasNoPrazo: acc.executadasNoPrazo + row.executadasNoPrazo,
      foraDoPrazo: acc.foraDoPrazo + row.foraDoPrazo,
      overdue: acc.overdue + row.overdue,
      execAntecipadas: acc.execAntecipadas + row.execAntecipadas,
      mitigacoes: acc.mitigacoes + row.mitigacoes,
      faa: acc.faa + row.faa,
      ptci: 0,
      mci: 0,
    }),
    {
      planejadas: 0,
      executadasNoPrazo: 0,
      foraDoPrazo: 0,
      overdue: 0,
      execAntecipadas: 0,
      mitigacoes: 0,
      faa: 0,
      ptci: 0,
      mci: 0,
    }
  );

  const avgPtci = data.reduce((s, r) => s + r.ptci, 0) / data.length;
  const avgMci = data.reduce((s, r) => s + r.mci, 0) / data.length;

  // ── Pre-compute row maximums (for heat intensity) ────────────
  const rowMax: Partial<Record<keyof MonthlyRow, number>> = {};
  for (const { key } of ROWS) {
    rowMax[key] = Math.max(...data.map((r) => (r[key] as number) || 0));
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border shadow-sm">
      <table className="w-full text-xs border-collapse">
        {/* ── Header ────────────────────────────────────────── */}
        <thead>
          {/* Year + toggle row */}
          <tr>
            <th
              colSpan={2}
              className="th-navy px-4 py-2 text-left text-sm font-semibold sticky left-0 z-10 min-w-[220px]"
            >
              Indicator
            </th>
            <th
              colSpan={12}
              className="th-navy px-2 py-2 text-center text-xs font-semibold tracking-wider border-l border-white/10"
            >
              2025
            </th>
            <th
              colSpan={4}
              className="th-navy px-2 py-2 text-center text-xs font-semibold tracking-wider border-l border-white/10"
            >
              2026
            </th>
            <th className="th-navy px-3 py-2 text-center text-xs font-semibold min-w-[72px]">
              Total/Avg
            </th>
            {/* ── View toggle ─ */}
            <th className="th-navy px-2 py-2">
              <div
                className="flex items-center gap-0.5 rounded-md overflow-hidden border border-white/20"
                title="Toggle heat map mode"
              >
                <button
                  onClick={() => setHeatMode(false)}
                  className="flex items-center gap-1 px-2 py-1 text-[0.6rem] font-semibold transition-colors"
                  style={{
                    backgroundColor: !heatMode
                      ? "#F26522"
                      : "rgba(255,255,255,0.07)",
                    color: !heatMode ? "#fff" : "rgba(232,236,244,0.6)",
                  }}
                >
                  <Table2 className="w-3 h-3" />
                  Std
                </button>
                <button
                  onClick={() => setHeatMode(true)}
                  className="flex items-center gap-1 px-2 py-1 text-[0.6rem] font-semibold transition-colors"
                  style={{
                    backgroundColor: heatMode
                      ? "#F26522"
                      : "rgba(255,255,255,0.07)",
                    color: heatMode ? "#fff" : "rgba(232,236,244,0.6)",
                  }}
                >
                  <LayoutGrid className="w-3 h-3" />
                  Heat
                </button>
              </div>
            </th>
          </tr>
          {/* Month row */}
          <tr>
            <th
              colSpan={2}
              className="th-navy-lt px-4 py-1.5 text-left text-xs font-medium sticky left-0 z-10"
            >
              &nbsp;
            </th>
            {months.map((m) => (
              <th
                key={m}
                className="th-navy-lt px-1.5 py-1.5 text-center font-medium min-w-[52px] border-l border-white/5"
              >
                {m}
              </th>
            ))}
            <th className="th-navy-lt px-3 py-1.5 text-center font-medium" />
            <th className="th-navy-lt" />
          </tr>
        </thead>

        <tbody>
          {/* ── Banner row ──────────────────────────────────── */}
          <tr>
            <td
              colSpan={months.length + 4}
              className="px-4 py-1.5 text-[0.65rem] font-semibold uppercase tracking-wide border-b border-border"
              style={{
                backgroundColor: "#FFF8F4",
                color: "#F26522",
                borderLeft: "3px solid #F26522",
              }}
            >
              PANEL 1 — Monthly PTCI &nbsp;·&nbsp; OLF as planning base &nbsp;·&nbsp;
              Early executions are informational only
              {heatMode && (
                <span
                  className="ml-3 px-1.5 py-0.5 rounded text-[0.6rem] font-bold"
                  style={{ backgroundColor: "#F26522", color: "#fff" }}
                >
                  ● HEAT MAP — intensity scales with row maximum
                </span>
              )}
            </td>
          </tr>

          {/* ── Data rows ─────────────────────────────────────── */}
          {ROWS.map(({ key, label, badge, dim, rgb, sentiment }) => {
            const max = rowMax[key] ?? 0;

            return (
              <tr
                key={key}
                className="border-b border-border transition-colors hover:bg-muted/20"
                style={!heatMode && dim ? { opacity: 0.7 } : {}}
              >
                {/* Label cell */}
                <td
                  colSpan={2}
                  className="px-4 py-1.5 font-medium text-foreground sticky left-0 z-10 bg-card"
                >
                  {label}
                  {badge && (
                    <span
                      className="ml-2 text-[0.6rem] font-semibold px-1.5 py-0.5 rounded"
                      style={{
                        backgroundColor: "rgba(242,101,34,0.1)",
                        color: "#F26522",
                      }}
                    >
                      {badge}
                    </span>
                  )}
                  {heatMode && max > 0 && (
                    <span className="ml-2 text-[0.55rem] text-muted-foreground">
                      max={max}
                    </span>
                  )}
                </td>

                {/* Value cells */}
                {data.map((row, i) => {
                  const val = row[key] as number;

                  // ── Standard mode colors ──────────────────────
                  let stdColor = "var(--muted-foreground)";
                  if (!heatMode) {
                    if (key === "overdue" && val > 0) stdColor = "var(--fsm-red)";
                    if (key === "faa" && val > 0) stdColor = "var(--fsm-amber)";
                    if (key === "mitigacoes" && val > 0) stdColor = "#F26522";
                    if (key === "execAntecipadas" && val > 0) stdColor = "#1B6BB0";
                    if (key === "executadasNoPrazo" && val > 0)
                      stdColor = "var(--fsm-green)";
                  }

                  // ── Heat mode styles ──────────────────────────
                  const bg = heatMode ? heatBg(val, max, rgb) : "transparent";
                  const textColor = heatMode ? heatText(val, max, rgb) : stdColor;

                  return (
                    <td
                      key={i}
                      className="border-l border-border/30 p-[3px]"
                    >
                      <div
                        className="flex items-center justify-center rounded h-8 tabular-nums transition-colors"
                        style={{
                          backgroundColor: bg,
                          color: textColor,
                          fontWeight:
                            val > 0 &&
                            key !== "planejadas" &&
                            key !== "executadasNoPrazo"
                              ? 600
                              : 400,
                        }}
                      >
                        {val || "—"}
                      </div>
                    </td>
                  );
                })}

                {/* Total cell */}
                <td className="text-center py-1.5 px-3 font-semibold tabular-nums text-muted-foreground border-l border-border">
                  {(totals[key] as number) || "—"}
                </td>
                <td />
              </tr>
            );
          })}

          {/* ── PTCI % ─────────────────────────────────────────── */}
          <tr
            className="border-t-2 font-bold"
            style={{ borderTopColor: "var(--sbm-navy)" }}
          >
            <td
              colSpan={2}
              className="px-4 py-2 sticky left-0 z-10 bg-card text-foreground font-bold text-[0.8rem]"
            >
              PTCI %
            </td>
            {data.map((row, i) => (
              <td key={i} className="border-l border-border/30 p-[3px]">
                <div className="flex items-center justify-center h-8">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[0.68rem] ${ptciColorClass(row.ptci)}`}
                  >
                    {Pct(row.ptci)}
                  </span>
                </div>
              </td>
            ))}
            <td className="text-center py-2 px-3 border-l border-border">
              <span
                className={`inline-block px-2 py-0.5 rounded text-[0.68rem] ${ptciColorClass(avgPtci)}`}
              >
                {Pct(avgPtci)}
              </span>
            </td>
            <td />
          </tr>

          {/* ── MCI % ──────────────────────────────────────────── */}
          <tr className="border-b border-border font-bold">
            <td
              colSpan={2}
              className="px-4 py-2 sticky left-0 z-10 bg-card text-foreground font-bold text-[0.8rem]"
            >
              MCI %
            </td>
            {data.map((row, i) => (
              <td key={i} className="border-l border-border/30 p-[3px]">
                <div className="flex items-center justify-center h-8">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[0.68rem] ${ptciColorClass(row.mci)}`}
                  >
                    {Pct(row.mci)}
                  </span>
                </div>
              </td>
            ))}
            <td className="text-center py-2 px-3 border-l border-border">
              <span
                className={`inline-block px-2 py-0.5 rounded text-[0.68rem] ${ptciColorClass(avgMci)}`}
              >
                {Pct(avgMci)}
              </span>
            </td>
            <td />
          </tr>

          {/* ── Heat map legend (only in heat mode) ─────────────── */}
          {heatMode && (
            <tr>
              <td
                colSpan={months.length + 4}
                className="px-4 py-3 border-t border-border"
                style={{ backgroundColor: "#FAFBFD" }}
              >
                <div className="flex flex-wrap items-center gap-6 text-[0.65rem] text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    Intensity legend:
                  </span>
                  {[
                    { label: "Planned", rgb: [27, 42, 71] },
                    { label: "Executed on time", rgb: [30, 138, 76] },
                    { label: "Executed late", rgb: [201, 124, 0] },
                    { label: "Overdue", rgb: [192, 37, 26] },
                    { label: "Early executions", rgb: [27, 107, 176] },
                    { label: "Mitigations", rgb: [242, 101, 34] },
                    { label: "FAA", rgb: [180, 83, 9] },
                  ].map(({ label, rgb }) => (
                    <div key={label} className="flex items-center gap-1.5">
                      <div className="flex gap-0.5">
                        {[0.1, 0.3, 0.55, 0.8].map((a) => (
                          <span
                            key={a}
                            className="w-3.5 h-3.5 rounded-sm"
                            style={{
                              backgroundColor: `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${a})`,
                              border: "1px solid rgba(0,0,0,0.06)",
                            }}
                          />
                        ))}
                      </div>
                      <span>{label}</span>
                    </div>
                  ))}
                  <span className="ml-auto italic">
                    Cell opacity scales from low (lightest) → high (darkest) relative to row maximum
                  </span>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
