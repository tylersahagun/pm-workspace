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

export interface ChatContextItem {
  id: string;
  title: string;
  description: string;
  source: string;
  tags?: string[];
}

export type OrchestrationStageStatus = 'complete' | 'current' | 'next' | 'upcoming';

export interface OrchestrationStage {
  id: string;
  label: string;
  status: OrchestrationStageStatus;
  timeRange: string;
  summary: string;
}

export type OrchestrationActor = 'customer' | 'success_manager' | 'product' | 'automation';

export type OrchestrationItemType = 'touchpoint' | 'milestone' | 'decision' | 'signal';

export type OrchestrationItemState = 'complete' | 'current' | 'at_risk' | 'critical' | 'next' | 'upcoming';

export interface EvidenceChip {
  id: string;
  label: string;
  value: string;
  type?: 'metric' | 'note' | 'signal';
}

export interface OrchestrationItem {
  id: string;
  stageId: string;
  label: string;
  detail: string;
  timestamp: string;
  actor: OrchestrationActor;
  type: OrchestrationItemType;
  state: OrchestrationItemState;
  weight: number;
  automated?: boolean;
  isGoldenPath?: boolean;
  isMomentOfTruth?: boolean;
  evidence?: EvidenceChip[];
}

export interface OrchestrationLane {
  id: string;
  label: string;
  actor: OrchestrationActor;
  items: OrchestrationItem[];
}

export interface SentimentBloom {
  id: string;
  stageId: string;
  sentiment: 'positive' | 'neutral' | 'warning' | 'critical';
  intensity: number;
  note?: string;
}
