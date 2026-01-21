// ============================================
// REP WORKSPACE V4 - Types
// Maple Billing Feedback Iteration (2026-01-21)
// ============================================

// --------------------------------------------
// Core Data Types
// --------------------------------------------

export type DealStage = 
  | 'discovery' 
  | 'qualification' 
  | 'demo' 
  | 'proposal' 
  | 'negotiation' 
  | 'closing';

export type HealthStatus = 'strong' | 'healthy' | 'at_risk' | 'critical';

export type ActionPriority = 'critical' | 'high' | 'medium' | 'low';

export type ActionSource = 'ai' | 'manual' | 'crm';

export interface Account {
  id: string;
  name: string;
  stage: DealStage;
  dealValue: number;
  health: HealthStatus;
  meetingCount: number;
  lastMeetingDate: string;
  nextStep?: string;
  expectedCloseDate?: string;
  keyContacts: Contact[];
  pendingActions: number;
}

export interface Contact {
  id: string;
  name: string;
  role: string;
  email?: string;
}

export interface Meeting {
  id: string;
  title: string;
  company: string;
  companyId: string;
  date: string;
  duration: number;
  type: 'discovery' | 'demo' | 'negotiation' | 'followup' | 'internal';
  hasInsights: boolean;
  hasRecording: boolean;
}

export interface ActionItem {
  id: string;
  title: string;
  company?: string;
  companyId?: string;
  priority: ActionPriority;
  source: ActionSource;
  dueDate?: string;
  isCompleted: boolean;
  aiReasoning?: string;
}

export interface AgentActivity {
  id: string;
  description: string;
  company?: string;
  companyId?: string;
  status: 'completed' | 'pending' | 'failed';
  confidence?: 'high' | 'medium' | 'low';
  timestamp: string;
  field?: string;
  oldValue?: string;
  newValue?: string;
}

// --------------------------------------------
// Self-Coaching Types (Solo Rep Feature)
// --------------------------------------------

export interface CoachingInsight {
  id: string;
  type: 'question_pattern' | 'objection_trend' | 'improvement_area' | 'strength';
  title: string;
  description: string;
  frequency?: number;
  trend?: 'up' | 'down' | 'stable';
  callCount?: number;
  examples?: string[];
}

export interface PerformanceTrend {
  metric: string;
  current: number;
  previous: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
}

export interface TopQuestion {
  question: string;
  frequency: number;
  callCount: number;
  avgHandlingScore?: number;
}

export interface SelfCoachingData {
  topQuestions: TopQuestion[];
  performanceTrends: PerformanceTrend[];
  insights: CoachingInsight[];
  weeklyHighlight?: string;
  improvementSuggestion?: string;
}

// --------------------------------------------
// Deal Workspace Types (Per-Deal Chat)
// --------------------------------------------

export interface DealContext {
  account: Account;
  recentMeetings: Meeting[];
  keyInsights: string[];
  openActions: ActionItem[];
  recentActivity: AgentActivity[];
  suggestedQuestions: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  sources?: string[];
}

// --------------------------------------------
// Dashboard Types
// --------------------------------------------

export type ViewMode = 'list' | 'pipeline';

export interface RepStats {
  activeDeals: number;
  pipelineValue: number;
  actionsToday: number;
  meetingsThisWeek: number;
  dealsAtRisk: number;
  totalAccounts: number;
  closingThisMonth: number;
}

export interface RepWorkspaceV4Props {
  accounts: Account[];
  meetings: Meeting[];
  actions: ActionItem[];
  agentActivity: AgentActivity[];
  stats: RepStats;
  selfCoaching: SelfCoachingData;
  userName?: string;
  defaultView?: ViewMode;
  onActionComplete?: (id: string) => void;
  onActionDismiss?: (id: string) => void;
  onMeetingClick?: (id: string) => void;
  onAccountClick?: (id: string) => void;
  onActivityApprove?: (id: string) => void;
  onActivityReject?: (id: string) => void;
  onChatSend?: (accountId: string, message: string) => void;
}

// --------------------------------------------
// Stage Configuration
// --------------------------------------------

export const STAGE_CONFIG: Record<DealStage, { label: string; color: string; bgColor: string }> = {
  discovery: { label: 'Discovery', color: 'text-blue-700', bgColor: 'bg-blue-50' },
  qualification: { label: 'Qualification', color: 'text-indigo-700', bgColor: 'bg-indigo-50' },
  demo: { label: 'Demo', color: 'text-purple-700', bgColor: 'bg-purple-50' },
  proposal: { label: 'Proposal', color: 'text-amber-700', bgColor: 'bg-amber-50' },
  negotiation: { label: 'Negotiation', color: 'text-orange-700', bgColor: 'bg-orange-50' },
  closing: { label: 'Closing', color: 'text-emerald-700', bgColor: 'bg-emerald-50' },
};

