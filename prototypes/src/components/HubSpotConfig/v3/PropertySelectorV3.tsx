import * as React from 'react';
import { Search, Plus, Check, Hash, Calendar, Type, List, ToggleLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { HubSpotProperty, HubSpotObjectType, HubSpotPropertyType } from './types';

interface PropertySelectorV3Props {
  availableProperties: HubSpotProperty[];
  selectedProperties: string[];
  onSelectionChange: (propertyNames: string[]) => void;
  objectType: HubSpotObjectType;
  onObjectTypeChange: (objectType: HubSpotObjectType) => void;
  isLoading?: boolean;
}

const OBJECT_TYPE_OPTIONS: { value: HubSpotObjectType; label: string }[] = [
  { value: 'deal', label: 'Deal' },
  { value: 'contact', label: 'Contact' },
  { value: 'company', label: 'Company' },
  { value: 'meeting', label: 'Meeting' },
  { value: 'note', label: 'Note' },
  { value: 'task', label: 'Task' },
  { value: 'custom', label: 'Custom object' },
];

const getPropertyTypeIcon = (type: HubSpotPropertyType) => {
  switch (type) {
    case 'number':
      return <Hash className="size-3.5 text-muted-foreground" />;
    case 'date':
    case 'datetime':
      return <Calendar className="size-3.5 text-muted-foreground" />;
    case 'enumeration':
      return <List className="size-3.5 text-muted-foreground" />;
    case 'bool':
      return <ToggleLeft className="size-3.5 text-muted-foreground" />;
    default:
      return <Type className="size-3.5 text-muted-foreground" />;
  }
};

const getPropertyTypeBadge = (type: HubSpotPropertyType) => {
  const labels: Record<HubSpotPropertyType, string> = {
    string: 'text',
    number: 'number',
    date: 'date',
    datetime: 'datetime',
    enumeration: 'dropdown',
    bool: 'boolean',
    phone_number: 'phone',
  };
  return labels[type] || type;
};

export function PropertySelectorV3({
  availableProperties,
  selectedProperties,
  onSelectionChange,
  objectType,
  onObjectTypeChange,
  isLoading = false,
}: PropertySelectorV3Props) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  const groupedProperties = React.useMemo(() => {
    const groups: Record<string, HubSpotProperty[]> = {};
    availableProperties.forEach((prop) => {
      const group = prop.groupName || 'Other';
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(prop);
    });
    return groups;
  }, [availableProperties]);

  const filteredGroups = React.useMemo(() => {
    if (!searchQuery.trim()) return groupedProperties;

    const query = searchQuery.toLowerCase();
    const filtered: Record<string, HubSpotProperty[]> = {};

    Object.entries(groupedProperties).forEach(([group, props]) => {
      const matchingProps = props.filter(
        (prop) =>
          prop.label.toLowerCase().includes(query) ||
          prop.name.toLowerCase().includes(query)
      );
      if (matchingProps.length > 0) {
        filtered[group] = matchingProps;
      }
    });

    return filtered;
  }, [groupedProperties, searchQuery]);

  const toggleProperty = (propertyName: string) => {
    if (selectedProperties.includes(propertyName)) {
      onSelectionChange(selectedProperties.filter((p) => p !== propertyName));
    } else {
      onSelectionChange([...selectedProperties, propertyName]);
    }
  };

  const unselectedProperties = React.useMemo(() => {
    return availableProperties.filter((p) => !selectedProperties.includes(p.name));
  }, [availableProperties, selectedProperties]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Object type</label>
        <div className="flex flex-wrap gap-2">
          {OBJECT_TYPE_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => onObjectTypeChange(option.value)}
              className={cn(
                'px-3 py-1.5 text-sm rounded-md border transition-colors',
                objectType === option.value
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background border-input hover:bg-accent hover:text-accent-foreground'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Choose one object per action to keep dependencies clear.
        </p>
      </div>

      {selectedProperties.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Properties to update ({selectedProperties.length})
          </label>
          <div className="space-y-1">
            {selectedProperties.map((propName) => {
              const prop = availableProperties.find((p) => p.name === propName);
              if (!prop) return null;
              return (
                <div
                  key={propName}
                  className="flex items-center justify-between px-3 py-2 bg-accent/50 rounded-md border border-accent"
                >
                  <div className="flex items-center gap-2">
                    {getPropertyTypeIcon(prop.type)}
                    <span className="text-sm font-medium">{prop.label}</span>
                    <span className="text-xs text-muted-foreground px-1.5 py-0.5 bg-muted rounded">
                      {getPropertyTypeBadge(prop.type)}
                    </span>
                  </div>
                  <button
                    onClick={() => toggleProperty(propName)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <span className="sr-only">Remove</span>
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          disabled={isLoading || unselectedProperties.length === 0}
          className={cn(
            'flex items-center gap-2 px-3 py-2 text-sm border border-dashed rounded-md w-full',
            'text-muted-foreground hover:text-foreground hover:border-foreground/50 transition-colors',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          <Plus className="size-4" />
          {isLoading ? 'Loading properties...' : 'Add property'}
        </button>

        {isDropdownOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />

            <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-popover border rounded-md shadow-lg max-h-80 overflow-hidden">
              <div className="p-2 border-b">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search properties..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-sm bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    autoFocus
                  />
                </div>
              </div>

              <div className="overflow-y-auto max-h-60">
                {Object.keys(filteredGroups).length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No properties found
                  </div>
                ) : (
                  Object.entries(filteredGroups).map(([group, props]) => {
                    const unselectedInGroup = props.filter(
                      (p) => !selectedProperties.includes(p.name)
                    );
                    if (unselectedInGroup.length === 0) return null;

                    return (
                      <div key={group}>
                        <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground bg-muted/50 sticky top-0">
                          {group.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                        </div>
                        {unselectedInGroup.map((prop) => {
                          const isSelected = selectedProperties.includes(prop.name);
                          return (
                            <button
                              key={prop.name}
                              onClick={() => toggleProperty(prop.name)}
                              className={cn(
                                'flex items-center justify-between w-full px-3 py-2 text-sm text-left',
                                'hover:bg-accent transition-colors',
                                isSelected && 'bg-accent'
                              )}
                            >
                              <div className="flex items-center gap-2">
                                {getPropertyTypeIcon(prop.type)}
                                <span>{prop.label}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">
                                  {getPropertyTypeBadge(prop.type)}
                                </span>
                                {isSelected && <Check className="size-4 text-primary" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    );
                  })
                )}
              </div>

              <div className="p-2 border-t bg-muted/30">
                <button
                  onClick={() => setIsDropdownOpen(false)}
                  className="w-full py-1.5 text-sm text-center hover:bg-accent rounded transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
