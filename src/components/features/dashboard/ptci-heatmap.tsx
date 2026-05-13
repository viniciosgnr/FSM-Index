"use client";

import React, { useState, useMemo } from "react";
import type { FpsoUnit, MonthlyRow } from "@/lib/mock-data";
import { MONTHS } from "@/lib/mock-data";
import { IndexInfoTooltip } from "./index-info-tooltip";
import { Sparkline, DetailedTrend } from "./sparkline";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { INDEX_DEFINITIONS } from "@/lib/constants";

type MetricKey = "PTCI" | "MCI" | "FAAI";

type Props = {
  fpsoData: FpsoUnit[];
  fleetData: MonthlyRow[];
};

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
      {Math.round(pct)}%
    </span>
  );
}

// ── Main component ───────────────────────────────────────────
export function PtciHeatmap({ fpsoData, fleetData }: Props) {
  const [hovered, setHovered] = useState<{ row: number; col: number } | null>(null);
  const [activeMetric, setActiveMetric] = useState<MetricKey>("PTCI");

  const metricConfig = INDEX_DEFINITIONS[activeMetric];

  // Map metric key to data field
  const getMetricValue = (monthData: any, metric: MetricKey): number | null => {
    switch (metric) {
      case "PTCI": return monthData.pctNoPrazo;
      case "MCI": return monthData.mci;
      case "FAAI": return monthData.faai;
      default: return null;
    }
  };

  const getFleetMetricValue = (row: MonthlyRow, metric: MetricKey): number => {
    switch (metric) {
      case "PTCI": return row.ptci;
      case "MCI": return row.mci;
      case "FAAI": return row.faai;
      default: return 0;
    }
  };

  // FPSO average excluding nulls
  function fpsoAvg(unitIdx: number): number | null {
    const months = fpsoData[unitIdx].months;
    const values = months.map(m => getMetricValue(m, activeMetric)).filter(v => v !== null) as number[];
    if (values.length === 0) return null;
    return Math.round(values.reduce((s, v) => s + v, 0) / values.length);
  }

  // year group col spans
  const year25cols = MONTHS.filter((m) => m.includes("/25")).length;
  const year26cols = MONTHS.filter((m) => m.includes("/26")).length;

  return (
    <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden flex flex-col">
      {/* ── Header Bar ──────────────────────────────────────── */}
      <div
        className="px-5 py-4 flex items-center justify-between gap-4 border-b border-border bg-muted/30"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-sbm-navy rounded-lg">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              FPSO Index Heat Map
              <span className="text-[0.65rem] font-medium px-1.5 py-0.5 rounded-full bg-sbm-orange/10 text-sbm-orange border border-sbm-orange/20">
                Live Data
              </span>
            </h3>
            <p className="text-[0.65rem] text-muted-foreground mt-0.5">
              Vessel-specific trends and compliance monitoring · Month × Unit
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end gap-1">
            <span className="text-[0.6rem] font-bold text-muted-foreground uppercase tracking-widest">Visualizing Index</span>
            <Select value={activeMetric} onValueChange={(v) => setActiveMetric(v as MetricKey)}>
              <SelectTrigger className="h-8 w-32 text-xs font-bold bg-background">
                <SelectValue placeholder="Select Index" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PTCI">PTCI %</SelectItem>
                <SelectItem value="MCI">MCI %</SelectItem>
                <SelectItem value="FAAI">FAAI %</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* ── Legend Bar ──────────────────────────────────────── */}
      <div className="px-5 py-2.5 flex items-center justify-between border-b border-border bg-background">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-[#E6F6EC] border border-[#A8DFB8]" />
            <span className="text-[0.65rem] font-medium text-muted-foreground">Compliance (≥ 95%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-[#FFF8E1] border border-[#F5D97A]" />
            <span className="text-[0.65rem] font-medium text-muted-foreground">Warning (80-94%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-[#FDECEA] border border-[#F5B3AE]" />
            <span className="text-[0.65rem] font-medium text-muted-foreground">Critical (&lt; 80%)</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
           <span className="text-[0.65rem] text-muted-foreground italic">
             Highlighting: <strong>{metricConfig.name}</strong>
           </span>
        </div>
      </div>

      {/* ── Grid ────────────────────────────────────────────── */}
      <div className="overflow-x-auto p-4">
        <table className="border-separate border-spacing-y-2 border-spacing-x-0 w-full">
          <thead>
            {/* Year grouping row */}
            <tr className="bg-transparent">
              <th className="w-28 px-3" />
              <th
                colSpan={year25cols}
                className="py-1.5 text-center text-[0.65rem] font-bold tracking-widest text-muted-foreground uppercase border-b-2 border-sbm-navy/10"
              >
                2025 Calendar Year
              </th>
              <th
                colSpan={year26cols}
                className="py-1.5 text-center text-[0.65rem] font-bold tracking-widest text-muted-foreground uppercase border-b-2 border-sbm-navy/10"
              >
                2026 CY
              </th>
              <th className="w-16 text-center text-[0.65rem] text-muted-foreground font-bold uppercase tracking-wider">Avg</th>
              <th className="w-24 text-center text-[0.65rem] text-muted-foreground font-bold uppercase tracking-wider">Trend</th>
            </tr>
            {/* Month labels */}
            <tr>
              <th className="text-left px-3 py-2">
                 <span className="text-[0.65rem] font-bold text-sbm-navy/40 uppercase tracking-widest">FPSO Unit</span>
              </th>
              {MONTHS.map((m, i) => {
                const isYearBoundary = m === "Jan/26";
                return (
                  <th
                    key={m}
                    className="text-center py-2 text-[0.6rem] font-bold"
                    style={{
                      color: hovered?.col === i ? "#F26522" : "var(--muted-foreground)",
                      borderLeft: isYearBoundary ? "1px dashed #E2E8F0" : undefined,
                      minWidth: "48px",
                    }}
                  >
                    {m.split('/')[0]}
                  </th>
                );
              })}
              <th colSpan={2} />
            </tr>
          </thead>

          <tbody className="before:block before:h-2">
            {/* ── FPSO rows ───────────────────────────────────── */}
            {fpsoData.map((unit, ri) => {
              const avg = fpsoAvg(ri);
              const trendData = unit.months
                .map(m => getMetricValue(m, activeMetric))
                .filter(v => v !== null) as number[];

              return (
                <tr 
                  key={unit.code} 
                  className="group transition-colors hover:bg-muted/30"
                >
                  {/* Row label */}
                  <td className="px-3 py-1 first:rounded-l-lg last:rounded-r-lg bg-background border-y border-l border-border">
                    <div className="flex items-center gap-2.5">
                      <div 
                        className="w-1.5 h-6 rounded-full shrink-0 shadow-sm"
                        style={{
                          backgroundColor:
                            avg === null ? "#EEF0F5" : 
                            avg >= 95 ? "#1E8A4C" : 
                            avg >= 80 ? "#C97C00" : "#C0251A",
                        }}
                      />
                      <span className="text-xs font-bold text-foreground group-hover:text-sbm-orange transition-colors">
                        {unit.code}
                      </span>
                    </div>
                  </td>

                  {unit.months.map((m, ci) => {
                    const val = getMetricValue(m, activeMetric);
                    const isYearBoundary = MONTHS[ci] === "Jan/26";
                    return (
                      <td
                        key={ci}
                        className="p-[1px] bg-background border-y border-border"
                        style={{
                          minWidth: "48px",
                          borderLeft: isYearBoundary ? "1px dashed #E2E8F0" : undefined,
                        }}
                      >
                        <div
                          onMouseEnter={() => setHovered({ row: ri, col: ci })}
                          onMouseLeave={() => setHovered(null)}
                          className="rounded flex flex-col items-center justify-center h-[48px] cursor-default select-none transition-all duration-200"
                          style={{
                            backgroundColor: cellBg(val),
                            border: cellBorder(val),
                            transform: hovered?.row === ri && hovered?.col === ci && val !== null ? "scale(1.15)" : "scale(1)",
                            boxShadow: hovered?.row === ri && hovered?.col === ci && val !== null ? "0 4px 20px rgba(0,0,0,0.18)" : "none",
                            opacity: hovered !== null && (hovered.row !== ri && hovered.col !== ci) ? 0.4 : 1,
                            zIndex: hovered?.row === ri && hovered?.col === ci ? 10 : 1,
                            position: "relative",
                          }}
                        >
                          {val !== null ? (
                            <>
                              <span className="text-[0.7rem] font-bold" style={{ color: cellTextColor(val) }}>
                                {Math.round(val)}%
                              </span>
                              {m.planejadas > 0 && activeMetric === "PTCI" && (
                                <span className="text-[0.5rem] font-medium opacity-60 tabular-nums">
                                  {m.realizadas}/{m.planejadas}
                                </span>
                              )}
                            </>
                          ) : (
                            <span className="text-[0.6rem] text-muted-foreground/30">—</span>
                          )}
                        </div>
                      </td>
                    );
                  })}

                  {/* Row average */}
                  <td className="px-2 text-center bg-background border-y border-border">
                    <AvgBadge pct={avg} />
                  </td>

                  {/* Trend Sparkline with Hover Expansion */}
                  <td className="px-3 bg-background border-y border-r border-border rounded-r-lg">
                    <Popover>
                      <PopoverTrigger asChild>
                        <div className="cursor-pointer hover:bg-muted/50 rounded p-1 transition-colors">
                          <Sparkline 
                            data={trendData} 
                            color={metricConfig.color} 
                            width={80} 
                            height={24} 
                          />
                        </div>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="end">
                        <DetailedTrend 
                          data={trendData} 
                          color={metricConfig.color} 
                          title={metricConfig.name}
                          unit={unit.code}
                        />
                      </PopoverContent>
                    </Popover>
                  </td>
                </tr>
              );
            })}

            {/* ── Spacing ──────────────────────────────────────── */}
            <tr className="h-4"><td colSpan={MONTHS.length + 3} /></tr>

            {/* ── Fleet Rows (Aggregate) ───────────────────────── */}
            {["PTCI", "MCI", "FAAI"].map((metric) => {
              const m = metric as MetricKey;
              const config = INDEX_DEFINITIONS[m];
              const isSelected = activeMetric === m;
              
              return (
                <tr 
                  key={m} 
                  className={`transition-all ${isSelected ? 'ring-2 ring-inset ring-sbm-orange/20 bg-sbm-orange/5' : 'bg-muted/10'}`}
                >
                  <td className="px-3 py-3 rounded-l-lg border-y border-l border-border/50">
                    <IndexInfoTooltip indexKey={m}>
                      <span className="text-[0.65rem] font-bold uppercase tracking-wider text-sbm-navy flex items-center gap-1.5">
                        Fleet {m} %
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-sbm-orange animate-pulse" />}
                      </span>
                    </IndexInfoTooltip>
                  </td>
                  
                  {fleetData.map((row, ci) => {
                    const val = getFleetMetricValue(row, m);
                    const isYearBoundary = MONTHS[ci] === "Jan/26";
                    return (
                      <td
                        key={ci}
                        className="py-3 px-[2px] border-y border-border/50"
                        style={{
                          borderLeft: isYearBoundary ? "1px dashed #CBD5E1" : undefined,
                        }}
                      >
                        <div
                          className="rounded flex items-center justify-center h-8 transition-all hover:scale-110 shadow-sm border"
                          style={{
                            backgroundColor: cellBg(val),
                            borderColor: isSelected ? "#F26522" : cellTextColor(val),
                            borderWidth: isSelected ? "2px" : "1px",
                          }}
                        >
                          <span
                            className="text-[0.7rem] font-bold tabular-nums"
                            style={{ color: cellTextColor(val) }}
                          >
                            {Math.round(val)}%
                          </span>
                        </div>
                      </td>
                    );
                  })}
                  
                  <td className="px-2 py-3 text-center border-y border-border/50">
                    <AvgBadge
                      pct={fleetData.reduce((s, r) => s + getFleetMetricValue(r, m), 0) / fleetData.length}
                      large
                    />
                  </td>
                  <td className="px-3 py-3 rounded-r-lg border-y border-r border-border/50">
                     <Sparkline 
                        data={fleetData.map(r => getFleetMetricValue(r, m))} 
                        color={config.color} 
                        width={80} 
                        height={24} 
                      />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── Footer ────────────────────────────────────────── */}
      <div
        className="px-5 py-3 border-t border-border flex justify-between items-center bg-muted/20"
      >
        <span className="text-[0.65rem] text-muted-foreground flex items-center gap-2">
          <Info className="w-3 h-3" />
          Click on trend graphs for detailed analysis · Row separation active for improved unit visibility
        </span>
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-sbm-navy" />
            <span className="text-[0.6rem] font-bold uppercase tracking-tight text-muted-foreground">Fleet Aggregate</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-sbm-orange" />
            <span className="text-[0.6rem] font-bold uppercase tracking-tight text-muted-foreground">Active Selection</span>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Info } from "lucide-react";
