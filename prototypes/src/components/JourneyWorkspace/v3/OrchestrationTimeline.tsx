import React, { useMemo, useState } from 'react';
import {
  OrchestrationLane,
  OrchestrationStage,
  OrchestrationItem,
  SentimentBloom,
  OrchestrationActor,
} from './types';
import { EvidenceChips } from './EvidenceChips';

type Orientation = 'horizontal' | 'vertical';

const ACTOR_LABELS: Record<OrchestrationActor, string> = {
  customer: 'Customer',
  success_manager: 'Success Manager',
  product: 'Product',
  automation: 'Automation',
};

const STATE_COLORS: Record<OrchestrationItem['state'], { border: string; text: string }> = {
  complete: { border: '#28A745', text: '#1F8A4C' },
  current: { border: '#007AFF', text: '#0B4DB8' },
  at_risk: { border: '#FFC107', text: '#8A5B00' },
  critical: { border: '#D73A49', text: '#8B1D2C' },
  next: { border: '#64748B', text: '#475569' },
  upcoming: { border: '#94A3B8', text: '#64748B' },
};

const STAGE_STATUS_STYLE: Record<OrchestrationStage['status'], { bg: string; text: string }> = {
  complete: { bg: '#E7F7EE', text: '#1F8A4C' },
  current: { bg: '#E8F2FF', text: '#0B4DB8' },
  next: { bg: '#FFF3D6', text: '#8A5B00' },
  upcoming: { bg: '#EEF2F7', text: '#5B6777' },
};

const BLOOM_STYLE: Record<SentimentBloom['sentiment'], string> = {
  positive: 'bg-emerald-200/60',
  neutral: 'bg-slate-200/60',
  warning: 'bg-amber-200/60',
  critical: 'bg-rose-200/60',
};

const formatTimestamp = (timestamp: string) =>
  new Date(timestamp).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

const isHumanActor = (actor: OrchestrationActor) =>
  actor === 'customer' || actor === 'success_manager';

interface OrchestrationTimelineProps {
  title?: string;
  orientation?: Orientation;
  stages: OrchestrationStage[];
  lanes: OrchestrationLane[];
  blooms?: SentimentBloom[];
}

