export const INDEX_DEFINITIONS = {
  PTCI: {
    name: "PTCI — Proof Test Compliance Index",
    definition: "Measures what percentage of planned SIF proof tests were actually executed. A critical month is PTCI < 80%.",
    formula: "PTCI (%) = [1 - (Overdue + Mitigations) / Planned] × 100",
    color: "#1E8A4C",
  },
  MCI: {
    name: "MCI — Mitigation Compliance Index",
    definition: "Measures how well unexecuted tests are being formally managed via mitigations (CR/ORA).",
    formula: "MCI (%) = [1 - (Mitigations / (Overdue + Mitigations))] × 100",
    color: "#C97C00",
  },
  FAAI: {
    name: "FAAI — Functional Failure Action Index",
    definition: "Measures the rate of functional failure events detected during proof testing.",
    formula: "FAAI (%) = [1 - (FAA / Planned)] × 100",
    color: "#C0251A",
  },
};
