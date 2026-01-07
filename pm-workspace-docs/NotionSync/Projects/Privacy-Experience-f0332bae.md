---
notion_id: 2c0f79b2-c8ac-8188-b582-fcc9f0332bae
notion_url: "https://www.notion.so/Privacy-Experience-2c0f79b2c8ac8188b582fcc9f0332bae"
notion_last_edited_time: "2025-12-15T22:25:00.000Z"
sync_last_synced_at: "2026-01-15T02:24:25.149Z"
source: database
database_id: 2c0f79b2c8ac802c8b15c84a8fce3513
---

# PRD — Privacy Experience

Under the "Trust Initiative"

---

## Purpose

AskElephant handles deeply sensitive information — customer conversations, internal strategy, personal details, financials, negotiations, onboarding information, and more. Trust is not optional.

Users must feel confident that AskElephant is honoring their privacy choices, respecting boundaries, and giving them complete visibility and control.

The Privacy Experience project creates a coherent, intuitive, transparent privacy model across the entire application. It unifies privacy settings, FGA (Fine-Grain Access Control), visibility logs, workflow-level transparency, sharing controls, and user understanding into a single, consistent experience.

This project supports the primary Trust outcome:

> "I trust AskElephant with my information."

And more specifically:

- I have control of how my data is handled

- I understand what I can and can't control

- I have confidence in what's happening with my information

- I know who can see my information

- I know where my information came from

- I know where my information is going

- I'm not worried about forgetting privacy settings

This project is a broad experience initiative — tying together UI, permissions architecture, visibility tooling, and user mental models.

This project does not include dynamic redaction or multi-level privacy inference (those belong to future phases), but it must lay the groundwork for them.

---

## Objectives

1. Centralize and simplify privacy settings at both workspace and user levels.

1. Ensure privacy settings are honored comprehensively throughout the application.

1. Introduce FGA (Fine-Grain Access Control) to support user groups, granular sharing rules, and collaborative boundaries.

1. Provide visibility into who has viewed data, what workflows have run, and where data has flowed.

1. Deliver user-facing transparency tools so no privacy action feels like a black box.

1. Enable confidence and intuitive understanding so users never worry whether AE leaked or overshared their information.

1. Build UX patterns that consistently reinforce AskElephant's commitment to privacy.

1. Lay the groundwork for future granular redaction, privacy inference, sharing rules, and data lineage tracing.

---

## Persona Outcomes (Context Only)

These are served by this project but not exclusively delivered within this phase.

"Users are so confident that AskElephant will protect and respect their private data that they trust AskElephant to be in the room for even the most sensitive of conversations.

I can bring AskElephant into my most personal conversations and remove the delineation of AskElephant as a business or personal advisor."

---

### AARON — AE

1. As an AE, I want to know exactly who can see my recorded conversations because my deals are sensitive, but I fear accidental oversharing.

1. As an AE, I want confidence that private conversations stay private even if I forget to toggle a setting, but I fear the system making the wrong call silently.

---

### IRINA — IMPLEMENTATION SPECIALIST

1. As an Implementation Specialist, I want transparency into which workflows touched my clients' data because trust is crucial in onboarding, but I fear uncertainties about AI or automation accessing sensitive information.

---

### ROGER — SALES LEADER

1. As a Sales Leader, I want confidence that team-sensitive discussions are protected, but I fear default settings that are misunderstood or misconfigured.

---

### ODIS — REVOPS

1. As a RevOps Manager, I want a reliable, auditable privacy system because compliance matters, but I fear invisible data access patterns that I can't monitor.

---

## High-Level Solution

The Privacy Experience project introduces a unified, intuitive privacy layer across AskElephant that includes:

### 1. Centralized Privacy Settings

Workspace-level and user-level settings combined into a coherent UX.

Settings determine:

- Default privacy for engagements

- Sharing rules

- Access groups

- Workflow permissions

- AI interaction boundaries

### 2. Fine-Grain Access Control (FGA)

A new permissions framework enabling:

- User groups (e.g., Sales, CS, Leadership, External Contractors)

- Per-entity privacy rules

