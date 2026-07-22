import React from 'react'

const RecentTransactions = ({transactions = []}) => {
  if(!transactions || transactions.length === 0){
    return (
      <div
        className="bg-white rounded-2xl border border-slate-100 overflow-hidden"
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(14,165,233,0.06)' }}
      >
        {/* Header even on empty state */}
        <div className="px-4 sm:px-6 py-4 border-b border-slate-50">
          <h3 className="text-sm font-semibold text-slate-700">Recent Transactions</h3>
        </div>
        <div className="flex flex-col items-center justify-center gap-3 py-12 px-6">
          <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
            <svg className="w-7 h-7 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="5" width="20" height="14" rx="3" />
              <path d="M2 10h20" />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-slate-500">No transactions yet</p>
            <p className="text-xs text-slate-400 mt-0.5">Add your first transaction to get started</p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div
      className="bg-white rounded-2xl border border-slate-100 overflow-hidden transition-shadow duration-200 hover:shadow-md"
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(14,165,233,0.06)' }}
    >
      <div className="px-4 sm:px-6 py-4 border-b border-slate-50">
        <h3 className="text-sm font-semibold text-slate-700">Recent Transactions</h3>
      </div>
       {/* List Section */}
      <div className="divide-y divide-slate-50">
        {transactions.map((txn, index) => (
          <div key={txn.id || index} className="px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors duration-150">
            
            {/* Left Side: Icon & Details */}
            <div className="flex items-center gap-3 min-w-0">
              {/* Dynamic Icon Box (Green for Income, Red for Expense) */}
              <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-base shrink-0 shadow-sm ${
                txn.type === 'income' 
                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                  : 'bg-rose-50 text-rose-500 border border-rose-100'
              }`}>
                {txn.type === 'income' ? '↓' : '↑'}
              </div>
              
              {/* Category and Date */}
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-700 capitalize truncate">
                  {txn.category || 'Transaction'}
                </p>
                {txn.description && (
                  <p className="text-xs text-slate-400 truncate">{txn.description}</p>
                )}
                <p className="text-xs text-slate-400 mt-0.5">
                  {new Date(txn.date || txn.createdAt).toLocaleDateString('en-IN', { 
                    day: 'numeric', 
                    month: 'short', 
                    year: 'numeric' 
                  })}
                </p>
              </div>
            </div>

            {/* Right Side: Amount + Type badge */}
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span className={`text-sm font-bold ${
                txn.type === 'income' ? 'text-emerald-600' : 'text-rose-500'
              }`}>
                {txn.type === 'income' ? '+' : '-'}₹{Math.abs(txn.amount).toLocaleString('en-IN')}
              </span>
              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md uppercase tracking-wide ${
                txn.type === 'income'
                  ? 'bg-emerald-50 text-emerald-600'
                  : 'bg-rose-50 text-rose-500'
              }`}>
                {txn.type}
              </span>
            </div>
            
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecentTransactions
