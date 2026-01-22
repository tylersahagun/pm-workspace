# Design Brief: Composio Agent Framework

**Initiative:** composio-agent-framework  
**Designer:** TBD (Woody interested)  
**Last Updated:** 2026-01-22

---

## Design Challenge

How do we take the complexity of 877 integrations with hundreds of tools each and make it feel simple enough that:
1. An admin can configure an automation in minutes, not hours
2. A non-technical user can opt into an agent without understanding the underlying infrastructure
3. Everyone trusts what the agent is doing on their behalf

> "Workflow building is so complex... Just like the trigger, give it permissions, and then tell it what you wanna do."

---

## User Flows

### Flow 1: Admin Creates Universal Agent Node (Phase 1)

```
Workflow Builder
  └── + Add Node
        └── "Universal Agent" (new node type)
              └── Integration Picker
                    ├── Search/browse 877 integrations
                    ├── Toggle integrations on/off
                    └── Per-integration: toggle tools on/off
              └── Instructions (natural language prompt)
                    └── "After each meeting, update the HubSpot deal with..."
              └── Connection Status
                    ├── "Connect [Integration]" → OAuth flow
                    └── ⚠️ "We recommend using a service account for transparency"
```

**Key States:**
- Empty state (no integrations selected)
- Integration search/browse
- Tool selection within integration
- Connection pending
- Connected (with service account badge)
- Connected (with personal account warning)

### Flow 2: Admin Creates Agent Template (Phase 2)

```
/agents (new page)
  └── + Create Agent
        └── Basic Info
              ├── Name: "Follow-up Drafter"
              ├── Description: "Drafts personalized follow-up emails..."
              └── Icon picker
        └── Triggers
              ├── "When does this agent run?"
              ├── AskElephant triggers: "After meeting ends", "Deal stage changes"
              └── Composio triggers: "New Slack message in channel", "Email received"
        └── Integrations & Tools
              ├── + Add Integration
              │     └── Search/select from Composio
              └── Per-integration tool toggles
        └── Instructions
              └── Rich text prompt editor
                    └── Variables: {{meeting_summary}}, {{attendees}}, {{deal_name}}
        └── Publish Settings
              ├── Draft (only you can see)
              ├── Shared (visible to workspace)
              ├── Recommended (suggested for users)
              └── Required (mandatory for team members)
```

### Flow 3: User Opts Into Agent (Phase 2)

```
/agents (user view)
  └── Available Agents
        ├── Recommended for You
        │     └── [Agent Card]
        │           ├── Name, description, creator
        │           ├── "Used by 12 teammates"
        │           └── [Enable] button
        └── All Workspace Agents
              └── [Agent Card]...

  └── [Enable] clicked
        └── Connection Modal
              ├── "This agent needs access to:"
              │     ├── Gmail (not connected) → [Connect]
              │     └── HubSpot (connected ✅)
              └── [Enable Agent] (disabled until all connected)

  └── My Agents (enabled)
        └── [Agent Card]
              ├── Status: Active ✅
              ├── Last run: 2 hours ago
              ├── [View Activity] → logs
              └── [Disable]
```

---

## Key Screens/States

### Phase 1: Universal Agent Node

| Screen | Purpose | Key Elements |
|--------|---------|--------------|
| Node empty state | First-time configuration | Friendly illustration, "Add your first integration" |
| Integration picker | Select which integrations | Search, categories, popular, recently used |
| Tool selector | Scope which tools | Checklist with descriptions, "Select all" / "Clear" |
| Instructions editor | Natural language prompt | Large textarea, variable hints |
| Connection status | Show auth state | Green check / warning / connect button |
| Service account guidance | Educate on best practice | Info banner explaining recommendation |

### Phase 2: Agent Configurator

| Screen | Purpose | Key Elements |
|--------|---------|--------------|
| Agent list (admin) | Manage all agents | Cards with status badges, usage stats |
| Agent list (user) | Discover & opt-in | Recommended section, search/filter |
| Agent builder | Create/edit template | Stepper or tabs for each section |
| Trigger picker | When to run | Category tabs, search, multi-select |
| User opt-in modal | Connect & enable | Progress indicator, clear requirements |
| Agent activity log | See what happened | Timeline of actions with outcomes |

---

## Interaction Patterns

### Integration Selection
- **Search-first:** Given 877 options, search must be fast and prominent
- **Smart defaults:** Show "Popular" and "Recently used" sections
- **Bulk actions:** "Enable all HubSpot tools" vs. individual toggles
- **Visual hierarchy:** Integration icon + name + tool count

### Tool Scoping
- **Default OFF:** Don't give agent every tool by default
- **Grouped tools:** Read vs. Write vs. Delete categories
- **Risk indicators:** ⚠️ badge on destructive tools (archive, delete)
- **Descriptions:** Brief explanation of what each tool does

### Natural Language Instructions
- **Large, comfortable textarea** — This is the core input
- **Variable insertion:** Dropdowns or `/` commands to insert {{variables}}
- **Examples:** "See examples" link with common patterns
- **Validation:** Warning if prompt is too vague

