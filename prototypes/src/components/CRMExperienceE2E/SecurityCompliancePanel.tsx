import * as React from 'react';
import {
  Shield,
  Lock,
  Eye,
  FileCheck,
  Server,
  Clock,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Database,
  History,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SecurityCompliancePanelProps {
  variant?: 'full' | 'compact' | 'banner';
  showAuditLog?: boolean;
}

interface ComplianceBadge {
  id: string;
  name: string;
  status: 'certified' | 'in_progress' | 'not_applicable';
  lastAuditDate?: string;
  expiresAt?: string;
}

interface DataHandlingPolicy {
  id: string;
  category: string;
  description: string;
  retention: string;
}

interface AuditLogEntry {
  id: string;
  timestamp: Date;
  action: string;
  actor: string;
  details: string;
  resourceType: 'deal' | 'contact' | 'company' | 'agent_config';
  resourceId: string;
}

const COMPLIANCE_BADGES: ComplianceBadge[] = [
  {
    id: 'soc2-type2',
    name: 'SOC 2 Type II',
    status: 'certified',
    lastAuditDate: '2025-11-15',
    expiresAt: '2026-11-15',
  },
  {
    id: 'gdpr',
    name: 'GDPR Compliant',
    status: 'certified',
    lastAuditDate: '2025-09-01',
  },
  {
    id: 'hipaa',
    name: 'HIPAA',
    status: 'not_applicable',
  },
  {
    id: 'iso27001',
    name: 'ISO 27001',
    status: 'in_progress',
  },
];

const DATA_HANDLING_POLICIES: DataHandlingPolicy[] = [
  {
    id: 'meeting-recordings',
    category: 'Meeting Recordings',
    description: 'Audio/video recordings are encrypted at rest (AES-256) and in transit (TLS 1.3). Stored in your designated region.',
    retention: '90 days default, configurable',
  },
  {
    id: 'transcripts',
    category: 'Transcripts',
    description: 'AI-generated transcripts are processed in secure, isolated environments. PII is automatically detected and masked.',
    retention: '365 days default',
  },
  {
    id: 'crm-data',
    category: 'CRM Sync Data',
    description: 'Only writes data you configure. Never reads or stores data outside your specified fields.',
    retention: 'Sync logs: 30 days',
  },
  {
    id: 'ai-models',
    category: 'AI Processing',
    description: 'Your data is never used to train models. Processing happens in real-time with no persistent storage.',
    retention: 'No retention',
  },
];

const MOCK_AUDIT_LOG: AuditLogEntry[] = [
  {
    id: 'audit-1',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    action: 'CRM_UPDATE',
    actor: 'CRM Agent: Discovery Call Basics',
    details: 'Updated dealstage, next_step, next_step_date on deal "Acme Corp Expansion"',
    resourceType: 'deal',
    resourceId: 'deal-123',
  },
  {
    id: 'audit-2',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    action: 'AGENT_PAUSED',
    actor: 'admin@company.com',
    details: 'Paused agent "Deal Risk Assessment" for review',
    resourceType: 'agent_config',
    resourceId: 'agent-456',
  },
  {
    id: 'audit-3',
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    action: 'ROLLBACK',
    actor: 'user@company.com',
    details: 'Rolled back 3 field updates on deal "GlobalTech Pilot"',
    resourceType: 'deal',
    resourceId: 'deal-789',
  },
  {
    id: 'audit-4',
    timestamp: new Date(Date.now() - 1000 * 60 * 90),
    action: 'CONFIG_CHANGE',
    actor: 'admin@company.com',
    details: 'Added field "probability_to_close" to Discovery Call Basics agent',
    resourceType: 'agent_config',
    resourceId: 'agent-123',
  },
];

export function SecurityCompliancePanel({
  variant = 'full',
  showAuditLog = true,
}: SecurityCompliancePanelProps) {
  const [expandedSection, setExpandedSection] = React.useState<string | null>('overview');

  if (variant === 'banner') {
    return <SecurityBanner />;
  }

  if (variant === 'compact') {
    return <SecurityCompact />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
              <Shield className="size-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white">Security & Compliance</h1>
              <p className="text-sm text-slate-400">Your data is protected by enterprise-grade security</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* Trust Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20">
          <div className="flex items-start gap-4">
            <div className="size-12 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
              <Lock className="size-6 text-emerald-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-white mb-2">Your Data Stays Yours</h2>
              <p className="text-slate-300 mb-4">
                AskElephant never uses your data to train AI models. We process in real-time, 
                encrypt everything, and give you full control over what's accessed.
              </p>
              <div className="flex flex-wrap gap-3">
                {COMPLIANCE_BADGES.filter(b => b.status === 'certified').map(badge => (
                  <div
                    key={badge.id}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30"
                  >
                    <CheckCircle2 className="size-4 text-emerald-400" />
                    <span className="text-sm font-medium text-emerald-300">{badge.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Compliance Certifications */}
        <CollapsibleSection
          id="certifications"
          title="Compliance Certifications"
          icon={<FileCheck className="size-5" />}
          isExpanded={expandedSection === 'certifications'}
          onToggle={() => setExpandedSection(expandedSection === 'certifications' ? null : 'certifications')}
        >
          <div className="grid grid-cols-2 gap-4">
            {COMPLIANCE_BADGES.map(badge => (
              <div
                key={badge.id}
                className={cn(
                  'p-4 rounded-xl border',
                  badge.status === 'certified'
                    ? 'bg-emerald-500/10 border-emerald-500/30'
                    : badge.status === 'in_progress'
                      ? 'bg-amber-500/10 border-amber-500/30'
                      : 'bg-slate-800/50 border-slate-700/50'
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-white">{badge.name}</span>
                  {badge.status === 'certified' && (
                    <CheckCircle2 className="size-5 text-emerald-400" />
                  )}
                  {badge.status === 'in_progress' && (
                    <Clock className="size-5 text-amber-400" />
                  )}
                </div>
                <div className="text-sm text-slate-400">
                  {badge.status === 'certified' && (
                    <>Last audited: {badge.lastAuditDate}</>
                  )}
                  {badge.status === 'in_progress' && 'Certification in progress'}
                  {badge.status === 'not_applicable' && 'Not applicable'}
                </div>
              </div>
            ))}
          </div>
        </CollapsibleSection>

        {/* Data Handling */}
        <CollapsibleSection
          id="data-handling"
          title="Data Handling & Privacy"
          icon={<Database className="size-5" />}
          isExpanded={expandedSection === 'data-handling'}
          onToggle={() => setExpandedSection(expandedSection === 'data-handling' ? null : 'data-handling')}
        >
          <div className="space-y-4">
            {DATA_HANDLING_POLICIES.map(policy => (
              <div
                key={policy.id}
                className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-white">{policy.category}</h4>
                  <span className="text-xs px-2 py-1 rounded-md bg-slate-700 text-slate-300">
                    Retention: {policy.retention}
                  </span>
                </div>
                <p className="text-sm text-slate-400">{policy.description}</p>
              </div>
            ))}
          </div>
        </CollapsibleSection>

        {/* Rollback & Recovery */}
        <CollapsibleSection
          id="rollback"
          title="Rollback & Recovery"
          icon={<RefreshCw className="size-5" />}
          isExpanded={expandedSection === 'rollback'}
          onToggle={() => setExpandedSection(expandedSection === 'rollback' ? null : 'rollback')}
        >
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
              <div className="flex items-start gap-3">
                <RefreshCw className="size-5 text-blue-400 mt-0.5" />
                <div>
                  <h4 className="font-medium text-white mb-1">One-Click Rollback</h4>
                  <p className="text-sm text-slate-300">
                    Made a mistake? Every CRM update can be rolled back instantly. We keep a full 
                    history of all changes for 30 days.
                  </p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <div className="flex items-center gap-2 mb-2">
                  <History className="size-4 text-slate-400" />
                  <span className="text-sm font-medium text-white">Change History</span>
                </div>
                <p className="text-sm text-slate-400">
                  Every field update is logged with before/after values, timestamp, and source.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="size-4 text-slate-400" />
                  <span className="text-sm font-medium text-white">Pause Anytime</span>
                </div>
                <p className="text-sm text-slate-400">
                  Pause any agent instantly. Resume when you're ready. No data loss.
                </p>
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* Audit Log */}
        {showAuditLog && (
          <CollapsibleSection
            id="audit-log"
            title="Audit Log"
            icon={<Eye className="size-5" />}
            isExpanded={expandedSection === 'audit-log'}
            onToggle={() => setExpandedSection(expandedSection === 'audit-log' ? null : 'audit-log')}
          >
            <div className="space-y-2">
              {MOCK_AUDIT_LOG.map(entry => (
                <AuditLogRow key={entry.id} entry={entry} />
              ))}
              <button className="w-full py-3 text-sm text-orange-400 hover:text-orange-300 flex items-center justify-center gap-2">
                View Full Audit Log
                <ExternalLink className="size-3" />
              </button>
            </div>
          </CollapsibleSection>
        )}

        {/* Infrastructure */}
        <CollapsibleSection
          id="infrastructure"
          title="Infrastructure & Security"
          icon={<Server className="size-5" />}
          isExpanded={expandedSection === 'infrastructure'}
          onToggle={() => setExpandedSection(expandedSection === 'infrastructure' ? null : 'infrastructure')}
        >
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Data Centers', value: 'AWS (US, EU)', icon: Server },
              { label: 'Encryption at Rest', value: 'AES-256', icon: Lock },
              { label: 'Encryption in Transit', value: 'TLS 1.3', icon: Shield },
              { label: 'Uptime SLA', value: '99.9%', icon: CheckCircle2 },
            ].map(item => (
              <div
                key={item.label}
                className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center gap-3"
              >
                <div className="size-10 rounded-lg bg-slate-700 flex items-center justify-center">
                  <item.icon className="size-5 text-slate-400" />
                </div>
                <div>
                  <div className="text-sm text-slate-400">{item.label}</div>
                  <div className="font-medium text-white">{item.value}</div>
                </div>
              </div>
            ))}
          </div>
        </CollapsibleSection>

        {/* CTA */}
        <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50 text-center">
          <h3 className="text-lg font-semibold text-white mb-2">Have Security Questions?</h3>
          <p className="text-slate-400 mb-4">
            Our security team is happy to discuss your specific compliance requirements.
          </p>
          <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium hover:from-orange-600 hover:to-orange-700 transition-all">
            Request Security Review
          </button>
        </div>
      </div>
    </div>
  );
}

function CollapsibleSection({
  id,
  title,
  icon,
  children,
  isExpanded,
  onToggle,
}: {
  id: string;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="rounded-2xl bg-slate-800/50 border border-slate-700/50 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-slate-400">{icon}</span>
          <span className="font-medium text-white">{title}</span>
        </div>
        {isExpanded ? (
          <ChevronDown className="size-5 text-slate-400" />
        ) : (
          <ChevronRight className="size-5 text-slate-400" />
        )}
      </button>
      {isExpanded && (
        <div className="px-4 pb-4">
          {children}
        </div>
      )}
    </div>
  );
}

function AuditLogRow({ entry }: { entry: AuditLogEntry }) {
  const actionConfig: Record<string, { icon: React.ReactNode; color: string }> = {
    CRM_UPDATE: { icon: <Database className="size-4" />, color: 'text-emerald-400' },
    AGENT_PAUSED: { icon: <AlertTriangle className="size-4" />, color: 'text-amber-400' },
    ROLLBACK: { icon: <RefreshCw className="size-4" />, color: 'text-blue-400' },
    CONFIG_CHANGE: { icon: <FileCheck className="size-4" />, color: 'text-purple-400' },
  };

  const config = actionConfig[entry.action] || { icon: <Eye className="size-4" />, color: 'text-slate-400' };
  const timeAgo = getTimeAgo(entry.timestamp);

  return (
    <div className="p-3 rounded-lg bg-slate-900/50 flex items-start gap-3">
      <div className={cn('mt-0.5', config.color)}>
        {config.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <span className="text-sm font-medium text-white truncate">{entry.details}</span>
          <span className="text-xs text-slate-500 flex-shrink-0">{timeAgo}</span>
        </div>
        <div className="text-xs text-slate-500">
          by {entry.actor}
        </div>
      </div>
    </div>
  );
}

// Compact variant for embedding
function SecurityCompact() {
  return (
    <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Shield className="size-5 text-emerald-400" />
          <span className="font-medium text-white">Security & Compliance</span>
        </div>
        <button className="text-sm text-orange-400 hover:text-orange-300">
          Learn More
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {['SOC 2 Type II', 'GDPR', 'AES-256', 'TLS 1.3'].map(badge => (
          <span
            key={badge}
            className="px-2 py-1 rounded-md text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
          >
            {badge}
          </span>
        ))}
      </div>
    </div>
  );
}

// Banner variant for onboarding
function SecurityBanner() {
  return (
    <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20">
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
          <Shield className="size-5 text-emerald-400" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-white">Enterprise Security</span>
            <span className="px-2 py-0.5 rounded-full text-xs bg-emerald-500/20 text-emerald-400">
              SOC 2 Certified
            </span>
          </div>
          <p className="text-sm text-slate-400">
            Your data is encrypted, never used for training, and you can rollback any change instantly.
          </p>
        </div>
        <button className="flex items-center gap-1 text-sm text-orange-400 hover:text-orange-300 flex-shrink-0">
          View Details
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

export default SecurityCompliancePanel;
