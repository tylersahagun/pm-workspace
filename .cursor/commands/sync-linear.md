# Sync Linear Issues

Pull issues from Linear that need PM attention and create signals.

## Usage

- `sync linear` - Pull issues with "pm-review" label
- `sync linear --all` - Pull all recent issues (last 7 days)
- `sync linear [issue-id]` - Pull a specific issue by ID

## Process

### 1. Connect to Linear via MCP

Use the Linear MCP to search for issues:

```
Tool: linear_searchIssues
Arguments:
  - query: "" (empty for label search)
  - states: ["Backlog", "Todo", "In Progress"]
  - limit: 20
```

Or for specific labels, first get labels:
```
Tool: linear_getLabels
```

Then filter issues by label ID.

### 2. For Each Issue Found

Extract and structure:
- **ID**: Linear issue identifier
- **Title**: Issue title
- **Description**: Full description
- **Priority**: Linear priority (0-4)
- **State**: Current workflow state
- **Labels**: All applied labels
- **Assignee**: Who's working on it
- **Created**: When it was created
- **Comments**: Recent comments (use linear_getComments)

### 3. Classify Signal Type

Based on labels and content:
- `bug` label → signals/tickets/
- `feature-request` label → signals/issues/
- `customer-feedback` label → signals/conversations/
- Default → signals/issues/

### 4. Create Signal File

Save to appropriate folder:
`pm-workspace-docs/signals/[type]/YYYY-MM-DD-linear-[id].md`

Format:
```markdown
# Linear Issue: [Title]

**ID:** [LINEAR-ID]
**Priority:** [priority]
**State:** [state]
**Created:** [date]
**Assignee:** [name]

## Description

[full description]

## Labels

- [label 1]
- [label 2]

## Comments

### [author] - [date]
[comment content]

---

## PM Analysis

### Personas Affected
[infer from content]

### Problem Statement
[extract core problem]

### Severity Assessment
- Priority: [linear priority mapped]
- Customer Impact: [infer]

### Hypothesis Candidates
[suggest based on content]
```

### 5. Update Index

Add entry to `signals/_index.json`:
```json
{
  "id": "sig-linear-[LINEAR-ID]",
  "type": "issue",
  "source": "linear",
  "linear_id": "[LINEAR-ID]",
  "topic": "[title-slug]",
  "captured_at": "[now]",
  "status": "processed",
  "linear_priority": [0-4],
  "linear_state": "[state]",
  "labels": ["label1", "label2"]
}
```

### 6. Optional: Mark as Reviewed in Linear

Add a label or comment to indicate PM has reviewed:
```
Tool: linear_addIssueLabel
Arguments:
  - issueId: [id]
  - labelId: [pm-reviewed-label-id]
```

Or add a comment:
```
Tool: linear_createComment
Arguments:
  - issueId: [id]
  - body: "📋 Synced to PM workspace for review"
```

## Label Setup (One-time)

Create these labels in Linear for PM workflow:
- `pm-review` - Issues needing PM attention
- `pm-reviewed` - PM has reviewed
- `customer-feedback` - Originated from customer
- `feature-request` - Feature request

## Output

After syncing, report:
```
✅ Synced [X] issues from Linear

New Signals Created:
- [LINEAR-123] Feature request title → signals/issues/
- [LINEAR-456] Bug report → signals/tickets/

Already Synced (skipped):
- [LINEAR-789] Previously imported

Next: Run `/synthesize` to find patterns across signals
```

## Automation

This command can be triggered by:
1. Manual run: `sync linear`
2. Scheduled via launchd (daily)
3. Webhook from Linear (via Pipedream)

For webhook setup, see: `.pm-workspace/integrations/linear-notion-sync/`
