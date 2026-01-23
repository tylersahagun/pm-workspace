# Design Handoff

Hand off a PM prototype to a designer for visual refinement. This command generates the complete handoff package and tracks state.

## Core Principle

> **Move decisions between tools, not designs.**

Storybook = truth of implementation (behavior, states, props)  
Figma = truth of visual intent (spacing, colors, polish)  
Tokens = bridge between them (portable decisions)

---

## Usage

```
/design-handoff [initiative-name]
```

---

## What This Command Does

### Step 1: Validate Prototype Readiness

Check that the prototype is ready for handoff:

```
Checking: pm-workspace-docs/initiatives/[name]/

Required files:
✓ prd.md              - Problem, personas, metrics
✓ design-brief.md     - User flows, interaction patterns  
✓ prototype-notes.md  - What was built, Chromatic URL
✓ _meta.json          - Version, timestamps

Required stories:
✓ State stories       - Loading, Error, Success, Empty
✓ Flow stories        - Flow_HappyPath, Flow_ErrorRecovery
✓ Chromatic URL       - Deployed and shareable
```

**Extract Chromatic URL** from `prototype-notes.md` or `_meta.json`:
- Look for `storybookUrl` from Chromatic output (e.g., `https://main--67890abc.chromatic.com`)
- This is the base URL for all story links

**Extract Story IDs** from `.stories.tsx` files:
1. Read `elephant-ai/web/src/components/prototypes/[InitiativeName]/**/*.stories.tsx`
2. Extract the `title` from meta (e.g., `'Prototypes/SettingsRedesign/v2/PrivacySettings'`)
3. Extract exported story names (e.g., `Default`, `Loading`, `Flow_HappyPath`)
4. Convert to story IDs: `title` → lowercase, `/` → `-`, story name → lowercase with `-`

**Story ID Formula:**
```
{title-with-slashes-to-dashes}--{story-name-lowercase}

Example:
  title: 'Prototypes/SettingsRedesign/v2/PrivacySettings'
  story: 'Flow_HappyPath'
  → prototypes-settingsredesign-v2-privacysettings--flow-happy-path
```

**If missing:** Prompt to run `/proto [name]` or `/iterate [name]` first.

### Step 2: Choose Handoff Workflow

Present workflow options based on feature type:

```
Which workflow fits this handoff?

[A] Figma Refinement (Designer owns final pixels)
    → Visual polish needed, brand-critical, marketing-facing
    → Designer creates Figma, that becomes source of visual truth
    → Dev builds from: Figma (visuals) + Storybook (behavior)

[B] Code-First (Storybook stays source of truth)  
    → Functional/internal feature, rapid iteration needed
    → Designer reviews + provides feedback, no Figma required
    → Dev builds from: Storybook prototype directly

[C] Token Update (Designer refines visual decisions only)
    → Spacing, colors, typography adjustments
    → No new components or layouts needed
    → Designer updates design tokens → code auto-reflects

[D] Hybrid (Complex features needing both)
    → PM leads exploration, designer polishes specifics
    → Both Figma and Storybook maintained
    → Use component contracts to stay in sync
```

### Step 3: Generate Handoff Package

Based on workflow choice, generate appropriate files:

#### For Workflow A (Figma Refinement):

Create `pm-workspace-docs/initiatives/[name]/design-handoff.md`:

