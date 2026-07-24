import React from 'react';

/**
 * GenerateReportButton
 * Premium CTA button. All states controlled via props — no internal logic.
 *
 * Props:
 *   isLoading  — boolean  spinner + "Generating…" label
 *   disabled   — boolean  muted, non-interactive appearance
 *   onClick    — function called on click when not disabled/loading
 *   label      — string   idle label (default: "Generate AI Report")
 *   id         — string   optional HTML id override
 */
const GenerateReportButton = ({
  isLoading = false,
  disabled  = false,
  onClick,
  label = 'Generate AI Report',
  id,
}) => {
  const isDisabled = disabled || isLoading;

  return (
    <button
      id={id ?? 'generate-ai-report-btn'}
      type="button"
      onClick={isDisabled ? undefined : onClick}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-busy={isLoading}
      aria-label={isLoading ? 'Generating AI report, please wait…' : label}
      className={[
        'relative inline-flex items-center justify-center gap-2.5',
        'w-full sm:w-auto px-6 py-3 rounded-xl',
        'text-sm font-bold tracking-wide select-none',
        'transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2',
        isDisabled
          ? 'opacity-60 cursor-not-allowed bg-slate-200 text-slate-400 border border-slate-200 shadow-none'
          : 'text-white hover:-translate-y-0.5 active:scale-95 shadow-lg hover:shadow-xl',
      ].join(' ')}
      style={
        !isDisabled
          ? {
              background: 'linear-gradient(135deg, #0EA5E9 0%, #6366F1 100%)',
              boxShadow: '0 4px 16px rgba(14,165,233,0.40)',
            }
          : {}
      }
    >
      {/* Shimmer overlay (active state only) */}
      {!isDisabled && (
        <span
          className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none"
          aria-hidden="true"
        >
          <span
            className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.12) 50%, transparent 100%)',
            }}
          />
        </span>
      )}

      {isLoading ? (
        <>
          <svg
            className="w-4 h-4 animate-spin text-white/80 shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span>Generating…</span>
        </>
      ) : (
        <>
          {/* AI / sparkle icon */}
          <svg
            className="w-4 h-4 shrink-0"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
          <span>{label}</span>
        </>
      )}
    </button>
  );
};

export default GenerateReportButton;
