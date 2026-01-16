import * as React from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ExternalLink,
  Filter,
  Loader2,
  RefreshCw,
  Search,
  Sparkles,
  TrendingDown,
  TrendingUp,
  XCircle,
  Bell,
  Eye,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type {
  ActivityLogEntry,
  DashboardStats,
  HealthStatus,
  AnomalyAlert,
  ActivityStatus,
} from './types';
import {
  MOCK_ACTIVITY_LOGS,
  MOCK_DASHBOARD_STATS,
  MOCK_ANOMALIES,
} from './types';

interface ActivityDashboardProps {
  stats?: DashboardStats;
  activities?: ActivityLogEntry[];
  anomalies?: AnomalyAlert[];
  healthStatus?: HealthStatus;
}

export function ActivityDashboard({
  stats = MOCK_DASHBOARD_STATS,
  activities = MOCK_ACTIVITY_LOGS,
  anomalies = MOCK_ANOMALIES,
  healthStatus = 'healthy',
}: ActivityDashboardProps) {
  const [filterStatus, setFilterStatus] = React.useState<ActivityStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredActivities = activities.filter(activity => {
    if (filterStatus !== 'all' && activity.status !== filterStatus) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        activity.meetingTitle.toLowerCase().includes(query) ||
        activity.crmRecordName.toLowerCase().includes(query) ||
        activity.userName.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const activeAnomalies = anomalies.filter(a => !a.isAcknowledged);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                <Activity className="size-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-white">CRM Agent Dashboard</h1>
                <p className="text-sm text-slate-400">Monitor all agent activity</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all">
                <RefreshCw className="size-4" />
                Refresh
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-all">
                <Sparkles className="size-4" />
                Configure Agents
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Health Status Banner */}
        <HealthStatusBanner status={healthStatus} anomalyCount={activeAnomalies.length} />

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <StatCard
            label="Runs Today"
            value={stats.totalRunsToday}
            icon={<Activity className="size-5" />}
            trend={+12}
          />
          <StatCard
            label="Success Rate"
            value={`${Math.round(stats.successRate * 100)}%`}
            icon={<CheckCircle2 className="size-5" />}
            trend={+3}
            trendLabel="vs yesterday"
          />
          <StatCard
            label="Pending Approvals"
            value={stats.pendingApprovals}
            icon={<Clock className="size-5" />}
            highlight={stats.pendingApprovals > 0}
          />
          <StatCard
            label="Active Agents"
            value={stats.activeAgents}
            icon={<Sparkles className="size-5" />}
          />
          <StatCard
            label="Avg Confidence"
            value={`${Math.round(stats.avgConfidence * 100)}%`}
            icon={<TrendingUp className="size-5" />}
            trend={-2}
            trendLabel="vs last week"
          />
        </div>

        {/* Anomaly Alerts */}
        {activeAnomalies.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wide flex items-center gap-2">
              <Bell className="size-4" />
              Alerts ({activeAnomalies.length})
            </h2>
            <div className="space-y-3">
              {activeAnomalies.map(anomaly => (
                <AnomalyAlertCard key={anomaly.id} anomaly={anomaly} />
              ))}
            </div>
          </div>
        )}

        {/* Activity Log */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wide">
              Activity Log
            </h2>
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                />
              </div>
              {/* Filter */}
              <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-800">
                {(['all', 'success', 'pending', 'failed'] as const).map(status => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={cn(
                      'px-3 py-1.5 rounded-md text-sm font-medium transition-all',
                      filterStatus === status
                        ? 'bg-slate-700 text-white'
                        : 'text-slate-400 hover:text-white'
                    )}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Activity List */}
          <div className="space-y-2">
            {filteredActivities.length === 0 ? (
              <div className="p-12 rounded-xl bg-slate-800/50 border border-slate-700/50 text-center">
                <div className="size-12 mx-auto mb-4 rounded-full bg-slate-700 flex items-center justify-center">
                  <Activity className="size-6 text-slate-500" />
                </div>
                <h3 className="text-white font-medium mb-1">No activity found</h3>
                <p className="text-sm text-slate-400">
                  {searchQuery || filterStatus !== 'all'
                    ? 'Try adjusting your filters'
                    : 'Agent activity will appear here after meetings'}
                </p>
              </div>
            ) : (
              filteredActivities.map(activity => (
                <ActivityLogCard key={activity.id} activity={activity} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function HealthStatusBanner({ status, anomalyCount }: { status: HealthStatus; anomalyCount: number }) {
  const config = {
    healthy: {
      bg: 'bg-emerald-500/10 border-emerald-500/30',
      icon: <CheckCircle2 className="size-5 text-emerald-500" />,
      title: 'All Systems Healthy',
      description: 'Your CRM agents are running smoothly.',
    },
    warning: {
      bg: 'bg-amber-500/10 border-amber-500/30',
      icon: <AlertTriangle className="size-5 text-amber-500" />,
      title: 'Attention Needed',
      description: `${anomalyCount} alert${anomalyCount !== 1 ? 's' : ''} require your attention.`,
    },
    error: {
      bg: 'bg-red-500/10 border-red-500/30',
      icon: <XCircle className="size-5 text-red-500" />,
      title: 'Issues Detected',
      description: 'Some agents are experiencing problems.',
    },
  };

  const { bg, icon, title, description } = config[status];

  return (
    <div className={cn('p-4 rounded-xl border flex items-center justify-between', bg)}>
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <h3 className="font-medium text-white">{title}</h3>
          <p className="text-sm text-slate-400">{description}</p>
        </div>
      </div>
      {status !== 'healthy' && (
        <button className="flex items-center gap-1 text-sm text-orange-400 hover:text-orange-300">
          View Details
          <ChevronRight className="size-4" />
        </button>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  trend,
  trendLabel,
  highlight,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: number;
  trendLabel?: string;
  highlight?: boolean;
}) {
  return (
    <div className={cn(
      'p-4 rounded-xl border',
      highlight
        ? 'bg-orange-500/10 border-orange-500/30'
        : 'bg-slate-800/50 border-slate-700/50'
    )}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-slate-400">{icon}</span>
        {trend !== undefined && (
          <div className={cn(
            'flex items-center gap-1 text-xs',
            trend >= 0 ? 'text-emerald-400' : 'text-red-400'
          )}>
            {trend >= 0 ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
            {trend >= 0 ? '+' : ''}{trend}%
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-xs text-slate-500 mt-1">{trendLabel || label}</div>
    </div>
  );
}

function AnomalyAlertCard({ anomaly }: { anomaly: AnomalyAlert }) {
  const severityConfig = {
    info: {
      bg: 'bg-blue-500/10 border-blue-500/30',
      icon: <Eye className="size-5 text-blue-500" />,
    },
    warning: {
      bg: 'bg-amber-500/10 border-amber-500/30',
      icon: <AlertTriangle className="size-5 text-amber-500" />,
    },
    error: {
      bg: 'bg-red-500/10 border-red-500/30',
      icon: <XCircle className="size-5 text-red-500" />,
    },
  };

  const { bg, icon } = severityConfig[anomaly.severity];
  const timeAgo = getTimeAgo(anomaly.timestamp);

  return (
    <div className={cn('p-4 rounded-xl border', bg)}>
      <div className="flex items-start gap-3">
        {icon}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-medium text-white">{anomaly.title}</h3>
            <span className="text-xs text-slate-500">{timeAgo}</span>
          </div>
          <p className="text-sm text-slate-400 mb-3">{anomaly.description}</p>
          <div className="flex items-center gap-3">
            <button className="text-sm text-orange-400 hover:text-orange-300 font-medium">
              Investigate
            </button>
            <button className="text-sm text-slate-500 hover:text-slate-400">
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActivityLogCard({ activity }: { activity: ActivityLogEntry }) {
  const statusConfig = {
    success: {
      icon: <CheckCircle2 className="size-4 text-emerald-500" />,
      badge: 'bg-emerald-500/20 text-emerald-400',
      label: 'Success',
    },
    pending: {
      icon: <Clock className="size-4 text-amber-500" />,
      badge: 'bg-amber-500/20 text-amber-400',
      label: 'Pending',
    },
    failed: {
      icon: <XCircle className="size-4 text-red-500" />,
      badge: 'bg-red-500/20 text-red-400',
      label: 'Failed',
    },
    rejected: {
      icon: <XCircle className="size-4 text-slate-500" />,
      badge: 'bg-slate-500/20 text-slate-400',
      label: 'Rejected',
    },
  };

  const { icon, badge, label } = statusConfig[activity.status];
  const timeAgo = getTimeAgo(activity.timestamp);

  return (
    <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 transition-all">
      <div className="flex items-start gap-4">
        <div className="size-10 rounded-lg bg-slate-700 flex items-center justify-center flex-shrink-0">
          <Sparkles className="size-5 text-orange-500" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-4 mb-1">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-white truncate">{activity.agentName}</h3>
              <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', badge)}>
                {label}
              </span>
            </div>
            <span className="text-xs text-slate-500 flex-shrink-0">{timeAgo}</span>
          </div>
          <p className="text-sm text-slate-400 mb-2">
            {activity.meetingTitle} → {activity.crmRecordName}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span>{activity.userName}</span>
              {activity.status === 'success' && (
                <span>{activity.fieldsUpdated} fields updated</span>
              )}
              {activity.confidence > 0 && (
                <span className={cn(
                  activity.confidence >= 0.8 ? 'text-emerald-400' :
                  activity.confidence >= 0.6 ? 'text-amber-400' : 'text-red-400'
                )}>
                  {Math.round(activity.confidence * 100)}% confidence
                </span>
              )}
            </div>
            <button className="flex items-center gap-1 text-xs text-orange-400 hover:text-orange-300">
              View Details
              <ExternalLink className="size-3" />
            </button>
          </div>
          {activity.errorMessage && (
            <div className="mt-2 p-2 rounded-lg bg-red-500/10 text-sm text-red-400">
              {activity.errorMessage}
            </div>
          )}
        </div>
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

export default ActivityDashboard;
