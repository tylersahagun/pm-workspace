# Design System Management

View, create, audit, or update the interface design system.

## Usage

- `/design-system` - View current design system
- `/design-system:init` - Create new system with direction selection
- `/design-system:audit [path]` - Check code against system patterns
- `/design-system:extract [path]` - Extract patterns from existing code
- `/design-system:update` - Add new patterns to system

---

## Behavior

### View Current System

When user says `/design-system`:

1. Read `.interface-design/system.md`
2. Display summary:
   - Direction
   - Spacing grid
   - Depth strategy
   - Key component patterns
3. Ask if they want to update anything

### Initialize New System

When user says `/design-system:init`:

1. Ask about project context:
   - What type of interface? (dashboard, tool, consumer app)
   - What feeling? (professional, friendly, bold, minimal)
   - Dark mode, light mode, or both?

2. Suggest a direction from:
   | Direction | Feel |
   |-----------|------|
   | Precision & Density | Tight, technical, monochrome |
   | Warmth & Approachability | Generous spacing, soft shadows |
   | Sophistication & Trust | Cool tones, layered depth |
   | Boldness & Clarity | High contrast, dramatic space |
   | Utility & Function | Muted, functional density |
   | Data & Analysis | Chart-optimized, numbers-first |

3. Create `.interface-design/system.md` with chosen direction

### Audit Code

When user says `/design-system:audit [path]`:

1. Load `.interface-design/system.md`
2. Scan specified path for:
   - Off-grid spacing values (arbitrary px values)
   - Mixed depth strategies (borders AND shadows)
   - Inconsistent heights
   - Non-semantic color values
   - Missing interactive states

3. Report findings:
   ```
   **Design System Audit: [path]**
   
   ✅ Spacing: On grid (4px base)
   ⚠️ Depth: Mixed strategies (line 45 uses shadow, line 78 uses border)
   ❌ Colors: Hardcoded #6366f1 instead of var(--primary) (line 102)
   ✅ Typography: Consistent
   
   **Recommendations:**
   1. [Specific fix]
   2. [Specific fix]
   ```

### Extract Patterns

When user says `/design-system:extract [path]`:

1. Analyze code at path
2. Identify:
   - Spacing values used
   - Colors used
   - Component patterns (heights, padding, radius)
   - Typography scale

3. Generate pattern summary:
   ```markdown
   **Extracted Patterns from [path]:**
   
   ## Spacing
   Most common: 16px (p-4), 8px (p-2), 24px (p-6)
   Grid: 8px base detected
   
   ## Components
   Button height: 36px (h-9)
   Card padding: 16px (p-4)
   Input height: 40px (h-10)
   
   ## Colors
   Primary actions: indigo-600
   Backgrounds: slate-900, slate-800
   
   Save these patterns to .interface-design/system.md? (y/n)
   ```

### Update Patterns

When user says `/design-system:update`:

1. Ask what pattern to add/update
2. Validate against existing patterns
3. Update `.interface-design/system.md`
4. Confirm changes

---

## Integration

This command works with:

- `interface-design.mdc` rule - Enforces patterns during prototyping
- `prototype-builder.mdc` rule - Loads system before building
- `/proto` command - Applies design system automatically

---

## Design System File Location

`.interface-design/system.md` - Root level, tracked in git

This file is loaded automatically by the interface-design rule when building prototypes.
