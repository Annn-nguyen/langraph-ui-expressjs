### Example of Scoring

Suppose the note states:

**Chief Complaint:** “Fever for 2 days”
**HPI:** “Patient reports low-grade fever for 2 days, occasional chills, denies other symptoms.”
**PMH:** “Hypertension.”
**Allergies:** (No mention)
**Physical Findings:** “Temp 99.5F. BP 130/85 mmHg.”
**Assessment:** “Likely viral syndrome.”
**Plan:** “Advise increased fluid intake, rest.”
**Follow-Up:** “Call if fever persists >3 days.”

**Scoring Example:**

- CC: 100 (clear and concise)
- HPI: 90 (missing mention of severity, e.g., is it mild or moderate? -10)
- PMH: 100 (noted as “Hypertension”)
- Allergies & ADR: 0 (missing entirely, -100, but capped at 0)
- Physical Findings: 90 (missing heart rate, but has BP & temp. -10 for incomplete vitals)
- Assessment: 100 (clearly states “viral syndrome”)
- Plan: 100 (treatment plan is documented)
- Follow-Up: 100 (instructions given)

**Sum** = 100 + 90 + 100 + 0 + 90 + 100 + 100 + 100 = 680
**Average** = 680 ÷ 8 = 85
**Rounded Average Score** = 85