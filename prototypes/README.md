# Prototypes

> 🔒 **LOCAL ONLY** - This folder is gitignored and will never be pushed to the repository.

## Quick Start

```bash
# Install dependencies
pnpm install

# Start Storybook
pnpm storybook
```

Storybook will open at [http://localhost:6006](http://localhost:6006)

## Purpose

This is a sandboxed Storybook environment for prototyping new components and features before they're ready for the main codebase.

## Structure

```
prototypes/
├── .storybook/           # Storybook configuration
│   ├── main.ts
│   └── preview.ts
├── src/
│   ├── components/       # Prototype components
│   │   └── Button/       # Example component
│   │       ├── Button.tsx
│   │       ├── Button.stories.tsx
│   │       └── index.ts
│   ├── lib/
│   │   └── utils.ts      # Utility functions (cn helper)
│   └── index.css         # Tailwind + CSS variables
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

## Creating Components

### 1. Create the Component

```tsx
// src/components/MyComponent/MyComponent.tsx
import { cn } from '@/lib/utils';

interface MyComponentProps {
  className?: string;
  children: React.ReactNode;
}

export function MyComponent({ className, children }: MyComponentProps) {
  return (
    <div className={cn('p-4 rounded-lg bg-card', className)}>
      {children}
    </div>
  );
}
```

### 2. Create Stories

```tsx
// src/components/MyComponent/MyComponent.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { MyComponent } from './MyComponent';

const meta = {
  title: 'Components/MyComponent',
  component: MyComponent,
  tags: ['autodocs'],
} satisfies Meta<typeof MyComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Hello World',
  },
};
```

### 3. Export from Index

```tsx
// src/components/MyComponent/index.ts
export { MyComponent } from './MyComponent';
```

## Design System

This prototype environment uses:
- **Tailwind CSS** with shadcn/ui-compatible configuration
- **CSS Variables** for theming (light/dark mode support)
- **class-variance-authority** for component variants
- **tailwind-merge** + **clsx** via the `cn()` utility

The color system matches the main repo's shadcn/ui setup.

## When Prototype is Ready

1. Document in `.pm-workspace/initiatives/[project]/prototype-notes.md`
2. List components ready for migration
3. Note any differences from main repo patterns
4. Copy components to `web/src/components/` (adjust imports)

