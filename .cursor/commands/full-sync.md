# Full Sync Command

Interactive sync between PM workspace initiatives and Notion with data completeness audit.

**Delegates to**: `notion-admin` subagent

## Usage

```
/full-sync                    # Interactive sync with questions
/full-sync --audit-only       # Just report gaps, don't fix
/full-sync --auto             # Auto-fill what's possible, skip questions
```

## What It Does

### 1. Audit Data Completeness

For each project in both PM workspace and Notion:

**Database Properties:**

| Check             | PM Workspace                 | Notion              |
| ----------------- | ---------------------------- | ------------------- |
| Initiative exists | `initiatives/[name]/` folder | Projects DB entry   |
| Outcome defined   | `prd.md` outcome chain       | Outcome property    |
| Phase aligned     | `_meta.json` phase           | Project Phase       |
| Linear linked     | `linear_project_id`          | Linear Link         |
| GTM connected     | `gtm-brief.md` exists        | GTM relation        |
| Visibility set    | N/A                          | Visibility property |
| Priority set      | `_meta.json` priority        | Priority property   |
| Owners assigned   | `_meta.json` owner           | Engineering/Design  |

**Page Content (NEW):**

| Check               | PM Workspace Source                  | Notion Target              |
| ------------------- | ------------------------------------ | -------------------------- |
| Problem Statement   | `prd.md` → Problem section           | Heading + paragraph        |
| Success Metrics     | `prd.md` → Metrics section           | Heading + bullet list      |
| User Stories        | `prd.md` → User Stories              | Heading + bullet list      |
| Research Highlights | `research.md` → Key quotes           | Callout block (anonymized) |
| Current Status      | `_meta.json` → blockers, next_action | Status callout             |
| Launch Timeline     | `gtm-brief.md` → dates               | Date callout               |

**Content Completeness Scoring:**

| Score    | Meaning                | What to sync       |
| -------- | ---------------------- | ------------------ |
| Empty    | No content blocks      | Full PRD summary   |
| Minimal  | Just title/description | Add sections       |
| Partial  | Some sections present  | Fill gaps          |
| Complete | All sections present   | Update status only |

### 2. Content Audit (with `--content` flag)

When `--content` is specified, fetches page content for each Notion project and compares:

```
📋 Rep Workspace - Content Audit

PM Workspace has:
✅ prd.md (2,847 words)
✅ research.md (1,523 words)
✅ design-brief.md (892 words)
❌ gtm-brief.md (missing)

Notion page has:
❌ Empty (0 content blocks)

? How would you like to populate this page?
  ○ Sync PRD summary (Problem, Metrics, User Stories)
  ○ Sync PRD + Research highlights
  ○ Full sync (PRD + Research + Status)
  ○ Skip - I'll update manually
```

**What gets synced to Notion (public-safe):**

| Section             | Source                                    | Privacy      |
| ------------------- | ----------------------------------------- | ------------ |
| Problem Statement   | First paragraph of prd.md Problem section | ✅ Safe      |
| Success Metrics     | Bullet points from Metrics section        | ✅ Safe      |
| User Stories        | "As a [persona]..." statements            | ✅ Safe      |
| Research Highlights | Anonymized insights (no customer names)   | ⚠️ Anonymize |
| Current Status      | Phase, blockers, next action              | ✅ Safe      |
| Launch Timeline     | Target dates from gtm-brief               | ✅ Safe      |

**What stays private (PM workspace only):**

- Full research transcripts and quotes
- Customer names and company details
- Decision records and trade-off discussions
- Internal concerns and red flags
- Jury evaluation details

### 3. Interactive Gap Filling

When data is missing, prompts with AskQuestion tool:

```
📋 Project: Rep Workspace

Missing: Outcome in Notion
Current PRD outcome: "Rep has a dedicated workspace..."

Would you like to:
[ ] Copy outcome to Notion
[ ] Write custom outcome
[ ] Skip this project
```

### 3. Visibility Status Sync

Checks PostHog feature flags to determine visibility:

| PostHog State              | Visibility |
| -------------------------- | ---------- |
| No flag                    | Internal   |
| Flag exists, 0% rollout    | Alpha      |
| Flag exists, <100% rollout | Beta       |
| Flag exists, 100% rollout  | GA         |
| Flag removed/deprecated    | GA         |

## Sync Directions

```
┌─────────────────────────────────────────────────────────────┐
│                     /full-sync                               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  PM WORKSPACE → NOTION (What to share)                       │
│  ──────────────────────────────────────                      │
│  ✅ Outcome (1-sentence summary from PRD)                    │
│  ✅ Phase (from _meta.json)                                  │
│  ✅ Priority (from _meta.json)                               │
│  ✅ Linear Link (from _meta.json)                            │
│  ❌ Full PRD (private)                                       │
│  ❌ Research quotes (private)                                │
│  ❌ Decision records (private)                               │
│                                                              │
│  NOTION → PM WORKSPACE (What to pull)                        │
│  ──────────────────────────────────────                      │
│  ✅ notion_project_id (for linking)                          │
│  ✅ Engineering/Design assignments                           │
│  ✅ GTM connection status                                    │
│  ✅ Visibility status                                        │
│                                                              │
│  POSTHOG → NOTION (Visibility status)                        │
│  ──────────────────────────────────                          │
│  ✅ Feature flag state → Visibility property                 │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Question Flow

### Missing Outcome

```
📋 Rep Workspace - Missing Outcome in Notion

