# Design Handoff

Manage the handoff between PM prototypes (Storybook) and designer refinement (Figma). This command helps you choose the right workflow and tracks handoff state.

## The Reality

**There is no bidirectional sync between Storybook and Figma.** 

- Storybook Connect lets designers VIEW stories in Figma (read-only)
- @storybook/addon-designs lets devs EMBED Figma in Storybook (read-only)
- Pixel-level editing MUST happen in Figma

## Choose Your Workflow

### Workflow A: "Figma Refinement" (Recommended for visual polish)

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   PM Proto   │ ──▶ │   Designer   │ ──▶ │    Figma     │ ──▶ │  Dev Build   │
│ (Storybook)  │     │   Reviews    │     │  Refinement  │     │ (from Figma) │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
```

**When to use:**
- Visual polish needed (spacing, colors, icons)
- Brand-critical or marketing-facing features
- Designer wants control over final pixel specs

**Process:**
1. PM builds functional prototype in Storybook (`/proto`)
2. Deploy to Chromatic for shareable URL
3. Designer reviews via Storybook Connect plugin in Figma
4. Designer creates/refines Figma file with pixel-perfect specs
5. Figma becomes source of truth for visual design
6. Dev references both: Figma (visuals) + Storybook (interaction/states)

### Workflow B: "Code-First" (Recommended for functional features)

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   PM Proto   │ ──▶ │   Designer   │ ──▶ │   Feedback   │ ──▶ │  Dev Builds  │
│ (Storybook)  │     │   Reviews    │     │  (Comments)  │     │ (from Proto) │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
```

**When to use:**
- Functional/internal features
- Rapid iteration needed
- Designer bandwidth limited
- Patterns already exist in design system

**Process:**
1. PM builds functional prototype in Storybook (`/proto`)
2. Deploy to Chromatic for shareable URL
3. Designer reviews and provides feedback (Loom, comments, annotations)
4. PM/Dev iterates in code (`/iterate`)
5. Storybook prototype becomes source of truth
6. Figma NOT required

### Workflow C: "Hybrid" (For complex features)

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   PM Proto   │ ──▶ │   Figma      │ ──▶ │ /figma-sync  │ ──▶ │  Dev Build   │
│ (Storybook)  │     │   Polish     │     │  (Re-sync)   │     │  (Final)     │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
```

**When to use:**
- Feature needs both rapid prototyping AND visual polish
- Designer wants to own final specs but PM leads exploration
- Multi-version iteration expected

**Process:**
1. PM builds functional prototype in Storybook (`/proto`)
2. Designer reviews, creates polished Figma version
3. Run `/figma-sync` to pull designer's specs back into code
4. Final implementation matches designer's Figma
5. Both tools stay in sync via Code Connect

---

## Setup Requirements

### For Designers (One-time - ~2 minutes)

1. **Install Storybook Connect** in Figma:
   - [Direct install link](https://www.figma.com/community/plugin/1056265616080331589/storybook-connect)
   - Click "Try it out" → Authenticate with Chromatic
   - Use email: `[your-work-email]` (same as Chromatic access)

2. **How to link a story:**
   - In Figma, select a component/frame
   - Run plugin: `Cmd/Ctrl + /` → "Storybook Connect"
   - Paste the story URL from your handoff brief
   - Link persists automatically across builds

### For PM/Dev (Already configured)

- Chromatic project: `chpt_b6891b00696fe57`
- `/proto` and `/iterate` commands deploy to Chromatic
- `/figma-sync` pulls from Figma when ready

---

## Auto-Generated Designer Package

When you run `/design-handoff [name]`, the command generates a **Designer Onboarding Package** that includes:

### 1. Pre-formatted Story URLs (Copy-Paste Ready)

```markdown
## Story URLs for Storybook Connect

Copy these into the Storybook Connect plugin in Figma:

| Component | Story URL |
|-----------|-----------|
| Main Component | `https://[chromatic-url]/iframe.html?id=prototypes-[name]--default` |
| Loading State | `https://[chromatic-url]/iframe.html?id=prototypes-[name]--loading` |
| Error State | `https://[chromatic-url]/iframe.html?id=prototypes-[name]--error` |
| Empty State | `https://[chromatic-url]/iframe.html?id=prototypes-[name]--empty` |
```

### 2. Figma Template File (Optional)

Create a team Figma template with:
- Standard artboard sizes pre-configured
- Design system components imported
- Storybook Connect plugin already installed (per-user, but shows in recents)
- Documentation page with linking instructions

**Template setup (one-time by design lead):**
1. Create a Figma file called "Prototype Polish Template"
2. Add standard artboards, design tokens, component library references
3. Add a "How to Link Storybook" documentation page
4. Save to team library as a template

**Designer usage:**
1. Duplicate template for new handoff
2. Story URLs already formatted in handoff brief
3. Just paste URLs into Storybook Connect

### 3. Slack/Email-Ready Handoff Message

The command generates a copy-paste message with context:

```
🎨 Design Handoff: [Initiative Name]

