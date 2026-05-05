import { getLocalDateString } from './dateHelpers'

export async function exportExcel(expenses, fixedExpenses) {
  const XLSX = await import('xlsx')
  const workbook = XLSX.utils.book_new()

  const expenseRows = [...expenses]
    .sort((left, right) => right.date.localeCompare(left.date))
    .map((expense) => ({
      日期: expense.date,
      金額: expense.amount,
      幣值: expense.currency,
      標籤: expense.tag,
      備註: expense.note,
    }))

  const fixedExpenseRows = fixedExpenses.map((expense) => ({
    扣款日: expense.dayOfMonth,
    項目: expense.name,
    金額: expense.amount,
    幣值: expense.currency,
    備註: expense.note,
  }))

  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.json_to_sheet(expenseRows),
    'Expenses',
  )

  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.json_to_sheet(fixedExpenseRows),
    'Fixed Expenses',
  )

  XLSX.writeFile(workbook, `expenses-${getLocalDateString()}.xlsx`)
}
