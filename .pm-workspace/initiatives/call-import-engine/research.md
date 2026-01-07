# Research: Call Import Engine

## TL;DR

AskElephant customers frequently need to import historical calls from competing platforms (Gong, Fathom, Grain, etc.) and ingest ongoing phone calls from dialers (RingCentral, Zoom Phone, Gong Engage). Currently, each request triggers ad-hoc engineering work with no clear pricing, timeline, or capability matrix—creating friction for sales, frustration for customers, and a heavy developer burden. This initiative explores building a standardized, potentially self-service call import system that enables clear yes/no answers for sales, transparent pricing, and scalable onboarding.

---

## Summary

This research captures the current state of call import requests at AskElephant, the pain points experienced by internal teams and customers, and potential solution directions. The core insight is that **AskElephant's value scales with data volume**—yet the hardest part for many customers is getting their existing call corpus into the platform quickly.

---

## Key Findings

### Finding 1: Import Requests Are a Major Onboarding Friction Point

**Evidence:**
> "Right now, when customers are onboarding, a lot of the conversation that we have with them is around transferring from one platform to another."

> "They want to be removed from that platform, replacing it with us, and get that existing data that they had and then store it in AskElephant so they don't lose it."

**Implications:**
- Import capability is a table-stakes expectation for customers switching from competitors
- Data migration is a make-or-break moment in the sales/onboarding process
- Without clear answers, deals can stall or customers start with incomplete data

---

### Finding 2: No Standardized Process Exists Today

**Evidence:**
> "The complication comes with the cost of getting it in, the transparency... our process right now is let's say somebody makes a request from a dialer you've never heard of—we have to see do we have connections to their API, do we have access to their calls, if we do how long is it going to take."

> "A developer writes a one-off script, uses it, and then it's not actually in the system."

> "It's been a huge massive lift... going back and forth between engineering and design."

**Implications:**
- Each import is a custom engineering project
- No reusable infrastructure or pricing model
- Heavy coordination overhead between sales, engineering, and customers

---

### Finding 3: Sales Team Cannot Give Clear Answers

**Evidence:**
> "What we're trying to do is make some sort of clear process where a sales rep can confidently say yes or no when somebody asks if they can import existing data and have live calls from other platforms into our system."

> "Not only that, that if we are importing, there's clear understanding of pricing, of length of time and delivery, of any requirements on their end—instead of it being this 'hey maybe' and then going back and forth."

**Implications:**
- Sales team needs a capability matrix and pricing calculator
- Clear SLAs for import timelines are missing
- Customer requirements (API keys, credentials, permissions) are undocumented

---

### Finding 4: Inconsistent Integration Patterns

**Evidence:**
> "We don't even have with our existing integrations a consistent way that we manage this. RingCentral—we have built our own application that people can connect to and do a lot through our site. But then for Zoom Phone we actually make users go in, create their own Zoom application, and then send us all the credentials for that."

> "Even today we're having issues with clients that aren't getting the information that we would expect from calls. Where it's just not working and we don't have the right access until they complain."

**Implications:**
- Different integrations have different user experiences
- Credential management is inconsistent and error-prone
- Silent failures go undetected until customer escalation

---

### Finding 5: Phone Calls Are a Major Gap

**Evidence:**
> "We only do that for video calls like through Google Meet, Zoom, Teams. So if they're doing phone calls—which a lot of account executives do—we also want to get that information in and then we'll transcribe in our platform. However, we don't have direct support."

**Implications:**
- Phone-based sales workflows are underserved
- Dialer integrations are high-value but currently ad-hoc
- Gap between video call capture (product strength) and phone call capture (gap)

---

### Finding 6: Source Platform Variability Creates Uncertainty

**Evidence:**
> "The variety of different platforms that we get requests for... 529, Grain, Fathom... just about anything. And it's unreliable whether or not we can get that information."

> "We had issues with Fathom where Fathom had trapped their calls behind a paywall. For some, had already paid for them, just a lot of existing issues and complexities."

> "We don't always know if there's an API, if you have access to these credentials, how we should connect."