```markdown
# Design Handoff: [Initiative Name]

## TL;DR

**Problem:** [One sentence from PRD]
**Solution:** [What the prototype does]
**Your job:** Polish the visual design in Figma

> "[Key user quote showing the pain]"

---

## Links (Start Here)

| What | Link |
|------|------|
| 🖥️ **Live Prototype** | [{CHROMATIC_URL}]({CHROMATIC_URL}) |
| 🎯 **Default State** | [{CHROMATIC_URL}/iframe.html?id={STORY_PREFIX}--default]({CHROMATIC_URL}/iframe.html?id={STORY_PREFIX}--default) |
| 📋 **Full PRD** | [Link to prd.md] |
| 🎨 **Figma Template** | [Team template link] |

---

## What's Built (Don't Redesign)

These decisions are validated—preserve them:

| Decision | Rationale | Evidence |
|----------|-----------|----------|
| [e.g., Progressive disclosure] | [Why] | "[User quote]" |
| [e.g., Confidence indicators visible] | [Why] | [Data point] |
| [e.g., Undo always available] | [Why] | [Research ref] |

---

## What Needs Your Magic ✨

Polish these areas:

- [ ] **Spacing** - Currently 4px grid, refine rhythm
- [ ] **Icons** - Placeholders used, select final icons
- [ ] **Colors** - Verify contrast, brand alignment
- [ ] **Typography** - Hierarchy, weight, size
- [ ] **Empty state** - Illustration + messaging
- [ ] **Error state** - Visuals + tone
- [ ] **Motion** - Transitions, micro-interactions

---

## Story URLs (For Storybook Connect)

**Chromatic Base URL:** `{CHROMATIC_URL}` ← extracted from prototype-notes.md

Copy these into the Storybook Connect plugin in Figma:

| State | Story URL |
|-------|-----------|
| 🖥️ **Full Storybook** | [{CHROMATIC_URL}]({CHROMATIC_URL}) |
| Default | [{CHROMATIC_URL}/iframe.html?id={STORY_PREFIX}--default]({CHROMATIC_URL}/iframe.html?id={STORY_PREFIX}--default) |
| Loading | [{CHROMATIC_URL}/iframe.html?id={STORY_PREFIX}--loading]({CHROMATIC_URL}/iframe.html?id={STORY_PREFIX}--loading) |
| Success | [{CHROMATIC_URL}/iframe.html?id={STORY_PREFIX}--success]({CHROMATIC_URL}/iframe.html?id={STORY_PREFIX}--success) |
| Error | [{CHROMATIC_URL}/iframe.html?id={STORY_PREFIX}--error]({CHROMATIC_URL}/iframe.html?id={STORY_PREFIX}--error) |
| Empty | [{CHROMATIC_URL}/iframe.html?id={STORY_PREFIX}--empty]({CHROMATIC_URL}/iframe.html?id={STORY_PREFIX}--empty) |
| **Flow: Happy Path** | [{CHROMATIC_URL}/iframe.html?id={STORY_PREFIX}--flow-happy-path]({CHROMATIC_URL}/iframe.html?id={STORY_PREFIX}--flow-happy-path) |
| **Flow: Error Recovery** | [{CHROMATIC_URL}/iframe.html?id={STORY_PREFIX}--flow-error-recovery]({CHROMATIC_URL}/iframe.html?id={STORY_PREFIX}--flow-error-recovery) |

> **Story ID format:** `prototypes-{initiative}-v{version}-{componentname}--{storyname}`
> Example: `prototypes-settingsredesign-v2-privacysettings--default`

---

## Constraints

**Must preserve:**
- [Core interaction that tested well]
- [Trust-building element]
- [Accessibility requirement]

**Avoid:**
- [Anti-pattern from research]
- [Brand violation]

---

## When You're Done

1. Share Figma URL with PM
2. PM runs `/figma-sync [name] [figma-url]`
3. Dev builds from your Figma specs
```

#### For Workflow B (Code-First):

Create `pm-workspace-docs/initiatives/[name]/design-handoff.md`:

```markdown
# Design Review: [Initiative Name]

## TL;DR

**Problem:** [One sentence from PRD]
**Solution:** [What the prototype does]  
**Your job:** Review and provide feedback (no Figma needed)

---

## Links

| What | Link |
|------|------|
| 🖥️ **Live Prototype** | [{CHROMATIC_URL}]({CHROMATIC_URL}) |
| 🎯 **Default State** | [{CHROMATIC_URL}/iframe.html?id={STORY_PREFIX}--default]({CHROMATIC_URL}/iframe.html?id={STORY_PREFIX}--default) |
| 📋 **Full PRD** | [Link to prd.md] |

---

## Review Checklist

Please review the prototype and provide feedback on:

- [ ] Does the visual hierarchy feel right?
- [ ] Are the interactions intuitive?
- [ ] Any spacing/alignment issues?
- [ ] Color/contrast concerns?
- [ ] Typography improvements?
- [ ] Missing states or edge cases?

---

## How to Provide Feedback

**Option 1: Loom** (preferred)
Record yourself walking through + commenting

**Option 2: Annotations**
Screenshot + annotate in Figma/FigJam

**Option 3: Written**
Add comments to this file or Slack thread

---

## After Feedback

1. PM incorporates changes via `/iterate [name]`
2. You review again
3. Ship from Storybook (Figma not required)
```

#### For Workflow C (Token Update):

Create `pm-workspace-docs/initiatives/[name]/design-handoff.md`:

