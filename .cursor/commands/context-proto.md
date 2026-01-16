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

Build a realistic page/panel wrapper that mimics the production environment:

```
elephant-ai/web/src/components/prototypes/[ProjectName]/
├── [ComponentName].tsx                  # Isolated component (from /proto)
├── [ComponentName].stories.tsx          # Isolated stories (from /proto)
├── contexts/                            # NEW: Context prototypes
│   ├── [ComponentName]InPage.tsx        # Component in page context
│   ├── [ComponentName]InPanel.tsx       # Component in panel context
│   ├── [ComponentName]Navigation.tsx    # Navigation integration mock
│   └── [ComponentName].context.stories.tsx  # Context stories
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
// contexts/[ComponentName].context.stories.tsx
const meta = {
  title: 'Prototypes/[ProjectName]/InContext',
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
```

### Step 5: Document Integration Details

**Update `_meta.json`**:
```json
{
  "updated_at": "[current timestamp]",
  "prototype_type": "context",  // or "both" if standalone also exists
  "metrics": {
    "total_iterations": 1  // or increment
  }
}
```

**Prototype Type Values:**
- `"standalone"` - Created with `/proto` (isolated, PRD-driven)
- `"context"` - Created with `/context-proto` (integrated with app UI)
- `"both"` - Both types exist (compare standalone vs integrated)

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
✅ Context prototype created for [name]!

📍 **Placement Decision:**
- **Type:** [New Page | Side Panel | Modal | Embedded]
- **Location:** `components/[domain]/[feature]/`
- **Navigation:** [Where users find it]
- **Rationale:** [1-2 sentence explanation]

🏠 **Integration Views:**

| View | Story | Shows |
|------|-------|-------|
| [Primary] | `InContext_[Type]` | Main integration |
| Navigation | `InContext_Navigation` | Discovery path |
| Adjacent | `InContext_WithRelated` | Nearby features |

📁 **Files Created:**
- `elephant-ai/web/src/components/prototypes/[ProjectName]/`
  - `[ComponentName].tsx` - The component
  - `[ComponentName].context.stories.tsx` - Context stories
- `pm-workspace-docs/initiatives/[name]/placement-research.md`

📱 **Preview:**
- Local: `cd elephant-ai && npm run storybook -w web`
- Navigate to: `Prototypes/[ProjectName]`

**Compare with standalone:** If `/proto` was also run, compare:
- `Prototypes/[ProjectName]/Standalone` - Feature in isolation
- `Prototypes/[ProjectName]/InContext` - Feature integrated

**Next Steps:**
- Compare standalone vs context approaches
- Run `/validate [name]` for jury evaluation
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
