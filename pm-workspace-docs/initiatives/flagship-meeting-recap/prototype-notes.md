# Flagship Meeting Recap - Prototype Notes

**Version:** v1
**Created:** 2026-01-28
**Status:** Built, ready for Chromatic deployment
**Location:** `elephant-ai/web/src/components/prototypes/FlagshipMeetingRecap/v1/`

---

## Overview

Full Storybook prototype for the flagship meeting recap experience. Implements all core components, states, and creative directions from the PRD and design brief.

---

## Components Built

### 1. RecapArtifact

**Main meeting recap view with all required states.**

| State         | Description                                       |
| ------------- | ------------------------------------------------- |
| Loading       | Progressive skeleton animation                    |
| LoadingLong   | Extended loading (3+ seconds) with reassurance    |
| Success       | Full polished artifact                            |
| Error         | "Couldn't generate" with retry/transcript options |
| LowConfidence | Amber highlighting with verification prompts      |
| Empty         | First-time guidance                               |

**Features:**

- Meeting type detection display
- Section-based content with uncertainty markers
- Action items with assignees
- Next steps list
- Privacy notice: "Only you can see this until you share it"
- Feedback button for in-place editing

### 2. CoachingArtifact

**Coaching insights view with performance metrics.**

| State   | Description                                     |
| ------- | ----------------------------------------------- |
| Loading | Skeleton with score placeholder                 |
| Success | Full coaching with strengths/opportunities/tips |
| Error   | Retry option                                    |
| Empty   | Tab hidden                                      |

**Features:**

- Overall performance score with contextual message
- Strengths section (green border)
- Opportunities section (amber border)
- Tips section (blue background)
- Evidence quotes with timestamps
- Privacy: "Never shared with your manager"

### 3. PrepArtifact

**Pre-meeting preparation view.**

| State   | Description                                    |
| ------- | ---------------------------------------------- |
| Loading | Attendee and topic skeletons                   |
| Success | Full prep with attendees, interactions, topics |
| Error   | Retry option                                   |
| Empty   | Only for scheduled meetings                    |

**Features:**

- Attendee cards with LinkedIn links
- Recent interaction history
- Suggested talking points (numbered)
- Key context from last meeting
- Refresh button to regenerate

### 4. MeetingTypeBanner

**Detection banner with confidence levels.**

| Confidence      | Visual Style                   |
| --------------- | ------------------------------ |
| High (80%+)     | Blue, confident statement      |
| Low (60-79%)    | Muted, "might be" hedging      |
| Very Low (<60%) | Amber, manual selection prompt |
| First Time      | Learning state                 |

**Features:**

- Confirm button: "Looks right"
- Override dropdown with all meeting types
- Dismiss button
- Icons for each meeting type

### 5. RecapFeedbackButton

**PostHog-style feedback trigger.**

- Dotted outline button (h-4 w-4)
- Tooltip: "Not quite right? Tell me what to change"
- Opens global chat with recap context

### 6. ShareModal

**Channel selection for external sharing.**

| Channel | Destination Options       |
| ------- | ------------------------- |
| Slack   | DM or channel picker      |
| HubSpot | Deal, contact, or company |
| Teams   | Chat or channel           |
| Email   | Email input               |
| Copy    | Clipboard only            |

**Features:**

- Channel-specific destination pickers
- Preview of how recap will appear
- Privacy notice before share
- Error recovery with alternatives
- Success confirmation with external link

### 7. UndoToast

**Undo action toast with countdown.**

- Circular countdown indicator
- Auto-dismiss after duration
- Pause on hover
- Link to external system
- Reduced motion variant

### 8. TemplateConfigChat

**Chat-based template configuration.**

**Layout:** Split view (40% chat / 60% preview)

**Features:**

- AI chat with suggestions
- Progress indicator (step 1 of 3)
- **Live preview with real example content** (not placeholder skeletons)
- Preview shows realistic recap data for each meeting type
- Complete and error states
- Privacy: "Your templates are private"

### 9. CompleteWalkthrough (NEW)

**Full interactive demo of the entire user journey.**

**Location:** `prototypes/src/components/FlagshipMeetingRecap/v1/walkthrough/`

**Journey Covered:**

| Step  | Section        | Description                                  |
| ----- | -------------- | -------------------------------------------- |
| 1     | Intro          | Welcome screen with "Start the Journey" CTA  |
| 2-6   | Configuration  | Chat-based template setup with live preview  |
| 7     | Transition     | "Meeting Complete" animation                 |
| 8-10  | Artifact Views | Recap, Coaching, Prep tabs with real content |
| 11-12 | Feedback       | In-place editing via global chat overlay     |
| 13-14 | Share          | Channel selection + success confirmation     |
| 15    | Complete       | Summary of the experience                    |

**Features:**

- **Auto-play mode**: Click play to watch the demo advance automatically
- **Manual navigation**: Step forward/back through the journey
- **Reset**: Return to the beginning
- **Progress bar**: Shows position in the journey
- **Animated transitions**: Chat typing indicators, loading states
- **Real content**: Sample meeting data, not placeholders

**Use Cases:**

- Stakeholder presentations
- User research validation
- Engineering handoff
- Sales enablement demos

