# Feature Availability & Release Process PRD

## Overview

- **Owner:** Tyler Sahagun
- **Target Release:** Q1 2026 (Phase 1: Process + Cleanup by Feb 1)
- **Status:** In Progress
- **Strategic Pillar:** Customer Trust + Quality Over Velocity
- **2026 Initiative:** Foundation/Infrastructure (enables all 2026 initiatives)

This initiative establishes a standardized release lifecycle (Lab → Alpha → Beta → GA → Launch) to replace ad-hoc feature flagging, clean up 116 existing feature flags creating 23 fragmented customer experiences, and create clear communication contracts between Product, Engineering, and Revenue teams.

---

## Outcomes Framework

### Customer Outcome

**Target State:** Revenue teams (Sales, CS) can confidently demo and support any feature because they see the same product experience as customers, with clear visibility into what's in beta vs. GA.

**Current State:** 
- 116 feature flags create 23 distinct customer experiences
- Internal team sees features customers don't have
- CS learns about features from customers, not product
- Sales demos features that aren't available to the prospect

**Gap:** No standardized release process, no communication contract, no visibility into feature availability by customer segment.

### Business Outcome

**Target State:** Faster time-to-customer for completed features, reduced churn from support failures, improved GTM effectiveness for new releases.

**How this drives:**
- [x] **Retain** - "Customers will churn... because we couldn't support them appropriately" — Ben Harrison
- [x] **Expand** - Hidden features = missed marketing opportunities for upsell
- [x] **Land** - Better release process improves demo consistency and GTM

### Success Metrics

| Metric | Type | Current | Target | Owner |
|--------|------|---------|--------|-------|
| Active feature flags | Leading | 116 | <50 | Tyler/Engineering |
| Time from complete → GA | Leading | 18+ months (some) | <90 days | Tyler |
| CS "feature unavailable" tickets | Leading | Unknown | -50% | Ben/Support |
| Revenue team release awareness | Leading | Low (survey) | >90% | Tyler |
| Feature parity complaints | Lagging | Frequent | Rare | CS |

### Success Criteria

| Criteria | Target | Timeline | How We'll Measure |
|----------|--------|----------|-------------------|
| Stale flags cleaned up | 19 flags removed | Feb 1, 2026 | PostHog flag count |
| Process documented & adopted | 100% team awareness | Jan 31, 2026 | Team survey |
| Weekly release notes running | 4 consecutive weeks | Feb 15, 2026 | Meeting attendance |
| Beta toggle UI shipped | Functional in prod | Mar 1, 2026 | Feature deployed |

---

## Outcome Chain

```
Standardized release lifecycle enables clear stage gates
  → so that features progress from Lab → GA with defined TTLs
    → so that Revenue teams always know feature availability
      → so that customers receive consistent support and demos
        → so that churn from support failures decreases
          → so that NRR improves and expansion accelerates
```

---

## Problem Statement

### The Problem

AskElephant has 116 feature flags creating 23 distinct customer experiences. This "feature flag hell" causes:

1. **Support Failures:** CS can't help customers with features they don't have
2. **Demo Inconsistency:** Sales shows features prospects won't see
3. **Innovation Trapped:** Cool features never reach customers (e.g., auto-tagging at 8%)
4. **Stale Betas:** Features stuck in beta for 18+ months with no path forward
5. **Communication Breakdown:** Revenue teams learn about changes from customers

### Evidence

**User Quotes (Leadership Meeting Jan 13, 2026):**

> "My experience in AskElephant is not the same experience as our users because we are in feature flag hell." — Woody Klemetson, CEO

> "Ben Kanar doesn't actually know what a feature flag is... they're like, I'm seeing something. They're not - there's a bug." — Woody

> "Customers will churn over things or be dissatisfied, and it's simply because we couldn't support them appropriately." — Ben Harrison, Revenue

> "I forgot that I get access to everything. And so I was like, oh, this is - I actually love this tool, but no one else has access to it." — Woody

**Data Evidence:**
- 116 active feature flags in PostHog
- 23 distinct customer experience cohorts
- 32 features in "limited beta" (fragmented availability)
- 20 flags effectively disabled (dead code)
- 8 flags at 100% GA that still exist (cleanup needed)
- Workflows v2 in beta for 18+ months

