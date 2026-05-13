"use client";

import React from "react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  YAxis,
  XAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

type Props = {
  data: number[];
  color: string;
  width?: number;
  height?: number;
};

export function Sparkline({ data, color, width = 80, height = 30 }: Props) {
  const chartData = data.map((v, i) => ({ val: v, i }));

  return (
    <div style={{ width, height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <Line
            type="monotone"
            dataKey="val"
            stroke={color}
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

import { MONTHS as DEFAULT_MONTHS } from "@/lib/mock-data";

export function DetailedTrend({ 
  data, 
  color, 
  title, 
  unit,
  months = [] 
}: { 
  data: number[], 
  color: string, 
  title: string, 
  unit: string,
  months?: string[]
}) {
  const chartMonths = months && months.length > 0 ? months : DEFAULT_MONTHS;
  const chartData = data.map((v, i) => ({ 
    val: v, 
    name: chartMonths[i] || `${i+1}` 
  }));
  
  return (
    <div className="w-[360px] h-[220px] p-3 bg-popover rounded-xl shadow-2xl border border-border">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-sm font-black text-foreground tracking-tight">{title}</h4>
          <p className="text-[0.65rem] text-muted-foreground font-bold uppercase tracking-widest">{unit} Unit Analysis</p>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[0.6rem] font-black px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border/50 uppercase">
            Jan/25 – Apr/26
          </span>
          <span className="text-[0.55rem] text-muted-foreground/60 mt-1">Non-cumulative view</span>
        </div>
      </div>

      <div className="h-[140px] w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 8, fontWeight: 700, fill: 'var(--muted-foreground)' }}
              interval={2}
            />
            <YAxis 
              domain={[0, 100]} 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 8, fontWeight: 700, fill: 'var(--muted-foreground)' }}
              ticks={[0, 20, 40, 60, 80, 100]}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip 
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-background border border-border px-3 py-2 rounded-lg shadow-xl text-[0.7rem] border-l-4" style={{ borderLeftColor: color }}>
                      <div className="text-muted-foreground font-bold mb-1">{label}</div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                        <span className="font-black text-foreground text-sm">
                          {Number(payload[0].value).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line
              type="monotone"
              dataKey="val"
              stroke={color}
              strokeWidth={2}
              dot={{ r: 2, fill: color, strokeWidth: 1.5, stroke: '#fff' }}
              activeDot={{ r: 4, strokeWidth: 0 }}
              animationDuration={1000}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
