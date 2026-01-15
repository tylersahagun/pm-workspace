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

1. **Consolidated Stages**: Only Labs and Beta (removed Alpha)
2. **No Auto-Enroll for Labs**: Users must manually opt-in
3. **Personal vs Workspace Permissions**: 
   - Workspace features only visible to Managers/Owners
   - Clear labeling of scope impact
4. **"How it works" Dialog**: Shown before enabling any feature
5. **No Icons in Tabs**: Clean text-only tab design
6. **Enrollment Logic**:
   - Labs: Manual only (no auto-enroll available)
   - Beta: Auto-enroll optional

## Feature Lifecycle

| Stage | Behavior | Auto-Enroll |
|-------|----------|-------------|
| Labs | Manual opt-in, high risk | Not available |
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

export const SettingsLabs: StoryObj = {
  name: 'Settings: Labs Tab',
  render: () => <BetaFeaturesSettingsV4 features={MOCK_FEATURES} defaultTab="labs" />,
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
          {(['labs', 'beta'] as FeatureStage[]).map((stage) => (
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
          <FeatureBadgeRow stage="labs" scope="personal" />
          <FeatureBadgeRow stage="labs" scope="workspace" />
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
            Labs features require manual opt-in. Beta features support auto-enrollment.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Labs */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <StageBadge stage="labs" size="md" showTooltip={false} />
              <h2 className="font-semibold">Labs</h2>
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
              <StageBadge stage="labs" showTooltip={false} />
              <p className="mt-2 font-medium">Labs</p>
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
// RELEASE LIFECYCLE DOCUMENTATION
// ============================================
export const ReleaseLifecycleDocumentation: StoryObj = {
  name: 'Release Lifecycle Documentation',
  render: () => {
    const CheckIcon = ({ color }: { color: string }) => (
      <svg className={`w-4 h-4 ${color} mt-0.5 flex-shrink-0`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    );

    const XIcon = ({ color }: { color: string }) => (
      <svg className={`w-4 h-4 ${color} mt-0.5 flex-shrink-0`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    );

    const ArrowRight = () => (
      <svg className="w-8 h-8 text-slate-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    );

    const stages = [
      {
        name: 'Labs',
        badge: <StageBadge stage="labs" size="md" showTooltip={false} />,
        color: 'purple',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200',
        textColor: 'text-purple-900',
        subTextColor: 'text-purple-700',
        iconColor: 'text-purple-600',
        ttl: '4-6 weeks max',
        enrollment: 'Manual opt-in only',
        enrollmentDetail: 'Users must individually enable. No auto-enrollment available.',
        flagBehavior: 'Behind feature flag',
        audience: 'Internal team + Power users who request access',
        description: 'Early-stage features with high risk of breaking. Used for intentional feedback gathering.',
        docRequirements: [
          { text: 'Internal Notion doc with feature overview', required: true },
          { text: '"How it works" dialog in UI before enabling', required: true },
          { text: 'Knowledge base article', required: false },
          { text: 'Release notes mention', required: false },
        ],
        communication: [
          { team: 'Engineering', action: 'Creates feature flag, implements' },
          { team: 'Product', action: 'Defines scope, owns Notion doc' },
          { team: 'Revenue', action: 'Notified via weekly sync, can offer to select customers' },
          { team: 'Marketing', action: 'No action required' },
        ],
        risks: ['May break or change significantly', 'No SLA on stability', 'Could be deprecated'],
      },
      {
        name: 'Alpha',
        badge: <span className="inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold uppercase tracking-wider bg-cyan-50 text-cyan-700 border border-cyan-200">Alpha</span>,
        color: 'cyan',
        bgColor: 'bg-cyan-50',
        borderColor: 'border-cyan-200',
        textColor: 'text-cyan-900',
        subTextColor: 'text-cyan-700',
        iconColor: 'text-cyan-600',
        ttl: '2-4 weeks',
        enrollment: 'Self-service opt-in',
        enrollmentDetail: 'Users can toggle on in settings. Individual feature control.',
        flagBehavior: 'No feature flag - visible in Alpha/Beta settings',
        audience: 'Any user who enables in settings',
        description: 'Feature-complete but still refining. Gathering targeted feedback.',
        docRequirements: [
          { text: 'Internal Notion doc with feature overview', required: true },
          { text: '"How it works" dialog in UI', required: true },
          { text: 'Knowledge base article (draft)', required: true },
          { text: 'Release notes mention', required: false },
        ],
        communication: [
          { team: 'Engineering', action: 'Removes feature flag, adds to settings' },
          { team: 'Product', action: 'Updates docs, monitors feedback' },
          { team: 'Revenue', action: 'Weekly sync update, can demo to customers' },
          { team: 'Marketing', action: 'Aware, preparing launch materials' },
        ],
        risks: ['Minor bugs possible', 'UI may change slightly', 'Committed to shipping'],
      },
      {
        name: 'Beta (Auto-enabled)',
        badge: (
          <div className="flex items-center gap-1">
            <StageBadge stage="beta" size="md" showTooltip={false} />
            <span className="text-xs bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded">auto</span>
          </div>
        ),
        color: 'indigo',
        bgColor: 'bg-indigo-100',
        borderColor: 'border-indigo-300',
        textColor: 'text-indigo-900',
        subTextColor: 'text-indigo-700',
        iconColor: 'text-indigo-600',
        ttl: '2-3 weeks',
        enrollment: 'Auto-enabled with beta badge',
        enrollmentDetail: 'Enabled for all users. Beta badge shown in UI. Users can disable.',
        flagBehavior: 'No feature flag - GA code path with badge',
        audience: 'All users (with clear beta indicator)',
        description: 'Confident in stability. Running final validation before removing badge.',
        docRequirements: [
          { text: 'Knowledge base article published', required: true },
          { text: 'In-app "What\'s New" mention', required: true },
          { text: 'Release notes published', required: true },
          { text: 'Internal training complete', required: true },
        ],
        communication: [
          { team: 'Engineering', action: 'Enables for all, monitors for issues' },
          { team: 'Product', action: 'Publishes KB article, monitors adoption' },
          { team: 'Revenue', action: 'Trained on feature, can sell/support' },
          { team: 'Marketing', action: 'Launch prep complete, may soft launch' },
        ],
        risks: ['Should be stable', 'Badge indicates still gathering feedback'],
      },
      {
        name: 'New',
        badge: <NewBadge />,
        color: 'emerald',
        bgColor: 'bg-emerald-50',
        borderColor: 'border-emerald-200',
        textColor: 'text-emerald-900',
        subTextColor: 'text-emerald-700',
        iconColor: 'text-emerald-600',
        ttl: '30 days (badge auto-expires)',
        enrollment: 'Enabled for all users',
        enrollmentDetail: 'GA feature with "New" badge to drive discovery.',
        flagBehavior: 'No feature flag',
        audience: 'All users',
        description: 'Generally available. "New" badge drives awareness and adoption.',
        docRequirements: [
          { text: 'Knowledge base article published', required: true },
          { text: 'Release notes published', required: true },
          { text: 'Marketing launch executed', required: true },
          { text: 'Internal training complete', required: true },
        ],
        communication: [
          { team: 'Engineering', action: 'Feature complete, monitoring' },
          { team: 'Product', action: 'Tracking adoption metrics' },
          { team: 'Revenue', action: 'Actively selling, full support' },
          { team: 'Marketing', action: 'Launch executed, ongoing promotion' },
        ],
        risks: ['None expected - fully stable'],
      },
      {
        name: 'GA',
        badge: <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">Core</span>,
        color: 'slate',
        bgColor: 'bg-slate-50',
        borderColor: 'border-slate-200',
        textColor: 'text-slate-900',
        subTextColor: 'text-slate-700',
        iconColor: 'text-slate-600',
        ttl: 'Permanent',
        enrollment: 'Core product',
        enrollmentDetail: 'Part of the core product. No badges, no settings toggle.',
        flagBehavior: 'No feature flag',
        audience: 'All users',
        description: 'Established feature. Part of the standard product experience.',
        docRequirements: [
          { text: 'Knowledge base article maintained', required: true },
          { text: 'Part of onboarding/training', required: true },
        ],
        communication: [
          { team: 'All Teams', action: 'Standard product feature' },
        ],
        risks: [],
      },
    ];

    return (
      <div className="min-h-screen bg-slate-100 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold">Release Lifecycle Documentation</h1>
                <p className="text-muted-foreground">Feature release process for Product, Engineering, Design & Revenue</p>
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-4 mt-6">
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">5</p>
                <p className="text-sm text-muted-foreground">Release Stages</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-2xl font-bold text-indigo-600">~8-13</p>
                <p className="text-sm text-muted-foreground">Weeks to GA (typical)</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-2xl font-bold text-emerald-600">4</p>
                <p className="text-sm text-muted-foreground">Teams Involved</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-2xl font-bold text-slate-600">30d</p>
                <p className="text-sm text-muted-foreground">"New" Badge TTL</p>
              </div>
            </div>
          </div>

          {/* Visual Timeline */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="font-semibold mb-6">Feature Lifecycle Flow</h2>
            <div className="flex items-center justify-between gap-2 overflow-x-auto pb-4">
              {stages.map((stage, index) => (
                <div key={stage.name} className="flex items-center gap-2 flex-shrink-0">
                  <div className={`text-center p-4 ${stage.bgColor} border-2 ${stage.borderColor} rounded-lg min-w-[140px]`}>
                    <div className="flex justify-center mb-2">{stage.badge}</div>
                    <p className="font-medium text-sm">{stage.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stage.ttl}</p>
                  </div>
                  {index < stages.length - 1 && <ArrowRight />}
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Stage Cards */}
          <div className="grid gap-6">
            {stages.map((stage) => (
              <div key={stage.name} className={`bg-white rounded-lg shadow-sm overflow-hidden border-l-4 ${stage.borderColor}`}>
                {/* Stage Header */}
                <div className={`${stage.bgColor} p-4 border-b ${stage.borderColor}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {stage.badge}
                      <div>
                        <h3 className={`font-semibold ${stage.textColor}`}>{stage.name}</h3>
                        <p className={`text-sm ${stage.subTextColor}`}>{stage.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${stage.textColor}`}>TTL: {stage.ttl}</p>
                      <p className={`text-xs ${stage.subTextColor}`}>{stage.enrollment}</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 grid md:grid-cols-3 gap-6">
                  {/* Enrollment & Access */}
                  <div>
                    <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                      <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Access & Enrollment
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className={`p-2 rounded ${stage.bgColor}`}>
                        <p className={`font-medium ${stage.textColor}`}>{stage.enrollment}</p>
                        <p className={`text-xs ${stage.subTextColor} mt-1`}>{stage.enrollmentDetail}</p>
                      </div>
                      <p className="text-muted-foreground"><span className="font-medium">Audience:</span> {stage.audience}</p>
                      <p className="text-muted-foreground"><span className="font-medium">Flag:</span> {stage.flagBehavior}</p>
                    </div>
                  </div>

                  {/* Documentation Requirements */}
                  <div>
                    <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                      <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Documentation Requirements
                    </h4>
                    <ul className="space-y-1.5 text-sm">
                      {stage.docRequirements.map((doc, i) => (
                        <li key={i} className="flex items-start gap-2">
                          {doc.required ? (
                            <CheckIcon color={stage.iconColor} />
                          ) : (
                            <span className="w-4 h-4 mt-0.5 flex-shrink-0 text-center text-muted-foreground">○</span>
                          )}
                          <span className={doc.required ? '' : 'text-muted-foreground'}>{doc.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Team Communication */}
                  <div>
                    <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                      <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Team Responsibilities
                    </h4>
                    <ul className="space-y-2 text-sm">
                      {stage.communication.map((comm, i) => (
                        <li key={i}>
                          <span className="font-medium text-xs bg-slate-100 px-1.5 py-0.5 rounded">{comm.team}</span>
                          <p className="text-muted-foreground mt-0.5">{comm.action}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Risks */}
                {stage.risks.length > 0 && (
                  <div className="px-6 pb-4">
                    <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 rounded-lg p-3">
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <div>
                        <span className="font-medium">User expectations: </span>
                        {stage.risks.join(' • ')}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Quick Reference Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="font-semibold">Quick Reference: Stage Comparison</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left p-3 font-medium">Stage</th>
                    <th className="text-left p-3 font-medium">TTL</th>
                    <th className="text-left p-3 font-medium">Access</th>
                    <th className="text-left p-3 font-medium">Marketing Launch</th>
                    <th className="text-left p-3 font-medium">Revenue Can Sell</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="p-3"><StageBadge stage="labs" showTooltip={false} /></td>
                    <td className="p-3">4-6 weeks</td>
                    <td className="p-3">Manual opt-in</td>
                    <td className="p-3"><XIcon color="text-slate-400" /></td>
                    <td className="p-3 text-amber-600">⚠ With caveats</td>
                  </tr>
                  <tr>
                    <td className="p-3"><span className="text-[10px] font-semibold uppercase tracking-wider bg-cyan-50 text-cyan-700 border border-cyan-200 px-1.5 py-0.5 rounded">Alpha</span></td>
                    <td className="p-3">2-4 weeks</td>
                    <td className="p-3">Self-service toggle</td>
                    <td className="p-3"><XIcon color="text-slate-400" /></td>
                    <td className="p-3 text-amber-600">⚠ Demo only</td>
                  </tr>
                  <tr>
                    <td className="p-3 flex items-center gap-1">
                      <StageBadge stage="beta" showTooltip={false} />
                      <span className="text-xs bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded">auto</span>
                    </td>
                    <td className="p-3">2-3 weeks</td>
                    <td className="p-3">Auto-enabled</td>
                    <td className="p-3 text-amber-600">⚠ Soft launch</td>
                    <td className="p-3"><CheckIcon color="text-emerald-600" /></td>
                  </tr>
                  <tr>
                    <td className="p-3"><NewBadge /></td>
                    <td className="p-3">30 days</td>
                    <td className="p-3">All users</td>
                    <td className="p-3"><CheckIcon color="text-emerald-600" /></td>
                    <td className="p-3"><CheckIcon color="text-emerald-600" /></td>
                  </tr>
                  <tr>
                    <td className="p-3"><span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">Core</span></td>
                    <td className="p-3">Permanent</td>
                    <td className="p-3">All users</td>
                    <td className="p-3 text-slate-400">—</td>
                    <td className="p-3"><CheckIcon color="text-emerald-600" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Communication Contract */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="font-semibold mb-6">Communication Contract</h2>
            <div className="flex items-start gap-4 overflow-x-auto pb-4">
              {/* Step 1 */}
              <div className="flex-1 min-w-[200px]">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm font-bold flex-shrink-0">1</span>
                  <h3 className="text-sm font-medium">Preemptive</h3>
                </div>
                <div className="ml-10 p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs font-medium text-slate-700 mb-2">Before Release</p>
                  <ul className="space-y-1.5 text-xs text-muted-foreground">
                    <li>• Product roadmap up to date</li>
                    <li>• Weekly sync with Revenue</li>
                    <li>• Marketing aware of pipeline</li>
                  </ul>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex items-center pt-8 flex-shrink-0">
                <svg className="w-6 h-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>

              {/* Step 2 */}
              <div className="flex-1 min-w-[200px]">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm font-bold flex-shrink-0">2</span>
                  <h3 className="text-sm font-medium">At Release</h3>
                </div>
                <div className="ml-10 p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs font-medium text-slate-700 mb-2">Same Day</p>
                  <ul className="space-y-1.5 text-xs text-muted-foreground">
                    <li>• Post in #product-updates</li>
                    <li>• Update Notion release notes</li>
                    <li>• Tyler owns accountability</li>
                  </ul>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex items-center pt-8 flex-shrink-0">
                <svg className="w-6 h-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>

              {/* Step 3 */}
              <div className="flex-1 min-w-[200px]">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm font-bold flex-shrink-0">3</span>
                  <h3 className="text-sm font-medium">Weekly Sync</h3>
                </div>
                <div className="ml-10 p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs font-medium text-slate-700 mb-2">Every Monday</p>
                  <ul className="space-y-1.5 text-xs text-muted-foreground">
                    <li>• Present to Revenue team</li>
                    <li>• Review stage changes</li>
                    <li>• Upcoming releases</li>
                  </ul>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex items-center pt-8 flex-shrink-0">
                <svg className="w-6 h-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>

              {/* Step 4 */}
              <div className="flex-1 min-w-[200px]">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 text-sm font-bold flex-shrink-0">4</span>
                  <h3 className="text-sm font-medium">Customer Comms</h3>
                </div>
                <div className="ml-10 p-3 bg-emerald-50 rounded-lg">
                  <p className="text-xs font-medium text-emerald-700 mb-2">Ongoing</p>
                  <ul className="space-y-1.5 text-xs text-muted-foreground">
                    <li>• Monthly product email</li>
                    <li>• In-app "What's New"</li>
                    <li>• P1/P2 dedicated launch</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground py-4">
            <p>Release Lifecycle v4 • Last updated: January 2026</p>
            <p className="mt-1">Questions? Reach out in #product-process</p>
          </div>
        </div>
      </div>
    );
  },
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
