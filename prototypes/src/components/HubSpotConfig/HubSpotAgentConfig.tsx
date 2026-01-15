import * as React from 'react';
import { Settings, FileText, ShieldCheck, Link2, ClipboardList } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PropertySelector } from './PropertySelector';
import { FieldConfigCard } from './FieldConfigCard';
import type {
  HubSpotAgentNodeConfig,
  HubSpotObjectType,
  HubSpotProperty,
  PropertyConfig,
} from './types';
import { createDefaultPropertyConfig } from './types';

interface HubSpotAgentConfigProps {
  config: HubSpotAgentNodeConfig;
  onConfigChange: (config: HubSpotAgentNodeConfig) => void;
  propertiesByObjectType: Record<HubSpotObjectType, HubSpotProperty[]>;
  isLoading?: boolean;
}

const MATCH_SIGNAL_OPTIONS = [
  { value: 'company_domain', label: 'Company domain' },
  { value: 'contact_email', label: 'Contact email' },
  { value: 'deal_name', label: 'Deal name' },
  { value: 'meeting_title', label: 'Meeting title' },
];

export function HubSpotAgentConfig({
  config,
  onConfigChange,
  propertiesByObjectType,
  isLoading = false,
}: HubSpotAgentConfigProps) {
  const availableProperties = propertiesByObjectType[config.objectType] || [];

  const updateConfig = (updates: Partial<HubSpotAgentNodeConfig>) => {
    onConfigChange({ ...config, ...updates });
  };

  const handleObjectTypeChange = (objectType: HubSpotObjectType) => {
    // When object type changes, clear properties (they're no longer valid)
    updateConfig({
      objectType,
      properties: [],
      customObjectLabel: objectType === 'custom' ? config.customObjectLabel : undefined,
    });
  };

  const handlePropertySelectionChange = (propertyNames: string[]) => {
    // Keep existing configs for properties that are still selected
    const existingConfigs = config.properties.filter((p) =>
      propertyNames.includes(p.propertyName)
    );

    // Add new configs for newly selected properties
    const existingPropertyNames = existingConfigs.map((p) => p.propertyName);
    const newConfigs = propertyNames
      .filter((name) => !existingPropertyNames.includes(name))
      .map((name) => createDefaultPropertyConfig(name));

    // Maintain selection order
    const orderedConfigs = propertyNames.map(
      (name) =>
        existingConfigs.find((c) => c.propertyName === name) ||
        newConfigs.find((c) => c.propertyName === name)!
    );

    updateConfig({ properties: orderedConfigs });
  };

  const handlePropertyConfigChange = (index: number, newConfig: PropertyConfig) => {
    const newProperties = [...config.properties];
    newProperties[index] = newConfig;
    updateConfig({ properties: newProperties });
  };

  const moveProperty = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= config.properties.length) return;
    const newProperties = [...config.properties];
    const [moved] = newProperties.splice(fromIndex, 1);
    newProperties.splice(toIndex, 0, moved);
    updateConfig({ properties: newProperties });
  };

  const handleRemoveProperty = (index: number) => {
    const newProperties = config.properties.filter((_, i) => i !== index);
    updateConfig({ properties: newProperties });
  };

  const selectedPropertyNames = config.properties.map((p) => p.propertyName);
  const matchSignals = config.matchSignals ?? [];
  const createRequiredFields = config.createRequiredFields ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b">
        <div className="flex items-center gap-2 mb-1">
          <div className="size-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
            <svg
              className="size-5 text-white"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M18.164 9.418c-.458 0-.87.19-1.163.498V6.883c0-.64-.52-1.16-1.16-1.16h-3.095c0-.64-.52-1.16-1.16-1.16H9.418C8.086 4.563 7 5.65 7 6.982v.641H5.84c-.64 0-1.16.52-1.16 1.16v3.096c-.308-.309-.72-.499-1.178-.499-.917 0-1.66.743-1.66 1.66 0 .918.743 1.66 1.66 1.66.458 0 .87-.19 1.178-.498v3.096c0 .64.52 1.16 1.16 1.16H7v.64c0 1.333 1.086 2.42 2.418 2.42h2.168c.64 0 1.16-.52 1.16-1.16h3.095c.64 0 1.16-.52 1.16-1.16v-3.096c.293.308.705.498 1.163.498.917 0 1.66-.743 1.66-1.66 0-.917-.743-1.66-1.66-1.66z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold">HubSpot Agent Configuration</h2>
            <p className="text-sm text-muted-foreground">
              Configure which properties to update, how to match objects, and when to review
            </p>
          </div>
        </div>
      </div>

      {/* Context Source */}
      <div className="space-y-3">
        <label className="text-sm font-medium flex items-center gap-2">
          <FileText className="size-4 text-muted-foreground" />
          Context Source
        </label>
        <div className="grid gap-2 sm:grid-cols-3">
          {[
            { value: 'latest_call', label: 'Latest call' },
            { value: 'selected_meeting', label: 'Select a meeting' },
            { value: 'pasted_transcript', label: 'Paste transcript' },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => updateConfig({ contextSource: option.value })}
              className={cn(
                'px-3 py-2 text-sm rounded-md border transition-colors text-left',
                config.contextSource === option.value
                  ? 'bg-primary/10 border-primary text-primary'
                  : 'bg-background border-input hover:bg-accent'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
        {config.contextSource === 'pasted_transcript' && (
          <textarea
            value={config.contextTranscript || ''}
            onChange={(e) => updateConfig({ contextTranscript: e.target.value })}
            placeholder="Paste a transcript to test configuration without a live meeting..."
            className={cn(
              'w-full min-h-24 px-3 py-2 text-sm rounded-md border border-input',
              'bg-background resize-y',
              'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
            )}
          />
        )}
      </div>

      {/* Property Selector */}
      <PropertySelector
        availableProperties={availableProperties}
        selectedProperties={selectedPropertyNames}
        onSelectionChange={handlePropertySelectionChange}
        objectType={config.objectType}
        onObjectTypeChange={handleObjectTypeChange}
        isLoading={isLoading}
      />

      {config.objectType === 'custom' && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Custom object name</label>
          <input
            value={config.customObjectLabel || ''}
            onChange={(e) => updateConfig({ customObjectLabel: e.target.value })}
            placeholder="e.g., Renewal, Implementation, Partner Deal"
            className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          />
        </div>
      )}

      {/* Association & Matching */}
      <div className="space-y-3 border rounded-lg p-4 bg-card">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Link2 className="size-4 text-muted-foreground" />
          Association & Matching
        </div>
        <p className="text-xs text-muted-foreground">
          Choose how AskElephant finds the right HubSpot record before updating fields.
        </p>
        <div className="flex flex-wrap gap-2">
          {MATCH_SIGNAL_OPTIONS.map((signal) => {
            const isSelected = matchSignals.includes(signal.value);
            return (
              <button
                key={signal.value}
                onClick={() =>
                  updateConfig({
                    matchSignals: isSelected
                      ? matchSignals.filter((value) => value !== signal.value)
                      : [...matchSignals, signal.value],
                  })
                }
                className={cn(
                  'px-2.5 py-1 text-xs rounded-md border transition-colors',
                  isSelected
                    ? 'bg-primary/10 border-primary text-primary'
                    : 'bg-background border-input hover:bg-accent'
                )}
              >
                {signal.label}
              </button>
            );
          })}
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">If no match found</label>
            <div className="flex gap-2">
              {[
                { value: 'skip', label: 'Skip update' },
                { value: 'create', label: 'Create new object' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateConfig({ noMatchBehavior: option.value })}
                  className={cn(
                    'flex-1 px-2 py-1.5 text-xs rounded-md border transition-colors',
                    config.noMatchBehavior === option.value
                      ? 'bg-primary/10 border-primary text-primary'
                      : 'bg-background border-input hover:bg-accent'
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">
              Required fields for create
            </label>
            <input
              value={createRequiredFields.join(', ')}
              onChange={(e) =>
                updateConfig({
                  createRequiredFields: e.target.value
                    .split(',')
                    .map((value) => value.trim())
                    .filter(Boolean),
                })
              }
              placeholder="e.g., dealname, pipeline, amount"
              className="w-full px-2 py-1.5 text-xs rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
          </div>
        </div>
      </div>

      {/* Sync Mode */}
      <div className="space-y-3 border rounded-lg p-4 bg-card">
        <div className="flex items-center gap-2 text-sm font-medium">
          <ShieldCheck className="size-4 text-muted-foreground" />
          Sync Mode
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {[
            {
              value: 'auto',
              label: 'Just do it',
              description: 'Sync automatically. Undo available after each update.',
            },
            {
              value: 'review',
              label: 'Review first',
              description: 'Show proposed changes and require approval.',
            },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => updateConfig({ approvalMode: option.value })}
              className={cn(
                'px-3 py-2 text-sm rounded-md border transition-colors text-left',
                config.approvalMode === option.value
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

      {/* Run Condition */}
      <div className="space-y-2">
        <label className="text-sm font-medium flex items-center gap-2">
          <ClipboardList className="size-4 text-muted-foreground" />
          Run condition (optional)
        </label>
        <textarea
          value={config.runCondition || ''}
          onChange={(e) => updateConfig({ runCondition: e.target.value })}
          placeholder="e.g., Only run if Deal Stage is not Closed Won or if Amount > $1,000"
          className={cn(
            'w-full min-h-20 px-3 py-2 text-sm rounded-md border border-input',
            'bg-background resize-y',
            'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
          )}
        />
      </div>

      {/* Property Configurations */}
      {config.properties.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Property Configurations</h3>
            <span className="text-xs text-muted-foreground">
              {config.properties.length} propert{config.properties.length === 1 ? 'y' : 'ies'} configured
            </span>
          </div>

          <div className="space-y-2">
            {config.properties.map((propConfig, index) => {
              const property = availableProperties.find(
                (p) => p.name === propConfig.propertyName
              );
              if (!property) return null;

              return (
                <FieldConfigCard
                  key={propConfig.propertyName}
                  property={property}
                  config={propConfig}
                  onConfigChange={(newConfig) =>
                    handlePropertyConfigChange(index, newConfig)
                  }
                  onRemove={() => handleRemoveProperty(index)}
                  availableProperties={availableProperties}
                  order={index + 1}
                  total={config.properties.length}
                  onMoveUp={() => moveProperty(index, index - 1)}
                  onMoveDown={() => moveProperty(index, index + 1)}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {config.properties.length === 0 && (
        <div className="py-8 text-center border-2 border-dashed rounded-lg">
          <div className="size-12 mx-auto mb-3 rounded-full bg-muted flex items-center justify-center">
            <Settings className="size-6 text-muted-foreground" />
          </div>
          <h3 className="text-sm font-medium mb-1">No properties configured</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Select properties above to configure how this agent updates HubSpot.
          </p>
        </div>
      )}
    </div>
  );
}

// Re-export types and components for convenience
export * from './types';
export { PropertySelector } from './PropertySelector';
export { FieldConfigCard } from './FieldConfigCard';

