# Prototype Notes: Composio Agent Framework

**Created:** 2026-01-22  
**Prototype Type:** Standalone (Storybook)  
**Location:** `elephant-ai/web/src/components/prototypes/ComposioAgentFramework/`

---

## Overview

This prototype explores the UX for the Composio Agent Framework, covering both phases:

- **Phase 1: Universal Agent Node** — A workflow builder node for Composio integrations
- **Phase 2: Agent Configurator** — A standalone page for creating/managing agent templates

## Creative Options Explored

Three creative directions were built to explore the autonomy spectrum:

### Option A: Maximum Control

**Philosophy:** Step-by-step wizard with explicit confirmations. Nothing happens without user approval.

**Characteristics:**
- 6-step wizard (Basics → Trigger → Integrations → Tools → Instructions → Review)
- Each step must complete before proceeding
- Maximum transparency about configuration
- Clear progress indicator

**Best For:**
- New users learning the system
- High-stakes agents (e.g., those with delete permissions)
- Organizations prioritizing control over efficiency

**Trade-offs:**
- Most steps, slowest path to creation
- May feel tedious for experienced users

---

### Option B: Balanced ⭐ (Recommended)

**Philosophy:** AI suggests, user easily overrides. Building trust through helpful defaults.

**Characteristics:**
- Single-page form with collapsible sections
- AI "Suggest" button for instructions
- Inline tool selection with expandable integration cards
- Dialog for integration picker

**Best For:**
- Most users in general scenarios
- Balance of control and efficiency
- Trust-building journey

**Trade-offs:**
- Middle ground may not fully satisfy either extreme
- More cognitive load than wizard (all at once)

**Why Recommended:**
This option balances trust-building (users see everything, can override) with productivity (single page, AI assists). It follows the human-centric AI design principle of "AI suggests, human decides."

---

### Option C: Maximum Efficiency

**Philosophy:** AI acts, user reviews. Minimum steps for experienced users.

**Characteristics:**
- Single input: "What should this agent do?"
- AI generates complete configuration
- User reviews and approves or edits
- Fastest path to creation

**Best For:**
- Power users who trust AI
- Routine agent creation
- Speed-focused workflows

**Trade-offs:**
- May feel "black box" to new users
- Requires established trust
- User may not understand what was configured

---

## Human-Centric AI Design Principles Applied

### Trust Calibration
- **Tool risk indicators**: Read (green) / Write (amber) / Delete (red) with icons
- **Service account recommendation**: Prominently suggests transparency
- **Connection status**: Clear visual for connected vs. needs-connection

### Emotional Design
- **Visceral**: Clean, professional interface builds trust
- **Behavioral**: Consistent patterns across all options
- **Reflective**: Users feel in control, agents assist (not replace)

### Accessibility
- Keyboard navigable throughout
- Clear focus states
- Color not sole indicator (icons + labels)
- Aria-live regions for dynamic content

### All States Implemented
- ✅ Loading (skeleton cards)
- ✅ Success (agent enabled confirmation)
- ✅ Error (connection failed alerts)
- ✅ Low Confidence (not applicable—no AI inference)
- ✅ Empty (no agents, admin vs. user variants)

---

## Key Components Created

| Component | Purpose | Location |
|-----------|---------|----------|
| `IntegrationPicker` | Search/select from 877 integrations | `components/IntegrationPicker.tsx` |
| `ToolSelector` | Toggle tools with risk indicators | `components/ToolSelector.tsx` |
| `InstructionsEditor` | Natural language prompt with variables | `components/InstructionsEditor.tsx` |
| `AgentCard` | Display card for agent listing | `components/AgentCard.tsx` |
| `UniversalAgentNode` | Phase 1 workflow node | `UniversalAgentNode.tsx` |

---

## Storybook Stories

Navigate to `Prototypes/ComposioAgentFramework/` in Storybook:

| Story | Description |
|-------|-------------|
| `Option A: Maximum Control` | Wizard-based configurator |
| `Option B: Balanced` | Single-page form (recommended) |
| `Option C: Maximum Efficiency` | AI-generated config |
| `Agent List: User View` | Discovery & opt-in experience |
| `Agent List: Admin View` | Management interface |
| `States: Loading` | Skeleton loading states |
| `States: Empty` | Empty state variants |
| `Component: *` | Individual component demos |
| `Options Comparison` | Side-by-side comparison |

### Universal Agent Node Stories
Navigate to `Prototypes/ComposioAgentFramework/UniversalAgentNode/`:

| Story | Description |
|-------|-------------|
| `Empty State` | No integrations added |
| `With Integrations` | Configured with tools |
| `Needs Connection` | Mixed connection status |
| `Collapsed` | Collapsed node state |
| `In Workflow Context` | Full workflow preview |

---

## Recommendations

### Short-term (Phase 1)
- Ship **Universal Agent Node** with Option B patterns
- Focus on HubSpot, Slack, Salesforce integrations first
- Ensure service account recommendation is prominent

### Long-term (Phase 2)
- Start with **Option B** for Agent Configurator
- Offer Option A as "guided mode" for new users
- Consider Option C as "quick create" for power users

### Design Questions to Resolve

1. **Card vs. list for integration picker?**
   - Current: Card-based with search
   - Alternative: List with inline toggle

2. **Where does Agent Configurator live?**
   - Recommendation: `/agents` or nested under `/settings/agents`

3. **How to handle template versioning?**
   - When admin updates, do opted-in users auto-update?

---

## Open Items for Review

- [ ] Woody to review Phase 2 UX vision
- [ ] Engineering to confirm Composio API integration patterns
- [ ] RevOps persona validation (is wizard too slow?)
- [ ] Accessibility audit on final option

---

## Files Created

```
elephant-ai/web/src/components/prototypes/ComposioAgentFramework/
├── index.ts
├── types.ts
├── AgentConfigurator.tsx
├── AgentConfigurator.stories.tsx
├── UniversalAgentNode.tsx
├── UniversalAgentNode.stories.tsx
└── components/
    ├── index.ts
    ├── IntegrationPicker.tsx
    ├── ToolSelector.tsx
    ├── InstructionsEditor.tsx
    └── AgentCard.tsx
```

---

## Next Steps

1. **Run `/validate composio-agent-framework`** to test with synthetic users
2. **Review with Woody** for Phase 2 UX direction
3. **Iterate based on feedback** using `/iterate composio-agent-framework`
