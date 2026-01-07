import * as React from 'react';
import { cn } from '@/lib/utils';
import { FeatureCardConfirm, FeatureCardBalanced, FeatureCardLabs } from './BetaFeatureCard';
import { BetaFeature, MOCK_FEATURES } from './types';

// ============================================
// Toast Component (shared)
// ============================================
interface ToastProps {
  message: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  type?: 'success' | 'info';
  onDismiss: () => void;
}

function Toast({ message, description, action, type = 'success', onDismiss }: ToastProps) {
  React.useEffect(() => {
    const timer = setTimeout(onDismiss, 5000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
      <div className="bg-card border shadow-lg rounded-lg p-4 max-w-sm">
        <div className="flex items-start gap-3">
          <span className="flex-shrink-0 mt-0.5">
            {type === 'success' ? '✅' : 'ℹ️'}
          </span>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm">{message}</p>
            {description && (
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            )}
            {action && (
              <button
                onClick={action.onClick}
                className="text-xs text-primary hover:underline mt-2"
              >
                {action.label}
              </button>
            )}
          </div>
          <button
            onClick={onDismiss}
            className="flex-shrink-0 text-muted-foreground hover:text-foreground"
          >
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
// Empty State Component (shared)
// ============================================
function EmptyState() {
  return (
    <div className="text-center py-12">
      <div className="text-4xl mb-4">🧪</div>
      <h3 className="font-medium text-lg mb-2">No beta features available</h3>
      <p className="text-muted-foreground text-sm max-w-sm mx-auto">
        Check back soon! We're always working on new features for you to try.
      </p>
    </div>
  );
}

// ============================================
// Loading State Component (shared)
// ============================================
function LoadingState() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-lg border p-4 animate-pulse">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-5 w-16 bg-muted rounded-full" />
                <div className="h-5 w-32 bg-muted rounded" />
              </div>
              <div className="h-4 w-full bg-muted rounded" />
              <div className="h-4 w-2/3 bg-muted rounded mt-1" />
            </div>
            <div className="h-5 w-9 bg-muted rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================
// Error State Component (shared)
// ============================================
function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="text-center py-12">
      <div className="text-4xl mb-4">⚠️</div>
      <h3 className="font-medium text-lg mb-2">Something went wrong</h3>
      <p className="text-muted-foreground text-sm mb-4">{message}</p>
      <button
        onClick={onRetry}
        className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
      >
        Try again
      </button>
    </div>
  );
}

// ============================================
// OPTION A: Maximum Control Settings Panel
// ============================================
interface BetaFeaturesConfirmProps {
  features?: BetaFeature[];
  isLoading?: boolean;
  error?: string;
}

export function BetaFeaturesConfirm({
  features: initialFeatures = MOCK_FEATURES,
  isLoading = false,
  error,
}: BetaFeaturesConfirmProps) {
  const [features, setFeatures] = React.useState(initialFeatures);
  const [togglingKey, setTogglingKey] = React.useState<string | null>(null);
  const [toast, setToast] = React.useState<ToastProps | null>(null);

  const handleToggle = async (key: string, enabled: boolean) => {
    setTogglingKey(key);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    setFeatures((prev) =>
      prev.map((f) => (f.key === key ? { ...f, enabled } : f))
    );
    setTogglingKey(null);

    const feature = features.find((f) => f.key === key);
    setToast({
      message: enabled ? `${feature?.name} enabled` : `${feature?.name} disabled`,
      description: enabled
        ? `Look for the Beta badge in ${feature?.location || 'the app'}`
        : 'You can re-enable anytime',
      type: enabled ? 'success' : 'info',
      onDismiss: () => setToast(null),
    });
  };

  if (error) {
    return <ErrorState message={error} onRetry={() => {}} />;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">🧪</span>
          <h2 className="text-xl font-semibold">Beta Features</h2>
        </div>
        <p className="text-muted-foreground">
          Try new features before they're released to everyone. Beta features may change or be removed.
        </p>
        <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-md">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            <strong>⚠️ Important:</strong> Each beta feature requires confirmation before enabling. 
            This ensures you understand what you're opting into.
          </p>
        </div>
      </div>

      {/* Feature list */}
      {isLoading ? (
        <LoadingState />
      ) : features.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-3">
          {features.map((feature) => (
            <FeatureCardConfirm
              key={feature.key}
              feature={feature}
              onToggle={handleToggle}
              isToggling={togglingKey === feature.key}
            />
          ))}
        </div>
      )}

      {toast && <Toast {...toast} />}
    </div>
  );
}

// ============================================
// OPTION B: Balanced Settings Panel (RECOMMENDED)
// ============================================
interface BetaFeaturesBalancedProps {
  features?: BetaFeature[];
  isLoading?: boolean;
  error?: string;
}

export function BetaFeaturesBalanced({
  features: initialFeatures = MOCK_FEATURES,
  isLoading = false,
  error,
}: BetaFeaturesBalancedProps) {
  const [features, setFeatures] = React.useState(initialFeatures);
  const [togglingKey, setTogglingKey] = React.useState<string | null>(null);
  const [toast, setToast] = React.useState<ToastProps | null>(null);

  const handleToggle = async (key: string, enabled: boolean) => {
    setTogglingKey(key);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    setFeatures((prev) =>
      prev.map((f) => (f.key === key ? { ...f, enabled } : f))
    );
    setTogglingKey(null);

    const feature = features.find((f) => f.key === key);
    setToast({
      message: enabled ? `${feature?.name} enabled` : `${feature?.name} disabled`,
      description: enabled
        ? `Look for the Beta badge in ${feature?.location || 'the app'}`
        : 'You can re-enable anytime in Settings → Beta Features',
      type: enabled ? 'success' : 'info',
      action: enabled && feature?.location
        ? { label: 'View feature', onClick: () => console.log('Navigate to', feature.location) }
        : undefined,
      onDismiss: () => setToast(null),
    });
  };

  const enabledCount = features.filter((f) => f.enabled).length;

  if (error) {
    return <ErrorState message={error} onRetry={() => {}} />;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🧪</span>
            <h2 className="text-xl font-semibold">Beta Features</h2>
          </div>
          {enabledCount > 0 && (
            <span className="text-sm text-muted-foreground">
              {enabledCount} enabled
            </span>
          )}
        </div>
        <p className="text-muted-foreground">
          Try new features before they're released to everyone. Beta features may change or be removed.
        </p>
      </div>

      {/* Feature list */}
      {isLoading ? (
        <LoadingState />
      ) : features.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-3">
          {features.map((feature) => (
            <FeatureCardBalanced
              key={feature.key}
              feature={feature}
              onToggle={handleToggle}
              isToggling={togglingKey === feature.key}
            />
          ))}
        </div>
      )}

      {toast && <Toast {...toast} />}
    </div>
  );
}

