import * as React from 'react';
import {
  ChevronUp,
  ChevronDown,
  ExternalLink,
  AlertCircle,
  Loader2,
  SkipForward,
  Check,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type {
  Engagement,
  TableColumn,
  ColumnResult,
  TableRowData,
  SAMPLE_COLUMN_RESULTS,
} from './types';

interface TableViewProps {
  engagements: Engagement[];
  columns: TableColumn[];
  columnResults: Record<string, Record<string, ColumnResult>>;
  isRunning?: boolean;
  progress?: { current: number; total: number };
  onRowClick?: (engagement: Engagement) => void;
}

type SortDirection = 'asc' | 'desc' | null;

export function TableView({
  engagements,
  columns,
  columnResults,
  isRunning = false,
  progress,
  onRowClick,
}: TableViewProps) {
  const [sortColumn, setSortColumn] = React.useState<string | null>(null);
  const [sortDirection, setSortDirection] = React.useState<SortDirection>(null);

  const handleSort = (columnId: string) => {
    if (sortColumn === columnId) {
      if (sortDirection === 'asc') setSortDirection('desc');
      else if (sortDirection === 'desc') {
        setSortColumn(null);
        setSortDirection(null);
      }
    } else {
      setSortColumn(columnId);
      setSortDirection('asc');
    }
  };

  const formatDate = (date: string) => {
    // Date is already formatted as a string
    return date;
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const getTypeIcon = (type: Engagement['type']) => {
    switch (type) {
      case 'call':
        return '📞';
      case 'meeting':
        return '👥';
      case 'demo':
        return '🎬';
      default:
        return '📌';
    }
  };

  const renderCellValue = (result: ColumnResult | undefined) => {
    if (!result) {
      return <span className="text-muted-foreground">—</span>;
    }

    switch (result.status) {
      case 'pending':
        return <Loader2 className="size-4 animate-spin text-muted-foreground" />;
      case 'skipped':
        return (
          <span className="flex items-center gap-1 text-muted-foreground text-xs">
            <SkipForward className="size-3" />
            skipped
          </span>
        );
      case 'error':
        return (
          <span
            className="flex items-center gap-1 text-destructive text-xs"
            title={result.errorMessage}
          >
            <AlertCircle className="size-3" />
            error
          </span>
        );
      case 'complete':
        if (result.value === null || result.value === '') {
          return <span className="text-muted-foreground">—</span>;
        }
        if (typeof result.value === 'boolean') {
          return result.value ? (
            <Check className="size-4 text-green-500" />
          ) : (
            <X className="size-4 text-red-400" />
          );
        }
        if (result.value === 'Yes') {
          return (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 text-xs font-medium">
              <Check className="size-3" />
              Yes
            </span>
          );
        }
        if (result.value === 'No') {
          return (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 text-xs font-medium">
              <X className="size-3" />
              No
            </span>
          );
        }
        return (
          <span className="text-sm line-clamp-2" title={String(result.value)}>
            {result.value}
          </span>
        );
      default:
        return <span className="text-muted-foreground">—</span>;
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Progress Bar */}
      {isRunning && progress && (
        <div className="px-4 py-2 bg-primary/5 border-b flex items-center gap-3">
          <Loader2 className="size-4 animate-spin text-primary" />
          <div className="flex-1">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${(progress.current / progress.total) * 100}%` }}
              />
            </div>
          </div>
          <span className="text-sm text-muted-foreground">
            {progress.current}/{progress.total}
          </span>
        </div>
      )}

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-muted/80 backdrop-blur-sm z-10">
            <tr>
              {/* Fixed Columns */}
              <th className="text-left px-4 py-3 font-medium text-muted-foreground w-[280px]">
                <button
                  onClick={() => handleSort('title')}
                  className="flex items-center gap-1 hover:text-foreground transition-colors"
                >
                  Engagement
                  {sortColumn === 'title' && (
                    sortDirection === 'asc' ? (
                      <ChevronUp className="size-4" />
                    ) : (
                      <ChevronDown className="size-4" />
                    )
                  )}
                </button>
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground w-[120px]">
                <button
                  onClick={() => handleSort('date')}
                  className="flex items-center gap-1 hover:text-foreground transition-colors"
                >
                  Date
                  {sortColumn === 'date' && (
                    sortDirection === 'asc' ? (
                      <ChevronUp className="size-4" />
                    ) : (
                      <ChevronDown className="size-4" />
                    )
                  )}
                </button>
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground w-[120px]">
                Rep
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground w-[80px]">
                Duration
              </th>

              {/* Dynamic AI Columns */}
              {columns.map((column) => (
                <th
                  key={column.id}
                  className="text-left px-4 py-3 font-medium text-muted-foreground min-w-[150px] max-w-[250px]"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="truncate" title={column.prompt}>
                      {column.name}
                    </span>
                    {column.condition && (
                      <span className="text-amber-500 text-xs">⚡</span>
                    )}
                  </div>
                </th>
              ))}

              {/* Empty column for actions */}
              <th className="w-12" />
            </tr>
          </thead>
          <tbody className="divide-y">
            {engagements.map((engagement) => {
              const results = columnResults[engagement.id] || {};
              return (
                <tr
                  key={engagement.id}
                  onClick={() => onRowClick?.(engagement)}
                  className={cn(
                    'hover:bg-accent/50 transition-colors',
                    onRowClick && 'cursor-pointer'
                  )}
                >
                  {/* Engagement */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getTypeIcon(engagement.type)}</span>
                      <div className="min-w-0">
                        <p className="font-medium truncate">{engagement.title}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {engagement.company}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Date */}
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatDate(engagement.date)}
                  </td>

                  {/* Rep */}
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="size-6 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center justify-center">
                        {engagement.rep.charAt(0)}
                      </span>
                      <span className="text-muted-foreground">
                        {engagement.rep.split(' ')[0]}
                      </span>
                    </span>
                  </td>

                  {/* Duration */}
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatDuration(engagement.duration)}
                  </td>

                  {/* AI Columns */}
                  {columns.map((column) => (
                    <td key={column.id} className="px-4 py-3">
                      {renderCellValue(results[column.id])}
                    </td>
                  ))}

                  {/* Actions */}
                  <td className="px-2 py-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Would open engagement detail
                      }}
                      className="p-1.5 rounded hover:bg-accent transition-colors"
                      title="Open engagement"
                    >
                      <ExternalLink className="size-4 text-muted-foreground" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Empty State */}
        {engagements.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="size-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <AlertCircle className="size-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-1">No engagements match</h3>
            <p className="text-muted-foreground text-center max-w-sm">
              Try adjusting your filters to see more results.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

