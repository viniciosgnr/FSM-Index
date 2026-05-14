"use client";

import React, { useState } from "react";
import { Sparkline, DetailedTrend } from "./sparkline";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { FpsoUnit } from "@/lib/mock-data";
import { Info } from "lucide-react";
import { IndexInfoTooltip } from "./index-info-tooltip";

type Props = {
  months: string[];
  units: FpsoUnit[];
};

type MetricType = "PTCI" | "MCI" | "FAAI";

const METRICS: Record<MetricType, { label: string; color: string; unit: string }> = {
  PTCI: { label: "Proof Test Compliance", color: "#10b981", unit: "%" },
  MCI: { label: "Mitigation Compliance", color: "#f59e0b", unit: "%" },
  FAAI: { label: "Failure Assurance Activity", color: "#ef4444", unit: "%" },
};

export function Panel2Fpso({ months, units }: Props) {
  const [activeMetric, setActiveMetric] = useState<MetricType>("PTCI");
  const metricConfig = METRICS[activeMetric];

  const getMetricValue = (m: FpsoUnit["months"][0], type: MetricType) => {
    if (type === "PTCI") return m.pctNoPrazo;
    if (type === "MCI") return m.mci;
    if (type === "FAAI") return m.faai;
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header with Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-border shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-orange-500/10 text-orange-600">
            <Info className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              FPSO Unit Breakdown
              <IndexInfoTooltip indexKey={activeMetric}>
                <span className="text-muted-foreground cursor-help hover:text-orange-500 transition-colors">
                  <Info className="w-4 h-4" />
                </span>
              </IndexInfoTooltip>
            </h3>
            <p className="text-sm text-muted-foreground font-medium">Detailed performance monitoring per vessel</p>
          </div>
        </div>

        <div className="flex bg-muted/50 p-1.5 rounded-xl border border-border/50 self-start md:self-center">
          {(Object.keys(METRICS) as MetricType[]).map((m) => (
            <button
              key={m}
              onClick={() => setActiveMetric(m)}
              className={`px-6 py-2 rounded-lg text-xs font-black transition-all ${
                activeMetric === m
                  ? "bg-white text-orange-600 shadow-md scale-105"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-xl border border-border bg-white shadow-sm">
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
            {units.map((unit, ui) => {
              const trendData = unit.months.map(m => getMetricValue(m, activeMetric) ?? 0);
              
              return (
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
                    {unit.months.map((m, mi) => {
                      const val = getMetricValue(m, activeMetric);
                      return (
                        <td key={mi} className="text-center py-2 px-1 border-l border-border/30">
                          {val !== null ? (
                            <span
                              className={`inline-block px-1.5 py-0.5 rounded text-[0.65rem] font-bold ${
                                val >= 95 ? "text-emerald-600 bg-emerald-500/10" : 
                                val >= 80 ? "text-amber-600 bg-amber-500/10" : "text-rose-600 bg-rose-500/10"
                              }`}
                            >
                              {val.toFixed(0)}%
                            </span>
                          ) : (
                            <span className="text-muted-foreground/30">—</span>
                          )}
                        </td>
                      );
                    })}

                    {/* ── Sparkline ── */}
                    <td rowSpan={2} className="border-l border-border px-2 align-middle bg-card/30">
                      <Popover>
                        <PopoverTrigger asChild>
                          <div className="cursor-pointer hover:bg-white rounded-lg p-1.5 transition-all hover:scale-105 flex items-center justify-center border border-transparent hover:border-border/50 shadow-sm hover:shadow-md">
                            <Sparkline 
                              data={trendData} 
                              color={metricConfig.color} 
                              width={90} 
                              height={35} 
                            />
                          </div>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 border-none shadow-none bg-transparent" side="left" align="center" sideOffset={10}>
                          <DetailedTrend 
                            data={trendData} 
                            color={metricConfig.color} 
                            title={`${activeMetric} Analysis — ${unit.code}`}
                            unit={unit.code}
                            months={months}
                          />
                        </PopoverContent>
                      </Popover>
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
                      {unit.code} - realized / on time
                    </td>
                    {unit.months.map((m, mi) => {
                      const noPrazo = m.noPrazo || 0;
                      const realizadas = m.realizadas || 0;
                      const diff = noPrazo - realizadas;

                      if (noPrazo === 0 && realizadas === 0) {
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
                            {realizadas}
                          </span>
                          <span className="text-muted-foreground">/{noPrazo}</span>
                          {diff < 0 && (
                            <span
                              className="ml-0.5 text-[0.58rem]"
                              style={{ color: "#1B6BB0" }}
                            >
                              ({diff})
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legend Footer */}
      <div className="flex items-center justify-between px-6 py-4 bg-muted/20 rounded-2xl border border-border/50">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-[0.7rem] font-black text-muted-foreground uppercase tracking-widest">Compliance ≥ 95%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-[0.7rem] font-black text-muted-foreground uppercase tracking-widest">Warning (80-95%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500" />
            <span className="text-[0.7rem] font-black text-muted-foreground uppercase tracking-widest">Critical &lt; 80%</span>
          </div>
        </div>
        <p className="text-[0.65rem] text-muted-foreground italic font-medium">
          Format: realizadas / no prazo (-antecipadas)
        </p>
      </div>
    </div>
  );
}
