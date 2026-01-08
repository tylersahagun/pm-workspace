// Universal Signal Tables Types

export type ColumnOutputType = 'text' | 'boolean' | 'select' | 'number';

export type ConditionOperator = 'equals' | 'not_equals' | 'contains';

export interface ColumnCondition {
  dependsOnColumnId: string;
  operator: ConditionOperator;
  value: string;
}

export interface TableColumn {
  id: string;
  name: string;
  prompt: string;
  outputType: ColumnOutputType;
  order: number;
  condition?: ColumnCondition;
}

export interface TableFilters {
  dateRange: {
    start: Date;
    end: Date;
  };
  repIds: string[];
  meetingTypes: string[];
  keywords: string[];
}

export type TableStatus = 'draft' | 'running' | 'complete' | 'error';

export interface SignalTable {
  id: string;
  name: string;
  filters: TableFilters;
  columns: TableColumn[];
  createdAt: Date;
  updatedAt: Date;
  lastRunAt: Date | null;
  status: TableStatus;
}

export interface Engagement {
  id: string;
  title: string;
  date: Date;
  rep: string;
  type: 'call' | 'meeting' | 'demo';
  duration: number; // minutes
  company: string;
}

export interface ColumnResult {
  value: string | boolean | number | null;
  status: 'pending' | 'complete' | 'error' | 'skipped';
  errorMessage?: string;
}

export interface TableRowData extends Engagement {
  columnResults: Record<string, ColumnResult>;
}

export interface ColumnTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  columns: Omit<TableColumn, 'id' | 'order'>[];
}

export const COLUMN_TEMPLATES: ColumnTemplate[] = [
  {
    id: 'competitors',
    name: 'Competitors Mentioned',
    description: 'Track competitor mentions and details',
    icon: '🎯',
    columns: [
      {
        name: 'Competitor Mentioned',
        prompt: 'Was any competitor mentioned in this call? Answer Yes or No.',
        outputType: 'boolean',
      },
      {
        name: 'Which Competitor',
        prompt: 'If a competitor was mentioned, which one? List the competitor names.',
        outputType: 'text',
        condition: {
          dependsOnColumnId: '', // Will be filled when applied
          operator: 'equals',
          value: 'Yes',
        },
      },
    ],
  },
  {
    id: 'objections',
    name: 'Objections Raised',
    description: 'Identify and categorize objections',
    icon: '🚧',
    columns: [
      {
        name: 'Objection Raised',
        prompt: 'Was any objection or concern raised by the prospect? Yes or No.',
        outputType: 'boolean',
      },
      {
        name: 'Objection Type',
        prompt: 'What type of objection was raised? (Pricing, Timing, Competition, Technical, Other)',
        outputType: 'select',
        condition: {
          dependsOnColumnId: '',
          operator: 'equals',
          value: 'Yes',
        },
      },
    ],
  },
  {
    id: 'next-steps',
    name: 'Next Steps Discussed',
    description: 'Track follow-up commitments',
    icon: '📅',
    columns: [
      {
        name: 'Next Steps Mentioned',
        prompt: 'Were any next steps or follow-ups discussed? Yes or No.',
        outputType: 'boolean',
      },
      {
        name: 'Next Step Details',
        prompt: 'What next steps were discussed? Summarize briefly.',
        outputType: 'text',
        condition: {
          dependsOnColumnId: '',
          operator: 'equals',
          value: 'Yes',
        },
      },
      {
        name: 'Follow-up Date',
        prompt: 'Was a specific follow-up date mentioned? If so, what date?',
        outputType: 'text',
        condition: {
          dependsOnColumnId: '',
          operator: 'equals',
          value: 'Yes',
        },
      },
    ],
  },
  {
    id: 'budget',
    name: 'Budget Discussed',
    description: 'Track budget and pricing conversations',
    icon: '💰',
    columns: [
      {
        name: 'Budget Discussed',
        prompt: 'Was budget, pricing, or cost discussed? Yes or No.',
        outputType: 'boolean',
      },
      {
        name: 'Budget Range',
        prompt: 'If budget was discussed, what range or amount was mentioned?',
        outputType: 'text',
        condition: {
          dependsOnColumnId: '',
          operator: 'equals',
          value: 'Yes',
        },
      },
    ],
  },
  {
    id: 'decision-maker',
    name: 'Decision Maker Present',
    description: 'Identify key stakeholders',
    icon: '👤',
    columns: [
      {
        name: 'Decision Maker Present',
        prompt: 'Was a decision maker or budget holder present on the call? Yes, No, or Unclear.',
        outputType: 'select',
      },
    ],
  },
];

