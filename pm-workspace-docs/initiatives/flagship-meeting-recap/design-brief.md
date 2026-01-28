# Flagship Meeting Recap - Design Brief

**Status:** Prototype-Ready (Post-Audit)
**Owner:** Tyler Sahagun (PM) + [Designer TBD]
**Last Updated:** 2026-01-28
**Audit Status:** ✅ P0 gaps addressed

---

## Design Challenge

Transform meeting recaps from workflow byproducts into a flagship, first-class experience. Users should configure templates through conversation, view beautiful dedicated artifacts, and edit outputs in-place.

**Key Question:** How do we make AI configuration feel like talking to a helpful colleague, not filling out a form?

---

## Design Principles

### 1. Conversation Over Configuration

> "Your settings are not toggles anymore... It's a chat... AI first." — Leadership

Configuration should feel like explaining what you want to a smart assistant, not navigating settings panels.

### 2. Preview While You Configure

Users need to see the output as they describe it. Left panel: chat. Right panel: live artifact preview.

### 3. Edit Where You See It

If something's wrong, fix it right there. No navigation to "find the workflow."

### 4. Beautiful, Dedicated, Focused

Not inline markdown in a chat thread. A polished artifact view that users are proud to share.

### 5. Sensible Defaults, Easy Overrides

Auto-detect meeting type. User can override with one click. System learns from corrections.

---

## Key Screens (To Design)

### Screen 1: Template Configuration Chat

**Layout:** Split view

- Left (40%): Chat interface
- Right (60%): Live artifact preview

**Elements:**

- Chat messages with AI personality
- Example meeting data in preview
- "Looks good" / "Change this" quick actions
- Progress indicator (1 of 3 templates)

**Reference:** Notion AI setup, Figma AI assistant

---

### Screen 2: Meeting Page with Artifact Tabs

**Layout:** Meeting page redesign

- Top: Meeting header (title, date, participants)
- Tab bar: Recap | Coaching | Prep | [+]
- Content area: Selected artifact (full width, polished)
- Floating: Feedback icon (top-right of artifact)

**Elements:**

- Tab pills (active state, badge for new content)
- Pin/unpin tabs
- Artifact with clear sections, hierarchy, scannable format
- Feedback icon: dotted outline, tooltip "Don't like this?"

**Reference:** PostHog annotations, Linear issues, Notion page layout

---

### Screen 3: In-Place Edit via Global Chat

**Trigger:** Click feedback icon on artifact

**Behavior:** Global chat slides open (right panel) with context:

- "I'm looking at the recap for [Meeting Name]."
- "What would you like to change?"

**Elements:**

- Pre-filled context in chat
- Quick suggestion chips: "More concise" "Add section" "Change format"
- Preview updates in background as user describes changes
- "Apply to future calls" toggle

**Reference:** PostHog feedback flow, Intercom messenger

---

### Screen 4: Share to Channel Modal

**Trigger:** Click "Share" on artifact

**Layout:** Modal overlay

**Elements:**

- Channel icons: Slack, HubSpot, Teams, Email, Copy
- Selection shows channel-specific options:
  - Slack: DM/Channel picker
  - HubSpot: Deal/Contact picker
  - Teams: Chat/Channel picker
- Preview of how recap will appear in channel
- "Edit before sending" link
- Confirm button with channel icon

**Reference:** Slack share modal, Notion export

---

### Screen 5: Meeting Type Detection

**Trigger:** Meeting ends, system detects type

**Behavior:** Subtle banner or inline confirmation

**Elements:**

- Detected type: "This looks like a Discovery call"
- Confidence indicator (optional)
- Override dropdown: [Change type]
- "Remember for calls with [participant]" checkbox

**Reference:** Gmail smart labels, Slack channel suggestions

---

## Visual Direction (Preliminary)

### Artifact Aesthetics

