# PM Workspace - AI Agent Instructions

This is Tyler's PM workspace for AskElephant, a meeting intelligence platform for sales and CS teams. This document explains how the workspace context system works so AI agents can operate effectively.

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

| Rule | Purpose | Activation |
|------|---------|------------|
| `pm-foundation.mdc` | Core PM copilot behavior, command routing, company context loading | `alwaysApply: true` |
| `component-patterns.mdc` | Component organization in elephant-ai | Globs: `elephant-ai/web/src/components/**/*` |
| `cursor-admin.mdc` | Cursor workspace administration | Globs: `.cursor/**/*` |
| `growth-companion.mdc` | Personal growth, reflection, resilience | Agent-requestable |

**Key principle**: Only `pm-foundation.mdc` is always-on. All other rules load dynamically to keep context focused.

### Layer 2: Skills (`.cursor/skills/[name]/SKILL.md`)

Skills provide **procedural knowledge** - step-by-step "how-to" instructions that agents apply when relevant.

| Skill | Triggers | What It Provides |
|-------|----------|------------------|
| `research-analyst` | Analyzing transcripts, feedback | Extraction framework, strategic alignment checks |
| `prd-writer` | Creating PRDs | Outcome chains, user story templates |
| `prototype-builder` | Building UI components | State requirements, creative directions |
| `jury-system` | Running validation | Persona sampling, aggregation rules |
| `design-companion` | Design review | Trust/emotional design checklists |
| `placement-analysis` | Component placement | Codebase structure analysis |
| `signals-synthesis` | Pattern finding | Theme extraction across signals |
| `agents-generator` | Documentation | Product-focused AGENTS.md patterns |
| `initiative-status` | Checking initiative health, `/status` | Phase analysis, artifact completeness, next steps |
| `brainstorm` | Creative ideation, `/brainstorm-board` | Divergent thinking, idea clustering, evaluation |
| `roadmap-analysis` | Roadmap queries, `/roadmap` | Health assessment, priority analysis, recommendations |

**When to use skills vs rules**: 
- Rules = static context that shapes behavior
- Skills = dynamic procedures activated for specific tasks

### Layer 3: Subagents (`.cursor/agents/[name].md`)

Subagents run in **isolated context** for complex, multi-step workflows. They have their own prompts, tool access, and can use different models.

| Subagent | Purpose | Model | Readonly |
|----------|---------|-------|----------|
| `proto-builder` | Build Storybook prototypes with multiple options | inherit | false |
| `research-analyzer` | Analyze transcripts with strategic lens | fast | false |
| `validator` | Run jury evaluation and graduation checks | inherit | false |
| `iterator` | Iterate on prototypes with feedback synthesis | inherit | false |
| `signals-processor` | Process and synthesize signals | fast | false |
| `figma-sync` | Extract Figma designs to Storybook | inherit | false |
| `context-proto-builder` | Build prototypes with placement analysis | inherit | false |
| `docs-generator` | Generate AGENTS.md documentation | inherit | false |
| `hypothesis-manager` | Manage hypothesis lifecycle | fast | false |
| `workspace-admin` | Workspace maintenance and admin | fast | false |

**Built-in subagents (Cursor 2.4)**:
- `explore` - Fast codebase research (auto-invoked for "how does X work?" questions)
- `generalPurpose` - Multi-step task execution with full tool access

### Layer 4: Commands (`.cursor/commands/[name].md`)

Commands are **thin orchestrators** that route user intent to the appropriate handler.

```
User: "/proto dashboard"
  │
  ▼
Command: proto.md
  │ "Delegates to: proto-builder subagent"
  │
  ▼
Subagent: proto-builder.md (isolated context)
  │ Applies: prototype-builder skill
  │ Loads: PRD, design brief, design system
  │
  ▼
Output: Storybook components + Chromatic URL
```

---

## Company Context (Critical)

**Before ANY PM work**, these files must be loaded:

1. `pm-workspace-docs/company-context/product-vision.md` - Core identity, mission, anti-vision
2. `pm-workspace-docs/company-context/strategic-guardrails.md` - Red flags, alignment checks  
3. `pm-workspace-docs/company-context/tyler-context.md` - Tyler's values, working style

These enable the AI to:
- Push back on misaligned requests
- Cite leadership quotes when challenging proposals
- Ensure work ties to business outcomes
- Personalize to Tyler's growth goals

---

