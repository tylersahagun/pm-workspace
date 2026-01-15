import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { WorkflowNodeSheetMock, WorkflowNodeData } from './WorkflowNodeSheetMock';
import { HubSpotAgentNodeConfig } from './HubSpotAgentNodeConfig';
import type { HubSpotAgentNodeConfig as HubSpotAgentNodeConfigType } from '../types';
import { MOCK_HUBSPOT_PROPERTIES } from '../types';

/**
 * V2 WORKFLOW INTEGRATED STORIES
 *
 * These stories show how the HubSpot Agent configuration would appear
 * when integrated into the actual workflow builder UI. They demonstrate:
 *
 * 1. The exact WorkflowNodeSheet wrapper styling
 * 2. The Configuration/Outputs tab pattern
 * 3. The LabeledRenderer form field pattern
 * 4. How it would feel as a real workflow node
 */

const meta: Meta = {
  title: 'Prototypes/HubSpotConfig/v2-Workflow',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'V2 Workflow-Integrated: Shows how the HubSpot Agent config would appear inside the actual workflow builder WorkflowNodeSheet panel.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-slate-100 p-6 flex justify-end">
        <Story />
      </div>
    ),
  ],
};

export default meta;

// ============================================
// Full Workflow Node Integration
// ============================================

interface WorkflowIntegrationProps {
  initialConfig: HubSpotAgentNodeConfigType;
  nodeTitle?: string;
  isNew?: boolean;
  hasChanges?: boolean;
}

const WorkflowIntegration: React.FC<WorkflowIntegrationProps> = ({
  initialConfig,
  nodeTitle = 'HubSpot Agent',
  isNew = false,
  hasChanges = false,
}) => {
  const [config, setConfig] = useState<HubSpotAgentNodeConfigType>(initialConfig);
  const [isSaving, setIsSaving] = useState(false);
  const [open, setOpen] = useState(true);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    console.log('Saved config:', config);
  };

  const nodeData: WorkflowNodeData = {
    title: nodeTitle,
    operationId: 'hubspot.agent.v2',
    operationName: 'HubSpot Agent',
    config: config as unknown as Record<string, unknown>,
    isNew,
    hasChanges,
  };

  const outputProperties = config.properties.map((p) => ({
    key: p.propertyName,
    description: `Updated ${p.propertyName} value from conversation analysis`,
  }));

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-white rounded shadow"
      >
        Re-open Node Config
      </button>
    );
  }

  return (
    <WorkflowNodeSheetMock
      data={nodeData}
      open={open}
      onClose={() => setOpen(false)}
      onSave={handleSave}
      isSaving={isSaving}
      primaryColor="#ff7a59"
      backgroundColor="#fff5f0"
      outputProperties={outputProperties}
    >
      <HubSpotAgentNodeConfig
        config={config}
        onConfigChange={setConfig}
        propertiesByObjectType={MOCK_HUBSPOT_PROPERTIES}
      />
    </WorkflowNodeSheetMock>
  );
};

export const EmptyConfiguration: StoryObj = {
  render: () => (
    <WorkflowIntegration
      initialConfig={{
        objectType: 'deal',
        properties: [],
        contextSource: 'latest_call',
        approvalMode: 'auto',
        matchSignals: ['company_domain', 'contact_email'],
        noMatchBehavior: 'create',
        createRequiredFields: ['dealname', 'pipeline'],
      }}
      nodeTitle="New HubSpot Agent"
      isNew={true}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'A newly added HubSpot Agent node with no properties configured yet.',
      },
    },
  },
};

export const ConfiguredDealScorecard: StoryObj = {
  render: () => (
    <WorkflowIntegration
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
          },
          {
            propertyName: 'probability_to_close',
            instruction:
              'Calculate deal probability (0-100%). Weight: 30% sales skill, 30% buyer involvement, 20% reasons to buy, 20% risk mitigation.',
            readBeforeWrite: true,
            dependencies: ['sales_skill_score', 'why_will_buy', 'why_will_fail'],
            writeMode: 'overwrite',
          },
          {
            propertyName: 'next_step',
            instruction: 'Extract the specific next step agreed upon in the conversation.',
            readBeforeWrite: false,
            dependencies: [],
            writeMode: 'overwrite',
          },
        ],
        contextSource: 'latest_call',
        approvalMode: 'review',
        matchSignals: ['company_domain', 'deal_name'],
        noMatchBehavior: 'create',
        createRequiredFields: ['dealname', 'amount'],
      }}
      nodeTitle="Deal Scorecard Agent"
      hasChanges={true}
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          'A configured Deal Scorecard agent showing the typical use case with multiple properties, dependencies, and a local-only scoring field.',
      },
    },
  },
};

export const ContactUpdater: StoryObj = {
  render: () => (
    <WorkflowIntegration
      initialConfig={{
        objectType: 'contact',
        properties: [
          {
            propertyName: 'jobtitle',
            instruction: 'Update job title if a new one is mentioned in the conversation.',
            readBeforeWrite: true,
            dependencies: [],
            writeMode: 'overwrite',
          },
          {
            propertyName: 'lifecyclestage',
            instruction:
              'Update lifecycle stage based on engagement level. If they mention evaluation, move to Opportunity. If they request pricing, move to Sales Qualified Lead.',
            readBeforeWrite: true,
            dependencies: ['jobtitle'],
            writeMode: 'append_if_new',
          },
        ],
        contextSource: 'selected_meeting',
        approvalMode: 'auto',
        matchSignals: ['contact_email'],
        noMatchBehavior: 'skip',
        createRequiredFields: [],
      }}
      nodeTitle="Contact Enrichment"
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'A Contact object configuration showing how the UI adapts to different object types.',
      },
    },
  },
};

