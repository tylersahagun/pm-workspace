# PRD: Composio Agent Framework

**Status:** Discovery → Define  
**Owner:** Tyler  
**Last Updated:** 2026-01-22  
**Strategic Pillar:** Data Knowledge / AI-First UX

---

## Problem Statement

AskElephant users want to automate actions across their tools (CRM, Slack, email, task management) based on meeting insights. Today, this requires:

1. **Complex workflow building** — Connecting multiple nodes, understanding each integration's quirks
2. **Confusing authentication** — Workspace-level connections make actions appear as the admin, not the system
3. **Limited personal automation** — Can't automate personal tools (email drafts, calendar) because service accounts can't act as individual users

> "Workflow building is so complex... Just like the trigger, give it permissions, and then tell it what you wanna do."

Users need a simpler way to create and adopt automations—one where AI agents have the right tools, act transparently, and respect the boundary between workspace and personal actions.

---

## Target Personas

| Persona | Role in Solution | Pain Point Addressed |
|---------|------------------|---------------------|
| **RevOps** | Creates agent templates for the org | Workflow complexity, tool sprawl |
| **Sales Leader** | Adopts team agents, monitors automation | Time on manual tasks, coaching automation |
| **Sales Rep** | Opts into personal agents (email, follow-ups) | Can't automate personal email/tasks today |
| **CSM** | Adopts customer health agents | Manual escalation, missed signals |

---

## Success Metrics

### Primary Metrics
| Metric | Current | Target | Why It Matters |
|--------|---------|--------|----------------|
| Workflow adoption rate | ~15% of workspaces | 40%+ | More automation = more value |
| Time to first automation | Days | Minutes | Simpler UX = faster activation |
| Integration-triggered actions/week | TBD | 10x current | Measures actual automation usage |

### Leading Indicators
- Agent templates created per workspace
- User opt-in rate for shared agents
- Integration connection completion rate

### Trust Metrics
- Error rate in agent actions
- "Who did this?" support tickets (should decrease)
- Manual override/correction rate

---

## User Journey

### Current State (Painful)
```
Admin wants to automate CRM updates after meetings
  → Opens workflow builder
    → Adds trigger node
      → Adds integration node
        → Configures each field manually
          → Connects personal account (appears as them)
            → Realizes it's sending as their identity
              → Confusion when teammates ask "why did you do this?"
```

### Desired State (Short-term: Universal Agent Node)
```
Admin wants to automate CRM updates after meetings
  → Opens workflow builder
    → Adds Universal Agent Node
      → Selects integrations + tools
        → Writes natural language instructions
          → Connects service account (recommended)
            → Actions attributed to "AskElephant Bot"
```

### Desired State (Long-term: Agent Configurator)
```
Admin wants to create email draft automation for reps
  → Opens Agent Configurator
    → Names agent "Follow-up Drafter"
      → Writes instructions: "After each meeting, draft a follow-up email summarizing key points and next steps"
        → Selects Gmail integration
          → Publishes to workspace as "Recommended"
            → Reps opt-in, connect their own Gmail
              → Agent drafts emails as each rep individually
```

---

## MVP Scope

### Phase 1: Universal Agent Node (Short-term GTM)

**What we're building:**
- New workflow node type: "Universal Agent"
- Integration picker with enable/disable per-integration
- Tool picker per-integration (not all 100+ tools by default)
- Natural language instructions field
- Connection flow with service account recommendation

**What we're NOT building (yet):**
- Standalone agent configurator
- User opt-in flow
- Template sharing/forking
- Team-level requirements

**Success criteria:**
- Users can add Composio integrations to workflows
- Actions are clearly attributed (service account recommended)
- 5+ beta customers using successfully

### Phase 2: Agent Configurator (Long-term Vision)

**What we're building:**
- Standalone `/agents` page (outside workflows)
- Agent template builder:
  - Name, description, instructions (prompt)
  - Trigger selection (from Composio + AskElephant triggers)
  - Integration + tool selection
  - Publish states: Draft, Shared, Recommended, Required
- User opt-in experience:
  - Discover available agents
  - Connect required integrations
  - Enable/disable per agent
