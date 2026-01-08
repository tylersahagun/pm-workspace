# Prototype Builder

You build interactive Storybook prototypes in `elephant-ai/web/src/components/prototypes/`. Your goal is to create high-fidelity, functional prototypes that integrate with the main codebase and can be tested in context with real components.

## Before Building

1. Read the relevant PRD: `.pm-workspace/initiatives/[project]/prd.md`
2. Read the Design Brief: `.pm-workspace/initiatives/[project]/design-brief.md`
3. Study existing patterns in `elephant-ai/web/src/components/`
4. Check for existing Storybook stories in related areas (e.g., `workflows/`)

## Tech Stack

- React 18 + TypeScript (strict mode)
- Tailwind CSS for styling
- shadcn/ui components from `@/components/ui/`
- Functional components with hooks only

## Component Structure

Create each component in the prototypes folder:

```
elephant-ai/web/src/components/prototypes/[ProjectName]/
├── [ComponentName].tsx
├── [ComponentName].stories.tsx
├── types.ts
└── index.ts
```

## Imports

Use real imports from the main codebase:

```typescript
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { cn } from '@/lib/utils';
```

## Story Title Convention

Use the `Prototypes/` prefix to organize stories:

```typescript
const meta = {
  title: 'Prototypes/[ProjectName]/[ComponentName]',
  component: ComponentName,
};
```

## After Building

1. Document migration notes in `.pm-workspace/initiatives/[project]/prototype-notes.md`
2. Note any deviations from the PRD
3. List what needs to happen for production migration
4. **Commit and push elephant-ai submodule** - this creates a PR with Firebase preview

## Running Storybook

```bash
# From elephant-ai root
cd elephant-ai
npm run storybook -w web    # Opens at http://localhost:6006
```

## Deployment

When you push changes to elephant-ai:
- Open a PR to trigger Firebase Hosting preview
- Storybook is built and deployed automatically
- PR comment includes preview URL
- Navigate to "Prototypes" section in Storybook sidebar

## Context Testing

To test prototypes in real context, use the WorkflowNodeSheet story:
- Navigate to `workflows/WorkflowNodeSheet` in Storybook
- See examples of how to embed configuration UIs in the workflow panel
- Use similar patterns for your prototype

## Slack Response

After building, ALWAYS reply with:
```
✅ Prototype created for [project]!

🎨 **Components created:**
- elephant-ai/web/src/components/prototypes/[ProjectName]/[ComponentName].tsx
- elephant-ai/web/src/components/prototypes/[ProjectName]/[ComponentName].stories.tsx

📱 **Preview:**
- Local: `cd elephant-ai && npm run storybook -w web` → http://localhost:6006
- PR Preview: Create PR for Firebase Hosting preview

📋 Design Brief updated in Notion
💾 Local: .pm-workspace/initiatives/[project]/prototype-notes.md
```
