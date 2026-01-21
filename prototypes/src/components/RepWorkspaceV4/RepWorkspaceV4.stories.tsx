import type { Meta, StoryObj } from '@storybook/react';
import { RepWorkspaceDashboardV4 } from './RepWorkspaceDashboardV4';
import { PipelineView, PipelineViewLoading, PipelineViewEmpty } from './PipelineView';
import { SelfCoachingWidget, SelfCoachingEmpty, SelfCoachingLoading } from './SelfCoachingWidget';
import {
  MOCK_ACCOUNTS,
  MOCK_MEETINGS,
  MOCK_ACTIONS,
  MOCK_AGENT_ACTIVITY,
  MOCK_STATS,
  MOCK_SELF_COACHING,
} from './types';

// ============================================
// REP WORKSPACE V4 - Storybook Stories
// Maple Billing Feedback Iteration (2026-01-21)
// ============================================

const meta: Meta<typeof RepWorkspaceDashboardV4> = {
  title: 'Prototypes/RepWorkspace/V4-Maple',
  component: RepWorkspaceDashboardV4,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
## Rep Workspace V4 - Maple Feedback Iteration

This iteration addresses direct customer feedback from Jared Henriques (Maple Billing) captured on 2026-01-21.

### New Features

1. **Pipeline View (Kanban)** - "Pipeline view mirroring my HubSpot pipeline"
2. **Deal-Context Chat** - "Talk with the deal property... on a per deal basis"
3. **Self-Coaching Widget** - "Self coaching rather than monitoring"

### Key Quotes from Maple

> "One of the things that I'd be really keen on is... a pipeline view of mirroring my HubSpot pipeline into AskElephant for me to very quickly start to say, hey. Cool. Let me hop in on, like, a per account basis or a per deal basis, and then start to see my transcription and actually talk with the deal property."

> "I am a sales team of one... I'm actually way more interested in coaching from the aspect of, like, cool. Pull out some common questions that have been asked across all my transcripts."

### Related Documentation
- Signal: \`sig-2026-01-21-maple-billing-feedback\`
- PRD: \`pm-workspace-docs/initiatives/rep-workspace/prd.md\`
- Hypothesis: \`hyp-solo-rep-self-coaching\`
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof RepWorkspaceDashboardV4>;

// ============================================
// MAIN DASHBOARD STORIES
// ============================================

export const Default: Story = {
  name: '📊 Default (List View)',
  args: {
    userName: 'Jared',
    defaultView: 'list',
  },
};

export const PipelineViewStory: Story = {
  name: '📋 Pipeline View (Kanban)',
  args: {
    userName: 'Jared',
    defaultView: 'pipeline',
  },
  parameters: {
    docs: {
      description: {
        story: 'Maple Feedback: "A pipeline view mirroring my HubSpot pipeline"',
      },
    },
  },
};

export const LoadingState: Story = {
  name: '⏳ Loading State',
  args: {
    userName: 'Rep',
    isLoading: true,
  },
};

export const EmptyState: Story = {
  name: '📭 Empty State',
  args: {
    userName: 'New Rep',
    accounts: [],
    meetings: [],
    actions: [],
    agentActivity: [],
    stats: {
      activeDeals: 0,
      pipelineValue: 0,
      actionsToday: 0,
      meetingsThisWeek: 0,
      dealsAtRisk: 0,
      totalAccounts: 0,
      closingThisMonth: 0,
    },
    selfCoaching: undefined,
  },
};

export const SoloRepFocused: Story = {
  name: '👤 Solo Rep (Self-Coaching Focus)',
  args: {
    userName: 'Jared',
    defaultView: 'list',
    selfCoaching: {
      ...MOCK_SELF_COACHING,
      weeklyHighlight: "You're crushing it! 2 deals closed this week with improved objection handling.",
      improvementSuggestion: "Try asking about budget timing earlier in discovery - it came up late in 4 recent calls.",
    },
  },
  parameters: {
    docs: {
      description: {
        story: `
**Solo Rep Use Case (Jared @ Maple)**

This story demonstrates the self-coaching features specifically designed for solo reps who need self-improvement insights rather than team monitoring.

> "I am a sales team of one... I'm actually way more interested in coaching from the aspect of, like, cool. Pull out some common questions that have been asked across all my transcripts."
        `,
      },
    },
  },
};

export const AtRiskDeals: Story = {
  name: '⚠️ At-Risk Deals Highlighted',
  args: {
    userName: 'Rep',
    defaultView: 'pipeline',
    stats: {
      ...MOCK_STATS,
      dealsAtRisk: 3,
    },
  },
};

// ============================================
// PIPELINE VIEW STORIES
// ============================================

export const PipelineOnly: Story = {
  name: '📊 Pipeline Component (Isolated)',
  render: () => (
    <div className="p-6 bg-slate-50 min-h-screen">
      <PipelineView
        accounts={MOCK_ACCOUNTS}
        onAccountClick={(id) => console.log('Account clicked:', id)}
        onDealWorkspace={(id) => console.log('Open deal workspace:', id)}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Isolated Pipeline/Kanban view component showing deals by stage.',
      },
    },
  },
};

export const PipelineLoading: Story = {
  name: '⏳ Pipeline Loading',
  render: () => (
    <div className="p-6 bg-slate-50 min-h-screen">
      <PipelineViewLoading />
    </div>
  ),
};

export const PipelineEmpty: Story = {
  name: '📭 Pipeline Empty',
  render: () => (
    <div className="p-6 bg-slate-50 min-h-screen">
      <PipelineViewEmpty />
    </div>
  ),
};

// ============================================
// SELF-COACHING WIDGET STORIES
// ============================================

export const SelfCoachingCompact: Story = {
  name: '💡 Self-Coaching (Compact)',
  render: () => (
    <div className="p-6 bg-slate-50 max-w-md">
      <SelfCoachingWidget
        data={MOCK_SELF_COACHING}
        variant="compact"
        onViewAll={() => console.log('View all')}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
**Solo Rep Self-Coaching Widget**

Addresses hypothesis: \`hyp-solo-rep-self-coaching\`

Features:
- Top questions asked across calls
- Performance trends (week over week)
- Personalized improvement suggestions
        `,
      },
    },
  },
};

