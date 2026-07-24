import React, { useState, useEffect, useRef } from 'react';

/**
 * HealthScoreGauge
 * Circular SVG gauge displaying a financial health score.
 *
 * Props:
 *   score  — number 0–100
 *   size   — number px (default 160)
 *
 * Animation: arc animates from 0 → score on first mount using a RAF-based
 * approach so the CSS transition is always visible regardless of when the
 * parent renders the component.
 */
const HealthScoreGauge = ({ score = 0, size = 160 }) => {
  const r           = 54;
  const cx          = size / 2;
  const cy          = size / 2;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * r;   // ≈ 339.3

  const clampedScore = Math.max(0, Math.min(100, Number(score) || 0));

  // Start at 0, animate to real score after mount so the CSS transition fires.
  const [displayScore, setDisplayScore] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    // Allow the browser to paint the 0-state first, then trigger the transition.
    rafRef.current = requestAnimationFrame(() => {
      setDisplayScore(clampedScore);
    });
    return () => cancelAnimationFrame(rafRef.current);
  }, [clampedScore]);

  const progress   = (displayScore / 100) * circumference;
  const dashOffset = circumference - progress;

  // Color rules
  let color, labelColor, badge;
  if (clampedScore < 40) {
    color      = '#f43f5e';
    labelColor = 'text-rose-500';
    badge      = { text: 'Needs Work', cls: 'bg-rose-100 text-rose-600 border-rose-200' };
  } else if (clampedScore < 70) {
    color      = '#f59e0b';
    labelColor = 'text-amber-500';
    badge      = { text: 'Fair', cls: 'bg-amber-100 text-amber-600 border-amber-200' };
  } else {
    color      = '#10b981';
    labelColor = 'text-emerald-500';
    badge      = { text: 'Healthy', cls: 'bg-emerald-100 text-emerald-600 border-emerald-200' };
  }

  return (
    <div className="flex flex-col items-center gap-3" role="img" aria-label={`Financial health score: ${clampedScore} out of 100`}>
      {/* Gauge SVG */}
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
          {/* Track ring */}
          <circle
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth={strokeWidth}
          />
          {/* Animated progress arc */}
          <circle
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            transform={`rotate(-90 ${cx} ${cy})`}
            style={{
              transition: 'stroke-dashoffset 0.9s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.4s ease',
            }}
          />
        </svg>

        {/* Score label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center" aria-hidden="true">
          <span className={`text-3xl font-bold tabular-nums ${labelColor}`}>
            {clampedScore}
          </span>
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
            / 100
          </span>
        </div>
      </div>

      {/* Status badge */}
      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold border rounded-full px-3 py-1 ${badge.cls}`}>
        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} aria-hidden="true" />
        {badge.text}
      </span>
    </div>
  );
};

export default HealthScoreGauge;
