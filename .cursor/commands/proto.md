# Prototype Builder

You build interactive Storybook prototypes in `elephant-ai/web/src/components/prototypes/`. Your goal is to create **multiple creative options** that meet human-centric AI design standards, enabling informed design decisions.

## Auto-Context Loading

When building a prototype for an initiative, automatically load context per `context-orchestrator.mdc`:

1. Load foundation: `@pm-workspace-docs/company-context/product-vision.md`, `strategic-guardrails.md`
2. Load initiative metadata: `@pm-workspace-docs/initiatives/[name]/_meta.json`
3. Load PRD: `@pm-workspace-docs/initiatives/[name]/prd.md`
4. Load Design Brief: `@pm-workspace-docs/initiatives/[name]/design-brief.md`
5. Load human-centric AI research: `@pm-workspace-docs/research/human-centric-ai-design-research.md`

## Design-First Mindset

Before writing code, internalize these principles from `pm-workspace-docs/research/human-centric-ai-design-research.md`:

### Trust Calibration
- **Receipts, not black boxes**: Every AI action needs visible evidence
- **Progressive disclosure**: Summaries before details, suggestions before automation
- **Graceful failure**: All AI features will fail—design for recovery

### Emotional Design (Don Norman)
- **Visceral**: Does it look trustworthy at first glance?
- **Behavioral**: Does it work predictably and efficiently?
- **Reflective**: Does using it make users feel capable, not dependent?

### Persona Awareness
- **Sales Reps**: Fear surveillance and replacement; AI must make them look good
- **Sales Managers**: Need insights, not surveillance tools
- **RevOps**: Need visibility and auditability

## Before Building

1. Read the PRD: `pm-workspace-docs/initiatives/[project]/prd.md`
2. Read the Design Brief: `pm-workspace-docs/initiatives/[project]/design-brief.md`
3. Read the research: `pm-workspace-docs/research/human-centric-ai-design-research.md`
4. Study patterns in `elephant-ai/web/src/components/`

## Creative Exploration Process

### Step 1: Generate 2-3 Creative Directions

For each major component, create distinct approaches:

| Direction | Philosophy | Best For |
|-----------|-----------|----------|
| **Option A** | Maximum control—user confirms everything | Low-trust users, high-stakes actions |
| **Option B** | Balanced—AI suggests, easy override | Most users, building trust |
| **Option C** | Maximum efficiency—AI acts, user reviews | Power users, routine tasks |

### Step 2: Build All Options as Storybook Stories

```typescript
const meta = {
  title: 'Prototypes/[Initiative]/v1/[ComponentName]',  // Include version in path!
  component: ComponentName,
};

// Creative Options (within v1)
export const OptionA_MaxControl: Story = { ... };
export const OptionB_Balanced: Story = { ... };
export const OptionC_Efficient: Story = { ... };
```

### Step 3: Document Design Rationale

In each story, add a `docs` block explaining:
- What trust level this assumes
- Which persona this optimizes for
- Tradeoffs made

## Required AI States

Every prototype with AI features MUST include all states:

| State | Visual Treatment | Copy Pattern | Animation |
|-------|-----------------|--------------|-----------|
| **Loading (short)** | Subtle spinner | None needed | Pulse |
| **Loading (long)** | Progress stages | "Analyzing your calls..." | Stage transitions |
| **Success** | Check mark, muted | Affirming, brief | Scale + fade (150ms) |
| **Error** | Warning icon | Honest, solution-focused | Gentle shake |
| **Low Confidence** | Muted colors, dotted border | "I think...", hedging | None |
| **Empty** | Helpful illustration | Encouraging, actionable | Fade in |

### Create State Stories

```typescript
export const Loading: Story = { args: { state: 'loading' } };
export const LoadingLong: Story = { args: { state: 'loading-long', message: 'Analyzing 45-minute call...' } };
export const Success: Story = { args: { state: 'success' } };
export const Error: Story = { args: { state: 'error', error: 'Could not connect to HubSpot' } };
export const LowConfidence: Story = { args: { state: 'low-confidence', confidence: 0.6 } };
export const Empty: Story = { args: { state: 'empty' } };
```

## Trust & Emotion Checkpoints

Before finalizing any option, verify:

### Trust Checklist
- [ ] User understands what AI will do before it acts
- [ ] User can see evidence for AI decisions (receipts)
- [ ] User can easily undo AI actions
- [ ] AI admits uncertainty appropriately
- [ ] Failures are graceful and recoverable

### Emotion Checklist
- [ ] First impression feels trustworthy (visceral)
- [ ] Interactions are predictable (behavioral)
- [ ] User feels augmented, not replaced (reflective)
- [ ] Rep gets credit for AI-assisted work
- [ ] No surveillance vibes

### Accessibility Checklist
- [ ] Keyboard navigable
- [ ] Screen reader compatible (aria-live for dynamic content)
- [ ] Sufficient color contrast
- [ ] Reading level ≤ 8th grade for important info
- [ ] Animation respects `prefers-reduced-motion`

## Component Structure (Versioned from Start)