export const SelfCoachingExpanded: Story = {
  name: '💡 Self-Coaching (Expanded)',
  render: () => (
    <div className="p-6 bg-slate-50 max-w-2xl">
      <SelfCoachingWidget
        data={MOCK_SELF_COACHING}
        variant="expanded"
        onViewAll={() => console.log('View all')}
      />
    </div>
  ),
};

export const SelfCoachingLoadingStory: Story = {
  name: '⏳ Self-Coaching Loading',
  render: () => (
    <div className="p-6 bg-slate-50 max-w-md">
      <SelfCoachingLoading />
    </div>
  ),
};

export const SelfCoachingEmptyStory: Story = {
  name: '📭 Self-Coaching Empty',
  render: () => (
    <div className="p-6 bg-slate-50 max-w-md">
      <SelfCoachingEmpty />
    </div>
  ),
};

// ============================================
// INTERACTION DEMOS
// ============================================

export const DealWorkspaceDemo: Story = {
  name: '💬 Deal Workspace (Click Account)',
  args: {
    userName: 'Jared',
    defaultView: 'list',
  },
  parameters: {
    docs: {
      description: {
        story: `
**Per-Deal AI Chat Workspace**

Click on any account name or the 💬 button to open the Deal Workspace panel.

Maple Feedback:
> "Talk with the deal property in and of itself where it would have any activity or transcripts, um, involved with that for me to actually kinda do deal coaching."

Features:
- Deal context sidebar (contacts, next step, recent meetings)
- Suggested questions based on deal stage
- AI responses with source citations
- Action items for the specific deal
        `,
      },
    },
  },
};

