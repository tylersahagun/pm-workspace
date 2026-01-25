---
name: research-analyst
description: Extract actionable insights from user research, transcripts, and feedback with strategic alignment assessment. Use when analyzing any customer conversation, interview, or feedback document.
---

# Research Analyst Skill

Specialized knowledge for extracting actionable insights from user research with a strategic lens.

## When to Use

- Analyzing user interview transcripts
- Processing customer feedback
- Reviewing meeting notes with customers
- Extracting insights from support tickets
- Competitive research analysis

## Strategic Context (Always Reference)

Before analyzing ANY research, reference:
- `pm-workspace-docs/company-context/product-vision.md` - Core identity, principles
- `pm-workspace-docs/company-context/strategic-guardrails.md` - Red flags and decision framework
- `pm-workspace-docs/company-context/personas.md` - Who we're building for

## Extraction Framework

### What to Extract

1. **Key Decisions** - What was decided and why
2. **Action Items** - Who, what, when (be specific)
3. **User Problems** - With verbatim quotes
4. **Feature Requests** - Note frequency and urgency
5. **Insights & Patterns** - Cross-reference with other research
6. **Open Questions** - What still needs answering
7. **Strategic Alignment** - Does this align with vision?
8. **Red Flags** - Concerns needing attention

### Strategic Signals

#### Alignment Signals (✅)
- Clear outcome chain: "✅ Strong outcome chain: [summary]"
- Evidence-backed need: "✅ Evidence present: [quote]"
- Trust/privacy addressed: "✅ Trust considered"
- Persona-specific: "✅ Clear persona: [which one]"

#### Red Flags (⚠️)
- Outcome unclear: "⚠️ Who benefits and how?"
- No evidence: "⚠️ What data supports this?"
- Generic AI feature: "⚠️ Anti-vision concern"
- Trust gap: "⚠️ Privacy/reliability not addressed"
- Persona confusion: "⚠️ Trying to serve everyone?"

## Output Template

```markdown
# [Type] Summary: [Topic]

**Date:** YYYY-MM-DD
**Participants:** [list]

## TL;DR
[2-3 sentences with strategic assessment]

## Strategic Alignment
**Score:** [Strong / Moderate / Weak]

**Aligned:** ✅ [What's working]
**Concerns:** ⚠️ [What needs clarification]

---

## Key Decisions
## Action Items
## User Problems (with quotes)
## Feature Ideas
## Questions Before PRD
## Open Questions
```

## Save Locations

| Type | Location |
|------|----------|
| Meeting notes | `pm-workspace-docs/meeting-notes/YYYY-MM-DD-[topic].md` |
| User interviews | `pm-workspace-docs/research/user-interviews/` |
| Initiative research | `pm-workspace-docs/initiatives/[name]/research.md` |
| Signals | `pm-workspace-docs/signals/` |
