import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Meeting,
  ActionItem,
  Account,
  AgentActivity,
  RepStats,
  HEALTH_COLORS,
  PRIORITY_COLORS,
  MOCK_MEETINGS,
  MOCK_ACTIONS,
  MOCK_ACCOUNTS,
  MOCK_AGENT_ACTIVITY,
  MOCK_STATS,
} from "./types";

// ============================================
// Stats Cards
// ============================================
interface StatsCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  trend?: "up" | "down" | "neutral";
  variant?: "default" | "highlight" | "warning";
}

function StatsCard({
  label,
  value,
  subtext,
  trend,
  variant = "default",
}: StatsCardProps) {
  return (
    <div
      className={cn(
        "p-4 rounded-xl border bg-white",
        variant === "highlight" && "border-emerald-200 bg-emerald-50/50",
        variant === "warning" && "border-amber-200 bg-amber-50/50"
      )}
    >
      <p className="text-xs text-muted-foreground uppercase tracking-wide">
        {label}
      </p>
      <p className="text-2xl font-bold mt-1">{value}</p>
      {subtext && (
        <p
          className={cn(
            "text-xs mt-1",
            trend === "up" && "text-emerald-600",
            trend === "down" && "text-red-600",
            !trend && "text-muted-foreground"
          )}
        >
          {trend === "up" && "↑ "}
          {trend === "down" && "↓ "}
          {subtext}
        </p>
      )}
    </div>
  );
}

// ============================================
// Action Item Card
// ============================================
interface ActionItemCardProps {
  action: ActionItem;
  onComplete?: (id: string) => void;
  onDismiss?: (id: string) => void;
}

