---
notion_id: 2caf79b2-c8ac-80de-8f2a-c42cdef2e93e
notion_url: "https://www.notion.so/Import-Engine-2caf79b2c8ac80de8f2ac42cdef2e93e"
notion_last_edited_time: "2026-01-07T20:37:00.000Z"
sync_last_synced_at: "2026-01-15T02:24:38.716Z"
source: database
database_id: 2c0f79b2c8ac802c8b15c84a8fce3513
---

# Call Import Engine - PRD

## Overview

Build a standardized call import system that enables AskElephant customers to migrate historical calls from competitor platforms (Gong, Fathom, Grain) and ingest ongoing calls from phone dialers (RingCentral, Zoom Phone, Gong Engage). This initiative transforms ad-hoc engineering work into a productized, scalable solution with clear pricing, timelines, and self-service capabilities.

Strategic Alignment: Directly supports the product vision that "AskElephant value scales with data volume"—customers need their full call corpus to unlock AI coaching, CRM automation, and pipeline insights.

---

## Problem Statement

> "What we're trying to do is make some sort of clear process where a sales rep can confidently say yes or no when somebody asks if they can import existing data and have live calls from other platforms into our system."

### Current State Pain Points

1. Sales Friction: Reps cannot give confident yes/no answers to import questions

1. Engineering Burden: Each import requires 8-20 hours of custom developer work

1. No Pricing Clarity: Ad-hoc quotes range from $150 to $1,000+ with no consistent model

1. Timeline Uncertainty: Customers wait days/weeks with no visibility

1. Silent Failures: Integrations break without proactive detection

1. Inconsistent UX: RingCentral vs Zoom Phone have completely different setup flows

### Evidence from Customer Requests


---

## Target Personas

### Primary

- Sales Representative — Needs confident answers for prospects asking about imports; wants to close deals without engineering back-and-forth

- New Customer (Switching from Competitor) — Needs to bring historical data to get immediate value; doesn't want to "start from zero"

### Secondary

- Sales Leader — Faster onboarding reduces deal cycle; data continuity improves forecasting

- CSM — Smoother customer transitions; proactive visibility into import status

- RevOps — Reliable data ingestion; consistent processes across customers

---

## Success Metrics


---

## User Stories

### Epic 1: Sales Enablement (Platform Capability Visibility)

As a sales representative, I want to instantly know which platforms we can import from and at what price, So that I can give confident, immediate answers to prospects without engineering consultation.

### Acceptance Criteria

- [ ] Internal capability matrix shows all evaluated platforms with status (Supported / Partial / Not Supported)

- [ ] Pricing is documented per platform or per-call-count tier

- [ ] Timeline estimates are available (e.g., "Same day for <1000 calls, 1-3 days for >5000 calls")

- [ ] Customer requirements documented (API keys, OAuth, permissions needed)

---

### Epic 2: Self-Service Import (Onboarding Flow)

As a new customer coming from Gong/Fathom/other platform, I want to import my historical calls without waiting for engineering, So that I can start using AskElephant with my full data context immediately.

### Acceptance Criteria

- [ ] Onboarding flow asks: "Are you coming from another platform?"

- [ ] Platform selection shows supported sources with requirements

- [ ] Self-service credential entry (OAuth or API key) for supported platforms

- [ ] Import preview shows estimated call count and cost

- [ ] Progress visibility during import (status bar, call count, estimated completion)

- [ ] Clear pricing before checkout (first 1,000 free, then per-call)

- [ ] Email notification on import completion

---

### Epic 3: Dialer Integration (Ongoing Sync)

As a sales team using phone dialers (RingCentral, Zoom Phone), I want to have my phone calls automatically imported and transcribed, So that I get the same AI coaching and CRM sync for phone as I do for video calls.

### Acceptance Criteria

- [ ] OAuth connection flow for supported dialers

- [ ] Configurable sync frequency (near real-time, hourly, daily)

- [ ] Sync status dashboard showing last sync time and call count

- [ ] Error visibility when sync fails (with actionable remediation)

- [ ] Phone calls treated same as video calls in AskElephant workflows

---

### Epic 4: Import Health & Monitoring

As a CSM or RevOps user, I want to proactively see when imports are failing or stalled, So that I can address issues before customers complain.

### Acceptance Criteria

- [ ] Admin dashboard shows all active import connections

- [ ] Alerts on sync failures, credential expirations, or unusual patterns

- [ ] Historical import log with success/failure rates

- [ ] Self-service re-authentication when credentials expire

---

## Scope

### In Scope (MVP - Phase 1)

1. Platform Capability Matrix — Internal documentation for sales team

1. Pricing Model Definition — Per-call or tiered pricing approved by finance

1. Gong Import (Historical) — Highest-demand competitor platform

1. RingCentral Standardization — Fix existing inconsistent integration

