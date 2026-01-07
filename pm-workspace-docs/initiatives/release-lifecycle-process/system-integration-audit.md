# Release Lifecycle System Integration Audit

## Overview

This document audits how the new release lifecycle (Labs → Alpha → Beta → New → GA) integrates with the existing Product System in Notion and Linear.

**Audit Date:** January 14, 2026  
**Owner:** Tyler Sahagun

Companion worksheet: `pm-workspace-docs/initiatives/release-lifecycle-process/feature-flag-categorization.md`

---

## Current State Analysis

### 1. Notion Project Phases (Development Lifecycle)

The existing **Project Phase** property tracks *development work*:

```
Discovery → Definition → Build → Test → Done
```

This is **development-focused** — it answers "what stage of building is this?"

### 2. Product Areas Status

The **Product Areas** database has a Status field:
- Live
- Beta
- Coming Soon
- Deprecated

This is closer to release stage but is applied to the *product area*, not individual features.

### 3. New Release Lifecycle (Customer Availability)

The new release lifecycle tracks *customer availability*:

```
Labs → Alpha → Beta (Auto) → New → GA
```

This is **release-focused** — it answers "who can use this and how?"

---

## Gap: Two Different Dimensions

**Project Phase** and **Release Stage** are orthogonal:

| Project Phase | Release Stage | Example |
|---------------|---------------|---------|
| Build | Labs | Privacy Agent being developed, internal testing |
| Test | Alpha | Privacy Agent feature-complete, opt-in for users |
| Done | Beta (Auto) | Privacy Agent shipped, enabled with badge |
| Done | New | Privacy Agent GA with "New" badge |
| Done | GA | Privacy Agent is core feature |

A project can be "Done" from a development perspective but still in "Beta" from a release perspective.

---

## Recommendations

### 1. Add "Release Stage" Property to Projects Database

**Action:** Create new Select property in Projects database

| Property | Type | Values |
|----------|------|--------|
| Release Stage | Select | Labs, Alpha, Beta, New, GA, Not Applicable |

**Default:** "Not Applicable" (for internal projects, tech debt, etc.)

**Automation:** When Project Phase = "Done", prompt to set Release Stage

### 2. Update Product System Guide

Add section explaining the distinction:

```markdown
## Development vs Release Lifecycle

### Project Phase (Development)
Tracks engineering progress: Discovery → Definition → Build → Test → Done

### Release Stage (Customer Availability)  
Tracks who can use it: Labs → Alpha → Beta → New → GA

A project is "Done" when engineering work completes.
A feature reaches "GA" when it's available to all users without badges.
```

### 3. Add Release Stage to GTM Plans

**Current fields:**
- Launch Tier (P0-P3)
- Status

