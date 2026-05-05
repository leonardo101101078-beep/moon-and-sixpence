import { useState } from 'react'
import FixedExpenseForm from './FixedExpenseForm'
import FixedExpenseItem from './FixedExpenseItem'

export default function FixedExpenseList({
  fixedExpenses,
  addFixedExpense,
  removeFixedExpense,
}) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <section className="card p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="section-title">固定支出</p>
          <p className="subtle-text">管理每月自動扣款或週期性帳單。</p>
        </div>
        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-stone-900 text-xl font-semibold text-white shadow-[0_14px_28px_rgba(28,25,23,0.18)] transition hover:-translate-y-0.5"
          onClick={() => setIsExpanded((current) => !current)}
          aria-label={isExpanded ? '收合表單' : '展開表單'}
        >
          {isExpanded ? '−' : '+'}
        </button>
      </div>

      {isExpanded ? (
        <div className="mt-4">
          <FixedExpenseForm
            onSubmit={(payload) => {
              addFixedExpense(payload)
              setIsExpanded(false)
            }}
          />
        </div>
      ) : null}

      <div className="mt-4 space-y-3">
        {fixedExpenses.length === 0 ? (
          <div className="rounded-[24px] bg-stone-50 p-5">
            <p className="text-sm font-medium text-stone-700">還沒有固定支出</p>
            <p className="mt-2 text-sm text-stone-500">按右上角的加號，新增每月固定項目。</p>
          </div>
        ) : (
          [...fixedExpenses]
            .sort((left, right) => left.dayOfMonth - right.dayOfMonth)
            .map((expense) => (
              <FixedExpenseItem
                key={expense.id}
                expense={expense}
                onRemove={removeFixedExpense}
              />
            ))
        )}
      </div>
    </section>
  )
}