1. Import Progress UI — Status bar and completion notification

1. Basic Admin Visibility — Import history and status

### In Scope (Phase 2)

1. Self-Service Onboarding Flow — Full customer-facing import wizard

1. Zoom Phone Standardization — Remove customer app creation requirement

1. Ongoing Sync for Dialers — Continuous import beyond one-time

1. Billing/Checkout Integration — Self-service payment for imports

1. Fathom/Grain Support — Additional competitor platforms

### Out of Scope

- Real-time streaming transcription for phone calls (future)

- Mobile app for import management

- White-label import for partners

- Platforms with no API access (manual upload only)

### Future Considerations

- Pipedream as integration abstraction layer

- Automated platform compatibility detection

- Customer-facing import analytics dashboard

- Bulk import discount pricing

- Self-serve portal

- 

---

## User Flow

### Flow 1: Onboarding Import (New Customer)

```plain text
1. Customer signs up for AskElephant
2. Onboarding wizard: "Are you coming from another platform?"
   → [Yes] → Platform selector
   → [No] → Continue to main onboarding
3. Select source platform (Gong, Fathom, RingCentral, etc.)
4. View requirements: "You'll need: Gong API Key (Admin access)"
5. Enter credentials / Complete OAuth
6. Preview: "Found 1,247 calls. First 1,000 free, $0.10/call after = $24.70"
7. Confirm import
8. Progress screen: Status bar, estimated completion, call count ticking up
9. Completion: "Import complete! 1,247 calls ready to analyze."
10. CTA: "View your calls" → Main app experience

```

### Flow 2: Dialer Setup (Ongoing Sync)

```plain text
1. Settings → Integrations → Phone/Dialer
2. Select dialer (RingCentral, Zoom Phone)
3. OAuth flow: "Connect your RingCentral account"
4. Configure sync: Frequency, date range for historical
5. Confirm connection
6. Dashboard shows: Last sync, calls imported, next sync time
7. Ongoing: Calls import automatically per configured schedule

```

### Flow 3: Sales Rep Answering Import Question

```plain text
1. Prospect: "Can you import our calls from [Platform]?"
2. Rep checks internal capability matrix (Notion/doc)
3. Matrix shows: Platform | Status | Requirements | Pricing | Timeline
4. Rep: "Yes, we support [Platform]. You'll need [requirements].
         Pricing is [X] and typically takes [Y time]."
5. If unsupported: "We don't currently support [Platform], but we're
                    evaluating it. I can flag this to our product team."

```

---

## Design

### Key Screens/States

1. Platform Selector — Grid of supported platforms with logos, status badges

1. Credential Entry — Platform-specific form (API key or OAuth button)

1. Import Preview — Call count, pricing breakdown, confirmation CTA

1. Import Progress — Status bar, live call count, estimated completion

1. Import Complete — Success state with CTA to view calls

1. Import Failed — Error state with clear remediation steps

1. Sync Dashboard — For ongoing dialer connections

### Wireframes/Mockups

TBD — Design phase to follow PRD approval

### Prototype

TBD — See prototypes/src/components/CallImport/ after design phase

---

## Technical Considerations

See Engineering Spec for detailed technical approach.

Key Highlights:

- Queue-based processing for large imports (Bull/Redis)

- Secure credential storage (encrypted at rest, short-lived tokens)

- Rate limit handling per source platform

- Transcript reuse vs re-transcription decision tree

- Pipedream evaluation for connection abstraction

---

## Dependencies


---

## Risks & Mitigations


---

## Timeline

### Milestones


---

## Open Questions

- [ ] [ ] Pricing model: Per-call ($0.10-0.15)? Tiered? Included in seat license above certain tier?

- [ ] [ ] First-N-free threshold: 1,000 calls? 500? Based on plan tier?

- [ ] [ ] Transcript reuse policy: When can we reuse source transcripts vs must re-transcribe?

- [ ] [ ] Platform priority order: Gong first, then RingCentral, then Zoom Phone?

- [ ] [ ] Self-service MVP scope: Full self-service or sales-assisted with better tooling?

- [ ] [ ] Pipedream evaluation: Has engineering assessed Pipedream for this?

- [ ] [ ] Ongoing sync pricing: Same per-call or included in subscription?

---

## Appendix

### Related Documents

- Research: Call Import Engine

- Engineering Spec

- Design Brief

- GTM Brief

- Notion: Call Import Abstraction

### Customer Quotes

> "Right now, when customers are onboarding, a lot of the conversation that we have with them is around transferring from one platform to another."

> "A developer writes a one-off script, uses it, and then it's not actually in the system."

> "This is just a treasure trove of data that we're missing out on just because we haven't had a process in place to manage it yet."

---

Last updated: 2026-01-07 Owner: Product Team
