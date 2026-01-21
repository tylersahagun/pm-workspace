# Prototype Notes: CRM Readiness Diagnostic

> **Created:** 2026-01-21
> **Location:** `elephant-ai/web/src/components/prototypes/CrmReadinessDiagnostic/`
> **Storybook Path:** `Prototypes/CrmReadinessDiagnostic`

---

## Components Created

| Component | File | Purpose |
|-----------|------|---------|
| `CrmReadinessScore` | `CrmReadinessScore.tsx` | Traffic light score display with circular progress |
| `CrmIssueCard` | `CrmIssueCard.tsx` | Expandable card for individual configuration issues |
| `CrmReadinessPanel` | `CrmReadinessPanel.tsx` | Full panel combining score + issues list |
| `types.ts` | `types.ts` | TypeScript interfaces and mock data |

---

## Design Decisions

### Traffic Light System

| Status | Score Range | Message | Color |
|--------|-------------|---------|-------|
| GREEN | 85-100 | "Ready to go" | Emerald |
| YELLOW | 50-84 | "Needs attention" | Amber |
| RED | 0-49 | "Action required" | Red |

### Issue Severity Levels

| Severity | UI Treatment | Visibility |
|----------|--------------|------------|
| CRITICAL | Red border, auto-expanded | Always visible first |
| WARNING | Amber border, collapsed | Always visible |
| INFO | Slate border, hidden | Collapsible section |

### Messaging Approach

✅ **Non-accusatory language used:**
- "Optimization opportunities" not "Problems"
- "Needs attention" not "Misconfigured"
- "Ways to unlock full potential" not "Errors"

---

## Storybook Stories

| Story | Description |
|-------|-------------|
| `Score: Green (Ready)` | Perfect CRM health |
| `Score: Yellow (Needs Work)` | Some improvements needed |
| `Score: Red (Action Required)` | Critical issues blocking success |
| `Score: All Variants` | Side-by-side comparison |
| `Issue Card: Critical/Warning/Info` | Individual issue card variants |
| `Panel: Ready/NeedsWork/NeedsHelp` | Full panel states |
| `Panel: Loading/Error/Empty` | Edge case states |
| `In Settings Page Context` | Integration preview |
| `Interactive Demo` | Stateful demo with controls |

---

## Integration Points

Based on [placement-research.md](./placement-research.md):

### Primary Location
```
Settings > Integrations > [after HubSpot connection card]
```

### Embedding Example
```tsx
// In routes/workspaces/$workspaceId/settings/integrations.tsx
{isHubspot && connected && (
  <CrmReadinessPanel workspaceId={workspaceId} />
)}
```

---

## Data Dependencies (For Engineering)

### Required Hook
```ts
// hooks/useCrmReadiness.ts
const { data, loading, error, refetch } = useCrmReadiness(workspaceId);
```

### GraphQL Query Needed
```graphql
query CrmReadiness($workspaceId: ID!) {
  crmReadiness(workspaceId: $workspaceId) {
    score
    status
    issues {
      id
      severity
      title
      description
      howToFix
      hubspotLink
      affectedObjects
    }
    lastChecked
  }
}
```

---

## Mock Data

The prototype includes comprehensive mock data in `types.ts`:

- `MOCK_READY_DATA` - Green state, no issues
- `MOCK_NEEDS_WORK_DATA` - Yellow state, warnings only
- `MOCK_NEEDS_HELP_DATA` - Red state, critical + warnings
- `MOCK_ISSUES` - 5 representative issue types

---

## Next Steps

1. [ ] **Validate with stakeholders** - Review in Storybook with design/eng
2. [ ] **Backend API design** - Define GraphQL schema with engineering
3. [ ] **HubSpot API research** - What data can we actually query?
4. [ ] **Integration** - Wire up to real data in `integrations.tsx`
5. [ ] **Onboarding flow** - Add to post-OAuth experience
6. [ ] **User testing** - Validate messaging with customers

---

## Files

```
elephant-ai/web/src/components/prototypes/CrmReadinessDiagnostic/
├── CrmReadinessScore.tsx      # Score component
├── CrmIssueCard.tsx           # Issue card component
├── CrmReadinessPanel.tsx      # Full panel component
├── CrmReadiness.stories.tsx   # Storybook stories
├── types.ts                   # TypeScript + mock data
└── index.ts                   # Barrel exports
```

---

## Preview Links

- **Local Storybook:** `cd elephant-ai && npm run storybook -w web` → http://localhost:6006
- **Path in Storybook:** Prototypes → CrmReadinessDiagnostic
