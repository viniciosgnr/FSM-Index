# FSM Index — Functional Safety Management Index
> **Source**: `FSM Index 03-02-26.docx` (original from Change Management team)
> **Converted**: 2026-05-13

---

## Overview

The **FSM Index** provides a consolidated view of the key elements that ensure the integrity, reliability, and governance of Safety Instrumented Functions (SIFs) throughout their lifecycle. It integrates the organisation's main performance and compliance pillars, offering a structured approach to monitoring operational readiness, design conformity, workforce competency, and functional safety requirements.

**The FSM Index is composed of four core components:**

| # | Component | Description |
|---|-----------|-------------|
| 1 | **SIF Proof Test Index** | Evaluates the execution and effectiveness of periodic SIF testing |
| 2 | **Training Matrix Adherence Index** | Measures personnel competency against mandated training requirements |
| 3 | **SIF Design Index** | Tracks deviations and ensures alignment between installed configurations and design assumptions |
| 4 | **SIF Studies Index** | Centralises all engineering analyses, assessments, and documentation essential to sustaining SIF performance |

> **Threats Index** — A supplementary indicator that does _not_ impact the FSM Index score. It serves as predictive information intended to support early detection of potential issues. Based on scenario-change analyses from HAZOP reviews that may lead to modifications in SIF design. Reports the number of scenarios under evaluation; can impact the SIF Design Index and SIF Studies Index.

---

## 1. SIF Proof Test Index

### Purpose

The Proof Test Index (PTI) is a performance indicator designed to monitor compliance with the planned proof test activities for Safety Instrumented Functions (SIFs), in accordance with the requirements of **IEC 61511, Clause 11.9**, which mandates systematic execution, documentation, and verification of proof tests to ensure SIF integrity throughout the operating phase.

**Objectives:**
- Evaluate the timely execution of scheduled proof tests.
- Detect systemic issues affecting SIF availability and reliability.
- Highlight overdue tests, temporary mitigations, and Failure Assurance Activities (FAAs) that indicate deficiencies in functional performance.
- Provide actionable insights for Operations, Asset Integrity team, and Reliability Team to maintain ALARP risk levels and ensure continuous compliance.

> This index may be further segmented by **SIL level**, enabling prioritisation of overdue or degraded SIFs based on their risk reduction requirements.

---

### 1.1 SIF Work Orders Execution (Overdue)

This indicator is designed to quantify the **EXECUTION** of the Work Orders.

- If the order is **mitigated without the test being performed**, the index **continues to be impacted**.
- If the **proof test was carried out and a failure was detected** (preventing the test from being completed), the index **will NOT be impacted**.

**Inputs:**
- IFS – Work orders, proof test schedules, assurance activity results, FAA generation, and mitigation records.
- Operational Assurance (OA) protocol

#### PTCI — Proof Test Compliance Indicator (%)

The PTCI measures adherence to the monthly proof test plan based on the original date.

```
PTCI (%) = [1 − (WO not executed / Total WO planned)] × 100
```

**Interpretation:**
- `100%` = Full compliance; all P1 proof tests performed within interval.
- Values `< 100%` indicate overdue activities reducing SIF availability.
- Can be broken down per SIL category to highlight criticality.

**Outputs:**
- Execution Index (%)
- Number of overdue and mitigated SIFs by SIL rating

**Actions:**
- Execute the proof test immediately.
- Initiate Mitigation Procedure if execution is not immediately possible.

---

### 1.2 Mitigations

A temporary risk reduction measure adopted when a SIF is unavailable or overdue. The mitigation procedure changes the WO date to a future date, removing it from the current month's planning count.

**Inputs:**
- IFS
- ORA (when mitigations affect SIF availability)
- Audit records

**Outputs:**
- Monthly Mitigation Index (%)
- List of mitigations activated
- Mitigation recurrence within the last 12 months

**Actions:**
- Identify recurrence of mitigations for the same SIF.
- Assess mitigation quality, ensuring compensating measures maintain risk at ALARP levels.
- Evaluate whether repeated mitigations indicate: design issues, equipment degradation, maintenance gaps, or procedural failure.
- **Trigger RCA** when recurrence surpasses thresholds or impacts SIL availability.

---

### 1.3 Failure Assurance Activity (FAA)

**Inputs:**
- IFS
- Audit records

**Outputs:**
- FAA Index (%)
- List of FAA events and associated equipment
- Required RCAs (5 Whys or more advanced techniques)

**Actions:**
- Conduct Root Cause Analysis using **at least the 5 Whys** methodology, escalating to TapRoot or equivalent when necessary.
- Evaluate whether FAA occurrences indicate:
  - Improper test execution
  - Equipment degradation
  - Systematic failures within the assurance activity process
- **ORA must be performed** when FAA affects SIF availability or leads to degraded mode of operation.

---

### Summary Table: Proof Test Index

| Sub-Index | Formula / Basis | Key Output | Action Trigger |
|-----------|----------------|------------|----------------|
| PTCI | `[1 − (Not Executed / Planned)] × 100` | PTCI % | Immediate execution or mitigation |
| MCI | `[1 − (Mitigations / Not Executed)] × 100` | MCI % | RCA if recurrent |
| FAA Index | Count of FAA events linked to WOs | FAA list + RCA required | ORA if SIF availability impacted |

