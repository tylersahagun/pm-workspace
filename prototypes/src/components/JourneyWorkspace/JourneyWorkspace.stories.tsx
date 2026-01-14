import type { Meta, StoryObj } from '@storybook/react';
import { RepWorkspace } from './RepWorkspace';
import { AccountJourneyCard } from './AccountJourneyCard';
import { ActionCard, ActionCardLoading, ActionCardEmpty, ActionCardError } from './ActionCard';
import { DealHealthIndicator, DealHealthBadge, ConfidenceIndicator } from './DealHealthIndicator';
import { MOCK_ACCOUNTS, MOCK_STATS, Account, DealHealth, SuggestedAction } from './types';

// ============================================
// META
// ============================================
const meta: Meta = {
  title: 'Prototypes/JourneyWorkspace',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Journey Workspace v1

**Primary Persona:** Sales Reps

**Core Job:** "When I'm managing active deals, I want a prioritized, context-rich list of what to do next per account, so that I move deals forward faster without manual CRM digging."

## Creative Directions

| Direction | Philosophy | Best For |
|-----------|-----------|----------|
| **Option A: Maximum Control** | User sees all details, confirms everything, full evidence visible | Low-trust users, high-stakes deals, new users |
| **Option B: Balanced** | AI surfaces priorities with one-click action, progressive disclosure | Most users, trust-building phase |
| **Option C: Maximum Efficiency** | Inbox-zero style, minimal UI, fast processing | Power users, routine follow-ups |

## Trust Principles Applied

1. **Receipts, not black boxes** - Every AI recommendation shows evidence
2. **Progressive disclosure** - Summaries first, details on demand
3. **Graceful failure** - All error states designed for recovery
4. **Human-centered** - AI drafts, user approves and sends
5. **Rep gets credit** - AI-assisted work appears as rep's work

## Success Metrics (v1)

- Weekly Active Rep Workspace Users (target: 50% use 3+ days/week)
- Recommended Action Completion Rate (target: 30%+ within 7 days)
- Median Time from Meeting → Follow-Up Sent (target: <24 hours)
        `,
      },
    },
  },
};

export default meta;

// ============================================
// MAIN WORKSPACE - THREE CREATIVE DIRECTIONS
// ============================================

export const OptionA_MaxControl: StoryObj = {
  name: 'Option A: Maximum Control',
  render: () => (
    <RepWorkspace
      accounts={MOCK_ACCOUNTS}
      stats={MOCK_STATS}
      variant="control"
    />
  ),
  parameters: {
    docs: {
      description: {
        story: `
## Option A: Maximum Control

**Philosophy:** User sees all details upfront, every action requires explicit review and approval, all AI evidence visible by default.

**Best for:**
- New users building trust with the system
- High-stakes deals where mistakes are costly
- Users who want full visibility into AI reasoning

**Trust Level Required:** Low (we earn trust through transparency)

**Tradeoffs:**
- ✅ Maximum transparency and user control
- ✅ Easy to verify AI reasoning
- ✅ No surprises
- ❌ More cognitive load
- ❌ Slower to process routine actions
- ❌ Can feel overwhelming with many accounts
        `,
      },
    },
  },
};

export const OptionB_Balanced: StoryObj = {
  name: 'Option B: Balanced (Recommended)',
  render: () => (
    <RepWorkspace
      accounts={MOCK_ACCOUNTS}
      stats={MOCK_STATS}
      variant="balanced"
    />
  ),
  parameters: {
    docs: {
      description: {
        story: `
## Option B: Balanced (RECOMMENDED)

**Philosophy:** AI surfaces top priorities, one-click execution available, details on demand via progressive disclosure.

**Best for:**
- Most users
- Trust-building phase
- Balancing speed with control

**Trust Level Required:** Medium (user has grown comfortable with AI suggestions)

**Tradeoffs:**
- ✅ Good balance of speed and control
- ✅ Two-column layout separates actions from account browsing
- ✅ Progressive disclosure reduces initial cognitive load
- ✅ Evidence available when needed
- ❌ Requires some clicks to see full reasoning
- ❌ Could miss context if not expanding details

**Why Recommended:** This option balances the competing needs identified in research:
- Reps want to "know what to do" (prioritized actions)
- Reps want to "see where customers are" (account journey view)
- Both are visible without overwhelming
        `,
      },
    },
  },
};

export const OptionC_MaxEfficiency: StoryObj = {
  name: 'Option C: Maximum Efficiency',
  render: () => (
    <RepWorkspace
      accounts={MOCK_ACCOUNTS}
      stats={MOCK_STATS}
      variant="efficient"
    />
  ),
  parameters: {
    docs: {
      description: {
        story: `
## Option C: Maximum Efficiency

**Philosophy:** Inbox-zero style, minimal UI, fast processing of routine actions, batch review capability.

**Best for:**
- Power users
- Routine follow-ups
- Users with many accounts
- High volume of daily actions

**Trust Level Required:** High (user fully trusts AI recommendations)

**Tradeoffs:**
- ✅ Fastest to process actions
- ✅ Minimal cognitive load per action
- ✅ Great for power users
- ✅ Clean, focused interface
- ❌ Less context visible upfront
- ❌ Requires trust in AI prioritization
- ❌ Could miss important nuance
        `,
      },
    },
  },
};

// ============================================
// LOADING STATES
// ============================================

export const Loading_Control: StoryObj = {
  name: 'Loading: Control',
  render: () => (
    <RepWorkspace
      accounts={[]}
      stats={MOCK_STATS}
      variant="control"
      isLoading={true}
    />
  ),
};

export const Loading_Balanced: StoryObj = {
  name: 'Loading: Balanced',
  render: () => (
    <RepWorkspace
      accounts={[]}
      stats={MOCK_STATS}
      variant="balanced"
      isLoading={true}
    />
  ),
};

export const Loading_Efficient: StoryObj = {
  name: 'Loading: Efficient',
  render: () => (
    <RepWorkspace
      accounts={[]}
      stats={MOCK_STATS}
      variant="efficient"
      isLoading={true}
    />
  ),
};

// ============================================
// ERROR STATES
// ============================================

export const Error_Balanced: StoryObj = {
  name: 'Error: Balanced',
  render: () => (
    <RepWorkspace
      accounts={[]}
      stats={MOCK_STATS}
      variant="balanced"
      error="Could not load your accounts. Please check your connection and try again."
    />
  ),
};

export const Error_Control: StoryObj = {
  name: 'Error: Control',
  render: () => (
    <RepWorkspace
      accounts={[]}
      stats={MOCK_STATS}
      variant="control"
      error="Could not load your accounts. Please check your connection and try again."
    />
  ),
};

// ============================================
// EMPTY STATES
// ============================================

export const Empty_Balanced: StoryObj = {
  name: 'Empty: Balanced',
  render: () => (
    <RepWorkspace
      accounts={[]}
      stats={{ ...MOCK_STATS, totalAccounts: 0, actionsToday: 0 }}
      variant="balanced"
    />
  ),
};

export const Empty_NoActions: StoryObj = {
  name: 'Empty: No Actions (Caught Up)',
  render: () => {
    const accountsWithNoActions = MOCK_ACCOUNTS.map((a) => ({
      ...a,
      suggestedActions: a.suggestedActions.map((action) => ({
        ...action,
        isCompleted: true,
      })),
    }));
    return (
      <RepWorkspace
        accounts={accountsWithNoActions}
        stats={{ ...MOCK_STATS, actionsToday: 0 }}
        variant="balanced"
      />
    );
  },
};

// ============================================
// ACCOUNT CARD STORIES
// ============================================

export const AccountCard_Control: StoryObj = {
  name: 'Account Card: Control',
  render: () => (
    <div className="p-6 bg-gray-100 min-h-screen">
      <AccountJourneyCard
        account={MOCK_ACCOUNTS[0]}
        variant="control"
      />
    </div>
  ),
};

export const AccountCard_Balanced_Collapsed: StoryObj = {
  name: 'Account Card: Balanced (Collapsed)',
  render: () => (
    <div className="p-6 bg-gray-100 min-h-screen">
      <AccountJourneyCard
        account={MOCK_ACCOUNTS[0]}
        variant="balanced"
        isExpanded={false}
      />
    </div>
  ),
};

export const AccountCard_Balanced_Expanded: StoryObj = {
  name: 'Account Card: Balanced (Expanded)',
  render: () => (
    <div className="p-6 bg-gray-100 min-h-screen">
      <AccountJourneyCard
        account={MOCK_ACCOUNTS[0]}
        variant="balanced"
        isExpanded={true}
      />
    </div>
  ),
};

export const AccountCard_AtRisk: StoryObj = {
  name: 'Account Card: At Risk Account',
  render: () => (
    <div className="p-6 bg-gray-100 min-h-screen">
      <AccountJourneyCard
        account={MOCK_ACCOUNTS[1]} // TechStart - at risk
        variant="balanced"
        isExpanded={true}
      />
    </div>
  ),
};

export const AccountCard_Efficient: StoryObj = {
  name: 'Account Card: Efficient',
  render: () => (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white border rounded-lg overflow-hidden">
        {MOCK_ACCOUNTS.map((account) => (
          <AccountJourneyCard
            key={account.id}
            account={account}
            variant="efficient"
          />
        ))}
      </div>
    </div>
  ),
};

// ============================================
// ACTION CARD STORIES
// ============================================

const mockAction: SuggestedAction = MOCK_ACCOUNTS[0].suggestedActions[0];

export const ActionCard_Control: StoryObj = {
  name: 'Action Card: Control',
  render: () => (
    <div className="p-6 max-w-2xl">
      <ActionCard
        action={mockAction}
        accountName="Acme Corporation"
        variant="control"
      />
    </div>
  ),
};

export const ActionCard_Balanced: StoryObj = {
  name: 'Action Card: Balanced',
  render: () => (
    <div className="p-6 max-w-2xl">
      <ActionCard
        action={mockAction}
        accountName="Acme Corporation"
        variant="balanced"
      />
    </div>
  ),
};

export const ActionCard_Efficient: StoryObj = {
  name: 'Action Card: Efficient',
  render: () => (
    <div className="p-6 max-w-2xl bg-white border rounded-lg">
      <ActionCard
        action={mockAction}
        accountName="Acme Corporation"
        variant="efficient"
      />
    </div>
  ),
};

export const ActionCard_LowConfidence: StoryObj = {
  name: 'Action Card: Low Confidence',
  render: () => {
    const lowConfidenceAction: SuggestedAction = {
      ...MOCK_ACCOUNTS[1].suggestedActions[1], // Multi-threading suggestion
      confidence: 'low',
    };
    return (
      <div className="p-6 max-w-2xl">
        <ActionCard
          action={lowConfidenceAction}
          accountName="TechStart Inc"
          variant="balanced"
        />
      </div>
    );
  },
};

export const ActionCard_Loading: StoryObj = {
  name: 'Action Card: Loading',
  render: () => (
    <div className="p-6 max-w-2xl space-y-4">
      <ActionCardLoading variant="balanced" />
      <ActionCardLoading variant="efficient" />
    </div>
  ),
};

export const ActionCard_Empty: StoryObj = {
  name: 'Action Card: Empty',
  render: () => (
    <div className="p-6 max-w-2xl">
      <ActionCardEmpty />
    </div>
  ),
};

export const ActionCard_Error: StoryObj = {
  name: 'Action Card: Error',
  render: () => (
    <div className="p-6 max-w-2xl">
      <ActionCardError error="Could not generate AI draft. Please try again." />
    </div>
  ),
};

// ============================================
// DEAL HEALTH INDICATOR STORIES
// ============================================

const mockHealth: DealHealth = MOCK_ACCOUNTS[0].health;

export const DealHealth_Compact: StoryObj = {
  name: 'Deal Health: Compact',
  render: () => (
    <div className="p-6 space-y-4">
      <DealHealthIndicator health={mockHealth} variant="compact" />
      <DealHealthIndicator
        health={{ ...mockHealth, status: 'at_risk', score: 45, trend: 'declining' }}
        variant="compact"
      />
      <DealHealthIndicator
        health={{ ...mockHealth, status: 'critical', score: 25, trend: 'declining' }}
        variant="compact"
      />
    </div>
  ),
};

export const DealHealth_Detailed: StoryObj = {
  name: 'Deal Health: Detailed',
  render: () => (
    <div className="p-6 space-y-4 max-w-md">
      <DealHealthIndicator health={mockHealth} variant="detailed" showEvidence />
      <DealHealthIndicator
        health={{ ...mockHealth, status: 'at_risk', score: 45, trend: 'declining' }}
        variant="detailed"
        showEvidence
      />
    </div>
  ),
};

export const DealHealth_Expanded: StoryObj = {
  name: 'Deal Health: Expanded',
  render: () => (
    <div className="p-6 max-w-md">
      <DealHealthIndicator health={mockHealth} variant="expanded" />
    </div>
  ),
};

export const DealHealth_AllBadges: StoryObj = {
  name: 'Deal Health: All Badges',
  parameters: { layout: 'centered' },
  render: () => (
    <div className="p-8 space-y-4">
      <div className="flex items-center gap-4">
        <DealHealthBadge status="strong" showScore score={85} />
        <DealHealthBadge status="healthy" showScore score={72} />
        <DealHealthBadge status="at_risk" showScore score={45} />
        <DealHealthBadge status="critical" showScore score={25} />
      </div>
      <div className="flex items-center gap-4">
        <DealHealthBadge status="strong" size="sm" />
        <DealHealthBadge status="healthy" size="sm" />
        <DealHealthBadge status="at_risk" size="sm" />
        <DealHealthBadge status="critical" size="sm" />
      </div>
    </div>
  ),
};

export const ConfidenceIndicator_All: StoryObj = {
  name: 'Confidence Indicators',
  parameters: { layout: 'centered' },
  render: () => (
    <div className="p-8 space-y-4">
      <div className="flex items-center gap-4">
        <ConfidenceIndicator confidence="high" showLabel />
        <ConfidenceIndicator confidence="medium" showLabel />
        <ConfidenceIndicator confidence="low" showLabel />
      </div>
      <div className="flex items-center gap-4">
        <ConfidenceIndicator confidence="high" />
        <ConfidenceIndicator confidence="medium" />
        <ConfidenceIndicator confidence="low" />
      </div>
    </div>
  ),
};

// ============================================
// COMPARISON VIEW
// ============================================

export const Comparison_AllThree: StoryObj = {
  name: 'Comparison: All Three Options',
  render: () => (
    <div className="flex flex-col gap-8 p-4 bg-gray-200">
      <div>
        <h2 className="text-lg font-bold mb-2 px-2">Option A: Maximum Control</h2>
        <div className="border rounded-lg overflow-hidden shadow-lg">
          <RepWorkspace
            accounts={MOCK_ACCOUNTS.slice(0, 2)}
            stats={MOCK_STATS}
            variant="control"
          />
        </div>
      </div>
      <div>
        <h2 className="text-lg font-bold mb-2 px-2">Option B: Balanced (Recommended)</h2>
        <div className="border rounded-lg overflow-hidden shadow-lg">
          <RepWorkspace
            accounts={MOCK_ACCOUNTS.slice(0, 2)}
            stats={MOCK_STATS}
            variant="balanced"
          />
        </div>
      </div>
      <div>
        <h2 className="text-lg font-bold mb-2 px-2">Option C: Maximum Efficiency</h2>
        <div className="border rounded-lg overflow-hidden shadow-lg">
          <RepWorkspace
            accounts={MOCK_ACCOUNTS.slice(0, 2)}
            stats={MOCK_STATS}
            variant="efficient"
          />
        </div>
      </div>
    </div>
  ),
};
