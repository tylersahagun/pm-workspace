import * as React from 'react';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  UserRole,
  PrivacyRule,
  PrivacySettings,
  PersonalPrivacySettings,
  WorkspaceSettings,
  MOCK_PRIVACY_RULES,
  MOCK_WORKSPACE_SETTINGS,
  MOCK_PERSONAL_SETTINGS,
} from './types';

// ============================================
// Info Banner Component
// ============================================
interface InfoBannerProps {
  type: 'info' | 'warning' | 'success';
  title: string;
  description: string;
  icon?: React.ReactNode;
}

function InfoBanner({ type, title, description, icon }: InfoBannerProps) {
  const colors = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  };

  const defaultIcons = {
    info: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    warning: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    success: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  return (
    <div className={cn('p-4 rounded-lg border flex items-start gap-3', colors[type])}>
      <div className="flex-shrink-0 mt-0.5">{icon || defaultIcons[type]}</div>
      <div>
        <p className="font-medium text-sm">{title}</p>
        <p className="text-sm opacity-90 mt-0.5">{description}</p>
      </div>
    </div>
  );
}

// ============================================
// Privacy Rule Card
// ============================================
interface PrivacyRuleCardProps {
  rule: PrivacyRule;
  onToggle: (id: string, enabled: boolean) => void;
  onEdit?: (id: string) => void;
}