- Clean white background with subtle borders
- Clear section headers with divider lines
- Bullet points with custom icons (not generic dots)
- Highlight colors for key items (action items in accent color)
- Ample whitespace—scannable, not dense

### Chat Aesthetics

- Warm AI personality (not robotic)
- Progress indicators for multi-step flows
- Quick action chips to accelerate configuration
- Celebratory moment when setup completes

### Tab Bar

- Pill-style tabs
- Active tab: filled accent color
- Inactive: subtle border, hover state
- Badge for unread content (dot or count)
- Overflow: "+N more" or horizontal scroll

---

## Accessibility Considerations

- Tab navigation for artifact sections
- Screen reader labels for feedback icon
- Color contrast meets WCAG AA
- Keyboard shortcut for global chat (Cmd+K already exists)

---

## Open Design Questions

1. **Artifact Format:** Card-based sections vs continuous scroll?
2. **Preview Position:** Side panel vs overlay vs full replacement?
3. **Tab Limit:** How many tabs before overflow? User-sortable?
4. **Edit Mode:** Inline edit vs modal vs side panel chat?
5. **Share Confirmation:** Modal vs toast vs inline?
6. **Meeting Type Override:** Dropdown vs type-ahead vs chat command?

---

## State Design Matrix (Required for All Screens)

| Screen             | Loading                         | Success                                | Error                                                     | Low Confidence                                             | Empty                         |
| ------------------ | ------------------------------- | -------------------------------------- | --------------------------------------------------------- | ---------------------------------------------------------- | ----------------------------- |
| **Chat Config**    | Skeleton preview with pulse     | "Saved!" toast                         | "Couldn't generate. [Retry] [Skip]"                       | "Did you mean...? [Yes] [No, I meant...]"                  | First AI prompt               |
| **Artifact Tabs**  | Section-by-section skeleton     | Full polished artifact                 | "Couldn't generate. [View transcript] [Retry]"            | Amber border + "Verify this"                               | Tab hidden entirely           |
| **In-Place Edit**  | Typing indicator in chat        | Preview refreshes with change          | "I didn't understand. Try: [Suggestion 1] [Suggestion 2]" | "Here's what I think you meant. [Looks right] [Try again]" | N/A                           |
| **Share Modal**    | "Sending to HubSpot..." spinner | "Sent! [View in HubSpot]" + undo toast | "Couldn't connect. [Reconnect] [Copy instead]"            | N/A                                                        | N/A                           |
| **Type Detection** | N/A (instant)                   | Banner: "Discovery call" with override | "Couldn't detect. [Select type]"                          | "Might be Demo (60%)" muted style                          | "I'll learn as you tag calls" |

---

## Loading State Designs

### Artifact Skeleton

```
┌─────────────────────────────────────────┐
│ ████████████████████  ← Title skeleton  │
│ ██████████ ████████ ████               │
├─────────────────────────────────────────┤
│ ████████████  ← Section header          │
│ ████████████████████████████████        │
│ ██████████████████████████              │
│ ████████████████████████████████████    │
│                                         │
│ ████████████  ← Section header          │
│ • ████████████████████████              │
│ • ██████████████████████████████        │
│ • ████████████████████████              │
└─────────────────────────────────────────┘
```

- Use `animate-pulse` from design system
- Sections appear progressively (not all at once)
- Show real section headers when available

### Preview Generation

```
┌─────────────────────────────────────────┐
│                                         │
│      ⟳  Generating preview...          │
│      [Skeleton sections below]          │
│                                         │
│ ████████████████████████████████        │
│ ██████████████████████████              │
└─────────────────────────────────────────┘
```

### Chat Thinking State

```
┌─────────────────────────────────────────┐
│ You: Make it more bullet-pointed        │
│                                         │
│ AI: ●●●  ← Typing indicator             │
│     Updating your template...           │
└─────────────────────────────────────────┘
```

---

## Low Confidence State Designs

### Meeting Type Detection (Low Confidence)

