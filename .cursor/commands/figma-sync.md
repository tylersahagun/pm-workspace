# Figma → Storybook → Code Sync

You synchronize Figma designs into Storybook stories and code scaffolds. This command treats **Storybook as the contract/spec layer**: Figma defines what exists (variants, states, tokens), Storybook turns that into executable specs (stories + args), and code is scaffolded from those specs.

## Purpose

| What Gets Automated | What Stays Manual |
|---------------------|-------------------|
| Variant → prop enum mapping | Production component logic |
| Story scaffolds for each state | Complex layout markup |
| TypeScript prop types | Accessibility implementation |
| Token → CSS variable mapping | Business logic & data fetching |
| Figma embed for design reference | Animation polish |

## Prerequisites

- Figma component with **Component Set variants** (properly named)
- Figma URL with `node-id` parameter
- Target initiative folder in `pm-workspace-docs/initiatives/[name]/`

## Workflow Overview

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   FIGMA     │ →  │  SPEC JSON  │ →  │  STORYBOOK  │
│  (design)   │    │  (contract) │    │  (stories)  │
└─────────────┘    └─────────────┘    └─────────────┘
                          ↓
                   ┌─────────────┐
                   │    CODE     │
                   │ (scaffolds) │
                   └─────────────┘
```

## Step 1: Extract Figma Spec

Use the Figma MCP tool to analyze the component:

```
/figma-sync [initiative-name] [figma-url]
```

### 1a. Get Design Context from Figma

Use `mcp_Figma_get_design_context` to extract:
- Component structure and hierarchy
- Variant properties (variant, size, state, etc.)
- Boolean properties (disabled, loading, etc.)
- Text content placeholders
- Color tokens and styles

### 1b. Generate Component Spec

Create `pm-workspace-docs/initiatives/[name]/figma-spec.json`:

```json
{
  "name": "ComponentName",
  "figmaUrl": "https://www.figma.com/design/...",
  "figmaNodeId": "1-15579",
  "extractedAt": "2026-01-20T00:00:00Z",
  "props": {
    "variant": {
      "type": "enum",
      "values": ["primary", "secondary", "danger"],
      "default": "primary"
    },
    "size": {
      "type": "enum",
      "values": ["sm", "md", "lg"],
      "default": "md"
    },
    "disabled": {
      "type": "boolean",
      "default": false
    },
    "children": {
      "type": "ReactNode",
      "description": "Button label text"
    }
  },
  "states": [
    { "name": "Default", "args": { "variant": "primary", "size": "md" } },
    { "name": "Secondary", "args": { "variant": "secondary", "size": "md" } },
    { "name": "Danger", "args": { "variant": "danger", "size": "md" } },
    { "name": "Small", "args": { "variant": "primary", "size": "sm" } },
    { "name": "Large", "args": { "variant": "primary", "size": "lg" } },
    { "name": "Disabled", "args": { "variant": "primary", "disabled": true } }
  ],
  "tokens": {
    "colors": {
      "primary": "var(--color-primary)",
      "secondary": "var(--color-secondary)"
    },
    "spacing": {
      "sm": "0.5rem",
      "md": "1rem",
      "lg": "1.5rem"
    }
  }
}
```

## Step 2: Generate Storybook Stories

From the spec, generate `[ComponentName].stories.tsx`:

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { ComponentName } from './ComponentName';

const FIGMA_URL = '[extracted-figma-url]';
const FIGMA_EMBED_URL = `https://www.figma.com/embed?embed_host=storybook&url=${encodeURIComponent(FIGMA_URL)}`;

/**
 * # ComponentName
 * 
 * Auto-generated from Figma spec.
 * 
 * ## Figma Design
 * [Open in Figma]([figma-url])
 * 
 * ## Variants
 * - variant: primary | secondary | danger
 * - size: sm | md | lg
 * - disabled: boolean
 */
const meta = {
  title: 'Prototypes/[ProjectName]/ComponentName',
  component: ComponentName,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'danger'],
      description: 'Visual style variant',
      table: {
        defaultValue: { summary: 'primary' },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size variant',
      table: {
        defaultValue: { summary: 'md' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
  },
} satisfies Meta<typeof ComponentName>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// VARIANT STORIES (auto-generated from Figma spec)
// ============================================================================

export const Default: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    children: 'Button',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    size: 'md',
    children: 'Button',
  },
};

export const Danger: Story = {
  args: {
    variant: 'danger',
    size: 'md',
    children: 'Button',
  },
};

// ============================================================================
// SIZE STORIES
// ============================================================================

export const Small: Story = {
  args: {
    variant: 'primary',
    size: 'sm',
    children: 'Small Button',
  },
};

