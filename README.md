# PM Workspace

A collaborative workspace for AskElephant product management and prototyping.

## Quick Start (5 minutes)

### 1. Install Cursor

Download [Cursor](https://cursor.sh) if you don't have it.

### 2. Clone this repository

```bash
git clone git@github.com:tylersahagun/pm-workspace.git
cd pm-workspace
```

### 3. Open in Cursor

```bash
cursor .
```

### 4. Run Setup

Press `Cmd+K` (Mac) or `Ctrl+K` (Windows), type `/setup`, and press Enter.

The setup command will:

- Check your system has the right tools
- Download the AskElephant codebase
- Install all dependencies
- Create your personal work branch
- Verify everything works

That's it! You're ready to go.

---

## Natural Language Support

You don't need to memorize slash commands. Just describe what you want to do:

| Say this...                                | AI will...                   |
| ------------------------------------------ | ---------------------------- |
| "I have a transcript from a customer call" | Suggest `/research` workflow |
| "Build a prototype for the settings page"  | Suggest `/proto` workflow    |
| "Save my work"                             | Auto-run `/save`             |
| "What's the roadmap?"                      | Auto-run `/roadmap`          |
| "Help me understand the commands"          | Auto-run `/help`             |

The AI recognizes your intent and either executes simple commands automatically or confirms complex workflows before proceeding.

---

## Daily Workflow

### Creating Prototypes

```
/proto [initiative-name]
```

This builds interactive prototypes in Storybook using real AskElephant components.

### Viewing Your Work

```bash
cd elephant-ai && npm run storybook -w web
```

Then open http://localhost:6006 and find your prototypes under "Prototypes" in the sidebar.

### Saving Your Work

```
/save
```

Saves and backs up all your changes to GitHub. Run this often!

### Getting Latest Updates

```
/update
```

Pulls the latest changes from the team and updates the codebase.

### Sharing for Review

```
/share
```

Creates a Pull Request so others can review your work.

---

## Complete Commands Reference

### Getting Started

| Command   | What it does                           |
| --------- | -------------------------------------- |
| `/setup`  | One-time setup for new users           |
| `/help`   | Get guidance on available commands     |
| `/status` | See workspace overview and active work |

### Core PM Workflows

| Command                  | What it does                                                         |
| ------------------------ | -------------------------------------------------------------------- |
| `/research [name]`       | Analyze user research/transcripts with strategic lens                |
| `/PM [name]`             | Create full project documentation (PRD, design brief, eng spec, GTM) |
| `/proto [name]`          | Build Storybook prototype                                            |
| `/new-initiative [name]` | Create initiative folder structure                                   |

### Git & Sharing

| Command   | What it does            |
| --------- | ----------------------- |
| `/save`   | Save and push your work |
| `/update` | Get latest team changes |
| `/share`  | Create a PR for review  |

### Validation & Iteration

| Command            | What it does                                |
| ------------------ | ------------------------------------------- |
| `/validate [name]` | Test prototype with synthetic users         |
| `/iterate [name]`  | Refine existing prototype based on feedback |
| `/design [name]`   | Review design considerations                |

### Planning & Discovery

| Command              | What it does                          |
| -------------------- | ------------------------------------- |
| `/hypothesis [name]` | Track product assumptions to validate |
| `/roadmap`           | View/update product roadmap           |
| `/brainstorm-board`  | Generate creative ideas               |

### Signals & Sync

| Command        | What it does                   |
| -------------- | ------------------------------ |
| `/ingest`      | Process new signals/feedback   |
| `/synthesize`  | Find patterns across signals   |
| `/sync`        | Pull from all external sources |
| `/sync-linear` | Pull issues from Linear        |
| `/sync-notion` | Pull from Notion               |

### Maintenance & Admin

| Command     | What it does                     |
| ----------- | -------------------------------- |
| `/maintain` | Audit and clean workspace        |
| `/admin`    | Modify workspace rules/commands  |
| `/agents`   | Generate AGENTS.md documentation |

---

## Company Context

All work in this workspace is guided by AskElephant's product vision and strategic guardrails. The AI will:

- **Push back** on requests that don't align with product vision
- **Ask clarifying questions** about outcomes, personas, and evidence
- **Reference leadership quotes** when challenging unclear proposals

Key context files:

- `pm-workspace-docs/company-context/product-vision.md` - Core identity and mission
- `pm-workspace-docs/company-context/strategic-guardrails.md` - Alignment checks
- `pm-workspace-docs/company-context/personas.md` - User personas

---

## Repository Structure

```
pm-workspace/
├── elephant-ai/              # AskElephant codebase (submodule)
│   └── web/src/components/
│       └── prototypes/       # Your prototypes go here
├── pm-workspace-docs/        # PM documentation
│   ├── company-context/      # Product vision, personas, guardrails
│   ├── initiatives/          # Project folders
│   ├── research/             # User research
│   ├── hypotheses/           # Tracked assumptions
│   └── personas/             # Synthetic personas for jury system
├── .cursor/
│   ├── commands/             # Slash commands
│   └── rules/                # AI behavior rules
└── README.md
```

---

## Troubleshooting

### "I can't push my changes"

You need to be added as a collaborator. Contact Tyler.

### "Setup failed"

Make sure you have:

- Node.js 24+ installed (`node --version`)
- Git configured (`git config user.name`)
- Access to the elephant-ai repo

### "Storybook won't start"

```bash
cd elephant-ai
npm install
npm run storybook -w web
```

### "I messed something up"

Don't worry! Your work is safe. Run `/update` to reset, or ask for help.

---

## Getting Help

- **Slack**: Ask in #product or DM Tyler
- **In Cursor**: Just describe what you're trying to do and ask for help

---

## For Advanced Users

<details>
<summary>Manual Git Commands</summary>

The slash commands are wrappers around these git operations:

```bash
# Save work
git add -A
git commit -m "Your message"
git push

# Update
git fetch origin main
git checkout main && git pull
git checkout your-branch
git rebase main

# Create branch
git checkout -b collab/yourname-$(date +%Y-%m-%d)
```

</details>

<details>
<summary>Submodule Management</summary>

```bash
# Initialize submodule
git submodule update --init --recursive

# Update to latest
git submodule update --remote elephant-ai
git add elephant-ai
git commit -m "Update submodule"
```

</details>

<details>
<summary>Environment Variables</summary>

Copy `.env.example` to `.env` for local configuration:

```bash
cp .env.example .env
```

Available variables:

- `CHROMATIC_PROJECT_TOKEN` - For visual regression testing

</details>
