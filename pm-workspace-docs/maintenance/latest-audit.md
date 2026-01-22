# Workspace Maintenance Audit

**Generated:** 2026-01-22 12:45
**Last Fix Run:** 2026-01-22 12:50
**Status:** ✅ Auto-fixes applied (11 issues resolved, 4 remaining)

---

## Fixes Applied (2026-01-22 12:50)

| Fix | Status | Details |
|-----|--------|---------|
| Generate `_meta.json` for 6 initiatives | ✅ Done | admin-onboarding, product-usability, settings-redesign, speaker-id-voiceprint, user-onboarding, internal-search |
| Add missing signal to index | ✅ Done | Added `sig-2026-01-21-crispy-product-chat-raw` |
| Update hypothesis index | ✅ Done | `crm-readiness-diagnostic` status → `validated` |
| Add to roadmap | ✅ Done | `composio-agent-framework` added (P1, validate phase) |

**Skipped:**
- `current/` folder - Requires human decision (unclear purpose)
- `_template/` - Expected to not have `_meta.json`

---

## Summary

| Category | Before Fix | After Fix |
|----------|------------|-----------|
| Structure Integrity | ⚠️ 8 issues | ⚠️ 2 remaining |
| Data Consistency | ⚠️ 4 issues | ✅ 0 remaining |
| Health Checks | ✅ 0 | ✅ 0 |
| Prototype Versioning | ⚠️ 3 issues | ⚠️ 3 remaining (manual) |

---

## Issues Found

### Critical (must fix)

*None*

### Warning (should fix)

#### Structure: Missing `_meta.json` (8 initiatives)

| Initiative | Status | Recommendation |
|------------|--------|----------------|
| `admin-onboarding/` | Missing | Generate from existing files |
| `current/` | Missing | Appears to be misc folder - consider archiving |
| `internal-search/` | Missing | Generate from existing files |
| `product-usability/` | Missing | Generate from existing files |
| `settings-redesign/` | Missing | Generate from existing files |
| `speaker-id-voiceprint/` | Missing | Generate from existing files |
| `user-onboarding/` | Missing | Generate from existing files |
| `_template/` | Expected | Template folder - no action needed |

#### Structure: Missing `research.md` (2 initiatives)

| Initiative | Status |
|------------|--------|
| `condorcet-jury-eval/` | Missing - has only `_meta.json` |
| `internal-search/` | Missing |

#### Data Consistency: Prototype Versioning Non-Compliance (3 prototypes)

Per the updated prototype rules, all prototypes should use versioned subfolders (`v1/`, `v2/`, etc.) from the start.

| Prototype | Current Structure | Issue |
|-----------|-------------------|-------|
| `ComposioAgentFramework/` | Flat (no version folder) | Components at root, not in `v1/` |
| `UniversalSignalTables/` | Flat (no version folder) | Components at root, not in `v1/` |
| `SettingsRedesign/` | Mixed (`v2/` exists, root has files) | Root files should be in `v1/` |

**Compliant prototypes:**
- ✅ `BetaFeatures/` - Uses `v4/` subfolder
- ✅ `CrmReadinessDiagnostic/` - Uses `v4/` subfolder

#### Data Consistency: Roadmap Missing Initiative (1)

| Initiative | In Roadmap | Has `_meta.json` |
|------------|------------|------------------|
| `composio-agent-framework` | ❌ No | ✅ Yes |

The `composio-agent-framework` initiative has a `_meta.json` (phase: validate) but is not in `roadmap.json`.

#### Data Consistency: Signal Index vs Files

| Check | Status |
|-------|--------|
| Index count | 8 signals |
| Actual transcript files | 7 files |
| Actual document files | 2 files |
| **Mismatch** | ⚠️ Index claims 8, files show 9 |

**Note:** `2026-01-21-crispy-product-chat.md` exists in transcripts but is not in `_index.json`.

#### Data Consistency: Hypothesis Index Accuracy

| Check | Status |
|-------|--------|
| Index total | 11 hypotheses |
| Active folder | 1 file (solo-rep-self-coaching.md) |
| Committed folder | 9 files |
| Validated folder | 1 file (crm-readiness-diagnostic.md) |
| **Total files** | 11 ✅ Match |

**Issue:** `crm-readiness-diagnostic` is in `validated/` folder but index shows status `"active"`.

---

## Health Checks

| Check | Status | Details |
|-------|--------|---------|
| Stale initiatives (>14 days) | ✅ | None found |
| Stale hypotheses (>30 days) | ✅ | None found |
| P0/P1 without owners | ✅ | All have owners |
| Blockers without descriptions | ✅ | None found |

---

## Auto-Fixable

These can be fixed with `maintain fix`:

- [ ] Generate `_meta.json` for 7 initiatives (excluding `_template/`)
- [ ] Add `composio-agent-framework` to roadmap.json
- [ ] Add missing signal `2026-01-21-crispy-product-chat.md` to index
- [ ] Update hypothesis index: `crm-readiness-diagnostic` status → `"validated"`

---

## Requires Human Decision

These need manual review:

| Issue | Why Manual |
|-------|------------|
| `current/` folder | Unclear purpose - archive or keep? |
| Prototype restructuring | Moving files to `v1/` may break imports |
| `SettingsRedesign/` root files | Decide if they belong in `v1/` or are intentionally at root |

---

## Prototype Versioning Compliance

### New Standard (per recent `/admin` update)

All prototypes should follow this structure:

```
[Initiative]/
├── index.ts          # Re-exports latest version
├── v1/               # Initial prototype
│   ├── Component.tsx
│   ├── Component.stories.tsx
│   └── index.ts
├── v2/               # After iteration
└── v3/               # After user testing
```

### Current Compliance

| Prototype | Compliant | Notes |
|-----------|-----------|-------|
| BetaFeatures | ✅ | Has `v4/` |
| CrmReadinessDiagnostic | ✅ | Has `v4/` |
| ComposioAgentFramework | ❌ | Flat structure |
| UniversalSignalTables | ❌ | Flat structure |
| SettingsRedesign | ⚠️ | Mixed - has `v2/` but root files exist |

### Migration Recommendation

For non-compliant prototypes, consider:

1. **ComposioAgentFramework**: Move all files to `v1/` subfolder
2. **UniversalSignalTables**: Move all files to `v1/` subfolder  
3. **SettingsRedesign**: Move root files to `v1/`, keep `v2/` as-is

**Caution:** Check for import dependencies before restructuring.

---

## Historical Comparison

| Metric | This Audit |
|--------|------------|
| Total Issues | 15 |
| Initiatives with `_meta.json` | 13/21 (62%) |
| Initiatives in Roadmap | 12 |
| Prototype Versioning Compliance | 2/5 (40%) |
| Signal Index Accuracy | 8/9 (89%) |
| Hypothesis Index Accuracy | 10/11 (91%) |

---

## Recommended Actions

### Immediate (run `maintain fix`)

1. Generate missing `_meta.json` files
2. Sync signal index with actual files
3. Update hypothesis index status

### Soon (manual)

1. Decide on `current/` folder fate
2. Add `composio-agent-framework` to roadmap
3. Create `research.md` for `condorcet-jury-eval` and `internal-search`

### Later (when iterating)

1. Migrate `ComposioAgentFramework` to versioned structure during next `/iterate`
2. Migrate `UniversalSignalTables` to versioned structure during next `/iterate`
3. Clean up `SettingsRedesign` root files

---

*Run `maintain fix` to auto-fix safe issues, or `maintain sync` to regenerate derived files.*
