# AskElephant Design System

> **Extracted from**: `elephant-ai/web/src/` — matches production codebase exactly.
> 
> **Last updated**: 2026-01-21
> 
> This file is loaded automatically when building prototypes. Update it as you make design decisions.

---

## Direction

- **Personality**: Sophistication & Trust
- **Foundation**: Cool grays (slate/gray)
- **Context**: Enterprise B2B SaaS (sales/CS teams)
- **Mode**: Light mode primary, dark mode supported
- **Depth**: Border + subtle shadow (not shadow-heavy)

---

## Typography

| Token | Value | Usage |
|-------|-------|-------|
| `--font-sans` | Inter | Primary text |
| `--font-mono` | JetBrains Mono | Code, data, IDs |

### Text Scale

| Size | Tailwind | Line Height | Usage |
|------|----------|-------------|-------|
| xs | `text-xs` (12px) | 16px | Badges, metadata, captions |
| sm | `text-sm` (14px) | 20px | Body text, labels, buttons |
| base | `text-base` (16px) | 24px | Larger body text |
| lg | `text-lg` (18px) | 28px | Section headers |
| xl | `text-xl` (20px) | 28px | Page titles |
| 2xl | `text-2xl` (24px) | 32px | Hero text |

### Font Weights

| Weight | Tailwind | Usage |
|--------|----------|-------|
| 400 | `font-normal` | Body text |
| 500 | `font-medium` | Buttons, labels |
| 600 | `font-semibold` | Headings, emphasis |
| 700 | `font-bold` | Strong emphasis |

---

## Spacing

**Base**: 4px grid (Tailwind standard)

| Token | Value | Tailwind |
|-------|-------|----------|
| 0.5 | 2px | `p-0.5`, `gap-0.5` |
| 1 | 4px | `p-1`, `gap-1` |
| 1.5 | 6px | `p-1.5`, `gap-1.5` |
| 2 | 8px | `p-2`, `gap-2` |
| 2.5 | 10px | `p-2.5` |
| 3 | 12px | `p-3`, `gap-3` |
| 4 | 16px | `p-4`, `gap-4` |
| 5 | 20px | `p-5` |
| 6 | 24px | `p-6`, `gap-6` |
| 8 | 32px | `p-8` |
| 10 | 40px | `p-10` |
| 12 | 48px | `p-12` |

---

## Border Radius

**Base**: `--radius: 0.5rem` (8px)

| Token | Tailwind | Size | Usage |
|-------|----------|------|-------|
| sm | `rounded-sm` | 4px | Small elements |
| md | `rounded-md` | 6px | Buttons, inputs, badges |
| lg | `rounded-lg` | 8px | Cards, dialogs |
| xl | `rounded-xl` | 12px | Large containers |
| full | `rounded-full` | 9999px | Avatars, pills |

---

## Colors (CSS Variables)

### Light Mode (Primary)

```css
--background: hsl(0 0% 98%);       /* Page bg - near white */
--foreground: hsl(222.2 84% 4.9%);  /* Text - near black */
--card: hsl(0 0% 100%);             /* Card bg - white */
--muted: hsl(210 40% 96.1%);        /* Muted bg - light gray */
--muted-foreground: hsl(0 0% 50%);  /* Secondary text */
--border: hsl(214.3 31.8% 91.4%);   /* Borders - light gray */
--input: hsl(214.3 31.8% 91.4%);    /* Input borders */
--primary: hsl(240 86% 49%);        /* Primary blue/indigo */
--primary-dark: hsl(0 0% 9%);       /* Default button (near black) */
--destructive: var(--color-red-600);
--success: var(--color-green-600);
--warning: hsl(35 90% 50%);
```

### Semantic Mappings

| Purpose | Variable | Tailwind |
|---------|----------|----------|
| Page background | `--background` | `bg-background` |
| Primary text | `--foreground` | `text-foreground` |
| Secondary text | `--muted-foreground` | `text-muted-foreground` |
| Card background | `--card` | `bg-card` |
| Borders | `--border` | `border-border` |
| Primary actions | `--primary-dark` | `bg-primary-dark` |
| Blue accent | `--primary` | `bg-primary` |
| Destructive | `--destructive` | `bg-destructive` |
| Success | `--success` | `bg-success` |
| Warning | `--warning` | `bg-warning` |

