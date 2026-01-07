import React from 'react';
import { ChatContextItem } from './types';

interface ChatContextPanelProps {
  items: ChatContextItem[];
  onLoadAll?: () => void;
}

export function ChatContextPanel({ items, onLoadAll }: ChatContextPanelProps) {
  return (
    <div className="bg-white border rounded-xl shadow-sm">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500">Chat Context</p>
            <h3 className="text-sm font-semibold text-gray-900 mt-1">
              Preloaded context to reduce back-and-forth
            </h3>
          </div>
          <button
            onClick={onLoadAll}
            className="text-xs font-medium text-blue-600 hover:text-blue-800"
          >
            Load all
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          AskElephant uses this context before you type your first question.
        </p>
      </div>
      <div className="divide-y">
        {items.map((item) => (
          <div key={item.id} className="p-4 space-y-2">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="text-sm font-semibold text-gray-900">{item.title}</h4>
                <p className="text-xs text-gray-500 mt-1">{item.source}</p>
              </div>
              <button className="text-xs text-blue-600 hover:text-blue-800">
                Load
              </button>
            </div>
            <p className="text-xs text-gray-600">{item.description}</p>
            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
