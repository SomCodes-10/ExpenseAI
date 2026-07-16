import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const CategoryDonutChart = ({data = []}) => {
  if (!data || data.length === 0) {
    return <div className="h-40 flex items-center justify-center text-slate-400 text-sm">No data yet</div>;
  }
  return (
    <div className='w-full h-[250px]'>
      <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="total"
            nameKey="_id"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Amount']} />
          <Legend iconType="circle" />
      </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default CategoryDonutChart
