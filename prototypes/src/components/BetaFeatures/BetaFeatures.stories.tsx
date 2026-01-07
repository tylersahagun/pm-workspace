import type { Meta, StoryObj } from '@storybook/react';
import { StageBadge, StageBadgeInline, StageBadgeNav } from './StageBadge';
import { FeatureCardConfirm, FeatureCardBalanced, FeatureCardLabs } from './BetaFeatureCard';
import { BetaFeaturesConfirm, BetaFeaturesBalanced, BetaFeaturesLabs } from './BetaFeaturesSettings';
import { MOCK_FEATURES } from './types';

// ============================================
// META - Single default export for this file
// ============================================
const meta: Meta = {
  title: 'Prototypes/ReleaseLifecycle',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Release Lifecycle Process Prototypes

Interactive prototypes for the Beta Features Settings UI.

## Three Design Options

| Option | Philosophy | Best For |
|--------|-----------|----------|
| **Option A: Max Control** | Confirmation required before enabling | Low-trust users, high-stakes features |
| **Option B: Balanced** | Instant toggle with toast feedback | Most users (RECOMMENDED) |
| **Option C: Labs Explorer** | Discovery-focused, click-to-toggle | Power users, exploration |
        `,
      },
    },
  },
};

export default meta;

// ============================================
// STAGE BADGE STORIES
// ============================================
export const BadgeLab: StoryObj = {
  name: 'Badge: Lab',
  parameters: { layout: 'centered' },
  render: () => <StageBadge stage="lab" />,
};

export const BadgeAlpha: StoryObj = {
  name: 'Badge: Alpha',
  parameters: { layout: 'centered' },
  render: () => <StageBadge stage="alpha" />,
};

export const BadgeBeta: StoryObj = {
  name: 'Badge: Beta',
  parameters: { layout: 'centered' },
  render: () => <StageBadge stage="beta" />,
};

export const BadgeAllSizes: StoryObj = {
  name: 'Badge: All Sizes',
  parameters: { layout: 'centered' },
  render: () => (
    <div className="flex flex-col gap-4 items-start p-8">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground w-16">Small:</span>
        <StageBadge stage="lab" size="sm" />
        <StageBadge stage="alpha" size="sm" />
        <StageBadge stage="beta" size="sm" />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground w-16">Medium:</span>
        <StageBadge stage="lab" size="md" />
        <StageBadge stage="alpha" size="md" />
        <StageBadge stage="beta" size="md" />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground w-16">Large:</span>
        <StageBadge stage="lab" size="lg" />
        <StageBadge stage="alpha" size="lg" />
        <StageBadge stage="beta" size="lg" />
      </div>
    </div>
  ),
};

export const BadgeInline: StoryObj = {
  name: 'Badge: Inline Variant',
  parameters: { layout: 'centered' },
  render: () => (
    <div className="space-y-2 p-8">
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

export const BadgeNav: StoryObj = {
  name: 'Badge: Navigation Variant',
  parameters: { layout: 'centered' },
  render: () => (
    <div className="space-y-2 p-8">
      <div className="flex items-center gap-2 p-2 rounded hover:bg-muted cursor-pointer">
        <span>📊</span>
        <span>Dashboard</span>
        <StageBadgeNav stage="beta" />
      </div>
      <div className="flex items-center gap-2 p-2 rounded hover:bg-muted cursor-pointer">
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
export const CardConfirm: StoryObj = {
  name: 'Card: Option A (Confirm)',
  parameters: { layout: 'centered' },
  render: () => (
    <div className="w-[500px] p-8">
      <p className="text-sm text-muted-foreground mb-4">
        Click the toggle to see the confirmation dialog
      </p>
      <FeatureCardConfirm
        feature={MOCK_FEATURES[1]}
        onToggle={(key, enabled) => console.log('Toggle', key, enabled)}
      />
    </div>
  ),
};

export const CardBalanced: StoryObj = {
  name: 'Card: Option B (Balanced)',
  parameters: { layout: 'centered' },
  render: () => (
    <div className="w-[500px] p-8">
      <FeatureCardBalanced
        feature={MOCK_FEATURES[0]}
        onToggle={(key, enabled) => console.log('Toggle', key, enabled)}
      />
    </div>
  ),
};

export const CardLabs: StoryObj = {
  name: 'Card: Option C (Labs)',
  parameters: { layout: 'centered' },
  render: () => (
    <div className="w-[400px] p-8">
      <p className="text-sm text-muted-foreground mb-4">
        Click anywhere on the card to toggle
      </p>
      <FeatureCardLabs
        feature={MOCK_FEATURES[2]}
        onToggle={(key, enabled) => console.log('Toggle', key, enabled)}
      />
    </div>
  ),
};

// ============================================
// SETTINGS PANEL - OPTION A: CONFIRMATION
// ============================================
export const OptionA_MaxControl: StoryObj = {
  name: 'Panel: Option A - Max Control',
  render: () => <BetaFeaturesConfirm features={MOCK_FEATURES} />,
};

export const OptionA_Loading: StoryObj = {
  name: 'Panel: Option A - Loading',
  render: () => <BetaFeaturesConfirm features={[]} isLoading={true} />,
};

export const OptionA_Empty: StoryObj = {
  name: 'Panel: Option A - Empty',
  render: () => <BetaFeaturesConfirm features={[]} />,
};

export const OptionA_Error: StoryObj = {
  name: 'Panel: Option A - Error',
  render: () => (
    <BetaFeaturesConfirm
      features={[]}
      error="Failed to load beta features. Please check your connection."
    />
  ),
};

// ============================================
// SETTINGS PANEL - OPTION B: BALANCED (RECOMMENDED)
// ============================================
export const OptionB_Balanced: StoryObj = {
  name: 'Panel: Option B - Balanced ⭐',
  render: () => <BetaFeaturesBalanced features={MOCK_FEATURES} />,
};

export const OptionB_Loading: StoryObj = {
  name: 'Panel: Option B - Loading',
  render: () => <BetaFeaturesBalanced features={[]} isLoading={true} />,
};

export const OptionB_Empty: StoryObj = {
  name: 'Panel: Option B - Empty',
  render: () => <BetaFeaturesBalanced features={[]} />,
};

export const OptionB_Error: StoryObj = {
  name: 'Panel: Option B - Error',
  render: () => (
    <BetaFeaturesBalanced
      features={[]}
      error="Failed to load beta features. Please check your connection."
    />
  ),
};

export const OptionB_SingleFeature: StoryObj = {
  name: 'Panel: Option B - Single Feature',
  render: () => <BetaFeaturesBalanced features={[MOCK_FEATURES[0]]} />,
};

// ============================================
// SETTINGS PANEL - OPTION C: LABS EXPLORER
// ============================================
export const OptionC_Labs: StoryObj = {
  name: 'Panel: Option C - Labs Explorer',
  render: () => <BetaFeaturesLabs features={MOCK_FEATURES} />,
};

export const OptionC_Loading: StoryObj = {
  name: 'Panel: Option C - Loading',
  render: () => <BetaFeaturesLabs features={[]} isLoading={true} />,
};

export const OptionC_Empty: StoryObj = {
  name: 'Panel: Option C - Empty',
  render: () => <BetaFeaturesLabs features={[]} />,
};

export const OptionC_Error: StoryObj = {
  name: 'Panel: Option C - Error',
  render: () => (
    <BetaFeaturesLabs
      features={[]}
      error="Failed to load beta features. Please check your connection."
    />
  ),
};

export const OptionC_AllEnabled: StoryObj = {
  name: 'Panel: Option C - All Enabled',
  render: () => (
    <BetaFeaturesLabs features={MOCK_FEATURES.map((f) => ({ ...f, enabled: true }))} />
  ),
};

// ============================================
// COMPARISON STORY
// ============================================
export const Comparison: StoryObj = {
  name: '📊 All Options Comparison',
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
            <div className="bg-card">
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
            <div className="bg-card">
              <BetaFeaturesBalanced features={MOCK_FEATURES.slice(0, 3)} />
            </div>
          </div>

          {/* Option C */}
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-muted px-4 py-3 border-b">
              <h2 className="font-semibold">Option C: Labs Explorer</h2>
              <p className="text-xs text-muted-foreground">Discovery-focused</p>
            </div>
            <div className="bg-card">
              <BetaFeaturesLabs features={MOCK_FEATURES.slice(0, 3)} />
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="mt-12 border rounded-lg overflow-hidden">
          <div className="bg-muted px-4 py-3 border-b">
            <h2 className="font-semibold">Decision Matrix</h2>
          </div>
          <div className="p-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 pr-4">Criteria</th>
                  <th className="text-left py-2 px-4">Option A (Confirm)</th>
                  <th className="text-left py-2 px-4 bg-primary/5">Option B (Balanced) ⭐</th>
                  <th className="text-left py-2 pl-4">Option C (Labs)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2 pr-4 font-medium">Trust required</td>
                  <td className="py-2 px-4">Low</td>
                  <td className="py-2 px-4 bg-primary/5">Medium</td>
                  <td className="py-2 pl-4">High</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pr-4 font-medium">User control</td>
                  <td className="py-2 px-4">Maximum</td>
                  <td className="py-2 px-4 bg-primary/5">Balanced</td>
                  <td className="py-2 pl-4">Click-to-toggle</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pr-4 font-medium">Efficiency</td>
                  <td className="py-2 px-4">Lower</td>
                  <td className="py-2 px-4 bg-primary/5">Medium</td>
                  <td className="py-2 pl-4">Highest</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pr-4 font-medium">Learning curve</td>
                  <td className="py-2 px-4">Medium</td>
                  <td className="py-2 px-4 bg-primary/5">Lowest</td>
                  <td className="py-2 pl-4">Medium</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pr-4 font-medium">Enterprise fit</td>
                  <td className="py-2 px-4">High</td>
                  <td className="py-2 px-4 bg-primary/5">High</td>
                  <td className="py-2 pl-4">Medium</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">Best for</td>
                  <td className="py-2 px-4">Cautious users</td>
                  <td className="py-2 px-4 bg-primary/5">Most users</td>
                  <td className="py-2 pl-4">Power users</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  ),
};
