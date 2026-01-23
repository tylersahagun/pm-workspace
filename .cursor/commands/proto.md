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

## REQUIRED: Interactive User Journey Stories

> ⚠️ **Every prototype MUST include flow stories** that show the complete user journey.
> Isolated states are NOT enough - stakeholders and designers need to see how the experience unfolds.

### Why Flows Are Required

Designers often see isolated components but don't understand:
- How does the user GET here?
- What happens when they click?
- How does the experience transition between states?
- What's the complete journey from problem to solution?

### Create Flow Stories

```typescript
// At least one interactive journey per prototype
export const Flow_HappyPath: Story = {
  render: () => <ComponentNameJourney scenario="happy" />,
  parameters: {
    docs: {
      description: {
        story: `
**Happy Path Journey**
1. User opens feature
2. User configures settings
3. System processes (loading)
4. Success confirmation
5. User sees result

Click through each step to experience the full flow.
        `,
      },
    },
  },
};

export const Flow_ErrorRecovery: Story = {
  render: () => <ComponentNameJourney scenario="error" />,
  parameters: {
    docs: {
      description: {
        story: `
**Error Recovery Journey**
1. User submits action
2. Loading state
3. Error occurs
4. User clicks "Retry"
5. Success on retry

Shows how users recover from failures.
        `,
      },
    },
  },
};
```

### Flow Component Template

Create `[ComponentName]Journey.tsx` alongside your main component:

```typescript
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ComponentName } from './ComponentName';

type Step = 'initial' | 'configuring' | 'loading' | 'success' | 'error';

const HAPPY_PATH: Step[] = ['initial', 'configuring', 'loading', 'success'];
const ERROR_PATH: Step[] = ['initial', 'configuring', 'loading', 'error', 'loading', 'success'];

interface JourneyProps {
  scenario: 'happy' | 'error';
}

export function ComponentNameJourney({ scenario }: JourneyProps) {
  const steps = scenario === 'happy' ? HAPPY_PATH : ERROR_PATH;
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentStep = steps[currentIndex];

  const stepDescriptions: Record<Step, string> = {
    initial: 'User arrives at the feature for the first time',
    configuring: 'User fills in their preferences',
    loading: 'System is processing the request',
    success: 'Action completed successfully!',
    error: 'Something went wrong - recovery options shown',
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Journey Progress Bar */}
      <div className="p-4 bg-muted rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-medium">Step {currentIndex + 1} of {steps.length}</span>
        </div>
        <div className="flex gap-1">
          {steps.map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-2 flex-1 rounded",
                i <= currentIndex ? "bg-primary" : "bg-muted-foreground/20"
              )}
            />
          ))}
        </div>
      </div>

      {/* Current Step Label */}
      <div className="text-center">
        <span className="text-xs uppercase tracking-wide text-muted-foreground">Current State</span>
        <h3 className="text-lg font-semibold capitalize">{currentStep.replace('-', ' ')}</h3>
        <p className="text-sm text-muted-foreground">{stepDescriptions[currentStep]}</p>
      </div>

      {/* The Actual Component */}
      <div className="border rounded-lg p-6">
        <ComponentName state={currentStep} />
      </div>

      {/* Journey Controls */}
      <div className="flex justify-center gap-4">
        <Button
          variant="outline"
          onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
          disabled={currentIndex === 0}
        >
          ← Back
        </Button>
        <Button
          onClick={() => setCurrentIndex(Math.min(steps.length - 1, currentIndex + 1))}
          disabled={currentIndex === steps.length - 1}
        >
          Next Step →
        </Button>
        <Button variant="ghost" onClick={() => setCurrentIndex(0)}>
          Restart
        </Button>
      </div>
    </div>
  );
}
```

### Minimum Flow Requirements

| Prototype Type | Required Flows |
|----------------|----------------|
| Simple feature | 1 (happy path) |
| AI/async feature | 2 (happy + error) |
| Multi-step workflow | 3+ (happy + error + edge cases) |

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

## After Building (REQUIRED STEPS)

> ⛔ **STOP**: You MUST complete ALL steps below before responding to the user.
> The prototype is NOT complete until a Chromatic URL is included in your response.

### Step 1: Build Storybook

**Run this command** (not optional):

```bash
cd elephant-ai && npm run build-storybook -w web
```

**If build fails:** Fix errors and re-run. Do NOT proceed until build passes.

### Step 2: Deploy to Chromatic

**Run this command** (not optional):

```bash
cd elephant-ai && npm run chromatic
```

**You MUST capture these URLs from the output:**
- `storybookUrl` → The shareable preview (e.g., `https://<hash>--672502f3cbc6d0a63fdd76aa.chromatic.com`)
- `buildUrl` → The Chromatic build page

**If you see "React error #299"**: The Storybook is still published. Look for the `storybookUrl` in the output—it works despite the error.

### Step 3: Verify Before Responding

**Checklist (all must be true):**
- [ ] `npm run build-storybook -w web` completed successfully
- [ ] `npm run chromatic` was executed
- [ ] Chromatic URL captured and will be in response
- [ ] Changes committed and pushed to elephant-ai submodule

**If ANY item is unchecked, go back and complete it.**

### Step 4: Document the Prototype

1. Document in `pm-workspace-docs/initiatives/[project]/prototype-notes.md`:
   - Which options were created
   - Design rationale for each
   - Recommended direction with justification
   - Open questions for stakeholder review
   - **Chromatic URL for sharing**

2. **Update `_meta.json`**:
   ```json
   {
     "phase": "build",
     "updated_at": "[current timestamp]",
     "prototype_type": "standalone",
     "current_version": "v1",
     "chromatic_url": "[captured from chromatic output]",
     "metrics": {
       "total_iterations": 1
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

4. Create comparison table for stakeholders:
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

## Response Template

```
✅ Prototype exploration complete for [initiative]!

🔗 **Chromatic Preview (shareable):**
https://[branch]--[appId].chromatic.com/?path=/story/prototypes-[initiative]-v1

📱 **Build Status:**
- Storybook build: ✅ Passed
- Chromatic deploy: ✅ Published
- Build URL: https://www.chromatic.com/build?appId=...&number=XX

---

🎨 **Creative Options (v1):**

**Option A: Maximum Control**
- User confirms every AI action
- Best for: Low-trust scenarios, new users
- [View in Chromatic](chromatic-url?path=/story/prototypes-[initiative]-v1-optiona-maxcontrol)

**Option B: Balanced (Recommended)**
- AI suggests, easy override
- Best for: Most users, trust-building
- [View in Chromatic](chromatic-url?path=/story/prototypes-[initiative]-v1-optionb-balanced)

**Option C: Maximum Efficiency**
- AI acts, user reviews
- Best for: Power users, routine tasks
- [View in Chromatic](chromatic-url?path=/story/prototypes-[initiative]-v1-optionc-efficient)

📦 **All States Included:**
Loading, LoadingLong, Success, Error, LowConfidence, Empty

🚶 **Interactive Journeys:**
- `Flow_HappyPath` - Complete success journey (click through)
- `Flow_ErrorRecovery` - Error handling journey (click through)

---

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
🚩 **States without flows** - Isolated states ≠ understanding the journey; ALWAYS include Flow_* stories
🚩 **No journey context** - Designer must see HOW user gets here, not just what they see