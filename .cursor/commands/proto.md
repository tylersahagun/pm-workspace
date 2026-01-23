# Prototype Command

Build interactive Storybook prototypes with multiple creative directions.

## Usage

```
/proto [initiative-name]
```

Optionally include specific instructions:
```
/proto hubspot-config add validation toggle
```

## Behavior

**Delegates to**: `proto-builder` subagent

The subagent will:
1. Load PRD and Design Brief from initiative folder
2. Load design system from `.interface-design/system.md`
3. Create 2-3 creative options (Max Control, Balanced, Efficient)
4. Implement all required AI states (Loading, Success, Error, etc.)
5. Create interactive Flow_* stories for user journeys
6. Build and deploy to Chromatic
7. Document in prototype-notes.md
8. Commit and push changes

## Prerequisites

- PRD should exist at `pm-workspace-docs/initiatives/[name]/prd.md`
- Design Brief should exist at `pm-workspace-docs/initiatives/[name]/design-brief.md`

If these don't exist, run `/pm [name]` first.

## Output

- Components: `elephant-ai/web/src/components/prototypes/[Initiative]/v1/`
- Stories: All options + all states + Flow_* journeys
- Notes: `pm-workspace-docs/initiatives/[name]/prototype-notes.md`
- Chromatic URL for sharing

## Next Steps

After prototype is complete:
- Ready for validation? Run `/validate [name]`
- Need feedback? Share Chromatic URL with stakeholders
- Need iteration? Run `/iterate [name]` after gathering feedback
