---
name: portfolio-status
description: Analyze status of ALL initiatives with artifact gap matrix, health scoring, and prioritized action queue. Use when running /status-all command or answering "where are we across everything?" questions.
---

# Portfolio Status Skill

Procedural knowledge for generating comprehensive portfolio health reports across all initiatives.

## When to Use

- Running `/status-all` command
- Answering "where are we across everything?"
- Weekly/daily status reviews
- Identifying portfolio-wide blockers and gaps
- Prioritizing what to work on next

## Data Sources

Scan all initiative folders:

```
pm-workspace-docs/initiatives/*/
├── _meta.json              # Phase, status, priority
├── research.md             # User research
├── prd.md                  # Product requirements
├── design-brief.md         # Design specifications
├── engineering-spec.md     # Technical spec
├── prototype-notes.md      # Prototype documentation
├── gtm-brief.md            # Go-to-market plan
└── jury-evaluations/       # Validation results
```

Also load:
- `pm-workspace-docs/roadmap/roadmap.json` - Priority and phase data
- `pm-workspace-docs/signals/_index.json` - Linked signals
- `pm-workspace-docs/status/history.json` - Previous snapshots (if exists)
- `pm-workspace-docs/status/dev-status-*.json` - Latest dev status (if exists)

## MCP Tools Available (Optional Enhancement)

**Server:** `pm-mcp-config` (Composio)

Use MCP tools to enrich portfolio status with live data:

| Source | Tools | Enhancement |
|--------|-------|-------------|
| **Linear** | `LINEAR_LIST_LINEAR_PROJECTS`, `LINEAR_SEARCH_ISSUES` | Pull live issue counts, cycle progress |
| **PostHog** | `POSTHOG_RETRIEVE_PROJECT_INSIGHTS`, `POSTHOG_RETRIEVE_PROJECT_INSIGHT_DETAILS` | Pull success metric values for initiatives with dashboards |
| **Notion** | `NOTION_QUERY_DATABASE` | Cross-reference with Notion Projects DB |
| **Slack** | `SLACK_SEARCH_MESSAGES` | Check for recent activity mentions |

**When to use:**
- `/status-all --live` → Query Linear/PostHog for real-time data
- Health scoring → Use PostHog metrics to validate initiative health
- Blockers → Check Linear for blocked issues

## Analysis Framework

### Step 1: Discover All Initiatives

List all directories in `pm-workspace-docs/initiatives/` excluding:
- `_template/` - Template folder
- `current/` - Current work tracking (separate from initiatives)
- Any folder starting with `.` or `_`

### Step 2: Collect Initiative Data

For each initiative, extract from `_meta.json`:

```json
{
  "id": "initiative-name",
  "phase": "discovery | define | build | validate | launch",
  "status": "on_track | at_risk | blocked | paused",
  "priority": "P0 | P1 | P2 | P3",
  "owner": "name",
  "personas": [],
  "pillar": "pillar-name",
  "updated_at": "ISO8601",
  "created_at": "ISO8601",
  "blockers": [],
  "jury_results": { "pass_rate": 0.0 }
}
```

If `_meta.json` is missing, mark as `incomplete_metadata`.

### Step 3: Check Artifact Completeness

For each initiative, check file existence:

| Artifact | File | Status |
|----------|------|--------|
| Research | `research.md` | ✅ exists / ❌ missing |
| PRD | `prd.md` | ✅ exists / ❌ missing |
| Design Brief | `design-brief.md` | ✅ exists / ❌ missing |
| Engineering Spec | `engineering-spec.md` | ✅ exists / ❌ missing |
| Prototype | `prototype-notes.md` | ✅ exists / ❌ missing |
| GTM Brief | `gtm-brief.md` | ✅ exists / ❌ missing |
| Jury Evaluation | `jury-evaluations/*.md` | ✅ exists / ❌ missing |

**Artifact Completeness %** = (artifacts present / total expected for phase) * 100

Expected artifacts by phase:
- **Discovery**: Research
- **Define**: Research, PRD, Design Brief
- **Build**: Research, PRD, Design Brief, Engineering Spec, Prototype Notes
- **Validate**: All above + Jury Evaluation
- **Launch**: All artifacts

### Step 4: Calculate Staleness

| Days in Phase | Status |
|---------------|--------|
| 0-7 | 🟢 Fresh |
| 8-14 | 🟡 Monitor |
| 15-21 | 🟠 Stale |
| 22+ | 🔴 Very Stale |

Calculate `days_in_phase` from `_meta.json.updated_at` or `phase_history`.

### Step 5: Assess Graduation Readiness

For each initiative, check if ready to advance:

#### Discovery → Define
- [x] `research.md` exists with content
- [x] User problems documented
- [x] Personas identified in `_meta.json`

#### Define → Build
- [x] `prd.md` exists
- [x] `design-brief.md` exists
- [x] Outcome chain defined

