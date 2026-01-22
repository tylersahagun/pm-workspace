# Design Companion Review: Composio Agent Framework

**Date:** 2026-01-22  
**Reviewer:** Design Companion (Human-Centric AI Specialist)  
**Prototype Version:** v4  
**Overall Assessment:** ✅ **Strong Foundation with Minor Refinements Needed**

---

## Executive Summary

The Composio Agent Framework represents thoughtful human-centric AI design. The team has systematically addressed jury concerns across four iterations, building trust through transparency (ActivityLog), safety nets (RollbackPanel), and progressive disclosure (ConversationalSetup). The v4 conflict resolution system demonstrates mature thinking about multi-agent coordination.

**Strongest elements:**
- ActivityLog with evidence/receipts (builds trust)
- Auth scope warnings (prevents embarrassing mistakes)
- Conversational setup option (removes blank field intimidation)
- Conflict detection during creation (prevents silent failures)

**Areas for refinement:**
- Skill loading feedback (Phase 3 needs transparency)
- Autonomy level communication (IBM levels not explicit)
- Long-running agent feedback (beyond "pending")

---

## Emotional Journey Assessment

### Before: User Anxiety About Automation
| Persona | Current Feeling | Primary Fear |
|---------|-----------------|--------------|
| Sales Rep | Anxious | "Will this embarrass me to customers?" |
| RevOps | Skeptical | "Will this break our CRM data?" |
| Sales Leader | Cautious | "Can I trust this with my pipeline?" |
| CSM | Overwhelmed | "Another thing to configure and monitor?" |

### During: Building Trust Through Interaction

**Option D (Conversational Setup) - Excellent Emotional Design:**
```
User starts with vague intent → Feels uncertain
AI asks clarifying questions → Feels heard
AI shows 3 format options → Feels in control
User picks preferred → Feels successful
AI confirms configuration → Feels confident
```

The typewriter effect creates a "thinking" presence that feels collaborative rather than instant/robotic.

### After: Target Feelings
| Persona | Target Feeling | Design Element That Delivers |
|---------|----------------|------------------------------|
| Sales Rep | Confident | Test preview before activation |
| RevOps | In control | Rollback panel + conflict detection |
| Sales Leader | Assured | Activity log with evidence |
| CSM | Efficient | Quick setup + audit trail for QBRs |

**Emotional Design Score: 8.5/10** ✅

---

## Trust Analysis (Trust Equation Applied)

### Trust = (Credibility × Reliability × Intimacy) / Self-Orientation

#### Credibility: 9/10 ✅
What builds it:
- Evidence/receipts in ActivityLog (quotes, data, reasoning)
- Confidence scores displayed explicitly (92%, 54%)
- Source meeting attribution ("Triggered by: Acme Corp Q1 Planning")

What could erode it:
- ⚠️ Missing: Skill source attribution when Phase 3 launches
  - "Recommendation based on RevOps Expert skill (James, RevOps Lead)"

#### Reliability: 8/10 ✅
What builds it:
- Consistent status indicators across all components
- Retry capability for failed actions
- Conflict resolution rules (Priority/Merge/Skip)

What could erode it:
- ⚠️ Long-running agents show only "pending" with spinner
  - Suggest: Progress stages ("Analyzing transcript → Extracting actions → Drafting...")

#### Intimacy: 8/10 ✅
What builds it:
- Auth scope warnings ("Actions will appear as you")
- Shared agent warning when using personal credentials
- Conversational setup feels like talking to a colleague

What could erode it:
- ⚠️ No explanation of what data the agent can see
  - "This agent will access: Meeting transcripts, HubSpot deal properties"

#### Self-Orientation: 2/10 ✅ (Lower is better)
The design serves users, not the system:
- ✅ "AI suggests, human decides" pattern in Option B
- ✅ User can edit/override AI-generated configurations
- ✅ Test before activate respects user's need for control
- ✅ Rollback gives users ultimate authority

