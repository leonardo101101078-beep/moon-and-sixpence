function formatAmount(amount) {
  return new Intl.NumberFormat('en-SG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export default function FixedExpenseItem({ expense, onRemove }) {
  return (
    <article className="flex items-center gap-4 rounded-[22px] bg-stone-50/90 px-4 py-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-stone-900 text-sm font-semibold text-white">
        {expense.dayOfMonth}日
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-stone-900">{expense.name}</p>
        <p className="mt-1 text-xs text-stone-500">
          {expense.currency}
          {expense.note ? ` · ${expense.note}` : ''}
        </p>
      </div>

      <div className="text-right">
        <p className="text-sm font-semibold text-stone-900">{formatAmount(expense.amount)}</p>
        <button
          type="button"
          className="mt-2 text-xs font-medium text-rose-500 transition hover:text-rose-600"
          onClick={() => {
            if (window.confirm('確定要刪除這筆固定支出嗎？')) {
              onRemove(expense.id)
            }
          }}
        >
          刪除
        </button>
      </div>
    </article>
  )
}
