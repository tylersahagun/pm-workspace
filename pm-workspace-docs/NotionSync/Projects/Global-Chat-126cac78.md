---
notion_id: 2c0f79b2-c8ac-8199-8b42-c3e9126cac78
notion_url: "https://www.notion.so/Global-Chat-2c0f79b2c8ac81998b42c3e9126cac78"
notion_last_edited_time: "2026-01-05T17:26:00.000Z"
sync_last_synced_at: "2026-01-15T02:24:26.386Z"
source: database
database_id: 2c0f79b2c8ac802c8b15c84a8fce3513
---

## Purpose

Internal Search proved that users want to ask questions about any context in AskElephant, even data not explicitly present in their chat session. However, Internal Search had a major usability limitation: it had to be toggled on manually before asking a question. If a user forgot to toggle it, the answer lacked the necessary context.

The Global Chat project resolves that limitation and expands the concept.

Global Chat is a universal, context-aware assistant surface accessible from anywhere in the app, always available, always able to pull in relevant internal data, and always ready to answer questions using Internal Search automatically. The goal is to centralize user interactions with AE into a single, polished, consistent interface.

This project replaces fragmented "on-page chats" with a cohesive global experience, activated instantly via keyboard shortcut, persistent UI, and deeper context-awareness.

---

## Objectives

1. Make Internal Search always-on by default — no toggles, no setup, no friction.

1. Utilize the global context-aware chat sidebar accessible anywhere via cmd + K.

1. Ensure the sidebar automatically includes page context (records, customers, meetings, tickets, deals, onboarding tasks, etc.).

1. Polish and unify the UI/UX so the Global Chat becomes the primary conversational interface across the platform.

1. Reduce reliance on on-page chat widgets, shifting user behavior toward the global assistant.

1. Improve continuity — users can start a conversation on one page, navigate elsewhere, and keep the same thread with updated context.

1. Ensure the internal search engine and global chat together feel like:

---

## Persona Outcomes (Context Only)

These outcomes are served by Global Chat, but not all will be fully delivered by this project alone.

---

### AARON — AE

1. As an AE, I want to ask AskE questions from anywhere without hunting for the right chat widget because I'm constantly switching between deals, calls, and tasks, but I fear losing time or context.

1. As an AE, I need AskE to automatically understand the page I'm on (deal, prospect, or call) because I don't want to manually provide context, but I fear AE will give me generic answers instead of specific guidance.

---

### CELINE — CSM

1. As a CSM, I need instant access to customer history or risk signals from any screen because switching tools breaks my workflow, but I fear missing crucial context if I have to start a new chat each time.

1. As a CSM, I want to use AE as my "command center" across accounts because multitasking is constant, but I fear fragmented experiences where AskE behaves differently depending on the page.

---

### IRINA — IMPLEMENTATION SPECIALIST

1. As an Implementation Specialist, I want to ask AskE about onboarding tasks, blockers, or customer metadata without navigating between pages because onboarding is context-heavy, but I fear losing track of customer details.

---

### ROGER — SALES LEADER

1. As a Sales Leader, I want a single place where I can query deals, rep activity, and performance across the entire workspace because context switching kills my efficiency, but I fear inconsistent surfaces creating confusion.

---

## High-Level Solution

Global Chat is a universal chat surface — consistent, persistent, fast, and context-aware — that replaces scattered chat widgets and manually toggled search tools.

It includes:

### 1. Always-On Internal Search

- Automatically available for every message.

- Automatically runs queries against full workspace data when needed.

- No toggling required.

### 2. Context-Aware Sidebar

- Accessible via cmd + K

- Persistent and lightweight

- Knows which page the user is on and pulls relevant context:

- AI uses this information to answer more precisely.

### 3. Shared Threads Across Pages

- Threads persist as the user navigates.

- Context dynamically updates as the user moves around.

### 4. Polished UI/UX

- Beautiful, clean, responsive chat UI.

- Clear indicators for:

- Quick actions, slash commands, and keyboard-first flows

### 5. Primary User Entry Point

- Replace on-page chat widgets (gradually)

- Encourage users to treat Global Chat as the main AE interface

---

# Functional Requirements

## 1. Global Chat Activation

- Shortcuts:

- Appears on every screen (universal)

---

## 2. Context Awareness

Global Chat must automatically detect context such as:

- Current page (deal, meeting, customer, pipeline, ticket)

- Selected objects

- Open engagement details

- Highlighted elements or selected rows (stretch)

- User's role (AE, CSM, implementation, admin)

- User's recent actions (stretch)

This context is passed to Internal Search automatically.

---

## 3. Always-On Internal Search Engine

Internal Search should:

- Trigger automatically for every message requiring non-local context

- Support disambiguation prompts: (stretch)

- Resolve references implicitly: (stretch)

No toggle needed.

---

## 4. Chat Threading

- Users can start threads inside Global Chat

- Threads persist across navigation

- Users can pin, rename, or delete threads (stretch)

- Threads inherit updated page context as the user moves

---

## 6. Integration with On-Page Elements

- On-page chat widgets should be deprecated or replaced with inline prompts that open Global Chat

- Existing interactions that used on-page chat should route through Global Chat

---

## 8. Error Handling

- If context can't be determined → Ask followup questions

- If Internal Search fails → show human-readable error + retry

- No silent failures

- Must log errors for debugging

---

# Success Metrics

Posthog Dashboard

1. Global Chat Adoption Rate

1. Time to First Response

1. Context Resolution Accuracy

1. Reduction in "Internal Search didn't run" support tickets

1. Return Usage

1. User Feedback

1. Stakeholder signoff

Notion Design Doc

Figma Designs

---

## Linear Issues

<embed url="https://linear.app/askelephant/project/global-chat-45b141b480bc"/>
