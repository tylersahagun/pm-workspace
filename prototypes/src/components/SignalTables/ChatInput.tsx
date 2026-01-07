import * as React from 'react';
import { Send, Sparkles, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

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

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onAddColumn?: (suggestion: ChatMessage['columnSuggestion']) => void;
  isProcessing?: boolean;
  messages?: ChatMessage[];
  placeholder?: string;
}

export function ChatInput({
  onSendMessage,
  onAddColumn,
  isProcessing = false,
  messages = [],
  placeholder = 'Describe what you want to extract...',
}: ChatInputProps) {
  const [input, setInput] = React.useState('');
  const [isExpanded, setIsExpanded] = React.useState(false);
  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;
    onSendMessage(input.trim());
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t bg-background">
      {/* Message History (when expanded) */}
      {isExpanded && messages.length > 0 && (
        <div className="max-h-64 overflow-y-auto p-4 space-y-3 border-b">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex gap-3',
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.role === 'assistant' && (
                <div className="size-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="size-3.5 text-primary" />
                </div>
              )}
              <div
                className={cn(
                  'max-w-[80%] px-3 py-2 rounded-lg text-sm',
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                )}
              >
                <p>{message.content}</p>
                {message.columnSuggestion && (
                  <div className="mt-2 p-2 rounded bg-background/50 border">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-xs">
                        {message.columnSuggestion.name}
                      </span>
                      <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                        {message.columnSuggestion.outputType}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {message.columnSuggestion.prompt}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => onAddColumn?.(message.columnSuggestion)}
                        className="px-2 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
                      >
                        Add Column
                      </button>
                      <button className="px-2 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                        Modify
                      </button>
                    </div>
                  </div>
                )}
              </div>
              {message.role === 'user' && (
                <div className="size-6 rounded-full bg-muted flex items-center justify-center flex-shrink-0 text-xs font-medium">
                  Y
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-4">
        <div className="flex items-end gap-3">
          <div className="flex-1 relative">
            <div className="absolute left-3 top-3">
              <Sparkles className="size-4 text-muted-foreground" />
            </div>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsExpanded(true)}
              placeholder={placeholder}
              disabled={isProcessing}
              rows={1}
              className={cn(
                'w-full pl-10 pr-4 py-3 text-sm rounded-lg border border-input bg-background resize-none',
                'placeholder:text-muted-foreground',
                'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'transition-all'
              )}
              style={{
                minHeight: '48px',
                maxHeight: '120px',
              }}
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isProcessing}
            className={cn(
              'p-3 rounded-lg transition-all',
              input.trim() && !isProcessing
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'bg-muted text-muted-foreground'
            )}
          >
            {isProcessing ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <Send className="size-5" />
            )}
          </button>
        </div>
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-muted-foreground">
            Try: "I want to know if competitors were mentioned"
          </p>
          {messages.length > 0 && (
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs text-primary hover:underline"
            >
              {isExpanded ? 'Hide history' : `Show history (${messages.length})`}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

