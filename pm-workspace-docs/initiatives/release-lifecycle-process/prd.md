# Release Lifecycle Process PRD

## Overview

- **Owner:** Tyler Sahagun (Process), Product Team (Adoption)
- **Target Release:** Q1 2026 (Process by Jan 31, Beta UI by Mar 1)
- **Status:** In Progress
- **Strategic Pillar:** Customer Trust + Quality Over Velocity
- **2026 Initiative:** Foundation (enables all 2026 initiatives to ship cleanly)

This initiative establishes AskElephant's standardized release lifecycle: **Lab → Private Beta → Public Beta → GA → Launch**. It defines stage criteria, TTLs, communication contracts, and ships a self-serve beta toggle UI for users.

---

## Outcomes Framework

### Customer Outcome

**Target State:** Users can discover and try new features on their terms through a clear beta program, with transparent expectations about feature maturity.

**Current State:** 
- Users don't know what's in beta vs. stable
- No self-serve way to try new features early
- Feature availability feels random/inconsistent

**Gap:** No user-facing beta program or clear maturity indicators in the product.

### Business Outcome

**Target State:** Faster feature delivery to customers with clear process, improved GTM coordination, and reduced internal confusion about feature readiness.

**How this drives:**
- [x] **Land** - Better demos (Sales shows what customers will see)
- [x] **Expand** - Faster feature delivery = more value = expansion
- [x] **Retain** - Consistent experience = fewer support failures = retention

### Success Metrics

| Metric | Type | Current | Target | Owner |
|--------|------|---------|--------|-------|
| Features with defined stage | Leading | ~30% | 100% | Tyler |
| Features exceeding TTL | Leading | Unknown | <10% | Tyler |
| Revenue team release awareness | Leading | Low | >90% | Tyler |
| Time from Lab → GA (median) | Lagging | 18+ months | <6 months | Product |
| Beta feature opt-in rate | Lagging | N/A | >5% | Product |

### Success Criteria

| Criteria | Target | Timeline | How We'll Measure |
|----------|--------|----------|-------------------|
| Stage definitions approved | 100% leadership sign-off | Jan 20, 2026 | Meeting outcome |
| All flags have stage metadata | 100% tagged | Jan 31, 2026 | PostHog audit |
| Weekly release notes running | 4 consecutive weeks | Feb 15, 2026 | Meeting attendance |
| Beta toggle UI shipped | Live in prod | Mar 1, 2026 | Deployment |
| Revenue team confidence | >90% feel informed | Mar 15, 2026 | Survey |

---

## Outcome Chain

```
Standardized release lifecycle enables clear stage definitions
  → so that features progress through Lab → Beta → GA with defined TTLs
    → so that users can self-serve into beta features with clear expectations
      → so that Revenue teams always know feature availability
        → so that customers receive consistent experience and support
          → so that NRR improves through reduced churn and faster expansion
```

---

## Problem Statement

### The Problem

AskElephant has no standardized process for how features move from idea to customer hands. This causes:

1. **Ambiguous feature states** - Is this beta? GA? Nobody knows
2. **Revenue team blindsides** - Learn about changes from customers
3. **Stale betas** - Features stuck in "beta" for 18+ months
4. **No user agency** - Users can't try new features on their terms
5. **Release/Launch confusion** - Teams conflate technical release with marketing launch

### Evidence

**Leadership quotes (Jan 13, 2026):**

> "I forgot that I get access to everything. And so I was like, oh, this is - I actually love this tool, but no one else has access to it." — Woody

> "Customers will churn over things or be dissatisfied, and it's simply because we couldn't support them appropriately." — Ben Harrison

> "Release and launch don't have to happen like, bang bang." — Tony

**Industry research:**
- Short-lived flags are essential (Unleash, LaunchDarkly best practices)
- Progressive rollouts minimize risk
- Clear TTLs prevent "beta limbo"

---

## Goals & Non-Goals

### Goals (Measurable)

1. **Define and adopt release lifecycle** - Lab/Private Beta/Public Beta/GA with TTLs
2. **100% stage coverage** - Every feature flag has a defined stage
3. **Ship beta toggle UI** - Users can self-serve into beta features
4. **Establish communication contract** - Weekly release notes, Slack announcements
5. **<10% TTL violations** - Features progress or get deprecated, not stuck

### Non-Goals

- **Not changing innovation culture** - Engineers can still experiment freely in Lab
- **Not requiring marketing approval for releases** - Release ≠ Launch
- **Not building full "Labs" product** - Settings toggle is sufficient for Phase 1
- **Not enforcing hard TTL blocks** - Soft reminders, not blockers