**Trust Score: 8.5/10** ✅

---

## Trust Recovery Plan

When AI fails (and it will), the design handles it well:

| Failure Type | Current Design | Recommendation |
|--------------|----------------|----------------|
| Agent error | Red border, error message, retry button | ✅ Good |
| Low confidence | Amber badge, expanded evidence | ✅ Good |
| Conflict | ConflictWarning with diff view | ✅ Good |
| Integration disconnected | Clear error + reconnect action | ✅ Good |
| **NEW: Skill failure** | Not designed | ⚠️ Add "Skill didn't apply" state |

**Recovery Score: 8/10** ✅

---

## State Completeness Audit

| State | Designed? | Component | Notes |
|-------|-----------|-----------|-------|
| Loading (short) | ✅ | Skeleton cards | Appropriate pulse animation |
| Loading (long) | ⚠️ | Only spinner | Needs progress stages |
| Success | ✅ | Green check + toast | Affirming copy |
| Error | ✅ | Red border + message | Actionable recovery |
| Low Confidence | ✅ | Amber badge + evidence | Honest hedging |
| Empty | ✅ | Bot icon + CTA | Encouraging, actionable |
| Conflict | ✅ | ConflictWarning | Clear resolution options |

**Recommendation:** Add progress stages for long-running agents:
```
Stage 1: "Reading meeting transcript..."
Stage 2: "Identifying action items..."  
Stage 3: "Drafting follow-up email..."
Stage 4: "Saving to Gmail drafts..."
```

**State Completeness: 8/10** ✅

---

## Transparency Check

| Requirement | Status | Evidence |
|-------------|--------|----------|
| Evidence/receipts visible for AI decisions | ✅ | ActivityLog shows quotes, data, reasoning |
| Confidence levels communicated | ✅ | Progress bar + percentage in ActivityLog |
| Audit trail accessible | ✅ | Activity Log with timeline grouping |
| "Why did AI do this?" answerable | ✅ | Evidence section + meeting attribution |
| Data accessed visible | ⚠️ | Not shown during setup |
| Skill influence visible | ⚠️ | Phase 3 needs "Used: RevOps Expert skill" |

**Recommendation for Phase 3 (Skills):**
```
Activity Log Entry:
✅ Created email draft for Acme Corp
   Based on: RevOps Expert skill
   Evidence: "We need to finalize by Friday"
   Confidence: 92%
```

**Transparency Score: 8/10** ✅

---

## Accessibility Check

| Requirement | Status | Evidence |
|-------------|--------|----------|
| Screen reader compatible | ✅ | Semantic HTML, aria-expanded on collapsibles |
| Keyboard navigable | ✅ | All interactive elements focusable |
| Color not sole indicator | ✅ | Icons + labels accompany status colors |
| Aria-live for dynamic content | ⚠️ | Not implemented for typewriter effect |
| Focus management | ⚠️ | After artifact reveal, focus unclear |

**Recommendations:**
1. Add `aria-live="polite"` to typewriter container
2. Move focus to artifact after it appears
3. Add skip link in ConversationalSetup for keyboard users

**Accessibility Score: 7/10** ⚠️

---

## IBM Autonomy Level Assessment

| Phase | Level | Current State | Recommendation |
|-------|-------|---------------|----------------|
| **Phase 1: Universal Agent Node** | Level 2-3 | ✅ AI recommends, user confirms in workflow | Appropriate for launch |
| **Phase 2: Agent Configurator** | Level 3 | ✅ AI acts with user confirmation | Test preview validates this |
| **Phase 3: Skills (Auto-loading)** | Level 4 | ⚠️ AI loads skills autonomously | Add "Loaded RevOps skill" indicator |

**Critical Insight:** Skills auto-loading is Level 4 autonomy (acts with notification). This is acceptable IF users can see when skills were used. Without visibility, it feels like Level 5 (autonomous without notification), which erodes trust.