## Command Routing

### Auto-Execute (Low-Risk)

| Intent | Command | Handler |
|--------|---------|---------|
| "save", "commit", "push" | `/save` | Shell wrapper |
| "update", "pull", "sync" | `/update` | Shell wrapper |
| "status", "where are we" | `/status` | `initiative-status` skill |
| "help", "commands" | `/help` | Documentation |
| "roadmap", "priorities" | `/roadmap` | `roadmap-analysis` skill |
| "generate image", "visualize" | `/image` | Direct tool |

### Confirm First (Complex Workflows)

| Intent | Command | Delegates To |
|--------|---------|--------------|
| "transcript", "interview", "feedback" | `/research [name]` | `research-analyzer` subagent |
| "PRD", "requirements", "spec" | `/pm [name]` | `prd-writer` skill |
| "prototype", "mock up", "build UI" | `/proto [name]` | `proto-builder` subagent |
| "wireframe", "quick mock", "lofi" | `/lofi-proto [name]` | `proto-builder` subagent (lofi mode) |
| "validate", "test with users" | `/validate [name]` | `validator` subagent |
| "iterate", "refine" | `/iterate [name]` | `iterator` subagent |
| "design review", "UX check" | `/design [name]` | `design-companion` skill |
| "brainstorm", "explore ideas" | `/brainstorm-board [topic]` | `brainstorm` skill |
| "hypothesis", "assumption" | `/hypothesis [cmd] [name]` | `hypothesis-manager` subagent |
| "process signals", "ingest" | `/ingest [type]` | `signals-processor` subagent |
| "find patterns", "synthesize" | `/synthesize [topic]` | `signals-processor` subagent |
| "figma", "sync design" | `/figma-sync [name] [url]` | `figma-sync` subagent |
| "in context", "show how it fits" | `/context-proto [name]` | `context-proto-builder` subagent |
| "where should this go" | `/placement [name]` | `context-proto-builder` subagent |
| "AGENTS.md", "document code" | `/agents [path]` | `docs-generator` subagent |
| "maintain", "audit workspace" | `/maintain [cmd]` | `workspace-admin` subagent |
| "admin", "configure cursor" | `/admin` | `workspace-admin` subagent |

---

## Clarification Behavior (Cursor 2.4)

When requirements are ambiguous, use the **AskQuestion tool** to clarify before proceeding:

- Initiative name not provided → Ask which initiative
- Scope unclear → Ask "full prototype or quick wireframe?"
- Missing prerequisites → Ask if they want to create docs first
- Multiple interpretations → Present options and ask preference

**You can continue reading files while waiting for clarification.**

---

## Key Locations

| Content | Location |
|---------|----------|
| Company context | `pm-workspace-docs/company-context/` |
| Initiatives | `pm-workspace-docs/initiatives/[name]/` |
| Research | `pm-workspace-docs/research/` |
| Personas | `pm-workspace-docs/personas/` |
| Prototypes | `elephant-ai/web/src/components/prototypes/` |
| Signals | `pm-workspace-docs/signals/` |
| Design system | `.interface-design/system.md` |

---

## Initiative Lifecycle

```
discovery → define → build → validate → launch
```

Each phase has graduation criteria checked by `/validate`:

| Transition | Key Criteria |
|------------|--------------|
| discovery → define | Research exists, personas identified, 3+ evidence points |
| define → build | PRD approved, design brief exists, outcome chain defined |
| build → validate | All states implemented, flow stories complete |
| validate → launch | Jury pass rate ≥70%, stakeholder approval, no P0 blockers |

---

## Strategic Alignment

Before proceeding with new features, verify:

- [ ] Clear outcome chain: [Feature] → [behavior] → [business result]
- [ ] Evidence exists (user quotes, data, churn reasons)
- [ ] Specific persona identified (reps, leaders, CSMs, RevOps)
- [ ] Not in anti-vision territory (generic AI notes, commodity features)
- [ ] Trust/privacy implications considered

**Push back if any are missing.**

---

## Image Generation (Cursor 2.4)

Generate images directly for mockups, diagrams, and visualizations:

```
"Generate an image of a meeting insights dashboard"
"Create a data flow diagram showing CRM integration"
```

Images save to `assets/` by default. Use for:
- Early concept exploration before building components
- Stakeholder communication
- Architecture visualization

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
description: When to apply
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
Plain markdown documenting usage and delegation.
