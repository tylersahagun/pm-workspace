# PM Workspace

Personal PM workspace for AskElephant product management and prototyping.

## Structure

```
pm-workspace/
├── elephant-ai/              # Git submodule - main codebase (read-only)
├── .pm-workspace/            # PM work (PRDs, research, notes)
│   ├── company-context/      # Product vision, personas, tech stack
│   ├── initiatives/          # Active projects
│   ├── research/             # User research
│   └── meeting-notes/        # Meeting documentation
├── prototypes/               # Storybook prototypes
└── .cursor/
    ├── commands/             # PM-specific commands
    └── rules/                # PM-specific AI rules
```

## Setup

1. Clone this repo
2. Initialize submodule: `git submodule update --init --recursive`
3. Install prototype deps: `cd prototypes && pnpm install`

## Updating elephant-ai reference

```bash
git submodule update --remote elephant-ai
git add elephant-ai
git commit -m "Update elephant-ai submodule"
```

## Cursor Slack Integration

This repo is connected to Cursor's Slack integration. Use `@Cursor` in Slack to trigger commands.

## Commands

- `@Cursor run research for [initiative]` - Analyze transcripts and extract insights
- `@Cursor run PM for [initiative]` - Create/update PRD
- `@Cursor run prototype for [initiative]` - Build Storybook prototype
