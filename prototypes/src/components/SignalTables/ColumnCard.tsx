import * as React from 'react';
import {
  GripVertical,
  Trash2,
  ChevronDown,
  ChevronUp,
  Link2,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TableColumn, ColumnOutputType, ConditionOperator } from './types';

interface ColumnCardProps {
  column: TableColumn;
  index: number;
  allColumns: TableColumn[];
  onUpdate: (column: TableColumn) => void;
  onRemove: () => void;
  isMaxColumns?: boolean;
}

const OUTPUT_TYPES: { value: ColumnOutputType; label: string; icon: string }[] = [
  { value: 'boolean', label: 'Yes/No', icon: '✓' },
  { value: 'text', label: 'Text', icon: '📝' },
  { value: 'select', label: 'Select', icon: '☰' },
  { value: 'number', label: 'Number', icon: '#' },
];

const OPERATORS: { value: ConditionOperator; label: string }[] = [
  { value: 'equals', label: 'equals' },
  { value: 'not_equals', label: 'does not equal' },
  { value: 'contains', label: 'contains' },
];

export function ColumnCard({
  column,
  index,
  allColumns,
  onUpdate,
  onRemove,
  isMaxColumns,
}: ColumnCardProps) {
  const [isExpanded, setIsExpanded] = React.useState(true);
  const [isEditingPrompt, setIsEditingPrompt] = React.useState(false);

  const dependentColumn = column.condition
    ? allColumns.find((c) => c.id === column.condition?.dependsOnColumnId)
    : null;

  const availableConditionColumns = allColumns.filter(
    (c) => c.order < column.order && c.outputType === 'boolean'
  );

  const handleConditionToggle = () => {
    if (column.condition) {
      onUpdate({ ...column, condition: undefined });
    } else if (availableConditionColumns.length > 0) {
      onUpdate({
        ...column,
        condition: {
          dependsOnColumnId: availableConditionColumns[0].id,
          operator: 'equals',
          value: 'Yes',
        },
      });
    }
  };

  return (
    <div
      className={cn(
        'border rounded-lg bg-card overflow-hidden transition-all',
        isExpanded ? 'shadow-sm' : ''
      )}
    >
      {/* Header */}
      <div
        className="px-3 py-2 flex items-center gap-2 cursor-pointer hover:bg-accent/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <GripVertical className="size-4 text-muted-foreground/50 cursor-grab" />
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          <span className="text-xs font-medium text-muted-foreground">
            #{index + 1}
          </span>
          <span className="font-medium text-sm truncate">{column.name}</span>
          {column.condition && (
            <Link2 className="size-3.5 text-amber-500 flex-shrink-0" />
          )}
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
            {OUTPUT_TYPES.find((t) => t.value === column.outputType)?.label}
          </span>
          {isExpanded ? (
            <ChevronUp className="size-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="size-4 text-muted-foreground" />
          )}
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-3 pb-3 space-y-3 border-t">
          {/* Prompt */}
          <div className="pt-3 space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <Sparkles className="size-3" />
              Prompt
            </label>
            {isEditingPrompt ? (
              <textarea
                value={column.prompt}
                onChange={(e) => onUpdate({ ...column, prompt: e.target.value })}
                onBlur={() => setIsEditingPrompt(false)}
                autoFocus
                className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                rows={3}
              />
            ) : (
              <div
                onClick={() => setIsEditingPrompt(true)}
                className="w-full px-3 py-2 text-sm rounded-md border border-input bg-muted/30 cursor-text hover:bg-muted/50 transition-colors"
              >
                <p className="text-foreground/80 line-clamp-2">{column.prompt}</p>
              </div>
            )}
          </div>

          {/* Output Type */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Output Type
            </label>
            <div className="flex gap-1">
              {OUTPUT_TYPES.map((type) => (
                <button
                  key={type.value}
                  onClick={() => onUpdate({ ...column, outputType: type.value })}
                  className={cn(
                    'px-2 py-1 text-xs rounded border transition-all flex items-center gap-1',
                    column.outputType === type.value
                      ? 'bg-primary/10 border-primary/30 text-primary'
                      : 'bg-background border-input hover:bg-accent text-muted-foreground'
                  )}
                >
                  <span>{type.icon}</span>
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Conditional Execution */}
          {availableConditionColumns.length > 0 && (
            <div className="space-y-2 pt-2 border-t">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <Link2 className="size-3" />
                  Conditional Execution
                </label>
                <button
                  onClick={handleConditionToggle}
                  className={cn(
                    'relative inline-flex h-5 w-9 items-center rounded-full transition-colors',
                    column.condition ? 'bg-primary' : 'bg-muted'
                  )}
                >
                  <span
                    className={cn(
                      'inline-block size-4 transform rounded-full bg-white transition-transform shadow-sm',
                      column.condition ? 'translate-x-4' : 'translate-x-0.5'
                    )}
                  />
                </button>
              </div>

              {column.condition && (
                <div className="p-2 rounded-md bg-amber-500/10 border border-amber-500/20">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-muted-foreground">Only run if</span>
                    <select
                      value={column.condition.dependsOnColumnId}
                      onChange={(e) =>
                        onUpdate({
                          ...column,
                          condition: {
                            ...column.condition!,
                            dependsOnColumnId: e.target.value,
                          },
                        })
                      }
                      className="px-2 py-1 rounded border border-input bg-background text-xs"
                    >
                      {availableConditionColumns.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    <select
                      value={column.condition.operator}
                      onChange={(e) =>
                        onUpdate({
                          ...column,
                          condition: {
                            ...column.condition!,
                            operator: e.target.value as ConditionOperator,
                          },
                        })
                      }
                      className="px-2 py-1 rounded border border-input bg-background text-xs"
                    >
                      {OPERATORS.map((op) => (
                        <option key={op.value} value={op.value}>
                          {op.label}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={column.condition.value}
                      onChange={(e) =>
                        onUpdate({
                          ...column,
                          condition: {
                            ...column.condition!,
                            value: e.target.value,
                          },
                        })
                      }
                      className="w-16 px-2 py-1 rounded border border-input bg-background text-xs"
                    />
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-xs text-amber-600">
                    <AlertCircle className="size-3" />
                    <span>Saves ~60% on this column</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end pt-2 border-t">
            <button
              onClick={onRemove}
              className="flex items-center gap-1 px-2 py-1 text-xs text-destructive hover:bg-destructive/10 rounded transition-colors"
            >
              <Trash2 className="size-3" />
              Remove
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

