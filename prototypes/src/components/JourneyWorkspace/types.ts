/**
 * Journey Workspace Types
 *
 * Data models for the Sales Rep Journey Workspace v1
 * Primary persona: Sales Reps
 * Core job: "When I'm managing active deals, I want a prioritized, context-rich
 * list of what to do next per account, so that I move deals forward faster
 * without manual CRM digging."
 */

// ============================================
// ENUMS & CONSTANTS
// ============================================

export type JourneyStage =
  | 'discovery'
  | 'qualification'
  | 'demo'
  | 'proposal'
  | 'negotiation'
  | 'closed_won'
  | 'closed_lost';

export type ActionType =
  | 'follow_up_email'
  | 'send_proposal'
  | 'schedule_meeting'
  | 'send_collateral'
  | 'internal_review'
  | 'contract_review'
  | 'custom';

export type ActionPriority = 'critical' | 'high' | 'medium' | 'low';

export type DealHealthStatus = 'strong' | 'healthy' | 'at_risk' | 'critical';

export type AIConfidence = 'high' | 'medium' | 'low';

export type AIContentState =
  | 'idle'
  | 'generating'
  | 'ready'
  | 'sending'
  | 'sent'
  | 'error';

// ============================================
// JOURNEY STAGE CONFIG
// ============================================

export const JOURNEY_STAGES: Record<
  JourneyStage,
  { label: string; order: number; color: string }
> = {
  discovery: { label: 'Discovery', order: 1, color: 'slate' },
  qualification: { label: 'Qualification', order: 2, color: 'blue' },
  demo: { label: 'Demo', order: 3, color: 'indigo' },
  proposal: { label: 'Proposal', order: 4, color: 'violet' },
  negotiation: { label: 'Negotiation', order: 5, color: 'purple' },
  closed_won: { label: 'Closed Won', order: 6, color: 'green' },
  closed_lost: { label: 'Closed Lost', order: 7, color: 'red' },
};

export const HEALTH_STATUS_CONFIG: Record<
  DealHealthStatus,
  { label: string; color: string; bgColor: string; icon: string }
> = {
  strong: {
    label: 'Strong',
    color: 'text-green-700',
    bgColor: 'bg-green-50',
    icon: '↗',
  },
  healthy: {
    label: 'Healthy',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    icon: '→',
  },
  at_risk: {
    label: 'At Risk',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50',
    icon: '↘',
  },
  critical: {
    label: 'Critical',
    color: 'text-red-700',
    bgColor: 'bg-red-50',
    icon: '↓',
  },
};

// ============================================
// CORE TYPES
// ============================================

export interface Contact {
  id: string;
  name: string;
  title: string;
  email: string;
  role: 'champion' | 'decision_maker' | 'influencer' | 'blocker' | 'unknown';
  lastContacted?: string;
  avatarUrl?: string;
}

export interface Milestone {
  id: string;
  name: string;
  description?: string;
  isCompleted: boolean;
  completedAt?: string;
  isBlocked?: boolean;
  blockerReason?: string;
}

export interface AIEvidence {
  type: 'quote' | 'data_point' | 'pattern' | 'signal';
  source: string; // e.g., "Call with Sarah (Jan 10)"
  content: string;
  timestamp?: string;
}

export interface SuggestedAction {
  id: string;
  type: ActionType;
  title: string;
  description: string;
  priority: ActionPriority;
  dueDate?: string;
  estimatedImpact: string;
  confidence: AIConfidence;
  evidence: AIEvidence[];
  aiDraft?: AIGeneratedContent;
  accountId: string;
  isCompleted: boolean;
  completedAt?: string;
}

export interface AIGeneratedContent {
  id: string;
  type: 'email' | 'one_pager' | 'meeting_agenda' | 'proposal_section';
  subject?: string;
  content: string;
  state: AIContentState;
  generatedAt?: string;
  editedByUser?: boolean;
  confidence: AIConfidence;
  sources: AIEvidence[];
}

export interface DealHealth {
  status: DealHealthStatus;
  score: number; // 0-100
  trend: 'improving' | 'stable' | 'declining';
  factors: {
    label: string;
    impact: 'positive' | 'negative' | 'neutral';
    detail: string;
  }[];
  lastUpdated: string;
  confidence: AIConfidence;
}

export interface Account {
  id: string;
  name: string;
  logoUrl?: string;
  industry?: string;
  dealValue: number;
  stage: JourneyStage;
  health: DealHealth;
  expectedCloseDate?: string;
  daysInStage: number;
  primaryContact?: Contact;
  contacts: Contact[];
  milestones: Milestone[];
  suggestedActions: SuggestedAction[];
  lastActivity?: {
    type: string;
    description: string;
    timestamp: string;
  };
  tags?: string[];
}

