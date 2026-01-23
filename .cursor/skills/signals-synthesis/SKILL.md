---
name: signals-synthesis
description: Pattern recognition and theme extraction across multiple signals. Use when synthesizing insights from transcripts, tickets, and feedback.
---

# Signals Synthesis Skill

Specialized knowledge for finding patterns across multiple product signals.

## When to Use

- Analyzing multiple signals for themes
- Generating hypothesis candidates
- Cross-referencing with existing hypotheses
- Identifying emerging patterns before they're obvious

## Theme Detection Methods

### 1. Keyword Clustering

Group signals by similar words/phrases:
- Extract key terms from each signal
- Cluster by semantic similarity
- Identify recurring terminology

### 2. Persona Correlation

Find patterns by persona:
- Same persona mentioning similar issues
- Different personas with shared frustrations
- Persona-specific vs universal problems

### 3. Temporal Clustering

Identify time-based patterns:
- Issues appearing in same time period
- Trends emerging over time
- Seasonality or event correlation

### 4. Feature Area Mapping

Group by product domain:
- Issues in same feature area
- Cross-feature dependencies
- Integration-related patterns

## Signal Strength Assessment

| Strength | Criteria | Action |
|----------|----------|--------|
| **Strong** | 5+ occurrences, 3+ sources, multiple personas | Create hypothesis |
| **Moderate** | 3-4 occurrences, 2+ sources | Monitor, gather more |
| **Weak** | 1-2 occurrences, single source | Note, don't act yet |

## Source Diversity Scoring

More diverse sources = stronger signal:

| Sources | Score | Interpretation |
|---------|-------|----------------|
| 1 type | Low | Could be outlier |
| 2 types | Medium | Pattern emerging |
| 3+ types | High | Confirmed pattern |

Source types: transcript, ticket, issue, conversation, survey

## Synthesis Output Format

```markdown
# Signal Synthesis: [Topic]

**Signals Analyzed:** X
**Date Range:** [start] to [end]

## Executive Summary
[2-3 sentences on key patterns]

## Theme Analysis

### Theme: [Name]
**Strength:** Strong / Moderate / Weak
**Occurrences:** X signals
**Source Diversity:** X types

| Dimension | Value |
|-----------|-------|
| Severity | High/Medium/Low |
| Frequency | Common/Occasional/Rare |
| Personas | [list] |

**Evidence:**
> "[Quote]" - [source, date]

**Hypothesis Match:** [existing or "None"]
**Recommendation:** [action]

## Hypothesis Candidates

### [Suggested Name]
- **Problem:** [synthesized statement]
- **Evidence:** X signals
- **Confidence:** High/Medium/Low
- **Action:** `/hypothesis new [name]`

## Cross-References

| Existing Hypothesis | New Evidence |
|--------------------|--------------|
| [hyp-name] | X signals support |
```

## Quality Checks

Before finalizing synthesis:

- [ ] All themes have 2+ evidence quotes
- [ ] Strength ratings are justified
- [ ] Hypothesis matches are verified
- [ ] Recommendations are actionable
- [ ] No single-source "patterns"

## Integration Points

| After Synthesis | Next Step |
|-----------------|-----------|
| Strong theme, no match | `/hypothesis new [name]` |
| Theme matches existing | `/hypothesis show [name]`, add evidence |
| Weak signals | Monitor, run synthesis again later |
| Validated hypothesis | `/hypothesis commit [name]` |

## Anti-Patterns

🚩 **Premature patterns** - Don't create hypotheses from 1-2 signals
🚩 **Ignoring weak signals** - Document them, they may strengthen
🚩 **Source bias** - Don't over-weight one source type
🚩 **Recency bias** - Include older signals in analysis
🚩 **Confirmation bias** - Look for disconfirming evidence too
