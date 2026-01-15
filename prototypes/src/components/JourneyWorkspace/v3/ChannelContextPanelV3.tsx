import React from 'react';
import { ChannelContext } from './types';

export function ChannelContextPanelV3({
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
    approved: { bg: '#E7F7EE', text: '#1F8A4C' },
    needs_review: { bg: '#FFF3D6', text: '#8A5B00' },
    draft: { bg: '#EEF2F7', text: '#5B6777' },
  };

  const statusLabels = {
    approved: 'Approved',
    needs_review: 'Needs review',
    draft: 'Draft',
  };

  return (
    <section className="bg-white border rounded-2xl shadow-sm">
      <div className="p-5 border-b">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Product Channel</p>
            <h3 className="text-sm font-semibold text-slate-900 mt-2">{channelName}</h3>
          </div>
          <div
            className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: statusStyles[reviewStatus].bg,
              color: statusStyles[reviewStatus].text,
            }}
          >
            {statusLabels[reviewStatus]}
          </div>
        </div>
        {lastReviewed && (
          <p className="text-xs text-slate-400 mt-2 font-mono">Last reviewed {lastReviewed}</p>
        )}
      </div>
      <div className="p-5 space-y-4 text-sm text-slate-600">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-[0.2em] mb-2">
            Product Fit
          </p>
          <p>{productFit}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-[0.2em] mb-2">
            Personas
          </p>
          <div className="flex flex-wrap gap-2">
            {personas.map((persona) => (
              <span
                key={persona}
                className="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-[11px] text-slate-600"
              >
                {persona}
              </span>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-[0.2em] mb-2">
            Primary Pains
          </p>
          <ul className="space-y-1">
            {pains.map((pain, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-slate-400">•</span>
                <span>{pain}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-[0.2em] mb-2">
            Messaging That Resonates
          </p>
          <ul className="space-y-1">
            {messaging.map((line, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-slate-400">•</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center justify-between text-xs">
          <button className="text-blue-600 hover:text-blue-800">Suggest updates</button>
          <span className="text-slate-400 font-mono">
            {pendingUpdates > 0
              ? `${pendingUpdates} pending update${pendingUpdates > 1 ? 's' : ''}`
              : 'No pending updates'}
          </span>
        </div>
        <p className="text-xs text-slate-400">
          Suggested changes require human approval.
        </p>
      </div>
    </section>
  );
}
