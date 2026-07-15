import React, { useState, useEffect } from 'react';
import StatCard from '../components/StatCard';
import apiClient from '@/lib/axios';
import DailySpendingChart from '@/components/DailySpendingChart';

const Dashboard = () => {
  // ✅ added dailySpending in initial state array
  const [stats, setStats] = useState({ 
    totalIncome: 0, 
    totalExpenses: 0, 
    balance: 0, 
    dailySpending: [] 
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
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
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center gap-5">
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
    <div className="min-h-screen bg-[#F8FAFC]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');`}</style>

      <div className="max-w-6xl mx-auto px-6 py-10 sm:px-8 lg:px-10">

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-1">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-600 bg-sky-50 border border-sky-100 rounded-full px-3 py-1 tracking-wide">
              <svg className="w-3 h-3" viewBox="0 0 12 12" fill="currentColor">
                <circle cx="6" cy="6" r="4" opacity="0.4" />
                <circle cx="6" cy="6" r="2" />
              </svg>
              SpendWise AI
            </span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mt-3">
            Welcome to Dashboard!
          </h1>
          <p className="text-slate-400 mt-1.5 text-[15px]">Here is your financial summary.</p>
        </div>

        {/* Stat Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <StatCard title="Total Balance" amount={stats.balance} type="balance" />
          <StatCard title="Total Income" amount={stats.totalIncome} type="income" />
          <StatCard title="Total Expense" amount={stats.totalExpenses} type="expense" />
        </div>

        {/* 📈 Spending Trend Chart Area */}
        <div className="mt-7 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {/* Card Header */}
          <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-700">Spending Overview</p>
              <p className="text-xs text-slate-400 mt-0.5">Daily Expense Patterns</p>
            </div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-1.5 animate-pulse">
              ● Live Sync
            </span>
          </div>

          {/* Dynamic Recharts Box */}
          <div className="p-6">
            <DailySpendingChart data={stats.dailySpending || []} />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
