import { useState } from 'react'
import BudgetHeader from '../components/expense/BudgetHeader'
import ExpenseForm from '../components/expense/ExpenseForm'
import ExpenseListGroup from '../components/expense/ExpenseListGroup'
import { formatMonthLabel, shiftMonth, toMonthKey } from '../utils/dateHelpers'

function formatAmount(amount) {
  return new Intl.NumberFormat('en-SG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

function MonthSwitcher({ selectedMonth, onChange }) {
  return (
    <div className="flex items-center justify-between px-1">
      <button
        type="button"
        className="flex h-11 w-11 items-center justify-center rounded-full bg-white/80 text-xl text-stone-700 shadow-sm transition hover:bg-white"
        onClick={() => onChange(shiftMonth(selectedMonth, -1))}
        aria-label="前一個月份"
      >
        ‹
      </button>
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.24em] text-stone-400">月份</p>
        <p className="mt-1 text-base font-semibold text-stone-900">
          {formatMonthLabel(selectedMonth)}
        </p>
      </div>
      <button
        type="button"
        className="flex h-11 w-11 items-center justify-center rounded-full bg-white/80 text-xl text-stone-700 shadow-sm transition hover:bg-white"
        onClick={() => onChange(shiftMonth(selectedMonth, 1))}
        aria-label="下一個月份"
      >
        ›
      </button>
    </div>
  )
}

export default function ExpenseList({
  expenses,
  addExpense,
  removeExpense,
  getBudget,
  setBudget,
}) {
  const [selectedMonth, setSelectedMonth] = useState(() => toMonthKey(new Date()))

  const monthExpenses = expenses.filter((expense) => expense.date.startsWith(selectedMonth))
  const monthTotal = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  const budget = getBudget(selectedMonth)

  return (
    <div className="space-y-5">
      <header className="px-1 pt-1">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-orange-600">
          Expense helper
        </p>
        <div className="mt-2 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-[-0.05em] text-stone-950">
              月亮與六便士
            </h1>
            <p className="mt-2 max-w-xs text-sm leading-6 text-stone-500">
              管理好六便士，才能追月亮
            </p>
          </div>
          <div className="rounded-[24px] border border-white/70 bg-white/80 px-4 py-3 text-right shadow-sm">
            <p className="text-xs uppercase tracking-[0.24em] text-stone-400">筆數</p>
            <p className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-stone-900">
              {monthExpenses.length}
            </p>
          </div>
        </div>
      </header>

      <MonthSwitcher selectedMonth={selectedMonth} onChange={setSelectedMonth} />

      <BudgetHeader
        monthLabel={formatMonthLabel(selectedMonth)}
        monthTotal={monthTotal}
        budget={budget}
        onSaveBudget={(amount) => setBudget(selectedMonth, amount)}
      />

      <section className="grid grid-cols-2 gap-3">
        <div className="card p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-stone-400">總額</p>
          <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-stone-950">
            {formatAmount(monthTotal)}
          </p>
        </div>
        <div className="card p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-stone-400">預算</p>
          <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-stone-950">
            {formatAmount(budget)}
          </p>
        </div>
      </section>

      <ExpenseForm onSubmit={addExpense} />

      <section className="space-y-3">
        <div className="px-1">
          <p className="section-title">本月紀錄</p>
          <p className="subtle-text">依日期由近到遠排序。</p>
        </div>
        <ExpenseListGroup expenses={monthExpenses} onRemove={removeExpense} />
      </section>
    </div>
  )
}
