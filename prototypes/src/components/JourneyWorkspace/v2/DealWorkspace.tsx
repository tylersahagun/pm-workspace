import React from 'react';
import { ChannelContext, ChatContextItem, MemoryAnchor, WorkspaceArtifact } from './types';
import { ChannelContextPanel } from './ChannelContextPanel';
import { ChatContextPanel } from './ChatContextPanel';

interface DealWorkspaceProps {
  accountName: string;
  memoryAnchor: MemoryAnchor;
  lastUpdated: string;
  prompts: string[];
  artifacts: WorkspaceArtifact[];
  channelContext: ChannelContext;
  chatContext: ChatContextItem[];
}

export function DealWorkspace({
  accountName,
  memoryAnchor,
  lastUpdated,
  prompts,
  artifacts,
  channelContext,
  chatContext,
}: DealWorkspaceProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <p className="text-xs uppercase tracking-wide text-gray-500">Deal Workspace</p>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{accountName}</h1>
              <p className="text-sm text-gray-500">Updated {lastUpdated}</p>
            </div>
            <button className="px-3 py-1.5 text-sm font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-800">
              Share recap
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border rounded-xl shadow-sm p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500">What changed since last time</p>
            <p className="text-sm text-gray-700 mt-2">{memoryAnchor.summary}</p>
            <p className="text-xs text-gray-400 mt-1">Updated {memoryAnchor.lastUpdated}</p>
          </div>

          <div className="bg-white border rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">Work with AskElephant</h3>
              <button className="text-xs text-blue-600 hover:text-blue-800">
                Save thread
              </button>
            </div>
            <div className="mt-3 space-y-3">
              <div className="rounded-lg border border-blue-100 bg-blue-50 p-3 text-xs text-blue-700">
                Context is preloaded for this deal. AskElephant will use it before asking follow-up questions.
              </div>
              <div className="rounded-lg bg-gray-100 p-3 text-sm text-gray-700">
                I can help refine the next steps, draft messaging, or build a one-pager. What
                would you like to do?
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {prompts.map((prompt) => (
                  <button
                    key={prompt}
                    className="text-left text-sm text-gray-700 border rounded-lg px-3 py-2 hover:bg-gray-50"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
              <div className="border rounded-lg px-3 py-2 text-sm text-gray-400">
                Ask a question or request an artifact...
              </div>
            </div>
          </div>

          {chatContext.length > 0 && <ChatContextPanel items={chatContext} />}
        </div>

        <div className="space-y-4">
          <div className="bg-white border rounded-xl shadow-sm">
            <div className="p-4 border-b">
              <h3 className="text-sm font-semibold text-gray-900">Artifacts</h3>
              <p className="text-xs text-gray-500 mt-1">Saved outputs tied to this deal</p>
            </div>
            <div className="divide-y">
              {artifacts.map((artifact) => (
                <div key={artifact.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">{artifact.type}</p>
                      <h4 className="text-sm font-semibold text-gray-900">
                        {artifact.title}
                      </h4>
                    </div>
                    <button className="text-xs text-blue-600 hover:text-blue-800">
                      Open
                    </button>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">{artifact.summary}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    Updated {artifact.updatedAt}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <ChannelContextPanel {...channelContext} />
        </div>
      </div>
    </div>
  );
}
