# Prototype Iteration

Iterate on an existing prototype using new feedback. **Automatically pulls signals linked to the initiative** from the signals index, synthesizes insights, updates docs, and rebuilds the prototype.

## Auto-Context Loading

When iterating on a prototype, automatically load context per `context-orchestrator.mdc`:

1. Load foundation: `@pm-workspace-docs/company-context/product-vision.md`, `strategic-guardrails.md`
2. Load initiative metadata: `@pm-workspace-docs/initiatives/[name]/_meta.json`
3. Load PRD: `@pm-workspace-docs/initiatives/[name]/prd.md`
4. Load Design Brief: `@pm-workspace-docs/initiatives/[name]/design-brief.md`
5. Load Prototype Notes: `@pm-workspace-docs/initiatives/[name]/prototype-notes.md`
6. Load latest jury evaluations (if any): `@pm-workspace-docs/initiatives/[name]/jury-evaluations/`

## Inputs (user may provide any subset)
- Transcript text or file paths (optional—will also auto-pull from signals)
- Updated goals or constraints
- Which prototype version to refine (v1/v2/v3 or specific stories)
- Jury evaluation results

---

## Workflow

### Step 1: Locate Initiative Docs

- `pm-workspace-docs/initiatives/[project]/prd.md`
- `pm-workspace-docs/initiatives/[project]/design-brief.md`
- `pm-workspace-docs/initiatives/[project]/prototype-notes.md`
- `pm-workspace-docs/initiatives/[project]/_meta.json`

### Step 2: Auto-Pull Signals (NEW)

**Automatically gather feedback from the signals system:**

1. **Read signals index:** `pm-workspace-docs/signals/_index.json`

2. **Find signals linked to this initiative:**
   ```
   Filter where:
   - signal.initiative === "[initiative-name]"
   - OR signal.related_initiatives includes "[initiative-name]"
   ```

3. **Identify NEW signals since last iteration:**
   - Read `_meta.json` → `updated_at` or last `iteration_history[].date`
   - Filter signals where `captured_at` > last iteration date
   - If no prior iterations, use ALL linked signals

4. **Load signal contents:**
   - For each new signal, read the full file at `signal.file_path`
   - Extract: `problems_extracted`, `feature_requests`, `key_quotes`, `action_items`, `design_decisions`

5. **Report what was found:**
   ```
   📥 Auto-pulled 3 new signals since last iteration:
   
   1. sig-2026-01-22-adam-composio-feedback (transcript)
      - 4 problems, 5 feature requests, 3 action items
   
   2. sig-2026-01-22-figma-make-spec (document)  
      - Design patterns: typewriter effect, artifact chains
   
   3. sig-2026-01-21-jury-evaluation (jury)
      - Verdict: BUILD with 2 required changes
   ```

**If NO new signals found:**
- Check if user provided feedback directly
- If neither, ask: "No new signals found. Do you have feedback to add, or should I check the signals folder?"

### Step 3: Detect Prototype Type and Version

Read from `_meta.json`:

| `prototype_type` | What to iterate | New folder structure |
|------------------|-----------------|----------------------|
| `"standalone"` | Isolated component | `[Initiative]/v[N+1]/*.tsx` |
| `"context"` | Context-aware component | `[Initiative]/v[N+1]/contexts/*.tsx` |
| `"both"` | Both versions | Update both in new version folder |
| `undefined` | Infer from files | Check for `contexts/` folder |

**Read `current_version`** to determine next version number:
- If `"v1"` → create `v2/`
- If `"v2"` → create `v3/`
- etc.

**Inference fallback** (if `prototype_type` not set):
- If `contexts/` folder exists → treat as context prototype
- If `placement-research.md` exists → treat as context prototype
- Otherwise → treat as standalone prototype

### Step 4: Synthesize Feedback

Combine auto-pulled signals + user-provided feedback:

1. **Problems:** Merge all `problems_extracted` from signals
2. **Feature requests:** Consolidate, dedupe, note frequency
3. **Design decisions:** Track what was decided vs. still open
4. **Action items:** Flag incomplete items
5. **Key quotes:** Pull most impactful verbatim quotes

**Identify deltas vs existing docs:**
- What's NEW that's not in the PRD?
- What CONTRADICTS current assumptions?
- What VALIDATES current direction?

### Step 5: Update Docs

Based on synthesized feedback:

- **PRD:** Adjust problem framing, scope, success metrics, open questions
- **Design Brief:** Update flows, states, edge cases, accessibility, add design exploration references
- **Prototype Notes:** Add a dated "Iteration" section with:
  - Signals consumed (list signal IDs)
  - Key changes made
  - Rationale for decisions
- **Research.md:** Add signal cross-references if significant new research

