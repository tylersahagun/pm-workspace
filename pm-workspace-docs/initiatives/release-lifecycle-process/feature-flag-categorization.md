# Feature Flag Categorization Worksheet

Release Lifecycle v4 • January 2026

Use this worksheet to audit every existing feature flag and decide:
- Which release stage it should be in right now
- Whether the flag stays, moves to settings, or is removed
- What needs to change (docs, badges, access rules, comms)

---

## Release Stages (Customer Availability)

| Stage | TTL | Access | Flag State | Badge |
|---|---|---|---|---|
| Labs | 4-6 weeks max | Manual opt-in | Behind feature flag | Labs |
| Alpha | 2-4 weeks | Self-service toggle | No flag, settings toggle | Alpha |
| Beta (Auto) | 2-3 weeks | Auto-enabled for all | No flag, GA code path | Beta |
| New | 30 days | Enabled for all | No flag | New (auto-expire) |
| Core | Permanent | Enabled for all | No flag | None |

---

## Flag Management Rules

### Labs
- Keep behind feature flag (manual opt-in only)
- No auto-enrollment
- Requires "How it works" dialog before enable
- Intended audience: internal + power users by request

### Alpha
- Remove feature flag
- Move to Settings → Alpha/Beta toggle
- Self-service opt-in
- Keep "How it works" dialog and draft KB article

### Beta (Auto)
- Remove feature flag
- Default ON for all users with Beta badge
- Allow opt-out toggle
- GA code path with badge

### New
- No flags or toggles
- "New" badge auto-expires after 30 days
- Feature is stable and fully supported

### Core
- No flags, no badges, no toggles
- Standard product experience

---

## Documentation & Comms Checklist (by Stage)

| Requirement | Labs | Alpha | Beta (Auto) | New | Core |
|---|---|---|---|---|---|
| Internal Notion doc | ✓ | ✓ | ✓ | ✓ | ✓ |
| "How it works" dialog | ✓ | ✓ | — | — | — |
| Knowledge base (draft) | — | ✓ | — | — | — |
| Knowledge base (published) | — | — | ✓ | ✓ | ✓ |
| Release notes | — | — | ✓ | ✓ | ✓ |
| In-app "What's New" | — | — | ✓ | ✓ | — |
| Internal training complete | — | — | ✓ | ✓ | — |

---

## Feature Flag Audit Table

Fill one row per existing feature flag.

| Feature / Flag | Current code state | Current access | Current flag usage | Intended stage | Required changes | Owner | TTL start | Notes |
|---|---|---|---|---|---|---|---|---|
|  | Labs / Alpha / Beta / New / Core | Manual / Toggle / Auto / All | Flag? Settings? Badge? | Labs / Alpha / Beta / New / Core | Remove flag? Add toggle? Add badge? Update docs? |  |  |  |

---

## Migration Decision Prompts

Answer these for each flag before assigning a stage:
- Is the feature stable enough for all users?
- Do we need a toggle for opt-in or opt-out?
- Does the UI already include a badge? If not, add one.
- Are there known risks that require "Labs" constraints?
- What documentation is missing for this stage?
- Should the flag be removed entirely after rollout?

---

## Stage Movement Plan

For any flag changing stages, capture:
- **From → To:** (e.g., Labs → Alpha)
- **Access change:** Manual → Settings toggle → Auto
- **Code change:** Remove flag / move to toggle / add badge
- **Docs update:** Notion / KB / Release notes / Training
- **Comms:** Product updates + weekly revenue sync