export interface WorkspaceStats {
  totalAccounts: number;
  atRiskCount: number;
  actionsToday: number;
  meetingsToday: number;
  pipelineValue: number;
  expectedCloseThisMonth: number;
}

// ============================================
// UI STATE TYPES
// ============================================

export interface WorkspaceState {
  accounts: Account[];
  stats: WorkspaceStats;
  isLoading: boolean;
  error?: string;
  selectedAccountId?: string;
  filterStage?: JourneyStage;
  filterHealth?: DealHealthStatus;
  sortBy: 'priority' | 'health' | 'value' | 'closeDate';
}

export interface ActionExecutionState {
  actionId: string;
  state: 'idle' | 'drafting' | 'reviewing' | 'executing' | 'completed' | 'error';
  error?: string;
}

// ============================================
// MOCK DATA
// ============================================

const mockEvidence: AIEvidence[] = [
  {
    type: 'quote',
    source: 'Call with Sarah (Jan 10)',
    content: '"We need to get this done before Q1 budget closes"',
    timestamp: '2026-01-10T14:30:00Z',
  },
  {
    type: 'signal',
    source: 'Email activity',
    content: 'Champion opened proposal 4 times in last 24hrs',
  },
];

const mockMilestones: Milestone[] = [
  { id: 'm1', name: 'Initial Discovery Call', isCompleted: true, completedAt: '2026-01-05' },
  { id: 'm2', name: 'Technical Requirements Gathered', isCompleted: true, completedAt: '2026-01-08' },
  { id: 'm3', name: 'Demo Completed', isCompleted: true, completedAt: '2026-01-10' },
  { id: 'm4', name: 'Proposal Sent', isCompleted: false, isBlocked: true, blockerReason: 'Waiting on legal review' },
  { id: 'm5', name: 'Contract Signed', isCompleted: false },
];

