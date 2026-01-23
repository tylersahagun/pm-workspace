# In-Context Prototype Builder

You build prototypes that demonstrate how a feature will look and feel **integrated with the actual AskElephant app UI**. Unlike `/proto` which creates isolated components, `/context-proto` researches where the feature belongs and builds it in that production context—with real navigation, layouts, and adjacent features.

## Purpose

| Command | Approach | Best For |
|---------|----------|----------|
| `/proto` | Standalone, PRD-driven | Exploring the feature itself |
| `/context-proto` | Integrated, codebase-informed | Showing how it fits in the app |

Both are valid starting points. Run them independently to get two perspectives, then compare.

## What This Command Does

1. **Analyzes the codebase** to determine where this feature should live
2. **Recommends integration type** (new page, panel, modal, embedded section)
3. **Builds a prototype** showing the component in that context
4. **Documents the placement decision** for future reference

## Auto-Context Loading

When building a context prototype, automatically load:

1. Load foundation: `@pm-workspace-docs/company-context/product-vision.md`
2. Load initiative PRD: `@pm-workspace-docs/initiatives/[name]/prd.md`
3. Load Design Brief: `@pm-workspace-docs/initiatives/[name]/design-brief.md`
4. Study existing patterns: `@elephant-ai/web/src/components/`
5. Study navigation structure: `@elephant-ai/web/src/` routing and layouts
6. If exists, load prior standalone prototype: `@elephant-ai/web/src/components/prototypes/[ProjectName]/`

## No Prerequisites Required

Unlike the standalone `/proto`, this command does its own analysis:
- Does NOT require `/proto` to run first (builds fresh from PRD)
- Does NOT require `/placement` (does placement research inline)

However, if a standalone `/proto` exists, it will reference that work.

## Build Process

### Step 1: Placement Analysis (Inline)

Analyze the codebase to determine integration approach:

**Questions to answer:**
- What type of feature is this? (CRUD, dashboard, config, workflow step)
- Where do similar features live in the app?
- How do users discover this? (nav item, action button, link)
- What's the right container? (full page, side panel, modal, inline)

**Analyze these locations:**
```
elephant-ai/web/src/components/     # Existing component patterns
elephant-ai/web/src/pages/          # Page structure (if exists)
elephant-ai/web/src/app/            # App routing (if Next.js style)
```

**Output a placement decision:**

| Decision | Options |
|----------|---------|
| **Integration Type** | New Page \| Side Panel \| Modal \| Embedded Section \| Workflow Step |
| **Navigation Entry** | Sidebar item \| Header action \| Context menu \| Deep link only |
| **Parent Context** | Which existing page/view contains this |
| **Adjacent Features** | What's nearby that users might use together |

Save analysis to `pm-workspace-docs/initiatives/[name]/placement-research.md`

### Step 2: Create Context Shell

Build a realistic page/panel wrapper that mimics the production environment.

**Always use versioned folders:**

```
elephant-ai/web/src/components/prototypes/[Initiative]/
├── index.ts                             # Re-exports latest version
├── v1/
│   ├── [ComponentName].tsx              # Isolated component
│   ├── [ComponentName].stories.tsx      # Isolated stories
│   ├── types.ts
│   ├── index.ts
│   └── contexts/                        # Context prototypes
│       ├── [ComponentName]InPage.tsx
│       ├── [ComponentName]InPanel.tsx
│       ├── [ComponentName]Navigation.tsx
│       └── [ComponentName].context.stories.tsx
├── v2/                                  # After iteration
│   └── ...
└── v3/                                  # After user testing
    └── ...
```

**Root index.ts pattern:**
```typescript
// Re-export the latest stable version
export * from './v1';  // or './v2', './v3' after iterations
```

### Step 3: Build Context Components

#### A. Page Context Wrapper

```typescript
// contexts/[ComponentName]InPage.tsx
import { SidebarLayout } from '@/components/navigation/SidebarLayout';
import { PageHeader } from '@/components/ui/page-header';
import { ComponentName } from '../[ComponentName]';

export function ComponentNameInPage() {
  return (
    <SidebarLayout activeItem="[nav-item]">
      <PageHeader 
        title="[Page Title]"
        actions={/* relevant actions */}
      />
      <main className="flex-1 p-6">
        <ComponentName />
      </main>
    </SidebarLayout>
  );
}
```

#### B. Panel Context Wrapper

```typescript
// contexts/[ComponentName]InPanel.tsx
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { ComponentName } from '../[ComponentName]';

export function ComponentNameInPanel({ parentContext }: Props) {
  return (
    <div className="flex h-screen">
      {/* Simulated parent page */}
      <div className="flex-1 p-6">
        {parentContext}
      </div>
      
      {/* Panel with component */}
      <Sheet defaultOpen>
        <SheetContent>
          <ComponentName />
        </SheetContent>
      </Sheet>
    </div>
  );
}
```