---

## Depth Strategy

**Approach**: Border + subtle shadow (not shadow-heavy)

```css
/* Cards */
border bg-card shadow-sm rounded-lg

/* Inputs */
border border-input bg-input-background rounded-md

/* Dialogs/Sheets */
border bg-background shadow-lg

/* Elevated (popovers) */
border bg-popover shadow-md
```

---

## Component Patterns

### Button

**Import**: `import { Button } from '@/components/ui/button'`

```tsx
// Variants
variant="default"       // bg-primary-dark (near black) - DEFAULT
variant="primary-blue"  // bg-primary (blue)
variant="secondary"     // bg-secondary (gray)
variant="outline"       // border, transparent bg
variant="ghost"         // no bg, hover bg-accent
variant="destructive"   // bg-destructive (red)
variant="muted"         // text-muted-foreground, border

// Sizes
size="default"  // px-4 py-2
size="sm"       // h-8 px-3 text-xs
size="lg"       // h-10 px-8
size="icon"     // h-8 px-2
size="tiny"     // p-1 text-xs
```

**Styles**:
```tsx
// Base classes (all buttons)
'inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
```

### Card

**Import**: `import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card'`

```tsx
<Card className="rounded-lg border bg-card text-card-foreground shadow-sm">
  <CardHeader className="flex flex-col space-y-1.5 p-6">
    <CardTitle className="text-2xl font-semibold leading-none tracking-tight">
      Title
    </CardTitle>
    <CardDescription className="text-sm text-muted-foreground">
      Description
    </CardDescription>
  </CardHeader>
  <CardContent className="p-6 pt-0">
    Content
  </CardContent>
  <CardFooter className="flex items-center p-6 pt-0">
    Footer
  </CardFooter>
</Card>
```

### Input

**Import**: `import { Input } from '@/components/ui/input'`

```tsx
<Input 
  className="w-full rounded-md border border-input bg-input-background px-3 py-1 h-input-height text-sm"
  placeholder="Enter text..."
/>
```

**Key**: Input height is `h-input-height` (30px custom token)

### Badge

**Import**: `import { Badge } from '@/components/ui/badge'`

```tsx
// Variants
variant="default"     // bg-primary text-primary-foreground
variant="secondary"   // bg-secondary text-secondary-foreground
variant="destructive" // bg-destructive text-destructive-foreground
variant="outline"     // border only

// Colors (for categorization)
colorVariant="green" | "purple" | "orange" | "blue" | "teal" | "rose" | "yellow" | "fuchsia" | "indigo" | "lime" | "stone"

// Sizes
size="sm"  // px-1.5 py-0.5 font-normal
size="md"  // px-2 py-0.5 (default)

// Auto-color by key
<Badge colorKey={0} />  // Uses index in color array
<Badge colorKey="unique-string" />  // Hashes string to consistent color
```

### Dialog

**Import**: `import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'`

```tsx
<Dialog>
  <DialogContent className="max-w-lg p-6 rounded-lg border bg-background shadow-lg">
    <DialogHeader className="flex flex-col space-y-1.5">
      <DialogTitle className="text-lg font-semibold">Title</DialogTitle>
      <DialogDescription className="text-sm text-muted-foreground">
        Description
      </DialogDescription>
    </DialogHeader>
    {/* Content */}
    <DialogFooter className="flex justify-end space-x-2">
      <Button variant="outline">Cancel</Button>
      <Button>Save</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Sheet (Side Panel)

**Import**: `import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'`

```tsx
<Sheet>
  <SheetContent 
    side="right"  // "left" | "right" | "top" | "bottom"
    className="py-6 max-w-sm lg:max-w-md border-l bg-background"
  >
    <SheetHeader className="flex flex-col space-y-2">
      <SheetTitle className="text-lg font-semibold">Title</SheetTitle>
      <SheetDescription className="text-sm text-muted-foreground">
        Description
      </SheetDescription>
    </SheetHeader>
    {/* Content */}
  </SheetContent>
</Sheet>
```

