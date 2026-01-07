# Call Import Engine - PRD

## Overview
<!-- One-paragraph summary of what we're building and why -->
Build a standardized system for importing historical calls from competitor platforms and ingesting ongoing calls from phone dialers, enabling sales to give confident yes/no answers and customers to understand pricing, timelines, and requirements upfront.

## Problem Statement
<!-- What user pain are we solving? Include evidence (user quotes, data) -->
> "What we're trying to do is make some sort of clear process where a sales rep can confidently say yes or no when somebody asks if they can import existing data and have live calls from other platforms into our system."

Currently, call import requests trigger ad-hoc engineering work with no clear pricing, timeline, or capability matrix—creating friction for sales, frustration for customers, and a heavy developer burden.

## Target Personas
<!-- Which personas benefit? Link to personas.md -->
- [x] Sales Representative — Clear answers for prospects asking about imports
- [x] Sales Leader — Faster onboarding, reduced deal friction
- [x] CSM — Smoother customer transitions
- [x] RevOps — Reliable data ingestion, consistent processes

## Success Metrics
<!-- How do we know this worked? -->
| Metric | Current | Target | Timeline |
|--------|---------|--------|----------|
| Sales confidence in import answers | Low | High | Q2 2026 |
| Engineering hours per import request | ~8-20hrs | <1hr | Q3 2026 |
| Customer time-to-first-import | Days/weeks | Hours | Q3 2026 |
| Import-related deal friction | High | Low | Q2 2026 |

## User Stories

### Epic: Platform Capability Visibility

**As a** sales representative,
**I want to** know which platforms we can import from and at what price,
**So that** I can give immediate, confident answers to prospects.

#### Acceptance Criteria
- [ ] Capability matrix shows supported platforms
- [ ] Pricing is visible per platform/call count
- [ ] Timeline estimates are available

### Epic: Self-Service Import

**As a** new customer coming from a competitor,
**I want to** import my historical calls without engineering involvement,
**So that** I can start using AskElephant with my full data context immediately.

#### Acceptance Criteria
- [ ] Onboarding flow asks about previous platform
- [ ] Self-service credential entry for supported platforms
- [ ] Import progress visibility
- [ ] Clear pricing before checkout

## Scope

### In Scope
- Platform capability research and documentation
- Pricing model definition
- MVP import flow (starting with 1-2 high-priority platforms)
- Sales enablement materials

### Out of Scope
- Full self-service for all platforms (future)
- Real-time sync for all dialers (future)
- Mobile import experience

### Future Considerations
- Pipedream integration layer
- Automated platform compatibility detection
- Customer-facing status dashboard

## Design

### User Flow
1. Entry point: Onboarding or settings
2. Platform selection
3. Credential/API key entry
4. Confirmation and pricing
5. Import progress tracking
6. Success state with data available

### Wireframes/Mockups
<!-- Link to Figma or embed screenshots -->
TBD after research phase

### Prototype
<!-- Link to Storybook prototype in prototypes/ folder -->
TBD

## Technical Considerations
<!-- Notes for engineering - APIs, integrations, performance -->
- Evaluate Pipedream for connection abstraction
- Need secure credential storage
- Consider queue-based processing for large imports
- Rate limiting handling per platform

## Dependencies
<!-- Other teams, systems, or initiatives this depends on -->
- Platform API documentation research
- Pricing/finance input
- Legal review for data handling

## Risks & Mitigations
| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Platform API changes/restrictions | High | Medium | Monitor APIs, maintain fallbacks |
| Credential security concerns | High | Low | Use secure vault, OAuth where possible |
| Unpredictable import volumes | Medium | Medium | Queue-based processing, clear SLAs |

## Timeline

### Milestones
| Milestone | Date | Status |
|-----------|------|--------|
| Research Complete | 2026-01-07 | ✅ |
| PRD Complete | | ⬜ |
| Design Complete | | ⬜ |
| Prototype Review | | ⬜ |
| Development Start | | ⬜ |
| Beta | | ⬜ |
| GA | | ⬜ |

## Open Questions
- [ ] Which platforms to prioritize first?
- [ ] Self-service vs sales-assisted for MVP?
- [ ] Pricing model (per-call, tiered, bundled)?
- [ ] Pipedream viability assessment needed
- [ ] Transcript reuse vs re-transcription economics

---
*Last updated: 2026-01-07*
*Owner: TBD*