## The Quick Pitch
[1-2 sentence problem/solution from PRD]

> "[Key user quote that captures the pain]"

**Impact:** [Revenue/efficiency connection in one line]

---

## Links
- 🎯 **Full Brief (read first!):** [link to design-handoff.md]
- 🖥️ **Chromatic Preview:** [URL]
- 📋 **PRD:** [URL] 
- 📊 **Version:** v[N]

---

## Quick Start
1. **Read the brief** - 5 min to understand the WHY
2. Duplicate our Figma template: [template-link]
3. View prototype in Storybook Connect (plugin)
4. Story URLs in brief

---

## Key Design Decisions Already Made
1. [Decision 1 - e.g., "Progressive disclosure"] - see brief for rationale
2. [Decision 2 - e.g., "Confidence indicators visible"]
3. [Decision 3 - e.g., "Undo always available"]

---

## What Needs Your Magic ✨
- [ ] Visual polish (spacing, icons, color)
- [ ] Micro-copy refinement
- [ ] Motion/transitions
- [ ] Empty/error state illustration

---

**Questions?** Check the brief first, then ping me!
Let me know when Figma is ready for `/figma-sync`!
```

---

## Command Usage

### Prerequisites Check

Before running `/design-handoff`, the command verifies these files exist:

| Required | File | What It Provides |
|----------|------|------------------|
| ✅ | `prd.md` | Problem, personas, success metrics, scope |
| ✅ | `design-brief.md` | User flows, interaction patterns |
| ✅ | `prototype-notes.md` | What was built, Chromatic URL |
| ✅ | `_meta.json` | Version, prototype type, timestamps |
| 🟡 | `research.md` | User quotes (recommended but optional) |

**If missing required files:** Command prompts you to run `/PM [name]` or `/proto [name]` first.

### Prototype Completeness Check

The command also verifies the prototype has required elements:

| Required | Element | Why |
|----------|---------|-----|
| ✅ | State stories (Loading, Error, Success, Empty) | Shows all component states |
| ✅ | **Flow stories (`Flow_*`)** | Shows complete user journey |
| ✅ | Chromatic URL | Shareable preview for designer |
| 🟡 | Creative options (A, B, C) | Comparison (recommended) |

**If missing flow stories:** Command prompts:
> ⚠️ No `Flow_*` stories found. Designers need to see the full user journey, not just isolated states.
> Run `/iterate [name]` with instruction "add flow stories" before handoff.

### Start a Handoff

```
/design-handoff [initiative-name]
```

**What the command does:**

1. **Loads strategic context:**
   - `prd.md` → Problem, personas, success metrics, scope
   - `research.md` → User quotes, pain points, feature requests
   - `design-brief.md` → User flows, interaction patterns, edge cases
   - `prototype-notes.md` → Design decisions, rationale, open questions
   - `company-context/personas.md` → Full persona fears/goals
   - `company-context/strategic-guardrails.md` → Constraints, anti-patterns

2. **Reads prototype state** from `_meta.json` and Chromatic

3. **Generates comprehensive designer brief** with:
   - **The Why**: Problem, business impact, why now
   - **Who it's for**: Personas with fears/goals
   - **Customer journey**: Before → After transformation
   - **Design decisions**: What was decided and WHY (with evidence)
   - **Prototype details**: Chromatic URL, states, what's done
   - **Polish checklist**: What needs designer attention
   - **Constraints**: What to preserve, what to avoid

4. **Generates story URLs** for Storybook Connect

5. **Prompts for workflow choice** (A, B, or C)

6. **Creates handoff package:**
   - `design-handoff.md` - Full strategic brief for designer
   - `design-handoff-slack.md` - Quick Slack message with links
   - Updated `_meta.json` with handoff state

7. **Saves to** `pm-workspace-docs/initiatives/[name]/`

### Generated Files

```
pm-workspace-docs/initiatives/[name]/
├── design-handoff.md          # Full designer brief
├── design-handoff-slack.md    # Copy-paste Slack message
└── _meta.json                 # Updated with handoff state
```

### Outputs

### Track Handoff State

Add to initiative `_meta.json`:

```json
{
  "handoff": {
    "workflow": "A|B|C",
    "status": "awaiting_design|in_figma|ready_for_dev|complete",
    "prototype_url": "https://chromatic.com/...",
    "figma_url": "https://figma.com/...",
    "designer": "designer_name",
    "handoff_date": "2026-01-22",
    "notes": "Designer focusing on empty states and error messaging"
  }
}
```

### Check Handoff Status

```
/status [initiative-name]
```

Shows handoff state if present.

---

## Designer Brief Template

When handing off to a designer, generate this comprehensive brief by pulling from PRD, research, and company context:

```markdown
# Design Handoff: [Initiative Name]