```
┌─────────────────────────────────────────────────────────────┐
│ 🔍 This might be a Demo call (60% confident)                │
│    [Looks right]  [Change type ▾]                    [✕]   │
└─────────────────────────────────────────────────────────────┘
```

- Muted styling: `bg-slate-50 text-slate-600 border-slate-200`
- Lower confidence = more muted
- Always show confidence when < 80%

### Recap Content Uncertainty

```
┌─────────────────────────────────────────────────────────────┐
│ ⚠️ Some details may be uncertain                            │
│    The audio quality was low for parts of this call.       │
│    [Review flagged sections]                               │
└─────────────────────────────────────────────────────────────┘
```

- Amber styling: `bg-amber-50 text-amber-700 border-amber-200`
- Appears at top of artifact
- Links to sections with uncertainty markers

### Within Artifact (Uncertain Section)

```
│ ## Action Items                                             │
│ ┌───────────────────────────────────────────────────────┐  │
│ │ 🟡 • Schedule follow-up call (I think John mentioned │  │
│ │      next week, but I'm not certain)                  │  │
│ │    [Edit] [Remove]                                    │  │
│ └───────────────────────────────────────────────────────┘  │
```

- Inline amber highlight
- Hedging language in AI text
- Easy to edit or remove

---

## Error State Designs

### Artifact Generation Failed

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│          ❌ Couldn't generate recap                         │
│                                                             │
│     There was a problem analyzing this meeting.             │
│                                                             │
│     [View transcript]    [Try again]                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

- Replaces artifact content area
- Primary action: View transcript (always works)
- Secondary: Retry

### Share Failed

```
┌─────────────────────────────────────────────────────────────┐
│ ❌ Couldn't send to HubSpot                                 │
│                                                             │
│    HubSpot connection expired.                              │
│                                                             │
│    [Reconnect HubSpot]    [Copy to clipboard instead]       │
└─────────────────────────────────────────────────────────────┘
```

- Modal stays open
- Clear explanation
- Alternative action always available

### Chat Misunderstanding

```
┌─────────────────────────────────────────────────────────────┐
│ You: Add the thing with the stuff                           │
│                                                             │
│ AI: I'm not sure what you mean. Did you want to:            │
│     • Add a new section?                                    │
│     • Change the format?                                    │
│     • Include more details?                                 │
│                                                             │
│     Or describe it a different way.                         │
└─────────────────────────────────────────────────────────────┘
```

- Never says "I don't understand"
- Offers concrete options
- Keeps conversation open

---

## Trust & Privacy Copy

### Template Configuration

| Moment               | Copy                                                                                  |
| -------------------- | ------------------------------------------------------------------------------------- |
| Start of config      | "Let's set up your meeting recaps. Your templates are private—only you can see them." |
| After first template | "Nice! I'll use this for your Discovery calls. You can always change it later."       |
| Config complete      | "All set! Your recaps will now match how you think about different calls."            |

### Artifact View

| Moment                | Copy                                          |
| --------------------- | --------------------------------------------- |
| Feedback icon tooltip | "Not quite right? Tell me what to change."    |
| After edit            | "Got it—I'll remember this for future calls." |
| Share preview         | "Only you can see this until you share it."   |

### Low Confidence

| Moment            | Copy                                                            |
| ----------------- | --------------------------------------------------------------- |
| Type detection    | "This might be a Demo call. Does that look right?"              |
| Recap uncertainty | "I'm not 100% confident on some details. Give it a quick look?" |
| Edit uncertainty  | "Here's what I think you meant. Is this right?"                 |

### Error Recovery

| Moment            | Copy                                                                          |
| ----------------- | ----------------------------------------------------------------------------- |
| Generation failed | "Something went wrong—but your transcript is safe. Want to try again?"        |
| Share failed      | "Couldn't reach HubSpot. You can reconnect or just copy the recap."           |
| Timeout           | "This is taking longer than usual. Want to keep waiting or check back later?" |

---

## Undo Toast Design

