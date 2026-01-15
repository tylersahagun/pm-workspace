import React, { useState } from 'react';
import { ActionPlanItem } from './types';
import { ConfidenceBadgeV3 } from './ConfidenceBadgeV3';

export function ActionPlanV3({ items }: { items: ActionPlanItem[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <section className="bg-white border rounded-2xl shadow-sm">
      <div className="p-5 border-b">
        <h3 className="text-sm font-semibold text-slate-900">Action Plan</h3>
        <p className="text-xs text-slate-500 mt-1">Golden-path actions tied to the snapshot.</p>
      </div>
      <div className="divide-y">
        {items.map((item) => {
          const isExpanded = expandedId === item.id;
          return (
            <div key={item.id} className="p-5 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">{item.title}</h4>
                  <p className="text-sm text-slate-600 mt-1">{item.description}</p>
                  <p className="text-xs text-slate-500 mt-2">Impact: {item.impact}</p>
                  {item.dueDate && (
                    <p className="text-xs text-slate-500 font-mono">
                      Due {new Date(item.dueDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <ConfidenceBadgeV3 confidence={item.confidence} showLabel={false} />
                  {item.status === 'done' && (
                    <span className="text-xs font-semibold text-emerald-600">Completed</span>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs">
                <button
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  className="font-semibold text-blue-600 hover:text-blue-800"
                >
                  {isExpanded ? 'Hide evidence' : 'Show evidence'}
                </button>
                <button className="text-slate-600 hover:text-slate-800">Start action</button>
                <button className="text-slate-600 hover:text-slate-800">Mark done</button>
              </div>

              {isExpanded && (
                <div className="rounded-xl border bg-slate-50 p-3 space-y-2">
                  {item.evidence.map((evidence, idx) => (
                    <div key={`${evidence.source}-${idx}`} className="rounded-lg border bg-white p-2">
                      <div className="flex items-center justify-between gap-2 text-[11px]">
                        <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 font-semibold text-slate-600">
                          {evidence.type.replace('_', ' ')}
                        </span>
                        <span className="text-slate-400 font-mono">{evidence.source}</span>
                      </div>
                      <p className="mt-2 text-xs text-slate-700">{evidence.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
