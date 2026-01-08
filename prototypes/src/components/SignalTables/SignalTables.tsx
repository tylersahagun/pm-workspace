import * as React from 'react';
import {
  Table2,
  Play,
  Save,
  Download,
  RotateCcw,
  Clock,
  ChevronLeft,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { FilterPanel } from './FilterPanel';
import { BuilderPanel } from './BuilderPanel';
import { TableView } from './TableView';
import { ChatInput } from './ChatInput';
import {
  SAMPLE_ENGAGEMENTS,
  SAMPLE_COLUMN_RESULTS,
  type TableColumn,
  type TableFilters,
  type Engagement,
  type ColumnResult,
} from './types';

interface SignalTablesProps {
  tableName?: string;
  lastRunAt?: string | null;
  onBack?: () => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  columnSuggestion?: {
    name: string;
    prompt: string;
    outputType: 'text' | 'boolean' | 'select' | 'number';
  };
}

export function SignalTables({
  tableName = 'Untitled Table',
  lastRunAt = null,
  onBack,
}: SignalTablesProps) {
  // State
  const [filters, setFilters] = React.useState<TableFilters>({
    dateRange: {
      start: '2025-12-07',
      end: '2026-01-07',
    },
    repIds: [],
    meetingTypes: [],
    keywords: [],
  });

  const [columns, setColumns] = React.useState<TableColumn[]>([]);
  const [columnResults, setColumnResults] = React.useState<
    Record<string, Record<string, ColumnResult>>
  >({});

  const [isRunning, setIsRunning] = React.useState(false);
  const [progress, setProgress] = React.useState<{ current: number; total: number } | undefined>();
  const [hasRun, setHasRun] = React.useState(false);

  const [chatMessages, setChatMessages] = React.useState<ChatMessage[]>([]);
  const [isChatProcessing, setIsChatProcessing] = React.useState(false);

  const [filterCollapsed, setFilterCollapsed] = React.useState(false);
  const [builderCollapsed, setBuilderCollapsed] = React.useState(false);

  // Filtered engagements (mock filtering)
  const filteredEngagements = React.useMemo(() => {
    return SAMPLE_ENGAGEMENTS.filter((eng) => {
      // Date filter
      if (eng.date < filters.dateRange.start || eng.date > filters.dateRange.end) {
        return false;
      }
      // Rep filter
      if (filters.repIds.length > 0) {
        const repMatch = filters.repIds.some(
          (id) => eng.rep.toLowerCase().includes(id.replace('rep-', ''))
        );
        if (!repMatch) return false;
      }
      // Type filter
      if (filters.meetingTypes.length > 0 && !filters.meetingTypes.includes(eng.type)) {
        return false;
      }
      // Keywords filter
      if (filters.keywords.length > 0) {
        const hasKeyword = filters.keywords.some((k) =>
          eng.title.toLowerCase().includes(k.toLowerCase())
        );
        if (!hasKeyword) return false;
      }
      return true;
    });
  }, [filters]);

  // Handle running extraction
  const handleRun = async () => {
    if (columns.length === 0) return;

    setIsRunning(true);
    setProgress({ current: 0, total: filteredEngagements.length });

    // Simulate extraction progress
    for (let i = 0; i < filteredEngagements.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 200 + Math.random() * 300));
      setProgress({ current: i + 1, total: filteredEngagements.length });
    }

    // Apply sample results
    setColumnResults(SAMPLE_COLUMN_RESULTS);
    setIsRunning(false);
    setHasRun(true);
    setProgress(undefined);
  };

  // Handle chat message
  const handleChatMessage = async (message: string) => {
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: message,
    };
    setChatMessages((prev) => [...prev, userMessage]);
    setIsChatProcessing(true);

    // Simulate AI response
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000));

    // Generate a column suggestion based on the message
    const lowerMessage = message.toLowerCase();
    let suggestion: ChatMessage['columnSuggestion'];

    if (lowerMessage.includes('competitor')) {
      suggestion = {
        name: 'Competitor Mentioned',
        prompt: 'Was any competitor mentioned in this conversation? Answer Yes or No.',
        outputType: 'boolean',
      };
    } else if (lowerMessage.includes('objection')) {
      suggestion = {
        name: 'Objection Raised',
        prompt: 'Was any objection or concern raised by the prospect? Answer Yes or No.',
        outputType: 'boolean',
      };
    } else if (lowerMessage.includes('pricing') || lowerMessage.includes('budget')) {
      suggestion = {
        name: 'Pricing Discussed',
        prompt: 'Was pricing, cost, or budget discussed? Answer Yes or No.',
        outputType: 'boolean',
      };
    } else if (lowerMessage.includes('next step') || lowerMessage.includes('follow')) {
      suggestion = {
        name: 'Next Steps',
        prompt: 'Were any next steps or follow-up actions discussed? Summarize briefly.',
        outputType: 'text',
      };
    } else {
      suggestion = {
        name: 'Custom Extraction',
        prompt: `Extract relevant information about: ${message}`,
        outputType: 'text',
      };
    }

    const assistantMessage: ChatMessage = {
      id: `msg-${Date.now() + 1}`,
      role: 'assistant',
      content: `I'll create a column to detect ${suggestion.name.toLowerCase()}. Here's what I suggest:`,
      columnSuggestion: suggestion,
    };

    setChatMessages((prev) => [...prev, assistantMessage]);
    setIsChatProcessing(false);
  };

  // Handle adding column from chat suggestion
  const handleAddColumnFromChat = (suggestion: ChatMessage['columnSuggestion']) => {
    if (!suggestion || columns.length >= 5) return;

    const newColumn: TableColumn = {
      id: `col-${Date.now()}`,
      name: suggestion.name,
      prompt: suggestion.prompt,
      outputType: suggestion.outputType,
      order: columns.length,
    };
    setColumns([...columns, newColumn]);
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b px-4 py-3 flex items-center justify-between bg-card">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-1.5 rounded-lg hover:bg-accent transition-colors"
            >
              <ChevronLeft className="size-5" />
            </button>
          )}
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Table2 className="size-4 text-primary" />
            </div>
            <div>
              <h1 className="font-semibold">{tableName}</h1>
              {lastRunAt && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="size-3" />
                  Last run: {lastRunAt.toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Preview Button */}
          {columns.length > 0 && !hasRun && (
            <button
              onClick={handleRun}
              disabled={isRunning}
              className="px-4 py-2 text-sm bg-muted hover:bg-accent rounded-lg transition-colors flex items-center gap-2"
            >
              <Play className="size-4" />
              Preview (5 rows)
            </button>
          )}

          {/* Run Button */}
          {columns.length > 0 && (
            <button
              onClick={handleRun}
              disabled={isRunning}
              className={cn(
                'px-4 py-2 text-sm rounded-lg transition-colors flex items-center gap-2',
                isRunning
                  ? 'bg-primary/50 cursor-not-allowed'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90'
              )}
            >
              {isRunning ? (
                <>
                  <RotateCcw className="size-4 animate-spin" />
                  Running...
                </>
              ) : hasRun ? (
                <>
                  <RotateCcw className="size-4" />
                  Re-run
                </>
              ) : (
                <>
                  <Play className="size-4" />
                  Run on {filteredEngagements.length} rows
                </>
              )}
            </button>
          )}

          {/* Save Button */}
          <button
            className="px-4 py-2 text-sm border rounded-lg hover:bg-accent transition-colors flex items-center gap-2"
          >
            <Save className="size-4" />
            Save
          </button>

          {/* Export Button */}
          {hasRun && (
            <button
              className="px-4 py-2 text-sm border rounded-lg hover:bg-accent transition-colors flex items-center gap-2"
            >
              <Download className="size-4" />
              Export
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex min-h-0">
        {/* Filter Panel */}
        <FilterPanel
          filters={filters}
          onFiltersChange={setFilters}
          matchingCount={filteredEngagements.length}
          isCollapsed={filterCollapsed}
          onToggleCollapse={() => setFilterCollapsed(!filterCollapsed)}
        />

        {/* Center: Table */}
        <div className="flex-1 flex flex-col min-w-0">
          <TableView
            engagements={filteredEngagements}
            columns={columns}
            columnResults={columnResults}
            isRunning={isRunning}
            progress={progress}
            onRowClick={(engagement) => console.log('Open engagement:', engagement)}
          />

          {/* Chat Input */}
          <ChatInput
            onSendMessage={handleChatMessage}
            onAddColumn={handleAddColumnFromChat}
            isProcessing={isChatProcessing}
            messages={chatMessages}
            placeholder="Describe what you want to extract... (e.g., 'I want to know if competitors were mentioned')"
          />
        </div>

        {/* Builder Panel */}
        <BuilderPanel
          columns={columns}
          onColumnsChange={setColumns}
          isCollapsed={builderCollapsed}
          onToggleCollapse={() => setBuilderCollapsed(!builderCollapsed)}
        />
      </div>
    </div>
  );
}

