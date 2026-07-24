import React from 'react';

/**
 * SuggestionCard
 * A single actionable recommendation with icon, text, and hover animation.
 *
 * Props:
 *   icon   — JSX element
 *   text   — string
 *   index  — number (0-based, used for CSS animation stagger)
 */
const SuggestionCard = ({ icon, text = 'Recommendation text goes here.', index = 0 }) => {
  return (
    <div
      className="group flex items-start gap-4 p-4 sm:p-5 bg-white/70 backdrop-blur-sm border border-slate-100 hover:border-sky-200 rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
      style={{
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        // Staggered fade-in: defined via inline animation shorthand.
        // Uses Tailwind's built-in `animate-[fadeIn_0.4s_ease_both]`-equivalent.
        opacity: 0,
        animation: `insightFadeIn 0.4s ease ${index * 60}ms both`,
      }}
    >
      {/* Icon bubble */}
      <div
        className="w-10 h-10 rounded-xl shrink-0 bg-gradient-to-br from-sky-50 to-indigo-50 border border-sky-100 flex items-center justify-center text-sky-500 group-hover:scale-105 group-hover:shadow-sm transition-all duration-200"
        aria-hidden="true"
      >
        {icon ?? (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
      </div>

      {/* Recommendation text */}
      <p className="text-sm text-slate-600 leading-relaxed group-hover:text-slate-800 transition-colors duration-200 pt-1.5 flex-1">
        {text}
      </p>

      {/* Right arrow — revealed on hover */}
      <svg
        className="w-4 h-4 text-slate-300 group-hover:text-sky-400 shrink-0 self-center ml-2 opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-x-1 group-hover:translate-x-0"
        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </div>
  );
};

export default SuggestionCard;
