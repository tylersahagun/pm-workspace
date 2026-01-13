# Release Lifecycle Process - Research

**Date:** January 13, 2026  
**Type:** Process Design Research  
**Sources:** Industry best practices, leadership meeting (Jan 13), competitive analysis

---

## TL;DR

This initiative establishes how AskElephant moves features from idea to customer hands through a standardized lifecycle: **Lab → Private Beta → Public Beta → GA → Launch**. The key insight is that **Release ≠ Launch** — releases can happen continuously while launches are coordinated marketing moments. Industry best practices emphasize short-lived flags, progressive rollouts, and clear TTLs to prevent "beta limbo."

---

## Problem Statement

### The Current State

From the January 13, 2026 leadership meeting:

> "My experience in AskElephant is not the same experience as our users because we are in feature flag hell." — Woody Klemetson, CEO

**Symptoms:**
- No standardized stages for feature maturity
- No defined TTLs (time-to-live) for each stage
- Confusion between "release" and "launch"
- Revenue team blindsided by feature changes
- Features stuck in "beta" for 18+ months
- No self-serve way for users to try beta features

### The Root Cause

AskElephant lacks a **defined release lifecycle process**. Without clear stage definitions, entry/exit criteria, and communication contracts, features exist in ambiguous states that confuse both internal teams and customers.

---

## Industry Best Practices Research

### Release Lifecycle Stages (Industry Standard)

| Stage | Definition | Typical TTL | Audience |
|-------|------------|-------------|----------|
| **Lab/Experimental** | Early exploration, may be abandoned | 30-90 days | Internal only |
| **Alpha/Private Beta** | Feature-complete, invite-only testing | 30-60 days | Selected users |
| **Beta/Public Beta** | Stable, available to all who opt-in | 60-90 days | Opt-in users |
| **GA (General Availability)** | Production-ready, default on | Permanent | All users |
| **Launch** | Marketing announcement | Event | External |

**Source:** Unleash, LaunchDarkly, Tiny.cloud best practices

### Key Principles from Research

#### 1. Progressive Rollouts Minimize Risk
> "Gradually exposing new features minimizes risk and allows for real-time monitoring and quick rollback if issues arise."

**Application:** Move from Lab (internal) → Private Beta (5%) → Public Beta (opt-in) → GA (100%)

#### 2. Short-Lived Flags Are Essential
> "Feature flags should be temporary. Once a feature is stable and fully released, remove the flag to maintain code clarity and reduce complexity."

**Application:** Define TTLs for each stage. If exceeded, force a decision: advance, deprecate, or extend with justification.

#### 3. Avoid Multiple Concurrent Open Betas
> "Running multiple open beta features simultaneously can overwhelm users and complicate feedback collection."

**Application:** Limit active public betas to 3-5 at a time. Prioritize what gets beta attention.

#### 4. Release ≠ Launch
> "A release is the technical deployment... A launch is a coordinated marketing and promotional effort."

**Application:** Decouple these completely. Engineering can release daily; Marketing launches quarterly (or as needed).

#### 5. Centralized Management Required
> "Utilize a centralized system for managing feature flags to ensure consistency, facilitate monitoring, and streamline the cleanup process."

**Application:** Use PostHog as single source of truth. Add stage metadata to all flags.

---

## Proposed Framework: AskElephant Release Lifecycle

### Stage Definitions

#### 🧪 Lab (Experimental)
**Definition:** Early-stage exploration during innovation time. No commitment to ship.

| Attribute | Value |
|-----------|-------|
| **Audience** | Internal team only (opt-in) |
| **TTL** | 90 days max |
| **Feature Flag** | Yes (internal group) |
| **UI Indicator** | "🧪 Experimental" badge |
| **Documentation** | Minimal (README in code) |
| **Support** | None (internal only) |
| **Exit Criteria** | Decision: advance to Alpha or deprecate |

**Who can create:** Any engineer during innovation time  
**Who decides exit:** Product + Engineering lead

#### 🔷 Private Beta (Alpha)
**Definition:** Feature-complete, testing with selected customers who opt-in.

| Attribute | Value |
|-----------|-------|
| **Audience** | Invited customers + internal |
| **TTL** | 60 days max |
| **Feature Flag** | Yes (beta cohort) |
| **UI Indicator** | "🔷 Alpha" badge |
| **Documentation** | Internal docs + customer FAQ |
| **Support** | CS aware, limited scope |
| **Exit Criteria** | Feedback incorporated, stable, ready for wider release |

**Entry criteria:** Product-approved scope, engineering sign-off on stability  
**Who decides exit:** Product owner

#### 🟡 Public Beta
**Definition:** Stable feature available to all users who opt-in via settings.

| Attribute | Value |
|-----------|-------|
| **Audience** | Any user who enables in settings |
| **TTL** | 90 days max |
| **Feature Flag** | No (available to all, opt-in in UI) |
| **UI Indicator** | "🟡 Beta" badge |
| **Documentation** | Knowledge base article |
| **Support** | Full CS support |
| **Exit Criteria** | Usage targets met, no critical bugs, ready for default-on |

**Entry criteria:** Private beta feedback addressed, CS trained  
**Who decides exit:** Product + CS + Engineering

#### ✅ GA (General Availability)
**Definition:** Production-ready, default-on for all users.

| Attribute | Value |
|-----------|-------|
| **Audience** | All users (default on) |
| **TTL** | Permanent |
| **Feature Flag** | Removed |
| **UI Indicator** | None |
| **Documentation** | Full docs, help center |
| **Support** | Full support |
| **Exit Criteria** | N/A (or deprecation) |

