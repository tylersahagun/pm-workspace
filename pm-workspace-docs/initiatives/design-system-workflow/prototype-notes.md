# Prototype Notes: Design System Workflow v1

## Overview

Prototype for CI-based design quality enforcement that helps the design team (2:14 designer-to-engineer ratio) scale design review by automating token and component compliance checks.

## Chromatic Preview

🔗 **Shareable Preview:** https://672502f3cbc6d0a63fdd76aa-sjoyofngea.chromatic.com/?path=/docs/prototypes-designsystemworkflow-v1-dashboard--docs

📁 **Storybook Paths:**
- Dashboard Overview: `?path=/story/prototypes-designsystemworkflow-v1-dashboard--overview`
- PR Checks View: `?path=/story/prototypes-designsystemworkflow-v1-dashboard--pr-checks`
- Token Audit: `?path=/story/prototypes-designsystemworkflow-v1-dashboard--audit`
- Design Principles: `?path=/story/prototypes-designsystemworkflow-v1-dashboard--principles`

---

## Creative Options

### Option A: Maximum Control

**Philosophy:** Every violation requires explicit review.

| Aspect | Details |
|--------|---------|
| Enforcement | All violations are blocking (red) |
| Engineer Action | Must acknowledge each issue |
| Override | Requires comment + Skyler review |
| Best For | New teams, critical UI areas, training |

**Trade-offs:**
- ✅ Maximum consistency
- ✅ Forces learning
- ❌ Higher friction
- ❌ Slower velocity

**View in Chromatic:** `?path=/story/prototypes-designsystemworkflow-v1-dashboard--option-a-maximum-control`

---

### Option B: Balanced (Recommended)

**Philosophy:** Red blocks, yellow warns, trust the engineer.

| Aspect | Details |
|--------|---------|
| Enforcement | Red = blocking, Yellow = warning |
| Engineer Action | Must fix red; yellow is informational |
| Override | Yellow auto-allowed; red needs Skyler |
| Best For | Most teams, balanced quality/velocity |

**Trade-offs:**
- ✅ Catches critical issues
- ✅ Reduces friction for minor issues
- ✅ Scalable for large teams
- ❌ Some warnings may be ignored

**View in Chromatic:** `?path=/story/prototypes-designsystemworkflow-v1-dashboard--option-b-balanced`

**🎯 This is the recommended approach for AskElephant.**

---

### Option C: Maximum Efficiency

**Philosophy:** Trust the team, focus on egregious issues only.

| Aspect | Details |
|--------|---------|
| Enforcement | Only severe violations block |
| Engineer Action | Most checks are informational |
| Override | Automatic for most cases |
| Best For | Mature teams, high-velocity sprints |

**Trade-offs:**
- ✅ Fastest velocity
- ✅ Minimal engineer friction
- ❌ More inconsistencies may slip through
- ❌ Requires cultural enforcement

**View in Chromatic:** `?path=/story/prototypes-designsystemworkflow-v1-dashboard--option-c-maximum-efficiency`

---

## All States Implemented

| State | Description | Story |
|-------|-------------|-------|
| ✅ Loading | Initial dashboard load | `--loading` |
| ✅ Loading (Long) | Comprehensive audit running | `--loading-long` |
| ✅ Success | Dashboard fully loaded | `--overview` |
| ✅ Error | Failed to load (CI service unavailable) | `--error` |
| ✅ Empty | No design checks configured | `--empty` |

---

## Interactive Journeys

### Happy Path Journey
- `--flow-happy-path`
- PR passes design checks on first try
- Steps: PR opened → CI runs → Success

### Auto-fix Journey
- `--flow-autofix`
- Violations found, engineer applies one-click fixes
- Steps: PR opened → CI runs → Violations → Review → Auto-fix → Re-run → Success

### Error Recovery Journey
- `--flow-error-recovery`
- CI service temporarily fails, engineer retries
- Steps: PR opened → CI fails → Retry → Recovery

---

## Components Created

```
elephant-ai/web/src/components/prototypes/DesignSystemWorkflow/
├── index.ts                           # Re-exports v1
├── v1/
│   ├── DesignQualityDashboard.tsx     # Main dashboard component
│   ├── DesignQualityDashboard.stories.tsx  # All stories
│   ├── DesignQualityJourney.tsx       # Interactive flow component
│   ├── types.ts                       # TypeScript types
│   ├── index.ts                       # v1 exports
│   └── components/
│       ├── PRCheckResult.tsx          # PR check card with violations
│       ├── TokenAuditPanel.tsx        # Compliance visualization
│       ├── DesignPrinciplesGuide.tsx  # Human-First Design guide
│       ├── ViolationCard.tsx          # Individual violation display
│       ├── ComplianceChart.tsx        # Token usage charts
│       └── index.ts                   # Component exports
```

---

## Design Decisions

### 1. Red/Yellow/Green Classification
Chose traffic light colors for immediate recognition. Red for blocking issues (hardcoded colors, custom buttons), yellow for warnings (minor spacing), green for passed.

### 2. Auto-fix Feature
One-click fixes dramatically reduce friction. Engineers don't need to understand tokens—they just click "Auto-fix" and the system applies the correct tokenized value.

### 3. Human-First Design Principles Integration
Embedded Skyler's 3 pillars directly in the dashboard as an interactive guide. Engineers can reference principles without leaving the workflow.

### 4. Progressive Disclosure for Violations
Violations are collapsed by default, expandable to show code + suggestion. Prevents overwhelm while keeping details accessible.

---

## Open Questions for Stakeholder Review

1. **Enforcement Rollout Strategy**
   - Start with warnings only (Option C) and tighten to balanced (Option B)?
   - Or launch with balanced and adjust based on feedback?

2. **Override Workflow**
   - Should yellow warnings require any acknowledgment?
   - How should legitimate exceptions be documented?

3. **Legacy Remediation**
   - Who owns fixing existing violations? Engineers? Dedicated sprint?
   - Should we create a prioritized backlog of worst offenders?

4. **Skyler's Direct Involvement**
   - What level of review does Skyler want for yellow warnings?
   - Should certain components/pages be exempt from checks?

---

## Recommendation

**Start with Option B (Balanced)** because:

1. **Catches critical issues** without blocking velocity
2. **Scales well** for 2:14 designer-to-engineer ratio
3. **Builds trust** by being helpful, not pedantic
4. **Auto-fix reduces friction** to near-zero for common issues

The dashboard provides clear visibility for Skyler to monitor trends and intervene when needed, without being a bottleneck on every PR.

---

## Next Steps

1. Run `/validate design-system-workflow` to get synthetic user feedback
2. Share Chromatic preview with Skyler for design review
3. Schedule stakeholder walkthrough to choose enforcement level
4. Plan Phase 1 implementation based on feedback

---

*Last updated: January 23, 2026*
