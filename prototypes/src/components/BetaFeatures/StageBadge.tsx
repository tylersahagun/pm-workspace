import * as React from 'react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { FeatureStage, STAGE_CONFIG } from './types';

interface StageBadgeProps {
  stage: FeatureStage;
  size?: 'sm' | 'md' | 'lg';
  showEmoji?: boolean;
  showTooltip?: boolean;
  className?: string;
}

export function StageBadge({
  stage,
  size = 'md',
  showEmoji = true,
  showTooltip = true,
  className,
}: StageBadgeProps) {
  const config = STAGE_CONFIG[stage];

  const sizeClasses = {
    sm: 'px-1.5 py-0.5 text-[10px] gap-0.5',
    md: 'px-2 py-0.5 text-xs gap-1',
    lg: 'px-2.5 py-1 text-sm gap-1.5',
  };

  const badge = (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium transition-colors',
        config.bgColor,
        config.textColor,
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label={`${config.label} feature`}
    >
      {showEmoji && <span className="flex-shrink-0">{config.emoji}</span>}
      <span>{config.label}</span>
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
          <p className="font-medium">
            {config.emoji} {config.label} Feature
          </p>
          <p className="text-xs text-muted-foreground">{config.description}</p>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

// Variant for inline use (smaller, no tooltip by default)
export function StageBadgeInline({
  stage,
  className,
}: {
  stage: FeatureStage;
  className?: string;
}) {
  return <StageBadge stage={stage} size="sm" showTooltip={false} className={className} />;
}

// Variant for navigation items
export function StageBadgeNav({ stage }: { stage: FeatureStage }) {
  const config = STAGE_CONFIG[stage];
  return (
    <span
      className={cn(
        'ml-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full text-[10px]',
        config.bgColor
      )}
      title={`${config.label} feature`}
    >
      {config.emoji}
    </span>
  );
}
