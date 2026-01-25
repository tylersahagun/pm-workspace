# Validate Command

Run jury evaluation and check graduation criteria for an initiative.

## Usage

```
/validate [initiative-name]
```

Options:
```
/validate [name] --phase [phase]     # Validate specific phase
/validate [name] --criteria-only     # Skip jury, just check criteria
```

## Behavior

**Delegates to**: `validator` subagent

The subagent will:
1. Load initiative metadata and documents
2. Check graduation criteria for current phase
3. Run synthetic jury evaluation (if applicable)
4. Generate validation report
5. Recommend next steps (advance, iterate, or block)

## Graduation Criteria

### Discovery → Define
- Research exists with user quotes
- Persona(s) identified
- 3+ evidence points

### Define → Build
- PRD exists and approved
- Design brief exists
- Outcome chain defined

### Build → Validate
- Prototype covers all states
- Storybook stories complete
- Flow stories implemented

### Validate → Launch
- Jury pass rate ≥ 70%
- Stakeholder approval
- No P0 blockers

## Jury Evaluation

Uses Condorcet Jury Theorem with:
- 100-500 synthetic personas
- Stratified sampling (15% skeptics minimum)
- Role distribution: Rep 40%, Leader 25%, CSM 20%, RevOps 15%

## Output

- Report: `pm-workspace-docs/initiatives/[name]/jury-evaluations/`
- Updated `_meta.json` with results

## Next Steps

Based on results:
- **Passed**: Advance to next phase
- **Failed**: Run `/iterate [name]` to address feedback
- **Contested**: Review concerns with stakeholders
