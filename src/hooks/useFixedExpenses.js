import { useEffect, useState } from 'react'
import { getItem, setItem } from '../utils/storage'

const STORAGE_KEY = 'fixedExpenses'

export function useFixedExpenses() {
  const [fixedExpenses, setFixedExpenses] = useState(() =>
    getItem(STORAGE_KEY, []),
  )

  useEffect(() => {
    setItem(STORAGE_KEY, fixedExpenses)
  }, [fixedExpenses])

  function addFixedExpense(data) {
    const nextExpense = {
      id: crypto.randomUUID(),
      dayOfMonth: Number(data.dayOfMonth),
      name: data.name.trim(),
      amount: Number(data.amount),
      currency: data.currency,
      note: data.note.trim(),
    }

    setFixedExpenses((currentExpenses) => [...currentExpenses, nextExpense])
  }

  function removeFixedExpense(id) {
    setFixedExpenses((currentExpenses) =>
      currentExpenses.filter((expense) => expense.id !== id),
    )
  }

  return {
    fixedExpenses,
    addFixedExpense,
    removeFixedExpense,
  }
}
