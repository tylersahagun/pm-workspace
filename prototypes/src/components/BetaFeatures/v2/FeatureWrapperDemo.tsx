import * as React from 'react';
import { cn } from '@/lib/utils';
import { StageBadge, FeatureWrapper, NavBadge, HeaderBadge } from './StageBadge';
import { FeatureStage, STAGE_CONFIG } from './types';

// ============================================
// Demo: PostHog-style badges on navigation
// ============================================
export function NavigationDemo() {
  return (
    <div className="w-64 bg-muted/30 rounded-lg p-4">
      <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-4 px-2">
        Navigation
      </h3>
      <nav className="space-y-1">
        {/* Regular nav item */}
        <NavItem icon="📊" label="Dashboard" />
        <NavItem icon="📅" label="My Meetings" />
        
        {/* Beta feature nav items - PostHog style */}
        <NavItem icon="🔍" label="Search" badge="beta" />
        <NavItem icon="📚" label="Knowledge Bases" badge="beta" />
        <NavItem icon="✅" label="Action Items" badge="beta" />
        
        {/* Alpha feature */}
        <NavItem icon="🤖" label="Automations" badge="alpha" />
        
        {/* Lab feature */}
        <NavItem icon="🔮" label="Predictions" badge="lab" />
      </nav>
    </div>
  );
}

interface NavItemProps {
  icon: string;
  label: string;
  badge?: FeatureStage;
  isActive?: boolean;
}

function NavItem({ icon, label, badge, isActive }: NavItemProps) {
  return (
    <button
      className={cn(
        'w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
        isActive ? 'bg-white shadow-sm' : 'hover:bg-muted'
      )}
    >
      <span>{icon}</span>
      <span className="flex-1 text-left">{label}</span>
      {badge && <NavBadge stage={badge} />}
    </button>
  );
}

// ============================================
// Demo: Page header with badge
// ============================================
export function PageHeaderDemo() {
  return (
    <div className="space-y-6">
      {/* Beta feature page */}
      <div className="border rounded-lg overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b bg-white">
          <h1 className="text-lg font-semibold">Knowledge Bases</h1>
          <HeaderBadge stage="beta" />
        </div>
        <div className="p-6 bg-muted/20 text-center text-muted-foreground">
          Page content...
        </div>
      </div>

      {/* Alpha feature page */}
      <div className="border rounded-lg overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b bg-white">
          <h1 className="text-lg font-semibold">Salesforce Sync V2</h1>
          <HeaderBadge stage="alpha" />
        </div>
        <div className="p-6 bg-muted/20 text-center text-muted-foreground">
          Page content...
        </div>
      </div>

      {/* Lab feature page */}
      <div className="border rounded-lg overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b bg-white">
          <h1 className="text-lg font-semibold">Deal Predictions</h1>
          <HeaderBadge stage="lab" />
        </div>
        <div className="p-6 bg-muted/20 text-center text-muted-foreground">
          Page content...
        </div>
      </div>
    </div>
  );
}

// ============================================
// Demo: Inline badges (PostHog style)
// ============================================
export function InlineBadgeDemo() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h3 className="font-medium">PostHog-style inline badges</h3>
        <p className="text-sm text-muted-foreground">
          Compact uppercase badges that sit inline with text, similar to PostHog's UI.
        </p>
      </div>

      <div className="space-y-4 text-sm">
        <div className="flex items-center gap-2">
          <span>Feature:</span>
          <FeatureWrapper stage="beta">
            <span className="font-medium">Auto-Tagging V2</span>
          </FeatureWrapper>
        </div>

        <div className="flex items-center gap-2">
          <span>Feature:</span>
          <FeatureWrapper stage="alpha">
            <span className="font-medium">Privacy Agent</span>
          </FeatureWrapper>
        </div>

        <div className="flex items-center gap-2">
          <span>Feature:</span>
          <FeatureWrapper stage="lab">
            <span className="font-medium">Process Agent</span>
          </FeatureWrapper>
        </div>
      </div>

      {/* Badge position variants */}
      <div className="space-y-3 pt-4 border-t">
        <h4 className="font-medium text-sm">Badge Position Variants</h4>
        
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground w-20">Inline:</span>
            <FeatureWrapper stage="beta" badgePosition="inline">
              <span>Knowledge Base</span>
            </FeatureWrapper>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground w-20">After:</span>
            <FeatureWrapper stage="beta" badgePosition="after">
              <span>Knowledge Base</span>
            </FeatureWrapper>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground w-20">Top-right:</span>
            <FeatureWrapper stage="beta" badgePosition="top-right">
              <button className="px-3 py-2 bg-primary text-primary-foreground rounded-md text-sm">
                Open Feature
              </button>
            </FeatureWrapper>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// Demo: All badge variants
