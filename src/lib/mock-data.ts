// Mock data mirroring the SBM Offshore proof-of-concept spreadsheet
// Reference: Jan/2025 – Apr/2026 | OLF-based planning

export const MONTHS = [
  "Jan/25", "Feb/25", "Mar/25", "Apr/25", "May/25", "Jun/25",
  "Jul/25", "Aug/25", "Sep/25", "Oct/25", "Nov/25", "Dec/25",
  "Jan/26", "Feb/26", "Mar/26", "Apr/26",
];

export type MonthlyRow = {
  planejadas: number;
  executadasNoPrazo: number;
  foraDoPrazo: number;
  overdue: number;
  execAntecipadas: number;
  mitigacoes: number;
  faa: number;
  ptci: number; // percentage 0–100
  mci: number;  // percentage 0–100
  faai: number; // percentage 0–100
};

function calculateMetrics(row: Partial<MonthlyRow>): MonthlyRow {
  const p = row.planejadas || 0;
  const overdue = row.overdue || 0;
  const mitigacoes = row.mitigacoes || 0;
  const faa = row.faa || 0;

  // PTCI = [1 - (Overdue + Mitigations) / Planned] * 100
  const ptci = p > 0 ? (1 - (overdue + mitigacoes) / p) * 100 : 100;
  
  // MCI = [1 - (Mitigations / (Overdue + Mitigations))] * 100
  const denomMci = overdue + mitigacoes;
  const mci = denomMci > 0 ? (1 - mitigacoes / denomMci) * 100 : 100;

  // FAAI = [1 - (FAA / Planned)] * 100
  const faai = p > 0 ? (1 - faa / p) * 100 : 100;

  return {
    planejadas: p,
    executadasNoPrazo: row.executadasNoPrazo || 0,
    foraDoPrazo: row.foraDoPrazo || 0,
    overdue: overdue,
    execAntecipadas: row.execAntecipadas || 0,
    mitigacoes: mitigacoes,
    faa: faa,
    ptci: Number(ptci.toFixed(2)),
    mci: Number(mci.toFixed(2)),
    faai: Number(faai.toFixed(2)),
  };
}

export const fleetData: MonthlyRow[] = [
  calculateMetrics({ planejadas: 76,  executadasNoPrazo: 75, foraDoPrazo: 1, overdue: 0,   execAntecipadas: 13, mitigacoes: 0,   faa: 0 }),
  calculateMetrics({ planejadas: 55,  executadasNoPrazo: 55, foraDoPrazo: 0, overdue: 0,   execAntecipadas: 10, mitigacoes: 0,   faa: 0 }),
  calculateMetrics({ planejadas: 44,  executadasNoPrazo: 43, foraDoPrazo: 1, overdue: 0,   execAntecipadas: 23, mitigacoes: 1,   faa: 1 }), // FAA=1 -> FAAI should be ~97.7%
  calculateMetrics({ planejadas: 40,  executadasNoPrazo: 40, foraDoPrazo: 0, overdue: 0,   execAntecipadas: 1,  mitigacoes: 0,   faa: 0 }),
  calculateMetrics({ planejadas: 64,  executadasNoPrazo: 61, foraDoPrazo: 0, overdue: 3,   execAntecipadas: 16, mitigacoes: 0,   faa: 0 }),
  calculateMetrics({ planejadas: 76,  executadasNoPrazo: 48, foraDoPrazo: 1, overdue: 27,  execAntecipadas: 6,  mitigacoes: 1,   faa: 0 }),
  calculateMetrics({ planejadas: 82,  executadasNoPrazo: 64, foraDoPrazo: 0, overdue: 18,  execAntecipadas: 8,  mitigacoes: 0,   faa: 1 }),
  calculateMetrics({ planejadas: 42,  executadasNoPrazo: 42, foraDoPrazo: 0, overdue: 0,   execAntecipadas: 87, mitigacoes: 0,   faa: 0 }),
  calculateMetrics({ planejadas: 33,  executadasNoPrazo: 33, foraDoPrazo: 0, overdue: 0,   execAntecipadas: 0,  mitigacoes: 0,   faa: 1 }),
  calculateMetrics({ planejadas: 51,  executadasNoPrazo: 51, foraDoPrazo: 0, overdue: 0,   execAntecipadas: 0,  mitigacoes: 0,   faa: 0 }),
  calculateMetrics({ planejadas: 90,  executadasNoPrazo: 83, foraDoPrazo: 0, overdue: 7,   execAntecipadas: 36, mitigacoes: 4,   faa: 0 }),
  calculateMetrics({ planejadas: 254, executadasNoPrazo: 0,  foraDoPrazo: 0, overdue: 126, execAntecipadas: 23, mitigacoes: 124, faa: 1 }),
  calculateMetrics({ planejadas: 81,  executadasNoPrazo: 75, foraDoPrazo: 0, overdue: 6,   execAntecipadas: 34, mitigacoes: 6,   faa: 1 }),
  calculateMetrics({ planejadas: 41,  executadasNoPrazo: 41, foraDoPrazo: 0, overdue: 0,   execAntecipadas: 4,  mitigacoes: 0,   faa: 0 }),
  calculateMetrics({ planejadas: 61,  executadasNoPrazo: 61, foraDoPrazo: 0, overdue: 0,   execAntecipadas: 20, mitigacoes: 0,   faa: 0 }),
  calculateMetrics({ planejadas: 34,  executadasNoPrazo: 34, foraDoPrazo: 0, overdue: 0,   execAntecipadas: 4,  mitigacoes: 0,   faa: 0 }),
];

