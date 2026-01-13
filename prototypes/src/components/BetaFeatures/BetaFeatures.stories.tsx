import type { Meta, StoryObj } from '@storybook/react';
import { StageBadge, StageBadgeInline, StageBadgeNav } from './StageBadge';
import { FeatureCardConfirm, FeatureCardBalanced, FeatureCardLabs } from './BetaFeatureCard';
import { BetaFeaturesConfirm, BetaFeaturesBalanced, BetaFeaturesLabs } from './BetaFeaturesSettings';
import { MOCK_FEATURES, BetaFeature } from './types';

// ============================================
// STAGE BADGE STORIES
// ============================================
const badgeMeta: Meta<typeof StageBadge> = {
  title: 'Prototypes/ReleaseLifecycle/StageBadge',
  component: StageBadge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Stage badges indicate feature maturity level. Used throughout the app to set user expectations.

**Design Rationale:**
- Color + text ensures accessibility (not color-only)
- Tooltip provides additional context on hover
- Three sizes for different contexts (nav, cards, headers)
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default badgeMeta;

type BadgeStory = StoryObj<typeof StageBadge>;

export const Lab: BadgeStory = {
  args: {
    stage: 'lab',
    size: 'md',
  },
};

export const Alpha: BadgeStory = {
  args: {
    stage: 'alpha',
    size: 'md',
  },
};

export const Beta: BadgeStory = {
  args: {
    stage: 'beta',
    size: 'md',
  },
};

export const AllSizes: BadgeStory = {
  render: () => (
    <div className="flex flex-col gap-4 items-start">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground w-12">Small:</span>
        <StageBadge stage="lab" size="sm" />
        <StageBadge stage="alpha" size="sm" />
        <StageBadge stage="beta" size="sm" />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground w-12">Medium:</span>
        <StageBadge stage="lab" size="md" />
        <StageBadge stage="alpha" size="md" />
        <StageBadge stage="beta" size="md" />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground w-12">Large:</span>
        <StageBadge stage="lab" size="lg" />
        <StageBadge stage="alpha" size="lg" />
        <StageBadge stage="beta" size="lg" />
      </div>
    </div>
  ),
};

export const InlineVariant: BadgeStory = {
  render: () => (
    <div className="space-y-2">
      <p className="text-sm">
        Auto-Tagging <StageBadgeInline stage="beta" /> is now available
      </p>
      <p className="text-sm">
        Try our new Privacy Agent <StageBadgeInline stage="alpha" />
      </p>
      <p className="text-sm">
        Process Agent <StageBadgeInline stage="lab" /> - experimental
      </p>
    </div>
  ),
};

export const NavVariant: BadgeStory = {
  render: () => (
    <div className="space-y-2">
      <div className="flex items-center gap-2 p-2 rounded hover:bg-muted">
        <span>📊</span>
        <span>Dashboard</span>
        <StageBadgeNav stage="beta" />
      </div>
      <div className="flex items-center gap-2 p-2 rounded hover:bg-muted">
        <span>🔍</span>
        <span>Internal Search</span>
        <StageBadgeNav stage="alpha" />
      </div>
    </div>
  ),
};

// ============================================
// FEATURE CARD STORIES
// ============================================
const cardMeta: Meta = {
  title: 'Prototypes/ReleaseLifecycle/FeatureCard',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Three design options for the beta feature toggle card:

| Option | Philosophy | Best For |
|--------|-----------|----------|
| **Confirm** | Maximum control—confirmation required | Low-trust users, high-stakes features |
| **Balanced** | AI suggests, easy toggle | Most users, building trust |
| **Labs** | Discovery-focused, click-to-toggle | Power users, exploration |
        `,
      },
    },
  },
};

export const OptionA_ConfirmCard: StoryObj = {
  ...cardMeta,
  name: 'Option A: Confirmation Card',
  render: () => {
    const feature = MOCK_FEATURES[1]; // Internal Search (disabled)
    return (
      <div className="w-[500px]">
        <FeatureCardConfirm
          feature={feature}
          onToggle={(key, enabled) => console.log('Toggle', key, enabled)}
        />
      </div>
    );
  },
};

export const OptionB_BalancedCard: StoryObj = {
  ...cardMeta,
  name: 'Option B: Balanced Card (Recommended)',
  render: () => {
    const feature = MOCK_FEATURES[0]; // Auto-Tagging (enabled)
    return (
      <div className="w-[500px]">
        <FeatureCardBalanced
          feature={feature}
          onToggle={(key, enabled) => console.log('Toggle', key, enabled)}
        />
      </div>
    );
  },
};

export const OptionC_LabsCard: StoryObj = {
  ...cardMeta,
  name: 'Option C: Labs Explorer Card',
  render: () => {
    const feature = MOCK_FEATURES[2]; // Global Chat (disabled)
    return (
      <div className="w-[400px]">
        <FeatureCardLabs
          feature={feature}
          onToggle={(key, enabled) => console.log('Toggle', key, enabled)}
        />
      </div>
    );
  },
};

// ============================================
// SETTINGS PANEL - OPTION A: CONFIRMATION
// ============================================
const settingsMetaA: Meta<typeof BetaFeaturesConfirm> = {
  title: 'Prototypes/ReleaseLifecycle/SettingsPanel',
  component: BetaFeaturesConfirm,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
## Option A: Maximum Control

**Philosophy:** Every beta feature requires explicit confirmation before enabling.

**Best For:**
- Users who are cautious about changes
- High-stakes features that could affect workflows
- Building initial trust with new users

**Tradeoffs:**
- ✅ Maximum clarity and informed consent
- ✅ Reduces accidental enablement
- ❌ More friction for exploration
- ❌ May feel paternalistic to power users
        `,
      },
    },
  },
};