- Sharing and unsharing individual meetings or content

- "Who can see this?" explanatory UI

### 3. Data Visibility and Provenance

User- and admin-facing tools showing:

- Who viewed an engagement

- Which workflows accessed or modified data

- Where data egressed (CRM, Slack, email)

- Why the system took a privacy action (e.g., Privacy Determination Agent)

- How privacy settings were applied

### 4. Privacy Setting Enforcement Everywhere

Privacy logic must be:

- Consistent

- Deterministic

- Honored across:

### 5. Intuitive UX Layer

A cohesive privacy story delivered through:

- Icons and badges

- Sharing modals

- Audit logs

- Privacy summaries

- Contextual privacy callouts

- Simple explanations ("This meeting is private because…")

---

# Functional Requirements

## 1. Privacy Settings System

### Workspace-Level Settings

Admins can configure:

- Default privacy for meetings

- Automatic privacy rules (e.g., by team, domain, content type)

- Integration privacy boundaries

- Workflow privacy permissions

- Role-based visibility

- Privacy Determination Agent rules

- FGA groups and visibility rules

### User-Level Settings

Users can override:

- "My default privacy"

- Personal sharing rules

- Additional rules for Privacy Determination Agent

- Whether others in their team can view their meetings

### Combined Logic

Final resolved privacy = Most restrictive of:

1. Workspace default

1. User default

1. Privacy Determination Agent

1. FGA rules

1. Manual overrides

Must be deterministic and explainable.

---

## 2. Fine-Grain Access Control (FGA)

Core capabilities:

- Assign users to groups

- Support custom groups (e.g., "Leadership Only")

- Enable sharing/unsharing of individual meetings, notes, transcripts

- Support hierarchical or overlapping groups

- Integrate with all search and retrieval functions

UI:

- "Who can see this?" viewer

- Sharing dialog with groups and individuals

- Access badges on engagement pages

---

## 3. Privacy Enforcement Across the App

Privacy must be respected everywhere:

- Global search

- Global chat

- Meeting pages

- Workflows and automations

- CRM updates

- Notifications

- Engagement timelines

- Object-level pages (companies, contacts, deals)

If a user doesn't have access, they should never see:

- Record title

- Transcript snippets

- Workflow actions

- CRM updates

Fallback:

- Opaque "You don't have access" UX

- Granular for each component

- No leaking of metadata or structure

---

## 4. Data Visibility & Provenance Tools

### (a) Data Viewer: "Who Saw This?"

Shows:

- List of viewers

- Timestamp

- Group membership

### (b) Workflow Access Log

For each engagement:

- Which workflows accessed it

- Which actions they took

- Which CRM/data egress occurred

- "Why this workflow had permission" explanation

### (c) Data Egress Map

Shows where data traveled:

- CRM (HubSpot, Salesforce)

- Email

- Slack

- Webhooks

- Third-party integrations

### (d) Privacy Reasoning Log

Explains:

- What privacy rules applied

- Why a meeting is private/public

- Privacy Determination Agent decisions

---

## 5. UX Enhancements

### Required UX elements:

- Privacy badges

- Sharing/unsharing modal

- Data provenance viewer

- Workflow activity UI

- FGA group permissions panel

- Integration privacy overview

---

# Non-Functional Requirements

- Highly reliable — privacy failures must not occur.

- Explainable — every privacy decision must be justifiable.

- Consistent — identical logic across all surfaces.

- Secure — FGA must enforce boundaries correctly.

- Auditable — logs stored securely with long retention.

---

# Success Metrics

Posthog Dashboard

1. User Trust Metric (NPS-style trust rating)

1. Reduction in privacy-related support tickets

1. Zero instances of privacy-setting violations

1. Adoption of FGA groups

1. Usage of audit/logging tools

1. Admin satisfaction score for privacy management

---

NOTE:

We also need to consider visibility. Like Google calendar sometimes others are allowed to know that you had a meeting but not the title of the meeting.

---

## Linear Issues

<embed url="https://linear.app/askelephant/project/privacy-experience-90d3afe5f19b"/>
