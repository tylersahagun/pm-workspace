---
notion_id: 2caf79b2-c8ac-800a-acc2-e2b091dffd4b
notion_url: "https://www.notion.so/Nerdy-Tables-2caf79b2c8ac800aacc2e2b091dffd4b"
notion_last_edited_time: "2026-01-09T23:37:00.000Z"
sync_last_synced_at: "2026-01-15T02:24:31.472Z"
source: database
database_id: 2c0f79b2c8ac802c8b15c84a8fce3513
---

# Project Overview

> Universal Signals enables users to enrich engagement data with AI-extracted columns, transforming unstructured conversation data into structured, actionable insights. Users can create custom columns that extract specific data points from meetings, emails, and calls—similar to how Clay enriches prospect data, but for your own engagement history.

---

# Key Stakeholders & Sponsors


---


# Problem Statement

Users have rich conversational data (meetings, calls, emails) but lack the ability to systematically extract and analyze specific data points across engagements. Currently, insights are locked in unstructured transcripts, requiring manual review or one-off AI queries. There's no way to:

- Create reusable extraction patterns across all engagements

- Build custom views filtered by extracted attributes

- Track how specific topics, competitors, or signals evolve over time

- Answer aggregate questions like "which deals did we lose due to privacy concerns?"

Additionally, the current signals experience has critical gaps:

- Configuration is burdensome (School AI example: 25 annotations, 2+ hours to set up churn tracking)

- Extraction quality is basic and needs enhancement

- No clear path from individual annotations to meaningful aggregations

- Pricing model blocks wider adoption

---

# Important Technical Distinctions

> Universal Signals ≠ Current Signals

## Annotations (Current Signals)

- Time-based, discrete data points extracted from specific moments in engagements

- A piece of data that exists at a point in time as a result of something that happened

- Enables aggregation, time series analysis, and roll-ups because of their temporal nature

- Example: "Rep X committed to a follow-up meeting at timestamp 14:32"

## Universal Signals (New System)

- Derived/aggregated data that may or may not come from annotations

- Not inherently time-based—can be atomic facts, roll-ups, or semi-persistent attributes

- Can be calculated from annotations but includes other data types (web scrapes, CRM properties, etc.)

- Example: "What percentage of calls did Rep X schedule a follow-up?" (roll-up from annotations)

---

# Data Type Taxonomy


### Key UX Question: User Expectations on Data Freshness

When a user adds a column like "What industry is this company in?" via web scrape, do they expect it to auto-update if the company pivots industries? Or is it understood as a point-in-time snapshot?

This distinction affects architecture significantly. Roll-ups will always be current, but other data types need clear UX signals about freshness expectations.

---

# User Personas

## Sales Rep (IC)

Job to be done: Quickly identify patterns across my deals—competitor mentions, objections raised, next steps committed—without manually reviewing every call.

Pain points: Can't easily find which prospects mentioned specific competitors, no way to systematically track pricing objections or feature requests, manual note-taking misses important signals.

Universal Signals value: See aggregated performance metrics (e.g., "17 demos without closes") and drill down to specific engagement-level insights.

## Sales Leader / Manager

Job to be done: Understand team patterns and coaching opportunities by analyzing engagement data at scale.

Pain points: Can't aggregate insights across team's conversations, no visibility into common objections or competitive landscape, manual deal reviews are time-consuming.

Universal Signals value: Rep-level tables showing performance roll-ups; identify coaching opportunities from aggregated data.

## RevOps / Ops Leader

Job to be done: Build reliable datasets for analysis and reporting from engagement data.

Pain points: Key data lives in transcripts, not structured fields. Can't create reports on conversation content. No way to track process compliance from call data.

Universal Signals value: Clay-style tables as a workspace for developing and iterating on data extraction patterns; forecasting and analysis views.

---

# Use Cases

## From Internal Conversations (Woody)

1. Competitor enrichment - Extract which competitors were mentioned in each engagement

1. Loss reasons - Identify reasons why deals were lost to specific competitors

1. Scheduled next events - Extract any scheduled follow-up meetings or next steps

1. Product mentions - Track if specific products/features were discussed

1. Privacy discussions - Flag deals where privacy was a concern (for win-back campaigns)

1. Internal sentiment - Analyze tone/sentiment in internal meetings for employee engagement

