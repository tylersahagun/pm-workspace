# Placement Research

You analyze where a feature should live in the production `elephant-ai` codebase. This command produces a detailed placement report without building anything.

## When to Use

| Scenario | Use This | Use `/context-proto` Instead |
|----------|----------|------------------------------|
| Deep research before any building | ✅ | |
| Engineering planning discussion | ✅ | |
| Quick prototype with integration context | | ✅ (does placement inline) |
| Comparing multiple placement options | ✅ | |

**Note:** `/context-proto` includes lightweight placement analysis automatically. Use `/placement` when you want thorough research without building, or when comparing multiple possible locations.

## Auto-Context Loading

When researching placement, automatically load:

1. Load foundation: `@pm-workspace-docs/company-context/product-vision.md`
2. Load initiative PRD: `@pm-workspace-docs/initiatives/[name]/prd.md`
3. Load Design Brief: `@pm-workspace-docs/initiatives/[name]/design-brief.md`
4. Study component organization: `@elephant-ai/web/src/components/`
5. Study routing/pages: `@elephant-ai/web/src/pages/` (if exists) or routing config

## Research Process

### Step 1: Understand the Feature

From the PRD and design brief, identify:

- **Feature type**: UI component, page, modal, panel, data display, form, workflow step?
- **Scope**: Single component, component family, full page, or cross-cutting feature?
- **Data sources**: What APIs/hooks does it need?
- **User entry points**: How do users get to this feature?

### Step 2: Analyze Existing Structure

Explore `elephant-ai/web/src/components/` to understand:

| Category | Pattern | Examples |
|----------|---------|----------|
| **Domain folders** | Features grouped by domain | `integrations/`, `workflows/`, `signals/`, `chat/` |
| **Shared components** | Reusable UI primitives | `ui/` (shadcn), standalone `.tsx` files |
| **Feature groupings** | Related components together | `crm-update/`, `knowledge-base/`, `health-score/` |
| **Root-level** | Single-purpose utilities | `copy-to-clipboard.tsx`, `gradient-fade-out.tsx` |

### Step 3: Identify Integration Points

Research how the feature connects to existing parts of the app:

- **Navigation**: Where in the nav/sidebar would users access this?
- **Context**: Which pages/views would embed this component?
- **Data flow**: What providers/hooks does it need access to?
- **Related features**: What adjacent features should be aware of it?

### Step 4: Check for Existing Patterns

Look for similar implementations:

```
# Search for similar component patterns
grep -r "[similar feature keyword]" elephant-ai/web/src/components/
```

Document:
- Components with similar UX patterns
- Reusable hooks or utilities to leverage
- UI patterns to stay consistent with

## Output: Placement Report

Save to `pm-workspace-docs/initiatives/[name]/placement-research.md`:

```markdown
# Placement Research: [Feature Name]

## Feature Classification

- **Type**: [component | component-family | page | modal | panel | workflow-step]
- **Scope**: [isolated | integrated | cross-cutting]
- **Domain**: [integrations | workflows | signals | chat | other]

## Recommended Location

### Primary Component(s)

| Component | Recommended Path | Rationale |
|-----------|-----------------|-----------|
| [Main] | `components/[domain]/[name]/` | [Why this location] |
| [Supporting] | `components/[domain]/[name]/` | [Why grouped together] |

### Alternative Options Considered

1. **[Path A]** - Pros: [x]. Cons: [y]. Rejected because: [z]
2. **[Path B]** - Pros: [x]. Cons: [y]. Rejected because: [z]

## Integration Points

### Navigation Entry Points

- [ ] Main sidebar: `[section]` → `[item]`
- [ ] Page header action button
- [ ] Context menu in `[component]`
- [ ] Other: [describe]

### Embedding Contexts

| Context | Component | How It Embeds |
|---------|-----------|---------------|
| [Page/View name] | `[Parent.tsx]` | [Modal | Panel | Inline | Full page] |

### Data Dependencies

- **Hooks needed**: `use[X]`, `use[Y]`
- **Context providers**: `[Provider]`
- **API routes**: `/api/[endpoint]`

## Existing Patterns to Follow

### Similar Components

| Component | Path | Pattern to Reuse |
|-----------|------|------------------|
| [Similar] | `components/[path]` | [What to copy] |

### Reusable Utilities

- `@/components/ui/[component]` - [What it provides]
- `@/hooks/use[Hook]` - [What it provides]
- `@/lib/[util]` - [What it provides]

## Component File Structure

When building, create this structure:

```
elephant-ai/web/src/components/[domain]/[feature-name]/
├── [FeatureName].tsx           # Main component
├── [FeatureName].stories.tsx   # Storybook stories
├── [SubComponent].tsx          # Supporting components
├── types.ts                    # TypeScript types
├── hooks/                      # Feature-specific hooks
│   └── use[Feature].ts
├── utils/                      # Feature-specific utilities
└── index.ts                    # Barrel export
```

## Pre-Flight Checklist

Before building the context prototype:

- [ ] Confirmed component doesn't already exist
- [ ] Identified all UI primitives to import from `@/components/ui/`
- [ ] Mapped data dependencies and providers
- [ ] Documented navigation integration approach
- [ ] Listed similar components for pattern reference

## Next Steps

1. Run `/context-proto [name]` to build the in-context prototype
2. Review placement with engineering before promotion
3. After validation, move from `prototypes/` to recommended location
```

## Response Template

```
✅ Placement research complete for [name]!

📍 **Recommended Location:**
`elephant-ai/web/src/components/[domain]/[FeatureName]/`

**Rationale:** [1-2 sentence explanation]

🔗 **Integration Points:**
- Navigation: [Where in sidebar/nav]
- Embedded in: [Which pages/views]
- Data from: [Hooks/APIs needed]

📐 **Similar Patterns:**
- `components/[similar]/` - [What to reference]

📁 **Saved to:** `pm-workspace-docs/initiatives/[name]/placement-research.md`

**Next:** Say `/context-proto [name]` to build the in-context prototype
```

## When to Use This Command

- **Before** building a new prototype (to know where it's heading)
- **After** prototype validation (to plan promotion to production)
- **During** engineering handoff (to document integration approach)

## Anti-Patterns

🚩 **Skipping research** - Don't assume location; always verify patterns first
🚩 **Creating new patterns** - Prefer existing organizational patterns unless there's a strong reason
🚩 **Isolated thinking** - Features don't exist in vacuum; map all touchpoints
🚩 **Premature optimization** - Research informs, but don't over-architect before validation
