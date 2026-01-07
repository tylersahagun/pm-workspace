import * as React from 'react';
import { Calendar, Users, Video, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SAMPLE_REPS, type TableFilters } from './types';

interface FilterPanelProps {
  filters: TableFilters;
  onFiltersChange: (filters: TableFilters) => void;
  matchingCount: number;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const DATE_PRESETS = [
  { label: 'Last 7 days', days: 7 },
  { label: 'Last 30 days', days: 30 },
  { label: 'This quarter', days: 90 },
  { label: 'All time', days: 365 },
];

const MEETING_TYPES = [
  { value: 'call', label: 'Calls', icon: '📞' },
  { value: 'meeting', label: 'Meetings', icon: '👥' },
  { value: 'demo', label: 'Demos', icon: '🎬' },
];

export function FilterPanel({
  filters,
  onFiltersChange,
  matchingCount,
  isCollapsed = false,
  onToggleCollapse,
}: FilterPanelProps) {
  const [selectedPreset, setSelectedPreset] = React.useState(1); // Default to 30 days

  const handlePresetChange = (index: number) => {
    setSelectedPreset(index);
    const days = DATE_PRESETS[index].days;
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    onFiltersChange({
      ...filters,
      dateRange: { 
        start: start.toISOString().split('T')[0], 
        end: end.toISOString().split('T')[0] 
      },
    });
  };

  const handleRepToggle = (repId: string) => {
    const newRepIds = filters.repIds.includes(repId)
      ? filters.repIds.filter((id) => id !== repId)
      : [...filters.repIds, repId];
    onFiltersChange({ ...filters, repIds: newRepIds });
  };

  const handleTypeToggle = (type: string) => {
    const newTypes = filters.meetingTypes.includes(type)
      ? filters.meetingTypes.filter((t) => t !== type)
      : [...filters.meetingTypes, type];
    onFiltersChange({ ...filters, meetingTypes: newTypes });
  };

  if (isCollapsed) {
    return (
      <div className="w-12 border-r bg-muted/30 flex flex-col items-center py-4">
        <button
          onClick={onToggleCollapse}
          className="p-2 rounded-lg hover:bg-accent transition-colors"
          title="Expand filters"
        >
          <Filter className="size-5 text-muted-foreground" />
        </button>
        <div className="mt-4 text-xs font-medium text-muted-foreground -rotate-90 whitespace-nowrap origin-center translate-y-8">
          {matchingCount} matches
        </div>
      </div>
    );
  }

  return (
    <div className="w-72 border-r bg-muted/30 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="size-4 text-muted-foreground" />
          <span className="font-medium text-sm">Filters</span>
        </div>
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="p-1 rounded hover:bg-accent transition-colors"
          >
            <ChevronDown className="size-4 text-muted-foreground rotate-90" />
          </button>
        )}
      </div>

      {/* Filter Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Date Range */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
            <Calendar className="size-3.5" />
            Date Range
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {DATE_PRESETS.map((preset, index) => (
              <button
                key={preset.label}
                onClick={() => handlePresetChange(index)}
                className={cn(
                  'px-3 py-1.5 text-xs rounded-md border transition-all',
                  selectedPreset === index
                    ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                    : 'bg-background border-input hover:bg-accent hover:border-accent-foreground/20'
                )}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Reps */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
            <Users className="size-3.5" />
            Reps
          </label>
          <div className="space-y-1">
            {SAMPLE_REPS.map((rep) => {
              const isSelected =
                filters.repIds.length === 0 || filters.repIds.includes(rep.id);
              return (
                <button
                  key={rep.id}
                  onClick={() => handleRepToggle(rep.id)}
                  className={cn(
                    'w-full px-3 py-2 text-sm text-left rounded-md border transition-all flex items-center gap-2',
                    isSelected
                      ? 'bg-primary/10 border-primary/30 text-primary'
                      : 'bg-background border-input hover:bg-accent text-muted-foreground'
                  )}
                >
                  <div
                    className={cn(
                      'size-2 rounded-full',
                      isSelected ? 'bg-primary' : 'bg-muted-foreground/30'
                    )}
                  />
                  {rep.name}
                </button>
              );
            })}
          </div>
          {filters.repIds.length > 0 && (
            <button
              onClick={() => onFiltersChange({ ...filters, repIds: [] })}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear selection
            </button>
          )}
        </div>

        {/* Meeting Types */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
            <Video className="size-3.5" />
            Meeting Type
          </label>
          <div className="flex flex-wrap gap-1.5">
            {MEETING_TYPES.map((type) => {
              const isSelected =
                filters.meetingTypes.length === 0 ||
                filters.meetingTypes.includes(type.value);
              return (
                <button
                  key={type.value}
                  onClick={() => handleTypeToggle(type.value)}
                  className={cn(
                    'px-3 py-1.5 text-xs rounded-full border transition-all flex items-center gap-1.5',
                    isSelected
                      ? 'bg-primary/10 border-primary/30 text-primary'
                      : 'bg-background border-input hover:bg-accent text-muted-foreground'
                  )}
                >
                  <span>{type.icon}</span>
                  {type.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Keywords (optional) */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Keywords (optional)
          </label>
          <input
            type="text"
            placeholder="Filter by title..."
            value={filters.keywords.join(', ')}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                keywords: e.target.value
                  .split(',')
                  .map((k) => k.trim())
                  .filter(Boolean),
              })
            }
            className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
      </div>

      {/* Footer - Matching Count */}
      <div className="p-4 border-t bg-background/50">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Matching</span>
          <span className="text-lg font-semibold text-primary">{matchingCount}</span>
        </div>
        <div className="text-xs text-muted-foreground mt-1">engagements</div>
      </div>
    </div>
  );
}

