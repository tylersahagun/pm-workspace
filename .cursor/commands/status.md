# Status Command

Show workspace overview and initiative status.

**Applies:** `initiative-status` skill

## Usage

```
/status                    # Overall workspace status
/status [initiative-name]  # Specific initiative status
```

## Workspace Status

Shows:
- Active initiatives and their phases
- Recent activity
- Pending action items
- Roadmap summary

## Initiative Status

For a specific initiative, shows:

### Metadata
- Current phase (discovery → define → build → validate → launch)
- Days in current phase
- Target personas
- Strategic pillar

### Artifact Status
| Artifact | Status |
|----------|--------|
| Research | ✅ Complete / ⚠️ Incomplete / ❌ Missing |
| PRD | ✅ Complete / ⚠️ Incomplete / ❌ Missing |
| Design Brief | ✅ Complete / ⚠️ Incomplete / ❌ Missing |
| Prototype | ✅ Complete / ⚠️ Incomplete / ❌ Missing |
| Jury Evaluation | ✅ Complete / ⚠️ Incomplete / ❌ Missing |

### Graduation Criteria
- What's needed to advance to next phase
- What's currently blocking

### Recent Signals
- New feedback linked to this initiative
- Unprocessed signals count

## Data Sources

- `pm-workspace-docs/initiatives/[name]/_meta.json`
- `pm-workspace-docs/roadmap/roadmap.json`
- `pm-workspace-docs/signals/_index.json`

## Next Steps

Based on current status, suggests:
- `/research [name]` if research missing
- `/pm [name]` if PRD missing
- `/proto [name]` if prototype missing
- `/validate [name]` if ready for validation
- `/iterate [name]` if feedback pending
