---
notion_id: 2c0f79b2-c8ac-8166-921a-ee14de6a33ab
notion_url: "https://www.notion.so/Notification-Engine-2c0f79b2c8ac8166921aee14de6a33ab"
notion_last_edited_time: "2026-01-15T02:40:00.000Z"
sync_last_synced_at: "2026-01-15T02:40:36.389Z"
source: database
database_id: 2c0f79b2c8ac802c8b15c84a8fce3513
---

# PRD

## Purpose

As AskElephant becomes an active assistant rather than a passive recorder, we need a reliable, centralized way to deliver helpful, actionable notifications across every platform (web app, browser extension, desktop app, mobile app, etc.).

The Notification Engine will provide:

- A unified pipeline for notification creation, routing, and delivery

- A way for AE to offer actions, not just alerts

- Intelligent channel selection ("what's the best place to reach the user right now?")

- A foundation for future workflows that depend on real-time communication

This is a technical platform that unlocks multiple future features—recording assistance, follow-up automation, task confirmations, deal alerts, onboarding support, and more.

---

## Objectives

1. Centralize all notification logic across all products and services.

1. Enable interactive notifications where AE offers an action and a user can confirm it in one click.

1. Support multi-channel delivery:

1. Route notification to all platforms enabled by user

1. Ensure reliability and consistency across all platforms and network conditions.

1. Provide a unified developer API for publishing notifications with actions.

---

## Persona Outcomes

These outcomes describe why notifications matter, not what this project directly delivers.

### AARON — ACCOUNT EXECUTIVE (AE)

1. As an AE, I want AskElephant to notify me when something important happens and immediately offer helpful actions because I'm often in back-to-back calls, but I fear missing something critical when moving fast.

1. As an AE, I want notifications to find me on the device I'm actively using because I move between desktop, browser, and mobile all day, but I fear being spammed on multiple devices at once.

---

### CELINE — CUSTOMER SUCCESS MANAGER

1. As a CSM, I want AE to notify me about customer risk signals with a one-click action (e.g., reach out or create follow-up) because timing matters, but I fear irrelevant alerts creating noise.

1. As a CSM, I want notifications to behave consistently across the apps I use because I'm often traveling or working from different devices, but I fear inconsistent behavior breaking trust.

---

### IRINA — IMPLEMENTATION SPECIALIST

1. As an Implementation Specialist, I want notifications about onboarding blockers with actionable next steps because customers expect rapid responses, but I fear missing important updates while in meetings.

---

### ROGER — SALES MANAGER / VP SALES

1. As a Sales Leader, I want actionable notifications about rep activity or deal health because timing can prevent deals slipping, but I fear overwhelming my team with alerts that don't matter.

---

### ODIS — REVOPS / DATA STEWARD

1. As a RevOps Manager, I want a predictable, controlled notification pipeline because reliability builds trust, but I fear inconsistent delivery that confuses users and creates ticket volume.

---

## High-Level Solution

The Notification Engine will be a centralized service that:

1. Receives notification events from any service

1. Routes to all platforms the user has enabled.

1. Delivers notifications with interactive actions, via a consistent protocol.

1. Tracks notification state, retries delivery, handles fallbacks, and ensures continuity across devices.

This system must feel like:

> "AE is offering to help you, right now, in the way you prefer."

Not an alert system.

A contextual assistant interaction system.

---

# Functional Requirements

## 1. Notification Model

Notifications must support:

- Title

- Message (human-readable, assistant voice)

- Context (call, meeting, deal, customer, ticket, etc.)

- One or more actions where applicable (e.g., "Record instead on desktop app")

- Routing preferences

- Priority level

- Delivery state (sent, delivered, acted on, dismissed, expired)

---

## 2. Multi-Platform Delivery

Notifications must be deliverable to:

- Browser

- Web app

- Desktop application

- Mobile app

All platforms must support:

- Interactive actions

- Dismissing/confirming notifications

- A consistent visual & behavioral pattern

---

## 3. Interactive Actions

Every actionable notification must support:

- One-click confirmation

- Optional secondary actions (e.g., "No, not right now")

- Ability to execute backend functions immediately

- Ability to call the local app (desktop/browser/mobile) to trigger device-level capabilities (e.g., record screen)

Example:

> "The bot can't join the meeting. Should I start local recording on your desktop?"

> 

> - Record now

> - Ignore

Notifications must be able to complete workflows without requiring deep navigation into the product.

---

## 4. Notification Lifecycle & State

The engine must track:

- Created

- Sent

- Delivered (device confirmed receipt)

- Viewed

- Acted on

- Dismissed

- Expired

---

# Success Metrics

Posthog Dashboard

1. Delivery Success Rate

1. Action Completion Rate

1. Latency

1. Cross-Device Continuity Reliability

### Metrics to Add Post-Implementation


---

## Linear Issues

<embed url="https://linear.app/askelephant/project/notification-engine-f722df86bf9b"/>
