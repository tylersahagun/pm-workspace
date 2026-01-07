// HubSpot Property Types - mirrors what we'd get from the HubSpot API

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
  /** Internal property name (e.g., "closedate") */
  name: string;
  /** Display label (e.g., "Close Date") */
  label: string;
  /** Property data type */
  type: HubSpotPropertyType;
  /** Group this property belongs to */
  groupName: string;
  /** Description of the property */
  description?: string;
  /** For enumeration types, the available options */
  options?: Array<{ label: string; value: string }>;
  /** Whether this is a read-only property */
  readOnly?: boolean;
}

// Configuration Types - what users configure in the UI

export type WriteMode = 'overwrite' | 'append' | 'append_if_new';

export type HubSpotContextSource = 'latest_call' | 'selected_meeting' | 'pasted_transcript';

export type ApprovalMode = 'auto' | 'review';

export type NoMatchBehavior = 'skip' | 'create';

export interface PropertyConfig {
  /** The HubSpot property being configured */
  propertyName: string;
  /** Natural language instruction for what value to extract */
  instruction: string;
  /** Whether to read the existing value before updating */
  readBeforeWrite: boolean;
  /** Other properties to read before updating this one */
  dependencies: string[];
  /** How to handle existing values */
  writeMode: WriteMode;
}

export interface HubSpotAgentNodeConfig {
  /** The HubSpot object type being updated */
  objectType: HubSpotObjectType;
  /** Label for custom object types (if objectType === 'custom') */
  customObjectLabel?: string;
  /** Configuration for each property to update */
  properties: PropertyConfig[];
  /** What data should the agent use as context */
  contextSource: HubSpotContextSource;
  /** Optional transcript if contextSource is pasted_transcript */
  contextTranscript?: string;
  /** Human-in-the-loop mode for this object */
  approvalMode: ApprovalMode;
  /** Optional condition before running */
  runCondition?: string;
  /** Which signals should be used to match existing objects */
  matchSignals: string[];
  /** What to do when no matching object is found */
  noMatchBehavior: NoMatchBehavior;
  /** Required fields when creating a new object */
  createRequiredFields: string[];
}

// Component Props Types

export interface PropertySelectorProps {
  /** Available properties from HubSpot */
  availableProperties: HubSpotProperty[];
  /** Currently selected property names */
  selectedProperties: string[];
  /** Callback when selection changes */
  onSelectionChange: (propertyNames: string[]) => void;
  /** Object type being configured */
  objectType: HubSpotObjectType;
  /** Callback when object type changes */
  onObjectTypeChange: (objectType: HubSpotObjectType) => void;
  /** Loading state while fetching properties */
  isLoading?: boolean;
}

export interface FieldConfigCardProps {
  /** The property being configured */
  property: HubSpotProperty;
  /** Current configuration for this property */
  config: PropertyConfig;
  /** Callback when configuration changes */
  onConfigChange: (config: PropertyConfig) => void;
  /** Callback to remove this property from configuration */
  onRemove: () => void;
  /** All available properties (for dependency selection) */
  availableProperties: HubSpotProperty[];
  /** Whether the card is expanded */
  isExpanded?: boolean;
  /** Callback when expanded state changes */
  onExpandedChange?: (expanded: boolean) => void;
}

export interface HubSpotAgentConfigProps {
  /** Current configuration */
  config: HubSpotAgentNodeConfig;
  /** Callback when configuration changes */
  onConfigChange: (config: HubSpotAgentNodeConfig) => void;
  /** Available properties from HubSpot (grouped by object type) */
  propertiesByObjectType: Record<HubSpotObjectType, HubSpotProperty[]>;
  /** Loading state */
  isLoading?: boolean;
}

// Mock Data for Storybook

