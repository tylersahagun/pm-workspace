// CRM Experience End-to-End Types
// Based on user story brain dump 2026-01-16

export type OnboardingStep =
  | 'connect'
  | 'education'
  | 'scope'
  | 'templates'
  | 'configure'
  | 'test'
  | 'activate'
  | 'complete';

export type CallType =
  | 'discovery'
  | 'demo'
  | 'negotiation'
  | 'onboarding'
  | 'check_in'
  | 'renewal';

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  callTypes: CallType[];
  fields: string[];
  isRecommended: boolean;
  confidence: number; // How confident we are this template works well
}

export interface FieldPreview {
  fieldName: string;
  fieldLabel: string;
  currentValue: string | null;
  newValue: string;
  confidence: number;
  source: string; // What part of the transcript this came from
}

export interface TestPreviewResult {
  matchedRecord: {
    id: string;
    name: string;
    type: 'deal' | 'contact' | 'company';
    hubspotUrl: string;
  } | null;
  matchConfidence: number;
  fieldsToUpdate: FieldPreview[];
  warnings: string[];
  overallConfidence: number;
}

export interface OnboardingState {
  currentStep: OnboardingStep;
  crmConnected: boolean;
  crmType: 'hubspot' | 'salesforce' | null;
  workspaceId: string | null;
  selectedCallType: CallType | null;
  enabledTemplates: string[];
  testResult: TestPreviewResult | null;
  isActivated: boolean;
}

// Activity Dashboard Types
export type ActivityStatus = 'success' | 'failed' | 'pending' | 'rejected';

export interface ActivityLogEntry {
  id: string;
  timestamp: Date;
  agentName: string;
  meetingTitle: string;
  meetingId: string;
  crmRecordName: string;
  crmRecordType: 'deal' | 'contact' | 'company';
  crmRecordId: string;
  fieldsUpdated: number;
  status: ActivityStatus;
  confidence: number;
  userId: string;
  userName: string;
  errorMessage?: string;
}

export interface DashboardStats {
  totalRunsToday: number;
  successRate: number;
  pendingApprovals: number;
  activeAgents: number;
  avgConfidence: number;
}

export type HealthStatus = 'healthy' | 'warning' | 'error';

export interface AnomalyAlert {
  id: string;
  type: 'high_failure_rate' | 'low_confidence_trend' | 'unusual_pattern' | 'connection_issue';
  severity: 'info' | 'warning' | 'error';
  title: string;
  description: string;
  timestamp: Date;
  data?: Record<string, unknown>;
  isAcknowledged: boolean;
}

// Agent Communication Center Types
export type AgentMessageType = 'info' | 'action_required' | 'success' | 'error';

export interface AgentMessage {
  id: string;
  type: AgentMessageType;
  title: string;
  body: string;
  timestamp: Date;
  meetingTitle?: string;
  meetingId?: string;
  crmRecordName?: string;
  crmRecordId?: string;
  actionRequired?: boolean;
  actionId?: string; // Links to inbox item
}

// Inbox Types
export type InboxItemStatus = 'pending' | 'approved' | 'rejected' | 'expired';

export interface InboxItem {
  id: string;
  title: string;
  description: string;
  meetingTitle: string;
  meetingId: string;
  meetingTimestamp: Date;
  crmRecordName: string;
  crmRecordType: 'deal' | 'contact' | 'company';
  crmRecordId: string;
  fieldsToUpdate: FieldPreview[];
  confidence: number;
  status: InboxItemStatus;
  createdAt: Date;
  resolvedAt?: Date;
}

