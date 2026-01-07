import * as React from 'react';
import {
  ChevronDown,
  ChevronRight,
  Trash2,
  BookOpen,
  Link2,
  Upload,
  X,
  Hash,
  Calendar,
  Type,
  List,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { HubSpotProperty, PropertyConfig, WriteMode, HubSpotPropertyType } from './types';

interface FieldConfigCardProps {
  property: HubSpotProperty;
  config: PropertyConfig;
  onConfigChange: (config: PropertyConfig) => void;
  onRemove: () => void;
  availableProperties: HubSpotProperty[];
  isExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
}

const WRITE_MODE_OPTIONS: { value: WriteMode; label: string; description: string }[] = [
  { value: 'overwrite', label: 'Overwrite', description: 'Replace existing value' },
  { value: 'append', label: 'Append', description: 'Add to existing value' },
  { value: 'append_if_new', label: 'Append if different', description: 'Only add if not already present' },
];

const getPropertyTypeIcon = (type: HubSpotPropertyType) => {
  switch (type) {
    case 'number':
      return <Hash className="size-4 text-muted-foreground" />;
    case 'date':
    case 'datetime':
      return <Calendar className="size-4 text-muted-foreground" />;
    case 'enumeration':
      return <List className="size-4 text-muted-foreground" />;
    default:
      return <Type className="size-4 text-muted-foreground" />;
  }
};

export function FieldConfigCard({
  property,
  config,
  onConfigChange,
  onRemove,
  availableProperties,
  isExpanded: controlledExpanded,
  onExpandedChange,
}: FieldConfigCardProps) {
  const [internalExpanded, setInternalExpanded] = React.useState(true);
  const isExpanded = controlledExpanded ?? internalExpanded;

  const handleExpandedChange = (expanded: boolean) => {
    if (onExpandedChange) {
      onExpandedChange(expanded);
    } else {
      setInternalExpanded(expanded);
    }
  };

  const updateConfig = (updates: Partial<PropertyConfig>) => {
    onConfigChange({ ...config, ...updates });
  };

  // Get available dependencies (all properties except this one)
  const availableDependencies = availableProperties.filter(
    (p) => p.name !== property.name
  );

  const toggleDependency = (propName: string) => {
    const currentDeps = config.dependencies;
    if (currentDeps.includes(propName)) {
      updateConfig({ dependencies: currentDeps.filter((d) => d !== propName) });
    } else {
      updateConfig({ dependencies: [...currentDeps, propName] });
    }
  };

  return (
    <div className="border rounded-lg bg-card overflow-hidden">
      {/* Header - Always visible */}
      <div
        className={cn(
          'flex items-center justify-between px-4 py-3 cursor-pointer transition-colors',
          'hover:bg-accent/50',
          isExpanded && 'border-b'
        )}
        onClick={() => handleExpandedChange(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          {isExpanded ? (
            <ChevronDown className="size-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="size-4 text-muted-foreground" />
          )}
          {getPropertyTypeIcon(property.type)}
          <div>
            <span className="font-medium">{property.label}</span>
            {!isExpanded && config.instruction && (
              <span className="ml-2 text-sm text-muted-foreground truncate max-w-xs">
                — {config.instruction.substring(0, 50)}
                {config.instruction.length > 50 && '...'}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Status indicators when collapsed */}
          {!isExpanded && (
            <div className="flex items-center gap-1.5">
              {config.readBeforeWrite && (
                <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded">
                  Read first
                </span>
              )}
              {config.dependencies.length > 0 && (
                <span className="text-xs px-1.5 py-0.5 bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 rounded">
                  {config.dependencies.length} deps
                </span>
              )}
              {!config.syncToHubSpot && (
                <span className="text-xs px-1.5 py-0.5 bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300 rounded">
                  Local only
                </span>
              )}
            </div>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-4 space-y-5">
          {/* Instructions */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              Instructions
              <span className="text-xs text-muted-foreground font-normal">
                What should the AI extract or compute?
              </span>
            </label>
            <textarea
              value={config.instruction}
              onChange={(e) => updateConfig({ instruction: e.target.value })}
              placeholder={`e.g., "Based on the conversation, extract the expected close date and any timeline discussed..."`}
              className={cn(
                'w-full min-h-24 px-3 py-2 text-sm rounded-md border border-input',
                'bg-background resize-y',
                'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
              )}
            />
          </div>

          {/* Read Before Write Toggle */}
          <div className="flex items-start gap-3 p-3 rounded-lg border bg-muted/30">
            <button
              onClick={() => updateConfig({ readBeforeWrite: !config.readBeforeWrite })}
              className={cn(
                'mt-0.5 relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors',
                config.readBeforeWrite ? 'bg-primary' : 'bg-input'
              )}
            >
              <span
                className={cn(
                  'pointer-events-none block size-4 rounded-full bg-background shadow-lg ring-0 transition-transform',
                  config.readBeforeWrite ? 'translate-x-4' : 'translate-x-0'
                )}
              />
            </button>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <BookOpen className="size-4 text-muted-foreground" />
                <span className="text-sm font-medium">Read before write</span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Read the current value in HubSpot and factor it into the update
              </p>
            </div>
          </div>

          {/* Dependencies */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Link2 className="size-4 text-muted-foreground" />
              Dependencies
              <span className="text-xs text-muted-foreground font-normal">
                Read these properties first
              </span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {config.dependencies.map((depName) => {
                const depProp = availableProperties.find((p) => p.name === depName);
                return (
                  <span
                    key={depName}
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-primary/10 text-primary rounded-md"
                  >
                    {depProp?.label || depName}
                    <button
                      onClick={() => toggleDependency(depName)}
                      className="hover:text-destructive"
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                );
              })}
              {/* Add dependency dropdown */}
              <DependencyDropdown
                availableProperties={availableDependencies}
                selectedDependencies={config.dependencies}
                onToggle={toggleDependency}
              />
            </div>
          </div>

          {/* Write Mode */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Write Mode</label>
            <div className="flex gap-2">
              {WRITE_MODE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateConfig({ writeMode: option.value })}
                  className={cn(
                    'flex-1 px-3 py-2 text-sm rounded-md border transition-colors text-left',
                    config.writeMode === option.value
                      ? 'bg-primary/10 border-primary text-primary'
                      : 'bg-background border-input hover:bg-accent'
                  )}
                >
                  <div className="font-medium">{option.label}</div>
                  <div className="text-xs text-muted-foreground">{option.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Sync to HubSpot Toggle */}
          <div className="flex items-start gap-3 p-3 rounded-lg border bg-muted/30">
            <button
              onClick={() => updateConfig({ syncToHubSpot: !config.syncToHubSpot })}
              className={cn(
                'mt-0.5 relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors',
                config.syncToHubSpot ? 'bg-primary' : 'bg-input'
              )}
            >
              <span
                className={cn(
                  'pointer-events-none block size-4 rounded-full bg-background shadow-lg ring-0 transition-transform',
                  config.syncToHubSpot ? 'translate-x-4' : 'translate-x-0'
                )}
              />
            </button>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Upload className="size-4 text-muted-foreground" />
                <span className="text-sm font-medium">Sync to HubSpot</span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {config.syncToHubSpot
                  ? 'This value will be pushed to HubSpot after processing'
                  : 'Computed locally only — use as input for other fields'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Dependency dropdown sub-component
function DependencyDropdown({
  availableProperties,
  selectedDependencies,
  onToggle,
}: {
  availableProperties: HubSpotProperty[];
  selectedDependencies: string[];
  onToggle: (propName: string) => void;
}) {
  const [isOpen, setIsOpen] = React.useState(false);

  const unselectedProps = availableProperties.filter(
    (p) => !selectedDependencies.includes(p.name)
  );

  if (unselectedProps.length === 0) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1 px-2 py-1 text-xs border border-dashed rounded-md text-muted-foreground hover:text-foreground hover:border-foreground/50 transition-colors"
      >
        + Add
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute z-50 top-full left-0 mt-1 w-48 bg-popover border rounded-md shadow-lg max-h-48 overflow-y-auto">
            {unselectedProps.map((prop) => (
              <button
                key={prop.name}
                onClick={() => {
                  onToggle(prop.name);
                  // Keep open for multi-select
                }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left hover:bg-accent transition-colors"
              >
                {getPropertyTypeIcon(prop.type)}
                {prop.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

