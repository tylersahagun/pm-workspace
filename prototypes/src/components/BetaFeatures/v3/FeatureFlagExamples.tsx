import * as React from 'react';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';
import { StageBadge, StageIcon, FeatureIndicator, NewBadge } from './StageBadge';
import { FeatureStage, STAGE_CONFIG } from './types';

// ============================================
// Example: Navigation Sidebar
// ============================================
export function NavigationExample() {
  return (
    <div className="w-64 bg-slate-50 rounded-lg border">
      <div className="p-4 border-b">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Main Navigation
        </h3>
      </div>
      <nav className="p-2 space-y-0.5">
        <NavItem icon={CalendarIcon} label="My Meetings" />
        <NavItem icon={SearchIcon} label="Search" />
        <NavItem icon={UsersIcon} label="Customers" stage="beta" isNew />
        <NavItem icon={BookIcon} label="Knowledge Bases" stage="beta" />
        <NavItem icon={CheckIcon} label="Action Items" stage="beta" />
        <NavItem icon={BoltIcon} label="Automations" stage="alpha" />
        <NavItem icon={BeakerIcon} label="Predictions" stage="lab" />
      </nav>
      <div className="p-4 border-t mt-2">
        <p className="text-xs text-muted-foreground">
          Features with badges are in early access.
        </p>
      </div>
    </div>
  );
}

interface NavItemProps {
  icon: React.FC<{ className?: string }>;
  label: string;
  stage?: FeatureStage;
  isNew?: boolean;
  isActive?: boolean;
}

function NavItem({ icon: Icon, label, stage, isNew, isActive }: NavItemProps) {
  return (
    <button
      className={cn(
        'w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors text-left',
        isActive ? 'bg-white shadow-sm font-medium' : 'hover:bg-white/60'
      )}
    >
      <Icon className="w-4 h-4 text-muted-foreground" />
      <span className="flex-1">{label}</span>
      {isNew && <NewBadge />}
      {stage && !isNew && <StageBadge stage={stage} size="xs" showTooltip={false} />}
    </button>
  );
}

// ============================================
// Example: Page Header
// ============================================
export function PageHeaderExample() {
  return (
    <div className="space-y-4">
      {/* Beta page header */}
      <div className="border rounded-lg overflow-hidden bg-white">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold">Knowledge Bases</h1>
            <StageBadge stage="beta" />
          </div>
          <button className="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-md">
            New Knowledge Base
          </button>
        </div>
        <div className="p-6 bg-slate-50 text-center text-sm text-muted-foreground h-32 flex items-center justify-center">
          Page content area
        </div>
      </div>

      {/* Alpha page header with warning banner */}
      <div className="border rounded-lg overflow-hidden bg-white">
        <div className="px-4 py-2 bg-blue-50 border-b border-blue-100 flex items-center gap-2">
          <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-xs text-blue-700">
            This feature is in alpha. <button className="underline">Learn about what that means</button>
          </span>
        </div>
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold">Universal Search</h1>
            <StageBadge stage="alpha" />
          </div>
        </div>
        <div className="p-6 bg-slate-50 text-center text-sm text-muted-foreground h-32 flex items-center justify-center">
          Page content area
        </div>
      </div>

      {/* Lab page header with prominent warning */}
      <div className="border rounded-lg overflow-hidden bg-white">
        <div className="px-4 py-3 bg-purple-50 border-b border-purple-100">
          <div className="flex items-start gap-3">
            <StageIcon stage="lab" size="sm" />
            <div>
              <p className="text-sm font-medium text-purple-900">Experimental Feature</p>
              <p className="text-xs text-purple-700 mt-0.5">
                This feature is highly experimental and may change significantly or be removed.
              </p>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold">Deal Predictions</h1>
            <StageBadge stage="lab" />
          </div>
        </div>
        <div className="p-6 bg-slate-50 text-center text-sm text-muted-foreground h-32 flex items-center justify-center">
          Page content area
        </div>
      </div>
    </div>
  );
}