**Implications:**
- Need a platform compatibility database
- Some platforms may never be supportable (paywalls, no API)
- Customer-side access/permissions vary significantly

---

## User Problems Identified

| Problem | Severity | Frequency | Evidence |
|---------|----------|-----------|----------|
| No clear import pricing | High | Common | "Clear understanding of pricing" needed; ad-hoc quotes vary ($150-$1000+) |
| No timeline visibility | High | Common | "Length of time and delivery" unclear; customers wait indefinitely |
| Sales can't answer import questions | High | Common | "Hey maybe" instead of yes/no answers |
| One-off engineering work for each import | High | Common | Developer scripts, not productized |
| Silent integration failures | High | Occasional | "Not working and we don't have the right access until they complain" |
| Inconsistent integration UX | Medium | Common | RingCentral vs Zoom Phone require different setup flows |
| Phone calls not natively supported | High | Common | "A lot of account executives" use phone |
| Source platform API availability unknown | Medium | Occasional | Fathom paywall, credential confusion |
| No ongoing sync for dialers | High | Occasional | One-time import vs live sync distinction unclear |

---

## Feature Requests Identified

| Request | Severity | Frequency | Source |
|---------|----------|-----------|--------|
| Self-service import flow | High | Implicit | Internal ideation |
| Import status/progress visibility | High | Implicit | "Status bar, configuration, some way to know what is actually happening" |
| Capability matrix (yes/no per platform) | High | Internal | Sales enablement need |
| Pricing calculator | High | Internal | Sales enablement need |
| First 1,000 calls free on onboarding | Medium | Internal | Customer acquisition incentive |
| Checkout/billing for import beyond free tier | Medium | Internal | Monetization path |
| Ongoing dialer sync (not just one-time) | High | Customer | Dental Intelligence, PEYD |
| Backend processing bucket/queue | Medium | Internal | Alternative to self-service UI |

---

## Customer Case Studies

