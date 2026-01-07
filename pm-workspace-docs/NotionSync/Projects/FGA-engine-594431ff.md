---
notion_id: 2c5f79b2-c8ac-807a-8a11-d430594431ff
notion_url: "https://www.notion.so/FGA-engine-2c5f79b2c8ac807a8a11d430594431ff"
notion_last_edited_time: "2026-01-05T17:26:00.000Z"
sync_last_synced_at: "2026-01-15T02:24:29.177Z"
source: database
database_id: 2c0f79b2c8ac802c8b15c84a8fce3513
---

# PRD — Fine-Grained Access Control (FGA) Platform

Project: Access Control System Modernization

Author: Product (AskElephant)

Date: 2025

Version: v0.1.0

Status: Draft for Engineering Review

---

# 1. Overview

As AskElephant moves up-market and begins serving enterprise clients with strict data governance and privacy requirements — including Xerox, our immediate prospect — our existing permissions model is no longer sufficient.

Authorization logic is currently scattered, inconsistent, and not configurable per tenant.

This project introduces a unified, extensible Fine-Grained Authorization (FGA) system modeled after industry standards (Google Zanzibar-style relational authorization), but tailored to AskElephant’s domain-specific trust boundary: meeting participation = default audience boundary.

This PRD captures the minimum deliverable required for Xerox while ensuring the platform scales to future enterprise clients with increasingly complex access control needs.

This PRD reflects the strategic role of AskElephant as a RevOS (Revenue Operating System) with strict privacy compliance needs .

---

# 2. Problem Statement

## 2.1 Current State

Authorization logic is:

- Distributed across ~50 files

- Inconsistent across features

- Hardcoded rules that require code changes per customer

- Risky: difficult to audit, easy to miss an edge case

- Not aligned with enterprise access control expectations (auditability, configurability, tenant isolation)

## 2.2 Why This Matters Now

Enterprise customers (e.g., Xerox) require:

- Granular privacy controls

- Clear auditability of “who accessed what”

- Configurable rules tailored to their internal policies

- Guarantees around tenant isolation

- Explicit enforcement of meeting-attendee trust boundaries

Without this capability, we cannot support deals in regulated environments or large enterprises.

---

# 3. Goals & Non-Goals

## 3.1 Goals

1. Unify all access control into a single entry point (userCan()).

1. Build an extensible authorization engine capable of handling complex rules without rewriting code.

1. Meet Xerox’s minimum access control requirements, including:

1. Introduce a tenant-configurable authorization layer, backed by DB-stored policies.

1. Eliminate scattered permission logic and centralize auditability.

1. Zero regression guarantee: behavior must match current system during transition.

## 3.2 Non-Goals (for this project)

- Full self-service UI for advanced FGA modeling (Phase 3+).

- Cross-tenant policy inheritance.

- On-premise delivery or external policy evaluation API.

- Multi-region policy replication.

---

# 4. Users & Personas (Why This Matters)

### 4.1. Enterprise Admin / IT Security

As an Enterprise Admin, I want enforceable, audit-ready access boundaries based on meeting attendance because our governance policies require strict control over who can see sensitive customer interactions, but I fear hidden exceptions or inconsistent enforcement.

---

### 4.2. RevOps / Data Steward

As a RevOps Manager, I want configurable, rule-based access controls that adapt to each team’s workflow because different roles require different visibility patterns, but I fear brittle hardcoded permissions that create maintenance risks or accidental data exposure.

---

### 4.3. Revenue Leadership (Sales & CS Leaders)

As a Revenue Leader, I want my teams to have the right level of visibility into conversations and customer history because coaching and customer outcomes depend on reliable access, but I fear over-permissioning that compromises privacy or under-permissioning that blocks productivity.

I want to be able to share my calls with my team without the effort of adding them to the call

I want to be able to configure user groups that share our conversations

As a sales manager when I make a new hire I want them to be able to see my teams calls without having to retroactively add them
I want to be able to share my meetings with teams I am not a part of

The system must support the workflows of these roles without leaking sensitive data.

---

# 5. Requirements

# 5.1 Functional Requirements

## FR1 — Unified Authorization Entry Point

All permission checks must route through:

```plain text
userCan(user, action, resource)


```

### Acceptance Criteria

- Replaces or wraps all existing permission checks.

- Emits structured logs for audit purposes (allow/deny, rule path).

- Can be applied to paginated queries

- Returns deterministic results.

---

## FR2 — Tiered Decision Model

Authorization decisions follow a layered evaluation:

### Tier 1 — Workspace Isolation (Global Rules)

- Users may only access resources within their tenant.

