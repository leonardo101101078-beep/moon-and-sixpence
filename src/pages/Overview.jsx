import { useState } from 'react'
import DonutChart from '../components/overview/DonutChart'
import ExportButton from '../components/overview/ExportButton'
import FixedExpenseList from '../components/overview/FixedExpenseList'
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
        <p className="text-xs uppercase tracking-[0.24em] text-stone-400">總覽月份</p>
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

export default function Overview({
  expenses,
  fixedExpenses,
  addFixedExpense,
  removeFixedExpense,
}) {
  const [selectedMonth, setSelectedMonth] = useState(() => toMonthKey(new Date()))

  const monthExpenses = expenses.filter((expense) => expense.date.startsWith(selectedMonth))
  const monthTotal = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  const fixedTotal = fixedExpenses.reduce((sum, expense) => sum + expense.amount, 0)

  return (
    <div className="space-y-5">
      <header className="px-1 pt-1">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-orange-600">
          Overview
        </p>
        <div className="mt-2">
          <div className="max-w-xs">
            <h1 className="text-3xl font-semibold tracking-[-0.05em] text-stone-950">
              總覽
            </h1>
          </div>
        </div>
      </header>

      <MonthSwitcher selectedMonth={selectedMonth} onChange={setSelectedMonth} />

      <section className="grid grid-cols-2 gap-3">
        <div className="card p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-stone-400">本月總支出</p>
          <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-stone-950">
            {formatAmount(monthTotal)}
          </p>
        </div>
        <div className="card p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-stone-400">固定支出</p>
          <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-stone-950">
            {formatAmount(fixedTotal)}
          </p>
        </div>
      </section>

      <DonutChart
        expenses={monthExpenses}
        monthLabel={formatMonthLabel(selectedMonth)}
      />

      <FixedExpenseList
        fixedExpenses={fixedExpenses}
        addFixedExpense={addFixedExpense}
        removeFixedExpense={removeFixedExpense}
      />

      <section className="card p-5">
        <p className="section-title">資料匯出</p>
        <p className="mt-2 subtle-text">將所有支出與固定支出匯出為 Excel 活頁簿。</p>
        <div className="mt-4">
          <ExportButton expenses={expenses} fixedExpenses={fixedExpenses} />
        </div>
      </section>
    </div>
  )
}
