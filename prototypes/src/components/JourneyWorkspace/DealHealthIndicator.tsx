import React from 'react';
import {
  DealHealth,
  DealHealthStatus,
  HEALTH_STATUS_CONFIG,
  AIConfidence,
} from './types';

// ============================================
// DEAL HEALTH BADGE (Compact)
// ============================================

interface DealHealthBadgeProps {
  status: DealHealthStatus;
  score?: number;
  showScore?: boolean;
  size?: 'sm' | 'md';
}

export function DealHealthBadge({
  status,
  score,
  showScore = false,
  size = 'md',
}: DealHealthBadgeProps) {
  const config = HEALTH_STATUS_CONFIG[status];
  const sizeClasses = size === 'sm' ? 'text-xs px-1.5 py-0.5' : 'text-sm px-2 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${config.bgColor} ${config.color} ${sizeClasses}`}
    >
      <span>{config.icon}</span>
      <span>{config.label}</span>
      {showScore && score !== undefined && (
        <span className="opacity-75">({score}%)</span>
      )}
    </span>
  );
}

// ============================================
// DEAL HEALTH INDICATOR (Detailed)
// ============================================

interface DealHealthIndicatorProps {
  health: DealHealth;
  variant?: 'compact' | 'detailed' | 'expanded';
  showEvidence?: boolean;
  onLearnMore?: () => void;
}

export function DealHealthIndicator({
  health,
  variant = 'compact',
  showEvidence = false,
  onLearnMore,
}: DealHealthIndicatorProps) {
  const config = HEALTH_STATUS_CONFIG[health.status];

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-2">
        <DealHealthBadge status={health.status} score={health.score} />
        <TrendIndicator trend={health.trend} />
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <div className={`rounded-lg border p-3 ${config.bgColor} border-opacity-50`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <DealHealthBadge status={health.status} score={health.score} showScore />
            <TrendIndicator trend={health.trend} />
          </div>
          <ConfidenceIndicator confidence={health.confidence} />
        </div>

        {/* Health Factors */}
        <div className="space-y-1.5">
          {health.factors.slice(0, 3).map((factor, idx) => (
            <div key={idx} className="flex items-start gap-2 text-sm">
              <span
                className={`mt-0.5 ${
                  factor.impact === 'positive'
                    ? 'text-green-600'
                    : factor.impact === 'negative'
                    ? 'text-red-600'
                    : 'text-gray-500'
                }`}
              >
                {factor.impact === 'positive' ? '✓' : factor.impact === 'negative' ? '⚠' : '•'}
              </span>
              <div>
                <span className="font-medium text-gray-700">{factor.label}</span>
                {showEvidence && (
                  <p className="text-xs text-gray-500">{factor.detail}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {onLearnMore && (
          <button
            onClick={onLearnMore}
            className="mt-2 text-xs text-gray-600 hover:text-gray-800 underline"
          >
            Why this assessment?
          </button>
        )}
      </div>
    );
  }

  // Expanded variant - full breakdown with all evidence
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-semibold text-gray-900">Deal Health Assessment</h4>
          <p className="text-xs text-gray-500">
            Last updated {new Date(health.lastUpdated).toLocaleDateString()}
          </p>
        </div>
        <DealHealthBadge status={health.status} score={health.score} showScore />
      </div>

      {/* Health Score Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
          <span>Health Score</span>
          <span className="flex items-center gap-1">
            {health.score}%
            <TrendIndicator trend={health.trend} />
          </span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              health.score >= 70
                ? 'bg-green-500'
                : health.score >= 50
                ? 'bg-amber-500'
                : 'bg-red-500'
            }`}
            style={{ width: `${health.score}%` }}
          />
        </div>
      </div>

      {/* All Factors */}
      <div className="space-y-3">
        <h5 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
          Contributing Factors
        </h5>
        {health.factors.map((factor, idx) => (
          <div
            key={idx}
            className={`p-2 rounded border-l-2 ${
              factor.impact === 'positive'
                ? 'bg-green-50 border-green-400'
                : factor.impact === 'negative'
                ? 'bg-red-50 border-red-400'
                : 'bg-gray-50 border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <span
                className={`text-sm ${
                  factor.impact === 'positive'
                    ? 'text-green-600'
                    : factor.impact === 'negative'
                    ? 'text-red-600'
                    : 'text-gray-500'
                }`}
              >
                {factor.impact === 'positive' ? '✓' : factor.impact === 'negative' ? '✗' : '○'}
              </span>
              <span className="text-sm font-medium text-gray-800">{factor.label}</span>
            </div>
            <p className="text-xs text-gray-600 mt-1 ml-6">{factor.detail}</p>
          </div>
        ))}
      </div>

      {/* AI Confidence */}
      <div className="mt-4 pt-3 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <ConfidenceIndicator confidence={health.confidence} showLabel />
          <span className="text-xs text-gray-400">Powered by AskElephant AI</span>
        </div>
      </div>
    </div>
  );
}

// ============================================
// HELPER COMPONENTS
// ============================================

function TrendIndicator({ trend }: { trend: 'improving' | 'stable' | 'declining' }) {
  const config = {
    improving: { icon: '↑', color: 'text-green-600', label: 'Improving' },
    stable: { icon: '→', color: 'text-gray-500', label: 'Stable' },
    declining: { icon: '↓', color: 'text-red-600', label: 'Declining' },
  };

  const { icon, color, label } = config[trend];

  return (
    <span className={`text-xs ${color}`} title={label}>
      {icon}
    </span>
  );
}

interface ConfidenceIndicatorProps {
  confidence: AIConfidence;
  showLabel?: boolean;
}

function ConfidenceIndicator({ confidence, showLabel = false }: ConfidenceIndicatorProps) {
  const config = {
    high: { dots: 3, color: 'bg-green-500', label: 'High confidence' },
    medium: { dots: 2, color: 'bg-amber-500', label: 'Medium confidence' },
    low: { dots: 1, color: 'bg-gray-400', label: 'Low confidence' },
  };

  const { dots, color, label } = config[confidence];

  return (
    <div className="flex items-center gap-1" title={label}>
      <div className="flex gap-0.5">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className={`w-1.5 h-1.5 rounded-full ${n <= dots ? color : 'bg-gray-200'}`}
          />
        ))}
      </div>
      {showLabel && (
        <span className="text-xs text-gray-500">{label}</span>
      )}
    </div>
  );
}

export { TrendIndicator, ConfidenceIndicator };
