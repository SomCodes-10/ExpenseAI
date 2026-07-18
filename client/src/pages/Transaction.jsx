import apiClient from '@/lib/axios';
import React from 'react';
import { useState } from 'react';
import { success } from 'zod';
/* ═══════════════════════════════════════════════════════════════
   TRANSACTION PAGE  — UI only, no logic
   ═══════════════════════════════════════════════════════════════ */
const Transaction = () => {

  const [transactionData, setTransactionData] = useState([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchTransactions = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.get('/transactions')
      if(response.data?.success && response.data?.data){
        setTransactionData(response.data.data)
      }
    } catch (error) {
       console.error("Error fetching stats:", error);
      setError(error.response?.data?.message || "Failed to load transaction data");
    }finally{
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchTransactions();
  }, [])


  
  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        fontFamily: 'Inter, system-ui, sans-serif',
        background: 'linear-gradient(135deg, #EFF6FF 0%, #F8FAFC 55%, #F0FDFF 100%)',
      }}
    >
      {/* ── Google Font ── */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');`}</style>

      {/* ── Decorative background blobs ── */}
      <div aria-hidden="true" style={{ position: 'absolute', top: '-180px', left: '-140px', width: '560px', height: '560px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(56,189,248,0.07) 0%, transparent 70%)', filter: 'blur(56px)', pointerEvents: 'none' }} />
      <div aria-hidden="true" style={{ position: 'absolute', bottom: '-200px', right: '-160px', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(103,232,249,0.06) 0%, transparent 70%)', filter: 'blur(64px)', pointerEvents: 'none' }} />
      <div aria-hidden="true" style={{ position: 'absolute', top: '35%', right: '6%', width: '320px', height: '320px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(167,210,255,0.08) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />

      <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 sm:py-10 lg:px-10">

        {/* ════════════════════ PAGE HEADER ════════════════════ */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

          {/* Left: Badge + Title + Subtitle */}
          <div className="flex flex-col gap-1">
            <span
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-600 bg-sky-50 border border-sky-100 rounded-full px-3 py-1 tracking-wide w-fit"
              style={{ boxShadow: '0 1px 3px rgba(14,165,233,0.10)' }}
            >
              <svg className="w-3 h-3 shrink-0" viewBox="0 0 12 12" fill="currentColor">
                <circle cx="6" cy="6" r="4" opacity="0.4" />
                <circle cx="6" cy="6" r="2" />
              </svg>
              SpendWise AI
            </span>
            <h1 className="text-xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-tight">
              All Transactions
            </h1>
            <p className="text-slate-400 text-xs sm:text-[15px] leading-snug">
              Browse, search and filter your complete transaction history.
            </p>
          </div>

          {/* Right: Income / Expense summary pills */}
          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <div
              className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-emerald-100 rounded-xl px-4 py-2.5"
              style={{ boxShadow: '0 1px 4px rgba(16,185,129,0.10)' }}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide leading-none mb-0.5">Income</p>
                <p className="text-sm font-bold text-emerald-600">+₹0</p>
              </div>
            </div>
            <div
              className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-rose-100 rounded-xl px-4 py-2.5"
              style={{ boxShadow: '0 1px 4px rgba(244,63,94,0.08)' }}
            >
              <span className="w-2 h-2 rounded-full bg-rose-400 shrink-0" />
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide leading-none mb-0.5">Expense</p>
                <p className="text-sm font-bold text-rose-500">-₹0</p>
              </div>
            </div>
          </div>

        </div>

        {/* ════════════════════ FILTER PANEL ════════════════════ */}
        <div
          className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-100 p-4 sm:p-6 mb-5 sm:mb-7"
          style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(14,165,233,0.06)' }}
        >

          {/* ── Row 1: Search + Date Range ── */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5">

            {/* Search input */}
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-slate-400" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="8.5" cy="8.5" r="5.5" />
                  <line x1="13" y1="13" x2="18" y2="18" />
                </svg>
              </span>
              <input
                id="txn-search"
                type="text"
                placeholder="Search by description or category…"
                className="w-full pl-10 pr-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 bg-slate-50 border border-slate-200 rounded-xl outline-none transition-all duration-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 focus:bg-white"
              />
            </div>

            {/* Date: From */}
            <div className="relative">
              <label htmlFor="txn-date-from" className="absolute -top-2 left-3 text-[10px] font-semibold text-slate-400 bg-white px-1 rounded">From</label>
              <input
                id="txn-date-from"
                type="date"
                className="pl-3 pr-3 py-2.5 text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-xl outline-none transition-all duration-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 focus:bg-white"
              />
            </div>

            {/* Date: To */}
            <div className="relative">
              <label htmlFor="txn-date-to" className="absolute -top-2 left-3 text-[10px] font-semibold text-slate-400 bg-white px-1 rounded">To</label>
              <input
                id="txn-date-to"
                type="date"
                className="pl-3 pr-3 py-2.5 text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-xl outline-none transition-all duration-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 focus:bg-white"
              />
            </div>

          </div>

          {/* ── Row 2: Type Toggle ── */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-semibold text-slate-500 mr-1 shrink-0">Type:</span>

            {/* All — active state shown as example */}
            <button id="txn-type-all" className="px-4 py-1.5 rounded-lg text-xs font-semibold capitalize border bg-sky-500 text-white border-sky-500 shadow-sm transition-all duration-200">
              All
            </button>
            <button id="txn-type-income" className="px-4 py-1.5 rounded-lg text-xs font-semibold capitalize border bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all duration-200">
              Income
            </button>
            <button id="txn-type-expense" className="px-4 py-1.5 rounded-lg text-xs font-semibold capitalize border bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all duration-200">
              Expense
            </button>
          </div>

          {/* ── Row 3: Category Multi-Select Chips ── */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-semibold text-slate-500">
                Category <span className="text-slate-400 font-normal">(select multiple)</span>
              </span>
            </div>

            {/* Expense categories */}
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Expense</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {/* Selected chip example */}
              <button id="cat-chip-food-dining" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border bg-sky-500 text-white border-sky-500 shadow-sm scale-[1.03] transition-all duration-200">
                <span className="text-sm leading-none">🍽️</span> Food &amp; Dining
              </button>
              <button id="cat-chip-groceries" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border bg-white text-slate-600 border-slate-200 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-600 transition-all duration-200">
                <span className="text-sm leading-none">🛒</span> Groceries
              </button>
              <button id="cat-chip-transportation" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border bg-white text-slate-600 border-slate-200 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-600 transition-all duration-200">
                <span className="text-sm leading-none">🚗</span> Transportation
              </button>
              <button id="cat-chip-shopping" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border bg-white text-slate-600 border-slate-200 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-600 transition-all duration-200">
                <span className="text-sm leading-none">🛍️</span> Shopping
              </button>
              <button id="cat-chip-bills-utilities" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border bg-white text-slate-600 border-slate-200 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-600 transition-all duration-200">
                <span className="text-sm leading-none">💡</span> Bills &amp; Utilities
              </button>
              <button id="cat-chip-entertainment" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border bg-white text-slate-600 border-slate-200 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-600 transition-all duration-200">
                <span className="text-sm leading-none">🎬</span> Entertainment
              </button>
              <button id="cat-chip-healthcare" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border bg-white text-slate-600 border-slate-200 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-600 transition-all duration-200">
                <span className="text-sm leading-none">🏥</span> Healthcare
              </button>
              <button id="cat-chip-education" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border bg-white text-slate-600 border-slate-200 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-600 transition-all duration-200">
                <span className="text-sm leading-none">📚</span> Education
              </button>
              <button id="cat-chip-travel" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border bg-white text-slate-600 border-slate-200 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-600 transition-all duration-200">
                <span className="text-sm leading-none">✈️</span> Travel
              </button>
              <button id="cat-chip-investments-exp" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border bg-white text-slate-600 border-slate-200 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-600 transition-all duration-200">
                <span className="text-sm leading-none">📈</span> Investments
              </button>
              <button id="cat-chip-emi-loans" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border bg-white text-slate-600 border-slate-200 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-600 transition-all duration-200">
                <span className="text-sm leading-none">🏦</span> EMI / Loans
              </button>
            </div>

            {/* Income categories */}
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Income</p>
            <div className="flex flex-wrap gap-2">
              <button id="cat-chip-salary" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border bg-white text-slate-600 border-slate-200 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-600 transition-all duration-200">
                <span className="text-sm leading-none">💼</span> Salary
              </button>
              <button id="cat-chip-freelancing" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border bg-white text-slate-600 border-slate-200 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-600 transition-all duration-200">
                <span className="text-sm leading-none">💻</span> Freelancing
              </button>
              <button id="cat-chip-investments-inc" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border bg-white text-slate-600 border-slate-200 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-600 transition-all duration-200">
                <span className="text-sm leading-none">📈</span> Investments
              </button>
              <button id="cat-chip-bonus" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border bg-white text-slate-600 border-slate-200 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-600 transition-all duration-200">
                <span className="text-sm leading-none">🎁</span> Bonus
              </button>
              <button id="cat-chip-gift" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border bg-white text-slate-600 border-slate-200 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-600 transition-all duration-200">
                <span className="text-sm leading-none">🎀</span> Gift
              </button>
              <button id="cat-chip-other" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border bg-white text-slate-600 border-slate-200 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-600 transition-all duration-200">
                <span className="text-sm leading-none">📂</span> Other
              </button>
            </div>

          </div>
        </div>

        {/* ════════════════════ TRANSACTION TABLE ════════════════════ */}
        <div
          className="bg-white rounded-2xl border border-slate-100 overflow-hidden"
          style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(14,165,233,0.06)' }}
        >

          {/* Table header */}
          <div className="px-4 sm:px-6 py-4 border-b border-slate-50 flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-slate-700">
              Transactions
              <span className="ml-2 text-xs font-normal text-slate-400">— records</span>
            </h2>
            <div className="flex items-center gap-2">
              <button id="txn-sort-btn" className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-500 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors duration-200">
                <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="2" y1="4" x2="14" y2="4" />
                  <line x1="4" y1="8" x2="12" y2="8" />
                  <line x1="6" y1="12" x2="10" y2="12" />
                </svg>
                Sort
              </button>
              <button id="txn-export-btn" className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-sky-600 bg-sky-50 border border-sky-100 rounded-lg hover:bg-sky-100 transition-colors duration-200">
                <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 2v8M5 7l3 3 3-3" />
                  <rect x="2" y="11" width="12" height="3" rx="1" />
                </svg>
                Export
              </button>
            </div>
          </div>

          {/* ── Empty state (shown when no data; swap with rows when you have data) ── */}
          <div className="flex flex-col items-center justify-center gap-3 py-16 px-6">
            <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
              <svg className="w-7 h-7 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="5" width="20" height="14" rx="3" />
                <path d="M2 10h20" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-500">No transactions found</p>
              <p className="text-xs text-slate-400 mt-0.5">Try adjusting your filters or search query.</p>
            </div>
          </div>

          {/*
            ── Transaction rows (render this div instead of empty state when data exists) ──

            <div className="divide-y divide-slate-50">
              <div className="px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors duration-150">

                // Left: icon + details
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-base shrink-0 shadow-sm bg-rose-50 text-rose-500 border border-rose-100">
                    🍽️
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-700 truncate">Food & Dining</p>
                    <p className="text-xs text-slate-400 truncate">Dinner at restaurant</p>
                    <p className="text-xs text-slate-400 mt-0.5">14 Jul 2026</p>
                  </div>
                </div>

                // Right: amount + badge
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-sm font-bold text-rose-500">-₹1,240</span>
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md uppercase tracking-wide bg-rose-50 text-rose-500">expense</span>
                </div>

              </div>
            </div>
          */}

          {/* Footer: pagination */}
          <div className="px-4 sm:px-6 py-3.5 border-t border-slate-50 flex items-center justify-between gap-3 bg-slate-50/40">
            <p className="text-xs text-slate-400">Showing 0 of 0 transactions</p>
            <div className="flex items-center gap-1.5">
              <button id="txn-prev-page" className="px-2.5 py-1.5 text-xs font-semibold text-slate-400 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-40 transition-colors" disabled>← Prev</button>
              <span className="px-2.5 py-1.5 text-xs font-semibold text-sky-600 bg-sky-50 border border-sky-100 rounded-lg">1</span>
              <button id="txn-next-page" className="px-2.5 py-1.5 text-xs font-semibold text-slate-400 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-40 transition-colors" disabled>Next →</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Transaction;
