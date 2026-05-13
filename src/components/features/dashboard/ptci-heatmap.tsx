"use client";

import React, { useState } from "react";
import { fpsoData, fleetData, MONTHS } from "@/lib/mock-data";

// ── Color helpers ────────────────────────────────────────────
function cellBg(pct: number | null): string {
  if (pct === null) return "transparent";
  if (pct === 0) return "#FDECEA";
  if (pct >= 95) return "#E6F6EC";
  if (pct >= 80) return "#FFF8E1";
  return "#FDECEA";
}

function cellTextColor(pct: number | null): string {
  if (pct === null) return "#C0C8D8";
  if (pct === 0) return "#C0251A";
  if (pct >= 95) return "#1E8A4C";
  if (pct >= 80) return "#C97C00";
  return "#C0251A";
}

function cellBorder(pct: number | null): string {
  if (pct === null) return "1px solid #EEF0F5";
  if (pct >= 95) return "1px solid #A8DFB8";
  if (pct >= 80) return "1px solid #F5D97A";
  return "1px solid #F5B3AE";
}

// FPSO average excluding nulls
function fpsoAvg(unitIdx: number): number | null {
  const months = fpsoData[unitIdx].months;
  const valid = months.filter((m) => m.pctNoPrazo !== null);
  if (valid.length === 0) return null;
  return Math.round(valid.reduce((s, m) => s + m.pctNoPrazo!, 0) / valid.length);
}

// ── Single heat cell ─────────────────────────────────────────
function HeatCell({
  pct,
  realized,
  planned,
  isHovered,
  onHover,
}: {
  pct: number | null;
  realized: number;
  planned: number;
  isHovered: boolean;
  onHover: (v: boolean) => void;
}) {
  return (
    <td className="p-[3px]" style={{ minWidth: "54px" }}>
      <div
        onMouseEnter={() => onHover(true)}
        onMouseLeave={() => onHover(false)}
        className="rounded-md flex flex-col items-center justify-center h-[52px] cursor-default select-none transition-transform duration-150"
        style={{
          backgroundColor: cellBg(pct),
          border: cellBorder(pct),
          transform: isHovered && pct !== null ? "scale(1.08)" : "scale(1)",
          boxShadow: isHovered && pct !== null ? "0 4px 12px rgba(0,0,0,0.12)" : "none",
          position: "relative",
          zIndex: isHovered ? 10 : 1,
        }}
      >
        {pct !== null ? (
          <>
            <span
              className="text-xs font-bold leading-tight"
              style={{ color: cellTextColor(pct) }}
            >
              {pct}%
            </span>
            {planned > 0 && (
              <span
                className="text-[0.55rem] leading-tight mt-0.5 tabular-nums"
                style={{ color: `${cellTextColor(pct)}99` }}
              >
                {realized}/{planned}
              </span>
            )}
          </>
        ) : (
          <span className="text-[0.65rem]" style={{ color: "#C0C8D8" }}>
            —
          </span>
        )}
      </div>
    </td>
  );
}

// ── Average badge ────────────────────────────────────────────
function AvgBadge({ pct, large = false }: { pct: number | null; large?: boolean }) {
  if (pct === null) return <span className="text-muted-foreground text-xs">—</span>;
  return (
    <span
      className={`inline-flex items-center justify-center rounded-md font-bold tabular-nums ${large ? "px-2.5 py-1 text-sm" : "px-2 py-0.5 text-xs"}`}
      style={{
        backgroundColor: cellBg(pct),
        color: cellTextColor(pct),
        border: cellBorder(pct),
      }}
    >
      {pct}%
    </span>
  );
}

