import React, { useState } from 'react';
import { JourneyRequirement } from './types';
import { ConfidenceBadgeV3 } from './ConfidenceBadgeV3';

const STATUS_CONFIG = {
  on_track: { label: 'On track', color: '#28A745', bg: '#E7F7EE' },
  watch: { label: 'Watch', color: '#FFC107', bg: '#FFF3D6' },
  blocked: { label: 'Blocked', color: '#D73A49', bg: '#FDECEF' },
  unknown: { label: 'Unknown', color: '#6B7280', bg: '#F3F4F6' },
};

export function JourneyHealthGridV3({ requirements }: { requirements: JourneyRequirement[] }) {
  const [openEvidenceId, setOpenEvidenceId] = useState<string | null>(null);

  return (
    <section className="bg-white border rounded-2xl shadow-sm">
      <div className="p-5 border-b">
        <h3 className="text-sm font-semibold text-slate-900">Journey Health</h3>
        <p className="text-xs text-slate-500 mt-1">
          Requirements that keep the deal moving forward.
        </p>
      </div>
      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        {requirements.map((requirement) => {
          const status = STATUS_CONFIG[requirement.status];
          const isOpen = openEvidenceId === requirement.id;

          return (
            <div key={requirement.id} className="rounded-xl border p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span
                    className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold"
                    style={{ backgroundColor: status.bg, color: status.color }}
                  >
                    {status.label}
                  </span>
                  <h4 className="text-sm font-semibold text-slate-900 mt-2">
                    {requirement.label}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">{requirement.summary}</p>
                </div>
                <ConfidenceBadgeV3 confidence={requirement.confidence} showLabel={false} />
              </div>

              <button
                onClick={() => setOpenEvidenceId(isOpen ? null : requirement.id)}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800"
              >
                {isOpen ? 'Hide evidence' : 'View evidence'}
              </button>

              {isOpen && (
                <div className="rounded-lg border bg-slate-50 p-3 space-y-2">
                  {requirement.evidence.map((evidence, idx) => (
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
