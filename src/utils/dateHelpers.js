export function getLocalDateString(date = new Date()) {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
  return localDate.toISOString().slice(0, 10)
}

export function toMonthKey(value = new Date()) {
  if (typeof value === 'string') {
    return value.slice(0, 7)
  }

  return getLocalDateString(value).slice(0, 7)
}

export function formatMonthLabel(monthKey) {
  const [year, month] = monthKey.split('-').map(Number)
  return `${year}年${month}月`
}

export function shiftMonth(monthKey, delta) {
  const [year, month] = monthKey.split('-').map(Number)
  const nextDate = new Date(year, month - 1 + delta, 1)
  return toMonthKey(nextDate)
}

export function formatDate(dateString) {
  const date = new Date(`${dateString}T00:00:00`)

  return new Intl.DateTimeFormat('zh-TW', {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  }).format(date)
}

export function groupByDate(expenses) {
  const sortedExpenses = [...expenses].sort((left, right) => {
    if (left.date !== right.date) {
      return right.date.localeCompare(left.date)
    }

    return right.id.localeCompare(left.id)
  })

  return sortedExpenses.reduce((groups, expense) => {
    const sameDateGroup = groups.get(expense.date) ?? []
    sameDateGroup.push(expense)
    groups.set(expense.date, sameDateGroup)
    return groups
  }, new Map())
}
