# Workspace Maintenance Audit

**Generated:** 2026-01-22 20:15
**Status:** ⚠️ 8 issues found (4 warnings, 4 info)

---

## Summary

| Category | Status | Issues |
|----------|--------|--------|
| Structure Integrity | ⚠️ | 3 |
| Data Consistency | ⚠️ | 1 |
| Health Checks | ✅ | 0 |
| Cleanup Candidates | ℹ️ | 4 |

---

## Issues Found

### Critical (must fix)

*None*

### Warning (should fix)

#### 1. Structure: Missing `research.md` (2 initiatives)

| Initiative | Status | Recommendation |
|------------|--------|----------------|
| `condorcet-jury-eval/` | Has `_meta.json` only | Create research.md or archive if redundant |
| `internal-search/` | Has `_meta.json` only | Create research.md with problem statement |

**Required action:** Per schema, every initiative requires `research.md` documenting the user problem.

#### 2. Structure: Inconsistent `_meta.json` Schema (1 initiative)

| Initiative | Issue |
|------------|-------|
| `crm-readiness-diagnostic/` | Uses `initiative_id` instead of `initiative`, missing `$schema` and `updated_at` fields |

**Current fields:**
```json
{
  "initiative_id": "crm-readiness-diagnostic",  // Should be "initiative"
  // Missing: "$schema", "updated_at", "phase_history"
}
```

#### 3. Structure: Orphaned `current/` Folder

The `current/` folder contains 10 subdirectories with only `analysis.md` files:

| Subfolder | Files | Status |
|-----------|-------|--------|
| capture-visibility | analysis.md only | No `_meta.json` |
| crm-agent-upgrades | analysis.md only | No `_meta.json` |
| customer-journey-product | analysis.md only | No `_meta.json` |
| fga-engine | analysis.md only | No `_meta.json` |
| global-chat | analysis.md only | No `_meta.json` |
| nerdy-tables | analysis.md only | No `_meta.json` |
| notification-engine | analysis.md only | No `_meta.json` |
| observability-monitoring | analysis.md only | No `_meta.json` |
| privacy-determination-agent-v2 | analysis.md only | No `_meta.json` |
| release-lifecycle-process | analysis.md only | Duplicate name - conflicts with main initiative |

**Recommendation:** Review and either:
- Archive to `archived/` folder
- Promote to proper initiatives with `_meta.json` + `research.md`
- Delete if content is stale

#### 4. Data Consistency: Prototype Versioning Non-Compliance

Per workspace standards, prototypes should use versioned subfolders from the start.

| Prototype | Structure | Issue | Recommendation |
|-----------|-----------|-------|----------------|
| `ComposioAgentFramework/` | Mixed (root + v2, v3, v4) | Root files not in `v1/` | Move root to `v1/` |
| `CrmReadinessDiagnostic/` | Mixed (root + v4) | Root files not versioned | Move root to `v1/` or `v3/` |
| `SettingsRedesign/` | Mixed (root + v2) | Root files not in `v1/` | Move root to `v1/` |
| `UniversalSignalTables/` | Flat (no versions) | No version folders | Move all to `v1/` |

**Compliant:**
- ✅ `BetaFeatures/` - Properly uses `v4/` only (clean structure)

---

### Info (optional cleanup)

#### 1. Empty Folders

| Folder | Status |
|--------|--------|
| `signals/conversations/` | Empty |
| `signals/issues/` | Empty |
| `signals/tickets/` | Empty |
| `maintenance/audit-history/` | Empty |
| `hypotheses/retired/` | Empty |

**Recommendation:** Add `.gitkeep` files to preserve structure, or remove if not needed.

#### 2. Duplicate Initiative Name

`current/release-lifecycle-process/` has same name as main initiative `release-lifecycle-process/`. The `current/` version only has an `analysis.md` file.

#### 3. Redundant Initiative

`condorcet-jury-eval` and `condorcet-jury-system` appear to be related/duplicates:
- `condorcet-jury-system` - Has full docs (prd.md, research.md)
- `condorcet-jury-eval` - Has only `_meta.json`

Consider merging or archiving one.

#### 4. Snapshots Count

`roadmap/snapshots/` has 5 snapshots (all within last 7 days). Within limits.

---

## Health Checks

