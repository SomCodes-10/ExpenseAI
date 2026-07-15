import React from 'react';
import { ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react';

const StatCard = ({ title, amount = 0, type }) => {
  // 1. Semantic Color Mapping Configuration
  const configs = {
    balance: {
      icon: <Wallet className="w-5 h-5" />,
      iconColor: "text-sky-600",
      iconBg: "bg-sky-50",
      iconRing: "ring-sky-100",
      accentBar: "from-sky-400 to-cyan-400",
      amountColor: "text-slate-800",
      badge: "bg-sky-50 text-sky-600 ring-sky-100/80",
    },
    income: {
      icon: <ArrowUpRight className="w-5 h-5" />,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-50",
      iconRing: "ring-emerald-100",
      accentBar: "from-emerald-400 to-teal-400",
      amountColor: "text-emerald-700",
      badge: "bg-emerald-50 text-emerald-600 ring-emerald-100/80",
    },
    expense: {
      icon: <ArrowDownRight className="w-5 h-5" />,
      iconColor: "text-rose-500",
      iconBg: "bg-rose-50",
      iconRing: "ring-rose-100",
      accentBar: "from-rose-400 to-pink-400",
      amountColor: "text-rose-600",
      badge: "bg-rose-50 text-rose-500 ring-rose-100/80",
    },
  };

  // Default configuration agar type specify na ho
  const currentConfig = configs[type] || configs.balance;

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 cursor-default overflow-hidden">
      {/* Top accent gradient bar */}
      <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${currentConfig.accentBar} opacity-70`} />

      <div className="p-6 flex items-center justify-between gap-4">
        {/* Left: label + amount */}
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">
            {title}
          </p>
          <h3 className={`text-2xl font-bold tracking-tight ${currentConfig.amountColor}`}>
            {/* ✅ Indian Currency format integration */}
            {amount < 0
              ? `-₹${Math.abs(amount).toLocaleString("en-IN")}`
              : `₹${amount.toLocaleString("en-IN")}`
            }
          </h3>
        </div>

        {/* Right: icon pill */}
        <div className={`
          flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center
          ${currentConfig.iconBg} ${currentConfig.iconColor}
          ring-1 ${currentConfig.iconRing}
          transition-transform duration-300 group-hover:scale-110
        `}>
          {currentConfig.icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;