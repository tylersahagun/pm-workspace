export type HubSpotObjectType =
  | 'deal'
  | 'contact'
  | 'company'
  | 'meeting'
  | 'note'
  | 'task'
  | 'custom';

export type HubSpotPropertyType =
  | 'string'
  | 'number'
  | 'date'
  | 'datetime'
  | 'enumeration'
  | 'bool'
  | 'phone_number';

export interface HubSpotProperty {
  name: string;
  label: string;
  type: HubSpotPropertyType;
  groupName: string;
  description?: string;
  options?: Array<{ label: string; value: string }>;
  readOnly?: boolean;
}

export type WriteMode = 'overwrite' | 'append' | 'append_if_new';
export type HubSpotContextSource = 'latest_call' | 'selected_meeting' | 'pasted_transcript';
export type ApprovalMode = 'auto' | 'review';
export type NoMatchBehavior = 'skip' | 'create';
export type ActionType = 'update' | 'create' | 'update_or_create';
export type MatchResolution = 'auto' | 'review';
export type PreviewState = 'idle' | 'loading' | 'success' | 'error' | 'low_confidence' | 'empty';

export interface PropertyConfig {
  propertyName: string;
  instruction: string;
  readBeforeWrite: boolean;
  dependencies: string[];
  writeMode: WriteMode;
}

export interface RelatedActivityConfig {
  createNote: boolean;
  noteTemplate: string;
  createTask: boolean;
  taskTemplate: string;
  taskDue: 'same_day' | 'next_day' | 'in_week' | 'custom';
}

export interface HubSpotAgentNodeConfigV3 {
  objectType: HubSpotObjectType;
  customObjectLabel?: string;
  actionType: ActionType;
  properties: PropertyConfig[];
  contextSource: HubSpotContextSource;
  contextTranscript?: string;
  approvalMode: ApprovalMode;
  runCondition?: string;
  matchSignals: string[];
  matchResolution: MatchResolution;
  noMatchBehavior: NoMatchBehavior;
  createRequiredFields: string[];
  relatedActivities: RelatedActivityConfig;
}

export interface HubSpotAgentConfigV3Props {
  config: HubSpotAgentNodeConfigV3;
  onConfigChange: (config: HubSpotAgentNodeConfigV3) => void;
  propertiesByObjectType: Record<HubSpotObjectType, HubSpotProperty[]>;
  isLoading?: boolean;
  previewState?: PreviewState;
}

export const MOCK_HUBSPOT_PROPERTIES: Record<HubSpotObjectType, HubSpotProperty[]> = {
  deal: [
    { name: 'dealname', label: 'Deal Name', type: 'string', groupName: 'dealinformation' },
    { name: 'amount', label: 'Amount', type: 'number', groupName: 'dealinformation' },
    { name: 'closedate', label: 'Close Date', type: 'date', groupName: 'dealinformation' },
    {
      name: 'dealstage',
      label: 'Deal Stage',
      type: 'enumeration',
      groupName: 'dealinformation',
      options: [
        { label: 'Qualification', value: 'qualification' },
        { label: 'Meeting Scheduled', value: 'meeting_scheduled' },
        { label: 'Proposal', value: 'proposal' },
        { label: 'Closed Won', value: 'closed_won' },
        { label: 'Closed Lost', value: 'closed_lost' },
      ],
    },
    { name: 'probability_to_close', label: 'Probability to Close', type: 'number', groupName: 'askelephant' },
    {
      name: 'close_date_probability_context',
      label: 'Close Date Probability Context',
      type: 'string',
      groupName: 'askelephant',
    },
    { name: 'next_step', label: 'Next Step', type: 'string', groupName: 'askelephant' },
    { name: 'next_step_date', label: 'Next Step Date', type: 'date', groupName: 'askelephant' },
    { name: 'sales_skill_score', label: 'Sales Skill Score', type: 'number', groupName: 'askelephant' },
    { name: 'why_will_buy', label: 'Why Will They Buy', type: 'string', groupName: 'askelephant' },
    { name: 'why_will_fail', label: 'Why Will This Fail', type: 'string', groupName: 'askelephant' },
    { name: 'buyer_involvement', label: 'Buyer Involvement', type: 'string', groupName: 'askelephant' },
    { name: 'deal_risk_assessment', label: 'Deal Risk Assessment', type: 'string', groupName: 'askelephant' },
  ],
  contact: [
    { name: 'firstname', label: 'First Name', type: 'string', groupName: 'contactinformation' },
    { name: 'lastname', label: 'Last Name', type: 'string', groupName: 'contactinformation' },
    { name: 'email', label: 'Email', type: 'string', groupName: 'contactinformation' },
    { name: 'phone', label: 'Phone', type: 'phone_number', groupName: 'contactinformation' },
    { name: 'jobtitle', label: 'Job Title', type: 'string', groupName: 'contactinformation' },
  ],
  company: [
    { name: 'name', label: 'Company Name', type: 'string', groupName: 'companyinformation' },
    { name: 'domain', label: 'Website Domain', type: 'string', groupName: 'companyinformation' },
    { name: 'industry', label: 'Industry', type: 'string', groupName: 'companyinformation' },
    { name: 'numberofemployees', label: 'Number of Employees', type: 'number', groupName: 'companyinformation' },
  ],
  meeting: [
    { name: 'hs_meeting_title', label: 'Meeting Title', type: 'string', groupName: 'meetinginfo' },
    { name: 'hs_meeting_body', label: 'Meeting Notes', type: 'string', groupName: 'meetinginfo' },
  ],
  note: [
    { name: 'hs_note_body', label: 'Note Body', type: 'string', groupName: 'noteinfo' },
    { name: 'hs_note_timestamp', label: 'Note Timestamp', type: 'datetime', groupName: 'noteinfo' },
  ],
  task: [
    { name: 'hs_task_subject', label: 'Task Subject', type: 'string', groupName: 'taskinfo' },
    {
      name: 'hs_task_status',
      label: 'Task Status',
      type: 'enumeration',
      groupName: 'taskinfo',
      options: [
        { label: 'Not Started', value: 'NOT_STARTED' },
        { label: 'In Progress', value: 'IN_PROGRESS' },
        { label: 'Completed', value: 'COMPLETED' },
      ],
    },
  ],
  custom: [
    { name: 'custom_object_name', label: 'Custom Object Name', type: 'string', groupName: 'custom' },
    {
      name: 'custom_object_stage',
      label: 'Custom Object Stage',
      type: 'enumeration',
      groupName: 'custom',
      options: [
        { label: 'Open', value: 'open' },
        { label: 'In Review', value: 'in_review' },
        { label: 'Closed', value: 'closed' },
      ],
    },
  ],
};

export const createDefaultPropertyConfig = (propertyName: string): PropertyConfig => ({
  propertyName,
  instruction: '',
  readBeforeWrite: false,
  dependencies: [],
  writeMode: 'overwrite',
});

export const createDefaultRelatedActivities = (): RelatedActivityConfig => ({
  createNote: false,
  noteTemplate: '',
  createTask: false,
  taskTemplate: '',
  taskDue: 'next_day',
});
