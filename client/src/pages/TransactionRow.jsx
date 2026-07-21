import React from 'react'

/* ── Category → emoji map ── */
const CATEGORY_EMOJI = {
  'Food & Dining': '🍽️',
  'Groceries': '🛒',
  'Transportation': '🚗',
  'Shopping': '🛍️',
  'Bills & Utilities': '💡',
  'Entertainment': '🎬',
  'Healthcare': '🏥',
  'Education': '📚',
  'Travel': '✈️',
  'Investments': '📈',
  'EMI / Loans': '🏦',
  'Salary': '💼',
  'Freelancing': '💻',
  'Bonus': '🎁',
  'Gift': '🎀',
  'Other': '📂',
}

const TransactionRow = ({ transaction }) => {
  const isExpense = transaction.type?.toLowerCase() === 'expense'
  const emoji = CATEGORY_EMOJI[transaction.category] ?? '📂'

  /* colour tokens */
  const iconBg   = isExpense ? '#fff1f2' : '#f0fdf4'
  const iconColor = isExpense ? '#f43f5e' : '#22c55e'
  const iconBorder = isExpense ? '#ffe4e6' : '#bbf7d0'
  const amountColor = isExpense ? '#f43f5e' : '#16a34a'
  const badgeBg  = isExpense ? '#fff1f2' : '#f0fdf4'
  const badgeColor = isExpense ? '#f43f5e' : '#16a34a'

  /* format date */
  const formattedDate = transaction.date
    ? new Date(transaction.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—'

  return (
    <div
      className="px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors duration-150"
    >
      {/* Left: icon + description + meta */}
      <div className="flex items-center gap-3.5 min-w-0">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-base shrink-0 shadow-sm"
          style={{ background: iconBg, color: iconColor, border: `1px solid ${iconBorder}` }}
        >
          {emoji}
        </div>

        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-700 truncate leading-tight">
            {transaction.description || 'Untitled'}
          </p>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <span className="text-[11px] text-slate-400 font-medium">{transaction.category}</span>
            <span className="text-slate-200">·</span>
            <span className="text-[11px] text-slate-400">{formattedDate}</span>
          </div>
        </div>
      </div>

      {/* Right: amount + type badge */}
      <div className="flex flex-col items-end gap-1 shrink-0">
        <span className="text-sm font-bold" style={{ color: amountColor }}>
          {isExpense ? '-' : '+'}₹{Number(transaction.amount).toLocaleString('en-IN')}
        </span>
        <span
          className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md uppercase tracking-wide"
          style={{ background: badgeBg, color: badgeColor }}
        >
          {transaction.type}
        </span>
      </div>
    </div>
  )
}

export default TransactionRow
