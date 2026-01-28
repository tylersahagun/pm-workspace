# PM Workspace - AI Agent Instructions

This is Tyler's PM workspace for AskElephant, a meeting intelligence platform for sales and CS teams. This document is the **complete reference** for how the workspace context system works, including every command, subagent, skill, and rule.

---

## Table of Contents

1. [How Context Flows](#how-context-flows)
2. [The Four Layers](#the-four-layers)
3. [Complete Command Reference](#complete-command-reference)
4. [Complete Subagent Reference](#complete-subagent-reference)
5. [Complete Skill Reference](#complete-skill-reference)
6. [Complete Rule Reference](#complete-rule-reference)
7. [Command → Handler Mapping](#command--handler-mapping)
8. [File Paths Reference](#file-paths-reference)
9. [MCP Tools Reference](#mcp-tools-reference)
10. [Initiative Lifecycle](#initiative-lifecycle)
11. [Company Context](#company-context)
12. [Response Conventions](#response-conventions)

---

## How Context Flows

```
User Request
     │
     ▼
┌─────────────────────────────────────────────────────────────┐
│  ALWAYS-ON CONTEXT (loaded on every request)                │
│  ├── AGENTS.md (this file)                                  │
│  └── .cursor/rules/pm-foundation.mdc (alwaysApply: true)    │
└─────────────────────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────────────────────┐
│  DYNAMIC CONTEXT (loaded when relevant)                     │
│  ├── Rules with globs (auto-apply on file patterns)         │
│  ├── Skills (agent-decided based on task)                   │
│  └── Company context files (loaded before PM work)          │
└─────────────────────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────────────────────┐
│  EXECUTION (delegated to specialized handlers)              │
│  ├── Commands → thin wrappers that route to...              │
│  ├── Subagents → isolated context for complex workflows     │
│  └── Skills → procedural knowledge for specific tasks       │
└─────────────────────────────────────────────────────────────┘
```

---

## The Four Layers

### Layer 1: Rules (`.cursor/rules/`)

Rules provide **declarative context** that shapes AI behavior. They use `.mdc` format with YAML frontmatter.

| Rule                     | Path                                   | Purpose                                                               | Activation                                              |
| ------------------------ | -------------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------- |
| `pm-foundation.mdc`      | `.cursor/rules/pm-foundation.mdc`      | Core PM copilot behavior, command routing, MCP tools, company context | `alwaysApply: true`                                     |
| `component-patterns.mdc` | `.cursor/rules/component-patterns.mdc` | Component organization in elephant-ai                                 | Globs: `elephant-ai/web/src/components/**/*`            |
| `cursor-admin.mdc`       | `.cursor/rules/cursor-admin.mdc`       | Cursor workspace administration                                       | Globs: `.cursor/**/*`, `pm-workspace-docs/scripts/**/*` |
| `growth-companion.mdc`   | `.cursor/rules/growth-companion.mdc`   | Personal growth, reflection, resilience                               | Agent-requestable                                       |

### Layer 2: Skills (`.cursor/skills/[name]/SKILL.md`)

Skills provide **procedural knowledge** - step-by-step "how-to" instructions that agents apply when relevant.

| Skill                    | Path                                             | Purpose                                                             | Triggers                                          |
| ------------------------ | ------------------------------------------------ | ------------------------------------------------------------------- | ------------------------------------------------- |
| `activity-reporter`      | `.cursor/skills/activity-reporter/SKILL.md`      | Time-bounded activity reports (EOD/EOW)                             | `/eod`, `/eow`, `--digest` flag                   |
| `agents-generator`       | `.cursor/skills/agents-generator/SKILL.md`       | Product-focused AGENTS.md generation                                | `/agents` command                                 |
| `brainstorm`             | `.cursor/skills/brainstorm/SKILL.md`             | Structured creative ideation                                        | `/brainstorm-board`, explore ideas                |
| `design-companion`       | `.cursor/skills/design-companion/SKILL.md`       | Human-centric AI design review                                      | `/design`, `/design-handoff`                      |
| `digest-website`         | `.cursor/skills/digest-website/SKILL.md`         | Shareable website from digests                                      | `/publish-digest`                                 |
| `github-sync`            | `.cursor/skills/github-sync/SKILL.md`            | GitHub PR tracking, release notes                                   | `/sync-github`, `/sync-dev`                       |
| `initiative-status`      | `.cursor/skills/initiative-status/SKILL.md`      | Phase analysis, artifact completeness                               | `/status [name]`                                  |
| `jury-system`            | `.cursor/skills/jury-system/SKILL.md`            | Condorcet Jury persona simulation                                   | `/validate`                                       |
| `linear-sync`            | `.cursor/skills/linear-sync/SKILL.md`            | Linear project/cycle mapping                                        | `/sync-linear`, `/sync-dev`                       |
| `notion-sync`            | `.cursor/skills/notion-sync/SKILL.md`            | Notion Projects/Specs/Briefs sync                                   | `/sync-notion`, `/sync-dev`                       |
| `placement-analysis`     | `.cursor/skills/placement-analysis/SKILL.md`     | Codebase structure analysis                                         | `/placement`, `/context-proto`                    |
| `portfolio-status`       | `.cursor/skills/portfolio-status/SKILL.md`       | Full portfolio health analysis                                      | `/status-all`                                     |
| `prd-writer`             | `.cursor/skills/prd-writer/SKILL.md`             | PRD structure and outcome chains                                    | `/pm` command                                     |
| `prototype-builder`      | `.cursor/skills/prototype-builder/SKILL.md`      | Component patterns, states, flows                                   | `/proto`, `/lofi-proto`                           |
| `research-analyst`       | `.cursor/skills/research-analyst/SKILL.md`       | Research extraction with strategic lens                             | `/research`                                       |
| `roadmap-analysis`       | `.cursor/skills/roadmap-analysis/SKILL.md`       | Roadmap health and priorities                                       | `/roadmap`                                        |
| `signals-synthesis`      | `.cursor/skills/signals-synthesis/SKILL.md`      | Pattern recognition across signals                                  | `/synthesize`                                     |
| `slack-sync`             | `.cursor/skills/slack-sync/SKILL.md`             | Slack channel monitoring via MCP                                    | `/eod`, `/eow`                                    |
| `slack-block-kit`        | `.cursor/skills/slack-block-kit/SKILL.md`        | Format Slack messages with Block Kit (tables, rich text, templates) | Any Slack message sending                         |
| `prototype-notification` | `.cursor/skills/prototype-notification/SKILL.md` | Send Slack DM with prototype links after build                      | After proto-builder completes                     |
| `visual-digest`          | `.cursor/skills/visual-digest/SKILL.md`          | Branded visual digest generation                                    | `/visual-digest`, `/poster`                       |
| `feature-availability`   | `.cursor/skills/feature-availability/SKILL.md`   | PostHog feature flag cross-reference                                | `/ingest --customer-check`, `/availability-check` |
| `notion-admin`           | `.cursor/skills/notion-admin/SKILL.md`           | Notion workspace admin - Projects, Launches, PRDs, EOW              | `/notion-admin`                                   |

### Layer 3: Subagents (`.cursor/agents/[name].md`)

Subagents run in **isolated context** for complex, multi-step workflows. They have their own prompts and can use different models.

| Subagent                | Path                                      | Purpose                                                      | Model   | Commands                       |
| ----------------------- | ----------------------------------------- | ------------------------------------------------------------ | ------- | ------------------------------ |
| `context-proto-builder` | `.cursor/agents/context-proto-builder.md` | Build prototypes in production context                       | inherit | `/context-proto`, `/placement` |
| `docs-generator`        | `.cursor/agents/docs-generator.md`        | Generate AGENTS.md documentation                             | inherit | `/agents`                      |
| `figma-sync`            | `.cursor/agents/figma-sync.md`            | Extract Figma designs to Storybook                           | inherit | `/figma-sync`                  |
| `figjam-generator`      | `.cursor/agents/figjam-generator.md`      | Generate diagrams in FigJam using Mermaid.js                 | fast    | `/figjam`                      |
| `hubspot-activity`      | `.cursor/agents/hubspot-activity.md`      | Pull revenue activity from HubSpot for EOD/EOW               | fast    | (internal)                     |
| `hypothesis-manager`    | `.cursor/agents/hypothesis-manager.md`    | Manage hypothesis lifecycle                                  | fast    | `/hypothesis`                  |
| `iterator`              | `.cursor/agents/iterator.md`              | Iterate prototypes with feedback                             | inherit | `/iterate`                     |
| `posthog-analyst`       | `.cursor/agents/posthog-analyst.md`       | PostHog analytics lifecycle                                  | inherit | `/posthog`                     |
| `proto-builder`         | `.cursor/agents/proto-builder.md`         | Build Storybook prototypes                                   | inherit | `/proto`, `/lofi-proto`        |
| `research-analyzer`     | `.cursor/agents/research-analyzer.md`     | Analyze transcripts strategically                            | fast    | `/research`                    |
| `signals-processor`     | `.cursor/agents/signals-processor.md`     | Process and synthesize signals                               | fast    | `/ingest`, `/synthesize`       |
| `validator`             | `.cursor/agents/validator.md`             | Jury evaluation and graduation                               | inherit | `/validate`                    |
| `workspace-admin`       | `.cursor/agents/workspace-admin.md`       | Workspace maintenance                                        | fast    | `/admin`, `/maintain`          |
| `slack-monitor`         | `.cursor/agents/slack-monitor.md`         | Scan Slack for activity and response recommendations         | fast    | `/slack-monitor`               |
| `notion-admin`          | `.cursor/agents/notion-admin.md`          | Notion workspace admin - Projects, Launches, PRDs, EOW syncs | fast    | `/notion-admin`                |

**Built-in Subagents (Cursor 2.4):**

- `explore` - Fast codebase research (auto-invoked for "how does X work?" questions)
- `generalPurpose` - Multi-step task execution with full tool access

### Layer 4: Commands (`.cursor/commands/[name].md`)

Commands are **thin orchestrators** that route user intent to the appropriate handler.

---

## Complete Command Reference

### Auto-Execute Commands (Low-Risk)

| Command           | Path                                 | Handler                                       | Description                                                                               |
| ----------------- | ------------------------------------ | --------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `/save`           | `.cursor/commands/save.md`           | Shell wrapper                                 | Stage, commit, push all changes                                                           |
| `/update`         | `.cursor/commands/update.md`         | Shell wrapper                                 | Pull latest, sync submodules                                                              |
| `/status`         | `.cursor/commands/status.md`         | `initiative-status` skill                     | Show initiative status                                                                    |
| `/status-all`     | `.cursor/commands/status-all.md`     | `portfolio-status` skill                      | Full portfolio report with artifact matrix                                                |
| `/help`           | `.cursor/commands/help.md`           | Documentation                                 | Show command guidance                                                                     |
| `/roadmap`        | `.cursor/commands/roadmap.md`        | `roadmap-analysis` skill                      | View/update roadmap                                                                       |
| `/sync-linear`    | `.cursor/commands/sync-linear.md`    | `linear-sync` skill                           | Sync Linear projects/cycles                                                               |
| `/sync-github`    | `.cursor/commands/sync-github.md`    | `github-sync` skill                           | Sync GitHub PRs/merges                                                                    |
| `/sync-notion`    | `.cursor/commands/sync-notion.md`    | `notion-sync` skill                           | Sync Notion Projects/Specs/Briefs                                                         |
| `/sync-dev`       | `.cursor/commands/sync-dev.md`       | `notion-sync` + `linear-sync` + `github-sync` | Unified dev pipeline sync                                                                 |
| `/full-sync`      | `.cursor/commands/full-sync.md`      | `notion-admin` subagent                       | Interactive sync (--subpages creates subpages, --create-projects creates Notion projects) |
| `/sync`           | `.cursor/commands/sync.md`           | Shell wrapper                                 | Process inbox files                                                                       |
| `/eod`            | `.cursor/commands/eod.md`            | `activity-reporter` + `slack-sync` skills     | End-of-day activity report                                                                |
| `/eow`            | `.cursor/commands/eow.md`            | `activity-reporter` + `slack-sync` skills     | End-of-week report with trends                                                            |
| `/visual-digest`  | `.cursor/commands/visual-digest.md`  | `visual-digest` skill                         | Generate branded visual for sharing                                                       |
| `/publish-digest` | `.cursor/commands/publish-digest.md` | `digest-website` skill                        | Publish digest to shareable website                                                       |
| `/design-system`  | `.cursor/commands/design-system.md`  | Read-only                                     | View design system tokens                                                                 |
| `/image`          | `.cursor/commands/image.md`          | Direct tool                                   | Generate images for mockups                                                               |

### Confirm-First Commands (Complex Workflows)

| Command                     | Path                                     | Handler                                           | Description                                                         |
| --------------------------- | ---------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------- |
| `/research [name]`          | `.cursor/commands/research.md`           | `research-analyzer` subagent                      | Analyze transcripts with strategic lens                             |
| `/pm [name]`                | `.cursor/commands/pm.md`                 | `prd-writer` skill                                | Create PRD + documentation                                          |
| `/proto [name]`             | `.cursor/commands/proto.md`              | `proto-builder` subagent                          | Build Storybook prototype                                           |
| `/lofi-proto [name]`        | `.cursor/commands/lofi-proto.md`         | `proto-builder` subagent (lofi mode)              | Quick wireframe prototype                                           |
| `/context-proto [name]`     | `.cursor/commands/context-proto.md`      | `context-proto-builder` subagent                  | Prototype in production context                                     |
| `/placement [name]`         | `.cursor/commands/placement.md`          | `context-proto-builder` subagent (placement mode) | Research component placement                                        |
| `/validate [name]`          | `.cursor/commands/validate.md`           | `validator` subagent                              | Run jury evaluation                                                 |
| `/iterate [name]`           | `.cursor/commands/iterate.md`            | `iterator` subagent                               | Iterate prototype with feedback                                     |
| `/design [name]`            | `.cursor/commands/design.md`             | `design-companion` skill                          | Review design considerations                                        |
| `/design-handoff [name]`    | `.cursor/commands/design-handoff.md`     | `design-companion` skill                          | Hand off prototype to designer                                      |
| `/new-initiative [name]`    | `.cursor/commands/new-initiative.md`     | Shell wrapper                                     | Create initiative folder structure                                  |
| `/share`                    | `.cursor/commands/share.md`              | Shell wrapper                                     | Create Pull Request                                                 |
| `/setup`                    | `.cursor/commands/setup.md`              | Shell wrapper                                     | One-time workspace setup                                            |
| `/figma-sync [name] [url]`  | `.cursor/commands/figma-sync.md`         | `figma-sync` subagent                             | Sync Figma designs to Storybook                                     |
| `/figjam [description]`     | `.cursor/commands/figjam.md`             | `figjam-generator` subagent                       | Generate diagrams in FigJam                                         |
| `/agents [path]`            | `.cursor/commands/agents.md`             | `docs-generator` subagent                         | Generate AGENTS.md documentation                                    |
| `/hypothesis [cmd] [name]`  | `.cursor/commands/hypothesis.md`         | `hypothesis-manager` subagent                     | Manage hypothesis lifecycle                                         |
| `/ingest [type]`            | `.cursor/commands/ingest.md`             | `signals-processor` subagent                      | Process new signals (paste content)                                 |
| `/ingest slack [channel]`   | `.cursor/commands/ingest.md`             | `signals-processor` subagent                      | Pull signals from Slack channel                                     |
| `/ingest linear [project]`  | `.cursor/commands/ingest.md`             | `signals-processor` subagent                      | Pull signals from Linear issues                                     |
| `/ingest hubspot [id]`      | `.cursor/commands/ingest.md`             | `signals-processor` subagent                      | Pull signals from HubSpot                                           |
| `/ingest all`               | `.cursor/commands/ingest.md`             | `signals-processor` subagent                      | Pull from all sources                                               |
| `/synthesize [topic]`       | `.cursor/commands/synthesize.md`         | `signals-processor` subagent                      | Find patterns across signals                                        |
| `/brainstorm-board [topic]` | `.cursor/commands/brainstorm-board.md`   | `brainstorm` skill                                | Creative ideation session                                           |
| `/collab [topic]`           | `.cursor/commands/collab.md`             | Tyler context reference                           | Suggest collaborators                                               |
| `/posthog [mode]`           | `.cursor/commands/posthog.md`            | `posthog-analyst` subagent                        | Analytics lifecycle management                                      |
| `/maintain [cmd]`           | `.cursor/commands/maintain.md`           | `workspace-admin` subagent                        | Workspace maintenance                                               |
| `/admin`                    | `.cursor/commands/admin.md`              | `workspace-admin` subagent                        | Cursor configuration                                                |
| `/slack-monitor`            | `.cursor/commands/slack-monitor.md`      | `slack-monitor` subagent                          | Scan Slack for activity and response recommendations                |
| `/availability-check`       | `.cursor/commands/availability-check.md` | `feature-availability` skill                      | Check feature flags for customer visibility                         |
| `/notion-admin [mode]`      | `.cursor/commands/notion-admin.md`       | `notion-admin` subagent                           | Notion workspace admin (audit, projects, launches, prd, eow, flags) |

### Growth & Thinking Commands (Tyler-Specific)

| Command    | Description           | Behavior                                       |
| ---------- | --------------------- | ---------------------------------------------- |
| `/think`   | Guided brainstorming  | Ask probing questions, don't solve immediately |
| `/teach`   | Teach-back challenge  | "How would you explain this to Brian/Woody?"   |
| `/collab`  | Collaboration routing | Suggest teammates based on work type           |
| `/reflect` | Growth reflection     | Values alignment, growth opportunities         |
| `/unstick` | Resilience support    | Problem reframing, next smallest step          |

---

## Complete Subagent Reference

### context-proto-builder

**Path:** `.cursor/agents/context-proto-builder.md`
**Model:** inherit | **Commands:** `/context-proto`, `/placement`

**What it does:**

1. Loads PRD and design brief from initiative folder
2. Analyzes codebase to determine where feature belongs
3. Recommends integration type (page, panel, modal, embedded)
4. Builds prototype showing component in production context
5. Creates context stories with real navigation and layouts
6. Documents placement decision

**Files read:** `product-vision.md`, `prd.md`, `design-brief.md`, `elephant-ai/web/src/components/`
**Files written:** `placement-research.md`, prototype components in `prototypes/[Initiative]/v1/contexts/`

---

### docs-generator

**Path:** `.cursor/agents/docs-generator.md`
**Model:** inherit | **Commands:** `/agents`

**What it does:**

1. Analyzes target directory structure
2. Cross-references with related initiatives and research
3. Generates AGENTS.md with product focus first, technical context second

**Files read:** Target component files, `initiatives/[name]/`, `research/`
**Files written:** `pm-workspace-docs/agents-docs/[path]/AGENTS.md`

---

### figma-sync

**Path:** `.cursor/agents/figma-sync.md`
**Model:** inherit | **Commands:** `/figma-sync`

**What it does:**

1. Extracts component spec from Figma using MCP tools
2. Maps variants to TypeScript prop enums
3. Generates Storybook stories for all variants
4. Scaffolds component code with proper types
5. Saves spec for re-sync capability

**Files read:** Figma via MCP, design system
**Files written:** `prototypes/[ProjectName]/`, `initiatives/[name]/figma-spec.json`

---

### figjam-generator

**Path:** `.cursor/agents/figjam-generator.md`
**Model:** fast | **Commands:** `/figjam`

**What it does:**

1. Identifies diagram type from user description (flowchart, sequence, state, gantt)
2. Generates valid Mermaid.js syntax
3. Calls Figma MCP `generate_diagram` tool
4. Returns FigJam URL for viewing and editing

**Supported diagrams:**

- Flowcharts (process flows, user journeys)
- Sequence diagrams (API calls, service interactions)
- State diagrams (object lifecycle, status transitions)
- Gantt charts (project timelines, scheduling)
- Decision trees (conditional logic, qualification flows)

**MCP tools used:**

- `generate_diagram` (user-Figma) - Creates FigJam diagram from Mermaid.js

**Output:** FigJam URL (clickable link to view/edit diagram)

---

### hubspot-activity

**Path:** `.cursor/agents/hubspot-activity.md`
**Model:** fast | **Commands:** (internal - called by `/eod`, `/eow`)

**What it does:**

1. Retrieves HubSpot owner list for ID → name mapping
2. Searches for deals closed (closedwon) in time range
3. Searches for deals lost (closedlost) for churn intel
4. Searches for meetings booked (SDR sets)
5. Calculates metrics: Total ARR, deal count, win rate
6. Returns structured data for activity-reporter

**MCP tools used:**

- `HUBSPOT_SEARCH_CRM_OBJECTS_BY_CRITERIA` - Filter deals/meetings by date
- `HUBSPOT_RETRIEVE_OWNERS` - Map owner IDs to rep names

**Output:** JSON + Markdown for EOD/EOW reports

**Integration:** Called automatically by `activity-reporter` skill during `/eod` and `/eow` commands. Provides authoritative HubSpot data that supplements Slack-based revenue wins.

---

### hypothesis-manager

**Path:** `.cursor/agents/hypothesis-manager.md`
**Model:** fast | **Commands:** `/hypothesis`

**What it does:**

- `new`: Creates hypothesis in `hypotheses/active/`
- `validate`: Checks 3+ evidence sources, moves to `validated/`
- `commit`: Creates initiative, moves to `committed/`
- `retire`: Archives with reason
- `list`/`show`: Display hypotheses

**Files read/written:** `hypotheses/_index.json`, `hypotheses/[status]/[name].md`

---

### iterator

**Path:** `.cursor/agents/iterator.md`
**Model:** inherit | **Commands:** `/iterate`

**What it does:**

1. Loads current prototype state and docs
2. Auto-pulls signals linked to initiative from `signals/_index.json`
3. Synthesizes all feedback
4. Updates PRD, Design Brief, and Prototype Notes
5. Creates new version folder (v1 → v2)
6. Rebuilds full prototype with changes
7. Deploys to Chromatic

**Files read:** `_meta.json`, `prd.md`, `design-brief.md`, `prototype-notes.md`, `signals/_index.json`
**Files written:** New version in `prototypes/[Initiative]/v[N+1]/`, updated docs

---

### posthog-analyst

**Path:** `.cursor/agents/posthog-analyst.md`
**Model:** inherit | **Commands:** `/posthog`

**13 Modes:**

1. `audit` - Analyze PostHog setup, identify gaps
2. `dashboard [initiative]` - Create/update dashboard
3. `metrics [initiative]` - Define success metrics
4. `cohorts` - Create/manage user cohorts
5. `alerts` - Set up proactive alerting
6. `instrument [feature]` - Generate event tracking recommendations
7. `question [query]` - Answer business questions (question-first)
8. `instrument-check [feature]` - Cross-reference PostHog with codebase
9. `north-star` - Track North Star metric
10. `health [workspace]` - Customer health scores
11. `aha-moment [persona]` - Identify/validate activation moment
12. `churn-risk` - Identify at-risk workspaces
13. `expansion` - Find upsell opportunities

**MCP tools used:** PostHog dashboards, insights, feature flags, experiments, surveys, events

---

### proto-builder

**Path:** `.cursor/agents/proto-builder.md`
**Model:** inherit | **Commands:** `/proto`, `/lofi-proto`

**What it does:**

1. Loads PRD and Design Brief from initiative folder
2. Loads design system from `.interface-design/system.md`
3. Creates 2-3 creative options (Max Control, Balanced, Efficient)
4. Implements all required AI states (Loading, Success, Error, LowConfidence, Empty)
5. Creates interactive Flow\_\* stories for user journeys
6. Builds and deploys to Chromatic
7. Documents in prototype-notes.md

**Files read:** `prd.md`, `design-brief.md`, `system.md`
**Files written:** `prototypes/[Initiative]/v1/`, `prototype-notes.md`

---

### research-analyzer

**Path:** `.cursor/agents/research-analyzer.md`
**Model:** fast | **Commands:** `/research`

**What it does:**

1. Loads company context (product-vision, strategic-guardrails, personas)
2. Extracts key insights with verbatim quotes
3. Assesses strategic alignment
4. Flags red flags and concerns
5. Saves research to initiative folder

**MCP tools available:** Slack (pull related discussions), HubSpot (customer context), Linear (related issues)
**Files written:** `initiatives/[name]/research.md`

---

### signals-processor

**Path:** `.cursor/agents/signals-processor.md`
**Model:** fast | **Commands:** `/ingest`, `/synthesize`

**Three Modes:**

**Source-Based Ingest (NEW):**

- `/ingest slack [channel]` - Pull from Slack via MCP, filter for product signals
- `/ingest linear [project]` - Pull customer-reported issues from Linear
- `/ingest hubspot [id]` - Pull deal notes, churn reasons from HubSpot
- `/ingest all` - Pull from all sources (last 24h default)

**Manual Ingest Mode:**

1. Loads product-vision, personas, signals index
2. Extracts TL;DR, decisions, action items, problems, quotes
3. Saves to `signals/[type]/`
4. Updates `signals/_index.json`
5. Matches to existing hypotheses

**Synthesize Mode:**

1. Loads signals from `signals/`
2. Detects themes via keyword clustering, persona correlation, temporal patterns
3. Assesses signal strength
4. Generates synthesis report

**MCP tools available:** Slack, HubSpot, Linear, PostHog
**Files written:** `signals/[type]/YYYY-MM-DD-[topic].md`, `research/synthesis/`

---

### validator

**Path:** `.cursor/agents/validator.md`
**Model:** inherit | **Commands:** `/validate`

**What it does:**

1. Loads initiative metadata and documents
2. Checks graduation criteria for current phase
3. Runs synthetic jury evaluation using Condorcet Jury System
4. Generates validation report
5. Recommends: advance, iterate, or block

**Jury Configuration:**

- Sample: 100-500 synthetic personas
- Stratification: Rep 40%, Leader 25%, CSM 20%, RevOps 15%
- Skeptic minimum: 15%

**Files read:** `_meta.json`, `prd.md`, `prototype-notes.md`, `personas/archetypes/`
**Files written:** `initiatives/[name]/jury-evaluations/`

---

### workspace-admin

**Path:** `.cursor/agents/workspace-admin.md`
**Model:** fast | **Commands:** `/admin`, `/maintain`

**Maintain Operations:**

- `audit` - Full workspace audit (structure, consistency, health, cleanup)
- `fix` - Auto-fix safe issues
- `sync` - Regenerate derived files (roadmap, indexes)
- `clean` - Remove orphaned files

**Admin Operations:**

- Rule management (create, update, archive)
- Command management
- Skill management
- Subagent management

**Files modified:** `.cursor/rules/`, `.cursor/commands/`, `.cursor/skills/`, `.cursor/agents/`

---

### slack-monitor

**Path:** `.cursor/agents/slack-monitor.md`
**Model:** fast | **Commands:** `/slack-monitor`

**What it does:**

1. Checks last-check timestamp from state file
2. Scans Slack channels for activity since last check
3. Identifies messages requiring response (mentions, leadership, product discussions)
4. Classifies by priority (Action Required, Review, FYI, Signal)
5. **Includes Slack permalinks** for every message (clickable links)
6. Updates state file with current timestamp
7. Optionally saves notable signals to `signals/slack/`

**Priority Classification:**

- 🔴 **Action Required** - Direct mentions, DMs from leadership
- 🟡 **Review** - Messages from collaborators, product discussions
- 🟢 **FYI** - Updates, wins, announcements
- 📊 **Signal** - Customer feedback, churn signals, feature requests

**Key Features:**

- State-based "unread" tracking (Slack API doesn't expose true unread)
- Permalink URLs in all output for click-through
- Signal capture option: `/slack-monitor save signals`

**Files written:** `status/slack-digest-YYYY-MM-DD.md`, `status/.slack-monitor-state.json`

---

## Complete Skill Reference

| Skill                    | Triggers                                          | What It Does                                                                            | Output Location                          |
| ------------------------ | ------------------------------------------------- | --------------------------------------------------------------------------------------- | ---------------------------------------- |
| `activity-reporter`      | `/eod`, `/eow`                                    | Aggregates GitHub, Linear, Slack activity; generates stakeholder narratives             | `status/activity/eod-*.md`               |
| `agents-generator`       | `/agents`                                         | Creates AGENTS.md with product context first                                            | `agents-docs/[path]/AGENTS.md`           |
| `brainstorm`             | `/brainstorm-board`                               | Facilitates divergent thinking, clusters ideas                                          | `research/brainstorms/`                  |
| `design-companion`       | `/design`, `/design-handoff`                      | Reviews trust, emotion, accessibility                                                   | Design review report                     |
| `digest-website`         | `/publish-digest`                                 | Transforms markdown to shareable website                                                | `docs/issues/`                           |
| `github-sync`            | `/sync-github`, `/sync-dev`                       | Maps PRs to initiatives via ASK-XXXX                                                    | `signals/releases/`, `_meta.json`        |
| `initiative-status`      | `/status [name]`                                  | Analyzes phase, artifacts, graduation readiness                                         | Status display                           |
| `jury-system`            | `/validate`                                       | Stratified persona sampling, aggregation rules                                          | Jury evaluation report                   |
| `linear-sync`            | `/sync-linear`, `/sync-dev`                       | Maps Linear projects to initiatives                                                     | `status/dev-status-*.md`                 |
| `notion-sync`            | `/sync-notion`, `/sync-dev`                       | Syncs Notion Projects, Specs, Briefs, Launches                                          | `status/notion-sync-*.md`                |
| `placement-analysis`     | `/placement`, `/context-proto`                    | Analyzes codebase for component placement                                               | `placement-research.md`                  |
| `portfolio-status`       | `/status-all`                                     | Artifact gap matrix, health scoring, action queue                                       | `status/status-all-*.md`                 |
| `prd-writer`             | `/pm`                                             | Strategic alignment check, outcome chains                                               | `initiatives/[name]/prd.md`              |
| `prototype-builder`      | `/proto`, `/lofi-proto`                           | Creative directions, states, Flow\_\* stories                                           | `prototypes/[Initiative]/`               |
| `research-analyst`       | `/research`                                       | Extracts insights with strategic alignment                                              | `initiatives/[name]/research.md`         |
| `roadmap-analysis`       | `/roadmap`                                        | Health assessment, phase distribution                                                   | Roadmap display                          |
| `signals-synthesis`      | `/synthesize`                                     | Pattern detection, hypothesis candidates                                                | `research/synthesis/`                    |
| `slack-sync`             | `/eod`, `/eow`                                    | Pulls revenue wins, engineering updates                                                 | Revenue wins section                     |
| `slack-block-kit`        | Any Slack message sending                         | Block Kit formatting with tables, rich text, templates (Rob Report, Newsletter, Digest) | Formatted blocks in message payload      |
| `prototype-notification` | After proto-builder completes                     | Send Slack DM with Chromatic, local Storybook, and docs links                           | Slack DM to Tyler                        |
| `visual-digest`          | `/visual-digest`                                  | Branded poster/email from markdown                                                      | `status/activity/visuals/`               |
| `feature-availability`   | `/ingest --customer-check`, `/availability-check` | Cross-reference features against PostHog flags, generate customer-safe content          | Appended to signal, `*-customer-safe.md` |

---

## Complete Rule Reference

| Rule                     | Activation                                              | What It Provides                                                           |
| ------------------------ | ------------------------------------------------------- | -------------------------------------------------------------------------- |
| `pm-foundation.mdc`      | `alwaysApply: true`                                     | Command routing, MCP tools reference, intent detection, push-back behavior |
| `component-patterns.mdc` | Globs: `elephant-ai/web/src/components/**/*`            | Component organization patterns, placement decision tree                   |
| `cursor-admin.mdc`       | Globs: `.cursor/**/*`, `pm-workspace-docs/scripts/**/*` | Admin mode for workspace configuration                                     |
| `growth-companion.mdc`   | Agent-requestable                                       | Personal growth support: `/think`, `/teach`, `/reflect`, `/unstick`        |

---

## Command → Handler Mapping

### Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              COMMAND ROUTING                                         │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                      │
│  /research ─────────────────→ research-analyzer subagent                            │
│                                    └── Uses: research-analyst skill                  │
│                                    └── MCP: Slack, HubSpot, Linear                  │
│                                                                                      │
│  /pm ───────────────────────→ prd-writer skill (direct)                             │
│                                    └── Loads: product-vision, personas              │
│                                                                                      │
│  /proto, /lofi-proto ───────→ proto-builder subagent                                │
│                                    └── Uses: prototype-builder skill                 │
│                                    └── Writes: prototypes/[Initiative]/v1/          │
│                                                                                      │
│  /context-proto ────────────→ context-proto-builder subagent                        │
│                                    └── Uses: placement-analysis skill                │
│                                    └── Writes: placement-research.md + contexts/    │
│                                                                                      │
│  /placement ────────────────→ context-proto-builder subagent (placement-only)       │
│                                    └── Uses: placement-analysis skill                │
│                                                                                      │
│  /validate ─────────────────→ validator subagent                                    │
│                                    └── Uses: jury-system skill                       │
│                                    └── Writes: jury-evaluations/                     │
│                                                                                      │
│  /iterate ──────────────────→ iterator subagent                                     │
│                                    └── Auto-pulls: signals/_index.json              │
│                                    └── Writes: v[N+1]/ prototype                    │
│                                                                                      │
│  /ingest ───────────────────→ signals-processor subagent                            │
│  /ingest slack [channel] ──→     └── MCP: Slack, HubSpot, Linear, PostHog           │
│  /ingest linear ───────────→     └── Writes: signals/[type]/ (slack/, hubspot/, etc)│
│  /ingest hubspot [id] ─────→                                                        │
│  /ingest all ──────────────→                                                        │
│                                                                                      │
│  /synthesize ───────────────→ signals-processor subagent                            │
│                                    └── Uses: signals-synthesis skill                 │
│                                    └── Writes: research/synthesis/                   │
│                                                                                      │
│  /hypothesis ───────────────→ hypothesis-manager subagent                           │
│                                    └── Manages: hypotheses/[status]/                │
│                                                                                      │
│  /posthog ──────────────────→ posthog-analyst subagent                              │
│                                    └── MCP: PostHog (300+ tools)                    │
│                                    └── 13 modes: audit, dashboard, metrics...       │
│                                                                                      │
│  /figma-sync ───────────────→ figma-sync subagent                                   │
│                                    └── MCP: Figma                                    │
│                                    └── Writes: prototypes/ + figma-spec.json        │
│                                                                                      │
│  /figjam ──────────────────→ figjam-generator subagent                              │
│                                    └── MCP: Figma (generate_diagram)                 │
│                                    └── Returns: FigJam URL                           │
│                                                                                      │
│  /agents ───────────────────→ docs-generator subagent                               │
│                                    └── Uses: agents-generator skill                  │
│                                    └── Writes: agents-docs/[path]/AGENTS.md         │
│                                                                                      │
│  /admin, /maintain ─────────→ workspace-admin subagent                              │
│                                    └── Modifies: .cursor/ configuration             │
│                                                                                      │
│  /slack-monitor ───────────→ slack-monitor subagent                                 │
│                                    └── MCP: Slack (search, history, channels)       │
│                                    └── Writes: status/slack-digest-*.md             │
│                                                                                      │
│  /status ───────────────────→ initiative-status skill (direct)                      │
│  /status-all ───────────────→ portfolio-status skill (direct)                       │
│  /roadmap ──────────────────→ roadmap-analysis skill (direct)                       │
│  /design ───────────────────→ design-companion skill (direct)                       │
│  /brainstorm-board ─────────→ brainstorm skill (direct)                             │
│                                                                                      │
│  /sync-dev ─────────────────→ notion-sync + linear-sync + github-sync skills        │
│  /sync-notion ──────────────→ notion-sync skill                                     │
│  /sync-linear ──────────────→ linear-sync skill                                     │
│  /sync-github ──────────────→ github-sync skill                                     │
│                                                                                      │
│  /eod, /eow ────────────────→ activity-reporter skill                               │
│                                    └── Uses: slack-sync skill (for revenue wins)    │
│                                    └── Uses: github-sync, linear-sync              │
│                                                                                      │
│  /visual-digest ────────────→ visual-digest skill                                   │
│  /publish-digest ───────────→ digest-website skill                                  │
│                                                                                      │
│  /save, /update, /share ────→ Shell wrappers (git commands)                         │
│  /setup ────────────────────→ Shell wrapper (onboarding)                            │
│  /new-initiative ───────────→ Shell wrapper (folder creation)                       │
│  /sync ─────────────────────→ Shell wrapper (inbox processing)                      │
│                                                                                      │
│  /think, /teach, /reflect ──→ growth-companion rule (Tyler-specific)                │
│  /unstick, /collab ─────────→ growth-companion rule (Tyler-specific)                │
│                                                                                      │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## File Paths Reference

### Key Locations

| Content               | Location                                                                    |
| --------------------- | --------------------------------------------------------------------------- |
| **Always-on context** | `AGENTS.md`, `.cursor/rules/pm-foundation.mdc`                              |
| **Company context**   | `pm-workspace-docs/company-context/`                                        |
| **Org Chart**         | `pm-workspace-docs/company-context/org-chart.md`                            |
| **Initiatives**       | `pm-workspace-docs/initiatives/[name]/`                                     |
| **Research**          | `pm-workspace-docs/research/`                                               |
| **Personas**          | `pm-workspace-docs/personas/`                                               |
| **Prototypes**        | `elephant-ai/web/src/components/prototypes/`                                |
| **Signals**           | `pm-workspace-docs/signals/` (transcripts, tickets, issues, slack, hubspot) |
| **Hypotheses**        | `pm-workspace-docs/hypotheses/`                                             |
| **Status Reports**    | `pm-workspace-docs/status/`                                                 |
| **Activity Reports**  | `pm-workspace-docs/status/activity/`                                        |
| **Roadmap**           | `pm-workspace-docs/roadmap/`                                                |
| **Sync Queue**        | `pm-workspace-docs/sync-queue.md`                                           |
| **Design system**     | `.interface-design/system.md`                                               |
| **Slack Routing**     | `pm-workspace-docs/audits/slack-communication-routing-guide.md`             |
| **Channel Audits**    | `pm-workspace-docs/audits/channels/`                                        |

### Initiative Folder Structure

```
pm-workspace-docs/initiatives/[name]/
├── _meta.json              # Phase, status, priority, linear_project_id
├── research.md             # User research with quotes
├── prd.md                  # Product requirements
├── design-brief.md         # Design specifications
├── engineering-spec.md     # Technical spec
├── prototype-notes.md      # Prototype documentation
├── gtm-brief.md            # Go-to-market plan
├── placement-research.md   # Component placement analysis
├── METRICS.md              # PostHog success metrics
├── figma-spec.json         # Figma sync spec
└── jury-evaluations/       # Validation results
```

---

## MCP Tools Reference

**Server:** `pm-mcp-config` (Composio) - Unified access to 700+ tools

### Toolkit Summary

| Toolkit     | Tools | Key Operations                                                                                                    |
| ----------- | ----- | ----------------------------------------------------------------------------------------------------------------- |
| **Slack**   | 110+  | `SLACK_FETCH_CONVERSATION_HISTORY`, `SLACK_SEARCH_MESSAGES`, `SLACK_SEND_MESSAGE`, `SLACK_FIND_USERS`             |
| **Linear**  | 35+   | `LINEAR_CREATE_LINEAR_ISSUE`, `LINEAR_SEARCH_ISSUES`, `LINEAR_LIST_LINEAR_PROJECTS`, `LINEAR_LIST_LINEAR_CYCLES`  |
| **Notion**  | 55+   | `NOTION_CREATE_NOTION_PAGE`, `NOTION_QUERY_DATABASE`, `NOTION_SEARCH_NOTION_PAGE`, `NOTION_UPDATE_PAGE`           |
| **HubSpot** | 200+  | `HUBSPOT_GET_CONTACT_IDS`, `HUBSPOT_GET_DEALS`, `HUBSPOT_CREATE_TICKET`, `HUBSPOT_GET_COMPANY`                    |
| **PostHog** | 300+  | `POSTHOG_RETRIEVE_PROJECT_INSIGHTS`, `POSTHOG_CREATE_PROJECT_COHORTS`, `POSTHOG_RETRIEVE_PROJECT_INSIGHT_DETAILS` |

**Tool Naming Convention:** `{TOOLKIT}_{ACTION}_{ENTITY}` (e.g., `SLACK_FETCH_CONVERSATION_HISTORY`)

**Usage:** `CallMcpTool: pm-mcp-config / TOOL_NAME`

### Key Slack Channels

| Function         | Channels                                                 |
| ---------------- | -------------------------------------------------------- |
| Revenue Wins     | #sales-closed-won, #team-sales, #expansion-opportunities |
| Customer Signals | #customer-feedback, #customer-quotes, #churn-alert       |
| Engineering      | #product-updates, #team-dev, #product-issues             |
| Product          | #product-forum, #product-requests                        |

---

## Initiative Lifecycle

```
discovery → define → build → validate → launch
```

### Phase Transitions

| Transition             | Key Graduation Criteria                                   |
| ---------------------- | --------------------------------------------------------- |
| **discovery → define** | Research exists, personas identified, 3+ evidence points  |
| **define → build**     | PRD approved, design brief exists, outcome chain defined  |
| **build → validate**   | All states implemented, flow stories complete             |
| **validate → launch**  | Jury pass rate ≥70%, stakeholder approval, no P0 blockers |

### Artifact Requirements by Phase

| Phase     | Required Artifacts                        |
| --------- | ----------------------------------------- |
| Discovery | research.md                               |
| Define    | research.md, prd.md, design-brief.md      |
| Build     | + engineering-spec.md, prototype-notes.md |
| Validate  | + jury-evaluations/                       |
| Launch    | + gtm-brief.md                            |

---

## Company Context

**CRITICAL**: Before ANY PM work, load these files:

1. `pm-workspace-docs/company-context/product-vision.md` - Core identity, mission, anti-vision
2. `pm-workspace-docs/company-context/strategic-guardrails.md` - Red flags, alignment checks
3. `pm-workspace-docs/company-context/tyler-context.md` - Tyler's values, working style
4. `pm-workspace-docs/company-context/org-chart.md` - Team structure, Slack IDs, reporting lines

### Strategic Alignment Check

Before new features/initiatives, verify:

- [ ] Clear outcome chain: [Feature] → [behavior] → [business result]
- [ ] Evidence exists (user quotes, data, churn reasons)
- [ ] Specific persona identified (reps, leaders, CSMs, RevOps)
- [ ] Not in anti-vision territory (generic AI notes, commodity features)
- [ ] Trust/privacy implications considered

**Push back if any are missing.**

---

## Response Conventions

1. **Summary** of what was done
2. **File locations** for created/updated docs
3. **Next step** suggestion

Always save work to local files first (never lose user's work), then commit and push.

---

## File Format Reference

### Rules (`.mdc`)

```yaml
---
description: "For agent decision-making"
globs: ["*.ts", "src/**/*.tsx"]
alwaysApply: false
---
```

### Skills (`SKILL.md`)

```yaml
---
name: skill-name
description: When to apply this skill
---
```

### Subagents (`[name].md`)

```yaml
---
name: subagent-name
description: When to invoke
model: fast | inherit
readonly: true | false
---
```

### Commands (`[name].md`)

Plain markdown documenting usage, behavior, and delegation target.
