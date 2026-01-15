import React from 'react';
import { JourneyStep } from './types';

interface JourneyPathProps {
  steps: JourneyStep[];
}

export function JourneyPath({ steps }: JourneyPathProps) {
  return (
    <div className="bg-white border rounded-xl shadow-sm">
      <div className="p-4 border-b">
        <h3 className="text-sm font-semibold text-gray-900">Next 30 Days</h3>
        <p className="text-xs text-gray-500 mt-1">
          The likely path to close based on this product channel
        </p>
      </div>
      <div className="divide-y">
        {steps.map((step, index) => (
          <div key={step.id} className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-7 w-7 rounded-full bg-gray-900 text-white text-xs flex items-center justify-center">
                {index + 1}
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900">{step.label}</h4>
                <p className="text-xs text-gray-500">{step.timeframe}</p>
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-2">{step.rationale}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
