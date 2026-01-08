/**
 * VARIANT A: Chat-First Tables
 * 
 * Maximum AI emphasis - Chat is the primary interface.
 * Table appears as an "artifact" that the AI builds.
 * Builder panel is hidden by default.
 * 
 * Inspired by: Claude's artifacts, Cursor's agent mode
 */

import * as React from 'react';
import {
  Sparkles,
  Send,
  Loader2,
  Table2,
  Settings,
  Play,
  Save,
  X,
  Check,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  SAMPLE_ENGAGEMENTS,
  SAMPLE_COLUMN_RESULTS,
  type TableColumn,
  type Engagement,
  type ColumnResult,
} from '../types';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  artifact?: {
    type: 'table_config' | 'table_preview' | 'thinking';
    data?: any;
  };
}

export function ChatFirstTables() {
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hi! I'm here to help you analyze your team's calls. What would you like to learn from your engagements?",
    },
  ]);
  const [input, setInput] = React.useState('');
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [showConfig, setShowConfig] = React.useState(false);
  const [tableConfig, setTableConfig] = React.useState<{
    filters: any;
    columns: TableColumn[];
  } | null>(null);
  const [hasResults, setHasResults] = React.useState(false);

  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateAIResponse = async (userMessage: string) => {
    setIsProcessing(true);

    // Add thinking message
    const thinkingId = `thinking-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      {
        id: thinkingId,
        role: 'assistant',
        content: '',
        artifact: { type: 'thinking' },
      },
    ]);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Remove thinking, add response
    const lowerMessage = userMessage.toLowerCase();
    let response: ChatMessage;

    if (lowerMessage.includes('competitor')) {
      const columns: TableColumn[] = [
        {
          id: 'col-1',
          name: 'Competitor Mentioned',
          prompt: 'Was any competitor mentioned? Yes/No',
          outputType: 'boolean',
          order: 0,
        },
        {
          id: 'col-2',
          name: 'Which Competitor',
          prompt: 'If mentioned, which competitor?',
          outputType: 'text',
          order: 1,
          condition: { dependsOnColumnId: 'col-1', operator: 'equals', value: 'Yes' },
        },
      ];

      setTableConfig({
        filters: { dateRange: 'Last 30 days', reps: 'All' },
        columns,
      });

      response = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: "I've set up a competitor analysis for you. Here's what I'll extract from your last 30 days of calls:",
        artifact: {
          type: 'table_config',
          data: { columns, matchCount: 8 },
        },
      };
    } else if (lowerMessage.includes('run') || lowerMessage.includes('go') || lowerMessage.includes('yes')) {
      setHasResults(true);
      response = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: "Done! I've analyzed 8 calls. Here's what I found:",
        artifact: {
          type: 'table_preview',
          data: { results: SAMPLE_COLUMN_RESULTS },
        },
      };
    } else {
      response = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: `I can help you analyze that. Would you like me to:\n\n• Track **competitor mentions** across calls\n• Identify **objections** that come up\n• Find **pricing discussions**\n• Extract **next steps** commitments\n\nJust tell me what you're curious about!`,
      };
    }

    setMessages((prev) => prev.filter((m) => m.id !== thinkingId).concat(response));
    setIsProcessing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    simulateAIResponse(userMessage.content);
  };

  const renderArtifact = (artifact: ChatMessage['artifact']) => {
    if (!artifact) return null;

    switch (artifact.type) {
      case 'thinking':
        return (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            <span className="text-sm">Thinking...</span>
          </div>
        );

      case 'table_config':
        return (
          <div className="mt-3 p-4 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Table2 className="size-5 text-primary" />
                <span className="font-medium">Table Configuration</span>
              </div>
              <button
                onClick={() => setShowConfig(true)}
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                View details <ChevronRight className="size-3" />
              </button>
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-muted-foreground">
                📊 <strong>{artifact.data.matchCount}</strong> engagements match
              </p>
              <div className="flex flex-wrap gap-1.5">
                {artifact.data.columns.map((col: TableColumn) => (
                  <span
                    key={col.id}
                    className="px-2 py-1 rounded-full bg-background text-xs border"
                  >
                    {col.name}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => {
                  setMessages((prev) => [
                    ...prev,
                    { id: 'run', role: 'user', content: 'Run it!' },
                  ]);
                  simulateAIResponse('run it');
                }}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                <Play className="size-4" />
                Run Analysis
              </button>
              <button className="px-4 py-2 border rounded-lg text-sm hover:bg-accent transition-colors">
                Modify
              </button>
            </div>
          </div>
        );

      case 'table_preview':
        return (
          <div className="mt-3 rounded-xl border overflow-hidden">
            <div className="bg-muted/50 px-4 py-2 border-b flex items-center justify-between">
              <span className="font-medium text-sm">Results</span>
              <div className="flex gap-2">
                <button className="text-xs text-primary hover:underline">Export</button>
                <button className="text-xs text-primary hover:underline">Save Table</button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/30">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">Engagement</th>
                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">Competitor?</th>
                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">Which</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {SAMPLE_ENGAGEMENTS.slice(0, 5).map((eng) => {
                    const results = SAMPLE_COLUMN_RESULTS[eng.id] || {};
                    return (
                      <tr key={eng.id} className="hover:bg-accent/50">
                        <td className="px-4 py-2">{eng.title}</td>
                        <td className="px-4 py-2">
                          {results['col-1']?.value === 'Yes' ? (
                            <span className="text-green-600 flex items-center gap-1">
                              <Check className="size-3" /> Yes
                            </span>
                          ) : results['col-1']?.value === 'No' ? (
                            <span className="text-muted-foreground flex items-center gap-1">
                              <X className="size-3" /> No
                            </span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="px-4 py-2 text-muted-foreground">
                          {results['col-2']?.value || '—'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="bg-muted/30 px-4 py-2 text-xs text-muted-foreground">
              Showing 5 of 8 results • 4 competitors found • 1 extraction error
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex bg-background">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col max-w-3xl mx-auto">
        {/* Header */}
        <header className="px-6 py-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
              <Sparkles className="size-5 text-white" />
            </div>
            <div>
              <h1 className="font-semibold">Signal Tables</h1>
              <p className="text-xs text-muted-foreground">Chat-First Mode</p>
            </div>
          </div>
          {tableConfig && (
            <button
              onClick={() => setShowConfig(true)}
              className="p-2 rounded-lg hover:bg-accent transition-colors"
            >
              <Settings className="size-5 text-muted-foreground" />
            </button>
          )}
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex gap-3',
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.role === 'assistant' && (
                <div className="size-8 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="size-4 text-white" />
                </div>
              )}
              <div
                className={cn(
                  'max-w-[85%]',
                  message.role === 'user' && 'order-first'
                )}
              >
                {message.content && (
                  <div
                    className={cn(
                      'px-4 py-3 rounded-2xl',
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-md'
                        : 'bg-muted rounded-bl-md'
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                )}
                {message.artifact && renderArtifact(message.artifact)}
              </div>
              {message.role === 'user' && (
                <div className="size-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 text-sm font-medium">
                  Y
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-6 border-t">
          <form onSubmit={handleSubmit} className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Ask me anything about your calls..."
              disabled={isProcessing}
              className="w-full px-4 py-3 pr-12 rounded-xl border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50"
              rows={1}
            />
            <button
              type="submit"
              disabled={!input.trim() || isProcessing}
              className={cn(
                'absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-colors',
                input.trim() && !isProcessing
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              {isProcessing ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <Send className="size-5" />
              )}
            </button>
          </form>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Try: "Which competitors came up in calls this month?"
          </p>
        </div>
      </div>

      {/* Config Sidebar (Hidden by default) */}
      {showConfig && tableConfig && (
        <div className="w-80 border-l bg-card p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Configuration</h3>
            <button onClick={() => setShowConfig(false)}>
              <X className="size-4" />
            </button>
          </div>
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground mb-1">Date Range</p>
              <p className="text-sm font-medium">{tableConfig.filters.dateRange}</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground mb-1">Reps</p>
              <p className="text-sm font-medium">{tableConfig.filters.reps}</p>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Columns</p>
              {tableConfig.columns.map((col, i) => (
                <div key={col.id} className="p-2 rounded border bg-background">
                  <p className="text-sm font-medium">{col.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{col.prompt}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