---

## Creative Options Implemented

### Option A: Maximum Control

For new users and skeptics who want to verify every section.

- Every section has explicit approve/edit buttons
- AI confidence shown per section
- Nothing auto-shared without explicit approval

### Option B: Balanced (Recommended)

For most users who trust AI but want easy correction.

- Auto-generates full recap
- Subtle feedback icon for easy editing
- Share requires explicit action

### Option C: Maximum Efficiency

For power users who fully trust AI.

- Minimal UI, just the content
- Auto-share to configured channels
- Feedback only if needed

---

## Trust & Privacy Copy Implemented

| Moment          | Copy                                                                                             |
| --------------- | ------------------------------------------------------------------------------------------------ |
| Recap view      | "Only you can see this until you share it."                                                      |
| Coaching        | "Coaching insights are suggestions to help you improve. They're never shared with your manager." |
| Prep            | "Prep is generated automatically 1 hour before your meeting."                                    |
| Template config | "Your templates are private—only you can see them."                                              |
| Low confidence  | "I'm not 100% confident on some details. Give it a quick look?"                                  |

---

## Storybook Stories

### RecapArtifact.stories.tsx

- Success, SuccessWithActions
- Loading, LoadingLong
- Error, ErrorWithMessage
- LowConfidence
- Empty
- OptionA_MaxControl, OptionB_Balanced, OptionC_MaxEfficiency

### CoachingArtifact.stories.tsx

- Success, SuccessHighScore, SuccessNeedsImprovement
- Loading
- Error, ErrorWithMessage
- Empty

### PrepArtifact.stories.tsx

- Success, SuccessMinimal, SuccessRichHistory
- Loading
- Error, ErrorWithMessage
- Empty

### MeetingTypeBanner.stories.tsx

- HighConfidence, HighConfidenceDemo, VeryHighConfidence
- LowConfidence, LowConfidenceFollowUp
- VeryLowConfidence, CouldNotDetect
- FirstTimeUser
- AllMeetingTypes

### ShareModal.stories.tsx

- Default
- Success, SuccessSlack, SuccessCopy
- InteractiveDemo

### UndoToast.stories.tsx

- TemplateUpdated
- SentToHubSpot, SentToSlack, CopiedToClipboard
- ReducedMotion
- InteractiveDemo

### TemplateConfigChat.stories.tsx

- Default (with real example preview content)
- Complete, Error
- InteractiveDemo

### CompleteWalkthrough.stories.tsx (NEW)

- Default (full journey demo with auto-play)

---

## Build Status

```bash
# Build Storybook (in elephant-ai)
cd elephant-ai/web && npx storybook build
# ✅ Built successfully

# Run Storybook locally
cd elephant-ai/web && npm run storybook

# Chromatic deployment (via elephant-ai CI)
# Chromatic is configured in elephant-ai's CI pipeline
```

---

## Files Created

```
elephant-ai/web/src/components/prototypes/FlagshipMeetingRecap/
├── index.ts                    # Re-exports v1
└── v1/
    ├── index.ts                # Component exports
    ├── types.ts                # All TypeScript types + mock data
    ├── RecapArtifact.tsx       # Main recap view
    ├── RecapArtifact.stories.tsx
    ├── CoachingArtifact.tsx    # Coaching view
    ├── CoachingArtifact.stories.tsx
    ├── PrepArtifact.tsx        # Prep view
    ├── PrepArtifact.stories.tsx
    ├── MeetingTypeBanner.tsx   # Detection banner
    ├── MeetingTypeBanner.stories.tsx
    ├── RecapFeedbackButton.tsx # Feedback icon
    ├── ShareModal.tsx          # Share channel selection
    ├── ShareModal.stories.tsx
    ├── UndoToast.tsx           # Undo action toast
    ├── UndoToast.stories.tsx
    ├── TemplateConfigChat.tsx  # Chat config with live preview
    ├── TemplateConfigChat.stories.tsx
    ├── contexts/               # In-context demo
    │   ├── MeetingPageWithRecap.tsx
    │   └── FlagshipMeetingRecap.context.stories.tsx
    └── walkthrough/            # Complete interactive demo
        ├── index.ts
        ├── CompleteWalkthrough.tsx
        └── CompleteWalkthrough.stories.tsx
```

---

## Design System Alignment

All components follow `.interface-design/system.md`:

- **Cards:** `border bg-card shadow-sm rounded-lg`
- **Low confidence:** `bg-amber-50 text-amber-700 border-amber-200`
- **Loading:** `animate-pulse` skeletons
- **Buttons:** Design system variants
- **Spacing:** 4px base grid
- **Typography:** System scale

---

## Next Steps

1. **Chromatic Deployment:** Configure `CHROMATIC_PROJECT_TOKEN`
2. ~~**Flow Stories:** Add interactive journey stories~~ ✅ **DONE** - CompleteWalkthrough implements full journey
3. **Accessibility Testing:** Verify ARIA labels and keyboard navigation
4. **Validation:** Run `/validate flagship-meeting-recap` for jury evaluation

---

_Generated by proto-builder subagent_
_Last updated: 2026-01-28_
