---
notion_id: 2e2f79b2-c8ac-814a-9136-fcc03bf0185a
notion_url: "https://www.notion.so/Universal-Signal-Tables-Engineering-Spec-2e2f79b2c8ac814a9136fcc03bf0185a"
notion_last_edited_time: "2026-01-08T01:00:00.000Z"
sync_last_synced_at: "2026-01-15T02:25:08.125Z"
source: database
database_id: 7321cbcb31a9470fb15d0f472d2c5eb8
---

## Technical Overview

Extends existing Signals infrastructure to support ad-hoc, user-defined extraction patterns organized as tables. NOT a rewrite — adds a table abstraction layer and chat-based configuration.

Key principle: Tables are views + column definitions. Extraction uses existing signal infrastructure.

## New Data Models

### SignalTable

- id, userId, workspaceId, name

- filters (dateRange, repIds, meetingTypes)

- columns (max 5, with prompt and conditions)

- status (draft/running/complete/error)

### SignalTableResult

- Per engagement, per table

- Column results with status (complete/error/skipped)

## Architecture

```javascript
runSignalTable → Queue Jobs → Process Column → Check Condition → Store Result
                (per engagement)  (reuse signal     (skip if unmet)
                                   extraction)
```

## Key APIs

- createSignalTable / updateSignalTable / deleteSignalTable

- runSignalTable / runSignalTablePreview

- signalTables (list) / signalTable (get)

## Dependencies

- Engagement data pipeline ✅

- Transcript storage ✅

- Signal extraction ✅

- Global Chat (~Jan 9) 🔄

## Phases

1. Week 1: Schema + API, CRUD operations

1. Week 1-2: Extraction pipeline, conditional execution

1. Week 2-3: Frontend MVP, chat integration

1. Week 3-4: Polish, templates, performance

---

Full spec: .pm-workspace/initiatives/universal-signal-tables/engineering-spec.md

Engineering Lead: Dylan