// Sample data for prototype
export const SAMPLE_REPS = [
  { id: 'rep-1', name: 'Pete Mitchell' },
  { id: 'rep-2', name: 'Sara Chen' },
  { id: 'rep-3', name: 'Alex Rivera' },
  { id: 'rep-4', name: 'Jordan Lee' },
];

export const SAMPLE_ENGAGEMENTS: Engagement[] = [
  {
    id: 'eng-1',
    title: 'Acme Corp Q4 Review',
    date: new Date('2026-01-06T10:30:00'),
    rep: 'Pete Mitchell',
    type: 'call',
    duration: 32,
    company: 'Acme Corp',
  },
  {
    id: 'eng-2',
    title: 'Beta Inc Renewal Discussion',
    date: new Date('2026-01-05T14:00:00'),
    rep: 'Sara Chen',
    type: 'meeting',
    duration: 45,
    company: 'Beta Inc',
  },
  {
    id: 'eng-3',
    title: 'Gamma Labs Product Demo',
    date: new Date('2026-01-05T11:00:00'),
    rep: 'Alex Rivera',
    type: 'demo',
    duration: 58,
    company: 'Gamma Labs',
  },
  {
    id: 'eng-4',
    title: 'Delta Systems Discovery',
    date: new Date('2026-01-04T16:30:00'),
    rep: 'Pete Mitchell',
    type: 'call',
    duration: 28,
    company: 'Delta Systems',
  },
  {
    id: 'eng-5',
    title: 'Epsilon AI Follow-up',
    date: new Date('2026-01-04T09:00:00'),
    rep: 'Jordan Lee',
    type: 'call',
    duration: 22,
    company: 'Epsilon AI',
  },
  {
    id: 'eng-6',
    title: 'Zeta Cloud Contract Review',
    date: new Date('2026-01-03T15:00:00'),
    rep: 'Sara Chen',
    type: 'meeting',
    duration: 40,
    company: 'Zeta Cloud',
  },
  {
    id: 'eng-7',
    title: 'Eta Software Intro Call',
    date: new Date('2026-01-03T10:00:00'),
    rep: 'Alex Rivera',
    type: 'call',
    duration: 35,
    company: 'Eta Software',
  },
  {
    id: 'eng-8',
    title: 'Theta Analytics Demo',
    date: new Date('2026-01-02T14:30:00'),
    rep: 'Jordan Lee',
    type: 'demo',
    duration: 52,
    company: 'Theta Analytics',
  },
];

// Sample results for completed columns
export const SAMPLE_COLUMN_RESULTS: Record<string, Record<string, ColumnResult>> = {
  'eng-1': {
    'col-1': { value: 'Yes', status: 'complete' },
    'col-2': { value: 'Gong, Chorus', status: 'complete' },
  },
  'eng-2': {
    'col-1': { value: 'No', status: 'complete' },
    'col-2': { value: null, status: 'skipped' },
  },
  'eng-3': {
    'col-1': { value: 'Yes', status: 'complete' },
    'col-2': { value: 'Salesforce', status: 'complete' },
  },
  'eng-4': {
    'col-1': { value: 'Yes', status: 'complete' },
    'col-2': { value: 'Gong', status: 'complete' },
  },
  'eng-5': {
    'col-1': { value: 'No', status: 'complete' },
    'col-2': { value: null, status: 'skipped' },
  },
  'eng-6': {
    'col-1': { value: 'No', status: 'complete' },
    'col-2': { value: null, status: 'skipped' },
  },
  'eng-7': {
    'col-1': { value: null, status: 'error', errorMessage: 'Transcript not available' },
    'col-2': { value: null, status: 'skipped' },
  },
  'eng-8': {
    'col-1': { value: 'Yes', status: 'complete' },
    'col-2': { value: 'HubSpot', status: 'complete' },
  },
};

