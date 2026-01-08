/**
 * VARIANT B: Chat-Central Tables
 * 
 * Balanced AI emphasis - Chat takes center stage but table/builder 
 * are always visible. Chat drives the experience while showing 
 * what it's building in real-time.
 * 
 * Inspired by: Cursor's chat + editor side-by-side
 */

import * as React from 'react';
import {
  Sparkles,
  Send,
  Loader2,
  Table2,
  Layers,
  Play,
  Save,
  Download,
  ChevronRight,
  ChevronLeft,
  Link2,
  Check,
  X,
  SkipForward,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  SAMPLE_ENGAGEMENTS,
  SAMPLE_COLUMN_RESULTS,
  type TableColumn,
  type ColumnResult,
} from '../types';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  action?: 'add_column' | 'update_filter' | 'run_table';
  actionData?: any;
}

export function ChatCentralTables() {
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "What would you like to learn from your calls? I'll build the table for you.",
    },
  ]);
  const [input, setInput] = React.useState('');
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [columns, setColumns] = React.useState<TableColumn[]>([]);
  const [hasResults, setHasResults] = React.useState(false);
  const [isRunning, setIsRunning] = React.useState(false);

  const chatEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (message: string) => {
    if (!message.trim() || isProcessing) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: message,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsProcessing(true);

    await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 800));

    const lower = message.toLowerCase();
    let response: ChatMessage;

    if (lower.includes('competitor')) {
      const newCol: TableColumn = {
        id: `col-${Date.now()}`,
        name: 'Competitor Mentioned',
        prompt: 'Was any competitor mentioned in this call? Yes/No',
        outputType: 'boolean',
        order: columns.length,
      };
      setColumns((prev) => [...prev, newCol]);

      response = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: '✅ Added "Competitor Mentioned" column. Want me to also track which competitor was mentioned?',
        action: 'add_column',
        actionData: newCol,
      };
    } else if (lower.includes('which') || lower.includes('details') || lower.includes('yes')) {
      if (columns.length > 0) {
        const newCol: TableColumn = {
          id: `col-${Date.now()}`,
          name: 'Which Competitor',
          prompt: 'Which competitor was mentioned? List names.',
          outputType: 'text',
          order: columns.length,
          condition: {
            dependsOnColumnId: columns[columns.length - 1].id,
            operator: 'equals',
            value: 'Yes',
          },
        };
        setColumns((prev) => [...prev, newCol]);

        response = {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: '✅ Added "Which Competitor" column with conditional execution (only runs if competitor was mentioned). Ready to run on 8 engagements?',
          action: 'add_column',
          actionData: newCol,
        };
      } else {
        response = {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: "Let me add a column for that. What specifically do you want to track?",
        };
      }
    } else if (lower.includes('run') || lower.includes('go')) {
      setIsRunning(true);
      response = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: '🔄 Running extraction on 8 engagements...',
        action: 'run_table',
      };

      setTimeout(() => {
        setIsRunning(false);
        setHasResults(true);
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-done-${Date.now()}`,
            role: 'assistant',
            content: '✅ Done! Found competitors in 4 of 8 calls. Gong was mentioned most (3 times). Any other analysis you want to run?',
          },
        ]);
      }, 2500);
    } else if (lower.includes('objection')) {
      const newCol: TableColumn = {
        id: `col-${Date.now()}`,
        name: 'Objection Raised',
        prompt: 'Was any objection or concern raised? Yes/No',
        outputType: 'boolean',
        order: columns.length,
      };
      setColumns((prev) => [...prev, newCol]);

      response = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: '✅ Added "Objection Raised" column. Want me to categorize the types of objections too?',
        action: 'add_column',
      };
    } else {
      response = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: `I can help with that! Here are some columns I can create:\n\n• **Competitor mentions** - track when competitors come up\n• **Objections** - identify concerns raised\n• **Next steps** - extract commitments made\n• **Custom** - just describe what you need\n\nWhat would you like?`,
      };
    }

    setMessages((prev) => [...prev, response]);
    setIsProcessing(false);
  };

  const renderCellValue = (result: ColumnResult | undefined) => {
    if (!result) return <span className="text-muted-foreground">—</span>;
    
    if (result.status === 'skipped') {
      return (
        <span className="text-muted-foreground text-xs flex items-center gap-1">
          <SkipForward className="size-3" /> skipped
        </span>
      );
    }
    
    if (result.value === 'Yes') {
      return (
        <span className="text-green-600 flex items-center gap-1">
          <Check className="size-3" /> Yes
        </span>
      );
    }
    if (result.value === 'No') {
      return (
        <span className="text-muted-foreground flex items-center gap-1">
          <X className="size-3" /> No
        </span>
      );
    }
    
    return <span>{String(result.value)}</span>;
  };

  return (
    <div className="h-screen flex bg-background">
      {/* Left: Chat Panel (Primary) */}
      <div className="w-[400px] border-r flex flex-col bg-card">
        <div className="p-4 border-b flex items-center gap-3">
          <div className="size-9 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
            <Sparkles className="size-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold">AI Assistant</h2>
            <p className="text-xs text-muted-foreground">Building your table</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                'flex gap-2',
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {msg.role === 'assistant' && (
                <div className="size-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="size-3.5 text-primary" />
                </div>
              )}
              <div
                className={cn(
                  'max-w-[85%] px-3 py-2 rounded-lg text-sm',
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                )}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
                {msg.action === 'add_column' && (
                  <div className="mt-2 p-2 rounded bg-green-500/10 border border-green-500/20 text-xs text-green-600">
                    Column added to builder →
                  </div>
                )}
              </div>
            </div>
          ))}
          {isProcessing && (
            <div className="flex gap-2">
              <div className="size-7 rounded-full bg-primary/10 flex items-center justify-center">
                <Loader2 className="size-3.5 text-primary animate-spin" />
              </div>
              <div className="px-3 py-2 rounded-lg bg-muted text-sm text-muted-foreground">
                Thinking...
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="p-4 border-t">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
              placeholder="Describe what you want..."
              className="flex-1 px-3 py-2 text-sm rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <button
              onClick={() => handleSend(input)}
              disabled={!input.trim() || isProcessing}
              className="p-2 rounded-lg bg-primary text-primary-foreground disabled:opacity-50"
            >
              <Send className="size-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Center: Live Table Preview */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Table2 className="size-5 text-muted-foreground" />
            <span className="font-medium">Table Preview</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
              8 engagements
            </span>
          </div>
          <div className="flex gap-2">
            {columns.length > 0 && !hasResults && (
              <button
                onClick={() => handleSend('run it')}
                disabled={isRunning}
                className="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 flex items-center gap-1.5"
              >
                {isRunning ? <Loader2 className="size-4 animate-spin" /> : <Play className="size-4" />}
                {isRunning ? 'Running...' : 'Run'}
              </button>
            )}
            {hasResults && (
              <>
                <button className="px-3 py-1.5 text-sm border rounded-lg hover:bg-accent flex items-center gap-1.5">
                  <Save className="size-4" /> Save
                </button>
                <button className="px-3 py-1.5 text-sm border rounded-lg hover:bg-accent flex items-center gap-1.5">
                  <Download className="size-4" /> Export
                </button>
              </>
            )}
          </div>
        </div>

        {/* Progress */}
        {isRunning && (
          <div className="px-4 py-2 bg-primary/5 border-b">
            <div className="flex items-center gap-3">
              <Loader2 className="size-4 animate-spin text-primary" />
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary w-1/2 animate-pulse" />
              </div>
              <span className="text-xs text-muted-foreground">Processing...</span>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-muted/80 backdrop-blur-sm">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Engagement</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Rep</th>
                {columns.map((col) => (
                  <th key={col.id} className="text-left px-4 py-3 font-medium text-muted-foreground">
                    <div className="flex items-center gap-1">
                      {col.name}
                      {col.condition && <Link2 className="size-3 text-amber-500" />}
                    </div>
                  </th>
                ))}
                {columns.length === 0 && (
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground/50 italic">
                    AI columns will appear here...
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y">
              {SAMPLE_ENGAGEMENTS.map((eng) => {
                const results = hasResults ? (SAMPLE_COLUMN_RESULTS[eng.id] || {}) : {};
                return (
                  <tr key={eng.id} className="hover:bg-accent/50">
                    <td className="px-4 py-3">
                      <p className="font-medium">{eng.title}</p>
                      <p className="text-xs text-muted-foreground">{eng.company}</p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{eng.rep.split(' ')[0]}</td>
                    {columns.map((col) => (
                      <td key={col.id} className="px-4 py-3">
                        {hasResults ? (
                          renderCellValue(results[col.id])
                        ) : isRunning ? (
                          <Loader2 className="size-4 animate-spin text-muted-foreground" />
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                    ))}
                    {columns.length === 0 && <td className="px-4 py-3" />}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right: Live Builder Panel */}
      <div className="w-72 border-l bg-muted/30 flex flex-col">
        <div className="p-4 border-b flex items-center gap-2">
          <Layers className="size-5 text-muted-foreground" />
          <span className="font-medium">Builder</span>
          <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground ml-auto">
            {columns.length}/5
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {columns.length === 0 ? (
            <div className="py-8 text-center">
              <Sparkles className="size-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                Chat with AI to add columns
              </p>
            </div>
          ) : (
            columns.map((col, i) => (
              <div
                key={col.id}
                className="p-3 rounded-lg border bg-card animate-in slide-in-from-right-2"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-muted-foreground">#{i + 1}</span>
                  <span className="font-medium text-sm">{col.name}</span>
                  {col.condition && <Link2 className="size-3 text-amber-500" />}
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{col.prompt}</p>
                {col.condition && (
                  <p className="text-xs text-amber-600 mt-1">
                    Only if #{columns.findIndex((c) => c.id === col.condition?.dependsOnColumnId) + 1} = Yes
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

