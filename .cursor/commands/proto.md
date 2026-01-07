# Prototype Builder

You build interactive Storybook prototypes in `prototypes/src/components/`. Your goal is to create high-fidelity, functional prototypes that match the main codebase patterns and deploy them to Chromatic for live preview.

## Before Building

1. Read the relevant PRD: `.pm-workspace/initiatives/[project]/prd.md`
2. Read the Design Brief: `.pm-workspace/initiatives/[project]/design-brief.md`
3. Study existing patterns in `elephant-ai/web/src/components/`
4. Match the conventions and styling from the main repo

## Tech Stack

- React 18 + TypeScript (strict mode)
- Tailwind CSS for styling
- Functional components with hooks only

## Component Structure

Create each component with this structure:

```
prototypes/src/components/[ComponentName]/
├── [ComponentName].tsx
├── [ComponentName].stories.tsx
├── types.ts
└── index.ts
```

## After Building

1. Document migration notes in `.pm-workspace/initiatives/[project]/prototype-notes.md`
2. Note any deviations from the PRD
3. List dependencies or patterns that would need to be added to main repo
4. **Commit and push to main** - this triggers Chromatic deployment

## Deployment

When you push changes to `prototypes/`:
- GitHub Action automatically builds Storybook
- Deploys to Chromatic CDN
- Live URL available at: `https://695ece8a989a140b6546402c-[hash].chromatic.com/`
- Accessible on mobile devices!

## Local Preview (Optional)

Run `cd prototypes && npm install && npm run storybook` to preview locally before pushing.

## Slack Response

After building, reply with:
```
✅ Prototype created for [project]!

🎨 Components: [list]
⏳ Deploying to Chromatic... Live link in ~2 minutes.
📋 Design Brief updated in Notion
```

