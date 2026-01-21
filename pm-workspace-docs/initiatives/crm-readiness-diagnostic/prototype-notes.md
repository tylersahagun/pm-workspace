# Prototype Notes: CRM Readiness Diagnostic

> **Version:** v2
> **Date:** 2026-01-21
> **Status:** Ready for re-validation
> **Initiative:** `crm-readiness-diagnostic`

---

## Summary

The CRM Readiness Diagnostic helps users understand if their HubSpot CRM is properly configured for AskElephant. It surfaces issues proactively—before workflows fail—so customers can either self-remediate or get partner help.

**v2 implements all P0 and P1 improvements from jury validation.**

---

## v1 → v2 Changes (Jury Feedback)

### ✅ P0 Implemented

| Issue | Before | After |
|-------|--------|-------|
| **Accusatory messaging** (31% felt blamed) | "Action required", red colors | "Let's get you expert help", purple colors |
| **Vague remediation** (42% said too generic) | "Fix associations in HubSpot" | Video tutorials, step-by-step guides |
| **No ownership clarity** | Users didn't know who should fix | "Who can fix" badges (self/admin/partner) |

### ✅ P1 Implemented

| Issue | Implementation |
|-------|----------------|
| **Time estimates** (28% requested) | `~15 min` badge on each issue |
| **Affected features** (24% requested) | Chips showing "Deal insights", "Pipeline forecasting", etc. |
| **Dismiss functionality** (21% requested) | X button to dismiss intentional CRM choices |
| **Elevated partner CTA** (18% said buried) | Prominent purple CTA card for RED status |

---

## Components (v2)

### Location

```
elephant-ai/web/src/components/prototypes/CrmReadinessDiagnostic/
├── types.ts                    # v2: Added WhoCanFix, estimatedTime, affectedFeatures
├── CrmReadinessScore.tsx       # v2: Softer messaging, purple for RED
├── CrmIssueCard.tsx            # v2: Time, features, who can fix, dismiss, video
├── CrmReadinessPanel.tsx       # v2: Elevated partner CTA, dismiss state
├── CrmReadiness.stories.tsx    # v2: Feature showcase, all variants
└── index.ts                    # Barrel exports
```

### Key Design Decisions (v2)

1. **Purple instead of Red** - Less alarming, still attention-getting
2. **Sparkles icon instead of X/Alert** - Opportunity framing, not failure
3. **"Who can fix" prominent** - Sales reps need to know this isn't their job
4. **Video tutorials primary CTA** - For issues with video, it's the main action
5. **Normalization messaging** - "90% of HubSpots have gaps" reduces blame

---

## Storybook Stories

| Story | Purpose |
|-------|---------|
| `Score: All Variants` | Compare v2 messaging for GREEN/YELLOW/RED |
| `Issue Card: All v2 Features` | Shows time, features, who can fix |
| `Issue Card: Who Can Fix Variants` | Self vs Admin vs Partner |
| `Issue Card: Dismiss Functionality` | Interactive dismiss demo |
| `Panel: Expert Help (Red)` | Elevated partner CTA |
| `v2 Feature Showcase` | Full comparison of v1 → v2 changes |
| `In Settings Page Context` | Integration placement demo |
| `Interactive Demo (v2)` | State transitions with fixes |

---

## Preview

```bash
# From elephant-ai directory
npm run storybook -w web
# Navigate to: Prototypes/CrmReadinessDiagnostic
```

---

## Jury Validation Targets (v2)

| Segment | v1 Approval | v2 Target | Key Change |
|---------|-------------|-----------|------------|
| Overall | 74% | 85%+ | All P0/P1 fixes |
| **Skeptics** | 54% | 65%+ | Softer messaging |
| **Sales Reps** | 65% | 75%+ | Who can fix, video tutorials |
| Operations | 82% | 85%+ | Minor improvements |
| Partners | 93% | 90%+ | Maintain |

---

## Next Steps

1. [ ] **Re-run jury validation** on v2 prototype
2. [ ] **Schedule real user validation** with 3-5 RevOps users
3. [ ] Create engineering spec for API/backend requirements
4. [ ] Review with design team for polish pass

---

## Technical Notes

### Future Hook API (Not Implemented)

```typescript
// When building real implementation:
const { data, isLoading, error, refetch } = useCrmReadiness({
  workspaceId,
  integrationId,
});
```

### Required HubSpot API Scopes (TBD)

- `crm.objects.deals.read`
- `crm.objects.contacts.read`
- `crm.objects.companies.read`
- `crm.schemas.read` (for property definitions)

---

## Files

- **Components:** `elephant-ai/web/src/components/prototypes/CrmReadinessDiagnostic/`
- **PRD:** `pm-workspace-docs/initiatives/crm-readiness-diagnostic/prd.md`
- **Jury Report:** `pm-workspace-docs/initiatives/crm-readiness-diagnostic/jury-evaluations/jury-report.md`
- **Placement Research:** `pm-workspace-docs/initiatives/crm-readiness-diagnostic/placement-research.md`
