import React from 'react';

/**
 * InsightCard
 * Reusable card with a title, an icon slot, and a bullet list of insights.
 *
 * Props:
 *   title   — string
 *   icon    — JSX element
 *   items   — string[]
 *   accent  — Tailwind color key suffix: "emerald" | "rose" | "sky" | "amber"
 */
const ACCENT_MAP = {
  emerald: {
    iconBg:    'bg-emerald-50 border-emerald-100',
    iconColor: 'text-emerald-500',
    dot:       'bg-emerald-400',
    title:     'text-emerald-700',
    bar:       'bg-emerald-400',
  },
  rose: {
    iconBg:    'bg-rose-50 border-rose-100',
    iconColor: 'text-rose-500',
    dot:       'bg-rose-400',
    title:     'text-rose-700',
    bar:       'bg-rose-400',
  },
  sky: {
    iconBg:    'bg-sky-50 border-sky-100',
    iconColor: 'text-sky-500',
    dot:       'bg-sky-400',
    title:     'text-sky-700',
    bar:       'bg-sky-400',
  },
  amber: {
    iconBg:    'bg-amber-50 border-amber-100',
    iconColor: 'text-amber-500',
    dot:       'bg-amber-400',
    title:     'text-amber-700',
    bar:       'bg-amber-400',
  },
};

const InsightCard = ({
  title = 'Insights',
  icon,
  items = [],
  accent = 'sky',
}) => {
  const a = ACCENT_MAP[accent] ?? ACCENT_MAP.sky;

  return (
    <div
      className="bg-white/80 backdrop-blur-sm border border-slate-100 rounded-2xl p-5 sm:p-6 flex flex-col gap-4 h-full"
      style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.03)' }}
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${a.iconBg} ${a.iconColor}`}>
          {icon ?? (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          )}
        </div>
        <h3 className={`text-sm font-bold ${a.title}`}>{title}</h3>
      </div>

      {/* Divider bar */}
      <div className={`h-0.5 w-8 rounded-full ${a.bar} opacity-40`} />

      {/* Bullet list */}
      <ul className="flex flex-col gap-3">
        {items.length === 0 ? (
          <li className="text-slate-400 text-sm italic">No data available.</li>
        ) : (
          items.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span className={`mt-[6px] w-1.5 h-1.5 rounded-full shrink-0 ${a.dot}`} />
              <span className="text-sm text-slate-600 leading-snug">{item}</span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default InsightCard;