// Mock Data
export const MOCK_WORKFLOW_TEMPLATES: WorkflowTemplate[] = [
  {
    id: 'discovery-basics',
    name: 'Discovery Call Basics',
    description: 'Update deal stage, next steps, and key qualification data after discovery calls.',
    callTypes: ['discovery'],
    fields: ['dealstage', 'next_step', 'next_step_date', 'probability_to_close'],
    isRecommended: true,
    confidence: 0.92,
  },
  {
    id: 'deal-risk',
    name: 'Deal Risk Assessment',
    description: 'Capture why deals might succeed or fail based on conversation signals.',
    callTypes: ['discovery', 'demo', 'negotiation'],
    fields: ['why_will_buy', 'why_will_fail', 'deal_risk_assessment'],
    isRecommended: true,
    confidence: 0.88,
  },
  {
    id: 'buyer-engagement',
    name: 'Buyer Engagement Tracking',
    description: 'Track buyer involvement and engagement levels throughout the sales cycle.',
    callTypes: ['discovery', 'demo', 'negotiation'],
    fields: ['buyer_involvement', 'sales_skill_score'],
    isRecommended: false,
    confidence: 0.85,
  },
  {
    id: 'close-date-intel',
    name: 'Close Date Intelligence',
    description: 'Update close date probability and context based on buyer signals.',
    callTypes: ['negotiation'],
    fields: ['closedate', 'probability_to_close', 'close_date_probability_context'],
    isRecommended: false,
    confidence: 0.90,
  },
];

export const MOCK_TEST_PREVIEW: TestPreviewResult = {
  matchedRecord: {
    id: 'deal-123',
    name: 'Acme Corp Expansion',
    type: 'deal',
    hubspotUrl: 'https://app.hubspot.com/contacts/123/deal/456',
  },
  matchConfidence: 0.94,
  fieldsToUpdate: [
    {
      fieldName: 'dealstage',
      fieldLabel: 'Deal Stage',
      currentValue: 'Meeting Scheduled',
      newValue: 'Proposal',
      confidence: 0.92,
      source: '"We\'re ready to move forward with a proposal..."',
    },
    {
      fieldName: 'next_step',
      fieldLabel: 'Next Step',
      currentValue: 'Schedule demo',
      newValue: 'Send proposal and confirm stakeholder list',
      confidence: 0.88,
      source: '"Can you send over the proposal by Friday?"',
    },
    {
      fieldName: 'next_step_date',
      fieldLabel: 'Next Step Date',
      currentValue: null,
      newValue: '2026-01-24',
      confidence: 0.95,
      source: '"...by Friday" (Jan 24, 2026)',
    },
    {
      fieldName: 'probability_to_close',
      fieldLabel: 'Probability to Close',
      currentValue: '40%',
      newValue: '72%',
      confidence: 0.78,
      source: 'Based on positive buying signals and timeline commitment',
    },
  ],
  warnings: [],
  overallConfidence: 0.88,
};

export const MOCK_ACTIVITY_LOGS: ActivityLogEntry[] = [
  {
    id: 'log-1',
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 min ago
    agentName: 'Discovery Call Basics',
    meetingTitle: 'Discovery Call - Acme Corp',
    meetingId: 'meeting-1',
    crmRecordName: 'Acme Corp Expansion',
    crmRecordType: 'deal',
    crmRecordId: 'deal-123',
    fieldsUpdated: 4,
    status: 'success',
    confidence: 0.88,
    userId: 'user-1',
    userName: 'Sarah Chen',
  },
  {
    id: 'log-2',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
    agentName: 'Deal Risk Assessment',
    meetingTitle: 'Demo - TechStart Inc',
    meetingId: 'meeting-2',
    crmRecordName: 'TechStart Enterprise Deal',
    crmRecordType: 'deal',
    crmRecordId: 'deal-456',
    fieldsUpdated: 3,
    status: 'pending',
    confidence: 0.65,
    userId: 'user-2',
    userName: 'Mike Johnson',
  },
  {
    id: 'log-3',
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    agentName: 'Discovery Call Basics',
    meetingTitle: 'Intro Call - GlobalTech',
    meetingId: 'meeting-3',
    crmRecordName: 'GlobalTech Pilot',
    crmRecordType: 'deal',
    crmRecordId: 'deal-789',
    fieldsUpdated: 0,
    status: 'failed',
    confidence: 0,
    userId: 'user-1',
    userName: 'Sarah Chen',
    errorMessage: 'Could not match to existing deal in HubSpot',
  },
];

