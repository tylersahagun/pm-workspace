import type { Meta, StoryObj } from '@storybook/react';
import { JourneyWorkspaceV2 } from './JourneyWorkspaceV2';
import { DealWorkspace } from './DealWorkspace';
import {
  ActionPlanItem,
  ChannelContext,
  ChatContextItem,
  JourneyEvent,
  JourneyRequirement,
  JourneyLane,
  JourneySnapshot,
  JourneyStage,
  JourneyStep,
  JourneyTimelineConfig,
  MemoryAnchor,
  WorkspaceArtifact,
} from './types';

const meta: Meta = {
  title: 'Prototypes/JourneyWorkspace/V2',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Journey Workspace v2 (Option B Iteration)

**Focus:** Narrative-first hierarchy with contextual signals and product channel grounding.

**Primary changes:**
- Snapshot → Health → Action Plan stack
- Context-driven signals (why it matters + what to do)
- Product channel panel with review status
- Dedicated deal workspace with memory anchor + artifacts
- Chat context preloaded before first prompt
- Event timeline (horizontal + vertical) with hover context
        `,
      },
    },
  },
};

export default meta;

const snapshot: JourneySnapshot = {
  title: 'Value impact is not anchored to Osano’s Q1 outcomes',
  summary:
    'Rebecca understands the pain but hasn’t linked it to a Q1 security outcome, and there is no agreed reconvene date.',
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
  summary:
    'Rebecca confirmed pain, but the team never captured an impact metric or a reconvene date.',
  lastUpdated: 'Jan 14, 2026',
};

const requirements: JourneyRequirement[] = [
  {
    id: 'req-1',
    label: 'Pain Acuteness',
    status: 'on_track',
    summary: 'They have articulated pain but not its cost.',
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
    summary: 'Interest is strong but impact is still abstract.',
    confidence: 'medium',
    evidence: [
      {
        type: 'signal',
        source: 'Demo chat',
        content: 'Asked for pricing without tying it to savings.',
      },
    ],
  },
  {
    id: 'req-3',
    label: 'Stakeholder Alignment',
    status: 'blocked',
    summary: 'Legal and Finance are not yet engaged.',
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
    summary: 'No agreed next step or timing; cadence is unclear.',
    confidence: 'medium',
    evidence: [
      {
        type: 'signal',
        source: 'Follow-up log',
        content: 'Last reply 12 days ago; no scheduled reconvene.',
      },
    ],
  },
  {
    id: 'req-5',
    label: 'Implementation Readiness',
    status: 'on_track',
    summary: 'Security team is ready to pilot in February.',
    confidence: 'high',
    evidence: [
      {
        type: 'quote',
        source: 'Email from Rebecca (Jan 10)',
        content: 'We can start a pilot the second week of February.',
      },
    ],
  },
  {
    id: 'req-6',
    label: 'Commercial Readiness',
    status: 'unknown',
    summary: 'Budget window unclear after Q1 planning.',
    confidence: 'low',
    evidence: [
      {
        type: 'pattern',
        source: 'Forecast trend',
        content: 'Similar accounts delayed purchase without budget clarity.',
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
        content: 'We still need to see how this helps us hit Q1 security goals.',
      },
    ],
  },
  {
    id: 'plan-2',
    title: 'Confirm reconvene timing',
    description:
      'Ask whether silence is expected and lock a next step in the decision cycle.',
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
    description: 'Ask Rebecca to loop in legal and finance for a 15-minute alignment call.',
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

const journeyPath: JourneyStep[] = [
  {
    id: 'step-1',
    label: 'Confirm impact in Q1 plan',
    timeframe: 'This week',
    rationale: 'Deals close faster when impact is tied to active initiatives.',
  },
  {
    id: 'step-2',
    label: 'Align legal + finance early',
    timeframe: 'Next 7-10 days',
    rationale: 'Multi-stakeholder approval is the highest risk for this channel.',
  },
  {
    id: 'step-3',
    label: 'Pilot scope validation',
    timeframe: 'Weeks 2-3',
    rationale: 'Security teams want a bounded pilot before signing.',
  },
  {
    id: 'step-4',
    label: 'Executive checkpoint',
    timeframe: 'Week 3',
    rationale: 'CFO approval is required once savings are established.',
  },
  {
    id: 'step-5',
    label: 'Commercial review',
    timeframe: 'Week 4',
    rationale: 'Finalize package after legal and security sign-off.',
  },
];

const timelineStages: JourneyStage[] = [
  {
    id: 'timeline-1',
    label: 'Discovery',
    summary: 'Pain is clear but impact isn’t quantified.',
    status: 'complete',
    touchpoints: [
      {
        id: 'tp-1',
        label: 'Discovery call',
        dateLabel: 'Jan 4',
        type: 'call',
        summary: 'Audit pain confirmed; impact metrics missing.',
      },
    ],
  },
  {
    id: 'timeline-2',
    label: 'Value Alignment',
    summary: 'Impact anchor missing for Q1 priorities.',
    status: 'current',
    touchpoints: [
      {
        id: 'tp-2',
        label: 'Demo + Q1 discussion',
        dateLabel: 'Jan 12',
        type: 'demo',
        summary: 'Asked for ROI tie-in to security roadmap.',
      },
    ],
    signals: [
      {
        id: 'sig-1',
        label: 'Impact unclear',
        detail: 'No metric or timeline captured.',
        type: 'risk',
        confidence: 'medium',
      },
    ],
  },
  {
    id: 'timeline-3',
    label: 'Stakeholder Alignment',
    summary: 'Legal and Finance not engaged yet.',
    status: 'next',
  },
  {
    id: 'timeline-4',
    label: 'Pilot Readiness',
    summary: 'Pilot scope drafted; timing open.',
    status: 'upcoming',
  },
];

const timelineLanes: JourneyLane[] = [
  {
    id: 'lane-story',
    label: 'Story',
    items: [
      {
        id: 'lane-story-1',
        stageId: 'timeline-2',
        label: 'Need to anchor value to Q1 outcomes.',
        tone: 'warning',
      },
      {
        id: 'lane-story-2',
        stageId: 'timeline-3',
        label: 'Stakeholders missing; alignment risk rising.',
        tone: 'warning',
      },
    ],
  },
  {
    id: 'lane-actions',
    label: 'Actions',
    items: [
      {
        id: 'lane-actions-1',
        stageId: 'timeline-2',
        label: 'Draft impact email with Q1 metric.',
        detail: 'Ask for reconvene timing.',
        tone: 'positive',
      },
      {
        id: 'lane-actions-2',
        stageId: 'timeline-3',
        label: 'Invite legal + finance to alignment call.',
      },
    ],
  },
];

const journeyTimeline: JourneyTimelineConfig = {
  title: 'Journey Map (Linear)',
  variant: 'linear',
  stages: timelineStages,
  lanes: timelineLanes,
};

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
      'Rebecca aligned on pain, but asked for proof of Q1 impact and requested a concrete timeline.',
    source: 'Call summary (Jan 12)',
    tags: ['Q1 goals', 'impact anchor'],
  },
  {
    id: 'ctx-2',
    title: 'Competitive context',
    description:
      'Osano is comparing against Gong; wins depend on proving audit speed and compliance clarity.',
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

const events: JourneyEvent[] = [
  {
    id: 'evt-1',
    type: 'call',
    title: 'Demo with Rebecca',
    timestamp: '2026-01-12T15:00:00Z',
    summary: 'Discussed pain, asked for impact proof, and requested pricing range.',
    source: 'Call log',
    participants: ['Rebecca Torres', 'Tyler S.'],
  },
  {
    id: 'evt-2',
    type: 'email',
    title: 'Follow-up recap sent',
    timestamp: '2026-01-13T10:30:00Z',
    summary: 'Sent recap with draft impact framing; no reply yet.',
    source: 'Email activity',
  },
  {
    id: 'evt-3',
    type: 'ticket',
    title: 'Security review request',
    timestamp: '2026-01-14T09:05:00Z',
    summary: 'Requested documentation for SOC2 and pen test coverage.',
    source: 'Support ticket',
  },
  {
    id: 'evt-4',
    type: 'meeting',
    title: 'Internal alignment',
    timestamp: '2026-01-14T13:00:00Z',
    summary: 'Aligned on legal and finance engagement steps.',
    source: 'Internal meeting',
  },
];

const artifacts: WorkspaceArtifact[] = [
  {
    id: 'artifact-1',
    title: 'Q1 Impact Email Draft',
    type: 'Email Draft',
    summary: 'Draft tying audit delays to Q1 goals with a clear CTA.',
    updatedAt: 'Today at 9:10 AM',
  },
  {
    id: 'artifact-2',
    title: 'ROI One-Pager',
    type: 'One-Pager',
    summary: 'Estimated time savings and compliance risk reduction.',
    updatedAt: 'Yesterday at 4:22 PM',
  },
];

export const V2_Dashboard: StoryObj = {
  name: 'V2_Dashboard',
  render: () => (
    <JourneyWorkspaceV2
      accountName="Osano"
      stageLabel="Late discovery"
      lastUpdated="Jan 14, 2026"
      snapshot={snapshot}
      requirements={requirements}
      journeyTimeline={journeyTimeline}
      actionPlan={actionPlan}
      journeyPath={journeyPath}
      channelContext={channelContext}
      chatContext={chatContext}
      events={events}
      memoryAnchor={memoryAnchor}
    />
  ),
};

export const V2_Loading: StoryObj = {
  name: 'V2_Loading',
  render: () => (
    <JourneyWorkspaceV2
      accountName="Osano"
      stageLabel="Late discovery"
      lastUpdated="Jan 14, 2026"
      state="loading"
    />
  ),
};

export const V2_Error: StoryObj = {
  name: 'V2_Error',
  render: () => (
    <JourneyWorkspaceV2
      accountName="Osano"
      stageLabel="Late discovery"
      lastUpdated="Jan 14, 2026"
      state="error"
      errorMessage="Could not load journey context. Check the data source and retry."
    />
  ),
};

export const V2_Success: StoryObj = {
  name: 'V2_Success',
  render: () => (
    <JourneyWorkspaceV2
      accountName="Osano"
      stageLabel="Late discovery"
      lastUpdated="Jan 14, 2026"
      snapshot={snapshot}
      requirements={requirements}
      actionPlan={actionPlan}
      journeyPath={journeyPath}
      channelContext={channelContext}
      chatContext={chatContext}
      events={events}
      memoryAnchor={memoryAnchor}
      state="success"
      statusMessage="Email draft saved and linked to the deal. You can undo this for 5 minutes."
    />
  ),
};

export const V2_Empty: StoryObj = {
  name: 'V2_Empty',
  render: () => (
    <JourneyWorkspaceV2
      accountName="Osano"
      stageLabel="Late discovery"
      lastUpdated="Jan 14, 2026"
      state="empty"
    />
  ),
};

export const V2_LowConfidence: StoryObj = {
  name: 'V2_LowConfidence',
  render: () => (
    <JourneyWorkspaceV2
      accountName="Osano"
      stageLabel="Late discovery"
      lastUpdated="Jan 14, 2026"
      snapshot={{ ...snapshot, confidence: 'low' }}
      requirements={requirements.map((item) => ({ ...item, confidence: 'low' }))}
      actionPlan={actionPlan.map((item) => ({ ...item, confidence: 'low' }))}
      journeyPath={journeyPath}
      channelContext={channelContext}
      chatContext={chatContext}
      events={events}
      memoryAnchor={memoryAnchor}
    />
  ),
};

export const V2_DealWorkspace: StoryObj = {
  name: 'V2_DealWorkspace',
  render: () => (
    <DealWorkspace
      accountName="Osano"
      memoryAnchor={memoryAnchor}
      lastUpdated="Jan 14, 2026"
      prompts={[
        'Draft a Q1 impact email',
        'Generate a one-page ROI summary',
        'Prep questions for legal alignment',
        'Summarize call into an internal note',
      ]}
      artifacts={artifacts}
      channelContext={channelContext}
      chatContext={chatContext}
    />
  ),
};

export const V2_EventTimeline_Vertical: StoryObj = {
  name: 'V2_EventTimeline_Vertical',
  render: () => (
    <div className="max-w-2xl mx-auto p-6">
      <JourneyWorkspaceV2
        accountName="Osano"
        stageLabel="Late discovery"
        lastUpdated="Jan 14, 2026"
        events={events}
        channelContext={channelContext}
        chatContext={chatContext}
      />
    </div>
  ),
};

export const V2_EventTimeline_Horizontal: StoryObj = {
  name: 'V2_EventTimeline_Horizontal',
  render: () => (
    <div className="max-w-4xl mx-auto p-6">
      <JourneyWorkspaceV2
        accountName="Osano"
        stageLabel="Late discovery"
        lastUpdated="Jan 14, 2026"
        snapshot={snapshot}
        requirements={requirements}
        actionPlan={actionPlan}
        events={events}
        channelContext={channelContext}
        chatContext={chatContext}
        memoryAnchor={memoryAnchor}
      />
    </div>
  ),
};
