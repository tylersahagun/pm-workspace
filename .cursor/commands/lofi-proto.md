# Low-Fidelity Prototype Builder

You build **rapid, low-fidelity prototypes** in Storybook for early exploration and stakeholder alignment. Unlike `/proto` (polished, all states) or `/context-proto` (integrated), `/lofi-proto` prioritizes speed and idea communication over visual polish.

## When to Use

| Command | Fidelity | Speed | Best For |
|---------|----------|-------|----------|
| `/lofi-proto` | Low | ⚡ Fast | Early exploration, layout validation, quick stakeholder alignment |
| `/proto` | High | Slower | Full creative exploration, all states, production-ready components |
| `/context-proto` | High | Slowest | Integration testing, showing where feature lives in app |

**Use `/lofi-proto` when:**
- You're still exploring the problem space
- You need quick feedback on layout/flow
- Stakeholders need to see "the idea" before investing in polish
- You want to test multiple concepts rapidly

## Design Philosophy

### What Low-Fi IS

- **Gray boxes and placeholder content** - `bg-muted` rectangles, "Lorem ipsum"
- **Layout and hierarchy exploration** - Where things go, relative sizing
- **Flow and interaction concepts** - What happens when, in what order
- **Questions for stakeholders** - "Should this be a modal or inline?"

### What Low-Fi is NOT

- Pixel-perfect styling
- Production-ready code
- Complete state coverage
- Final copy/content

## Build Process

### Step 1: Understand the Concept

