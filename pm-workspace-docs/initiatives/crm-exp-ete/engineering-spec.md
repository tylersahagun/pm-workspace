# Engineering Spec: CRM Experience End-to-End

## Technical Overview

This spec covers the technical implementation of the complete CRM agent experience, from onboarding through daily operations. The system must support confidence-building workflows, real-time activity visibility, human-in-the-loop approvals, proactive anomaly detection, and user self-service automations.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (React)                         │
├─────────────┬─────────────┬─────────────┬─────────────┬─────────┤
│  Onboarding │  Activity   │   Agent     │   Inbox     │  User   │
│   Wizard    │  Dashboard  │   Comms     │   (HITL)    │ Automations│
└──────┬──────┴──────┬──────┴──────┬──────┴──────┬──────┴────┬────┘
       │             │             │             │           │
       ▼             ▼             ▼             ▼           ▼
┌─────────────────────────────────────────────────────────────────┐
│                      GraphQL API Layer                           │
├─────────────────────────────────────────────────────────────────┤
│  Queries: agents, activityLogs, inbox, automations, anomalies   │
│  Mutations: configureAgent, approveItem, createAutomation       │
│  Subscriptions: activityUpdates, inboxUpdates, anomalyAlerts    │
└──────┬──────────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Backend Services (Node.js)                    │
├─────────────┬─────────────┬─────────────┬─────────────┬─────────┤
│   Agent     │  Activity   │   Inbox     │  Anomaly    │ Notif   │
│  Executor   │   Logger    │   Service   │  Detector   │ Engine  │
└──────┬──────┴──────┬──────┴──────┬──────┴──────┬──────┴────┬────┘
       │             │             │             │           │
       ▼             ▼             ▼             ▼           ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Data Layer (PostgreSQL)                     │
├─────────────────────────────────────────────────────────────────┤
│  Tables: agent_configs, activity_logs, inbox_items, anomalies   │
│          user_automations, notification_preferences              │
└─────────────────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────────┐
│                    External Integrations                         │
├─────────────┬─────────────┬─────────────────────────────────────┤
│   HubSpot   │    Slack    │         Desktop Notifications        │
│     API     │     Bot     │              (Web Push)              │
└─────────────┴─────────────┴─────────────────────────────────────┘
```

---

## Data Model Changes

### New Tables

#### `agent_configs`
```sql
CREATE TABLE agent_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id),
  created_by UUID NOT NULL REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  crm_type VARCHAR(50) NOT NULL, -- 'hubspot', 'salesforce'
  call_type VARCHAR(100), -- 'discovery', 'demo', etc.
  config JSONB NOT NULL, -- Full configuration object
  status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'active', 'paused', 'error'
  is_template BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `activity_logs`
```sql
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id),
  agent_config_id UUID REFERENCES agent_configs(id),
  user_id UUID REFERENCES users(id), -- User whose data was affected
  meeting_id UUID REFERENCES meetings(id),
  crm_record_id VARCHAR(255), -- External CRM record ID
  crm_record_type VARCHAR(50), -- 'deal', 'contact', 'company'
  action_type VARCHAR(50) NOT NULL, -- 'create', 'update', 'skip'
  fields_updated JSONB, -- { field: { before, after, confidence } }
  overall_confidence DECIMAL(3,2),
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'success', 'failed', 'rejected'
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_activity_logs_workspace ON activity_logs(workspace_id, created_at DESC);
CREATE INDEX idx_activity_logs_user ON activity_logs(user_id, created_at DESC);
```

#### `inbox_items`
```sql
CREATE TABLE inbox_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id),
  user_id UUID NOT NULL REFERENCES users(id), -- Who needs to approve
  activity_log_id UUID REFERENCES activity_logs(id),
  item_type VARCHAR(50) NOT NULL, -- 'approval', 'question', 'alert'
  title VARCHAR(255) NOT NULL,
  description TEXT,
  context JSONB, -- Meeting context, before/after, etc.
  confidence DECIMAL(3,2),
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'expired'
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_inbox_items_user_pending ON inbox_items(user_id, status) WHERE status = 'pending';
```

