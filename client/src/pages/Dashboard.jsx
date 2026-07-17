import React, { useState, useEffect } from 'react';
import StatCard from '../components/Statcard';
import apiClient from '@/lib/axios';
import DailySpendingChart from '@/components/DailySpendingChart';
import CategoryDonutChart from '@/components/CategoryDonutChart';
import RecentTransactions from '@/components/RecentTransactions';
import AddTransactionModel from '@/components/AddTransactionModel';

/* ─── Skeleton primitives ───────────────────────────────────────────────── */
const Pulse = ({ className }) => (
  <div className={`animate-pulse rounded-xl bg-slate-100 ${className}`} />
);

const StatCardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
    <div className="h-0.5 bg-slate-100" />
    <div className="p-6 flex items-center justify-between gap-4">
      <div className="flex flex-col gap-3 flex-1">
        <Pulse className="h-3 w-24" />
        <Pulse className="h-7 w-32" />
      </div>
      <Pulse className="w-12 h-12 rounded-xl shrink-0" />
    </div>
  </div>
);

const ChartSkeleton = ({ height = 'h-[280px]' }) => (
  <div className={`w-full ${height} flex flex-col gap-3 px-2 pt-2`}>
    <div className="flex items-end gap-2 h-full">
      {[40, 65, 35, 80, 55, 70, 45, 90, 60, 75].map((h, i) => (
        <div key={i} className="flex-1 flex items-end">
          <div
            className="w-full animate-pulse rounded-t-lg bg-slate-100"
            style={{ height: `${h}%`, animationDelay: `${i * 60}ms` }}
          />
        </div>
      ))}
    </div>
    <div className="flex gap-2">
      {[...Array(10)].map((_, i) => (
        <Pulse key={i} className="flex-1 h-2.5" />
      ))}
    </div>
  </div>
);

const DonutSkeleton = () => (
  <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-4">
    <div className="relative w-[140px] h-[140px] shrink-0">
      <div className="absolute inset-0 rounded-full border-[22px] border-slate-100 animate-pulse" />
      <div
        className="absolute inset-0 rounded-full border-[22px] border-transparent animate-pulse"
        style={{ borderTopColor: '#e2e8f0', borderRightColor: '#e2e8f0' }}
      />
    </div>
    <div className="flex flex-col gap-2.5 w-full max-w-[180px]">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <Pulse className="w-3 h-3 rounded-full shrink-0" />
          <Pulse className={`h-3 rounded-full ${i % 2 === 0 ? 'w-28' : 'w-20'}`} />
        </div>
      ))}
    </div>
  </div>
);

const TransactionRowSkeleton = () => (
  <div className="px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
    <div className="flex items-center gap-3">
      <Pulse className="w-10 h-10 rounded-full shrink-0" />
      <div className="flex flex-col gap-2">
        <Pulse className="h-3.5 w-28" />
        <Pulse className="h-2.5 w-20" />
      </div>
    </div>
    <Pulse className="h-4 w-16" />
  </div>
);

