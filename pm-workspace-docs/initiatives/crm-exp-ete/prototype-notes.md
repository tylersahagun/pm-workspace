# Prototype Notes: CRM Experience End-to-End

## Current State

### Existing Prototypes
- **HubSpot Agent Config v3** (`prototypes/src/components/HubSpotConfig/v3/`) - Configuration UI for agent setup
- **HubSpot Agent Workflow** (`prototypes/src/components/HubSpotConfig/v2-workflow/`) - Workflow node configuration

### What's Missing
Based on the user story brain dump (2026-01-16), we need prototypes for:
1. **Confidence-building onboarding wizard** - Education + test before activate
2. **Admin activity dashboard** - Visibility into all agent operations
3. **User agent communication center** - Where users see agent messages
4. **Inbox for HITL approvals** - Centralized approval workflow
5. **Anomaly alerts** - Proactive issue surfacing

---

## Prototype Goals

### Primary Goal
Build confidence through visibility. Users need to see and understand what the agent is doing before they trust it.

### Key Validation Questions
1. Does the onboarding flow build sufficient confidence?
2. Is the activity dashboard information dense enough without being overwhelming?
3. Do users understand the agent communication center?
4. Is the inbox workflow fast enough for daily use?
5. Are anomaly alerts helpful or alarming?

---

## Iterations

### Iteration 1: Onboarding Wizard
**Date:** 2026-01-16
**Status:** Planned

**Goals:**
- Validate confidence-building flow
- Test "education first" approach
- Validate "test on real data" step

**Key Screens:**
1. Education step - "How agents work"
2. Template selection - Pre-built workflows
3. Test preview - Show what would happen
4. Activation - Success celebration

**Components to Build:**
- `CRMOnboardingWizard.tsx`
- `EducationStep.tsx`
- `TemplateSelector.tsx`
- `TestPreview.tsx`
- `ActivationSuccess.tsx`

---

### Iteration 2: Activity Dashboard
**Date:** TBD
**Status:** Planned

**Goals:**
- Validate admin visibility needs
- Test filtering and drill-down
- Validate anomaly surfacing

**Key Screens:**
1. Dashboard overview - Health status, stats, timeline
2. Activity detail - Drill into specific runs
3. Anomaly alert - Proactive issue surfacing

**Components to Build:**
- `ActivityDashboard.tsx`
- `ActivityTimeline.tsx`
- `ActivityDetail.tsx`
- `AnomalyAlert.tsx`
- `HealthStatusBanner.tsx`

---

### Iteration 3: Agent Communication Center
**Date:** TBD
**Status:** Planned

**Goals:**
- Validate user-facing agent communication
- Test "what I did" vs "needs your input" separation
- Validate opt-out flows

**Key Screens:**
1. Communication feed - Agent messages
2. Action required - HITL requests
3. Data visibility - What agent is touching

**Components to Build:**
- `AgentCommunicationCenter.tsx`
- `AgentMessageFeed.tsx`
- `AgentMessageCard.tsx`
- `DataVisibilityPanel.tsx`

---

### Iteration 4: Inbox
**Date:** TBD
**Status:** Planned

**Goals:**
- Validate fast approval workflow
- Test batch operations
- Validate before/after comparison

**Key Screens:**
1. Inbox list - Pending items
2. Approval detail - Full context
3. Batch approve - Multi-select

**Components to Build:**
- `Inbox.tsx`
- `InboxList.tsx`
- `InboxItem.tsx`
- `ApprovalDetail.tsx`
- `BeforeAfterComparison.tsx`

---

## Design Decisions

### Decision: Start with onboarding wizard
**Rationale:** Confidence is the core insight from the user story. If we nail the onboarding experience, users will trust the rest of the system.

### Decision: Separate admin vs user views
**Rationale:** Admin needs full visibility across team. Users need personal view scoped to their data. Different information architecture.

### Decision: Agent communication as separate concept
**Rationale:** The user story explicitly calls out "a place where I can see the agent communicating to me" - this is distinct from inbox (approvals) and dashboard (admin visibility).

---

## Technical Notes