```markdown
# Token Refinement: [Initiative Name]

## TL;DR

**Current state:** Prototype built in Storybook
**Your job:** Refine visual tokens (spacing, colors, typography)
**No Figma components needed** - just update token values

---

## Links

| What | Link |
|------|------|
| 🖥️ **Live Prototype** | [{CHROMATIC_URL}]({CHROMATIC_URL}) |
| 🎯 **Default State** | [{CHROMATIC_URL}/iframe.html?id={STORY_PREFIX}--default]({CHROMATIC_URL}/iframe.html?id={STORY_PREFIX}--default) |
| 🎨 **Current Tokens** | `.interface-design/system.md` |

---

## Current Token Values

These are the values used in the prototype:

### Spacing
| Token | Current | Your Refinement |
|-------|---------|-----------------|
| Card padding | `p-6` (24px) | |
| Section gap | `gap-4` (16px) | |
| Inline gap | `gap-2` (8px) | |

### Colors
| Token | Current | Your Refinement |
|-------|---------|-----------------|
| Surface primary | `slate-950` | |
| Text muted | `slate-400` | |
| Action primary | `primary` | |

### Typography
| Token | Current | Your Refinement |
|-------|---------|-----------------|
| Heading | `text-lg font-semibold` | |
| Body | `text-sm` | |
| Caption | `text-xs text-muted-foreground` | |

---

## How to Update

**Option 1: Fill in table above**
I'll update the code to match

**Option 2: Tokens Studio** (if you have it)
Export updated tokens.json, I'll sync

**Option 3: Annotate Storybook**
Screenshot what should change

---

## After Token Updates

1. Share token changes with PM
2. PM updates `.interface-design/system.md`
3. Components auto-reflect new values
4. Review in Storybook for approval
```

#### For Workflow D (Hybrid):

Create `pm-workspace-docs/initiatives/[name]/design-handoff.md`:

```markdown
# Hybrid Handoff: [Initiative Name]

## TL;DR

**Problem:** [One sentence from PRD]
**Solution:** [What the prototype does]
**Your job:** Polish in Figma, we'll sync via component contracts

---

## Links

| What | Link |
|------|------|
| 🖥️ **Live Prototype** | [{CHROMATIC_URL}]({CHROMATIC_URL}) |
| 🎯 **Default State** | [{CHROMATIC_URL}/iframe.html?id={STORY_PREFIX}--default]({CHROMATIC_URL}/iframe.html?id={STORY_PREFIX}--default) |
| 📋 **Full PRD** | [Link to prd.md] |
| 📄 **Component Contract** | [Link to component-contract.json] |
| 🎨 **Figma Template** | [Team template link] |

---

## Component Contract

This is the shared agreement between design + code:

```json
{
  "component": "[ComponentName]",
  "props": {
    "variant": ["primary", "secondary", "ghost"],
    "size": ["sm", "md", "lg"],
    "disabled": "boolean"
  },
  "tokens": {
    "padding": "space.md → space.lg",
    "borderRadius": "radius.md",
    "backgroundColor": "color.surface.raised"
  },
  "ownership": {
    "visual_tokens": "design",
    "props_and_behavior": "engineering"
  }
}
```

**You own:** Visual token values (spacing, colors, radius)
**Engineering owns:** Props, variants, behavior

---

## Workflow

```
1. You review Storybook → understand behavior
2. You polish in Figma → update visual tokens
3. You share updated contract → token values changed
4. PM runs /figma-sync → code updates to match
5. Both tools stay in sync via contract
```

---

## What You Can Change (Visual Tokens)

- [ ] Spacing values
- [ ] Color values  
- [ ] Border radius
- [ ] Typography styles
- [ ] Shadow/elevation
- [ ] Animation timing

## What Stays Fixed (Props & Behavior)

- Variant names (primary, secondary, etc.)
- Prop types (boolean, enum, etc.)
- Interaction logic
- State machine

---

## When You're Done

1. Update token values in contract
2. Share Figma + updated contract
3. PM runs `/figma-sync [name] [figma-url]`
4. Review in Storybook for parity check
```

### Step 4: Generate Slack Message

Create `pm-workspace-docs/initiatives/[name]/design-handoff-slack.md`:

**IMPORTANT:** Replace all placeholders with actual values/URLs extracted from prototype.

```markdown
🎨 **Design Handoff: [Initiative Name]**

**The quick pitch:**
[1-2 sentence problem/solution]

> "[Key user quote]"

---

**Links:**
• 📋 Full brief: [GitHub/local link to design-handoff.md]
• 🖥️ Prototype: {CHROMATIC_URL}
• 📊 Version: v{VERSION}

**Key Stories:**
• [Default]({CHROMATIC_URL}/iframe.html?id={STORY_PREFIX}--default)
• [All States]({CHROMATIC_URL}/iframe.html?id={STORY_PREFIX}--loading)
• [Happy Path Flow]({CHROMATIC_URL}/iframe.html?id={STORY_PREFIX}--flow-happy-path)

---

**Your workflow:** [A/B/C/D]

**Quick start:**
1. Read the brief (5 min)
2. [Workflow-specific next step]
3. [Workflow-specific deliverable]

---

Let me know when ready for sync!
```

### Step 5: Update Meta

Update `pm-workspace-docs/initiatives/[name]/_meta.json` with **actual URLs**:

