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
  Info,
  ArrowUp,
  ArrowDown,
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

const MATCH_SIGNAL_OPTIONS = [
  { value: 'company_domain', label: 'Company domain' },
  { value: 'contact_email', label: 'Contact email' },
  { value: 'deal_name', label: 'Deal name' },
  { value: 'meeting_title', label: 'Meeting title' },
];

// Individual property configuration that matches form-renderers pattern
interface PropertyConfigFieldProps {
  property: HubSpotProperty;
  config: PropertyConfig;
  onConfigChange: (config: PropertyConfig) => void;
  onRemove: () => void;
  availableProperties: HubSpotProperty[];
  isExpanded: boolean;
  onToggleExpand: () => void;
  order: number;
  total: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

const PropertyConfigField: React.FC<PropertyConfigFieldProps> = ({
  property,
  config,
  onConfigChange,
  onRemove,
  availableProperties,
  isExpanded,
  onToggleExpand,
  order,
  total,
  onMoveUp,
  onMoveDown,
}) => {
  const dependencyOptions = {
    'Available Properties': availableProperties
      .filter((p) => p.name !== property.name)
      .map((p) => ({ label: p.label, value: p.name })),
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
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                {order}
              </span>
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
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  disabled={order === 1}
                  onClick={(e) => {
                    e.stopPropagation();
                    onMoveUp();
                  }}
                >
                  <ArrowUp className="h-3 w-3 text-muted-foreground" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  disabled={order === total}
                  onClick={(e) => {
                    e.stopPropagation();
                    onMoveDown();
                  }}
                >
                  <ArrowDown className="h-3 w-3 text-muted-foreground" />
                </Button>
              </div>
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
              label="Read existing value"
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
                  <SelectItem value="append_if_new">
                    Append only if different
                  </SelectItem>
                </SelectContent>
              </Select>
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
  const matchSignals = config.matchSignals ?? [];
  const createRequiredFields = config.createRequiredFields ?? [];

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
      customObjectLabel: objectType === 'custom' ? config.customObjectLabel : undefined,
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

  const moveProperty = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= config.properties.length) return;
    const newProperties = [...config.properties];
    const [moved] = newProperties.splice(fromIndex, 1);
    newProperties.splice(toIndex, 0, moved);
    onConfigChange({ ...config, properties: newProperties });
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
      {/* Context Source */}
      <LabeledRenderer
        label="Context Source"
        description="Choose which data the agent should use as context."
      >
        <Select
          value={config.contextSource}
          onValueChange={(value) =>
            onConfigChange({ ...config, contextSource: value as HubSpotAgentNodeConfig['contextSource'] })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest_call">Latest call</SelectItem>
            <SelectItem value="selected_meeting">Select a meeting</SelectItem>
            <SelectItem value="pasted_transcript">Paste transcript</SelectItem>
          </SelectContent>
        </Select>
      </LabeledRenderer>

      {config.contextSource === 'pasted_transcript' && (
        <LabeledRenderer
          label="Transcript"
          description="Paste a transcript to test configuration without a live meeting."
        >
          <Textarea
            value={config.contextTranscript || ''}
            onChange={(e) => onConfigChange({ ...config, contextTranscript: e.target.value })}
            placeholder="Paste transcript here..."
            className="min-h-[80px]"
          />
        </LabeledRenderer>
      )}

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
            <SelectItem value="note">Note</SelectItem>
            <SelectItem value="task">Task</SelectItem>
            <SelectItem value="custom">Custom object</SelectItem>
          </SelectContent>
        </Select>
      </LabeledRenderer>

      {config.objectType === 'custom' && (
        <LabeledRenderer
          label="Custom object name"
          description="Name the custom object from HubSpot."
        >
          <input
            value={config.customObjectLabel || ''}
            onChange={(e) => onConfigChange({ ...config, customObjectLabel: e.target.value })}
            placeholder="e.g., Renewal, Implementation"
            className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          />
        </LabeledRenderer>
      )}

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
              const index = config.properties.findIndex(
                (item) => item.propertyName === propConfig.propertyName
              );
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

      {/* Association & Matching */}
      <LabeledRenderer
        label="Association & Matching"
        description="Choose which signals to use to find the right HubSpot record."
      >
        <div className="space-y-2">
          <MultiSelect
            groups={{
              'Match Signals': MATCH_SIGNAL_OPTIONS.map((option) => ({
                label: option.label,
                value: option.value,
              })),
            }}
            value={matchSignals}
            onValueChange={(values) => onConfigChange({ ...config, matchSignals: values })}
            placeholder="Select match signals..."
            multiple={true}
          />
          <div className="grid gap-2 sm:grid-cols-2">
            <Select
              value={config.noMatchBehavior}
              onValueChange={(value) =>
                onConfigChange({ ...config, noMatchBehavior: value as HubSpotAgentNodeConfig['noMatchBehavior'] })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="If no match found..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="skip">Skip update</SelectItem>
                <SelectItem value="create">Create new object</SelectItem>
              </SelectContent>
            </Select>
            <input
              value={createRequiredFields.join(', ')}
              onChange={(e) =>
                onConfigChange({
                  ...config,
                  createRequiredFields: e.target.value
                    .split(',')
                    .map((value) => value.trim())
                    .filter(Boolean),
                })
              }
              placeholder="Required fields for create"
              className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
          </div>
        </div>
      </LabeledRenderer>

      {/* Sync Mode */}
      <LabeledRenderer
        label="Sync Mode"
        description="Choose whether changes sync automatically or require approval."
      >
        <Select
          value={config.approvalMode}
          onValueChange={(value) =>
            onConfigChange({ ...config, approvalMode: value as HubSpotAgentNodeConfig['approvalMode'] })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="auto">Just do it (auto sync)</SelectItem>
            <SelectItem value="review">Review first</SelectItem>
          </SelectContent>
        </Select>
      </LabeledRenderer>

      {/* Run Condition (optional) */}
      <LabeledRenderer
        label="Run Condition"
        labelHint="(optional)"
        description="Only run this agent when certain conditions are met."
      >
        <Textarea
          value={config.runCondition || ''}
          onChange={(e) => onConfigChange({ ...config, runCondition: e.target.value })}
          placeholder="e.g., Only run if Deal Stage is NOT Closed Won"
          className="min-h-[60px]"
        />
      </LabeledRenderer>
    </div>
  );
};

export default HubSpotAgentNodeConfig;