export const Large: Story = {
  args: {
    variant: 'primary',
    size: 'lg',
    children: 'Large Button',
  },
};

// ============================================================================
// STATE STORIES
// ============================================================================

export const Disabled: Story = {
  args: {
    variant: 'primary',
    disabled: true,
    children: 'Disabled',
  },
};

// ============================================================================
// FIGMA DESIGN REFERENCE
// ============================================================================

const FigmaEmbed = ({ height = 600 }: { height?: number }) => (
  <iframe
    title="Figma Design"
    style={{ border: '1px solid rgba(0, 0, 0, 0.1)', width: '100%', height }}
    src={FIGMA_EMBED_URL}
    allowFullScreen
  />
);

export const FigmaDesign: Story = {
  render: () => <FigmaEmbed height={800} />,
  parameters: {
    layout: 'fullscreen',
  },
};

export const DesignComparison: Story = {
  render: (args) => (
    <div className="flex h-screen">
      <div className="w-1/2 border-r overflow-auto">
        <div className="sticky top-0 bg-background/95 backdrop-blur z-10 p-2 border-b">
          <span className="text-sm font-medium text-muted-foreground">FIGMA DESIGN</span>
        </div>
        <FigmaEmbed height={800} />
      </div>
      <div className="w-1/2 overflow-auto flex items-center justify-center p-8">
        <div className="sticky top-0 bg-background/95 backdrop-blur z-10 p-2 border-b absolute top-0 left-0 right-0">
          <span className="text-sm font-medium text-muted-foreground">IMPLEMENTATION</span>
        </div>
        <ComponentName {...args} />
      </div>
    </div>
  ),
  args: {
    variant: 'primary',
    size: 'md',
    children: 'Button',
  },
  parameters: {
    layout: 'fullscreen',
  },
};
```

## Step 3: Generate Code Scaffold

From the spec, generate `[ComponentName].tsx`:

```typescript
import * as React from 'react';
import { cn } from '@/lib/utils';

// ============================================================================
// TYPES (generated from Figma spec)
// ============================================================================

export type ComponentNameVariant = 'primary' | 'secondary' | 'danger';
export type ComponentNameSize = 'sm' | 'md' | 'lg';

export interface ComponentNameProps {
  /** Visual style variant */
  variant?: ComponentNameVariant;
  /** Size variant */
  size?: ComponentNameSize;
  /** Disabled state */
  disabled?: boolean;
  /** Button content */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Click handler */
  onClick?: () => void;
}

// ============================================================================
// VARIANT STYLES (mapped from Figma tokens)
// ============================================================================

const variantStyles: Record<ComponentNameVariant, string> = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  danger: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
};

const sizeStyles: Record<ComponentNameSize, string> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-base',
  lg: 'h-12 px-6 text-lg',
};

// ============================================================================
// COMPONENT
// ============================================================================

export function ComponentName({
  variant = 'primary',
  size = 'md',
  disabled = false,
  children,
  className,
  onClick,
}: ComponentNameProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        'disabled:pointer-events-none disabled:opacity-50',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </button>
  );
}
```

And generate `types.ts`:

```typescript
// Auto-generated from Figma spec: [figma-url]
// Generated: [timestamp]

export type ComponentNameVariant = 'primary' | 'secondary' | 'danger';
export type ComponentNameSize = 'sm' | 'md' | 'lg';