```json
{
  "handoff": {
    "workflow": "A",
    "status": "awaiting_design",
    "handoff_date": "2026-01-22",
    "designer": null,
    "chromatic_base_url": "https://main--67890abc.chromatic.com",
    "story_prefix": "prototypes-settingsredesign-v2-privacysettings",
    "story_urls": {
      "default": "https://main--67890abc.chromatic.com/iframe.html?id=prototypes-settingsredesign-v2-privacysettings--default",
      "loading": "https://main--67890abc.chromatic.com/iframe.html?id=prototypes-settingsredesign-v2-privacysettings--loading",
      "error": "https://main--67890abc.chromatic.com/iframe.html?id=prototypes-settingsredesign-v2-privacysettings--error",
      "empty": "https://main--67890abc.chromatic.com/iframe.html?id=prototypes-settingsredesign-v2-privacysettings--empty",
      "flow_happy_path": "https://main--67890abc.chromatic.com/iframe.html?id=prototypes-settingsredesign-v2-privacysettings--flow-happy-path",
      "flow_error_recovery": "https://main--67890abc.chromatic.com/iframe.html?id=prototypes-settingsredesign-v2-privacysettings--flow-error-recovery"
    },
    "figma_url": null,
    "notes": null
  }
}
```

### Step 6: Respond

Include the **actual Chromatic URLs** (not placeholders) in the response:

```
✅ Design handoff package created for [name]!

**Workflow:** [A/B/C/D] - [Description]

**Chromatic Preview:** https://main--67890abc.chromatic.com

**Story Links (click to view):**
| State | Link |
|-------|------|
| Full Storybook | https://main--67890abc.chromatic.com |
| Default | https://main--67890abc.chromatic.com/iframe.html?id=prototypes-settingsredesign-v2-privacysettings--default |
| Loading | https://main--67890abc.chromatic.com/iframe.html?id=prototypes-settingsredesign-v2-privacysettings--loading |
| Error | https://main--67890abc.chromatic.com/iframe.html?id=prototypes-settingsredesign-v2-privacysettings--error |
| Flow: Happy Path | https://main--67890abc.chromatic.com/iframe.html?id=prototypes-settingsredesign-v2-privacysettings--flow-happy-path |

**Files created:**
- pm-workspace-docs/initiatives/[name]/design-handoff.md
- pm-workspace-docs/initiatives/[name]/design-handoff-slack.md
- pm-workspace-docs/initiatives/[name]/_meta.json (updated)

**Slack message ready to copy:**
[Include the generated Slack message with real URLs]

**Next steps:**
1. Send Slack message to designer
2. Designer follows workflow in brief
3. When ready: `/figma-sync [name] [figma-url]` (for A/D) or `/iterate [name]` (for B/C)
```

---

## Workflow Decision Guide

| Feature Type | Recommended | Why |
|--------------|-------------|-----|
| Brand-critical / marketing | **A** | Designer needs pixel control |
| Internal tool / admin | **B** | Speed > polish |
| Spacing/color refinement | **C** | No new components needed |
| Complex multi-screen | **D** | Need both exploration + sync |
| MVP / fast iteration | **B** | Storybook is faster |
| Launch / GA feature | **A** or **D** | Worth the investment |

---

## Designer Setup (One-Time)

### Storybook Connect Plugin

1. Install: [Storybook Connect](https://www.figma.com/community/plugin/1056265616080331589/storybook-connect)
2. Authenticate with Chromatic
3. In Figma: Select frame → Run plugin → Paste story URL

### Figma Template (Optional)

Team template with:
- Standard artboards
- Design system components
- Storybook Connect in recents
- "How to Link" documentation page

---

## After Designer Completes

| Workflow | Designer Delivers | PM Runs |
|----------|-------------------|---------|
| A | Figma URL | `/figma-sync [name] [url]` |
| B | Feedback (Loom/annotations) | `/iterate [name]` |
| C | Token updates | Update `system.md`, rebuild |
| D | Figma URL + updated contract | `/figma-sync [name] [url]` |

---

## Tracking Handoff State

Use `/status [name]` to check:

```
Handoff Status: [name]
├── Workflow: A (Figma Refinement)
├── Status: awaiting_design
├── Designer: @designer
├── Handoff date: 2026-01-22
├── Prototype: https://main--67890abc.chromatic.com
├── Stories: 6 linked (default, loading, error, empty, flow_happy_path, flow_error_recovery)
└── Figma: [pending]
```

Status values:
- `awaiting_design` - Waiting for designer to start
- `in_progress` - Designer working in Figma
- `ready_for_sync` - Designer done, ready for `/figma-sync`
- `complete` - Synced and approved

---

## Integration

| Command | Relationship |
|---------|--------------|
| `/proto` | Creates prototype → triggers handoff prompt |
| `/iterate` | Updates prototype → can re-trigger handoff |
| `/figma-sync` | Pulls designer's Figma → updates code |
| `/status` | Shows handoff state |
| `/validate` | Can run on Storybook or Figma |