export const WithConditionalTrigger: StoryObj = {
  render: () => (
    <WorkflowIntegration
      initialConfig={{
        objectType: 'deal',
        properties: [
          {
            propertyName: 'dealstage',
            instruction: 'Suggest the appropriate deal stage based on conversation signals.',
            readBeforeWrite: true,
            dependencies: [],
            writeMode: 'overwrite',
          },
        ],
        contextSource: 'latest_call',
        approvalMode: 'review',
        matchSignals: ['deal_name'],
        noMatchBehavior: 'skip',
        createRequiredFields: [],
        runCondition: "Only run if 'Deal Stage' is NOT 'Closed Won' or 'Closed Lost'",
      }}
      nodeTitle="Stage Progression Agent"
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Shows a configuration with a conditional trigger for when the agent should run.',
      },
    },
  },
};

// ============================================
// Side-by-Side Comparison View
// ============================================

export const SideBySideWithCanvas: StoryObj = {
  render: () => {
    const [config, setConfig] = useState<HubSpotAgentNodeConfigType>({
      objectType: 'deal',
      properties: [
        {
          propertyName: 'probability_to_close',
          instruction: 'Estimate probability based on conversation signals.',
          readBeforeWrite: true,
          dependencies: ['sales_skill_score'],
          writeMode: 'overwrite',
        },
      ],
      contextSource: 'latest_call',
      approvalMode: 'auto',
      matchSignals: ['company_domain', 'deal_name'],
      noMatchBehavior: 'skip',
      createRequiredFields: [],
    });

    const nodeData: WorkflowNodeData = {
      title: 'HubSpot Agent',
      operationId: 'hubspot.agent.v2',
      operationName: 'HubSpot Agent',
      config: config as unknown as Record<string, unknown>,
    };

    return (
      <div className="flex h-screen w-full">
        {/* Mock Workflow Canvas */}
        <div className="flex-1 bg-slate-200 p-8 relative">
          <div className="absolute inset-0 opacity-10">
            {/* Grid pattern */}
            <svg width="100%" height="100%">
              <defs>
                <pattern
                  id="grid"
                  width="20"
                  height="20"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 20 0 L 0 0 0 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.5"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Mock Workflow Nodes */}
          <div className="relative z-10 flex flex-col items-center gap-8 pt-20">
            {/* Trigger Node */}
            <div className="bg-white rounded-lg border-2 border-green-400 shadow-lg p-4 w-64">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📞</span>
                <div>
                  <div className="font-medium">Call Completed</div>
                  <div className="text-xs text-muted-foreground">Trigger</div>
                </div>
              </div>
            </div>

            {/* Connection Line */}
            <div className="w-0.5 h-8 bg-slate-400"></div>

            {/* HubSpot Agent Node (Selected) */}
            <div className="bg-white rounded-lg border-2 border-orange-400 shadow-lg shadow-orange-100 p-4 w-64 ring-2 ring-orange-400 ring-offset-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🔶</span>
                <div>
                  <div className="font-medium">HubSpot Agent</div>
                  <div className="text-xs text-muted-foreground">
                    Update {config.properties.length} properties
                  </div>
                </div>
              </div>
            </div>

            {/* Connection Line */}
            <div className="w-0.5 h-8 bg-slate-400"></div>

            {/* Notification Node */}
            <div className="bg-white rounded-lg border-2 border-purple-400 shadow-lg p-4 w-64">
              <div className="flex items-center gap-2">
                <span className="text-2xl">💬</span>
                <div>
                  <div className="font-medium">Slack Notification</div>
                  <div className="text-xs text-muted-foreground">Action</div>
                </div>
              </div>
            </div>
          </div>

          {/* Canvas Controls */}
          <div className="absolute bottom-4 left-4 flex gap-2">
            <button className="bg-white px-3 py-1 rounded shadow text-sm">Zoom: 100%</button>
            <button className="bg-white px-3 py-1 rounded shadow text-sm">Auto-layout</button>
          </div>
        </div>

        {/* Workflow Node Sheet */}
        <div className="flex-shrink-0">
          <WorkflowNodeSheetMock
            data={nodeData}
            open={true}
            onClose={() => {}}
            onSave={() => Promise.resolve()}
            primaryColor="#ff7a59"
            backgroundColor="#fff5f0"
            outputProperties={config.properties.map((p) => ({
              key: p.propertyName,
              description: `Updated value for ${p.propertyName}`,
            }))}
          >
            <HubSpotAgentNodeConfig
              config={config}
              onConfigChange={setConfig}
              propertiesByObjectType={MOCK_HUBSPOT_PROPERTIES}
            />
          </WorkflowNodeSheetMock>
        </div>
      </div>
    );
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story:
          'Full workflow builder mockup showing the HubSpot Agent node selected on the canvas with its configuration panel open. This demonstrates the complete integrated experience.',
      },
    },
  },
};

