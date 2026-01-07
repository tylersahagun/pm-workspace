import React, { useState, useCallback } from 'react';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MultiSelect } from '@/components/ui/multi-select';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  ChevronDown,
  ChevronRight,
  Trash2,
  Plus,
  AlertCircle,
  Maximize,
  Info,
} from 'lucide-react';
import { LabeledRenderer } from './LabeledRenderer';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import type {
  HubSpotAgentNodeConfig,
  PropertyConfig,
  HubSpotProperty,
  HubSpotObjectType,
  WriteMode,
} from '../types';
import { MOCK_HUBSPOT_PROPERTIES, createDefaultPropertyConfig } from '../types';

/**
 * HubSpotAgentNodeConfig - V2 Workflow-Integrated Version
 *
 * This component is designed to render INSIDE the WorkflowNodeSheet,
 * following the exact patterns used by other workflow node configurations:
 *
 * - Uses LabeledRenderer for consistent field layout
 * - Uses MultiSelect for property selection (matches CRMPropertySelect pattern)
 * - Uses Switch for boolean toggles (matches BooleanToggle pattern)
 * - Uses the same spacing (pb-6/pb-12) as other form renderers
 *
 * This is what would be rendered via JsonForms with custom renderers.
 */

interface HubSpotAgentNodeConfigProps {
  config: HubSpotAgentNodeConfig;
  onConfigChange: (config: HubSpotAgentNodeConfig) => void;
  /** In production, this comes from useCrmProperties hook */
  propertiesByObjectType?: Record<HubSpotObjectType, HubSpotProperty[]>;
  isLoading?: boolean;
}

// Individual property configuration that matches form-renderers pattern
interface PropertyConfigFieldProps {
  property: HubSpotProperty;
  config: PropertyConfig;
  onConfigChange: (config: PropertyConfig) => void;
  onRemove: () => void;
  availableProperties: HubSpotProperty[];
  isExpanded: boolean;
  onToggleExpand: () => void;
}