## 🎯 The Why (Start Here)

### Problem We're Solving
[Pull from PRD problem statement - what pain point are we addressing?]

> "[Verbatim user quote from research.md showing the pain]"
> — [Persona], [Company type]

### Business Impact
- **Revenue connection**: [How does this feature drive revenue? Pull from PRD success metrics]
- **Customer retention**: [Does this reduce churn? Improve NPS?]
- **Efficiency gain**: [Time saved? Friction removed?]

### Why Now?
[What made this a priority? Customer requests? Competitive pressure? Strategic initiative?]

---

## 👤 Who This Is For

### Primary Persona
**[Persona name]** - [Role]

- **Their goal**: [What are they trying to accomplish?]
- **Their fear**: [What worries them about AI/automation?]
- **Success looks like**: [How do they know it worked?]

### Secondary Personas
- [Other personas affected, if any]

---

## 🗺️ Customer Journey

### Current State (Pain)
```
[User action] → [Friction point] → [Negative emotion]
```

Example:
```
Rep opens CRM → Sees stale data → Feels embarrassed in customer call
```

### Desired State (After This Feature)
```
[User action] → [Feature helps] → [Positive outcome]
```

Example:
```
Rep opens CRM → Sees AI-synced data with confidence indicator → Feels prepared
```

### Journey Map
| Stage | User Action | User Feeling | Feature Role |
|-------|-------------|--------------|--------------|
| Before | [action] | [emotion] | N/A |
| Trigger | [action] | [emotion] | [how we help] |
| During | [action] | [emotion] | [how we help] |
| After | [action] | [emotion] | [outcome] |

---

## 🧠 Key Design Decisions (And Why)

### Decision 1: [e.g., "Progressive disclosure over upfront complexity"]
- **What**: [Description of the decision]
- **Why**: [Rationale - user research, best practice, business reason]
- **Evidence**: "[Quote or data point]"

### Decision 2: [e.g., "Suggestion mode, not auto-action"]
- **What**: [Description]
- **Why**: [Rationale]
- **Evidence**: "[Quote or data point]"

### Decision 3: [e.g., "Show confidence levels explicitly"]
- **What**: [Description]
- **Why**: [Rationale]
- **Evidence**: "[Quote or data point]"

---

## 🎨 Prototype Overview

### Links
- **Chromatic URL**: [link]
- **PRD**: [link to pm-workspace-docs]
- **Research**: [link to research.md]
- **Version**: v[N]

### States Covered
- [ ] Default / Happy path
- [ ] Loading (short)
- [ ] Loading (long / processing)
- [ ] Success
- [ ] Error (with recovery)
- [ ] Low confidence
- [ ] Empty state

### Interactive User Journeys (Click Through!)

> 💡 **Start here!** These flow stories show the complete experience, not just isolated states.

| Journey | What It Shows | Chromatic Link |
|---------|---------------|----------------|
| `Flow_HappyPath` | Complete success journey | [View →]([url]) |
| `Flow_ErrorRecovery` | How users recover from errors | [View →]([url]) |
| `Flow_[EdgeCase]` | [Description] | [View →]([url]) |

**How to use flow stories:**
1. Click "Next Step →" to advance through the journey
2. See how states transition (not just what they look like)
3. Understand the complete user experience

### What's Implemented
- Functional interaction prototype
- **Interactive user journeys (Flow_* stories)**
- Core user flow complete
- All required states
- Responsive breakpoints (if applicable)

---

## ✨ What Needs Designer Polish

### Visual Refinement
- [ ] Spacing refinement (currently using 4px grid)
- [ ] Icon selection (placeholders used)
- [ ] Color/contrast verification
- [ ] Typography hierarchy
- [ ] Visual weight balance

### Content & Copy
- [ ] Micro-copy review (button labels, tooltips)
- [ ] Empty state messaging
- [ ] Error message tone
- [ ] Success confirmation copy

### Motion & Delight
- [ ] Animation timing
- [ ] Transition easing
- [ ] Loading state animation
- [ ] Micro-interactions

### Edge Cases
- [ ] Empty state illustration
- [ ] Error state visuals
- [ ] Low confidence state styling

---

