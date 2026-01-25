# Sync Queue

User Q&A queue for ambiguous mappings from `/sync-dev`, `/sync-notion`, `/sync-linear`, and `/sync-github`.

When the system can't confidently map work to initiatives (confidence < 80%), items are added here for user decision.

**Last Updated:** (auto-updated on sync)

---

## How to Use

1. Review each item below
2. Respond with your decision:
   - **Approve**: Accept suggested mapping
   - **Reject**: Skip this mapping
   - **Alternative**: Map to different initiative
   - **Create**: Create new initiative
3. Run `/sync-dev --resolve` to process your decisions

---

## Pending Decisions

### New Notion Projects (No Local Initiative)

_Projects found in Notion that don't have matching local initiatives._

_No pending items._

---

### Unmapped Linear Projects

_Active Linear projects with no matching PM initiative._

_No pending items._

---

### Conflicting Mappings

_Situations where multiple sources suggest different mappings._

<!--
Template:
#### [Initiative Name]
**Issue:** Multiple Linear connections found

| Source | Linear Project | Project ID |
|--------|---------------|------------|
| Projects DB "Linear Link" | Project A | abc123 |
| Eng Specs "Linear Epic" | Project B | def456 |
| _meta.json | Project C | ghi789 |

**Action needed:** Which is correct?

- [ ] Use Projects DB (abc123)
- [ ] Use Eng Specs (def456)
- [ ] Use existing _meta.json (ghi789)
- [ ] Manually specify: ___________
-->

_No pending items._

---

### Low-Confidence Mappings

_System made a mapping but confidence is 50-79%. Please verify._

<!--
Template:
#### [Linear Issue/Project] → [Initiative]
**Confidence:** 65%
**Reason:** Keyword match on "chat" and "global"

**Suggested mapping:** internal-search (Global Chat)

- [ ] Approve mapping
- [ ] Reject (unlinked)
- [ ] Map to different initiative: ___________
-->

_No pending items._

---

### Orphaned Artifacts

_Engineering Specs or Design Briefs without "Related Project" in Notion._

<!--
Template:
#### Engineering Spec: "[Name]"
**Notion ID:** `spec123`
**Status:** In Progress
**Linear Epic:** ASK-1234 (if present)

**No Related Project link in Notion.**

- [ ] Link to Notion project: ___________
- [ ] Create initiative for this work
- [ ] Skip (standalone spec)
-->

_No pending items._

---

### Unlinked GitHub PRs (Pattern Detected)

_PRs without ASK-XXXX reference that may belong to an initiative._

<!--
Template:
#### PR #123: "[Title]"
**Branch:** feat/some-feature
**Author:** @person
**Merged:** 2 days ago

**No Linear reference found.**
**Pattern suggests:** May relate to [initiative]

- [ ] This PR relates to: ___________
- [ ] Truly unlinked (infra/maintenance)
-->

_No pending items._

---

## Recently Resolved

_Decisions made in previous sync runs._

| Date       | Item                                     | Decision                            | By    |
| ---------- | ---------------------------------------- | ----------------------------------- | ----- |
| 2026-01-23 | Privacy Experience (Notion)              | Skip (not PM-tracked)               | Tyler |
| 2026-01-23 | Noxon Usability (Linear)                 | Already mapped to product-usability | Tyler |
| 2026-01-23 | Privacy Determination Agent P.2 (Linear) | Skip (wrapping up)                  | Tyler |

---

## Queue Statistics

| Category                 | Pending | Resolved (30d) |
| ------------------------ | ------- | -------------- |
| New Notion Projects      | 0       | 1              |
| Unmapped Linear Projects | 0       | 2              |
| Conflicting Mappings     | 0       | 0              |
| Low-Confidence Mappings  | 0       | 0              |
| Orphaned Artifacts       | 0       | 0              |
| Unlinked PRs             | 0       | 0              |
| **Total**                | **0**   | **3**          |

**Last Updated:** 2026-01-23T21:15:00Z

---

## Notes

- Items older than 30 days are auto-archived
- "Skip" decisions are remembered to avoid re-prompting
- Run `/sync-dev --resolve` to process this queue
- Run `/sync-dev --dry-run` to preview what would be queued
