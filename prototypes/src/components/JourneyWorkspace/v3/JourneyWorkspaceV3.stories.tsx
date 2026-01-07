import type { Meta, StoryObj } from '@storybook/react';
import { JourneyWorkspaceV3 } from './JourneyWorkspaceV3';
import {
  ActionPlanItem,
  ChannelContext,
  ChatContextItem,
  JourneyRequirement,
  JourneySnapshot,
  MemoryAnchor,
  OrchestrationLane,
  OrchestrationStage,
  SentimentBloom,
} from './types';
import { OrchestrationTimeline } from './OrchestrationTimeline';

const meta: Meta = {
  title: 'Prototypes/JourneyWorkspace/V3',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Journey Workspace v3 (Orchestration Engine)

**Focus:** Central Truth Line + Gatekeeper stages with sentiment blooms, branching paths, and evidence chips.

**Primary changes:**
- Spine-based journey timeline with multi-actor lanes
- Golden path line weight + moment-of-truth flags
- Hover crosshair and stage accordion behavior
- Side-drawer drill-down for CRM + transcript access
        `,
      },
    },
  },
};

export default meta;

const snapshot: JourneySnapshot = {
  title: 'Value impact is not anchored to Q1 security outcomes',
  summary:
    'Rebecca understands the pain but has not tied it to Q1 targets, and there is no agreed reconvene date.',
  consequence:
    'Without an impact anchor and a next step, the deal can stall even if interest is high.',
  confidence: 'medium',
  lastUpdated: '2026-01-14T09:00:00Z',
  evidence: [
    {
      type: 'quote',
      source: 'Call with Rebecca (Jan 12)',
      content: 'We still need to see how this helps us hit our Q1 security goals.',
    },
    {
      type: 'signal',
      source: 'Follow-up log',
      content: 'No reconvene date captured after demo.',
    },
    {
      type: 'pattern',
      source: 'Pipeline analysis',
      content: 'Deals without impact anchors drop 40% after proposal stage.',
    },
  ],
};

const memoryAnchor: MemoryAnchor = {
  summary: 'Rebecca confirmed pain, but impact metrics and reconvene date are missing.',
  lastUpdated: 'Jan 14, 2026',
};

const requirements: JourneyRequirement[] = [
  {
    id: 'req-1',
    label: 'Pain Acuteness',
    status: 'on_track',
    summary: 'Pain articulated, cost still fuzzy.',
    confidence: 'high',
    evidence: [
      {
        type: 'quote',
        source: 'Call with Rebecca (Jan 12)',
        content: 'Our audits are slipping because the team is overloaded.',
      },
    ],
  },
  {
    id: 'req-2',
    label: 'Value Conviction',
    status: 'watch',
    summary: 'Impact is still abstract.',
    confidence: 'medium',
    evidence: [
      {
        type: 'signal',
        source: 'Demo chat',
        content: 'Asked for pricing without tying to savings.',
      },
    ],
  },
  {
    id: 'req-3',
    label: 'Stakeholder Alignment',
    status: 'blocked',
    summary: 'Legal and Finance not engaged.',
    confidence: 'medium',
    evidence: [
      {
        type: 'data_point',
        source: 'CRM notes',
        content: 'No legal contact added; finance not scheduled.',
      },
    ],
  },
  {
    id: 'req-4',
    label: 'Communication Cadence',
    status: 'watch',
    summary: 'No agreed next step or timing.',
    confidence: 'medium',
    evidence: [
      {
        type: 'signal',
        source: 'Follow-up log',
        content: 'Last reply 12 days ago; no scheduled reconvene.',
      },
    ],
  },
];

const actionPlan: ActionPlanItem[] = [
  {
    id: 'plan-1',
    title: 'Anchor Q1 impact in next email',
    description: 'Tie audit delays to Q1 security goals and ask for confirmation.',
    impact: 'Restores urgency and clarifies value',
    confidence: 'high',
    dueDate: '2026-01-15',
    status: 'ready',
    evidence: [
      {
        type: 'quote',
        source: 'Call with Rebecca (Jan 12)',
        content: 'We still need to see how this helps us hit our Q1 security goals.',
      },
    ],
  },
  {
    id: 'plan-2',
    title: 'Confirm reconvene timing',
    description: 'Ask whether silence is expected and lock the next step.',
    impact: 'Prevents silent stall and clarifies momentum',
    confidence: 'medium',
    dueDate: '2026-01-16',
    status: 'in_progress',
    evidence: [
      {
        type: 'signal',
        source: 'Follow-up log',
        content: 'No next-step date captured after demo.',
      },
    ],
  },
  {
    id: 'plan-3',
    title: 'Schedule legal + finance alignment',
    description: 'Invite legal and finance to a 15-minute alignment call.',
    impact: 'Unblocks procurement path',
    confidence: 'medium',
    dueDate: '2026-01-18',
    status: 'ready',
    evidence: [
      {
        type: 'data_point',
        source: 'CRM notes',
        content: 'No legal or finance stakeholders listed yet.',
      },
    ],
  },
];

const stages: OrchestrationStage[] = [
  {
    id: 'stage-1',
    label: 'Onboarding',
    status: 'complete',
    timeRange: 'Dec 01 - Dec 20',
    summary: 'Kickoff completed with strong engagement and clear pain articulation.',
  },
  {
    id: 'stage-2',
    label: 'Activation',
    status: 'current',
    timeRange: 'Dec 21 - Jan 14',
    summary: 'Value impact needs a stronger anchor to Q1 goals.',
  },
  {
    id: 'stage-3',
    label: 'Value Proof',
    status: 'next',
    timeRange: 'Jan 15 - Feb 02',
    summary: 'Pilot plan drafted, needs stakeholder alignment.',
  },
  {
    id: 'stage-4',
    label: 'Expansion',
    status: 'upcoming',
    timeRange: 'Feb 03 - Mar 15',
    summary: 'Expansion depends on proof of audit impact.',
  },
];

const lanes: OrchestrationLane[] = [
  {
    id: 'lane-customer',
    label: 'Customer Lane',
    actor: 'customer',
    items: [
      {
        id: 'cust-1',
        stageId: 'stage-1',
        label: 'Kickoff call held',
        detail: 'Shared audit pain and compliance goals.',
        timestamp: '2025-12-05T15:00:00Z',
        actor: 'customer',
        type: 'touchpoint',
        state: 'complete',
        weight: 3,
        isGoldenPath: true,
        evidence: [
          { id: 'chip-1', label: 'CSAT', value: '5/5', type: 'metric' },
          { id: 'chip-2', label: 'Intent', value: 'High', type: 'signal' },
        ],
      },
      {
        id: 'cust-2',
        stageId: 'stage-2',
        label: 'Demo reaction: impact unclear',
        detail: 'Asked for Q1 security tie-in.',
        timestamp: '2026-01-12T16:00:00Z',
        actor: 'customer',
        type: 'decision',
        state: 'current',
        weight: 4,
        isGoldenPath: true,
        isMomentOfTruth: true,
        evidence: [
          { id: 'chip-3', label: 'Quote', value: 'Q1 tie-in', type: 'note' },
          { id: 'chip-4', label: 'Risk', value: 'Medium', type: 'signal' },
        ],
      },
    ],
  },
  {
    id: 'lane-csm',
    label: 'Success Manager',
    actor: 'success_manager',
    items: [
      {
        id: 'csm-1',
        stageId: 'stage-2',
        label: 'Draft impact email',
        detail: 'Connect audit delays to Q1 outcomes.',
        timestamp: '2026-01-13T09:30:00Z',
        actor: 'success_manager',
        type: 'milestone',
        state: 'current',
        weight: 3,
        isGoldenPath: true,
        evidence: [
          { id: 'chip-5', label: 'Email', value: 'Drafted', type: 'note' },
          { id: 'chip-6', label: 'CTA', value: 'Reconvene', type: 'signal' },
        ],
      },
      {
        id: 'csm-2',
        stageId: 'stage-3',
        label: 'Stakeholder alignment call',
        detail: 'Legal + Finance aligned on pilot scope.',
        timestamp: '2026-01-18T17:00:00Z',
        actor: 'success_manager',
        type: 'touchpoint',
        state: 'next',
        weight: 3,
        isGoldenPath: true,
      },
    ],
  },
  {
    id: 'lane-automation',
    label: 'Product / Automation',
    actor: 'automation',
    items: [
      {
        id: 'auto-1',
        stageId: 'stage-1',
        label: 'Usage spike detected',
        detail: 'Daily active usage up 28%.',
        timestamp: '2025-12-10T20:00:00Z',
        actor: 'automation',
        type: 'signal',
        state: 'complete',
        weight: 2,
        automated: true,
      },
      {
        id: 'auto-2',
        stageId: 'stage-2',
        label: 'Automated impact email',
        detail: 'Sent baseline impact summary.',
        timestamp: '2026-01-12T16:00:00Z',
        actor: 'automation',
        type: 'signal',
        state: 'current',
        weight: 2,
        automated: true,
      },
      {
        id: 'auto-3',
        stageId: 'stage-3',
        label: 'Pilot usage watch',
        detail: 'Monitoring readiness signals.',
        timestamp: '2026-01-20T12:00:00Z',
        actor: 'automation',
        type: 'signal',
        state: 'upcoming',
        weight: 1,
        automated: true,
      },
    ],
  },
];

const blooms: SentimentBloom[] = [
  { id: 'bloom-1', stageId: 'stage-1', sentiment: 'positive', intensity: 7 },
  { id: 'bloom-2', stageId: 'stage-2', sentiment: 'warning', intensity: 6 },
  { id: 'bloom-3', stageId: 'stage-3', sentiment: 'neutral', intensity: 4 },
  { id: 'bloom-4', stageId: 'stage-4', sentiment: 'critical', intensity: 3 },
];

const channelContext: ChannelContext = {
  channelName: 'Security Compliance',
  productFit: 'Best for teams scaling audits who need faster visibility and fewer manual reviews.',
  personas: ['Security Lead', 'RevOps', 'CFO'],
  pains: ['Audit delays', 'Manual evidence collection', 'Lack of compliance visibility'],
  messaging: [
    'Reduce audit drag without adding headcount.',
    'Prove security impact in the first 30 days.',
    'Build stakeholder alignment early with shared visibility.',
  ],
  lastReviewed: 'Jan 10, 2026',
  reviewStatus: 'needs_review',
  pendingUpdates: 2,
};

const chatContext: ChatContextItem[] = [
  {
    id: 'ctx-1',
    title: 'Last call summary',
    description:
      'Rebecca aligned on pain but asked for proof of Q1 impact and requested a concrete timeline.',
    source: 'Call summary (Jan 12)',
    tags: ['Q1 goals', 'impact anchor'],
  },
  {
    id: 'ctx-2',
    title: 'Competitive context',
    description:
      'Osano is comparing against Gong; wins depend on audit speed and compliance clarity.',
    source: 'Product channel notes',
    tags: ['Gong', 'security compliance'],
  },
  {
    id: 'ctx-3',
    title: 'Stakeholder map',
    description:
      'Legal and Finance are not yet engaged. Rebecca owns the pilot evaluation.',
    source: 'CRM notes',
    tags: ['stakeholders', 'alignment'],
  },
];

export const V3_Dashboard: StoryObj = {
  name: 'V3_Dashboard',
  render: () => (
    <JourneyWorkspaceV3
      accountName="Osano"
      stageLabel="Activation"
      lastUpdated="Jan 14, 2026"
      snapshot={snapshot}
      requirements={requirements}
      actionPlan={actionPlan}
      stages={stages}
      lanes={lanes}
      blooms={blooms}
      channelContext={channelContext}
      chatContext={chatContext}
      memoryAnchor={memoryAnchor}
    />
  ),
};

export const V3_Loading: StoryObj = {
  name: 'V3_Loading',
  render: () => (
    <JourneyWorkspaceV3
      accountName="Osano"
      stageLabel="Activation"
      lastUpdated="Jan 14, 2026"
      state="loading"
    />
  ),
};

export const V3_Error: StoryObj = {
  name: 'V3_Error',
  render: () => (
    <JourneyWorkspaceV3
      accountName="Osano"
      stageLabel="Activation"
      lastUpdated="Jan 14, 2026"
      state="error"
      errorMessage="Could not load orchestration signals. Check data sources and retry."
    />
  ),
};

export const V3_Success: StoryObj = {
  name: 'V3_Success',
  render: () => (
    <JourneyWorkspaceV3
      accountName="Osano"
      stageLabel="Activation"
      lastUpdated="Jan 14, 2026"
      snapshot={snapshot}
      requirements={requirements}
      actionPlan={actionPlan}
      stages={stages}
      lanes={lanes}
      blooms={blooms}
      channelContext={channelContext}
      chatContext={chatContext}
      memoryAnchor={memoryAnchor}
      state="success"
      statusMessage="Impact email draft saved and linked to the account."
    />
  ),
};

export const V3_Empty: StoryObj = {
  name: 'V3_Empty',
  render: () => (
    <JourneyWorkspaceV3
      accountName="Osano"
      stageLabel="Activation"
      lastUpdated="Jan 14, 2026"
      state="empty"
    />
  ),
};

export const V3_LowConfidence: StoryObj = {
  name: 'V3_LowConfidence',
  render: () => (
    <JourneyWorkspaceV3
      accountName="Osano"
      stageLabel="Activation"
      lastUpdated="Jan 14, 2026"
      snapshot={{ ...snapshot, confidence: 'low' }}
      requirements={requirements.map((item) => ({ ...item, confidence: 'low' }))}
      actionPlan={actionPlan.map((item) => ({ ...item, confidence: 'low' }))}
      stages={stages}
      lanes={lanes}
      blooms={blooms}
      channelContext={channelContext}
      chatContext={chatContext}
      memoryAnchor={memoryAnchor}
      state="low_confidence"
    />
  ),
};

export const V3_Orchestration_Vertical: StoryObj = {
  name: 'V3_Orchestration_Vertical',
  render: () => (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-5xl mx-auto">
        <OrchestrationTimeline
          title="Orchestration Deep Dive"
          orientation="vertical"
          stages={stages}
          lanes={lanes}
          blooms={blooms}
        />
      </div>
    </div>
  ),
};
