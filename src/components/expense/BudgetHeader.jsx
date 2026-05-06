import { useState } from 'react'

function formatAmount(amount) {
  return new Intl.NumberFormat('en-SG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export default function BudgetHeader({
  monthTotal,
  budget,
  onSaveBudget,
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [draftBudget, setDraftBudget] = useState(String(budget || ''))

  const progressRatio = budget > 0 ? monthTotal / budget : monthTotal > 0 ? 1 : 0
  const progressColor =
    progressRatio > 1 ? 'bg-rose-500' : progressRatio > 0.8 ? 'bg-amber-400' : 'bg-emerald-500'
  const remaining = Math.max(budget - monthTotal, 0)

  function saveBudget() {
    const nextBudget = draftBudget === '' ? 0 : Number(draftBudget)
    onSaveBudget(Number.isFinite(nextBudget) ? nextBudget : 0)
    setIsEditing(false)
  }

  function cancelEdit() {
    setDraftBudget(budget ? String(budget) : '')
    setIsEditing(false)
  }

  return (
    <section className="card overflow-hidden p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-stone-950">
            {monthTotal > 0 ? `-${formatAmount(monthTotal)}` : formatAmount(monthTotal)}
          </h1>
        </div>

        <div className="rounded-[24px] bg-stone-100/90 px-4 py-3 text-right">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone-400">月預算</p>
          {isEditing ? (
            <input
              autoFocus
              className="mt-2 w-28 rounded-xl border border-orange-200 bg-white px-3 py-2 text-right text-sm font-semibold text-stone-900 outline-none ring-2 ring-orange-100"
              type="number"
              min="0"
              step="0.01"
              value={draftBudget}
              onBlur={saveBudget}
              onChange={(event) => setDraftBudget(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  saveBudget()
                }

                if (event.key === 'Escape') {
                  cancelEdit()
                }
              }}
            />
          ) : (
            <button
              type="button"
              className="mt-2 text-lg font-semibold tracking-[-0.02em] text-stone-900"
              onClick={() => {
                setDraftBudget(budget ? String(budget) : '')
                setIsEditing(true)
              }}
            >
              {formatAmount(budget)}
            </button>
          )}
        </div>
      </div>

      <div className="mt-5 space-y-2">
        <div className="flex justify-end text-sm text-stone-500">
          <span>{budget > 0 ? `${Math.round(progressRatio * 100)}%` : '未設定'}</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-stone-100">
          <div
            className={`h-full rounded-full transition-all ${progressColor}`}
            style={{ width: `${Math.min(progressRatio * 100, 100)}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-stone-500">剩餘預算</span>
          <span
            className={progressRatio > 1 ? 'font-medium text-rose-500' : 'font-medium text-stone-700'}
          >
            {budget > 0 ? formatAmount(remaining) : '點擊設定預算'}
          </span>
        </div>
      </div>
    </section>
  )
}
