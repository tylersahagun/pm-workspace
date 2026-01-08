/**
 * VARIANT C: Chat-Companion Tables
 * 
 * Minimal AI emphasis - Traditional table/builder as primary interface.
 * Chat is a floating companion that provides assistance when needed.
 * 
 * Inspired by: GitHub Copilot inline, VS Code chat panel
 */

import * as React from 'react';
import {
  Sparkles,
  Send,
  Plus,
  Trash2,
  GripVertical,
  ChevronDown,
  Check,
  X,
  SkipForward,
  Loader2,
  MessageCircle,
  Minimize2,
  Maximize2,
  Calendar,
  Users,
  Filter,
  Link2,
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
}

export function ChatCompanionTables() {
  const [columns, setColumns] = React.useState<TableColumn[]>([]);
  const [hasResults, setHasResults] = React.useState(false);
  const [isRunning, setIsRunning] = React.useState(false);
  const [showNewColumn, setShowNewColumn] = React.useState(false);
  const [newColumnName, setNewColumnName] = React.useState('');
  const [newColumnPrompt, setNewColumnPrompt] = React.useState('');

  // Chat companion state
  const [chatOpen, setChatOpen] = React.useState(true);
  const [chatMinimized, setChatMinimized] = React.useState(false);
  const [chatInput, setChatInput] = React.useState('');
  const [chatMessages, setChatMessages] = React.useState<ChatMessage[]>([
    {
      id: 'tip',
      role: 'assistant',
      content: 'Tip: I can help you write column prompts. Try describing what you want to extract!',
    },
  ]);

  const addColumn = () => {
    if (!newColumnName.trim()) return;
    const col: TableColumn = {
      id: `col-${Date.now()}`,
      name: newColumnName,
      prompt: newColumnPrompt || `Extract ${newColumnName.toLowerCase()} from the conversation`,
      outputType: 'text',
      order: columns.length,
    };
    setColumns((prev) => [...prev, col]);
    setNewColumnName('');
    setNewColumnPrompt('');
    setShowNewColumn(false);
    setHasResults(false);
  };

  const deleteColumn = (id: string) => {
    setColumns((prev) => prev.filter((c) => c.id !== id));
    setHasResults(false);
  };

  const runTable = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setHasResults(true);
    }, 2000);
  };

  const handleChatSend = () => {
    if (!chatInput.trim()) return;

    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: 'user', content: chatInput };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput('');

    // Simulate AI response
    setTimeout(() => {
      const lower = chatInput.toLowerCase();
      let response: string;

      if (lower.includes('competitor')) {
        setNewColumnName('Competitor Mentioned');
        setNewColumnPrompt('Was any competitor mentioned in this call? If yes, list which ones.');
        setShowNewColumn(true);
        response = 'I\'ve pre-filled a column for competitor tracking. Click "Add Column" to confirm, or edit it first!';
      } else if (lower.includes('objection') || lower.includes('concern')) {
        setNewColumnName('Objections');
        setNewColumnPrompt('What objections or concerns did the prospect raise?');
        setShowNewColumn(true);
        response = 'Created an objections column for you. Review and add it when ready.';
      } else if (lower.includes('help') || lower.includes('how')) {
        response = 'To build your table:\n1. Click "+ Add Column" to create extraction columns\n2. Write prompts describing what to extract\n3. Click "Run" to process your calls\n\nI can suggest prompts if you tell me what you\'re looking for!';
      } else {
        response = `I can help you create a column for that! Try clicking "+ Add Column" and describe what you want to extract.`;
      }

      setChatMessages((prev) => [...prev, { id: `a-${Date.now()}`, role: 'assistant', content: response }]);
    }, 600);
  };

  const renderCellValue = (result: ColumnResult | undefined) => {
    if (!result) return <span className="text-muted-foreground">—</span>;
    if (result.status === 'skipped') {
      return (
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          <SkipForward className="size-3" /> skipped
        </span>
      );
    }
    if (result.value === 'Yes') {
      return <Check className="size-4 text-green-600" />;
    }
    if (result.value === 'No') {
      return <X className="size-4 text-muted-foreground" />;
    }
    return <span className="truncate">{String(result.value)}</span>;
  };

  return (
    <div className="h-screen flex bg-background relative">
      {/* Left: Filter Sidebar */}
      <div className="w-56 border-r bg-muted/30 p-4 space-y-4">
        <h3 className="font-medium flex items-center gap-2">
          <Filter className="size-4" /> Filters
        </h3>

        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Date Range</label>
            <button className="w-full px-3 py-2 text-sm border rounded-lg bg-background flex items-center justify-between hover:bg-accent">
              <span className="flex items-center gap-2">
                <Calendar className="size-4 text-muted-foreground" />
                Last 30 days
              </span>
              <ChevronDown className="size-4 text-muted-foreground" />
            </button>
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Reps</label>
            <button className="w-full px-3 py-2 text-sm border rounded-lg bg-background flex items-center justify-between hover:bg-accent">
              <span className="flex items-center gap-2">
                <Users className="size-4 text-muted-foreground" />
                All reps
              </span>
              <ChevronDown className="size-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        <div className="pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            <strong>8</strong> engagements match
          </p>
        </div>
      </div>

      {/* Main: Table + Column Builder */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <div className="p-4 border-b flex items-center justify-between">
          <div>
            <h2 className="font-semibold">Signal Table</h2>
            <p className="text-xs text-muted-foreground">
              {columns.length} columns • 8 engagements
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowNewColumn(true)}
              className="px-3 py-1.5 text-sm border rounded-lg hover:bg-accent flex items-center gap-1.5"
            >
              <Plus className="size-4" /> Add Column
            </button>
            {columns.length > 0 && (
              <button
                onClick={runTable}
                disabled={isRunning}
                className="px-4 py-1.5 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 flex items-center gap-1.5 disabled:opacity-50"
              >
                {isRunning ? <Loader2 className="size-4 animate-spin" /> : null}
                {isRunning ? 'Running...' : 'Run Table'}
              </button>
            )}
          </div>
        </div>

        {/* Column Builder (inline) */}
        {showNewColumn && (
          <div className="p-4 border-b bg-muted/30">
            <div className="max-w-2xl space-y-3">
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-xs text-muted-foreground mb-1 block">Column Name</label>
                  <input
                    type="text"
                    value={newColumnName}
                    onChange={(e) => setNewColumnName(e.target.value)}
                    placeholder="e.g., Competitor Mentioned"
                    className="w-full px-3 py-2 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Extraction Prompt</label>
                <textarea
                  value={newColumnPrompt}
                  onChange={(e) => setNewColumnPrompt(e.target.value)}
                  placeholder="Describe what to extract from each call..."
                  rows={2}
                  className="w-full px-3 py-2 text-sm border rounded-lg bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={addColumn}
                  disabled={!newColumnName.trim()}
                  className="px-4 py-1.5 text-sm bg-primary text-primary-foreground rounded-lg disabled:opacity-50"
                >
                  Add Column
                </button>
                <button
                  onClick={() => {
                    setShowNewColumn(false);
                    setNewColumnName('');
                    setNewColumnPrompt('');
                  }}
                  className="px-4 py-1.5 text-sm border rounded-lg hover:bg-accent"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Progress bar */}
        {isRunning && (
          <div className="h-1 bg-muted">
            <div className="h-full bg-primary animate-pulse w-2/3" />
          </div>
        )}

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-muted/90 backdrop-blur-sm">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground w-[300px]">
                  Engagement
                </th>
                {columns.map((col) => (
                  <th key={col.id} className="text-left px-4 py-3 font-medium text-muted-foreground group">
                    <div className="flex items-center gap-2">
                      <GripVertical className="size-3 text-muted-foreground/50 opacity-0 group-hover:opacity-100 cursor-grab" />
                      {col.name}
                      {col.condition && <Link2 className="size-3 text-amber-500" />}
                      <button
                        onClick={() => deleteColumn(col.id)}
                        className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="size-3" />
                      </button>
                    </div>
                  </th>
                ))}
                {columns.length === 0 && (
                  <th className="text-left px-4 py-3 font-normal text-muted-foreground/60">
                    ← Add columns to start extracting data
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
                      <p className="text-xs text-muted-foreground">
                        {eng.company} • {eng.rep} • {eng.date}
                      </p>
                    </td>
                    {columns.map((col) => (
                      <td key={col.id} className="px-4 py-3 max-w-[200px]">
                        {hasResults ? (
                          renderCellValue(results[col.id])
                        ) : isRunning ? (
                          <Loader2 className="size-4 animate-spin text-muted-foreground" />
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                    ))}
                    {columns.length === 0 && <td />}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating Chat Companion */}
      {chatOpen && (
        <div
          className={cn(
            'absolute bottom-4 right-4 w-80 bg-card border rounded-xl shadow-lg overflow-hidden transition-all',
            chatMinimized ? 'h-12' : 'h-96'
          )}
        >
          {/* Chat Header */}
          <div
            className="px-3 py-2 bg-muted/50 border-b flex items-center justify-between cursor-pointer"
            onClick={() => setChatMinimized(!chatMinimized)}
          >
            <div className="flex items-center gap-2">
              <div className="size-6 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                <Sparkles className="size-3 text-white" />
              </div>
              <span className="font-medium text-sm">AI Assistant</span>
            </div>
            <div className="flex items-center gap-1">
              <button className="p-1 hover:bg-accent rounded">
                {chatMinimized ? <Maximize2 className="size-4" /> : <Minimize2 className="size-4" />}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setChatOpen(false);
                }}
                className="p-1 hover:bg-accent rounded"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

          {!chatMinimized && (
            <>
              {/* Messages */}
              <div className="h-[calc(100%-7rem)] overflow-y-auto p-3 space-y-3">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      'text-sm',
                      msg.role === 'user' ? 'text-right' : ''
                    )}
                  >
                    <div
                      className={cn(
                        'inline-block px-3 py-2 rounded-lg max-w-[90%]',
                        msg.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      )}
                    >
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="p-3 border-t">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleChatSend()}
                    placeholder="Ask for help..."
                    className="flex-1 px-3 py-1.5 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <button
                    onClick={handleChatSend}
                    disabled={!chatInput.trim()}
                    className="p-1.5 rounded-lg bg-primary text-primary-foreground disabled:opacity-50"
                  >
                    <Send className="size-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Floating toggle when chat closed */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="absolute bottom-4 right-4 size-12 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors"
        >
          <MessageCircle className="size-6" />
        </button>
      )}
    </div>
  );
}

