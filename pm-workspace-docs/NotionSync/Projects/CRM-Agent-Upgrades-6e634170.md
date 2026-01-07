---
notion_id: 2c0f79b2-c8ac-81a1-935f-c59c6e634170
notion_url: "https://www.notion.so/CRM-Agent-Upgrades-2c0f79b2c8ac81a1935fc59c6e634170"
notion_last_edited_time: "2026-01-09T23:34:00.000Z"
sync_last_synced_at: "2026-01-15T02:24:27.369Z"
source: database
database_id: 2c0f79b2c8ac802c8b15c84a8fce3513
---

# PRD — CRM Agent Upgrades

Under the "CRM Data Confidence" Initiative

Bridge project while the new Staged Progressions and Metrics System is being built

---

### Constraints

No design resources will be allocated to this project

---

## Purpose

AskElephant is undertaking a major re-architecture of how pipeline stages, progression logic, and CRM-related metrics will work. The long-term vision includes a first-class entity intelligence model for companies, contacts, and deals — but this will take considerable time.

CRM Agent Upgrades provides the necessary stopgap improvements so users can confidently rely on AskElephant for CRM updates today, while we build tomorrow's full system.

Currently:

- Salesforce Agent already uses our modern Agent Architecture.

- HubSpot Agent is still a collection of tools exposed directly to chat.

This project brings the HubSpot Agent up to parity:

- Moves it onto the new Agent Architecture

- Adds workspace/user-level integration handling

- Makes CRM updates more predictable, reusable, and trustworthy

- Improves visibility, oversight, and debugging

- Ensures Salesforce and HubSpot maintain long-term parity

This project does not implement new CRM intelligence (e.g., stage progression inference). It only upgrades agent tooling and infrastructure so CRM updates today are safe, consistent, and explainable.

---

## Objectives

1. Migrate HubSpot to the modern Agent Architecture

1. Support user-level integrations for chat and workspace-level integrations for workflows, matching Salesforce.

1. Allow workspace admins to override and force workspace integration for chat if desired.

1. Make CRM updates predictable and reusable by embedding the "complex prompt" logic internally in the HubSpot Agent.

1. Expose CRM update transparency, including tracking, post-call visualization, and review queues.

1. Support human in the loop, allowing users to approve or deny, and even make edits to what would be pushed to Hubspot

1. Provide fine-grained configurability, including read scopes, write scopes, and action toggles. (stretch)

1. Support dry-run (proxy) mode for testing workflows safely (stretch).

---

## Persona Outcomes (Context Only)

These are served by this project but not necessarily completed entirely within it.

### Sales Reps / AEs (Aaron)

1. As an AE, I want AskElephant to reliably update my CRM fields for me because CRM admin kills my productivity, but I fear incorrect updates harming my deals.

1. As an AE, I want AskElephant to follow my permissions in CRM because I should never accidentally access data I'm not allowed to see.

---

### CSMs (Celine)

1. As a CSM, I want predictable CRM updates tied to customer conversations because my accounts depend on accurate tracking, but I fear silent failures.

---

### Sales Managers (Roger)

1. As a Sales Leader, I want consistent CRM behavior across my team because pipeline hygiene affects forecasting, but I fear unpredictable AI-driven updates.

---

### RevOps (Odis)

1. As a RevOps Manager, I need granular control over which CRM properties AskElephant reads/writes because governance matters, but I fear agents having overly broad permissions.

1. As a RevOps Manager, I want visibility into every CRM update AskElephant performs because auditing is essential, but I fear black box behavior.

---

## High-Level Solution

This project transforms the current HubSpot agent into a modern, consistent, controlled CRM agent with:

### 1. Agent Architecture Adoption

HubSpot becomes an actual agent within the agent arch

### 2. Dual Integration Model

Matching Salesforce:

- User integration for chat

- Workspace integration for workflows

### 3. Built-in Internal Prompting

Remove the need for CSMs to craft giant composite prompts.

Agent should:

- Know how to identify the correct deal/company/contact

- Know how to update fields cleanly

- Know how to search for the right CRM object

Users/workflows should only specify the variable parts (e.g., which fields to update and when).

### 4. Visibility & Oversight

A full transparency layer:

- Which workflows updated CRM

- What fields changed post-call

- A human-in-the-loop review queue (stretch)

- Audit trail of updates

- Dry-run mode for safe testing (stretch)

### 5. Configurable Controls & Permissions (stretch)

RevOps and admins get:

- Read-property whitelists

- Write-property whitelists

- Object scoping

- Perfect association logic between objects

- Action toggles

---

# Functional Requirements

## 1. Migrate HubSpot Agent to Agent Architecture

- Prompt composed for use case (see James for existing prompt explaining how to fetch and match deals)

- Support agent-level memory/state (chat only) (stretch)

Parity requirement:

Any architecture improvements made here must also be added to the Salesforce Agent.

---

## 2. Predictable CRM Update Behavior

### Internalizing the "Magic Prompt" (suggest working with James)

Current complex prompting should be absorbed into the agent as internal logic:

- How to find the right CRM object

- How to pick the correct deal

- How to update fields safely

- How to merge multiple updates

- How to avoid overwriting newer data

- How to handle missing records

- How to surface errors

Users/workflows should specify:

- Field(s) to update

- Conditions or triggers

- Values or instructions

Agent assembles the required system prompt automatically.

---

## 3. Visibility & Oversight Layer

### (a) Workflow Tracking (Trust)

- Show which workflows are updating HubSpot

- Show the objects + fields being updated

- Show frequency + who the updates are for

### (b) Post-Call Visualization

- On-call summary page, show:

### (c) Human-in-the-Loop

- Review, approve, reject

- Audit log

- RevOps-friendly UX

---

## 5. Configurability & Control (stretch)

### (a) Granular Read Permissions

- Multi-select:

### (b) Action Toggles

- Admin controls like:

These toggles feed directly into the agent's system prompt.

---

# Non-Functional Requirements

- High predictability — deterministic behavior across similar requests

- High explainability — clear audit logs and pre/post visibility

- Permission-safe — agent must strictly honor CRM permissions

- Consistent across CRMs — Salesforce and HubSpot parity

- Stable — workflow-safe (no accidental overwrites)

---

# Success Metrics

Posthog Dashboard

- % of CRM updates performed by AskElephant that violate permissions (target: 0%)

- % reduction in CSM-authored custom prompts required for CRM updates

- % reduction in RevOps tickets related to "unexpected CRM behavior"

- Time to Configured

---

NOTE:

Here is a related issue reported by a customer. I think that the changes here will likely improve this:

VAN-382

---

## Linear Issues

<embed url="https://linear.app/askelephant/project/crm-agent-upgrades-926f1768afb4"/>
