import React from 'react';
import { EvidenceChip } from './types';

const CHIP_STYLES: Record<NonNullable<EvidenceChip['type']>, string> = {
  metric: 'border-blue-200 bg-blue-50 text-blue-700',
  note: 'border-slate-200 bg-slate-50 text-slate-700',
  signal: 'border-amber-200 bg-amber-50 text-amber-700',
};

export function EvidenceChips({ chips }: { chips: EvidenceChip[] }) {
  if (!chips.length) {
    return (
      <div className="rounded-lg border border-dashed bg-slate-50 p-3 text-xs text-slate-500">
        No evidence chips yet. Add notes or request a signal summary.
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((chip) => {
        const styles = CHIP_STYLES[chip.type ?? 'note'];
        return (
          <span
            key={chip.id}
            className={`inline-flex items-center gap-2 rounded-full border px-2 py-1 text-[11px] font-medium ${styles}`}
          >
            <span className="font-mono text-[10px] uppercase">{chip.label}</span>
            <span className="font-semibold">{chip.value}</span>
          </span>
        );
      })}
    </div>
  );
}
