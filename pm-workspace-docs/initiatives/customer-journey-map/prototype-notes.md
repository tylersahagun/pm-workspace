# Prototype Notes: Journey Workspace v1

**Date:** 2026-01-14  
**Initiative:** Customer Journey Map  
**Prototype Location:** `prototypes/src/components/JourneyWorkspace/`

---

## Overview

This prototype implements the first version of the Journey Workspace for Sales Reps. The goal is to provide a "daily command center" that shows exactly where each account is stuck, what matters most, and the next action to move it forward.

### Core Job Statement

> "When I'm managing active deals, I want a prioritized, context-rich list of what to do next per account, so that I move deals forward faster without manual CRM digging."

### Scope (v1)

**In Scope:**
- Rep Workspace with prioritized actions
- Account Journey View with stage/milestones/blockers
- AI-drafted follow-ups with approve/send flow
- Deal health/priority signals

**Out of Scope:**
- Leader dashboards and team views
- CS journey tracking
- Calendar optimization
- Automated actions without approval
- Global analytics

---

## Creative Directions

### Option A: Maximum Control

**Philosophy:** User sees all details upfront, every action requires explicit review and approval, all AI evidence visible by default.

**Best for:**
- New users building trust with the system
- High-stakes deals where mistakes are costly
- Low-trust environments

**Design Decisions:**
- Full evidence shown by default (no expansion needed)
- Health factors always visible
- Journey progress always shown
- Actions require multi-step approval flow
- Trust footer explains AI behavior

**Tradeoffs:**
| Pro | Con |
|-----|-----|
| Maximum transparency | Higher cognitive load |
| Easy to verify AI reasoning | Slower to process routine actions |
| No surprises | Can feel overwhelming |

---

### Option B: Balanced (RECOMMENDED)

**Philosophy:** AI surfaces top priorities, one-click execution available, details on demand via progressive disclosure.

**Best for:**
- Most users (trust-building phase)
- Balancing speed with control
- Daily workflow

**Design Decisions:**
- Two-column layout: Actions (left) + Accounts (right)
- Top 5 actions shown prominently
- Accounts expandable to show details
- Evidence available on demand ("Show evidence & impact")
- One-click send with preview available

**Tradeoffs:**
| Pro | Con |
|-----|-----|
| Good balance of speed and control | Requires clicks for full reasoning |
| Two-column separates concerns | Could miss context if not expanding |
| Progressive disclosure reduces overwhelm | |

**Why Recommended:**
This option directly addresses the two competing needs from research:
1. "I want to know what to do" → Prioritized actions panel
2. "I want to see where customers are" → Account journey list

Both are visible simultaneously without overwhelming the user.

---

### Option C: Maximum Efficiency

**Philosophy:** Inbox-zero style, minimal UI, fast processing of routine actions.

**Best for:**
- Power users
- High volume of daily actions
- Routine follow-ups

**Design Decisions:**
- Single-column, stream-based layout
- Color-coded priority bars (no badges)
- Minimal account info (name, value, stage)
- One-click actions inline
- Floating summary bar at bottom
- Quick filters at top

**Tradeoffs:**
| Pro | Con |
|-----|-----|
| Fastest to process actions | Less context visible |
| Minimal cognitive load per action | Requires trust in AI |
| Great for power users | Could miss important nuance |

---

## Components Created

| Component | Purpose |
|-----------|---------|
| `types.ts` | Data models for accounts, actions, health, milestones |
| `DealHealthIndicator.tsx` | Health badge + detailed health view |
| `ActionCard.tsx` | Action cards with three variants + all states |
| `AccountJourneyCard.tsx` | Account cards with three variants |
| `RepWorkspace.tsx` | Main workspace with three creative directions |
| `JourneyWorkspace.stories.tsx` | Storybook stories for all options and states |

---

## AI States Implemented

| State | Visual Treatment | Copy Pattern |
|-------|-----------------|--------------|
| Loading (short) | Skeleton with pulse | N/A |
| Loading (long) | Stage indicators | "Analyzing your calls..." |
| Success | Check mark, green bg | Affirming, brief |
| Error | Warning icon, red bg | Honest, solution-focused |
| Low Confidence | Muted styling, dotted indicators | "I think..." hedging |
| Empty | Celebration emoji | Encouraging, actionable |

---

## Trust Principles Applied

### 1. Receipts, Not Black Boxes
Every AI action includes:
- Evidence quotes from calls
- Data points and patterns
- Source attribution
- Confidence indicators

### 2. Progressive Disclosure
- Summaries shown first
- Details available on expand
- Evidence on demand

### 3. Graceful Failure
- All error states designed
- Recovery actions provided
- No blocking failures

### 4. Human-Centered AI
- AI drafts, user approves
- No automated sending
- Edit capability before send
- Rep gets credit for work

### 5. Trust Calibration
- Confidence indicators on all AI content
- Low confidence = requires more user review
- High confidence = one-click available

---

## Comparison Table for Stakeholder Review

| Criteria | Option A: Control | Option B: Balanced | Option C: Efficient |
|----------|------------------|-------------------|---------------------|
| **Trust level required** | Low | Medium | High |
| **User control** | Maximum | Balanced | Minimal |
| **Speed to complete action** | Slowest | Medium | Fastest |
| **Visibility into reasoning** | Always visible | On demand | Minimal |
| **Cognitive load** | High | Medium | Low |
| **Learning curve** | Lowest | Medium | Highest |
| **Best for persona** | New users | Most users | Power users |
| **Best for deal type** | High stakes | Mixed | Routine |

---

## Recommendation

**Option B (Balanced)** is recommended for v1 launch because:

1. **Matches research insights**: Reps said they want both "what to do" AND "where customers are" - Option B shows both simultaneously

2. **Builds trust progressively**: Users start with suggested view, can drill down for evidence when needed

3. **Supports the success metrics**:
   - Action completion rate: One-click execution + preview reduces friction
   - Time to follow-up: Draft ready to send immediately
   - Habitual adoption: Two-column layout makes it a useful daily start point

4. **Can evolve**: Power users can be offered "Efficient mode" toggle; new users can use "Control mode" during onboarding

---

## Open Questions for Stakeholder Review

1. **Action scope**: Should we limit to 5 priority actions, or show all with pagination?

2. **Account grouping**: In Option C, actions are grouped by account. Should Option B also group this way?

3. **Mobile experience**: Which variant translates best to mobile?

4. **Keyboard shortcuts**: Should we add Vim-style shortcuts for power users (j/k to navigate, Enter to execute)?

5. **Bulk actions**: Should there be a "Send all" or "Approve top 5" for efficiency mode?

---

## Next Steps

1. **Stakeholder review**: Present all three options, gather feedback
2. **User testing**: Test Option B with 3-5 reps
3. **Iterate**: Refine based on feedback
4. **Engineering handoff**: Create design brief and engineering spec

---

## Preview

**Local Storybook:**
```bash
cd prototypes && npm run storybook
# Navigate to Prototypes/JourneyWorkspace
```

**Key Stories:**
- `Option A: Maximum Control`
- `Option B: Balanced (Recommended)`
- `Option C: Maximum Efficiency`
- `Comparison: All Three Options`
