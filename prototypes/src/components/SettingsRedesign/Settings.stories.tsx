import type { Meta, StoryObj } from '@storybook/react';
import { SettingsPage } from './SettingsPage';
import { MOCK_WORKSPACE_SETTINGS, MOCK_PERSONAL_SETTINGS } from './types';

const meta: Meta<typeof SettingsPage> = {
  title: 'Prototypes/SettingsRedesign',
  component: SettingsPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Settings Redesign

**Created:** 2026-01-16 (Roadmap Planning Session)
**Owners:** Skylar/Tyler

## KEY DECISION: Privacy Agent Scope

**Confirmed by verbal agreement (Woody, Bryan, Skylar, Tyler):**

| Setting Type | Applies To | User Can Control |
|--------------|------------|------------------|
| Workspace Privacy Settings | Managers & Owners ONLY | No |
| Personal Privacy Settings | Individual (self) | Yes |
| User Calls | NOT affected by workspace | Can mark PUBLIC only |

## Problem Solved

The previous settings experience created confusion about what applied to whom. Users couldn't tell if workspace settings affected their calls, and there was no clear separation between admin and personal settings.

## Key Changes

1. **Clear Scope Labeling** - "Manager & Owner Settings" tab instead of ambiguous "Workspace Settings"
2. **Info Banner** - Explicitly states that rules apply to manager/owner calls only
3. **Personal Settings** - Users can set their default visibility (public or follow workspace rules)
4. **Feature Request CTA** - For users who want user-level privacy control
5. **Limitation Note** - Users can mark public but not private

## Design Decisions

- Two-tab layout: Workspace (for admins) and Personal (for everyone)
- Non-admins only see Personal Settings tab
- Clear visual hierarchy with info banners
- Progressive disclosure for privacy rules
- Feature request mechanism for future enhancements

## Success Metrics

- Settings-related support tickets: -50%
- Privacy agent adoption (managers): >70%
- Settings configuration success rate: >95%
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof SettingsPage>;

// ============================================
// Default (Manager View)
// ============================================
export const ManagerView: Story = {
  name: 'Manager View (Default)',
  args: {
    userRole: 'manager',
    workspaceSettings: MOCK_WORKSPACE_SETTINGS,
    personalSettings: MOCK_PERSONAL_SETTINGS,
    activeSection: 'workspace',
  },
  parameters: {
    docs: {
      description: {
        story: 'Default view for managers. Shows both workspace (Manager & Owner) settings and personal settings tabs.',
      },
    },
  },
};

// ============================================
// Owner View
// ============================================
export const OwnerView: Story = {
  name: 'Owner View',
  args: {
    userRole: 'owner',
    workspaceSettings: MOCK_WORKSPACE_SETTINGS,
    personalSettings: MOCK_PERSONAL_SETTINGS,
    activeSection: 'workspace',
  },
  parameters: {
    docs: {
      description: {
        story: 'Owners have the same view as managers - full access to workspace and personal settings.',
      },
    },
  },
};

// ============================================
// User View (Non-Admin)
// ============================================
export const UserView: Story = {
  name: 'User View (Non-Admin)',
  args: {
    userRole: 'user',
    workspaceSettings: MOCK_WORKSPACE_SETTINGS,
    personalSettings: MOCK_PERSONAL_SETTINGS,
    activeSection: 'personal',
  },
  parameters: {
    docs: {
      description: {
        story: 'Regular users only see the Personal Settings tab. They cannot configure workspace-level privacy rules.',
      },
    },
  },
};

// ============================================
// Personal Settings Focus
// ============================================
export const PersonalSettingsFocus: Story = {
  name: 'Personal Settings Tab',
  args: {
    userRole: 'manager',
    workspaceSettings: MOCK_WORKSPACE_SETTINGS,
    personalSettings: MOCK_PERSONAL_SETTINGS,
    activeSection: 'personal',
  },
  parameters: {
    docs: {
      description: {
        story: 'Focused view on Personal Settings where users can configure their default visibility.',
      },
    },
  },
};

// ============================================
// Privacy Agent Disabled
// ============================================
export const PrivacyAgentDisabled: Story = {
  name: 'Privacy Agent Disabled',
  args: {
    userRole: 'manager',
    workspaceSettings: {
      ...MOCK_WORKSPACE_SETTINGS,
      privacy: {
        ...MOCK_WORKSPACE_SETTINGS.privacy,
        enabled: false,
      },
    },
    personalSettings: MOCK_PERSONAL_SETTINGS,
    activeSection: 'workspace',
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the settings page when the Privacy Agent is turned off.',
      },
    },
  },
};

// ============================================
// No Privacy Rules
// ============================================
export const NoPrivacyRules: Story = {
  name: 'No Privacy Rules Configured',
  args: {
    userRole: 'manager',
    workspaceSettings: {
      ...MOCK_WORKSPACE_SETTINGS,
      privacy: {
        ...MOCK_WORKSPACE_SETTINGS.privacy,
        rules: [],
      },
    },
    personalSettings: MOCK_PERSONAL_SETTINGS,
    activeSection: 'workspace',
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the empty state when no privacy rules have been configured yet.',
      },
    },
  },
};

// ============================================
// User Opted Into Public
// ============================================
export const UserOptedPublic: Story = {
  name: 'User Opted Into Public Meetings',
  args: {
    userRole: 'user',
    workspaceSettings: MOCK_WORKSPACE_SETTINGS,
    personalSettings: {
      defaultVisibility: 'public',
      allowTeamAccess: true,
    },
    activeSection: 'personal',
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows a user who has opted to make their meetings public by default.',
      },
    },
  },
};

// ============================================
// Many Privacy Rules
// ============================================
export const ManyPrivacyRules: Story = {
  name: 'Many Privacy Rules',
  args: {
    userRole: 'manager',
    workspaceSettings: {
      ...MOCK_WORKSPACE_SETTINGS,
      privacy: {
        ...MOCK_WORKSPACE_SETTINGS.privacy,
        rules: [
          ...MOCK_WORKSPACE_SETTINGS.privacy.rules,
          {
            id: '4',
            name: 'Legal Discussions',
            description: 'Mark meetings private when legal terms are discussed',
            enabled: true,
            conditions: ['Legal keywords detected', 'Attorney participant'],
            action: 'mark_private',
          },
          {
            id: '5',
            name: 'Performance Reviews',
            description: 'Keep 1-on-1 performance discussions private',
            enabled: true,
            conditions: ['1-on-1 meeting type', 'Contains performance keywords'],
            action: 'mark_private',
          },
          {
            id: '6',
            name: 'Sales Demo Calls',
            description: 'Keep demo calls public for coaching review',
            enabled: false,
            conditions: ['External participant', 'Demo keywords'],
            action: 'mark_public',
          },
        ],
      },
    },
    personalSettings: MOCK_PERSONAL_SETTINGS,
    activeSection: 'workspace',
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the settings page with multiple privacy rules configured.',
      },
    },
  },
};