// ============================================
// Example: Feature Cards
// ============================================
export function FeatureCardsExample() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* GA feature - no badge */}
      <div className="border rounded-lg p-4 bg-white">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-medium">My Meetings</h3>
          <span className="text-xs text-emerald-600 flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Generally available
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          View and manage all your recorded meetings in one place.
        </p>
      </div>

      {/* Beta feature */}
      <div className="border rounded-lg p-4 bg-white">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="font-medium">Knowledge Bases</h3>
            <StageBadge stage="beta" size="xs" showTooltip={false} />
          </div>
          <Switch defaultChecked />
        </div>
        <p className="text-sm text-muted-foreground">
          Create searchable knowledge bases from your meeting content.
        </p>
      </div>

      {/* Alpha feature */}
      <div className="border rounded-lg p-4 bg-white border-dashed">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="font-medium">Privacy Agent</h3>
            <StageBadge stage="alpha" size="xs" showTooltip={false} />
          </div>
          <Switch />
        </div>
        <p className="text-sm text-muted-foreground">
          AI automatically determines call privacy levels.
        </p>
      </div>

      {/* Lab feature */}
      <div className="border-2 border-dashed border-purple-200 rounded-lg p-4 bg-purple-50/30">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-purple-900">Deal Predictions</h3>
            <StageBadge stage="lab" size="xs" showTooltip={false} />
          </div>
          <span className="text-xs text-purple-600">Invite only</span>
        </div>
        <p className="text-sm text-purple-700/80">
          ML-powered deal outcome predictions. Highly experimental.
        </p>
      </div>
    </div>
  );
}

// ============================================
// Example: Buttons with Badges
// ============================================
export function ButtonsExample() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-muted-foreground">Primary buttons with stage indicators</h4>
        <div className="flex flex-wrap gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium">
            Open Search
            <StageBadge stage="beta" size="xs" variant="solid" showTooltip={false} />
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium">
            Try Predictions
            <StageBadge stage="lab" size="xs" variant="solid" showTooltip={false} />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-medium text-muted-foreground">Secondary buttons</h4>
        <div className="flex flex-wrap gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2 border rounded-md text-sm font-medium hover:bg-muted/50">
            Knowledge Bases
            <StageBadge stage="beta" size="xs" showTooltip={false} />
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 border rounded-md text-sm font-medium hover:bg-muted/50">
            Automations
            <StageBadge stage="alpha" size="xs" showTooltip={false} />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-medium text-muted-foreground">Icon buttons with corner badges</h4>
        <div className="flex gap-4">
          <FeatureIndicator stage="beta" position="corner">
            <button className="p-2 border rounded-md hover:bg-muted/50">
              <BookIcon className="w-5 h-5" />
            </button>
          </FeatureIndicator>
          <FeatureIndicator stage="alpha" position="corner">
            <button className="p-2 border rounded-md hover:bg-muted/50">
              <BoltIcon className="w-5 h-5" />
            </button>
          </FeatureIndicator>
          <FeatureIndicator stage="lab" position="corner">
            <button className="p-2 border rounded-md hover:bg-muted/50">
              <BeakerIcon className="w-5 h-5" />
            </button>
          </FeatureIndicator>
        </div>
      </div>
    </div>
  );
}