**Entry criteria:** Public beta success criteria met  
**Who decides:** Product owner sign-off

#### 🚀 Launch
**Definition:** Coordinated marketing announcement (separate from release).

| Attribute | Value |
|-----------|-------|
| **Timing** | Can happen at any stage (usually GA or Public Beta) |
| **Owner** | Marketing (Kenzie) |
| **Activities** | Blog, email, social, PR (varies by tier) |
| **Coordination** | 2+ weeks notice to marketing |

**Launch tiers:**
- **P0:** Major feature, full campaign
- **P1:** Significant feature, blog + email
- **P2:** Notable update, product email mention
- **P3:** Minor update, changelog only

---

## Communication Contract

### Who Needs to Know What, When

| Stage Transition | Who to Notify | How | When |
|------------------|---------------|-----|------|
| Lab → Private Beta | Product, CS Lead | Slack #product-updates | Same day |
| Private Beta → Public Beta | Revenue team, Marketing | Slack + Meeting | 1 week before |
| Public Beta → GA | All teams | Slack + Release notes | Same day |
| GA → Launch | External | Marketing campaign | Coordinated |

### Weekly Release Notes

**Owner:** Tyler  
**Audience:** Revenue team  
**Cadence:** Every Monday  
**Format:**
```
## Release Notes - Week of [Date]

### Now in Public Beta
- [Feature]: [Description] - [How to enable]

### Now GA
- [Feature]: [Description]

### Coming Soon (Private Beta)
- [Feature]: [Target date for public beta]

### Deprecated
- [Feature]: [Migration path]
```

---

## Self-Serve Beta Toggles (UI Pattern Research)

### Industry Patterns Observed

1. **Settings Panel Approach** (GitHub, Linear, Figma)
   - Dedicated "Beta Features" or "Labs" section in settings
   - List of features with toggle switches
   - Brief description + "Learn more" link

2. **Opt-In Modal Approach** (Notion, Coda)
   - Modal appears when feature is first available
   - "Try the new [X]" with preview
   - One-click enable

3. **Feature Discovery Approach** (Arc Browser)
   - "Labs" tab in app
   - Experimental features with disclaimers
   - Strong "may break" messaging

### Recommended Pattern for AskElephant

**Primary:** Settings Panel Approach
- Location: Settings → Beta Features
- Simple toggle per feature
- Clear descriptions
- Stage badge (Alpha vs Beta)

**Secondary:** Contextual Discovery
- When user encounters beta feature area, show tooltip
- "This is new! Enable in Settings → Beta Features"

---

## Success Metrics

### Process Adoption Metrics

| Metric | Current | Target | How to Measure |
|--------|---------|--------|----------------|
| Features with defined stage | ~30% | 100% | PostHog metadata audit |
| Features exceeding TTL | Unknown | <10% | Weekly TTL report |
| Revenue team awareness | Low | >90% | Monthly survey |
| Time Lab → GA (median) | 18+ months | <6 months | Track in roadmap |

### User Engagement Metrics (Post Beta UI)

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Beta feature discovery rate | >20% see settings page | PostHog funnel |
| Beta opt-in rate | >5% of active users | PostHog |
| Beta retention (stay enabled) | >70% | PostHog |

---

## Competitive Reference

### How Others Do It

| Company | Lab | Private Beta | Public Beta | Notes |
|---------|-----|--------------|-------------|-------|
| **GitHub** | ❌ | ✅ (Feature Preview) | ✅ | Settings toggle per feature |
| **Linear** | ✅ (Labs) | ✅ | ✅ | Labs section in settings |
| **Notion** | ❌ | ✅ | ✅ | Invite-based beta |
| **Figma** | ✅ (Figjam Labs) | ✅ | ✅ | Separate labs product |
| **Arc** | ✅ (Labs tab) | ✅ | ✅ | Very experimental focus |
| **Slack** | ❌ | ✅ | ✅ | Workspace-level beta |

### AskElephant Differentiation
- **User-level control:** Unlike Slack (workspace-level), we allow individual opt-in
- **Clear stage badges:** More transparent than most about feature maturity
- **TTL transparency:** Consider showing "Beta until [date]" to set expectations

---

## Open Questions for PRD

1. **TTL enforcement:** Soft reminder or hard block when TTL exceeded?
2. **Multiple betas:** Limit concurrent public betas? If so, how many?
3. **Workspace vs. user:** Can admins disable beta access for their workspace?
4. **Feedback loop:** In-app feedback for beta features or existing channels?
5. **Lab visibility:** Should Lab features be visible to super-admins/power users?

---

## Recommendations

### Immediate Actions
1. **Define stages officially** - Get leadership sign-off on Lab/Alpha/Beta/GA definitions
2. **Add metadata to PostHog** - Tag all existing flags with stage
3. **Start weekly release notes** - Begin communication cadence immediately
4. **Ship beta toggle UI** - Enable self-serve beta opt-in

### Process Changes
1. **Every feature needs a stage** - No ambiguous flags
2. **TTL reviews weekly** - Product reviews flags approaching TTL
3. **Launch ≠ Release** - Decouple explicitly in planning

### Cultural Shift
- From: "Ship it behind a flag, we'll figure it out later"
- To: "Ship it with a stage, TTL, and exit criteria"

---

## Related Documents

- [Feature Flag Audit](../feature-availability-audit/Feature%20Flag%20Audit.md) - Current state data
- [Leadership Meeting Notes](../feature-availability-audit/research.md) - Original discussion
- [Product Vision](../../company-context/product-vision.md) - Strategic context

---

*Research compiled: January 13, 2026*
