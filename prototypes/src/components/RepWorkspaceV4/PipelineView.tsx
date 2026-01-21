import * as React from 'react';
import { Account, DealStage, STAGE_CONFIG, HEALTH_CONFIG } from './types';

// ============================================
// PIPELINE VIEW - Kanban-style deal board
// Maple Feedback: "Pipeline view mirroring HubSpot"
// ============================================

interface PipelineViewProps {
  accounts: Account[];
  onAccountClick?: (id: string) => void;
  onDealWorkspace?: (id: string) => void;
}

const PIPELINE_STAGES: DealStage[] = [
  'discovery',
  'qualification', 
  'demo',
  'proposal',
  'negotiation',
  'closing',
];

export function PipelineView({ accounts, onAccountClick, onDealWorkspace }: PipelineViewProps) {
  // Group accounts by stage
  const accountsByStage = React.useMemo(() => {
    const grouped: Record<DealStage, Account[]> = {
      discovery: [],
      qualification: [],
      demo: [],
      proposal: [],
      negotiation: [],
      closing: [],
    };
    
    accounts.forEach((account) => {
      if (grouped[account.stage]) {
        grouped[account.stage].push(account);
      }
    });
    
    return grouped;
  }, [accounts]);

  // Calculate stage totals
  const stageTotals = React.useMemo(() => {
    const totals: Record<DealStage, number> = {
      discovery: 0,
      qualification: 0,
      demo: 0,
      proposal: 0,
      negotiation: 0,
      closing: 0,
    };
    
    accounts.forEach((account) => {
      totals[account.stage] += account.dealValue;
    });
    
    return totals;
  }, [accounts]);

  return (
    <div className="h-full">
      {/* Pipeline Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Pipeline View</h2>
          <p className="text-sm text-gray-500">Drag deals between stages or click to open deal workspace</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {accounts.length} deals • ${(accounts.reduce((sum, a) => sum + a.dealValue, 0) / 1000).toFixed(0)}K total
          </span>
        </div>
      </div>

      {/* Pipeline Columns */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {PIPELINE_STAGES.map((stage) => {
          const stageAccounts = accountsByStage[stage];
          const config = STAGE_CONFIG[stage];
          const total = stageTotals[stage];
          
          return (
            <div
              key={stage}
              className="flex-shrink-0 w-72 bg-gray-50 rounded-xl border"
            >
              {/* Column Header */}
              <div className={`p-3 border-b ${config.bgColor} rounded-t-xl`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`font-medium ${config.color}`}>
                      {config.label}
                    </span>
                    <span className="text-xs bg-white/60 px-2 py-0.5 rounded-full">
                      {stageAccounts.length}
                    </span>
                  </div>
                  <span className="text-xs font-medium text-gray-600">
                    ${(total / 1000).toFixed(0)}K
                  </span>
                </div>
              </div>

              {/* Cards */}
              <div className="p-2 space-y-2 min-h-[200px] max-h-[calc(100vh-300px)] overflow-y-auto">
                {stageAccounts.length === 0 ? (
                  <div className="text-center py-8 text-gray-400 text-sm">
                    No deals in {config.label.toLowerCase()}
                  </div>
                ) : (
                  stageAccounts.map((account) => (
                    <PipelineCard
                      key={account.id}
                      account={account}
                      onClick={() => onAccountClick?.(account.id)}
                      onOpenWorkspace={() => onDealWorkspace?.(account.id)}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================
// Pipeline Card - Individual deal card
// ============================================

interface PipelineCardProps {
  account: Account;
  onClick?: () => void;
  onOpenWorkspace?: () => void;
}

function PipelineCard({ account, onClick, onOpenWorkspace }: PipelineCardProps) {
  const healthConfig = HEALTH_CONFIG[account.health];
  
  return (
    <div
      className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-all cursor-pointer group"
      onClick={onClick}
    >
      <div className="p-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="min-w-0 flex-1">
            <h3 className="font-medium text-gray-900 truncate">{account.name}</h3>
            <p className="text-lg font-semibold text-gray-900">
              ${(account.dealValue / 1000).toFixed(0)}K
            </p>
          </div>
          <span
            className={`text-xs px-2 py-1 rounded-full ${healthConfig.bgColor} ${healthConfig.color}`}
          >
            {healthConfig.icon}
          </span>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
          <span>{account.meetingCount} meetings</span>
          {account.expectedCloseDate && (
            <span>Close: {new Date(account.expectedCloseDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          )}
        </div>

        {/* Next Step */}
        {account.nextStep && (
          <p className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded truncate">
            Next: {account.nextStep}
          </p>
        )}

        {/* Actions indicator */}
        {account.pendingActions > 0 && (
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
              {account.pendingActions} action{account.pendingActions > 1 ? 's' : ''} pending
            </span>
          </div>
        )}

        {/* Hover Actions */}
        <div className="mt-2 pt-2 border-t opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenWorkspace?.();
            }}
            className="flex-1 text-xs px-2 py-1.5 bg-indigo-50 text-indigo-700 rounded hover:bg-indigo-100 transition-colors font-medium"
          >
            💬 Deal Workspace
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// Empty State
// ============================================

export function PipelineViewEmpty() {
  return (
    <div className="flex items-center justify-center h-64 bg-gray-50 rounded-xl border-2 border-dashed">
      <div className="text-center">
        <div className="text-4xl mb-2">📊</div>
        <h3 className="font-medium text-gray-900 mb-1">No deals yet</h3>
        <p className="text-sm text-gray-500">Your pipeline will appear here once you have active deals</p>
      </div>
    </div>
  );
}

// ============================================
// Loading State
// ============================================

export function PipelineViewLoading() {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {PIPELINE_STAGES.slice(0, 4).map((stage, i) => (
        <div key={i} className="flex-shrink-0 w-72 bg-gray-50 rounded-xl border animate-pulse">
          <div className="p-3 border-b bg-gray-100 rounded-t-xl">
            <div className="h-5 bg-gray-200 rounded w-24" />
          </div>
          <div className="p-2 space-y-2">
            {[1, 2].map((j) => (
              <div key={j} className="bg-white rounded-lg border p-3">
                <div className="h-4 bg-gray-200 rounded w-32 mb-2" />
                <div className="h-6 bg-gray-200 rounded w-16 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-full" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default PipelineView;
