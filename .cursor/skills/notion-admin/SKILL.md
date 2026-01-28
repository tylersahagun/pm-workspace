---
name: notion-admin
description: Manage Notion as product command center - Projects, Launch Planning, PRDs, EOW syncs, feature flags. Use when running /notion-admin commands or when doing administrative work on Notion databases.
---

# Notion Admin Skill

Procedural knowledge for managing Tyler's Notion workspace as the product command center. This skill provides the exact page IDs, database schemas, and step-by-step procedures for admin operations.

## When to Use

- Running `/notion-admin` command (any mode)
- Creating PRDs in Notion
- Setting up EOW (End-of-Week) sync pages
- Tracking feature flag rollouts
- Connecting GTM to Launch Planning
- Cleaning up Projects database
- Disconnecting Design/Eng Spec relations

## Prerequisites

Requires Notion MCP tools.

**Server:** `user-mcp-notion-jxkjdq`

## Complete Page & Database Reference

### Hub Pages

| Page                   | ID                                 | URL Pattern                                                             | Purpose                           |
| ---------------------- | ---------------------------------- | ----------------------------------------------------------------------- | --------------------------------- |
| Product Command Center | `1d1f79b2c8ac80959271f6714f8ff1e5` | `/ask-elephant/Product-Command-Center-1d1f79b2c8ac80959271f6714f8ff1e5` | Main product dashboard, EOW syncs |
| Revenue Team Hub       | `2dcf79b2c8ac812a9e30eb870ab1626b` | `/ask-elephant/Revenue-Team-Hub-2dcf79b2c8ac812a9e30eb870ab1626b`       | Sales/CS operations               |

### Active Databases (Use These)

| Database            | ID                                     | Data Source ID                         | Purpose                               | Key Fields                                                                   |
| ------------------- | -------------------------------------- | -------------------------------------- | ------------------------------------- | ---------------------------------------------------------------------------- |
| **Projects**        | `2c0f79b2-c8ac-802c-8b15-c84a8fce3513` | `2c0f79b2-c8ac-805c-981b-000b9873980f` | Main project tracking (15 properties) | Project name, Project Phase, Priority, Linear Link, GTM, Engineering, Design |
| **Launch Planning** | `296f79b2-c8ac-8056-82d2-e2c49a1b53ef` | `296f79b2-c8ac-8002-9aae-000bf14c5a26` | Ship dates, rollout                   | Launch Planning, Date, Launch Tier, Status                                   |
| **Roadmap**         | `57302df8-5184-4d1c-ae31-9f8bef588ce6` | `00a678e0-6ea8-498d-8f06-5372414668b6` | Strategic initiatives                 | Theme, Horizon (Now/Next/Later), Quarter                                     |
| **Product Tickets** | `9fb08d43-857b-4bd5-be1e-80ee576da8a4` | `c48f5181-cd78-43ff-b55e-7bf96db5a2d2` | Feature requests, feedback            | Title, Status, Customer Impact                                               |

### Projects Database Schema (Cleaned 2026-01-26)

**15 Properties (down from 27):**

| Property                   | Type      | Purpose                                      |
| -------------------------- | --------- | -------------------------------------------- |
| **Project name**           | Title     | Primary identifier                           |
| **Project Phase**          | Status    | Discovery → Definition → Build → Test → Done |
| **Priority**               | Select    | P0 (critical) → P4 (backlog)                 |
| **Linear Link**            | URL       | Link to Linear project                       |
| **Outcome**                | Rich Text | Business outcome statement                   |
| **Start date**             | Date      | When work begins                             |
| **End Date**               | Date      | Target/actual completion                     |
| **GTM**                    | Relation  | → Launch Planning database                   |
| **Roadmap Initiative**     | Relation  | → Roadmap database                           |
| **Engineering**            | People    | Dev owners                                   |
| **Design**                 | People    | Design owners                                |
| **Sponsors**               | People    | Stakeholder owners                           |
| **Figma Link**             | URL       | Design file link                             |
| **AI summary**             | Rich Text | Context for AI tools                         |
| **Last meaningful update** | Date      | Staleness tracking                           |
| **Project Type**           | Select    | Roadmap / Reactive / Tech Debt / Experiment  |
| **Attach file**            | Files     | Documentation                                |