1. Marketing research - Aggregate how often specific topics are discussed

1. Company research - Combine with web scraping to build full customer profiles

## From Kickoff Discussion

1. Rep performance roll-ups - "Pete had 17 demos that didn't close—what's the trend across those?"

1. Churn prediction signals - School AI use case: track frustration statements → categorize by type → identify churn risk

1. Deal-level aggregations - All signals for a specific deal, powering customer journey mapping

---

# Entity-Level Views

A critical insight from the kickoff: tables shouldn't only have engagements as rows. Users need:


UX Implication: When you click on a Company, you should see company-level fields on that page—not just a link to a table. The data model needs to support entity-level attributes.

---

# Connection to Customer Journey Mapping

> Dependency: Universal Signals should be scoped to align with Customer Journey Mapping.

Risk: If Universal Signals gets ahead of Journey Mapping (or vice versa), one becomes a blocker for the other. Sync scoping to avoid this.

---

# HubSpot Integration Considerations

Given the strategic bet on HubSpot partnerships:

- Property Mapping: When a company is onboarded, signals from HubSpot can be tied to explicit properties

- Dual Sync: Potential for bidirectional sync between our signals and HubSpot properties

- Initial Data: Instead of (or in addition to) web scrape, HubSpot can provide initial company/contact data

This expands the "data source" concept beyond just engagement transcripts.

---

# Technical Scope

## Phase 1: Foundation (Signals Improvements)

Goal: Shore up the technical foundation before building new experiences

- [ ] Improve extraction quality (prompts, context wiring)

- [ ] Evaluate database schema changes (Dylan to assess current vs overhaul)

- [ ] Address configuration burden (streamline annotation setup)

- [ ] Resolve pricing blocker for wider signals adoption

Note: This work benefits both legacy signals AND universal signals. Dylan confirmed synergy—not a separate "finish signals" project.

## Phase 2: Universal Signals Architecture

Goal: Build the data layer that supports roll-ups, entity-level attributes, and various data freshness patterns

- [ ] Define schema for entity-level attributes (company, rep, deal, contact)

- [ ] Build roll-up calculation engine (in-flight aggregation from annotations)

- [ ] Support configurable time windows (last N engagements, date ranges)

- [ ] Implement data source abstraction (transcripts, web scrape, CRM sync)

- [ ] Design update/refresh patterns for semi-persistent data

## Phase 3: Tables Experience (UX)

Goal: Build the user-facing experience for creating, configuring, and viewing enriched tables

- [ ] "Tables" area in navigation (proposed naming from Adam)

- [ ] Table creation with entity-type selection (engagements, reps, companies, deals)

- [ ] Column builder UX for defining extraction/aggregation logic

- [ ] Saved views with preset configurations

- [ ] Filter/sort by any column

- [ ] Export capabilities

---

# Functional Requirements

## Must Have (MVP)

- [ ] Users can create custom columns on tables

- [ ] Support for multiple entity types as rows (not just engagements)

- [ ] Columns can use AI extraction prompts to pull data from transcripts

- [ ] Roll-up columns that aggregate from underlying annotations

- [ ] Extracted data persists and displays in table view

- [ ] Users can filter/sort tables by extracted column values

- [ ] Columns update automatically when new matching engagements occur

## Should Have

- [ ] Column templates for common use cases (competitors, next steps, sentiment)

- [ ] Ability to edit extraction prompts after creation

- [ ] Last updated timestamp for semi-persistent fields

- [ ] Manual refresh trigger for specific columns

- [ ] Export table data with enriched columns

- [ ] Saved table views that users can switch between

## Could Have

- [ ] Web scraping integration for external data enrichment

- [ ] HubSpot property sync (bidirectional)

- [ ] Auto-update scheduling controls (daily/weekly refresh)

- [ ] Column formulas/computed columns based on other columns

- [ ] Sharing column definitions across team

- [ ] Dashboard-style visualizations from table data

---

# Non-Functional Requirements

- Performance: Extraction should complete within reasonable time (background processing OK)

- Accuracy: Extraction prompts should produce consistent, reliable results

- Scalability: Should handle tables with 1000+ engagements

- Cost awareness: Users should understand AI cost implications of column creation

- Clarity: Users should understand data freshness expectations for each column type