#### `anomalies`
```sql
CREATE TABLE anomalies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id),
  anomaly_type VARCHAR(100) NOT NULL, -- 'high_failure_rate', 'unusual_pattern', etc.
  severity VARCHAR(50) DEFAULT 'warning', -- 'info', 'warning', 'error'
  title VARCHAR(255) NOT NULL,
  description TEXT,
  data JSONB, -- Supporting data for the anomaly
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'acknowledged', 'resolved'
  acknowledged_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `user_automations`
```sql
CREATE TABLE user_automations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id),
  user_id UUID NOT NULL REFERENCES users(id), -- Owner, scoped to their data only
  name VARCHAR(255) NOT NULL,
  trigger_type VARCHAR(100) NOT NULL,
  trigger_config JSONB NOT NULL,
  action_type VARCHAR(100) NOT NULL,
  action_config JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `notification_preferences`
```sql
CREATE TABLE notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  channel VARCHAR(50) NOT NULL, -- 'slack', 'desktop', 'email', 'in_app'
  notification_type VARCHAR(100) NOT NULL, -- 'hitl_approval', 'agent_complete', 'error', 'anomaly'
  is_enabled BOOLEAN DEFAULT true,
  frequency VARCHAR(50) DEFAULT 'immediate', -- 'immediate', 'digest', 'off'
  UNIQUE(user_id, channel, notification_type)
);
```

---

## API Changes

### GraphQL Schema Additions

```graphql
# Queries
type Query {
  # Agent configuration
  agentConfigs(workspaceId: ID!): [AgentConfig!]!
  agentConfig(id: ID!): AgentConfig
  agentTemplates(callType: String): [AgentConfig!]!
  
  # Activity
  activityLogs(
    workspaceId: ID!
    filters: ActivityLogFilters
    pagination: PaginationInput
  ): ActivityLogConnection!
  
  # Inbox
  inboxItems(
    userId: ID!
    status: InboxStatus
    pagination: PaginationInput
  ): InboxItemConnection!
  inboxCount(userId: ID!): Int!
  
  # Anomalies
  anomalies(workspaceId: ID!, status: AnomalyStatus): [Anomaly!]!
  
  # User automations
  userAutomations(userId: ID!): [UserAutomation!]!
  
  # Notification preferences
  notificationPreferences(userId: ID!): [NotificationPreference!]!
}

# Mutations
type Mutation {
  # Agent configuration
  createAgentConfig(input: CreateAgentConfigInput!): AgentConfig!
  updateAgentConfig(id: ID!, input: UpdateAgentConfigInput!): AgentConfig!
  activateAgent(id: ID!): AgentConfig!
  pauseAgent(id: ID!): AgentConfig!
  
  # Preview/test
  previewAgentRun(agentConfigId: ID!, meetingId: ID!): AgentPreviewResult!
  
  # Inbox
  approveInboxItem(id: ID!): InboxItem!
  rejectInboxItem(id: ID!, reason: String): InboxItem!
  batchApproveInboxItems(ids: [ID!]!): [InboxItem!]!
  
  # Anomalies
  acknowledgeAnomaly(id: ID!): Anomaly!
  resolveAnomaly(id: ID!): Anomaly!
  
  # User automations
  createUserAutomation(input: CreateUserAutomationInput!): UserAutomation!
  updateUserAutomation(id: ID!, input: UpdateUserAutomationInput!): UserAutomation!
  deleteUserAutomation(id: ID!): Boolean!
  
  # Notification preferences
  updateNotificationPreference(input: UpdateNotificationPreferenceInput!): NotificationPreference!
}

# Subscriptions
type Subscription {
  activityLogCreated(workspaceId: ID!): ActivityLog!
  inboxItemCreated(userId: ID!): InboxItem!
  anomalyDetected(workspaceId: ID!): Anomaly!
}

# Types
type AgentConfig {
  id: ID!
  name: String!
  crmType: CRMType!
  callType: String
  config: JSON!
  status: AgentStatus!
  isTemplate: Boolean!
  createdBy: User!
  createdAt: DateTime!
  updatedAt: DateTime!
  
  # Computed
  recentActivity: [ActivityLog!]!
  successRate: Float
}

type ActivityLog {
  id: ID!
  agentConfig: AgentConfig
  user: User
  meeting: Meeting
  crmRecordId: String
  crmRecordType: String
  actionType: ActionType!
  fieldsUpdated: JSON
  overallConfidence: Float
  status: ActivityStatus!
  errorMessage: String
  createdAt: DateTime!
}

type InboxItem {
  id: ID!
  user: User!
  activityLog: ActivityLog
  itemType: InboxItemType!
  title: String!
  description: String
  context: JSON
  confidence: Float
  status: InboxStatus!
  resolvedAt: DateTime
  resolvedBy: User
  createdAt: DateTime!
}

type Anomaly {
  id: ID!
  anomalyType: String!
  severity: AnomalySeverity!
  title: String!
  description: String
  data: JSON
  status: AnomalyStatus!
  acknowledgedBy: User
  createdAt: DateTime!
}

type AgentPreviewResult {
  matchedRecord: CRMRecord
  matchConfidence: Float
  fieldsToUpdate: [FieldUpdate!]!
  warnings: [String!]!
}

type FieldUpdate {
  fieldName: String!
  currentValue: String
  newValue: String!
  confidence: Float!
  source: String
}

# Enums
enum CRMType { HUBSPOT, SALESFORCE }
enum AgentStatus { DRAFT, ACTIVE, PAUSED, ERROR }
enum ActivityStatus { PENDING, SUCCESS, FAILED, REJECTED }
enum InboxItemType { APPROVAL, QUESTION, ALERT }
enum InboxStatus { PENDING, APPROVED, REJECTED, EXPIRED }
enum AnomalySeverity { INFO, WARNING, ERROR }
enum AnomalyStatus { ACTIVE, ACKNOWLEDGED, RESOLVED }
enum ActionType { CREATE, UPDATE, SKIP }
```