## 🚫 Constraints & Guardrails

### Must Preserve
- [Core interaction patterns that tested well]
- [Trust-building elements like receipts/evidence]
- [Accessibility requirements]

### Avoid
- [Anti-patterns from research - e.g., "surveillance vibes"]
- [Brand/tone violations]
- [Overcomplication]

### Open Questions for Designer
1. [Question PM still has about visual approach]
2. [Alternative worth exploring?]
3. [Anything unclear?]

---

## 📋 Handoff Logistics

### Source of Truth Decision
- [ ] **Figma** will be source of truth (Workflow A)
- [ ] **Storybook** will be source of truth (Workflow B)

### Story URLs for Storybook Connect
| Component | Story URL |
|-----------|-----------|
| Default | `[url]` |
| Loading | `[url]` |
| Error | `[url]` |
| Empty | `[url]` |

### Timeline
- **Handoff date**: [date]
- **Design target**: [date]
- **Dev start**: [date]

### When Figma is Ready
1. Share Figma URL with PM
2. PM runs `/figma-sync [name] [url]` to pull specs
3. Or: Designer provides feedback for code-first iteration
```

---

## Context Sources (For Generating Brief)

When running `/design-handoff`, pull context from:

| Section | Source File |
|---------|-------------|
| Problem statement | `prd.md` → Problem Statement |
| User quotes | `research.md` → Key Quotes |
| Business impact | `prd.md` → Success Metrics |
| Personas | `prd.md` → Target Personas + `company-context/personas.md` |
| Customer journey | `design-brief.md` → User Flow |
| Design decisions | `design-brief.md` → Interaction Patterns + `prototype-notes.md` |
| Prototype details | `_meta.json` + Chromatic deployment |
| Constraints | `prd.md` → Out of Scope + `strategic-guardrails.md` |

---

## Integration with Other Commands

| Command | How It Integrates |
|---------|-------------------|
| `/proto` | Creates initial prototype, triggers handoff prompt |
| `/iterate` | Updates prototype, notifies designer of changes |
| `/figma-sync` | Re-syncs from Figma after designer polish |
| `/status` | Shows handoff state |
| `/validate` | Can run on either Figma or Storybook source |

---

## Recommended: Create a Team Figma Template

**Why:** Reduces designer setup from ~10 minutes to ~1 minute per handoff.

### One-Time Setup (Design Lead)

1. **Create template file:** `AskElephant - Prototype Polish Template`

2. **Add standard pages:**
   ```
   📄 Cover (project name, links)
   📄 How to Use This Template
   📄 Component Polish
   📄 States (Loading, Error, Empty, Success)
   📄 Responsive Breakpoints
   ```

3. **Pre-configure:**
   - Import design system components from team library
   - Add standard artboard sizes (1440px, 1024px, 375px)
   - Include color/spacing tokens reference
   - Add "Storybook Connect" to recently used plugins

4. **Add documentation page:**
   ```markdown
   # How to Link Storybook
   
   1. Select a frame/component
   2. Press Cmd+/ → "Storybook Connect"
   3. Paste the story URL from your handoff brief
   4. Click "Link"
   
   Story URLs are in your Slack/handoff message.
   ```

5. **Save as team template:**
   - File → Save to Team Library as Template
   - OR keep in a "Templates" project for duplication

### Designer Workflow (After Template Exists)

```
1. Receive /design-handoff message in Slack
2. Click "Duplicate Template" link
3. Open Storybook Connect, paste URLs from message
4. Start polishing!
```

**Time saved:** ~8-10 minutes per handoff

---

## Anti-Patterns

🚩 **Expecting bidirectional sync** - It doesn't exist. Choose a source of truth.
🚩 **Skipping handoff decision** - Ambiguity causes rework
🚩 **Designer editing code** - Unless they want to, keep them in Figma
🚩 **Forgetting Chromatic URL** - Designer needs shareable link
🚩 **No handoff tracking** - Use `_meta.json` to track state
🚩 **No Figma template** - Every handoff shouldn't require fresh setup

---

## Tools Reference

### Storybook Connect (Figma Plugin)
- **What**: View live Storybook stories in Figma
- **Direction**: Storybook → Figma (view only)
- **Docs**: https://chromatic.com/docs/figma-plugin

### @storybook/addon-designs
- **What**: Embed Figma frames in Storybook
- **Direction**: Figma → Storybook (view only)
- **Docs**: https://storybook.js.org/addons/@storybook/addon-designs

### Figma Code Connect (MCP)
- **What**: Map Figma components to code files
- **Direction**: Bidirectional mapping (not sync)
- **Tool**: `mcp_Figma_add_code_connect_map`
