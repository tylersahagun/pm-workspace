import * as React from 'react';
import { Plus, Layers, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ColumnCard } from './ColumnCard';
import { COLUMN_TEMPLATES, type TableColumn, type ColumnTemplate } from './types';

interface BuilderPanelProps {
  columns: TableColumn[];
  onColumnsChange: (columns: TableColumn[]) => void;
  maxColumns?: number;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const MAX_COLUMNS = 5;

export function BuilderPanel({
  columns,
  onColumnsChange,
  maxColumns = MAX_COLUMNS,
  isCollapsed = false,
  onToggleCollapse,
}: BuilderPanelProps) {
  const [showTemplates, setShowTemplates] = React.useState(false);

  const isMaxColumns = columns.length >= maxColumns;

  const handleAddColumn = () => {
    if (isMaxColumns) return;

    const newColumn: TableColumn = {
      id: `col-${Date.now()}`,
      name: `Column ${columns.length + 1}`,
      prompt: 'Enter your extraction prompt...',
      outputType: 'text',
      order: columns.length,
    };
    onColumnsChange([...columns, newColumn]);
  };

  const handleApplyTemplate = (template: ColumnTemplate) => {
    if (columns.length + template.columns.length > maxColumns) {
      // Could show a warning here
      return;
    }

    let previousBooleanColumnId: string | null = null;
    const newColumns = template.columns.map((col, index) => {
      const columnId = `col-${Date.now()}-${index}`;
      
      // Set up condition to reference the previous boolean column
      let condition = col.condition;
      if (condition && previousBooleanColumnId) {
        condition = { ...condition, dependsOnColumnId: previousBooleanColumnId };
      }

      // Track boolean columns for dependencies
      if (col.outputType === 'boolean') {
        previousBooleanColumnId = columnId;
      }

      return {
        ...col,
        id: columnId,
        order: columns.length + index,
        condition,
      };
    });

    onColumnsChange([...columns, ...newColumns]);
    setShowTemplates(false);
  };

  const handleUpdateColumn = (index: number, updated: TableColumn) => {
    const newColumns = [...columns];
    newColumns[index] = updated;
    onColumnsChange(newColumns);
  };

  const handleRemoveColumn = (index: number) => {
    const newColumns = columns.filter((_, i) => i !== index);
    // Re-order remaining columns
    onColumnsChange(newColumns.map((col, i) => ({ ...col, order: i })));
  };

  if (isCollapsed) {
    return (
      <div className="w-12 border-l bg-muted/30 flex flex-col items-center py-4">
        <button
          onClick={onToggleCollapse}
          className="p-2 rounded-lg hover:bg-accent transition-colors"
          title="Expand builder"
        >
          <Layers className="size-5 text-muted-foreground" />
        </button>
        <div className="mt-4 text-xs font-medium text-muted-foreground -rotate-90 whitespace-nowrap origin-center translate-y-6">
          {columns.length}/{maxColumns} columns
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 border-l bg-muted/30 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="size-4 text-muted-foreground" />
          <span className="font-medium text-sm">Builder</span>
          <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
            {columns.length}/{maxColumns}
          </span>
        </div>
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="p-1 rounded hover:bg-accent transition-colors"
          >
            <ChevronRight className="size-4 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {/* Column Cards */}
        {columns.map((column, index) => (
          <ColumnCard
            key={column.id}
            column={column}
            index={index}
            allColumns={columns}
            onUpdate={(updated) => handleUpdateColumn(index, updated)}
            onRemove={() => handleRemoveColumn(index)}
            isMaxColumns={isMaxColumns}
          />
        ))}

        {/* Add Column Button */}
        {!isMaxColumns && !showTemplates && (
          <div className="space-y-2">
            <button
              onClick={handleAddColumn}
              className="w-full px-4 py-3 border-2 border-dashed rounded-lg text-sm text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="size-4" />
              Add Custom Column
            </button>
            <button
              onClick={() => setShowTemplates(true)}
              className="w-full px-4 py-2 text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles className="size-4" />
              Use Template
            </button>
          </div>
        )}

        {/* Template Selection */}
        {showTemplates && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Choose Template</span>
              <button
                onClick={() => setShowTemplates(false)}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
            </div>
            <div className="grid gap-2">
              {COLUMN_TEMPLATES.map((template) => {
                const canApply = columns.length + template.columns.length <= maxColumns;
                return (
                  <button
                    key={template.id}
                    onClick={() => canApply && handleApplyTemplate(template)}
                    disabled={!canApply}
                    className={cn(
                      'p-3 text-left border rounded-lg transition-all',
                      canApply
                        ? 'hover:border-primary/50 hover:bg-primary/5'
                        : 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{template.icon}</span>
                      <span className="font-medium text-sm">{template.name}</span>
                      <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground ml-auto">
                        {template.columns.length} col{template.columns.length > 1 ? 's' : ''}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{template.description}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Max Columns Warning */}
        {isMaxColumns && (
          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs">
            <p className="text-amber-600 font-medium mb-1">Maximum columns reached</p>
            <p className="text-muted-foreground">
              Remove a column to add another. This limit helps keep analysis focused.
            </p>
          </div>
        )}

        {/* Empty State */}
        {columns.length === 0 && !showTemplates && (
          <div className="py-8 text-center">
            <div className="size-12 mx-auto mb-3 rounded-full bg-muted flex items-center justify-center">
              <Sparkles className="size-6 text-muted-foreground" />
            </div>
            <h3 className="text-sm font-medium mb-1">No columns yet</h3>
            <p className="text-xs text-muted-foreground max-w-[200px] mx-auto">
              Add AI columns to extract insights from your engagements
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

