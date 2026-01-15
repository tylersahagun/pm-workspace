// Types for Beta Features V2

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
  ttlDaysRemaining?: number;
}

export interface StageConfig {
  label: string;
  shortLabel: string; // For inline badges like PostHog
  emoji: string;
  description: string;
  colorVariant: 'purple' | 'blue' | 'indigo' | 'yellow';
  // Tailwind classes matching elephant-ai Badge component
  bgColor: string;
  textColor: string;
  borderColor: string;
}

// Matches elephant-ai badge styling conventions
export const STAGE_CONFIG: Record<FeatureStage, StageConfig> = {
  lab: {
    label: 'Experimental',
    shortLabel: 'LAB',
    emoji: '🧪',
    description: 'Early exploration. This feature may change significantly or be removed.',
    colorVariant: 'purple',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-600',
    borderColor: 'border-purple-200',
  },
  alpha: {
    label: 'Alpha',
    shortLabel: 'ALPHA',
    emoji: '🔷',
    description: 'Early access. Core functionality works, but expect some rough edges.',
    colorVariant: 'blue',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-600',
    borderColor: 'border-blue-200',
  },
  beta: {
    label: 'Beta',
    shortLabel: 'BETA',
    emoji: '🟡',
    description: 'Almost ready. Feature is stable but we\'re still gathering feedback.',
    colorVariant: 'indigo', // Matches existing BetaBadge in elephant-ai
    bgColor: 'bg-indigo-50',
    textColor: 'text-indigo-600',
    borderColor: 'border-indigo-200',
  },
};

// Extended mock data organized by stage
export const MOCK_FEATURES: BetaFeature[] = [
  // Lab features (experimental)
  {
    key: 'process-agent',
    name: 'Process Agent',
    description: 'Experimental AI assistant that helps automate your sales processes.',
    stage: 'lab',
    enabled: false,
    category: 'automation',
    location: 'Workflows tab',
  },
  {
    key: 'voice-cloning',
    name: 'Voice Synthesis',
    description: 'AI-generated voice summaries of your calls.',
    stage: 'lab',
    enabled: false,
    category: 'ai',
    location: 'Call details page',
  },
  {
    key: 'predictive-analytics',
    name: 'Deal Predictions',
    description: 'ML-powered deal outcome predictions based on call patterns.',
    stage: 'lab',
    enabled: false,
    category: 'analytics',
    location: 'Pipeline view',
  },
  // Alpha features (private beta)
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
    key: 'salesforce-sync-v2',
    name: 'Salesforce Sync V2',
    description: 'Enhanced bi-directional sync with Salesforce including custom objects.',
    stage: 'alpha',
    enabled: false,
    category: 'integrations',
    kbArticle: '#',
    location: 'Settings → Integrations',
  },
  // Beta features (public beta)
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
    key: 'knowledge-bases',
    name: 'Knowledge Bases',
    description: 'Create searchable knowledge bases from your meeting content.',
    stage: 'beta',
    enabled: true,
    category: 'productivity',
    kbArticle: '#',
    location: 'Sidebar → Knowledge Bases',
  },
  {
    key: 'action-items',
    name: 'Action Items',
    description: 'AI-extracted action items from your meetings with due dates.',
    stage: 'beta',
    enabled: false,
    category: 'productivity',
    kbArticle: '#',
    location: 'Sidebar → Action Items',
  },
];

// Helper to group features by stage
export function getFeaturesByStage(features: BetaFeature[]): Record<FeatureStage, BetaFeature[]> {
  return {
    lab: features.filter((f) => f.stage === 'lab'),
    alpha: features.filter((f) => f.stage === 'alpha'),
    beta: features.filter((f) => f.stage === 'beta'),
  };
}
