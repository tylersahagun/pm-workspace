# Engineering Spec: Feature Availability & Release Process

## Overview

Technical implementation plan for the feature availability audit initiative, covering flag cleanup, beta toggle infrastructure, and release tracking.

**Related PRD:** [prd.md](./prd.md)  
**Status:** Not Started  
**Type:** Technical Spec  
**Complexity:** Medium  
**Estimated Effort:** 3-4 weeks engineering time

---

## Technical Overview

### Architecture Approach

1. **Phase 1 (Cleanup):** Remove stale/dead flags from PostHog and codebase
2. **Phase 2 (Infrastructure):** Add stage metadata to flags, create beta cohort system
3. **Phase 3 (UI):** Beta toggle settings panel with real-time flag updates

### Key Components

```
┌─────────────────┐     ┌──────────────┐     ┌─────────────────┐
│   PostHog       │────▶│   Backend    │────▶│   Frontend      │
│   Feature Flags │     │   API        │     │   Settings UI   │
└─────────────────┘     └──────────────┘     └─────────────────┘
        │                      │                      │
        ▼                      ▼                      ▼
   Stage metadata        Beta enrollment       Toggle controls
   TTL tracking          User preferences      Badge components
   Analytics             Workspace settings    Toast feedback
```

---

## Data Model Changes

### PostHog Flag Metadata (No DB Change)

Leverage PostHog's existing tag/metadata system:

```json
{
  "flag_key": "auto-tagging-v2",
  "stage": "beta",
  "ttl_start": "2025-10-15",
  "ttl_days": 90,
  "description": "Automatically tag meetings based on content",
  "category": "automation"
}
```

### User Preferences (Existing Table Extension)

```sql
-- Add to existing user_preferences or create new table
ALTER TABLE user_preferences 
ADD COLUMN beta_features_enabled JSONB DEFAULT '[]';

-- Example value: ["auto-tagging-v2", "global-chat-enabled"]
```

### Workspace Settings (Existing Table Extension)

```sql
-- Workspace-level beta feature settings
ALTER TABLE workspace_settings
ADD COLUMN beta_features_policy JSONB DEFAULT '{"mode": "opt-in", "enabled_features": []}';

-- Modes: "opt-in" (users choose), "enabled" (on for all), "disabled" (off for all)
```

---

## API Changes

### New Endpoints

#### GET `/api/beta-features`
Returns available beta features for current user/workspace.

**Response:**
```json
{
  "features": [
    {
      "key": "auto-tagging-v2",
      "name": "Auto-Tagging V2",
      "description": "Automatically tag meetings based on content",
      "stage": "beta",
      "enabled": false,
      "workspace_policy": "opt-in"
    }
  ]
}
```

#### POST `/api/beta-features/{key}/toggle`
Enable or disable a beta feature for current user.

**Request:**
```json
{
  "enabled": true
}
```

**Response:**
```json
{
  "success": true,
  "feature": "auto-tagging-v2",
  "enabled": true
}
```

#### GET `/api/beta-features/status` (Internal/Admin)
Returns all features with stage information for dashboard.

### Modified Endpoints

#### GET `/api/feature-flags`
Add stage metadata to existing feature flag responses:

```json
{
  "flags": {
    "auto-tagging-v2": {
      "enabled": true,
      "stage": "beta",
      "badge_label": "Beta"
    }
  }
}
```

---

## Frontend Components

### New Components

#### `<BetaFeaturesSettings />`
Settings panel for beta feature toggles.

```tsx
// src/components/settings/BetaFeaturesSettings.tsx
interface BetaFeature {
  key: string;
  name: string;
  description: string;
  stage: 'lab' | 'alpha' | 'beta';
  enabled: boolean;
  workspacePolicy: 'opt-in' | 'enabled' | 'disabled';
}

export function BetaFeaturesSettings() {
  const { features, toggleFeature, isLoading } = useBetaFeatures();
  
  return (
    <SettingsSection title="Beta Features">
      <p className="text-muted">
        Try new features before they're released to everyone.
      </p>
      {features.map(feature => (
        <BetaFeatureCard 
          key={feature.key}
          feature={feature}
          onToggle={toggleFeature}
        />
      ))}
    </SettingsSection>
  );
}
```

