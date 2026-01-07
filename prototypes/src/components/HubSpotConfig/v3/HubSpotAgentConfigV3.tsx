import * as React from 'react';
import {
  ClipboardList,
  FileText,
  Link2,
  ShieldCheck,
  Settings,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PropertySelectorV3 } from './PropertySelectorV3';
import { FieldConfigCardV3 } from './FieldConfigCardV3';
import type {
  HubSpotAgentConfigV3Props,
  HubSpotAgentNodeConfigV3,
  HubSpotObjectType,
  PropertyConfig,
  PreviewState,
} from './types';
import { createDefaultPropertyConfig, createDefaultRelatedActivities } from './types';

const ACTION_TYPE_OPTIONS = [
  {
    value: 'update',
    label: 'Update existing',
    description: 'Update the matched record only.',
  },
  {
    value: 'create',
    label: 'Create new',
    description: 'Create a new record every time.',
  },
  {
    value: 'update_or_create',
    label: 'Update or create',
    description: 'Update when matched, create when no match found.',
  },
];

const MATCH_SIGNAL_OPTIONS = [
  { value: 'company_domain', label: 'Company domain' },
  { value: 'contact_email', label: 'Contact email' },
  { value: 'deal_name', label: 'Deal name' },
  { value: 'meeting_title', label: 'Meeting title' },
];

const MATCH_RESOLUTION_OPTIONS = [
  { value: 'auto', label: 'Auto-select best match' },
  { value: 'review', label: 'Ask me to choose' },
];

const PREVIEW_COPY: Record<
  PreviewState,
  { title: string; description: string; tone: 'neutral' | 'success' | 'warning' | 'error' }
> = {
  idle: {
    title: 'Preview will appear here',
    description: 'Run a test meeting to see exactly what will sync.',
    tone: 'neutral',
  },
  empty: {
    title: 'No updates yet',
    description: 'Select at least one property to generate a preview.',
    tone: 'neutral',
  },
  loading: {
    title: 'Analyzing meeting...',
    description: 'Retrieving HubSpot properties and preparing updates.',
    tone: 'neutral',
  },
  success: {
    title: 'Ready to sync',
    description: 'Review the changes below or sync automatically.',
    tone: 'success',
  },
  low_confidence: {
    title: 'Needs review',
    description: 'We are not fully confident about the match. Please review.',
    tone: 'warning',
  },
  error: {
    title: 'Could not reach HubSpot',
    description: 'We hit a snag connecting. Try reconnecting or retry.',
    tone: 'error',
  },
};