### Connection Flow
- **OAuth popup** — Standard pattern
- **Service account nudge:** "For best results, connect a dedicated service account"
- **Fallback:** "Connect your personal account (not recommended for shared workflows)"

### Agent Opt-in (Phase 2)
- **One-click for connected users** — If all integrations already connected
- **Progressive disclosure:** Show what's needed, connect one-by-one
- **Social proof:** "Used by 12 teammates" builds trust
- **Easy out:** Disable anytime, clear what stopping does

---

## Edge Cases

### Error States

| Error | UX Response |
|-------|-------------|
| Integration connection fails | Inline error with "Try again" + "Get help" |
| Agent action fails at runtime | Toast notification + entry in activity log |
| Rate limit hit | "Agent paused—try again in X minutes" |
| Integration revoked mid-run | Clear notification, prompt to reconnect |

### Empty States

| State | UX Response |
|-------|-------------|
| No integrations added | Illustration + "Add your first integration to get started" |
| No agents in workspace (user view) | "No agents available yet. Ask your admin!" |
| No activity yet | "Run your first agent to see activity here" |

### Loading States

| State | UX Response |
|-------|-------------|
| Integration search | Skeleton cards while loading |
| Connection in progress | Spinner with "Connecting to [Integration]..." |
| Agent running | "Running..." badge with spinner on agent card |

### Permission Boundaries

| Scenario | UX Response |
|----------|-------------|
| User tries to create agent (admin-only) | "Contact your admin to create agents" |
| Required agent can't be disabled | Disabled toggle + "Required by your admin" |
| User not eligible for agent (team restriction) | Hidden from their list (not shown as locked) |

---

## Accessibility Considerations

### Keyboard Navigation
- Tab through integration cards
- Enter to toggle, Space to expand details
- Escape to close modals

### Screen Reader
- Integration cards have descriptive labels: "[Integration name], [X tools enabled]"
- Connection status announced: "Gmail, connected" vs. "Gmail, not connected, button to connect"
- Agent status announced: "Follow-up Drafter agent, active, last run 2 hours ago"

### Color Independence
- Don't rely only on green/red for status
- Use icons (✓, ⚠️, ✕) alongside colors
- Text labels always present

### Motion
- Respect `prefers-reduced-motion`
- No required animations for understanding state

---

## Design References

### Internal (AskElephant)
- **HubSpot Agent Config UI** — Similar integration configuration patterns
- **Workflow Builder nodes** — Existing node styling and patterns
- **Settings pages** — Toggle and form patterns

### External
- **Linear's Agent Guidelines** — Transparency principles
- **Zapier's Zap builder** — Integration picker UX
- **Slack's Workflow Builder** — Trigger selection patterns
- **Notion's connections** — OAuth and permission UX

---

## Design Questions to Explore

1. **Card vs. list for integrations?** 
   - Cards are scannable but take space
   - List is compact but less visual

2. **Stepper vs. tabs for agent builder?**
   - Stepper implies order (might be unnecessary)
   - Tabs allow jumping around

3. **How prominent is the service account recommendation?**
   - Banner that can be dismissed?
   - Inline warning every time?
   - Onboarding-only?

4. **How do we visualize "what this agent can do"?**
   - List of permissions?
   - Visual scope indicator?
   - "This agent can read and write to HubSpot"

5. **Activity log granularity?**
   - Every API call?
   - Summary per run?
   - Only errors and successes?

---

## Design Explorations

### Chat Interface Prototype (Adam, 2026-01-22)

**Signal:** `sig-2026-01-22-composio-figma-make-chat-interface`  
**Source:** Figma Make prototype (Options A, B, C)  
**Full Spec:** `signals/documents/2026-01-22-composio-figma-make-chat-interface-spec.md`

Key patterns explored:
- **Typewriter effect** — Character-by-character text reveal simulates AI thinking
- **Artifact chains** — UI cards/lists fade in only AFTER text completes
- **Sticky input** — Floating input card at viewport bottom with auto-expanding textarea
- **Animation timing** — Uses `onAnimationEnd` callbacks (not timeouts) for reliability

**Applicability to Composio:**
| Design Brief Section | Potential Application |
|----------------------|-----------------------|
| Natural Language Instructions | Large textarea pattern, comfortable input |
| Agent Opt-in UX | Sequential reveal builds trust |
| Activity Log | Streaming responses for real-time feel |

**Open Questions:**
1. Does this pattern extend to the Universal Agent Node, or only standalone chat?
2. Should "Suggested Workflows" artifacts map to actual Composio integrations?
3. Consider `prefers-reduced-motion` for accessibility

---

## Next Steps

1. **Woody to explore Phase 2 UX** — Agent configurator vision
2. **Design Phase 1 node UX** — Integration picker + tool selector
3. **Prototype key flows** — Run by RevOps persona for feedback
4. **Define component library needs** — New components vs. existing
5. **Review chat interface spec** — Determine if Adam's patterns apply to agent config
