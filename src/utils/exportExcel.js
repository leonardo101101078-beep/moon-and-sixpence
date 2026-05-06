import { getLocalDateString } from './dateHelpers'
import { TAGS } from './tagConfig'

function buildSummaryRows({ selectedMonth, budget, monthExpenses }) {
  const defaultCurrency = 'SGD'
  const defaultCurrencyExpenses = monthExpenses.filter(
    (expense) => expense.currency === defaultCurrency,
  )
  const otherCurrencyExpenses = monthExpenses.filter(
    (expense) => expense.currency !== defaultCurrency,
  )

  const categoryRows = TAGS.map((tag) => {
    const total = defaultCurrencyExpenses
      .filter((expense) => expense.tag === tag)
      .reduce((sum, expense) => sum + expense.amount, 0)

    return {
      分類: tag,
      金額總和: Number(total.toFixed(2)),
      幣值: defaultCurrency,
    }
  }).filter((row) => row.金額總和 > 0)

  const summaryRows = [
    { 項目: '摘要月份', 值: selectedMonth ?? '' },
    { 項目: '當月預算', 值: Number(budget ?? 0), 幣值: defaultCurrency },
    {},
    { 項目: `${defaultCurrency} 類別總和` },
  ]

  if (categoryRows.length === 0) {
    summaryRows.push({ 分類: '無資料', 金額總和: 0, 幣值: defaultCurrency })
  } else {
    summaryRows.push(...categoryRows)
  }

  summaryRows.push({}, { 項目: '其他幣值項目' })

  if (otherCurrencyExpenses.length === 0) {
    summaryRows.push({ 日期: '-', 分類: '無資料', 金額: '', 幣值: '', 備註: '' })
  } else {
    summaryRows.push(
      ...otherCurrencyExpenses
        .sort((left, right) => right.date.localeCompare(left.date))
        .map((expense) => ({
          日期: expense.date,
          分類: expense.tag,
          金額: expense.amount,
          幣值: expense.currency,
          備註: expense.note,
        })),
    )
  }

  return summaryRows
}

export async function exportExcel({
  expenses,
  fixedExpenses,
  selectedMonth,
  budget,
}) {
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

  const monthExpenses = expenses.filter((expense) =>
    selectedMonth ? expense.date.startsWith(selectedMonth) : true,
  )

  const summaryRows = buildSummaryRows({
    selectedMonth,
    budget,
    monthExpenses,
  })

  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.json_to_sheet(summaryRows),
    'Summary',
  )

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