### 1. Dental Intelligence — Gong Engage
- **Date:** Oct 31, 2025
- **Requesters:** Dallin Hayne, Mark Hamilton
- **Platform:** Gong Engage (dialer/ongoing sync)
- **Call Volume:** 9,000+ calls imported; ongoing sync every 1-2 hours
- **Cost Quoted:** $1,000 reporting fee + licensing
- **Driver:** AI call coaching, CRM automation, "missed opportunities" analysis
- **Source:** [Engagement Link](https://app.askelephant.ai/workspaces/wrks_01JN30KSYSBMDRRVA3F62N2GHW/engagements/ngmt_01K8XJ4T3MJ3KE1MQW428HFDVQ)

### 2. KlientBoost — Gong Historical Import
- **Date:** Jul 30 – Aug 12, 2025
- **Requester:** Justin Briones
- **Platform:** Gong (historical import)
- **Call Volume:** ~1,000-1,200 calls
- **Cost Quoted:** $150-$250 (reusing Gong transcripts) or ~$1,000 max at $0.12/call
- **Driver:** Call scoring, coaching, automation, reporting
- **Sources:** [Onboarding](https://app.askelephant.ai/workspaces/wrks_01JN30KSYSBMDRRVA3F62N2GHW/engagements/ngmt_01K0X0RG8612WQCGQ0CX9A37PX), [API Keys](https://app.askelephant.ai/workspaces/wrks_01JN30KSYSBMDRRVA3F62N2GHW/engagements/ngmt_01K1C6Y2FSWN72T38TN4B60SMS)

### 3. PEYD / GetPEYD — RingCentral
- **Date:** Jun 9 – Jun 30, 2025
- **Requester:** Pinny Ackerman
- **Platform:** RingCentral (VoIP + call recordings)
- **Call Volume:** Not specified
- **Driver:** Custom CRM integration, coaching, automation
- **Blockers:** RingCentral call recording integration not working
- **Source:** [Chat](https://app.askelephant.ai/workspaces/wrks_01JN30KSYSBMDRRVA3F62N2GHW/chats/chat_01JZ4RYKRTDK6BF885KWECGVM9)

### 4. Pearagon — Fathom (Exploratory)
- **Date:** Aug 7, 2025
- **Requester:** Justin Briones
- **Platform:** Fathom
- **Status:** Tool transition evaluation; no bulk import executed
- **Source:** [Chat](https://app.askelephant.ai/workspaces/wrks_01JN30KSYSBMDRRVA3F62N2GHW/chats/chat_01K22YQ6959XJ2RP0PPCMMCY6A)

---

## Competitive/Platform Landscape

| Platform | Type | API Available? | Known Issues |
|----------|------|----------------|--------------|
| Gong | Competitor | Yes (API keys) | Processing delay on their end |
| Gong Engage | Dialer | Yes | Sync cadence limitations |
| Fathom | Competitor | Unclear | Paywall on call exports |
| Grain | Competitor | Unknown | — |
| 529 | Dialer | Unknown | — |
| RingCentral | VoIP/Dialer | Yes (OAuth app) | Custom app complexity |
| Zoom Phone | VoIP/Dialer | Yes | Customer creates own Zoom app—high friction |
| Fireflies | Competitor | Unknown | Mentioned as comparison |

---

## Potential Solution Directions

### Option A: Self-Service Import Experience
- Onboarding prompt: "Are you coming from another platform?"
- First 1,000 calls free, self-service
- Status bar / progress visibility during import
- Checkout flow for additional imports
- Clear per-call pricing

**Pros:** Scalable, reduces engineering burden, improves sales confidence
**Cons:** Significant product/engineering investment, need to handle edge cases

### Option B: Backend Processing Queue
- Cloud bucket receives calls
- Continuous processing script
- Pricing calculator for internal/sales use
- Less user-facing complexity

**Pros:** Simpler to build initially, flexible
**Cons:** Still requires manual coordination, less transparent to customers

### Option C: Pipedream Integration Layer
- Use Pipedream for connection abstraction
- Already have Pipedream access
- Could standardize API connections

**Pros:** Leverages existing tool, faster to prototype
**Cons:** Unexplored, may have limitations

---

## Known Limitations / Constraints

- Import quality depends on source recording quality
- Participant matching requires email addresses in source system
- Some sources have API rate limits affecting sync frequency
- Large files may require chunked upload for manual imports
- Processing time varies based on recording length and queue depth

---

## Open Questions

1. **Pricing model:** Per-call? Tiered? Included in seat license?
2. **Prioritization:** Which platforms to support first? (Gong, RingCentral, Zoom Phone seem highest demand)
3. **One-time vs ongoing:** How do we handle historical import vs live sync differently?
4. **Self-service scope:** Is full self-service MVP realistic, or start with sales-assisted?
5. **Credential management:** How to securely handle API keys/OAuth across platforms?
6. **Pipedream viability:** Has anyone evaluated Pipedream for this use case?
7. **Transcript reuse:** When can we reuse source transcripts vs re-transcribe?
8. **Platform compatibility DB:** Who maintains the "can we import from X?" database?
9. **Silent failure detection:** How do we proactively detect broken integrations?
10. **SLA definition:** What import timeline can we commit to?

---

## Action Items

| Action | Owner | Due | Status |
|--------|-------|-----|--------|
| Define initial platform priority list | PM | TBD | ⬜ |
| Audit Pipedream capabilities for this use case | Engineering | TBD | ⬜ |
| Document current RingCentral/Zoom Phone integration patterns | Engineering | TBD | ⬜ |
| Create pricing model draft | PM + Finance | TBD | ⬜ |
| Design capability matrix for sales team | PM | TBD | ⬜ |
| Scope MVP self-service vs sales-assisted | PM + Design | TBD | ⬜ |

---

## Related Research

- [Notion: Call Import Abstraction](https://www.notion.so/ask-elephant/Call-Import-Abstraction-256f79b2c8ac805db9d3ce1be113760e)

---

*Last updated: 2026-01-07*
*Researcher: PM Copilot (via transcript analysis)*
