# AskElephant Design System

**Direction:** Sophistication & Trust  
**Last Updated:** 2026-01-22  
**Extracted From:** `elephant-ai/web/src/components/ui/`

---

## Spacing Grid

**Base unit:** 4px

| Token | Value | Tailwind | Usage |
|-------|-------|----------|-------|
| xs | 4px | `p-1`, `gap-1` | Icon padding, tight gaps |
| sm | 8px | `p-2`, `gap-2` | Standard inline gaps |
| md | 12px | `p-3`, `gap-3` | Component internal padding |
| lg | 16px | `p-4`, `gap-4` | Card padding, section gaps |
| xl | 24px | `p-6`, `gap-6` | Page sections, header padding |
| 2xl | 32px | `p-8`, `gap-8` | Page margins |

**Common patterns:**
- Card: `p-6` (24px padding)
- CardHeader: `space-y-1.5` (6px between title/description)
- CardContent: `p-6 pt-0` (24px sides/bottom, 0 top)
- Section spacing: `space-y-4` to `space-y-8`
- Form fields: `space-y-2` for label-to-input

---

## Typography Scale

Uses Tailwind defaults with semantic hierarchy:

| Variant | Classes | Usage |
|---------|---------|-------|
| h1 | `text-4xl font-extrabold tracking-tight lg:text-5xl` | Page titles |
| h2 | `text-3xl font-semibold tracking-tight` | Section headers |
| h3 | `text-2xl font-semibold tracking-tight` | Card titles |
| h4 | `text-xl font-semibold tracking-tight` | Subsection headers |
| body | `text-sm` (14px) | Primary content |
| small | `text-xs` (12px) | Secondary content, badges |
| extraSmall | `text-[10px]` | Captions, timestamps |

**Weight patterns:**
- Headers: `font-semibold` or `font-extrabold`
- Labels: `font-medium`
- Body: `font-normal`
- Muted: `text-muted-foreground`

---

## Colors

**Semantic colors via CSS variables:**

| Variable | Usage |
|----------|-------|
| `--primary` | Primary actions, links |
| `--primary-foreground` | Text on primary |
| `--secondary` | Secondary buttons, backgrounds |
| `--destructive` | Delete actions, errors |
| `--muted-foreground` | De-emphasized text |
| `--border` | Default borders |
| `--card` | Card backgrounds |
| `--background` | Page backgrounds |
| `--accent` | Hover states |

**Status colors (using Tailwind):**
- Success: `emerald-500/600/700` with `emerald-50/100` backgrounds
- Warning: `amber-500/600` with `amber-50` backgrounds  
- Error: `destructive` variable
- Info: `blue-500/600` with `blue-50` backgrounds

**Badge palette:**
```
rose, orange, yellow, lime, green, teal, blue, indigo, fuchsia, purple, stone
```
Format: `bg-{color}-50 text-{color}-600/700`

---

## Component Heights

| Component | Height | Tailwind |
|-----------|--------|----------|
| Button default | Auto (padding-based) | `px-4 py-2` |
| Button sm | 32px | `h-8` |
| Button lg | 40px | `h-10` |
| Button icon | 32px | `h-8` |
| Input | `h-input-height` | Custom variable |
| Badge sm | ~20px | `px-1.5 py-0.5` |
| Badge md | ~24px | `px-2 py-0.5` |

---

## Border Radius

| Size | Value | Tailwind | Usage |
|------|-------|----------|-------|
| sm | 6px | `rounded-md` | Buttons, inputs, badges |
| md | 8px | `rounded-lg` | Cards, dialogs |
| full | 50% | `rounded-full` | Avatars, circular buttons |

---

## Depth Strategy

**Primary: Subtle shadows + borders**

Cards use BOTH borders and shadows:
```
border bg-card shadow-sm
```

**Shadow scale:**
- `shadow-sm` — Cards, dropdowns (default)
- `shadow-lg` — Modals, popovers, elevated nodes

**Focus states:**
```
focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring
```

---

## Button Variants

| Variant | Base | Hover |
|---------|------|-------|
| default | `bg-primary-dark text-primary-dark-foreground` | `hover:bg-primary-dark/90` |
| primary-blue | `bg-primary text-primary-foreground` | `hover:bg-primary/90` |
| outline | `border border-input bg-transparent` | `hover:bg-root-inverse/4` |
| secondary | `bg-secondary text-secondary-foreground` | `hover:brightness-98` |
| ghost | transparent | `hover:bg-inherit hover:brightness-96` |
| destructive | `bg-destructive text-destructive-foreground` | `hover:bg-destructive/90` |
| destructive-ghost | `text-destructive` | `hover:bg-destructive` |
| link | `text-primary underline-offset-4` | `hover:underline` |

---

## Interactive States

**Buttons:**
```css
/* Disabled */
disabled:cursor-not-allowed disabled:opacity-50

/* Focus */
focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring

/* Hover */
transition-colors
```

**Cards (selectable):**
```css
/* Default */
border-border

/* Selected */
border-primary bg-primary/5

/* Hover (unselected) */
hover:border-primary/50
```

---

## Icons

**Size by context:**
- Inline with text-sm: `h-4 w-4`
- Inline with text-xs: `h-3 w-3`
- Standalone buttons: `h-4 w-4` to `h-5 w-5`
- Feature icons: `h-5 w-5` to `h-8 w-8`

**Icon styling:**
```
[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0
```

---

## Animation

**Transitions:**
- Color changes: `transition-colors`
- Transforms: `transition-transform`

**Loading states:**
- Spinner: `animate-spin`
- Pulse: `animate-pulse`

---

## Patterns to Follow

### Cards
```tsx
<Card>
  <CardHeader className="pb-2">  {/* Tight bottom when content follows */}
    <CardTitle className="text-sm">Title</CardTitle>
    <CardDescription className="text-xs">Description</CardDescription>
  </CardHeader>
  <CardContent className="pt-0">  {/* Zero top when header above */}
    {/* Content */}
  </CardContent>
</Card>
```

### Form Sections
```tsx
<section className="space-y-4">
  <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
    Section Title
  </h2>
  {/* Content */}
</section>
```

### Status Badges with Risk Levels
```tsx
// Low risk (read)
<Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
  Read <Eye className="h-3 w-3" />
</Badge>

// Medium risk (write)
<Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
  Write <Edit className="h-3 w-3" />
</Badge>

// High risk (delete)
<Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200">
  Delete <Trash className="h-3 w-3" />
</Badge>
```

---

## Anti-Patterns

❌ **Off-grid spacing**: Avoid arbitrary values like `p-[13px]`  
❌ **Mixed depth**: Don't use borders on some cards, shadows on others  
❌ **Hardcoded colors**: Use CSS variables, not `text-[#6366f1]`  
❌ **Inconsistent heights**: Buttons in same group should match  
❌ **Missing transitions**: Interactive elements need `transition-*`  
❌ **Forgotten focus states**: Always include `focus-visible:ring-*`
