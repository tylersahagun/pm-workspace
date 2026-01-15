import React from 'react';
import { AIConfidence } from './types';

const CONFIDENCE_TOKENS: Record<AIConfidence, { label: string; bg: string; text: string }> = {
  high: { label: 'High confidence', bg: '#E7F7EE', text: '#1F8A4C' },
  medium: { label: 'Medium confidence', bg: '#FFF3D6', text: '#8A5B00' },
  low: { label: 'Low confidence', bg: '#EEF2F7', text: '#5B6777' },
};

export function ConfidenceBadgeV3({
  confidence,
  showLabel = true,
}: {
  confidence: AIConfidence;
  showLabel?: boolean;
}) {
  const token = CONFIDENCE_TOKENS[confidence];

  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold"
      style={{ backgroundColor: token.bg, color: token.text }}
    >
      {showLabel ? token.label : confidence}
    </span>
  );
}