---

## Custom Layout Utilities

AskElephant defines these custom Tailwind utilities:

```tsx
// Flex patterns with standard gap (gap-2)
'row-container'        // flex items-center justify-start gap-2 w-full
'row-container-tight'  // flex items-center justify-start gap-1 w-full
'row-container-loose'  // flex items-center justify-start gap-4 w-full
'row-container-right'  // flex items-center justify-end gap-2 w-full
'row-container-center' // flex items-center justify-center gap-2 w-full
'row-container-between'// flex items-center justify-between gap-2 w-full

'col-container'        // flex flex-col items-start gap-2 h-full
'col-container-tight'  // flex flex-col items-start gap-1 h-full
'col-container-loose'  // flex flex-col items-start gap-4 h-full

'row-col-container'    // flex flex-col items-start gap-2 w-full

// Simple flex helpers
'flex-left'            // flex items-center justify-start
'flex-right'           // flex items-center justify-end
'flex-center'          // flex items-center justify-center
'flex-between'         // flex items-center justify-between
'fill-center'          // flex items-center justify-center size-full
```

---

## AI Elements

**Location**: `elephant-ai/web/src/components/ai-elements/`

Reusable AI-specific components:

| Component | File | Usage |
|-----------|------|-------|
| Loader | `loader.tsx` | Animated spinner |
| Message | `message.tsx` | Chat messages |
| Suggestion | `suggestion.tsx` | AI suggestions |
| Reasoning | `reasoning.tsx` | Chain-of-thought |
| Confirmation | `confirmation.tsx` | Action confirmations |
| Sources | `sources.tsx` | Citation sources |
| Panel | `panel.tsx` | AI panel container |
| PromptInput | `prompt-input.tsx` | Text input for AI |

### AI Loader Pattern

```tsx
import { Loader } from '@/components/ai-elements/loader';

<Loader size={16} className="text-muted-foreground" />
```

---

## Interactive States

```tsx
// Hover
'hover:bg-accent'           // Standard hover
'hover:bg-muted/50'         // Subtle hover
'hover:brightness-98'       // Darken slightly

// Focus
'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'

// Disabled
'disabled:cursor-not-allowed disabled:opacity-50'

// Active/Selected
'data-[state=open]:animate-in data-[state=closed]:animate-out'
```

---

## Animation Tokens

```css
--animate-accordion-down: accordion-down 0.2s ease-out;
--animate-accordion-up: accordion-up 0.2s ease-out;
--animate-shimmer: shimmer 2s infinite;
```

Tailwind classes:
```tsx
'animate-spin'        // Spinner rotation
'animate-shimmer'     // Loading shimmer effect
'transition-colors'   // Color transitions (150ms)
'duration-200'        // Standard duration
```

---

## Component Import Patterns

Always import from the UI directory:

```tsx
// UI Components
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// AI Elements
import { Loader } from '@/components/ai-elements/loader';

// Utils
import { cn } from '@/lib/utils';
```

---

## Pattern Changelog

| Date | Pattern | Decision |
|------|---------|----------|
| 2026-01-21 | Full extraction | Extracted from actual elephant-ai codebase |
| | Button default | Uses `primary-dark` (near black), NOT blue |
| | Input height | Custom `h-input-height` (30px) |
| | Card padding | p-6 for header/content/footer |
| | Sheet width | max-w-sm lg:max-w-md |
| | Custom utilities | Using `row-container`, `col-container`, etc. |

---

## Quick Reference

### "Make it look like AskElephant" Checklist

- [ ] Import components from `@/components/ui/`
- [ ] Use `text-sm` for most text (14px)
- [ ] Use `gap-2` for standard spacing (8px)
- [ ] Use `p-6` for card/dialog padding (24px)
- [ ] Use `rounded-md` for buttons/inputs (6px)
- [ ] Use `rounded-lg` for cards (8px)
- [ ] Use `border border-border` for subtle depth
- [ ] Use `shadow-sm` for cards (not heavy shadows)
- [ ] Use `bg-primary-dark` for primary actions (default Button)
- [ ] Use `text-muted-foreground` for secondary text
- [ ] Use `row-container` / `col-container` utilities