export type FpsoUnit = {
  code: string;
  months: Array<{
    pctNoPrazo: number | null; // PTCI
    mci: number | null;
    faai: number | null;
    realizadas: number; // Total realized (on-time + late)
    noPrazo: number;    // Realized on-time
    planejadas: number;
    overdue: number;
    mitigacoes: number;
    faa: number;
  }>;
};

function calculateFpsoMonth(m: any) {
  const p = m.planejadas || 0;
  if (p === 0 && (m.realizadas || 0) === 0) return { ...m, pctNoPrazo: null, mci: null, faai: null };
  
  const overdue = m.overdue || 0;
  const mitigacoes = m.mitigacoes || 0;
  const faa = m.faa || 0;
  const realizadas = m.realizadas || 0;
  const noPrazo = m.noPrazo || realizadas; // default to all on time if not specified

  const ptci = p > 0 ? (1 - (overdue + mitigacoes) / p) * 100 : 100;
  const denomMci = overdue + mitigacoes;
  const mci = denomMci > 0 ? (1 - mitigacoes / denomMci) * 100 : 100;
  const faai = p > 0 ? (1 - faa / p) * 100 : 100;

  return {
    ...m,
    realizadas,
    noPrazo,
    pctNoPrazo: Number(ptci.toFixed(1)),
    mci: Number(mci.toFixed(1)),
    faai: Number(faai.toFixed(1)),
  };
}

