import * as React from 'react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { FeatureStage, STAGE_CONFIG } from './types';

// ============================================
// Professional Stage Badge (no emojis)
// ============================================
interface StageBadgeProps {
  stage: FeatureStage;
  size?: 'xs' | 'sm' | 'md';
  showTooltip?: boolean;
  variant?: 'default' | 'outline' | 'solid';
  className?: string;
}

/**
 * Professional stage badge matching elephant-ai styling.
 * No emojis - uses text labels only.
 */
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
    solid: cn(
      stage === 'lab' && 'bg-purple-600 text-white',
      stage === 'alpha' && 'bg-blue-600 text-white',
      stage === 'beta' && 'bg-indigo-600 text-white'
    ),
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
// Stage Icon (for visual variety without emoji)
// ============================================
interface StageIconProps {
  stage: FeatureStage;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function StageIcon({ stage, size = 'md', className }: StageIconProps) {
  const config = STAGE_CONFIG[stage];

  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-lg',
        config.iconBgColor,
        sizeClasses[size],
        className
      )}
    >
      {stage === 'lab' && (
        <svg className={cn(iconSizes[size], config.textColor)} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      )}
      {stage === 'alpha' && (
        <svg className={cn(iconSizes[size], config.textColor)} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )}
      {stage === 'beta' && (
        <svg className={cn(iconSizes[size], config.textColor)} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )}
    </div>
  );
}

// ============================================
// Feature Indicator - For wrapping UI elements
// ============================================
interface FeatureIndicatorProps {
  stage: FeatureStage;
  children: React.ReactNode;
  position?: 'inline' | 'suffix' | 'corner';
  className?: string;
}

/**
 * Wrap any UI element with a stage indicator.
 * Professional styling without emojis.
 */
export function FeatureIndicator({
  stage,
  children,
  position = 'suffix',
  className,
}: FeatureIndicatorProps) {
  if (position === 'corner') {
    return (
      <div className={cn('relative inline-block', className)}>
        {children}
        <span className="absolute -top-1 -right-1 z-10">
          <StageBadge stage={stage} size="xs" variant="solid" showTooltip={false} />
        </span>
      </div>
    );
  }

  if (position === 'inline') {
    return (
      <span className={cn('inline-flex items-center gap-1', className)}>
        {children}
        <StageBadge stage={stage} size="xs" showTooltip={false} />
      </span>
    );
  }

  // suffix (default)
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      {children}
      <StageBadge stage={stage} size="sm" showTooltip={false} />
    </span>
  );
}

// ============================================
// New Feature Indicator
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
