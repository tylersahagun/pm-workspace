---
notion_id: 2c0f79b2-c8ac-8130-8c5b-cd3d92f395ee
notion_url: "https://www.notion.so/Capture-Visibility-2c0f79b2c8ac81308c5bcd3d92f395ee"
notion_last_edited_time: "2026-01-05T16:18:00.000Z"
sync_last_synced_at: "2026-01-15T02:24:23.096Z"
source: database
database_id: 2c0f79b2c8ac802c8b15c84a8fce3513
---

---



## 
Purpose

AskElephant's capture system is evolving beyond a simple "bot joins a meeting" model. Users increasingly rely on multiple capture methods (bot, desktop app, browser extension, mobile capture), each with its own lifecycle and failure states. The current experience offers minimal visibility into what is happening before, during, and after an engagement, leaving users confused when something goes wrong — or uncertain when things silently work.

Capture Visibility creates a unified, reliable, centralized understanding of capture state across all platforms. It establishes the state machine architecture that will later power rich fallback and multi-platform capture experiences. For now, the focus is:

- Deep visibility

- State comprehension

- Classification of success, failure, and rescuable states

- Clear user transparency

- No fallback actions yet — only state and visibility

This project equips us with the knowledge and infrastructure needed to drive future experiences where users fluidly switch capture methods or are guided through rescue flows — but those experiences themselves are not in scope.

---

## Objectives

1. Establish a universal, extensible capture state machine that represents every step, failure, rescue opportunity, and fallback possibility in the capture lifecycle.

1. Provide user-facing visibility into:

1. Track all transitions and outcomes to support trust and explainability.

1. Integrate with Notification Engine (without sending notifications) by (stretch):

1. Support future multi-platform capture (desktop, mobile, web) without committing to implementation now.

1. Detect and classify states where two capture methods run simultaneously and store the state cleanly (stretch).

1. Enable a detailed, inspectable debug/audit view for both users and support staff (If design wants this).

1. Lay the foundation for dynamic fallback experiences in the next project: Fallback Capture Experience.

---

## Persona Outcomes (Context, not scope)

These outcomes are enabled by Capture Visibility, but not directly delivered by this phase.

---

### AARON — AE

1. As an AE, I want to understand whether my meeting was captured successfully because I can't afford missing key conversations, but I fear not knowing what happened when things fail silently.

1. As an AE, I want clarity on why the bot didn't join or recording didn't start because I move fast, but I fear being blindsided after the fact without explanation.

---

### ROGER — SALES LEADER

1. As a Sales Leader, I want to trust that our reps' calls were captured or understand precisely why they weren't, because this affects coaching and revenue operations, but I fear incomplete data.

---

## High-Level Solution

Capture Visibility introduces a robust, extensible state machine representing everything that can happen during capture, including:

NOTE: These are just example states and not meant to exhaustively represent all states.

### Success States

- Bot joined → recording active

- Desktop/web/mobile recording active

- Capture completed → transcript generated

### Mid-Process / Transitional States

- Bot invited → waiting for host

- Bot blocked → awaiting permission

- Bot retrying join

- Capture initializing

- App recording pending

- Cross-platform handoff scenarios (future-proofed)

### Rescuable Failure States

- Bot stuck in waiting room → alternate capture possible

- Bot join failed after N retries

- Platform permissions denied

- Meeting locked

- Host absent

- Removing duplicate capture if two methods are active

- Transcript generation delayed

### Un-Rescuable Failure States

- Meeting ended too quickly

- No audio to capture

- Platform incompatible / unsupported

- Recording blocked by host or platform

- Hard errors or system outages

The state machine will:

- Track transitions in real time

- Persist final state for every engagement

- Allow clients (apps) to query the current/previous states

- Support a detailed audit log

- Record all reasons, transitions, and timestamps

- Allow future features to plug in fallback triggers

This project does NOT implement fallback behavior — only states, visibility, and tracking.

---

# Functional Requirements

## 1. State Machine Architecture

### Requirements:

- A single canonical state machine for all capture types:

- States must be:

- State transitions must be:

### Transition rules:

- Must avoid contradictory states (e.g., bot is both "failed" and "recording").

- Must support multi-source capture (e.g., bot + desktop simultaneously).

- Must support idle → pending → active → final flows.

---

## 2. Deep Capture Visibility

This is the user-visible part of the project.

Visibility includes:

- A timeline of state transitions

- A reason summary ("Recorder was blocked in the waiting room")

- A clear final outcome badge ("Captured successfully", "Failed", "Partial capture")

---

## 3. Notification Engine Integration (Passive)

Global notifications are not required to be sent in this project, but Capture Visibility must:

- Record notification eligibility

- Track whether similar notifications were already sent

- Prevent future duplication during fallback flows

- Provide hooks for the Notification Engine to subscribe to state changes

Examples:

- Capture Visibility records: "Bot stuck in waiting room → rescue possible"

- Fallback Capture Experience will later decide whether to notify.

---

## 4. Multi-Platform Future-Proofing

The state machine must anticipate:

- Desktop recording start/stop

- Web recording permissions

- Mobile recording

- Dual-capture collisions

- Mid-meeting fallback attempts

- Capture restarts

- Cross-device continuity

None of these are implemented yet — only modeled.

---

## 5. Capture Timeline & Audit Logs

For each engagement:

- State transitions

- Time deltas

- Notifications considered (but not sent)

- Error objects

- Capture method(s) used

- Final classification

---

# Non-Functional Requirements

- High reliability — no missing or corrupt state data.

- Realtime — state updates should be pushed to UI when state transitions.

- Consistent across platforms — state must reflect reality no matter where capture originates.

- Highly traceable — debugging capture issues must be straightforward.

- Stable foundation for future fallback logic.

---

# Non-Goals

- Implementing fallback capture transitions

- Triggering user notifications

- Switching capture methods mid-meeting

- Starting/stopping recordings

- Multi-device interactions

- Automatic recovery attempts

These belong to the Fallback Capture Experience project.

---

# Success Metrics

Posthog Dashboard

1. State accuracy

1. State completeness

1. User comprehension

1. Foundation stability

1. Support team efficiency

1. Future compatibility

---

## Linear Issues

<embed url="https://linear.app/askelephant/project/capture-visibility-00a6bc61fd60"/>