const PropertyConfigField: React.FC<PropertyConfigFieldProps> = ({
  property,
  config,
  onConfigChange,
  onRemove,
  availableProperties,
  isExpanded,
  onToggleExpand,
}) => {
  const dependencyOptions = {
    'Available Properties': availableProperties
      .filter((p) => p.name !== property.name)
      .map((p) => ({ label: p.label, value: p.name })),
  };

  const writeModeLabels: Record<WriteMode, string> = {
    overwrite: 'Overwrite existing value',
    append: 'Append to existing value',
    append_if_different: 'Append only if different',
  };

  return (
    <Collapsible open={isExpanded} onOpenChange={onToggleExpand}>
      <div className="border rounded-lg bg-card">
        {/* Collapsed Header */}
        <CollapsibleTrigger asChild>
          <div className="flex items-center justify-between p-3 cursor-pointer hover:bg-muted/50">
            <div className="flex items-center gap-2">
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="font-medium">{property.label}</span>
              <Badge variant="outline" className="text-xs">
                {property.type}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              {/* Status indicators */}
              {config.readBeforeWrite && (
                <Badge variant="secondary" className="text-xs">
                  Read First
                </Badge>
              )}
              {config.dependencies.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {config.dependencies.length} deps
                </Badge>
              )}
              {!config.syncToHubSpot && (
                <Badge variant="outline" className="text-xs text-yellow-600">
                  Local Only
                </Badge>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
              >
                <Trash2 className="h-3 w-3 text-muted-foreground" />
              </Button>
            </div>
          </div>
        </CollapsibleTrigger>

        {/* Expanded Content - Uses LabeledRenderer pattern */}
        <CollapsibleContent>
          <div className="border-t p-4 space-y-1">
            {/* Instruction Field - Matches InputRenderer multiline pattern */}
            <LabeledRenderer
              label="Instructions"
              description="Tell the AI how to populate this field based on the conversation."
              additionalButtons={
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Type {'{'}{'{'}  to insert variables</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              }
            >
              <Textarea
                value={config.instruction}
                onChange={(e) =>
                  onConfigChange({ ...config, instruction: e.target.value })
                }
                placeholder="e.g., Extract the customer's budget from the conversation, considering both stated numbers and implied ranges."
                className="min-h-[80px]"
              />
            </LabeledRenderer>

            {/* Read Before Write Toggle - Matches BooleanToggle pattern */}
            <LabeledRenderer
              label="Read before write"
              description="Read the existing field value and factor it into the update. Enable this when updates should consider historical context."
            >
              <Switch
                checked={config.readBeforeWrite}
                onCheckedChange={(checked) =>
                  onConfigChange({ ...config, readBeforeWrite: checked })
                }
              />
            </LabeledRenderer>

            {/* Dependencies - Matches GenericPropertySelect pattern */}
            <LabeledRenderer
              label="Dependencies"
              description="Properties to read before updating this field. The AI will have access to these values when generating its response."
            >
              <MultiSelect
                groups={dependencyOptions}
                value={config.dependencies}
                onValueChange={(deps) =>
                  onConfigChange({ ...config, dependencies: deps })
                }
                placeholder="Select dependent properties..."
                multiple={true}
              />
            </LabeledRenderer>

            {/* Write Mode - Matches EnumSelector pattern */}
            <LabeledRenderer
              label="Write Mode"
              description="How to handle existing values when updating this field."
            >
              <Select
                value={config.writeMode}
                onValueChange={(value) =>
                  onConfigChange({ ...config, writeMode: value as WriteMode })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="overwrite">Overwrite existing value</SelectItem>
                  <SelectItem value="append">Append to existing value</SelectItem>
                  <SelectItem value="append_if_different">
                    Append only if different
                  </SelectItem>
                </SelectContent>
              </Select>
            </LabeledRenderer>

            {/* Sync to HubSpot Toggle */}
            <LabeledRenderer
              label="Sync to HubSpot"
              description="Push this field's value to HubSpot. Disable for local-only calculations that inform other fields."
            >
              <div className="flex items-center gap-2">
                <Switch
                  checked={config.syncToHubSpot}
                  onCheckedChange={(checked) =>
                    onConfigChange({ ...config, syncToHubSpot: checked })
                  }
                />
                {!config.syncToHubSpot && (
                  <Badge variant="outline" className="text-yellow-600">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Local only
                  </Badge>
                )}
              </div>
            </LabeledRenderer>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};

export const HubSpotAgentNodeConfig: React.FC<HubSpotAgentNodeConfigProps> = ({
  config,
  onConfigChange,
  propertiesByObjectType = MOCK_HUBSPOT_PROPERTIES,
  isLoading = false,
}) => {
  // Start with all configured properties expanded by default
  const [expandedProperties, setExpandedProperties] = useState<Set<string>>(
    () => new Set(config.properties.map((p) => p.propertyName))
  );

  const availableProperties = propertiesByObjectType[config.objectType] || [];

  const allExpanded = config.properties.length > 0 && 
    config.properties.every((p) => expandedProperties.has(p.propertyName));

  const toggleAllExpanded = useCallback(() => {
    if (allExpanded) {
      setExpandedProperties(new Set());
    } else {
      setExpandedProperties(new Set(config.properties.map((p) => p.propertyName)));
    }
  }, [allExpanded, config.properties]);

  const togglePropertyExpanded = useCallback((propertyName: string) => {
    setExpandedProperties((prev) => {
      const next = new Set(prev);
      if (next.has(propertyName)) {
        next.delete(propertyName);
      } else {
        next.add(propertyName);
      }
      return next;
    });
  }, []);

  const handleObjectTypeChange = (objectType: HubSpotObjectType) => {
    onConfigChange({
      ...config,
      objectType,
      properties: [], // Clear properties when object type changes
    });
    setExpandedProperties(new Set());
  };

  const handlePropertiesSelect = (selectedNames: string[]) => {
    const newProperties = selectedNames.map((name) => {
      const existing = config.properties.find((p) => p.propertyName === name);
      return existing || createDefaultPropertyConfig(name);
    });
    onConfigChange({ ...config, properties: newProperties });

    // Auto-expand newly added properties
    if (selectedNames.length > config.properties.length) {
      const newProp = selectedNames.find(
        (name) => !config.properties.some((p) => p.propertyName === name)
      );
      if (newProp) {
        setExpandedProperties((prev) => new Set([...prev, newProp]));
      }
    }
  };

  const handlePropertyConfigChange = (updatedConfig: PropertyConfig) => {
    const newProperties = config.properties.map((p) =>
      p.propertyName === updatedConfig.propertyName ? updatedConfig : p
    );
    onConfigChange({ ...config, properties: newProperties });
  };

  const handlePropertyRemove = (propertyName: string) => {
    const newProperties = config.properties.filter(
      (p) => p.propertyName !== propertyName
    );
    onConfigChange({ ...config, properties: newProperties });
    setExpandedProperties((prev) => {
      const next = new Set(prev);
      next.delete(propertyName);
      return next;
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <span className="text-muted-foreground">Loading HubSpot properties...</span>
      </div>
    );
  }

  const propertyGroups = {
    'HubSpot Properties': availableProperties.map((p) => ({
      label: p.label,
      value: p.name,
    })),
  };

  return (
    <div className="space-y-1">
      {/* Object Type Selector - Matches EnumSelector pattern */}
      <LabeledRenderer
        label="Object Type"
        description="Select the HubSpot object type to update after each conversation."
      >
        <Select value={config.objectType} onValueChange={handleObjectTypeChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="deal">Deal</SelectItem>
            <SelectItem value="contact">Contact</SelectItem>
            <SelectItem value="company">Company</SelectItem>
            <SelectItem value="meeting">Meeting</SelectItem>
          </SelectContent>
        </Select>
      </LabeledRenderer>

      {/* Property Selector - Matches CRMPropertySelect/GenericPropertySelect pattern */}
      <LabeledRenderer
        label="Properties to Update"
        description="Select which HubSpot properties the AI should update based on conversations."
      >
        <MultiSelect
          groups={propertyGroups}
          value={config.properties.map((p) => p.propertyName)}
          onValueChange={handlePropertiesSelect}
          placeholder="Select properties..."
          multiple={true}
        />
      </LabeledRenderer>

      {/* Property Configurations */}
      {config.properties.length > 0 && (
        <div className="space-y-3 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Property Configuration</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {config.properties.length} properties
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleAllExpanded}
                className="h-6 text-xs"
              >
                {allExpanded ? 'Collapse All' : 'Expand All'}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            {config.properties.map((propConfig) => {
              const property = availableProperties.find(
                (p) => p.name === propConfig.propertyName
              );
              if (!property) return null;
              return (
                <PropertyConfigField
                  key={propConfig.propertyName}
                  property={property}
                  config={propConfig}
                  onConfigChange={handlePropertyConfigChange}
                  onRemove={() => handlePropertyRemove(propConfig.propertyName)}
                  availableProperties={availableProperties}
                  isExpanded={expandedProperties.has(propConfig.propertyName)}
                  onToggleExpand={() => togglePropertyExpanded(propConfig.propertyName)}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Update Trigger */}
      <LabeledRenderer
        label="Update Trigger"
        description="When should the agent push updates to HubSpot?"
      >
        <Select
          value={config.updateTrigger}
          onValueChange={(value) =>
            onConfigChange({
              ...config,
              updateTrigger: value as HubSpotAgentNodeConfig['updateTrigger'],
            })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="after_call">After every call</SelectItem>
            <SelectItem value="daily_batch">Daily batch update</SelectItem>
            <SelectItem value="on_deal_stage_change">On deal stage change</SelectItem>
          </SelectContent>
        </Select>
      </LabeledRenderer>

      {/* Conditional Trigger (optional) */}
      <LabeledRenderer
        label="Conditional Trigger"
        labelHint="(optional)"
        description="Only run this agent when certain conditions are met."
      >
        <Textarea
          value={config.conditionalTrigger || ''}
          onChange={(e) =>
            onConfigChange({ ...config, conditionalTrigger: e.target.value })
          }
          placeholder="e.g., Only run if 'Deal Stage' is NOT 'Closed Won'"
          className="min-h-[60px]"
        />
      </LabeledRenderer>
    </div>
  );
};

export default HubSpotAgentNodeConfig;

