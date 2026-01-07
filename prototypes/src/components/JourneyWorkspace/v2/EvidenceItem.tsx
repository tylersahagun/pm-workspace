import React from 'react';
import { AIEvidence } from './types';

const TYPE_STYLES: Record<AIEvidence['type'], string> = {
  quote: 'bg-blue-50 text-blue-700',
  data_point: 'bg-purple-50 text-purple-700',
  pattern: 'bg-emerald-50 text-emerald-700',
  signal: 'bg-amber-50 text-amber-700',
};

const TYPE_LABELS: Record<AIEvidence['type'], string> = {
  quote: 'Quote',
  data_point: 'Data point',
  pattern: 'Pattern',
  signal: 'Signal',
};

export function EvidenceItem({ evidence }: { evidence: AIEvidence }) {
  return (
    <div className="rounded-lg border bg-white p-2">
      <div className="flex items-center justify-between gap-2 text-xs">
        <span className={`rounded-full px-2 py-0.5 font-medium ${TYPE_STYLES[evidence.type]}`}>
          {TYPE_LABELS[evidence.type]}
        </span>
        <span className="text-gray-400">{evidence.source}</span>
      </div>
      <p className="mt-2 text-xs text-gray-700">{evidence.content}</p>
    </div>
  );
}

export function EvidenceList({ evidence }: { evidence: AIEvidence[] }) {
  if (!evidence.length) {
    return (
      <div className="rounded-lg border border-dashed bg-gray-50 p-3 text-xs text-gray-500">
        No evidence captured yet. Add notes or ask AskElephant to fill in missing context.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {evidence.map((item, idx) => (
        <EvidenceItem key={`${item.source}-${idx}`} evidence={item} />
      ))}
    </div>
  );
}