Load minimal context (don't over-engineer):

1. Initiative PRD (if exists): `@pm-workspace-docs/initiatives/[name]/prd.md`
2. Any rough sketches or descriptions from the user

**Skip loading:** design-brief.md, human-centric-ai research, design system - those are for hi-fi work.

### Step 2: Create Wireframe Components

**Location:** `elephant-ai/web/src/components/prototypes/[Initiative]/lofi/`

```
elephant-ai/web/src/components/prototypes/[Initiative]/
├── index.ts
├── v1/                    # High-fidelity (from /proto)
├── contexts/              # Context views (from /context-proto)
└── lofi/                  # Low-fidelity explorations
    ├── Concept1.tsx
    ├── Concept2.tsx
    ├── Concept3.tsx
    └── [Initiative].lofi.stories.tsx
```

### Step 3: Build with Wireframe Patterns

Use these standard low-fi building blocks:

```typescript
// Wireframe primitives
const Placeholder = ({ label, className }: { label: string; className?: string }) => (
  <div className={cn("bg-muted border-2 border-dashed border-muted-foreground/30 rounded flex items-center justify-center text-muted-foreground text-sm p-4", className)}>
    {label}
  </div>
);

const WireframeButton = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-muted-foreground/20 rounded px-4 py-2 text-sm font-medium">
    {children}
  </div>
);

const WireframeText = ({ lines = 3 }: { lines?: number }) => (
  <div className="space-y-2">
    {Array.from({ length: lines }).map((_, i) => (
      <div key={i} className="h-3 bg-muted-foreground/20 rounded" style={{ width: `${Math.random() * 40 + 60}%` }} />
    ))}
  </div>
);

const WireframeAvatar = () => (
  <div className="w-10 h-10 rounded-full bg-muted-foreground/30" />
);
```

### Step 4: Focus on Layout Options

Create 2-3 distinct **layout/approach** concepts:

```typescript
// [Initiative].lofi.stories.tsx
const meta = {
  title: 'Prototypes/[Initiative]/LoFi',
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'light' },
  },
};

export default meta;

/**
 * Sidebar approach - feature lives in a side panel
 */
export const Concept_Sidebar: Story = {
  render: () => <SidebarLayoutConcept />,
  parameters: {
    docs: {
      description: {
        story: `
**Concept: Sidebar Panel**

- Feature opens as sliding panel
- User can keep context visible
- Good for: Quick edits, reference data

❓ Questions for stakeholders:
- Is there enough space for the content?
- Should it push or overlay the main content?
        `,
      },
    },
  },
};

/**
 * Modal approach - focused task completion
 */
export const Concept_Modal: Story = {
  render: () => <ModalLayoutConcept />,
  parameters: {
    docs: {
      description: {
        story: `
**Concept: Modal Dialog**

- Focused, interrupting experience
- User completes task before returning
- Good for: Complex forms, critical actions

❓ Questions for stakeholders:
- Is this task important enough to interrupt?
- What size modal works best?
        `,
      },
    },
  },
};

/**
 * Inline approach - embedded in existing page
 */
export const Concept_Inline: Story = {
  render: () => <InlineLayoutConcept />,
  parameters: {
    docs: {
      description: {
        story: `
**Concept: Inline Expansion**

- Expands within the current page
- Least disruptive
- Good for: Minor additions, optional features

❓ Questions for stakeholders:
- Does it feel discoverable enough?
- How does it affect page scroll?
        `,
      },
    },
  },
};
```

### Step 5: Include One Simple Flow (Optional but Recommended)

```typescript
/**
 * Basic happy path flow - click through the concept
 */
export const Flow_QuickWalkthrough: Story = {
  render: () => <SimpleFlowWalkthrough />,
  parameters: {
    docs: {
      description: {
        story: `
**Quick Walkthrough (3 steps)**

1. User opens feature
2. User makes selection
3. Done!

Click through to see the basic flow.
        `,
      },
    },
  },
};
```

## Minimal Requirements

| Requirement | `/lofi-proto` | `/proto` | `/context-proto` |
|-------------|---------------|----------|------------------|
| All AI states | ❌ No | ✅ Yes | ✅ Yes |
| Error states | ❌ No | ✅ Yes | ✅ Yes |
| Low confidence | ❌ No | ✅ Yes | ✅ Yes |
| Loading states | ⚪ Optional | ✅ Yes | ✅ Yes |
| Happy path flow | ✅ Yes | ✅ Yes | ✅ Yes |
| Multiple concepts | ✅ 2-3 layouts | ✅ 2-3 options | ✅ 1-2 contexts |
| Design system | ❌ Skip | ✅ Required | ✅ Required |
| Versioning | ❌ No (`lofi/`) | ✅ Yes (`v1/`) | ✅ Yes (`v1/`) |
| Chromatic deploy | ✅ Yes | ✅ Yes | ✅ Yes |

## Build & Deploy (Still Required!)

Even though it's low-fi, we still deploy to Chromatic for easy sharing:

### Step 1: Build Storybook
```bash
cd elephant-ai && npm run build-storybook -w web
```

### Step 2: Deploy to Chromatic
```bash
cd elephant-ai && npm run chromatic
```

### Step 3: Capture URL

Include the Chromatic URL in your response - this is how stakeholders review lo-fi concepts!

## Documentation (Lightweight)

Create/update `pm-workspace-docs/initiatives/[name]/lofi-notes.md`:

```markdown
# Low-Fidelity Exploration: [Initiative]

## Date: [YYYY-MM-DD]

## Concepts Explored

### Concept 1: [Name]
- **Approach:** [Sidebar/Modal/Inline/etc.]
- **Pros:** [Quick list]
- **Cons:** [Quick list]
- **Open questions:** [What we need to learn]

### Concept 2: [Name]
...

### Concept 3: [Name]
...

## Stakeholder Questions
- [ ] [Question 1]
- [ ] [Question 2]

## Next Steps
- [ ] Get stakeholder feedback
- [ ] Pick direction
- [ ] Graduate to `/proto` for full exploration

## Preview
🔗 Chromatic: [URL]
```

**Update `_meta.json`** (if exists):
```json
{
  "updated_at": "[timestamp]",
  "lofi_exists": true,
  "lofi_chromatic_url": "[url]"
}
```

## Response Template

```
✅ Low-fi prototype created for [initiative]!

🎨 **Concepts Explored:**

| Concept | Approach | Best For |
|---------|----------|----------|
| Concept 1 | Sidebar panel | Quick edits |
| Concept 2 | Modal dialog | Focused tasks |
| Concept 3 | Inline expansion | Minimal disruption |

🔗 **Chromatic Preview:**
https://[hash]--[appId].chromatic.com/?path=/story/prototypes-[initiative]-lofi

📁 **Files:**
- `elephant-ai/web/src/components/prototypes/[Initiative]/lofi/`
- `pm-workspace-docs/initiatives/[initiative]/lofi-notes.md`

❓ **Questions for Stakeholders:**
1. [Key question about layout/approach]
2. [Key question about interaction model]
3. [Key question about scope]

**Next Steps:**
- Get feedback on concepts
- Pick a direction
- Run `/proto [initiative]` for full exploration
```

## Anti-Patterns for Lo-Fi

🚩 **Over-polishing** - If you're tweaking colors, you've gone too far
🚩 **Too many states** - Just show the happy path
🚩 **Real content** - Use placeholders, not actual copy
🚩 **Production patterns** - Don't worry about responsive, a11y, edge cases yet
🚩 **Skipping Chromatic** - Even lo-fi needs a shareable link

## Graduating from Lo-Fi

When stakeholders align on a direction:

1. Run `/proto [initiative]` to build high-fidelity version
2. Reference lo-fi concepts for layout decisions
3. Lo-fi stays in `lofi/` folder for historical reference
4. Hi-fi goes in `v1/` with proper versioning

The lo-fi → hi-fi progression looks like:
```
prototypes/[Initiative]/
├── lofi/           ← Quick exploration (this command)
├── v1/             ← First hi-fi iteration (/proto)
├── v2/             ← After feedback (/iterate)
└── contexts/       ← Integration views (/context-proto)
```
