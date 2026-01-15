// Types for Beta Features V3 - Professional Edition

export type FeatureStage = 'lab' | 'alpha' | 'beta';

export interface BetaFeature {
  key: string;
  name: string;
  description: string;
  stage: FeatureStage;
  enabled: boolean;
  category?: string;
  kbArticle?: string;
  location?: string;
  addedDate?: string; // ISO date when feature was added
  isNew?: boolean; // Flag for recently added features
}

export interface StageConfig {
  label: string;
  shortLabel: string;
  description: string;
  autoEnrollDescription: string; // Explains what happens with "Enable All"
  colorVariant: 'purple' | 'blue' | 'indigo';
  bgColor: string;
  textColor: string;
  borderColor: string;
  iconBgColor: string;
}

// Professional styling without emojis, matching elephant-ai conventions
export const STAGE_CONFIG: Record<FeatureStage, StageConfig> = {
  lab: {
    label: 'Experimental',
    shortLabel: 'LAB',
    description: 'Early exploration. Features may change significantly or be removed without notice.',
    autoEnrollDescription: 'You will automatically receive access to all new experimental features as they become available. These features are highly unstable.',
    colorVariant: 'purple',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-200',
    iconBgColor: 'bg-purple-100',
  },
  alpha: {
    label: 'Alpha',
    shortLabel: 'ALPHA',
    description: 'Early access testing. Core functionality works but expect rough edges and breaking changes.',
    autoEnrollDescription: 'You will automatically receive access to all new alpha features. Alpha features may have bugs and incomplete functionality.',
    colorVariant: 'blue',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200',
    iconBgColor: 'bg-blue-100',
  },
  beta: {
    label: 'Beta',
    shortLabel: 'BETA',
    description: 'Feature complete and stable. Gathering feedback before general release.',
    autoEnrollDescription: 'You will automatically receive access to all new beta features as they become available. Beta features are stable but may still change.',
    colorVariant: 'indigo',
    bgColor: 'bg-indigo-50',
    textColor: 'text-indigo-700',
    borderColor: 'border-indigo-200',
    iconBgColor: 'bg-indigo-100',
  },
};

// Extended mock data
export const MOCK_FEATURES: BetaFeature[] = [
  // Lab features
  {
    key: 'process-agent',
    name: 'Process Agent',
    description: 'AI assistant that helps automate your sales processes and workflows.',
    stage: 'lab',
    enabled: false,
    category: 'automation',
    location: 'Workflows tab',
  },
  {
    key: 'voice-synthesis',
    name: 'Voice Summaries',
    description: 'AI-generated audio summaries of your calls.',
    stage: 'lab',
    enabled: false,
    category: 'ai',
    location: 'Call details',
    isNew: true,
    addedDate: '2026-01-10',
  },
  {
    key: 'deal-predictions',
    name: 'Deal Predictions',
    description: 'ML-powered deal outcome predictions based on conversation patterns.',
    stage: 'lab',
    enabled: false,
    category: 'analytics',
    location: 'Pipeline view',
  },
  // Alpha features
  {
    key: 'internal-search',
    name: 'Universal Search',
    description: 'Search across all meetings, contacts, and company data in one unified interface.',
    stage: 'alpha',
    enabled: false,
    category: 'search',
    kbArticle: '#',
    location: 'Global search bar',
  },
  {
    key: 'privacy-agent',
    name: 'Privacy Determination',
    description: 'AI automatically determines call privacy levels before processing begins.',
    stage: 'alpha',
    enabled: false,
    category: 'privacy',
    kbArticle: '#',
    location: 'Automatic',
  },
  {
    key: 'salesforce-sync-v2',
    name: 'Salesforce Sync V2',
    description: 'Enhanced bi-directional sync with Salesforce including custom objects and fields.',
    stage: 'alpha',
    enabled: false,
    category: 'integrations',
    kbArticle: '#',
    location: 'Settings → Integrations',
    isNew: true,
    addedDate: '2026-01-12',
  },
  // Beta features
  {
    key: 'auto-tagging-v2',
    name: 'Auto-Tagging V2',
    description: 'Automatically tag meetings based on conversation content and context analysis.',
    stage: 'beta',
    enabled: true,
    category: 'automation',
    kbArticle: '#',
    location: 'Settings → Tags',
  },
  {
    key: 'global-chat',
    name: 'Global Chat',
    description: 'Access AskElephant from anywhere in the app with a persistent chat interface.',
    stage: 'beta',
    enabled: false,
    category: 'ai',
    kbArticle: '#',
    location: 'Bottom-right corner',
  },
  {
    key: 'knowledge-bases',
    name: 'Knowledge Bases',
    description: 'Create searchable knowledge bases from your meeting content and notes.',
    stage: 'beta',
    enabled: true,
    category: 'productivity',
    kbArticle: '#',
    location: 'Sidebar',
  },
  {
    key: 'action-items',
    name: 'Action Items',
    description: 'AI-extracted action items from meetings with assignees and due dates.',
    stage: 'beta',
    enabled: false,
    category: 'productivity',
    kbArticle: '#',
    location: 'Sidebar',
  },
  {
    key: 'customers-page',
    name: 'Customers View',
    description: 'Unified view of all customer accounts with health scores and insights.',
    stage: 'beta',
    enabled: false,
    category: 'crm',
    kbArticle: '#',
    location: 'Sidebar',
    isNew: true,
    addedDate: '2026-01-11',
  },
];

export function getFeaturesByStage(features: BetaFeature[]): Record<FeatureStage, BetaFeature[]> {
  return {
    lab: features.filter((f) => f.stage === 'lab'),
    alpha: features.filter((f) => f.stage === 'alpha'),
    beta: features.filter((f) => f.stage === 'beta'),
  };
}
