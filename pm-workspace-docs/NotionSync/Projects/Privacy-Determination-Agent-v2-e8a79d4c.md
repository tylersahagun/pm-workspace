---
notion_id: 2c0f79b2-c8ac-8193-8868-ce8ce8a79d4c
notion_url: "https://www.notion.so/Privacy-Determination-Agent-v2-2c0f79b2c8ac81938868ce8ce8a79d4c"
notion_last_edited_time: "2026-01-13T20:21:00.000Z"
sync_last_synced_at: "2026-01-15T02:24:25.512Z"
source: database
database_id: 2c0f79b2c8ac802c8b15c84a8fce3513
---

PRD: Privacy Determination - Management & Simulation UI (v1)





# PRD: Privacy Determination - Management & Simulation UI (v2)

## Purpose

Users lack confidence in "black box" AI rules. This scope defines the Privacy Management Hub, a user interface allowing users to configure rules with high granularity (specifically using "Unless" logic), handle exceptions, and simulate agent behavior against historical calls. This ensures users can visualize exactly why a meeting would be marked private before trusting the system.

## Objectives

1. Guided Rule Creation: Direct users through a "Describe -> Enhance -> Review" flow, with options for advanced users to skip directly to editing.

1. Context-Aware Simulation: Allow users to test rules against specific past calls, and if the result is wrong, edit the rule with the context of that specific call injected into the prompt.

1. Preserve Rules (Inactive vs. Delete): Aggressively guide users toward "Deactivating" rules rather than deleting them to prevent data loss.

1. Visual Logic Separation: Use UI patterns (Emerald Green text) to visually distinguish positive constraints ("Mark private if...") from negative exceptions ("Unless...").

1. Transparent Reasoning: Provide high-level context for decisions with the ability to drill down into the "Full Reason."

## Functional Requirements

### 1. Rule Management Dashboard

- Rule List: Displays all Workspace (or Personal) rules.

- Default Rules:

- Delete vs. Deactivate Interception:

- Inactive State: Rules can be toggled to "Inactive" directly from the list or the edit modal.

### 2. Rule Creation & Logic (The "Enhancer")

- Step 1: Description:

- Step 2: Enhancement & Review:

- Step 3: Structure & Exceptions:

### 3. Privacy Simulation (The Hub)

- Entry Point: Labeled "Privacy simulation" with subtext "Test your current privacy rules on any of your last calls."

- Search: Users can search for specific historical events to test against.

- Simulation Execution:

- Reasoning Display:

### 4. Context-Aware Iteration (The "Fix It" Loop)

This is the most critical workflow for refining accuracy.

- Edit from Simulation:

- Post-Edit State:

## UX/UI Copy & Constraints

- Disclaimers:

- Hierarchy:

- Review Mode vs. Edit Mode:
