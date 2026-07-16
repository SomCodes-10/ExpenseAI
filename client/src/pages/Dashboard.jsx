import React, { useState, useEffect } from 'react';
import StatCard from '../components/StatCard';
import apiClient from '@/lib/axios';
import DailySpendingChart from '@/components/DailySpendingChart';
import CategoryDonutChart from '@/components/CategoryDonutChart';
import RecentTransactions from '@/components/RecentTransactions';
import AddTransactionModel from '@/components/AddTransactionModel';


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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #EFF6FF 0%, #F8FAFC 55%, #F0FDFF 100%)' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-2 border-sky-100" />
            <div className="absolute inset-0 rounded-full border-2 border-t-sky-500 animate-spin" />
          </div>
          <p className="text-sm text-slate-400 font-medium tracking-wide">Loading your finances…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-5" style={{ background: 'linear-gradient(135deg, #EFF6FF 0%, #F8FAFC 55%, #F0FDFF 100%)' }}>
        <div className="bg-white border border-rose-100 rounded-2xl shadow-sm px-8 py-8 flex flex-col items-center gap-4 max-w-sm w-full mx-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center">
            <svg className="w-6 h-6 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
          </div>
          <p className="text-slate-700 font-semibold text-sm text-center">{error}</p>
          <button
            onClick={fetchDashboardStats}
            className="w-full px-4 py-2.5 bg-gradient-to-r from-sky-500 to-cyan-500 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2"
          >
            Retry Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ fontFamily: 'Inter, system-ui, sans-serif', background: 'linear-gradient(135deg, #EFF6FF 0%, #F8FAFC 55%, #F0FDFF 100%)' }}>

      {/* Decorative background blobs */}
      <div aria-hidden="true" style={{ position: 'absolute', top: '-180px', left: '-140px', width: '560px', height: '560px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(56,189,248,0.07) 0%, transparent 70%)', filter: 'blur(56px)', pointerEvents: 'none' }} />
      <div aria-hidden="true" style={{ position: 'absolute', bottom: '-200px', right: '-160px', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(103,232,249,0.06) 0%, transparent 70%)', filter: 'blur(64px)', pointerEvents: 'none' }} />
      <div aria-hidden="true" style={{ position: 'absolute', top: '38%', right: '8%', width: '320px', height: '320px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(167,210,255,0.08) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');`}</style>

      <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 sm:py-10 lg:px-10">

        {/* Header */}
        <div className="mb-6 sm:mb-10 flex items-center justify-between gap-4">

          {/* Left: Badge + Title + Subtitle */}
          <div className="flex flex-col gap-1">
            <span
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-600 bg-sky-50 border border-sky-100 rounded-full px-3 py-1 tracking-wide w-fit"
              style={{ boxShadow: '0 1px 3px rgba(14,165,233,0.10)' }}
            >
              <svg className="w-3 h-3" viewBox="0 0 12 12" fill="currentColor">
                <circle cx="6" cy="6" r="4" opacity="0.4" />
                <circle cx="6" cy="6" r="2" />
              </svg>
              SpendWise AI
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-tight">
              Dashboard
            </h1>
            <p className="text-slate-400 text-sm sm:text-[15px]">Your financial snapshot at a glance.</p>
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
