import React from 'react';
import { AIConfidence } from './types';

const CONFIDENCE_STYLES: Record<AIConfidence, string> = {
  high: 'bg-green-50 text-green-700',
  medium: 'bg-amber-50 text-amber-700',
  low: 'bg-gray-100 text-gray-600',
};

const CONFIDENCE_LABELS: Record<AIConfidence, string> = {
  high: 'High confidence',
  medium: 'Medium confidence',
  low: 'Low confidence',
};

export function ConfidenceBadge({
  confidence,
  showLabel = true,
}: {
  confidence: AIConfidence;
  showLabel?: boolean;
}) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${CONFIDENCE_STYLES[confidence]}`}>
      {showLabel ? CONFIDENCE_LABELS[confidence] : confidence}
    </span>
  );
}
