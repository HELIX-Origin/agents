# {{PROJECT_OR_ORG_NAME}} — Active Sprint Planning

> 🎯 **Living Source of Truth**: Active sprint roadmap, execution architecture, and completed sprint history for **{{PROJECT_OR_ORG_NAME}}**.
> Pair with [`ROADMAP.md`](./ROADMAP.md) (direction), [`TODO.md`](./TODO.md) (task ledger), and [`BUGS.md`](./BUGS.md) (known issues).

> [!IMPORTANT]
> AI agents are strictly required to update this page and related tracking ledgers **before** executing new feature work or bug fixes and keep them synchronized.

---

## 📜 Tracking Rules

- **No Typo Duplication**: When recording user reports, clean and fix all typos to preserve professional quality.
- **Consistent Formatting**: Maintain consistent formatting and style throughout all documentation to ensure readability and professionalism.
- **Clear Sectioning**: Use clear and descriptive headers for each section to improve navigation and readability.
- **Active Items First**: The currently active milestone, sprint, task, or workstream must always be placed at the top of the content sections.
- **Regular Updates**: Ensure that this file is regularly updated to reflect the latest developments and changes in the project.
- **Improve User Directives**: Continuously refine and clarify user directives to ensure they are easily understood and actionable.
- **Full History**: Every planned item from project history is represented here as a completed sprint, newest first.
- **Explicit Project Tagging**: In multi-project or organization tracking ledgers, every sprint header, task, and execution deliverable MUST be explicitly prefixed with its project name and repository path (e.g., `[{{PROJECT_NAME}}] ({{PROJECT_PATH}})`) to prevent agent context confusion.
- **Tracking Docs Stay True**: Update `ROADMAP.md`, `TODO.md`, `BUGS.md`, and `PLAN.md` first or in lockstep with code changes.
- **Always Track Everything**: Every new feature request, enhancement, or bug report must be logged before execution.

---

## 🎯 Active Sprints

### 🚀 Sprint {{SPRINT_ID}}: [{{PROJECT_NAME}}] ({{PROJECT_PATH}}) — {{SPRINT_TITLE}}
- **Project Identifier:** `[{{PROJECT_NAME}}]`
- **Repository Path:** `{{PROJECT_PATH}}`
- **Target Objective:** {{TARGET_OBJECTIVE}}

```mermaid
flowchart TD
    Task1["[{{PROJECT_NAME}}] {{TASK_1_LABEL}}"] --> Task2["[{{PROJECT_NAME}}] {{TASK_2_LABEL}}"]
    Task2 --> Task3["[{{PROJECT_NAME}}] {{TASK_3_LABEL}}"]
    Task3 --> Gate["[{{PROJECT_NAME}}] Verification Gate"]
```

#### 📝 Execution Tasks

1. **[{{PROJECT_NAME}}] {{TASK_1_NAME}}**:
   - `[{{PROJECT_NAME}}]` {{SUBTASK_1_A}}
   - `[{{PROJECT_NAME}}]` {{SUBTASK_1_B}}
2. **[{{PROJECT_NAME}}] {{TASK_2_NAME}}**:
   - `[{{PROJECT_NAME}}]` {{SUBTASK_2_A}}
   - `[{{PROJECT_NAME}}]` {{SUBTASK_2_B}}
3. **[{{PROJECT_NAME}}] {{TASK_3_NAME}}**:
   - `[{{PROJECT_NAME}}]` {{SUBTASK_3_A}}
   - `[{{PROJECT_NAME}}]` {{SUBTASK_3_B}}

---

## 🔮 Planned Sprints

### ⏳ Sprint {{NEXT_SPRINT_ID}}: [{{PROJECT_NAME}}] ({{PROJECT_PATH}}) — {{NEXT_SPRINT_TITLE}}
- **Project Identifier:** `[{{PROJECT_NAME}}]`
- **Repository Path:** `{{PROJECT_PATH}}`
- `[{{PROJECT_NAME}}]` {{CANDIDATE_ITEM_1}}
- `[{{PROJECT_NAME}}]` {{CANDIDATE_ITEM_2}}

---

## ✅ Completed Sprints

### ✅ Sprint {{PREV_SPRINT_ID}}: [{{PROJECT_NAME}}] ({{PROJECT_PATH}}) — {{PREV_SPRINT_TITLE}} ({{COMPLETED_DATE_OR_VERSION}})
- **Project Identifier:** `[{{PROJECT_NAME}}]`
- **Repository Path:** `{{PROJECT_PATH}}`
- ✅ `[{{PROJECT_NAME}}]` {{COMPLETED_ACTION_1}}
- ✅ `[{{PROJECT_NAME}}]` {{COMPLETED_ACTION_2}}
- ✅ **Verification**: {{VERIFICATION_OUTCOME}}

---

## 🛠️ Verification Commands

```powershell
# Commands used to test and verify sprint changes
{{VERIFICATION_COMMANDS}}
```

---

## 🔖 Metadata

- **Project**: {{PROJECT_NAME}}
- **Tracking Mode**: {{SEMVER_OR_MILESTONES}}
