"use client";

import React from "react";
import { ptciColorClass } from "@/lib/mock-data";
import type { FpsoUnit } from "@/lib/mock-data";

type Props = {
  months: string[];
  units: FpsoUnit[];
};

export function Panel2Fpso({ months, units }: Props) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border shadow-sm">
      <table className="w-full text-xs border-collapse">
        {/* ── Header ──────────────────────────────────────────── */}
        <thead>
          <tr>
            <th
              colSpan={2}
              className="th-navy px-4 py-2.5 text-left text-sm font-semibold sticky left-0 z-10 min-w-[180px]"
            >
              Unit
            </th>
            <th
              colSpan={12}
              className="th-navy px-2 py-2.5 text-center text-xs font-semibold tracking-wider border-l border-white/10"
            >
              2025
            </th>
            <th
              colSpan={4}
              className="th-navy px-2 py-2.5 text-center text-xs font-semibold tracking-wider border-l border-white/10"
            >
              2026
            </th>
            <th className="th-navy px-4 py-2.5 text-center text-xs font-semibold tracking-wider border-l border-white/10 min-w-[100px]">
              Trend
            </th>
          </tr>
          <tr>
            <th
              colSpan={2}
              className="th-navy-lt px-4 py-1.5 text-left sticky left-0 z-10"
            >
              <span className="text-[0.65rem] text-[rgba(232,236,244,0.5)]">Metric</span>
            </th>
            {months.map((m) => (
              <th
                key={m}
                className="th-navy-lt px-1.5 py-1.5 text-center font-medium min-w-[52px] border-l border-white/5"
              >
                {m}
              </th>
            ))}
            <th className="th-navy-lt px-4 py-1.5 border-l border-white/5"></th>
          </tr>
        </thead>

        <tbody>
          {units.map((unit, ui) => (
            <React.Fragment key={unit.code}>
              {/* ── FPSO header row ──────────────────────────── */}
              <tr
                className="border-b border-border"
                style={{ backgroundColor: "rgba(27,42,71,0.04)" }}
              >
                <td
                  colSpan={2}
                  className="px-4 py-2 font-bold tracking-wide sticky left-0 z-10"
                  style={{
                    backgroundColor: "rgba(27,42,71,0.04)",
                    color: "var(--sbm-navy)",
                    borderLeft: "3px solid #F26522",
                  }}
                >
                  {unit.code}
                  <span
                    className="ml-2 text-[0.6rem] font-normal"
                    style={{ color: "#F26522" }}
                  >
                    % on time
                  </span>
                </td>
                {unit.months.map((m, mi) => (
                  <td key={mi} className="text-center py-2 px-1 border-l border-border/30">
                    {m.pctNoPrazo !== null ? (
                      <span
                        className={`inline-block px-1.5 py-0.5 rounded text-[0.65rem] font-bold ${ptciColorClass(
                          m.pctNoPrazo
                        )}`}
                      >
                        {m.pctNoPrazo}%
                      </span>
                    ) : (
                      <span className="text-muted-foreground/30">—</span>
                    )}
                  </td>
                ))}

                {/* ── Sparkline ── */}
                <td rowSpan={2} className="border-l border-border px-2 align-middle bg-card/30">
                  <div className="flex flex-col gap-1 items-center justify-center">
                    <svg width="80" height="24" className="overflow-visible" viewBox="0 0 80 24">
                      {/* Grid lines */}
                      <line x1="0" y1="2" x2="80" y2="2" stroke="rgba(0,0,0,0.05)" strokeWidth="1" strokeDasharray="2,2" />
                      <line x1="0" y1="12" x2="80" y2="12" stroke="rgba(0,0,0,0.05)" strokeWidth="1" strokeDasharray="2,2" />
                      
                      {/* Trend line */}
                      <polyline
                        fill="none"
                        stroke="#1B2A47"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        points={unit.months.map((d, i) => {
                          const x = (i / Math.max(1, unit.months.length - 1)) * 80;
                          // Map PTCI 40-100% to Y 24-0
                          const clamped = Math.max(40, Math.min(100, d.pctNoPrazo || 0));
                          const y = 24 - ((clamped - 40) / 60) * 24;
                          return `${x},${y}`;
                        }).join(" ")}
                      />
                      
                      {/* Current value dot */}
                      {(() => {
                        const lastPtci = unit.months[unit.months.length - 1]?.pctNoPrazo || 0;
                        const clamped = Math.max(40, Math.min(100, lastPtci));
                        const y = 24 - ((clamped - 40) / 60) * 24;
                        const color = lastPtci >= 95 ? "#1E8A4C" : lastPtci >= 80 ? "#C97C00" : "#C0251A";
                        return <circle cx="80" cy={y} r="2.5" fill={color} stroke="#fff" strokeWidth="1" />;
                      })()}
                    </svg>
                  </div>
                </td>
              </tr>

              {/* ── Qty row ──────────────────────────────────── */}
              <tr
                className={`border-b border-border/40 transition-colors hover:bg-muted/20 ${
                  ui % 2 === 0 ? "bg-white" : "bg-muted/10"
                }`}
              >
                <td
                  colSpan={2}
                  className={`px-4 py-1.5 text-muted-foreground text-[0.65rem] sticky left-0 z-10 ${
                    ui % 2 === 0 ? "bg-white" : "bg-muted/10"
                  }`}
                >
                  {unit.code} — realized / planned
                </td>
                {unit.months.map((m, mi) => {
                  if (m.planejadas === 0 && m.realizadas === 0) {
                    return (
                      <td
                        key={mi}
                        className="text-center py-1.5 px-1 text-muted-foreground/30 border-l border-border/30"
                      >
                        —
                      </td>
                    );
                  }
                  return (
                    <td
                      key={mi}
                      className="text-center py-1.5 px-1 tabular-nums border-l border-border/30"
                    >
                      <span className="font-semibold text-foreground">
                        {m.realizadas}
                      </span>
                      <span className="text-muted-foreground">/{m.planejadas}</span>
                      {m.antecipadas !== 0 && (
                        <span
                          className="ml-0.5 text-[0.58rem]"
                          style={{ color: "#1B6BB0" }}
                        >
                          ({m.antecipadas})
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
