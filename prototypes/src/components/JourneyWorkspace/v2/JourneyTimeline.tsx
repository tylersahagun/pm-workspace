import React from 'react';
import {
  JourneyLane,
  JourneyPathOption,
  JourneySignal,
  JourneyStage,
  JourneyTimelineVariant,
} from './types';

interface JourneyTimelineProps {
  title?: string;
  variant?: JourneyTimelineVariant;
  stages?: JourneyStage[];
  lanes?: JourneyLane[];
  paths?: JourneyPathOption[];
}

const STATUS_STYLES: Record<
  JourneyStage['status'],
  { dot: string; text: string; badge: string }
> = {
  complete: {
    dot: 'bg-emerald-500',
    text: 'text-emerald-700',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  current: {
    dot: 'bg-indigo-500',
    text: 'text-indigo-700',
    badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  },
  next: {
    dot: 'bg-amber-500',
    text: 'text-amber-700',
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  upcoming: {
    dot: 'bg-gray-300',
    text: 'text-gray-500',
    badge: 'bg-gray-50 text-gray-600 border-gray-200',
  },
};

const SIGNAL_STYLES: Record<JourneySignal['type'], string> = {
  gain: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  pain: 'bg-rose-50 text-rose-700 border-rose-200',
  risk: 'bg-amber-50 text-amber-700 border-amber-200',
  momentum: 'bg-indigo-50 text-indigo-700 border-indigo-200',
};

const PATH_STYLES = [
  'border-indigo-500 bg-indigo-50/60',
  'border-emerald-500 bg-emerald-50/60',
  'border-amber-500 bg-amber-50/60',
];

const formatProbability = (value: number) => `${Math.round(value * 100)}% likely`;

const getLaneItemTone = (tone?: JourneyLane['items'][number]['tone']) => {
  if (tone === 'positive') {
    return 'border-emerald-200 bg-emerald-50 text-emerald-700';
  }
  if (tone === 'warning') {
    return 'border-amber-200 bg-amber-50 text-amber-700';
  }
  return 'border-gray-200 bg-white text-gray-700';
};

export function JourneyTimeline({
  title = 'Journey Map',
  variant = 'linear',
  stages = [],
  lanes = [],
  paths = [],
}: JourneyTimelineProps) {
  if (variant === 'paths') {
    return (
      <section className="bg-white border rounded-xl shadow-sm">
        <div className="p-4 border-b">
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          <p className="text-xs text-gray-500 mt-1">
            Compare likely paths and choose the best next step.
          </p>
        </div>
        <div className="p-4 space-y-3">
          {paths.map((path, index) => (
            <div
              key={path.id}
              className={`rounded-lg border-l-4 p-4 ${PATH_STYLES[index % PATH_STYLES.length]}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">{path.label}</h4>
                  <p className="text-xs text-gray-600 mt-1">{path.description}</p>
                </div>
                <span className="text-xs font-semibold text-gray-800">
                  {formatProbability(path.probability)}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {path.steps.map((step) => (
                  <span
                    key={step}
                    className="inline-flex items-center rounded-full border border-gray-200 bg-white px-2 py-1 text-xs text-gray-600"
                  >
                    {step}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-xs text-gray-600">
                <span className="font-semibold text-gray-700">Risk:</span> {path.risk}
              </p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (variant === 'grid') {
    const columnTemplate = `160px repeat(${Math.max(stages.length, 1)}, minmax(0, 1fr))`;
    return (
      <section className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          <p className="text-xs text-gray-500 mt-1">
            Storyboard the journey by stage, with clear lanes for actions and signals.
          </p>
        </div>
        <div className="overflow-x-auto">
          <div
            className="min-w-[720px] grid gap-px bg-gray-100"
            style={{ gridTemplateColumns: columnTemplate }}
          >
            <div className="bg-gray-50 px-4 py-3 text-xs font-semibold text-gray-500">
              Lanes
            </div>
            {stages.map((stage) => {
              const styles = STATUS_STYLES[stage.status];
              return (
                <div key={stage.id} className="bg-gray-50 px-4 py-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-600">
                    <span className={`h-2 w-2 rounded-full ${styles.dot}`} />
                    {stage.label}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{stage.summary}</p>
                </div>
              );
            })}

            {lanes.map((lane) => (
              <React.Fragment key={lane.id}>
                <div className="bg-white px-4 py-4">
                  <p className="text-xs font-semibold text-gray-700">{lane.label}</p>
                  {lane.description && (
                    <p className="text-[11px] text-gray-500 mt-1">{lane.description}</p>
                  )}
                </div>
                {stages.map((stage) => (
                  <div key={`${lane.id}-${stage.id}`} className="bg-white px-4 py-4">
                    <div className="space-y-2">
                      {lane.items
                        .filter((item) => item.stageId === stage.id)
                        .map((item) => (
                          <div
                            key={item.id}
                            className={`rounded-md border px-2 py-2 text-xs ${getLaneItemTone(
                              item.tone,
                            )}`}
                          >
                            <p className="font-semibold">{item.label}</p>
                            {item.detail && <p className="text-[11px] mt-1">{item.detail}</p>}
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const columnTemplate = `repeat(${Math.max(stages.length, 1)}, minmax(0, 1fr))`;

  return (
    <section className="bg-white border rounded-xl shadow-sm">
      <div className="p-4 border-b">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        <p className="text-xs text-gray-500 mt-1">
          Stage-level view with touchpoints, pains, and momentum signals.
        </p>
      </div>
      <div className="p-4 space-y-4">
        <div className="grid gap-3" style={{ gridTemplateColumns: columnTemplate }}>
          {stages.map((stage) => {
            const styles = STATUS_STYLES[stage.status];
            return (
              <div key={stage.id} className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs font-semibold">
                  <span className={`h-2 w-2 rounded-full ${styles.dot}`} />
                  <span className={`${styles.text}`}>{stage.label}</span>
                </div>
                <div className="h-1 rounded-full bg-gray-100">
                  <div className={`h-1 rounded-full ${styles.dot}`} style={{ width: '100%' }} />
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid gap-4" style={{ gridTemplateColumns: columnTemplate }}>
          {stages.map((stage) => {
            const styles = STATUS_STYLES[stage.status];
            return (
              <div key={stage.id} className="rounded-lg border bg-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <span
                    className={`inline-flex items-center rounded-full border px-2 py-1 text-[11px] font-semibold ${styles.badge}`}
                  >
                    {stage.status === 'current' ? 'Current focus' : stage.status.toUpperCase()}
                  </span>
                  {stage.owner && (
                    <span className="text-[11px] text-gray-500">Owner: {stage.owner}</span>
                  )}
                </div>
                <p className="text-sm font-semibold text-gray-900 mt-3">{stage.summary}</p>
                {stage.touchpoints && stage.touchpoints.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <p className="text-[11px] font-semibold text-gray-500 uppercase">Touchpoints</p>
                    {stage.touchpoints.map((touchpoint) => (
                      <div key={touchpoint.id} className="flex items-start gap-2 text-xs">
                        <span className="text-gray-500">{touchpoint.dateLabel}</span>
                        <div>
                          <p className="text-gray-700 font-medium">{touchpoint.label}</p>
                          {touchpoint.summary && (
                            <p className="text-[11px] text-gray-500 mt-1">
                              {touchpoint.summary}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {stage.signals && stage.signals.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {stage.signals.map((signal) => (
                      <span
                        key={signal.id}
                        className={`inline-flex items-center rounded-full border px-2 py-1 text-[11px] ${SIGNAL_STYLES[signal.type]}`}
                      >
                        {signal.label}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
