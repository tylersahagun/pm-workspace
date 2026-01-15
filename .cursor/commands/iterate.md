# Prototype Iteration

Iterate on an existing prototype using new feedback (transcripts, notes, or conversations).

## Inputs (user may provide any subset)
- Transcript text or file paths
- Updated goals or constraints
- Which prototype version to refine (v1/v2/v3 or specific stories)

## Workflow
1. Locate initiative docs:
   - pm-workspace-docs/initiatives/[project]/prd.md
   - pm-workspace-docs/initiatives/[project]/design-brief.md
   - pm-workspace-docs/initiatives/[project]/prototype-notes.md
2. Parse the new feedback:
   - Summarize decisions, action items, and key pain points
   - Pull direct quotes when helpful
   - Identify deltas vs existing PRD/design assumptions
3. Update docs:
   - PRD: adjust problem framing, scope, success metrics, open questions
   - Design brief: update flows, states, edge cases, accessibility
   - Prototype notes: add a dated "Iteration" section with rationale
4. Create a new full prototype version:
   - Always create a new version folder (v2/, v3/, etc.) with a complete rebuild
   - Do NOT create an "iterations" story/section or partial delta-only story
   - Replicate all relevant states in the new version (not just a single view)
   - Preserve prior versions for comparison
   - Keep Storybook stories grouped under the version (V2_*, V3_*) and cover all required states
5. Publish Storybook to Chromatic (automatic on new versions):
   - Ensure Chromatic is installed: `npm install --save-dev chromatic`
   - Run from the prototype package root with the project token set as env:
     - `CHROMATIC_PROJECT_TOKEN="chpt_46b823319a0135f" npm run chromatic`
   - If the repo has multiple packages, run it where `storybook` is configured
6. Summarize outcomes:
   - What changed and why
   - Open questions
   - Recommended next feedback session

## Output Expectations
- Updated docs in pm-workspace-docs/initiatives/[project]/
- Updated prototype components/stories
- Short recap with next steps`