export const MOCK_ACCOUNTS: Account[] = [
  {
    id: 'acc-1',
    name: 'Acme Corporation',
    industry: 'Technology',
    dealValue: 85000,
    stage: 'proposal',
    daysInStage: 5,
    expectedCloseDate: '2026-01-31',
    health: {
      status: 'strong',
      score: 85,
      trend: 'improving',
      factors: [
        { label: 'Champion engaged', impact: 'positive', detail: '4 meetings in 2 weeks' },
        { label: 'Budget confirmed', impact: 'positive', detail: 'Q1 allocation approved' },
        { label: 'Competitor mentioned', impact: 'negative', detail: 'Evaluating Gong in parallel' },
      ],
      lastUpdated: '2026-01-14T09:00:00Z',
      confidence: 'high',
    },
    primaryContact: {
      id: 'c1',
      name: 'Sarah Chen',
      title: 'VP of Sales',
      email: 'sarah@acme.com',
      role: 'champion',
    },
    contacts: [],
    milestones: mockMilestones,
    suggestedActions: [
      {
        id: 'action-1',
        type: 'follow_up_email',
        title: 'Follow up on proposal',
        description: 'Sarah mentioned Q1 budget deadline. Send a reminder about timeline.',
        priority: 'critical',
        dueDate: '2026-01-14',
        estimatedImpact: 'High - could accelerate close by 2 weeks',
        confidence: 'high',
        evidence: mockEvidence,
        accountId: 'acc-1',
        isCompleted: false,
        aiDraft: {
          id: 'draft-1',
          type: 'email',
          subject: 'Quick question on Q1 timeline',
          content: `Hi Sarah,

I wanted to follow up on the proposal we sent last week. You mentioned needing to close this before Q1 budget finalizes—are you still targeting end of month?

If there's anything holding things up on your end (legal review, additional stakeholder buy-in, etc.), I'm happy to jump on a quick call to help move things forward.

Let me know what would be most helpful.

Best,
[Your name]`,
          state: 'ready',
          generatedAt: '2026-01-14T08:00:00Z',
          confidence: 'high',
          sources: mockEvidence,
        },
      },
    ],
    lastActivity: {
      type: 'email',
      description: 'Sarah opened proposal',
      timestamp: '2026-01-14T07:30:00Z',
    },
    tags: ['enterprise', 'Q1-close'],
  },
  {
    id: 'acc-2',
    name: 'TechStart Inc',
    industry: 'SaaS',
    dealValue: 42000,
    stage: 'demo',
    daysInStage: 12,
    expectedCloseDate: '2026-02-15',
    health: {
      status: 'at_risk',
      score: 45,
      trend: 'declining',
      factors: [
        { label: 'No response', impact: 'negative', detail: 'No reply to last 2 emails' },
        { label: 'Champion went quiet', impact: 'negative', detail: 'Last contact 12 days ago' },
        { label: 'Good demo feedback', impact: 'positive', detail: 'Team was engaged during demo' },
      ],
      lastUpdated: '2026-01-14T09:00:00Z',
      confidence: 'medium',
    },
    primaryContact: {
      id: 'c2',
      name: 'Mike Johnson',
      title: 'Sales Director',
      email: 'mike@techstart.io',
      role: 'champion',
    },
    contacts: [],
    milestones: [
      { id: 'm1', name: 'Discovery Call', isCompleted: true },
      { id: 'm2', name: 'Demo Completed', isCompleted: true },
      { id: 'm3', name: 'Proposal Sent', isCompleted: false },
    ],
    suggestedActions: [
      {
        id: 'action-2',
        type: 'follow_up_email',
        title: 'Re-engage champion',
        description: 'Mike has gone quiet after positive demo. Try a different approach.',
        priority: 'high',
        dueDate: '2026-01-14',
        estimatedImpact: 'Critical - deal at risk of going cold',
        confidence: 'medium',
        evidence: [
          {
            type: 'pattern',
            source: 'Activity analysis',
            content: 'Similar deals that went 10+ days without contact had 60% lower close rate',
          },
        ],
        accountId: 'acc-2',
        isCompleted: false,
      },
      {
        id: 'action-3',
        type: 'schedule_meeting',
        title: 'Try multi-threading',
        description: 'Reach out to another stakeholder who was engaged in the demo',
        priority: 'medium',
        confidence: 'low',
        estimatedImpact: 'Could unblock if champion is stuck internally',
        evidence: [
          {
            type: 'signal',
            source: 'Demo attendees',
            content: 'Lisa Park (RevOps) asked 5 questions during demo',
          },
        ],
        accountId: 'acc-2',
        isCompleted: false,
      },
    ],
    lastActivity: {
      type: 'email',
      description: 'Your follow-up email (no reply)',
      timestamp: '2026-01-02T10:00:00Z',
    },
    tags: ['mid-market'],
  },
  {
    id: 'acc-3',
    name: 'Global Finance Corp',
    industry: 'Financial Services',
    dealValue: 150000,
    stage: 'negotiation',
    daysInStage: 3,
    expectedCloseDate: '2026-01-20',
    health: {
      status: 'healthy',
      score: 72,
      trend: 'stable',
      factors: [
        { label: 'Legal in review', impact: 'neutral', detail: 'Standard contract review process' },
        { label: 'Multiple stakeholders aligned', impact: 'positive', detail: '3 decision makers engaged' },
        { label: 'Competing priorities', impact: 'negative', detail: 'Q4 close may push to Q1' },
      ],
      lastUpdated: '2026-01-14T09:00:00Z',
      confidence: 'high',
    },
    primaryContact: {
      id: 'c3',
      name: 'David Lee',
      title: 'CRO',
      email: 'david.lee@globalfinance.com',
      role: 'decision_maker',
    },
    contacts: [],
    milestones: [
      { id: 'm1', name: 'Discovery', isCompleted: true },
      { id: 'm2', name: 'Demo', isCompleted: true },
      { id: 'm3', name: 'Proposal', isCompleted: true },
      { id: 'm4', name: 'Legal Review', isCompleted: false },
      { id: 'm5', name: 'Contract Signed', isCompleted: false },
    ],
    suggestedActions: [
      {
        id: 'action-4',
        type: 'contract_review',
        title: 'Check on legal status',
        description: 'Contract has been with legal for 3 days. Standard turnaround is 5 days.',
        priority: 'medium',
        dueDate: '2026-01-16',
        estimatedImpact: 'Keep deal on track for Jan close',
        confidence: 'high',
        evidence: [],
        accountId: 'acc-3',
        isCompleted: false,
      },
    ],
    lastActivity: {
      type: 'call',
      description: 'Call with David re: contract terms',
      timestamp: '2026-01-11T15:00:00Z',
    },
    tags: ['enterprise', 'strategic'],
  },
];

export const MOCK_STATS: WorkspaceStats = {
  totalAccounts: 12,
  atRiskCount: 3,
  actionsToday: 5,
  meetingsToday: 3,
  pipelineValue: 847000,
  expectedCloseThisMonth: 320000,
};
