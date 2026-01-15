import type { Meta, StoryObj } from '@storybook/react';
import { StageBadge, StageIcon, FeatureIndicator, NewBadge } from './StageBadge';
import { BetaFeaturesSettingsV3 } from './BetaFeaturesSettings';
import {
  NavigationExample,
  PageHeaderExample,
  FeatureCardsExample,
  ButtonsExample,
  TableExample,
  ModalExample,
  DropdownExample,
} from './FeatureFlagExamples';
import { MOCK_FEATURES } from './types';

// ============================================
// META
// ============================================
const meta: Meta = {
  title: 'Prototypes/ReleaseLifecycle/V3',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Release Lifecycle V3 - Professional Edition

Updates from V2:
- **No emojis** - Professional text-based badges and icons
- **Clear auto-enroll messaging** - Explains that enabling auto-enroll means new features are automatically enabled
- **Comprehensive UI examples** - Shows how badges appear across navigation, headers, buttons, tables, modals
        `,
      },
    },
  },
};

export default meta;

// ============================================
// SETTINGS PANEL
// ============================================
export const Settings: StoryObj = {
  name: 'Settings Panel',
  render: () => <BetaFeaturesSettingsV3 features={MOCK_FEATURES} defaultTab="beta" />,
};

export const SettingsLab: StoryObj = {
  name: 'Settings: Lab Tab',
  render: () => <BetaFeaturesSettingsV3 features={MOCK_FEATURES} defaultTab="lab" />,
};

export const SettingsAlpha: StoryObj = {
  name: 'Settings: Alpha Tab',
  render: () => <BetaFeaturesSettingsV3 features={MOCK_FEATURES} defaultTab="alpha" />,
};

export const SettingsLoading: StoryObj = {
  name: 'Settings: Loading',
  render: () => <BetaFeaturesSettingsV3 features={[]} isLoading={true} />,
};

export const SettingsError: StoryObj = {
  name: 'Settings: Error',
  render: () => (
    <BetaFeaturesSettingsV3
      features={[]}
      error="Failed to load features. Please check your connection and try again."
    />
  ),
};

// ============================================
// BADGE COMPONENTS
// ============================================
export const BadgeVariants: StoryObj = {
  name: 'Badges: All Variants',
  parameters: { layout: 'centered' },
  render: () => (
    <div className="p-8 space-y-8">
      <div>
        <h3 className="text-sm font-medium mb-4">Badge Variants</h3>
        <table className="text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 pr-8">Stage</th>
              <th className="text-left py-2 px-4">Default</th>
              <th className="text-left py-2 px-4">Outline</th>
              <th className="text-left py-2 px-4">Solid</th>
            </tr>
          </thead>
          <tbody>
            {(['lab', 'alpha', 'beta'] as const).map((stage) => (
              <tr key={stage} className="border-b">
                <td className="py-3 pr-8 font-medium capitalize">{stage}</td>
                <td className="py-3 px-4">
                  <StageBadge stage={stage} variant="default" showTooltip={false} />
                </td>
                <td className="py-3 px-4">
                  <StageBadge stage={stage} variant="outline" showTooltip={false} />
                </td>
                <td className="py-3 px-4">
                  <StageBadge stage={stage} variant="solid" showTooltip={false} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-4">Badge Sizes</h3>
        <div className="flex items-center gap-8">
          {(['xs', 'sm', 'md'] as const).map((size) => (
            <div key={size} className="text-center">
              <StageBadge stage="beta" size={size} showTooltip={false} />
              <p className="text-xs text-muted-foreground mt-2">{size}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-4">Stage Icons</h3>
        <div className="flex items-center gap-6">
          {(['lab', 'alpha', 'beta'] as const).map((stage) => (
            <div key={stage} className="text-center">
              <StageIcon stage={stage} size="md" />
              <p className="text-xs text-muted-foreground mt-2 capitalize">{stage}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-4">New Badge</h3>
        <div className="flex items-center gap-4">
          <NewBadge />
          <span className="text-sm text-muted-foreground">For recently added features</span>
        </div>
      </div>
    </div>
  ),
};

// ============================================
// UI EXAMPLES
// ============================================
export const ExampleNavigation: StoryObj = {
  name: 'Example: Navigation',
  parameters: { layout: 'centered' },
  render: () => (
    <div className="p-8">
      <h2 className="text-lg font-semibold mb-4">Navigation Sidebar</h2>
      <p className="text-sm text-muted-foreground mb-6">
        How feature flags appear in the main navigation
      </p>
      <NavigationExample />
    </div>
  ),
};

export const ExamplePageHeaders: StoryObj = {
  name: 'Example: Page Headers',
  parameters: { layout: 'centered' },
  render: () => (
    <div className="p-8 max-w-2xl">
      <h2 className="text-lg font-semibold mb-4">Page Headers</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Different header treatments based on feature stage. Lab features get prominent warnings.
      </p>
      <PageHeaderExample />
    </div>
  ),
};

export const ExampleCards: StoryObj = {
  name: 'Example: Feature Cards',
  parameters: { layout: 'centered' },
  render: () => (
    <div className="p-8 max-w-2xl">
      <h2 className="text-lg font-semibold mb-4">Feature Cards</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Card styling varies by stage. Lab features have dashed borders and muted backgrounds.
      </p>
      <FeatureCardsExample />
    </div>
  ),
};

export const ExampleButtons: StoryObj = {
  name: 'Example: Buttons',
  parameters: { layout: 'centered' },
  render: () => (
    <div className="p-8 max-w-xl">
      <h2 className="text-lg font-semibold mb-4">Buttons with Badges</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Inline badges, suffix badges, and corner badges for icon buttons.
      </p>
      <ButtonsExample />
    </div>
  ),
};

export const ExampleTable: StoryObj = {
  name: 'Example: Table/List',
  parameters: { layout: 'centered' },
  render: () => (
    <div className="p-8 max-w-2xl">
      <h2 className="text-lg font-semibold mb-4">Table with Stage Indicators</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Lab features can have distinct row styling to stand out.
      </p>
      <TableExample />
    </div>
  ),
};

export const ExampleModal: StoryObj = {
  name: 'Example: Modal/Dialog',
  parameters: { layout: 'centered' },
  render: () => (
    <div className="p-8">
      <h2 className="text-lg font-semibold mb-4">Modal with Beta Notice</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Modals for beta features include a notice banner below the header.
      </p>
      <ModalExample />
    </div>
  ),
};

export const ExampleDropdown: StoryObj = {
  name: 'Example: Dropdown Menu',
  parameters: { layout: 'centered' },
  render: () => (
    <div className="p-8">
      <h2 className="text-lg font-semibold mb-4">Dropdown with Badges</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Badges appear right-aligned in dropdown menu items.
      </p>
      <DropdownExample />
    </div>
  ),
};

// ============================================
// COMPREHENSIVE OVERVIEW
// ============================================
export const AllExamples: StoryObj = {
  name: 'All UI Examples',
  render: () => (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Feature Flag UI Patterns</h1>
          <p className="text-muted-foreground">
            Comprehensive examples of how stage badges appear across different UI components.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Navigation */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="font-semibold mb-4">Navigation</h2>
            <NavigationExample />
          </div>

          {/* Dropdown */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="font-semibold mb-4">Dropdown Menu</h2>
            <DropdownExample />
          </div>
        </div>

        {/* Page Headers */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="font-semibold mb-4">Page Headers by Stage</h2>
          <PageHeaderExample />
        </div>

        {/* Cards */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="font-semibold mb-4">Feature Cards</h2>
          <FeatureCardsExample />
        </div>

        {/* Buttons */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="font-semibold mb-4">Buttons</h2>
          <ButtonsExample />
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="font-semibold mb-4">Table/List View</h2>
          <TableExample />
        </div>

        {/* Modal */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="font-semibold mb-4">Modal/Dialog</h2>
          <div className="max-w-md mx-auto">
            <ModalExample />
          </div>
        </div>
      </div>
    </div>
  ),
};

// ============================================
// FULL PAGE INTEGRATION
// ============================================
export const FullPageDemo: StoryObj = {
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
        <BetaFeaturesSettingsV3 features={MOCK_FEATURES} defaultTab="beta" />
      </div>
    </div>
  ),
};
