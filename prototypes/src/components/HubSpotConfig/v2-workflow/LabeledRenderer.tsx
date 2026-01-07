import React from 'react';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * LabeledRenderer - Matches the exact pattern from web/src/components/workflows/form-renderers/labeled-renderer.tsx
 * This provides consistent form field styling across all workflow node configurations.
 */
interface LabeledRendererProps {
  children: React.ReactNode;
  label?: string;
  labelHint?: React.ReactNode;
  description?: string;
  errors?: string;
  className?: string;
  additionalButtons?: React.ReactNode;
}

export const LabeledRenderer: React.FC<LabeledRendererProps> = ({
  children,
  label,
  labelHint,
  description,
  errors,
  className,
  additionalButtons,
}) => {
  return (
    <div className={cn('flex flex-col gap-2 pb-6', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Label className="font-normal">{label}</Label>
          {labelHint && <span className="text-xs text-muted-foreground">{labelHint}</span>}
          {description && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="size-4 text-muted-foreground hover:text-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs text-muted-foreground">{description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        {additionalButtons}
      </div>
      {children}
      {errors && (
        <div>
          <span className="text-sm text-red-500">{errors}</span>
        </div>
      )}
    </div>
  );
};

export default LabeledRenderer;

