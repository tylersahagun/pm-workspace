import * as React from 'react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { FeatureStage, STAGE_CONFIG } from './types';

// ============================================
// PostHog-Style Inline Badge (matches elephant-ai Badge)
// ============================================
interface StageBadgeProps {
  stage: FeatureStage;
  size?: 'sm' | 'md';
  showTooltip?: boolean;
  variant?: 'default' | 'outline' | 'posthog';
  className?: string;
}

/**
 * Stage badge component matching elephant-ai Badge styling.
 * 
 * Variants:
 * - default: Filled background
 * - outline: Outlined with colored border (matches existing BetaBadge)
 * - posthog: Uppercase, compact style like PostHog's BETA badges
 */
export function StageBadge({
  stage,
  size = 'md',
  showTooltip = true,
  variant = 'outline',
  className,
}: StageBadgeProps) {
  const config = STAGE_CONFIG[stage];

  const sizeClasses = {
    sm: 'px-1.5 py-0.5 text-[10px]',
    md: 'px-2 py-0.5 text-xs',
  };

  const variantClasses = {
    default: cn(config.bgColor, config.textColor),
    outline: cn(config.bgColor, config.textColor, 'border', config.borderColor),
    posthog: cn(config.bgColor, config.textColor, 'border', config.borderColor, 'uppercase tracking-wide font-semibold'),
  };

  const badge = (
    <span
      className={cn(
        'inline-flex items-center rounded-md font-medium leading-none transition-colors',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      role="status"
      aria-label={`${config.label} feature`}
    >
      {variant === 'posthog' ? config.shortLabel : config.label}
    </span>
  );

  if (!showTooltip) {
    return badge;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{badge}</TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <div className="space-y-1">
          <p className="font-medium">{config.label} Feature</p>
          <p className="text-xs text-muted-foreground">{config.description}</p>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

// ============================================
// Feature Wrapper - Wrap any component with stage badge
// ============================================
interface FeatureWrapperProps {
  stage: FeatureStage;
  children: React.ReactNode;
  badgePosition?: 'inline' | 'top-right' | 'after';
  className?: string;
}

/**
 * Wrap any UI component with a stage badge to indicate feature maturity.
 * Use this to decorate navigation items, buttons, cards, etc.
 * 
 * Similar to how PostHog shows BETA badges next to feature names.
 */
export function FeatureWrapper({
  stage,
  children,
  badgePosition = 'inline',
  className,
}: FeatureWrapperProps) {
  const config = STAGE_CONFIG[stage];

  if (badgePosition === 'top-right') {
    return (
      <div className={cn('relative', className)}>
        {children}
        <span className="absolute -top-1 -right-1">
          <StageBadge stage={stage} size="sm" variant="posthog" showTooltip={false} />
        </span>
      </div>
    );
  }

  if (badgePosition === 'after') {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        {children}
        <StageBadge stage={stage} size="sm" variant="posthog" showTooltip={false} />
      </div>
    );
  }

  // inline (default) - badge appears right next to text
  return (
    <span className={cn('inline-flex items-center gap-1.5', className)}>
      {children}
      <StageBadge stage={stage} size="sm" variant="posthog" showTooltip={false} />
    </span>
  );
}

// ============================================
// Navigation Badge - For sidebar items
// ============================================
interface NavBadgeProps {
  stage: FeatureStage;
}

/**
 * Compact badge for navigation items, matching elephant-ai nav styling.
 */
export function NavBadge({ stage }: NavBadgeProps) {
  return (
    <StageBadge 
      stage={stage} 
      size="sm" 
      variant="outline" 
      showTooltip={false}
      className="mt-0.5"
    />
  );
}

// ============================================
// Page Header Badge - For content headers
// ============================================
interface HeaderBadgeProps {
  stage: FeatureStage;
}

/**
 * Badge for page/content headers, matching elephant-ai ContentHeader styling.
 */
export function HeaderBadge({ stage }: HeaderBadgeProps) {
  return (
    <StageBadge 
      stage={stage} 
      size="md" 
      variant="outline" 
      showTooltip={true}
      className="mt-0.5"
    />
  );
}
