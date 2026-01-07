# Cursor Slack Commands

Simple commands for PM workflows. Say what you want → get docs in Notion + Slack.

---

## Quick Reference

| What you say                             | What happens                                                     |
| ---------------------------------------- | ---------------------------------------------------------------- |
| `@Cursor research hubspot-config`        | Analyzes transcript → Creates Notion Feedback entry → Slack link |
| `@Cursor PM hubspot-config`              | Creates Project + Design + Eng + GTM docs in Notion              |
| `@Cursor prototype hubspot-config`       | Builds Storybook prototype → Updates Notion Design Brief         |
| `@Cursor new initiative salesforce-sync` | Creates local initiative folder from template                    |

---

## Research

Analyze a transcript and log findings to Notion.

```
@Cursor research hubspot-config
```

Or with a transcript:

```
@Cursor research hubspot-config

Here's the transcript from today's call:
[paste transcript]
```

**What it does:**

- Extracts key decisions, user problems, action items
- Saves to `.pm-workspace/initiatives/hubspot-config/research.md`
- Creates Feedback entry in Notion
- Sends you Notion link in Slack

**Slack response:**

```
✅ Research complete for hubspot-config!

Key Findings:
- Users need bulk edit capability
- Field mapping is confusing
- Top pain: no visual sync status

📋 Notion: View Feedback Entry
💾 Local: .pm-workspace/initiatives/hubspot-config/research.md

Next: Say 'PM hubspot-config' to create project documentation
```

---

## PM / PRD

Create full project documentation in Notion.

```
@Cursor PM hubspot-config
```

Or:

```
@Cursor PRD hubspot-config
```

**What it creates:**

| Document             | Notion Database   | Focus                                 |
| -------------------- | ----------------- | ------------------------------------- |
| **Project Overview** | Projects          | Problem, outcomes, MVP scope          |
| **Design Brief**     | Design Briefs     | User flows, interactions, affordances |
| **Engineering Spec** | Engineering Specs | Architecture, APIs, data models       |
| **GTM Brief**        | GTM Plans         | Value prop, messaging, launch tier    |

**Slack response:**

```
✅ Project documentation created for hubspot-config!

📋 Notion Links:
- Project Overview: https://notion.so/...
- Design Brief: https://notion.so/...
- Engineering Spec: https://notion.so/...
- GTM Plan: https://notion.so/...

💾 Local Files:
- prd.md
- design-brief.md
- engineering-spec.md
- gtm-brief.md

Next: Say 'prototype hubspot-config' to build interactive prototype
```

---

## Prototype

Build a Storybook prototype, deploy it, and get a live URL.

```
@Cursor prototype hubspot-config
```

Or:

```
@Cursor proto hubspot-config
```

Or with specific instructions:

```
@Cursor proto hubspot-config "Add a toggle for validation rules"
```

**What it does:**

1. Reads PRD and Design Brief for context
2. Creates React components with Storybook stories
3. Commits and pushes to main
4. Triggers Chromatic deployment (via GitHub Action)
5. Sends you a **live preview URL** in Slack
6. Updates Design Brief status in Notion

**Slack response (immediate):**

```
✅ Prototype created for hubspot-config!

🎨 Components:
- HubSpotFieldMapper.tsx
- HubSpotFieldMapper.stories.tsx
- SyncStatusIndicator.tsx

⏳ Deploying to Chromatic... You'll receive a live link in ~2 minutes.
```

**Slack response (after deploy):**

```
🎨 New Storybook Prototype Ready!

Preview your prototype:
https://main--abc123.chromatic.com

[📱 Open Storybook] [🔍 View in Chromatic]

Branch: main
Commit: abc123
```

**📱 Mobile access:** Click the Storybook link directly from Slack on your phone!

---

## New Initiative

Create a new initiative folder from template.

```
@Cursor new initiative salesforce-sync
```

With initial context:

```
@Cursor new initiative salesforce-sync

Context: Users report slow sync times. Need to investigate batch processing.
```

---

## Full Workflow Example

**Step 1: After a user call**

```
@Cursor research hubspot-config

Transcript from today's call with James:
[paste transcript]
```

→ Gets Notion Feedback link

**Step 2: Create full documentation**

```
@Cursor PM hubspot-config
```

→ Gets 4 Notion page links (Project, Design, Eng, GTM)

**Step 3: Build prototype**

```
@Cursor prototype hubspot-config
```

→ Gets Storybook components + updated Design Brief

---

## What Gets Created

### In Notion

| Database          | Page Title                      | Status      |
| ----------------- | ------------------------------- | ----------- |
| Projects          | [Initiative Name]               | Discovery   |
| Design Briefs     | [Initiative] - Design Brief     | Not Started |
| Engineering Specs | [Initiative] - Engineering Spec | Not Started |
| GTM Plans         | [Initiative] Launch             | Not Started |

All pages are automatically linked via Notion relations.

### Locally (in pm-workspace)

```
.pm-workspace/initiatives/[name]/
├── prd.md              # Main overview
├── research.md         # User research
├── design-brief.md     # Design spec
├── engineering-spec.md # Tech spec
├── gtm-brief.md        # Marketing spec
├── decisions.md        # Decision log
└── prototype-notes.md  # Migration notes
```

---

## Tips

- **Use short names**: `hubspot-config` not `hubspot-agent-configuration-ui`
- **Paste transcripts directly**: No need to save files first
- **One step at a time**: Research → PM → Prototype
- **Check Notion links**: Click them directly from Slack on mobile
- **Local files are backup**: Everything is also saved in pm-workspace
- **Prototype on mobile**: Open Chromatic links directly in your phone browser

---

## Setup (One-Time)

### Required for Prototype Live Links

To get live Storybook URLs on your phone, you need to set up Chromatic:

1. **Create Chromatic account**: [chromatic.com](https://www.chromatic.com) → Sign in with GitHub
2. **Add pm-workspace project** → Copy the Project Token
3. **Add GitHub secrets** in `pm-workspace` repo settings:
   - `CHROMATIC_PROJECT_TOKEN` - From Chromatic dashboard
   - `SLACK_BOT_TOKEN` - From Slack app (xoxb-...)
   - `SLACK_CHANNEL_ID` - Channel for notifications

See `.pm-workspace/research/storybook-live-preview-research.md` for detailed instructions.
