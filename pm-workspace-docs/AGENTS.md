# PM Workspace Docs Instructions

This directory contains all PM documentation for AskElephant initiatives.

## Directory Structure

```
pm-workspace-docs/
├── company-context/      # Product vision, guardrails, personas
├── initiatives/          # One folder per initiative
│   └── [name]/
│       ├── _meta.json    # Phase, status, tracking
│       ├── research.md   # User research findings
│       ├── prd.md        # Product requirements
│       ├── design-brief.md
│       ├── engineering-spec.md
│       ├── gtm-brief.md
│       └── prototype-notes.md
├── research/             # General research archives
├── personas/             # Synthetic personas for jury
├── signals/              # Incoming feedback/signals
├── hypotheses/           # Tracked assumptions
└── roadmap/              # Product roadmap
```

## Initiative Lifecycle

Each initiative progresses through phases:

1. **Discovery** - Research and evidence gathering
2. **Define** - PRD, design brief, specs
3. **Build** - Prototype development
4. **Validate** - Jury evaluation
5. **Launch** - GTM and release

## \_meta.json Format

```json
{
  "name": "initiative-name",
  "phase": "build",
  "status": "on_track",
  "personas": ["sales-rep", "revops"],
  "strategic_pillar": "customer-trust",
  "current_version": "v1",
  "updated_at": "2026-01-23T10:00:00Z"
}
```

## Company Context (Always Load First)

Before any PM work:

- `company-context/product-vision.md` - Identity, mission, anti-vision
- `company-context/strategic-guardrails.md` - Decision framework
- `company-context/personas.md` - Who we build for

## Creating New Initiatives

Use `/new-initiative [name]` or copy from `initiatives/_template/`.

## Signals

Incoming feedback goes to `signals/` with the format:

- `sig-YYYY-MM-DD-[source]-[topic].md`
- Linked to initiatives via `_index.json`