---

# Design Approach

## Current State

- Adam has existing low-fi designs/concepts

- Needs customer research validation before engineering sync

- Target: January for design walkthrough with team

## Key Design Challenges

### 1. This is NOT just "copying Clay"

Even visually copying Clay would be a significant lift from current state. The configuration/builder experience is the hard part. Clay's UX doesn't translate directly to our data model.

### 2. Builder vs Viewer Experience

Viewing aggregated data in a table is simpler. Configuring what to extract and how to aggregate is complex. Current signals config is painful (2+ hours for School AI setup).

### 3. Tables as a "Workspace"

Not just a search/event log page. A place where RevOps/leadership iterate on extraction patterns. Preset saved views for different use cases. Potentially a daily destination for some personas.

## Process

Design and engineering will "leapfrog"—alternating who leads. Design goes first with low-fi user flows. Engineering responds with technical feasibility/API definition. Iterate until aligned. Figma links and Linear tickets should live together in Notion for visibility.

---

# Development Process

## Single PRD, Multiple Milestones

Dylan confirmed: one PRD covering both signals improvements AND universal signals architecture. Milestones will be defined within.

## Design-Engineering Interface

Proposal from Dylan: Define the interface/API between design and engineering upfront. Agree on what data will be available, so design doesn't diverge from technical reality.

## Timeline


---

# Success Metrics

North Star: Reduction in time to answer aggregate questions about engagement data

Leading Indicators:

- Number of custom columns created per user

- Column usage in filters/searches

- Time saved vs. manual transcript review

- Reduction in signals configuration time (vs. current 2+ hour setups)

Guardrails:

- Extraction accuracy rate (spot-check validation)

- User-reported false positives/negatives

- User understanding of data freshness (qualitative)

---

# Open Questions

## Scoping

1. Scope of engagement - Meetings only, or emails/calls too?

1. Entity types for MVP - All (engagements, reps, companies, deals) or start with subset?

1. Journey mapping alignment - Are we scoping to deals first to sync with that project?

## Data and Freshness

1. User expectations on updates - Do users expect web-scraped data to stay current?

1. Window defaults - What is the default window for roll-ups? (Last 20 calls? 30 days? All-time?)

1. One-shot queries - Are there versions where you ask once and don't expect persistence?

1. Cascade updates - If source data changes, do derived signals auto-update?

## Technical

1. Schema approach - Adapt current signals schema or minor overhaul? (Dylan to assess)

1. Pricing model - How do we resolve the pricing blocker for signals?

1. Retroactive extraction - When creating a column, extract from all historical data?

## UX

1. Column sharing - Can columns be shared across team or org?

1. Builder complexity - How do we make configuration simple when underlying logic is complex?

1. Naming - "Tables" as the area name? (Adam's proposal)

---

# Appendix: Evidence from Slack

> I would enrich the engagements on competitors. I would enrich the engagements on reasons why we lost to those competitors. I would enrich the engagements for scheduled next events. — Woody

> I would create a column that was found out if they discussed privacy, if it was closed lost, and then I can kind of like a VLOOKUP type of filtering so I can know who I should call back because we have this new product feature. — Woody

> I would create columns for internal meetings based off of like what is the tone and sentiment that people are talking with. — Woody

---

# Appendix: Kickoff Meeting Insights (Dec 2024)

Key technical insight from Skyler:

> "Universal Signals is 100% not signals... Annotations are very much time-based—something that happened at this moment with a piece of data as a result. These pieces of data we're talking about are not that, but could be calculated from that."

On configuration burden (Tyler):

> "School AI wanted to set up annotations to track churn alerts... There were 25 different annotations, and it probably took me a good two hours to set up."

On design scope (Skyler):

> "This is one of those ones that Woody was considering that no design was needed because we're just copying Clay tables, and we're gonna have to fight against that notion because a lot of design is gonna be needed."

On customer journey connection (Tyler):

> "Is there any reason that we wouldn't scope this to the same place as the customer journey mapping? So we start with just on a deal basis... Universal signals will power the journey map and give it that contextual data."

On Tables as a workspace (Bryan):

> "Actually lean into the heaviness of that page, which is like a Clay table... where somebody rather than going there once a week, there may be some personas that actually will go there every day where they're having preset saved table views that they've configured."