export function OrchestrationTimeline({
  title = 'Orchestration Engine',
  orientation = 'horizontal',
  stages,
  lanes,
  blooms = [],
}: OrchestrationTimelineProps) {
  const [collapsedStages, setCollapsedStages] = useState<Set<string>>(new Set());
  const [hoverTimestamp, setHoverTimestamp] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<OrchestrationItem | null>(null);
  const [filters, setFilters] = useState({
    showHuman: true,
    showAutomated: true,
    showSignals: true,
  });

  const stagesById = useMemo(() => {
    const map = new Map<string, OrchestrationStage>();
    stages.forEach((stage) => map.set(stage.id, stage));
    return map;
  }, [stages]);

  const visibleItems = (items: OrchestrationItem[]) =>
    items.filter((item) => {
      if (!filters.showSignals && item.type === 'signal') {
        return false;
      }
      if (!filters.showAutomated && item.automated) {
        return false;
      }
      if (!filters.showHuman && isHumanActor(item.actor)) {
        return false;
      }
      return true;
    });

  const toggleStage = (stageId: string) => {
    setCollapsedStages((prev) => {
      const next = new Set(prev);
      if (next.has(stageId)) {
        next.delete(stageId);
      } else {
        next.add(stageId);
      }
      return next;
    });
  };

  const stageContainerClass =
    orientation === 'horizontal'
      ? 'flex gap-4 overflow-x-auto pb-2'
      : 'flex flex-col gap-4';

  return (
    <section className="bg-white border rounded-2xl shadow-sm">
      <div className="p-5 border-b space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Journey Timeline</p>
            <h3 className="text-sm font-semibold text-slate-900 mt-2">{title}</h3>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold text-slate-500">
            <span className="font-mono">Legend</span>
            <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-2 py-0.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> Complete
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-2 py-0.5">
              <span className="h-2 w-2 rounded-sm bg-blue-500" /> Active
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-2 py-0.5">
              <span className="h-2 w-2 rotate-45 bg-amber-400" /> Decision
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-2 py-0.5">
              <span className="h-0.5 w-6 bg-slate-700" /> Golden path
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <button
            className={`rounded-full border px-3 py-1 font-semibold ${
              filters.showHuman ? 'border-blue-200 text-blue-700 bg-blue-50' : 'border-slate-200 text-slate-500'
            }`}
            onClick={() => setFilters((prev) => ({ ...prev, showHuman: !prev.showHuman }))}
          >
            Human touchpoints
          </button>
          <button
            className={`rounded-full border px-3 py-1 font-semibold ${
              filters.showAutomated
                ? 'border-emerald-200 text-emerald-700 bg-emerald-50'
                : 'border-slate-200 text-slate-500'
            }`}
            onClick={() => setFilters((prev) => ({ ...prev, showAutomated: !prev.showAutomated }))}
          >
            Automated signals
          </button>
          <button
            className={`rounded-full border px-3 py-1 font-semibold ${
              filters.showSignals
                ? 'border-amber-200 text-amber-700 bg-amber-50'
                : 'border-slate-200 text-slate-500'
            }`}
            onClick={() => setFilters((prev) => ({ ...prev, showSignals: !prev.showSignals }))}
          >
            Signal flags
          </button>
        </div>
      </div>

      <div className="p-5 grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-5">
        <div className={stageContainerClass}>
          {stages.map((stage) => {
            const isCollapsed = collapsedStages.has(stage.id);
            const stageBloom = blooms.find((bloom) => bloom.stageId === stage.id);
            const stageStyle = STAGE_STATUS_STYLE[stage.status];

            return (
              <div
                key={stage.id}
                className={`relative rounded-2xl border bg-slate-50/60 p-4 ${
                  orientation === 'horizontal' ? 'min-w-[260px]' : ''
                }`}
              >
                {stageBloom && (
                  <div
                    className={`absolute -top-6 right-6 h-20 w-20 rounded-full blur-xl ${BLOOM_STYLE[stageBloom.sentiment]}`}
                    style={{ opacity: Math.min(0.7, 0.2 + stageBloom.intensity / 10) }}
                  />
                )}

                <div className="relative space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-2">
                      <div
                        className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold"
                        style={{ backgroundColor: stageStyle.bg, color: stageStyle.text }}
                      >
                        {stage.status === 'current' ? 'Active stage' : stage.status.toUpperCase()}
                      </div>
                      <div className="border-l-4 pl-3" style={{ borderColor: stageStyle.text }}>
                        <p className="text-sm font-semibold text-slate-900">{stage.label}</p>
                        <p className="text-xs text-slate-500 font-mono">{stage.timeRange}</p>
                      </div>
                    </div>
                    <button
                      className="text-[11px] font-semibold text-slate-500 hover:text-slate-700"
                      onClick={() => toggleStage(stage.id)}
                    >
                      {isCollapsed ? 'Expand' : 'Collapse'}
                    </button>
                  </div>
                  <p className="text-xs text-slate-600">{stage.summary}</p>
                </div>

                {!isCollapsed && (
                  <div className="mt-4 space-y-4">
                    {lanes.map((lane) => {
                      const items = visibleItems(
                        lane.items.filter((item) => item.stageId === stage.id),
                      ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

                      if (items.length === 0) {
                        return null;
                      }

                      return (
                        <div key={`${stage.id}-${lane.id}`} className="space-y-2">
                          <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500 uppercase tracking-[0.2em]">
                            <span className="h-2 w-2 rounded-full bg-slate-300" />
                            {lane.label} ({ACTOR_LABELS[lane.actor]})
                          </div>
                          <div className="space-y-2">
                            {items.map((item) => {
                              const colors = STATE_COLORS[item.state];
                              const size = item.weight >= 4 ? 'h-4 w-4' : item.weight >= 3 ? 'h-3.5 w-3.5' : 'h-3 w-3';
                              const shapeClass =
                                item.type === 'decision'
                                  ? `rotate-45 ${size}`
                                  : item.type === 'milestone'
                                  ? `rounded-sm ${size}`
                                  : `rounded-full ${size}`;
                              const isHighlighted = hoverTimestamp && item.timestamp === hoverTimestamp;
                              const isUpcoming = item.state === 'upcoming' || item.state === 'next';

                              return (
                                <button
                                  key={item.id}
                                  onMouseEnter={() => setHoverTimestamp(item.timestamp)}
                                  onFocus={() => setHoverTimestamp(item.timestamp)}
                                  onMouseLeave={() => setHoverTimestamp(null)}
                                  onBlur={() => setHoverTimestamp(null)}
                                  onClick={() => setSelectedItem(item)}
                                  className="group flex w-full items-start gap-3 rounded-xl border border-slate-200 bg-white p-3 text-left hover:border-slate-400"
                                  style={{ opacity: isUpcoming ? 0.5 : 1 }}
                                >
                                  <span
                                    className={`relative mt-1 flex ${shapeClass} items-center justify-center border-2`}
                                    style={{
                                      borderColor: colors.border,
                                      color: colors.text,
                                      boxShadow: item.isGoldenPath ? `0 0 0 2px ${colors.border}` : undefined,
                                    }}
                                  >
                                    {item.state === 'current' && (
                                      <span className="absolute -inset-2 rounded-full border border-blue-300 motion-reduce:animate-none animate-pulse" />
                                    )}
                                    {item.isMomentOfTruth && (
                                      <span className="absolute -right-2 -top-2 h-0 w-0 border-x-[6px] border-x-transparent border-b-[10px] border-b-amber-400" />
                                    )}
                                  </span>
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-900">
                                      <span>{item.label}</span>
                                      {item.isGoldenPath && (
                                        <span className="rounded-full border border-slate-200 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                                          Golden path
                                        </span>
                                      )}
                                      {item.automated && (
                                        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                                          Automated
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-[11px] text-slate-600">{item.detail}</p>
                                    <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400">
                                      <span>{formatTimestamp(item.timestamp)}</span>
                                      <span className="uppercase">{item.type}</span>
                                    </div>
                                  </div>
                                  {isHighlighted && (
                                    <span className="ml-auto text-[10px] font-semibold text-blue-600">
                                      Crosshair
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <aside className="rounded-2xl border bg-white p-4 shadow-sm">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Touchpoint Drawer</p>
            <h4 className="text-sm font-semibold text-slate-900">
              {selectedItem ? selectedItem.label : 'Select a node'}
            </h4>
            <p className="text-xs text-slate-500">
              {selectedItem
                ? 'Full CRM record and evidence trail for this touchpoint.'
                : 'Click a touchpoint node to drill into the CRM record.'}
            </p>
          </div>

          {selectedItem && (
            <div className="mt-4 space-y-4">
              <div className="rounded-xl border bg-slate-50 p-3 text-xs text-slate-600 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700">Actor</span>
                  <span className="font-mono">{ACTOR_LABELS[selectedItem.actor]}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700">Timestamp</span>
                  <span className="font-mono">{formatTimestamp(selectedItem.timestamp)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700">Stage</span>
                  <span className="font-mono">{stagesById.get(selectedItem.stageId)?.label}</span>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-[0.2em] mb-2">
                  Evidence Chips
                </p>
                <EvidenceChips chips={selectedItem.evidence ?? []} />
              </div>

              <div className="flex items-center gap-2">
                <button className="flex-1 rounded-full bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800">
                  Open CRM record
                </button>
                <button className="flex-1 rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:border-slate-300">
                  View transcript
                </button>
              </div>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}