function PrivacyRuleCard({ rule, onToggle, onEdit }: PrivacyRuleCardProps) {
  const actionLabels = {
    mark_private: 'Mark Private',
    mark_public: 'Mark Public',
    require_review: 'Require Review',
  };

  const actionColors = {
    mark_private: 'bg-red-100 text-red-700',
    mark_public: 'bg-emerald-100 text-emerald-700',
    require_review: 'bg-amber-100 text-amber-700',
  };

  return (
    <div className={cn(
      'p-4 rounded-lg border bg-white transition-all',
      rule.enabled ? 'border-primary/20 shadow-sm' : 'opacity-75'
    )}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium">{rule.name}</h4>
            <span className={cn('text-xs px-2 py-0.5 rounded-full', actionColors[rule.action])}>
              {actionLabels[rule.action]}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{rule.description}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {rule.conditions.map((condition, i) => (
              <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                {condition}
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {onEdit && (
            <button
              onClick={() => onEdit(rule.id)}
              className="text-muted-foreground hover:text-foreground p-1"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          )}
          <Switch
            checked={rule.enabled}
            onCheckedChange={(enabled) => onToggle(rule.id, enabled)}
          />
        </div>
      </div>
    </div>
  );
}

// ============================================
// Workspace Privacy Settings Section
// KEY DECISION: These apply to Managers & Owners ONLY
// ============================================
interface WorkspacePrivacySectionProps {
  settings: PrivacySettings;
  onToggle: (enabled: boolean) => void;
  onRuleToggle: (id: string, enabled: boolean) => void;
  onRuleEdit?: (id: string) => void;
  onAddRule?: () => void;
  onRequestUserControl?: () => void;
}

function WorkspacePrivacySection({
  settings,
  onToggle,
  onRuleToggle,
  onRuleEdit,
  onAddRule,
  onRequestUserControl,
}: WorkspacePrivacySectionProps) {
  return (
    <div className="space-y-6">
      {/* CRITICAL: Scope Banner */}
      <InfoBanner
        type="info"
        title="Manager & Owner Settings Only"
        description="These privacy rules apply to manager and owner calls only. Users can configure their own settings in Personal Settings."
        icon={
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        }
      />

      {/* Main Toggle */}
      <div className="p-4 rounded-lg border bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Privacy Agent</h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              Automatically determine meeting privacy based on conversation content
            </p>
          </div>
          <Switch checked={settings.enabled} onCheckedChange={onToggle} />
        </div>
      </div>

      {/* Rules Section */}
      {settings.enabled && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Privacy Rules</h4>
            {onAddRule && (
              <button
                onClick={onAddRule}
                className="text-sm text-primary hover:text-primary/80 flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Rule
              </button>
            )}
          </div>

          <div className="space-y-3">
            {settings.rules.map((rule) => (
              <PrivacyRuleCard
                key={rule.id}
                rule={rule}
                onToggle={onRuleToggle}
                onEdit={onRuleEdit}
              />
            ))}
          </div>

          {settings.rules.length === 0 && (
            <div className="text-center py-8 border rounded-lg bg-slate-50">
              <svg className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-sm text-muted-foreground">No privacy rules configured</p>
              <button
                onClick={onAddRule}
                className="mt-3 text-sm text-primary hover:text-primary/80"
              >
                Create your first rule
              </button>
            </div>
          )}
        </div>
      )}

      {/* Feature Request CTA */}
      <div className="p-4 rounded-lg border border-dashed border-slate-300 bg-slate-50">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-slate-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-700">
              Want privacy controls for user calls too?
            </p>
            <p className="text-xs text-slate-500 mt-1">
              We're considering adding workspace-level privacy settings for all team members.
            </p>
            <button
              onClick={onRequestUserControl}
              className="mt-2 text-xs text-primary hover:text-primary/80 font-medium"
            >
              Request this feature →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// Personal Privacy Settings Section
// ============================================
interface PersonalPrivacySectionProps {
  settings: PersonalPrivacySettings;
  onVisibilityChange: (visibility: 'default' | 'public') => void;
  onTeamAccessChange: (allowed: boolean) => void;
}

function PersonalPrivacySection({
  settings,
  onVisibilityChange,
  onTeamAccessChange,
}: PersonalPrivacySectionProps) {
  return (
    <div className="space-y-6">
      <InfoBanner
        type="info"
        title="Your Personal Privacy Settings"
        description="These settings apply to your meetings only. You can mark your meetings as public, but private meetings are determined by workspace rules."
      />

      <div className="p-4 rounded-lg border bg-white space-y-6">
        {/* Default Visibility */}
        <div>
          <h4 className="font-medium mb-3">Default Meeting Visibility</h4>
          <div className="space-y-3">
            <label className="flex items-start gap-3 p-3 rounded-lg border cursor-pointer hover:bg-slate-50 transition-colors">
              <input
                type="radio"
                name="visibility"
                checked={settings.defaultVisibility === 'default'}
                onChange={() => onVisibilityChange('default')}
                className="mt-1"
              />
              <div>
                <p className="font-medium text-sm">Default (follow workspace rules)</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Let workspace privacy settings determine visibility
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-lg border cursor-pointer hover:bg-slate-50 transition-colors">
              <input
                type="radio"
                name="visibility"
                checked={settings.defaultVisibility === 'public'}
                onChange={() => onVisibilityChange('public')}
                className="mt-1"
              />
              <div>
                <p className="font-medium text-sm">Public (share with team by default)</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Your meetings will be visible to your team unless marked otherwise
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Team Access */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Allow Team Access</h4>
              <p className="text-sm text-muted-foreground mt-0.5">
                Let team members view and search your public meetings
              </p>
            </div>
            <Switch
              checked={settings.allowTeamAccess}
              onCheckedChange={onTeamAccessChange}
            />
          </div>
        </div>
      </div>

      {/* Note about limitations */}
      <div className="p-4 rounded-lg bg-slate-100 border border-slate-200">
        <p className="text-xs text-slate-600">
          <strong>Note:</strong> You can mark individual meetings as public after they're recorded.
          Private meetings are determined by workspace privacy rules and cannot be changed.
        </p>
      </div>
    </div>
  );
}

// ============================================
// Main Settings Page Component
// ============================================
export interface SettingsPageProps {
  userRole?: UserRole;
  workspaceSettings?: WorkspaceSettings;
  personalSettings?: PersonalPrivacySettings;
  activeSection?: 'workspace' | 'personal';
}

export function SettingsPage({
  userRole = 'manager',
  workspaceSettings = MOCK_WORKSPACE_SETTINGS,
  personalSettings = MOCK_PERSONAL_SETTINGS,
  activeSection = 'workspace',
}: SettingsPageProps) {
  const [settings, setSettings] = React.useState(workspaceSettings);
  const [personal, setPersonal] = React.useState(personalSettings);
  const [toast, setToast] = React.useState<{ message: string; type: 'success' | 'info' } | null>(null);

  const isAdmin = userRole === 'admin' || userRole === 'owner' || userRole === 'manager';

  const handlePrivacyToggle = (enabled: boolean) => {
    setSettings((prev) => ({
      ...prev,
      privacy: { ...prev.privacy, enabled },
    }));
    setToast({
      message: enabled ? 'Privacy Agent enabled' : 'Privacy Agent disabled',
      type: 'success',
    });
    setTimeout(() => setToast(null), 3000);
  };

  const handleRuleToggle = (id: string, enabled: boolean) => {
    setSettings((prev) => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        rules: prev.privacy.rules.map((r) =>
          r.id === id ? { ...r, enabled } : r
        ),
      },
    }));
  };

  const handleVisibilityChange = (visibility: 'default' | 'public') => {
    setPersonal((prev) => ({ ...prev, defaultVisibility: visibility }));
    setToast({
      message: 'Visibility preference saved',
      type: 'success',
    });
    setTimeout(() => setToast(null), 3000);
  };

  const handleTeamAccessChange = (allowed: boolean) => {
    setPersonal((prev) => ({ ...prev, allowTeamAccess: allowed }));
  };

  const handleRequestFeature = () => {
    setToast({
      message: 'Feature request submitted! Thank you for your feedback.',
      type: 'info',
    });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <h1 className="text-xl font-semibold">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage your workspace and personal preferences
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-6">
        <Tabs defaultValue={activeSection} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            {isAdmin && (
              <TabsTrigger value="workspace" className="gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Manager & Owner Settings
              </TabsTrigger>
            )}
            <TabsTrigger value="personal" className="gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Personal Settings
            </TabsTrigger>
          </TabsList>

          {isAdmin && (
            <TabsContent value="workspace" className="space-y-6">
              <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <div className="p-6 border-b bg-gradient-to-r from-slate-50 to-white">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Privacy Settings
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Configure automatic privacy detection for manager and owner calls
                  </p>
                </div>
                <div className="p-6">
                  <WorkspacePrivacySection
                    settings={settings.privacy}
                    onToggle={handlePrivacyToggle}
                    onRuleToggle={handleRuleToggle}
                    onAddRule={() => alert('Add rule dialog would open')}
                    onRuleEdit={(id) => alert(`Edit rule ${id}`)}
                    onRequestUserControl={handleRequestFeature}
                  />
                </div>
              </div>
            </TabsContent>
          )}

          <TabsContent value="personal" className="space-y-6">
            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
              <div className="p-6 border-b bg-gradient-to-r from-slate-50 to-white">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  My Privacy Preferences
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Control how your meetings are shared with your team
                </p>
              </div>
              <div className="p-6">
                <PersonalPrivacySection
                  settings={personal}
                  onVisibilityChange={handleVisibilityChange}
                  onTeamAccessChange={handleTeamAccessChange}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
          <div className={cn(
            'px-4 py-3 rounded-lg shadow-lg flex items-center gap-3',
            toast.type === 'success' && 'bg-emerald-600 text-white',
            toast.type === 'info' && 'bg-blue-600 text-white'
          )}>
            {toast.type === 'success' && (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
            {toast.type === 'info' && (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