- SuperAdmin can bypass for support purposes (logged & auditable).

### Tier 2 — Role Defaults

Support built-in roles:

- Workspace Owner

- Manager

- User

Each role has default capabilities (view/edit/manage).

### Tier 3 — Custom Policy Rules (Tenant-Level)

Tenant-specific overrides stored in DB:

- Grant: “Managers can view their team’s meetings.”

- Restrict: “Only meeting attendees may view recordings.”

- Conditional: “CSMs can view account interactions but not internal exec notes.”

### Acceptance Criteria

- All tiers independently testable

- Policy evaluation must short-circuit on definitive ALLOW/DENY

- Defaults remain backward-compatible with existing behavior

---

## FR3 — Audience Boundary Enforcement (Critical for Xerox)

Default rule:

> Only meeting attendees may access meeting content (recordings, notes, transcripts) unless explicit permission expands the audience.

Applies to:

- recordings

- transcripts

- summaries

- AI-generated insights

- related engagement objects

### Acceptance Criteria

- Cannot leak data to non-attendees

- Manager visibility can be toggled via tenant configuration

- Expansion requires explicit grant stored in DB

---

## FR4 — Policy Configuration Storage

Policies must be stored in a structured, queryable DB model:

Objects:

- subject (user, role, group)

- resource (recording, meeting, workspace, account, etc.)

- relation (viewer, editor, manager, attendee, etc.)

- conditions (time-bounded, resource-type specific, org hierarchy relationships)

Acceptance Criteria

- Must support hierarchical relationships (team structures)

- Must allow resource grouping

- Supports versioning for auditing

- Must be performant for enterprise-scale environments

---

## FR5 — Admin Configuration UI (Minimum Viable)

For this phase:

- Simple UI listing policies for a tenant

- Ability to add/edit/delete:

### Acceptance Criteria

- Non-engineers must be able to adjust Xerox's required policies

- All changes logged and auditable

---

## FR6 — Audit Logging

Must capture:

- who attempted access

- resource

- action

- policy rule path

- outcome (allow/deny)

- timestamp

- reason code

Required for compliance conversations with enterprise security teams.

---

## FR7 — Backward Compatibility (“No Regression”)

All existing flows must behave identically until explicitly migrated:

- use parallel-run mode

- cross-compare old vs new system decisions

- deny by default if conflict

---

# 5.2 Non-Functional Requirements

### NFR1 — Performance

Authorization requests must resolve in < 20 ms in >95% of cases.

### NFR2 — Scalability

Support thousands of policy evaluations per user per hour for large customers.

### NFR3 — Security

- Zero cross-tenant leakage

- SuperAdmin actions must be explicitly logged

- Policies must be immutable except via validated UI/API

### NFR4 — Reliability

- Fully testable without production data

- Deterministic rule evaluation

---

# 6. Scope

## In Scope

- New unified FGA system

- Xerox-required access rules

- DB-backed policy engine

- Basic tenant admin UI

- Migration plan

- Logging & auditing

## Out of Scope

- Full abstraction of group management (beyond what's required for Xerox)

- Natural language policy creation

- Advanced “policy playground” simulation tooling

---

# 7. Success Metrics


---

# 8. Detailed Milestones & Timeline

## Phase 1 (Weeks 1–2) — Foundation

- Resource and relationship modeling

- Build unified entry point (userCan())

- Wrap existing permission calls

- Introduce audit logging skeleton

Deliverables:

- Queryable graph of users, roles, resources

- Parallel-run capability

---

## Phase 2 (Weeks 3–4) — Core Privacy Controls

- Meeting-attendee enforcement

- Role-based defaults

- Tenant-level config model

- Xerox base policies

Deliverables:

- Enterprise-compliant privacy behavior

- Internal testing with Xerox use cases

---

## Phase 3 (Weeks 5–6) — Granular Policies + Admin UI

- Full DB-backed policy engine

- Admin UI for grants/restrictions

- Resource hierarchy support (accounts → meetings)

- Validation + regression suite

Deliverables:

- Tenant-configurable system

- Ready for Xerox deployment

- Security sign-off

---

# 9. Risks & Mitigations


---

# 10. Open Questions (PM → Engineering → Security)

1. Should we adopt a Zanzibar-like tuple store or a relational model with indexes?

1. Do we support time-based conditional access (e.g., access expires after 30 days)?

1. Should superadmin access be allowed for debugging Xerox tenants? (Requires strict logging.)

1. Should we include “justification logging” for each access (why rule triggered)?

1. How deeply do we support hierarchical teams for Xerox Phase 1?

---
