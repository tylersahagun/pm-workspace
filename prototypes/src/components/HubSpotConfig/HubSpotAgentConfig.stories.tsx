import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { HubSpotAgentConfig } from './HubSpotAgentConfig';
import { PropertySelector } from './PropertySelector';
import { FieldConfigCard } from './FieldConfigCard';
import type { HubSpotAgentNodeConfig, PropertyConfig, HubSpotProperty } from './types';
import { MOCK_HUBSPOT_PROPERTIES, createDefaultPropertyConfig } from './types';

// ============================================
// V1 STANDALONE - Original standalone configuration UI
// This version shows the configuration as a standalone panel
// ============================================

const meta: Meta<typeof HubSpotAgentConfig> = {
  title: 'Prototypes/HubSpotConfig/v1-Standalone/HubSpotAgentConfig',
  component: HubSpotAgentConfig,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div className="max-w-2xl mx-auto p-6 bg-background text-foreground">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof HubSpotAgentConfig>;

// Interactive wrapper for stateful stories
function InteractiveHubSpotAgentConfig({
  initialConfig,
}: {
  initialConfig: HubSpotAgentNodeConfig;
}) {
  const [config, setConfig] = useState(initialConfig);
  return (
    <HubSpotAgentConfig
      config={config}
      onConfigChange={setConfig}
      propertiesByObjectType={MOCK_HUBSPOT_PROPERTIES}
    />
  );
}

export const Empty: Story = {
  render: () => (
    <InteractiveHubSpotAgentConfig
      initialConfig={{
        objectType: 'deal',
        properties: [],
        updateTrigger: 'after_call',
      }}
    />
  ),
};

export const WithSelectedProperties: Story = {
  render: () => (
    <InteractiveHubSpotAgentConfig
      initialConfig={{
        objectType: 'deal',
        properties: [
          {
            propertyName: 'probability_to_close',
            instruction:
              'Based on the conversation, estimate the probability of closing this deal. Consider: buyer enthusiasm, objections raised, decision timeline, and any competitive mentions.',
            readBeforeWrite: true,
            dependencies: ['sales_skill_score', 'why_will_fail', 'buyer_involvement'],
            writeMode: 'overwrite',
            syncToHubSpot: true,
          },
          {
            propertyName: 'next_step',
            instruction: 'Extract the specific next step agreed upon in the conversation.',
            readBeforeWrite: false,
            dependencies: [],
            writeMode: 'overwrite',
            syncToHubSpot: true,
          },
          {
            propertyName: 'next_step_date',
            instruction: 'Extract the date/time for the next step if mentioned.',
            readBeforeWrite: false,
            dependencies: ['next_step'],
            writeMode: 'overwrite',
            syncToHubSpot: true,
          },
        ],
        updateTrigger: 'after_call',
      }}
    />
  ),
};

export const FullDealScorecard: Story = {
  render: () => (
    <InteractiveHubSpotAgentConfig
      initialConfig={{
        objectType: 'deal',
        properties: [
          {
            propertyName: 'sales_skill_score',
            instruction:
              'Rate the sales rep performance from 0-100. Consider: discovery questions asked, objection handling, value articulation, and call control.',
            readBeforeWrite: false,
            dependencies: [],
            writeMode: 'overwrite',
            syncToHubSpot: false, // Internal scoring only
          },
          {
            propertyName: 'buyer_involvement',
            instruction:
              'Describe the buyer involvement level. Note: who was on the call, their roles, engagement level, and decision-making authority.',
            readBeforeWrite: true,
            dependencies: [],
            writeMode: 'append',
            syncToHubSpot: true,
          },
          {
            propertyName: 'why_will_buy',
            instruction: 'Extract reasons why the prospect will likely buy based on stated needs and pain points.',
            readBeforeWrite: true,
            dependencies: [],
            writeMode: 'overwrite',
            syncToHubSpot: true,
          },
          {
            propertyName: 'why_will_fail',
            instruction:
              'Identify risks and objections that could prevent this deal from closing. Be specific about concerns raised.',
            readBeforeWrite: true,
            dependencies: [],
            writeMode: 'overwrite',
            syncToHubSpot: true,
          },
          {
            propertyName: 'probability_to_close',
            instruction:
              'Calculate deal probability (0-100%). Weight: 30% sales skill, 30% buyer involvement, 20% reasons to buy, 20% risk mitigation.',
            readBeforeWrite: true,
            dependencies: ['sales_skill_score', 'buyer_involvement', 'why_will_buy', 'why_will_fail'],
            writeMode: 'overwrite',
            syncToHubSpot: true,
          },
          {
            propertyName: 'close_date_probability_context',
            instruction:
              'Explain the probability score. What factors increased/decreased it compared to the last update?',
            readBeforeWrite: true,
            dependencies: ['probability_to_close'],
            writeMode: 'overwrite',
            syncToHubSpot: true,
          },
        ],
        updateTrigger: 'after_call',
      }}
    />
  ),
};

export const Loading: Story = {
  render: () => {
    const [config, setConfig] = useState<HubSpotAgentNodeConfig>({
      objectType: 'deal',
      properties: [],
      updateTrigger: 'after_call',
    });
    return (
      <HubSpotAgentConfig
        config={config}
        onConfigChange={setConfig}
        propertiesByObjectType={MOCK_HUBSPOT_PROPERTIES}
        isLoading={true}
      />
    );
  },
};

export const ContactObjectType: Story = {
  render: () => (
    <InteractiveHubSpotAgentConfig
      initialConfig={{
        objectType: 'contact',
        properties: [
          {
            propertyName: 'jobtitle',
            instruction: 'Update job title if a new one is mentioned in the conversation.',
            readBeforeWrite: true,
            dependencies: [],
            writeMode: 'overwrite',
            syncToHubSpot: true,
          },
        ],
        updateTrigger: 'after_call',
      }}
    />
  ),
};

// ============================================
// PropertySelector Stories (v1 Standalone)
// ============================================

const propertySelectorMeta: Meta<typeof PropertySelector> = {
  title: 'Prototypes/HubSpotConfig/v1-Standalone/PropertySelector',
  component: PropertySelector,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="max-w-md p-6 bg-background text-foreground">
        <Story />
      </div>
    ),
  ],
};