export const MOCK_HUBSPOT_PROPERTIES: Record<HubSpotObjectType, HubSpotProperty[]> = {
  deal: [
    { name: 'dealname', label: 'Deal Name', type: 'string', groupName: 'dealinformation' },
    { name: 'amount', label: 'Amount', type: 'number', groupName: 'dealinformation' },
    { name: 'closedate', label: 'Close Date', type: 'date', groupName: 'dealinformation' },
    { name: 'dealstage', label: 'Deal Stage', type: 'enumeration', groupName: 'dealinformation', options: [
      { label: 'Qualification', value: 'qualification' },
      { label: 'Meeting Scheduled', value: 'meeting_scheduled' },
      { label: 'Proposal', value: 'proposal' },
      { label: 'Closed Won', value: 'closed_won' },
      { label: 'Closed Lost', value: 'closed_lost' },
    ]},
    { name: 'probability_to_close', label: 'Probability to Close', type: 'number', groupName: 'askelephant' },
    { name: 'close_date_probability_context', label: 'Close Date Probability Context', type: 'string', groupName: 'askelephant' },
    { name: 'next_step', label: 'Next Step', type: 'string', groupName: 'askelephant' },
    { name: 'next_step_date', label: 'Next Step Date', type: 'date', groupName: 'askelephant' },
    { name: 'sales_skill_score', label: 'Sales Skill Score', type: 'number', groupName: 'askelephant' },
    { name: 'why_will_buy', label: 'Why Will They Buy', type: 'string', groupName: 'askelephant' },
    { name: 'why_will_fail', label: 'Why Will This Fail', type: 'string', groupName: 'askelephant' },
    { name: 'buyer_involvement', label: 'Buyer Involvement', type: 'string', groupName: 'askelephant' },
    { name: 'deal_risk_assessment', label: 'Deal Risk Assessment', type: 'string', groupName: 'askelephant' },
    { name: 'marketing_attribution', label: 'Marketing Attribution', type: 'enumeration', groupName: 'marketinginfo', options: [
      { label: 'Organic', value: 'organic' },
      { label: 'Paid', value: 'paid' },
      { label: 'Referral', value: 'referral' },
      { label: 'Direct', value: 'direct' },
    ]},
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
    { name: 'hs_meeting_outcome', label: 'Meeting Outcome', type: 'enumeration', groupName: 'meetinginfo', options: [
      { label: 'Scheduled', value: 'SCHEDULED' },
      { label: 'Completed', value: 'COMPLETED' },
      { label: 'No Show', value: 'NO_SHOW' },
      { label: 'Cancelled', value: 'CANCELLED' },
    ]},
  ],
  note: [
    { name: 'hs_note_body', label: 'Note Body', type: 'string', groupName: 'noteinfo' },
    { name: 'hs_note_timestamp', label: 'Note Timestamp', type: 'datetime', groupName: 'noteinfo' },
  ],
  task: [
    { name: 'hs_task_subject', label: 'Task Subject', type: 'string', groupName: 'taskinfo' },
    { name: 'hs_task_due_date', label: 'Task Due Date', type: 'date', groupName: 'taskinfo' },
    { name: 'hs_task_status', label: 'Task Status', type: 'enumeration', groupName: 'taskinfo', options: [
      { label: 'Not Started', value: 'NOT_STARTED' },
      { label: 'In Progress', value: 'IN_PROGRESS' },
      { label: 'Completed', value: 'COMPLETED' },
    ]},
  ],
  custom: [
    { name: 'custom_object_name', label: 'Custom Object Name', type: 'string', groupName: 'custom' },
    { name: 'custom_object_stage', label: 'Custom Object Stage', type: 'enumeration', groupName: 'custom', options: [
      { label: 'Open', value: 'open' },
      { label: 'In Review', value: 'in_review' },
      { label: 'Closed', value: 'closed' },
    ]},
  ],
};

export const createDefaultPropertyConfig = (propertyName: string): PropertyConfig => ({
  propertyName,
  instruction: '',
  readBeforeWrite: false,
  dependencies: [],
  writeMode: 'overwrite',
});