**Recommendation:**
```tsx
// In ActivityLog entry
skillsUsed?: string[];  // ["RevOps Expert", "Follow-up Best Practices"]
```

---

## Microsoft HAX 18 Guidelines Check

### Initially
| Guideline | Status | Notes |
|-----------|--------|-------|
| Make clear what system can/can't do | ⚠️ | Tool risk indicators help, but no capability overview |
| Show contextually relevant info | ✅ | Auth scope warnings, conflict detection |

### During Interaction
| Guideline | Status | Notes |
|-----------|--------|-------|
| Match social norms | ✅ | Conversational setup feels natural |
| Support efficient invocation | ✅ | Quick-select buttons in Option D |
| Support efficient dismissal | ✅ | Cancel button always visible |
| Support efficient correction | ✅ | Edit flow in confirmation artifact |

### When Wrong
| Guideline | Status | Notes |
|-----------|--------|-------|
| Acknowledge mistakes | ✅ | Error states honest with recovery |
| Encourage granular feedback | ⚠️ | No "Was this helpful?" in ActivityLog |

### Over Time
| Guideline | Status | Notes |
|-----------|--------|-------|
| Provide global controls | ⚠️ | No "pause all agents" option |
| Support user learning | ⚠️ | No onboarding for first agent |

**Recommendations:**
1. Add capability overview during first agent creation
2. Add "Was this helpful?" feedback in ActivityLog
3. Consider "Pause all agents" global control
4. Add guided first-agent experience

---

## Persona-Specific Concerns

### Sales Reps
| Concern | Status | Notes |
|---------|--------|-------|
| AI must save time, not create review work | ✅ | Test preview is optional, not required |
| Never embarrass rep to customers | ✅ | Auth scope warnings prevent attribution mistakes |
| Frame as power-user feature | ⚠️ | Copy could emphasize "your assistant" framing |
| Rep gets credit for AI-assisted work | ✅ | Personal auth means actions appear as user |

### Sales Leaders
| Concern | Status | Notes |
|---------|--------|-------|
| Surface risks before problems | ✅ | Low confidence states, conflict detection |
| Coaching insights, not surveillance | ⚠️ | Activity log visible to leaders—clarify intent |
| Reduce 1:1 status update time | ⚠️ | ROI not quantified yet |

### RevOps/Admins
| Concern | Status | Notes |
|---------|--------|-------|
| Visibility into AI behaviors | ✅ | Activity log with evidence |
| Auditable, governable | ✅ | Rollback panel, conflict rules |
| Doesn't override intentional configurations | ✅ | Conflict resolution requires explicit choice |

---

## Anti-Patterns Flagged

| Anti-Pattern | Present? | Evidence |
|--------------|----------|----------|
| Confident wrongness | ⚠️ Partial | Confidence shown, but no "I'm not sure" copy for low scores |
| Unexplained actions | ✅ Avoided | Evidence section explains reasoning |
| Silent failure | ✅ Avoided | Error states with clear messaging |
| Over-automation | ✅ Avoided | Test before activate, explicit confirmations |
| Creepy personalization | ✅ Avoided | Data sources could be more visible |
| Replacement framing | ⚠️ Review | Some copy says "automates" vs "assists" |

**Copy Recommendation:**
- Change: "This agent automates your follow-ups"
- To: "This agent drafts follow-ups for your review"

---

## Specific Component Feedback

### ConversationalSetup (v3) ⭐

**Strengths:**
- Typewriter effect creates anticipation
- Artifact reveals feel rewarding
- Quick-select buttons reduce typing
- Auth scope integrated naturally

**Improvements:**
1. Add subtle sound effect on artifact reveal (optional, preference-based)
2. Show "You can always change this later" to reduce commitment anxiety
3. Add progress indicator (Step 2 of 5) for users who prefer structure

### ActivityLog (v2) ⭐

**Strengths:**
- Timeline grouping (Today, Yesterday) is scannable
- Expandable evidence reduces cognitive load
- Retry button is appropriately prominent
- Confidence bar is intuitive

