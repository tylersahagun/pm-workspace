# Figma Sync Command

Synchronize Figma designs into Storybook stories and code scaffolds.

## Usage

```
/figma-sync [initiative-name] [figma-url]
/figma-sync [initiative-name] [figma-url] --exact
```

## Behavior

**Delegates to**: `figma-sync` subagent

The subagent will:
1. Extract component spec from Figma using MCP tools
2. Map variants to TypeScript prop enums
3. Generate Storybook stories for all variants
4. Scaffold component code with proper types
5. Create Figma embed for design reference
6. Save spec for re-sync capability

## Prerequisites

- Figma URL must include `node-id` parameter
- Component must use Figma's Component Set variants

## Modes

### Default Mode
Generates clean, production-ready scaffolds:
- TypeScript types from spec
- Story for each variant
- Component scaffold with Tailwind

### Exact Mode (--exact)
Preserves exact Figma output:
- Creates `figma-generated/` subfolder
- Raw Figma code preserved
- For pixel-perfect comparison

## Output Files

```
elephant-ai/web/src/components/prototypes/[ProjectName]/
├── [ComponentName].tsx              # Component scaffold
├── [ComponentName].stories.tsx      # Stories with Figma embed
├── types.ts                         # TypeScript types
└── index.ts                         # Barrel export

pm-workspace-docs/initiatives/[name]/
├── figma-spec.json                  # Canonical spec
└── figma-sync-log.md                # Sync history
```

## Figma Naming Requirements

For reliable extraction:
- Use Component Set variants (properly named)
- Boolean properties for toggles
- Consistent naming: `Button / variant=primary, size=md`

## Re-Sync

When Figma changes, run again:
- Preserves custom logic
- Updates variant names, prop types
- Flags breaking changes

## Next Steps

After sync:
- Preview in Storybook: `cd elephant-ai && npm run storybook -w web`
- Validate with jury: `/validate [name]`
