import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { HubSpotAgentConfigV3 } from './HubSpotAgentConfigV3';
import type { HubSpotAgentNodeConfigV3 } from './types';
import { MOCK_HUBSPOT_PROPERTIES, createDefaultRelatedActivities } from './types';

const meta: Meta<typeof HubSpotAgentConfigV3> = {
  title: 'Prototypes/HubSpotConfig/v3-Action/HubSpotAgentConfig',
  component: HubSpotAgentConfigV3,
  tags: [],
  args: {
    config: {
      objectType: 'deal',
      actionType: 'update_or_create',
      properties: [],
      contextSource: 'latest_call',
      approvalMode: 'review',
      matchSignals: ['company_domain', 'deal_name'],
      matchResolution: 'review',
      noMatchBehavior: 'create',
      createRequiredFields: ['dealname', 'amount'],
      relatedActivities: createDefaultRelatedActivities(),
    },
    onConfigChange: () => undefined,
    propertiesByObjectType: MOCK_HUBSPOT_PROPERTIES,
    previewState: 'idle',
  },
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div className="max-w-3xl mx-auto p-6 bg-background text-foreground">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof HubSpotAgentConfigV3>;

function InteractiveHubSpotAgentConfigV3({
  initialConfig,
  previewState,
}: {
  initialConfig: HubSpotAgentNodeConfigV3;
  previewState?: 'idle' | 'loading' | 'success' | 'error' | 'low_confidence' | 'empty';
}) {
  const [config, setConfig] = useState(initialConfig);
  return (
    <HubSpotAgentConfigV3
      config={config}
      onConfigChange={setConfig}
      propertiesByObjectType={MOCK_HUBSPOT_PROPERTIES}
      previewState={previewState}
    />
  );
}

const baseConfig: HubSpotAgentNodeConfigV3 = {
  objectType: 'deal',
  actionType: 'update_or_create',
  properties: [],
  contextSource: 'latest_call',
  approvalMode: 'review',
  matchSignals: ['company_domain', 'deal_name'],
  matchResolution: 'review',
  noMatchBehavior: 'create',
  createRequiredFields: ['dealname', 'amount'],
  relatedActivities: createDefaultRelatedActivities(),
};

export const V3_Empty: Story = {
  render: () => <InteractiveHubSpotAgentConfigV3 initialConfig={baseConfig} previewState="empty" />,
};

export const V3_UpdateConfigured: Story = {
  render: () => (
    <InteractiveHubSpotAgentConfigV3
      initialConfig={{
        ...baseConfig,
        actionType: 'update',
        approvalMode: 'auto',
        properties: [
          {
            propertyName: 'probability_to_close',
            instruction:
              'Estimate probability to close based on buyer enthusiasm, risks, and timeline.',
            readBeforeWrite: true,
            dependencies: ['sales_skill_score', 'why_will_fail'],
            writeMode: 'overwrite',
          },
          {
            propertyName: 'next_step',
            instruction: 'Extract the agreed next step from the conversation.',
            readBeforeWrite: false,
            dependencies: [],
            writeMode: 'overwrite',
          },
        ],
      }}
      previewState="success"
    />
  ),
};

export const V3_UpdateOrCreate: Story = {
  render: () => (
    <InteractiveHubSpotAgentConfigV3
      initialConfig={{
        ...baseConfig,
        properties: [
          {
            propertyName: 'dealstage',
            instruction: 'Suggest the deal stage based on call signals.',
            readBeforeWrite: true,
            dependencies: [],
            writeMode: 'overwrite',
          },
        ],
      }}
      previewState="low_confidence"
    />
  ),
};

export const V3_CreateNewObject: Story = {
  render: () => (
    <InteractiveHubSpotAgentConfigV3
      initialConfig={{
        ...baseConfig,
        actionType: 'create',
        approvalMode: 'review',
        properties: [
          {
            propertyName: 'dealname',
            instruction: 'Use the company name and product discussed.',
            readBeforeWrite: false,
            dependencies: [],
            writeMode: 'overwrite',
          },
          {
            propertyName: 'amount',
            instruction: 'Extract the estimated deal amount if stated.',
            readBeforeWrite: false,
            dependencies: [],
            writeMode: 'overwrite',
          },
        ],
      }}
      previewState="idle"
    />
  ),
};

export const V3_WithNotesTasks: Story = {
  render: () => (
    <InteractiveHubSpotAgentConfigV3
      initialConfig={{
        ...baseConfig,
        properties: [
          {
            propertyName: 'next_step',
            instruction: 'Extract the next step agreed on in the call.',
            readBeforeWrite: false,
            dependencies: [],
            writeMode: 'overwrite',
          },
        ],
        relatedActivities: {
          createNote: true,
          noteTemplate: 'Summarize the meeting and list key blockers.',
          createTask: true,
          taskTemplate: 'Send proposal to the buying committee.',
          taskDue: 'next_day',
        },
      }}
      previewState="success"
    />
  ),
};

export const V3_CustomObject: Story = {
  render: () => (
    <InteractiveHubSpotAgentConfigV3
      initialConfig={{
        ...baseConfig,
        objectType: 'custom',
        customObjectLabel: 'Implementation Project',
        properties: [
          {
            propertyName: 'custom_object_stage',
            instruction: 'Set the project stage based on onboarding progress.',
            readBeforeWrite: true,
            dependencies: [],
            writeMode: 'overwrite',
          },
        ],
      }}
      previewState="success"
    />
  ),
};

export const V3_Loading: Story = {
  render: () => (
    <InteractiveHubSpotAgentConfigV3 initialConfig={baseConfig} previewState="loading" />
  ),
};

export const V3_Error: Story = {
  render: () => (
    <InteractiveHubSpotAgentConfigV3 initialConfig={baseConfig} previewState="error" />
  ),
};
