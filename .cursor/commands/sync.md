# Sync Command

Process inbox files and sync external sources.

## Usage

```
/sync
```

## Behavior

This is a thin wrapper that processes pending inbox items.

## Process

1. **Check inbox** - Look in `pm-workspace-docs/inbox/` for new files
2. **Categorize** - Identify file type (transcript, ticket, doc, etc.)
3. **Process** - Route to appropriate location
4. **Clean up** - Move processed files or archive

## Inbox Location

`pm-workspace-docs/inbox/`

Drop files here for processing:
- Meeting transcripts → `/ingest transcript`
- Support tickets → `/ingest ticket`
- Research docs → Move to `research/`

## For External Syncs

Use specific commands:
- `/sync-linear` - Pull from Linear
- `/ingest issue [id]` - Pull specific issue

## Next Steps

After sync:
- Review processed signals: `signals/_index.json`
- Find patterns: `/synthesize`