---

## User Personas

### Primary: Revenue Team (Sales, CS)

- **Job-to-be-done:** Demo and support customers with accurate feature knowledge
- **Current pain:** Don't know what's available to whom; blindsided by changes
- **Success looks like:** Always know feature status; confident in demos/support
- **Trust factors:** Consistent weekly updates; single source of truth

### Secondary: AskElephant Users (Admins, Power Users)

- **Job-to-be-done:** Get maximum value from AskElephant
- **Current pain:** Miss out on features; don't know what's available to try
- **Success looks like:** Can discover and enable beta features easily
- **Trust factors:** Clear "beta" expectations; easy opt-out if issues

### Tertiary: Product/Engineering

- **Job-to-be-done:** Ship features to customers efficiently
- **Current pain:** Unclear when something is "done"; features languish
- **Success looks like:** Clear path from code to customer with defined stages
- **Trust factors:** Process enables velocity, doesn't slow it down

---

## User Stories

### Epic 1: Release Lifecycle Definition

**As a** Product Manager,  
**I want to** have clear stage definitions with entry/exit criteria,  
**So that** I can communicate feature status consistently.

#### Acceptance Criteria
- [ ] Lab, Private Beta, Public Beta, GA stages defined
- [ ] TTLs defined for each stage (Lab: 90d, Private Beta: 60d, Public Beta: 90d)
- [ ] Entry/exit criteria documented for each stage
- [ ] Process approved by Woody, Skyler, Ben

### Epic 2: Communication Contract

**As a** CSM,  
**I want to** receive consistent updates about feature changes,  
**So that** I can support customers accurately.

#### Acceptance Criteria
- [ ] Weekly release notes meeting established
- [ ] #product-updates Slack channel active
- [ ] Notion doc with current feature status maintained
- [ ] Stage transitions announced same-day in Slack

### Epic 3: Beta Toggle UI

**As a** Workspace Admin,  
**I want to** enable beta features for my team,  
**So that** we can try new capabilities early.

#### Acceptance Criteria
- [ ] Settings → Beta Features section exists
- [ ] Each beta feature shows name, description, stage badge
- [ ] Toggle enables/disables feature immediately
- [ ] User sees beta badge in UI when feature is enabled
- [ ] Analytics track opt-in/opt-out events

### Epic 4: Stage Metadata

**As a** Product Manager,  
**I want to** see all features by stage in a dashboard,  
**So that** I can track lifecycle progress and TTL compliance.

#### Acceptance Criteria
- [ ] All PostHog flags tagged with stage metadata
- [ ] Dashboard shows features by stage
- [ ] TTL countdown visible for each feature
- [ ] Weekly TTL report generated

---

## Scope

### In Scope (Phase 1)

**Process:**
- Stage definitions (Lab, Private Beta, Public Beta, GA)
- TTL definitions (90/60/90 days)
- Entry/exit criteria for each stage
- Communication contract documentation
- Weekly release notes cadence

**Product:**
- Beta toggle UI in Settings
- Stage badge component (Alpha, Beta)
- PostHog stage metadata tagging
- Feature status dashboard (internal)

### Out of Scope (Future)

- Full "Labs" product experience (separate initiative)
- Automated TTL enforcement/alerts
- In-app changelog/release notes for customers
- Customer-facing beta program marketing
- Workspace-level beta blocking (admin prevents users from enabling)

### Future Considerations

- Labs product could be P2 initiative
- Consider automating Slack announcements from PostHog
- Customer-facing beta program with rewards/recognition

---

## Design

### Release Lifecycle Stages

```
┌─────────────────────────────────────────────────────────────────────┐
│                    RELEASE LIFECYCLE                                 │
├─────────┬──────────────┬──────────────┬─────────┬──────────────────┤
│   Lab   │ Private Beta │ Public Beta  │   GA    │     Launch       │
│  🧪     │     🔷       │     🟡       │   ✅    │      🚀          │
├─────────┼──────────────┼──────────────┼─────────┼──────────────────┤
│ 90 days │   60 days    │   90 days    │ Perm.   │ Marketing event  │
│ Internal│ Invited only │ Self-serve   │ Default │ Decoupled timing │
│ No flag │ Flag + cohort│ UI toggle    │ No flag │ P0-P3 tiers      │
└─────────┴──────────────┴──────────────┴─────────┴──────────────────┘
```

### Stage Transition Flow

```
[Engineer builds] → Lab (90d max)
                      ↓ Product approves
                  Private Beta (60d max)
                      ↓ Feedback incorporated
                  Public Beta (90d max)
                      ↓ Success criteria met
                    GA ←───────────────────┐
                      ↓                    │
                  Launch (optional)        │
                      ↓                    │
              [Marketing campaign]         │
                                           │
           OR at any stage: Deprecate ─────┘
```

