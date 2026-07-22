import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#0EA5E9', '#10B981', '#F59E0B', '#6366F1', '#F43F5E', '#8B5CF6'];

const CategoryDonutChart = ({data = []}) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-10">
        <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
          <svg className="w-7 h-7 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 3a9 9 0 0 1 9 9" strokeDasharray="3 3" />
          </svg>
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-slate-500">No categories yet</p>
          <p className="text-xs text-slate-400 mt-0.5">Add your first expense to see breakdown</p>
        </div>
      </div>
    );
  }
  return (
    <div className='w-full h-[260px] sm:h-[300px]'>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius="38%"
            outerRadius="55%"
            paddingAngle={4}
            dataKey="total"
            nameKey="name"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Amount']}
            contentStyle={{
              backgroundColor: '#fff',
              borderRadius: '12px',
              border: '1px solid #f1f5f9',
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
              fontSize: '13px',
              padding: '8px 12px',
            }}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(value) => (
              <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default CategoryDonutChart