export const PropertySelectorEmpty: StoryObj<typeof PropertySelector> = {
  render: () => {
    const [selected, setSelected] = useState<string[]>([]);
    const [objectType, setObjectType] = useState<'deal' | 'contact' | 'company' | 'meeting'>('deal');
    return (
      <PropertySelector
        availableProperties={MOCK_HUBSPOT_PROPERTIES[objectType]}
        selectedProperties={selected}
        onSelectionChange={setSelected}
        objectType={objectType}
        onObjectTypeChange={setObjectType}
      />
    );
  },
};

export const PropertySelectorWithSelection: StoryObj<typeof PropertySelector> = {
  render: () => {
    const [selected, setSelected] = useState<string[]>([
      'probability_to_close',
      'next_step',
      'next_step_date',
    ]);
    const [objectType, setObjectType] = useState<'deal' | 'contact' | 'company' | 'meeting'>('deal');
    return (
      <PropertySelector
        availableProperties={MOCK_HUBSPOT_PROPERTIES[objectType]}
        selectedProperties={selected}
        onSelectionChange={setSelected}
        objectType={objectType}
        onObjectTypeChange={setObjectType}
      />
    );
  },
};

// ============================================
// FieldConfigCard Stories (v1 Standalone)
// ============================================

const fieldConfigCardMeta: Meta<typeof FieldConfigCard> = {
  title: 'Prototypes/HubSpotConfig/v1-Standalone/FieldConfigCard',
  component: FieldConfigCard,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="max-w-xl p-6 bg-background text-foreground">
        <Story />
      </div>
    ),
  ],
};

const sampleProperty: HubSpotProperty = {
  name: 'probability_to_close',
  label: 'Probability to Close',
  type: 'number',
  groupName: 'askelephant',
};

export const FieldConfigCardDefault: StoryObj<typeof FieldConfigCard> = {
  render: () => {
    const [config, setConfig] = useState<PropertyConfig>(
      createDefaultPropertyConfig('probability_to_close')
    );
    return (
      <FieldConfigCard
        property={sampleProperty}
        config={config}
        onConfigChange={setConfig}
        onRemove={() => alert('Remove clicked')}
        availableProperties={MOCK_HUBSPOT_PROPERTIES.deal}
      />
    );
  },
};

export const FieldConfigCardConfigured: StoryObj<typeof FieldConfigCard> = {
  render: () => {
    const [config, setConfig] = useState<PropertyConfig>({
      propertyName: 'probability_to_close',
      instruction:
        'Based on the conversation, estimate the probability of closing this deal. Consider: buyer enthusiasm, objections raised, decision timeline, and any competitive mentions.',
      readBeforeWrite: true,
      dependencies: ['sales_skill_score', 'why_will_fail', 'buyer_involvement'],
      writeMode: 'overwrite',
      syncToHubSpot: true,
    });
    return (
      <FieldConfigCard
        property={sampleProperty}
        config={config}
        onConfigChange={setConfig}
        onRemove={() => alert('Remove clicked')}
        availableProperties={MOCK_HUBSPOT_PROPERTIES.deal}
      />
    );
  },
};

export const FieldConfigCardCollapsed: StoryObj<typeof FieldConfigCard> = {
  render: () => {
    const [config, setConfig] = useState<PropertyConfig>({
      propertyName: 'probability_to_close',
      instruction: 'Calculate probability based on conversation signals.',
      readBeforeWrite: true,
      dependencies: ['sales_skill_score', 'why_will_fail'],
      writeMode: 'overwrite',
      syncToHubSpot: true,
    });
    const [isExpanded, setIsExpanded] = useState(false);
    return (
      <FieldConfigCard
        property={sampleProperty}
        config={config}
        onConfigChange={setConfig}
        onRemove={() => alert('Remove clicked')}
        availableProperties={MOCK_HUBSPOT_PROPERTIES.deal}
        isExpanded={isExpanded}
        onExpandedChange={setIsExpanded}
      />
    );
  },
};

export const FieldConfigCardLocalOnly: StoryObj<typeof FieldConfigCard> = {
  render: () => {
    const [config, setConfig] = useState<PropertyConfig>({
      propertyName: 'sales_skill_score',
      instruction: 'Rate the sales rep performance from 0-100.',
      readBeforeWrite: false,
      dependencies: [],
      writeMode: 'overwrite',
      syncToHubSpot: false, // Local only!
    });
    return (
      <FieldConfigCard
        property={{
          name: 'sales_skill_score',
          label: 'Sales Skill Score',
          type: 'number',
          groupName: 'askelephant',
        }}
        config={config}
        onConfigChange={setConfig}
        onRemove={() => alert('Remove clicked')}
        availableProperties={MOCK_HUBSPOT_PROPERTIES.deal}
      />
    );
  },
};

