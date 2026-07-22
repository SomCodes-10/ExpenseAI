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

const TransactionRow = ({ transaction ,setIsModalOpen, setEditingTransaction, setIsDeleteModalOpen, setDeletingTransaction }) => {
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

      {/* Right: edit button + amount + type badge */}
      <div className="flex items-center gap-3 shrink-0">

        {/* Edit button */}
        <button onClick={()=>{
          setIsModalOpen(true)
          setEditingTransaction(transaction)}}
          aria-label="Edit transaction"
          className="
            group inline-flex items-center justify-center
            w-7 h-7 rounded-lg
            text-slate-400
            bg-transparent border border-transparent
            transition-all duration-150
            hover:bg-sky-50 hover:text-sky-500 hover:border-sky-100
            active:scale-95 active:bg-sky-100
            focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-1
          "
        >
          {/* Pencil / edit SVG */}
          <svg
            className="w-3.5 h-3.5 transition-transform duration-150 group-hover:scale-110"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M11.5 2.5a1.414 1.414 0 0 1 2 2L5 13H3v-2L11.5 2.5z" />
            <path d="M9.5 4.5l2 2" />
          </svg>
        </button>

        {/* Delete button */}
        <button
          onClick={() => {
            setIsDeleteModalOpen(true);
            setDeletingTransaction(transaction);
            
          }}
          aria-label="Delete transaction"
          className="
            group inline-flex items-center justify-center
            w-7 h-7 rounded-lg
            text-slate-400
            bg-transparent border border-transparent
            transition-all duration-150
            hover:bg-rose-50 hover:text-rose-500 hover:border-rose-100
            active:scale-95 active:bg-rose-100
            focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 focus-visible:ring-offset-1
          "
        >
          {/* Trash SVG */}
          <svg
            className="w-3.5 h-3.5 transition-transform duration-150 group-hover:scale-110"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="2 4 14 4" />
            <path d="M5 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" />
            <path d="M6 7v5M10 7v5" />
            <rect x="3" y="4" width="10" height="9" rx="1" />
          </svg>
        </button>

        {/* Amount + badge */}
        <div className="flex flex-col items-end gap-1">
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
    </div>
  )
}

export default TransactionRow
