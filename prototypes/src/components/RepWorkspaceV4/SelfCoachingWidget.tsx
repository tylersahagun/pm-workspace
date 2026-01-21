import * as React from 'react';
import { SelfCoachingData, TopQuestion, PerformanceTrend, CoachingInsight } from './types';

// ============================================
// SELF-COACHING WIDGET - For Solo Reps
// Maple Feedback: "I'm actually way more interested
// in coaching from the aspect of, like, cool. Pull out
// some common questions that have been asked across
// all my transcripts."
// ============================================

interface SelfCoachingWidgetProps {
  data: SelfCoachingData;
  onViewAll?: () => void;
  onInsightClick?: (id: string) => void;
  variant?: 'compact' | 'expanded';
}

export function SelfCoachingWidget({
  data,
  onViewAll,
  onInsightClick,
  variant = 'compact',
}: SelfCoachingWidgetProps) {
  const [activeTab, setActiveTab] = React.useState<'questions' | 'trends' | 'insights'>('questions');

  if (variant === 'compact') {
    return (
      <div className="bg-white rounded-xl border shadow-sm">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">💡</span>
              <h2 className="font-semibold text-gray-900">Self-Coaching Insights</h2>
            </div>
            {onViewAll && (
              <button
                onClick={onViewAll}
                className="text-sm text-indigo-600 hover:text-indigo-800"
              >
                View All →
              </button>
            )}
          </div>
          {data.weeklyHighlight && (
            <p className="text-sm text-emerald-600 mt-2 bg-emerald-50 px-3 py-2 rounded-lg">
              🎉 {data.weeklyHighlight}
            </p>
          )}
        </div>

        <div className="p-4 space-y-4">
          {/* Top Questions Preview */}
          <div>
            <h3 className="text-xs font-medium text-gray-500 uppercase mb-2">
              Top Questions You Get Asked
            </h3>
            <div className="space-y-2">
              {data.topQuestions.slice(0, 3).map((q, i) => (
                <TopQuestionRow key={i} question={q} rank={i + 1} />
              ))}
            </div>
          </div>

          {/* Quick Insight */}
          {data.insights[0] && (
            <div>
              <h3 className="text-xs font-medium text-gray-500 uppercase mb-2">
                Quick Insight
              </h3>
              <InsightCard
                insight={data.insights[0]}
                onClick={() => onInsightClick?.(data.insights[0].id)}
              />
            </div>
          )}

          {/* Improvement Suggestion */}
          {data.improvementSuggestion && (
            <div className="bg-indigo-50 rounded-lg p-3">
              <p className="text-xs font-medium text-indigo-700 mb-1">💭 Try This</p>
              <p className="text-sm text-indigo-900">{data.improvementSuggestion}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Expanded variant - Full self-coaching dashboard
  return (
    <div className="bg-white rounded-xl border shadow-sm">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">💡</span>
            <div>
              <h2 className="font-semibold text-gray-900">Self-Coaching Dashboard</h2>
              <p className="text-sm text-gray-500">Patterns and insights from your conversations</p>
            </div>
          </div>
        </div>

        {/* Weekly Highlight */}
        {data.weeklyHighlight && (
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg p-4 mb-4">
            <p className="text-emerald-800">🎉 {data.weeklyHighlight}</p>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          <TabButton
            active={activeTab === 'questions'}
            onClick={() => setActiveTab('questions')}
            label="Top Questions"
          />
          <TabButton
            active={activeTab === 'trends'}
            onClick={() => setActiveTab('trends')}
            label="Performance"
          />
          <TabButton
            active={activeTab === 'insights'}
            onClick={() => setActiveTab('insights')}
            label="Insights"
          />
        </div>
      </div>

      <div className="p-4">
        {activeTab === 'questions' && (
          <QuestionsTab questions={data.topQuestions} />
        )}
        {activeTab === 'trends' && (
          <TrendsTab trends={data.performanceTrends} />
        )}
        {activeTab === 'insights' && (
          <InsightsTab
            insights={data.insights}
            improvementSuggestion={data.improvementSuggestion}
            onInsightClick={onInsightClick}
          />
        )}
      </div>
    </div>
  );
}

// ============================================
// Tab Button
// ============================================

function TabButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
        active
          ? 'bg-white text-gray-900 shadow-sm'
          : 'text-gray-600 hover:text-gray-900'
      }`}
    >
      {label}
    </button>
  );
}

// ============================================
// Top Question Row
// ============================================

interface TopQuestionRowProps {
  question: TopQuestion;
  rank: number;
}

function TopQuestionRow({ question, rank }: TopQuestionRowProps) {
  return (
    <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
      <span className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
        {rank}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900 truncate">"{question.question}"</p>
        <p className="text-xs text-gray-500">
          {question.frequency}× across {question.callCount} calls
        </p>
      </div>
      {question.avgHandlingScore && (
        <div className="text-right">
          <span className={`text-sm font-medium ${
            question.avgHandlingScore >= 8 ? 'text-emerald-600' :
            question.avgHandlingScore >= 6 ? 'text-amber-600' : 'text-red-600'
          }`}>
            {question.avgHandlingScore.toFixed(1)}
          </span>
          <p className="text-xs text-gray-400">avg score</p>
        </div>
      )}
    </div>
  );
}

// ============================================
// Questions Tab
// ============================================

function QuestionsTab({ questions }: { questions: TopQuestion[] }) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-600 mb-4">
        These are the most common questions you hear from prospects. Understanding patterns helps you prepare better responses.
      </p>
      {questions.map((q, i) => (
        <TopQuestionRow key={i} question={q} rank={i + 1} />
      ))}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-xs font-medium text-blue-700 mb-1">💡 Pro Tip</p>
        <p className="text-sm text-blue-900">
          Questions with low handling scores are opportunities. Consider preparing a stronger answer or demo for "{questions.find(q => (q.avgHandlingScore || 10) < 7)?.question || questions[0]?.question}".
        </p>
      </div>
    </div>
  );
}

// ============================================
// Trends Tab
// ============================================

function TrendsTab({ trends }: { trends: PerformanceTrend[] }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        Your performance compared to last week. Focus on areas trending down.
      </p>
      
      <div className="grid grid-cols-2 gap-3">
        {trends.map((trend, i) => (
          <TrendCard key={i} trend={trend} />
        ))}
      </div>

      <div className="mt-4 p-3 bg-amber-50 rounded-lg">
        <p className="text-xs font-medium text-amber-700 mb-1">📈 This Week's Focus</p>
        <p className="text-sm text-amber-900">
          {trends.find(t => t.trend === 'down')
            ? `Work on "${trends.find(t => t.trend === 'down')?.metric}" - it's down ${Math.abs(trends.find(t => t.trend === 'down')?.change || 0)}% from last week.`
            : "Great job! All metrics are stable or improving. Keep up the momentum!"}
        </p>
      </div>
    </div>
  );
}

function TrendCard({ trend }: { trend: PerformanceTrend }) {
  const trendColors = {
    up: { text: 'text-emerald-600', bg: 'bg-emerald-50', arrow: '↑' },
    down: { text: 'text-red-600', bg: 'bg-red-50', arrow: '↓' },
    stable: { text: 'text-gray-600', bg: 'bg-gray-50', arrow: '→' },
  };
  
  const colors = trendColors[trend.trend];

  return (
    <div className={`p-3 rounded-lg ${colors.bg}`}>
      <p className="text-xs text-gray-600 mb-1">{trend.metric}</p>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-semibold text-gray-900">
          {trend.current.toFixed(1)}
        </span>
        <span className={`text-sm font-medium ${colors.text}`}>
          {colors.arrow} {Math.abs(trend.change)}%
        </span>
      </div>
      <p className="text-xs text-gray-500 mt-1">
        vs {trend.previous.toFixed(1)} last week
      </p>
    </div>
  );
}

// ============================================
// Insights Tab
// ============================================

interface InsightsTabProps {
  insights: CoachingInsight[];
  improvementSuggestion?: string;
  onInsightClick?: (id: string) => void;
}

function InsightsTab({ insights, improvementSuggestion, onInsightClick }: InsightsTabProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-600 mb-4">
        Personalized observations from analyzing your recent calls.
      </p>
      
      {insights.map((insight) => (
        <InsightCard
          key={insight.id}
          insight={insight}
          onClick={() => onInsightClick?.(insight.id)}
          showDetails
        />
      ))}

      {improvementSuggestion && (
        <div className="mt-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100">
          <p className="text-xs font-medium text-indigo-700 mb-2">💭 Suggested Focus</p>
          <p className="text-sm text-indigo-900 font-medium">{improvementSuggestion}</p>
        </div>
      )}
    </div>
  );
}

// ============================================
// Insight Card
// ============================================

interface InsightCardProps {
  insight: CoachingInsight;
  onClick?: () => void;
  showDetails?: boolean;
}

function InsightCard({ insight, onClick, showDetails }: InsightCardProps) {
  const typeConfig = {
    improvement_area: { icon: '🎯', color: 'border-amber-200 bg-amber-50' },
    strength: { icon: '💪', color: 'border-emerald-200 bg-emerald-50' },
    objection_trend: { icon: '⚠️', color: 'border-orange-200 bg-orange-50' },
    question_pattern: { icon: '❓', color: 'border-blue-200 bg-blue-50' },
  };

  const config = typeConfig[insight.type];

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3 rounded-lg border ${config.color} hover:shadow-sm transition-shadow`}
    >
      <div className="flex items-start gap-2">
        <span className="text-lg">{config.icon}</span>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">{insight.title}</p>
          {showDetails && (
            <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
          )}
          {insight.frequency && (
            <p className="text-xs text-gray-500 mt-1">
              Occurred {insight.frequency}× {insight.callCount ? `in ${insight.callCount} calls` : 'recently'}
            </p>
          )}
        </div>
        {insight.trend && (
          <span className={`text-sm ${
            insight.trend === 'up' ? 'text-emerald-600' :
            insight.trend === 'down' ? 'text-red-600' : 'text-gray-500'
          }`}>
            {insight.trend === 'up' ? '↑' : insight.trend === 'down' ? '↓' : '→'}
          </span>
        )}
      </div>
    </button>
  );
}

// ============================================
// Empty State
// ============================================

export function SelfCoachingEmpty() {
  return (
    <div className="bg-white rounded-xl border shadow-sm p-8 text-center">
      <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-2xl">💡</span>
      </div>
      <h3 className="font-semibold text-gray-900 mb-2">Self-Coaching Coming Soon</h3>
      <p className="text-sm text-gray-500 max-w-sm mx-auto">
        Once you have a few more calls recorded, I'll analyze patterns and provide personalized coaching insights.
      </p>
      <p className="text-xs text-gray-400 mt-4">
        Need at least 5 calls for pattern analysis
      </p>
    </div>
  );
}

// ============================================
// Loading State
// ============================================

export function SelfCoachingLoading() {
  return (
    <div className="bg-white rounded-xl border shadow-sm animate-pulse">
      <div className="p-4 border-b">
        <div className="h-6 bg-gray-200 rounded w-48" />
      </div>
      <div className="p-4 space-y-4">
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-16 bg-gray-100 rounded" />
        <div className="h-16 bg-gray-100 rounded" />
        <div className="h-16 bg-gray-100 rounded" />
      </div>
    </div>
  );
}

export default SelfCoachingWidget;