#### `<StageBadge />`
Reusable badge component for feature stages.

```tsx
// src/components/ui/StageBadge.tsx
interface StageBadgeProps {
  stage: 'lab' | 'alpha' | 'beta';
  size?: 'sm' | 'md';
}

export function StageBadge({ stage, size = 'sm' }: StageBadgeProps) {
  const config = {
    lab: { label: 'Experimental', icon: '🧪', color: 'purple' },
    alpha: { label: 'Alpha', icon: '🔷', color: 'blue' },
    beta: { label: 'Beta', icon: '🟡', color: 'amber' },
  };
  
  return (
    <Badge variant={config[stage].color} size={size}>
      {config[stage].icon} {config[stage].label}
    </Badge>
  );
}
```

#### `<BetaFeatureCard />`
Individual feature toggle card.

```tsx
// src/components/settings/BetaFeatureCard.tsx
export function BetaFeatureCard({ feature, onToggle }) {
  return (
    <Card className="flex items-center justify-between p-4">
      <div>
        <div className="flex items-center gap-2">
          <span className="font-medium">{feature.name}</span>
          <StageBadge stage={feature.stage} />
        </div>
        <p className="text-sm text-muted">{feature.description}</p>
      </div>
      <Switch 
        checked={feature.enabled}
        onCheckedChange={(checked) => onToggle(feature.key, checked)}
        disabled={feature.workspacePolicy === 'disabled'}
      />
    </Card>
  );
}
```

### Modified Components

- **Settings navigation:** Add "Beta Features" menu item
- **Feature-specific components:** Add `<StageBadge />` where features are displayed

---

## Backend Services

### BetaFeatureService

```typescript
// services/BetaFeatureService.ts
export class BetaFeatureService {
  
  async getAvailableFeatures(userId: string, workspaceId: string): Promise<BetaFeature[]> {
    // 1. Get all flags with stage metadata from PostHog
    // 2. Filter to lab/alpha/beta stages
    // 3. Check workspace policy
    // 4. Check user's enabled features
    // 5. Return merged list
  }
  
  async toggleFeature(userId: string, featureKey: string, enabled: boolean): Promise<void> {
    // 1. Validate feature exists and is toggleable
    // 2. Update user preferences
    // 3. Update PostHog group membership (if needed)
    // 4. Track analytics event
  }
  
  async isFeatureEnabled(userId: string, featureKey: string): Promise<boolean> {
    // Check if user has feature enabled (user pref + workspace policy + flag status)
  }
}
```

### PostHog Integration Updates

```typescript
// services/PostHogService.ts additions

async getBetaFlags(): Promise<PostHogFlag[]> {
  // Filter flags by stage metadata
  return this.flags.filter(f => 
    ['lab', 'alpha', 'beta'].includes(f.metadata?.stage)
  );
}

async enrollUserInBeta(userId: string, featureKey: string): Promise<void> {
  // Add user to feature flag targeting
  await posthog.capture({
    distinctId: userId,
    event: 'beta_feature_enrolled',
    properties: { feature: featureKey }
  });
}
```

---

## Flag Cleanup Plan

### Phase 1: Remove Dead Flags (11 flags)

| Flag Key | Action | Risk |
|----------|--------|------|
| `team-invites` | Remove flag + code | Low - 0% rollout |
| `meeting-actions` | Remove flag + code | Low - inactive |
| `new-invite-flow` | Remove flag + code | Low - 0% rollout |
| `action-items-page` | Remove flag + code | Low - inactive |
| `workflows-v3` | Remove flag | Low - inactive, future use |
| `be-fine-tuning-page-refresh` | Remove flag + code | Low - inactive |
| `homepage-workflows` | Remove flag + code | Low - internal only |
| `bot-will-not-record-notification` | Review - keep or expand | Medium |
| `calendar-write-permission` | Remove flag | Low - 0% rollout |
| `ai-search-filters` | Remove flag | Low - 0% rollout |
| `bot-jit-scheduling-enabled` | Review - keep for future | Medium |

