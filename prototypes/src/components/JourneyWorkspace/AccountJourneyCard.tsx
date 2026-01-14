import React, { useState } from 'react';
import {
  Account,
  JourneyStage,
  JOURNEY_STAGES,
  Milestone,
} from './types';
import { DealHealthBadge, DealHealthIndicator } from './DealHealthIndicator';
import { ActionCard, ActionCardEmpty, ActionCardLoading } from './ActionCard';

// ============================================
// ACCOUNT JOURNEY CARD - List View
// ============================================

interface AccountJourneyCardProps {
  account: Account;
  variant?: 'control' | 'balanced' | 'efficient';
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  onAccountClick?: (accountId: string) => void;
  onActionExecute?: (actionId: string) => void;
  onActionDismiss?: (actionId: string) => void;
}

export function AccountJourneyCard({
  account,
  variant = 'balanced',
  isExpanded = false,
  onToggleExpand,
  onAccountClick,
  onActionExecute,
  onActionDismiss,
}: AccountJourneyCardProps) {
  const stageConfig = JOURNEY_STAGES[account.stage];
  const topAction = account.suggestedActions.find((a) => !a.isCompleted);
  const completedMilestones = account.milestones.filter((m) => m.isCompleted);
  const blockedMilestone = account.milestones.find((m) => m.isBlocked);

  // ============================================
  // OPTION A: Maximum Control - Full details visible
  // ============================================
  if (variant === 'control') {
    return (
      <div className="border rounded-xl bg-white shadow-sm">
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                {account.logoUrl ? (
                  <img
                    src={account.logoUrl}
                    alt=""
                    className="w-6 h-6 rounded"
                  />
                ) : (
                  <div className="w-6 h-6 rounded bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                    {account.name.charAt(0)}
                  </div>
                )}
                <h3
                  className="font-semibold text-gray-900 hover:text-blue-600 cursor-pointer"
                  onClick={() => onAccountClick?.(account.id)}
                >
                  {account.name}
                </h3>
                {account.industry && (
                  <span className="text-xs text-gray-500">• {account.industry}</span>
                )}
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <span>${account.dealValue.toLocaleString()}</span>
                <span>•</span>
                <StageBadge stage={account.stage} />
                <span className="text-xs text-gray-400">
                  {account.daysInStage} days in stage
                </span>
              </div>
            </div>
            <DealHealthIndicator health={account.health} variant="detailed" showEvidence />
          </div>
        </div>

        {/* Journey Progress */}
        <div className="p-4 border-b bg-gray-50">
          <JourneyProgressBar
            milestones={account.milestones}
            currentStage={account.stage}
          />
          {blockedMilestone && (
            <div className="mt-3 flex items-center gap-2 text-sm text-amber-700 bg-amber-50 px-3 py-2 rounded">
              <span>⚠</span>
              <span>
                <strong>Blocked:</strong> {blockedMilestone.name} - {blockedMilestone.blockerReason}
              </span>
            </div>
          )}
        </div>

        {/* Primary Contact */}
        {account.primaryContact && (
          <div className="px-4 py-3 border-b flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-medium text-blue-700">
              {account.primaryContact.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">
                {account.primaryContact.name}
              </div>
              <div className="text-xs text-gray-500">
                {account.primaryContact.title} • {account.primaryContact.role}
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="p-4">
          <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">
            Recommended Actions
          </h4>
          <div className="space-y-3">
            {account.suggestedActions.filter((a) => !a.isCompleted).length > 0 ? (
              account.suggestedActions
                .filter((a) => !a.isCompleted)
                .map((action) => (
                  <ActionCard
                    key={action.id}
                    action={action}
                    accountName={account.name}
                    variant="control"
                    onExecute={onActionExecute}
                    onDismiss={onActionDismiss}
                  />
                ))
            ) : (
              <ActionCardEmpty />
            )}
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // OPTION B: Balanced - Expandable card
  // ============================================
  if (variant === 'balanced') {
    return (
      <div className="border rounded-xl bg-white hover:shadow-md transition-shadow">
        {/* Collapsed View */}
        <div
          className="p-4 cursor-pointer"
          onClick={onToggleExpand}
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              {/* Logo/Initial */}
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-600 shrink-0">
                {account.name.charAt(0)}
              </div>

              {/* Account Info */}
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900 truncate">{account.name}</h3>
                  <DealHealthBadge status={account.health.status} size="sm" />
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>${account.dealValue.toLocaleString()}</span>
                  <span>•</span>
                  <StageBadge stage={account.stage} size="sm" />
                  {account.expectedCloseDate && (
                    <>
                      <span>•</span>
                      <span>Close: {new Date(account.expectedCloseDate).toLocaleDateString()}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Action Preview + Expand */}
            <div className="flex items-center gap-3 shrink-0">
              {topAction && (
                <div className="hidden sm:block max-w-[200px]">
                  <span className="text-xs text-gray-500">Next action:</span>
                  <p className="text-sm text-gray-700 truncate">{topAction.title}</p>
                </div>
              )}
              <button className="text-gray-400 hover:text-gray-600">
                {isExpanded ? '▼' : '▶'}
              </button>
            </div>
          </div>

          {/* Mini milestone progress */}
          <div className="mt-3">
            <MilestoneProgressDots milestones={account.milestones} />
          </div>
        </div>

        {/* Expanded View */}
        {isExpanded && (
          <div className="border-t animate-slideDown">
            {/* Health Details */}
            <div className="p-4 bg-gray-50 border-b">
              <DealHealthIndicator health={account.health} variant="detailed" showEvidence />
            </div>

            {/* Milestone Details */}
            <div className="p-4 border-b">
              <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                Journey Progress
              </h4>
              <JourneyProgressBar milestones={account.milestones} currentStage={account.stage} />
            </div>

            {/* Actions */}
            <div className="p-4">
              <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">
                Recommended Actions ({account.suggestedActions.filter((a) => !a.isCompleted).length})
              </h4>
              <div className="space-y-3">
                {account.suggestedActions.filter((a) => !a.isCompleted).length > 0 ? (
                  account.suggestedActions
                    .filter((a) => !a.isCompleted)
                    .map((action) => (
                      <ActionCard
                        key={action.id}
                        action={action}
                        accountName={account.name}
                        variant="balanced"
                        onExecute={onActionExecute}
                        onDismiss={onActionDismiss}
                      />
                    ))
                ) : (
                  <ActionCardEmpty />
                )}
              </div>
            </div>

            {/* Footer Link */}
            <div className="px-4 py-3 border-t bg-gray-50">
              <button
                onClick={() => onAccountClick?.(account.id)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                View full account details →
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ============================================
  // OPTION C: Efficient - Minimal row
  // ============================================
  return (
    <div className="flex items-center gap-4 p-3 hover:bg-gray-50 border-b border-gray-100 transition-colors">
      {/* Health indicator bar */}
      <div
        className={`w-1 h-12 rounded-full ${
          account.health.status === 'strong'
            ? 'bg-green-500'
            : account.health.status === 'healthy'
            ? 'bg-blue-500'
            : account.health.status === 'at_risk'
            ? 'bg-amber-500'
            : 'bg-red-500'
        }`}
      />

      {/* Account name + stage */}
      <div
        className="flex-1 min-w-0 cursor-pointer"
        onClick={() => onAccountClick?.(account.id)}
      >
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900 truncate">{account.name}</span>
          <span className="text-xs text-gray-400">${(account.dealValue / 1000).toFixed(0)}K</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <StageBadge stage={account.stage} size="sm" />
          <span>•</span>
          <span>{completedMilestones.length}/{account.milestones.length} milestones</span>
          {blockedMilestone && (
            <>
              <span>•</span>
              <span className="text-amber-600">⚠ Blocked</span>
            </>
          )}
        </div>
      </div>

      {/* Top action */}
      {topAction && (
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <span className="text-sm text-gray-600 max-w-[180px] truncate">
            {topAction.title}
          </span>
          <button
            onClick={() => onActionExecute?.(topAction.id)}
            className="px-3 py-1 text-sm font-medium bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {topAction.aiDraft ? 'Send' : 'Do'}
          </button>
        </div>
      )}

      {/* Expand button */}
      <button
        onClick={onToggleExpand}
        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded shrink-0"
      >
        ⋯
      </button>
    </div>
  );
}

// ============================================
// ACCOUNT CARD STATES
// ============================================

export function AccountCardLoading({ variant = 'balanced' }: { variant?: 'control' | 'balanced' | 'efficient' }) {
  if (variant === 'efficient') {
    return (
      <div className="flex items-center gap-4 p-3 border-b border-gray-100 animate-pulse">
        <div className="w-1 h-12 rounded-full bg-gray-200" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/3" />
          <div className="h-3 bg-gray-100 rounded w-1/4" />
        </div>
        <div className="w-20 h-8 bg-gray-200 rounded" />
      </div>
    );
  }

  return (
    <div className="border rounded-xl p-4 animate-pulse">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg bg-gray-200" />
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-gray-200 rounded w-1/3" />
          <div className="h-4 bg-gray-100 rounded w-1/2" />
        </div>
      </div>
      <div className="h-2 bg-gray-100 rounded-full w-full mt-3" />
    </div>
  );
}

export function AccountCardEmpty() {
  return (
    <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
      <div className="text-4xl mb-3">📊</div>
      <h4 className="font-medium text-gray-900 mb-1">No accounts to show</h4>
      <p className="text-sm text-gray-500">
        Accounts matching your filters will appear here.
      </p>
    </div>
  );
}

// ============================================
// HELPER COMPONENTS
// ============================================

function StageBadge({ stage, size = 'md' }: { stage: JourneyStage; size?: 'sm' | 'md' }) {
  const config = JOURNEY_STAGES[stage];
  const sizeClasses = size === 'sm' ? 'text-xs px-1.5 py-0.5' : 'text-sm px-2 py-1';

  return (
    <span className={`inline-flex items-center rounded font-medium bg-gray-100 text-gray-700 ${sizeClasses}`}>
      {config.label}
    </span>
  );
}

function JourneyProgressBar({
  milestones,
  currentStage,
}: {
  milestones: Milestone[];
  currentStage: JourneyStage;
}) {
  return (
    <div className="space-y-2">
      {milestones.map((milestone, idx) => (
        <div key={milestone.id} className="flex items-center gap-3">
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0 ${
              milestone.isCompleted
                ? 'bg-green-500 text-white'
                : milestone.isBlocked
                ? 'bg-amber-500 text-white'
                : 'bg-gray-200 text-gray-500'
            }`}
          >
            {milestone.isCompleted ? '✓' : milestone.isBlocked ? '!' : idx + 1}
          </div>
          <div className="flex-1">
            <span
              className={`text-sm ${
                milestone.isCompleted
                  ? 'text-gray-600 line-through'
                  : milestone.isBlocked
                  ? 'text-amber-700 font-medium'
                  : 'text-gray-900'
              }`}
            >
              {milestone.name}
            </span>
            {milestone.isBlocked && milestone.blockerReason && (
              <p className="text-xs text-amber-600">{milestone.blockerReason}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function MilestoneProgressDots({ milestones }: { milestones: Milestone[] }) {
  return (
    <div className="flex items-center gap-1">
      {milestones.map((milestone) => (
        <div
          key={milestone.id}
          className={`w-2 h-2 rounded-full ${
            milestone.isCompleted
              ? 'bg-green-500'
              : milestone.isBlocked
              ? 'bg-amber-500'
              : 'bg-gray-200'
          }`}
          title={milestone.name}
        />
      ))}
    </div>
  );
}

export { StageBadge, JourneyProgressBar, MilestoneProgressDots };