// ============================================
// COMPARISON STORIES
// ============================================

export const V3VsV4Comparison: Story = {
  name: '🔄 V3 vs V4 Feature Comparison',
  render: () => (
    <div className="p-6 bg-white">
      <h2 className="text-xl font-bold mb-6">V4 Improvements from Maple Feedback</h2>
      
      <div className="grid grid-cols-2 gap-6">
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold text-gray-500 mb-3">V3 (Previous)</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <span className="text-gray-400">○</span>
              List view only
            </li>
            <li className="flex items-center gap-2">
              <span className="text-gray-400">○</span>
              Global chat (not deal-specific)
            </li>
            <li className="flex items-center gap-2">
              <span className="text-gray-400">○</span>
              Team-oriented coaching metrics
            </li>
            <li className="flex items-center gap-2">
              <span className="text-gray-400">○</span>
              No self-reflection tools
            </li>
          </ul>
        </div>
        
        <div className="border-2 border-indigo-200 rounded-lg p-4 bg-indigo-50/30">
          <h3 className="font-semibold text-indigo-700 mb-3">V4 (Maple Feedback)</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <span className="text-emerald-600">●</span>
              <strong>Pipeline view</strong> - Kanban mirroring HubSpot
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-600">●</span>
              <strong>Deal Workspace</strong> - Per-deal AI chat
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-600">●</span>
              <strong>Self-Coaching</strong> - Solo rep focus
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-600">●</span>
              <strong>Question patterns</strong> - Cross-call analysis
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
        <h4 className="font-medium text-amber-800 mb-2">📋 Validation Criteria</h4>
        <ul className="text-sm text-amber-900 space-y-1">
          <li>✓ Pipeline view matches HubSpot mental model</li>
          <li>✓ Deal workspace enables per-deal conversation</li>
          <li>✓ Self-coaching shows common questions across calls</li>
          <li>○ Need to validate with Jared (Maple) directly</li>
        </ul>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

export const MapleQuotes: Story = {
  name: '💬 Maple Feedback Quotes',
  render: () => (
    <div className="p-8 bg-gradient-to-br from-indigo-50 to-purple-50 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">
        Customer Voice: Jared @ Maple Billing
      </h2>
      
      <div className="space-y-6 max-w-3xl">
        <QuoteCard
          quote="One of the things that I'd be really keen on is one, just like a pipeline view of mirroring my HubSpot pipeline into, you know, AskElephant for me to very quickly start to say, hey. Cool. Let me hop in on, like, a per account basis or a per deal basis."
          feature="Pipeline View"
          status="implemented"
        />
        
        <QuoteCard
          quote="Talk with the deal property in and of itself where it would have any activity or transcripts, um, involved with that for me to actually kinda do deal coaching."
          feature="Deal Workspace"
          status="implemented"
        />
        
        <QuoteCard
          quote="I am a sales team of one... I'm actually way more interested in coaching from the aspect of, like, cool. Pull out some common questions that have been asked across all my transcripts. Pull out, like, the key details of where I could have adjusted this. And so it's more self coaching than it is monitoring."
          feature="Self-Coaching Widget"
          status="implemented"
        />
        
        <QuoteCard
          quote="On the chats, when I click chats and there's the massive list of chats, can we add the context of either company or something to that just so that I have a a bit of ability to delineate between them?"
          feature="Chat List Context"
          status="backlog"
        />
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};

function QuoteCard({ quote, feature, status }: { quote: string; feature: string; status: 'implemented' | 'backlog' }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <blockquote className="text-gray-700 italic mb-4">"{quote}"</blockquote>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-900">→ {feature}</span>
        <span className={`text-xs px-2 py-1 rounded-full ${
          status === 'implemented' 
            ? 'bg-emerald-100 text-emerald-700' 
            : 'bg-gray-100 text-gray-600'
        }`}>
          {status === 'implemented' ? '✓ Implemented' : '○ Backlog'}
        </span>
      </div>
    </div>
  );
}