#### Build → Validate
- [x] `prototype-notes.md` exists
- [x] States documented (Loading, Error, Empty, Success)
- [x] Chromatic URL or prototype location

#### Validate → Launch
- [x] Jury pass rate ≥70%
- [x] Stakeholder approval
- [x] No P0 blockers
- [x] `gtm-brief.md` exists

**Ready to Advance** = All criteria met for current phase transition

### Step 6: Calculate Portfolio Health Score

| Metric | Weight | Score Calculation |
|--------|--------|-------------------|
| No blocked initiatives | 25 | 25 if 0, 15 if 1, 0 if 2+ |
| Artifact completeness | 25 | (avg completeness %) * 0.25 |
| No stale initiatives | 20 | 20 if 0, 10 if 1-2, 0 if 3+ |
| Phase distribution | 15 | See balance check below |
| Jury pass rates | 15 | (avg pass rate where available) * 0.15 |

**Phase Distribution Balance:**
- Ideal: 10-20% discovery, 20-30% define, 30-40% build, 10-20% validate
- Score 15 if within ranges, 8 if slightly off, 0 if severely imbalanced

**Total Health Score = Sum of all metric scores (0-100)**

### Step 7: Generate Action Queue

Prioritize actions using this algorithm:

```
Score = (Priority_Weight * 10) + (Blocking_Impact * 5) + (Quick_Win * 3) + (Graduation_Ready * 2)

Priority_Weight:
- P0 = 4
- P1 = 3
- P2 = 2
- P3 = 1

Blocking_Impact:
- Blocks other initiatives = 2
- Blocks same initiative = 1
- No blocking = 0

Quick_Win:
- Can complete in <1 hour = 2
- Can complete in <1 day = 1
- Longer = 0

Graduation_Ready:
- Ready to advance with this action = 2
- Partially ready = 1
- Not ready = 0
```

Sort actions by score descending, limit to top 10.

### Step 8: Include Dev Activity Data

If `dev_activity` exists in `_meta.json`, include in analysis:

```json
{
  "dev_activity": {
    "last_synced": "2026-01-23T18:00:00Z",
    "linear_issues_total": 57,
    "linear_issues_completed": 23,
    "linear_issues_in_progress": 10,
    "github_prs_merged_30d": 15
  }
}
```

**Dev Progress Calculation:**
- If `linear_issues_total` > 0: `completed / total * 100`
- Show as percentage in artifact matrix

**Activity Flags:**
- **High Activity**: >5 issues in progress OR >3 PRs in last 7 days
- **Stale Code**: >14 days since last PR with >0 issues in progress
- **Docs Drift**: High activity but docs >14 days stale

**Add to Health Score (optional boost):**
- Active development with current docs: +5 points
- High activity with stale docs: -5 points (alert)

### Step 9: Compare to History (Trends)

If `pm-workspace-docs/status/history.json` exists, compare:

- Health score change (↑ improved, ↓ declined, → stable)
- Phase advances since last check
- New blockers since last check
- Initiatives added/removed

## Output Formats

### Markdown Report (Default)

```markdown
# Portfolio Status Report

**Generated:** YYYY-MM-DD HH:MM
**Health Score:** XX/100 [↑/↓/→]

---

## Executive Summary

| Metric | Value |
|--------|-------|
| Total Initiatives | X |
| By Priority | P0: X, P1: X, P2: X, P3: X |
| Ready to Advance | X |
| Need Attention | X |

---

## Attention Required

| Initiative | Phase | Issue | Days | Action |
|------------|-------|-------|------|--------|
| [name] | [phase] | [issue] | [N] | `/[cmd] [name]` |

---

## Artifact Gap Matrix

| Initiative | Phase | Res | PRD | Des | Eng | Proto | Jury | Dev |
|------------|-------|-----|-----|-----|-----|-------|------|-----|
| [name] | [phase] | ✅ | ✅ | ❌ | ❌ | ⚠️ | - | 40% |

Legend: ✅ Complete | ⚠️ Incomplete | ❌ Missing | - Not required yet | Dev = Linear progress %

## Dev Activity Alerts

| Initiative | Alert | Details | Action |
|------------|-------|---------|--------|
| [name] | 📝 Docs Drift | High dev activity, docs 14d stale | Update docs |
| [name] | ⚠️ No Linear | Missing linear_project_id | `/sync-linear --map` |

---

## Ready to Advance

| Initiative | Current | Next | Criteria Met | Blocker |
|------------|---------|------|--------------|---------|
| [name] | [phase] | [phase] | X/Y | [if any] |

---

## Prioritized Action Queue

| # | Action | Initiative | Impact | Effort |
|---|--------|------------|--------|--------|
| 1 | `/[cmd] [name]` | [name] | [description] | [est] |

---

## Phase Distribution

| Phase | Count | % | Ideal |
|-------|-------|---|-------|
| Discovery | X | X% | 10-20% |
| Define | X | X% | 20-30% |
| Build | X | X% | 30-40% |
| Validate | X | X% | 10-20% |
| Launch | X | X% | 5-10% |

---

## Trends (vs. [previous date])

- **Health:** XX → XX ([change])
- **Phase Advances:** +X
- **New Blockers:** X
- **Stale → Active:** X

---

## All Initiatives

| Initiative | Phase | Status | Priority | Days | Next Step |
|------------|-------|--------|----------|------|-----------|
| [name] | [phase] | 🟢/🟡/🔴 | PX | N | [action] |
```