- Template forking for personalization

**Success criteria:**
- Non-technical users can create agents without workflow builder
- Users adopt org agents with 1-click opt-in
- 50%+ of new automations created via Agent Configurator vs. Workflows

---

## Out of Scope

### For Both Phases
- Building our own integration infrastructure (using Composio)
- Per-action billing (keeping current model)
- Agent-to-agent orchestration
- Custom integration development by customers

### For Phase 1 Only
- User-level authentication (workspace only)
- Template sharing
- Recommended/required agent states

---

## Key Design Decisions

### 1. Service Accounts as Default Recommendation
**Decision:** Recommend service accounts for workspace integrations  
**Rationale:** Transparency about "who did this"—aligned with Linear's agent guidelines

### 2. Two Authentication Patterns
**Decision:** Support both workspace-level (service accounts) and user-level (personal opt-in)  
**Rationale:** Some automations can't use service accounts (email drafts, personal calendar)

### 3. Agent Configurator Outside Workflows
**Decision:** New standalone page, not an evolution of workflow builder  
**Rationale:** Fundamentally simpler mental model—triggers + integrations + prompt

### 4. Composio Tool Router
**Decision:** Leverage Composio's tool router for integration discovery  
**Rationale:** 877 integrations with 100s of tools each—can't expose all at once

---

## Open Questions

### Must Answer Before Phase 1
1. **Which integrations are must-haves for launch?** 
   - Hypothesis: Slack, HubSpot, Salesforce, Gmail, ClickUp
   
2. **What's the error handling UX?**
   - When agent fails mid-action, how do we notify?
   - Do we retry? Roll back?

3. **How does this interact with Privacy Determination?**
   - If agent triggers on meeting, does it check privacy first?

### Must Answer Before Phase 2
4. **Template versioning:**
   - If admin updates a template, what happens to opted-in users?
   - Silent update? Notification? Opt-in to changes?

5. **Billing implications:**
   - Are agent runs unlimited?
   - Per-integration charges?

6. **Guardrails for destructive actions:**
   - Rate limits?
   - Approval gates for "delete" actions?

---

## Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Agent takes wrong action | High (trust) | Medium | Start with read-only; expand to writes with approval gates |
| Composio reliability issues | High | Low | Build monitoring, have fallback messaging |
| User connects wrong account | Medium | Medium | Clear UX explaining what each connection does |
| Runaway agent (infinite loop) | High | Low | Rate limits, action budgets per run |
| Privacy violation | High | Medium | Integrate with Privacy Determination Agent |

---

## Dependencies

| Dependency | Owner | Status | Risk |
|------------|-------|--------|------|
| Composio API access | External | ✅ Connected | Low |
| Workflow builder infra | Engineering | ✅ Exists | Low |
| Privacy Determination Agent | PM/Eng | 🟡 In Progress | Medium |
| Service account documentation | GTM | ❌ Needed | Low |

---

## Timeline (Estimated)

### Phase 1: Universal Agent Node
| Milestone | Target | Owner |
|-----------|--------|-------|
| Design finalized | +1 week | Tyler/Design |
| Engineering spec approved | +2 weeks | Engineering |
| Beta with 3 customers | +4 weeks | Engineering |
| GA rollout | +6 weeks | GTM |

### Phase 2: Agent Configurator
| Milestone | Target | Owner |
|-----------|--------|-------|
| UX exploration | +2 weeks | Design |
| PRD for Phase 2 | After Phase 1 learnings | Tyler |
| Engineering scoping | TBD | Engineering |

---

## Appendix

### Composio Capabilities Reference
| Capability | How We Use It |
|------------|---------------|
| Tool Router | Discover integrations without overwhelming agent |
| Triggers | Power agent configurator event triggers |
| Workbench | Testing during development |
| Slack vs Slackbot | Support both bot-level and user-level Slack |

### Related Initiatives
- **HubSpot Agent Config UI** — Similar UX patterns for integration configuration
- **Privacy Determination Agent** — Must integrate before automation goes live
- **Workflow Builder** — Phase 1 builds on this; Phase 2 may replace much of it