### Beta Toggle UI Flow

1. **Entry:** User navigates to Settings → Beta Features
2. **View:** List of available beta features with descriptions
3. **Action:** Toggle feature ON
4. **Feedback:** Toast: "Enabled! Look for the Beta badge in [location]"
5. **Discovery:** Feature appears in app with 🟡 Beta badge

### Key UI Components

| Component | Location | Purpose |
|-----------|----------|---------|
| Beta Features Settings | Settings page | Toggle beta features |
| Stage Badge | Feature areas | Indicate maturity (Alpha/Beta) |
| Beta Toast | Global | Confirm toggle action |
| Release Status Dashboard | Internal tool | Track all features by stage |

---

## Technical Considerations

### PostHog Integration

- Add `stage` metadata to all feature flags
- Add `ttl_start` and `ttl_days` metadata
- Create "beta_enrolled" user group for public beta cohort
- Track `beta_feature_enabled` and `beta_feature_disabled` events

### API Requirements

- `GET /api/beta-features` - List available beta features for user
- `POST /api/beta-features/{key}/toggle` - Enable/disable feature
- `GET /api/beta-features/status` - Internal dashboard data

### Frontend Components

- `<BetaFeaturesSettings />` - Settings panel
- `<StageBadge stage="beta" />` - Reusable badge
- `<BetaFeatureCard />` - Individual feature toggle

---

## Communication Contract

### Stage Transition Notifications

| Transition | Notify | Channel | Timing |
|------------|--------|---------|--------|
| → Lab | Product | Slack #engineering | Same day |
| → Private Beta | Product, CS Lead | Slack #product-updates | Same day |
| → Public Beta | Revenue team, Marketing | Slack + Meeting | 1 week before |
| → GA | All teams | Slack + Release notes | Same day |
| → Launch | External | Marketing campaign | Coordinated |

### Weekly Release Notes

**Owner:** Tyler  
**Day:** Monday  
**Audience:** Revenue team meeting  
**Backup:** Notion doc updated async

---

## Dependencies

| Dependency | Owner | Status | Risk |
|------------|-------|--------|------|
| PostHog metadata capability | Engineering | ✅ Available | Low |
| Settings page architecture | Engineering | ✅ Exists | Low |
| Design for beta toggle UI | Design | 🔴 Not started | Medium |
| Leadership approval on stages | Woody/Skyler | 🟡 Pending | Low |
| Marketing alignment on launch tiers | Tony/Kenzie | 🟡 Pending | Low |

---

## Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Process not adopted | High | Medium | Start with core team; make it easy |
| TTLs create pressure to ship prematurely | Medium | Medium | TTL triggers review, not auto-action |
| Beta UI overwhelms users | Low | Low | Limit concurrent public betas to 5 |
| Stage definitions too rigid | Medium | Low | Build in "extend with justification" option |

---

## Timeline

### Milestones

| Milestone | Date | Status |
|-----------|------|--------|
| PRD Complete | Jan 13, 2026 | ✅ |
| Stage definitions approved | Jan 20, 2026 | ⬜ |
| Communication contract live | Jan 27, 2026 | ⬜ |
| All flags tagged with stage | Jan 31, 2026 | ⬜ |
| Beta toggle UI design | Feb 7, 2026 | ⬜ |
| Beta toggle UI development | Feb 14-28, 2026 | ⬜ |
| Beta toggle UI shipped | Mar 1, 2026 | ⬜ |
| Revenue team confidence survey | Mar 15, 2026 | ⬜ |

---

## Open Questions

1. [ ] **TTL enforcement:** Soft reminder or hard block when TTL exceeded?
2. [ ] **Concurrent beta limit:** Cap at 5 public betas? Or no limit?
3. [ ] **Workspace override:** Can admins disable beta access for their workspace?
4. [ ] **Feedback mechanism:** In-app feedback for beta features?
5. [ ] **Lab visibility:** Should Lab features be visible to power users?

---

## Strategic Alignment Checklist

- [x] Outcomes Framework complete (all 4 components)
- [x] Outcome chain complete
- [x] Persona validated (Revenue team confirmed need)
- [x] Trust implications assessed (improves trust through consistency)
- [x] Not in anti-vision territory (infrastructure, not generic AI)
- [x] Supports 2026 initiative stack (enables all initiatives to ship cleanly)

---

*Last updated: January 13, 2026*  
*Owner: Tyler Sahagun*
