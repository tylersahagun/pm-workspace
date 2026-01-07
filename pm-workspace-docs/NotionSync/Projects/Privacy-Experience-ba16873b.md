---
notion_id: 2ccf79b2-c8ac-80a6-83ab-de58ba16873b
notion_url: "https://www.notion.so/Privacy-Experience-2ccf79b2c8ac80a683abde58ba16873b"
notion_last_edited_time: "2025-12-18T18:41:00.000Z"
sync_last_synced_at: "2026-01-15T02:24:39.463Z"
source: database
database_id: 2c0f79b2c8ac802c8b15c84a8fce3513
---

### Supporting Documents

---


## Summary

- What: A unified Privacy Experience (excluding the FGA authorization engine) that gives admins and end users clear visibility into what enters AskElephant, what leaves it, who can see it, and what workflows/automations ran (or were blocked) because of privacy.

- For whom: Workspace owners/admins/security leads, plus end users who need to confidently share/withhold meeting artifacts.

- Why now: We have privacy primitives (Public/Private, privacy agent, workflow privacy checks) but the experience is fragmented—users can’t reliably answer “what left the system?” or “what ran on this meeting?” without deep digging.

- Expected impact: Higher trust in AskElephant, better data completeness, more reliable automation, and actionable notifications—which together unlock enterprise adoption, retention, and expansion.

## Problem statement

AskElephant processes sensitive meetings and then triggers downstream behaviors (share links, post-meeting recap emails, workflows/integrations). Today, privacy state exists (Public/Private + a privacy determination agent) but customers lack end-to-end transparency:

- What data was ingested (recording, transcript, participants)?

- What privacy decision was made and why (manual vs agent vs settings)?

- What automations ran, what they sent externally, and which ones were blocked due to privacy?

- Who had access (from a UX “explainability” perspective; authorization enforcement is handled separately by the FGA engine project)?

## Goals

- End-to-end visibility: For an engagement, show a single, understandable timeline of ingest → processing → workflow runs → egress (emails, share links, integrations).

- Egress clarity: Make it easy to see what left the system, to whom, and when; and to disable risky egress for private content.

- Workflow transparency: Show which workflows were eligible, which ran, which were blocked (and why), and what each step did at a privacy-relevant level.

- Actionable controls: Provide workspace + per-workflow controls to prevent external sharing when a meeting is private (and a clear “pending privacy review” state where timing is uncertain).

## Customer outcomes this enables (Trust / Data / Quality / Noti)

- Trust (“I trust AskElephant with my information”):

- Data (“AskElephant has all my meaningful data”):

- Quality (“I’m confident AE will work as expected”):

- Noti (“AE notifies me of important info and actions”):

## How this can be pitched (revenue)

- “AskElephant is the system of record for customer interactions—with enterprise-grade privacy visibility and egress controls.”

- “You’ll always know what’s being analyzed and what left the system (and why).”

- “Faster security review + fewer surprises + higher automation adoption = higher retention and expansion.”

## Non-goals

- Implementing the FGA engine (authorization rules + enforcement) described in FGA engine.

- Replacing the privacy agent’s classification model/policy beyond small UX/ops adjustments (e.g., confidence handling). This PRD focuses on experience + observability + governance.

- Full DLP for arbitrary files outside the current engagement/transcript-oriented model.

## Proposal (high level)

- Privacy Center (workspace-level): policy + reporting hub for privacy-related behavior (meeting visibility semantics, egress controls, workflow governance, audit exports).

- Engagement “Data & Privacy” panel: a per-meeting view that answers “what came in / what happened / what left / who can see it / why”.

- Privacy-aware egress: ensure privacy state (and “pending”) is respected by post-meeting emails, share links, and workflow actions that send externally.

- Workflow run audit augmentation: attach “privacy + egress” metadata to workflow runs and steps for explainability.

## Competitive patterns (trust-building UX)

Themes across Notion / Gong / Zoom / Slack / AI meeting assistants:

- Private by default + easy revoke: users always know where “private” content lives and can revert sharing quickly.

- Share dialog = “who can see what”: a single place that lists people/groups + permission levels and highlights inherited access.

- Transparent automation: if the system will send/notify/share automatically, the UX makes that explicit and easy to disable.

- Consent + presence cues: recording/transcription is clearly indicated; “you’re with external people” is bannered, not hidden.

- Request access flows: when something is private, others can still see that it exists (optional), and can request access from the owner/admin.

## Customer evidence (high signal)


Note: this draft is grounded in current repo behavior; add Linear evidence once we pull EPD feedback and non‑EPD bug/fix references.

## Risks / unknowns

- Definition of “egress”: what counts (emails, share links, integrations, exports, internal admins, API access)?

- Timing: privacy agent runs post-transcription; workflows may run earlier depending on trigger ordering.

- Policy tension: “default block” prevents leakage but can break legitimate customer workflows; need staged rollout and good UX.

## Timeline / milestones

- M0 (Audit-only): ship visibility surfaces + logging without enforcement (except obvious high-risk toggles).

- M1 (Egress controls): privacy-aware post-meeting email + share-link handling; workflow governance UI with clear defaults.

- M2 (Enforced governance): enforce privacy gating for egress-capable workflow steps; add admin reporting + export.

## Open questions

- What is the “north star” privacy UX surface name and navigation placement (Settings vs dedicated Privacy tab)?

- Which user roles should see privacy columns/logs by default (admin/manager/owner), and which require explicit enablement?

- What is the acceptable delay for “pending privacy review” before workflows can proceed?



### Audit Logs

- [ ] Workflow Runs

- [ ] Adding information

- [ ] When is the recording starting

- [ ] When is the recording ending

- [ ] auto-detect when a meeting is or is

- [ ]
