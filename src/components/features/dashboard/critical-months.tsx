"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, AlertCircle } from "lucide-react";
import { fleetData, fpsoData, MONTHS } from "@/lib/mock-data";

export function CriticalMonths() {
  // Find months where PTCI is < 80%
  const criticalIndices = fleetData
    .map((data, index) => ({ data, index }))
    .filter((item) => item.data.ptci < 80);

  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (criticalIndices.length === 0) return null;

  return (
    <div className="space-y-3">
      {criticalIndices.map(({ data, index }) => {
        const monthName = MONTHS[index];
        const isExpanded = expandedIndex === index;

        // For the mock presentation, we distribute the fleet overdue/faa deterministically among units
        // In the real implementation, this will come directly from the DB snapshot
        let remainingOverdue = data.overdue;
        let remainingFaa = data.faa;

        const contributors = fpsoData
          .map((u, i) => {
            const overdue = remainingOverdue > 0 && (i + index) % 2 === 0 ? Math.min(remainingOverdue, Math.ceil(data.overdue / 2)) : 0;
            const faa = remainingFaa > 0 && (i + index) % 3 === 0 ? 1 : 0;
            remainingOverdue -= overdue;
            remainingFaa -= faa;
            
            return {
              code: u.code,
              overdue,
              faa,
            };
          })
          .filter((u) => u.overdue > 0 || u.faa > 0)
          .sort((a, b) => b.overdue + b.faa - (a.overdue + a.faa)); // sort worst first

        return (
          <div
            key={monthName}
            className="border border-border rounded-lg bg-card overflow-hidden transition-all shadow-sm"
          >
            {/* Header / Toggle */}
            <button
              onClick={() => setExpandedIndex(isExpanded ? null : index)}
              className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-[var(--fsm-red)] shrink-0">
                  <AlertCircle className="w-4 h-4" />
                </span>
                <div className="text-left">
                  <h3 className="font-bold text-foreground">
                    {monthName} <span className="text-muted-foreground font-normal">was critical</span>
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5 text-xs">
                    <span className="font-semibold" style={{ color: "var(--fsm-red)" }}>
                      PTCI {Math.round(data.ptci)}%
                    </span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">
                      {data.overdue} Overdue, {data.faa} FAA
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-muted-foreground shrink-0">
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </div>
            </button>

            {/* Expanded Content */}
            {isExpanded && (
              <div className="p-4 pt-0 border-t border-border bg-muted/10">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-4 mb-3">
                  Contributing Units
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {contributors.map((c) => (
                    <div
                      key={c.code}
                      className="flex items-center justify-between p-3 rounded-md bg-card border border-border"
                    >
                      <span className="font-semibold text-sm text-foreground">
                        {c.code}
                      </span>
                      <div className="flex items-center gap-3 text-xs">
                        {c.overdue > 0 && (
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--fsm-red)" }} />
                            <span>{c.overdue} Overdue</span>
                          </div>
                        )}
                        {c.faa > 0 && (
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--fsm-amber)" }} />
                            <span>{c.faa} FAA</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {contributors.length === 0 && (
                    <div className="text-xs text-muted-foreground">No unit data available for this month.</div>
                  )}
                </div>
                
                {data.execAntecipadas > 0 && (
                  <div className="mt-4 text-xs text-muted-foreground bg-blue-50/50 p-3 rounded-md border border-blue-100/50">
                    <span className="font-semibold text-[var(--sbm-navy)]">Information:</span> There were {data.execAntecipadas} early executions in this month that were not counted toward the PTCI because their OLF was scheduled for future months.
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