---

## Backend Services

### Agent Executor Service

**Responsibilities:**
- Execute agent configurations after meetings
- Calculate confidence scores
- Route to HITL or auto-approve based on confidence
- Update CRM via API
- Log all activity

**Key Functions:**
```typescript
interface AgentExecutorService {
  // Execute agent for a meeting
  executeAgent(agentConfigId: string, meetingId: string): Promise<ActivityLog>;
  
  // Preview without executing
  previewAgentRun(agentConfigId: string, meetingId: string): Promise<AgentPreviewResult>;
  
  // Calculate confidence for a field update
  calculateConfidence(field: string, value: any, context: MeetingContext): number;
  
  // Determine if HITL is required
  requiresHumanApproval(confidence: number, config: AgentConfig): boolean;
}
```

### Activity Logger Service

**Responsibilities:**
- Log all agent activity
- Provide real-time updates via subscriptions
- Support filtering and pagination
- Calculate aggregate metrics

### Inbox Service

**Responsibilities:**
- Create inbox items for HITL
- Handle approvals/rejections
- Batch operations
- Expiration handling
- Trigger notifications

### Anomaly Detector Service

**Responsibilities:**
- Monitor activity patterns
- Detect unusual behavior
- Generate alerts
- Track trends over time

**Detection Rules:**
```typescript
interface AnomalyRule {
  type: string;
  condition: (data: ActivityData[]) => boolean;
  severity: 'info' | 'warning' | 'error';
  message: (data: ActivityData[]) => string;
}

const anomalyRules: AnomalyRule[] = [
  {
    type: 'high_failure_rate',
    condition: (data) => calculateFailureRate(data, '1h') > 0.2,
    severity: 'error',
    message: () => 'Agent failure rate exceeded 20% in the last hour'
  },
  {
    type: 'low_confidence_trend',
    condition: (data) => calculateAvgConfidence(data, '24h') < 0.6,
    severity: 'warning',
    message: () => 'Average confidence has dropped below 60%'
  },
  // ... more rules
];
```

### Notification Engine Integration

**Responsibilities:**
- Send Slack notifications
- Send desktop push notifications
- Respect user preferences
- Support action buttons in Slack

**Slack Message Format:**
```typescript
interface SlackHITLMessage {
  blocks: [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '*CRM Update Needs Approval*\n\nMeeting: Discovery Call with Acme Corp\nDeal: Acme Expansion\nConfidence: 72%'
      }
    },
    {
      type: 'actions',
      elements: [
        {
          type: 'button',
          text: { type: 'plain_text', text: 'Approve' },
          style: 'primary',
          action_id: 'approve_hitl',
          value: inboxItemId
        },
        {
          type: 'button',
          text: { type: 'plain_text', text: 'Reject' },
          style: 'danger',
          action_id: 'reject_hitl',
          value: inboxItemId
        },
        {
          type: 'button',
          text: { type: 'plain_text', text: 'View Details' },
          action_id: 'view_hitl',
          url: detailsUrl
        }
      ]
    }
  ]
}
```

