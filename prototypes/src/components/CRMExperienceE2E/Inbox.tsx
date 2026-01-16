import * as React from 'react';
import {
  Inbox as InboxIcon,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  ChevronRight,
  ArrowRight,
  MessageSquare,
  Database,
  Check,
  X,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { InboxItem, FieldPreview } from './types';
import { MOCK_INBOX_ITEMS } from './types';

interface InboxProps {
  items?: InboxItem[];
  onApprove?: (id: string) => void;
  onReject?: (id: string, reason?: string) => void;
}

export function Inbox({
  items = MOCK_INBOX_ITEMS,
  onApprove,
  onReject,
}: InboxProps) {
  const [selectedItem, setSelectedItem] = React.useState<InboxItem | null>(null);
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const [isProcessing, setIsProcessing] = React.useState(false);

  const pendingItems = items.filter(item => item.status === 'pending');

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selectedIds.size === pendingItems.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(pendingItems.map(item => item.id)));
    }
  };

  const handleBatchApprove = async () => {
    setIsProcessing(true);
    // Simulate batch approval
    await new Promise(resolve => setTimeout(resolve, 1000));
    selectedIds.forEach(id => onApprove?.(id));
    setSelectedIds(new Set());
    setIsProcessing(false);
  };

  const handleApprove = async (id: string) => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    onApprove?.(id);
    setSelectedItem(null);
    setIsProcessing(false);
  };

  const handleReject = async (id: string) => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    onReject?.(id);
    setSelectedItem(null);
    setIsProcessing(false);
  };

  if (selectedItem) {
    return (
      <InboxItemDetail
        item={selectedItem}
        onBack={() => setSelectedItem(null)}
        onApprove={() => handleApprove(selectedItem.id)}
        onReject={() => handleReject(selectedItem.id)}
        isProcessing={isProcessing}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <InboxIcon className="size-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-white">Inbox</h1>
                <p className="text-sm text-slate-400">
                  {pendingItems.length} item{pendingItems.length !== 1 ? 's' : ''} need{pendingItems.length === 1 ? 's' : ''} your review
                </p>
              </div>
            </div>
            {selectedIds.size > 0 && (
              <button
                onClick={handleBatchApprove}
                disabled={isProcessing}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-all disabled:opacity-50"
              >
                {isProcessing ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Check className="size-4" />
                )}
                Approve {selectedIds.size} Selected
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {pendingItems.length === 0 ? (
          <div className="p-12 rounded-xl bg-slate-800/50 border border-slate-700/50 text-center">
            <div className="size-16 mx-auto mb-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <CheckCircle2 className="size-8 text-emerald-500" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">All Caught Up! 🎉</h3>
            <p className="text-slate-400 max-w-sm mx-auto">
              You've reviewed all pending items. New approvals will appear here when the agent needs your input.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Select All */}
            <div className="flex items-center gap-3 px-4">
              <button
                onClick={handleSelectAll}
                className={cn(
                  'size-5 rounded border-2 flex items-center justify-center transition-all',
                  selectedIds.size === pendingItems.length
                    ? 'bg-orange-500 border-orange-500'
                    : 'border-slate-600 hover:border-slate-500'
                )}
              >
                {selectedIds.size === pendingItems.length && (
                  <Check className="size-3 text-white" />
                )}
              </button>
              <span className="text-sm text-slate-400">
                {selectedIds.size === pendingItems.length ? 'Deselect all' : 'Select all'}
              </span>
            </div>

            {/* Items List */}
            <div className="space-y-2">
              {pendingItems.map(item => (
                <InboxItemCard
                  key={item.id}
                  item={item}
                  isSelected={selectedIds.has(item.id)}
                  onToggleSelect={() => handleToggleSelect(item.id)}
                  onView={() => setSelectedItem(item)}
                  onQuickApprove={() => handleApprove(item.id)}
                  onQuickReject={() => handleReject(item.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function InboxItemCard({
  item,
  isSelected,
  onToggleSelect,
  onView,
  onQuickApprove,
  onQuickReject,
}: {
  item: InboxItem;
  isSelected: boolean;
  onToggleSelect: () => void;
  onView: () => void;
  onQuickApprove: () => void;
  onQuickReject: () => void;
}) {
  const timeAgo = getTimeAgo(item.createdAt);
  const isHighConfidence = item.confidence >= 0.8;
  const isMediumConfidence = item.confidence >= 0.6 && item.confidence < 0.8;

  return (
    <div className={cn(
      'p-4 rounded-xl border transition-all',
      isSelected
        ? 'bg-orange-500/10 border-orange-500/30'
        : 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600'
    )}>
      <div className="flex items-start gap-4">
        {/* Checkbox */}
        <button
          onClick={onToggleSelect}
          className={cn(
            'size-5 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 mt-1',
            isSelected
              ? 'bg-orange-500 border-orange-500'
              : 'border-slate-600 hover:border-slate-500'
          )}
        >
          {isSelected && <Check className="size-3 text-white" />}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-4 mb-2">
            <h3 className="font-medium text-white">{item.title}</h3>
            <div className="flex items-center gap-2">
              <span className={cn(
                'px-2 py-0.5 rounded-full text-xs font-medium',
                isHighConfidence
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : isMediumConfidence
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'bg-red-500/20 text-red-400'
              )}>
                {Math.round(item.confidence * 100)}%
              </span>
              <span className="text-xs text-slate-500">{timeAgo}</span>
            </div>
          </div>

          <p className="text-sm text-slate-400 mb-3">{item.description}</p>

          {/* Context */}
          <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
            <span className="flex items-center gap-1">
              <MessageSquare className="size-3" />
              {item.meetingTitle}
            </span>
            <span className="flex items-center gap-1">
              <Database className="size-3" />
              {item.crmRecordName}
            </span>
          </div>

          {/* Preview of changes */}
          <div className="flex flex-wrap gap-2 mb-4">
            {item.fieldsToUpdate.slice(0, 2).map((field, index) => (
              <div key={index} className="px-2 py-1 rounded-md bg-slate-700/50 text-xs text-slate-300">
                {field.fieldLabel}: {field.newValue.length > 20 ? field.newValue.slice(0, 20) + '...' : field.newValue}
              </div>
            ))}
            {item.fieldsToUpdate.length > 2 && (
              <div className="px-2 py-1 rounded-md bg-slate-700/50 text-xs text-slate-400">
                +{item.fieldsToUpdate.length - 2} more
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onQuickApprove}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition-all"
            >
              <Check className="size-4" />
              Approve
            </button>
            <button
              onClick={onQuickReject}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-700 text-slate-300 text-sm font-medium hover:bg-slate-600 transition-all"
            >
              <X className="size-4" />
              Reject
            </button>
            <button
              onClick={onView}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-slate-400 text-sm hover:text-white transition-all"
            >
              View Details
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InboxItemDetail({
  item,
  onBack,
  onApprove,
  onReject,
  isProcessing,
}: {
  item: InboxItem;
  onBack: () => void;
  onApprove: () => void;
  onReject: () => void;
  isProcessing: boolean;
}) {
  const isHighConfidence = item.confidence >= 0.8;
  const isMediumConfidence = item.confidence >= 0.6 && item.confidence < 0.8;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-all"
            >
              <ChevronRight className="size-4 rotate-180" />
              Back to Inbox
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={onReject}
                disabled={isProcessing}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600 transition-all disabled:opacity-50"
              >
                {isProcessing ? <Loader2 className="size-4 animate-spin" /> : <X className="size-4" />}
                Reject
              </button>
              <button
                onClick={onApprove}
                disabled={isProcessing}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-all disabled:opacity-50"
              >
                {isProcessing ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
                Approve
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* Title & Confidence */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">{item.title}</h1>
            <p className="text-slate-400">{item.description}</p>
          </div>
          <div className={cn(
            'px-4 py-2 rounded-xl text-center',
            isHighConfidence
              ? 'bg-emerald-500/20 border border-emerald-500/30'
              : isMediumConfidence
                ? 'bg-amber-500/20 border border-amber-500/30'
                : 'bg-red-500/20 border border-red-500/30'
          )}>
            <div className={cn(
              'text-2xl font-bold',
              isHighConfidence ? 'text-emerald-400' :
              isMediumConfidence ? 'text-amber-400' : 'text-red-400'
            )}>
              {Math.round(item.confidence * 100)}%
            </div>
            <div className="text-xs text-slate-400">confidence</div>
          </div>
        </div>

        {/* Context */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <div className="text-sm text-slate-400 mb-1">Meeting</div>
            <div className="font-medium text-white">{item.meetingTitle}</div>
            <div className="text-xs text-slate-500 mt-1">
              {item.meetingTimestamp.toLocaleDateString()} at {item.meetingTimestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <div className="text-sm text-slate-400 mb-1">CRM Record</div>
            <div className="font-medium text-white">{item.crmRecordName}</div>
            <div className="text-xs text-slate-500 mt-1 capitalize">{item.crmRecordType}</div>
            {item.crmRecordId && (
              <a href="#" className="inline-flex items-center gap-1 text-xs text-orange-400 hover:text-orange-300 mt-2">
                View in HubSpot
                <ExternalLink className="size-3" />
              </a>
            )}
          </div>
        </div>

        {/* Fields to Update */}
        <div className="space-y-4">
          <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wide">
            Changes to Review
          </h2>
          <div className="space-y-3">
            {item.fieldsToUpdate.map((field, index) => (
              <FieldComparisonCard key={index} field={field} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function FieldComparisonCard({ field }: { field: FieldPreview }) {
  const isHighConfidence = field.confidence >= 0.8;
  const isMediumConfidence = field.confidence >= 0.6 && field.confidence < 0.8;

  return (
    <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
      <div className="flex items-start justify-between gap-4 mb-3">
        <h3 className="font-medium text-white">{field.fieldLabel}</h3>
        <span className={cn(
          'px-2 py-0.5 rounded-full text-xs font-medium',
          isHighConfidence
            ? 'bg-emerald-500/20 text-emerald-400'
            : isMediumConfidence
              ? 'bg-amber-500/20 text-amber-400'
              : 'bg-red-500/20 text-red-400'
        )}>
          {Math.round(field.confidence * 100)}%
        </span>
      </div>

      {/* Before/After */}
      <div className="grid grid-cols-2 gap-4 mb-3">
        <div className="p-3 rounded-lg bg-slate-900/50">
          <div className="text-xs text-slate-500 mb-1">Current</div>
          <div className={cn(
            'text-sm',
            field.currentValue ? 'text-slate-400' : 'text-slate-600 italic'
          )}>
            {field.currentValue || 'Empty'}
          </div>
        </div>
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
          <div className="text-xs text-emerald-400 mb-1">New Value</div>
          <div className="text-sm text-white">{field.newValue}</div>
        </div>
      </div>

      {/* Source */}
      <div className="text-xs text-slate-500">
        <span className="text-slate-400">Source:</span> "{field.source}"
      </div>
    </div>
  );
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

export default Inbox;