export const HEALTH_CONFIG: Record<HealthStatus, { label: string; color: string; bgColor: string; icon: string }> = {
  strong: { label: 'Strong', color: 'text-emerald-700', bgColor: 'bg-emerald-100', icon: '🟢' },
  healthy: { label: 'Healthy', color: 'text-green-700', bgColor: 'bg-green-100', icon: '🟢' },
  at_risk: { label: 'At Risk', color: 'text-amber-700', bgColor: 'bg-amber-100', icon: '🟡' },
  critical: { label: 'Critical', color: 'text-red-700', bgColor: 'bg-red-100', icon: '🔴' },
};

export const PRIORITY_CONFIG: Record<ActionPriority, { label: string; color: string; bgColor: string }> = {
  critical: { label: 'Critical', color: 'text-red-700', bgColor: 'bg-red-100' },
  high: { label: 'High', color: 'text-orange-700', bgColor: 'bg-orange-100' },
  medium: { label: 'Medium', color: 'text-amber-700', bgColor: 'bg-amber-100' },
  low: { label: 'Low', color: 'text-gray-600', bgColor: 'bg-gray-100' },
};

// --------------------------------------------
// Mock Data
// --------------------------------------------

export const MOCK_ACCOUNTS: Account[] = [
  {
    id: '1',
    name: 'Acme Corp',
    stage: 'discovery',
    dealValue: 50000,
    health: 'healthy',
    meetingCount: 12,
    lastMeetingDate: '2026-01-20',
    nextStep: 'Send follow-up proposal',
    expectedCloseDate: '2026-02-15',
    keyContacts: [
      { id: 'c1', name: 'Sarah Chen', role: 'VP Sales' },
      { id: 'c2', name: 'Mike Johnson', role: 'RevOps Lead' },
    ],
    pendingActions: 3,
  },
  {
    id: '2',
    name: 'Widget Inc',
    stage: 'demo',
    dealValue: 25000,
    health: 'at_risk',
    meetingCount: 8,
    lastMeetingDate: '2026-01-18',
    nextStep: 'Schedule technical deep-dive',
    expectedCloseDate: '2026-02-28',
    keyContacts: [
      { id: 'c3', name: 'Alex Rivera', role: 'CTO' },
    ],
    pendingActions: 1,
  },
  {
    id: '3',
    name: 'Tech Co',
    stage: 'negotiation',
    dealValue: 75000,
    health: 'strong',
    meetingCount: 5,
    lastMeetingDate: '2026-01-19',
    nextStep: 'Send contract',
    expectedCloseDate: '2026-01-31',
    keyContacts: [
      { id: 'c4', name: 'Jordan Lee', role: 'CEO' },
      { id: 'c5', name: 'Pat Murphy', role: 'CFO' },
    ],
    pendingActions: 2,
  },
  {
    id: '4',
    name: 'DataFlow',
    stage: 'closing',
    dealValue: 100000,
    health: 'strong',
    meetingCount: 15,
    lastMeetingDate: '2026-01-21',
    nextStep: 'Final signature',
    expectedCloseDate: '2026-01-25',
    keyContacts: [
      { id: 'c6', name: 'Casey Kim', role: 'VP Operations' },
    ],
    pendingActions: 0,
  },
  {
    id: '5',
    name: 'StartupXYZ',
    stage: 'qualification',
    dealValue: 15000,
    health: 'critical',
    meetingCount: 2,
    lastMeetingDate: '2026-01-10',
    nextStep: 'Re-engage champion',
    expectedCloseDate: '2026-03-15',
    keyContacts: [
      { id: 'c7', name: 'Sam Taylor', role: 'Founder' },
    ],
    pendingActions: 4,
  },
];

export const MOCK_MEETINGS: Meeting[] = [
  { id: 'm1', title: 'Discovery Call', company: 'Acme Corp', companyId: '1', date: '2026-01-20T14:00:00', duration: 45, type: 'discovery', hasInsights: true, hasRecording: true },
  { id: 'm2', title: 'Product Demo', company: 'Widget Inc', companyId: '2', date: '2026-01-18T10:00:00', duration: 60, type: 'demo', hasInsights: true, hasRecording: true },
  { id: 'm3', title: 'Contract Review', company: 'Tech Co', companyId: '3', date: '2026-01-19T15:30:00', duration: 30, type: 'negotiation', hasInsights: true, hasRecording: true },
  { id: 'm4', title: 'Final Terms', company: 'DataFlow', companyId: '4', date: '2026-01-21T09:00:00', duration: 25, type: 'negotiation', hasInsights: false, hasRecording: true },
];

