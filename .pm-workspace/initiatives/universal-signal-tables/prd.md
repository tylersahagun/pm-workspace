# Universal Signal Tables - PRD

## Overview
<!-- One-paragraph summary of what we're building and why -->

Universal Signal Tables enables revenue leaders to explore, filter, and enrich engagement data through AI-powered tables — transforming unstructured conversation data into structured, actionable insights. Users can create custom columns that extract specific data points from meetings, emails, and calls, similar to how Clay enriches prospect data, but for your own engagement history.

**Status:** Discovery — See research.md for strategic assessment

## Problem Statement

Users have rich conversational data (meetings, calls, emails) but lack the ability to systematically extract and analyze specific data points across engagements. Currently, insights are locked in unstructured transcripts, requiring manual review or one-off AI queries.

### Evidence

> "Right now, I cannot tell you which competitor has been brought up the most, if we win or lose, what they like about that competitor." — Woody (Kickoff, Jan 7, 2026)

> "Every sales leader pretends like they're confident, but they are tiny little kids inside crying." — Woody on leader anxiety

### Current State
- Signal configuration is burdensome (2+ hours for complex setups)
- No aggregation across calls without manual export
- Leaders rely on emotion/anecdote instead of data
- RevOps bottleneck for new data fields

## Target Personas

- [x] **Sales Leader** (Primary) — Roger the Revenue Leader
- [x] **RevOps** (Secondary) — Otis the Ops Strategist
- [ ] Sales Representative — Consumer of insights, not builder
- [ ] CSM — Future consideration

## Success Metrics
<!-- How do we know this worked? -->
| Metric | Current | Target | Timeline |
|--------|---------|--------|----------|
| Time to insight (ad-hoc question → answer) | Hours/days | < 5 minutes | MVP |
| Leaders using data tables weekly | 0 | 50%+ of leader users | 90 days post-launch |
| Signal configuration time | 2+ hours | < 15 minutes | MVP |
| Expansion from tables feature | Baseline | Track as leading indicator | 6 months |

## User Stories

### Epic: Ad-Hoc Data Exploration

**As a** Sales Leader,
**I want to** quickly create a table of engagements with AI-extracted columns,
**So that** I can answer questions about my pipeline without waiting for RevOps.

#### Acceptance Criteria
- [ ] Can select entity type (engagements, companies, deals)
- [ ] Can filter by date range, rep, outcome, etc.
- [ ] Can add AI columns that run prompts against filtered data
- [ ] Can conditional execution (if column A is true, run column B)
- [ ] Results are saved and can be returned to

---

### Epic: Insight to Action Path

**As a** Sales Leader,
**I want to** graduate a one-time column into an ongoing signal,
**So that** I can continuously monitor patterns I've discovered.

#### Acceptance Criteria
- [ ] Can mark a column as "run on future engagements"
- [ ] System converts to signal configuration
- [ ] Historical + future data available in same view

---

## Scope

### In Scope (MVP Candidates — TBD)
- Table creation with entity selection
- AI column creation with prompts
- Conditional execution logic
- Filtering and sorting
- Save and return to tables
- Chat-assisted table building

### Out of Scope (v1)
- External data enrichment (web scraping, CRM pulls)
- Real-time dashboards/graphs
- Rep self-service (leadership only)
- Complex workflows with branching
- Pricing implementation (usage-based discussion ongoing)

### Future Considerations
- Entity-level views (company pages with roll-up data)
- Integration with workflow builder
- Template marketplace
- Dashboard export/visualization

## Design

### User Flow (Draft)
1. Leader opens Tables from nav
2. Selects entity type (engagements/companies/deals)
3. Applies filters (date, rep, outcome)
4. Adds AI columns via chat or manual builder
5. Runs extraction on filtered dataset
6. Reviews, iterates, refines
7. Saves table for return or graduates columns to signals

### Wireframes/Mockups
<!-- Link to Figma or embed screenshots -->
- Low-fi designs ready for customer validation (Adam)
- Prototype target: EOD Jan 8, 2026

### Prototype
<!-- Link to Storybook prototype in prototypes/ folder -->
- TBD

## Technical Considerations

### Key Distinctions
- **Annotations** (current signals): Time-based, discrete data points from specific moments
- **Universal Signals** (new): Derived/aggregated data, not inherently time-based

### Architecture Questions
- Roll-up metrics: Calculated on-the-fly vs stored?
- Token cost model: Per-column-run pricing viable?
- Real-time vs batch processing for column execution

## Dependencies

- Current Signals infrastructure
- Engagement data pipeline
- Global Chat project completion (~Jan 9)
- Engineering capacity (Dylan transitioning)

## Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Scope creep to "build Clay" | High | High | Strict MVP definition, phase gates |
| Token costs unsustainable | Medium | Medium | Conditional execution, cost modeling |
| "Scary like Clay" UX | High | Medium | AI-assisted onboarding, simplicity focus |
| Engineering complexity | Medium | Medium | Technical spike before sprint planning |

## Timeline

### Milestones
| Milestone | Date | Status |
|-----------|------|--------|
| Kickoff Discussion | 2026-01-07 | ✅ Complete |
| Research Complete | 2026-01-07 | ✅ Complete |
| MVP Scope Definition | TBD | ⬜ |
| Prototype v1 | 2026-01-08 | ⬜ In Progress |
| Design Partner Testing | TBD | ⬜ |
| PRD Complete | TBD | ⬜ |
| Development Start | ~Jan 9 (post-Global Chat) | ⬜ |
| Beta | TBD | ⬜ |
| GA | TBD | ⬜ |

## Open Questions
- [ ] What is the MVP boundary? (Engagements only? Entity selection?)
- [ ] External enrichment in v1 or later?
- [ ] Chat-first or builder-first UX?
- [ ] Pricing model (credits, included, usage-based)?
- [ ] Design partner list (Matt's team? External?)
- [ ] Annotations → Universal Signals technical relationship?

---
*Last updated: 2026-01-07*
*Owner: Tyler, Skyler*