| Check | Status | Details |
|-------|--------|---------|
| Stale initiatives (>14 days in phase) | ✅ Pass | Oldest: `condorcet-jury-system` (13 days in define) |
| Stale hypotheses (>30 days active) | ✅ Pass | None found |
| P0/P1 initiatives without owners | ✅ Pass | All P0/P1 have owners |
| Blockers without descriptions | ✅ Pass | No blockers found |
| Unlinked committed hypotheses | ✅ Pass | All linked to initiatives |

### Initiative Staleness Check

| Initiative | Phase | Days in Phase | Status |
|------------|-------|---------------|--------|
| automated-metrics-observability | define | 13 | ⚠️ Approaching stale |
| condorcet-jury-system | define | 13 | ⚠️ Approaching stale |
| call-import-engine | define | 8 | ✅ OK |
| feature-availability-audit | define | 8 | ✅ OK |
| universal-signal-tables | build | 7 | ✅ OK |
| customer-journey-map | build | 7 | ✅ OK |
| release-lifecycle-process | build | 7 | ✅ OK |

---

## Index File Integrity

### Signals Index (`_index.json`)

| Metric | Value | Status |
|--------|-------|--------|
| Index total | 9 signals | ✅ |
| Transcript files | 7 files | ✅ |
| Document files | 2 files | ✅ |
| All signals have file_path | Yes | ✅ |

### Hypotheses Index (`_index.json`)

| Metric | Value | Status |
|--------|-------|--------|
| Index total | 11 hypotheses | ✅ |
| Active folder | 1 file | ✅ |
| Committed folder | 9 files | ✅ |
| Validated folder | 1 file | ✅ |
| Retired folder | 0 files | ✅ |
| Status matches folder | Yes | ✅ |

### Roadmap (`roadmap.json`)

| Metric | Value | Status |
|--------|-------|--------|
| Total initiatives | 13 | ✅ |
| By phase | discovery:2, define:4, build:5, validate:2 | ✅ |
| All have valid phases | Yes | ✅ |
| All have valid statuses | Yes | ✅ |

---

## Auto-Fixable

These can be fixed with `maintain fix`:

- [ ] Normalize `crm-readiness-diagnostic/_meta.json` schema
- [ ] Create placeholder `research.md` for `condorcet-jury-eval`
- [ ] Create placeholder `research.md` for `internal-search`
- [ ] Add `.gitkeep` to empty folders

---

## Requires Human Decision

| Issue | Why Manual | Recommended Action |
|-------|------------|-------------------|
| `current/` folder (10 items) | Unclear purpose | Archive or promote to initiatives |
| Prototype restructuring (4) | May break imports | Migrate during next `/iterate` |
| `condorcet-jury-eval` redundancy | May be duplicate | Merge into `condorcet-jury-system` |

---

## Statistics

### Workspace Totals

| Category | Count |
|----------|-------|
| Initiatives (proper) | 19 |
| Hypotheses | 11 |
| Signals | 9 |
| Prototypes | 5 |

### Initiative Phase Distribution

```
Discovery  ████░░░░░░░░░░░░░░░░ 2 (15%)
Define     ████████░░░░░░░░░░░░ 4 (31%)
Build      ██████████░░░░░░░░░░ 5 (38%)
Validate   ████░░░░░░░░░░░░░░░░ 2 (15%)
Launch     ░░░░░░░░░░░░░░░░░░░░ 0 (0%)
```

### Priority Distribution

| Priority | Count | Initiatives |
|----------|-------|-------------|
| P0 | 7 | condorcet-jury-system, feature-availability-audit, crm-exp-ete, universal-signal-tables, customer-journey-map, release-lifecycle-process, hubspot-agent-config-ui |
| P1 | 1 | composio-agent-framework |
| P2 | 4 | crm-readiness-diagnostic, condorcet-jury-eval, automated-metrics-observability, call-import-engine |
| P3 | 1 | internal-search |

---

## Recommended Actions

### Immediate (run `maintain fix`)

1. Normalize `crm-readiness-diagnostic/_meta.json` to standard schema
2. Create placeholder `research.md` files for empty initiatives

### This Week (manual review)

1. **Review `current/` folder** - decide archive vs promote
2. **Check `condorcet-jury-eval`** - likely redundant with `condorcet-jury-system`
3. **Progress stale initiatives** - `automated-metrics-observability` and `condorcet-jury-system` approaching 14-day threshold

### During Next Iteration

1. Migrate prototype structures to versioned folders during `/iterate` calls
2. Consider consolidating related initiatives

---

*Run `maintain fix` to auto-fix safe issues, or `maintain sync` to regenerate derived files.*
