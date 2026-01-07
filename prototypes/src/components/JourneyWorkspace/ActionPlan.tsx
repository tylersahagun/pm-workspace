import React, { useState } from 'react';
import { ActionPlanItem } from './types';
import { ConfidenceIndicator } from './DealHealthIndicator';
import { EvidenceItem } from './ActionCard';

interface ActionPlanProps {
  items: ActionPlanItem[];
}

export function ActionPlan({ items }: ActionPlanProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="bg-white border rounded-xl shadow-sm">
      <div className="p-4 border-b">
        <h3 className="text-sm font-semibold text-gray-900">Action Plan</h3>
        <p className="text-xs text-gray-500 mt-1">Prioritized actions tied to the snapshot</p>
      </div>
      <div className="divide-y">
        {items.map((item) => {
          const isExpanded = expandedId === item.id;

          return (
            <div key={item.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">{item.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                  <p className="text-xs text-gray-500 mt-2">Impact: {item.impact}</p>
                  {item.dueDate && (
                    <p className="text-xs text-gray-500">
                      Due {new Date(item.dueDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <ConfidenceIndicator confidence={item.confidence} />
              </div>

              <div className="mt-3 flex items-center gap-3">
                <button
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  {isExpanded ? 'Hide evidence' : 'Show evidence'}
                </button>
                <button className="text-xs text-gray-600 hover:text-gray-800">
                  Mark as started
                </button>
              </div>

              {isExpanded && item.evidence.length > 0 && (
                <div className="mt-2 rounded-lg bg-gray-50 p-2 space-y-2">
                  {item.evidence.map((itemEvidence, idx) => (
                    <EvidenceItem key={`${item.id}-${idx}`} evidence={itemEvidence} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