export const OptionA_MaxControl: StoryObj<typeof BetaFeaturesConfirm> = {
  ...settingsMetaA,
  name: 'Option A: Max Control',
  args: {
    features: MOCK_FEATURES,
    isLoading: false,
  },
};

export const OptionA_Loading: StoryObj<typeof BetaFeaturesConfirm> = {
  ...settingsMetaA,
  name: 'Option A: Loading State',
  args: {
    features: [],
    isLoading: true,
  },
};

export const OptionA_Empty: StoryObj<typeof BetaFeaturesConfirm> = {
  ...settingsMetaA,
  name: 'Option A: Empty State',
  args: {
    features: [],
    isLoading: false,
  },
};

export const OptionA_Error: StoryObj<typeof BetaFeaturesConfirm> = {
  ...settingsMetaA,
  name: 'Option A: Error State',
  args: {
    features: [],
    isLoading: false,
    error: 'Failed to load beta features. Please check your connection.',
  },
};

// ============================================
// SETTINGS PANEL - OPTION B: BALANCED (RECOMMENDED)
// ============================================
const settingsMetaB: Meta<typeof BetaFeaturesBalanced> = {
  title: 'Prototypes/ReleaseLifecycle/SettingsPanel',
  component: BetaFeaturesBalanced,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
## Option B: Balanced (RECOMMENDED)

**Philosophy:** Simple toggle with immediate feedback via toast notification.

**Best For:**
- Most users
- Building trust progressively
- Balancing control with efficiency

**Tradeoffs:**
- ✅ Quick and easy to toggle
- ✅ Clear feedback via toast
- ✅ Shows feature location when enabled
- ✅ Familiar toggle pattern
- ❌ Less ceremony for high-stakes features
        `,
      },
    },
  },
};

export const OptionB_Balanced: StoryObj<typeof BetaFeaturesBalanced> = {
  ...settingsMetaB,
  name: 'Option B: Balanced (Recommended)',
  args: {
    features: MOCK_FEATURES,
    isLoading: false,
  },
};

export const OptionB_Loading: StoryObj<typeof BetaFeaturesBalanced> = {
  ...settingsMetaB,
  name: 'Option B: Loading State',
  args: {
    features: [],
    isLoading: true,
  },
};

export const OptionB_Empty: StoryObj<typeof BetaFeaturesBalanced> = {
  ...settingsMetaB,
  name: 'Option B: Empty State',
  args: {
    features: [],
    isLoading: false,
  },
};

export const OptionB_Error: StoryObj<typeof BetaFeaturesBalanced> = {
  ...settingsMetaB,
  name: 'Option B: Error State',
  args: {
    features: [],
    isLoading: false,
    error: 'Failed to load beta features. Please check your connection.',
  },
};

export const OptionB_SingleFeature: StoryObj<typeof BetaFeaturesBalanced> = {
  ...settingsMetaB,
  name: 'Option B: Single Feature',
  args: {
    features: [MOCK_FEATURES[0]],
    isLoading: false,
  },
};

// ============================================
// SETTINGS PANEL - OPTION C: LABS EXPLORER
// ============================================
const settingsMetaC: Meta<typeof BetaFeaturesLabs> = {
  title: 'Prototypes/ReleaseLifecycle/SettingsPanel',
  component: BetaFeaturesLabs,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
## Option C: Labs Explorer

**Philosophy:** Discovery-focused experience that makes beta testing feel special.

**Best For:**
- Power users who enjoy experimentation
- Building excitement around new features
- Companies with strong beta culture

**Tradeoffs:**
- ✅ Most engaging and exciting
- ✅ Gamified progress indicator
- ✅ Large click targets
- ❌ Takes more screen space
- ❌ May feel too playful for enterprise
- ❌ Click-to-toggle less familiar than switch
        `,
      },
    },
  },
};