### Step 6: Rebuild Prototype

Create a new full prototype version **based on prototype type**:

**For `standalone` prototypes:**
- Create new version folder: `[ProjectName]/v2/`, `v3/`, etc.
- Rebuild all component variants and states
- Story naming: `V2_OptionA`, `V2_Loading`, etc.

**For `context` prototypes:**
- Create new version folder: `[ProjectName]/contexts/v2/`, `v3/`, etc.
- Rebuild context wrappers (InPage, InPanel, Navigation)
- Story naming: `InContext_V2_AsFullPage`, etc.
- Update `placement-research.md` if integration approach changed

**For `both` prototypes:**
- Iterate on BOTH standalone and context versions
- Keep them in sync (same functionality, different contexts)
- Ask user which to prioritize if feedback is ambiguous

**General rules:**
- Always create a new version folder with a complete rebuild
- Do NOT create an "iterations" story/section or partial delta-only story
- Replicate all relevant states in the new version (not just a single view)
- Preserve prior versions for comparison
- Keep Storybook stories grouped under the version and cover all required states

### Step 7: Publish to Chromatic

> ⛔ **BLOCKING**: You MUST deploy to Chromatic. Response is incomplete without URL.

**Run these commands** (not optional):
```bash
cd elephant-ai && npm run build-storybook -w web
cd elephant-ai && npm run chromatic
```

**Capture the `storybookUrl` from output** - include it in your response.

**Note**: Uses token `chpt_b6891b00696fe57` (configured in elephant-ai/package.json).

### Step 8: Update Metadata

**Update `_meta.json`:**
```json
{
  "updated_at": "[current timestamp]",
  "prototype_type": "[preserve existing or set if newly detected]",
  "current_version": "v[N]",
  "last_signals_processed": "[timestamp]",  // NEW: Track signal sync point
  "signals_consumed": [                      // NEW: Track which signals informed this iteration
    "sig-2026-01-22-adam-composio-feedback",
    "sig-2026-01-22-figma-make-spec"
  ],
  "metrics": {
    "total_iterations": [increment by 1]
  },
  "iteration_history": [
    {
      "version": "v[N]",
      "date": "[timestamp]",
      "prototype_type": "[standalone|context|both]",
      "focus": "[what changed]",
      "feedback_source": "[auto-pulled signals + any user-provided]",
      "signals_consumed": ["sig-id-1", "sig-id-2"]  // NEW
    }
  ]
}
```

**Also update root index.ts to re-export latest version:**
```typescript
// elephant-ai/web/src/components/prototypes/[Initiative]/index.ts
export * from './v2';  // Point to new version
```

### Step 9: Summarize Outcomes

Report to user:
- Signals consumed (with links)
- What changed in docs
- What changed in prototype
- Open questions
- Recommended next steps

---

## Output Expectations

- Updated docs in `pm-workspace-docs/initiatives/[project]/`
- Updated prototype components/stories in new version folder
- Updated `_meta.json` with:
  - Incremented iteration count
  - `last_signals_processed` timestamp
  - `signals_consumed` array
- Short recap with next steps

---

## After Iteration

1. **Check if ready for validation:**
   - If all states implemented and ready for jury, suggest: "Run `/validate [name]`"
   
2. **Update roadmap if significant:**
   - Run `/roadmap refresh` if status or progress changed

3. **Suggest next steps:**
   - "Ready for jury? Run `/validate [name]`"
   - "More feedback needed? Schedule stakeholder review"
   - "Check status: Run `/status [name]`"

---

## Signal Auto-Pull Examples

### Example 1: Multiple New Signals

```
/iterate composio-agent-framework

📥 Auto-pulled 2 new signals since v1 (2026-01-20):

1. sig-2026-01-22-adam-composio-feedback
   Source: internal-design-review
   Problems: 4 | Features: 5 | Action items: 3
   Key insight: "Conversational setup preferred over form fields"

2. sig-2026-01-22-figma-make-spec  
   Source: figma-make-design-artifact
   Design patterns: typewriter effect, artifact chains, sticky input
   
Synthesizing into v2...
```

### Example 2: No New Signals

```
/iterate crm-readiness-diagnostic

📭 No new signals found since v2 (2026-01-21).

Options:
1. Provide feedback directly (paste transcript or notes)
2. Check signals folder for unlinked feedback
3. Run `/validate [name]` if prototype is ready for jury

What would you like to do?
```

### Example 3: Mixed Sources

```
/iterate hubspot-agent-config

📥 Auto-pulled 1 new signal:
- sig-2026-01-21-crispy-feedback (transcript)

📝 You also provided:
- Direct feedback about "visibility settings missing"

Combining both sources into v3...
```
