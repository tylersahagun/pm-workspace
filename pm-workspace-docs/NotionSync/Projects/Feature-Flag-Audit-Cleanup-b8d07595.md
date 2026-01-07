---
notion_id: 2e7f79b2-c8ac-81a4-bd34-c955b8d07595
notion_url: "https://www.notion.so/Feature-Flag-Audit-Cleanup-2e7f79b2c8ac81a4bd34c955b8d07595"
notion_last_edited_time: "2026-01-13T15:37:00.000Z"
sync_last_synced_at: "2026-01-15T02:24:53.420Z"
source: database
database_id: 2c0f79b2c8ac802c8b15c84a8fce3513
---

Total Flags: 116

Source: PostHog Production

---

## Executive Summary


### Key Risk Areas

- 22 features are only visible to internal users

- 32 features are in limited beta - creating experience fragmentation

- 20 features are completely disabled but still in codebase

- 23 distinct customer experiences exist due to flag combinations

---

## 🎯 Unique Customer Experience Groups

We identified 23 distinct product experiences based on feature flag targeting:

### Experience Distribution


### Most Feature-Rich External Customers

1. Redo - 49 features (baseline + 7)

1. Tilt - 46 features (baseline + 4)

1. Agility Ads, Cinch, ELB Learning, Boostly - 45 features each

---

## 🕰️ Stale Feature Flags

### Critical - Remove (11 flags)

These flags are dead code and should be removed:


Estimated dead code: ~5,500 lines

### Warning - Decision Required (14 flags)


### Ready to Graduate (8 flags)

These are 100% GA - remove flag wrapper, keep feature:

- calendar-widget

- new-meeting-page

- scorecard-component

- crm-field-updates

- salesforce-v2-beta

- hubspot-mcp

- deepgram-transcription-model

- deepgram-auto-detect-language

---

## 📊 Integration Parity Gap


---

## ✅ Recommendations

### GA Candidates (Roll to 100%)

- global-chat-enabled - Core feature, 10% beta

- extractions-table - 20% beta, seems stable

- chat-tool-internal-search - 15% beta, high value

- gmail-enabled - 5% beta, competitive parity

### Deprecation Candidates

- workflows-v3 - Inactive, unclear purpose

- action-items-page - Inactive

- meeting-actions - Inactive

- be-fine-tuning-page-refresh - Inactive

### Cleanup Opportunities

- Remove 8 GA flag wrappers

- Delete 11 dead code flags

- Estimated LOC reduction: 10,000+ lines

---

## 📁 Related Documents

- Full audit report: pm-workspace-docs/research/feature-flag-audit-2026-01-13.md

- Communication plan: pm-workspace-docs/research/feature-parity-communication-plan.md

---

Generated from PostHog Production API - January 13, 2026