**Improvements:**
1. Add "Export" button for compliance teams
2. Add filter by agent name
3. Add filter by status (show only errors)
4. Consider collapsible date groups for long lists

### RollbackPanel (v3)

**Strengths:**
- Before/after diff is essential for trust
- "Cannot revert" indicators prevent false expectations
- Batch selection is efficient

**Improvements:**
1. Add "Rollback reason" field for audit trail
2. Show estimated time for rollback completion
3. Consider undo-the-rollback for mistakes

### ConflictDetector (v4)

**Strengths:**
- Detection during creation prevents runtime surprises
- Resolution strategies are clear (Priority/Merge/Skip)
- Progress indicator (1 of 3 resolved) is helpful

**Improvements:**
1. Show preview of merge result ("Next Steps will become: [Agent A text] + [Agent B text]")
2. Add "View conflicting agent" link
3. Consider "Don't ask again for this field" preference

---

## Phase 3 (Skills) Design Recommendations

Based on the architecture deep dive, here's how Skills should integrate:

### 1. Skill Visibility in Activity Log
```
✅ Updated HubSpot deal properties
   Skills used: RevOps Expert
   Actions: Set Deal.Next Steps, Set Deal.Probability
   Confidence: 94%
   [View full reasoning →]
```

### 2. Skill Loading Feedback (Long Operations)
```
"Applying RevOps Expert skill..."
↓ (500ms)
"Found 3 relevant guidelines for CRM updates..."
↓ (300ms)
"Generating output..."
```

### 3. Skill Override Option
```
[✓] Auto-apply relevant skills (recommended)
    • RevOps Expert will be used when updating CRM
    • Follow-up Best Practices for email drafts

[ ] Manual skill selection
    Let me choose skills for each run
```

### 4. Skill Attribution in Output
```
Email Draft:
"Hi Team, Here's a summary of our discussion..."

──────────────────────────────────────
📚 Based on: Follow-up Best Practices skill
   - Included action items with owners
   - Set follow-up deadline
   [Edit skill preferences →]
```

---

## Final Recommendations (Priority Ordered)

### P0: Before Stakeholder Review
1. **Add skill attribution placeholder** in ActivityLog schema
2. **Add progress stages** for long-running agents (beyond spinner)
3. **Add aria-live** to typewriter and artifact containers

### P1: Before Launch
4. **Add "Was this helpful?"** feedback on ActivityLog entries
5. **Improve copy** from "automates" to "assists/drafts"
6. **Add capability overview** during first agent creation

### P2: Phase 2 Polish
7. **Add filter/search** to ActivityLog
8. **Add "Pause all agents"** global control
9. **Add rollback reason** field for compliance

### P3: Phase 3 Preparation
10. **Design skill loading feedback** UX
11. **Design skill override controls**
12. **Design skill attribution** in outputs

---

## Conclusion

The Composio Agent Framework is **ready for stakeholder review** with minor refinements. The team has demonstrated excellent human-centric AI design thinking across four iterations, systematically building trust through transparency, control, and graceful failure handling.

The primary remaining work is ensuring Phase 3 (Skills) maintains the same level of transparency when AI is making autonomous decisions about which expertise to apply.

**Overall Design Score: 8.2/10** ✅

| Category | Score | Notes |
|----------|-------|-------|
| Emotional Design | 8.5/10 | Strong emotional journey mapping |
| Trust Calibration | 8.5/10 | Evidence, confidence, recovery all strong |
| State Completeness | 8/10 | Long-running states need work |
| Transparency | 8/10 | Skills visibility needed for Phase 3 |
| Accessibility | 7/10 | aria-live and focus management needed |
| Anti-Patterns | 8/10 | Copy refinements needed |

---

**Next Steps:**
1. Schedule Woody design review with this document
2. Address P0 items before the review
3. Create Linear tickets for P1/P2 items
4. Begin Phase 3 skills UX design based on recommendations