// ============================================
// OPTION C: Labs Explorer Settings Panel
// ============================================
interface BetaFeaturesLabsProps {
  features?: BetaFeature[];
  isLoading?: boolean;
  error?: string;
}

export function BetaFeaturesLabs({
  features: initialFeatures = MOCK_FEATURES,
  isLoading = false,
  error,
}: BetaFeaturesLabsProps) {
  const [features, setFeatures] = React.useState(initialFeatures);
  const [togglingKey, setTogglingKey] = React.useState<string | null>(null);
  const [toast, setToast] = React.useState<ToastProps | null>(null);

  const handleToggle = async (key: string, enabled: boolean) => {
    setTogglingKey(key);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 600));
    
    setFeatures((prev) =>
      prev.map((f) => (f.key === key ? { ...f, enabled } : f))
    );
    setTogglingKey(null);

    const feature = features.find((f) => f.key === key);
    setToast({
      message: enabled ? `🎉 ${feature?.name} activated!` : `${feature?.name} deactivated`,
      description: enabled
        ? `You're now an early tester! Find it at ${feature?.location || 'in the app'}`
        : 'Thanks for trying it out!',
      type: enabled ? 'success' : 'info',
      onDismiss: () => setToast(null),
    });
  };

  const enabledCount = features.filter((f) => f.enabled).length;
  const totalCount = features.length;

  if (error) {
    return <ErrorState message={error} onRetry={() => {}} />;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Hero Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 text-3xl mb-4 shadow-lg">
          🧪
        </div>
        <h2 className="text-2xl font-bold mb-2">AskElephant Labs</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Be the first to try our newest experiments. Your feedback shapes the future of AskElephant.
        </p>
        
        {/* Progress indicator */}
        <div className="mt-6 inline-flex items-center gap-3 px-4 py-2 bg-muted/50 rounded-full">
          <div className="flex">
            {Array.from({ length: totalCount }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  'h-2 w-2 rounded-full -ml-0.5 first:ml-0 transition-colors',
                  i < enabledCount ? 'bg-primary' : 'bg-muted-foreground/30'
                )}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            {enabledCount} of {totalCount} experiments active
          </span>
        </div>
      </div>

      {/* Feature grid */}
      {isLoading ? (
        <LoadingState />
      ) : features.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {features.map((feature) => (
            <FeatureCardLabs
              key={feature.key}
              feature={feature}
              onToggle={handleToggle}
              isToggling={togglingKey === feature.key}
            />
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-xs text-muted-foreground">
          Lab experiments may change significantly or be discontinued.
          <br />
          Your participation helps us build better features for everyone.
        </p>
      </div>

      {toast && <Toast {...toast} />}
    </div>
  );
}