---

## Goals & Non-Goals

### Goals (Measurable)

1. **Reduce flag count by 50%** - From 116 to <60 flags by Q2 2026
2. **Establish release lifecycle** - Lab → Alpha → Beta → GA with defined TTLs
3. **Zero revenue team blindsides** - Weekly release notes + Slack announcements
4. **Ship beta toggle UI** - Users self-serve opt-in to beta features
5. **Clean up stale flags** - Remove 19 identified dead/stale flags by Feb 1

### Non-Goals

- **Not building "Lab" feature in Phase 1** - Lab concept is exciting but scope creep; separate initiative
- **Not changing innovation culture** - Engineers should still innovate freely; we're adding funnel, not gates
- **Not requiring marketing approval for releases** - Release ≠ Launch; these are decoupled
- **Not perfect from day one** - Process will iterate; start with 80% solution

---

## User Personas

### Primary: Revenue Team (Sales Rep, CSM)

- **Job-to-be-done:** Demo and support customers with confidence
- **Current pain:** See features customers don't have; learn about changes from customers
- **Success looks like:** Know exactly what features any customer can access; never blindsided
- **Trust factors:** Consistent weekly updates; ability to verify feature availability

### Secondary: Product/Engineering

- **Job-to-be-done:** Ship features to customers efficiently
- **Current pain:** Features stuck in flag limbo; unclear when something is "done"
- **Success looks like:** Clear path from code complete → customer hands; defined TTLs
- **Trust factors:** Process enables velocity, doesn't slow it down

### Tertiary: Customers

- **Job-to-be-done:** Get value from AskElephant consistently
- **Current pain:** Features appear/disappear; inconsistent experience
- **Success looks like:** Clear understanding of what's beta vs. stable; can opt into experiments
- **Trust factors:** Beta badge sets expectations; feedback mechanism exists

---

## User Stories

### Epic 1: Release Lifecycle Definition

**As a** Product Manager,
**I want to** have clear stage definitions (Lab/Alpha/Beta/GA),
**So that** I can communicate feature status consistently.

#### Acceptance Criteria
- [ ] Stage definitions documented with TTLs
- [ ] Entry/exit criteria for each stage defined
- [ ] Process approved by leadership

### Epic 2: Flag Cleanup

**As a** Engineering Lead,
**I want to** remove stale and dead flags,
**So that** codebase complexity decreases and flag evaluations are faster.

#### Acceptance Criteria
- [ ] 8 GA flags removed (feature kept, wrapper removed)
- [ ] 11 dead code flags removed entirely
- [ ] No customer-facing regression

### Epic 3: Communication Contract

**As a** CSM,
**I want to** know when features change availability,
**So that** I can support customers accurately.

#### Acceptance Criteria
- [ ] Weekly release notes meeting scheduled
- [ ] Slack channel for release announcements
- [ ] Notion doc with current feature status

### Epic 4: Beta Toggle UI

**As a** Customer Admin,
**I want to** opt into beta features myself,
**So that** I can explore new capabilities without CS involvement.

#### Acceptance Criteria
- [ ] Settings page with beta toggle section
- [ ] Clear descriptions for each beta feature
- [ ] Beta badge visible in UI when feature is active
- [ ] Telemetry on opt-in/opt-out actions

---

## Scope

### In Scope (Phase 1 - Q1 2026)

- Release lifecycle process documentation
- Stage definitions with TTLs (Lab: 90 days, Alpha: 60 days, Beta: 90 days)
- Flag cleanup (19 stale/dead flags)
- Communication contract (weekly notes, Slack channel)
- Beta toggle UI in settings
- PostHog dashboard for release status

### Out of Scope (Future Phases)

- "Lab" feature for experimental playground (separate initiative)
- Automated TTL enforcement/alerts
- Customer-facing changelog/release notes
- In-app notifications for beta availability
- A/B testing framework improvements

### Future Considerations

- Lab feature could be P2 initiative if this succeeds
- Consider automating Slack announcements from PostHog
- Customer-facing beta program with feedback loop

---

## Design

### User Flow: Beta Toggle

