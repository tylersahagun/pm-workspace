// Types for Beta Features V4
// Consolidated stages: Labs and Beta only
// Added: Personal vs Workspace permission levels

export type FeatureStage = 'labs' | 'beta';
export type FeatureScope = 'personal' | 'workspace';

export interface BetaFeature {
  key: string;
  name: string;
  description: string;
  stage: FeatureStage;
  scope: FeatureScope;
  enabled: boolean;
  category?: string;
  kbArticle?: string;
  location?: string;
  isNew?: boolean;
  // How the feature works - shown before enabling
  howItWorks?: string;
}

export interface StageConfig {
  label: string;
  shortLabel: string;
  description: string;
  // Whether auto-enrollment is allowed
  allowsAutoEnroll: boolean;
  enrollmentNote: string;
  colorVariant: 'purple' | 'indigo';
  bgColor: string;
  textColor: string;
  borderColor: string;
}

export interface ScopeConfig {
  label: string;
  description: string;
  icon: 'user' | 'building';
}

// Only two stages now: Labs and Beta
export const STAGE_CONFIG: Record<FeatureStage, StageConfig> = {
  labs: {
    label: 'Labs',
    shortLabel: 'LABS',
    description: 'Early exploration. Features are rough and may change significantly or be removed.',
    allowsAutoEnroll: false, // NO auto-enrollment for labs
    enrollmentNote: 'You must manually enable each Labs feature. Auto-enrollment is not available.',
    colorVariant: 'purple',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-200',
  },
  beta: {
    label: 'Beta',
    shortLabel: 'BETA',
    description: 'Feature complete and stable. Gathering feedback before general release.',
    allowsAutoEnroll: true, // Auto-enrollment allowed for beta
    enrollmentNote: 'You can enable auto-enrollment to receive new beta features automatically.',
    colorVariant: 'indigo',
    bgColor: 'bg-indigo-50',
    textColor: 'text-indigo-700',
    borderColor: 'border-indigo-200',
  },
};

export const SCOPE_CONFIG: Record<FeatureScope, ScopeConfig> = {
  personal: {
    label: 'Personal',
    description: 'Affects only your account',
    icon: 'user',
  },
  workspace: {
    label: 'Workspace',
    description: 'Affects your entire organization',
    icon: 'building',
  },
};

// Mock data with scope assignments
export const MOCK_FEATURES: BetaFeature[] = [
  // Labs features
  {
    key: 'process-agent',
    name: 'Process Agent',
    description: 'AI assistant that helps automate your personal sales workflows.',
    howItWorks: 'Analyzes your calls and suggests workflow automations based on patterns it detects.',
    stage: 'labs',
    scope: 'personal',
    enabled: false,
    category: 'automation',
    location: 'Workflows tab',
  },
  {
    key: 'voice-synthesis',
    name: 'Voice Summaries',
    description: 'AI-generated audio summaries of your calls.',
    howItWorks: 'Creates a 2-3 minute audio summary after each call using text-to-speech.',
    stage: 'labs',
    scope: 'personal',
    enabled: false,
    category: 'ai',
    location: 'Call details',
    isNew: true,
  },
  {
    key: 'deal-predictions',
    name: 'Deal Predictions',
    description: 'ML-powered deal outcome predictions based on conversation patterns.',
    howItWorks: 'Analyzes call transcripts to predict deal outcomes. Runs on all your active deals.',
    stage: 'labs',
    scope: 'personal',
    enabled: false,
    category: 'analytics',
    location: 'Pipeline view',
  },
  {
    key: 'privacy-retention',
    name: 'Privacy & Retention Agent',
    description: 'Automatically manages data retention and privacy classifications for your workspace.',
    howItWorks: 'Scans all workspace calls and applies privacy labels. Affects all users in your workspace.',
    stage: 'labs',
    scope: 'workspace',
    enabled: false,
    category: 'privacy',
    location: 'Settings → Privacy',
  },
  // Beta features
  {
    key: 'auto-tagging-v2',
    name: 'Auto-Tagging V2',
    description: 'Automatically tag meetings based on conversation content.',
    howItWorks: 'Analyzes your call transcripts and applies relevant tags from your tag library.',
    stage: 'beta',
    scope: 'personal',
    enabled: true,
    category: 'automation',
    kbArticle: '#',
    location: 'Settings → Tags',
  },
  {
    key: 'global-chat',
    name: 'Global Chat',
    description: 'Access AskElephant from anywhere in the app.',
    howItWorks: 'Opens a chat panel from any page. Your conversation history is saved.',
    stage: 'beta',
    scope: 'personal',
    enabled: false,
    category: 'ai',
    kbArticle: '#',
    location: 'Bottom-right corner',
  },
  {
    key: 'knowledge-bases',
    name: 'Knowledge Bases',
    description: 'Create searchable knowledge bases from your meeting content.',
    howItWorks: 'Indexes selected meetings into a searchable knowledge base for your team.',
    stage: 'beta',
    scope: 'workspace',
    enabled: true,
    category: 'productivity',
    kbArticle: '#',
    location: 'Sidebar',
  },
  {
    key: 'action-items',
    name: 'Action Items',
    description: 'AI-extracted action items from meetings with assignees.',
    howItWorks: 'Detects action items from transcripts and creates tasks with suggested owners.',
    stage: 'beta',
    scope: 'personal',
    enabled: false,
    category: 'productivity',
    kbArticle: '#',
    location: 'Sidebar',
  },
  {
    key: 'signals',
    name: 'Signals',
    description: 'Define custom signals to detect across all workspace calls.',
    howItWorks: 'Monitors all calls in your workspace for configured signal patterns.',
    stage: 'beta',
    scope: 'workspace',
    enabled: false,
    category: 'analytics',
    kbArticle: '#',
    location: 'Settings → Signals',
    isNew: true,
  },
  {
    key: 'customers-page',
    name: 'Customers View',
    description: 'Unified view of all customer accounts with health scores.',
    howItWorks: 'Aggregates meeting data across your workspace to show customer health.',
    stage: 'beta',
    scope: 'workspace',
    enabled: false,
    category: 'crm',
    kbArticle: '#',
    location: 'Sidebar',
    isNew: true,
  },
];

export function getFeaturesByStage(features: BetaFeature[]): Record<FeatureStage, BetaFeature[]> {
  return {
    labs: features.filter((f) => f.stage === 'labs'),
    beta: features.filter((f) => f.stage === 'beta'),
  };
}

export function getFeaturesByScope(features: BetaFeature[]): Record<FeatureScope, BetaFeature[]> {
  return {
    personal: features.filter((f) => f.scope === 'personal'),
    workspace: features.filter((f) => f.scope === 'workspace'),
  };
}
