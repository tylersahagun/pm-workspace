import React from 'react';
import { ChatContextItem } from './types';

interface ChatContextPanelV3Props {
  items: ChatContextItem[];
  onLoadAll?: () => void;
}

export function ChatContextPanelV3({ items, onLoadAll }: ChatContextPanelV3Props) {
  return (
    <section className="bg-white border rounded-2xl shadow-sm">
      <div className="p-5 border-b">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Chat Context</p>
            <h3 className="text-sm font-semibold text-slate-900 mt-2">
              Preloaded context for the orchestration engine
            </h3>
          </div>
          <button
            onClick={onLoadAll}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800"
          >
            Load all
          </button>
        </div>
        <p className="text-xs text-slate-500 mt-2">
          AskElephant uses these signals before generating responses.
        </p>
      </div>
      <div className="divide-y">
        {items.map((item) => (
          <div key={item.id} className="p-5 space-y-2">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="text-sm font-semibold text-slate-900">{item.title}</h4>
                <p className="text-xs text-slate-500 mt-1 font-mono">{item.source}</p>
              </div>
              <button className="text-xs text-blue-600 hover:text-blue-800">Load</button>
            </div>
            <p className="text-xs text-slate-600">{item.description}</p>
            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-[11px] text-slate-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
