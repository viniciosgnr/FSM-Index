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
};

export const fleetData: MonthlyRow[] = [
  { planejadas: 76,  executadasNoPrazo: 75, foraDoPrazo: 1, overdue: 0,   execAntecipadas: 13, mitigacoes: 0,   faa: 0, ptci: 98.7, mci: 100 },
  { planejadas: 55,  executadasNoPrazo: 55, foraDoPrazo: 0, overdue: 0,   execAntecipadas: 10, mitigacoes: 0,   faa: 0, ptci: 100,  mci: 100 },
  { planejadas: 44,  executadasNoPrazo: 43, foraDoPrazo: 1, overdue: 0,   execAntecipadas: 23, mitigacoes: 1,   faa: 0, ptci: 97.7, mci: 100 },
  { planejadas: 40,  executadasNoPrazo: 40, foraDoPrazo: 0, overdue: 0,   execAntecipadas: 1,  mitigacoes: 0,   faa: 0, ptci: 100,  mci: 100 },
  { planejadas: 64,  executadasNoPrazo: 61, foraDoPrazo: 0, overdue: 3,   execAntecipadas: 16, mitigacoes: 0,   faa: 0, ptci: 95.3, mci: 100 },
  { planejadas: 76,  executadasNoPrazo: 48, foraDoPrazo: 1, overdue: 27,  execAntecipadas: 6,  mitigacoes: 1,   faa: 0, ptci: 64.5, mci: 96.3 },
  { planejadas: 82,  executadasNoPrazo: 64, foraDoPrazo: 0, overdue: 18,  execAntecipadas: 8,  mitigacoes: 0,   faa: 1, ptci: 77.6, mci: 100  },
  { planejadas: 42,  executadasNoPrazo: 42, foraDoPrazo: 0, overdue: 0,   execAntecipadas: 87, mitigacoes: 0,   faa: 0, ptci: 100,  mci: 100 },
  { planejadas: 33,  executadasNoPrazo: 33, foraDoPrazo: 0, overdue: 0,   execAntecipadas: 0,  mitigacoes: 0,   faa: 1, ptci: 100,  mci: 100 },
  { planejadas: 51,  executadasNoPrazo: 51, foraDoPrazo: 0, overdue: 0,   execAntecipadas: 0,  mitigacoes: 0,   faa: 0, ptci: 100,  mci: 100 },
  { planejadas: 90,  executadasNoPrazo: 83, foraDoPrazo: 0, overdue: 7,   execAntecipadas: 36, mitigacoes: 4,   faa: 0, ptci: 92.2, mci: 57.1 },
  { planejadas: 254, executadasNoPrazo: 0,  foraDoPrazo: 0, overdue: 126, execAntecipadas: 23, mitigacoes: 124, faa: 1, ptci: 50.4, mci: 97.6 },
  { planejadas: 81,  executadasNoPrazo: 75, foraDoPrazo: 0, overdue: 6,   execAntecipadas: 34, mitigacoes: 6,   faa: 1, ptci: 91.4, mci: 46.2 },
  { planejadas: 41,  executadasNoPrazo: 41, foraDoPrazo: 0, overdue: 0,   execAntecipadas: 4,  mitigacoes: 0,   faa: 0, ptci: 100,  mci: 100 },
  { planejadas: 61,  executadasNoPrazo: 61, foraDoPrazo: 0, overdue: 0,   execAntecipadas: 20, mitigacoes: 0,   faa: 0, ptci: 100,  mci: 100 },
  { planejadas: 34,  executadasNoPrazo: 34, foraDoPrazo: 0, overdue: 0,   execAntecipadas: 4,  mitigacoes: 0,   faa: 0, ptci: 100,  mci: 100 },
];

export type FpsoUnit = {
  code: string;
  months: Array<{
    pctNoPrazo: number | null; // null = no WOs planned
    realizadas: number;
    planejadas: number;
    antecipadas: number;
  }>;
};