export const OptionC_Labs: StoryObj<typeof BetaFeaturesLabs> = {
  ...settingsMetaC,
  name: 'Option C: Labs Explorer',
  args: {
    features: MOCK_FEATURES,
    isLoading: false,
  },
};

export const OptionC_Loading: StoryObj<typeof BetaFeaturesLabs> = {
  ...settingsMetaC,
  name: 'Option C: Loading State',
  args: {
    features: [],
    isLoading: true,
  },
};

export const OptionC_Empty: StoryObj<typeof BetaFeaturesLabs> = {
  ...settingsMetaC,
  name: 'Option C: Empty State',
  args: {
    features: [],
    isLoading: false,
  },
};

export const OptionC_Error: StoryObj<typeof BetaFeaturesLabs> = {
  ...settingsMetaC,
  name: 'Option C: Error State',
  args: {
    features: [],
    isLoading: false,
    error: 'Failed to load beta features. Please check your connection.',
  },
};

export const OptionC_AllEnabled: StoryObj<typeof BetaFeaturesLabs> = {
  ...settingsMetaC,
  name: 'Option C: All Enabled',
  args: {
    features: MOCK_FEATURES.map((f) => ({ ...f, enabled: true })),
    isLoading: false,
  },
};

// ============================================
// COMPARISON STORY
// ============================================
export const Comparison: StoryObj = {
  name: '📊 All Options Comparison',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: `
## Side-by-Side Comparison

Compare all three options to make an informed design decision.

| Criteria | Option A (Confirm) | Option B (Balanced) | Option C (Labs) |
|----------|-------------------|--------------------|-----------------| 
| Trust level required | Low | Medium | High |
| User control | Maximum | Balanced | Click-to-toggle |
| Efficiency | Lower | Medium | Highest |
| Learning curve | Medium | Lowest | Medium |
| Best for persona | Cautious users | Most users | Power users |
| Screen space | Compact | Compact | Spacious |

**Recommendation:** Option B (Balanced) for most use cases.
        `,
      },
    },
  },
  render: () => (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-8">
        <h1 className="text-2xl font-bold mb-2">Beta Features Settings - Design Options</h1>
        <p className="text-muted-foreground mb-8">
          Compare three creative directions. Toggle features to see interactions.
        </p>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Option A */}
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-muted px-4 py-3 border-b">
              <h2 className="font-semibold">Option A: Maximum Control</h2>
              <p className="text-xs text-muted-foreground">Confirmation required</p>
            </div>
            <div className="p-4 bg-card">
              <BetaFeaturesConfirm features={MOCK_FEATURES.slice(0, 3)} />
            </div>
          </div>

          {/* Option B */}
          <div className="border-2 border-primary rounded-lg overflow-hidden">
            <div className="bg-primary/10 px-4 py-3 border-b border-primary/20">
              <h2 className="font-semibold flex items-center gap-2">
                Option B: Balanced
                <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                  Recommended
                </span>
              </h2>
              <p className="text-xs text-muted-foreground">Instant toggle with toast</p>
            </div>
            <div className="p-4 bg-card">
              <BetaFeaturesBalanced features={MOCK_FEATURES.slice(0, 3)} />
            </div>
          </div>

          {/* Option C */}
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-muted px-4 py-3 border-b">
              <h2 className="font-semibold">Option C: Labs Explorer</h2>
              <p className="text-xs text-muted-foreground">Discovery-focused</p>
            </div>
            <div className="p-4 bg-card">
              <BetaFeaturesLabs features={MOCK_FEATURES.slice(0, 3)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};
