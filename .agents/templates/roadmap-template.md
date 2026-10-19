# {{PROJECT_OR_ORG_NAME}} — Roadmap & Milestones

> 🗺️ **Living Source of Truth**: Product direction, positioning principles, and milestone delivery history for **{{PROJECT_OR_ORG_NAME}}**.
> Pair with [`PLAN.md`](./PLAN.md) (sprint execution), [`TODO.md`](./TODO.md) (task ledger), and [`BUGS.md`](./BUGS.md) (issues and quirks).

> [!IMPORTANT]
> AI agents are strictly required to update this page and related tracking ledgers **before** executing new feature work or bug fixes and keep them synchronized.

---

## 📜 Tracking Rules

- **100% Active Direction Accuracy (Root & Archives)**: `ROADMAP.md`, `PLAN.md`, `TODO.md`, `BUGS.md`, and `.github/*-ARCHIVE.md` must reflect the 100% current, active direction of all projects with zero contradictions. Immediately replace or remove superseded statements across both root and archive files.
- **Zero External Mentions**: Never directly mention by name any external, third-party, or deleted projects or repositories.
- **No Typo Duplication**: When recording user reports or directives, clean and fix all typos to preserve professional quality.
- **Explicit Project Tagging**: Every milestone, sprint, task, or deliverable header and row MUST explicitly include its current project name and repository path (e.g., `[{{PROJECT_NAME}}] ({{PROJECT_PATH}})`).
- **Bare Minimal Root & Normalized Archive**: Keep `ROADMAP.md` focused on active and upcoming milestones; archive delivered milestone narratives into `.github/ROADMAP-ARCHIVE.md` in normalized format.

---

## 🔭 Vision & Positioning Principles

1. **Core Value Proposition**: {{VISION_STATEMENT}}
2. **Design Principles**:
   - {{PRINCIPLE_1}}
   - {{PRINCIPLE_2}}
   - {{PRINCIPLE_3}}
3. **Non-Goals & Boundaries**:
   - {{NON_GOAL_1}}
   - {{NON_GOAL_2}}

---

## 🗺️ Milestone Overview

| # | Milestone | Scope / Repository | Status | Release / Target | Focus |
|---|---|---|---|---|---|
| **M1** | [{{PROJECT_NAME}}] {{MILESTONE_1_NAME}} | `{{PROJECT_PATH}}` | ✅ Shipped | {{TAG_OR_COMMIT}} | {{SUMMARY}} |
| **M2** | [{{PROJECT_NAME}}] {{MILESTONE_2_NAME}} | `{{PROJECT_PATH}}` | 🚀 Active | {{TARGET_DATE_OR_VERSION}} | {{SUMMARY}} |
| **M3** | [{{PROJECT_NAME}}] {{MILESTONE_3_NAME}} | `{{PROJECT_PATH}}` | ⏳ Planned | {{TARGET}} | {{SUMMARY}} |

---

## 🚀 Active Milestones

### [{{PROJECT_NAME}}] ({{PROJECT_PATH}}) — Milestone {{ACTIVE_MILESTONE_ID}}: {{ACTIVE_MILESTONE_NAME}}

```mermaid
flowchart TD
    Step1["{{STAGE_1_LABEL}}"] --> Step2["{{STAGE_2_LABEL}}"]
    Step2 --> Step3["{{STAGE_3_LABEL}}"]
    Step3 --> Verify["Verification & Quality Gate"]
```

#### Detailed Deliverables

- 🎯 **[{{PROJECT_NAME}}] {{DELIVERABLE_1_TITLE}}**: {{DELIVERABLE_1_DESC}}
- 🎯 **[{{PROJECT_NAME}}] {{DELIVERABLE_2_TITLE}}**: {{DELIVERABLE_2_DESC}}
- 🎯 **[{{PROJECT_NAME}}] {{DELIVERABLE_3_TITLE}}**: {{DELIVERABLE_3_DESC}}

---

## 🔮 Planned & Future Milestones

### [{{PROJECT_NAME}}] ({{PROJECT_PATH}}) — Milestone {{NEXT_ID}}: {{NEXT_SCOPE_SUMMARY}}
- ⏳ **Backlog Candidates**: {{CANDIDATE_ITEMS}}

---

## 📌 Historical Milestones & Shipped Releases

### [{{PROJECT_NAME}}] ({{PROJECT_PATH}}) — Milestone {{PREV_MILESTONE_ID}}: {{PREV_MILESTONE_NAME}} ({{RELEASE_VERSION_OR_TAG}})
- {{COMPLETED_ITEM_1}}
- {{COMPLETED_ITEM_2}}

---

## 🔖 Metadata

- **Project / Scope**: {{PROJECT_NAME_AND_TYPE}}
- **Tracking Mode**: {{SEMVER_OR_MILESTONES}}
- **Governance**: Governed by `.agents/` rules and organization handoff contracts.
