// Types for Beta Features components

export type FeatureStage = 'lab' | 'alpha' | 'beta';

export interface BetaFeature {
  key: string;
  name: string;
  description: string;
  stage: FeatureStage;
  enabled: boolean;
  category?: string;
  kbArticle?: string;
  location?: string; // Where to find the feature once enabled
  ttlDaysRemaining?: number; // For internal dashboard
}

export interface BetaFeaturesState {
  features: BetaFeature[];
  isLoading: boolean;
  error?: string;
  togglingFeature?: string; // Feature key currently being toggled
}

export interface StageConfig {
  label: string;
  emoji: string;
  description: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
}

export const STAGE_CONFIG: Record<FeatureStage, StageConfig> = {
  lab: {
    label: 'Experimental',
    emoji: '🧪',
    description: 'Early exploration. This feature may change significantly or be removed.',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    textColor: 'text-purple-800 dark:text-purple-200',
    borderColor: 'border-purple-200 dark:border-purple-800',
  },
  alpha: {
    label: 'Alpha',
    emoji: '🔷',
    description: 'Early access. Core functionality works, but expect some rough edges.',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    textColor: 'text-blue-800 dark:text-blue-200',
    borderColor: 'border-blue-200 dark:border-blue-800',
  },
  beta: {
    label: 'Beta',
    emoji: '🟡',
    description: 'Almost ready. Feature is stable but we\'re still gathering feedback.',
    bgColor: 'bg-amber-100 dark:bg-amber-900/30',
    textColor: 'text-amber-800 dark:text-amber-200',
    borderColor: 'border-amber-200 dark:border-amber-800',
  },
};

// Mock data for prototypes
export const MOCK_FEATURES: BetaFeature[] = [
  {
    key: 'auto-tagging-v2',
    name: 'Auto-Tagging V2',
    description: 'Automatically tag meetings based on conversation content and context.',
    stage: 'beta',
    enabled: true,
    category: 'automation',
    kbArticle: '#',
    location: 'Settings → Tags',
  },
  {
    key: 'internal-search',
    name: 'Internal Search',
    description: 'Search across all your meetings, contacts, and company data in one place.',
    stage: 'alpha',
    enabled: false,
    category: 'search',
    kbArticle: '#',
    location: 'Global search bar',
  },
  {
    key: 'global-chat',
    name: 'Global Chat',
    description: 'Chat with AskElephant from anywhere in the app. Ask questions, get insights.',
    stage: 'beta',
    enabled: false,
    category: 'ai',
    kbArticle: '#',
    location: 'Bottom-right corner',
  },
  {
    key: 'privacy-agent',
    name: 'Privacy Determination',
    description: 'AI automatically determines call privacy levels before processing.',
    stage: 'alpha',
    enabled: false,
    category: 'privacy',
    kbArticle: '#',
    location: 'Automatic on all calls',
  },
  {
    key: 'process-agent',
    name: 'Process Agent',
    description: 'Experimental AI assistant that helps automate your sales processes.',
    stage: 'lab',
    enabled: false,
    category: 'automation',
    location: 'Workflows tab',
  },
];
