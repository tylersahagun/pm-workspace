import React from 'react';
import {
  ActionPlanItem,
  ChatContextItem,
  ChannelContext,
  JourneyEvent,
  JourneyRequirement,
  JourneySnapshot,
  JourneyStep,
  MemoryAnchor,
  JourneyTimelineConfig,
} from './types';
import { JourneySnapshotCard } from './JourneySnapshotCard';
import { JourneyHealthGrid } from './JourneyHealthGrid';
import { ActionPlan } from './ActionPlan';
import { JourneyPath } from './JourneyPath';
import { ChannelContextPanel } from './ChannelContextPanel';
import { ChatContextPanel } from './ChatContextPanel';
import { EventTimeline } from './EventTimeline';
import { JourneyTimeline } from './JourneyTimeline';

type WorkspaceState = 'default' | 'loading' | 'error' | 'empty' | 'success';

interface JourneyWorkspaceV2Props {
  accountName: string;
  stageLabel: string;
  lastUpdated: string;
  snapshot?: JourneySnapshot;
  requirements?: JourneyRequirement[];
  actionPlan?: ActionPlanItem[];
  journeyPath?: JourneyStep[];
  channelContext?: ChannelContext;
  chatContext?: ChatContextItem[];
  events?: JourneyEvent[];
  memoryAnchor?: MemoryAnchor;
  journeyTimeline?: JourneyTimelineConfig;
  state?: WorkspaceState;
  statusMessage?: string;
  errorMessage?: string;
  onOpenWorkspace?: () => void;
  onRetry?: () => void;
}

export function JourneyWorkspaceV2({
  accountName,
  stageLabel,
  lastUpdated,
  snapshot,
  requirements = [],
  actionPlan = [],
  journeyPath = [],
  channelContext,
  chatContext = [],
  events = [],
  memoryAnchor,
  journeyTimeline,
  state = 'default',
  statusMessage,
  errorMessage,
  onOpenWorkspace,
  onRetry,
}: JourneyWorkspaceV2Props) {
  const showContent = state !== 'loading' && state !== 'error' && state !== 'empty';

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">Journey Workspace</p>
              <h1 className="text-xl font-semibold text-gray-900">{accountName}</h1>
              <p className="text-sm text-gray-500">
                {stageLabel} • Updated {lastUpdated}
              </p>
            </div>
            <button
              onClick={onOpenWorkspace}
              className="px-3 py-1.5 text-sm font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-800"
            >
              Open Deal Workspace
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-6 space-y-4" aria-live="polite">
        {state === 'loading' && (
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-600">Analyzing your calls...</p>
            <div className="mt-4 space-y-3 animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-2/3" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
            </div>
          </div>
        )}

        {state === 'error' && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <div className="flex items-center justify-between gap-3">
              <p>{errorMessage ?? 'Could not load journey insights. Please try again.'}</p>
              <button
                onClick={onRetry}
                className="text-xs font-medium text-red-700 hover:text-red-900"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {state === 'success' && (
          <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            <div className="flex items-center justify-between gap-3">
              <p>{statusMessage ?? 'Action saved. You can undo this for the next 5 minutes.'}</p>
              <button className="text-xs font-medium text-green-700 hover:text-green-900">
                Undo
              </button>
            </div>
          </div>
        )}

        {state === 'empty' && (
          <div className="rounded-xl border border-dashed bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">No journey data yet</h2>
            <p className="text-sm text-gray-600 mt-2">
              Add notes or ask AskElephant to summarize the latest call before taking action.
            </p>
            <button className="mt-4 px-3 py-1.5 text-sm font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-800">
              Add context
            </button>
          </div>
        )}
      </div>

      {showContent && (
        <div className="max-w-6xl mx-auto px-6 pb-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {snapshot && (
              <JourneySnapshotCard
                snapshot={snapshot}
                memoryAnchor={memoryAnchor}
                onOpenWorkspace={onOpenWorkspace}
              />
            )}
            {requirements.length > 0 && <JourneyHealthGrid requirements={requirements} />}
            {journeyTimeline && <JourneyTimeline {...journeyTimeline} />}
            {events.length > 0 && <EventTimeline events={events} orientation="horizontal" />}
            {actionPlan.length > 0 && <ActionPlan items={actionPlan} />}
          </div>
          <div className="space-y-6">
            {journeyPath.length > 0 && <JourneyPath steps={journeyPath} />}
            {channelContext && <ChannelContextPanel {...channelContext} />}
            {chatContext.length > 0 && <ChatContextPanel items={chatContext} />}
            {events.length > 0 && <EventTimeline events={events} orientation="vertical" />}
          </div>
        </div>
      )}
    </div>
  );
}