---

## 2. Training Matrix Adherence Index

### Objective

Evaluate the level of adherence of personnel to the **mandatory Training Matrix**, ensuring that all critical competencies, certifications, and qualifications are properly updated to guarantee safe operations in compliance with internal, regulatory, and operational integrity requirements.

**Inputs:**
- List of personnel subject to the Training Matrix
- Valid certificates issued per employee
- Mandatory training per function, discipline, and criticality
- Training validity dates and frequency
- Official completion records in the corporate system

**Actions:**
- Identify gaps in training completion for each category following the training matrix.
- Notify personnel and supervisors about upcoming or overdue training.
- Coordinate scheduling of mandatory courses with training providers.
- Ensure certificates are uploaded and validated in the corporate system.
- Monitor expiring certifications and trigger renewal workflows.
- Implement corrective actions when adherence drops below expectations.
- Review Training Matrix periodically to reflect organisational or regulatory changes.

---

## 3. SIF Design Index (SDQI)

### Context and Purpose

The SIF Design section monitors any **deviation between the installed system and the original design assumptions**, ensuring continuous alignment with SIF requirements and maintaining functional integrity.

**Examples of monitored deviations:**
- Differences between as-built logic and the original Cause & Effect matrix (e.g., altered trip setpoints or missing interlocks).
- Installation of field devices with specifications that do not match the approved datasheet (e.g., different SIL rating, response time, or fail-safe action).
- Wiring or loop configuration deviations compared to design drawings (e.g., incorrect voting logic such as 2oo3 incorrectly wired as 1oo2).
- Control system logic modifications performed during maintenance/troubleshooting not reflected in the original SIF design or not formally approved.
- Replacement of components with different models or firmware versions that could affect reliability or response time.
- Any modification in previously issued documents requiring a design change, ensuring proper traceability, evaluation, and approval.
- Changes in process conditions exceeding the design envelope assumed in the LOPA or SIL verification (e.g., higher demand rate, increased operating pressure or temperature).
- Changes caused by HAZOP revalidation recommendations, where new deviations or altered operating scenarios require a SIF redesign or additional safeguards.
- Adjustments in engineering specifications or corporate standards (GTS Deviations).

### Objective

The **SIF Design Index** reports the alignment between the installed configuration of each SIF and the original design assumptions defined during engineering, risk assessment, and SIL verification. Its purpose is to monitor, record, and evaluate any deviations — whether physical, functional, or document-based — that may impact SIF integrity, performance, or compliance.

**Inputs:**
- GAP Analysis
- Audit
- QnA with change in SIF scenarios

### SDQI Calculation

The **SDQI%** (SIF Design Quality Index) is a structured indicator designed to evaluate the quality and compliance of SIFs against their Safety Requirement Specifications (SRS). Each SIF is assessed through a checklist composed of several design attributes.

**Checklist criteria (SIF compliance = compliance with SRS):**
| Criterion | Description |
|-----------|-------------|
| Loop architecture | Correct voting logic and architecture |
| Integrity level of components | Components meet required SIL |
| Installed Partial Stroke Test | PST installed where required |
| Proof test frequency in CMMS | Correct OLF configured in IFS |
| SIFs correctly registered in CMMS | WO registration is correct |
| Plans correctly registered | Maintenance plans linked |
| Acceptance criteria | Test acceptance criteria documented |

**Weighting by SIL level:**
| SIL Level | Weight (wᵢ) |
|-----------|------------|
| SIL 1 | 1.0 |
| SIL 2 | 1.5 |
| SIL 3 | 2.0 |

**Criterion Score (Iᵢ):**
- `1` = compliant (meets SRS requirements)
- `0` = non-compliant (CMMS/field installation differs from SRS)

> **Note:** Ongoing assessments (HAZOP reviews, GTS alerts, etc.) are reported under the **Threats Index**, not the SIF Design Index directly.

---

## 4. SIF Studies Index

### Description

The SIF Studies section consolidates all **documents, evaluations, and engineering analyses** related to the lifecycle of Safety Instrumented Functions (SIFs). It serves as the central repository for tracking functional integrity, design assumptions, operational performance, and any deviations associated with each SIF throughout its lifecycle.

**Inputs:**
- GAP Analysis
- Audit

**Key Documents tracked:**
| Document | Description |
|----------|-------------|
| SRS | Safety Requirement Specification |
| SIL Verification | PFD/PFH calculations |
| Functional Safety Plan | Lifecycle management plan |
| Training Matrix | Competency requirements |

### Document Status Metric

Each document is evaluated according to the following scale:

| Status | Score |
|--------|-------|
| Does not exist | 0% |
| Exists but is outdated | 50% |
| Minor updates pending | 75% |
| Up to date | 100% |

---

## Key Standards Reference

- **IEC 61511** — Functional Safety: Safety Instrumented Systems for the Process Industry Sector
  - **Clause 11.9** — Proof testing requirements (systematic execution, documentation, verification)
- **ALARP** — As Low As Reasonably Practicable (risk level target for all SIF-related activities)
- **ORA** — Risk Analysis (Operational Risk Assessment), required when mitigations or FAAs affect SIF availability
- **RCA** — Root Cause Analysis; minimum methodology: 5 Whys; escalation to TapRoot when needed