/* ─── Full-page skeleton ─────────────────────────────────────────────────── */
const DashboardSkeleton = () => (
  <div
    className="min-h-screen relative overflow-hidden"
    style={{
      fontFamily: 'Inter, system-ui, sans-serif',
      background: 'linear-gradient(135deg, #EFF6FF 0%, #F8FAFC 55%, #F0FDFF 100%)',
    }}
  >
    {/* same blobs as real page */}
    <div aria-hidden="true" style={{ position: 'absolute', top: '-180px', left: '-140px', width: '560px', height: '560px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(56,189,248,0.07) 0%, transparent 70%)', filter: 'blur(56px)', pointerEvents: 'none' }} />
    <div aria-hidden="true" style={{ position: 'absolute', bottom: '-200px', right: '-160px', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(103,232,249,0.06) 0%, transparent 70%)', filter: 'blur(64px)', pointerEvents: 'none' }} />

    <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 sm:py-10 lg:px-10">

      {/* Header skeleton */}
      <div className="mb-6 sm:mb-10 flex items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <Pulse className="h-5 w-24 rounded-full" />
          <Pulse className="h-8 w-36" />
          <Pulse className="h-3.5 w-52" />
        </div>
        <Pulse className="h-10 w-36 rounded-xl shrink-0" />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>

      {/* Donut chart */}
      <div className="mt-5 sm:mt-7 bg-white rounded-2xl border border-slate-100 p-4 sm:p-6" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <Pulse className="h-4 w-36 mb-5" />
        <DonutSkeleton />
      </div>

      {/* Recent transactions */}
      <div className="mt-5 sm:mt-7 bg-white rounded-2xl border border-slate-100 overflow-hidden" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <div className="px-4 sm:px-6 py-4 border-b border-slate-50">
          <Pulse className="h-4 w-40" />
        </div>
        <div className="divide-y divide-slate-50">
          {[...Array(4)].map((_, i) => <TransactionRowSkeleton key={i} />)}
        </div>
      </div>

      {/* Spending chart */}
      <div className="mt-5 sm:mt-7 bg-white rounded-2xl border border-slate-100 overflow-hidden" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-50 flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <Pulse className="h-4 w-36" />
            <Pulse className="h-3 w-28" />
          </div>
          <Pulse className="h-7 w-20 rounded-lg" />
        </div>
        <div className="p-3 sm:p-6">
          <ChartSkeleton />
        </div>
      </div>
    </div>
  </div>
);

/* ─── Full-page error ────────────────────────────────────────────────────── */
const DashboardError = ({ message, onRetry }) => (
  <div
    className="min-h-screen flex flex-col items-center justify-center gap-5 px-4"
    style={{ background: 'linear-gradient(135deg, #EFF6FF 0%, #F8FAFC 55%, #F0FDFF 100%)' }}
  >
    <div
      className="bg-white border border-rose-100 rounded-2xl px-6 sm:px-8 py-8 flex flex-col items-center gap-4 w-full max-w-sm"
      style={{ boxShadow: '0 4px 24px rgba(244,63,94,0.06), 0 1px 3px rgba(0,0,0,0.04)' }}
    >
      <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center border border-rose-100">
        <svg className="w-6 h-6 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        </svg>
      </div>
      <div className="text-center">
        <p className="text-slate-800 font-semibold text-sm">Something went wrong</p>
        <p className="text-slate-400 text-xs mt-1">{message}</p>
      </div>
      <button
        onClick={onRetry}
        className="w-full px-4 py-2.5 text-white text-sm font-semibold rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2"
        style={{ background: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)', boxShadow: '0 4px 12px rgba(14,165,233,0.25)' }}
      >
        Try Again
      </button>
    </div>
  </div>
);

/* ─── Dashboard ──────────────────────────────────────────────────────────── */
const Dashboard = () => {
  //  added dailySpending in initial state array
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    dailySpending: [],
    categoryBreakdown: []
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false)

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get('/transactions/stats');
      if (response.data?.success && response.data?.data) {
        // ✅ Direct backend output array set kar rahe hain
        setStats(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
      setError(error.response?.data?.message || "Failed to load financial stats.");
    } finally {
      setLoading(false);
    }
  };
  const onSubmit = async (data) => {
    try {
      await apiClient.post('/transactions', data);
      reset(); // Form clear kar
      fetchDashboardStats(); // 🚀 Yeh wo magic function hai jo stats refresh karega
    } catch (err) {
      alert("Error adding transaction!");
    }
  };
  useEffect(() => {
    fetchDashboardStats();
  }, []);

  if (loading) return <DashboardSkeleton />;
  if (error) return <DashboardError message={error} onRetry={fetchDashboardStats} />;

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ fontFamily: 'Inter, system-ui, sans-serif', background: 'linear-gradient(135deg, #EFF6FF 0%, #F8FAFC 55%, #F0FDFF 100%)' }}>

      {/* Decorative background blobs */}
      <div aria-hidden="true" style={{ position: 'absolute', top: '-180px', left: '-140px', width: '560px', height: '560px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(56,189,248,0.07) 0%, transparent 70%)', filter: 'blur(56px)', pointerEvents: 'none' }} />
      <div aria-hidden="true" style={{ position: 'absolute', bottom: '-200px', right: '-160px', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(103,232,249,0.06) 0%, transparent 70%)', filter: 'blur(64px)', pointerEvents: 'none' }} />
      <div aria-hidden="true" style={{ position: 'absolute', top: '38%', right: '8%', width: '320px', height: '320px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(167,210,255,0.08) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');`}</style>

      <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 sm:py-10 lg:px-10">

        {/* Header */}
        <div className="mb-6 sm:mb-10 flex items-center justify-between gap-3">

          {/* Left: Badge + Title + Subtitle */}
          <div className="flex flex-col gap-1 min-w-0">
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
              Dashboard
            </h1>
            <p className="text-slate-400 text-xs sm:text-[15px] leading-snug">Your financial snapshot at a glance.</p>
          </div>

          {/* Right: Premium Add Transaction Button */}
          <button onClick={() => { setIsModalOpen(true) }}
            className="group relative inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 shrink-0"
            style={{
              background: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 60%, #6366F1 100%)',
              boxShadow: '0 4px 14px rgba(14,165,233,0.40), 0 1px 3px rgba(0,0,0,0.10)',
            }}
          >
            {/* Shimmer overlay on hover */}
            <span
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%)' }}
            />
            {/* Plus icon */}
            <svg className="w-4 h-4 relative z-10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <line x1="8" y1="2" x2="8" y2="14" />
              <line x1="2" y1="8" x2="14" y2="8" />
            </svg>
            <span className="relative z-10">Add Transaction</span>
          </button>

        </div>

        {/* Stat Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
          <StatCard title="Total Balance" amount={stats.balance} type="balance" />
          <StatCard title="Total Income" amount={stats.totalIncome} type="income" />
          <StatCard title="Total Expense" amount={stats.totalExpenses} type="expense" />
        </div>

        {/* Donut Chart Section */}
        <div className="mt-5 sm:mt-7 bg-white rounded-2xl border border-slate-100 p-4 sm:p-6 transition-shadow duration-200 hover:shadow-md" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(14,165,233,0.06)' }}>
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Category Breakdown</h3>
          {/* Yahan hum backend se aaya hua breakdown array pass kar rahe hain */}
          <CategoryDonutChart data={stats.categoryBreakdown} />
        </div>

        {/* Yahan Donut Chart khatam ho raha hoga */}
        <div className="mt-5 sm:mt-7">
          <RecentTransactions transactions={stats.recentTransactions || []} />
        </div>

        {/* 📈 Spending Trend Chart Area */}
        <div className="mt-5 sm:mt-7 bg-white rounded-2xl border border-slate-100 overflow-hidden transition-shadow duration-200 hover:shadow-md" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(14,165,233,0.06)' }}>
          {/* Card Header */}
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-50 flex items-center justify-between gap-2 flex-wrap">
            <div>
              <p className="text-sm font-semibold text-slate-700">Spending Overview</p>
              <p className="text-xs text-slate-400 mt-0.5">Daily Expense Patterns</p>
            </div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-1.5 animate-pulse">
              ● Live Sync
            </span>
          </div>

          {/* Dynamic Recharts Box */}
          <div className="p-3 sm:p-6">
            <DailySpendingChart data={stats.dailySpending || []} />
          </div>
        </div>

      </div>
      <AddTransactionModel
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchDashboardStats}
      />
    </div>
  );
};

export default Dashboard;