### Phase 2: Graduate GA Flags (8 flags)

| Flag Key | Action | Testing Required |
|----------|--------|------------------|
| `calendar-widget` | Remove flag wrapper | Regression test |
| `new-meeting-page` | Remove flag wrapper | Regression test |
| `scorecard-component` | Remove flag wrapper | Regression test |
| `crm-field-updates` | Remove flag wrapper | Regression test |
| `salesforce-v2-beta` | Remove flag wrapper (rename if needed) | Regression test |
| `hubspot-mcp` | Remove flag wrapper | Regression test |
| `deepgram-transcription-model` | Hardcode nova-3, remove flag | Config change |
| `deepgram-auto-detect-language` | Remove flag wrapper | Regression test |

### Phase 3: Consolidate Beta Flags

Group related flags into single toggles:
- Google Suite: 8 flags → 1 "Google Integrations" toggle
- Salesforce Agent: 3 flags → 1 "Salesforce Agent" toggle
- Notion/Linear/Monday: Separate toggles or "Third-party Integrations" group

---

## Dependencies

| Dependency | Type | Required By | Notes |
|------------|------|-------------|-------|
| PostHog API | External | Phase 2 | Flag metadata API access |
| User preferences table | Database | Phase 2 | May need migration |
| Design system | Internal | Phase 3 | Badge component specs |
| Settings page | Internal | Phase 3 | Where to mount UI |

---

## Migration Strategy

### Database Migration

```sql
-- Migration: add_beta_features_preferences
-- Safe to run: adds nullable column with default

ALTER TABLE user_preferences 
ADD COLUMN IF NOT EXISTS beta_features_enabled JSONB DEFAULT '[]';

ALTER TABLE workspace_settings
ADD COLUMN IF NOT EXISTS beta_features_policy JSONB DEFAULT '{"mode": "opt-in", "enabled_features": []}';
```

### Flag Removal Process

For each flag being removed:

1. **Audit:** Confirm flag is safe to remove (0% rollout or 100% GA)
2. **Code:** Remove flag checks from codebase
3. **Test:** Run regression tests
4. **Deploy:** Deploy code changes
5. **PostHog:** Archive/delete flag in PostHog
6. **Document:** Update release notes

### Rollout Plan

1. **Week 1:** Dead flag cleanup (11 flags)
2. **Week 2:** GA flag graduation (8 flags)
3. **Week 3:** Beta toggle infrastructure (backend)
4. **Week 4:** Beta toggle UI (frontend)

---

## Testing Strategy

### Unit Tests

- `BetaFeatureService` toggle logic
- `StageBadge` rendering for each stage
- API endpoint validation

### Integration Tests

- PostHog flag sync
- User preference persistence
- Workspace policy inheritance

### E2E Tests

- Toggle flow: Settings → Enable → Feature visible
- Badge display across app surfaces

### Manual Testing

- Flag removal: Verify no regression in affected features
- Cross-browser: Badge rendering consistency

---

## Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Flag removal breaks feature | High | Medium | Feature flag the removal; comprehensive testing |
| PostHog API rate limits | Medium | Low | Cache flag list; batch updates |
| User preferences lost on migration | High | Low | Default to empty array; no data loss |
| Badge inconsistency across surfaces | Low | Medium | Centralized component; design review |

---

## Observability

### Metrics to Track

- Beta feature opt-in rate (per feature)
- Time spent in each stage
- Flag evaluation latency (before/after cleanup)
- API endpoint performance

### Alerts

- Flag stuck past TTL (weekly digest)
- Beta toggle API errors (immediate)
- Unusual opt-out spike (investigate)

---

## Open Technical Questions

1. **PostHog metadata:** Can we add custom metadata to flags, or need separate storage?
2. **Real-time updates:** WebSocket vs. polling for flag changes?
3. **Caching:** How long to cache beta feature list client-side?
4. **Rollback:** How to quickly disable a beta feature for all users if issues arise?

---

*Engineering Owner: TBD*  
*Last Updated: January 13, 2026*
