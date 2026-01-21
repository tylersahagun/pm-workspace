# PRD: CRM Readiness Diagnostic

> **Status:** Discovery
> **Owner:** TBD
> **Hypothesis:** `hyp-crm-readiness-diagnostic`
> **Last Updated:** 2026-01-21

---

## Problem Statement

AskElephant implementations fail or underperform when customers have poorly configured HubSpot accounts. Partner feedback reveals that **90%+ of customers** have CRM configuration issues blocking success. Expert partners require **53+ hours of prerequisite work** before AskElephant can be introduced—work that self-serve customers can't do themselves.

### Impact

- **Churn:** Customers blame AskElephant when the real problem is CRM configuration
- **Activation:** Self-serve customers fail without understanding why
- **Support:** Failures appear as product bugs, increasing support burden
- **Partner Dependency:** Can only succeed with dedicated partner implementation

### User Quote

> "The client use it as my HubSpot account. Don't fully trust it. So why am I adding another system to add more data to it on top of shit? That's the most common thing that I run into when I'm working with this with customers."
> — Crispy, HubSpot Partner

---

## Target Personas

| Persona | Need | Current Pain |
|---------|------|--------------|
| **RevOps** | Understand what's blocking AskElephant value | No visibility into CRM readiness; trial and error |
| **Sales Leader** | Get team using AskElephant successfully | AE fails silently; blames product not process |
| **Implementation Partner** | Diagnose customer CRM faster | 53+ hours manual assessment per customer |

---

## Success Metrics

| Metric | Current | Target | Rationale |
|--------|---------|--------|-----------|
| Activation rate (first workflow running) | X% | +20% | Diagnostic should unblock stuck customers |
| Time to activation | X days | -30% | Guided remediation accelerates setup |
| Customer churn (first 90 days) | X% | -25% | Solve root cause of early churn |
| Support tickets (CRM-related) | X/week | -50% | Customers self-diagnose instead of filing tickets |

---

## User Journey

### Current State

```
Customer signs up
  → Connects HubSpot
    → Creates workflow
      → Workflow fails silently (missing associations)
        → Customer frustrated, doesn't know why
          → Files support ticket OR churns
            → We discover CRM was misconfigured all along
```

### Desired State

```
Customer signs up
  → Connects HubSpot
    → AE runs automatic diagnostic
      → Shows "CRM Readiness Score" with specific issues
        → Yellow: "Here's how to fix these issues" (guided remediation)
        → Red: "Connect with a partner for expert help"
          → Customer understands blockers BEFORE they fail
            → Either self-remediates or gets help
              → Workflows succeed on first try
                → Customer sees value immediately
```

---

## MVP Scope

### In Scope (v1)

- [ ] **CRM Diagnostic Engine** — Automatically assess HubSpot configuration during onboarding
  - Check: Deal → Contact → Company associations
  - Check: Required properties exist and are populated
  - Check: Data freshness (stale records)
  - Check: Object usage patterns (are contacts/companies being used?)
  
- [ ] **Readiness Score UI** — Show traffic light system
  - Green: Ready to go
  - Yellow: Fixable issues (with guidance)
  - Red: Needs expert help (connect to partners)

- [ ] **Issue Detail Cards** — For each issue, show:
  - What's wrong
  - Why it matters for AskElephant
  - How to fix it (link to HubSpot, or guided steps)

### Out of Scope (v1)

- Automated remediation (AI fixes issues for you)
- Property creation from AskElephant
- Partner matching/marketplace
- Integration with workflow builder (gating)
- Historical CRM health tracking

---

## Open Questions

1. **What's the minimum readiness checklist?** Need to define with partner input
2. **Where does diagnostic live?** Onboarding flow? Settings? Dashboard?
3. **How do we refresh scores?** On-demand? Daily? After changes?
4. **What permissions do we need?** HubSpot API scope requirements
5. **How do we message Red customers?** Without sounding accusatory

---

## Technical Considerations

*To be filled out after engineering review*

- HubSpot API endpoints needed
- Data access requirements
- Performance implications (diagnostic speed)
- Caching strategy for diagnostic results

---

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Customers feel blamed for "bad CRM" | Medium | High | Frame as "optimization opportunities" not failures |
| Diagnostic creates more friction in onboarding | Medium | Medium | Make it fast (<30 sec) and skippable |
| Partners see this as threat to their business | Low | Medium | Position as enablement tool, not replacement |
| HubSpot API limitations block key checks | Medium | High | Prototype early to validate feasibility |

---

## References

- [Research: CRM Readiness Diagnostic](./research.md)
- [Hypothesis: hyp-crm-readiness-diagnostic](../../hypotheses/validated/crm-readiness-diagnostic.md)
- [Signal: Crispy Product Feedback](../../signals/transcripts/2026-01-21-crispy-product-feedback-session.md)
- [Signal: Zipcio Methodology](../../signals/documents/Zipcio_%20AI%20as%20a%20Service.md)