#### C. Navigation Context

```typescript
// contexts/[ComponentName]Navigation.tsx
import { Sidebar } from '@/components/navigation/Sidebar';

export function ComponentNameNavigation({ highlighted }: { highlighted: boolean }) {
  return (
    <Sidebar>
      {/* Show where this item appears in nav */}
      <SidebarItem 
        active={highlighted}
        icon={<Icon />}
        label="[Feature Name]"
      />
    </Sidebar>
  );
}
```

### Step 4: Create Context Stories

```typescript
// v1/contexts/[ComponentName].context.stories.tsx
const meta = {
  title: 'Prototypes/[Initiative]/v1/InContext',  // Include version!
  parameters: {
    layout: 'fullscreen',  // Important for context views
  },
};

export default meta;

/**
 * Shows the component as it would appear on its dedicated page,
 * with full navigation and page header.
 */
export const AsFullPage: Story = {
  render: () => <ComponentNameInPage />,
  parameters: {
    docs: {
      description: {
        story: 'Component rendered as a full page with sidebar navigation.',
      },
    },
  },
};

/**
 * Shows the component in a side panel context,
 * sliding out from another page.
 */
export const AsSidePanel: Story = {
  render: () => <ComponentNameInPanel parentContext={<MockParentPage />} />,
  parameters: {
    docs: {
      description: {
        story: 'Component rendered in a slide-out panel from [parent page].',
      },
    },
  },
};

/**
 * Shows how users discover this feature in navigation.
 */
export const NavigationDiscovery: Story = {
  render: () => (
    <div className="flex gap-8">
      <div>
        <h3>Before (collapsed)</h3>
        <ComponentNameNavigation highlighted={false} />
      </div>
      <div>
        <h3>Selected</h3>
        <ComponentNameNavigation highlighted={true} />
      </div>
    </div>
  ),
};

/**
 * Shows the component alongside related features.
 */
export const WithAdjacentFeatures: Story = {
  render: () => (
    <AdjacentFeaturesLayout>
      <RelatedFeatureA />
      <ComponentName />
      <RelatedFeatureB />
    </AdjacentFeaturesLayout>
  ),
};

// ============================================================================
// REQUIRED: Interactive User Journeys
// ============================================================================

/**
 * Complete user journey showing how users discover, use, and complete
 * their task with this feature.
 */
export const Flow_HappyPath: Story = {
  render: () => <ComponentNameContextJourney scenario="happy" />,
  parameters: {
    docs: {
      description: {
        story: `
**Complete User Journey: Happy Path**

1. User navigates to [location] in app
2. User discovers the feature via [trigger]
3. User configures/interacts with component
4. System processes (loading)
5. Success → User sees outcome
6. User continues to next task

Click through to experience the full in-context flow.
        `,
      },
    },
  },
};

/**
 * Journey showing how users handle errors in context.
 */
export const Flow_ErrorRecovery: Story = {
  render: () => <ComponentNameContextJourney scenario="error" />,
  parameters: {
    docs: {
      description: {
        story: `
**Error Recovery Journey (In Context)**

1. User is on [parent page]
2. User triggers action
3. Error occurs → error state shown in context
4. User clicks recovery option
5. Success on retry

Shows how errors feel within the real app UI.
        `,
      },
    },
  },
};
```

### Context Journey Component

Create a journey wrapper that shows flows in full app context:

```typescript
// contexts/[ComponentName]ContextJourney.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { SidebarLayout } from '@/components/navigation/SidebarLayout';
import { ComponentName } from '../ComponentName';

type Step = 'browse' | 'discover' | 'interact' | 'loading' | 'success' | 'error';

export function ComponentNameContextJourney({ scenario }: { scenario: 'happy' | 'error' }) {
  const steps = scenario === 'happy' 
    ? ['browse', 'discover', 'interact', 'loading', 'success'] 
    : ['browse', 'discover', 'interact', 'loading', 'error', 'loading', 'success'];
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentStep = steps[currentIndex] as Step;

  return (
    <SidebarLayout activeItem="[nav-item]">
      {/* Journey Progress */}
      <div className="fixed top-4 right-4 z-50 bg-background border rounded-lg p-4 shadow-lg">
        <div className="text-sm font-medium mb-2">
          Step {currentIndex + 1} of {steps.length}: {currentStep}
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}>←</Button>
          <Button size="sm" onClick={() => setCurrentIndex(Math.min(steps.length - 1, currentIndex + 1))}>→</Button>
          <Button size="sm" variant="ghost" onClick={() => setCurrentIndex(0)}>Reset</Button>
        </div>
      </div>

      {/* Full Page Context */}
      <main className="flex-1 p-6">
        <ComponentName state={mapStepToState(currentStep)} />
      </main>
    </SidebarLayout>
  );
}
```

### Step 5: Document Integration Details

