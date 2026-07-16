import React from 'react'

const RecentTransactions = ({transactions = []}) => {
  if(!transactions || transactions.length === 0){
    return (
      <div className="mt-7 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex items-center justify-center h-40">
        <p className="text-slate-400 text-sm font-medium">No recent transactions found.</p>
      </div>
    );
  }
  return (
    <div className="mt-7 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
     <div className="px-6 py-4 border-b border-slate-50">
        <h3 className="text-sm font-semibold text-slate-700">Recent Transactions</h3>
      </div>
       {/* List Section */}
      <div className="divide-y divide-slate-50">
        {transactions.map((txn, index) => (
          <div key={txn._id || index} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors duration-200">
            
            {/* Left Side: Icon & Details */}
            <div className="flex items-center gap-4">
              {/* Dynamic Icon Box (Green for Income, Red for Expense) */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-sm ${
                txn.type === 'income' 
                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                  : 'bg-rose-50 text-rose-600 border border-rose-100'
              }`}>
                {txn.type === 'income' ? '↓' : '↑'}
              </div>
              
              {/* Category and Date */}
              <div>
                <p className="text-sm font-semibold text-slate-700 capitalize">
                  {txn.category || 'Transaction'}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {new Date(txn.date || txn.createdAt).toLocaleDateString('en-IN', { 
                    day: 'numeric', 
                    month: 'short', 
                    year: 'numeric' 
                  })}
                </p>
              </div>
            </div>

            {/* Right Side: Amount */}
            <div className={`text-sm font-bold ${
              txn.type === 'income' ? 'text-emerald-600' : 'text-slate-700'
            }`}>
              {txn.type === 'income' ? '+' : '-'}₹{Math.abs(txn.amount).toLocaleString('en-IN')}
            </div>
            
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecentTransactions
