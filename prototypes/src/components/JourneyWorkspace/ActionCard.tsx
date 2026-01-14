import React, { useState } from 'react';
import {
  SuggestedAction,
  ActionPriority,
  AIEvidence,
  AIGeneratedContent,
  AIContentState,
} from './types';
import { ConfidenceIndicator } from './DealHealthIndicator';

// ============================================
// PRIORITY CONFIG
// ============================================

const PRIORITY_CONFIG: Record<
  ActionPriority,
  { label: string; color: string; bgColor: string; borderColor: string }
> = {
  critical: {
    label: 'Critical',
    color: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
  },
  high: {
    label: 'High',
    color: 'text-orange-700',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
  },
  medium: {
    label: 'Medium',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  low: {
    label: 'Low',
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
  },
};

// ============================================
// ACTION CARD - OPTION A (Maximum Control)
// ============================================

interface ActionCardProps {
  action: SuggestedAction;
  accountName: string;
  variant?: 'control' | 'balanced' | 'efficient';
  onExecute?: (actionId: string) => void;
  onDismiss?: (actionId: string) => void;
  onViewDetails?: (actionId: string) => void;
  showEvidence?: boolean;
}

export function ActionCard({
  action,
  accountName,
  variant = 'balanced',
  onExecute,
  onDismiss,
  onViewDetails,
  showEvidence = false,
}: ActionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDraftOpen, setIsDraftOpen] = useState(false);
  const [draftContent, setDraftContent] = useState(action.aiDraft?.content || '');
  const [draftState, setDraftState] = useState<AIContentState>(action.aiDraft?.state || 'idle');

  const priorityConfig = PRIORITY_CONFIG[action.priority];

  const handleExecute = () => {
    if (action.aiDraft && !isDraftOpen) {
      setIsDraftOpen(true);
    } else {
      setDraftState('sending');
      setTimeout(() => {
        setDraftState('sent');
        onExecute?.(action.id);
      }, 1500);
    }
  };

  const handleGenerateDraft = () => {
    setDraftState('generating');
    setTimeout(() => {
      setDraftContent(`Hi ${accountName},

I wanted to follow up on our recent conversation. Based on what we discussed, I think the next step would be...

[AI-generated content based on your conversation history]

Let me know if you have any questions.

Best regards`);
      setDraftState('ready');
      setIsDraftOpen(true);
    }, 2000);
  };

  // ============================================
  // OPTION A: Maximum Control
  // ============================================
  if (variant === 'control') {
    return (
      <div className={`border rounded-lg ${priorityConfig.borderColor} bg-white`}>
        {/* Header with all details visible */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs font-medium px-2 py-0.5 rounded ${priorityConfig.bgColor} ${priorityConfig.color}`}>
                  {priorityConfig.label}
                </span>
                <span className="text-xs text-gray-500">{accountName}</span>
                <ConfidenceIndicator confidence={action.confidence} />
              </div>
              <h4 className="font-medium text-gray-900">{action.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{action.description}</p>
            </div>
          </div>

          {/* Always visible: Impact + Due Date */}
          <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
            <span>📈 {action.estimatedImpact}</span>
            {action.dueDate && (
              <span>📅 Due: {new Date(action.dueDate).toLocaleDateString()}</span>
            )}
          </div>

          {/* Evidence Section - Always visible in control mode */}
          {action.evidence.length > 0 && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
              <h5 className="text-xs font-semibold text-gray-700 mb-2">
                Why this recommendation:
              </h5>
              {action.evidence.map((evidence, idx) => (
                <EvidenceItem key={idx} evidence={evidence} />
              ))}
            </div>
          )}
        </div>

        {/* Draft Section */}
        {isDraftOpen && action.aiDraft && (
          <div className="border-t p-4 bg-blue-50/50">
            <div className="flex items-center justify-between mb-2">
              <h5 className="text-sm font-medium text-gray-700">
                AI Draft - Review Before Sending
              </h5>
              <span className="text-xs text-gray-500">
                Edit freely • AI won't send without your approval
              </span>
            </div>
            {action.aiDraft.subject && (
              <input
                type="text"
                value={action.aiDraft.subject}
                className="w-full px-3 py-2 mb-2 text-sm border rounded bg-white"
                placeholder="Subject"
              />
            )}
            <textarea
              value={draftContent}
              onChange={(e) => setDraftContent(e.target.value)}
              className="w-full h-40 px-3 py-2 text-sm border rounded bg-white resize-none"
            />
            <div className="flex items-center gap-2 mt-2">
              <ConfidenceIndicator confidence={action.aiDraft.confidence} showLabel />
              <span className="text-xs text-gray-500">
                Based on {action.aiDraft.sources.length} sources
              </span>
            </div>
          </div>
        )}

        {/* Action Bar - Explicit approval required */}
        <div className="border-t p-3 flex items-center justify-between bg-gray-50">
          <button
            onClick={() => onDismiss?.(action.id)}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Not now
          </button>
          <div className="flex items-center gap-2">
            {!isDraftOpen && action.aiDraft && (
              <button
                onClick={() => setIsDraftOpen(true)}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-100"
              >
                Preview Draft
              </button>
            )}
            <button
              onClick={handleExecute}
              disabled={draftState === 'sending' || draftState === 'sent'}
              className={`px-4 py-1.5 text-sm font-medium rounded ${
                draftState === 'sent'
                  ? 'bg-green-600 text-white'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              } disabled:opacity-50`}
            >
              {draftState === 'sending' ? (
                <span className="flex items-center gap-2">
                  <LoadingSpinner size="sm" />
                  Sending...
                </span>
              ) : draftState === 'sent' ? (
                '✓ Sent'
              ) : isDraftOpen ? (
                'Approve & Send'
              ) : (
                'Review & Execute'
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // OPTION B: Balanced
  // ============================================
  if (variant === 'balanced') {
    return (
      <div
        className={`border rounded-lg ${priorityConfig.borderColor} bg-white hover:shadow-md transition-shadow`}
      >
        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs font-medium px-2 py-0.5 rounded ${priorityConfig.bgColor} ${priorityConfig.color}`}>
                  {priorityConfig.label}
                </span>
                <span className="text-xs text-gray-500">{accountName}</span>
              </div>
              <h4 className="font-medium text-gray-900">{action.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{action.description}</p>
            </div>
            
            {/* Quick action button */}
            <button
              onClick={handleExecute}
              disabled={draftState === 'sending' || draftState === 'sent'}
              className={`shrink-0 px-4 py-2 text-sm font-medium rounded-lg ${
                draftState === 'sent'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              } disabled:opacity-50 transition-colors`}
            >
              {draftState === 'sending' ? (
                <LoadingSpinner size="sm" />
              ) : draftState === 'sent' ? (
                '✓ Done'
              ) : action.aiDraft ? (
                'Send'
              ) : (
                'Do'
              )}
            </button>
          </div>

          {/* Expandable details */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            {isExpanded ? '▼ Hide details' : '▶ Show evidence & impact'}
            <ConfidenceIndicator confidence={action.confidence} />
          </button>

          {isExpanded && (
            <div className="mt-3 space-y-3">
              {/* Impact */}
              <div className="text-sm">
                <span className="text-gray-500">Expected impact: </span>
                <span className="text-gray-700">{action.estimatedImpact}</span>
              </div>

              {/* Evidence */}
              {action.evidence.length > 0 && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <h5 className="text-xs font-semibold text-gray-700 mb-2">
                    Why this recommendation:
                  </h5>
                  {action.evidence.map((evidence, idx) => (
                    <EvidenceItem key={idx} evidence={evidence} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Draft preview - slides open */}
        {isDraftOpen && action.aiDraft && (
          <div className="border-t p-4 bg-blue-50/30 animate-slideDown">
            <div className="flex items-center justify-between mb-2">
              <h5 className="text-sm font-medium text-gray-700">Draft Preview</h5>
              <button
                onClick={() => setIsDraftOpen(false)}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                ✕ Close
              </button>
            </div>
            <div className="bg-white border rounded p-3 text-sm text-gray-700 whitespace-pre-wrap max-h-40 overflow-y-auto">
              {draftContent}
            </div>
            <div className="flex items-center justify-between mt-3">
              <button
                onClick={() => onViewDetails?.(action.id)}
                className="text-xs text-blue-600 hover:underline"
              >
                Edit in full editor →
              </button>
              <button
                onClick={handleExecute}
                disabled={draftState === 'sending'}
                className="px-4 py-1.5 text-sm font-medium bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {draftState === 'sending' ? 'Sending...' : 'Approve & Send'}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ============================================
  // OPTION C: Maximum Efficiency (Inbox-zero style)
  // ============================================
  return (
    <div className={`flex items-center gap-3 p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors`}>
      {/* Priority indicator */}
      <div
        className={`w-1 h-10 rounded-full ${
          action.priority === 'critical'
            ? 'bg-red-500'
            : action.priority === 'high'
            ? 'bg-orange-500'
            : action.priority === 'medium'
            ? 'bg-blue-500'
            : 'bg-gray-300'
        }`}
      />

      {/* Main content - minimal */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900 truncate">{action.title}</span>
          <span className="text-xs text-gray-400">• {accountName}</span>
        </div>
        <p className="text-sm text-gray-500 truncate">{action.description}</p>
      </div>

      {/* Quick actions */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => onDismiss?.(action.id)}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
          title="Skip"
        >
          ↷
        </button>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
          title="Details"
        >
          ⋯
        </button>
        <button
          onClick={handleExecute}
          disabled={draftState === 'sending' || draftState === 'sent'}
          className={`px-3 py-1.5 text-sm font-medium rounded ${
            draftState === 'sent'
              ? 'bg-green-100 text-green-700'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          } disabled:opacity-50`}
        >
          {draftState === 'sent' ? '✓' : action.aiDraft ? 'Send' : 'Done'}
        </button>
      </div>
    </div>
  );
}

// ============================================
// ACTION CARD STATES
// ============================================

interface ActionCardLoadingProps {
  variant?: 'control' | 'balanced' | 'efficient';
}

export function ActionCardLoading({ variant = 'balanced' }: ActionCardLoadingProps) {
  if (variant === 'efficient') {
    return (
      <div className="flex items-center gap-3 p-3 border-b border-gray-100 animate-pulse">
        <div className="w-1 h-10 rounded-full bg-gray-200" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-2/3" />
          <div className="h-3 bg-gray-100 rounded w-1/2" />
        </div>
        <div className="w-16 h-8 bg-gray-200 rounded" />
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-4 animate-pulse">
      <div className="flex items-center gap-2 mb-3">
        <div className="h-5 w-16 bg-gray-200 rounded" />
        <div className="h-4 w-24 bg-gray-100 rounded" />
      </div>
      <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-4 bg-gray-100 rounded w-full" />
      <div className="h-4 bg-gray-100 rounded w-2/3 mt-1" />
    </div>
  );
}

export function ActionCardEmpty() {
  return (
    <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
      <div className="text-4xl mb-3">🎉</div>
      <h4 className="font-medium text-gray-900 mb-1">You're all caught up!</h4>
      <p className="text-sm text-gray-500">
        No priority actions right now. AskElephant is monitoring your accounts
        and will surface actions as opportunities arise.
      </p>
    </div>
  );
}

export function ActionCardError({ error, onRetry }: { error: string; onRetry?: () => void }) {
  return (
    <div className="border border-red-200 bg-red-50 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <span className="text-red-500">⚠</span>
        <div className="flex-1">
          <h4 className="font-medium text-red-800">Couldn't load actions</h4>
          <p className="text-sm text-red-600 mt-1">{error}</p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-3 py-1 text-sm text-red-700 hover:bg-red-100 rounded"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
}

// ============================================
// HELPER COMPONENTS
// ============================================

function EvidenceItem({ evidence }: { evidence: AIEvidence }) {
  const iconMap = {
    quote: '💬',
    data_point: '📊',
    pattern: '📈',
    signal: '📡',
  };

  return (
    <div className="flex items-start gap-2 text-sm mb-2 last:mb-0">
      <span>{iconMap[evidence.type]}</span>
      <div>
        <span className="text-gray-500 text-xs">{evidence.source}</span>
        {evidence.type === 'quote' ? (
          <p className="text-gray-700 italic">"{evidence.content}"</p>
        ) : (
          <p className="text-gray-700">{evidence.content}</p>
        )}
      </div>
    </div>
  );
}

function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' }) {
  const sizeClass = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  return (
    <svg
      className={`${sizeClass} animate-spin text-current`}
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

export { LoadingSpinner, EvidenceItem };