---

## Frontend Components

### New Components Required

```
src/components/
├── crm/
│   ├── onboarding/
│   │   ├── OnboardingWizard.tsx
│   │   ├── CRMConnectStep.tsx
│   │   ├── EducationStep.tsx
│   │   ├── ScopeSelectionStep.tsx
│   │   ├── TemplateSelectionStep.tsx
│   │   ├── FieldConfigStep.tsx
│   │   ├── TestPreviewStep.tsx
│   │   └── ActivationStep.tsx
│   ├── dashboard/
│   │   ├── ActivityDashboard.tsx
│   │   ├── ActivityTimeline.tsx
│   │   ├── ActivityFilters.tsx
│   │   ├── HealthStatusBanner.tsx
│   │   └── QuickStats.tsx
│   ├── agent-comms/
│   │   ├── AgentCommunicationCenter.tsx
│   │   ├── AgentMessageFeed.tsx
│   │   ├── AgentMessageCard.tsx
│   │   └── DataVisibilityPanel.tsx
│   ├── inbox/
│   │   ├── Inbox.tsx
│   │   ├── InboxList.tsx
│   │   ├── InboxItem.tsx
│   │   ├── ApprovalDetail.tsx
│   │   └── BeforeAfterComparison.tsx
│   ├── anomalies/
│   │   ├── AnomalyAlert.tsx
│   │   ├── AnomalyList.tsx
│   │   └── TrendVisualization.tsx
│   └── user-automations/
│       ├── AutomationBuilder.tsx
│       ├── AutomationList.tsx
│       └── TriggerActionConfig.tsx
```

### State Management

Use existing patterns (likely React Query or similar) for:
- Agent configurations
- Activity logs (with real-time updates)
- Inbox items (with optimistic updates)
- Notification preferences

---

## Dependencies

### External Services
- **HubSpot API** - CRM operations, OAuth
- **Slack API** - Notifications, interactive messages
- **Web Push API** - Desktop notifications

### Internal Dependencies
- Meeting service (for meeting context)
- User service (for permissions)
- Workspace service (for scoping)
- Existing notification engine

---

## Migration Strategy

### Phase 1: Foundation
1. Create new database tables
2. Implement basic GraphQL schema
3. Build agent executor service
4. Implement activity logging

### Phase 2: Onboarding
1. Build onboarding wizard UI
2. Implement preview/test functionality
3. Create template system
4. Connect to existing HubSpot integration

### Phase 3: Visibility
1. Build activity dashboard
2. Implement real-time subscriptions
3. Build agent communication center
4. Add filtering and search

### Phase 4: HITL
1. Build inbox service
2. Implement Slack integration
3. Build inbox UI
4. Add batch operations

### Phase 5: Proactive
1. Implement anomaly detection
2. Build alert UI
3. Add trend visualization
4. Tune detection rules

### Phase 6: Self-Service
1. Build user automation service
2. Create automation builder UI
3. Implement scoping/permissions
4. Add discovery features

---

## Testing Strategy

### Unit Tests
- Agent executor logic
- Confidence calculation
- Anomaly detection rules
- Permission scoping

### Integration Tests
- HubSpot API interactions
- Slack message delivery
- Real-time subscriptions
- Database operations

### E2E Tests
- Full onboarding flow
- HITL approval flow
- Anomaly detection and alerting
- User automation creation

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| HubSpot API rate limits | High | Implement batching, caching, exponential backoff |
| Real-time performance at scale | Medium | Use efficient subscriptions, pagination, lazy loading |
| Anomaly false positives | Medium | Tunable thresholds, user feedback loop, gradual rollout |
| Slack API changes | Low | Abstract Slack integration, monitor deprecations |
| Complex permission scoping | Medium | Clear data model, thorough testing, audit logging |

---

## Performance Considerations

- Activity logs: Index on workspace_id + created_at for efficient queries
- Inbox: Index on user_id + status for fast pending counts
- Real-time: Use efficient WebSocket connections, batch updates
- Anomaly detection: Run as background job, not blocking
- CRM API: Cache frequently accessed data, batch operations

---

## Security Considerations

- OAuth tokens stored securely (encrypted at rest)
- User automations scoped strictly to own data
- Admin vs user permissions clearly enforced
- Audit logging for all CRM operations
- Rate limiting on API endpoints

---

*Last updated: 2026-01-16*
*Engineer: TBD*
