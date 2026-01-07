import React from 'react';
import {
  ActionPlanItem,
  ChannelContext,
  ChatContextItem,
  JourneyRequirement,
  JourneySnapshot,
  MemoryAnchor,
  OrchestrationLane,
  OrchestrationStage,
  SentimentBloom,
} from './types';
import { JourneySnapshotCardV3 } from './JourneySnapshotCardV3';
import { JourneyHealthGridV3 } from './JourneyHealthGridV3';
import { ActionPlanV3 } from './ActionPlanV3';
import { ChannelContextPanelV3 } from './ChannelContextPanelV3';
import { ChatContextPanelV3 } from './ChatContextPanelV3';
import { OrchestrationTimeline } from './OrchestrationTimeline';

type WorkspaceState = 'default' | 'loading' | 'error' | 'empty' | 'success' | 'low_confidence';

interface JourneyWorkspaceV3Props {
  accountName: string;
  stageLabel: string;
  lastUpdated: string;
  snapshot?: JourneySnapshot;
  requirements?: JourneyRequirement[];
  actionPlan?: ActionPlanItem[];
  stages?: OrchestrationStage[];
  lanes?: OrchestrationLane[];
  blooms?: SentimentBloom[];
  channelContext?: ChannelContext;
  chatContext?: ChatContextItem[];
  memoryAnchor?: MemoryAnchor;
  state?: WorkspaceState;
  statusMessage?: string;
  errorMessage?: string;
  onOpenWorkspace?: () => void;
  onRetry?: () => void;
}

export function JourneyWorkspaceV3({
  accountName,
  stageLabel,
  lastUpdated,
  snapshot,
  requirements = [],
  actionPlan = [],
  stages = [],
  lanes = [],
  blooms = [],
  channelContext,
  chatContext = [],
  memoryAnchor,
  state = 'default',
  statusMessage,
  errorMessage,
  onOpenWorkspace,
  onRetry,
}: JourneyWorkspaceV3Props) {
  const showContent = state !== 'loading' && state !== 'error' && state !== 'empty';

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Journey Workspace</p>
              <h1 className="text-xl font-semibold text-slate-900 mt-1">{accountName}</h1>
              <p className="text-sm text-slate-500">
                {stageLabel} • Updated {lastUpdated}
              </p>
            </div>
            <button
              onClick={onOpenWorkspace}
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Open Deal Workspace
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-6 space-y-4" aria-live="polite">
        {state === 'loading' && (
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-600">Analyzing journey signals...</p>
            <div className="mt-4 space-y-3 animate-pulse motion-reduce:animate-none">
              <div className="h-5 bg-slate-200 rounded w-2/3" />
              <div className="h-4 bg-slate-200 rounded w-full" />
              <div className="h-4 bg-slate-200 rounded w-5/6" />
            </div>
          </div>
        )}

        {state === 'error' && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            <div className="flex items-center justify-between gap-3">
              <p>{errorMessage ?? 'Could not load the orchestration view. Please retry.'}</p>
              <button onClick={onRetry} className="text-xs font-semibold text-rose-700 hover:text-rose-900">
                Retry
              </button>
            </div>
          </div>
        )}

        {state === 'success' && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
            <div className="flex items-center justify-between gap-3">
              <p>{statusMessage ?? 'Action saved. Undo is available for 5 minutes.'}</p>
              <button className="text-xs font-semibold text-emerald-700 hover:text-emerald-900">
                Undo
              </button>
            </div>
          </div>
        )}

        {state === 'low_confidence' && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
            <div className="flex items-center justify-between gap-3">
              <p>This is a low-confidence snapshot. Does this look right?</p>
              <button className="text-xs font-semibold text-amber-700 hover:text-amber-900">
                Verify
              </button>
            </div>
          </div>
        )}

        {state === 'empty' && (
          <div className="rounded-2xl border border-dashed bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">No journey data yet</h2>
            <p className="text-sm text-slate-600 mt-2">
              Add notes or ask AskElephant to summarize the latest call before taking action.
            </p>
            <button className="mt-4 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
              Add context
            </button>
          </div>
        )}
      </div>

      {showContent && (
        <div className="max-w-6xl mx-auto px-6 pb-10 space-y-6">
          {stages.length > 0 && lanes.length > 0 && (
            <OrchestrationTimeline stages={stages} lanes={lanes} blooms={blooms} />
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {snapshot && (
                <JourneySnapshotCardV3
                  snapshot={snapshot}
                  memoryAnchor={memoryAnchor}
                  onOpenWorkspace={onOpenWorkspace}
                />
              )}
              {requirements.length > 0 && <JourneyHealthGridV3 requirements={requirements} />}
              {actionPlan.length > 0 && <ActionPlanV3 items={actionPlan} />}
            </div>
            <div className="space-y-6">
              {channelContext && <ChannelContextPanelV3 {...channelContext} />}
              {chatContext.length > 0 && <ChatContextPanelV3 items={chatContext} />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
