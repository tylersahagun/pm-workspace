# Research: CRM Experience End-to-End

## Summary
Comprehensive CRM agent experience from onboarding through daily use. This initiative covers the full user journey for both admins (RevOps) and end users (reps) from initial HubSpot setup through daily proactive engagement with the CRM agent.

## Sources

### Source 1: Product Planning Session
- **Date:** 2026-01-16
- **Participants:** Woody, Tyler, Bryan, Skylar
- **Related PRD:** [hubspot-agent-config-ui](../hubspot-agent-config-ui/prd.md)

### Source 2: User Story Brain Dump
- **Date:** 2026-01-16
- **Type:** Leadership user story walkthrough
- **Focus:** End-to-end CRM experience from admin and user perspectives

---

## Key Insights from User Story

### Admin Journey (RevOps/Partner)

#### Phase 1: Initial Setup & Onboarding
> "I log in to AskElephant. After I get some basic setup within the onboarding, I need to be able to set up my HubSpot and then immediately be able to set up some of the initial groundwork for the HubSpot agent to deliver some outcomes."

**Key requirements:**
1. **Education first** - User needs to understand how it works
2. **Specific examples** - Pre-built templates they can implement quickly
3. **Test & validate** - See actual output before committing
4. **Build confidence** - The key emotion is confidence that it will work

> "I want to be able to actually test and see an output so that I have confidence. That's the key there is I need the confidence of, k. I just got this set up, and it is actually going to work how I want it to work."

#### Phase 2: Initial Configuration
- Start with **one or just a handful of things first**
- Test on real data to build confidence
- Submit only after validation
- Transition to full management view

> "Once I do that and it really should be for probably one or just a handful of things first. I have the confidence. I submit it. It takes me to another page where I can see the full scope of it."

#### Phase 3: Daily Admin Operations
> "I see where those are. I can see that it's running, and then I can configure new ones."

**Day-to-day admin needs:**
1. **Alerts for broken things** - Proactive notification when something fails
2. **Activity logs** - Manual visibility into what's happening
3. **Trend detection** - AskElephant proactively surfaces anomalies
4. **Easy troubleshooting** - Quick path to resolution

> "I'm able to get alerts of if something is broken. I'm able to come in manually and see just activity logs and what's going on."

> "AskElephant is working with me and being proactive to help me understand trends, things that might not be that seem like they're anomalies."

### User Journey (Sales Rep)

#### Passive Engagement (Notifications)
> "Not even logging in, just in general. I should be getting Slack notifications if I want or desktop notifications."

**Notification channels:**
- Slack notifications
- Desktop notifications
- Configurable preferences

#### Active Engagement (In-App)
> "When I log in to AskElephant, I want a place where I can see the agent communicating to me. This is what I did."

**Agent communication types:**
1. **Human-in-the-loop** - Asking for permission
2. **Reporting** - Informing what was done
3. **Opt-out path** - "If you don't want that, then do something else"

#### Visibility Requirements (Both Admin & User)
> "For both the user and an admin, I should be to see everywhere that the HubSpot agent is touching, what data it's touching, where it's running."

**Visibility needs:**
- What data is being touched
- Where the agent is running
- Full audit trail

#### User Self-Service
> "For a user, I should still be able to go easily see how to build my own automations if I want it. That would only impact my own."

**User empowerment:**
- Build personal automations
- Scoped to own data only
- Easy discovery of capabilities

#### HubSpot Query Capability
> "It should be easy for me to query HubSpot and actually get accurate data, and be able to use that HubSpot data within my day to day."

**Query requirements:**
- Easy querying interface
- Accurate data retrieval
- Integration with daily workflows

---

## Key Decisions Made

### Decision 1: Palmer Working on Slack Human-in-the-Loop
**Status:** In Progress
**Details:**
> "What's now possible based off of what David and I finished last night is human in the loop through Slack. So if Palmer needs a brick to work on, that is a very small one to make it so after the agent runs, the human in the loop could then trigger a message to that user in Slack."

**Implications:**
- Slack as primary channel for HITL approvals
- Users can be notified where they already work
- Enables notification engine integration

### Decision 2: Notification Engine Integration
**Status:** Planned
**Details:**
> "There's also the notification engine we should point into... those notifications. Slack."

**Implications:**
- CRM agent connects to broader notification system
- Consistent notification experience across features

