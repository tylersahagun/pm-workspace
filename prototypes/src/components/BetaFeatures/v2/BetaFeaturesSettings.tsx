import * as React from 'react';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StageBadge } from './StageBadge';
import { BetaFeature, FeatureStage, STAGE_CONFIG, MOCK_FEATURES, getFeaturesByStage } from './types';

// ============================================
// Toast Component
// ============================================
interface ToastProps {
  message: string;
  description?: string;
  type?: 'success' | 'info';
  onDismiss: () => void;
}

function Toast({ message, description, type = 'success', onDismiss }: ToastProps) {
  React.useEffect(() => {
    const timer = setTimeout(onDismiss, 5000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
      <div className="bg-card border shadow-lg rounded-lg p-4 max-w-sm">
        <div className="flex items-start gap-3">
          <span className="flex-shrink-0 mt-0.5">{type === 'success' ? '✅' : 'ℹ️'}</span>
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
        'rounded-lg border p-4 transition-all duration-200',
        'hover:shadow-sm',
        feature.enabled && 'ring-1 ring-primary/20'
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <h3 className="font-medium truncate">{feature.name}</h3>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{feature.description}</p>
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
        <div className="mt-3 pt-3 border-t border-border/50">
          <p className="text-xs text-muted-foreground">
            <span className="text-primary">✓</span> Find it at: <span className="font-medium">{feature.location}</span>
          </p>
        </div>
      )}
    </div>
  );
}

// ============================================
// Enable All Toggle
// ============================================
interface EnableAllToggleProps {
  stage: FeatureStage;
  features: BetaFeature[];
  onToggleAll: (stage: FeatureStage, enabled: boolean) => void;
  isToggling?: boolean;
}

function EnableAllToggle({ stage, features, onToggleAll, isToggling }: EnableAllToggleProps) {
  const config = STAGE_CONFIG[stage];
  const enabledCount = features.filter((f) => f.enabled).length;
  const allEnabled = enabledCount === features.length && features.length > 0;
  const someEnabled = enabledCount > 0 && enabledCount < features.length;

  return (
    <div
      className={cn(
        'flex items-center justify-between p-4 rounded-lg border-2 border-dashed',
        config.borderColor,
        config.bgColor
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-lg text-xl',
            'bg-white/50'
          )}
        >
          {config.emoji}
        </div>
        <div>
          <p className="font-medium">Enable all {config.label} features</p>
          <p className="text-xs text-muted-foreground">
            {enabledCount} of {features.length} enabled
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {someEnabled && (
          <span className="text-xs text-muted-foreground">Partial</span>
        )}
        {isToggling ? (
          <div className="h-5 w-9 flex items-center justify-center">
            <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        ) : (
          <Switch
            checked={allEnabled}
            onCheckedChange={(checked) => onToggleAll(stage, checked)}
            aria-label={`${allEnabled ? 'Disable' : 'Enable'} all ${config.label} features`}
          />
        )}
      </div>
    </div>
  );
}

// ============================================
// Stage Tab Content
// ============================================
interface StageTabContentProps {
  stage: FeatureStage;
  features: BetaFeature[];
  onToggle: (key: string, enabled: boolean) => void;
  onToggleAll: (stage: FeatureStage, enabled: boolean) => void;
  togglingKey?: string | null;
  togglingAll?: FeatureStage | null;
}

