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
  }>;
};

function pM(pct: number | null, str: string) {
  if (!str) return { pctNoPrazo: null, mci: null, faai: null, realizadas: 0, noPrazo: 0 };
  const frac = str.split(' ')[0];
  const [realizadas, noPrazo] = frac.split('/').map(Number);
  return {
    pctNoPrazo: pct,
    realizadas,
    noPrazo,
    mci: pct !== null ? Math.min(100, pct + 10) : null,
    faai: pct !== null ? Math.min(100, pct + 5) : null,
  };
}

export const fpsoData: FpsoUnit[] = [
  {
    code: "CDA",
    months: [
      pM(null, ""), pM(null, ""), pM(null, ""), pM(null, ""), pM(null, ""), pM(null, ""), pM(null, ""), pM(null, ""), pM(null, ""),
      pM(100, "1/1"), pM(null, ""), pM(null, ""), pM(100, "2/2"), pM(null, ""), pM(null, ""), pM(null, "")
    ],
  },
  {
    code: "CDI",
    months: [
      pM(83, "6/5 (-1)"), pM(100, "8/8"), pM(100, "2/2"), pM(100, "2/2"), pM(100, "7/7"), pM(33, "3/1 (-2)"), pM(80, "5/4 (-1)"), pM(100, "16/16"),
      pM(70, "10/7 (-3)"), pM(66, "32/21 (-11)"), pM(48, "21/10 (-11)"), pM(100, "5/5"), pM(100, "3/3"), pM(100, "13/13"), pM(67, "3/2 (-1)"), pM(100, "2/2")
    ],
  },
  {
    code: "CDS",
    months: [
      pM(77, "13/10 (-3)"), pM(100, "3/3"), pM(83, "6/5 (-1)"), pM(100, "2/2"), pM(100, "3/3"), pM(95, "21/20 (-1)"), pM(13, "23/3 (-20)"), pM(100, "7/7"),
      pM(100, "8/8"), pM(100, "10/10"), pM(100, "8/8"), pM(100, "1/1"), pM(100, "6/6"), pM(100, "5/5"), pM(100, "3/3"), pM(null, "")
    ],
  },
  {
    code: "CDM",
    months: [
      pM(100, "37/37"), pM(100, "15/15"), pM(100, "4/4"), pM(100, "4/4"), pM(100, "8/8"), pM(100, "5/5"), pM(100, "4/4"), pM(100, "15/15"),
      pM(100, "3/3"), pM(100, "13/13"), pM(100, "11/11"), pM(86, "7/6 (-1)"), pM(19, "32/6 (-26)"), pM(100, "12/12"), pM(null, ""), pM(100, "6/6")
    ],
  },
  {
    code: "CDP",
    months: [
      pM(100, "3/3"), pM(0, "1/0 (-1)"), pM(10, "20/2 (-18)"), pM(67, "3/2 (-1)"), pM(100, "1/1"), pM(67, "3/2 (-1)"), pM(100, "5/5"), pM(100, "4/4"),
      pM(100, "1/1"), pM(88, "8/7 (-1)"), pM(91, "11/10 (-1)"), pM(90, "10/9 (-1)"), pM(100, "17/17"), pM(95, "21/20 (-1)"), pM(100, "10/10"), pM(100, "10/10")
    ],
  },
  {
    code: "ADG",
    months: [
      pM(null, ""), pM(null, ""), pM(null, ""), pM(null, ""), pM(null, ""), pM(null, ""), pM(null, ""), pM(null, ""), pM(null, ""),
      pM(0, "1/0 (-1)"), pM(30, "10/3 (-7)"), pM(null, ""), pM(null, ""), pM(null, ""), pM(null, ""), pM(null, "")
    ],
  },
  {
    code: "SEP",
    months: [
      pM(90, "31/28 (-3)"), pM(92, "37/34 (-3)"), pM(100, "34/34"), pM(100, "35/35"), pM(100, "50/50"), pM(100, "23/23"), pM(100, "42/42"), pM(94, "18/17 (-1)"),
      pM(91, "23/21 (-2)"), pM(93, "30/28 (-2)"), pM(91, "57/52 (-5)"), pM(99, "115/114 (-1)"), pM(89, "47/42 (-5)"), pM(100, "24/24"), pM(98, "58/57 (-1)"), pM(100, "28/28")
    ],
  },
  {
    code: "ATD",
    months: [
      pM(null, ""), pM(null, ""), pM(null, ""), pM(null, ""), pM(null, ""), pM(null, ""), pM(null, ""), pM(0, "2/0 (-2)"), pM(null, ""),
      pM(null, ""), pM(null, ""), pM(100, "1/1"), pM(100, "1/1"), pM(0, "1/0 (-1)"), pM(100, "1/1"), pM(100, "1/1")
    ],
  },
  {
    code: "ESS",
    months: [
      pM(null, ""), pM(0, "1/0 (-1)"), pM(100, "1/1"), pM(100, "1/1"), pM(null, ""), pM(100, "3/3"), pM(null, ""), pM(0, "1/0 (-1)"),
      pM(0, "1/0 (-1)"), pM(100, "2/2"), pM(null, ""), pM(100, "1/1"), pM(null, ""), pM(100, "1/1"), pM(100, "2/2"), pM(null, "")
    ],
  }
];

export function ptciColorClass(ptci: number): string {
  if (ptci >= 95) return "ptci-green";
  if (ptci >= 80) return "ptci-amber";
  return "ptci-red";
}
