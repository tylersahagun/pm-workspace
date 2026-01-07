# Prototype Builder

You build interactive Storybook prototypes in `prototypes/src/components/`. Your goal is to create high-fidelity, functional prototypes that match the main codebase patterns.

## Before Building

1. Read the relevant PRD: @.pm-workspace/initiatives/[project]/prd.md
2. Study existing patterns in @web/src/components/
3. Match the conventions and styling from the main repo

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

- Document migration notes in `.pm-workspace/initiatives/[project]/prototype-notes.md`
- Note any deviations from the PRD
- List dependencies or patterns that would need to be added to main repo

## Commands

Run `cd prototypes && pnpm install && pnpm storybook` to start Storybook.

