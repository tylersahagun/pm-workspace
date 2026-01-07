---
notion_id: 2e7f79b2-c8ac-81ab-93a6-fd16f98a4714
notion_url: "https://www.notion.so/Call-Import-Engine-Design-Brief-2e7f79b2c8ac81ab93a6fd16f98a4714"
notion_last_edited_time: "2026-01-13T04:45:00.000Z"
sync_last_synced_at: "2026-01-15T02:25:07.009Z"
source: database
database_id: 70fd3050f9ce473a99767e2933b684cc
---

# Design Brief: Call Import Engine

## Overview

Scope: v1 has no customer-facing UI. This is a backend architecture + internal process project. Design work is limited to internal tools, documentation, and future-state exploration.

Why no UI in v1: The immediate goal is making imports support-manageable, not self-service. A customer-facing portal is explicitly deferred to v2.

---

## Internal Process Flow

### Import Request Journey

```javascript
Customer mentions import need (Sales/Onboarding call)
  ↓
Sales/CS checks Platform Support Matrix (internal doc)
  ↓
CS confirms: Supported / Not Supported / Manual Upload Only
  ↓
If supported: CS collects credentials/export from customer
  ↓
CS submits import request (Slack? Form? TBD)
  ↓
Import queued and processed (night batch)
  ↓
CS receives completion notification
  ↓
CS confirms with customer, explains capabilities
```

### Key Decision Points

1. Platform check: Yes/No/Maybe based on matrix

1. Credential collection: API key vs. file export

1. Timeline setting: Based on volume + platform rate limits

1. Capability messaging: What imported calls can/can't do

---

## Internal Tools Needed (v1)

### 1. Platform Support Matrix

Format: Internal doc or Notion database


### 2. Import Request Form (Simple)

Fields needed:

- Customer name

- Platform

- Estimated call count

- Credentials/access (secure field)

- Urgency (onboarding, deal, retention)

- Requested completion date

### 3. Status Dashboard (Future)

For v1, status updates via Slack notifications. Future: internal dashboard showing active imports, progress, failures.

---

## Key Screens/States (Future v2 - Customer Self-Service)

> Note: These are NOT in v1 scope. Documented here for architecture consideration.

### Import Setup Screen

- Platform selector (supported platforms only)

- OAuth flow or credential input

- Volume estimate

- Timeline preview

- Pricing display (if applicable)

### Import Progress Screen

- Progress bar / call count

- Estimated completion

- Error summary (if any)

- "View imported calls" CTA

### Imported Calls Indicator

- Badge or icon on imported calls in meeting list

- Tooltip: "Imported from [Platform] on [Date]"

---

## Interaction Patterns

### For Internal Users (CS/Support)

- Matrix lookup for quick yes/no

- Form submission for request

- Slack notifications for updates

- Manual intervention for errors

### For Customers (v1)

- Verbal/email communication only

- No in-product visibility of import status

- Post-import: calls appear in meeting list like any other

---

## Edge Cases

### Error States


### Empty States


### Loading States

- For batch jobs, loading is irrelevant (async)

- CS receives notification on completion

---

## Accessibility Considerations

N/A for v1 (no customer-facing UI).

Future: Any self-service portal must meet WCAG 2.1 AA standards.

---

## Design References

### Similar Patterns in Product

- HubSpot integration setup flow (OAuth + config)

- Zapier webhook configuration

### Competitor/Industry Patterns

- Gong data export (ironically what we're importing from)

- Salesforce Data Import Wizard

- Migration assistants in Notion, Asana, etc.

---

## Future Design Explorations

When we move to v2 (self-service), explore:

1. AI-first import setup: "I want to import 5,000 calls from Gong" → guided flow

1. Real-time progress: WebSocket updates during import

1. Smart timeline: Based on volume + rate limits, show expected completion

1. Failure recovery: "3 calls failed - retry?" vs. silent logging

---

## Notes for Engineering

- No frontend work required in v1

- Consider API design for future self-service (statuses, progress, callbacks)

- Admin endpoints for CS to trigger/monitor imports would help transition to v2