### JSON Output

```json
{
  "generated_at": "ISO8601",
  "health_score": 78,
  "health_trend": "up",
  "summary": {
    "total": 19,
    "by_priority": { "P0": 7, "P1": 5, "P2": 4, "P3": 3 },
    "by_phase": { "discovery": 2, "define": 5, ... },
    "by_status": { "on_track": 15, "at_risk": 3, ... },
    "ready_to_advance": 3,
    "need_attention": 2
  },
  "attention_required": [
    {
      "id": "initiative-name",
      "issue": "Stale (21 days)",
      "action": "/status initiative-name"
    }
  ],
  "artifact_matrix": [
    {
      "id": "initiative-name",
      "phase": "build",
      "artifacts": {
        "research": "complete",
        "prd": "complete",
        "design_brief": "missing",
        "engineering_spec": "incomplete",
        "prototype": "complete",
        "jury": "not_required"
      },
      "completeness": 0.67,
      "dev_activity": {
        "linear_progress": 0.40,
        "issues_in_progress": 8,
        "prs_merged_30d": 15,
        "last_synced": "2026-01-23T18:00:00Z"
      },
      "alerts": ["docs_drift"]
    }
  ],
  "ready_to_advance": [...],
  "action_queue": [...],
  "initiatives": [...],
  "previous_snapshot": {
    "date": "ISO8601",
    "health_score": 75
  }
}
```

## Command Options

| Option | Description |
|--------|-------------|
| (none) | Full portfolio report |
| `--priority P0` | Filter to P0 initiatives only |
| `--phase build` | Filter to build phase only |
| `--stale` | Only show stale/at-risk initiatives |
| `--json` | Output JSON format only |
| `--no-save` | Don't save to status folder |

## Saving Results

After generating report:

1. Save markdown to `pm-workspace-docs/status/status-all-YYYY-MM-DD.md`
2. Save JSON to `pm-workspace-docs/status/status-all-YYYY-MM-DD.json`
3. Update `pm-workspace-docs/status/history.json` with snapshot

History JSON format:
```json
{
  "snapshots": [
    {
      "date": "2026-01-23",
      "health_score": 78,
      "total_initiatives": 19,
      "by_phase": {...},
      "by_status": {...}
    }
  ]
}
```

## Edge Cases

### No Initiatives Found
```
⚠️ No initiatives found in pm-workspace-docs/initiatives/

Create your first initiative with:
/new-initiative [name]
```

### All Initiatives Missing Metadata
```
⚠️ Found X initiatives but none have _meta.json files.

Run `/maintain fix` to generate metadata for all initiatives.
```

### First Run (No History)
```
ℹ️ First portfolio status run - no historical data for comparison.

Future runs will show trends.
```

## Integration with Other Commands

After generating status, suggest relevant follow-ups:

- Stale initiative → `/status [name]` for details
- Missing artifacts → `/pm [name]` or `/proto [name]`
- Failed jury → `/iterate [name]`
- Ready for launch → `/share`
- Phase imbalance → `/roadmap` for prioritization
- Missing dev data → `/sync-dev` to refresh Linear/GitHub data
- Docs drift alert → Update stale docs for active initiatives
- No Linear mapping → `/sync-linear --map` to suggest mappings

## Dev Pipeline Integration

### Running with Fresh Data

For most accurate view, run sync first:
```
/sync-dev          # Refresh Linear + GitHub data
/status-all        # Generate status with fresh dev activity
```

### Alert Types

| Alert | Condition | Recommended Action |
|-------|-----------|-------------------|
| `docs_drift` | Dev activity high, docs >14 days stale | Update research/PRD |
| `no_linear` | Missing `linear_project_id` | Run `/sync-linear --map` |
| `stale_code` | Issues in progress, no PRs in 14 days | Check blocked work |
| `high_activity` | >5 issues active | May need phase advancement |

### Dev Activity in Health Score

Base health score calculation remains unchanged. Dev activity provides:
- **Context**: Understand if an initiative is active even if docs are stale
- **Alerts**: Surface initiatives where code and docs are out of sync
- **Velocity**: Track shipping rate per initiative
