import React from 'react';
import { CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const DailySpendingChart = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-[200px] sm:h-[260px] w-full flex flex-col items-center justify-center gap-3">
        <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
          <svg className="w-7 h-7 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-slate-500">No spending data yet</p>
          <p className="text-xs text-slate-400 mt-0.5">Your daily expense trend will appear here</p>
        </div>
      </div>
    );
  }

  const formattedData = data.map(item => {
    try {
      const dataObj = new Date(item._id);
      const formattedDate = dataObj.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
      return {                          // ✅ Fix 1: was missing — caused every element to be undefined
        ...item,
        displayDate: formattedDate,
      };
    } catch (error) {
      return {
        ...item,
        displayDate: item._id,         // ✅ Fix 2: was `formattedData` (self-reference, always undefined)
      };
    }
  })
  return (
    <div className="w-full h-[200px] sm:h-[300px] mt-2">
      {/* ResponsiveContainer ensures the chart stretches perfectly to fit its parent div */}
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={formattedData} margin={{ top: 8, right: 4, left: -18, bottom: 0 }}>

          {/* Subtle Grid Lines */}
          <CartesianGrid stroke="#f1f5f9" strokeDasharray="5 5" vertical={false} />

          {/* X-Axis mapping to our formatted displayDate */}
          <XAxis
            dataKey="displayDate"
            stroke="#cbd5e1"
            tick={{ fill: '#94a3b8', fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />

          {/* Y-Axis mapping to transaction amount totals */}
          <YAxis
            stroke="#cbd5e1"
            tick={{ fill: '#94a3b8', fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `₹${value}`}
            width={44}
          />

          {/* Interactive Tooltip on Hover */}
          <Tooltip
            formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Spent']}
            contentStyle={{
              backgroundColor: '#fff',
              borderRadius: '12px',
              border: '1px solid #f1f5f9',
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
              fontSize: '13px',
              padding: '8px 12px',
            }}
            cursor={{ stroke: '#e2e8f0', strokeWidth: 1 }}
          />

          {/* Main Spending Trend Line */}
          <Line
            type="monotone"
            dataKey="total" // Backend key mapping
            stroke="#6366F1" // Royal Indigo Color
            strokeWidth={2.5}
            dot={{ fill: '#6366F1', r: 3.5, strokeWidth: 0 }}
            activeDot={{ r: 5.5, fill: '#6366F1', stroke: '#fff', strokeWidth: 2 }}
          />

        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default DailySpendingChart
