import apiClient from '@/lib/axios';
import React from 'react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import TransactionRow from './TransactionRow';
import AddTransactionModel from '../components/AddTransactionModel';
import { useSearchParams } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

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
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingTransaction, setDeletingTransaction] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  /* -- Fetch transactions from API -- */
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const query = searchParams.toString();
      const response = await apiClient.get('/transactions' + (query ? `?${query}` : ''));
      if (response.data?.success && response.data?.data) {
        setTransactionData(response.data.data);
        setCurrentPage(response.data.currentPage || 1);
        setTotalPages(response.data.totalPages || 1);
      }
    } catch (err) {
      console.error("Error fetching transactions:", err);
      const message = err.response?.data?.message || "Failed to load transactions.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await apiClient.delete(`/transactions/${deletingTransaction.id}`);
      toast.success('Transaction deleted.');
      fetchTransactions();
    } catch (error) {
      console.error("Error deleting transaction:", error);
      toast.error(error.response?.data?.message || 'Failed to delete transaction.');
    } finally {
      setIsDeleteModalOpen(false);
      setDeletingTransaction(null);
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
    const currentPage = searchParams.get("page") || 1;
    if (!isInitialized) return;
    const params = {};
    params.page = currentPage;
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
    `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 ${active
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

            {/* Add Transaction button — visible on all screen sizes */}
            <button
              id="txn-add-desktop"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-white rounded-xl transition-all duration-200 hover:-translate-y-0.5 active:scale-95 shadow-md hover:shadow-lg shrink-0"
              style={{
                background: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 55%, #6366F1 100%)',
                boxShadow: '0 4px 14px rgba(14,165,233,0.35)',
              }}
            >
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                <line x1="8" y1="2" x2="8" y2="14" />
                <line x1="2" y1="8" x2="14" y2="8" />
              </svg>
              <span className="hidden xs:inline sm:inline">Add Transaction</span>
              <span className="inline xs:hidden sm:hidden">Add</span>
            </button>
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
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold capitalize border transition-all duration-200 ${type === t
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

          {/* ── Conditional: Empty State vs Transaction List ── */}
          {!loading && !error && (
            transactionData.length > 0 ? (
              <>
                {/* ── Empty State: Case 2 — Filters active but no results ── */}
                {filteredData.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-16 px-6 select-none">

                    {/* Illustration */}
                    <div className="relative mb-7">
                      {/* Glow */}
                      <div
                        className="absolute inset-0 rounded-full blur-2xl opacity-25 scale-150"
                        style={{ background: 'radial-gradient(circle, #f59e0b 0%, #f43f5e 60%, transparent 100%)' }}
                      />

                      <div className="relative w-24 h-24 flex items-center justify-center">
                        {/* Outer ring */}
                        <div
                          className="w-20 h-20 rounded-full flex items-center justify-center"
                          style={{
                            background: 'linear-gradient(135deg, #fef3c7 0%, #fce7f3 100%)',
                            border: '2px dashed #fbbf24',
                          }}
                        >
                          {/* Inner circle */}
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center"
                            style={{
                              background: 'linear-gradient(135deg, #fef9c3 0%, #fef3c7 100%)',
                              border: '1.5px solid #fde68a',
                              boxShadow: '0 4px 12px rgba(245,158,11,0.20)',
                            }}
                          >
                            {/* Magnifier SVG */}
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="11" cy="11" r="7" />
                              <line x1="17" y1="17" x2="22" y2="22" />
                              <line x1="8" y1="11" x2="14" y2="11" strokeOpacity="0.5" />
                              <line x1="11" y1="8" x2="11" y2="14" strokeOpacity="0.5" />
                            </svg>
                          </div>
                        </div>

                        {/* X badge */}
                        <div
                          className="absolute -top-0.5 -right-0.5 w-6 h-6 rounded-full flex items-center justify-center"
                          style={{
                            background: 'linear-gradient(135deg, #f43f5e 0%, #fb923c 100%)',
                            boxShadow: '0 2px 8px rgba(244,63,94,0.35)',
                          }}
                        >
                          <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                            <line x1="3" y1="3" x2="9" y2="9" />
                            <line x1="9" y1="3" x2="3" y2="9" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Text */}
                    <div className="text-center mb-5 max-w-xs">
                      <h3 className="text-base font-bold text-slate-800 tracking-tight mb-1.5">
                        No results match your filters
                      </h3>
                      <p className="text-sm text-slate-400 leading-relaxed">
                        We couldn't find any transactions for the selected criteria. Try loosening your filters or clearing the search.
                      </p>
                    </div>

                    {/* Active filter pills */}
                    <div className="flex flex-wrap justify-center gap-1.5 mb-5 max-w-xs">
                      {type !== "All" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-600 border border-sky-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />
                          Type: {type}
                        </span>
                      )}
                      {category.length > 0 && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-violet-50 text-violet-600 border border-violet-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />
                          {category.length} {category.length === 1 ? 'category' : 'categories'}
                        </span>
                      )}
                      {searchQuery && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-600 border border-amber-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                          "{searchQuery}"
                        </span>
                      )}
                      {(dateFrom || dateTo) && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                          Date range
                        </span>
                      )}
                    </div>

                    {/* CTAs */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={clearAllFilters}
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-rose-500 bg-rose-50 border border-rose-100 rounded-xl hover:bg-rose-100 hover:border-rose-200 transition-all duration-200 active:scale-95"
                      >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <line x1="4" y1="4" x2="12" y2="12" />
                          <line x1="12" y1="4" x2="4" y2="12" />
                        </svg>
                        Clear all filters
                      </button>
                      <button
                        onClick={() => setIsModalOpen(true)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-sky-600 bg-sky-50 border border-sky-100 rounded-xl hover:bg-sky-100 hover:border-sky-200 transition-all duration-200 active:scale-95"
                      >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                          <line x1="8" y1="2" x2="8" y2="14" />
                          <line x1="2" y1="8" x2="14" y2="8" />
                        </svg>
                        Add Transaction
                      </button>
                    </div>
                  </div>
                )}

                {/* Grouped list — scrollable container for up to 20 rows */}
                {filteredData.length > 0 && (
                  <div
                    className="overflow-y-auto divide-y divide-slate-50"
                    style={{
                      maxHeight: '68vh',
                      scrollbarWidth: 'thin',
                      scrollbarColor: '#e2e8f0 transparent',
                    }}
                  >
                    <style>{`
                      .txn-scroll::-webkit-scrollbar { width: 5px; }
                      .txn-scroll::-webkit-scrollbar-track { background: transparent; }
                      .txn-scroll::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 99px; }
                      .txn-scroll::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
                    `}</style>
                    <div className="txn-scroll">
                      {Object.keys(groupedTransactions).map((dateLabel) => (
                        <div key={dateLabel}>
                          <div className="px-4 sm:px-6 pt-4 pb-1.5 flex items-center gap-3 sticky top-0 bg-white/95 backdrop-blur-sm z-10 border-b border-slate-50">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{dateLabel}</span>
                            <span className="flex-1 h-px bg-slate-100" />
                            <span className="text-[10px] text-slate-300 font-medium">
                              {groupedTransactions[dateLabel].length} txn{groupedTransactions[dateLabel].length !== 1 ? 's' : ''}
                            </span>
                          </div>
                          <div className="divide-y divide-slate-50">
                            {groupedTransactions[dateLabel].map((transaction) => (
                              <TransactionRow setIsModalOpen={setIsModalOpen} setEditingTransaction={setEditingTransaction} setIsDeleteModalOpen={setIsDeleteModalOpen} setDeletingTransaction={setDeletingTransaction} key={transaction.id} transaction={transaction} />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* ── Empty State: Case 1 — No transactions at all ── */
              <div className="flex flex-col items-center justify-center py-16 px-6 select-none">

                {/* Illustration */}
                <div className="relative mb-7">
                  {/* Ambient glow */}
                  <div
                    className="absolute inset-0 rounded-full blur-2xl opacity-30 scale-150"
                    style={{ background: 'radial-gradient(circle, #38bdf8 0%, #818cf8 60%, transparent 100%)' }}
                  />

                  {/* Card stack art */}
                  <div className="relative w-24 h-24 flex items-center justify-center">
                    {/* Back card */}
                    <div
                      className="absolute w-20 h-14 rounded-2xl rotate-[-8deg] translate-y-1"
                      style={{
                        background: 'linear-gradient(135deg, #e0f2fe 0%, #ede9fe 100%)',
                        border: '1px solid rgba(148,163,184,0.2)',
                        boxShadow: '0 4px 12px rgba(99,102,241,0.12)',
                      }}
                    />
                    {/* Mid card */}
                    <div
                      className="absolute w-20 h-14 rounded-2xl rotate-[3deg]"
                      style={{
                        background: 'linear-gradient(135deg, #bae6fd 0%, #c7d2fe 100%)',
                        border: '1px solid rgba(148,163,184,0.2)',
                        boxShadow: '0 4px 12px rgba(14,165,233,0.15)',
                      }}
                    />
                    {/* Front card */}
                    <div
                      className="absolute w-20 h-14 rounded-2xl flex flex-col justify-between p-2.5"
                      style={{
                        background: 'linear-gradient(135deg, #0EA5E9 0%, #6366F1 100%)',
                        boxShadow: '0 8px 24px rgba(14,165,233,0.35)',
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <div className="w-5 h-3.5 rounded bg-white/25" />
                        <svg className="w-3.5 h-3.5 text-white/70" viewBox="0 0 16 16" fill="currentColor">
                          <circle cx="5.5" cy="8" r="3.5" opacity="0.6" />
                          <circle cx="10.5" cy="8" r="3.5" />
                        </svg>
                      </div>
                      <div className="space-y-1">
                        <div className="w-10 h-1.5 rounded-full bg-white/30" />
                        <div className="w-7 h-1.5 rounded-full bg-white/20" />
                      </div>
                    </div>

                    {/* Plus badge */}
                    <div
                      className="absolute -top-1.5 -right-1.5 w-7 h-7 rounded-full flex items-center justify-center z-10"
                      style={{
                        background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
                        boxShadow: '0 3px 10px rgba(16,185,129,0.4)',
                      }}
                    >
                      <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="8" y1="3" x2="8" y2="13" />
                        <line x1="3" y1="8" x2="13" y2="8" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Text */}
                <div className="text-center mb-6 max-w-xs">
                  <h3 className="text-base font-bold text-slate-800 tracking-tight mb-1.5">
                    No transactions yet
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Your financial story starts here. Add your first income or expense to begin tracking.
                  </p>
                </div>

                {/* CTA */}
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white rounded-xl transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
                  style={{
                    background: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 55%, #6366F1 100%)',
                    boxShadow: '0 4px 16px rgba(14,165,233,0.40)',
                  }}
                >
                  <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                    <line x1="8" y1="2" x2="8" y2="14" />
                    <line x1="2" y1="8" x2="14" y2="8" />
                  </svg>
                  Add your first transaction
                </button>

                {/* Decorative dots */}
                <div className="flex items-center gap-1.5 mt-6">
                  {[1,2,3].map(i => (
                    <span
                      key={i}
                      className="block rounded-full"
                      style={{
                        width: i === 2 ? '20px' : '6px',
                        height: '6px',
                        background: i === 2
                          ? 'linear-gradient(90deg, #0EA5E9, #6366F1)'
                          : '#e2e8f0',
                      }}
                    />
                  ))}
                </div>
              </div>
            )
          )}

          {/* ── Pagination Footer ── */}
          <div
            className="px-4 sm:px-6 py-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white/70 backdrop-blur-sm"
            style={{ boxShadow: 'inset 0 1px 0 rgba(0,0,0,0.03)' }}
          >
            {/* Record count */}
            <p className="text-[11px] text-slate-400 font-medium order-2 sm:order-1">
              Showing
              <span className="mx-1 font-semibold text-slate-600">{filteredData.length}</span>
              of
              <span className="mx-1 font-semibold text-slate-600">{transactionData.length}</span>
              transactions
            </p>

            {/* Pagination controls */}
            <div className="flex items-center gap-1 order-1 sm:order-2">

              {/* Previous */}
              <button
                onClick={() => {
                  if (currentPage > 1) {
                    const params = new URLSearchParams(searchParams);
                    params.set("page", String(currentPage - 1));
                    setSearchParams(params);
                  }
                }}
                id="txn-prev-page"
                disabled={currentPage <= 1}
                aria-label="Previous page"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200
                  bg-white text-slate-400 border-slate-200
                  hover:bg-slate-50 hover:text-slate-600 hover:border-slate-300
                  disabled:opacity-35 disabled:pointer-events-none"
              >
                <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7.5 2.5L4.5 6l3 3.5" />
                </svg>
                Prev
              </button>

              {/* Page number buttons */}
              <div className="flex items-center gap-1 mx-0.5">
                {Array.from({ length: totalPages }).map((_, index) => {
                  const page = index + 1;
                  const isActive = page === currentPage;
                  return (
                    <button
                      key={page}
                      id={`txn-page-${page}`}
                      aria-current={isActive ? "page" : undefined}
                      onClick={() => {
                        const params = new URLSearchParams(searchParams);
                        params.set("page", String(page));
                        setSearchParams(params);
                      }}
                      className={`w-8 h-8 rounded-lg text-xs font-bold border transition-all duration-200 ${
                        isActive
                          ? "bg-sky-500 text-white border-sky-500 shadow-sm hover:bg-sky-600 hover:border-sky-600"
                          : "bg-white text-slate-500 border-slate-200 font-semibold hover:bg-sky-50 hover:text-sky-600 hover:border-sky-200"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                {/* Ellipsis hint — only show when totalPages > visible range */}
                {totalPages > 5 && (
                  <span className="w-8 h-8 flex items-center justify-center text-slate-300 text-xs font-semibold select-none">
                    …
                  </span>
                )}
              </div>

              {/* Next */}
              <button
                onClick={() => {
                  if (currentPage < totalPages) {
                    const params = new URLSearchParams(searchParams);
                    params.set("page", String(currentPage + 1));
                    setSearchParams(params);
                  }
                }}
                id="txn-next-page"
                disabled={currentPage >= totalPages}
                aria-label="Next page"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200
                  bg-white text-slate-500 border-slate-200
                  hover:bg-sky-50 hover:text-sky-600 hover:border-sky-200
                  active:scale-95
                  disabled:opacity-35 disabled:pointer-events-none"
              >
                Next
                <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4.5 2.5L7.5 6l-3 3.5" />
                </svg>
              </button>

            </div>
          </div>
        </div>
      </div>



      <AddTransactionModel
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchTransactions}
        editingTransaction={editingTransaction}
      />
      <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <AlertDialogContent
          className="p-0 gap-0 border-0 overflow-hidden max-w-sm w-full"
          style={{
            background: 'linear-gradient(145deg, rgba(255,255,255,0.98) 0%, rgba(255,241,242,0.95) 100%)',
            boxShadow: '0 24px 64px rgba(244,63,94,0.12), 0 8px 24px rgba(0,0,0,0.08), 0 0 0 1px rgba(244,63,94,0.10)',
            backdropFilter: 'blur(24px)',
            borderRadius: '20px',
          }}
        >
          {/* Header */}
          <div
            className="px-6 pt-6 pb-5 border-b border-rose-50"
            style={{ background: 'linear-gradient(135deg, rgba(244,63,94,0.04) 0%, rgba(251,113,133,0.03) 100%)' }}
          >
            <AlertDialogHeader className="flex-row items-center gap-3 text-left place-items-start">
              {/* Icon medallion */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  background: 'linear-gradient(135deg, #F43F5E 0%, #FB7185 100%)',
                  boxShadow: '0 4px 12px rgba(244,63,94,0.30)',
                }}
              >
                <svg className="w-5 h-5 text-white" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="2 4 14 4" />
                  <path d="M5 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" />
                  <path d="M6 7v5M10 7v5" />
                  <rect x="3" y="4" width="10" height="9" rx="1" />
                </svg>
              </div>
              <div>
                <AlertDialogTitle className="text-base font-bold text-slate-900 tracking-tight leading-tight">
                  Delete Transaction?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-xs text-slate-400 mt-0.5 font-medium">
                  This action is permanent and cannot be undone.
                </AlertDialogDescription>
              </div>
            </AlertDialogHeader>
          </div>

          {/* Body */}
          <div className="px-6 py-5">
            <p className="text-sm text-slate-500 leading-relaxed">
              The transaction <span className="font-semibold text-slate-700">
                "{deletingTransaction?.description || deletingTransaction?.category || 'this entry'}"
              </span> will be permanently removed from your records.
            </p>
          </div>

          {/* Footer */}
          <AlertDialogFooter
            className="px-6 pb-6 pt-0 border-0 bg-transparent flex-row gap-3 sm:justify-end"
            style={{ margin: 0, borderRadius: 0 }}
          >
            <AlertDialogCancel
              className="flex-1 sm:flex-none py-2.5 px-5 text-sm font-semibold text-slate-500 rounded-xl border border-slate-200 bg-white/70 hover:bg-slate-50 hover:text-slate-700 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-slate-300"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="flex-1 sm:flex-none py-2.5 px-5 text-sm font-semibold text-white rounded-xl transition-all duration-200 hover:-translate-y-0.5 active:scale-95 focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2"
              style={{
                background: 'linear-gradient(135deg, #F43F5E 0%, #FB923C 100%)',
                boxShadow: '0 4px 14px rgba(244,63,94,0.35)',
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Transaction;