### Component Library
Using existing shadcn/ui components from `prototypes/src/components/ui/`:
- Button, Badge, Input, Label
- Select, Switch, Tabs
- Tooltip, Separator

### Styling
- Tailwind CSS
- Follow existing patterns from HubSpot Config v3
- Dark mode support

### State Management
- Local state for prototype
- Mock data for demonstrations
- Storybook controls for state variations

---

## Feedback Log

### Feedback from User Story (2026-01-16)

**On Confidence:**
> "I want to be able to actually test and see an output so that I have confidence. That's the key there is I need the confidence."

**Implication:** Test preview step is critical. Must show real output, not just configuration.

**On Proactive AI:**
> "AskElephant is working with me and being proactive to help me understand trends, things that might not be that seem like they're anomalies."

**Implication:** Anomaly detection should feel helpful, not alarming. Position as "working with you."

**On Agent Communication:**
> "I want a place where I can see the agent communicating to me. This is what I did."

**Implication:** Agent should have a "voice" - messages should feel like communication, not just logs.

---

## Next Steps

1. [x] Build onboarding wizard prototype
2. [x] Build activity dashboard prototype
3. [x] Build agent communication center prototype
4. [x] Build inbox prototype
5. [ ] Get feedback on education step content
6. [ ] Test preview step with real meeting data
7. [ ] Iterate based on jury feedback (Iteration 2 complete)

---

## Iteration 2: Addressing Jury Feedback (2026-01-16)

### Jury Evaluation Results (Pre-Iteration)
- **Pass Rate:** 54% (below 60% threshold)
- **Skeptic Pass Rate:** 10% (critical failure)
- **Top Friction:** Compliance/security (33), Testing (28), Understanding syncs (26)
- **Top Suggestion:** Activity log (21), ROI metrics (18), Pause/resume (17)

### Changes Made

#### New Components
1. **SecurityCompliancePanel** (`SecurityCompliancePanel.tsx`)
   - SOC 2 Type II, GDPR certification badges
   - Data handling policies with retention info
   - Rollback & recovery section
   - Full audit log with history
   - 3 variants: full page, compact badge, banner for onboarding

2. **ROIDashboard** (`ROIDashboard.tsx`)
   - Hero value statement (time saved + cost savings)
   - Time savings breakdown (per-meeting, by category)
   - Errors prevented visualization
   - Data quality scores with targets
   - Projected annual ROI calculation

#### Enhanced Components
3. **ActivityDashboard** - Added rollback capability
   - One-click rollback per activity log entry
   - Confirmation dialog with field count
   - Visual state change on rollback
   - "Rolled Back" badge indicator

4. **OnboardingWizard** - Added skeptic-focused messaging
   - Security trust banner on Connect step (SOC 2, encryption, rollback)
   - "Start Small, See Results Fast" banner on Scope step
   - Added "Rollback Anytime" to security indicators

### Stories Added
- `Security & Compliance (Full)` - Full page view
- `Security Badge (Compact)` - Embeddable badge
- `Security Banner (For Onboarding)` - Integration with wizard
- `ROI Dashboard` - 30 day default
- `ROI Dashboard (7 Days)` - Short term view
- `ROI Dashboard (90 Days)` - Long term view

### Addressing Specific Jury Concerns

| Jury Concern | Component/Feature | Status |
|--------------|-------------------|--------|
| Compliance/security (33 mentions) | SecurityCompliancePanel | ✅ Complete |
| Testing before go-live (28) | OnboardingWizard test step | ✅ Already exists |
| Understanding what gets synced (26) | ActivityDashboard visibility | ✅ Already exists |
| ROI/time-savings metrics (18) | ROIDashboard | ✅ Complete |
| Rollback mechanism | ActivityDashboard rollback | ✅ Complete |
| Start small messaging | OnboardingWizard banners | ✅ Complete |

### Expected Impact
- **Skeptic confidence:** Security panel addresses "show me the audit trail"
- **ROI proof:** Dashboard shows concrete value before commitment
- **Rollback safety net:** Reduces fear of irreversible mistakes
- **Progressive disclosure:** "Start small" messaging reduces overwhelm

---

*Last updated: 2026-01-16*
