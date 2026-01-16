// Rep Workspace V2 Types
// Based on PRD from 2026-01-16 planning session

export interface Meeting {
  id: string;
  title: string;
  company: string;
  date: string;
  duration: number; // minutes
  type: 'discovery' | 'demo' | 'negotiation' | 'followup' | 'internal';
  hasRecording: boolean;
  hasInsights: boolean;
  participants: string[];
}

export interface ActionItem {
  id: string;
  title: string;
  company?: string;
  dueDate?: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  type: 'follow_up' | 'update_crm' | 'send_proposal' | 'schedule_meeting' | 'other';
  source: 'ai' | 'manual';
  isCompleted: boolean;
  meetingId?: string;
}

export interface Account {
  id: string;
  name: string;
  dealValue: number;
  stage: string;
  meetingCount: number;
  lastActivity: string;
  health: 'strong' | 'healthy' | 'at_risk' | 'critical';
  nextStep?: string;
}

export interface AgentActivity {
  id: string;
  timestamp: string;
  type: 'crm_update' | 'note_created' | 'task_created' | 'field_updated';
  description: string;
  status: 'completed' | 'pending' | 'failed';
  confidence?: 'high' | 'medium' | 'low';
  company?: string;
  field?: string;
  oldValue?: string;
  newValue?: string;
}

export interface RepStats {
  totalAccounts: number;
  activeDeals: number;
  pipelineValue: number;
  actionsToday: number;
  meetingsThisWeek: number;
  dealsAtRisk: number;
}

// Mock Data
export const MOCK_MEETINGS: Meeting[] = [
  {
    id: '1',
    title: 'Discovery Call',
    company: 'Acme Corp',
    date: '2026-01-16T10:00:00',
    duration: 45,
    type: 'discovery',
    hasRecording: true,
    hasInsights: true,
    participants: ['John Smith', 'Sarah Johnson'],
  },
  {
    id: '2',
    title: 'Product Demo',
    company: 'Widget Inc',
    date: '2026-01-16T14:00:00',
    duration: 60,
    type: 'demo',
    hasRecording: true,
    hasInsights: true,
    participants: ['Mike Chen', 'Lisa Wong'],
  },
  {
    id: '3',
    title: 'Contract Negotiation',
    company: 'TechStart',
    date: '2026-01-15T11:00:00',
    duration: 30,
    type: 'negotiation',
    hasRecording: true,
    hasInsights: true,
    participants: ['David Park'],
  },
];

export const MOCK_ACTIONS: ActionItem[] = [
  {
    id: '1',
    title: 'Follow up with John about pricing concerns',
    company: 'Acme Corp',
    dueDate: '2026-01-17',
    priority: 'high',
    type: 'follow_up',
    source: 'ai',
    isCompleted: false,
    meetingId: '1',
  },
  {
    id: '2',
    title: 'Send proposal document',
    company: 'Widget Inc',
    dueDate: '2026-01-16',
    priority: 'critical',
    type: 'send_proposal',
    source: 'ai',
    isCompleted: false,
    meetingId: '2',
  },
  {
    id: '3',
    title: 'Update deal stage in HubSpot',
    company: 'TechStart',
    priority: 'medium',
    type: 'update_crm',
    source: 'ai',
    isCompleted: false,
    meetingId: '3',
  },
];

export const MOCK_ACCOUNTS: Account[] = [
  {
    id: '1',
    name: 'Acme Corp',
    dealValue: 50000,
    stage: 'Discovery',
    meetingCount: 12,
    lastActivity: '2026-01-16',
    health: 'healthy',
    nextStep: 'Send pricing proposal',
  },
  {
    id: '2',
    name: 'Widget Inc',
    dealValue: 25000,
    stage: 'Demo',
    meetingCount: 8,
    lastActivity: '2026-01-16',
    health: 'strong',
    nextStep: 'Schedule technical review',
  },
  {
    id: '3',
    name: 'TechStart',
    dealValue: 75000,
    stage: 'Negotiation',
    meetingCount: 5,
    lastActivity: '2026-01-15',
    health: 'at_risk',
    nextStep: 'Address contract concerns',
  },
];

export const MOCK_AGENT_ACTIVITY: AgentActivity[] = [
  {
    id: '1',
    timestamp: '2026-01-16T10:45:00',
    type: 'crm_update',
    description: 'Updated deal stage to "Negotiation"',
    status: 'completed',
    confidence: 'high',
    company: 'Acme Corp',
    field: 'Deal Stage',
    oldValue: 'Discovery',
    newValue: 'Negotiation',
  },
  {
    id: '2',
    timestamp: '2026-01-16T10:46:00',
    type: 'field_updated',
    description: 'Added next step: "Send contract"',
    status: 'completed',
    confidence: 'high',
    company: 'Acme Corp',
    field: 'Next Step',
    newValue: 'Send contract',
  },
  {
    id: '3',
    timestamp: '2026-01-16T14:30:00',
    type: 'crm_update',
    description: 'Update probability to 60%',
    status: 'pending',
    confidence: 'medium',
    company: 'Widget Inc',
    field: 'Probability',
    oldValue: '40%',
    newValue: '60%',
  },
];

export const MOCK_STATS: RepStats = {
  totalAccounts: 24,
  activeDeals: 12,
  pipelineValue: 450000,
  actionsToday: 5,
  meetingsThisWeek: 8,
  dealsAtRisk: 3,
};

// Health colors
export const HEALTH_COLORS = {
  strong: 'text-emerald-600 bg-emerald-50',
  healthy: 'text-blue-600 bg-blue-50',
  at_risk: 'text-amber-600 bg-amber-50',
  critical: 'text-red-600 bg-red-50',
};

// Priority colors
export const PRIORITY_COLORS = {
  critical: 'text-red-700 bg-red-100 border-red-200',
  high: 'text-amber-700 bg-amber-100 border-amber-200',
  medium: 'text-blue-700 bg-blue-100 border-blue-200',
  low: 'text-gray-700 bg-gray-100 border-gray-200',
};