export interface ComponentNameProps {
  variant?: ComponentNameVariant;
  size?: ComponentNameSize;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

// Figma token mappings
export const FIGMA_TOKENS = {
  colors: {
    primary: 'var(--color-primary)',
    secondary: 'var(--color-secondary)',
    danger: 'var(--color-destructive)',
  },
  spacing: {
    sm: '0.5rem',
    md: '1rem', 
    lg: '1.5rem',
  },
} as const;
```

## Step 4: Generate Barrel Export

Create `index.ts`:

```typescript
export { ComponentName } from './ComponentName';
export type { ComponentNameProps, ComponentNameVariant, ComponentNameSize } from './types';
```

## Output Structure

```
elephant-ai/web/src/components/prototypes/[ProjectName]/
├── [ComponentName].tsx              # Component scaffold
├── [ComponentName].stories.tsx      # Stories with Figma embed
├── types.ts                         # TypeScript types
├── index.ts                         # Barrel export
└── figma-spec.json                  # Source spec (for re-sync)

pm-workspace-docs/initiatives/[name]/
├── figma-spec.json                  # Canonical spec
└── figma-sync-log.md                # Sync history
```

## Figma Naming Conventions (Required)

For reliable extraction, Figma components MUST follow:

| Figma Pattern | Maps To |
|---------------|---------|
| Component Set with variants | Enum prop type |
| Boolean property | Boolean prop |
| Text property | String/ReactNode prop |
| Instance swap property | Slot/children prop |
| Color style | Token reference |

### Variant Naming

```
Button / variant=primary, size=md
Button / variant=secondary, size=md
Button / variant=primary, size=lg, disabled=true
```

Maps to:
```typescript
{ variant: 'primary' | 'secondary', size: 'md' | 'lg', disabled: boolean }
```

## Response Template

```
✅ Figma sync complete for [name]!

📐 **Extracted from Figma:**
- Component: [ComponentName]
- Variants: [list]
- Props: [count] properties mapped
- Tokens: [count] design tokens

📁 **Files Generated:**

**Stories (Storybook spec):**
- `prototypes/[ProjectName]/[ComponentName].stories.tsx`
  - [N] variant stories
  - Figma embed for reference
  - Design comparison view

**Code Scaffold:**
- `prototypes/[ProjectName]/[ComponentName].tsx`
- `prototypes/[ProjectName]/types.ts`
- `prototypes/[ProjectName]/index.ts`

**Spec:**
- `pm-workspace-docs/initiatives/[name]/figma-spec.json`

📱 **Preview:**
```bash
cd elephant-ai && npm run storybook -w web
```

Navigate to: `Prototypes/[ProjectName]/[ComponentName]`

🔄 **Re-sync:** Run `/figma-sync [name] [url]` to update from Figma changes

**Next Steps:**
1. Implement component logic in the scaffold
2. Run Storybook to verify stories render
3. Run `/validate [name]` for jury evaluation
```

## Re-Sync Workflow

When Figma changes:

1. Run `/figma-sync [name] [url]` again
2. Compare new spec to existing
3. **Preserve**: Custom logic, accessibility, tests
4. **Update**: Variant names, prop types, token values
5. **Flag**: Breaking changes for manual review

## Integration with Existing Commands

| Command | How It Integrates |
|---------|-------------------|
| `/proto [name]` | Creates from PRD; `/figma-sync` adds Figma source |
| `/context-proto [name]` | Uses synced components in context |
| `/validate [name]` | Tests synced components with jury |
| `/iterate [name]` | Can trigger re-sync before iteration |

## Mode: Exact Figma Export

When you want the **EXACT** design from Figma (not iterating on existing code), use this mode:

```
/figma-sync [name] [url] --exact
```

### What This Does

1. **Extracts raw code** from Figma using `mcp_Figma_get_design_context` with `forceCode: true`
2. **Creates a separate folder** at `prototypes/[ProjectName]/figma-generated/`
3. **Preserves Figma structure** - data-node-id attributes, exact class names, exact hierarchy
4. **No modifications** - this is the source of truth from design

### Output Structure (Exact Mode)

```
elephant-ai/web/src/components/prototypes/[ProjectName]/
├── figma-generated/                 # EXACT from Figma (don't modify)
│   ├── [ComponentName]Figma.tsx     # Raw Figma export
│   ├── [ComponentName]Figma.stories.tsx
│   └── index.ts
├── v1/                              # Your iterations
│   └── [ComponentName].tsx          # Modified/improved version
└── [ComponentName].stories.tsx      # Main stories (can reference both)
```

### When to Use Exact Mode

| Use Exact Mode When... | Use Scaffold Mode When... |
|------------------------|---------------------------|
| Design review/approval | Building production component |
| Pixel-perfect comparison | Need clean, maintainable code |
| Extracting design tokens | Iterating on design |
| Documenting design decisions | Adding business logic |

### Example: Exact Export

```typescript
// figma-generated/SettingsFigma.tsx
/**
 * FIGMA-GENERATED COMPONENT
 * 
 * Source: https://www.figma.com/design/...?node-id=1-2836
 * Generated: 2026-01-20
 * 
 * DO NOT MODIFY - regenerate from Figma if design changes.
 */

// Exact code from Figma MCP tool...
export function SettingsPageFigma({ ... }) {
  return (
    <div data-node-id="1:2836" className="...">
      {/* Exact Figma structure */}
    </div>
  );
}
```

### Comparison Story (Auto-Generated)

The exact export includes a `DesignComparison` story that shows:
- Figma embed (source of truth)
- Generated component (exact export)
- Side-by-side for pixel comparison

## Anti-Patterns

🚩 **Skipping variant naming** - Figma variants must be consistently named
🚩 **No token strategy** - Map to existing CSS vars or Tailwind config
🚩 **Expecting production code** - This generates scaffolds, not final implementation
🚩 **Auto-layout = responsive** - Don't expect perfect HTML from Figma structure
🚩 **One-way sync only** - Code changes don't flow back to Figma
🚩 **Modifying figma-generated/** - These files should only be regenerated, not edited
