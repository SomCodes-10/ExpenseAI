import apiClient from '@/lib/axios';
import React from 'react';
import { useState, useEffect } from 'react';
import TransactionRow from './TransactionRow';
import AddTransactionModel from '../components/AddTransactionModel';
import { useSearchParams } from "react-router-dom";

/* ═══════════════════════════════════════════════════════════════
   TRANSACTION PAGE
   ═══════════════════════════════════════════════════════════════ */
const Transaction = () => {

  const [transactionData, setTransactionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [type, setType] = useState("All");
  const [category, setCategory] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  /* -- Fetch transactions from API -- */
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const query = searchParams.toString();
      const response = await apiClient.get('/transactions' + (query ? `?${query}` : ''));
      if (response.data?.success && response.data?.data) {
        setTransactionData(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError(err.response?.data?.message || "Failed to load transaction data");
    } finally {
      setLoading(false);
    }
  };

  /* -- Initialise state from URL on mount -- */
  useEffect(() => {
    const selectedType = searchParams.get("type");
    const selectedCategories = searchParams.get("categories");
    const selectedSearch = searchParams.get("search");
    const selectedFrom = searchParams.get("dateFrom");
    const selectedTo = searchParams.get("dateTo");

    if (selectedType) setType(selectedType);
    if (selectedCategories) setCategory(selectedCategories.split(","));
    if (selectedSearch) setSearchQuery(selectedSearch);
    if (selectedFrom) setDateFrom(selectedFrom);
    if (selectedTo) setDateTo(selectedTo);
    setIsInitialized(true);
  }, []);

  /* -- Sync state to URL params whenever filters change -- */
  useEffect(() => {
    if (!isInitialized) return;
    const params = {};
    if (type !== "All") params.type = type;
    if (category.length > 0) params.categories = category.join(',');
    if (searchQuery) params.search = searchQuery;
    if (dateFrom) params.dateFrom = dateFrom;
    if (dateTo) params.dateTo = dateTo;
    setSearchParams(params);
  }, [type, category, searchQuery, dateFrom, dateTo, isInitialized]);

  /* -- Re-fetch when URL params change -- */
  useEffect(() => {
    fetchTransactions();
  }, [searchParams]);

  /* -- Category toggle -- */
  const handleCategory = (cat) => {
    setCategory(prev =>
      prev.includes(cat) ? prev.filter(item => item !== cat) : [...prev, cat]
    );
  };

  /* -- Clear all filters -- */
  const clearAllFilters = () => {
    setType("All");
    setCategory([]);
    setSearchQuery("");
    setDateFrom("");
    setDateTo("");
  };

  /* -- Date group label -- */
  const getDateLabel = (date) => {
    const today = new Date();
    const txnDate = new Date(date);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (today.toDateString() === txnDate.toDateString()) return "Today";
    if (yesterday.toDateString() === txnDate.toDateString()) return "Yesterday";
    return txnDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  /* -- Client-side filter -- */
  const filteredData = transactionData.filter((t) => {
    const matchesType = type === "All" || t.type === type;
    const matchesCategory = category.length === 0 || category.includes(t.category);
    const desc = (t.description ?? '').toLowerCase();
    const cat = (t.category ?? '').toLowerCase();
    const q = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery || desc.includes(q) || cat.includes(q);

    let matchesDate = true;
    if (dateFrom || dateTo) {
      const txnTime = new Date(t.date).getTime();
      if (dateFrom) matchesDate = matchesDate && txnTime >= new Date(dateFrom).getTime();
      if (dateTo) {
        const toEnd = new Date(dateTo);
        toEnd.setHours(23, 59, 59, 999);
        matchesDate = matchesDate && txnTime <= toEnd.getTime();
      }
    }

    return matchesType && matchesCategory && matchesSearch && matchesDate;
  });

  /* -- Group filtered data by date -- */
  const groupedTransactions = filteredData.reduce((acc, transaction) => {
    const label = getDateLabel(transaction.date);
    if (!acc[label]) acc[label] = [];
    acc[label].push(transaction);
    return acc;
  }, {});

  /* -- Summary totals from filtered data -- */
  const totalIncome = filteredData
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);
  const totalExpense = filteredData
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const hasActiveFilters =
    type !== "All" || category.length > 0 || searchQuery || dateFrom || dateTo;

  const EXPENSE_CATEGORIES = [
    { key: "Food & Dining", emoji: "🍽️" },
    { key: "Groceries", emoji: "🛒" },
    { key: "Transportation", emoji: "🚗" },
    { key: "Shopping", emoji: "🛍️" },
    { key: "Bills & Utilities", emoji: "💡" },
    { key: "Entertainment", emoji: "🎬" },
    { key: "Healthcare", emoji: "🏥" },
    { key: "Travel", emoji: "✈️" },
    { key: "Investments", emoji: "📈" },
    { key: "EMI / Loans", emoji: "🏦" },
  ];

  const INCOME_CATEGORIES = [
    { key: "Salary", emoji: "💼" },
    { key: "Freelancing", emoji: "💻" },
    { key: "ROI", emoji: "📈" },
    { key: "Bonus", emoji: "🎁" },
    { key: "Gift", emoji: "🎀" },
    { key: "Other", emoji: "📂" },
  ];

  const chipClass = (active) =>
    `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 ${
      active
        ? "bg-sky-50 text-sky-600 border-sky-300"
        : "bg-white text-slate-600 border-slate-200 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-600"
    }`;

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        fontFamily: 'Inter, system-ui, sans-serif',
        background: 'linear-gradient(135deg, #EFF6FF 0%, #F8FAFC 55%, #F0FDFF 100%)',
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');`}</style>

      <div aria-hidden="true" style={{ position: 'absolute', top: '-180px', left: '-140px', width: '560px', height: '560px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(56,189,248,0.07) 0%, transparent 70%)', filter: 'blur(56px)', pointerEvents: 'none' }} />
      <div aria-hidden="true" style={{ position: 'absolute', bottom: '-200px', right: '-160px', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(103,232,249,0.06) 0%, transparent 70%)', filter: 'blur(64px)', pointerEvents: 'none' }} />
      <div aria-hidden="true" style={{ position: 'absolute', top: '35%', right: '6%', width: '320px', height: '320px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(167,210,255,0.08) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />

      <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 sm:py-10 lg:px-10">

        {/* PAGE HEADER */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-tight">
              All Transactions
            </h1>
            <p className="text-slate-400 text-xs sm:text-[15px] leading-snug hidden sm:block">
              Browse, search and filter your complete transaction history.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <div
              className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-emerald-100 rounded-xl px-4 py-2.5"
              style={{ boxShadow: '0 1px 4px rgba(16,185,129,0.10)' }}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide leading-none mb-0.5">Income</p>
                <p className="text-sm font-bold text-emerald-600">+₹{totalIncome.toLocaleString('en-IN')}</p>
              </div>
            </div>
            <div
              className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-rose-100 rounded-xl px-4 py-2.5"
              style={{ boxShadow: '0 1px 4px rgba(244,63,94,0.08)' }}
            >
              <span className="w-2 h-2 rounded-full bg-rose-400 shrink-0" />
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide leading-none mb-0.5">Expense</p>
                <p className="text-sm font-bold text-rose-500">-₹{totalExpense.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* FILTER PANEL */}
        <div
          className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-100 p-4 sm:p-6 mb-5 sm:mb-7"
          style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(14,165,233,0.06)' }}
        >
          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <span className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-slate-400" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="8.5" cy="8.5" r="5.5" />
                  <line x1="13" y1="13" x2="18" y2="18" />
                </svg>
              </span>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                id="txn-search"
                type="text"
                placeholder="Search by description or category…"
                className="w-full pl-10 pr-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 bg-slate-50 border border-slate-200 rounded-xl outline-none transition-all duration-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 focus:bg-white"
              />
            </div>
          </div>

          {/* Date range */}
          <div className="mb-4">
            <p className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-sky-400" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="12" height="11" rx="2" />
                <line x1="2" y1="7" x2="14" y2="7" />
                <line x1="5" y1="1" x2="5" y2="4" />
                <line x1="11" y1="1" x2="11" y2="4" />
              </svg>
              Date Range
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 flex flex-col gap-1">
                <label htmlFor="txn-date-from" className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">From</label>
                <input
                  id="txn-date-from"
                  type="date"
                  value={dateFrom}
                  max={dateTo || undefined}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-xl outline-none transition-all duration-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 focus:bg-white cursor-pointer"
                />
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <label htmlFor="txn-date-to" className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">To</label>
                <input
                  id="txn-date-to"
                  type="date"
                  value={dateTo}
                  min={dateFrom || undefined}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-xl outline-none transition-all duration-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 focus:bg-white cursor-pointer"
                />
              </div>
              {(dateFrom || dateTo) && (
                <div className="flex sm:items-end">
                  <button
                    onClick={() => { setDateFrom(""); setDateTo(""); }}
                    className="h-[42px] px-3 py-2 text-xs font-semibold text-slate-500 bg-slate-50 border border-slate-200 rounded-xl hover:bg-rose-50 hover:text-rose-500 hover:border-rose-200 transition-all duration-200 whitespace-nowrap self-end"
                  >
                    Clear dates
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Type Toggle */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className="text-xs font-semibold text-slate-500 mr-1 shrink-0">Type:</span>
            {["All", "income", "expense"].map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                id={`txn-type-${t.toLowerCase()}`}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold capitalize border transition-all duration-200 ${
                  type === t
                    ? "bg-sky-500 text-white border-sky-500 shadow-sm"
                    : "bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                {t}
              </button>
            ))}
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="ml-auto px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-500 bg-rose-50 border border-rose-100 hover:bg-rose-100 transition-all duration-200"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Category Chips */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-semibold text-slate-500">
                Category <span className="text-slate-400 font-normal">(select multiple)</span>
              </span>
              {category.length > 0 && (
                <button
                  onClick={() => setCategory([])}
                  className="text-[10px] font-semibold text-sky-500 hover:text-sky-700 transition-colors"
                >
                  Clear ({category.length})
                </button>
              )}
            </div>

            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Expense</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {EXPENSE_CATEGORIES.map(({ key, emoji }) => (
                <button
                  key={key}
                  onClick={() => handleCategory(key)}
                  id={`cat-chip-${key.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                  className={chipClass(category.includes(key))}
                >
                  <span className="text-sm leading-none">{emoji}</span> {key}
                </button>
              ))}
            </div>

            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Income</p>
            <div className="flex flex-wrap gap-2">
              {INCOME_CATEGORIES.map(({ key, emoji }) => (
                <button
                  key={key}
                  onClick={() => handleCategory(key)}
                  id={`cat-chip-${key.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                  className={chipClass(category.includes(key))}
                >
                  <span className="text-sm leading-none">{emoji}</span> {key}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* TRANSACTION TABLE */}
        <div
          className="bg-white rounded-2xl border border-slate-100 overflow-hidden"
          style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(14,165,233,0.06)' }}
        >
          {/* Table header */}
          <div className="px-4 sm:px-6 py-4 border-b border-slate-50 flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-slate-700">
              Transactions
              <span className="ml-2 text-xs font-normal text-slate-400">
                — {loading ? '…' : `${filteredData.length} record${filteredData.length !== 1 ? 's' : ''}`}
              </span>
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

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center gap-3 py-16 px-6">
              <div className="w-8 h-8 rounded-full border-2 border-sky-200 border-t-sky-500 animate-spin" />
              <p className="text-sm text-slate-400">Loading transactions…</p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="flex flex-col items-center justify-center gap-3 py-16 px-6">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-slate-600">Something went wrong</p>
                <p className="text-xs text-slate-400 mt-0.5">{error}</p>
              </div>
              <button onClick={fetchTransactions} className="px-4 py-2 text-sm font-semibold text-white rounded-xl" style={{ background: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)' }}>
                Retry
              </button>
            </div>
          )}

          {/* Empty — no data at all */}
          {!loading && !error && transactionData.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-3 py-16 px-6">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                <svg className="w-7 h-7 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="5" width="20" height="14" rx="3" />
                  <path d="M2 10h20" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-slate-500">No transactions yet</p>
                <p className="text-xs text-slate-400 mt-0.5">Add your first transaction from the Dashboard.</p>
              </div>
            </div>
          )}

          {/* Empty — filtered but no results */}
          {!loading && !error && transactionData.length > 0 && filteredData.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-3 py-16 px-6">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                <svg className="w-7 h-7 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-slate-500">No transactions found</p>
                <p className="text-xs text-slate-400 mt-0.5">Try adjusting your filters or date range.</p>
              </div>
              <button onClick={clearAllFilters} className="px-4 py-1.5 text-xs font-semibold text-sky-600 bg-sky-50 border border-sky-100 rounded-lg hover:bg-sky-100 transition-colors">
                Clear all filters
              </button>
            </div>
          )}

          {/* Grouped list */}
          {!loading && !error && filteredData.length > 0 && (
            <div className="divide-y divide-slate-50">
              {Object.keys(groupedTransactions).map((dateLabel) => (
                <div key={dateLabel}>
                  <div className="px-4 sm:px-6 pt-4 pb-1.5 flex items-center gap-3">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{dateLabel}</span>
                    <span className="flex-1 h-px bg-slate-100" />
                    <span className="text-[10px] text-slate-300 font-medium">
                      {groupedTransactions[dateLabel].length} txn{groupedTransactions[dateLabel].length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="divide-y divide-slate-50">
                    {groupedTransactions[dateLabel].map((transaction) => (
                      <TransactionRow key={transaction._id} transaction={transaction} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="px-4 sm:px-6 py-3.5 border-t border-slate-50 flex items-center justify-between gap-3 bg-slate-50/40">
            <p className="text-xs text-slate-400">
              Showing {filteredData.length} of {transactionData.length} transactions
            </p>
            <div className="flex items-center gap-1.5">
              <button id="txn-prev-page" className="px-2.5 py-1.5 text-xs font-semibold text-slate-400 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-40 transition-colors" disabled>← Prev</button>
              <span className="px-2.5 py-1.5 text-xs font-semibold text-sky-600 bg-sky-50 border border-sky-100 rounded-lg">1</span>
              <button id="txn-next-page" className="px-2.5 py-1.5 text-xs font-semibold text-slate-400 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-40 transition-colors" disabled>Next →</button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Sticky FAB: Add Transaction ── */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 sm:hidden">
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2.5 px-6 py-3.5 text-sm font-bold text-white rounded-full shadow-2xl transition-all duration-200 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 55%, #6366F1 100%)',
            boxShadow: '0 8px 24px rgba(14,165,233,0.45), 0 2px 8px rgba(0,0,0,0.12)',
          }}
        >
          <svg className="w-5 h-5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            <line x1="8" y1="2" x2="8" y2="14" />
            <line x1="2" y1="8" x2="14" y2="8" />
          </svg>
          Add Transaction
        </button>
      </div>

      <AddTransactionModel
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchTransactions}
      />
    </div>
  );
};

export default Transaction;