**Update `_meta.json`**:
```json
{
  "updated_at": "[current timestamp]",
  "prototype_type": "context",  // or "both" if standalone also exists
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

Update `pm-workspace-docs/initiatives/[name]/prototype-notes.md`:

```markdown
## Context Prototype

### Integration Views Created

| Story | What It Shows | Key Decisions |
|-------|--------------|---------------|
| AsFullPage | Full page with nav | [Layout choices] |
| AsSidePanel | Panel overlay | [Panel width, trigger] |
| NavigationDiscovery | Nav placement | [Where in sidebar] |
| WithAdjacentFeatures | Related features | [Data sharing approach] |

### Mock Dependencies

These parts are mocked for the prototype (need real implementation):

- `SidebarLayout` - Using simplified mock
- `[Hook/Context]` - Using static data
- `[API calls]` - Returning mock responses

### Ready for Production

Before promoting from prototypes/:

- [ ] Replace mock sidebar with real `@/components/navigation/`
- [ ] Connect to real data hooks
- [ ] Add proper routing
- [ ] Update imports to final location
```

## Response Template

```
✅ Context prototype created for [initiative] (v1)!

📍 **Placement Decision:**
- **Type:** [New Page | Side Panel | Modal | Embedded]
- **Location:** `components/[domain]/[feature]/`
- **Navigation:** [Where users find it]
- **Rationale:** [1-2 sentence explanation]

🏠 **Integration Views (v1):**

| View | Story | Shows |
|------|-------|-------|
| [Primary] | `InContext_[Type]` | Main integration |
| Navigation | `InContext_Navigation` | Discovery path |
| Adjacent | `InContext_WithRelated` | Nearby features |

🚶 **Interactive Journeys (click through!):**

| Journey | What It Shows |
|---------|---------------|
| `Flow_HappyPath` | Complete in-context success journey |
| `Flow_ErrorRecovery` | Error handling in real app UI |

📁 **Files Created:**
- `elephant-ai/web/src/components/prototypes/[Initiative]/v1/`
  - `[ComponentName].tsx` - The component
  - `contexts/[ComponentName].context.stories.tsx` - Context stories
- `pm-workspace-docs/initiatives/[initiative]/placement-research.md`

📱 **Preview:**
- Local: `cd elephant-ai && npm run storybook -w web`
- Navigate to: `Prototypes → [Initiative] → v1`

**Compare with standalone:** If `/proto` was also run, compare:
- `Prototypes/[Initiative]/v1/Standalone` - Feature in isolation
- `Prototypes/[Initiative]/v1/InContext` - Feature integrated

**Next Steps:**
- Compare standalone vs context approaches
- Run `/validate [initiative]` for jury evaluation
- Run `/iterate [initiative]` when feedback arrives (creates v2 folder)
- When approved, promote to `components/[domain]/[name]/`
```

## When to Use Each Approach

| Scenario | Command | Why |
|----------|---------|-----|
| "What should this feature look like?" | `/proto` | Focus on the feature itself |
| "Where does this feature belong?" | `/context-proto` | Focus on integration |
| "I want to compare both approaches" | Run both | Get standalone + integrated views |
| Stakeholder review | Both | "Here's the feature, here's where it lives" |
| Engineering handoff | `/context-proto` | Shows production location |
| Early exploration | `/proto` | Faster, less analysis overhead |
| Navigation/IA decisions | `/context-proto` | Shows discovery path |

## Tech Notes

### Using Real Components

Import from the actual app where possible:

```typescript
// ✅ DO: Use real UI components
import { Button } from '@/components/ui/button';
import { Sheet } from '@/components/ui/sheet';

// ✅ DO: Use real type definitions
import type { Engagement } from '@/types';

// ⚠️ MOCK: Navigation (too complex to import directly)
// Create simplified mock that matches visual structure
```

### Storybook Layout

For context stories, always use fullscreen layout:

```typescript
parameters: {
  layout: 'fullscreen',
}
```

### Mock Data

Create realistic mock data that represents production scenarios:

```typescript
// contexts/mocks.ts
export const mockEngagements = [
  { id: '1', title: 'Q4 Planning Call', ... },
  { id: '2', title: 'Customer Discovery', ... },
];
```

## Anti-Patterns

🚩 **Skipping analysis** - Don't guess where it goes; let the command analyze the codebase
🚩 **Over-mocking** - Use real UI components from `@/components/ui/` when possible
🚩 **Pixel-perfect production** - This is a prototype; focus on integration patterns, not polish
🚩 **Forgetting documentation** - Always save placement-research.md with decisions
🚩 **One option only** - If unclear, show both page AND panel options for comparison
🚩 **Ignoring existing patterns** - Study similar features in the codebase first
🚩 **Context views without flows** - Static views ≠ understanding the journey; include `Flow_*` stories
🚩 **No journey in context** - Designer must see full flow IN the app UI, not just static placement