// ============================================
// Example: Table/List with Indicators
// ============================================
export function TableExample() {
  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 border-b">
          <tr>
            <th className="text-left px-4 py-3 font-medium">Feature</th>
            <th className="text-left px-4 py-3 font-medium">Status</th>
            <th className="text-left px-4 py-3 font-medium">Stage</th>
            <th className="text-right px-4 py-3 font-medium">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          <tr>
            <td className="px-4 py-3">My Meetings</td>
            <td className="px-4 py-3">
              <span className="text-emerald-600 text-xs">Available</span>
            </td>
            <td className="px-4 py-3">
              <span className="text-xs text-muted-foreground">GA</span>
            </td>
            <td className="px-4 py-3 text-right">
              <button className="text-xs text-primary">Open</button>
            </td>
          </tr>
          <tr>
            <td className="px-4 py-3">
              <span className="flex items-center gap-2">
                Knowledge Bases
                <NewBadge />
              </span>
            </td>
            <td className="px-4 py-3">
              <span className="text-emerald-600 text-xs">Enabled</span>
            </td>
            <td className="px-4 py-3">
              <StageBadge stage="beta" size="xs" showTooltip={false} />
            </td>
            <td className="px-4 py-3 text-right">
              <button className="text-xs text-primary">Configure</button>
            </td>
          </tr>
          <tr>
            <td className="px-4 py-3">Universal Search</td>
            <td className="px-4 py-3">
              <span className="text-muted-foreground text-xs">Disabled</span>
            </td>
            <td className="px-4 py-3">
              <StageBadge stage="alpha" size="xs" showTooltip={false} />
            </td>
            <td className="px-4 py-3 text-right">
              <button className="text-xs text-primary">Enable</button>
            </td>
          </tr>
          <tr className="bg-purple-50/30">
            <td className="px-4 py-3">Deal Predictions</td>
            <td className="px-4 py-3">
              <span className="text-purple-600 text-xs">Invite only</span>
            </td>
            <td className="px-4 py-3">
              <StageBadge stage="lab" size="xs" showTooltip={false} />
            </td>
            <td className="px-4 py-3 text-right">
              <button className="text-xs text-muted-foreground">Request</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

// ============================================
// Example: Modal/Dialog
// ============================================
export function ModalExample() {
  return (
    <div className="border rounded-lg bg-white shadow-xl max-w-md mx-auto">
      {/* Header with stage indicator */}
      <div className="px-6 py-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold">Configure Auto-Tagging</h2>
          <StageBadge stage="beta" size="sm" showTooltip={false} />
        </div>
        <button className="text-muted-foreground hover:text-foreground">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Beta notice */}
      <div className="px-6 py-3 bg-indigo-50 border-b border-indigo-100">
        <p className="text-xs text-indigo-700 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          This is a beta feature. Settings may change in future updates.
        </p>
      </div>

      {/* Content */}
      <div className="px-6 py-4 space-y-4">
        <div>
          <label className="text-sm font-medium">Tag categories</label>
          <p className="text-xs text-muted-foreground mt-1">
            Select which categories to auto-tag
          </p>
        </div>
        <div className="h-24 bg-slate-50 rounded border flex items-center justify-center text-sm text-muted-foreground">
          Configuration options...
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t bg-slate-50 flex justify-end gap-3">
        <button className="px-4 py-2 text-sm border rounded-md hover:bg-white">Cancel</button>
        <button className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md">Save changes</button>
      </div>
    </div>
  );
}

// ============================================
// Example: Dropdown Menu
// ============================================
export function DropdownExample() {
  return (
    <div className="border rounded-lg bg-white shadow-lg w-56 py-1">
      <div className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
        Views
      </div>
      <button className="w-full px-3 py-2 text-sm text-left hover:bg-slate-50 flex items-center justify-between">
        <span>Pipeline</span>
      </button>
      <button className="w-full px-3 py-2 text-sm text-left hover:bg-slate-50 flex items-center justify-between">
        <span>Customers</span>
        <StageBadge stage="beta" size="xs" showTooltip={false} />
      </button>
      <button className="w-full px-3 py-2 text-sm text-left hover:bg-slate-50 flex items-center justify-between">
        <span>Predictions</span>
        <StageBadge stage="lab" size="xs" showTooltip={false} />
      </button>
      <div className="border-t my-1" />
      <div className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
        Actions
      </div>
      <button className="w-full px-3 py-2 text-sm text-left hover:bg-slate-50 flex items-center justify-between">
        <span>Auto-tag meeting</span>
        <StageBadge stage="beta" size="xs" showTooltip={false} />
      </button>
    </div>
  );
}

// ============================================
// Icons (simple implementations)
// ============================================
function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}

function BookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function BoltIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );
}

function BeakerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
    </svg>
  );
}