export const fpsoData: FpsoUnit[] = [
  {
    code: "CDA",
    months: [
      { pctNoPrazo: null, realizadas: 0,  planejadas: 0,  antecipadas: 0  },
      { pctNoPrazo: null, realizadas: 0,  planejadas: 0,  antecipadas: 0  },
      { pctNoPrazo: null, realizadas: 0,  planejadas: 0,  antecipadas: 0  },
      { pctNoPrazo: null, realizadas: 0,  planejadas: 0,  antecipadas: 0  },
      { pctNoPrazo: null, realizadas: 0,  planejadas: 0,  antecipadas: 0  },
      { pctNoPrazo: null, realizadas: 0,  planejadas: 0,  antecipadas: 0  },
      { pctNoPrazo: null, realizadas: 0,  planejadas: 0,  antecipadas: 0  },
      { pctNoPrazo: null, realizadas: 0,  planejadas: 0,  antecipadas: 0  },
      { pctNoPrazo: null, realizadas: 0,  planejadas: 0,  antecipadas: 0  },
      { pctNoPrazo: 100,  realizadas: 1,  planejadas: 1,  antecipadas: 0  },
      { pctNoPrazo: null, realizadas: 0,  planejadas: 0,  antecipadas: 0  },
      { pctNoPrazo: null, realizadas: 0,  planejadas: 0,  antecipadas: 0  },
      { pctNoPrazo: 100,  realizadas: 2,  planejadas: 2,  antecipadas: 0  },
      { pctNoPrazo: null, realizadas: 0,  planejadas: 0,  antecipadas: 0  },
      { pctNoPrazo: null, realizadas: 0,  planejadas: 0,  antecipadas: 0  },
      { pctNoPrazo: null, realizadas: 0,  planejadas: 0,  antecipadas: 0  },
    ],
  },
  {
    code: "CDI",
    months: [
      { pctNoPrazo: 83,  realizadas: 5,  planejadas: 6,  antecipadas: -1 },
      { pctNoPrazo: 100, realizadas: 8,  planejadas: 8,  antecipadas: 0  },
      { pctNoPrazo: 100, realizadas: 2,  planejadas: 2,  antecipadas: 0  },
      { pctNoPrazo: 100, realizadas: 2,  planejadas: 2,  antecipadas: 0  },
      { pctNoPrazo: 100, realizadas: 7,  planejadas: 7,  antecipadas: 0  },
      { pctNoPrazo: 33,  realizadas: 1,  planejadas: 3,  antecipadas: -2 },
      { pctNoPrazo: 80,  realizadas: 4,  planejadas: 5,  antecipadas: -1 },
      { pctNoPrazo: 100, realizadas: 16, planejadas: 16, antecipadas: 0  },
      { pctNoPrazo: 70,  realizadas: 7,  planejadas: 10, antecipadas: -3 },
      { pctNoPrazo: 66,  realizadas: 21, planejadas: 32, antecipadas: -11},
      { pctNoPrazo: 100, realizadas: 10, planejadas: 10, antecipadas: 0  },
      { pctNoPrazo: 48,  realizadas: 11, planejadas: 21, antecipadas: 0  },
      { pctNoPrazo: 100, realizadas: 5,  planejadas: 5,  antecipadas: 0  },
      { pctNoPrazo: 100, realizadas: 3,  planejadas: 3,  antecipadas: 0  },
      { pctNoPrazo: 67,  realizadas: 2,  planejadas: 3,  antecipadas: 0  },
      { pctNoPrazo: 100, realizadas: 2,  planejadas: 2,  antecipadas: 0  },
    ],
  },
  {
    code: "CDS",
    months: [
      { pctNoPrazo: 77,  realizadas: 10, planejadas: 13, antecipadas: -3 },
      { pctNoPrazo: 100, realizadas: 3,  planejadas: 3,  antecipadas: 0  },
      { pctNoPrazo: 83,  realizadas: 5,  planejadas: 6,  antecipadas: -1 },
      { pctNoPrazo: 100, realizadas: 2,  planejadas: 2,  antecipadas: 0  },
      { pctNoPrazo: 100, realizadas: 3,  planejadas: 3,  antecipadas: 0  },
      { pctNoPrazo: 95,  realizadas: 20, planejadas: 21, antecipadas: -1 },
      { pctNoPrazo: 100, realizadas: 23, planejadas: 23, antecipadas: -20},
      { pctNoPrazo: 100, realizadas: 7,  planejadas: 7,  antecipadas: 0  },
      { pctNoPrazo: 100, realizadas: 8,  planejadas: 8,  antecipadas: 0  },
      { pctNoPrazo: 100, realizadas: 10, planejadas: 10, antecipadas: 0  },
      { pctNoPrazo: 100, realizadas: 8,  planejadas: 8,  antecipadas: 0  },
      { pctNoPrazo: 100, realizadas: 1,  planejadas: 1,  antecipadas: 0  },
      { pctNoPrazo: 100, realizadas: 6,  planejadas: 6,  antecipadas: 0  },
      { pctNoPrazo: 100, realizadas: 5,  planejadas: 5,  antecipadas: 0  },
      { pctNoPrazo: 100, realizadas: 3,  planejadas: 3,  antecipadas: 0  },
      { pctNoPrazo: null, realizadas: 0, planejadas: 0,  antecipadas: 0  },
    ],
  },
  {
    code: "CDM",
    months: [
      { pctNoPrazo: 100, realizadas: 37, planejadas: 37, antecipadas: 0  },
      { pctNoPrazo: 100, realizadas: 15, planejadas: 15, antecipadas: 0  },
      { pctNoPrazo: 100, realizadas: 4,  planejadas: 4,  antecipadas: 0  },
      { pctNoPrazo: 100, realizadas: 4,  planejadas: 4,  antecipadas: 0  },
      { pctNoPrazo: 100, realizadas: 8,  planejadas: 8,  antecipadas: 0  },
      { pctNoPrazo: 100, realizadas: 5,  planejadas: 5,  antecipadas: 0  },
      { pctNoPrazo: 100, realizadas: 4,  planejadas: 4,  antecipadas: 0  },
      { pctNoPrazo: 100, realizadas: 15, planejadas: 15, antecipadas: 0  },
      { pctNoPrazo: 100, realizadas: 3,  planejadas: 3,  antecipadas: 0  },
      { pctNoPrazo: 100, realizadas: 13, planejadas: 13, antecipadas: 0  },
      { pctNoPrazo: 100, realizadas: 11, planejadas: 11, antecipadas: 0  },
      { pctNoPrazo: 86,  realizadas: 6,  planejadas: 7,  antecipadas: -1 },
      { pctNoPrazo: 100, realizadas: 12, planejadas: 12, antecipadas: 0  },
      { pctNoPrazo: 100, realizadas: 5,  planejadas: 5,  antecipadas: 0  },
      { pctNoPrazo: null, realizadas: 0, planejadas: 0,  antecipadas: 0  },
      { pctNoPrazo: 100, realizadas: 6,  planejadas: 6,  antecipadas: 0  },
    ],
  },
  {
    code: "CDP",
    months: [
      { pctNoPrazo: 100, realizadas: 3,  planejadas: 3,  antecipadas: 0  },
      { pctNoPrazo: 0,   realizadas: 0,  planejadas: 1,  antecipadas: -1 },
      { pctNoPrazo: 100, realizadas: 20, planejadas: 20, antecipadas: -18},
      { pctNoPrazo: 67,  realizadas: 2,  planejadas: 3,  antecipadas: -1 },
      { pctNoPrazo: 100, realizadas: 1,  planejadas: 1,  antecipadas: 0  },
      { pctNoPrazo: 67,  realizadas: 2,  planejadas: 3,  antecipadas: -2 },
      { pctNoPrazo: 100, realizadas: 5,  planejadas: 5,  antecipadas: 0  },
      { pctNoPrazo: 100, realizadas: 4,  planejadas: 4,  antecipadas: 0  },
      { pctNoPrazo: 100, realizadas: 4,  planejadas: 4,  antecipadas: 0  },
      { pctNoPrazo: 88,  realizadas: 7,  planejadas: 8,  antecipadas: -1 },
      { pctNoPrazo: 91,  realizadas: 10, planejadas: 11, antecipadas: 0  },
      { pctNoPrazo: 100, realizadas: 9,  planejadas: 9,  antecipadas: 0  },
      { pctNoPrazo: 100, realizadas: 17, planejadas: 17, antecipadas: 0  },
      { pctNoPrazo: 95,  realizadas: 20, planejadas: 21, antecipadas: 0  },
      { pctNoPrazo: 100, realizadas: 10, planejadas: 10, antecipadas: 0  },
      { pctNoPrazo: 100, realizadas: 10, planejadas: 10, antecipadas: 0  },
    ],
  },
  {
    code: "ADG",
    months: [
      { pctNoPrazo: null, realizadas: 0, planejadas: 0,  antecipadas: 0  },
      { pctNoPrazo: null, realizadas: 0, planejadas: 0,  antecipadas: 0  },
      { pctNoPrazo: null, realizadas: 0, planejadas: 0,  antecipadas: 0  },
      { pctNoPrazo: null, realizadas: 0, planejadas: 0,  antecipadas: 0  },
      { pctNoPrazo: null, realizadas: 0, planejadas: 0,  antecipadas: 0  },
      { pctNoPrazo: null, realizadas: 0, planejadas: 0,  antecipadas: 0  },
      { pctNoPrazo: null, realizadas: 0, planejadas: 0,  antecipadas: 0  },
      { pctNoPrazo: null, realizadas: 0, planejadas: 0,  antecipadas: 0  },
      { pctNoPrazo: null, realizadas: 0, planejadas: 0,  antecipadas: 0  },
      { pctNoPrazo: 0,    realizadas: 0, planejadas: 1,  antecipadas: -1 },
      { pctNoPrazo: 100,  realizadas: 3, planejadas: 3,  antecipadas: -7 },
      { pctNoPrazo: null, realizadas: 0, planejadas: 0,  antecipadas: 0  },
      { pctNoPrazo: null, realizadas: 0, planejadas: 0,  antecipadas: 0  },
      { pctNoPrazo: null, realizadas: 0, planejadas: 0,  antecipadas: 0  },
      { pctNoPrazo: null, realizadas: 0, planejadas: 0,  antecipadas: 0  },
      { pctNoPrazo: null, realizadas: 0, planejadas: 0,  antecipadas: 0  },
    ],
  },
  {
    code: "SEP",
    months: [
      { pctNoPrazo: 90,  realizadas: 28, planejadas: 31, antecipadas: -3 },
      { pctNoPrazo: 92,  realizadas: 34, planejadas: 37, antecipadas: -3 },
      { pctNoPrazo: 100, realizadas: 34, planejadas: 34, antecipadas: 0  },
      { pctNoPrazo: 100, realizadas: 35, planejadas: 35, antecipadas: 0  },
      { pctNoPrazo: 100, realizadas: 50, planejadas: 50, antecipadas: 0  },
      { pctNoPrazo: 100, realizadas: 23, planejadas: 23, antecipadas: 0  },
      { pctNoPrazo: 100, realizadas: 42, planejadas: 42, antecipadas: 0  },
      { pctNoPrazo: 94,  realizadas: 17, planejadas: 18, antecipadas: -1 },
      { pctNoPrazo: 91,  realizadas: 23, planejadas: 25, antecipadas: -2 },
      { pctNoPrazo: 100, realizadas: 30, planejadas: 30, antecipadas: 0  },
      { pctNoPrazo: 99,  realizadas: 52, planejadas: 53, antecipadas: -1 },
      { pctNoPrazo: 89,  realizadas: 47, planejadas: 53, antecipadas: -5 },
      { pctNoPrazo: 100, realizadas: 24, planejadas: 24, antecipadas: 0  },
      { pctNoPrazo: 100, realizadas: 57, planejadas: 57, antecipadas: -1 },
      { pctNoPrazo: 98,  realizadas: 57, planejadas: 58, antecipadas: -1 },
      { pctNoPrazo: 100, realizadas: 28, planejadas: 28, antecipadas: 0  },
    ],
  },
  {
    code: "ATD",
    months: [
      { pctNoPrazo: null, realizadas: 0, planejadas: 0,  antecipadas: 0  },
      { pctNoPrazo: null, realizadas: 0, planejadas: 0,  antecipadas: 0  },
      { pctNoPrazo: null, realizadas: 0, planejadas: 0,  antecipadas: 0  },
      { pctNoPrazo: null, realizadas: 0, planejadas: 0,  antecipadas: 0  },
      { pctNoPrazo: null, realizadas: 0, planejadas: 0,  antecipadas: 0  },
      { pctNoPrazo: null, realizadas: 0, planejadas: 0,  antecipadas: 0  },
      { pctNoPrazo: 100,  realizadas: 2, planejadas: 2,  antecipadas: 0  },
      { pctNoPrazo: null, realizadas: 0, planejadas: 0,  antecipadas: 0  },
      { pctNoPrazo: null, realizadas: 0, planejadas: 0,  antecipadas: 0  },
      { pctNoPrazo: null, realizadas: 0, planejadas: 0,  antecipadas: 0  },
      { pctNoPrazo: null, realizadas: 0, planejadas: 0,  antecipadas: 0  },
      { pctNoPrazo: 100,  realizadas: 1, planejadas: 1,  antecipadas: 0  },
      { pctNoPrazo: 100,  realizadas: 1, planejadas: 1,  antecipadas: 0  },
      { pctNoPrazo: 0,    realizadas: 0, planejadas: 1,  antecipadas: -1 },
      { pctNoPrazo: 100,  realizadas: 1, planejadas: 1,  antecipadas: 0  },
      { pctNoPrazo: 100,  realizadas: 1, planejadas: 1,  antecipadas: 0  },
    ],
  },
  {
    code: "ESS",
    months: [
      { pctNoPrazo: null, realizadas: 0, planejadas: 0,  antecipadas: 0  },
      { pctNoPrazo: null, realizadas: 0, planejadas: 0,  antecipadas: 0  },
      { pctNoPrazo: null, realizadas: 0, planejadas: 0,  antecipadas: 0  },
      { pctNoPrazo: null, realizadas: 0, planejadas: 0,  antecipadas: 0  },
      { pctNoPrazo: null, realizadas: 0, planejadas: 0,  antecipadas: 0  },
      { pctNoPrazo: 0,    realizadas: 0, planejadas: 3,  antecipadas: 0  },
      { pctNoPrazo: null, realizadas: 0, planejadas: 0,  antecipadas: 0  },
      { pctNoPrazo: 0,    realizadas: 0, planejadas: 1,  antecipadas: 0  },
      { pctNoPrazo: 100,  realizadas: 1, planejadas: 1,  antecipadas: 0  },
      { pctNoPrazo: 100,  realizadas: 2, planejadas: 2,  antecipadas: 0  },
      { pctNoPrazo: null, realizadas: 0, planejadas: 0,  antecipadas: 0  },
      { pctNoPrazo: 100,  realizadas: 1, planejadas: 1,  antecipadas: 0  },
      { pctNoPrazo: 100,  realizadas: 1, planejadas: 1,  antecipadas: 0  },
      { pctNoPrazo: null, realizadas: 0, planejadas: 0,  antecipadas: 0  },
      { pctNoPrazo: null, realizadas: 0, planejadas: 0,  antecipadas: 0  },
      { pctNoPrazo: 100,  realizadas: 2, planejadas: 2,  antecipadas: 0  },
    ],
  },
];

export function ptciColorClass(ptci: number): string {
  if (ptci >= 95) return "ptci-green";
  if (ptci >= 80) return "ptci-amber";
  return "ptci-red";
}
