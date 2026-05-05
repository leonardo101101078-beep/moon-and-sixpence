import { TAG_COLORS } from '../../utils/tagConfig'

function formatAmount(amount) {
  return new Intl.NumberFormat('en-SG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export default function ExpenseItem({ expense, onRemove }) {
  const tagColor = TAG_COLORS[expense.tag] ?? '#78716c'

  return (
    <article className="flex items-center gap-3 rounded-[22px] bg-stone-50/90 px-4 py-4">
      <span
        className="mt-1 h-3 w-3 shrink-0 rounded-full"
        style={{ backgroundColor: tagColor }}
        aria-hidden="true"
      />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate text-sm font-semibold text-stone-900">
            {expense.note || expense.tag}
          </p>
          <span
            className="rounded-full px-2 py-1 text-xs font-medium"
            style={{ backgroundColor: `${tagColor}20`, color: tagColor }}
          >
            {expense.tag}
          </span>
        </div>
        <p className="mt-1 text-xs text-stone-500">{expense.currency}</p>
      </div>

      <div className="text-right">
        <p className="text-sm font-semibold text-stone-900">{formatAmount(expense.amount)}</p>
        <button
          type="button"
          className="mt-2 text-xs font-medium text-rose-500 transition hover:text-rose-600"
          onClick={() => {
            if (window.confirm('確定要刪除這筆支出嗎？')) {
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
