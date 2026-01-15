import React, { useState } from 'react';
import { JourneyRequirement } from './types';
import { ConfidenceBadge } from './ConfidenceBadge';
import { EvidenceList } from './EvidenceItem';

const STATUS_CONFIG = {
  on_track: { label: 'On track', color: 'text-green-700', bg: 'bg-green-50' },
  watch: { label: 'Watch', color: 'text-amber-700', bg: 'bg-amber-50' },
  blocked: { label: 'Blocked', color: 'text-red-700', bg: 'bg-red-50' },
  unknown: { label: 'Unknown', color: 'text-gray-600', bg: 'bg-gray-50' },
};

interface JourneyHealthGridProps {
  requirements: JourneyRequirement[];
}

export function JourneyHealthGrid({ requirements }: JourneyHealthGridProps) {
  const [openEvidenceId, setOpenEvidenceId] = useState<string | null>(null);

  return (
    <div className="bg-white border rounded-xl shadow-sm">
      <div className="p-4 border-b">
        <h3 className="text-sm font-semibold text-gray-900">Journey Health</h3>
        <p className="text-xs text-gray-500 mt-1">
          Health across the requirements that make this deal succeed
        </p>
      </div>
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        {requirements.map((requirement) => {
          const status = STATUS_CONFIG[requirement.status];
          const isOpen = openEvidenceId === requirement.id;

          return (
            <div key={requirement.id} className="border rounded-lg p-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className={`inline-flex items-center gap-2 text-xs font-medium px-2 py-0.5 rounded ${status.bg} ${status.color}`}>
                    {status.label}
                  </div>
                  <h4 className="text-sm font-semibold text-gray-900 mt-2">{requirement.label}</h4>
                  <p className="text-xs text-gray-600 mt-1">{requirement.summary}</p>
                </div>
                <ConfidenceBadge confidence={requirement.confidence} showLabel={false} />
              </div>

              <button
                onClick={() => setOpenEvidenceId(isOpen ? null : requirement.id)}
                className="mt-3 text-xs text-blue-600 hover:text-blue-800"
              >
                {isOpen ? 'Hide evidence' : 'View evidence'}
              </button>

              {isOpen && (
                <div className="mt-2 rounded-lg bg-gray-50 p-2">
                  <EvidenceList evidence={requirement.evidence} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