export const fpsoData: FpsoUnit[] = [
  {
    code: "CDA",
    months: Array(16).fill(null).map((_, i) => 
      calculateFpsoMonth({ realizadas: i === 9 ? 1 : i === 12 ? 2 : 0, planejadas: i === 9 ? 1 : i === 12 ? 2 : 0, antecipadas: 0, overdue: 0, mitigacoes: 0, faa: 0 })
    ),
  },
  {
    code: "CDI",
    months: [
      calculateFpsoMonth({ realizadas: 5, planejadas: 6, antecipadas: -1, overdue: 1, mitigacoes: 0, faa: 0 }),
      calculateFpsoMonth({ realizadas: 8, planejadas: 8, antecipadas: 0, overdue: 0, mitigacoes: 0, faa: 0 }),
      calculateFpsoMonth({ realizadas: 2, planejadas: 2, antecipadas: 0, overdue: 0, mitigacoes: 0, faa: 0 }),
      calculateFpsoMonth({ realizadas: 2, planejadas: 2, antecipadas: 0, overdue: 0, mitigacoes: 0, faa: 0 }),
      calculateFpsoMonth({ realizadas: 7, planejadas: 7, antecipadas: 0, overdue: 0, mitigacoes: 0, faa: 0 }),
      calculateFpsoMonth({ realizadas: 1, planejadas: 3, antecipadas: -2, overdue: 2, mitigacoes: 0, faa: 0 }),
      calculateFpsoMonth({ realizadas: 4, planejadas: 5, antecipadas: -1, overdue: 1, mitigacoes: 0, faa: 0 }),
      calculateFpsoMonth({ realizadas: 16, planejadas: 16, antecipadas: 0, overdue: 0, mitigacoes: 0, faa: 0 }),
      calculateFpsoMonth({ realizadas: 7, planejadas: 10, antecipadas: -3, overdue: 3, mitigacoes: 0, faa: 0 }),
      calculateFpsoMonth({ realizadas: 21, planejadas: 32, antecipadas: -11, overdue: 11, mitigacoes: 0, faa: 0 }),
      calculateFpsoMonth({ realizadas: 10, planejadas: 10, antecipadas: 0, overdue: 0, mitigacoes: 0, faa: 0 }),
      calculateFpsoMonth({ realizadas: 11, planejadas: 21, antecipadas: 0, overdue: 10, mitigacoes: 0, faa: 0 }),
      calculateFpsoMonth({ realizadas: 5, planejadas: 5, antecipadas: 0, overdue: 0, mitigacoes: 0, faa: 0 }),
      calculateFpsoMonth({ realizadas: 3, planejadas: 3, antecipadas: 0, overdue: 0, mitigacoes: 0, faa: 0 }),
      calculateFpsoMonth({ realizadas: 2, planejadas: 3, antecipadas: 0, overdue: 1, mitigacoes: 0, faa: 0 }),
      calculateFpsoMonth({ realizadas: 2, planejadas: 2, antecipadas: 0, overdue: 0, mitigacoes: 0, faa: 0 }),
    ],
  },
  {
    code: "CDS",
    months: [
      calculateFpsoMonth({ realizadas: 10, planejadas: 13, antecipadas: -3, overdue: 3, mitigacoes: 0, faa: 1 }),
      calculateFpsoMonth({ realizadas: 3, planejadas: 3, antecipadas: 0, overdue: 0, mitigacoes: 0, faa: 0 }),
      calculateFpsoMonth({ realizadas: 5, planejadas: 6, antecipadas: -1, overdue: 1, mitigacoes: 0, faa: 0 }),
      calculateFpsoMonth({ realizadas: 2, planejadas: 2, antecipadas: 0, overdue: 0, mitigacoes: 0, faa: 0 }),
      calculateFpsoMonth({ realizadas: 3, planejadas: 3, antecipadas: 0, overdue: 0, mitigacoes: 0, faa: 0 }),
      calculateFpsoMonth({ realizadas: 20, planejadas: 21, antecipadas: -1, overdue: 1, mitigacoes: 0, faa: 0 }),
      calculateFpsoMonth({ realizadas: 23, planejadas: 23, antecipadas: -20, overdue: 0, mitigacoes: 0, faa: 0 }),
      calculateFpsoMonth({ realizadas: 7, planejadas: 7, antecipadas: 0, overdue: 0, mitigacoes: 0, faa: 0 }),
      calculateFpsoMonth({ realizadas: 8, planejadas: 8, antecipadas: 0, overdue: 0, mitigacoes: 0, faa: 0 }),
      calculateFpsoMonth({ realizadas: 10, planejadas: 10, antecipadas: 0, overdue: 0, mitigacoes: 0, faa: 0 }),
      calculateFpsoMonth({ realizadas: 8, planejadas: 8, antecipadas: 0, overdue: 0, mitigacoes: 0, faa: 0 }),
      calculateFpsoMonth({ realizadas: 1, planejadas: 1, antecipadas: 0, overdue: 0, mitigacoes: 0, faa: 0 }),
      calculateFpsoMonth({ realizadas: 6, planejadas: 6, antecipadas: 0, overdue: 0, mitigacoes: 0, faa: 0 }),
      calculateFpsoMonth({ realizadas: 5, planejadas: 5, antecipadas: 0, overdue: 0, mitigacoes: 0, faa: 0 }),
      calculateFpsoMonth({ realizadas: 3, planejadas: 3, antecipadas: 0, overdue: 0, mitigacoes: 0, faa: 0 }),
      calculateFpsoMonth({ realizadas: 0, planejadas: 0, antecipadas: 0 }),
    ],
  },
  {
    code: "CDM",
    months: Array(16).fill(null).map((_, i) => 
      calculateFpsoMonth({ realizadas: i === 11 ? 6 : 10, planejadas: i === 11 ? 7 : 10, antecipadas: i === 11 ? -1 : 0, overdue: i === 11 ? 1 : 0, mitigacoes: 0, faa: 0 })
    ),
  },
  {
    code: "CDP",
    months: Array(16).fill(null).map((_, i) => 
      calculateFpsoMonth({ realizadas: 10, planejadas: 10, antecipadas: 0, overdue: 0, mitigacoes: 0, faa: 0 })
    ),
  },
  {
    code: "ADG",
    months: Array(16).fill(null).map((_, i) => 
      calculateFpsoMonth({ realizadas: 0, planejadas: 0, antecipadas: 0, overdue: 0, mitigacoes: 0, faa: 0 })
    ),
  },
  {
    code: "SEP",
    months: Array(16).fill(null).map((_, i) => 
      calculateFpsoMonth({ realizadas: 30, planejadas: 30, antecipadas: 0, overdue: 0, mitigacoes: 0, faa: 0 })
    ),
  },
  {
    code: "ATD",
    months: Array(16).fill(null).map((_, i) => 
      calculateFpsoMonth({ realizadas: 0, planejadas: 0, antecipadas: 0, overdue: 0, mitigacoes: 0, faa: 0 })
    ),
  },
  {
    code: "ESS",
    months: Array(16).fill(null).map((_, i) => 
      calculateFpsoMonth({ realizadas: 0, planejadas: 0, antecipadas: 0, overdue: 0, mitigacoes: 0, faa: 0 })
    ),
  },
];

export function ptciColorClass(ptci: number): string {
  if (ptci >= 95) return "ptci-green";
  if (ptci >= 80) return "ptci-amber";
  return "ptci-red";
}