export function HubSpotAgentConfigV3({
  config,
  onConfigChange,
  propertiesByObjectType,
  isLoading = false,
  previewState = 'idle',
}: HubSpotAgentConfigV3Props) {
  const fallbackConfig: HubSpotAgentNodeConfigV3 = {
    objectType: 'deal',
    actionType: 'update_or_create',
    properties: [],
    contextSource: 'latest_call',
    approvalMode: 'review',
    matchSignals: ['company_domain', 'deal_name'],
    matchResolution: 'review',
    noMatchBehavior: 'create',
    createRequiredFields: ['dealname', 'amount'],
    relatedActivities: createDefaultRelatedActivities(),
  };

  const normalizedConfig: HubSpotAgentNodeConfigV3 = {
    ...fallbackConfig,
    ...config,
    properties: config?.properties ?? fallbackConfig.properties,
    matchSignals: config?.matchSignals ?? fallbackConfig.matchSignals,
    createRequiredFields: config?.createRequiredFields ?? fallbackConfig.createRequiredFields,
    relatedActivities: config?.relatedActivities ?? fallbackConfig.relatedActivities,
    matchResolution: config?.matchResolution ?? fallbackConfig.matchResolution,
    noMatchBehavior: config?.noMatchBehavior ?? fallbackConfig.noMatchBehavior,
    actionType: config?.actionType ?? fallbackConfig.actionType,
    contextSource: config?.contextSource ?? fallbackConfig.contextSource,
    approvalMode: config?.approvalMode ?? fallbackConfig.approvalMode,
  };

  const availableProperties = propertiesByObjectType[normalizedConfig.objectType] || [];

  const updateConfig = (updates: Partial<HubSpotAgentNodeConfigV3>) => {
    onConfigChange({ ...normalizedConfig, ...updates });
  };

  const handleObjectTypeChange = (objectType: HubSpotObjectType) => {
    updateConfig({
      objectType,
      properties: [],
      customObjectLabel: objectType === 'custom' ? normalizedConfig.customObjectLabel : undefined,
    });
  };

  const handlePropertySelectionChange = (propertyNames: string[]) => {
    const existingConfigs = normalizedConfig.properties.filter((p) =>
      propertyNames.includes(p.propertyName)
    );
    const existingPropertyNames = existingConfigs.map((p) => p.propertyName);
    const newConfigs = propertyNames
      .filter((name) => !existingPropertyNames.includes(name))
      .map((name) => createDefaultPropertyConfig(name));

    const orderedConfigs = propertyNames.map(
      (name) =>
        existingConfigs.find((c) => c.propertyName === name) ||
        newConfigs.find((c) => c.propertyName === name)!
    );

    updateConfig({ properties: orderedConfigs });
  };

  const handlePropertyConfigChange = (index: number, newConfig: PropertyConfig) => {
    const newProperties = [...normalizedConfig.properties];
    newProperties[index] = newConfig;
    updateConfig({ properties: newProperties });
  };

  const moveProperty = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= normalizedConfig.properties.length) return;
    const newProperties = [...normalizedConfig.properties];
    const [moved] = newProperties.splice(fromIndex, 1);
    newProperties.splice(toIndex, 0, moved);
    updateConfig({ properties: newProperties });
  };

  const handleRemoveProperty = (index: number) => {
    const newProperties = normalizedConfig.properties.filter((_, i) => i !== index);
    updateConfig({ properties: newProperties });
  };

  const selectedPropertyNames = normalizedConfig.properties.map((p) => p.propertyName);
  const matchSignals = normalizedConfig.matchSignals;
  const createRequiredFields = normalizedConfig.createRequiredFields;
  const showAssociation = normalizedConfig.actionType !== 'create';
  const showCreateFields =
    normalizedConfig.actionType === 'create' ||
    (normalizedConfig.actionType === 'update_or_create' &&
      normalizedConfig.noMatchBehavior === 'create');
  const supportsActivities = ['deal', 'contact', 'company'].includes(
    normalizedConfig.objectType
  );

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b">
        <div className="flex items-center gap-2 mb-1">
          <div className="size-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
            <Sparkles className="size-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">HubSpot Agent Action</h2>
            <p className="text-sm text-muted-foreground">
              Configure what to update or create without workflow timing.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3 border rounded-lg p-4 bg-card">
        <div className="text-sm font-medium">Action type</div>
        <div className="grid gap-2 sm:grid-cols-3">
          {ACTION_TYPE_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => updateConfig({ actionType: option.value })}
              className={cn(
                'px-3 py-2 text-sm rounded-md border transition-colors text-left',
                normalizedConfig.actionType === option.value
                  ? 'bg-primary/10 border-primary text-primary'
                  : 'bg-background border-input hover:bg-accent'
              )}
            >
              <div className="font-medium">{option.label}</div>
              <div className="text-xs text-muted-foreground">{option.description}</div>
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          This is an action configuration, not a workflow trigger.
        </p>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium flex items-center gap-2">
          <FileText className="size-4 text-muted-foreground" />
          Context source
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
                normalizedConfig.contextSource === option.value
                  ? 'bg-primary/10 border-primary text-primary'
                  : 'bg-background border-input hover:bg-accent'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
        {normalizedConfig.contextSource === 'pasted_transcript' && (
          <textarea
            value={normalizedConfig.contextTranscript || ''}
            onChange={(e) => updateConfig({ contextTranscript: e.target.value })}
            placeholder="Paste a transcript to configure without a live meeting..."
            className={cn(
              'w-full min-h-24 px-3 py-2 text-sm rounded-md border border-input',
              'bg-background resize-y',
              'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
            )}
          />
        )}
      </div>

      <PropertySelectorV3
        availableProperties={availableProperties}
        selectedProperties={selectedPropertyNames}
        onSelectionChange={handlePropertySelectionChange}
        objectType={normalizedConfig.objectType}
        onObjectTypeChange={handleObjectTypeChange}
        isLoading={isLoading}
      />

      {normalizedConfig.objectType === 'custom' && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Custom object name</label>
          <input
            value={normalizedConfig.customObjectLabel || ''}
            onChange={(e) => updateConfig({ customObjectLabel: e.target.value })}
            placeholder="e.g., Renewal, Implementation, Partner Deal"
            className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          />
        </div>
      )}

      {showAssociation && (
        <div className="space-y-3 border rounded-lg p-4 bg-card">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Link2 className="size-4 text-muted-foreground" />
            Association & matching
          </div>
          <p className="text-xs text-muted-foreground">
            Choose how AskElephant finds the right HubSpot record.
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
              <label className="text-xs font-medium text-muted-foreground">
                If multiple matches
              </label>
              <div className="flex gap-2">
                {MATCH_RESOLUTION_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => updateConfig({ matchResolution: option.value })}
                    className={cn(
                      'flex-1 px-2 py-1.5 text-xs rounded-md border transition-colors',
                      normalizedConfig.matchResolution === option.value
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
                If no match found
              </label>
              <div className="flex gap-2">
                {[
                  { value: 'skip', label: 'Skip update' },
                  { value: 'create', label: 'Create new' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => updateConfig({ noMatchBehavior: option.value })}
                    className={cn(
                      'flex-1 px-2 py-1.5 text-xs rounded-md border transition-colors',
                      normalizedConfig.noMatchBehavior === option.value
                        ? 'bg-primary/10 border-primary text-primary'
                        : 'bg-background border-input hover:bg-accent'
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {showCreateFields && (
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
          )}
        </div>
      )}

      {!showAssociation && (
        <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
          Creating new records does not require matching signals.
        </div>
      )}

      <div className="space-y-3 border rounded-lg p-4 bg-card">
        <div className="flex items-center gap-2 text-sm font-medium">
          <ShieldCheck className="size-4 text-muted-foreground" />
          Human review
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
              description: 'Approve the object before any field writes.',
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

      <div className="space-y-2">
        <label className="text-sm font-medium flex items-center gap-2">
          <ClipboardList className="size-4 text-muted-foreground" />
          Optional condition
        </label>
        <textarea
          value={config.runCondition || ''}
          onChange={(e) => updateConfig({ runCondition: e.target.value })}
          placeholder="e.g., Only run if Deal Stage is not Closed Won or Amount > $1,000"
          className={cn(
            'w-full min-h-20 px-3 py-2 text-sm rounded-md border border-input',
            'bg-background resize-y',
            'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
          )}
        />
      </div>

      {supportsActivities && (
        <div className="space-y-3 border rounded-lg p-4 bg-card">
          <div className="text-sm font-medium">Related activities</div>
          <div className="space-y-3">
            <label className="flex items-start gap-3 text-sm">
              <input
                type="checkbox"
                checked={normalizedConfig.relatedActivities.createNote}
                onChange={(e) =>
                  updateConfig({
                    relatedActivities: {
                      ...normalizedConfig.relatedActivities,
                      createNote: e.target.checked,
                    },
                  })
                }
                className="mt-1 size-4"
              />
              <span className="flex-1">
                Add note to this {normalizedConfig.objectType}
                <span className="block text-xs text-muted-foreground">
                  Summarize the meeting in a note attached to the record.
                </span>
              </span>
            </label>
            {normalizedConfig.relatedActivities.createNote && (
              <textarea
                value={normalizedConfig.relatedActivities.noteTemplate}
                onChange={(e) =>
                  updateConfig({
                    relatedActivities: {
                      ...normalizedConfig.relatedActivities,
                      noteTemplate: e.target.value,
                    },
                  })
                }
                placeholder="e.g., Key decisions, risks, and next steps from the call."
                className={cn(
                  'w-full min-h-20 px-3 py-2 text-sm rounded-md border border-input',
                  'bg-background resize-y',
                  'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
                )}
              />
            )}
            <label className="flex items-start gap-3 text-sm">
              <input
                type="checkbox"
                checked={normalizedConfig.relatedActivities.createTask}
                onChange={(e) =>
                  updateConfig({
                    relatedActivities: {
                      ...normalizedConfig.relatedActivities,
                      createTask: e.target.checked,
                    },
                  })
                }
                className="mt-1 size-4"
              />
              <span className="flex-1">
                Create follow-up task
                <span className="block text-xs text-muted-foreground">
                  Capture the next step as a task with a due date.
                </span>
              </span>
            </label>
            {normalizedConfig.relatedActivities.createTask && (
              <div className="space-y-2">
                <textarea
                  value={normalizedConfig.relatedActivities.taskTemplate}
                  onChange={(e) =>
                    updateConfig({
                      relatedActivities: {
                        ...normalizedConfig.relatedActivities,
                        taskTemplate: e.target.value,
                      },
                    })
                  }
                  placeholder="e.g., Send proposal and confirm stakeholder list."
                  className={cn(
                    'w-full min-h-20 px-3 py-2 text-sm rounded-md border border-input',
                    'bg-background resize-y',
                    'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
                  )}
                />
                <div className="flex flex-wrap gap-2 text-xs">
                  {[
                    { value: 'same_day', label: 'Same day' },
                    { value: 'next_day', label: 'Next day' },
                    { value: 'in_week', label: 'Within a week' },
                    { value: 'custom', label: 'Custom date' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() =>
                        updateConfig({
                          relatedActivities: {
                            ...normalizedConfig.relatedActivities,
                            taskDue: option.value,
                          },
                        })
                      }
                      className={cn(
                        'px-2 py-1 rounded-md border transition-colors',
                        normalizedConfig.relatedActivities.taskDue === option.value
                          ? 'bg-primary/10 border-primary text-primary'
                          : 'bg-background border-input hover:bg-accent'
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

        {normalizedConfig.properties.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Property configurations</h3>
            <span className="text-xs text-muted-foreground">
              {normalizedConfig.properties.length} propert{normalizedConfig.properties.length === 1 ? 'y' : 'ies'} configured
            </span>
          </div>

          <div className="space-y-2">
            {normalizedConfig.properties.map((propConfig, index) => {
              const property = availableProperties.find(
                (p) => p.name === propConfig.propertyName
              );
              if (!property) return null;

              return (
                <FieldConfigCardV3
                  key={propConfig.propertyName}
                  property={property}
                  config={propConfig}
                  onConfigChange={(newConfig) =>
                    handlePropertyConfigChange(index, newConfig)
                  }
                  onRemove={() => handleRemoveProperty(index)}
                  availableProperties={availableProperties}
                  order={index + 1}
                  total={normalizedConfig.properties.length}
                  onMoveUp={() => moveProperty(index, index - 1)}
                  onMoveDown={() => moveProperty(index, index + 1)}
                />
              );
            })}
          </div>
        </div>
      )}

      {normalizedConfig.properties.length === 0 && (
        <div className="py-8 text-center border-2 border-dashed rounded-lg">
          <div className="size-12 mx-auto mb-3 rounded-full bg-muted flex items-center justify-center">
            <Settings className="size-6 text-muted-foreground" />
          </div>
          <h3 className="text-sm font-medium mb-1">No properties selected</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Add properties to configure what the agent will update or create.
          </p>
        </div>
      )}

      <PreviewPanel previewState={previewState} />
    </div>
  );
}

function PreviewPanel({ previewState }: { previewState: PreviewState }) {
  const preview = PREVIEW_COPY[previewState];
  const toneStyles =
    preview.tone === 'success'
      ? 'border-emerald-200 bg-emerald-50/50'
      : preview.tone === 'warning'
        ? 'border-amber-200 bg-amber-50/50'
        : preview.tone === 'error'
          ? 'border-rose-200 bg-rose-50/50'
          : 'border-border bg-card';

  const icon =
    previewState === 'loading' ? (
      <Loader2 className="size-4 animate-spin text-muted-foreground" />
    ) : previewState === 'success' ? (
      <CheckCircle2 className="size-4 text-emerald-600" />
    ) : previewState === 'low_confidence' ? (
      <AlertTriangle className="size-4 text-amber-600" />
    ) : previewState === 'error' ? (
      <AlertTriangle className="size-4 text-rose-600" />
    ) : (
      <Sparkles className="size-4 text-muted-foreground" />
    );

  return (
    <div className={cn('border rounded-lg p-4 space-y-3', toneStyles)}>
      <div className="flex items-center gap-2 text-sm font-medium" aria-live="polite">
        {icon}
        {preview.title}
      </div>
      <p className="text-xs text-muted-foreground">{preview.description}</p>

      {previewState === 'success' && (
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between rounded-md border px-3 py-2 bg-background">
            <div>
              <div className="font-medium text-foreground">Matched Deal: Acme Expansion</div>
              <div className="text-muted-foreground">Updating 4 fields</div>
            </div>
            <button className="inline-flex items-center gap-1 text-primary hover:text-primary/80">
              Open in HubSpot
              <ExternalLink className="size-3.5" />
            </button>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              'Probability to Close → 72%',
              'Next Step → Send proposal',
              'Next Step Date → Feb 2',
              'Deal Stage → Proposal',
            ].map((item) => (
              <div key={item} className="rounded-md border px-3 py-2 bg-background text-muted-foreground">
                {item}
              </div>
            ))}
          </div>
        </div>
      )}

      {previewState === 'low_confidence' && (
        <div className="text-xs text-muted-foreground">
          We found multiple potential matches. Review the object before syncing.
        </div>
      )}

      {previewState === 'error' && (
        <div className="text-xs text-muted-foreground">
          Try reconnecting your HubSpot account or retry in a few minutes.
        </div>
      )}
    </div>
  );
}
