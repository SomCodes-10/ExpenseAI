import React from 'react';

/**
 * Skeleton pulse helper primitive
 */
const PulseBar = ({ className }) => (
  <div className={`animate-pulse rounded-lg bg-slate-200/70 ${className}`} aria-hidden="true" />
);

/**
 * InsightsLoadingScreen
 * Redesigned minimal & trustworthy loading state.
 * Displays real AI status banner + subtle skeleton layout of the report sections
 * without fake percentages or fake timelines.
 */
const InsightsLoadingScreen = () => {
  return (
    <div
      className="flex flex-col gap-6 max-w-6xl mx-auto w-full transition-opacity duration-300"
      role="status"
      aria-live="polite"
      aria-label="Generating your personalized financial insights..."
    >
      {/* ── Top Hero Loader Banner ────────────────────────────────────────── */}
      <div
        className="bg-white/85 backdrop-blur-md border border-slate-100 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-5 sm:gap-6 shadow-sm"
        style={{
          boxShadow: '0 8px 30px -8px rgba(14,165,233,0.12), 0 2px 8px rgba(0,0,0,0.03)',
        }}
      >
        {/* Animated glowing AI orb */}
        <div className="relative flex items-center justify-center shrink-0">
          <div
            className="absolute w-16 h-16 rounded-full bg-gradient-to-r from-sky-400/30 to-indigo-400/30 blur-xl animate-pulse"
            aria-hidden="true"
          />
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-50 to-indigo-50 border border-sky-100 flex items-center justify-center relative z-10 shadow-xs animate-[floatIcon_4s_easeInOut_infinite]">
            <svg
              className="w-7 h-7 text-sky-500 animate-pulse"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
        </div>

        {/* Banner Copy */}
        <div className="flex flex-col gap-1.5 text-center sm:text-left flex-1 min-w-0">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-sky-600">
              AI Analysis in Progress
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-tight">
            Generating your personalized financial insights…
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-medium leading-relaxed">
            Our AI is analyzing your transactions and preparing recommendations.
          </p>
        </div>
      </div>

      {/* ── Report Skeleton Placeholders ───────────────────────────────────── */}
      {/* Top Grid: Gauge Skeleton + Summary Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
        {/* Gauge card skeleton */}
        <div
          className="bg-white/80 backdrop-blur-sm border border-slate-100 rounded-2xl p-6 flex flex-col items-center justify-center gap-4"
          style={{ minHeight: 260, boxShadow: '0 2px 12px rgba(14,165,233,0.04)' }}
        >
          <PulseBar className="h-3 w-28" />
          <div className="w-36 h-36 rounded-full border-[8px] border-slate-100 animate-pulse flex items-center justify-center">
            <PulseBar className="h-8 w-14 rounded-md" />
          </div>
          <PulseBar className="h-3 w-36" />
        </div>

        {/* Monthly Summary card skeleton */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div
            className="bg-white/80 backdrop-blur-sm border border-slate-100 rounded-2xl p-6 flex flex-col gap-4 flex-1 justify-between"
            style={{ boxShadow: '0 2px 12px rgba(14,165,233,0.04)' }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PulseBar className="w-9 h-9 rounded-xl" />
                <div className="flex flex-col gap-1">
                  <PulseBar className="h-2.5 w-20" />
                  <PulseBar className="h-4 w-28" />
                </div>
              </div>
              <PulseBar className="h-6 w-20 rounded-full" />
            </div>

            <div className="flex flex-col gap-2.5 border-t border-slate-50 pt-4">
              <PulseBar className="h-3 w.full" />
              <PulseBar className="h-3 w-11/12" />
              <PulseBar className="h-3 w-4/5" />
              <PulseBar className="h-3 w-2/3" />
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-50">
              <PulseBar className="h-3 w-36" />
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-sm border border-slate-100 rounded-2xl px-5 py-4 flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <PulseBar className="h-3.5 w-32" />
              <PulseBar className="h-2.5 w-48" />
            </div>
            <PulseBar className="h-9 w-32 rounded-xl" />
          </div>
        </div>
      </div>

      {/* Middle Grid: Strengths & Concerns Skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        <div className="bg-white/80 border border-slate-100 rounded-2xl p-5 sm:p-6 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <PulseBar className="w-9 h-9 rounded-xl" />
            <PulseBar className="h-4 w-24" />
          </div>
          <div className="flex flex-col gap-3 pt-2">
            <PulseBar className="h-3 w-full" />
            <PulseBar className="h-3 w-5/6" />
            <PulseBar className="h-3 w-4/5" />
          </div>
        </div>

        <div className="bg-white/80 border border-slate-100 rounded-2xl p-5 sm:p-6 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <PulseBar className="w-9 h-9 rounded-xl" />
            <PulseBar className="h-4 w-24" />
          </div>
          <div className="flex flex-col gap-3 pt-2">
            <PulseBar className="h-3 w-full" />
            <PulseBar className="h-3 w-11/12" />
            <PulseBar className="h-3 w-3/4" />
          </div>
        </div>
      </div>

      {/* Bottom: Recommendations Skeleton */}
      <div className="bg-white/80 border border-slate-100 rounded-2xl p-5 sm:p-6 flex flex-col gap-4">
        <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
          <PulseBar className="w-8 h-8 rounded-xl" />
          <div className="flex flex-col gap-1">
            <PulseBar className="h-4 w-32" />
            <PulseBar className="h-2.5 w-40" />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="p-4 bg-slate-50/50 rounded-xl flex items-center gap-4">
              <PulseBar className="w-10 h-10 rounded-xl shrink-0" />
              <div className="flex flex-col gap-2 flex-1">
                <PulseBar className="h-3 w-11/12" />
                <PulseBar className="h-3 w-4/5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InsightsLoadingScreen;
