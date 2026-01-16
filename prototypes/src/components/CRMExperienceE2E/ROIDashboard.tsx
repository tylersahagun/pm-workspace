import * as React from 'react';
import {
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  Calendar,
  Users,
  Target,
  ArrowUp,
  ArrowDown,
  Sparkles,
  BarChart3,
  PieChart,
  Activity,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ROIDashboardProps {
  timeRange?: '7d' | '30d' | '90d' | 'all';
  teamId?: string;
}

interface ROIMetrics {
  timeSaved: {
    totalMinutes: number;
    perMeeting: number;
    trend: number; // percentage change
  };
  errorsPrevented: {
    total: number;
    byType: {
      missedUpdates: number;
      incorrectData: number;
      duplicateEntries: number;
      staleRecords: number;
    };
    trend: number;
  };
  dataQuality: {
    completionRate: number;
    accuracyScore: number;
    freshnessScore: number;
    trend: number;
  };
  adoption: {
    activeUsers: number;
    totalMeetingsProcessed: number;
    fieldsUpdated: number;
    trend: number;
  };
  projectedValue: {
    hoursSavedPerMonth: number;
    costSavings: number; // assuming $75/hr loaded cost
    dealVelocityImprovement: number; // percentage
  };
}

const MOCK_ROI_METRICS: ROIMetrics = {
  timeSaved: {
    totalMinutes: 2340,
    perMeeting: 6.5,
    trend: 12,
  },
  errorsPrevented: {
    total: 156,
    byType: {
      missedUpdates: 89,
      incorrectData: 34,
      duplicateEntries: 18,
      staleRecords: 15,
    },
    trend: 8,
  },
  dataQuality: {
    completionRate: 94,
    accuracyScore: 97,
    freshnessScore: 99,
    trend: 5,
  },
  adoption: {
    activeUsers: 12,
    totalMeetingsProcessed: 360,
    fieldsUpdated: 1440,
    trend: 23,
  },
  projectedValue: {
    hoursSavedPerMonth: 39,
    costSavings: 2925,
    dealVelocityImprovement: 15,
  },
};

const TIME_RANGES = [
  { id: '7d', label: 'Last 7 days' },
  { id: '30d', label: 'Last 30 days' },
  { id: '90d', label: 'Last 90 days' },
  { id: 'all', label: 'All time' },
] as const;

export function ROIDashboard({
  timeRange = '30d',
}: ROIDashboardProps) {
  const [selectedRange, setSelectedRange] = React.useState<string>(timeRange);
  const metrics = MOCK_ROI_METRICS;

  // Calculate derived values
  const hoursSaved = Math.round(metrics.timeSaved.totalMinutes / 60);
  const estimatedCostSaved = hoursSaved * 75; // $75/hr loaded cost

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                <TrendingUp className="size-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-white">ROI Dashboard</h1>
                <p className="text-sm text-slate-400">See the value your CRM agents deliver</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-1 rounded-lg bg-slate-800">
              {TIME_RANGES.map(range => (
                <button
                  key={range.id}
                  onClick={() => setSelectedRange(range.id)}
                  className={cn(
                    'px-3 py-1.5 rounded-md text-sm font-medium transition-all',
                    selectedRange === range.id
                      ? 'bg-slate-700 text-white'
                      : 'text-slate-400 hover:text-white'
                  )}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Hero Value Statement */}
        <div className="p-8 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-purple-500/10 border border-emerald-500/20">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-500/30">
              <Sparkles className="size-4 text-emerald-400" />
              <span className="text-sm font-medium text-emerald-300">Value Generated This Month</span>
            </div>
            <div className="flex items-center justify-center gap-8">
              <div>
                <div className="text-5xl font-bold text-white mb-1">{hoursSaved}hrs</div>
                <div className="text-slate-400">Time Saved</div>
              </div>
              <div className="h-16 w-px bg-slate-700" />
              <div>
                <div className="text-5xl font-bold text-emerald-400 mb-1">
                  ${estimatedCostSaved.toLocaleString()}
                </div>
                <div className="text-slate-400">Estimated Cost Savings</div>
              </div>
            </div>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              Based on {metrics.adoption.totalMeetingsProcessed} meetings processed with 
              an average of {metrics.timeSaved.perMeeting} minutes saved per meeting.
            </p>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard
            title="Time Saved"
            value={`${metrics.timeSaved.totalMinutes}m`}
            subtitle="total this period"
            trend={metrics.timeSaved.trend}
            icon={<Clock className="size-5" />}
            color="blue"
          />
          <MetricCard
            title="Errors Prevented"
            value={metrics.errorsPrevented.total.toString()}
            subtitle="data quality issues"
            trend={metrics.errorsPrevented.trend}
            icon={<AlertTriangle className="size-5" />}
            color="amber"
          />
          <MetricCard
            title="Data Quality"
            value={`${metrics.dataQuality.completionRate}%`}
            subtitle="completion rate"
            trend={metrics.dataQuality.trend}
            icon={<CheckCircle2 className="size-5" />}
            color="emerald"
          />
          <MetricCard
            title="Meetings Processed"
            value={metrics.adoption.totalMeetingsProcessed.toString()}
            subtitle={`by ${metrics.adoption.activeUsers} users`}
            trend={metrics.adoption.trend}
            icon={<Users className="size-5" />}
            color="purple"
          />
        </div>

        {/* Detailed Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Time Savings Breakdown */}
          <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-6">
              <Clock className="size-5 text-blue-400" />
              <h2 className="font-semibold text-white">Time Savings Breakdown</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/50">
                <div>
                  <div className="text-2xl font-bold text-white">
                    {metrics.timeSaved.perMeeting} min
                  </div>
                  <div className="text-sm text-slate-400">per meeting average</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-emerald-400">
                    +{Math.round(metrics.timeSaved.perMeeting * metrics.adoption.totalMeetingsProcessed / 60)}hrs
                  </div>
                  <div className="text-xs text-slate-500">total saved</div>
                </div>
              </div>
              <div className="space-y-2">
                {[
                  { label: 'CRM data entry', minutes: Math.round(metrics.timeSaved.totalMinutes * 0.6) },
                  { label: 'Meeting note formatting', minutes: Math.round(metrics.timeSaved.totalMinutes * 0.25) },
                  { label: 'Next step tracking', minutes: Math.round(metrics.timeSaved.totalMinutes * 0.15) },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2">
                    <span className="text-sm text-slate-300">{item.label}</span>
                    <span className="text-sm font-medium text-white">{item.minutes} min</span>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-slate-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Projected annual savings</span>
                  <span className="text-lg font-bold text-emerald-400">
                    ${(estimatedCostSaved * 12).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Errors Prevented */}
          <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-6">
              <AlertTriangle className="size-5 text-amber-400" />
              <h2 className="font-semibold text-white">Errors Prevented</h2>
            </div>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-white">{metrics.errorsPrevented.total}</div>
                    <div className="text-sm text-slate-400">issues caught before they impacted CRM</div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-amber-400">
                      <ArrowDown className="size-4" />
                      <span className="font-medium">{metrics.errorsPrevented.trend}%</span>
                    </div>
                    <div className="text-xs text-slate-500">error rate</div>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Missed CRM updates', count: metrics.errorsPrevented.byType.missedUpdates, color: 'bg-red-500' },
                  { label: 'Incorrect data entries', count: metrics.errorsPrevented.byType.incorrectData, color: 'bg-amber-500' },
                  { label: 'Duplicate entries', count: metrics.errorsPrevented.byType.duplicateEntries, color: 'bg-blue-500' },
                  { label: 'Stale records', count: metrics.errorsPrevented.byType.staleRecords, color: 'bg-slate-500' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={cn('size-2 rounded-full', item.color)} />
                    <span className="flex-1 text-sm text-slate-300">{item.label}</span>
                    <span className="text-sm font-medium text-white">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Data Quality Scores */}
          <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-6">
              <Target className="size-5 text-emerald-400" />
              <h2 className="font-semibold text-white">Data Quality Scores</h2>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Field Completion', value: metrics.dataQuality.completionRate, target: 90 },
                { label: 'Data Accuracy', value: metrics.dataQuality.accuracyScore, target: 95 },
                { label: 'Data Freshness', value: metrics.dataQuality.freshnessScore, target: 95 },
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">{item.label}</span>
                    <span className={cn(
                      'font-medium',
                      item.value >= item.target ? 'text-emerald-400' : 'text-amber-400'
                    )}>
                      {item.value}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-700 overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all',
                        item.value >= item.target ? 'bg-emerald-500' : 'bg-amber-500'
                      )}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                  <div className="text-xs text-slate-500 text-right">
                    Target: {item.target}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Projected Impact */}
          <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="size-5 text-purple-400" />
              <h2 className="font-semibold text-white">Projected Business Impact</h2>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30">
                  <div className="text-2xl font-bold text-white">
                    {metrics.projectedValue.hoursSavedPerMonth}hrs
                  </div>
                  <div className="text-sm text-slate-400">saved per month</div>
                </div>
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                  <div className="text-2xl font-bold text-emerald-400">
                    +{metrics.projectedValue.dealVelocityImprovement}%
                  </div>
                  <div className="text-sm text-slate-400">deal velocity</div>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/50 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Annual time savings</span>
                  <span className="font-medium text-white">{metrics.projectedValue.hoursSavedPerMonth * 12}hrs</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Annual cost savings</span>
                  <span className="font-medium text-emerald-400">
                    ${(metrics.projectedValue.costSavings * 12).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">ROI (assuming $200/mo cost)</span>
                  <span className="font-medium text-emerald-400">
                    {Math.round((metrics.projectedValue.costSavings * 12) / 2400 * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/20">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-white mb-1">Want to increase your ROI?</h3>
              <p className="text-sm text-slate-400">
                Enable more agents to capture value from additional meeting types.
              </p>
            </div>
            <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium hover:from-orange-600 hover:to-orange-700 transition-all flex items-center gap-2">
              <Sparkles className="size-4" />
              Configure More Agents
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  title,
  value,
  subtitle,
  trend,
  icon,
  color,
}: {
  title: string;
  value: string;
  subtitle: string;
  trend: number;
  icon: React.ReactNode;
  color: 'blue' | 'amber' | 'emerald' | 'purple';
}) {
  const colorConfig = {
    blue: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
    amber: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
    emerald: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
    purple: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
  };

  return (
    <div className={cn('p-4 rounded-xl border', colorConfig[color])}>
      <div className="flex items-center justify-between mb-3">
        <span className={cn('opacity-70', colorConfig[color].split(' ')[2])}>{icon}</span>
        <div className={cn(
          'flex items-center gap-1 text-xs font-medium',
          trend >= 0 ? 'text-emerald-400' : 'text-red-400'
        )}>
          {trend >= 0 ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />}
          {Math.abs(trend)}%
        </div>
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-xs text-slate-400">{subtitle}</div>
    </div>
  );
}

export default ROIDashboard;
