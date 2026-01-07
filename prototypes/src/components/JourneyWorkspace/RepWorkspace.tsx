import React, { useState } from 'react';
import {
  Account,
  WorkspaceStats,
  JourneyStage,
  DealHealthStatus,
  JOURNEY_STAGES,
  HEALTH_STATUS_CONFIG,
  SuggestedAction,
} from './types';
import { AccountJourneyCard, AccountCardLoading, AccountCardEmpty } from './AccountJourneyCard';
import { ActionCard, ActionCardLoading, ActionCardEmpty, ActionCardError } from './ActionCard';
import { DealHealthBadge } from './DealHealthIndicator';

// ============================================
// REP WORKSPACE - Main Component
// ============================================

interface RepWorkspaceProps {
  accounts: Account[];
  stats: WorkspaceStats;
  variant: 'control' | 'balanced' | 'efficient';
  isLoading?: boolean;
  error?: string;
  onActionExecute?: (actionId: string) => void;
  onActionDismiss?: (actionId: string) => void;
  onAccountClick?: (accountId: string) => void;
  onRetry?: () => void;
}

export function RepWorkspace({
  accounts,
  stats,
  variant,
  isLoading = false,
  error,
  onActionExecute,
  onActionDismiss,
  onAccountClick,
  onRetry,
}: RepWorkspaceProps) {
  const [expandedAccountId, setExpandedAccountId] = useState<string | null>(null);
  const [filterStage, setFilterStage] = useState<JourneyStage | 'all'>('all');
  const [filterHealth, setFilterHealth] = useState<DealHealthStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<'priority' | 'health' | 'value' | 'closeDate'>('priority');

  // Get all actions across accounts, sorted by priority
  const allActions = accounts
    .flatMap((account) =>
      account.suggestedActions
        .filter((a) => !a.isCompleted)
        .map((action) => ({ ...action, accountName: account.name }))
    )
    .sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

  // Filter accounts
  const filteredAccounts = accounts.filter((account) => {
    if (filterStage !== 'all' && account.stage !== filterStage) return false;
    if (filterHealth !== 'all' && account.health.status !== filterHealth) return false;
    return true;
  });

  // Sort accounts
  const sortedAccounts = [...filteredAccounts].sort((a, b) => {
    switch (sortBy) {
      case 'health':
        const healthOrder = { critical: 0, at_risk: 1, healthy: 2, strong: 3 };
        return healthOrder[a.health.status] - healthOrder[b.health.status];
      case 'value':
        return b.dealValue - a.dealValue;
      case 'closeDate':
        return (
          new Date(a.expectedCloseDate || '9999').getTime() -
          new Date(b.expectedCloseDate || '9999').getTime()
        );
      default: // priority - accounts with higher priority actions first
        const aTopPriority = a.suggestedActions[0]?.priority || 'low';
        const bTopPriority = b.suggestedActions[0]?.priority || 'low';
        const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        return priorityOrder[aTopPriority] - priorityOrder[bTopPriority];
    }
  });

  // ============================================
  // OPTION A: Maximum Control
  // Full visibility, explicit approval, all evidence shown
  // ============================================
  if (variant === 'control') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header with Stats */}
        <header className="bg-white border-b sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Journey Workspace</h1>
                <p className="text-sm text-gray-500">
                  Review and approve AI-recommended actions for your accounts
                </p>
              </div>
              <StatsBar stats={stats} variant="full" />
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-6 py-6">
          {/* Filters + Controls */}
          <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
            <FilterBar
              filterStage={filterStage}
              filterHealth={filterHealth}
              sortBy={sortBy}
              onFilterStage={setFilterStage}
              onFilterHealth={setFilterHealth}
              onSort={setSortBy}
            />
            <div className="text-sm text-gray-500">
              {filteredAccounts.length} accounts • {allActions.length} pending actions
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="mb-6">
              <ActionCardError error={error} onRetry={onRetry} />
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <AccountCardLoading key={i} variant="control" />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && sortedAccounts.length === 0 && <AccountCardEmpty />}

          {/* Account List - Full Cards */}
          {!isLoading && !error && sortedAccounts.length > 0 && (
            <div className="space-y-6">
              {sortedAccounts.map((account) => (
                <AccountJourneyCard
                  key={account.id}
                  account={account}
                  variant="control"
                  onAccountClick={onAccountClick}
                  onActionExecute={onActionExecute}
                  onActionDismiss={onActionDismiss}
                />
              ))}
            </div>
          )}
        </div>

        {/* Trust Footer */}
        <footer className="border-t bg-white mt-8">
          <div className="max-w-7xl mx-auto px-6 py-4 text-center text-xs text-gray-500">
            <p>
              All actions require your approval before execution. AI recommendations are based on
              your conversation history and deal context.{' '}
              <a href="#" className="text-blue-600 hover:underline">
                Learn how AI works
              </a>
            </p>
          </div>
        </footer>
      </div>
    );
  }

  // ============================================
  // OPTION B: Balanced (RECOMMENDED)
  // Two-column: Priority actions + Account list
  // ============================================
  if (variant === 'balanced') {
    const topActions = allActions.slice(0, 5);

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Good morning! 👋</h1>
                <p className="text-sm text-gray-500">
                  Here's what matters most for your deals today
                </p>
              </div>
              <StatsBar stats={stats} variant="compact" />
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Priority Actions */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border shadow-sm sticky top-24">
                <div className="p-4 border-b">
                  <h2 className="font-semibold text-gray-900">Top Actions</h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Ranked by impact on your pipeline
                  </p>
                </div>

                {isLoading && (
                  <div className="p-4 space-y-3">
                    {[1, 2, 3].map((i) => (
                      <ActionCardLoading key={i} variant="balanced" />
                    ))}
                  </div>
                )}

                {error && (
                  <div className="p-4">
                    <ActionCardError error={error} onRetry={onRetry} />
                  </div>
                )}

                {!isLoading && !error && topActions.length === 0 && (
                  <div className="p-4">
                    <ActionCardEmpty />
                  </div>
                )}

                {!isLoading && !error && topActions.length > 0 && (
                  <div className="divide-y">
                    {topActions.map((action) => (
                      <div key={action.id} className="p-3">
                        <ActionCard
                          action={action}
                          accountName={action.accountName}
                          variant="balanced"
                          onExecute={onActionExecute}
                          onDismiss={onActionDismiss}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {allActions.length > 5 && (
                  <div className="p-3 border-t bg-gray-50">
                    <button className="text-sm text-blue-600 hover:text-blue-800 w-full text-center">
                      View all {allActions.length} actions →
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Account List */}
            <div className="lg:col-span-2">
              {/* Filters */}
              <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
                <h2 className="font-semibold text-gray-900">Your Accounts</h2>
                <FilterBar
                  filterStage={filterStage}
                  filterHealth={filterHealth}
                  sortBy={sortBy}
                  onFilterStage={setFilterStage}
                  onFilterHealth={setFilterHealth}
                  onSort={setSortBy}
                  compact
                />
              </div>

              {/* Account List */}
              {isLoading && (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <AccountCardLoading key={i} variant="balanced" />
                  ))}
                </div>
              )}

              {!isLoading && !error && sortedAccounts.length === 0 && <AccountCardEmpty />}

              {!isLoading && !error && sortedAccounts.length > 0 && (
                <div className="space-y-3">
                  {sortedAccounts.map((account) => (
                    <AccountJourneyCard
                      key={account.id}
                      account={account}
                      variant="balanced"
                      isExpanded={expandedAccountId === account.id}
                      onToggleExpand={() =>
                        setExpandedAccountId(
                          expandedAccountId === account.id ? null : account.id
                        )
                      }
                      onAccountClick={onAccountClick}
                      onActionExecute={onActionExecute}
                      onActionDismiss={onActionDismiss}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // OPTION C: Maximum Efficiency
  // Inbox-zero style, minimal UI, batch actions
  // ============================================
  return (
    <div className="min-h-screen bg-white">
      {/* Minimal Header */}
      <header className="border-b sticky top-0 z-10 bg-white">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-gray-900">Inbox</h1>
            <span className="text-sm text-gray-500">
              {allActions.length} actions
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MiniStats stats={stats} />
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
              ⚙
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto">
        {/* Quick Filters */}
        <div className="flex items-center gap-2 px-4 py-2 border-b bg-gray-50 overflow-x-auto">
          <QuickFilter
            active={filterHealth === 'all'}
            onClick={() => setFilterHealth('all')}
            label={`All (${accounts.length})`}
          />
          <QuickFilter
            active={filterHealth === 'critical'}
            onClick={() => setFilterHealth('critical')}
            label={`Critical (${accounts.filter((a) => a.health.status === 'critical').length})`}
            color="red"
          />
          <QuickFilter
            active={filterHealth === 'at_risk'}
            onClick={() => setFilterHealth('at_risk')}
            label={`At Risk (${accounts.filter((a) => a.health.status === 'at_risk').length})`}
            color="amber"
          />
        </div>

        {/* Loading */}
        {isLoading && (
          <div>
            {[1, 2, 3, 4, 5].map((i) => (
              <ActionCardLoading key={i} variant="efficient" />
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="p-4">
            <ActionCardError error={error} onRetry={onRetry} />
          </div>
        )}

        {/* Empty */}
        {!isLoading && !error && allActions.length === 0 && (
          <div className="p-8">
            <ActionCardEmpty />
          </div>
        )}

        {/* Action Stream */}
        {!isLoading && !error && allActions.length > 0 && (
          <div>
            {/* Group by account, sorted by priority */}
            {sortedAccounts.map((account) => {
              const accountActions = account.suggestedActions.filter((a) => !a.isCompleted);
              if (accountActions.length === 0) return null;

              return (
                <div key={account.id}>
                  {/* Account Header Row */}
                  <div
                    className="flex items-center gap-3 px-4 py-2 bg-gray-50 border-b cursor-pointer hover:bg-gray-100"
                    onClick={() => onAccountClick?.(account.id)}
                  >
                    <DealHealthBadge status={account.health.status} size="sm" />
                    <span className="font-medium text-gray-900">{account.name}</span>
                    <span className="text-xs text-gray-500">
                      ${(account.dealValue / 1000).toFixed(0)}K • {JOURNEY_STAGES[account.stage].label}
                    </span>
                  </div>

                  {/* Actions for this account */}
                  {accountActions.map((action) => (
                    <ActionCard
                      key={action.id}
                      action={action}
                      accountName={account.name}
                      variant="efficient"
                      onExecute={onActionExecute}
                      onDismiss={onActionDismiss}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Action Summary */}
      {allActions.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-3">
          <span className="text-sm">
            {allActions.filter((a) => a.priority === 'critical').length} critical •{' '}
            {allActions.filter((a) => a.priority === 'high').length} high priority
          </span>
          <button className="px-3 py-1 bg-blue-500 rounded-full text-sm font-medium hover:bg-blue-600">
            Review All
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================
// HELPER COMPONENTS
// ============================================

function StatsBar({
  stats,
  variant,
}: {
  stats: WorkspaceStats;
  variant: 'full' | 'compact';
}) {
  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-4 text-sm">
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">{stats.actionsToday}</div>
          <div className="text-xs text-gray-500">Actions</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-amber-600">{stats.atRiskCount}</div>
          <div className="text-xs text-gray-500">At Risk</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-green-600">
            ${(stats.expectedCloseThisMonth / 1000).toFixed(0)}K
          </div>
          <div className="text-xs text-gray-500">Close This Month</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-6 text-sm">
      <div className="text-center px-3">
        <div className="text-xl font-semibold text-gray-900">{stats.totalAccounts}</div>
        <div className="text-xs text-gray-500">Accounts</div>
      </div>
      <div className="text-center px-3 border-l">
        <div className="text-xl font-semibold text-gray-900">{stats.actionsToday}</div>
        <div className="text-xs text-gray-500">Actions Today</div>
      </div>
      <div className="text-center px-3 border-l">
        <div className="text-xl font-semibold text-amber-600">{stats.atRiskCount}</div>
        <div className="text-xs text-gray-500">At Risk</div>
      </div>
      <div className="text-center px-3 border-l">
        <div className="text-xl font-semibold text-blue-600">
          ${(stats.pipelineValue / 1000).toFixed(0)}K
        </div>
        <div className="text-xs text-gray-500">Pipeline</div>
      </div>
    </div>
  );
}

function MiniStats({ stats }: { stats: WorkspaceStats }) {
  return (
    <div className="flex items-center gap-3 text-xs">
      <span className="text-amber-600">{stats.atRiskCount} at risk</span>
      <span className="text-gray-400">•</span>
      <span className="text-green-600">${(stats.expectedCloseThisMonth / 1000).toFixed(0)}K closing</span>
    </div>
  );
}

function FilterBar({
  filterStage,
  filterHealth,
  sortBy,
  onFilterStage,
  onFilterHealth,
  onSort,
  compact = false,
}: {
  filterStage: JourneyStage | 'all';
  filterHealth: DealHealthStatus | 'all';
  sortBy: string;
  onFilterStage: (stage: JourneyStage | 'all') => void;
  onFilterHealth: (health: DealHealthStatus | 'all') => void;
  onSort: (sort: 'priority' | 'health' | 'value' | 'closeDate') => void;
  compact?: boolean;
}) {
  const baseSelectClass = compact
    ? 'text-xs px-2 py-1 border rounded'
    : 'text-sm px-3 py-1.5 border rounded-lg';

  return (
    <div className="flex items-center gap-2">
      <select
        value={filterStage}
        onChange={(e) => onFilterStage(e.target.value as JourneyStage | 'all')}
        className={`${baseSelectClass} bg-white`}
      >
        <option value="all">All Stages</option>
        {Object.entries(JOURNEY_STAGES).map(([key, config]) => (
          <option key={key} value={key}>
            {config.label}
          </option>
        ))}
      </select>

      <select
        value={filterHealth}
        onChange={(e) => onFilterHealth(e.target.value as DealHealthStatus | 'all')}
        className={`${baseSelectClass} bg-white`}
      >
        <option value="all">All Health</option>
        {Object.entries(HEALTH_STATUS_CONFIG).map(([key, config]) => (
          <option key={key} value={key}>
            {config.label}
          </option>
        ))}
      </select>

      <select
        value={sortBy}
        onChange={(e) => onSort(e.target.value as 'priority' | 'health' | 'value' | 'closeDate')}
        className={`${baseSelectClass} bg-white`}
      >
        <option value="priority">Sort: Priority</option>
        <option value="health">Sort: Health</option>
        <option value="value">Sort: Value</option>
        <option value="closeDate">Sort: Close Date</option>
      </select>
    </div>
  );
}

function QuickFilter({
  active,
  onClick,
  label,
  color,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  color?: 'red' | 'amber' | 'green';
}) {
  const colorClasses = {
    red: 'text-red-700 bg-red-100',
    amber: 'text-amber-700 bg-amber-100',
    green: 'text-green-700 bg-green-100',
  };

  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap transition-colors ${
        active
          ? color
            ? colorClasses[color]
            : 'bg-gray-900 text-white'
          : 'bg-white text-gray-600 hover:bg-gray-100'
      }`}
    >
      {label}
    </button>
  );
}

export { StatsBar, FilterBar };