### Decision 3: Inbox Required for Agent Approvals
**Status:** Planned
**Details:**
> "The inbox. I think they have an inbox supposed to actually get stuff. It workflows better. It makes the agent runs better. Just being able to know what's happening when."

**Requirements:**
- Centralized inbox for human-in-the-loop approvals
- Filter workflows by tools used
- Aggregate view by user (users see only their own)
- Admin view sees all agents

---

## User Problems Identified

| Problem | Severity | Frequency | Evidence |
|---------|----------|-----------|----------|
| No confidence during setup | High | Common | "I need the confidence of, k. I just got this set up, and it is actually going to work how I want it to work" |
| No visibility into agent actions | High | Common | "I should be to see everywhere that the HubSpot agent is touching, what data it's touching" |
| No proactive anomaly detection | High | Common | "AskElephant is working with me and being proactive to help me understand trends, things that might not be that seem like they're anomalies" |
| No centralized inbox for approvals | High | Common | "I want a place where I can see the agent communicating to me" |
| Troubleshooting is difficult | Medium | Common | "It should be very easy to troubleshoot if something is wrong and get to a resolution" |
| Can't query HubSpot easily | Medium | Common | "It should be easy for me to query HubSpot and actually get accurate data" |
| Users can't build own automations | Medium | Occasional | "I should still be able to go easily see how to build my own automations" |

---

## User Story Walkthrough (From Earlier Session)

### Admin Onboarding Flow
1. **Connect CRM**: Select CRM type, sign in, connect
2. **Workspace Selection**: Handle multiple workspaces
3. **Scope Selection**: What are you trying to do? (3 options presented)
4. **Agent Introduction**: "Agents work after meetings, analyze conversations, populate CRM, read calls, decide updates, wait for you"
5. **Call Type Selection**: What call type? (e.g., Discovery call)
6. **Pre-built Workflows**: Default areas/workflows for that call type with on/off toggles

> "The cool thing about this is these are prebuilt workflows on our side that we know are necessary for that discovery call."

7. **Test on Real Data**: Pull in data, show confidence scores
8. **Review Low Confidence**: "Requires review" for items needing attention

### Admin Daily Use
- **Activity Log**: See what each agent did across all CRM automation
- **Filter by Agent/Tool**: Break down by different agents, filter by tools
- **Workflow Management**: See all workflows impacting HubSpot grouped together

> "As an admin, if I disagree with it, I will want to figure out how to edit or update or tell the agent what it did wrong so that way it makes improvements."

### User Daily Use
- Users see only their own agent runs (not other users')
- Aggregated activity view for self
- Inbox for approvals

---

## Key Quotes

**On Confidence (Critical Theme):**
> "I want to be able to actually test and see an output so that I have confidence. That's the key there is I need the confidence."

**On Proactive AI:**
> "AskElephant is working with me and being proactive to help me understand trends, things that might not be that seem like they're anomalies."

**On Agent Communication:**
> "I want a place where I can see the agent communicating to me. This is what I did. And if it's human in the loop asking for permission or it's just reporting."

**On Visibility:**
> "For both the user and an admin, I should be to see everywhere that the HubSpot agent is touching, what data it's touching, where it's running."

**On Admin Control:**
> "As an admin, I'm on full control. That's just my persona."

---

## Action Items

| Owner | Task | Timeline |
|-------|------|----------|
| Palmer | Slack HITL notification after agent runs | In Progress |
| Tyler/Bryan | Meet with James to define end-to-end experience | Today |
| Team | Design inbox experience | TBD |
| Team | Connect to notification engine | TBD |
| Team | Design admin activity dashboard | TBD |
| Team | Design user agent communication center | TBD |
| Team | Design HubSpot query interface | TBD |

---

## Dependencies
- HubSpot Agent Config UI (existing initiative)
- Notification Engine
- Inbox/Approval System
- Admin Onboarding
- Slack Integration

---

## Open Questions
1. What constitutes "success" for the CRM agent onboarding?
2. How do we handle companies vs contacts syncing?
3. Should we support deals as a first-class object?
4. What's the right level of admin control vs. opinionated defaults?
5. How do we surface anomalies and trends to admins?
6. What's the scope of "personal automations" for users?
7. How do we integrate HubSpot querying into daily workflows?

---

## Related Initiatives
- [hubspot-agent-config-ui](../hubspot-agent-config-ui/prd.md)
- Admin Onboarding
- Notification Engine (current/notification-engine)

---
*Last updated: 2026-01-16*
