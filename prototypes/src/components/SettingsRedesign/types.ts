// Settings Redesign Types
// Based on PRD from 2026-01-16 planning session
// KEY DECISION: Workspace privacy settings apply to managers/owners ONLY

export type UserRole = 'user' | 'manager' | 'owner' | 'admin';

export interface PrivacyRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  conditions: string[];
  action: 'mark_private' | 'mark_public' | 'require_review';
}

export interface PrivacySettings {
  enabled: boolean;
  rules: PrivacyRule[];
  defaultBehavior: 'private' | 'public' | 'inherit';
}

export interface PersonalPrivacySettings {
  defaultVisibility: 'default' | 'public';
  allowTeamAccess: boolean;
}

export interface WorkspaceSettings {
  privacy: PrivacySettings;
  integrations: IntegrationSettings;
  teamManagement: TeamManagementSettings;
}

export interface IntegrationSettings {
  hubspot: { connected: boolean; lastSync?: string };
  salesforce: { connected: boolean; lastSync?: string };
  slack: { connected: boolean; channels: string[] };
}

export interface TeamManagementSettings {
  allowUserInvites: boolean;
  defaultUserRole: UserRole;
  requireApproval: boolean;
}

// Mock Data
export const MOCK_PRIVACY_RULES: PrivacyRule[] = [
  {
    id: '1',
    name: 'HR Discussions',
    description: 'Mark meetings as private when HR topics are discussed',
    enabled: true,
    conditions: ['Contains HR keywords', 'Participant from HR dept'],
    action: 'mark_private',
  },
  {
    id: '2',
    name: 'Client Sensitive',
    description: 'Mark client calls as private when financial data is shared',
    enabled: true,
    conditions: ['Contains financial data', 'External participants'],
    action: 'require_review',
  },
  {
    id: '3',
    name: 'Executive Meetings',
    description: 'Automatically mark executive meetings as private',
    enabled: false,
    conditions: ['C-level participants', 'Board members'],
    action: 'mark_private',
  },
];

export const MOCK_WORKSPACE_SETTINGS: WorkspaceSettings = {
  privacy: {
    enabled: true,
    rules: MOCK_PRIVACY_RULES,
    defaultBehavior: 'public',
  },
  integrations: {
    hubspot: { connected: true, lastSync: '2026-01-16T10:30:00' },
    salesforce: { connected: false },
    slack: { connected: true, channels: ['#sales', '#cs-team'] },
  },
  teamManagement: {
    allowUserInvites: false,
    defaultUserRole: 'user',
    requireApproval: true,
  },
};

export const MOCK_PERSONAL_SETTINGS: PersonalPrivacySettings = {
  defaultVisibility: 'default',
  allowTeamAccess: true,
};