Your PRD says:
"Rep has a dedicated workspace with relevant information
  → so that they can quickly see what matters
    → so that they take timely action on deals"

Suggested: "Dashboard so reps see insights and act faster"

? How would you like to proceed?
  ○ Use suggested outcome
  ○ Write custom (you'll be prompted)
  ○ Copy first line of outcome chain
  ○ Skip - leave empty
```

### Missing Linear Link

```
📋 Settings Redesign - Missing Linear Link

Found these Linear projects that might match:
1. Workspace Settings (11d0e1b8-1f1f-4654-ab72-e37e37db747d)
2. Settings v2 (abc123...)

? Which Linear project should be linked?
  ○ Workspace Settings
  ○ Settings v2
  ○ None of these - I'll add manually
  ○ No Linear project needed
```

### Missing Visibility

```
📋 Global Chat - Missing Visibility Status

PostHog feature flag check:
- Flag: global-chat-enabled
- Current rollout: 25% of users

? What is the visibility status?
  ○ Alpha (internal only)
  ○ Beta (limited rollout) ← Suggested based on 25%
  ○ GA (generally available)
  ○ Internal (not customer-facing)
```

### Conflicting Data

```
⚠️ Phase Mismatch: Rep Workspace

PM Workspace: build
Notion: Discovery

? Which is correct?
  ○ Use PM Workspace (build)
  ○ Use Notion (Discovery)
  ○ Set both to: [custom]
```

## Output Report

```markdown
# Full Sync Report

**Generated:** 2026-01-26 15:00
**Mode:** Interactive

---

## Sync Summary

| Metric           | Count |
| ---------------- | ----- |
| Projects audited | 12    |
| Gaps found       | 8     |
| Gaps resolved    | 6     |
| Skipped          | 2     |

---

## Actions Taken

### Notion Updates

- Rep Workspace: Added outcome
- Settings Redesign: Added Linear Link
- Global Chat: Set Visibility = Beta

### PM Workspace Updates

- rep-workspace/\_meta.json: Added notion_project_id
- global-chat/\_meta.json: Added visibility: beta

---

## Still Missing (Requires Manual Action)

| Project       | Missing     | Why                              |
| ------------- | ----------- | -------------------------------- |
| FGA Engine    | Linear Link | No matching Linear project found |
| Observability | GTM         | User skipped                     |

---

## Visibility Status

| Project           | Visibility | PostHog Flag        | Rollout |
| ----------------- | ---------- | ------------------- | ------- |
| Global Chat       | Beta       | global-chat-enabled | 25%     |
| Rep Workspace     | Internal   | (none)              | -       |
| Settings Redesign | Alpha      | settings-v2         | 0%      |

---

## Content Completeness (with --content flag)

| Project           | PM Docs            | Notion Content | Action Taken             |
| ----------------- | ------------------ | -------------- | ------------------------ |
| Rep Workspace     | PRD ✅ Research ✅ | Empty          | Synced PRD summary       |
| Global Chat       | PRD ✅ Research ❌ | Minimal        | Added Problem section    |
| Settings Redesign | PRD ✅ Research ✅ | Complete       | Updated status only      |
| FGA Engine        | PRD ❌ Research ❌ | Empty          | Skipped (no source docs) |
```

## Files Updated

- `pm-workspace-docs/initiatives/*/_meta.json` - Notion IDs, visibility
- `pm-workspace-docs/status/full-sync-YYYY-MM-DD.md` - Sync report
- Notion Projects Database - Outcomes, Linear Links, Visibility

## Options

| Option                     | Description                                                     |
| -------------------------- | --------------------------------------------------------------- |
| (none)                     | Interactive mode with questions                                 |
| `--audit-only`             | Report gaps without fixing                                      |
| `--auto`                   | Auto-resolve where confident, skip questions                    |
| `--project "Name"`         | Sync specific project only                                      |
| `--posthog`                | Include PostHog visibility check                                |
| `--content`                | **Audit and sync page content** (PRD, Research, Status)         |
| `--content --auto`         | Auto-sync content where PM docs exist                           |
| `--subpages`               | **Create documentation subpages** (PRD, Research, Design Brief) |
| `--subpages --auto`        | Auto-create subpages where PM docs exist                        |
| `--create-projects`        | **Create Notion projects from PM workspace initiatives**        |
| `--create-projects --auto` | Auto-create all projects with documentation                     |

---

## Subpages Mode (`--subpages`)

Creates child pages under each Notion project with full documentation from PM workspace.

### What It Does

1. **Check PM workspace documentation**
   - Does `initiatives/[name]/prd.md` exist?
   - Does `initiatives/[name]/research.md` exist?
   - Does `initiatives/[name]/design-brief.md` exist?

2. **Check Notion for existing subpages**
   - Query children of project page
   - Skip if "PRD - Full Requirements" already exists

3. **Prompt for each project**

```
📋 Rep Workspace - Documentation Subpages

PM Workspace has:
✅ prd.md (2,847 words)
✅ research.md (1,523 words)
✅ design-brief.md (892 words)

Notion subpages:
❌ None exist

? Create documentation subpages?
  ○ Yes - Create all 3 (PRD, Research, Design Brief)
  ○ PRD only
  ○ Skip this project
```

4. **Create subpages** using `NOTION_CREATE_NOTION_PAGE`

### Subpage Structure

Each project gets child pages:

```
📋 Rep Workspace (Project Page - Summary)
├── 📄 PRD - Full Requirements
│   └── Full PRD with outcome chain, user stories, scope
├── 📄 Research Documentation
│   └── Customer evidence, key decisions, quotes
└── 📄 Design Brief
    └── Design principles, UX flows, specifications
```

### Content Privacy

**What goes in subpages (shareable):**

- Full PRD content (problem, metrics, user stories, scope)
- Research insights and key decisions
- Design principles and UX flows
- Anonymized customer quotes (no names)

**What stays private:**

- Internal concerns and red flags
- Jury evaluation details
- Raw transcript content
- Customer/company names in quotes

### Report Output

```markdown
## Documentation Subpages

| Project                 | PRD          | Research     | Design Brief |
| ----------------------- | ------------ | ------------ | ------------ |
| Rep Workspace           | ✅ Created   | ✅ Created   | ✅ Created   |
| Settings Redesign       | ✅ Created   | ✅ Created   | ❌ No source |
| Global Chat             | ❌ No source | ❌ No source | ❌ No source |
| Universal Signal Tables | ✅ Created   | ✅ Created   | ✅ Created   |

### Links Created

- [Rep Workspace - PRD](notion-link)
- [Rep Workspace - Research](notion-link)
- ...
```

---

## Create Projects Mode (`--create-projects`)

Creates Notion projects from PM workspace initiatives that don't exist in Notion yet.

### What It Does

1. **Scan PM workspace** - Find all `initiatives/[name]/` folders with `_meta.json` or `prd.md`
2. **Query Notion Projects database** - Get list of existing projects
3. **Match and identify gaps** - Find initiatives without Notion projects
4. **Prompt for creation** - Ask which to create (or auto-create with `--auto`)
5. **Create projects** - Add to Notion with metadata from PM workspace
6. **Optionally create subpages** - Include documentation if available

### Data Mapping

| PM Workspace Source               | Notion Property |
| --------------------------------- | --------------- |
| Folder name (title-cased)         | Project name    |
| `prd.md` → Outcome Chain          | Outcome         |
| `_meta.json` → phase              | Project Phase   |
| `_meta.json` → linear_project_url | Linear Link     |
| `_meta.json` → pillar             | (for reference) |

### Phase Mapping

| PM Workspace Phase | Notion Project Phase |
| ------------------ | -------------------- |
| discovery          | Discovery            |
| define             | Define               |
| build              | Build                |
| validate           | Test                 |
| launch             | Done - Full Release  |

### Example Flow

```
📋 PM Workspace → Notion Projects

Found 5 initiatives without Notion projects:

1. ✅ admin-onboarding (Define)
   Outcome: "Guided admin setup with CRM-first..."
   Linear: https://linear.app/.../admin-onboarding

2. ✅ composio-agent-framework (Validate)
   Outcome: "Simpler automation creation..."
   Linear: (none)

3. ❌ condorcet-jury-system (Internal tool - skip)

4. ✅ customer-journey-map (Define)
   Outcome: "Journey workspace for deals..."
   Linear: (none)

? Which projects would you like to create in Notion?
  ○ Create all checked (3)
  ○ Select individually
  ○ Create all (5)
  ○ Skip - I'll create manually
```

### Report Output

```markdown
## Projects Created

| Initiative               | Notion Project                   | Phase  | Linear |
| ------------------------ | -------------------------------- | ------ | ------ |
| admin-onboarding         | [Admin Onboarding](link)         | Define | ✅     |
| composio-agent-framework | [Composio Agent Framework](link) | Test   | ❌     |
| customer-journey-map     | [Customer Journey Map](link)     | Define | ❌     |

### Updated \_meta.json files:

- initiatives/admin-onboarding/\_meta.json → notion_project_id added
- initiatives/composio-agent-framework/\_meta.json → notion_project_id added
```

---

## Prerequisites

Requires:

- Notion MCP access (pm-mcp-config or dedicated)
- PostHog MCP access (for visibility check)
- Linear MCP access (for project matching)

## Manual Setup Required

**Add "Visibility" property to Projects Database:**

1. Open [Projects Database](https://www.notion.so/ask-elephant/2c0f79b2c8ac802c8b15c84a8fce3513)
2. Click + to add property
3. Name: "Visibility"
4. Type: Select
5. Options:
   - Internal (gray)
   - Alpha (purple)
   - Beta (blue)
   - GA (green)
