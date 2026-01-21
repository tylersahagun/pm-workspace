import * as React from 'react';
import {
  Account,
  Meeting,
  ActionItem,
  AgentActivity,
  RepStats,
  SelfCoachingData,
  ViewMode,
  STAGE_CONFIG,
  HEALTH_CONFIG,
  PRIORITY_CONFIG,
  MOCK_ACCOUNTS,
  MOCK_MEETINGS,
  MOCK_ACTIONS,
  MOCK_AGENT_ACTIVITY,
  MOCK_STATS,
  MOCK_SELF_COACHING,
} from './types';
import { PipelineView, PipelineViewLoading, PipelineViewEmpty } from './PipelineView';
import { DealWorkspacePanel } from './DealWorkspacePanel';
import { SelfCoachingWidget, SelfCoachingEmpty, SelfCoachingLoading } from './SelfCoachingWidget';

// ============================================
// REP WORKSPACE V4 - Main Dashboard
// Maple Billing Feedback Iteration (2026-01-21)
// New features:
// - Pipeline/Kanban view toggle
// - Deal-context chat panel
// - Self-coaching widget for solo reps
// ============================================

export interface RepWorkspaceDashboardV4Props {
  accounts?: Account[];
  meetings?: Meeting[];
  actions?: ActionItem[];
  agentActivity?: AgentActivity[];
  stats?: RepStats;
  selfCoaching?: SelfCoachingData;
  userName?: string;
  defaultView?: ViewMode;
  isLoading?: boolean;
  onActionComplete?: (id: string) => void;
  onActionDismiss?: (id: string) => void;
  onMeetingClick?: (id: string) => void;
  onAccountClick?: (id: string) => void;
  onActivityApprove?: (id: string) => void;
  onActivityReject?: (id: string) => void;
  onChatSend?: (accountId: string, message: string) => void;
}

