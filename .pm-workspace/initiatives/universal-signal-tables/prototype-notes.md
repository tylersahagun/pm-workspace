# Prototype Notes: Universal Signal Tables

## Prototype Status
- **Target Date:** 2026-01-08 EOD
- **Owner:** Adam (Design), Tyler (PM direction)
- **Status:** Not Started

---

## Design Requirements (From Kickoff)

### Core UI Components

1. **Table View**
   - Leftmost column: Entity identifier (company, deal, engagement)
   - Additional columns: AI-extracted data, filters, roll-ups
   - Visual indicators for column dependencies

2. **Chat Panel**
   - Left side of screen (Cursor-like layout)
   - Natural language table building
   - Shows "thinking" / work in progress

3. **Builder Panel**
   - Visual representation of table configuration
   - Column settings, prompts, conditions
   - Transparency for what AI built

### Key Interactions

- Filter selection: Entity type, date range, outcomes
- Column creation: Via chat or direct add
- Conditional logic: "If column A is true, run column B"
- Execution: Run on filtered dataset
- Save: Persist table for return

---

## Reference Inspiration

### From Woody
> "When I use the Cursor plan agent and it shows me a flowchart, then I review the plan... I have to understand it."

**Implication:** Show AI's work. Builder provides trust.

### From Adia
> "Clay scares people. Our version cannot scare people."

**Implication:** Simplicity over power for v1. Progressive disclosure.

### From Discussion
- Chat on left, table on right
- Artifacts (graphs, dashboards) open in separate panel
- Building mode vs. talking-to-data mode are separate

---

## Prototype Scope (v0.1)

### Must Have
- [ ] Table with entity selection
- [ ] Filter panel
- [ ] Column add with prompt input
- [ ] Basic conditional indicator
- [ ] Chat input area

### Nice to Have
- [ ] Column execution animation
- [ ] Sample data population
- [ ] Export affordance

### Out of Scope
- Actual AI execution
- Real data connection
- Dashboard/graph creation

---

## Questions for Prototype Review

1. Does the layout feel explorable or intimidating?
2. Is the relationship between chat and builder clear?
3. Does conditional execution make sense visually?
4. What's the entry point / empty state experience?

---

## Adia's Clay Examples (Requested)

Adia to provide Loom videos showing:
- How she uses Clay to answer sales questions
- Her thought process when building tables
- Workflow patterns that work well

**Purpose:** Understand expert user mental model before simplifying for general users.

---

*Last updated: 2026-01-07*

