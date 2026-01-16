import type { Meta, StoryObj } from '@storybook/react';
import { RepWorkspaceDashboard } from './RepWorkspaceDashboard';
import {
  MOCK_MEETINGS,
  MOCK_ACTIONS,
  MOCK_ACCOUNTS,
  MOCK_AGENT_ACTIVITY,
  MOCK_STATS,
} from './types';

const meta: Meta<typeof RepWorkspaceDashboard> = {
  title: 'Prototypes/RepWorkspaceV2',
  component: RepWorkspaceDashboard,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Rep Workspace V2

**Created:** 2026-01-16 (Roadmap Planning Session)
**Owners:** Skylar/Tyler

## Purpose

A dedicated dashboard experience for sales representatives. It serves as the primary interface for reps to understand their customer interactions, see AI-generated insights, and take action on follow-ups.

## Key Features

1. **Action Items Panel** - AI-suggested and manual tasks, prioritized
2. **Recent Meetings** - Quick access to meeting recordings and insights
3. **My Accounts** - Pipeline view with health indicators
4. **Agent Activity** - What AI agents have done/need approval for
5. **Global Chat** - FAB to access AI assistant

## Design Decisions

- Two-column layout on desktop, stacked on mobile
- Action items prominent (left column)
- Agent activity visible but not overwhelming
- Global chat accessible but not intrusive
- Stats bar provides at-a-glance pipeline health

## Success Metrics

- Rep daily active usage: >70%
- Time to find key information: <30 sec
- Actions taken from workspace: Tracked

## Feedback Plan

1. Show to internal reps (Eileen)
2. Gather feedback
3. Iterate
4. Customer testing
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof RepWorkspaceDashboard>;

// ============================================
// Default Story
// ============================================
export const Default: Story = {
  name: 'Default Dashboard',
  args: {
    meetings: MOCK_MEETINGS,
    actions: MOCK_ACTIONS,
    accounts: MOCK_ACCOUNTS,
    agentActivity: MOCK_AGENT_ACTIVITY,
    stats: MOCK_STATS,
    userName: 'Eileen',
  },
};

// ============================================
// With Pending Approvals
// ============================================
export const WithPendingApprovals: Story = {
  name: 'With Pending Approvals',
  args: {
    ...Default.args,
    agentActivity: [
      ...MOCK_AGENT_ACTIVITY,
      {
        id: '4',
        timestamp: '2026-01-16T15:00:00',
        type: 'crm_update',
        description: 'Update deal value to $80,000',
        status: 'pending',
        confidence: 'medium',
        company: 'TechStart',
        field: 'Deal Value',
        oldValue: '$75,000',
        newValue: '$80,000',
      },
      {
        id: '5',
        timestamp: '2026-01-16T15:05:00',
        type: 'field_updated',
        description: 'Set close date to Feb 15',
        status: 'pending',
        confidence: 'low',
        company: 'Widget Inc',
        field: 'Close Date',
        newValue: '2026-02-15',
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the dashboard with multiple pending agent approvals requiring user action.',
      },
    },
  },
};

// ============================================
// At Risk Accounts
// ============================================
export const AtRiskAccounts: Story = {
  name: 'With At-Risk Accounts',
  args: {
    ...Default.args,
    accounts: [
      ...MOCK_ACCOUNTS,
      {
        id: '4',
        name: 'BigCo Enterprise',
        dealValue: 150000,
        stage: 'Negotiation',
        meetingCount: 15,
        lastActivity: '2026-01-10',
        health: 'critical',
        nextStep: 'Schedule executive meeting ASAP',
      },
    ],
    stats: {
      ...MOCK_STATS,
      dealsAtRisk: 4,
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the dashboard with multiple at-risk accounts that need attention.',
      },
    },
  },
};

// ============================================
// Empty States
// ============================================
export const EmptyActions: Story = {
  name: 'Empty: No Actions (Caught Up)',
  args: {
    ...Default.args,
    actions: [],
    stats: {
      ...MOCK_STATS,
      actionsToday: 0,
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the "all caught up" empty state when there are no pending actions.',
      },
    },
  },
};

export const NewRep: Story = {
  name: 'Empty: New Rep (Minimal Data)',
  args: {
    meetings: [],
    actions: [],
    accounts: [],
    agentActivity: [],
    stats: {
      totalAccounts: 0,
      activeDeals: 0,
      pipelineValue: 0,
      actionsToday: 0,
      meetingsThisWeek: 0,
      dealsAtRisk: 0,
    },
    userName: 'New Rep',
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows what a new rep with no data sees. Good for testing onboarding prompts.',
      },
    },
  },
};

// ============================================
// High Activity
// ============================================
export const HighActivity: Story = {
  name: 'High Activity Day',
  args: {
    ...Default.args,
    actions: [
      ...MOCK_ACTIONS,
      {
        id: '4',
        title: 'Schedule follow-up call with procurement',
        company: 'BigCo Enterprise',
        dueDate: '2026-01-17',
        priority: 'critical',
        type: 'schedule_meeting',
        source: 'ai',
        isCompleted: false,
      },
      {
        id: '5',
        title: 'Review and approve contract redlines',
        company: 'TechStart',
        dueDate: '2026-01-16',
        priority: 'high',
        type: 'other',
        source: 'manual',
        isCompleted: false,
      },
      {
        id: '6',
        title: 'Send competitive analysis document',
        company: 'Widget Inc',
        dueDate: '2026-01-18',
        priority: 'medium',
        type: 'follow_up',
        source: 'ai',
        isCompleted: false,
      },
    ],
    meetings: [
      ...MOCK_MEETINGS,
      {
        id: '4',
        title: 'Technical Deep Dive',
        company: 'BigCo Enterprise',
        date: '2026-01-16T16:00:00',
        duration: 90,
        type: 'demo',
        hasRecording: true,
        hasInsights: true,
        participants: ['CTO', 'VP Eng', 'Security Lead'],
      },
      {
        id: '5',
        title: 'Quarterly Check-in',
        company: 'Existing Customer Co',
        date: '2026-01-16T09:00:00',
        duration: 30,
        type: 'followup',
        hasRecording: true,
        hasInsights: false,
        participants: ['Account Manager'],
      },
    ],
    stats: {
      ...MOCK_STATS,
      actionsToday: 8,
      meetingsThisWeek: 12,
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows a busy day with many actions and meetings.',
      },
    },
  },
};