// ============================================
export function AllBadgeVariants() {
  const stages: FeatureStage[] = ['lab', 'alpha', 'beta'];
  const variants = ['default', 'outline', 'posthog'] as const;

  return (
    <div className="space-y-6">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2 pr-4">Stage</th>
            <th className="text-left py-2 px-4">Default</th>
            <th className="text-left py-2 px-4">Outline</th>
            <th className="text-left py-2 px-4">PostHog</th>
          </tr>
        </thead>
        <tbody>
          {stages.map((stage) => (
            <tr key={stage} className="border-b">
              <td className="py-3 pr-4 font-medium capitalize">{stage}</td>
              {variants.map((variant) => (
                <td key={variant} className="py-3 px-4">
                  <StageBadge stage={stage} variant={variant} showTooltip={false} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="text-xs text-muted-foreground">
        <strong>Recommendation:</strong> Use "outline" for navigation/headers (matches existing elephant-ai styling), 
        "posthog" for inline feature labels.
      </div>
    </div>
  );
}

// ============================================
// Demo: Card with wrapped features
// ============================================
export function FeatureCardDemo() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Beta feature card */}
      <div className="border rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between">
          <FeatureWrapper stage="beta" badgePosition="after">
            <h3 className="font-medium">Global Chat</h3>
          </FeatureWrapper>
          <button className="text-xs text-primary">Configure →</button>
        </div>
        <p className="text-sm text-muted-foreground">
          Chat with AskElephant from anywhere in the app.
        </p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>✓ Enabled</span>
          <span>•</span>
          <span>Bottom-right corner</span>
        </div>
      </div>

      {/* Alpha feature card */}
      <div className="border rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between">
          <FeatureWrapper stage="alpha" badgePosition="after">
            <h3 className="font-medium">Privacy Agent</h3>
          </FeatureWrapper>
          <button className="text-xs text-primary">Configure →</button>
        </div>
        <p className="text-sm text-muted-foreground">
          AI determines call privacy levels automatically.
        </p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="text-orange-600">○ Not enabled</span>
        </div>
      </div>

      {/* Lab feature card */}
      <div className="border rounded-lg p-4 space-y-3 border-dashed">
        <div className="flex items-center justify-between">
          <FeatureWrapper stage="lab" badgePosition="after">
            <h3 className="font-medium">Deal Predictions</h3>
          </FeatureWrapper>
          <span className="text-xs text-muted-foreground">Invite only</span>
        </div>
        <p className="text-sm text-muted-foreground">
          ML-powered deal outcome predictions.
        </p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="text-purple-600">🧪 Experimental</span>
        </div>
      </div>

      {/* GA feature card (no badge) */}
      <div className="border rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">My Meetings</h3>
          <button className="text-xs text-primary">View →</button>
        </div>
        <p className="text-sm text-muted-foreground">
          View and manage all your recorded meetings.
        </p>
        <div className="flex items-center gap-2 text-xs text-green-600">
          <span>✓ Generally available</span>
        </div>
      </div>
    </div>
  );
}
