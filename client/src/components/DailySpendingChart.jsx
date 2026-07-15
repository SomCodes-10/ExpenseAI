import React from 'react';
import { CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const DailySpendingChart = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center text-gray-400 text-sm font-medium">
        No spending data available for this month.
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
    <div className="w-full h-[300px] mt-4">
      {/* ResponsiveContainer ensures the chart stretches perfectly to fit its parent div */}
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>

          {/* Subtle Grid Lines */}
          <CartesianGrid stroke="#f3f4f6" strokeDasharray="5 5" vertical={false} />

          {/* X-Axis mapping to our formatted displayDate */}
          <XAxis
            dataKey="displayDate"
            stroke="#9ca3af"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />

          {/* Y-Axis mapping to transaction amount totals */}
          <YAxis
            stroke="#9ca3af"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `₹${value}`}
          />

          {/* Interactive Tooltip on Hover */}
          <Tooltip
            formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Spent']}
            contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #f3f4f6', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />

          {/* Main Spending Trend Line */}
          <Line
            type="monotone"
            dataKey="total" // Backend key mapping
            stroke="#4f46e5" // Royal Indigo Color
            strokeWidth={3}
            dot={{ fill: '#4f46e5', r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
          />

        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default DailySpendingChart
