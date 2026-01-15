import React, { useState } from 'react';
import { JourneySnapshot } from './types';
import { ConfidenceIndicator } from './DealHealthIndicator';
import { EvidenceItem } from './ActionCard';

interface JourneySnapshotProps {
  snapshot: JourneySnapshot;
  onOpenWorkspace?: () => void;
}

export function JourneySnapshotCard({ snapshot, onOpenWorkspace }: JourneySnapshotProps) {
  const [showEvidence, setShowEvidence] = useState(false);

  return (
    <div className="bg-white border rounded-xl shadow-sm">
      <div className="p-4 border-b">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500">Journey Snapshot</p>
            <h3 className="text-lg font-semibold text-gray-900 mt-1">{snapshot.title}</h3>
          </div>
          <ConfidenceIndicator confidence={snapshot.confidence} showLabel />
        </div>
        <p className="text-sm text-gray-600 mt-3">{snapshot.summary}</p>
        <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          <span className="font-medium">Why it matters:</span> {snapshot.consequence}
        </div>
      </div>

      <div className="px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setShowEvidence((prev) => !prev)}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          {showEvidence ? 'Hide evidence' : 'View evidence'}
        </button>
        <button
          onClick={onOpenWorkspace}
          className="px-3 py-1.5 text-sm font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-800"
        >
          Open Deal Workspace
        </button>
      </div>

      {showEvidence && (
        <div className="border-t bg-gray-50 p-4 space-y-2">
          {snapshot.evidence.map((item, idx) => (
            <EvidenceItem key={`${item.source}-${idx}`} evidence={item} />
          ))}
          <p className="text-xs text-gray-500">
            Last updated {new Date(snapshot.lastUpdated).toLocaleDateString()}
          </p>
        </div>
      )}
    </div>
  );
}
