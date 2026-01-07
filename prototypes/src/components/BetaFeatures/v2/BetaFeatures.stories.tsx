import type { Meta, StoryObj } from '@storybook/react';
import { StageBadge, FeatureWrapper, NavBadge, HeaderBadge } from './StageBadge';
import { BetaFeaturesSettingsV2, BetaFeaturesSettingsSidebar } from './BetaFeaturesSettings';
import {
  NavigationDemo,
  PageHeaderDemo,
  InlineBadgeDemo,
  AllBadgeVariants,
  FeatureCardDemo,
} from './FeatureWrapperDemo';
import { MOCK_FEATURES } from './types';

// ============================================
// META
// ============================================
const meta: Meta = {
  title: 'Prototypes/ReleaseLifecycle/V2',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Release Lifecycle V2

Updated prototypes with:
1. **Enable All** toggle per feature type
2. **Tabbed/Sidebar navigation** for Lab/Alpha/Beta
3. **PostHog-style badges** for inline feature labels
4. **Matching elephant-ai styling** (indigo outline for Beta)
        `,
      },
    },
  },
};

export default meta;

// ============================================
// BADGE STORIES
// ============================================
export const BadgeVariants: StoryObj = {
  name: '🏷️ Badge: All Variants',
  parameters: { layout: 'centered' },
  render: () => (
    <div className="p-8">
      <AllBadgeVariants />
    </div>
  ),
};

export const BadgePostHogStyle: StoryObj = {
  name: '🏷️ Badge: PostHog Style',
  parameters: { layout: 'centered' },
  render: () => (
    <div className="p-8 space-y-4">
      <h3 className="font-medium mb-4">PostHog-style uppercase badges</h3>
      <div className="flex items-center gap-4">
        <StageBadge stage="lab" variant="posthog" showTooltip={false} />
        <StageBadge stage="alpha" variant="posthog" showTooltip={false} />
        <StageBadge stage="beta" variant="posthog" showTooltip={false} />
      </div>
      <p className="text-sm text-muted-foreground mt-4">
        Compact, uppercase badges that match PostHog's UI pattern shown in the reference image.
      </p>
    </div>
  ),
};

// ============================================
// FEATURE WRAPPER STORIES
// ============================================
export const WrapperNavigation: StoryObj = {
  name: '🔖 Wrapper: Navigation Demo',
  parameters: { layout: 'centered' },
  render: () => (
    <div className="p-8">
      <NavigationDemo />
    </div>
  ),
};

export const WrapperPageHeaders: StoryObj = {
  name: '🔖 Wrapper: Page Headers',
  parameters: { layout: 'centered' },
  render: () => (
    <div className="p-8 max-w-xl">
      <PageHeaderDemo />
    </div>
  ),
};

export const WrapperInline: StoryObj = {
  name: '🔖 Wrapper: Inline Badges',
  parameters: { layout: 'centered' },
  render: () => (
    <div className="p-8 max-w-md">
      <InlineBadgeDemo />
    </div>
  ),
};

export const WrapperCards: StoryObj = {
  name: '🔖 Wrapper: Feature Cards',
  parameters: { layout: 'centered' },
  render: () => (
    <div className="p-8 max-w-2xl">
      <FeatureCardDemo />
    </div>
  ),
};

// ============================================
// SETTINGS PANEL - TABBED
// ============================================
export const SettingsTabbed: StoryObj = {
  name: '⚙️ Settings: Tabbed Layout',
  render: () => <BetaFeaturesSettingsV2 features={MOCK_FEATURES} defaultTab="beta" />,
};

export const SettingsTabbedLab: StoryObj = {
  name: '⚙️ Settings: Tabbed (Lab Tab)',
  render: () => <BetaFeaturesSettingsV2 features={MOCK_FEATURES} defaultTab="lab" />,
};

export const SettingsTabbedAlpha: StoryObj = {
  name: '⚙️ Settings: Tabbed (Alpha Tab)',
  render: () => <BetaFeaturesSettingsV2 features={MOCK_FEATURES} defaultTab="alpha" />,
};

export const SettingsTabbedLoading: StoryObj = {
  name: '⚙️ Settings: Tabbed (Loading)',
  render: () => <BetaFeaturesSettingsV2 features={[]} isLoading={true} />,
};

export const SettingsTabbedError: StoryObj = {
  name: '⚙️ Settings: Tabbed (Error)',
  render: () => (
    <BetaFeaturesSettingsV2
      features={[]}
      error="Failed to load features. Please check your connection."
    />
  ),
};

// ============================================
// SETTINGS PANEL - SIDEBAR
// ============================================
export const SettingsSidebar: StoryObj = {
  name: '⚙️ Settings: Sidebar Layout',
  render: () => (
    <div className="p-8">
      <BetaFeaturesSettingsSidebar features={MOCK_FEATURES} />
    </div>
  ),
};

// ============================================
// COMPARISON
// ============================================
export const Comparison: StoryObj = {
  name: '📊 V2: Layout Comparison',
  render: () => (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">V2: Layout Options</h1>
          <p className="text-muted-foreground">
            Compare tabbed vs sidebar navigation. Both include "Enable All" per stage.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Tabbed */}
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-muted px-4 py-3 border-b">
              <h2 className="font-semibold">Option A: Tabbed Navigation</h2>
              <p className="text-xs text-muted-foreground">
                Horizontal tabs, compact, mobile-friendly
              </p>
            </div>
            <div className="bg-card">
              <BetaFeaturesSettingsV2 features={MOCK_FEATURES} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-muted px-4 py-3 border-b">
              <h2 className="font-semibold">Option B: Sidebar Navigation</h2>
              <p className="text-xs text-muted-foreground">
                Vertical sidebar, desktop-optimized, shows counts
              </p>
            </div>
            <div className="bg-card p-4">
              <BetaFeaturesSettingsSidebar features={MOCK_FEATURES} />
            </div>
          </div>
        </div>

        {/* Badge Usage */}
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-muted px-4 py-3 border-b">
            <h2 className="font-semibold">PostHog-Style Badge Usage</h2>
            <p className="text-xs text-muted-foreground">
              Wrap any UI element with stage badges
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 p-6 bg-card">
            <div>
              <h3 className="text-sm font-medium mb-3">Navigation</h3>
              <NavigationDemo />
            </div>
            <div>
              <h3 className="text-sm font-medium mb-3">Inline Labels</h3>
              <InlineBadgeDemo />
            </div>
            <div>
              <h3 className="text-sm font-medium mb-3">Page Headers</h3>
              <PageHeaderDemo />
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

// ============================================
// FULL PAGE DEMO
// ============================================
export const FullPageDemo: StoryObj = {
  name: '🖥️ Full Page: Settings Integration',
  render: () => (
    <div className="min-h-screen bg-background">
      {/* Mock settings page header */}
      <div className="border-b bg-white">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button className="text-muted-foreground hover:text-foreground">
              ← Back to Settings
            </button>
          </div>
        </div>
      </div>

      {/* Mock settings tabs */}
      <div className="border-b bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <nav className="flex gap-6 -mb-px">
            <button className="py-3 text-sm text-muted-foreground border-b-2 border-transparent hover:text-foreground">
              Profile
            </button>
            <button className="py-3 text-sm text-muted-foreground border-b-2 border-transparent hover:text-foreground">
              Workspace
            </button>
            <button className="py-3 text-sm text-muted-foreground border-b-2 border-transparent hover:text-foreground">
              Integrations
            </button>
            <button className="py-3 text-sm font-medium border-b-2 border-primary">
              Early Access
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="bg-muted/30">
        <BetaFeaturesSettingsV2 features={MOCK_FEATURES} />
      </div>
    </div>
  ),
};
