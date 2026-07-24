import React, { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '@/lib/axios';
import HealthScoreGauge    from '../components/insights/HealthScoreGauge';
import MonthlySummaryCard  from '../components/insights/MonthlySummaryCard';
import InsightCard         from '../components/insights/InsightCard';
import SuggestionCard      from '../components/insights/SuggestionCard';
import GenerateReportButton from '../components/insights/GenerateReportButton';
import InsightsLoadingScreen from '../components/insights/InsightsLoadingScreen';

/* ─── Helpers ─────────────────────────────────────────────────────────────── */

/** Returns "YYYY-MM" for the current calendar month. */
const getCurrentMonth = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

/** "2025-07" → "July 2025" */
const formatMonthLabel = (yyyyMM) => {
  if (!yyyyMM) return '';
  const [y, m] = yyyyMM.split('-');
  return new Date(Number(y), Number(m) - 1, 1)
    .toLocaleString('en-US', { month: 'long', year: 'numeric' });
};

/**
 * ISO timestamp → human-readable "24 Jul 2025, 8:30 PM".
 */
const formatTimestamp = (iso) => {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString('en-US', {
      day:    '2-digit',
      month:  'short',
      year:   'numeric',
      hour:   '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return '—';
  }
};

/* ─── Icon definitions ────────────────────────────────────────────────────── */

const REC_ICONS = [
  <svg key="chart" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
  <svg key="shield" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
  <svg key="card"  className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>,
  <svg key="bulb"  className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
  <svg key="wallet" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>,
];

const StrengthIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
);

const ConcernIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const RecommendationIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

/* ─── Empty / Initial state ───────────────────────────────────────────────── */
const EmptyState = ({ month, onGenerate, isLoading }) => (
  <div
    className="bg-white/80 backdrop-blur-sm border border-slate-100 rounded-2xl p-10 sm:p-16 flex flex-col items-center gap-5 text-center"
    style={{ boxShadow: '0 2px 12px rgba(14,165,233,0.06)' }}
    role="region"
    aria-label="No report generated yet"
  >
    <div
      className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-50 to-indigo-50 border border-sky-100 flex items-center justify-center"
      aria-hidden="true"
    >
      <svg className="w-7 h-7 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    </div>
    <div>
      <h3 className="text-lg font-bold text-slate-800 mb-1">
        Generate Report for {formatMonthLabel(month)}
      </h3>
      <p className="text-sm text-slate-400 max-w-sm">
        Generate your AI-powered financial health report to see your score, strengths, concerns, and personalised recommendations.
      </p>
    </div>
    <GenerateReportButton
      id="empty-state-generate-btn"
      isLoading={isLoading}
      disabled={false}
      label="Generate My Report"
      onClick={onGenerate}
    />
  </div>
);

/* ─── No Transactions State ─────────────────────────────────────────────────── */
const NoTransactionsState = ({ monthLabel, onAddTransaction }) => (
  <div
    className="bg-white/80 backdrop-blur-sm border border-slate-100 rounded-2xl p-10 sm:p-16 flex flex-col items-center gap-5 text-center"
    style={{ boxShadow: '0 2px 12px rgba(14,165,233,0.06)' }}
    role="region"
    aria-label="No transactions available for this month"
  >
    <div
      className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500"
      aria-hidden="true"
    >
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    </div>
    <div className="max-w-md">
      <h3 className="text-lg font-bold text-slate-800 mb-1.5">
        No transactions in {monthLabel}
      </h3>
      <p className="text-sm text-slate-500 leading-relaxed">
        AI Insights requires transaction data to evaluate your spending patterns, financial health score, and risk level. Add transactions for this month to generate a report.
      </p>
    </div>
    <button
      type="button"
      onClick={onAddTransaction}
      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
      style={{
        background: 'linear-gradient(135deg, #0EA5E9 0%, #6366F1 100%)',
        boxShadow: '0 4px 16px rgba(14,165,233,0.40)',
      }}
    >
      <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
      <span>Add your first transaction</span>
    </button>
  </div>
);

/* ─── Error State ─────────────────────────────────────────────────────────── */
const ErrorState = ({ message, onRetry }) => (
  <div
    className="bg-white/80 backdrop-blur-sm border border-rose-100 rounded-2xl p-8 sm:p-10 flex flex-col items-center gap-4 text-center max-w-lg mx-auto"
    style={{ boxShadow: '0 4px 24px rgba(244,63,94,0.06)' }}
    role="alert"
  >
    <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500" aria-hidden="true">
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    </div>
    <div>
      <h3 className="font-bold text-slate-800 text-base mb-1">AI Service Temporarily Unavailable</h3>
      <p className="text-xs sm:text-sm text-slate-500 max-w-xs leading-relaxed">{message}</p>
    </div>
    <button
      type="button"
      onClick={onRetry}
      className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white rounded-xl shadow-md transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
      style={{
        background: 'linear-gradient(135deg, #0EA5E9 0%, #6366F1 100%)',
        boxShadow: '0 4px 14px rgba(14,165,233,0.30)',
      }}
    >
      <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
      <span>Retry Request</span>
    </button>
  </div>
);

/* ═══════════════════════════════════════════════════════════════════════════
   INSIGHTS PAGE
   ═══════════════════════════════════════════════════════════════════════════ */
const Insights = () => {
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth);
  const [report, setReport] = useState(null);
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'error'
  const [error, setError] = useState(null);
  const [noTransactions, setNoTransactions] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [lastAttemptedForce, setLastAttemptedForce] = useState(false);

  // Abort controller so in-flight requests can be cancelled when month changes.
  const abortRef = useRef(null);

  /* ── Core API call ──────────────────────────────────────────────────────── */
  const fetchReport = useCallback(async (force = false) => {
    // Cancel any previous request still in flight.
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setStatus('loading');
    setError(null);
    setNoTransactions(false);
    setLastAttemptedForce(force);

    try {
      const url = force ? '/ai/report?force=true' : '/ai/report';
      const res = await apiClient.post(
        url,
        { month: selectedMonth },
        { signal: abortRef.current.signal },
      );

      if (res.data?.success) {
        if (res.data?.code === 'NO_TRANSACTIONS' || !res.data?.data) {
          setReport(null);
          setNoTransactions(true);
        } else {
          setReport(res.data.data);
          setNoTransactions(false);
        }
        setStatus('idle');
      }
    } catch (err) {
      if (err.name === 'CanceledError' || err.name === 'AbortError') return;
      const msg = err.response?.data?.message || 'AI Insights service is temporarily unavailable. Please try again.';
      setError(msg);
      setStatus('error');
    } finally {
      setHasFetched(true);
    }
  }, [selectedMonth]);

  const handleGenerate = useCallback(() => fetchReport(false), [fetchReport]);
  const handleRegenerate = useCallback(() => fetchReport(true), [fetchReport]);
  const handleRetry = useCallback(() => fetchReport(lastAttemptedForce), [fetchReport, lastAttemptedForce]);

  const handleMonthChange = useCallback((e) => {
    abortRef.current?.abort();
    setSelectedMonth(e.target.value);
    setReport(null);
    setNoTransactions(false);
    setHasFetched(false);
    setStatus('idle');
    setError(null);
  }, []);

  const handleAddTransaction = useCallback(() => {
    navigate('/transaction');
  }, [navigate]);

  const isLoading = status === 'loading';

  /* ── Derived display values ────────────────────────────────────────────── */
  const score           = report?.aiHealthScore ?? 0;
  const summary         = report?.summary        ?? '';
  const riskLevel       = report?.riskLevel      ?? 'Low';
  const strengths       = report?.strengths      ?? [];
  const concerns        = report?.concerns       ?? [];
  const recommendations = report?.recommendations ?? [];
  const lastGenerated   = formatTimestamp(report?.updatedAt);
  const monthLabel      = formatMonthLabel(selectedMonth);

  const maxMonth = getCurrentMonth();

  /* ── Render ─────────────────────────────────────────────────────────────── */
  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        fontFamily: 'Inter, system-ui, sans-serif',
        background: 'linear-gradient(135deg, #EFF6FF 0%, #F8FAFC 55%, #F0FDFF 100%)',
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');`}</style>

      {/* Decorative blobs */}
      <div aria-hidden="true" style={{ position: 'absolute', top: '-180px', left: '-140px', width: '560px', height: '560px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(56,189,248,0.07) 0%, transparent 70%)', filter: 'blur(56px)', pointerEvents: 'none' }} />
      <div aria-hidden="true" style={{ position: 'absolute', bottom: '-200px', right: '-160px', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(103,232,249,0.06) 0%, transparent 70%)', filter: 'blur(64px)', pointerEvents: 'none' }} />
      <div aria-hidden="true" style={{ position: 'absolute', top: '35%', right: '6%', width: '320px', height: '320px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(167,210,255,0.08) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />

      <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 sm:py-10 lg:px-10 relative z-10">

        {/* PAGE HEADER */}
        <div className="mb-8 sm:mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-600 bg-sky-50 border border-sky-100 rounded-full px-3 py-1 tracking-wide w-fit"
              style={{ boxShadow: '0 1px 3px rgba(14,165,233,0.10)' }}
              aria-hidden="true"
            >
              <svg className="w-3 h-3 shrink-0" viewBox="0 0 12 12" fill="currentColor">
                <circle cx="6" cy="6" r="4" opacity="0.4" />
                <circle cx="6" cy="6" r="2" />
              </svg>
              SpendWise AI
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-tight">
              AI Insights
            </h1>
            <p className="text-slate-400 text-xs sm:text-[15px] leading-snug hidden sm:block">
              Your personalised financial health report powered by Gemini.
            </p>
          </div>

          {/* Month picker */}
          <label
            className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl px-3 py-2 cursor-pointer self-start sm:self-auto hover:border-sky-300 transition-colors duration-150"
            style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
            htmlFor="insights-month-picker"
          >
            <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8"  y1="2" x2="8"  y2="6" />
              <line x1="3"  y1="10" x2="21" y2="10" />
            </svg>
            <input
              id="insights-month-picker"
              type="month"
              value={selectedMonth}
              min="2024-01"
              max={maxMonth}
              onChange={handleMonthChange}
              disabled={isLoading}
              className="text-sm font-semibold text-slate-700 bg-transparent border-none outline-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Select month for AI report"
            />
          </label>
        </div>

        {/* LOADING SCREEN */}
        {isLoading && <InsightsLoadingScreen />}

        {/* ERROR STATE */}
        {!isLoading && status === 'error' && (
          <ErrorState message={error} onRetry={handleRetry} />
        )}

        {/* NO TRANSACTIONS STATE */}
        {!isLoading && status !== 'error' && noTransactions && (
          <NoTransactionsState monthLabel={monthLabel} onAddTransaction={handleAddTransaction} />
        )}

        {/* INITIAL / UNFETCHED EMPTY STATE */}
        {!isLoading && status !== 'error' && !report && !noTransactions && (
          <EmptyState
            month={selectedMonth}
            onGenerate={handleGenerate}
            isLoading={isLoading}
          />
        )}

        {/* REPORT VIEW */}
        {!isLoading && report && (
          <div className="animate-[insightFadeIn_0.4s_ease_both]">
            {/* TOP — Health Score Gauge · Monthly Summary · Regenerate Button */}
            <section className="mb-6 sm:mb-8" aria-label="Financial health overview">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">

                {/* Gauge card */}
                <div
                  className="bg-white/80 backdrop-blur-sm border border-slate-100 rounded-2xl p-6 flex flex-col items-center justify-center gap-4"
                  style={{ boxShadow: '0 2px 12px rgba(14,165,233,0.06), 0 1px 3px rgba(0,0,0,0.04)' }}
                >
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                    Financial Health Score
                  </p>
                  <HealthScoreGauge score={score} size={160} />
                  <p className="text-xs text-slate-400 text-center max-w-[180px] leading-snug">
                    Based on your income, savings rate, and spending patterns.
                  </p>
                </div>

                {/* Summary + action */}
                <div className="lg:col-span-2 flex flex-col gap-4">
                  <MonthlySummaryCard
                    month={monthLabel}
                    summary={summary}
                    lastGenerated={lastGenerated}
                    riskLevel={riskLevel}
                  />

                  {/* Regenerate action row */}
                  <div
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white/60 backdrop-blur-sm border border-slate-100 rounded-2xl px-5 py-4"
                    style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-700">Want a fresh analysis?</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Re-run Gemini with your latest transactions for this month.
                      </p>
                    </div>
                    <GenerateReportButton
                      id="regenerate-report-btn"
                      isLoading={isLoading}
                      disabled={false}
                      label="Regenerate Report"
                      onClick={handleRegenerate}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* MIDDLE — Strengths & Concerns */}
            <section className="mb-6 sm:mb-8" aria-label="Strengths and concerns">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                <InsightCard
                  title="Strengths"
                  accent="emerald"
                  icon={<StrengthIcon />}
                  items={strengths}
                />
                <InsightCard
                  title="Concerns"
                  accent="rose"
                  icon={<ConcernIcon />}
                  items={concerns}
                />
              </div>
            </section>

            {/* BOTTOM — Recommendations */}
            <section aria-label="Personalised recommendations">
              <div
                className="bg-white/80 backdrop-blur-sm border border-slate-100 rounded-2xl overflow-hidden"
                style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
              >
                {/* Header */}
                <div className="px-5 sm:px-6 py-4 border-b border-slate-50 flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-50 to-indigo-50 border border-sky-100 flex items-center justify-center text-sky-500 shrink-0"
                    aria-hidden="true"
                  >
                    <RecommendationIcon />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-800">Recommendations</h2>
                    <p className="text-[11px] text-slate-400 font-medium">
                      {recommendations.length} personalised action{recommendations.length !== 1 ? 's' : ''} for {monthLabel}
                    </p>
                  </div>
                </div>

                {/* List */}
                <div className="p-4 sm:p-5 flex flex-col gap-3">
                  {recommendations.length === 0 ? (
                    <p className="text-sm text-slate-400 italic py-6 text-center">
                      No recommendations available for this month.
                    </p>
                  ) : (
                    recommendations.map((text, i) => (
                      <SuggestionCard
                        key={i}
                        index={i}
                        icon={REC_ICONS[i % REC_ICONS.length]}
                        text={text}
                      />
                    ))
                  )}
                </div>
              </div>
            </section>

            <div className="h-10" aria-hidden="true" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Insights;