// ── Main component ───────────────────────────────────────────
export function PtciHeatmap() {
  const [hovered, setHovered] = useState<{ row: number; col: number } | null>(null);

  // year group col spans
  const year25cols = MONTHS.filter((m) => m.includes("/25")).length; // 12
  const year26cols = MONTHS.filter((m) => m.includes("/26")).length; // 4

  return (
    <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
      {/* ── Legend bar ──────────────────────────────────────── */}
      <div
        className="px-5 py-3 flex items-center justify-between gap-4 border-b border-border"
        style={{ backgroundColor: "#FAFBFD" }}
      >
        <div>
          <h3 className="text-sm font-bold text-foreground">
            PTCI Heat Map — FPSO × Month
          </h3>
          <p className="text-[0.65rem] text-muted-foreground">
            Cell = PTCI % · small text = realized / planned · hover to highlight
          </p>
        </div>
        {/* Legend */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="flex items-center gap-1.5">
            <span
              className="w-4 h-4 rounded"
              style={{ backgroundColor: "#E6F6EC", border: "1px solid #A8DFB8" }}
            />
            <span className="text-xs text-muted-foreground">≥ 95%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className="w-4 h-4 rounded"
              style={{ backgroundColor: "#FFF8E1", border: "1px solid #F5D97A" }}
            />
            <span className="text-xs text-muted-foreground">80 – 94%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className="w-4 h-4 rounded"
              style={{ backgroundColor: "#FDECEA", border: "1px solid #F5B3AE" }}
            />
            <span className="text-xs text-muted-foreground">&lt; 80%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className="w-4 h-4 rounded"
              style={{ border: "1px solid #EEF0F5" }}
            />
            <span className="text-xs text-muted-foreground">No data</span>
          </div>
        </div>
      </div>

      {/* ── Grid ────────────────────────────────────────────── */}
      <div className="overflow-x-auto p-2">
        <table className="border-separate border-spacing-0 w-full">
          <thead>
            {/* Year grouping row */}
            <tr>
              <th className="w-24 px-3" />
              <th
                colSpan={year25cols}
                className="th-navy py-2 text-center text-xs font-semibold tracking-wider rounded-tl-md"
                style={{ borderRight: "2px solid #F26522" }}
              >
                2025
              </th>
              <th
                colSpan={year26cols}
                className="th-navy py-2 text-center text-xs font-semibold tracking-wider rounded-tr-md"
              >
                2026
              </th>
              <th className="w-16 px-2 text-center text-xs text-muted-foreground font-semibold">
                Avg
              </th>
            </tr>
            {/* Month labels */}
            <tr>
              <th className="text-left px-3 py-1.5 text-xs text-muted-foreground font-semibold">
                Unit
              </th>
              {MONTHS.map((m, i) => {
                const isYearBoundary = m === "Jan/26";
                return (
                  <th
                    key={m}
                    className="text-center py-1.5 text-[0.65rem] font-semibold"
                    style={{
                      color:
                        hovered?.col === i
                          ? "#F26522"
                          : "var(--muted-foreground)",
                      borderLeft: isYearBoundary ? "2px solid #F26522" : undefined,
                      minWidth: "54px",
                    }}
                  >
                    {m.replace("/25", "").replace("/26", "")}
                  </th>
                );
              })}
              <th />
            </tr>
          </thead>

          <tbody>
            {/* ── FPSO rows ───────────────────────────────────── */}
            {fpsoData.map((unit, ri) => {
              const avg = fpsoAvg(ri);
              return (
                <tr key={unit.code}>
                  {/* Row label */}
                  <td className="px-3 py-1">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-1.5 h-6 rounded-full shrink-0"
                        style={{
                          backgroundColor:
                            avg === null
                              ? "#EEF0F5"
                              : avg >= 95
                              ? "#1E8A4C"
                              : avg >= 80
                              ? "#C97C00"
                              : "#C0251A",
                        }}
                      />
                      <span
                        className="text-xs font-bold"
                        style={{
                          color:
                            hovered?.row === ri
                              ? "#F26522"
                              : "var(--foreground)",
                        }}
                      >
                        {unit.code}
                      </span>
                    </div>
                  </td>

                  {unit.months.map((m, ci) => {
                    const isYearBoundary = MONTHS[ci] === "Jan/26";
                    return (
                      <td
                        key={ci}
                        className="p-[3px]"
                        style={{
                          minWidth: "54px",
                          borderLeft: isYearBoundary
                            ? "2px solid rgba(242,101,34,0.25)"
                            : undefined,
                        }}
                      >
                        <div
                          onMouseEnter={() => setHovered({ row: ri, col: ci })}
                          onMouseLeave={() => setHovered(null)}
                          className="rounded-md flex flex-col items-center justify-center h-[52px] cursor-default select-none transition-all duration-150"
                          style={{
                            backgroundColor: cellBg(m.pctNoPrazo),
                            border: cellBorder(m.pctNoPrazo),
                            transform:
                              hovered?.row === ri && hovered?.col === ci && m.pctNoPrazo !== null
                                ? "scale(1.1)"
                                : "scale(1)",
                            boxShadow:
                              hovered?.row === ri && hovered?.col === ci && m.pctNoPrazo !== null
                                ? "0 4px 16px rgba(0,0,0,0.15)"
                                : "none",
                            opacity:
                              hovered !== null &&
                              (hovered.row !== ri && hovered.col !== ci)
                                ? 0.55
                                : 1,
                            position: "relative",
                            zIndex:
                              hovered?.row === ri && hovered?.col === ci ? 10 : 1,
                          }}
                        >
                          {m.pctNoPrazo !== null ? (
                            <>
                              <span
                                className="text-xs font-bold leading-tight"
                                style={{ color: cellTextColor(m.pctNoPrazo) }}
                              >
                                {m.pctNoPrazo}%
                              </span>
                              {m.planejadas > 0 && (
                                <span
                                  className="text-[0.52rem] leading-tight mt-0.5 tabular-nums"
                                  style={{
                                    color: `${cellTextColor(m.pctNoPrazo)}88`,
                                  }}
                                >
                                  {m.realizadas}/{m.planejadas}
                                </span>
                              )}
                            </>
                          ) : (
                            <span
                              className="text-[0.65rem]"
                              style={{ color: "#C0C8D8" }}
                            >
                              —
                            </span>
                          )}
                        </div>
                      </td>
                    );
                  })}

                  {/* Row average */}
                  <td className="px-2 text-center">
                    <AvgBadge pct={avg} />
                  </td>
                </tr>
              );
            })}

            {/* ── Fleet PTCI row (from Panel 1 data) ─────────── */}
            <tr>
              <td className="px-3 pt-3 pb-1">
                <span
                  className="text-[0.65rem] font-bold uppercase tracking-wide"
                  style={{ color: "#1B2A47" }}
                >
                  Fleet PTCI
                </span>
              </td>
              {fleetData.map((row, ci) => {
                const isYearBoundary = MONTHS[ci] === "Jan/26";
                return (
                  <td
                    key={ci}
                    className="pt-3 pb-1 px-[3px] text-center"
                    style={{
                      borderLeft: isYearBoundary
                        ? "2px solid rgba(242,101,34,0.25)"
                        : undefined,
                    }}
                  >
                    <div
                      className="rounded-md flex items-center justify-center h-8"
                      style={{
                        backgroundColor: cellBg(row.ptci),
                        border: cellBorder(row.ptci),
                      }}
                    >
                      <span
                        className="text-xs font-bold tabular-nums"
                        style={{ color: cellTextColor(row.ptci) }}
                      >
                        {Math.round(row.ptci)}%
                      </span>
                    </div>
                  </td>
                );
              })}
              {/* Fleet overall avg */}
              <td className="px-2 pt-3 pb-1 text-center">
                <AvgBadge
                  pct={Math.round(
                    fleetData.reduce((s, r) => s + r.ptci, 0) / fleetData.length
                  )}
                  large
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── Bottom note ─────────────────────────────────────── */}
      <div
        className="px-5 py-2.5 border-t border-border text-[0.65rem] text-muted-foreground"
        style={{ backgroundColor: "#FAFBFD" }}
      >
        Fleet PTCI row uses consolidated data from Panel 1 · FPSO cells use ACTUAL_OBJECT_SITE per-unit data
      </div>
    </div>
  );
}
