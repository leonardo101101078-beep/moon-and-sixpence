import ExpenseItem from './ExpenseItem'
import { formatDate, groupByDate } from '../../utils/dateHelpers'

export default function ExpenseListGroup({ expenses, onRemove }) {
  if (expenses.length === 0) {
    return (
      <section className="card p-5">
        <p className="section-title">這個月份還沒有支出</p>
        <p className="mt-2 subtle-text">先從上方表單新增第一筆資料吧。</p>
      </section>
    )
  }

  const groupedExpenses = groupByDate(expenses)

  return (
    <div className="space-y-4">
      {[...groupedExpenses.entries()].map(([date, items]) => (
        <section key={date} className="space-y-3">
          <div className="sticky top-4 z-10 inline-flex rounded-full bg-stone-900 px-3 py-1 text-xs font-medium text-white shadow-lg">
            {formatDate(date)}
          </div>
          <div className="space-y-3">
            {items.map((expense) => (
              <ExpenseItem key={expense.id} expense={expense} onRemove={onRemove} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