1. **Entry:** User navigates to Settings → Beta Features
2. **View:** See list of available beta features with descriptions
3. **Action:** Toggle individual features on/off
4. **Feedback:** Toast confirmation + feature appears in nav/UI with badge
5. **Exit:** Feature available immediately (no page refresh required)

### User Flow: Release Communication

1. **Trigger:** Feature moves to new stage (Alpha → Beta, Beta → GA)
2. **Immediate:** Tyler posts in #product-updates Slack channel
3. **Weekly:** Tyler presents release notes in Revenue team meeting
4. **Async:** Notion doc updated with current feature status

### Key UI States

| State | Description | Badge |
|-------|-------------|-------|
| Lab | Experimental, may disappear | 🧪 "Experimental" |
| Alpha | Private beta, opt-in required | 🔷 "Alpha" |
| Beta | Public beta, GA with badge | 🟡 "Beta" |
| GA | Generally available | None |

### Wireframes/Mockups

*To be created by Design - suggested components:*
- Settings → Beta Features section
- Beta badge component (reusable)
- Release status dashboard (internal)

---

## Technical Considerations

### PostHog Integration

- Leverage existing PostHog feature flag infrastructure
- Add stage metadata to flags (lab/alpha/beta/ga)
- Create dashboard view for flag lifecycle status
- Track opt-in/opt-out telemetry for beta toggles

### Flag Architecture Changes

- Move from 23 ad-hoc groups to 4 standard stages
- Implement "beta group" as single cohort users can join
- Remove individual flag targeting where possible
- Keep permanent flags (maintenance, kill switches) separate

### Performance

- Reducing from 116 to <60 flags improves evaluation time
- Single "beta enrolled" check vs. multiple flag checks
- Consider lazy-loading flag evaluations

---

## Dependencies

| Dependency | Owner | Status | Risk |
|------------|-------|--------|------|
| PostHog access | Caden | ✅ Available | Low |
| Engineering capacity for cleanup | Skyler | 🟡 Needs allocation | Medium |
| Design for beta toggle UI | Design | 🔴 Not started | Medium |
| Revenue team buy-in | Ben | ✅ Confirmed | Low |

---

## Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Flag removal causes regression | High | Medium | Test each removal; feature flag the removal |
| Process adoption fails | High | Low | Start with core team; iterate based on feedback |
| TTLs create pressure to ship | Medium | Medium | TTL triggers review, not automatic action |
| Lab becomes new flag hell | Medium | Medium | Defer Lab feature; keep Phase 1 focused |

---

## Timeline

### Milestones

| Milestone | Date | Status |
|-----------|------|--------|
| PRD Complete | Jan 13, 2026 | ✅ |
| Process documentation | Jan 20, 2026 | ⬜ |
| Stale flag cleanup (19 flags) | Feb 1, 2026 | ⬜ |
| Communication contract live | Jan 27, 2026 | ⬜ |
| Beta toggle UI design | Feb 7, 2026 | ⬜ |
| Beta toggle UI shipped | Mar 1, 2026 | ⬜ |
| Phase 1 complete | Mar 15, 2026 | ⬜ |

---

## Open Questions

1. [ ] **TTL specifics:** What are the exact TTLs for each stage? (Proposed: Lab 90d, Alpha 60d, Beta 90d)
2. [ ] **TTL enforcement:** Who reviews when TTL expires? Product? What's the escalation?
3. [ ] **Permanent flags:** How do we document/categorize permanent flags (maintenance, kill switches)?
4. [ ] **Lab scope:** Is Lab feature in Phase 2 or separate initiative entirely?
5. [ ] **Customer communication:** Do we notify customers when they gain access to beta features?

---

## Strategic Alignment Checklist

- [x] Outcomes Framework complete (all 4 components)
- [x] Outcome chain complete
- [x] Persona validated (Revenue team confirmed need in meeting)
- [x] Trust implications assessed (improves trust through consistency)
- [x] Not in anti-vision territory (this is infrastructure, not generic AI)
- [x] Supports 2026 initiative stack (enables all initiatives to ship cleanly)

---

*Last updated: January 13, 2026*
*Owner: Tyler Sahagun*
