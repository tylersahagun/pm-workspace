import * as React from 'react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { FeatureStage, FeatureScope, STAGE_CONFIG, SCOPE_CONFIG } from './types';

// ============================================
// Stage Badge
// ============================================
interface StageBadgeProps {
  stage: FeatureStage;
  size?: 'xs' | 'sm' | 'md';
  showTooltip?: boolean;
  variant?: 'default' | 'outline';
  className?: string;
}

export function StageBadge({
  stage,
  size = 'sm',
  showTooltip = true,
  variant = 'outline',
  className,
}: StageBadgeProps) {
  const config = STAGE_CONFIG[stage];

  const sizeClasses = {
    xs: 'px-1 py-0.5 text-[9px]',
    sm: 'px-1.5 py-0.5 text-[10px]',
    md: 'px-2 py-0.5 text-xs',
  };

  const variantClasses = {
    default: cn(config.bgColor, config.textColor),
    outline: cn(config.bgColor, config.textColor, 'border', config.borderColor),
  };

  const badge = (
    <span
      className={cn(
        'inline-flex items-center rounded font-semibold uppercase tracking-wider leading-none',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      role="status"
      aria-label={`${config.label} feature`}
    >
      {config.shortLabel}
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
          <p className="font-semibold">{config.label}</p>
          <p className="text-xs text-muted-foreground">{config.description}</p>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

// ============================================
// Scope Badge
// ============================================
interface ScopeBadgeProps {
  scope: FeatureScope;
  size?: 'sm' | 'md';
  showLabel?: boolean;
  className?: string;
}

export function ScopeBadge({ scope, size = 'sm', showLabel = true, className }: ScopeBadgeProps) {
  const config = SCOPE_CONFIG[scope];

  const sizeClasses = {
    sm: 'text-[10px]',
    md: 'text-xs',
  };

  const iconClasses = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className={cn(
            'inline-flex items-center gap-1 text-muted-foreground',
            sizeClasses[size],
            className
          )}
        >
          {config.icon === 'user' ? (
            <svg className={iconClasses[size]} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          ) : (
            <svg className={iconClasses[size]} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          )}
          {showLabel && <span>{config.label}</span>}
        </span>
      </TooltipTrigger>
      <TooltipContent>
        <p className="font-medium">{config.label}</p>
        <p className="text-xs text-muted-foreground">{config.description}</p>
      </TooltipContent>
    </Tooltip>
  );
}

// ============================================
// New Badge
// ============================================
export function NewBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider',
        'bg-emerald-50 text-emerald-700 border border-emerald-200',
        className
      )}
    >
      New
    </span>
  );
}

// ============================================
// Combined Feature Badge Row
// ============================================
interface FeatureBadgeRowProps {
  stage: FeatureStage;
  scope: FeatureScope;
  isNew?: boolean;
  className?: string;
}

export function FeatureBadgeRow({ stage, scope, isNew, className }: FeatureBadgeRowProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <StageBadge stage={stage} size="xs" showTooltip={false} />
      <ScopeBadge scope={scope} size="sm" />
      {isNew && <NewBadge />}
    </div>
  );
}