```
┌──────────────────────────────────────────────────────────────┐
│ ✓ Template updated                              [Undo] (8s) │
└──────────────────────────────────────────────────────────────┘
```

- Appears bottom-center
- Countdown indicator (circle depleting)
- Auto-dismiss after 10s
- Manual dismiss with X
- "Undo" reverses last action

For share actions:

```
┌──────────────────────────────────────────────────────────────┐
│ ✓ Sent to HubSpot                              [Undo] (28s) │
└──────────────────────────────────────────────────────────────┘
```

- 30s window for share undo
- Undo actually deletes from HubSpot

---

## Accessibility Requirements

### Keyboard Navigation

| Element          | Keys                                  | Behavior           |
| ---------------- | ------------------------------------- | ------------------ |
| Chat input       | Tab to focus, Enter to send           | Standard input     |
| Tab bar          | Tab to bar, Arrow keys between tabs   | Standard tab panel |
| Feedback icon    | Tab to focus, Enter/Space to activate | Button pattern     |
| Share modal      | Tab trap, Escape to close             | Modal pattern      |
| Detection banner | Tab to buttons, Escape to dismiss     | Alert pattern      |

### ARIA Attributes

| Element          | Attribute   | Value                        |
| ---------------- | ----------- | ---------------------------- |
| Preview panel    | `aria-live` | `polite` (updates announced) |
| Loading skeleton | `aria-busy` | `true` while loading         |
| Detection banner | `role`      | `status`                     |
| Tab panel        | `role`      | `tablist`, `tab`, `tabpanel` |
| Error messages   | `role`      | `alert`                      |

### Screen Reader Announcements

| Event              | Announcement                         |
| ------------------ | ------------------------------------ |
| Preview generating | "Generating preview"                 |
| Preview ready      | "Preview updated"                    |
| Template saved     | "Template saved successfully"        |
| Type detected      | "Meeting detected as Discovery call" |
| Error              | "Error: [specific message]"          |

### Reduced Motion

- Skeleton pulse → static gray
- Typing indicator → static dots
- Preview transition → instant swap
- Toast countdown → static text "(10s remaining)"

### Color Independence

All states use icons + text, not just color:

- Success: ✓ checkmark + green
- Error: ✕ or ❌ + red
- Warning: ⚠️ or 🟡 + amber
- Info: ℹ️ or 🔍 + blue

---

## Prototype Plan

### Phase 1: Configuration Chat (Week 1)

Create Storybook stories for:

- ChatConfiguration.stories.tsx (all states)
- ArtifactPreview.stories.tsx
- Flow_SetupComplete.stories.tsx

### Phase 2: Artifact View (Week 2)

Create Storybook stories for:

- MeetingArtifactTabs.stories.tsx
- RecapArtifact.stories.tsx (Loading, Success, Error, Empty)
- CoachingArtifact.stories.tsx
- PrepArtifact.stories.tsx

### Phase 3: Edit & Share (Week 3)

Create Storybook stories for:

- InPlaceEditFlow.stories.tsx
- ShareModal.stories.tsx
- ChannelPreview.stories.tsx

---

## Reference Implementations

| Feature       | Reference Product   | What to Learn                 |
| ------------- | ------------------- | ----------------------------- |
| Chat config   | Notion AI setup     | Conversational onboarding     |
| Artifact tabs | Linear issues       | Tab UX, state management      |
| In-place edit | PostHog annotations | Feedback icon pattern         |
| Channel share | Slack share         | Modal design, channel picker  |
| Live preview  | Figma AI            | Real-time generation feedback |

---

## Next Steps

1. **PM:** Complete PRD (done)
2. **Design:** Review brief, identify questions
3. **Design:** Wireframes for key screens
4. **PM + Design:** Review with Sam
5. **Design:** High-fidelity mockups
6. **PM:** Storybook prototype with proto-builder

---

_Owner: Tyler Sahagun_
_Design Partner: TBD_
