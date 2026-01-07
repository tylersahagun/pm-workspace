import * as React from 'react';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StageBadge, ScopeBadge, NewBadge } from './StageBadge';
import {
  BetaFeature,
  FeatureStage,
  FeatureScope,
  STAGE_CONFIG,
  SCOPE_CONFIG,
  MOCK_FEATURES,
  getFeaturesByStage,
} from './types';

// ============================================
// Toast Component
// ============================================
interface ToastProps {
  message: string;
  description?: string;
  type?: 'success' | 'info' | 'warning';
  onDismiss: () => void;
}

function Toast({ message, description, type = 'success', onDismiss }: ToastProps) {
  React.useEffect(() => {
    const timer = setTimeout(onDismiss, 5000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const icons = {
    success: (
      <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    info: (
      <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    warning: (
      <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
      <div className="bg-white border shadow-lg rounded-lg p-4 max-w-sm">
        <div className="flex items-start gap-3">
          {icons[type]}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm">{message}</p>
            {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
          </div>
          <button onClick={onDismiss} className="flex-shrink-0 text-muted-foreground hover:text-foreground">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// Feature Enable Dialog (shows "How it works")
// ============================================
interface EnableDialogProps {
  feature: BetaFeature;
  onConfirm: () => void;
  onCancel: () => void;
}

function EnableDialog({ feature, onConfirm, onCancel }: EnableDialogProps) {
  const stageConfig = STAGE_CONFIG[feature.stage];
  const scopeConfig = SCOPE_CONFIG[feature.scope];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Enable {feature.name}?</h3>
            <button onClick={onCancel} className="text-muted-foreground hover:text-foreground">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <StageBadge stage={feature.stage} size="xs" showTooltip={false} />
            <ScopeBadge scope={feature.scope} size="sm" />
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* How it works */}
          <div>
            <h4 className="text-sm font-medium mb-2">How it works</h4>
            <p className="text-sm text-muted-foreground">{feature.howItWorks || feature.description}</p>
          </div>

          {/* Scope warning */}
          {feature.scope === 'workspace' && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div className="text-xs text-amber-800">
                  <p className="font-medium">Workspace-level feature</p>
                  <p>This will affect all users in your organization.</p>
                </div>
              </div>
            </div>
          )}

          {/* Stage warning */}
          {feature.stage === 'labs' && (
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-md">
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                <div className="text-xs text-purple-800">
                  <p className="font-medium">Labs feature</p>
                  <p>This feature may change significantly or be removed.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t bg-slate-50 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm border rounded-md hover:bg-white"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Enable feature
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// Feature Card
// ============================================
interface FeatureCardProps {
  feature: BetaFeature;
  onToggle: (key: string, enabled: boolean) => void;
  isToggling?: boolean;
}

function FeatureCard({ feature, onToggle, isToggling }: FeatureCardProps) {
  const [showEnableDialog, setShowEnableDialog] = React.useState(false);

  const handleToggle = (enabled: boolean) => {
    if (enabled) {
      // Show confirmation dialog before enabling
      setShowEnableDialog(true);
    } else {
      onToggle(feature.key, false);
    }
  };

  const handleConfirmEnable = () => {
    setShowEnableDialog(false);
    onToggle(feature.key, true);
  };

  return (
    <>
      <div
        className={cn(
          'rounded-lg border bg-white p-4 transition-all duration-200',
          'hover:shadow-sm',
          feature.enabled && 'ring-1 ring-primary/20'
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className="font-medium">{feature.name}</h3>
              {feature.isNew && <NewBadge />}
            </div>
            <div className="flex items-center gap-2 mb-2">
              <ScopeBadge scope={feature.scope} size="sm" />
            </div>
            <p className="text-sm text-muted-foreground">{feature.description}</p>
            {feature.kbArticle && (
              <button className="text-xs text-primary hover:underline mt-2 inline-flex items-center gap-1">
                Learn more
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>

          <div className="flex-shrink-0 pt-0.5">
            {isToggling ? (
              <div className="h-5 w-9 flex items-center justify-center">
                <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
              </div>
            ) : (
              <Switch
                checked={feature.enabled}
                onCheckedChange={handleToggle}
                aria-label={`${feature.enabled ? 'Disable' : 'Enable'} ${feature.name}`}
              />
            )}
          </div>
        </div>

        {feature.enabled && feature.location && (
          <div className="mt-3 pt-3 border-t">
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>
                Find it at: <span className="font-medium text-foreground">{feature.location}</span>
              </span>
            </p>
          </div>
        )}
      </div>

      {showEnableDialog && (
        <EnableDialog
          feature={feature}
          onConfirm={handleConfirmEnable}
          onCancel={() => setShowEnableDialog(false)}
        />
      )}
    </>
  );
}

// ============================================
// Auto-Enroll Section (Beta only)
// ============================================
interface AutoEnrollSectionProps {
  features: BetaFeature[];
  isAutoEnrolled: boolean;
  onToggleAutoEnroll: (enabled: boolean) => void;
  isToggling?: boolean;
}

function AutoEnrollSection({
  features,
  isAutoEnrolled,
  onToggleAutoEnroll,
  isToggling,
}: AutoEnrollSectionProps) {
  const enabledCount = features.filter((f) => f.enabled).length;
  const newCount = features.filter((f) => f.isNew).length;

  return (
    <div className="rounded-lg border-2 border-indigo-200 overflow-hidden">
      <div className="p-4 bg-indigo-50">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-semibold">Auto-enroll in new Beta features</h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              {enabledCount} of {features.length} currently enabled
              {newCount > 0 && <span className="ml-2 text-emerald-600">• {newCount} new</span>}
            </p>
          </div>
          <div className="flex-shrink-0">
            {isToggling ? (
              <div className="h-5 w-9 flex items-center justify-center">
                <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
              </div>
            ) : (
              <Switch
                checked={isAutoEnrolled}
                onCheckedChange={onToggleAutoEnroll}
                aria-label="Auto-enroll in new Beta features"
              />
            )}
          </div>
        </div>
      </div>

      <div className="px-4 py-3 bg-white border-t border-indigo-100">
        <p className="text-xs text-muted-foreground">
          {isAutoEnrolled ? (
            <span className="text-indigo-700">
              You will automatically receive access to new beta features when they launch.
            </span>
          ) : (
            'Enable to automatically receive new beta features. You can disable individual features anytime.'
          )}
        </p>
      </div>
    </div>
  );
}

// ============================================
// Feature Group (Personal vs Workspace)
// ============================================
interface FeatureGroupProps {
  scope: FeatureScope;
  features: BetaFeature[];
  onToggle: (key: string, enabled: boolean) => void;
  togglingKey?: string | null;
}

function FeatureGroup({ scope, features, onToggle, togglingKey }: FeatureGroupProps) {
  const config = SCOPE_CONFIG[scope];

  if (features.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 px-1">
        <ScopeBadge scope={scope} size="md" showLabel={false} />
        <h4 className="text-sm font-medium">{config.label} features</h4>
        <span className="text-xs text-muted-foreground">
          ({features.filter((f) => f.enabled).length}/{features.length} enabled)
        </span>
      </div>
      <div className="space-y-3">
        {features.map((feature) => (
          <FeatureCard
            key={feature.key}
            feature={feature}
            onToggle={onToggle}
            isToggling={togglingKey === feature.key}
          />
        ))}
      </div>
    </div>
  );
}

// ============================================
// Stage Section
// ============================================
interface StageSectionProps {
  stage: FeatureStage;
  features: BetaFeature[];
  isAutoEnrolled?: boolean;
  onToggle: (key: string, enabled: boolean) => void;
  onToggleAutoEnroll?: (enabled: boolean) => void;
  togglingKey?: string | null;
  togglingAutoEnroll?: boolean;
  isManager?: boolean;
}

function StageSection({
  stage,
  features,
  isAutoEnrolled,
  onToggle,
  onToggleAutoEnroll,
  togglingKey,
  togglingAutoEnroll,
  isManager = true,
}: StageSectionProps) {
  const config = STAGE_CONFIG[stage];

  // Filter features based on user role
  const visibleFeatures = isManager
    ? features
    : features.filter((f) => f.scope === 'personal');

  const personalFeatures = visibleFeatures.filter((f) => f.scope === 'personal');
  const workspaceFeatures = visibleFeatures.filter((f) => f.scope === 'workspace');

  if (visibleFeatures.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <svg className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        <h3 className="font-medium text-lg mb-2">No {config.label} features available</h3>
        <p className="text-muted-foreground text-sm max-w-sm mx-auto">
          New features will appear here as they become available.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stage description */}
      <div className={cn('p-3 rounded-lg text-sm', config.bgColor)}>
        <p className={config.textColor}>
          <strong>{config.label}:</strong> {config.description}
        </p>
        <p className={cn('mt-1 text-xs', config.textColor, 'opacity-80')}>
          {config.enrollmentNote}
        </p>
      </div>

      {/* Auto-enroll (Beta only) */}
      {stage === 'beta' && onToggleAutoEnroll && (
        <AutoEnrollSection
          features={visibleFeatures}
          isAutoEnrolled={isAutoEnrolled || false}
          onToggleAutoEnroll={onToggleAutoEnroll}
          isToggling={togglingAutoEnroll}
        />
      )}

      {/* Personal features */}
      <FeatureGroup
        scope="personal"
        features={personalFeatures}
        onToggle={onToggle}
        togglingKey={togglingKey}
      />

      {/* Workspace features (managers only) */}
      {workspaceFeatures.length > 0 && (
        <FeatureGroup
          scope="workspace"
          features={workspaceFeatures}
          onToggle={onToggle}
          togglingKey={togglingKey}
        />
      )}
    </div>
  );
}

// ============================================
// Main Component
// ============================================
interface BetaFeaturesSettingsV4Props {
  features?: BetaFeature[];
  isLoading?: boolean;
  error?: string;
  defaultTab?: FeatureStage;
  isManager?: boolean; // Whether user can see workspace features
}

export function BetaFeaturesSettingsV4({
  features: initialFeatures = MOCK_FEATURES,
  isLoading = false,
  error,
  defaultTab = 'beta',
  isManager = true,
}: BetaFeaturesSettingsV4Props) {
  const [features, setFeatures] = React.useState(initialFeatures);
  const [togglingKey, setTogglingKey] = React.useState<string | null>(null);
  const [togglingAutoEnroll, setTogglingAutoEnroll] = React.useState(false);
  const [toast, setToast] = React.useState<ToastProps | null>(null);
  const [activeTab, setActiveTab] = React.useState<FeatureStage>(defaultTab);
  const [betaAutoEnrolled, setBetaAutoEnrolled] = React.useState(false);

  const featuresByStage = getFeaturesByStage(features);

  const handleToggle = async (key: string, enabled: boolean) => {
    setTogglingKey(key);
    await new Promise((resolve) => setTimeout(resolve, 400));

    setFeatures((prev) => prev.map((f) => (f.key === key ? { ...f, enabled } : f)));
    setTogglingKey(null);

    const feature = features.find((f) => f.key === key);
    setToast({
      message: enabled ? `${feature?.name} enabled` : `${feature?.name} disabled`,
      description: enabled ? `Find it at ${feature?.location || 'in the app'}` : 'You can re-enable anytime',
      type: enabled ? 'success' : 'info',
      onDismiss: () => setToast(null),
    });
  };

  const handleToggleAutoEnroll = async (enabled: boolean) => {
    setTogglingAutoEnroll(true);
    await new Promise((resolve) => setTimeout(resolve, 600));

    setBetaAutoEnrolled(enabled);

    if (enabled) {
      setFeatures((prev) => prev.map((f) => (f.stage === 'beta' ? { ...f, enabled: true } : f)));
    }

    setTogglingAutoEnroll(false);

    setToast({
      message: enabled ? 'Auto-enrollment enabled' : 'Auto-enrollment disabled',
      description: enabled
        ? 'You will receive new beta features automatically'
        : 'You can still enable features individually',
      type: enabled ? 'warning' : 'info',
      onDismiss: () => setToast(null),
    });
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <svg className="w-12 h-12 mx-auto mb-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h3 className="font-medium text-lg mb-2">Unable to load features</h3>
        <p className="text-muted-foreground text-sm mb-4">{error}</p>
        <button className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
          Try again
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="space-y-4">
          <div className="h-8 w-48 bg-muted rounded animate-pulse" />
          <div className="h-4 w-64 bg-muted rounded animate-pulse" />
          <div className="h-10 w-full bg-muted rounded animate-pulse mt-6" />
          <div className="space-y-3 mt-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Count visible features
  const labsCount = isManager
    ? featuresByStage.labs.length
    : featuresByStage.labs.filter((f) => f.scope === 'personal').length;
  const betaCount = isManager
    ? featuresByStage.beta.length
    : featuresByStage.beta.filter((f) => f.scope === 'personal').length;

  const labsEnabled = featuresByStage.labs.filter((f) => f.enabled).length;
  const betaEnabled = featuresByStage.beta.filter((f) => f.enabled).length;

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-1">Early Access Features</h2>
        <p className="text-muted-foreground text-sm">
          Get early access to new features. Review how each feature works before enabling.
        </p>
        {!isManager && (
          <p className="text-xs text-amber-600 mt-2">
            Workspace-level features are managed by your organization's administrators.
          </p>
        )}
      </div>

      {/* Tabs - NO icons */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as FeatureStage)}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="labs" className="gap-2">
            <span>Labs</span>
            {labsEnabled > 0 && (
              <span className="text-xs bg-purple-100 text-purple-700 px-1.5 rounded-full">
                {labsEnabled}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="beta" className="gap-2">
            <span>Beta</span>
            {betaEnabled > 0 && (
              <span className="text-xs bg-indigo-100 text-indigo-700 px-1.5 rounded-full">
                {betaEnabled}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="labs">
          <StageSection
            stage="labs"
            features={featuresByStage.labs}
            onToggle={handleToggle}
            togglingKey={togglingKey}
            isManager={isManager}
          />
        </TabsContent>

        <TabsContent value="beta">
          <StageSection
            stage="beta"
            features={featuresByStage.beta}
            isAutoEnrolled={betaAutoEnrolled}
            onToggle={handleToggle}
            onToggleAutoEnroll={handleToggleAutoEnroll}
            togglingKey={togglingKey}
            togglingAutoEnroll={togglingAutoEnroll}
            isManager={isManager}
          />
        </TabsContent>
      </Tabs>

      {toast && <Toast {...toast} />}
    </div>
  );
}