function StageTabContent({
  stage,
  features,
  onToggle,
  onToggleAll,
  togglingKey,
  togglingAll,
}: StageTabContentProps) {
  const config = STAGE_CONFIG[stage];

  if (features.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">{config.emoji}</div>
        <h3 className="font-medium text-lg mb-2">No {config.label} features available</h3>
        <p className="text-muted-foreground text-sm max-w-sm mx-auto">
          Check back soon! We're always working on new features.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Stage description */}
      <div className={cn('p-3 rounded-lg text-sm', config.bgColor, config.textColor)}>
        <strong>{config.label}:</strong> {config.description}
      </div>

      {/* Enable All toggle */}
      <EnableAllToggle
        stage={stage}
        features={features}
        onToggleAll={onToggleAll}
        isToggling={togglingAll === stage}
      />

      {/* Feature list */}
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
// Main Component: Tabbed Settings
// ============================================
interface BetaFeaturesSettingsV2Props {
  features?: BetaFeature[];
  isLoading?: boolean;
  error?: string;
  defaultTab?: FeatureStage;
}

export function BetaFeaturesSettingsV2({
  features: initialFeatures = MOCK_FEATURES,
  isLoading = false,
  error,
  defaultTab = 'beta',
}: BetaFeaturesSettingsV2Props) {
  const [features, setFeatures] = React.useState(initialFeatures);
  const [togglingKey, setTogglingKey] = React.useState<string | null>(null);
  const [togglingAll, setTogglingAll] = React.useState<FeatureStage | null>(null);
  const [toast, setToast] = React.useState<ToastProps | null>(null);
  const [activeTab, setActiveTab] = React.useState<FeatureStage>(defaultTab);

  const featuresByStage = getFeaturesByStage(features);

  const handleToggle = async (key: string, enabled: boolean) => {
    setTogglingKey(key);
    await new Promise((resolve) => setTimeout(resolve, 400));

    setFeatures((prev) => prev.map((f) => (f.key === key ? { ...f, enabled } : f)));
    setTogglingKey(null);

    const feature = features.find((f) => f.key === key);
    setToast({
      message: enabled ? `${feature?.name} enabled` : `${feature?.name} disabled`,
      description: enabled
        ? `Look for it at ${feature?.location || 'in the app'}`
        : 'You can re-enable anytime',
      type: enabled ? 'success' : 'info',
      onDismiss: () => setToast(null),
    });
  };

  const handleToggleAll = async (stage: FeatureStage, enabled: boolean) => {
    setTogglingAll(stage);
    await new Promise((resolve) => setTimeout(resolve, 600));

    setFeatures((prev) => prev.map((f) => (f.stage === stage ? { ...f, enabled } : f)));
    setTogglingAll(null);

    const config = STAGE_CONFIG[stage];
    const count = featuresByStage[stage].length;
    setToast({
      message: enabled ? `All ${config.label} features enabled` : `All ${config.label} features disabled`,
      description: `${count} feature${count !== 1 ? 's' : ''} ${enabled ? 'activated' : 'deactivated'}`,
      type: enabled ? 'success' : 'info',
      onDismiss: () => setToast(null),
    });
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">⚠️</div>
        <h3 className="font-medium text-lg mb-2">Something went wrong</h3>
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
          <div className="h-10 w-full bg-muted rounded animate-pulse" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Count enabled per stage
  const counts = {
    lab: featuresByStage.lab.filter((f) => f.enabled).length,
    alpha: featuresByStage.alpha.filter((f) => f.enabled).length,
    beta: featuresByStage.beta.filter((f) => f.enabled).length,
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">🧪</span>
          <h2 className="text-xl font-semibold">Early Access Features</h2>
        </div>
        <p className="text-muted-foreground">
          Try new features before they're released. Features are organized by maturity level.
        </p>
      </div>

      {/* Tabbed Navigation */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as FeatureStage)}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="lab" className="flex items-center gap-2">
            <span>🧪</span>
            <span>Lab</span>
            {counts.lab > 0 && (
              <span className="text-xs bg-purple-100 text-purple-600 px-1.5 rounded-full">
                {counts.lab}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="alpha" className="flex items-center gap-2">
            <span>🔷</span>
            <span>Alpha</span>
            {counts.alpha > 0 && (
              <span className="text-xs bg-blue-100 text-blue-600 px-1.5 rounded-full">
                {counts.alpha}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="beta" className="flex items-center gap-2">
            <span>🟡</span>
            <span>Beta</span>
            {counts.beta > 0 && (
              <span className="text-xs bg-indigo-100 text-indigo-600 px-1.5 rounded-full">
                {counts.beta}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="lab">
          <StageTabContent
            stage="lab"
            features={featuresByStage.lab}
            onToggle={handleToggle}
            onToggleAll={handleToggleAll}
            togglingKey={togglingKey}
            togglingAll={togglingAll}
          />
        </TabsContent>

        <TabsContent value="alpha">
          <StageTabContent
            stage="alpha"
            features={featuresByStage.alpha}
            onToggle={handleToggle}
            onToggleAll={handleToggleAll}
            togglingKey={togglingKey}
            togglingAll={togglingAll}
          />
        </TabsContent>

        <TabsContent value="beta">
          <StageTabContent
            stage="beta"
            features={featuresByStage.beta}
            onToggle={handleToggle}
            onToggleAll={handleToggleAll}
            togglingKey={togglingKey}
            togglingAll={togglingAll}
          />
        </TabsContent>
      </Tabs>

      {toast && <Toast {...toast} />}
    </div>
  );
}

// ============================================
// Alternative: Sidebar Navigation Layout
// ============================================
export function BetaFeaturesSettingsSidebar({
  features: initialFeatures = MOCK_FEATURES,
}: BetaFeaturesSettingsV2Props) {
  const [features, setFeatures] = React.useState(initialFeatures);
  const [togglingKey, setTogglingKey] = React.useState<string | null>(null);
  const [togglingAll, setTogglingAll] = React.useState<FeatureStage | null>(null);
  const [toast, setToast] = React.useState<ToastProps | null>(null);
  const [activeStage, setActiveStage] = React.useState<FeatureStage>('beta');

  const featuresByStage = getFeaturesByStage(features);

  const handleToggle = async (key: string, enabled: boolean) => {
    setTogglingKey(key);
    await new Promise((resolve) => setTimeout(resolve, 400));
    setFeatures((prev) => prev.map((f) => (f.key === key ? { ...f, enabled } : f)));
    setTogglingKey(null);

    const feature = features.find((f) => f.key === key);
    setToast({
      message: enabled ? `${feature?.name} enabled` : `${feature?.name} disabled`,
      type: enabled ? 'success' : 'info',
      onDismiss: () => setToast(null),
    });
  };

  const handleToggleAll = async (stage: FeatureStage, enabled: boolean) => {
    setTogglingAll(stage);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setFeatures((prev) => prev.map((f) => (f.stage === stage ? { ...f, enabled } : f)));
    setTogglingAll(null);

    const config = STAGE_CONFIG[stage];
    setToast({
      message: enabled ? `All ${config.label} features enabled` : `All ${config.label} features disabled`,
      type: enabled ? 'success' : 'info',
      onDismiss: () => setToast(null),
    });
  };

  const stages: FeatureStage[] = ['lab', 'alpha', 'beta'];

  return (
    <div className="flex min-h-[600px] border rounded-lg overflow-hidden">
      {/* Sidebar */}
      <div className="w-56 border-r bg-muted/30 p-4">
        <h3 className="font-medium mb-4 px-2">Feature Stages</h3>
        <nav className="space-y-1">
          {stages.map((stage) => {
            const config = STAGE_CONFIG[stage];
            const count = featuresByStage[stage].length;
            const enabledCount = featuresByStage[stage].filter((f) => f.enabled).length;

            return (
              <button
                key={stage}
                onClick={() => setActiveStage(stage)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                  activeStage === stage
                    ? cn('bg-white shadow-sm', config.textColor)
                    : 'hover:bg-muted text-muted-foreground'
                )}
              >
                <span className="text-lg">{config.emoji}</span>
                <span className="flex-1 text-left font-medium">{config.label}</span>
                <span
                  className={cn(
                    'text-xs px-1.5 py-0.5 rounded-full',
                    enabledCount > 0 ? cn(config.bgColor, config.textColor) : 'bg-muted text-muted-foreground'
                  )}
                >
                  {enabledCount}/{count}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-auto">
        <StageTabContent
          stage={activeStage}
          features={featuresByStage[activeStage]}
          onToggle={handleToggle}
          onToggleAll={handleToggleAll}
          togglingKey={togglingKey}
          togglingAll={togglingAll}
        />
      </div>

      {toast && <Toast {...toast} />}
    </div>
  );
}
