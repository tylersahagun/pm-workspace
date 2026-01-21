import * as React from 'react';
import { Account, Meeting, ActionItem, ChatMessage, STAGE_CONFIG, HEALTH_CONFIG } from './types';

// ============================================
// DEAL WORKSPACE PANEL - Per-Deal AI Chat
// Maple Feedback: "Talk with the deal property"
// "Per account basis or per deal basis"
// ============================================

interface DealWorkspacePanelProps {
  account: Account;
  recentMeetings: Meeting[];
  openActions: ActionItem[];
  suggestedQuestions?: string[];
  onClose: () => void;
  onSendMessage?: (message: string) => void;
  onActionComplete?: (id: string) => void;
  onMeetingClick?: (id: string) => void;
}

export function DealWorkspacePanel({
  account,
  recentMeetings,
  openActions,
  suggestedQuestions = DEFAULT_SUGGESTIONS,
  onClose,
  onSendMessage,
  onActionComplete,
  onMeetingClick,
}: DealWorkspacePanelProps) {
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = React.useState('');
  const [isTyping, setIsTyping] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const stageConfig = STAGE_CONFIG[account.stage];
  const healthConfig = HEALTH_CONFIG[account.health];

  // Auto-scroll to bottom on new messages
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: inputValue,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        role: 'assistant',
        content: generateMockResponse(inputValue, account),
        timestamp: new Date().toISOString(),
        sources: ['Discovery Call - Jan 20', 'Product Demo - Jan 18'],
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);

    onSendMessage?.(inputValue);
  };

  const handleSuggestionClick = (question: string) => {
    setInputValue(question);
  };

  return (
    <div className="fixed inset-y-0 right-0 w-[500px] bg-white shadow-2xl border-l flex flex-col z-50">
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="font-semibold text-gray-900 truncate">{account.name}</h2>
              <span className={`text-xs px-2 py-0.5 rounded-full ${healthConfig.bgColor} ${healthConfig.color}`}>
                {healthConfig.icon} {healthConfig.label}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <span className={`${stageConfig.color}`}>{stageConfig.label}</span>
              <span>•</span>
              <span className="font-medium">${(account.dealValue / 1000).toFixed(0)}K</span>
              <span>•</span>
              <span>{account.meetingCount} meetings</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Deal Context Sidebar - Collapsible */}
      <DealContextSummary
        account={account}
        recentMeetings={recentMeetings}
        openActions={openActions}
        onActionComplete={onActionComplete}
        onMeetingClick={onMeetingClick}
      />

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="font-medium text-gray-900 mb-1">Ask about {account.name}</h3>
            <p className="text-sm text-gray-500 mb-4">
              I have context from {account.meetingCount} meetings and your CRM data.
            </p>
            
            {/* Suggested Questions */}
            <div className="space-y-2">
              {suggestedQuestions.slice(0, 4).map((question, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestionClick(question)}
                  className="block w-full text-left text-sm px-3 py-2 bg-white border rounded-lg hover:bg-indigo-50 hover:border-indigo-200 transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <ChatMessageBubble key={msg.id} message={msg} />
            ))}
            {isTyping && (
              <div className="flex items-center gap-2 text-gray-500">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-sm">Thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t bg-white">
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={`Ask about ${account.name}...`}
              className="w-full px-4 py-3 border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              rows={1}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2 text-center">
          AI responses are based on your meeting transcripts and CRM data
        </p>
      </div>
    </div>
  );
}

// ============================================
// Deal Context Summary - Collapsible info panel
// ============================================

interface DealContextSummaryProps {
  account: Account;
  recentMeetings: Meeting[];
  openActions: ActionItem[];
  onActionComplete?: (id: string) => void;
  onMeetingClick?: (id: string) => void;
}