function ActionItemCard({
  action,
  onComplete,
  onDismiss,
}: ActionItemCardProps) {
  return (
    <div className="flex items-start gap-3 p-3 bg-white rounded-lg border hover:shadow-sm transition-shadow">
      <button
        onClick={() => onComplete?.(action.id)}
        className={cn(
          "mt-0.5 w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors",
          action.isCompleted
            ? "bg-emerald-500 border-emerald-500 text-white"
            : "border-gray-300 hover:border-emerald-400"
        )}
      >
        {action.isCompleted && (
          <svg
            className="w-3 h-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </button>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span
            className={cn(
              "text-xs px-2 py-0.5 rounded-full border font-medium",
              PRIORITY_COLORS[action.priority]
            )}
          >
            {action.priority}
          </span>
          {action.source === "ai" && (
            <span className="text-xs text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
              AI suggested
            </span>
          )}
        </div>
        <p
          className={cn(
            "text-sm font-medium",
            action.isCompleted && "line-through text-muted-foreground"
          )}
        >
          {action.title}
        </p>
        {action.company && (
          <p className="text-xs text-muted-foreground mt-1">{action.company}</p>
        )}
      </div>
      {!action.isCompleted && (
        <button
          onClick={() => onDismiss?.(action.id)}
          className="text-muted-foreground hover:text-foreground p-1"
          title="Dismiss"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
}

// ============================================
// Meeting Card
// ============================================
interface MeetingCardProps {
  meeting: Meeting;
  onClick?: (id: string) => void;
}

function MeetingCard({ meeting, onClick }: MeetingCardProps) {
  const typeColors = {
    discovery: "bg-blue-100 text-blue-700",
    demo: "bg-purple-100 text-purple-700",
    negotiation: "bg-amber-100 text-amber-700",
    followup: "bg-green-100 text-green-700",
    internal: "bg-gray-100 text-gray-700",
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <button
      onClick={() => onClick?.(meeting.id)}
      className="w-full text-left p-3 bg-white rounded-lg border hover:shadow-sm hover:border-gray-300 transition-all"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={cn(
                "text-xs px-2 py-0.5 rounded-full font-medium",
                typeColors[meeting.type]
              )}
            >
              {meeting.type.replace("_", " ")}
            </span>
            {meeting.hasInsights && (
              <span className="text-xs text-emerald-600">✨ Insights</span>
            )}
          </div>
          <p className="font-medium text-sm truncate">{meeting.title}</p>
          <p className="text-xs text-muted-foreground">{meeting.company}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-sm font-medium">{formatTime(meeting.date)}</p>
          <p className="text-xs text-muted-foreground">
            {meeting.duration} min
          </p>
        </div>
      </div>
    </button>
  );
}

// ============================================
// Account Row
// ============================================
interface AccountRowProps {
  account: Account;
  onClick?: (id: string) => void;
}

function AccountRow({ account, onClick }: AccountRowProps) {
  return (
    <button
      onClick={() => onClick?.(account.id)}
      className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors"
    >
      <div className="flex items-center gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-medium truncate">{account.name}</p>
            <span
              className={cn(
                "text-xs px-2 py-0.5 rounded-full",
                HEALTH_COLORS[account.health]
              )}
            >
              {account.health.replace("_", " ")}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {account.stage}
          </p>
        </div>
        <div className="text-right">
          <p className="font-medium">
            ${(account.dealValue / 1000).toFixed(0)}K
          </p>
          <p className="text-xs text-muted-foreground">
            {account.meetingCount} meetings
          </p>
        </div>
      </div>
      {account.nextStep && (
        <p className="text-xs text-muted-foreground mt-2 pl-0">
          Next: {account.nextStep}
        </p>
      )}
    </button>
  );
}

// ============================================
// Agent Activity Row
// ============================================
interface AgentActivityRowProps {
  activity: AgentActivity;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

function AgentActivityRow({
  activity,
  onApprove,
  onReject,
}: AgentActivityRowProps) {
  const statusColors = {
    completed: "text-emerald-600",
    pending: "text-amber-600",
    failed: "text-red-600",
  };

  const statusIcons = {
    completed: (
      <svg
        className="w-4 h-4 text-emerald-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
        />
      </svg>
    ),
    pending: (
      <svg
        className="w-4 h-4 text-amber-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    failed: (
      <svg
        className="w-4 h-4 text-red-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    ),
  };

  return (
    <div className="flex items-start gap-3 py-3 border-b last:border-0">
      <div className="mt-0.5">{statusIcons[activity.status]}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm">{activity.description}</p>
        <div className="flex items-center gap-2 mt-1">
          {activity.company && (
            <span className="text-xs text-muted-foreground">
              {activity.company}
            </span>
          )}
          {activity.confidence && (
            <span
              className={cn(
                "text-xs px-1.5 py-0.5 rounded",
                activity.confidence === "high" &&
                  "bg-emerald-50 text-emerald-600",
                activity.confidence === "medium" &&
                  "bg-amber-50 text-amber-600",
                activity.confidence === "low" && "bg-red-50 text-red-600"
              )}
            >
              {activity.confidence} confidence
            </span>
          )}
        </div>
      </div>
      {activity.status === "pending" && (
        <div className="flex items-center gap-2">
          <button
            onClick={() => onApprove?.(activity.id)}
            className="px-2 py-1 text-xs font-medium bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200"
          >
            Approve
          </button>
          <button
            onClick={() => onReject?.(activity.id)}
            className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================
// Global Chat Button
// ============================================
function GlobalChatButton() {
  return (
    <button className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center group">
      <svg
        className="w-6 h-6 group-hover:scale-110 transition-transform"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
    </button>
  );
}

// ============================================
// Main Dashboard
// ============================================
export interface RepWorkspaceDashboardProps {
  meetings?: Meeting[];
  actions?: ActionItem[];
  accounts?: Account[];
  agentActivity?: AgentActivity[];
  stats?: RepStats;
  userName?: string;
  onActionComplete?: (id: string) => void;
  onActionDismiss?: (id: string) => void;
  onMeetingClick?: (id: string) => void;
  onAccountClick?: (id: string) => void;
  onActivityApprove?: (id: string) => void;
  onActivityReject?: (id: string) => void;
}

export function RepWorkspaceDashboard({
  meetings = MOCK_MEETINGS,
  actions = MOCK_ACTIONS,
  accounts = MOCK_ACCOUNTS,
  agentActivity = MOCK_AGENT_ACTIVITY,
  stats = MOCK_STATS,
  userName = "Rep",
  onActionComplete,
  onActionDismiss,
  onMeetingClick,
  onAccountClick,
  onActivityApprove,
  onActivityReject,
}: RepWorkspaceDashboardProps) {
  const pendingActions = actions.filter((a) => !a.isCompleted);
  const pendingApprovals = agentActivity.filter((a) => a.status === "pending");

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold">
                Good morning, {userName}! 👋
              </h1>
              <p className="text-sm text-muted-foreground">
                Here's what's happening with your deals today
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                View All Meetings
              </button>
              <button className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                + Schedule Meeting
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6">
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <StatsCard
            label="Active Deals"
            value={stats.activeDeals}
            subtext="3 closing this month"
            trend="up"
          />
          <StatsCard
            label="Pipeline"
            value={`$${(stats.pipelineValue / 1000).toFixed(0)}K`}
          />
          <StatsCard
            label="Actions Today"
            value={stats.actionsToday}
            variant="highlight"
          />
          <StatsCard
            label="Meetings This Week"
            value={stats.meetingsThisWeek}
          />
          <StatsCard
            label="At Risk"
            value={stats.dealsAtRisk}
            variant={stats.dealsAtRisk > 0 ? "warning" : "default"}
          />
          <StatsCard label="Accounts" value={stats.totalAccounts} />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Actions */}
          <div className="lg:col-span-1 space-y-6">
            {/* Action Items */}
            <div className="bg-white rounded-xl border shadow-sm">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold">Action Items</h2>
                  <span className="text-xs text-muted-foreground">
                    {pendingActions.length} pending
                  </span>
                </div>
              </div>
              <div className="p-3 space-y-2">
                {pendingActions.slice(0, 5).map((action) => (
                  <ActionItemCard
                    key={action.id}
                    action={action}
                    onComplete={onActionComplete}
                    onDismiss={onActionDismiss}
                  />
                ))}
                {pendingActions.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <svg
                      className="w-12 h-12 mx-auto mb-3 opacity-50"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-sm">All caught up!</p>
                  </div>
                )}
              </div>
              {pendingActions.length > 5 && (
                <div className="p-3 border-t">
                  <button className="w-full text-center text-sm text-primary hover:text-primary/80">
                    View all {pendingActions.length} actions →
                  </button>
                </div>
              )}
            </div>

            {/* Agent Activity */}
            <div className="bg-white rounded-xl border shadow-sm">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold">Agent Activity</h2>
                  {pendingApprovals.length > 0 && (
                    <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded-full">
                      {pendingApprovals.length} pending
                    </span>
                  )}
                </div>
              </div>
              <div className="p-4">
                {agentActivity.slice(0, 4).map((activity) => (
                  <AgentActivityRow
                    key={activity.id}
                    activity={activity}
                    onApprove={onActivityApprove}
                    onReject={onActivityReject}
                  />
                ))}
                {agentActivity.length === 0 && (
                  <div className="text-center py-6 text-muted-foreground">
                    <p className="text-sm">No agent activity yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Middle Column: Meetings */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border shadow-sm">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold">Recent Meetings</h2>
                  <button className="text-xs text-primary hover:text-primary/80">
                    View all →
                  </button>
                </div>
              </div>
              <div className="p-3 space-y-2">
                {meetings.map((meeting) => (
                  <MeetingCard
                    key={meeting.id}
                    meeting={meeting}
                    onClick={onMeetingClick}
                  />
                ))}
                {meetings.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p className="text-sm">No recent meetings</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Accounts */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border shadow-sm">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold">My Accounts</h2>
                  <select className="text-xs border rounded px-2 py-1 bg-white">
                    <option>By Activity</option>
                    <option>By Value</option>
                    <option>By Health</option>
                  </select>
                </div>
              </div>
              <div className="divide-y">
                {accounts.map((account) => (
                  <AccountRow
                    key={account.id}
                    account={account}
                    onClick={onAccountClick}
                  />
                ))}
                {accounts.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p className="text-sm">No accounts assigned</p>
                  </div>
                )}
              </div>
              <div className="p-3 border-t">
                <button className="w-full text-center text-sm text-primary hover:text-primary/80">
                  View all {stats.totalAccounts} accounts →
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Global Chat FAB */}
      <GlobalChatButton />
    </div>
  );
}