export const MOCK_ACTIONS: ActionItem[] = [
  { id: 'a1', title: 'Send follow-up proposal to Sarah', company: 'Acme Corp', companyId: '1', priority: 'high', source: 'ai', dueDate: '2026-01-22', isCompleted: false, aiReasoning: 'Based on positive signals in last call' },
  { id: 'a2', title: 'Schedule technical deep-dive with Alex', company: 'Widget Inc', companyId: '2', priority: 'critical', source: 'ai', dueDate: '2026-01-21', isCompleted: false, aiReasoning: 'Champion going quiet - need re-engagement' },
  { id: 'a3', title: 'Prepare contract for Tech Co', company: 'Tech Co', companyId: '3', priority: 'high', source: 'manual', dueDate: '2026-01-23', isCompleted: false },
  { id: 'a4', title: 'Re-engage Sam at StartupXYZ', company: 'StartupXYZ', companyId: '5', priority: 'critical', source: 'ai', dueDate: '2026-01-21', isCompleted: false, aiReasoning: 'No response in 11 days - deal at risk' },
  { id: 'a5', title: 'Update CRM with pricing discussion notes', company: 'Acme Corp', companyId: '1', priority: 'medium', source: 'crm', isCompleted: false },
];

export const MOCK_AGENT_ACTIVITY: AgentActivity[] = [
  { id: 'ag1', description: 'Updated deal stage to Negotiation', company: 'Tech Co', companyId: '3', status: 'completed', confidence: 'high', timestamp: '2026-01-21T10:30:00', field: 'Deal Stage', oldValue: 'Demo', newValue: 'Negotiation' },
  { id: 'ag2', description: 'Added next step: Send contract', company: 'Tech Co', companyId: '3', status: 'completed', confidence: 'high', timestamp: '2026-01-21T10:31:00' },
  { id: 'ag3', description: 'Update deal probability to 90%', company: 'DataFlow', companyId: '4', status: 'pending', confidence: 'medium', timestamp: '2026-01-21T11:00:00', field: 'Probability', oldValue: '75%', newValue: '90%' },
  { id: 'ag4', description: 'Mark champion as unresponsive', company: 'StartupXYZ', companyId: '5', status: 'pending', confidence: 'low', timestamp: '2026-01-21T11:15:00' },
];

export const MOCK_STATS: RepStats = {
  activeDeals: 5,
  pipelineValue: 265000,
  actionsToday: 4,
  meetingsThisWeek: 8,
  dealsAtRisk: 2,
  totalAccounts: 5,
  closingThisMonth: 175000,
};

export const MOCK_SELF_COACHING: SelfCoachingData = {
  topQuestions: [
    { question: "What's the pricing?", frequency: 12, callCount: 8, avgHandlingScore: 7.2 },
    { question: "How does it integrate with HubSpot?", frequency: 8, callCount: 6, avgHandlingScore: 8.5 },
    { question: "What's the implementation timeline?", frequency: 6, callCount: 5, avgHandlingScore: 6.8 },
    { question: "Can we do a pilot first?", frequency: 5, callCount: 4, avgHandlingScore: 7.0 },
    { question: "Who else is using this?", frequency: 4, callCount: 4, avgHandlingScore: 8.2 },
  ],
  performanceTrends: [
    { metric: 'Discovery depth', current: 8.2, previous: 7.1, change: 15, trend: 'up' },
    { metric: 'Objection handling', current: 7.5, previous: 7.8, change: -4, trend: 'down' },
    { metric: 'Value articulation', current: 8.0, previous: 7.5, change: 7, trend: 'up' },
    { metric: 'Next step clarity', current: 8.5, previous: 8.3, change: 2, trend: 'stable' },
  ],
  insights: [
    { id: 'i1', type: 'improvement_area', title: 'Anchor value before pricing', description: 'You mentioned pricing 3 times without first establishing value. Try the value-first framework.', frequency: 3 },
    { id: 'i2', type: 'strength', title: 'Strong discovery questions', description: 'Your discovery calls have 15% more depth than last week. Keep using open-ended questions.', trend: 'up' },
    { id: 'i3', type: 'objection_trend', title: 'Integration concerns rising', description: 'HubSpot integration questions came up in 6 of your last 8 calls. Consider preparing a demo.', frequency: 6, callCount: 8 },
  ],
  weeklyHighlight: "You closed 2 deals this week! Your negotiation calls are running 20% shorter with better outcomes.",
  improvementSuggestion: "Try asking 'What would success look like for you?' earlier in discovery calls.",
};
