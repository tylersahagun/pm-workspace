import React, { useState } from 'react';
import { JourneySnapshot, MemoryAnchor } from './types';
import { ConfidenceBadgeV3 } from './ConfidenceBadgeV3';

const EVIDENCE_STYLES: Record<string, string> = {
  quote: 'border-blue-200 bg-blue-50 text-blue-700',
  data_point: 'border-purple-200 bg-purple-50 text-purple-700',
  pattern: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  signal: 'border-amber-200 bg-amber-50 text-amber-700',
};

interface JourneySnapshotCardV3Props {
  snapshot: JourneySnapshot;
  memoryAnchor?: MemoryAnchor;
  onOpenWorkspace?: () => void;
}

export function JourneySnapshotCardV3({
  snapshot,
  memoryAnchor,
  onOpenWorkspace,
}: JourneySnapshotCardV3Props) {
  const [showEvidence, setShowEvidence] = useState(false);

  return (
    <section className="bg-white border rounded-2xl shadow-sm">
      <div className="p-5 border-b">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Journey Snapshot
            </p>
            <h3 className="text-lg font-semibold text-slate-900 mt-2">{snapshot.title}</h3>
          </div>
          <ConfidenceBadgeV3 confidence={snapshot.confidence} />
        </div>
        <p className="text-sm text-slate-600 mt-3">{snapshot.summary}</p>
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <span className="font-semibold">Why it matters:</span> {snapshot.consequence}
        </div>
      </div>

      {memoryAnchor && (
        <div className="px-5 py-4 border-b bg-slate-50">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
            What changed since last time
          </p>
          <p className="text-sm text-slate-700 mt-2">{memoryAnchor.summary}</p>
          <p className="text-xs text-slate-400 mt-2 font-mono">
            Updated {memoryAnchor.lastUpdated}
          </p>
        </div>
      )}

      <div className="px-5 py-4 flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={() => setShowEvidence((prev) => !prev)}
          className="text-xs font-semibold text-blue-600 hover:text-blue-800"
        >
          {showEvidence ? 'Hide evidence' : 'View evidence'}
        </button>
        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
          <span>Last refresh</span>
          <span>{new Date(snapshot.lastUpdated).toLocaleDateString()}</span>
        </div>
        <button
          onClick={onOpenWorkspace}
          className="ml-auto rounded-full bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
        >
          Open Deal Workspace
        </button>
      </div>

      {showEvidence && (
        <div className="border-t bg-slate-50 p-5 space-y-3">
          {snapshot.evidence.map((item, idx) => (
            <div key={`${item.source}-${idx}`} className="rounded-xl border bg-white p-3">
              <div className="flex items-center justify-between gap-2 text-[11px]">
                <span
                  className={`rounded-full border px-2 py-0.5 font-semibold ${EVIDENCE_STYLES[item.type]}`}
                >
                  {item.type.replace('_', ' ')}
                </span>
                <span className="text-slate-400 font-mono">{item.source}</span>
              </div>
              <p className="mt-2 text-xs text-slate-700">{item.content}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
