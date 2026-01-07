import * as React from 'react';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StageBadge, StageIcon, NewBadge } from './StageBadge';
import { BetaFeature, FeatureStage, STAGE_CONFIG, MOCK_FEATURES, getFeaturesByStage } from './types';

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
// Feature Card
// ============================================
interface FeatureCardProps {
  feature: BetaFeature;
  onToggle: (key: string, enabled: boolean) => void;
  isToggling?: boolean;
}

function FeatureCard({ feature, onToggle, isToggling }: FeatureCardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border bg-white p-4 transition-all duration-200',
        'hover:shadow-sm',
        feature.enabled && 'ring-1 ring-primary/20'
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <h3 className="font-medium">{feature.name}</h3>
            {feature.isNew && <NewBadge />}
          </div>
          <p className="text-sm text-muted-foreground mb-2">{feature.description}</p>
          {feature.kbArticle && (
            <button className="text-xs text-primary hover:underline inline-flex items-center gap-1">
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
              onCheckedChange={(checked) => onToggle(feature.key, checked)}
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
  );
}

// ============================================
// Auto-Enroll Toggle (Enable All with clear messaging)
// ============================================
interface AutoEnrollToggleProps {
  stage: FeatureStage;
  features: BetaFeature[];
  isAutoEnrolled: boolean;
  onToggleAutoEnroll: (stage: FeatureStage, enabled: boolean) => void;
  isToggling?: boolean;
}

function AutoEnrollToggle({
  stage,
  features,
  isAutoEnrolled,
  onToggleAutoEnroll,
  isToggling,
}: AutoEnrollToggleProps) {
  const config = STAGE_CONFIG[stage];
  const enabledCount = features.filter((f) => f.enabled).length;
  const newCount = features.filter((f) => f.isNew).length;

  return (
    <div className={cn('rounded-lg border-2 overflow-hidden', config.borderColor)}>
      {/* Header */}
      <div className={cn('p-4', config.bgColor)}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <StageIcon stage={stage} size="md" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">Auto-enroll in {config.label} features</h3>
                <StageBadge stage={stage} size="sm" showTooltip={false} />
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">
                {enabledCount} of {features.length} currently enabled
                {newCount > 0 && (
                  <span className="ml-2 text-emerald-600">• {newCount} new</span>
                )}
              </p>
            </div>
          </div>

          <div className="flex-shrink-0">
            {isToggling ? (
              <div className="h-5 w-9 flex items-center justify-center">
                <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
              </div>
            ) : (
              <Switch
                checked={isAutoEnrolled}
                onCheckedChange={(checked) => onToggleAutoEnroll(stage, checked)}
                aria-label={`Auto-enroll in ${config.label} features`}
              />
            )}
          </div>
        </div>
      </div>

      {/* Explanation */}
      <div className="px-4 py-3 bg-white border-t border-dashed">
        <div className="flex items-start gap-2">
          <svg className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-xs text-muted-foreground">
            <p className="font-medium text-foreground mb-1">What this means:</p>
            <p>{config.autoEnrollDescription}</p>
            {isAutoEnrolled && (
              <p className="mt-2 text-amber-700 bg-amber-50 px-2 py-1 rounded inline-block">
                You will receive new {config.label.toLowerCase()} features automatically when they launch.
              </p>
            )}
          </div>
        </div>
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
  isAutoEnrolled: boolean;
  onToggle: (key: string, enabled: boolean) => void;
  onToggleAutoEnroll: (stage: FeatureStage, enabled: boolean) => void;
  togglingKey?: string | null;
  togglingAutoEnroll?: FeatureStage | null;
}

function StageSection({
  stage,
  features,
  isAutoEnrolled,
  onToggle,
  onToggleAutoEnroll,
  togglingKey,
  togglingAutoEnroll,
}: StageSectionProps) {
  const config = STAGE_CONFIG[stage];

  if (features.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <StageIcon stage={stage} size="lg" className="mx-auto mb-4" />
        <h3 className="font-medium text-lg mb-2">No {config.label} features available</h3>
        <p className="text-muted-foreground text-sm max-w-sm mx-auto">
          New {config.label.toLowerCase()} features will appear here when available.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Auto-enroll toggle */}
      <AutoEnrollToggle
        stage={stage}
        features={features}
        isAutoEnrolled={isAutoEnrolled}
        onToggleAutoEnroll={onToggleAutoEnroll}
        isToggling={togglingAutoEnroll === stage}
      />

      {/* Individual features */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h4 className="text-sm font-medium text-muted-foreground">Individual features</h4>
          <span className="text-xs text-muted-foreground">
            {features.filter((f) => f.enabled).length} enabled
          </span>
        </div>
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
// Main Component: Tabbed Settings V3
// ============================================
interface BetaFeaturesSettingsV3Props {
  features?: BetaFeature[];
  isLoading?: boolean;
  error?: string;
  defaultTab?: FeatureStage;
}

export function BetaFeaturesSettingsV3({
  features: initialFeatures = MOCK_FEATURES,
  isLoading = false,
  error,
  defaultTab = 'beta',
}: BetaFeaturesSettingsV3Props) {
  const [features, setFeatures] = React.useState(initialFeatures);
  const [togglingKey, setTogglingKey] = React.useState<string | null>(null);
  const [togglingAutoEnroll, setTogglingAutoEnroll] = React.useState<FeatureStage | null>(null);
  const [toast, setToast] = React.useState<ToastProps | null>(null);
  const [activeTab, setActiveTab] = React.useState<FeatureStage>(defaultTab);
  
  // Track auto-enrollment state per stage
  const [autoEnrolled, setAutoEnrolled] = React.useState<Record<FeatureStage, boolean>>({
    lab: false,
    alpha: false,
    beta: false,
  });

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

  const handleToggleAutoEnroll = async (stage: FeatureStage, enabled: boolean) => {
    setTogglingAutoEnroll(stage);
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Update auto-enroll state
    setAutoEnrolled((prev) => ({ ...prev, [stage]: enabled }));

    // If enabling, also enable all current features
    if (enabled) {
      setFeatures((prev) => prev.map((f) => (f.stage === stage ? { ...f, enabled: true } : f)));
    }

    setTogglingAutoEnroll(null);

    const config = STAGE_CONFIG[stage];
    setToast({
      message: enabled
        ? `Auto-enrolled in ${config.label} features`
        : `Auto-enrollment disabled for ${config.label}`,
      description: enabled
        ? `You'll automatically receive new ${config.label.toLowerCase()} features`
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

  // Count enabled and new per stage
  const stageCounts = {
    lab: { enabled: featuresByStage.lab.filter((f) => f.enabled).length, total: featuresByStage.lab.length },
    alpha: { enabled: featuresByStage.alpha.filter((f) => f.enabled).length, total: featuresByStage.alpha.length },
    beta: { enabled: featuresByStage.beta.filter((f) => f.enabled).length, total: featuresByStage.beta.length },
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-1">Early Access Features</h2>
        <p className="text-muted-foreground text-sm">
          Get early access to new features. Features are organized by stability level.
        </p>
      </div>

      {/* Tabbed Navigation */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as FeatureStage)}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="lab" className="flex items-center gap-2">
            <StageIcon stage="lab" size="sm" />
            <span className="hidden sm:inline">Experimental</span>
            <span className="sm:hidden">Lab</span>
            {stageCounts.lab.enabled > 0 && (
              <span className="text-xs bg-purple-100 text-purple-700 px-1.5 rounded-full">
                {stageCounts.lab.enabled}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="alpha" className="flex items-center gap-2">
            <StageIcon stage="alpha" size="sm" />
            <span>Alpha</span>
            {stageCounts.alpha.enabled > 0 && (
              <span className="text-xs bg-blue-100 text-blue-700 px-1.5 rounded-full">
                {stageCounts.alpha.enabled}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="beta" className="flex items-center gap-2">
            <StageIcon stage="beta" size="sm" />
            <span>Beta</span>
            {stageCounts.beta.enabled > 0 && (
              <span className="text-xs bg-indigo-100 text-indigo-700 px-1.5 rounded-full">
                {stageCounts.beta.enabled}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="lab">
          <StageSection
            stage="lab"
            features={featuresByStage.lab}
            isAutoEnrolled={autoEnrolled.lab}
            onToggle={handleToggle}
            onToggleAutoEnroll={handleToggleAutoEnroll}
            togglingKey={togglingKey}
            togglingAutoEnroll={togglingAutoEnroll}
          />
        </TabsContent>

        <TabsContent value="alpha">
          <StageSection
            stage="alpha"
            features={featuresByStage.alpha}
            isAutoEnrolled={autoEnrolled.alpha}
            onToggle={handleToggle}
            onToggleAutoEnroll={handleToggleAutoEnroll}
            togglingKey={togglingKey}
            togglingAutoEnroll={togglingAutoEnroll}
          />
        </TabsContent>

        <TabsContent value="beta">
          <StageSection
            stage="beta"
            features={featuresByStage.beta}
            isAutoEnrolled={autoEnrolled.beta}
            onToggle={handleToggle}
            onToggleAutoEnroll={handleToggleAutoEnroll}
            togglingKey={togglingKey}
            togglingAutoEnroll={togglingAutoEnroll}
          />
        </TabsContent>
      </Tabs>

      {toast && <Toast {...toast} />}
    </div>
  );
}
