export type AIConfidence = 'high' | 'medium' | 'low';

export type AIEvidenceType = 'quote' | 'data_point' | 'pattern' | 'signal';

export interface AIEvidence {
  type: AIEvidenceType;
  source: string;
  content: string;
  timestamp?: string;
}

export interface JourneySnapshot {
  title: string;
  summary: string;
  consequence: string;
  confidence: AIConfidence;
  evidence: AIEvidence[];
  lastUpdated: string;
}

export type JourneyRequirementStatus = 'on_track' | 'watch' | 'blocked' | 'unknown';

export interface JourneyRequirement {
  id: string;
  label: string;
  status: JourneyRequirementStatus;
  summary: string;
  confidence: AIConfidence;
  evidence: AIEvidence[];
}

export interface ActionPlanItem {
  id: string;
  title: string;
  description: string;
  impact: string;
  confidence: AIConfidence;
  dueDate?: string;
  evidence: AIEvidence[];
  status?: 'ready' | 'in_progress' | 'done';
}

export interface JourneyStep {
  id: string;
  label: string;
  timeframe: string;
  rationale: string;
}

export interface ChannelContext {
  channelName: string;
  productFit: string;
  personas: string[];
  pains: string[];
  messaging: string[];
  lastReviewed?: string;
  reviewStatus?: 'approved' | 'needs_review' | 'draft';
  pendingUpdates?: number;
}

export interface WorkspaceArtifact {
  id: string;
  title: string;
  type: string;
  summary: string;
  updatedAt: string;
}

export interface MemoryAnchor {
  summary: string;
  lastUpdated: string;
}

export type EventType = 'call' | 'email' | 'ticket' | 'meeting' | 'note' | 'other';

export interface JourneyEvent {
  id: string;
  type: EventType;
  title: string;
  timestamp: string;
  summary: string;
  source?: string;
  participants?: string[];
}

export interface ChatContextItem {
  id: string;
  title: string;
  description: string;
  source: string;
  tags?: string[];
}

export type JourneyStageStatus = 'complete' | 'current' | 'next' | 'upcoming';

export type JourneySignalType = 'gain' | 'pain' | 'risk' | 'momentum';

export interface JourneySignal {
  id: string;
  label: string;
  detail: string;
  type: JourneySignalType;
  confidence: AIConfidence;
  evidence?: AIEvidence[];
}

export type JourneyTouchpointType = 'call' | 'email' | 'meeting' | 'demo' | 'workshop' | 'decision';

export interface JourneyTouchpoint {
  id: string;
  label: string;
  dateLabel: string;
  type: JourneyTouchpointType;
  summary?: string;
}

export interface JourneyStage {
  id: string;
  label: string;
  summary: string;
  status: JourneyStageStatus;
  owner?: string;
  touchpoints?: JourneyTouchpoint[];
  signals?: JourneySignal[];
}

export type JourneyLaneTone = 'neutral' | 'positive' | 'warning';

export interface JourneyLaneItem {
  id: string;
  stageId: string;
  label: string;
  detail?: string;
  tone?: JourneyLaneTone;
}

export interface JourneyLane {
  id: string;
  label: string;
  description?: string;
  items: JourneyLaneItem[];
}

export interface JourneyPathOption {
  id: string;
  label: string;
  description: string;
  probability: number;
  risk: string;
  steps: string[];
}

export type JourneyTimelineVariant = 'linear' | 'grid' | 'paths';

export interface JourneyTimelineConfig {
  title?: string;
  variant?: JourneyTimelineVariant;
  stages?: JourneyStage[];
  lanes?: JourneyLane[];
  paths?: JourneyPathOption[];
}