export function RepWorkspaceDashboardV4({
  accounts = MOCK_ACCOUNTS,
  meetings = MOCK_MEETINGS,
  actions = MOCK_ACTIONS,
  agentActivity = MOCK_AGENT_ACTIVITY,
  stats = MOCK_STATS,
  selfCoaching = MOCK_SELF_COACHING,
  userName = 'Rep',
  defaultView = 'list',
  isLoading = false,
  onActionComplete,
  onActionDismiss,
  onMeetingClick,
  onAccountClick,
  onActivityApprove,
  onActivityReject,
  onChatSend,
}: RepWorkspaceDashboardV4Props) {
  const [viewMode, setViewMode] = React.useState<ViewMode>(defaultView);
  const [selectedAccountId, setSelectedAccountId] = React.useState<string | null>(null);
  const [showSelfCoaching, setShowSelfCoaching] = React.useState(true);

  const pendingActions = actions.filter((a) => !a.isCompleted);
  const pendingApprovals = agentActivity.filter((a) => a.status === 'pending');
  
  const selectedAccount = selectedAccountId
    ? accounts.find((a) => a.id === selectedAccountId)
    : null;

  const handleOpenDealWorkspace = (accountId: string) => {
    setSelectedAccountId(accountId);
  };

  const handleCloseDealWorkspace = () => {
    setSelectedAccountId(null);
  };

  // Get meetings and actions for selected account
  const selectedAccountMeetings = selectedAccount
    ? meetings.filter((m) => m.companyId === selectedAccount.id)
    : [];
  const selectedAccountActions = selectedAccount
    ? actions.filter((a) => a.companyId === selectedAccount.id && !a.isCompleted)
    : [];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Good morning, {userName}! 👋
              </h1>
              <p className="text-sm text-gray-500">
                Here's what's happening with your deals today
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* View Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    viewMode === 'list'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  📋 List
                </button>
                <button
                  onClick={() => setViewMode('pipeline')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    viewMode === 'pipeline'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  📊 Pipeline
                </button>
              </div>
              <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                View All Meetings
              </button>
              <button className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                + Schedule Meeting
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6">
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
          <StatsCard label="Active Deals" value={stats.activeDeals} subtext="3 closing this month" trend="up" />
          <StatsCard label="Pipeline" value={`$${(stats.pipelineValue / 1000).toFixed(0)}K`} />
          <StatsCard label="Actions Today" value={stats.actionsToday} variant="highlight" />
          <StatsCard label="Meetings This Week" value={stats.meetingsThisWeek} />
          <StatsCard label="At Risk" value={stats.dealsAtRisk} variant={stats.dealsAtRisk > 0 ? 'warning' : 'default'} />
          <StatsCard label="Closing This Month" value={`$${(stats.closingThisMonth / 1000).toFixed(0)}K`} variant="highlight" />
        </div>

        {/* Pipeline View */}
        {viewMode === 'pipeline' && (
          <div className="mb-6">
            {isLoading ? (
              <PipelineViewLoading />
            ) : accounts.length === 0 ? (
              <PipelineViewEmpty />
            ) : (
              <PipelineView
                accounts={accounts}
                onAccountClick={onAccountClick}
                onDealWorkspace={handleOpenDealWorkspace}
              />
            )}
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Actions + Self-Coaching */}
            <div className="lg:col-span-1 space-y-6">
              {/* Action Items */}
              <div className="bg-white rounded-xl border shadow-sm">
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-gray-900">Action Items</h2>
                    <span className="text-xs text-gray-500">{pendingActions.length} pending</span>
                  </div>
                </div>
                <div className="p-3 space-y-2">
                  {isLoading ? (
                    <ActionItemsLoading />
                  ) : pendingActions.length === 0 ? (
                    <ActionItemsEmpty />
                  ) : (
                    pendingActions.slice(0, 5).map((action) => (
                      <ActionItemCard
                        key={action.id}
                        action={action}
                        onComplete={onActionComplete}
                        onDismiss={onActionDismiss}
                        onOpenDeal={() => action.companyId && handleOpenDealWorkspace(action.companyId)}
                      />
                    ))
                  )}
                </div>
                {pendingActions.length > 5 && (
                  <div className="p-3 border-t">
                    <button className="w-full text-center text-sm text-indigo-600 hover:text-indigo-800">
                      View all {pendingActions.length} actions →
                    </button>
                  </div>
                )}
              </div>

              {/* Self-Coaching Widget (Solo Rep Feature) */}
              {showSelfCoaching && (
                isLoading ? (
                  <SelfCoachingLoading />
                ) : selfCoaching ? (
                  <SelfCoachingWidget
                    data={selfCoaching}
                    variant="compact"
                    onViewAll={() => setShowSelfCoaching(true)}
                  />
                ) : (
                  <SelfCoachingEmpty />
                )
              )}
            </div>

            {/* Middle Column: Recent Meetings */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border shadow-sm">
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-gray-900">Recent Meetings</h2>
                    <button className="text-xs text-indigo-600 hover:text-indigo-800">View all →</button>
                  </div>
                </div>
                <div className="p-3 space-y-2">
                  {isLoading ? (
                    <MeetingsLoading />
                  ) : meetings.length === 0 ? (
                    <MeetingsEmpty />
                  ) : (
                    meetings.slice(0, 5).map((meeting) => (
                      <MeetingCard
                        key={meeting.id}
                        meeting={meeting}
                        onClick={onMeetingClick}
                        onOpenDeal={() => handleOpenDealWorkspace(meeting.companyId)}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Accounts + Agent Activity */}
            <div className="lg:col-span-1 space-y-6">
              {/* My Accounts */}
              <div className="bg-white rounded-xl border shadow-sm">
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-gray-900">My Accounts</h2>
                    <select className="text-xs border rounded px-2 py-1 bg-white">
                      <option>By Activity</option>
                      <option>By Value</option>
                      <option>By Health</option>
                    </select>
                  </div>
                </div>
                <div className="divide-y">
                  {isLoading ? (
                    <AccountsLoading />
                  ) : accounts.length === 0 ? (
                    <AccountsEmpty />
                  ) : (
                    accounts.slice(0, 4).map((account) => (
                      <AccountRow
                        key={account.id}
                        account={account}
                        onClick={onAccountClick}
                        onOpenDeal={() => handleOpenDealWorkspace(account.id)}
                      />
                    ))
                  )}
                </div>
                <div className="p-3 border-t">
                  <button
                    onClick={() => setViewMode('pipeline')}
                    className="w-full text-center text-sm text-indigo-600 hover:text-indigo-800"
                  >
                    View pipeline ({accounts.length} accounts) →
                  </button>
                </div>
              </div>

              {/* Agent Activity */}
              <div className="bg-white rounded-xl border shadow-sm">
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-gray-900">Agent Activity</h2>
                    {pendingApprovals.length > 0 && (
                      <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded-full">
                        {pendingApprovals.length} pending
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-4">
                  {isLoading ? (
                    <AgentActivityLoading />
                  ) : agentActivity.length === 0 ? (
                    <AgentActivityEmpty />
                  ) : (
                    agentActivity.slice(0, 4).map((activity) => (
                      <AgentActivityRow
                        key={activity.id}
                        activity={activity}
                        onApprove={onActivityApprove}
                        onReject={onActivityReject}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Global Chat FAB */}
      <button className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center group z-40">
        <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </button>

      {/* Deal Workspace Panel */}
      {selectedAccount && (
        <DealWorkspacePanel
          account={selectedAccount}
          recentMeetings={selectedAccountMeetings}
          openActions={selectedAccountActions}
          onClose={handleCloseDealWorkspace}
          onSendMessage={(msg) => onChatSend?.(selectedAccount.id, msg)}
          onActionComplete={onActionComplete}
          onMeetingClick={onMeetingClick}
        />
      )}
    </div>
  );
}

// ============================================
// Sub-Components
// ============================================

// Stats Card
interface StatsCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  trend?: 'up' | 'down' | 'neutral';
  variant?: 'default' | 'highlight' | 'warning';
}

function StatsCard({ label, value, subtext, trend, variant = 'default' }: StatsCardProps) {
  return (
    <div className={`p-4 rounded-xl border bg-white ${
      variant === 'highlight' ? 'border-emerald-200 bg-emerald-50/50' :
      variant === 'warning' ? 'border-amber-200 bg-amber-50/50' : ''
    }`}>
      <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
      {subtext && (
        <p className={`text-xs mt-1 ${
          trend === 'up' ? 'text-emerald-600' :
          trend === 'down' ? 'text-red-600' : 'text-gray-500'
        }`}>
          {trend === 'up' && '↑ '}{trend === 'down' && '↓ '}{subtext}
        </p>
      )}
    </div>
  );
}

// Action Item Card
interface ActionItemCardProps {
  action: ActionItem;
  onComplete?: (id: string) => void;
  onDismiss?: (id: string) => void;
  onOpenDeal?: () => void;
}

function ActionItemCard({ action, onComplete, onDismiss, onOpenDeal }: ActionItemCardProps) {
  const priorityConfig = PRIORITY_CONFIG[action.priority];
  
  return (
    <div className="flex items-start gap-3 p-3 bg-white rounded-lg border hover:shadow-sm transition-shadow group">
      <button
        onClick={() => onComplete?.(action.id)}
        className="mt-0.5 w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center border-gray-300 hover:border-emerald-400"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-xs px-2 py-0.5 rounded-full ${priorityConfig.bgColor} ${priorityConfig.color}`}>
            {priorityConfig.label}
          </span>
          {action.source === 'ai' && (
            <span className="text-xs text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">AI</span>
          )}
        </div>
        <p className="text-sm font-medium text-gray-900">{action.title}</p>
        {action.company && (
          <button
            onClick={onOpenDeal}
            className="text-xs text-indigo-600 hover:text-indigo-800 mt-1"
          >
            {action.company} →
          </button>
        )}
      </div>
      <button
        onClick={() => onDismiss?.(action.id)}
        className="text-gray-400 hover:text-gray-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

// Meeting Card
interface MeetingCardProps {
  meeting: Meeting;
  onClick?: (id: string) => void;
  onOpenDeal?: () => void;
}

function MeetingCard({ meeting, onClick, onOpenDeal }: MeetingCardProps) {
  const typeColors: Record<Meeting['type'], string> = {
    discovery: 'bg-blue-100 text-blue-700',
    demo: 'bg-purple-100 text-purple-700',
    negotiation: 'bg-amber-100 text-amber-700',
    followup: 'bg-green-100 text-green-700',
    internal: 'bg-gray-100 text-gray-700',
  };

  return (
    <div
      onClick={() => onClick?.(meeting.id)}
      className="w-full text-left p-3 bg-white rounded-lg border hover:shadow-sm hover:border-gray-300 transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColors[meeting.type]}`}>
              {meeting.type}
            </span>
            {meeting.hasInsights && <span className="text-xs text-emerald-600">✨</span>}
          </div>
          <p className="font-medium text-sm truncate">{meeting.title}</p>
          <button
            onClick={(e) => { e.stopPropagation(); onOpenDeal?.(); }}
            className="text-xs text-indigo-600 hover:text-indigo-800"
          >
            {meeting.company} →
          </button>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-sm font-medium">
            {new Date(meeting.date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
          </p>
          <p className="text-xs text-gray-500">{meeting.duration} min</p>
        </div>
      </div>
    </div>
  );
}

// Account Row
interface AccountRowProps {
  account: Account;
  onClick?: (id: string) => void;
  onOpenDeal?: () => void;
}

function AccountRow({ account, onClick, onOpenDeal }: AccountRowProps) {
  const healthConfig = HEALTH_CONFIG[account.health];
  
  return (
    <div className="p-3 hover:bg-gray-50 transition-colors group">
      <div className="flex items-center gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onClick?.(account.id)}
              className="font-medium text-gray-900 truncate hover:text-indigo-600"
            >
              {account.name}
            </button>
            <span className={`text-xs px-2 py-0.5 rounded-full ${healthConfig.bgColor} ${healthConfig.color}`}>
              {healthConfig.icon}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">{STAGE_CONFIG[account.stage].label}</p>
        </div>
        <div className="text-right">
          <p className="font-medium">${(account.dealValue / 1000).toFixed(0)}K</p>
          <p className="text-xs text-gray-500">{account.meetingCount} meetings</p>
        </div>
        <button
          onClick={onOpenDeal}
          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
          title="Open Deal Workspace"
        >
          💬
        </button>
      </div>
    </div>
  );
}

// Agent Activity Row
interface AgentActivityRowProps {
  activity: AgentActivity;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

function AgentActivityRow({ activity, onApprove, onReject }: AgentActivityRowProps) {
  const statusIcons = {
    completed: <span className="text-emerald-600">✓</span>,
    pending: <span className="text-amber-500">⏳</span>,
    failed: <span className="text-red-500">✗</span>,
  };

  return (
    <div className="flex items-start gap-3 py-3 border-b last:border-0">
      <div className="mt-0.5">{statusIcons[activity.status]}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900">{activity.description}</p>
        {activity.company && (
          <p className="text-xs text-gray-500">{activity.company}</p>
        )}
      </div>
      {activity.status === 'pending' && (
        <div className="flex items-center gap-2">
          <button
            onClick={() => onApprove?.(activity.id)}
            className="px-2 py-1 text-xs font-medium bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200"
          >
            ✓
          </button>
          <button
            onClick={() => onReject?.(activity.id)}
            className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            ✗
          </button>
        </div>
      )}
    </div>
  );
}

// Loading States
function ActionItemsLoading() {
  return (
    <div className="space-y-2">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-3 bg-gray-50 rounded-lg animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-100 rounded w-1/2 mt-2" />
        </div>
      ))}
    </div>
  );
}

function MeetingsLoading() {
  return (
    <div className="space-y-2">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-3 bg-gray-50 rounded-lg animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-2/3" />
          <div className="h-3 bg-gray-100 rounded w-1/3 mt-2" />
        </div>
      ))}
    </div>
  );
}

function AccountsLoading() {
  return (
    <div>
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-3 border-b animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-3 bg-gray-100 rounded w-1/3 mt-2" />
        </div>
      ))}
    </div>
  );
}

function AgentActivityLoading() {
  return (
    <div className="space-y-3">
      {[1, 2].map((i) => (
        <div key={i} className="py-3 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-100 rounded w-1/2 mt-2" />
        </div>
      ))}
    </div>
  );
}

// Empty States
function ActionItemsEmpty() {
  return (
    <div className="text-center py-8 text-gray-500">
      <span className="text-3xl">✨</span>
      <p className="text-sm mt-2">All caught up!</p>
    </div>
  );
}

function MeetingsEmpty() {
  return (
    <div className="text-center py-8 text-gray-500">
      <span className="text-3xl">📅</span>
      <p className="text-sm mt-2">No recent meetings</p>
    </div>
  );
}

function AccountsEmpty() {
  return (
    <div className="text-center py-8 text-gray-500">
      <span className="text-3xl">🏢</span>
      <p className="text-sm mt-2">No accounts assigned</p>
    </div>
  );
}

function AgentActivityEmpty() {
  return (
    <div className="text-center py-6 text-gray-500">
      <span className="text-3xl">🤖</span>
      <p className="text-sm mt-2">No agent activity yet</p>
    </div>
  );
}

export default RepWorkspaceDashboardV4;
