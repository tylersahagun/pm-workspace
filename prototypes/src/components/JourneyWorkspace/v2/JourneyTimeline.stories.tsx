import type { Meta, StoryObj } from '@storybook/react';
import { JourneyTimeline } from './JourneyTimeline';
import { JourneyLane, JourneyPathOption, JourneyStage } from './types';

const meta: Meta = {
  title: 'Prototypes/JourneyWorkspace/Timeline Variants',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Journey Map Variants

Explores three timeline patterns inspired by the visual research:

- **Linear timeline**: stage-based, minimal, touchpoints + signals
- **Journey grid**: storyboard lanes per stage (story, actions, signals)
- **Pathways**: alternative outcomes with probabilities and risks
        `,
      },
    },
  },
};

export default meta;

const stages: JourneyStage[] = [
  {
    id: 'stage-1',
    label: 'Discovery',
    summary: 'Pain is clear but business impact isn’t quantified.',
    status: 'complete',
    owner: 'Rebecca',
    touchpoints: [
      {
        id: 'tp-1',
        label: 'Discovery call',
        dateLabel: 'Jan 4',
        type: 'call',
        summary: 'Shared audit pain and compliance gaps.',
      },
    ],
    signals: [
      {
        id: 'sig-1',
        label: 'Pain articulated',
        detail: 'Security team confirms manual evidence burden.',
        type: 'momentum',
        confidence: 'high',
      },
    ],
  },
  {
    id: 'stage-2',
    label: 'Value Alignment',
    summary: 'Impact anchor missing for Q1 priorities.',
    status: 'current',
    owner: 'Rebecca',
    touchpoints: [
      {
        id: 'tp-2',
        label: 'Demo + Q1 discussion',
        dateLabel: 'Jan 12',
        type: 'demo',
        summary: 'Asked for ROI tie-in to audit roadmap.',
      },
    ],
    signals: [
      {
        id: 'sig-2',
        label: 'Impact unclear',
        detail: 'No metric or timeline captured.',
        type: 'risk',
        confidence: 'medium',
      },
      {
        id: 'sig-3',
        label: 'Momentum intact',
        detail: 'Asked for pricing range and next steps.',
        type: 'momentum',
        confidence: 'medium',
      },
    ],
  },
  {
    id: 'stage-3',
    label: 'Stakeholder Alignment',
    summary: 'Legal and Finance are not yet engaged.',
    status: 'next',
    touchpoints: [
      {
        id: 'tp-3',
        label: 'Internal alignment',
        dateLabel: 'Jan 14',
        type: 'meeting',
        summary: 'Plan to invite legal + finance.',
      },
    ],
    signals: [
      {
        id: 'sig-4',
        label: 'Stakeholders missing',
        detail: 'No legal contact logged in CRM.',
        type: 'pain',
        confidence: 'medium',
      },
    ],
  },
  {
    id: 'stage-4',
    label: 'Pilot Readiness',
    summary: 'Pilot scope is drafted but timing is open.',
    status: 'upcoming',
  },
  {
    id: 'stage-5',
    label: 'Commit',
    summary: 'Commercial review depends on pilot results.',
    status: 'upcoming',
  },
];

const lanes: JourneyLane[] = [
  {
    id: 'lane-story',
    label: 'Story',
    description: 'Narrative snapshot per stage.',
    items: [
      {
        id: 'lane-story-1',
        stageId: 'stage-1',
        label: 'Pain is validated, impact still abstract.',
      },
      {
        id: 'lane-story-2',
        stageId: 'stage-2',
        label: 'Need to connect pain to Q1 security outcomes.',
        tone: 'warning',
      },
      {
        id: 'lane-story-3',
        stageId: 'stage-3',
        label: 'Stakeholders missing; alignment risk rising.',
        tone: 'warning',
      },
    ],
  },
  {
    id: 'lane-actions',
    label: 'Actions',
    description: 'Next steps tied to the stage.',
    items: [
      {
        id: 'lane-actions-1',
        stageId: 'stage-2',
        label: 'Draft impact email with Q1 metric.',
        detail: 'Ask for a 15-min reconvene to confirm.',
        tone: 'positive',
      },
      {
        id: 'lane-actions-2',
        stageId: 'stage-3',
        label: 'Invite legal + finance to alignment call.',
        detail: 'Provide pilot scope and compliance docs.',
      },
    ],
  },
  {
    id: 'lane-touchpoints',
    label: 'Touchpoints',
    description: 'Key moments in the relationship.',
    items: [
      {
        id: 'lane-touchpoints-1',
        stageId: 'stage-1',
        label: 'Discovery call',
        detail: 'Audit pain + compliance risk discussed.',
      },
      {
        id: 'lane-touchpoints-2',
        stageId: 'stage-2',
        label: 'Demo',
        detail: 'Requested ROI tie to Q1 plan.',
      },
      {
        id: 'lane-touchpoints-3',
        stageId: 'stage-3',
        label: 'Internal alignment',
        detail: 'Plan for stakeholder outreach.',
      },
    ],
  },
  {
    id: 'lane-emotions',
    label: 'Customer sentiment',
    description: 'Confidence and risk signals.',
    items: [
      {
        id: 'lane-emotions-1',
        stageId: 'stage-2',
        label: 'Interested, but needs evidence.',
        tone: 'warning',
      },
      {
        id: 'lane-emotions-2',
        stageId: 'stage-3',
        label: 'Cautious without legal buy-in.',
        tone: 'warning',
      },
    ],
  },
];

const paths: JourneyPathOption[] = [
  {
    id: 'path-1',
    label: 'Momentum path',
    description: 'Impact anchored quickly, legal joins the next call.',
    probability: 0.58,
    risk: 'Requires a strong impact story within 5 days.',
    steps: ['Send impact email', 'Confirm reconvene', 'Invite legal + finance'],
  },
  {
    id: 'path-2',
    label: 'Slow alignment path',
    description: 'Stakeholder onboarding stretches the timeline.',
    probability: 0.28,
    risk: 'Momentum dips if reconvene slips past Q1 planning.',
    steps: ['Share pilot scope', 'Stakeholder prep', 'Schedule alignment'],
  },
  {
    id: 'path-3',
    label: 'Risk recovery path',
    description: 'Champion quiet; need to reframe value urgency.',
    probability: 0.14,
    risk: 'Deal stalls if urgency is not restored this week.',
    steps: ['Reframe pain', 'Escalate to exec sponsor', 'Reset timeline'],
  },
];

export const LinearTimeline: StoryObj = {
  name: 'Linear Timeline',
  render: () => (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <JourneyTimeline title="Journey Timeline" stages={stages} variant="linear" />
      </div>
    </div>
  ),
};

export const JourneyGrid: StoryObj = {
  name: 'Journey Grid',
  render: () => (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <JourneyTimeline title="Journey Map Grid" stages={stages} lanes={lanes} variant="grid" />
      </div>
    </div>
  ),
};

export const Pathways: StoryObj = {
  name: 'Pathways View',
  render: () => (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <JourneyTimeline title="Likely Paths" paths={paths} variant="paths" />
      </div>
    </div>
  ),
};
