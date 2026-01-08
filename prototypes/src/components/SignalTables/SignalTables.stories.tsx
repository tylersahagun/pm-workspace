import type { Meta, StoryObj } from '@storybook/react';
import { SignalTables } from './SignalTables';
import { FilterPanel } from './FilterPanel';
import { BuilderPanel } from './BuilderPanel';
import { TableView } from './TableView';
import { ChatInput } from './ChatInput';
import {
  SAMPLE_ENGAGEMENTS,
  SAMPLE_COLUMN_RESULTS,
  type TableColumn,
  type TableFilters,
} from './types';

const meta: Meta<typeof SignalTables> = {
  title: 'Universal Signal Tables/SignalTables',
  component: SignalTables,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Main full experience
export const Default: Story = {
  args: {
    tableName: 'Competitor Analysis - January',
  },
};

export const WithLastRun: Story = {
  args: {
    tableName: 'Q4 Objection Tracking',
    lastRunAt: new Date('2026-01-05T14:30:00'),
  },
};

// Individual component stories
export const FilterPanelStory: StoryObj<typeof FilterPanel> = {
  render: () => {
    const [filters, setFilters] = React.useState<TableFilters>({
      dateRange: {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        end: new Date(),
      },
      repIds: [],
      meetingTypes: [],
      keywords: [],
    });

    return (
      <div className="h-screen bg-background">
        <FilterPanel
          filters={filters}
          onFiltersChange={setFilters}
          matchingCount={142}
        />
      </div>
    );
  },
  parameters: {
    layout: 'fullscreen',
  },
};

const sampleColumns: TableColumn[] = [
  {
    id: 'col-1',
    name: 'Competitor Mentioned',
    prompt: 'Was any competitor mentioned in this call? Answer Yes or No.',
    outputType: 'boolean',
    order: 0,
  },
  {
    id: 'col-2',
    name: 'Which Competitor',
    prompt: 'If a competitor was mentioned, which one? List the competitor names.',
    outputType: 'text',
    order: 1,
    condition: {
      dependsOnColumnId: 'col-1',
      operator: 'equals',
      value: 'Yes',
    },
  },
];

import React from 'react';

export const BuilderPanelStory: StoryObj<typeof BuilderPanel> = {
  render: () => {
    const [columns, setColumns] = React.useState<TableColumn[]>(sampleColumns);

    return (
      <div className="h-screen bg-background flex">
        <div className="flex-1 bg-muted/20" />
        <BuilderPanel columns={columns} onColumnsChange={setColumns} />
      </div>
    );
  },
  parameters: {
    layout: 'fullscreen',
  },
};

export const BuilderPanelEmpty: StoryObj<typeof BuilderPanel> = {
  render: () => {
    const [columns, setColumns] = React.useState<TableColumn[]>([]);

    return (
      <div className="h-screen bg-background flex">
        <div className="flex-1 bg-muted/20" />
        <BuilderPanel columns={columns} onColumnsChange={setColumns} />
      </div>
    );
  },
  parameters: {
    layout: 'fullscreen',
  },
};

export const TableViewWithData: StoryObj<typeof TableView> = {
  render: () => (
    <div className="h-screen bg-background flex flex-col">
      <TableView
        engagements={SAMPLE_ENGAGEMENTS}
        columns={sampleColumns}
        columnResults={SAMPLE_COLUMN_RESULTS}
      />
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};

export const TableViewRunning: StoryObj<typeof TableView> = {
  render: () => (
    <div className="h-screen bg-background flex flex-col">
      <TableView
        engagements={SAMPLE_ENGAGEMENTS}
        columns={sampleColumns}
        columnResults={{}}
        isRunning={true}
        progress={{ current: 3, total: 8 }}
      />
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};

export const TableViewEmpty: StoryObj<typeof TableView> = {
  render: () => (
    <div className="h-screen bg-background flex flex-col">
      <TableView engagements={[]} columns={[]} columnResults={{}} />
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};

export const ChatInputStory: StoryObj<typeof ChatInput> = {
  render: () => {
    const [messages, setMessages] = React.useState<
      Array<{
        id: string;
        role: 'user' | 'assistant';
        content: string;
        timestamp: Date;
        columnSuggestion?: {
          name: string;
          prompt: string;
          outputType: 'text' | 'boolean' | 'select' | 'number';
        };
      }>
    >([
      {
        id: '1',
        role: 'user',
        content: 'I want to know if competitors were mentioned',
        timestamp: new Date(),
      },
      {
        id: '2',
        role: 'assistant',
        content: "I'll create a column to detect competitor mentions. Here's what I suggest:",
        timestamp: new Date(),
        columnSuggestion: {
          name: 'Competitor Mentioned',
          prompt: 'Was any competitor mentioned in this conversation? Answer Yes or No.',
          outputType: 'boolean',
        },
      },
    ]);

    return (
      <div className="h-screen bg-background flex flex-col justify-end">
        <ChatInput
          onSendMessage={(msg) => console.log('Send:', msg)}
          onAddColumn={(col) => console.log('Add column:', col)}
          messages={messages}
        />
      </div>
    );
  },
  parameters: {
    layout: 'fullscreen',
  },
};

// Full workflow demo
export const FullWorkflow: Story = {
  args: {
    tableName: 'Demo: Competitor Analysis',
  },
  parameters: {
    docs: {
      description: {
        story: `
## Full Workflow Demo

This story demonstrates the complete Universal Signal Tables experience:

1. **Filter Panel (Left)** - Select date range, reps, and meeting types
2. **Table View (Center)** - View engagements with AI-extracted columns
3. **Builder Panel (Right)** - Configure AI columns with prompts
4. **Chat Input (Bottom)** - Describe what you want to extract in natural language

### Key Interactions:
- Use the chat to describe what you want to extract
- Add columns from templates or create custom ones
- Set conditional execution to save costs
- Run extraction on filtered dataset
- Save and export results
        `,
      },
    },
  },
};

