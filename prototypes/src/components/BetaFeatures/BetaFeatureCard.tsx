import * as React from 'react';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';
import { StageBadge } from './StageBadge';
import { BetaFeature, STAGE_CONFIG } from './types';

// ============================================
// OPTION A: Maximum Control (Confirmation Required)
// ============================================
interface FeatureCardConfirmProps {
  feature: BetaFeature;
  onToggle: (key: string, enabled: boolean) => void;
  isToggling?: boolean;
  onLearnMore?: (key: string) => void;
}

export function FeatureCardConfirm({
  feature,
  onToggle,
  isToggling,
  onLearnMore,
}: FeatureCardConfirmProps) {
  const [showConfirm, setShowConfirm] = React.useState(false);
  const config = STAGE_CONFIG[feature.stage];

  const handleToggleClick = () => {
    if (!feature.enabled) {
      setShowConfirm(true);
    } else {
      onToggle(feature.key, false);
    }
  };

  const handleConfirm = () => {
    setShowConfirm(false);
    onToggle(feature.key, true);
  };

  return (
    <div
      className={cn(
        'rounded-lg border p-4 transition-all',
        feature.enabled ? config.borderColor : 'border-border',
        feature.enabled ? config.bgColor : 'bg-card'
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <StageBadge stage={feature.stage} size="sm" />
            <h3 className="font-medium text-sm truncate">{feature.name}</h3>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">{feature.description}</p>
          {feature.kbArticle && (
            <button
              onClick={() => onLearnMore?.(feature.key)}
              className="text-xs text-primary hover:underline mt-2"
            >
              Learn more →
            </button>
          )}
        </div>

        <div className="flex-shrink-0">
          {isToggling ? (
            <div className="h-5 w-9 flex items-center justify-center">
              <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
            </div>
          ) : (
            <Switch
              checked={feature.enabled}
              onCheckedChange={handleToggleClick}
              aria-label={`${feature.enabled ? 'Disable' : 'Enable'} ${feature.name}`}
            />
          )}
        </div>
      </div>

      {/* Confirmation dialog */}
      {showConfirm && (
        <div className="mt-4 p-3 bg-muted/50 rounded-md border border-border">
          <p className="text-sm font-medium mb-2">Enable {feature.name}?</p>
          <p className="text-xs text-muted-foreground mb-3">{config.description}</p>
          <div className="flex gap-2">
            <button
              onClick={handleConfirm}
              className="px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Enable {config.label} Feature
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              className="px-3 py-1.5 text-xs font-medium bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// OPTION B: Balanced (Instant Toggle) - RECOMMENDED
// ============================================
interface FeatureCardBalancedProps {
  feature: BetaFeature;
  onToggle: (key: string, enabled: boolean) => void;
  isToggling?: boolean;
  onLearnMore?: (key: string) => void;
}

export function FeatureCardBalanced({
  feature,
  onToggle,
  isToggling,
  onLearnMore,
}: FeatureCardBalancedProps) {
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
            <StageBadge stage={feature.stage} />
            <h3 className="font-medium truncate">{feature.name}</h3>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{feature.description}</p>
          {feature.kbArticle && (
            <button
              onClick={() => onLearnMore?.(feature.key)}
              className="text-xs text-primary hover:underline inline-flex items-center gap-1"
            >
              Learn more
              <svg
                className="w-3 h-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
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

      {/* Show location hint when enabled */}
      {feature.enabled && feature.location && (
        <div className="mt-3 pt-3 border-t border-border/50">
          <p className="text-xs text-muted-foreground">
            <span className="text-primary">✓</span> Find it at:{' '}
            <span className="font-medium">{feature.location}</span>
          </p>
        </div>
      )}
    </div>
  );
}

// ============================================
// OPTION C: Labs Explorer (Discovery-Focused)
// ============================================
interface FeatureCardLabsProps {
  feature: BetaFeature;
  onToggle: (key: string, enabled: boolean) => void;
  isToggling?: boolean;
  onLearnMore?: (key: string) => void;
}

export function FeatureCardLabs({
  feature,
  onToggle,
  isToggling,
  onLearnMore,
}: FeatureCardLabsProps) {
  const config = STAGE_CONFIG[feature.stage];
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div
      className={cn(
        'group relative rounded-xl border-2 p-5 transition-all duration-300',
        'cursor-pointer',
        feature.enabled
          ? cn(config.borderColor, config.bgColor)
          : 'border-dashed border-border hover:border-solid hover:border-primary/30 hover:bg-muted/30'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => !isToggling && onToggle(feature.key, !feature.enabled)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (!isToggling) onToggle(feature.key, !feature.enabled);
        }
      }}
      aria-pressed={feature.enabled}
      aria-label={`${feature.name} - ${feature.enabled ? 'Enabled' : 'Click to enable'}`}
    >
      {/* Enabled indicator */}
      {feature.enabled && (
        <div className="absolute -top-2 -right-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
            ✓
          </span>
        </div>
      )}

      <div className="flex items-start gap-4">
        {/* Feature icon/emoji */}
        <div
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-lg text-2xl transition-transform duration-200',
            config.bgColor,
            isHovered && !feature.enabled && 'scale-110'
          )}
        >
          {config.emoji}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold">{feature.name}</h3>
            <StageBadge stage={feature.stage} size="sm" showTooltip={false} />
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">{feature.description}</p>
        </div>
      </div>

      {/* Hover state - show action */}
      <div
        className={cn(
          'mt-4 flex items-center justify-between transition-opacity duration-200',
          isHovered || feature.enabled ? 'opacity-100' : 'opacity-0'
        )}
      >
        {feature.enabled ? (
          <span className="text-xs text-muted-foreground">Click to disable</span>
        ) : (
          <span className="text-xs text-primary font-medium">Click to try it out →</span>
        )}
        
        {feature.kbArticle && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onLearnMore?.(feature.key);
            }}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Learn more
          </button>
        )}
      </div>

      {/* Loading overlay */}
      {isToggling && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-xl">
          <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      )}
    </div>
  );
}
