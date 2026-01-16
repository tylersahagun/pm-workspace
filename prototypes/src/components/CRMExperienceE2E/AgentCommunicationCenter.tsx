import * as React from 'react';
import {
  MessageSquare,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  ChevronRight,
  ExternalLink,
  Settings,
  Bell,
  Sparkles,
  Database,
  Eye,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AgentMessage, AgentMessageType } from './types';
import { MOCK_AGENT_MESSAGES } from './types';

interface AgentCommunicationCenterProps {
  messages?: AgentMessage[];
  onViewInbox?: (actionId: string) => void;
}

export function AgentCommunicationCenter({
  messages = MOCK_AGENT_MESSAGES,
  onViewInbox,
}: AgentCommunicationCenterProps) {
  const actionRequired = messages.filter(m => m.actionRequired);
  const recentActivity = messages.filter(m => !m.actionRequired);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                <MessageSquare className="size-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-white">Agent Updates</h1>
                <p className="text-sm text-slate-400">See what your CRM agent has been doing</p>
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all">
              <Settings className="size-4" />
              Preferences
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* Action Required Section */}
        {actionRequired.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="size-6 rounded-full bg-orange-500 flex items-center justify-center">
                <span className="text-xs font-bold text-white">{actionRequired.length}</span>
              </div>
              <h2 className="text-sm font-medium text-white uppercase tracking-wide">
                Needs Your Input
              </h2>
            </div>
            <div className="space-y-3">
              {actionRequired.map(message => (
                <AgentMessageCard
                  key={message.id}
                  message={message}
                  onAction={() => message.actionId && onViewInbox?.(message.actionId)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Recent Activity Section */}
        <div className="space-y-4">
          <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wide">
            What I Did
          </h2>
          {recentActivity.length === 0 ? (
            <div className="p-12 rounded-xl bg-slate-800/50 border border-slate-700/50 text-center">
              <div className="size-12 mx-auto mb-4 rounded-full bg-slate-700 flex items-center justify-center">
                <Sparkles className="size-6 text-slate-500" />
              </div>
              <h3 className="text-white font-medium mb-1">No recent activity</h3>
              <p className="text-sm text-slate-400">
                After your next meeting, I'll show you what I updated here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentActivity.map(message => (
                <AgentMessageCard key={message.id} message={message} />
              ))}
            </div>
          )}
        </div>

        {/* Data Visibility Panel */}
        <DataVisibilityPanel />

        {/* Self-Service CTA */}
        <div className="p-6 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-800/30 border border-slate-700/50">
          <div className="flex items-start gap-4">
            <div className="size-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-500/30 flex items-center justify-center flex-shrink-0">
              <Sparkles className="size-6 text-orange-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-white mb-1">Build Your Own Automations</h3>
              <p className="text-sm text-slate-400 mb-4">
                Create personal automations that only affect your data. No admin approval needed.
              </p>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-all text-sm font-medium">
                Explore Automations
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AgentMessageCard({
  message,
  onAction,
}: {
  message: AgentMessage;
  onAction?: () => void;
}) {
  const typeConfig: Record<AgentMessageType, {
    icon: React.ReactNode;
    bg: string;
    border: string;
  }> = {
    success: {
      icon: <CheckCircle2 className="size-5 text-emerald-500" />,
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
    },
    action_required: {
      icon: <AlertTriangle className="size-5 text-orange-500" />,
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/30',
    },
    error: {
      icon: <XCircle className="size-5 text-red-500" />,
      bg: 'bg-red-500/10',
      border: 'border-red-500/30',
    },
    info: {
      icon: <Info className="size-5 text-blue-500" />,
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
    },
  };

  const { icon, bg, border } = typeConfig[message.type];
  const timeAgo = getTimeAgo(message.timestamp);

  return (
    <div className={cn(
      'p-4 rounded-xl border transition-all',
      message.actionRequired ? `${bg} ${border}` : 'bg-slate-800/50 border-slate-700/50'
    )}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">{icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-4 mb-1">
            <h3 className="font-medium text-white">{message.title}</h3>
            <span className="text-xs text-slate-500 flex-shrink-0">{timeAgo}</span>
          </div>
          <p className="text-sm text-slate-400 mb-2">{message.body}</p>
          
          {/* Context */}
          {(message.meetingTitle || message.crmRecordName) && (
            <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
              {message.meetingTitle && (
                <span className="flex items-center gap-1">
                  <MessageSquare className="size-3" />
                  {message.meetingTitle}
                </span>
              )}
              {message.crmRecordName && (
                <span className="flex items-center gap-1">
                  <Database className="size-3" />
                  {message.crmRecordName}
                </span>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3">
            {message.actionRequired && onAction && (
              <button
                onClick={onAction}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 transition-all"
              >
                Review
                <ChevronRight className="size-4" />
              </button>
            )}
            {message.crmRecordId && (
              <button className="flex items-center gap-1 text-sm text-slate-400 hover:text-white transition-all">
                View in HubSpot
                <ExternalLink className="size-3" />
              </button>
            )}
            {!message.actionRequired && (
              <button className="text-sm text-slate-500 hover:text-slate-400 transition-all">
                Don't show these
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DataVisibilityPanel() {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const touchedAreas = [
    { type: 'Deals', count: 12, icon: <Database className="size-4" /> },
    { type: 'Contacts', count: 8, icon: <Database className="size-4" /> },
    { type: 'Companies', count: 3, icon: <Database className="size-4" /> },
  ];

  return (
    <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <Eye className="size-5 text-slate-400" />
          <div className="text-left">
            <h3 className="font-medium text-white">What the Agent is Touching</h3>
            <p className="text-sm text-slate-400">See all HubSpot data affected by your agents</p>
          </div>
        </div>
        <ChevronRight className={cn(
          'size-5 text-slate-400 transition-transform',
          isExpanded && 'rotate-90'
        )} />
      </button>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-slate-700">
          <div className="grid grid-cols-3 gap-4">
            {touchedAreas.map((area, index) => (
              <div key={index} className="p-3 rounded-lg bg-slate-900/50">
                <div className="flex items-center gap-2 text-slate-400 mb-1">
                  {area.icon}
                  <span className="text-sm">{area.type}</span>
                </div>
                <div className="text-xl font-bold text-white">{area.count}</div>
                <div className="text-xs text-slate-500">records this week</div>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600 transition-all text-sm">
            View Full Activity Log
            <ChevronRight className="size-4" />
          </button>
        </div>
      )}
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

export default AgentCommunicationCenter;
