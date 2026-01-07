import type { Meta, StoryObj } from '@storybook/react';
import { JourneySnapshotCard } from './JourneySnapshot';
import { JourneyHealthGrid } from './JourneyHealthGrid';
import { ActionPlan } from './ActionPlan';
import { DealWorkspace } from './DealWorkspace';
import { ActionPlanItem, JourneyRequirement, JourneySnapshot } from './types';

const meta: Meta = {
  title: 'Prototypes/JourneyWorkspace/Iterations',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Journey Workspace Iterations

These iterations respond directly to prototype feedback:

- Narrative-first hierarchy before actions
- Journey health visibility with confidence + evidence
- Context-driven alerts instead of generic signals
- Dedicated deal workspace for deep work with AI and artifacts
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

const planItems: ActionPlanItem[] = [
  {
    id: 'plan-1',
    title: 'Anchor Q1 impact in next email',
    description:
      'Draft a note that ties audit delays to Q1 security goals and asks for confirmation.',
    impact: 'Restores urgency and clarifies value',
    confidence: 'high',
    dueDate: '2026-01-15',
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
    description:
      'Ask Rebecca to loop in legal and finance for a 15-minute alignment call.',
    impact: 'Unblocks procurement path',
    confidence: 'medium',
    evidence: [
      {
        type: 'data_point',
        source: 'CRM notes',
        content: 'No legal or finance stakeholders listed yet.',
      },
    ],
  },
];

export const IterationV2_JourneySnapshotAndPlan: StoryObj = {
  name: 'Iteration v2: Snapshot + Health + Plan',
  render: () => (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-6 space-y-6">
        <JourneySnapshotCard snapshot={snapshot} />
        <JourneyHealthGrid requirements={requirements} />
        <ActionPlan items={planItems} />
      </div>
    </div>
  ),
};

export const IterationV3_DealWorkspace: StoryObj = {
  name: 'Iteration v3: Deal Workspace',
  render: () => (
    <DealWorkspace
      accountName="Osano"
      summary="Rebecca confirmed pain but hasn’t tied it to business impact. Legal and finance are still missing from the thread."
      lastUpdated="Jan 14, 2026"
      prompts={[
        'Draft a Q1 impact email',
        'Generate a one-page ROI summary',
        'Prep questions for legal alignment',
        'Summarize call into an internal note',
      ]}
      artifacts={[
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
      ]}
      channelContext={{
        channelName: 'Security Compliance',
        productFit:
          'Best for teams scaling audits who need faster visibility and fewer manual reviews.',
        personas: ['Security Lead', 'RevOps', 'CFO'],
        messaging: [
          'Reduce audit drag without adding headcount.',
          'Prove security impact in the first 30 days.',
          'Build stakeholder alignment early with shared visibility.',
        ],
        lastReviewed: 'Jan 10, 2026',
        reviewStatus: 'needs_review',
        pendingUpdates: 2,
      }}
    />
  ),
};