**ALWAYS** create prototypes in versioned subfolders, starting with `v1/`:

```
elephant-ai/web/src/components/prototypes/[Initiative]/
├── index.ts                      # Re-exports latest version
├── v1/
│   ├── [ComponentName].tsx           # Main component
│   ├── [ComponentName].stories.tsx   # All options + all states
│   ├── [ComponentName].docs.mdx      # Design rationale
│   ├── types.ts
│   └── index.ts                      # Version-specific exports
├── v2/                               # After iteration
│   └── ...
└── v3/                               # After user testing
    └── ...
```

**Root index.ts pattern:**
```typescript
// elephant-ai/web/src/components/prototypes/[Initiative]/index.ts
// Re-export the latest stable version
export * from './v1';
// Or after iterations: export * from './v2';
```

**Storybook title pattern:**
```typescript
const meta = {
  title: 'Prototypes/[Initiative]/v1/[ComponentName]',  // Include version in title
  component: ComponentName,
};
```

**Why versioned from start?**
- Easy to navigate in Storybook sidebar
- Preserves full history for comparison
- `/iterate` creates v2, v3, etc. naturally
- Stakeholders can compare versions side-by-side

## Tech Stack

- React 18 + TypeScript (strict mode)
- Tailwind CSS for styling
- shadcn/ui components from `@/components/ui/`
- Functional components with hooks only

## Running Storybook

```bash
cd elephant-ai
npm run storybook -w web    # Opens at http://localhost:6006
```

## After Building

1. Document in `pm-workspace-docs/initiatives/[project]/prototype-notes.md`:
   - Which options were created
   - Design rationale for each
   - Recommended direction with justification
   - Open questions for stakeholder review

2. **Update `_meta.json`**:
   ```json
   {
     "phase": "build",  // if advancing from define
     "updated_at": "[current timestamp]",
     "prototype_type": "standalone",  // Track prototype type for /iterate
     "current_version": "v1",  // Track current version
     "metrics": {
       "total_iterations": 1  // or increment
     }
   }
   ```
   
   **Prototype Type Values:**
   - `"standalone"` - Created with `/proto` (isolated, PRD-driven)
   - `"context"` - Created with `/context-proto` (integrated with app UI)
   - `"both"` - Both types exist (compare standalone vs integrated)
   
   **Version Tracking:**
   - `current_version` tracks which version folder is latest
   - `/iterate` increments this to `"v2"`, `"v3"`, etc.

3. **Update graduation criteria**:
   - Mark "prototype exists" as met
   - Mark "all states implemented" if complete

4. Publish Storybook to Chromatic (automatic on new prototypes):
   - Ensure Chromatic is installed: `npm install --save-dev chromatic`
   - Run from the prototype package root with the project token set as env:
     - `CHROMATIC_PROJECT_TOKEN="chpt_46b823319a0135f" npm run chromatic`
   - If the repo has multiple packages, run it where `storybook` is configured

5. Create comparison table for stakeholders:
   | Criteria | Option A | Option B | Option C |
   |----------|----------|----------|----------|
   | Trust level required | Low | Medium | High |
   | User control | Maximum | Balanced | Minimal |
   | Efficiency | Lower | Medium | Highest |
   | Learning curve | Lowest | Medium | Highest |
   | Best for persona | New users | Most users | Power users |

6. **Regenerate roadmap**:
   - Run `/roadmap refresh` if phase changed

7. **Suggest next steps**:
   - "Run `/validate [name]` to run jury evaluation"
   - "Run `/iterate [name]` when feedback arrives"

## Slack Response Template

```
✅ Prototype exploration complete for [initiative]!

🎨 **Creative Options (v1):**

**Option A: Maximum Control**
- User confirms every AI action
- Best for: Low-trust scenarios, new users
- Story: `OptionA_MaxControl`

**Option B: Balanced (Recommended)**
- AI suggests, easy override
- Best for: Most users, trust-building
- Story: `OptionB_Balanced`

**Option C: Maximum Efficiency**
- AI acts, user reviews
- Best for: Power users, routine tasks
- Story: `OptionC_Efficient`

📱 **Preview:**
- Local: `cd elephant-ai && npm run storybook -w web`
- Navigate to: Prototypes → [Initiative] → v1
- All states included: Loading, Success, Error, LowConfidence, Empty

📋 **Files:**
- Components: `elephant-ai/web/src/components/prototypes/[Initiative]/v1/`
- Rationale: `pm-workspace-docs/initiatives/[initiative]/prototype-notes.md`

🎯 **Recommendation:** Option B balances trust-building with efficiency.

**Next:** Run `/iterate [initiative]` when feedback arrives (creates v2 folder)
```

## Anti-Patterns to Avoid

🚩 **Confident wrongness** - Never show AI asserting uncertain info confidently
🚩 **Silent failure** - Always show what went wrong and how to fix it
🚩 **Over-automation** - Don't take actions without user understanding
🚩 **Surveillance vibes** - Frame as "helps YOU" not "reports ON you"
🚩 **Replacement framing** - Never imply AI replaces human value
🚩 **Single option** - Always explore multiple creative directions
