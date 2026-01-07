import React from 'react';
import { ChannelContext } from './types';

export function ChannelContextPanel({
  channelName,
  productFit,
  personas,
  pains,
  messaging,
  lastReviewed,
  reviewStatus = 'approved',
  pendingUpdates = 0,
}: ChannelContext) {
  const statusStyles = {
    approved: 'bg-green-50 text-green-700',
    needs_review: 'bg-amber-50 text-amber-700',
    draft: 'bg-gray-100 text-gray-600',
  };

  const statusLabels = {
    approved: 'Approved',
    needs_review: 'Needs review',
    draft: 'Draft',
  };

  return (
    <div className="bg-white border rounded-xl shadow-sm">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500">Product Channel</p>
            <h3 className="text-sm font-semibold text-gray-900 mt-1">{channelName}</h3>
          </div>
          <div className={`text-xs font-medium px-2 py-0.5 rounded ${statusStyles[reviewStatus]}`}>
            {statusLabels[reviewStatus]}
          </div>
        </div>
        {lastReviewed && (
          <p className="text-xs text-gray-400 mt-2">Last reviewed {lastReviewed}</p>
        )}
      </div>
      <div className="p-4 space-y-4 text-sm text-gray-600">
        <div>
          <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
            Product Fit
          </p>
          <p>{productFit}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
            Personas
          </p>
          <div className="flex flex-wrap gap-2">
            {personas.map((persona) => (
              <span
                key={persona}
                className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
              >
                {persona}
              </span>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
            Primary Pains
          </p>
          <ul className="space-y-1">
            {pains.map((pain, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-gray-400">•</span>
                <span>{pain}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
            Messaging That Resonates
          </p>
          <ul className="space-y-1">
            {messaging.map((line, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-gray-400">•</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center justify-between text-xs">
          <button className="text-blue-600 hover:text-blue-800">Suggest updates</button>
          <span className="text-gray-400">
            {pendingUpdates > 0
              ? `${pendingUpdates} pending update${pendingUpdates > 1 ? 's' : ''}`
              : 'No pending updates'}
          </span>
        </div>
        <p className="text-xs text-gray-400">Suggested changes require human approval.</p>
      </div>
    </div>
  );
}