**Add:**
- Current Release Stage (relation to what's live now)
- Target Release Stage (what stage will this launch achieve)

### 4. Update Product Areas Database

**Current Status options:** Live, Beta, Coming Soon, Deprecated

**Recommended Status options:**
- Labs (internal only)
- Alpha (opt-in)
- Beta (auto-enabled with badge)
- Live (GA, no badge)
- Deprecated

This aligns Product Areas with the release lifecycle.

---

## Linear Integration

### Current Linear State

- Projects in Linear are for engineering work
- No explicit release stage tracking
- Milestones exist but aren't standardized

### Recommended Linear Labels

Create a **Release Stage** label group:

| Label | Color | Description |
|-------|-------|-------------|
| `stage:labs` | Purple | Internal/invite-only |
| `stage:alpha` | Cyan | Self-service opt-in |
| `stage:beta` | Indigo | Auto-enabled with badge |
| `stage:new` | Emerald | GA with New badge |
| `stage:ga` | Gray | Core feature |

### Linear Milestones for Release

Create standardized milestones for each project:

```
[Project Name] - Labs Ready
[Project Name] - Alpha Ready  
[Project Name] - Beta Ready
[Project Name] - GA Ready
```

Each milestone has exit criteria (see below).

---

## "Release Ready" Definitions

### Labs Ready

| Criteria | Required | Owner |
|----------|----------|-------|
| Feature works end-to-end | ✓ | Engineering |
| Behind feature flag | ✓ | Engineering |
| Internal documentation | ✓ | Product |
| "How it works" dialog copy | ✓ | Product |
| Error handling in place | ✓ | Engineering |
| Basic analytics tracking | ✓ | Engineering |

**Who can access:** Internal team only (via feature flag)

### Alpha Ready

| Criteria | Required | Owner |
|----------|----------|-------|
| All Labs criteria | ✓ | — |
| Feature flag removed from code | ✓ | Engineering |
| Visible in Beta settings | ✓ | Engineering |
| Knowledge base article (draft) | ✓ | Product |
| Revenue team notified | ✓ | Product |
| PostHog stage metadata set | ✓ | Product |

**Who can access:** Any user who enables in Settings → Beta Features

### Beta Ready (Auto-enabled)

| Criteria | Required | Owner |
|----------|----------|-------|
| All Alpha criteria | ✓ | — |
| Knowledge base article published | ✓ | Product |
| Internal training complete | ✓ | Product |
| ≥2 weeks in Alpha with no critical bugs | ✓ | Engineering |
| Feedback incorporated | ✓ | Product |
| GTM Plan created | ✓ | Product |
| Badge displays correctly in UI | ✓ | Engineering |

**Who can access:** All users (with Beta badge visible)

### GA Ready (New badge)

| Criteria | Required | Owner |
|----------|----------|-------|
| All Beta criteria | ✓ | — |
| ≥2 weeks in Beta with no critical bugs | ✓ | Engineering |
| Customer feedback positive | ✓ | Product |
| GTM launch activities complete | ✓ | Marketing |
| Release notes published | ✓ | Product |
| Badge changed from Beta → New | ✓ | Engineering |

**Who can access:** All users (with New badge, auto-expires after 30 days)

### Full GA (No badge)

| Criteria | Required | Owner |
|----------|----------|-------|
| 30 days since New badge applied | ✓ | Automatic |
| No outstanding issues | ✓ | Engineering |
| Badge removed | ✓ | Engineering |

**Who can access:** All users (core feature)

---

## TTL Summary

| Stage | Max Duration | What Happens at Expiry |
|-------|--------------|------------------------|
| Labs | 90 days | Review: progress to Alpha or deprecate |
| Alpha | 60 days | Review: progress to Beta or extend with justification |
| Beta | 90 days | Review: progress to GA or extend with justification |
| New | 30 days | Auto-progress to GA (badge removed) |
| GA | Permanent | — |

---

## Documentation Requirements by Stage

| Document | Labs | Alpha | Beta | New/GA |
|----------|------|-------|------|--------|
| Internal Notion doc | ✓ | ✓ | ✓ | ✓ |
| "How it works" dialog | ✓ | ✓ | ✓ | — |
| Knowledge base (draft) | — | ✓ | — | — |
| Knowledge base (published) | — | — | ✓ | ✓ |
| Release notes | — | — | — | ✓ |
| Internal training | — | — | ✓ | — |
| Customer comms | — | — | Optional | If P1/P2 |

---

## Communication Matrix

| Stage Transition | Notify | Channel | Timing |
|------------------|--------|---------|--------|
| → Labs | Engineering Slack | #engineering | Same day |
| → Alpha | Revenue team | #product-updates + meeting | Same day |
| → Beta | All teams | #product-updates + meeting | 1 week before |
| → New/GA | All teams + customers | Slack + email + in-app | Coordinated |

---

## Proposed Notion Schema Changes

### Projects Database

Add properties:

```
Release Stage (Select)
  - Labs
  - Alpha  
  - Beta
  - New
  - GA
  - Not Applicable

Release Stage Updated (Date)
  - Auto-set when Release Stage changes

TTL Warning (Formula)
  - Calculates days remaining based on stage
```

### Product Areas Database

Update Status options:

```
Current: Live, Beta, Coming Soon, Deprecated
New: Labs, Alpha, Beta, Live, Deprecated
```

### GTM Plans Database

Add properties:

```
Current Release Stage (Select)
Target Release Stage (Select)
```

---

## Next Steps

1. [ ] **Notion Updates**
   - Add Release Stage property to Projects database
   - Update Product Areas status options
   - Update GTM Plans schema

2. [ ] **Linear Setup**
   - Create stage:* label group
   - Define milestone templates

3. [ ] **Product System Guide Update**
   - Add release lifecycle section
   - Update checklists with release criteria

4. [ ] **Team Training**
   - Revenue team on release stages
   - Engineering on milestone requirements
   - Marketing on launch coordination

5. [ ] **Prototype to Production**
   - Ship Beta Features UI from v4 prototype
   - Implement stage badges in product

---

## Appendix: Comparison Table

| Dimension | What it Tracks | Owner | Location |
|-----------|---------------|-------|----------|
| Project Phase | Development progress | Engineering | Notion Projects |
| Release Stage | Customer availability | Product | Notion Projects |
| Linear Milestone | Engineering deliverables | Engineering | Linear |
| GTM Launch Tier | Marketing investment | Marketing | Notion GTM Plans |
| PostHog Stage | Feature flag metadata | Product | PostHog |

---

*Last Updated: January 14, 2026*  
*Owner: Tyler Sahagun*
