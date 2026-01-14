import type { Meta, StoryObj } from '@storybook/react';
import { StageBadge, ScopeBadge, NewBadge, FeatureBadgeRow } from './StageBadge';
import { BetaFeaturesSettingsV4 } from './BetaFeaturesSettings';
import { MOCK_FEATURES, FeatureStage, FeatureScope } from './types';

// ============================================
// META
// ============================================
const meta: Meta = {
  title: 'Prototypes/ReleaseLifecycle/V4',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Release Lifecycle V4

Based on team feedback:

## Key Changes

1. **Consolidated Stages**: Only Experimental and Beta (removed Alpha)
2. **No Auto-Enroll for Experimental**: Users must manually opt-in
3. **Personal vs Workspace Permissions**: 
   - Workspace features only visible to Managers/Owners
   - Clear labeling of scope impact
4. **"How it works" Dialog**: Shown before enabling any feature
5. **No Icons in Tabs**: Clean text-only tab design
6. **Enrollment Logic**:
   - Experimental: Manual only (no auto-enroll available)
   - Beta: Auto-enroll optional

## Feature Lifecycle

| Stage | Behavior | Auto-Enroll |
|-------|----------|-------------|
| Experimental | Manual opt-in, high risk | Not available |
| Beta | Stable, gathering feedback | Available |
| New (Post-Beta) | GA with "New" badge | N/A |
| GA | Core feature, no badge | N/A |
        `,
      },
    },
  },
};

export default meta;

// ============================================
// MAIN SETTINGS
// ============================================
export const Settings: StoryObj = {
  name: 'Settings Panel',
  render: () => <BetaFeaturesSettingsV4 features={MOCK_FEATURES} defaultTab="beta" />,
};

export const SettingsExperimental: StoryObj = {
  name: 'Settings: Experimental Tab',
  render: () => <BetaFeaturesSettingsV4 features={MOCK_FEATURES} defaultTab="experimental" />,
};

export const SettingsNonManager: StoryObj = {
  name: 'Settings: Non-Manager View',
  render: () => (
    <div>
      <div className="bg-amber-50 border-b border-amber-200 px-6 py-2">
        <p className="text-xs text-amber-800">
          Preview: This shows how the settings appear for a standard user (non-manager).
          Workspace features are hidden.
        </p>
      </div>
      <BetaFeaturesSettingsV4 features={MOCK_FEATURES} defaultTab="beta" isManager={false} />
    </div>
  ),
};

export const SettingsLoading: StoryObj = {
  name: 'Settings: Loading',
  render: () => <BetaFeaturesSettingsV4 features={[]} isLoading={true} />,
};

export const SettingsError: StoryObj = {
  name: 'Settings: Error',
  render: () => (
    <BetaFeaturesSettingsV4
      features={[]}
      error="Failed to load features. Please check your connection."
    />
  ),
};

// ============================================
// BADGE COMPONENTS
// ============================================
export const Badges: StoryObj = {
  name: 'Badges: All Variants',
  parameters: { layout: 'centered' },
  render: () => (
    <div className="p-8 space-y-8">
      {/* Stage badges */}
      <div>
        <h3 className="text-sm font-medium mb-4">Stage Badges</h3>
        <div className="flex items-center gap-6">
          {(['experimental', 'beta'] as FeatureStage[]).map((stage) => (
            <div key={stage} className="text-center">
              <StageBadge stage={stage} showTooltip={false} />
              <p className="text-xs text-muted-foreground mt-2 capitalize">{stage}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scope badges */}
      <div>
        <h3 className="text-sm font-medium mb-4">Scope Badges</h3>
        <div className="flex items-center gap-6">
          {(['personal', 'workspace'] as FeatureScope[]).map((scope) => (
            <div key={scope} className="text-center">
              <ScopeBadge scope={scope} />
              <p className="text-xs text-muted-foreground mt-2 capitalize">{scope}</p>
            </div>
          ))}
        </div>
      </div>

      {/* New badge */}
      <div>
        <h3 className="text-sm font-medium mb-4">New Badge</h3>
        <NewBadge />
      </div>

      {/* Combined */}
      <div>
        <h3 className="text-sm font-medium mb-4">Combined Badge Rows</h3>
        <div className="space-y-3">
          <FeatureBadgeRow stage="experimental" scope="personal" />
          <FeatureBadgeRow stage="experimental" scope="workspace" />
          <FeatureBadgeRow stage="beta" scope="personal" isNew />
          <FeatureBadgeRow stage="beta" scope="workspace" />
        </div>
      </div>
    </div>
  ),
};

// ============================================
// ENROLLMENT LOGIC DEMO
// ============================================
export const EnrollmentLogic: StoryObj = {
  name: 'Enrollment Logic Comparison',
  render: () => (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Enrollment Logic by Stage</h1>
          <p className="text-muted-foreground">
            Experimental features require manual opt-in. Beta features support auto-enrollment.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Experimental */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <StageBadge stage="experimental" size="md" showTooltip={false} />
              <h2 className="font-semibold">Experimental</h2>
            </div>
            
            <div className="space-y-4 text-sm">
              <div className="p-3 bg-purple-50 rounded-lg">
                <p className="font-medium text-purple-900">No auto-enrollment</p>
                <p className="text-purple-700 text-xs mt-1">
                  Users must manually enable each feature individually.
                </p>
              </div>

              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-purple-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  High-risk, may break
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-purple-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Intentional feedback gathering
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-purple-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Shows "how it works" before enabling
                </li>
              </ul>
            </div>
          </div>

          {/* Beta */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <StageBadge stage="beta" size="md" showTooltip={false} />
              <h2 className="font-semibold">Beta</h2>
            </div>
            
            <div className="space-y-4 text-sm">
              <div className="p-3 bg-indigo-50 rounded-lg">
                <p className="font-medium text-indigo-900">Auto-enrollment available</p>
                <p className="text-indigo-700 text-xs mt-1">
                  Users can opt-in to receive all new beta features automatically.
                </p>
              </div>

              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-indigo-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Stable, feature-complete
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-indigo-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Gathering final feedback
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-indigo-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Can disable individual features
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Feature Lifecycle */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="font-semibold mb-4">Feature Lifecycle</h2>
          <div className="flex items-center justify-between gap-4 text-sm">
            <div className="flex-1 text-center p-4 border-2 border-dashed border-purple-200 rounded-lg">
              <StageBadge stage="experimental" showTooltip={false} />
              <p className="mt-2 font-medium">Experimental</p>
              <p className="text-xs text-muted-foreground">Manual only</p>
            </div>
            <svg className="w-6 h-6 text-muted-foreground flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <div className="flex-1 text-center p-4 border-2 border-dashed border-indigo-200 rounded-lg">
              <StageBadge stage="beta" showTooltip={false} />
              <p className="mt-2 font-medium">Beta</p>
              <p className="text-xs text-muted-foreground">Auto-enroll optional</p>
            </div>
            <svg className="w-6 h-6 text-muted-foreground flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <div className="flex-1 text-center p-4 border-2 border-emerald-200 rounded-lg bg-emerald-50">
              <NewBadge />
              <p className="mt-2 font-medium">New</p>
              <p className="text-xs text-muted-foreground">Auto-enabled</p>
            </div>
            <svg className="w-6 h-6 text-muted-foreground flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <div className="flex-1 text-center p-4 border rounded-lg bg-slate-50">
              <span className="text-xs text-muted-foreground">No badge</span>
              <p className="mt-2 font-medium">GA</p>
              <p className="text-xs text-muted-foreground">Core feature</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

// ============================================
// PERMISSIONS DEMO
// ============================================
export const PermissionsDemo: StoryObj = {
  name: 'Permissions: Manager vs User',
  render: () => (
    <div className="min-h-screen bg-slate-100">
      <div className="max-w-6xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Permission-Based Visibility</h1>
          <p className="text-muted-foreground">
            Workspace features are only visible to Managers and Owners. Standard users see Personal features only.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Manager View */}
          <div className="bg-white rounded-lg overflow-hidden shadow-sm">
            <div className="px-4 py-3 bg-emerald-50 border-b border-emerald-200">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-sm font-medium text-emerald-800">Manager View</span>
              </div>
            </div>
            <div className="max-h-[600px] overflow-auto">
              <BetaFeaturesSettingsV4 features={MOCK_FEATURES} defaultTab="beta" isManager={true} />
            </div>
          </div>

          {/* Standard User View */}
          <div className="bg-white rounded-lg overflow-hidden shadow-sm">
            <div className="px-4 py-3 bg-slate-100 border-b">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-sm font-medium">Standard User View</span>
              </div>
            </div>
            <div className="max-h-[600px] overflow-auto">
              <BetaFeaturesSettingsV4 features={MOCK_FEATURES} defaultTab="beta" isManager={false} />
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

// ============================================
// FULL PAGE
// ============================================
export const FullPage: StoryObj = {
  name: 'Full Page Demo',
  render: () => (
    <div className="min-h-screen bg-slate-50">
      {/* Top nav */}
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
          <span className="font-semibold">AskElephant</span>
          <nav className="flex items-center gap-6 text-sm">
            <a href="#" className="text-muted-foreground hover:text-foreground">Home</a>
            <a href="#" className="text-muted-foreground hover:text-foreground">Meetings</a>
            <a href="#" className="font-medium">Settings</a>
          </nav>
        </div>
      </div>

      {/* Settings nav */}
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-6">
          <nav className="flex gap-8 -mb-px">
            <button className="py-3 text-sm text-muted-foreground border-b-2 border-transparent">
              Profile
            </button>
            <button className="py-3 text-sm text-muted-foreground border-b-2 border-transparent">
              Workspace
            </button>
            <button className="py-3 text-sm text-muted-foreground border-b-2 border-transparent">
              Integrations
            </button>
            <button className="py-3 text-sm font-medium border-b-2 border-primary">
              Early Access
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="py-8">
        <BetaFeaturesSettingsV4 features={MOCK_FEATURES} defaultTab="beta" />
      </div>
    </div>
  ),
};
