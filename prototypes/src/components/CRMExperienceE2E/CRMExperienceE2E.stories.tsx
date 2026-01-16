import type { Meta, StoryObj } from '@storybook/react';
import { OnboardingWizard } from './OnboardingWizard';
import { ActivityDashboard } from './ActivityDashboard';
import { AgentCommunicationCenter } from './AgentCommunicationCenter';
import { Inbox } from './Inbox';
import {
  MOCK_ACTIVITY_LOGS,
  MOCK_DASHBOARD_STATS,
  MOCK_ANOMALIES,
  MOCK_AGENT_MESSAGES,
  MOCK_INBOX_ITEMS,
} from './types';

// ============================================
// Onboarding Wizard Stories
// ============================================

const onboardingMeta: Meta<typeof OnboardingWizard> = {
  title: 'Prototypes/CRM Experience E2E/Onboarding Wizard',
  component: OnboardingWizard,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
## CRM Agent Onboarding Wizard

A confidence-building onboarding flow for setting up CRM automation.

### Key Features
- **Education First**: Users learn how agents work before configuring
- **Pre-built Templates**: Proven workflows for common call types
- **Test Before Activate**: See real output before going live
- **Progressive Disclosure**: Start simple, expand as confidence grows

### User Story Quote
> "I want to be able to actually test and see an output so that I have confidence. 
> That's the key there is I need the confidence."
        `,
      },
    },
  },
};

export default onboardingMeta;

type OnboardingStory = StoryObj<typeof OnboardingWizard>;

export const ConnectStep: OnboardingStory = {
  name: '1. Connect CRM',
  args: {
    initialState: {
      currentStep: 'connect',
    },
  },
};

export const EducationStep: OnboardingStory = {
  name: '2. Education',
  args: {
    initialState: {
      currentStep: 'education',
      crmConnected: true,
      crmType: 'hubspot',
    },
  },
};

export const ScopeStep: OnboardingStory = {
  name: '3. Select Scope',
  args: {
    initialState: {
      currentStep: 'scope',
      crmConnected: true,
      crmType: 'hubspot',
    },
  },
};

export const TemplatesStep: OnboardingStory = {
  name: '4. Choose Templates',
  args: {
    initialState: {
      currentStep: 'templates',
      crmConnected: true,
      crmType: 'hubspot',
      selectedCallType: 'discovery',
      enabledTemplates: ['discovery-basics', 'deal-risk'],
    },
  },
};

export const TestStep: OnboardingStory = {
  name: '5. Test on Real Data',
  args: {
    initialState: {
      currentStep: 'test',
      crmConnected: true,
      crmType: 'hubspot',
      selectedCallType: 'discovery',
      enabledTemplates: ['discovery-basics', 'deal-risk'],
    },
  },
};

export const ActivateStep: OnboardingStory = {
  name: '6. Activate',
  args: {
    initialState: {
      currentStep: 'activate',
      crmConnected: true,
      crmType: 'hubspot',
      selectedCallType: 'discovery',
      enabledTemplates: ['discovery-basics', 'deal-risk'],
      testResult: {
        matchedRecord: {
          id: 'deal-123',
          name: 'Acme Corp Expansion',
          type: 'deal',
          hubspotUrl: 'https://app.hubspot.com/contacts/123/deal/456',
        },
        matchConfidence: 0.94,
        fieldsToUpdate: [],
        warnings: [],
        overallConfidence: 0.88,
      },
    },
  },
};

// ============================================
// Activity Dashboard Stories
// ============================================

export const Dashboard: StoryObj<typeof ActivityDashboard> = {
  render: () => <ActivityDashboard />,
  name: 'Activity Dashboard',
  parameters: {
    docs: {
      description: {
        story: `
## Admin Activity Dashboard

Full visibility into all CRM agent operations.

### Key Features
- **Health Status Banner**: At-a-glance system health
- **Stats Overview**: Runs, success rate, pending approvals
- **Activity Timeline**: Filterable log of all agent actions
- **Anomaly Alerts**: Proactive issue surfacing

### User Story Quote
> "I'm able to get alerts of if something is broken. I'm able to come in manually 
> and see just activity logs and what's going on."
        `,
      },
    },
  },
};

export const DashboardWithWarning: StoryObj<typeof ActivityDashboard> = {
  render: () => (
    <ActivityDashboard
      healthStatus="warning"
      anomalies={MOCK_ANOMALIES}
    />
  ),
  name: 'Dashboard with Warning',
};

export const DashboardHealthy: StoryObj<typeof ActivityDashboard> = {
  render: () => (
    <ActivityDashboard
      healthStatus="healthy"
      anomalies={[]}
    />
  ),
  name: 'Dashboard Healthy',
};

// ============================================
// Agent Communication Center Stories
// ============================================

export const CommunicationCenter: StoryObj<typeof AgentCommunicationCenter> = {
  render: () => <AgentCommunicationCenter />,
  name: 'Agent Communication Center',
  parameters: {
    docs: {
      description: {
        story: `
## Agent Communication Center

Where users see what the agent is doing and respond to requests.

### Key Features
- **Action Required Section**: HITL requests prominently displayed
- **What I Did Feed**: Recent agent actions
- **Data Visibility Panel**: See what data the agent is touching
- **Self-Service CTA**: Discover personal automations

### User Story Quote
> "When I log in to AskElephant, I want a place where I can see the agent 
> communicating to me. This is what I did."
        `,
      },
    },
  },
};

export const CommunicationCenterEmpty: StoryObj<typeof AgentCommunicationCenter> = {
  render: () => <AgentCommunicationCenter messages={[]} />,
  name: 'Communication Center (Empty)',
};

// ============================================
// Inbox Stories
// ============================================

export const InboxWithItems: StoryObj<typeof Inbox> = {
  render: () => <Inbox />,
  name: 'Inbox',
  parameters: {
    docs: {
      description: {
        story: `
## Human-in-the-Loop Inbox

Fast approval workflow for CRM agent actions.

### Key Features
- **Quick Actions**: One-click approve/reject
- **Batch Operations**: Select multiple items
- **Confidence Indicators**: Visual confidence scores
- **Detail View**: Full context for complex decisions

### User Story Quote
> "The inbox. I think they have an inbox supposed to actually get stuff. 
> It workflows better. It makes the agent runs better."
        `,
      },
    },
  },
};

export const InboxEmpty: StoryObj<typeof Inbox> = {
  render: () => <Inbox items={[]} />,
  name: 'Inbox (All Caught Up)',
};
