---
name: placement-analysis
description: Analyze codebase structure to determine where components should be placed. Use when deciding component location for context prototypes.
---

# Placement Analysis Skill

Specialized knowledge for analyzing codebase structure and determining optimal component placement.

## When to Use

- Deciding where a new component belongs
- Building context prototypes that integrate with existing UI
- Understanding app navigation patterns
- Mapping feature → location decisions

## Analysis Framework

### Step 1: Feature Classification

| Feature Type | Typical Location | Navigation Pattern |
|--------------|------------------|-------------------|
| CRUD operations | Dedicated page | Sidebar item |
| Settings/Config | Settings area | Nested under Settings |
| Dashboard/Overview | Main area | Primary nav |
| Quick action | Modal or panel | Button trigger |
| Workflow step | Within workflow | Sequential nav |
| Detail view | Side panel | List item click |

### Step 2: Pattern Matching

Analyze existing code for similar features:

**Questions to Answer:**
1. Where do similar features live?
2. What container type do they use?
3. How are they discovered by users?
4. What state management pattern?
5. What routing pattern?

**Locations to Check:**
```
elephant-ai/web/src/components/     # Component patterns
elephant-ai/web/src/pages/          # Page structure  
elephant-ai/web/src/app/            # App routing
elephant-ai/web/src/layouts/        # Layout patterns
```

### Step 3: Integration Type Decision

| Integration | When to Use | User Discovery |
|-------------|-------------|----------------|
| **New Page** | Primary feature, needs full space | Sidebar/nav item |
| **Side Panel** | Detail view, quick edits | Click from list |
| **Modal** | Focused action, confirmation | Button trigger |
| **Embedded Section** | Part of existing page | Scroll to section |
| **Dropdown/Popover** | Quick selection, menu | Icon click |

### Step 4: Navigation Analysis

Determine how users find this feature:

| Entry Point | Best For |
|-------------|----------|
| Primary sidebar | Frequently used features |
| Secondary nav | Sub-features of main areas |
| Header actions | Global actions (new, search) |
| Context menu | Object-specific actions |
| Deep link only | Rarely accessed, specific |

## Output Format

```markdown
## Placement Analysis: [Feature Name]

### Feature Classification
- **Type:** [CRUD / Config / Dashboard / Action / Workflow / Detail]
- **Frequency of Use:** [Daily / Weekly / Monthly / Rare]
- **User Goal:** [What user wants to accomplish]

### Similar Features in Codebase
| Feature | Location | Pattern |
|---------|----------|---------|
| [Similar 1] | `[path]` | [Page/Panel/Modal] |
| [Similar 2] | `[path]` | [Page/Panel/Modal] |

### Recommendation

**Integration Type:** [New Page / Side Panel / Modal / Embedded]

**Location:** `elephant-ai/web/src/components/[domain]/[feature]/`

**Navigation Entry:** [Where in nav structure]

**Rationale:** [2-3 sentences explaining why]

### Alternative Considered
[If there's a valid alternative approach, note it here]
```

## Domain Mapping

AskElephant-specific domain patterns:

| Domain | Path | Contains |
|--------|------|----------|
| Meetings | `components/meetings/` | Call views, recordings, transcripts |
| Insights | `components/insights/` | AI analysis, highlights |
| Integrations | `components/integrations/` | CRM sync, Slack, etc. |
| Settings | `components/settings/` | User/team/org config |
| Workflows | `components/workflows/` | Automation builder |
| Analytics | `components/analytics/` | Dashboards, reports |

## Anti-Patterns

🚩 **Guessing without analysis** - Always check existing patterns
🚩 **Over-nesting** - Keep hierarchy shallow (max 2-3 levels)
🚩 **Ignoring navigation** - Users need to find features
🚩 **One-size-fits-all** - Different features need different containers
🚩 **Orphan components** - Every component needs a home in nav
