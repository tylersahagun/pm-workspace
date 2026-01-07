import * as React from 'react';
import { Settings, Sparkles, Clock } from 'lucide-react';
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

const UPDATE_TRIGGER_OPTIONS: {
  value: NonNullable<HubSpotAgentNodeConfig['updateTrigger']>;
  label: string;
  icon: React.ReactNode;
}[] = [
  {
    value: 'after_call',
    label: 'After every call',
    icon: <Sparkles className="size-4" />,
  },
  {
    value: 'daily',
    label: 'Daily batch',
    icon: <Clock className="size-4" />,
  },
  {
    value: 'on_stage_change',
    label: 'On deal stage change',
    icon: <Settings className="size-4" />,
  },
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

  const handleRemoveProperty = (index: number) => {
    const newProperties = config.properties.filter((_, i) => i !== index);
    updateConfig({ properties: newProperties });
  };

  const selectedPropertyNames = config.properties.map((p) => p.propertyName);

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
              Configure which properties to update and how
            </p>
          </div>
        </div>
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
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Update Trigger (Should Have - included for completeness) */}
      {config.properties.length > 0 && (
        <div className="space-y-2 pt-4 border-t">
          <label className="text-sm font-medium flex items-center gap-2">
            <Clock className="size-4 text-muted-foreground" />
            Update Timing
          </label>
          <div className="flex gap-2">
            {UPDATE_TRIGGER_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => updateConfig({ updateTrigger: option.value })}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 text-sm rounded-md border transition-colors',
                  config.updateTrigger === option.value
                    ? 'bg-primary/10 border-primary text-primary'
                    : 'bg-background border-input hover:bg-accent'
                )}
              >
                {option.icon}
                {option.label}
              </button>
            ))}
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
            Select properties above to configure how the HubSpot agent should update
            your CRM after each call.
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