function DealContextSummary({
  account,
  recentMeetings,
  openActions,
  onActionComplete,
  onMeetingClick,
}: DealContextSummaryProps) {
  const [isExpanded, setIsExpanded] = React.useState(true);

  return (
    <div className="border-b">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-2 flex items-center justify-between text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        <span>Deal Context</span>
        <svg
          className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="px-4 pb-3 space-y-3">
          {/* Key Contacts */}
          <div>
            <h4 className="text-xs font-medium text-gray-500 uppercase mb-1">Key Contacts</h4>
            <div className="flex flex-wrap gap-1">
              {account.keyContacts.map((contact) => (
                <span
                  key={contact.id}
                  className="text-xs px-2 py-1 bg-gray-100 rounded-full"
                >
                  {contact.name} • {contact.role}
                </span>
              ))}
            </div>
          </div>

          {/* Next Step */}
          {account.nextStep && (
            <div>
              <h4 className="text-xs font-medium text-gray-500 uppercase mb-1">Next Step</h4>
              <p className="text-sm text-gray-700">{account.nextStep}</p>
            </div>
          )}

          {/* Recent Meetings */}
          <div>
            <h4 className="text-xs font-medium text-gray-500 uppercase mb-1">Recent Meetings</h4>
            <div className="space-y-1">
              {recentMeetings.slice(0, 3).map((meeting) => (
                <button
                  key={meeting.id}
                  onClick={() => onMeetingClick?.(meeting.id)}
                  className="w-full text-left text-xs px-2 py-1.5 bg-gray-50 rounded hover:bg-gray-100 flex items-center justify-between"
                >
                  <span className="truncate">{meeting.title}</span>
                  <span className="text-gray-400 flex-shrink-0 ml-2">
                    {new Date(meeting.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Open Actions */}
          {openActions.length > 0 && (
            <div>
              <h4 className="text-xs font-medium text-gray-500 uppercase mb-1">
                Open Actions ({openActions.length})
              </h4>
              <div className="space-y-1">
                {openActions.slice(0, 2).map((action) => (
                  <div
                    key={action.id}
                    className="flex items-center gap-2 text-xs px-2 py-1.5 bg-amber-50 rounded"
                  >
                    <button
                      onClick={() => onActionComplete?.(action.id)}
                      className="w-4 h-4 rounded border border-amber-400 hover:bg-amber-200 flex-shrink-0"
                    />
                    <span className="truncate">{action.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================
// Chat Message Bubble
// ============================================

interface ChatMessageBubbleProps {
  message: ChatMessage;
}

function ChatMessageBubble({ message }: ChatMessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2 ${
          isUser
            ? 'bg-indigo-600 text-white rounded-br-md'
            : 'bg-white border shadow-sm rounded-bl-md'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        
        {/* Sources */}
        {message.sources && message.sources.length > 0 && (
          <div className="mt-2 pt-2 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-1">Sources:</p>
            <div className="flex flex-wrap gap-1">
              {message.sources.map((source, i) => (
                <span
                  key={i}
                  className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded"
                >
                  📄 {source}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// Default Suggestions
// ============================================

const DEFAULT_SUGGESTIONS = [
  "What objections did they mention in our last call?",
  "Who are the key stakeholders I should know about?",
  "What's blocking this deal from moving forward?",
  "Summarize our conversation history",
  "What questions should I ask in our next meeting?",
  "What competitor concerns have they raised?",
];

// ============================================
// Mock Response Generator
// ============================================

function generateMockResponse(question: string, account: Account): string {
  const questionLower = question.toLowerCase();
  
  if (questionLower.includes('objection')) {
    return `Based on your last call with ${account.name} on ${account.lastMeetingDate}, the main objections mentioned were:\n\n1. **Pricing concerns** - They mentioned the budget might be tight for Q1\n2. **Implementation timeline** - Worried about resource availability\n3. **Integration complexity** - Questions about HubSpot sync\n\nI'd recommend addressing the pricing concern first by emphasizing ROI in your next conversation.`;
  }
  
  if (questionLower.includes('stakeholder') || questionLower.includes('contact')) {
    const contacts = account.keyContacts.map(c => `• **${c.name}** (${c.role})`).join('\n');
    return `Here are the key stakeholders at ${account.name}:\n\n${contacts}\n\nBased on your conversations, ${account.keyContacts[0]?.name || 'the main contact'} appears to be your champion. They've been most engaged in discussing business outcomes.`;
  }
  
  if (questionLower.includes('block') || questionLower.includes('forward')) {
    return `Looking at ${account.name}'s deal progress, here's what might be blocking movement:\n\n1. **Decision timeline unclear** - They haven't confirmed when they'll make a decision\n2. **Missing stakeholder** - CFO hasn't been in any calls yet\n3. **Technical validation pending** - They mentioned wanting a technical deep-dive\n\nSuggested next step: ${account.nextStep || 'Schedule a call with the CFO to discuss budget approval'}`;
  }
  
  if (questionLower.includes('summarize') || questionLower.includes('history')) {
    return `Here's a summary of your relationship with ${account.name}:\n\n**Timeline:** ${account.meetingCount} meetings over the past few months\n**Current Stage:** ${STAGE_CONFIG[account.stage].label}\n**Deal Value:** $${(account.dealValue / 1000).toFixed(0)}K\n**Health:** ${HEALTH_CONFIG[account.health].label}\n\n**Key Moments:**\n• Initial discovery focused on workflow automation needs\n• Strong interest shown during product demo\n• Some hesitation around pricing in recent conversations\n\n**Next Step:** ${account.nextStep || 'Follow up on proposal'}`;
  }
  
  return `Based on your conversations with ${account.name}, here's what I found relevant to your question:\n\nThe deal is currently in the **${STAGE_CONFIG[account.stage].label}** stage with a value of **$${(account.dealValue / 1000).toFixed(0)}K**. Your main contact has been engaged, and the next recommended step is: "${account.nextStep || 'Schedule follow-up'}"\n\nWould you like me to elaborate on any specific aspect?`;
}

export default DealWorkspacePanel;