export const MOCK_DASHBOARD_STATS: DashboardStats = {
  totalRunsToday: 24,
  successRate: 0.92,
  pendingApprovals: 3,
  activeAgents: 4,
  avgConfidence: 0.85,
};

export const MOCK_ANOMALIES: AnomalyAlert[] = [
  {
    id: 'anomaly-1',
    type: 'low_confidence_trend',
    severity: 'warning',
    title: 'Confidence scores trending down',
    description: 'Average confidence has dropped from 88% to 72% over the past 24 hours. This may indicate changes in meeting formats or CRM data quality.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    isAcknowledged: false,
  },
];

export const MOCK_AGENT_MESSAGES: AgentMessage[] = [
  {
    id: 'msg-1',
    type: 'success',
    title: 'CRM Updated',
    body: 'I updated 4 fields on Acme Corp Expansion after your discovery call.',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    meetingTitle: 'Discovery Call - Acme Corp',
    meetingId: 'meeting-1',
    crmRecordName: 'Acme Corp Expansion',
    crmRecordId: 'deal-123',
  },
  {
    id: 'msg-2',
    type: 'action_required',
    title: 'Approval Needed',
    body: 'I found a potential match for TechStart but I\'m not fully confident. Can you verify?',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    meetingTitle: 'Demo - TechStart Inc',
    meetingId: 'meeting-2',
    crmRecordName: 'TechStart Enterprise Deal',
    crmRecordId: 'deal-456',
    actionRequired: true,
    actionId: 'inbox-2',
  },
  {
    id: 'msg-3',
    type: 'error',
    title: 'Couldn\'t Find Match',
    body: 'I couldn\'t find a matching deal for your GlobalTech call. Would you like me to create a new deal?',
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    meetingTitle: 'Intro Call - GlobalTech',
    meetingId: 'meeting-3',
    actionRequired: true,
    actionId: 'inbox-3',
  },
];

export const MOCK_INBOX_ITEMS: InboxItem[] = [
  {
    id: 'inbox-2',
    title: 'Verify Deal Match',
    description: 'Multiple potential matches found. Please confirm the correct deal.',
    meetingTitle: 'Demo - TechStart Inc',
    meetingId: 'meeting-2',
    meetingTimestamp: new Date(Date.now() - 1000 * 60 * 45),
    crmRecordName: 'TechStart Enterprise Deal',
    crmRecordType: 'deal',
    crmRecordId: 'deal-456',
    fieldsToUpdate: [
      {
        fieldName: 'dealstage',
        fieldLabel: 'Deal Stage',
        currentValue: 'Qualification',
        newValue: 'Meeting Scheduled',
        confidence: 0.72,
        source: '"Let\'s schedule a follow-up next week"',
      },
      {
        fieldName: 'next_step',
        fieldLabel: 'Next Step',
        currentValue: null,
        newValue: 'Technical deep-dive with engineering team',
        confidence: 0.85,
        source: '"We need to get our engineers on a call"',
      },
    ],
    confidence: 0.65,
    status: 'pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: 'inbox-3',
    title: 'Create New Deal?',
    description: 'No matching deal found. Should I create a new one?',
    meetingTitle: 'Intro Call - GlobalTech',
    meetingId: 'meeting-3',
    meetingTimestamp: new Date(Date.now() - 1000 * 60 * 75),
    crmRecordName: 'GlobalTech (New)',
    crmRecordType: 'deal',
    crmRecordId: '',
    fieldsToUpdate: [
      {
        fieldName: 'dealname',
        fieldLabel: 'Deal Name',
        currentValue: null,
        newValue: 'GlobalTech - Initial Opportunity',
        confidence: 0.90,
        source: 'Company name from meeting',
      },
      {
        fieldName: 'dealstage',
        fieldLabel: 'Deal Stage',
        currentValue: null,
        newValue: 'Qualification',
        confidence: 0.95,
        source: 'First meeting = Qualification stage',
      },
    ],
    confidence: 0.82,
    status: 'pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 60),
  },
];
