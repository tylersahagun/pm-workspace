# Sync Notion Inbox

Pull items from a Notion inbox database and create signals.

## Usage

- `sync notion` - Pull unprocessed items from PM Inbox database
- `sync notion feedback` - Pull from Feedback database
- `sync notion [page-url]` - Pull a specific page

## Setup

### Notion Inbox Database

Create a database in Notion with these properties:
- **Name** (title): Item name
- **Status** (select): "New", "Reviewed", "Processed"
- **Type** (select): "Transcript", "Ticket", "Feedback", "Note"
- **Source** (text): Where this came from
- **Priority** (select): "High", "Medium", "Low"
- **Date Added** (date): When it was added

Database ID: [Configure in your Notion workspace]

## Process

### 1. Search Notion for New Items

Use Notion MCP to find unprocessed items:

```
Tool: notion-search
Arguments:
  query: "status:New"
  query_type: "internal"
  data_source_url: "collection://[inbox-database-id]"
```

Or search recent items:
```
Tool: notion-search
Arguments:
  query: "[topic]"
  query_type: "internal"
  filters:
    created_date_range:
      start_date: "[7 days ago]"
```

### 2. Fetch Full Content

For each result, get the full page:

```
Tool: notion-fetch
Arguments:
  url: "[page-url-from-search]"
```

### 3. Extract Signal Data

From each Notion page, extract:
- Title
- All text content
- Properties (type, source, priority)
- Any linked pages or databases
- Comments

### 4. Create Signal File

Map Notion type to signal folder:
- "Transcript" → signals/transcripts/
- "Ticket" → signals/tickets/
- "Feedback" → signals/conversations/
- "Note" → signals/issues/

Save to:
`pm-workspace-docs/signals/[type]/YYYY-MM-DD-notion-[page-id].md`

Format:
```markdown
# [Title]

**Source:** Notion - [source property]
**Type:** [type property]
**Priority:** [priority property]
**Date Added:** [date]
**Notion URL:** [page url]

## Content

[full page content converted to markdown]

---

## PM Analysis

### Auto-Detected
- **Personas:** [inferred]
- **Severity:** [from priority property]
- **Problems:** [extracted problem statements]

### Hypothesis Candidates
[suggested based on content]
```

### 5. Update Notion Status

Mark the item as processed:

```
Tool: notion-update-page
Arguments:
  pageId: "[page-id]"
  properties:
    Status:
      select:
        name: "Processed"
```

### 6. Update Signals Index

Add entry to `signals/_index.json`:
```json
{
  "id": "sig-notion-[page-id]",
  "type": "[mapped-type]",
  "source": "notion",
  "notion_id": "[page-id]",
  "notion_url": "[url]",
  "topic": "[title-slug]",
  "captured_at": "[now]",
  "status": "processed",
  "original_priority": "[notion priority]"
}
```

## Existing Notion Databases

Reference these databases (from pm-workspace.mdc):

| Database | ID | Use |
|----------|----|----|
| Feedback | ca570bc6-30b9-46e9-937e-aa7d72fb5de2 | Customer feedback signals |
| Projects | 2c0f79b2-c8ac-805c-981b-000b9873980f | Reference only |

## Output

After syncing:
```
✅ Synced [X] items from Notion

New Signals Created:
- "Customer call notes" (Transcript) → signals/transcripts/
- "Support request #123" (Ticket) → signals/tickets/

Updated in Notion:
- [X] pages marked as "Processed"

Next: Run `/synthesize` to find patterns
```

## Two-Way Sync

This command also supports pushing signals TO Notion:

`sync notion --push [signal-id]`

This creates a Feedback entry in Notion from a local signal file.

## Automation

Can be triggered by:
1. Manual: `sync notion`
2. Scheduled via launchd
3. Notion webhook (via Pipedream)
