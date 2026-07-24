import React from 'react';

/**
 * MonthlySummaryCard
 * Displays month, a financial summary snippet, and last-generated timestamp.
 * Props:
 *   month          — string  e.g. "July 2025"
 *   summary        — string  AI-generated summary text
 *   lastGenerated  — string  e.g. "24 Jul 2025, 8:30 PM"
 *   riskLevel      — "Low" | "Medium" | "High"
 */
const MonthlySummaryCard = ({
  month = 'July 2025',
  summary = 'Your spending this month was well within budget. You managed to save 28% of your income, driven primarily by reduced discretionary spending on entertainment and dining out.',
  lastGenerated = '24 Jul 2025, 8:30 PM',
  riskLevel = 'Low',
}) => {
  const riskStyles = {
    Low:    { cls: 'bg-emerald-100 text-emerald-700 border-emerald-200', dot: '#10b981' },
    Medium: { cls: 'bg-amber-100  text-amber-700  border-amber-200',   dot: '#f59e0b' },
    High:   { cls: 'bg-rose-100   text-rose-700   border-rose-200',    dot: '#f43f5e' },
  };
  const risk = riskStyles[riskLevel] ?? riskStyles.Low;

  return (
    <div
      className="bg-white/80 backdrop-blur-sm border border-slate-100 rounded-2xl p-5 sm:p-6 flex flex-col gap-4"
      style={{ boxShadow: '0 2px 12px rgba(14,165,233,0.06), 0 1px 3px rgba(0,0,0,0.04)' }}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          {/* Calendar icon */}
          <div className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8"  y1="2" x2="8"  y2="6" />
              <line x1="3"  y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest leading-none mb-0.5">
              Report Period
            </p>
            <p className="text-sm font-bold text-slate-800">{month}</p>
          </div>
        </div>

        {/* Risk badge */}
        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold border rounded-full px-3 py-1 ${risk.cls}`}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: risk.dot }} />
          {riskLevel} Risk
        </span>
      </div>

      {/* Summary text */}
      <p className="text-sm text-slate-600 leading-relaxed border-t border-slate-50 pt-4">
        {summary}
      </p>

      {/* Footer */}
      <div className="flex items-center gap-2 pt-1 border-t border-slate-50">
        <svg className="w-3.5 h-3.5 text-slate-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        <p className="text-[11px] text-slate-400 font-medium">
          Generated {lastGenerated}
        </p>
      </div>
    </div>
  );
};

export default MonthlySummaryCard;
