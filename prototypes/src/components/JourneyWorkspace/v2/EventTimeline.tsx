import React, { useState } from 'react';
import { JourneyEvent } from './types';

type TimelineOrientation = 'horizontal' | 'vertical';

const EVENT_ICONS: Record<JourneyEvent['type'], string> = {
  call: '📞',
  email: '✉️',
  ticket: '🎫',
  meeting: '🗓️',
  note: '📝',
  other: '📍',
};

interface EventTimelineProps {
  events: JourneyEvent[];
  orientation?: TimelineOrientation;
  title?: string;
}

export function EventTimeline({
  events,
  orientation = 'vertical',
  title = 'Customer Events Timeline',
}: EventTimelineProps) {
  const [activeEventId, setActiveEventId] = useState<string | null>(null);

  if (events.length === 0) {
    return (
      <div className="bg-white border rounded-xl shadow-sm p-4">
        <p className="text-sm text-gray-600">No events captured yet.</p>
      </div>
    );
  }

  const activeEvent = events.find((event) => event.id === activeEventId) ?? events[0];
  const isHorizontal = orientation === 'horizontal';

  return (
    <div className="bg-white border rounded-xl shadow-sm">
      <div className="p-4 border-b">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        <p className="text-xs text-gray-500 mt-1">
          Hover an event for context and activity details.
        </p>
      </div>
      <div className={`p-4 ${isHorizontal ? 'space-y-4' : 'space-y-3'}`}>
        <div className={isHorizontal ? 'flex items-center gap-3 overflow-x-auto' : 'space-y-3'}>
          {events.map((event) => {
            const isActive = activeEventId === event.id || (!activeEventId && event.id === events[0].id);

            return (
              <button
                key={event.id}
                onMouseEnter={() => setActiveEventId(event.id)}
                onFocus={() => setActiveEventId(event.id)}
                className={`flex items-center gap-2 rounded-full border px-3 py-2 text-xs transition ${
                  isActive ? 'border-gray-900 text-gray-900 bg-gray-50' : 'border-gray-200 text-gray-600'
                }`}
              >
                <span className="text-sm">{EVENT_ICONS[event.type]}</span>
                <span className="whitespace-nowrap">{new Date(event.timestamp).toLocaleDateString()}</span>
              </button>
            );
          })}
        </div>

        {activeEvent && (
          <div className="rounded-lg border bg-gray-50 p-3 text-xs text-gray-700">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs text-gray-500">{activeEvent.source ?? 'Activity'}</p>
                <h4 className="text-sm font-semibold text-gray-900">{activeEvent.title}</h4>
              </div>
              <span className="text-xs text-gray-400">
                {new Date(activeEvent.timestamp).toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-gray-600 mt-2">{activeEvent.summary}</p>
            {activeEvent.participants && activeEvent.participants.length > 0 && (
              <p className="text-xs text-gray-500 mt-2">
                Participants: {activeEvent.participants.join(', ')}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