**Removed Properties (2026-01-26):** Design Briefs, Eng Specs, Customer Conversations, Feedback, Tasks, GTM Plans, 📤 GTM / Launch Plans, 🎫 Product Tickets, Blocked by, Blocking, Parent item, Sub-item

### Visibility Property (Manual Setup Required)

**To add "Visibility" property to Projects Database:**

1. Open [Projects Database](https://www.notion.so/ask-elephant/2c0f79b2c8ac802c8b15c84a8fce3513)
2. Click + to add new property
3. Configure:
   - **Name:** Visibility
   - **Type:** Select
   - **Options:**
     - Internal (gray) - Not customer-facing
     - Alpha (purple) - Internal testing only
     - Beta (blue) - Limited customer rollout
     - GA (green) - Generally available

**Visibility Determination Logic:**

| PostHog Feature Flag State       | Visibility |
| -------------------------------- | ---------- |
| No flag exists                   | Internal   |
| Flag exists, rollout = 0%        | Alpha      |
| Flag exists, 0% < rollout < 100% | Beta       |
| Flag exists, rollout = 100%      | GA         |
| Flag deprecated/removed          | GA         |

**PostHog MCP Tools for Visibility Check:**

```json
// Check feature flags
{
  "server": "user-mcp-posthog-zps2ir",
  "tool": "POSTHOG_LIST_PROJECT_FEATURE_FLAGS",
  "args": { "project_id": "your-project-id" }
}
```

### Legacy Databases (Disconnect)

| Database          | ID       | Data Source ID                         | Migrate To             |
| ----------------- | -------- | -------------------------------------- | ---------------------- |
| Engineering Specs | (linked) | `2c4afb5d-2729-439b-8a07-c2243d7c60a7` | Linear (issues/epics)  |
| Design Briefs     | (linked) | `52148f9a-fe0b-4d8f-a666-e89fc6f3c504` | Figma (files/comments) |

### Other Databases (Reference)

| Database | ID                                     | Purpose          |
| -------- | -------------------------------------- | ---------------- |
| Feedback | `ca570bc6-30b9-46e9-937e-aa7d72fb5de2` | Customer signals |

## Database Schemas

### Projects Database

**ID:** `2c0f79b2-c8ac-802c-8b15-c84a8fce3513`

| Property               | Type      | Values/Format                                                                 |
| ---------------------- | --------- | ----------------------------------------------------------------------------- |
| Project name           | title     | Text                                                                          |
| Project Phase          | status    | Discovery, Definition, Blocked, Build, Test, Done - Beta, Done - Full Release |
| Project Type           | select    | Roadmap initiative, Reactive / customer-driven, Tech debt / infra, Experiment |
| Priority               | select    | P0, P1, P2, P3, P4                                                            |
| Linear Link            | url       | `https://linear.app/askelephant/...`                                          |
| Figma Link             | url       | Figma design link                                                             |
| GTM                    | relation  | → Launch Planning database                                                    |
| GTM Plans              | relation  | → GTM Plans database                                                          |
| Engineering            | people    | User UUIDs                                                                    |
| Design                 | people    | User UUIDs                                                                    |
| Sponsors               | people    | User UUIDs                                                                    |
| Feedback               | relation  | → Feedback database                                                           |
| Customer Conversations | relation  | → Customer Conversations                                                      |
| Roadmap Initiative     | relation  | → Roadmap database                                                            |
| Eng Specs              | relation  | → Eng Specs database (DISCONNECT)                                             |
| Design Briefs          | relation  | → Design Briefs database (DISCONNECT)                                         |
| 🎫 Product Tickets     | relation  | → Product Tickets database                                                    |
| Start date             | date      | YYYY-MM-DD                                                                    |
| End Date               | date      | YYYY-MM-DD                                                                    |
| Last meaningful update | date      | YYYY-MM-DD                                                                    |
| Outcome                | rich_text | Expected outcome                                                              |
| AI summary             | rich_text | Auto-generated summary                                                        |

### Launch Planning Database

**ID:** `296f79b2-c8ac-8056-82d2-e2c49a1b53ef`

| Property             | Type     | Values/Format                  |
| -------------------- | -------- | ------------------------------ |
| Launch Planning      | title    | Text (launch name)             |
| Date                 | date     | YYYY-MM-DD                     |
| Launch Tier          | select   | P1, P2, P3, P4, P5             |
| Status               | status   | Not started, In progress, Done |
| 🚧 Projects Database | relation | → Projects database            |
| Parent item          | relation | Self-reference for hierarchy   |
| Sub-item             | relation | Self-reference for hierarchy   |

**Properties to Add (Recommended):**
| Property | Type | Purpose |
|----------|------|---------|
| Feature Flag | rich_text | PostHog flag name |
| Rollout % | number | Current rollout percentage (0-100) |
| Success Criteria | rich_text | Criteria for full rollout |

### Roadmap Database

**ID:** `57302df8-5184-4d1c-ae31-9f8bef588ce6`

| Property                     | Type     | Values/Format                      |
| ---------------------------- | -------- | ---------------------------------- |
| Theme                        | title    | Text                               |
| Horizon                      | select   | Now, Next, Later                   |
| Quarter                      | select   | Q1, Q2, Q3, Q4                     |
| Status                       | select   | Not started, In progress, Complete |
| Owner                        | people   | User UUID                          |
| Related to Projects Database | relation | → Projects database                |

### Product Tickets Database

**ID:** `9fb08d43-857b-4bd5-be1e-80ee576da8a4`

| Property             | Type      | Values/Format                                                                                             |
| -------------------- | --------- | --------------------------------------------------------------------------------------------------------- |
| Title                | title     | Ticket title                                                                                              |
| Status               | status    | New, Under Review, Needs More Info, Exploring, Duplicate, Not Planned, Planned, Shipped                   |
| Customer Impact      | select    | 🚨 Active churn risk, 🔥 Operational fire, 💰 Expansion / revenue opportunity, 🧭 General feedback / idea |
| Revenue impact (ARR) | select    | <$5k, $5k-$10k, $10k–$50k, $50k–$100k, $100k+                                                             |
| Ticket Type          | select    | General Feedback, Improvement, Idea, Feature Request                                                      |
| Linear link          | url       | Link to Linear issue                                                                                      |
| 🚧 Projects Database | relation  | → Projects database                                                                                       |
| Owner                | people    | User UUIDs                                                                                                |
| Requester            | people    | User UUIDs                                                                                                |
| Description          | rich_text | Ticket description                                                                                        |
| Impact Details       | rich_text | Impact details                                                                                            |

## MCP Tool Usage Patterns

### Querying a Database

```json
{
  "server": "user-mcp-notion-jxkjdq",
  "toolName": "NOTION_QUERY_DATABASE",
  "arguments": {
    "database_id": "2c0f79b2-c8ac-802c-8b15-c84a8fce3513",
    "page_size": 50,
    "sorts": [{ "property_name": "last_edited_time", "ascending": false }]
  }
}
```

### Getting Database Schema

Always do this before updating to verify property names:

```json
{
  "server": "user-mcp-notion-jxkjdq",
  "toolName": "NOTION_FETCH_DATABASE",
  "arguments": {
    "database_id": "2c0f79b2-c8ac-802c-8b15-c84a8fce3513"
  }
}
```

### Updating a Database Row

```json
{
  "server": "user-mcp-notion-jxkjdq",
  "toolName": "NOTION_UPDATE_ROW_DATABASE",
  "arguments": {
    "row_id": "page-uuid-from-query",
    "properties": [
      { "name": "Phase", "type": "select", "value": "Build" },
      {
        "name": "Linear Link",
        "type": "url",
        "value": "https://linear.app/askelephant/project/abc"
      }
    ]
  }
}
```

### Creating a Page in Database

```json
{
  "server": "user-mcp-notion-jxkjdq",
  "toolName": "NOTION_CREATE_NOTION_PAGE",
  "arguments": {
    "parent_database_id": "2c0f79b2-c8ac-805c-981b-000b9873980f",
    "properties": {
      "Project name": { "title": [{ "text": { "content": "New Feature" } }] },
      "Phase": { "select": { "name": "Discovery" } }
    }
  }
}
```

### Creating a Page Under Another Page

```json
{
  "server": "user-mcp-notion-jxkjdq",
  "toolName": "NOTION_CREATE_NOTION_PAGE",
  "arguments": {
    "parent_page_id": "1d1f79b2c8ac80959271f6714f8ff1e5",
    "properties": {
      "title": { "title": [{ "text": { "content": "EOW Sync - 2026-01-26" } }] }
    }
  }
}
```

### Adding Content to a Page

```json
{
  "server": "user-mcp-notion-jxkjdq",
  "toolName": "NOTION_APPEND_TEXT_BLOCKS",
  "arguments": {
    "page_id": "page-uuid",
    "text_blocks": [
      { "type": "heading_2", "text": "This Week" },
      { "type": "paragraph", "text": "Summary of progress..." },
      { "type": "bulleted_list_item", "text": "Item 1" },
      { "type": "bulleted_list_item", "text": "Item 2" }
    ]
  }
}
```

### Searching for Pages

```json
{
  "server": "user-mcp-notion-jxkjdq",
  "toolName": "NOTION_SEARCH_NOTION_PAGE",
  "arguments": {
    "query": "CRM Agent",
    "filter_value": "page",
    "page_size": 10
  }
}
```

### Removing a Relation (Set Empty)

```json
{
  "server": "user-mcp-notion-jxkjdq",
  "toolName": "NOTION_UPDATE_ROW_DATABASE",
  "arguments": {
    "row_id": "project-page-uuid",
    "properties": [{ "name": "Design Briefs", "type": "relation", "value": "" }]
  }
}
```

## Procedures

### Procedure: Audit Notion Structure

**Steps:**

1. **Fetch Projects database schema**

   ```
   NOTION_FETCH_DATABASE(database_id: "2c0f79b2-c8ac-805c-981b-000b9873980f")
   ```

   - Verify property names match expected schema
   - Note any new/unexpected properties

2. **Query all Projects**

   ```
   NOTION_QUERY_DATABASE(database_id: "2c0f79b2-c8ac-805c-981b-000b9873980f", page_size: 100)
   ```

3. **Analyze each project:**
   - Has Linear Link? → Healthy
   - No Linear Link AND Phase = Build/Test? → Problem
   - Has Launch Planning relation? → Good
   - No Launch Planning AND Phase = Test/Done? → Orphaned
   - Last edited > 30 days AND Phase ≠ Done? → Stale

4. **Query Launch Planning**

   ```
   NOTION_QUERY_DATABASE(database_id: "296f79b2-c8ac-8002-9aae-000bf14c5a26", page_size: 100)
   ```

5. **Analyze each launch:**
   - Date past AND Status ≠ Done? → Overdue
   - No Projects relation? → Orphaned
   - Has Feature Flag? → Track rollout

6. **Generate audit report** with counts and recommendations

### Procedure: Clean Projects Database

**Steps:**

1. Run audit procedure first
2. For each issue type, confirm with user via AskQuestion:
   - "Found 3 projects without Linear links. Auto-add placeholder?"
   - "Found 2 orphaned projects. Archive them?"
3. Execute fixes:
   - Missing Linear Link: Add placeholder or prompt for URL
   - Orphaned: Archive (set Phase to "Cancelled" or archive page)
   - Stale: Set Phase to "On Hold"

### Procedure: Create PRD Page

**Inputs:** `project_name`, optionally `linear_url`

**Steps:**

1. **Search for existing project**

   ```
   NOTION_SEARCH_NOTION_PAGE(query: "[project_name]", filter_value: "page")
   ```

2. **If exists in Projects database:**
   - Get page ID
   - Update with PRD content

3. **If new:**
   - Create in Projects database:
     ```
     NOTION_CREATE_NOTION_PAGE(
       parent_database_id: "2c0f79b2-c8ac-805c-981b-000b9873980f",
       properties: {
         "Project name": {"title": [{"text": {"content": "[name]"}}]},
         "Phase": {"select": {"name": "Discovery"}}
       }
     )
     ```

4. **Add PRD content:**

   ```
   NOTION_APPEND_TEXT_BLOCKS(page_id: "[new_page_id]", text_blocks: [
     {"type": "heading_1", "text": "[name] PRD"},
     {"type": "heading_2", "text": "Problem Statement"},
     {"type": "paragraph", "text": "[to be filled]"},
     {"type": "heading_2", "text": "Success Metrics"},
     {"type": "paragraph", "text": "[to be filled]"},
     {"type": "heading_2", "text": "User Stories"},
     {"type": "paragraph", "text": "[to be filled]"},
     {"type": "heading_2", "text": "Requirements"},
     {"type": "heading_3", "text": "Must Have"},
     {"type": "paragraph", "text": "- "},
     {"type": "heading_3", "text": "Nice to Have"},
     {"type": "paragraph", "text": "- "},
     {"type": "heading_3", "text": "Out of Scope"},
     {"type": "paragraph", "text": "- "},
     {"type": "heading_2", "text": "Technical Considerations"},
     {"type": "paragraph", "text": "See Linear for engineering details."},
     {"type": "heading_2", "text": "Launch Plan"},
     {"type": "paragraph", "text": "[link to Launch Planning entry]"},
     {"type": "heading_2", "text": "Open Questions"},
     {"type": "paragraph", "text": "- "}
   ])
   ```

5. **If linear_url provided:**
   ```
   NOTION_UPDATE_ROW_DATABASE(row_id: "[page_id]", properties: [
     {"name": "Linear Link", "type": "url", "value": "[linear_url]"}
   ])
   ```

### Procedure: Create EOW Sync Page

**Inputs:** `date` (default: today)

**Steps:**

1. **Query active projects** (Phase = Build or Test)

   ```
   NOTION_QUERY_DATABASE(database_id: "2c0f79b2-c8ac-805c-981b-000b9873980f")
   Filter client-side for Build/Test phase
   ```

2. **Query upcoming launches** (Date within 14 days)

   ```
   NOTION_QUERY_DATABASE(database_id: "296f79b2-c8ac-8002-9aae-000bf14c5a26")
   Filter client-side for upcoming dates
   ```

3. **Query recent completions** (Status = Done, Date this week)

4. **Create EOW page under Product Command Center:**

   ```
   NOTION_CREATE_NOTION_PAGE(
     parent_page_id: "1d1f79b2c8ac80959271f6714f8ff1e5",
     properties: {
       "title": {"title": [{"text": {"content": "EOW Sync - [date]"}}]}
     }
   )
   ```

5. **Add EOW content:**

   ```
   NOTION_APPEND_TEXT_BLOCKS(page_id: "[eow_page_id]", text_blocks: [
     {"type": "heading_1", "text": "EOW Sync - [date]"},
     {"type": "heading_2", "text": "This Week"},
     {"type": "heading_3", "text": "Shipped 🚀"},
     // Add completed launches
     {"type": "heading_3", "text": "In Progress"},
     // Add active projects table
     {"type": "heading_3", "text": "Blocked"},
     {"type": "paragraph", "text": "[any blockers]"},
     {"type": "heading_2", "text": "Feature Flag Rollout"},
     // Add feature flag table
     {"type": "heading_2", "text": "Next Week Focus"},
     {"type": "paragraph", "text": "- "},
     {"type": "heading_2", "text": "Questions/Decisions Needed"},
     {"type": "paragraph", "text": "- "}
   ])
   ```

6. **Also save to PM workspace:**
   Save copy to `pm-workspace-docs/status/eow-YYYY-MM-DD.md`

### Procedure: Track Feature Flag Rollout

**Inputs:** `project_name`, `flag_name`, `rollout_percentage`

**Steps:**

1. **Find project in Projects database**

   ```
   NOTION_SEARCH_NOTION_PAGE(query: "[project_name]", filter_value: "page")
   ```

2. **Find or create Launch Planning entry**
   - Query Launch Planning for matching project
   - If none, create new entry

3. **Update Launch Planning with flag info:**

   ```
   NOTION_UPDATE_ROW_DATABASE(row_id: "[launch_page_id]", properties: [
     {"name": "Feature Flag", "type": "rich_text", "value": "[flag_name]"},
     {"name": "Rollout %", "type": "number", "value": "[percentage]"}
   ])
   ```

4. **Add rollout history to page content:**
   ```
   NOTION_APPEND_TEXT_BLOCKS(page_id: "[launch_page_id]", text_blocks: [
     {"type": "heading_2", "text": "Rollout History"},
     {"type": "paragraph", "text": "| Date | % | Notes |"},
     {"type": "paragraph", "text": "|------|---|-------|"},
     {"type": "paragraph", "text": "| [today] | [%] | [notes] |"}
   ])
   ```

### Procedure: Sync GTM to Launch Planning

**Steps:**

1. **Query Projects with GTM content**
   - Search for pages containing "GTM" or "Go-to-Market"
   - Or check for GTM-related relations/links

2. **Query Launch Planning database**

3. **For each Project with GTM:**
   - Find matching Launch Planning entry (by name similarity)
   - If found, update relation:
     ```
     NOTION_UPDATE_ROW_DATABASE(row_id: "[project_id]", properties: [
       {"name": "Launch Planning", "type": "relation", "value": "[launch_id]"}
     ])
     ```
   - Also update Launch Planning to point back:
     ```
     NOTION_UPDATE_ROW_DATABASE(row_id: "[launch_id]", properties: [
       {"name": "Projects Database", "type": "relation", "value": "[project_id]"}
     ])
     ```

4. **Report connections made**

### Procedure: Disconnect Design Briefs

**Steps:**

1. **Query Projects with Design Brief relations**

2. **For each project:**
   - Document current Design Brief links (save to notes)
   - Remove relation:
     ```
     NOTION_UPDATE_ROW_DATABASE(row_id: "[project_id]", properties: [
       {"name": "Design Briefs", "type": "relation", "value": ""}
     ])
     ```

3. **Add note to project page:**

   ```
   NOTION_APPEND_TEXT_BLOCKS(page_id: "[project_id]", text_blocks: [
     {"type": "callout", "text": "📝 Design work has moved to Figma. Check Figma for design files."}
   ])
   ```

4. **Do NOT delete Design Briefs database** - keep for reference

### Procedure: Disconnect Engineering Specs

Same as Design Briefs, but for Engineering Specs → Linear

**Note:** Add to project page:

```
📝 Engineering specs have moved to Linear. Check Linear epics for technical details.
```

### Procedure: Create Documentation Subpages

Creates child pages under each Notion project with full documentation from PM workspace.

**Inputs:** `project_name` or run for all projects

**Steps:**

1. **Map PM workspace initiatives to Notion projects**
   - Load all initiatives from `pm-workspace-docs/initiatives/`
   - Query Notion Projects database
   - Match by name similarity or `notion_project_id` in `_meta.json`

2. **Check PM workspace documentation**
   For each initiative:

   ```
   has_prd = exists("initiatives/[name]/prd.md")
   has_research = exists("initiatives/[name]/research.md")
   has_design_brief = exists("initiatives/[name]/design-brief.md")
   ```

3. **Check for existing subpages in Notion**
   Query children of project page:

   ```json
   {
     "server": "user-mcp-notion-jxkjdq",
     "toolName": "NOTION_FETCH_ALL_BLOCK_CONTENTS",
     "arguments": { "page_id": "[project-page-uuid]" }
   }
   ```

   Look for `child_page` blocks with titles like "PRD - Full Requirements"

4. **Create subpages if docs exist and no subpage**
   ```json
   {
     "server": "user-mcp-notion-jxkjdq",
     "toolName": "NOTION_CREATE_NOTION_PAGE",
     "arguments": {
       "parent_page_id": "[project-page-uuid]",
       "title": "PRD - Full Requirements",
       "content_markdown": "[Full PRD content from prd.md]"
     }
   }
   ```

**Subpage Types:**

| Subpage      | Title                     | Source File                          |
| ------------ | ------------------------- | ------------------------------------ |
| PRD          | "PRD - Full Requirements" | `initiatives/[name]/prd.md`          |
| Research     | "Research Documentation"  | `initiatives/[name]/research.md`     |
| Design Brief | "Design Brief"            | `initiatives/[name]/design-brief.md` |

**Content Transformation Rules:**

- Convert markdown to Notion-compatible format
- Anonymize customer names in quotes (replace with "Customer A", etc.)
- Keep outcome chains, user stories, metrics tables
- Preserve code blocks and formatting
- Truncate if > 5000 characters (add "[Full doc in PM workspace]")

**Privacy Rules:**

- NEVER include customer names or company names
- NEVER include raw transcript content
- NEVER include internal concerns or red flags
- ANONYMIZE all quotes from research

5. **Report created subpages**

   ```markdown
   ## Documentation Subpages Created

   | Project           | PRD | Research | Design Brief   |
   | ----------------- | --- | -------- | -------------- |
   | Rep Workspace     | ✅  | ✅       | ✅             |
   | Settings Redesign | ✅  | ✅       | ❌ (no source) |
   ```

**Known Project Page IDs:**

| Project                 | Notion Page ID                         |
| ----------------------- | -------------------------------------- |
| Rep Workspace           | `2eaf79b2-c8ac-8180-b691-d47b08c84978` |
| Settings Redesign       | `2eaf79b2-c8ac-812e-a058-fe0ae17dfd7e` |
| Universal Signal Tables | `2e2f79b2-c8ac-81e0-9481-e3a196a216ea` |
| Call Import Engine      | `2e7f79b2-c8ac-81c7-a62d-d3b5bbfad5c8` |
| Global Chat             | `2c0f79b2-c8ac-8199-8b42-c3e9126cac78` |
| Feature Flag Audit      | `2e7f79b2-c8ac-81a4-bd34-c955b8d07595` |

## Recommended New Properties

Based on user requirements, suggest adding these properties to databases:

### Launch Planning (Add These)

| Property         | Type      | Purpose                    |
| ---------------- | --------- | -------------------------- |
| Feature Flag     | rich_text | PostHog flag name          |
| Rollout %        | number    | Current rollout percentage |
| GTM Link         | url       | Link to GTM brief/page     |
| Success Criteria | rich_text | Criteria for 100% rollout  |
| Rollback Plan    | rich_text | What to do if issues       |

### Projects (Add These)

| Property   | Type   | Purpose                    |
| ---------- | ------ | -------------------------- |
| PRD Status | select | Draft, In Review, Approved |
| Last EOW   | date   | Last included in EOW sync  |

## Error Recovery

### "Property not found"

1. Run `NOTION_FETCH_DATABASE` to get actual schema
2. Compare with expected schema
3. Report discrepancy
4. Suggest: Create missing property or use existing equivalent

### "Invalid select option"

1. Run `NOTION_FETCH_DATABASE` to get valid options
2. Show user the valid options
3. Suggest closest match

### Rate limiting

1. Add 1-second delay between operations
2. For bulk operations, batch in groups of 10
3. If still rate limited, wait 30 seconds and retry

## Integration with PM Workspace

### Sync Direction

| From                   | To                       | Trigger             |
| ---------------------- | ------------------------ | ------------------- |
| Notion Projects        | PM workspace initiatives | `/sync-notion`      |
| PM workspace signals   | Notion Feedback          | `/ingest`           |
| Notion Launch Planning | PM workspace status      | `/notion-admin eow` |

### Cross-Reference

When creating/updating Notion pages, also:

1. Check if initiative exists in `pm-workspace-docs/initiatives/[slug]/`
2. If exists, update `_meta.json` with Notion page ID
3. If not, suggest creating initiative: `/new-initiative [name]`

## Output Templates

### Audit Report

```markdown
# Notion Admin Audit

**Date:** YYYY-MM-DD HH:MM
**Databases Scanned:** 3

## Summary

| Database        | Total | Healthy | Issues |
| --------------- | ----- | ------- | ------ |
| Projects        | XX    | XX      | XX     |
| Launch Planning | XX    | XX      | XX     |
| Roadmap         | XX    | XX      | XX     |

## Issues Found

### Projects Database

#### Missing Linear Link (X items)

| Project | Phase | Recommendation |
| ------- | ----- | -------------- |

#### Orphaned - No Launch Planning (X items)

| Project | Phase | Recommendation |
| ------- | ----- | -------------- |

#### Stale - No Activity 30+ Days (X items)

| Project | Last Edit | Recommendation |
| ------- | --------- | -------------- |

### Launch Planning Database

#### Overdue (X items)

| Launch | Date | Status | Recommendation |
| ------ | ---- | ------ | -------------- |

#### Missing Project Link (X items)

| Launch | Tier | Recommendation |
| ------ | ---- | -------------- |

## Recommendations

1. **High Priority:** [Most urgent fix]
2. **Medium Priority:** [Second priority]
3. **Low Priority:** [Nice to have]

## Next Steps

- Run `/notion-admin projects --clean` to auto-fix safe issues
- Manual review needed for X items
```

### Operation Log

```markdown
# Notion Admin: [Operation Name]

**Timestamp:** YYYY-MM-DD HH:MM
**Mode:** [audit/projects/launches/prd/eow/flags/sync-gtm]
**Status:** ✅ Success / ⚠️ Partial / ❌ Failed

## Actions Taken

1. [Action 1]
2. [Action 2]

## Pages Modified

| Page   | Database | Change         |
| ------ | -------- | -------------- |
| [Name] | Projects | [What changed] |

## Created

- [New page URL]

## Notes

[Any observations or warnings]

## Next Steps

- [Suggested follow-up]
```
